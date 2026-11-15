/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Master Game Controller, State Machine, Input Engine & Physics Loop
 */

class NASAExplorerGame {
    constructor() {
        this.state = 'MENU'; // MENU, MISSION_SELECT, CUSTOMIZER, TEAM_MODE, TUTORIAL, LEADERBOARD, PLAYING, REPORT
        this.engine3d = null;
        this.celestial = null;
        this.spacecraft = null;
        this.customizer = null;
        this.missionManager = null;
        this.teamManager = null;
        this.eventManager = null;
        this.scoring = null;
        this.hud = null;

        this.isPlaying = false;
        this.isPaused = false;
        this.difficulty = 'intermediate'; // beginner, intermediate, advanced

        // Flight Resources State
        this.resources = {
            fuel: 850,
            maxFuel: 850,
            battery: 100, // %
            netPower: 450, // Watts
            hullIntegrity: 100, // %
            commsSignal: 98, // dB
            mass: 2450, // kg
            budget: 350 // $M
        };

        // Input State
        this.keys = {
            thrustForward: false,
            thrustBackward: false,
            strafeLeft: false,
            strafeRight: false,
            strafeUp: false,
            strafeDown: false,
            pitchUp: false,
            pitchDown: false,
            yawLeft: false,
            yawRight: false,
            rollLeft: false,
            rollRight: false,
            brake: false
        };

        // Mobile touch state
        this.touchJoystick = { active: false, startX: 0, startY: 0, deltaX: 0, deltaY: 0 };
    }

    init() {
        console.log("Initializing SPACE MISSION 3D – NASA EXPLORER...");

        // 1. Initialize Subsystems
        this.engine3d = new SpaceEngine('canvas-container');
        this.celestial = new CelestialManager(this.engine3d.scene);
        this.spacecraft = new Spacecraft(this.engine3d.scene);
        this.customizer = new SpacecraftCustomizer(this);
        this.missionManager = new MissionManager(this);
        this.teamManager = new TeamManager(this);
        this.eventManager = new EventManager(this);
        this.scoring = new ScoringSystem();
        this.hud = new HUDController(this);

        // 2. Build initial default spacecraft
        this.spacecraft.build(this.customizer.selections);

        // 3. Setup Default Menu Background Environment (Earth in distant LEO)
        this.setupMenuEnvironment();

        // 4. Bind Input Events
        this.bindKeyboardInputs();
        this.bindTouchControls();
        this.bindUIButtons();

        // 5. Populate Initial UI Panels
        this.renderCustomizerUI();
        this.renderTeamModeUI();
        this.renderLeaderboardUI();

        // 6. Start Main Animation Loop
        this.lastFrameTime = performance.now();
        requestAnimationFrame((t) => this.gameLoop(t));

        console.log("Game successfully initialized and running.");
    }

    setupMenuEnvironment() {
        this.celestial.clearEnvironment();
        this.celestial.createEarth(180, new THREE.Vector3(0, -60, -380));
        this.celestial.createMoon(45, new THREE.Vector3(750, 90, -900));
        this.spacecraft.group.position.set(0, 5, 0);
        this.spacecraft.group.rotation.set(0, Math.PI / 4, 0);
        this.engine3d.setCameraMode('cinematic');
    }

