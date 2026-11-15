/**
 * SPACE MISSION 3D – NASA EXPLORER
 * NASA Flight HUD & Telemetry Dashboard Controller
 */

class HUDController {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.notificationTimeout = null;
        this.cacheDOMElements();
    }

    cacheDOMElements() {
        this.elements = {
            hudContainer: document.getElementById('flight-hud'),
            fuelBar: document.getElementById('hud-fuel-bar'),
            fuelVal: document.getElementById('hud-fuel-val'),
            batteryBar: document.getElementById('hud-battery-bar'),
            batteryVal: document.getElementById('hud-battery-val'),
            hullBar: document.getElementById('hud-hull-bar'),
            hullVal: document.getElementById('hud-hull-val'),
            speedVal: document.getElementById('hud-speed-val'),
            throttleBar: document.getElementById('hud-throttle-bar'),
            throttleVal: document.getElementById('hud-throttle-val'),
            metVal: document.getElementById('hud-met-val'),
            targetDistVal: document.getElementById('hud-target-dist'),
            targetNameVal: document.getElementById('hud-target-name'),
            sciencePointsVal: document.getElementById('hud-science-points'),
            samplesVal: document.getElementById('hud-samples-val'),
            signalVal: document.getElementById('hud-signal-val'),
            massVal: document.getElementById('hud-mass-val'),
            budgetVal: document.getElementById('hud-budget-val'),
            objectiveList: document.getElementById('hud-objective-list'),
            notifBox: document.getElementById('hud-notification'),
            notifText: document.getElementById('hud-notification-text'),
            challengeModal: document.getElementById('challenge-modal'),
            challengeTitle: document.getElementById('challenge-title'),
            challengeDesc: document.getElementById('challenge-desc'),
            challengeChoices: document.getElementById('challenge-choices'),
            targetReticle: document.getElementById('target-reticle'),
            targetReticleText: document.getElementById('target-reticle-dist'),
            navballNeedle: document.getElementById('navball-needle'),
            sasIndicator: document.getElementById('hud-sas-status'),
            camModeIndicator: document.getElementById('hud-cam-status')
        };
    }

    show() {
        if (this.elements.hudContainer) {
            this.elements.hudContainer.classList.remove('hidden');
        }
    }

    hide() {
        if (this.elements.hudContainer) {
            this.elements.hudContainer.classList.add('hidden');
        }
    }

    // Update real-time HUD values from game state
    update(delta) {
        const game = this.game;
        if (!game || !game.isPlaying) return;

        const res = game.resources;
        const mm = game.missionManager;
        const ship = game.spacecraft;

        // 1. Fuel
        const fuelPct = Math.max(0, Math.min(100, Math.round((res.fuel / res.maxFuel) * 100)));
        if (this.elements.fuelBar) this.elements.fuelBar.style.width = `${fuelPct}%`;
        if (this.elements.fuelVal) this.elements.fuelVal.innerText = `${Math.round(res.fuel)} kg (${fuelPct}%)`;

        // 2. Battery
        const battPct = Math.max(0, Math.min(100, Math.round(res.battery)));
        if (this.elements.batteryBar) this.elements.batteryBar.style.width = `${battPct}%`;
        if (this.elements.batteryVal) this.elements.batteryVal.innerText = `${battPct}% (${res.netPower > 0 ? '+' : ''}${Math.round(res.netPower)}W)`;

        // 3. Hull
        const hullPct = Math.max(0, Math.min(100, Math.round(res.hullIntegrity)));
        if (this.elements.hullBar) this.elements.hullBar.style.width = `${hullPct}%`;
        if (this.elements.hullVal) this.elements.hullVal.innerText = `${hullPct}%`;

        // 4. Speed & Throttle
        const rawSpeed = ship.velocity ? ship.velocity.length() : 0;
        const speedKms = (isNaN(rawSpeed) ? 0 : rawSpeed * 12.8).toFixed(1);
        if (this.elements.speedVal) this.elements.speedVal.innerText = `${speedKms} km/s`;
        const throttlePct = Math.round((ship.throttle || 0) * 100);
        if (this.elements.throttleBar) this.elements.throttleBar.style.height = `${throttlePct}%`;
        if (this.elements.throttleVal) this.elements.throttleVal.innerText = `${throttlePct}%`;

        // 5. Mission Elapsed Time (MET)
        if (this.elements.metVal && mm) {
            const totalSecs = Math.floor(mm.missionElapsedTime);
            const hrs = String(Math.floor(totalSecs / 3600)).padStart(2, '0');
            const mins = String(Math.floor((totalSecs % 3600) / 60)).padStart(2, '0');
            const secs = String(totalSecs % 60).padStart(2, '0');
            this.elements.metVal.innerText = `MET: ${hrs}:${mins}:${secs}`;
        }

        // 6. Science & Telemetry
        if (this.elements.sciencePointsVal && mm) this.elements.sciencePointsVal.innerText = `${mm.sciencePoints} PTS`;
        if (this.elements.samplesVal && mm) this.elements.samplesVal.innerText = `${mm.samplesCollected} SAMPLES | ${mm.dataTransmittedGB} GB`;
        if (this.elements.signalVal) this.elements.signalVal.innerText = `${Math.round(res.commsSignal)} dB (DSN Locked)`;
        if (this.elements.massVal) this.elements.massVal.innerText = `${Math.round(res.mass)} kg`;
        if (this.elements.budgetVal) this.elements.budgetVal.innerText = `$${res.budget}M`;

        // 7. Indicators
        if (this.elements.sasIndicator) {
            this.elements.sasIndicator.innerText = ship.flightAssist ? 'SAS: ACTIVE' : 'SAS: DRIFT';
            this.elements.sasIndicator.className = ship.flightAssist ? 'status-indicator green' : 'status-indicator amber';
        }
        if (this.elements.camModeIndicator && game.engine3d) {
            this.elements.camModeIndicator.innerText = `CAM: ${game.engine3d.cameraMode.toUpperCase()}`;
        }

        // 8. Navball rotation indicator
        if (this.elements.navballNeedle && ship) {
            const rotZ = ship.group.rotation.z;
            const rotX = ship.group.rotation.x;
            this.elements.navballNeedle.style.transform = `rotate(${-rotZ * (180 / Math.PI)}deg) translateY(${rotX * 15}px)`;
        }

        // 9. Objectives List Rendering
        this.renderObjectivesList();

        // 10. 3D Screen Space Target Reticle Tracking
        this.updateTargetReticle();
    }

    renderObjectivesList() {
        const mm = this.game.missionManager;
        if (!mm || !this.elements.objectiveList) return;

        let html = '';
        mm.activeObjectives.forEach((obj, idx) => {
            const icon = obj.completed ? '&#10004;' : (idx === mm.completedObjectivesCount ? '&#9654;' : '&#9675;');
            const statusClass = obj.completed ? 'obj-done' : (idx === mm.completedObjectivesCount ? 'obj-active' : 'obj-pending');
            html += `
                <div class="hud-obj-item ${statusClass}">
                    <span class="hud-obj-icon">${icon}</span>
                    <span class="hud-obj-title">${obj.title}</span>
                </div>
            `;
        });
        this.elements.objectiveList.innerHTML = html;
    }

    // Project active 3D objective position to 2D screen coordinate reticle
    updateTargetReticle() {
        const game = this.game;
        if (!game || !game.engine3d || !this.elements.targetReticle) return;

        const camera = game.engine3d.camera;
        const targetPos = game.getCurrentObjectivePosition();
        if (!targetPos) {
            this.elements.targetReticle.style.display = 'none';
            return;
        }

        const dist = Math.round(game.spacecraft.position.distanceTo(targetPos));
        if (this.elements.targetDistVal) {
            this.elements.targetDistVal.innerText = `${dist} km`;
        }
        if (this.elements.targetNameVal) {
            this.elements.targetNameVal.innerText = game.getCurrentObjectiveName();
        }

        // Project 3D vector to normalized device coordinates (-1 to +1)
        const screenPos = targetPos.clone().project(camera);

        // Check if behind camera
        if (screenPos.z > 1.0) {
            this.elements.targetReticle.style.display = 'none';
            return;
        }

        const x = (screenPos.x * 0.5 + 0.5) * window.innerWidth;
        const y = (-(screenPos.y * 0.5) + 0.5) * window.innerHeight;

        this.elements.targetReticle.style.display = 'block';
        this.elements.targetReticle.style.left = `${x}px`;
        this.elements.targetReticle.style.top = `${y}px`;
        if (this.elements.targetReticleText) {
            this.elements.targetReticleText.innerText = `${dist} km`;
        }
    }

    // High-tech notification banner
    showNotification(msg, type = 'info') {
        if (!this.elements.notifBox || !this.elements.notifText) return;
        this.elements.notifText.innerText = msg;
        this.elements.notifBox.className = `hud-banner ${type}`;
        this.elements.notifBox.classList.remove('hidden');

        if (this.notificationTimeout) clearTimeout(this.notificationTimeout);
        this.notificationTimeout = setTimeout(() => {
            this.elements.notifBox.classList.add('hidden');
        }, 4000);
    }

    // Emergency Challenge Decision Modal
    showChallengeModal(challenge) {
        if (!this.elements.challengeModal) return;
        this.elements.challengeTitle.innerText = challenge.title;
        this.elements.challengeDesc.innerText = challenge.desc;

        let choicesHtml = '';
        challenge.choices.forEach((c, idx) => {
            choicesHtml += `
                <button class="nasa-choice-btn" onclick="window.NASA_GAME.eventManager.resolveChoice(${idx})">
                    <span class="choice-key">[${idx + 1}]</span>
                    <div class="choice-info">
                        <strong>${c.text}</strong>
                        <p>${c.desc}</p>
                    </div>
                </button>
            `;
        });
        this.elements.challengeChoices.innerHTML = choicesHtml;
        this.elements.challengeModal.classList.remove('hidden');
    }

    hideChallengeModal() {
        if (this.elements.challengeModal) {
            this.elements.challengeModal.classList.add('hidden');
        }
    }
}