    // Setup active 3D world for chosen mission
    setupMissionWorld(missionKey) {
        this.celestial.clearEnvironment();
        const mission = this.missionManager.startMission(missionKey);
        if (!mission) return;

        const sp = mission.spawn;
        // 1. Celestial Bodies
        if (sp.earth) this.celestial.createEarth(140, sp.earth);
        if (sp.moon) this.celestial.createMoon(40, sp.moon);
        if (sp.mars) this.celestial.createMars(75, sp.mars);
        if (sp.hasISS) this.celestial.createSpaceStation(new THREE.Vector3(0, 160, -80));

        // 2. Asteroids
        if (sp.asteroidCount && sp.asteroidCount > 0) {
            const center = missionKey === 'asteroid' ? new THREE.Vector3(800, 0, -800) : new THREE.Vector3(400, 20, -500);
            this.celestial.createAsteroidField(sp.asteroidCount, center, missionKey === 'asteroid' ? 650 : 350);
        }

        // 3. Primary Target & Science Markers
        if (missionKey === 'moon') {
            this.celestial.createScienceMarker(new THREE.Vector3(730, 25, -390), 'Shackleton Crater Ice Deposit', 600, 'ice');
        } else if (missionKey === 'mars') {
            this.celestial.createScienceMarker(new THREE.Vector3(1580, 105, -1180), 'Jezero Delta Organic Signature', 700, 'ice');
        } else if (missionKey === 'earth') {
            this.celestial.createScienceMarker(new THREE.Vector3(0, 165, -75), 'ISS Docking Corridors', 400, 'metal');
            this.celestial.createScienceMarker(new THREE.Vector3(120, 150, 100), 'Super-Typhoon Cyclone Vortex', 500, 'ice');
        } else if (missionKey === 'asteroid') {
            this.celestial.createScienceMarker(new THREE.Vector3(800, 0, -800), '16 Psyche Platinum-Iron Core', 800, 'metal');
        }

        // 4. Configure Spacecraft Initial State
        this.spacecraft.reset(sp.ship);
        const lookTarget = (sp.shipLookAt instanceof THREE.Vector3) 
            ? sp.shipLookAt 
            : new THREE.Vector3(sp.shipLookAt.x, sp.shipLookAt.y, sp.shipLookAt.z);
        this.spacecraft.group.lookAt(lookTarget);

        // 5. Initialize Mission Resources
        const stats = this.customizer.calculateStats();
        this.resources.fuel = stats.fuelMass;
        this.resources.maxFuel = stats.fuelMass;
        this.resources.battery = 100;
        this.resources.netPower = stats.netPower;
        this.resources.hullIntegrity = 100;
        this.resources.commsSignal = 98;
        this.resources.mass = stats.wetMass;
        this.resources.budget = mission.budget;

        // Apply Difficulty Adjustments
        if (this.difficulty === 'beginner') {
            this.resources.fuel *= 1.5;
            this.resources.maxFuel *= 1.5;
            this.spacecraft.turnRate = 1.8;
        } else if (this.difficulty === 'advanced') {
            this.spacecraft.turnRate = 1.1;
        }

        // Camera to Chase Mode
        this.engine3d.setCameraMode('chase');

        // Play intro NASA Quindar tone
        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.playQuindar(true);
        }

        this.isPlaying = true;
        this.isPaused = false;
        this.state = 'PLAYING';
        this.hud.show();
        this.switchUIPanel('flight-hud');

        this.hud.showNotification(`MISSION ACTIVE: ${mission.title}`, 'info');
    }

    // Main Simulation & Render Loop
    gameLoop(now) {
        requestAnimationFrame((t) => this.gameLoop(t));

        const delta = Math.min(0.05, (now - this.lastFrameTime) / 1000);
        this.lastFrameTime = now;

        // 1. Update Celestial Rotations & Markers
        this.celestial.update(delta, now * 0.001);

        // 2. Flight Simulation Tick (When playing)
        if (this.isPlaying && !this.isPaused) {
            this.processFlightPhysics(delta, now);
            this.processResourceDrains(delta);
            this.processCollisionDetection();
            this.eventManager.update(now);
            this.teamManager.update(delta);
            this.hud.update(delta);
        }

        // 3. Update Camera and Render 3D Scene
        this.engine3d.updateCamera(this.spacecraft, delta);
        this.engine3d.render();
    }

    // 6DOF Physics & Input Integration
    processFlightPhysics(delta, now) {
        // Merge keyboard controls with touch joystick
        const controls = Object.assign({}, this.keys);

        if (this.touchJoystick.active) {
            if (this.touchJoystick.deltaY < -15) controls.pitchUp = true;
            if (this.touchJoystick.deltaY > 15) controls.pitchDown = true;
            if (this.touchJoystick.deltaX < -15) controls.yawLeft = true;
            if (this.touchJoystick.deltaX > 15) controls.yawRight = true;
        }

        this.spacecraft.update(delta, controls);

        // Audio propulsion update
        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.updateEngineSound(this.spacecraft.throttle);
        }

        // Objective Progress tracking
        const targetPos = this.getCurrentObjectivePosition();
        const dist = targetPos ? this.spacecraft.position.distanceTo(targetPos) : 9999;
        this.missionManager.update(
            this.spacecraft.position,
            this.spacecraft.velocity.length(),
            dist,
            false,
            delta
        );
    }

    // Dynamic Resource Consumption
    processResourceDrains(delta) {
        // Fuel consumption: throttle * rate
        if (this.spacecraft.throttle > 0.01) {
            const burnRate = 4.2; // kg/s at 100% throttle
            this.resources.fuel = Math.max(0, this.resources.fuel - (this.spacecraft.throttle * burnRate * delta));
            if (this.resources.fuel <= 0) {
                this.spacecraft.throttle = 0;
                this.hud.showNotification('WARNING: PROPELLANT DEPLETED! Engine shutdown.', 'danger');
            }
        }

        // Battery Power: generation vs load
        if (this.resources.netPower < 0) {
            // Power deficit: drain battery
            const drainRate = Math.abs(this.resources.netPower) * 0.0003;
            this.resources.battery = Math.max(0, this.resources.battery - drainRate * delta);
            if (this.resources.battery <= 0) {
                this.hud.showNotification('CRITICAL: BATTERY EXHAUSTION! Systems shutting down.', 'danger');
            }
        } else {
            // Power surplus: slowly recharge battery up to 100%
            this.resources.battery = Math.min(100, this.resources.battery + delta * 0.4);
        }

        // Deep Space Network comms latency/flicker
        const earthDist = this.spacecraft.position.distanceTo(new THREE.Vector3(0, 0, 0));
        this.resources.commsSignal = Math.max(45, Math.min(99, 100 - (earthDist * 0.025)));
    }

    // Collision Detection with Celestial Bodies and Asteroids
    processCollisionDetection() {
        const shipPos = this.spacecraft.position;
        const shipRadius = 3.5;

        // Check Asteroid Collisions
        for (let i = 0; i < this.celestial.asteroids.length; i++) {
            const ast = this.celestial.asteroids[i];
            const dist = shipPos.distanceTo(ast.position);
            const hitDist = ast.userData.radius + shipRadius;

            if (dist < hitDist) {
                // Collision occurred!
                const diff = shipPos.clone().sub(ast.position);
                if (diff.lengthSq() > 0.001) {
                    diff.normalize().multiplyScalar(1.2);
                    this.spacecraft.velocity.add(diff);
                }
                this.resources.hullIntegrity = Math.max(0, this.resources.hullIntegrity - 18);

                if (window.NASA_AUDIO) {
                    window.NASA_AUDIO.playImpact();
                    window.NASA_AUDIO.playAlarm();
                }

                this.hud.showNotification('WARNING: ASTEROID COLLISION! Hull Integrity Compromised.', 'danger');

                if (this.resources.hullIntegrity <= 0) {
                    this.finishMission(false);
                }
                break;
            }
        }
    }

    // Get 3D Vector coordinates for current mission target
    getCurrentObjectivePosition() {
        if (!this.missionManager || !this.missionManager.missionData) return null;
        const targetBody = this.missionManager.missionData.targetBody;

        if (targetBody === 'Moon' && this.celestial.bodies.moon) {
            return this.celestial.bodies.moon.group.position;
        } else if (targetBody === 'Mars' && this.celestial.bodies.mars) {
            return this.celestial.bodies.mars.group.position;
        } else if (targetBody === 'Earth') {
            if (this.celestial.bodies.iss) return this.celestial.bodies.iss.group.position;
            if (this.celestial.bodies.earth) return this.celestial.bodies.earth.group.position;
        } else if (targetBody === 'Asteroid Belt') {
            return new THREE.Vector3(800, 0, -800);
        }
        return null;
    }

    getCurrentObjectiveName() {
        if (!this.missionManager || !this.missionManager.missionData) return 'NAV TARGET';
        return this.missionManager.missionData.targetBody.toUpperCase();
    }

    // Interactive Action Handlers
    triggerPulseScan() {
        if (window.NASA_AUDIO) window.NASA_AUDIO.playScannerPulse();
        const success = this.missionManager.triggerScanAction();
        if (success) {
            this.hud.showNotification('SCIENCE SCAN COMPLETE: Data packets acquired!', 'success');
        } else {
            this.hud.showNotification('SCANNER: No high-priority science anomalies in beam range.', 'info');
        }
    }

    triggerCollectSample() {
        if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
        const success = this.missionManager.triggerScanAction();
        if (success) {
            this.hud.showNotification('SAMPLE RETRIEVAL: Canister sealed and preserved!', 'success');
        } else {
            this.hud.showNotification('SAMPLER: Target regolith proximity not achieved (< 15 km required).', 'warning');
        }
    }

    triggerDeployProbe() {
        if (window.NASA_AUDIO) window.NASA_AUDIO.playSuccess();
        const success = this.missionManager.triggerDeployAction();
        if (success) {
            this.hud.showNotification('PROBE DEPLOYED: Surface telemetry transmission active!', 'success');
        } else {
            this.hud.showNotification('DEPLOYMENT: Verify orbit coordinates before releasing probe.', 'warning');
        }
    }

    triggerTransmitData() {
        if (window.NASA_AUDIO) window.NASA_AUDIO.playQuindar(false);
        const success = this.missionManager.triggerTransmitAction();
        if (success) {
            this.hud.showNotification('TELEMETRY DOWNLINK: DSN Houston confirmed data reception!', 'success');
        } else {
            this.hud.showNotification('COMMUNICATIONS: High-Gain carrier lock currently stable.', 'info');
        }
    }

    toggleFlightAssist() {
        this.spacecraft.flightAssist = !this.spacecraft.flightAssist;
        if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
        this.hud.showNotification(
            `FLIGHT ASSIST (SAS): ${this.spacecraft.flightAssist ? 'ENABLED (Stabilized)' : 'DISABLED (Newtonian Drift)'}`,
            'info'
        );
    }

    cycleCamera() {
        const modes = ['chase', 'cockpit', 'cinematic'];
        const nextIdx = (modes.indexOf(this.engine3d.cameraMode) + 1) % modes.length;
        this.engine3d.setCameraMode(modes[nextIdx]);
        if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
    }

    // Mission Completion & Final Debriefing Report
    finishMission(isSuccess = true) {
        this.isPlaying = false;
        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.updateEngineSound(0);
            if (isSuccess) window.NASA_AUDIO.playSuccess();
            else window.NASA_AUDIO.playAlarm();
        }

        const report = this.scoring.calculateMissionReport(this);
        this.renderMissionReportUI(report, isSuccess);
        this.switchUIPanel('panel-report');
        this.hud.hide();
    }

    // Input Binding (Keyboard)
    bindKeyboardInputs() {
        window.addEventListener('keydown', (e) => {
            if (window.NASA_AUDIO) window.NASA_AUDIO.resume();

            const k = e.key.toLowerCase();
            if (k === 'w' || e.key === 'ArrowUp') this.keys.thrustForward = true;
            if (k === 's' || e.key === 'ArrowDown') this.keys.thrustBackward = true;
            if (k === 'a' || e.key === 'ArrowLeft') this.keys.yawLeft = true;
            if (k === 'd' || e.key === 'ArrowRight') this.keys.yawRight = true;
            if (k === 'q') this.keys.rollLeft = true;
            if (k === 'e') this.keys.rollRight = true;
            if (k === 'r') this.keys.strafeUp = true;
            if (k === 'f') this.keys.strafeDown = true;
            if (k === 'z') this.keys.strafeLeft = true;
            if (k === 'x') this.keys.strafeRight = true;
            if (e.key === ' ') this.keys.brake = true;

            // Shortcut keys
            if (k === 'c') this.cycleCamera();
            if (k === 't') this.toggleFlightAssist();
            if (k === '1') this.triggerPulseScan();
            if (k === '2') this.triggerCollectSample();
            if (k === '3') this.triggerTransmitData();
            if (k === 'p' || e.key === 'Escape') this.togglePause();
        });

        window.addEventListener('keyup', (e) => {
            const k = e.key.toLowerCase();
            if (k === 'w' || e.key === 'ArrowUp') this.keys.thrustForward = false;
            if (k === 's' || e.key === 'ArrowDown') this.keys.thrustBackward = false;
            if (k === 'a' || e.key === 'ArrowLeft') this.keys.yawLeft = false;
            if (k === 'd' || e.key === 'ArrowRight') this.keys.yawRight = false;
            if (k === 'q') this.keys.rollLeft = false;
            if (k === 'e') this.keys.rollRight = false;
            if (k === 'r') this.keys.strafeUp = false;
            if (k === 'f') this.keys.strafeDown = false;
            if (k === 'z') this.keys.strafeLeft = false;
            if (k === 'x') this.keys.strafeRight = false;
            if (e.key === ' ') this.keys.brake = false;
        });
    }

    // Touch Controls for Mobile Devices
    bindTouchControls() {
        const joyArea = document.getElementById('touch-joystick-area');
        const joyKnob = document.getElementById('touch-joystick-knob');
        if (!joyArea || !joyKnob) return;

        joyArea.addEventListener('touchstart', (e) => {
            if (window.NASA_AUDIO) window.NASA_AUDIO.resume();
            const touch = e.touches[0];
            this.touchJoystick.active = true;
            this.touchJoystick.startX = touch.clientX;
            this.touchJoystick.startY = touch.clientY;
        }, { passive: true });

        joyArea.addEventListener('touchmove', (e) => {
            if (!this.touchJoystick.active) return;
            const touch = e.touches[0];
            const dx = touch.clientX - this.touchJoystick.startX;
            const dy = touch.clientY - this.touchJoystick.startY;
            const dist = Math.min(45, Math.hypot(dx, dy));
            const angle = Math.atan2(dy, dx);

            this.touchJoystick.deltaX = Math.cos(angle) * dist;
            this.touchJoystick.deltaY = Math.sin(angle) * dist;

            joyKnob.style.transform = `translate(${this.touchJoystick.deltaX}px, ${this.touchJoystick.deltaY}px)`;
        }, { passive: true });

        const resetJoy = () => {
            this.touchJoystick.active = false;
            this.touchJoystick.deltaX = 0;
            this.touchJoystick.deltaY = 0;
            joyKnob.style.transform = 'translate(0px, 0px)';
        };

        joyArea.addEventListener('touchend', resetJoy);
        joyArea.addEventListener('touchcancel', resetJoy);
    }

    togglePause() {
        if (!this.isPlaying) return;
        this.isPaused = !this.isPaused;
        const pauseOverlay = document.getElementById('pause-overlay');
        if (pauseOverlay) {
            pauseOverlay.classList.toggle('hidden', !this.isPaused);
        }
    }

    // Switch visible main menu / dialog panel
    switchUIPanel(panelId) {
        const panels = document.querySelectorAll('.ui-panel, .nasa-hud');
        panels.forEach(p => p.classList.add('hidden'));

        const target = document.getElementById(panelId);
        if (target) {
            target.classList.remove('hidden');
        }
        if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
    }

    // UI Buttons Binding
    bindUIButtons() {
        // Main Navigation
        document.querySelectorAll('[data-goto]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = btn.getAttribute('data-goto');
                this.switchUIPanel(target);
            });
        });

        // Audio Mute Toggle
        const audioBtn = document.getElementById('btn-audio-toggle');
        if (audioBtn) {
            audioBtn.addEventListener('click', () => {
                if (window.NASA_AUDIO) {
                    const muted = window.NASA_AUDIO.toggleMute();
                    audioBtn.innerHTML = muted ? '&#128263; AUDIO: OFF' : '&#128266; AUDIO: ON';
                }
            });
        }

        // Fullscreen Toggle
        const fsBtn = document.getElementById('btn-fullscreen-toggle');
        if (fsBtn) {
            fsBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
        }

        // Difficulty Selector
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.difficulty = btn.getAttribute('data-diff');
                if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
            });
        });
    }

    // Populate Spacecraft Design Configurator UI
    renderCustomizerUI() {
        const cats = [
            { key: 'structure', title: 'Structure' },
            { key: 'solar', title: 'Solar Panels' },
            { key: 'battery', title: 'Batteries' },
            { key: 'antenna', title: 'Antenna' },
            { key: 'computer', title: 'Onboard Computer' },
            { key: 'propulsion', title: 'Propulsion' },
            { key: 'instrument', title: 'Science Instrument' },
            { key: 'sensor', title: 'Cameras & Sensors' }
        ];

        const container = document.getElementById('customizer-options-container');
        if (!container) return;

        let html = '';
        cats.forEach(c => {
            const partGroup = SPACECRAFT_PARTS[c.key];
            html += `
                <div class="customizer-group">
                    <h3>${partGroup.title}</h3>
                    <div class="customizer-cards">
            `;
            Object.keys(partGroup.options).forEach(optKey => {
                const opt = partGroup.options[optKey];
                const isSelected = this.customizer.selections[c.key] === optKey;
                html += `
                    <div class="custom-card ${isSelected ? 'selected' : ''}" 
                         onclick="window.NASA_GAME.selectPart('${c.key}', '${optKey}')">
                        <div class="card-head">
                            <span class="card-title">${opt.name}</span>
                            <span class="card-cost">$${opt.cost}M</span>
                        </div>
                        <p class="card-desc">${opt.desc}</p>
                        <div class="card-badges">
                            <span class="badge">Mass: ${opt.mass} kg</span>
                            ${opt.power !== 0 ? `<span class="badge ${opt.power > 0 ? 'badge-green' : 'badge-amber'}">${opt.power > 0 ? '+' : ''}${opt.power}W</span>` : ''}
                            ${opt.isp ? `<span class="badge badge-cyan">Isp: ${opt.isp}s</span>` : ''}
                            ${opt.sciencePoints ? `<span class="badge badge-purple">+${opt.sciencePoints} Sci</span>` : ''}
                        </div>
                    </div>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });

        // Add Launch Vehicles & Orbits
        html += `
            <div class="customizer-group">
                <h3>Launch Vehicle Selection</h3>
                <div class="customizer-cards">
        `;
        Object.keys(LAUNCH_VEHICLES).forEach(rk => {
            const rocket = LAUNCH_VEHICLES[rk];
            const isSelected = this.customizer.selections.rocket === rk;
            html += `
                <div class="custom-card ${isSelected ? 'selected' : ''}"
                     onclick="window.NASA_GAME.selectPart('rocket', '${rk}')">
                    <div class="card-head">
                        <span class="card-title">${rocket.name}</span>
                        <span class="card-cost">$${rocket.cost}M</span>
                    </div>
                    <p class="card-desc">${rocket.desc}</p>
                    <div class="card-badges">
                        <span class="badge badge-cyan">Max Payload: ${rocket.payloadCapacity.toLocaleString()} kg</span>
                        <span class="badge badge-green">Reliability: ${rocket.reliability}%</span>
                    </div>
                </div>
            `;
        });
        html += `
                </div>
            </div>
            <div class="customizer-group">
                <h3>Target Orbit Regime</h3>
                <div class="customizer-cards">
        `;
        Object.keys(ORBITS).forEach(ok => {
            const orbit = ORBITS[ok];
            const isSelected = this.customizer.selections.orbit === ok;
            html += `
                <div class="custom-card ${isSelected ? 'selected' : ''}"
                     onclick="window.NASA_GAME.selectPart('orbit', '${ok}')">
                    <div class="card-head">
                        <span class="card-title">${orbit.name}</span>
                        <span class="badge badge-cyan">${orbit.altitudeKm.toLocaleString()} km</span>
                    </div>
                    <p class="card-desc">${orbit.desc}</p>
                    <div class="card-badges">
                        <span class="badge">&#916;V Req: ${orbit.deltaVReq.toLocaleString()} m/s</span>
                    </div>
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;

        container.innerHTML = html;
        this.updateCustomizerStatsUI();
    }

    selectPart(category, key) {
        if (window.NASA_AUDIO) window.NASA_AUDIO.playClick();
        this.customizer.setSelection(category, key);
        this.renderCustomizerUI();
    }

    updateCustomizerStatsUI() {
        const stats = this.customizer.calculateStats();
        const statBox = document.getElementById('customizer-stats-summary');
        if (!statBox) return;

        statBox.innerHTML = `
            <div class="stat-col">
                <span class="stat-label">TOTAL WET MASS</span>
                <span class="stat-val ${stats.isOverweight ? 'val-danger' : 'val-nominal'}">${stats.wetMass.toLocaleString()} kg</span>
                <span class="stat-sub">Dry: ${stats.dryMass} kg | Fuel: ${stats.fuelMass} kg</span>
            </div>
            <div class="stat-col">
                <span class="stat-label">POWER BALANCE</span>
                <span class="stat-val ${stats.isPowerDeficit ? 'val-danger' : 'val-nominal'}">${stats.netPower > 0 ? '+' : ''}${stats.netPower} W</span>
                <span class="stat-sub">Gen: ${stats.totalPowerGen}W | Drain: ${stats.totalPowerDrain}W</span>
            </div>
            <div class="stat-col">
                <span class="stat-label">MISSION COST</span>
                <span class="stat-val">$${stats.totalMissionCost}M</span>
                <span class="stat-sub">Craft: $${stats.totalCraftCost}M | Rocket: $${stats.rocketCost}M</span>
            </div>
            <div class="stat-col">
                <span class="stat-label">DELTA-V ESTIMATE</span>
                <span class="stat-val val-cyan">${stats.deltaV.toLocaleString()} m/s</span>
                <span class="stat-sub">Specific Impulse: ${stats.isp}s</span>
            </div>
            <div class="stat-col">
                <span class="stat-label">PAYLOAD MARGIN</span>
                <span class="stat-val ${stats.isOverweight ? 'val-danger' : 'val-nominal'}">${stats.payloadMarginPct}%</span>
                <span class="stat-sub">${stats.payloadMarginKg.toLocaleString()} kg remaining</span>
            </div>
        `;

        const warningBanner = document.getElementById('customizer-warning-banner');
        if (warningBanner) {
            if (stats.isOverweight) {
                warningBanner.className = 'warning-banner alert-danger';
                warningBanner.innerText = `CRITICAL WARNING: Spacecraft Mass (${stats.wetMass} kg) exceeds ${stats.rocket.name} capacity (${stats.rocket.payloadCapacity} kg)! Launch will fail. Select a heavier rocket or reduce spacecraft mass.`;
                warningBanner.classList.remove('hidden');
            } else if (stats.isPowerDeficit) {
                warningBanner.className = 'warning-banner alert-warning';
                warningBanner.innerText = `POWER DEFICIT: Continuous power draw exceeds generation by ${Math.abs(stats.netPower)}W. Add more solar panels or upgrade to an RTG.`;
                warningBanner.classList.remove('hidden');
            } else {
                warningBanner.classList.add('hidden');
            }
        }
    }

    // Populate Team Mode UI
    renderTeamModeUI() {
        const container = document.getElementById('team-roles-container');
        if (!container) return;

        let html = '';
        Object.keys(TEAM_ROLES).forEach(rk => {
            const role = TEAM_ROLES[rk];
            const isActive = this.teamManager.activeRole === rk;
            html += `
                <div class="team-role-card ${isActive ? 'active-station' : ''}">
                    <div class="station-header" style="border-left-color: ${role.color};">
                        <span class="station-badge" style="background: ${role.color};">${role.badge}</span>
                        <div>
                            <h4>${role.name}</h4>
                            <span class="station-title">${role.title}</span>
                        </div>
                    </div>
                    <p class="station-resp">${role.responsibilities}</p>
                    <div class="station-duties">
            `;
            role.duties.forEach(d => {
                html += `
                    <button class="nasa-duty-btn" onclick="window.NASA_GAME.teamManager.executeDuty('${d.id}')">
                        <span class="duty-icon">&#9658;</span>
                        <span class="duty-label">${d.label}</span>
                        <span class="duty-bonus">+${d.bonus} pts</span>
                    </button>
                `;
            });
            html += `
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // Populate Leaderboard UI
    renderLeaderboardUI() {
        const list = this.scoring.getLeaderboard();
        const tbody = document.getElementById('leaderboard-tbody');
        if (!tbody) return;

        let html = '';
        list.forEach((entry, idx) => {
            html += `
                <tr>
                    <td class="col-rank">#${idx + 1}</td>
                    <td class="col-mission">${entry.mission}</td>
                    <td class="col-grade"><span class="grade-pill grade-${entry.grade}">${entry.grade}</span></td>
                    <td class="col-score">${entry.score.toLocaleString()}</td>
                    <td class="col-date">${entry.date}</td>
                </tr>
            `;
        });
        tbody.innerHTML = html;
    }

    // Populate Final Mission Debriefing Report UI
    renderMissionReportUI(report, isSuccess) {
        const repElem = document.getElementById('report-content');
        if (!repElem) return;

        repElem.innerHTML = `
            <div class="report-header ${isSuccess ? 'success' : 'failure'}">
                <div class="report-badge-col">
                    <div class="nasa-grade-seal seal-${report.grade}">
                        <span class="seal-grade">${report.grade}</span>
                        <span class="seal-sub">GRADE</span>
                    </div>
                </div>
                <div class="report-title-col">
                    <h2>${isSuccess ? 'MISSION SUCCESSFUL' : 'MISSION TERMINATED'}</h2>
                    <h3>${report.missionTitle}</h3>
                    <p class="rating-badge">${report.ratingTitle}</p>
                </div>
            </div>

            <div class="report-commendation">
                <div class="commendation-label">OFFICIAL NASA ADMINISTRATOR COMMENDATION:</div>
                <p>"${report.commendation}"</p>
            </div>

            <div class="report-metrics-grid">
                <div class="metric-card">
                    <span class="metric-label">FINAL SCORE</span>
                    <span class="metric-val score-highlight">${report.totalScore.toLocaleString()}</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">OBJECTIVES COMPLETED</span>
                    <span class="metric-val">${report.completedObjectives} / ${report.totalObjectives} (${report.completionRate}%)</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">FUEL MARGIN PRESERVED</span>
                    <span class="metric-val">${report.telemetry.fuelRemainingPct}%</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">HULL INTEGRITY</span>
                    <span class="metric-val">${report.telemetry.hullIntegrityPct}%</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">SCIENCE DATA ACQUIRED</span>
                    <span class="metric-val">${report.telemetry.dataTransmittedGB} GB (${report.telemetry.samplesCollected} Samples)</span>
                </div>
                <div class="metric-card">
                    <span class="metric-label">FLIGHT DURATION</span>
                    <span class="metric-val">${report.telemetry.flightTimeSecs} seconds</span>
                </div>
            </div>

            <div class="report-breakdown">
                <h4>SCORE BREAKDOWN & EVALUATION</h4>
                <div class="score-bar-row">
                    <span>Flight Objectives</span>
                    <div class="score-progress"><div style="width: ${Math.min(100, report.breakdown.objectives / 35)}%"></div></div>
                    <span>+${report.breakdown.objectives} pts</span>
                </div>
                <div class="score-bar-row">
                    <span>Scientific Discoveries</span>
                    <div class="score-progress"><div style="width: ${Math.min(100, report.breakdown.science / 30)}%"></div></div>
                    <span>+${report.breakdown.science} pts</span>
                </div>
                <div class="score-bar-row">
                    <span>Resource Management</span>
                    <div class="score-progress"><div style="width: ${Math.min(100, report.breakdown.resources / 35)}%"></div></div>
                    <span>+${report.breakdown.resources} pts</span>
                </div>
                <div class="score-bar-row">
                    <span>Spacecraft Engineering Synergy</span>
                    <div class="score-progress"><div style="width: ${Math.min(100, report.breakdown.engineering / 10)}%"></div></div>
                    <span>+${report.breakdown.engineering} pts</span>
                </div>
            </div>

            <div class="report-actions">
                <button class="nasa-btn" onclick="window.print()">&#128424; PRINT CERTIFICATE</button>
                <button class="nasa-btn btn-primary" onclick="window.NASA_GAME.switchUIPanel('panel-main-menu'); window.NASA_GAME.setupMenuEnvironment();">
                    &#8634; RETURN TO MAIN MENU
                </button>
            </div>
        `;
    }
}

// Global initialization on DOM ready
window.addEventListener('DOMContentLoaded', () => {
    window.NASA_GAME = new NASAExplorerGame();
    window.NASA_GAME.init();
});
