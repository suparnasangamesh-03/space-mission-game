/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Mission Definitions, Objectives, Checkpoints, and Scenarios
 */

const NASA_MISSIONS = {
    moon: {
        id: 'moon',
        title: 'Moon Exploration – Artemis Vanguard',
        subtitle: 'Lunar South Pole & Water Ice Reconnaissance',
        difficulty: 'Intermediate',
        targetBody: 'Moon',
        description: 'Launch from Earth orbit, execute Trans-Lunar Injection (TLI), enter lunar orbit, and survey the permanently shadowed regions of Shackleton Crater for vital water ice resources.',
        briefing: 'Flight Director: "Artemis Vanguard, you are GO for TLI. Your mission is critical for the Artemis Base Camp: scan Shackleton Crater for volatiles and deploy our autonomous surface prospector."',
        recommendedOrbit: 'transfer',
        recommendedRocket: 'sls',
        budget: 350, // $350 Million
        spawn: {
            ship: new THREE.Vector3(0, 180, 280),
            shipLookAt: new THREE.Vector3(750, 40, -400),
            earth: new THREE.Vector3(0, 0, 0),
            moon: new THREE.Vector3(750, 40, -400),
            mars: new THREE.Vector3(2500, 200, -2000),
            hasISS: true,
            asteroidCount: 20
        },
        objectives: [
            {
                id: 'tli_burn',
                title: 'Execute Trans-Lunar Injection Burn',
                desc: 'Accelerate forward using main engine (W key / Throttle) toward the Moon vector.',
                type: 'thrust',
                targetVal: 0.6,
                progress: 0,
                completed: false,
                points: 300
            },
            {
                id: 'approach_moon',
                title: 'Enter Lunar Orbit Insertion Corridor',
                desc: 'Navigate toward the Moon until distance is under 180 km.',
                type: 'distance',
                targetEntity: 'moon',
                targetDist: 180,
                progress: 0,
                completed: false,
                points: 500
            },
            {
                id: 'scan_crater',
                title: 'Scan Shackleton Crater for Water Ice',
                desc: 'Approach the holographic Ice Signature marker and press [PULSE SCAN] / Space.',
                type: 'scan',
                markerId: 'moon_ice',
                progress: 0,
                completed: false,
                points: 600
            },
            {
                id: 'deploy_lander',
                title: 'Deploy Lunar Surface Prospector',
                desc: 'Stabilize spacecraft attitude above target and press [DEPLOY PROBE].',
                type: 'deploy',
                progress: 0,
                completed: false,
                points: 500
            },
            {
                id: 'transmit_dsn',
                title: 'Transmit Telemetry to Deep Space Network',
                desc: 'Align antenna toward Earth and press [TRANSMIT DATA].',
                type: 'transmit',
                progress: 0,
                completed: false,
                points: 400
            }
        ]
    },

    mars: {
        id: 'mars',
        title: 'Mars Exploration – Ares Odyssey',
        subtitle: 'Interplanetary Cruise & Jezero Crater Astrobiology',
        difficulty: 'Advanced',
        targetBody: 'Mars',
        description: 'Undertake an interplanetary voyage to Mars. Overcome deep space radiation, perform Mars Orbit Insertion, map the ancient Jezero Crater river delta, and collect organic atmospheric signatures.',
        briefing: 'Science Lead: "Ares Odyssey, you are entering Martian space. We need multispectral readings of Jezero crater to prepare for human landing site selection."',
        recommendedOrbit: 'transfer',
        recommendedRocket: 'starship',
        budget: 450, // $450 Million
        spawn: {
            ship: new THREE.Vector3(500, 80, -300),
            shipLookAt: new THREE.Vector3(1600, 120, -1200),
            earth: new THREE.Vector3(0, 0, 0),
            moon: new THREE.Vector3(350, 40, -150),
            mars: new THREE.Vector3(1600, 120, -1200),
            hasISS: false,
            asteroidCount: 45
        },
        objectives: [
            {
                id: 'cruise_burn',
                title: 'Execute Mars Cruise Trajectory',
                desc: 'Engage high-impulse propulsion toward the Martian red beacon.',
                type: 'thrust',
                targetVal: 0.8,
                progress: 0,
                completed: false,
                points: 350
            },
            {
                id: 'survive_storm',
                title: 'Survive Solar Flare Conjunction',
                desc: 'Orient thermal shields and maintain electrical power during solar storm.',
                type: 'event',
                progress: 0,
                completed: false,
                points: 450
            },
            {
                id: 'mars_orbit',
                title: 'Achieve Mars Orbit Insertion (MOI)',
                desc: 'Approach within 220 km of Mars and reduce velocity to capture orbit.',
                type: 'distance',
                targetEntity: 'mars',
                targetDist: 220,
                progress: 0,
                completed: false,
                points: 600
            },
            {
                id: 'scan_jezero',
                title: 'Spectrometer Scan of Jezero Crater',
                desc: 'Lock onto Jezero Crater anomaly marker and fire science scanner.',
                type: 'scan',
                markerId: 'mars_sample',
                progress: 0,
                completed: false,
                points: 700
            },
            {
                id: 'transmit_dsn',
                title: 'Relay Data via Mars Reconnaissance Orbiter',
                desc: 'Transmit acquired multispectral telemetry packet back to Houston.',
                type: 'transmit',
                progress: 0,
                completed: false,
                points: 500
            }
        ]
    },

    earth: {
        id: 'earth',
        title: 'Earth Observation – Terra Sentinel',
        subtitle: 'Low Earth Orbit & Climate Monitoring',
        difficulty: 'Beginner',
        targetBody: 'Earth',
        description: 'Deploy into Sun-Synchronous Polar Orbit to monitor Earth climate dynamics, rendezvous with the International Space Station, and calibrate hyperspectral hurricane tracking sensors.',
        briefing: 'Mission Commander: "Terra Sentinel is online in LEO. First task: perform a visual inspection flyby of the ISS, then calibrate your environmental radar array."',
        recommendedOrbit: 'sso',
        recommendedRocket: 'pegasus',
        budget: 220, // $220 Million
        spawn: {
            ship: new THREE.Vector3(0, 175, -20),
            shipLookAt: new THREE.Vector3(0, 160, -80),
            earth: new THREE.Vector3(0, 0, 0),
            moon: new THREE.Vector3(900, 60, -600),
            mars: new THREE.Vector3(3000, 200, -2500),
            hasISS: true,
            asteroidCount: 8
        },
        objectives: [
            {
                id: 'iss_rendezvous',
                title: 'Rendezvous with Space Station (ISS)',
                desc: 'Approach the International Space Station docking perimeter (< 60 km).',
                type: 'distance',
                targetEntity: 'iss',
                targetDist: 60,
                progress: 0,
                completed: false,
                points: 400
            },
            {
                id: 'calibrate_sensors',
                title: 'Calibrate Hyperspectral Imaging Array',
                desc: 'Point spacecraft toward Earth and engage [PULSE SCAN] instrument.',
                type: 'scan',
                markerId: 'earth_radar',
                progress: 0,
                completed: false,
                points: 450
            },
            {
                id: 'track_cyclone',
                title: 'Track Severe Hurricane Formation',
                desc: 'Fly through high-inclination storm monitoring waypoint.',
                type: 'scan',
                markerId: 'earth_cyclone',
                progress: 0,
                completed: false,
                points: 500
            },
            {
                id: 'transmit_tdrs',
                title: 'Downlink Climate Data via TDRS Relay',
                desc: 'Establish high-bandwidth downlink to NOAA Ground Network.',
                type: 'transmit',
                progress: 0,
                completed: false,
                points: 350
            }
        ]
    },

    asteroid: {
        id: 'asteroid',
        title: 'Asteroid Exploration – Psyche Harvester',
        subtitle: 'Deep Space Asteroid Belt & Surface TAG Sampling',
        difficulty: 'Advanced',
        targetBody: 'Asteroid Belt',
        description: 'Travel into the Main Asteroid Belt to rendezvous with metal-rich asteroid 16 Psyche. Maneuver through tumbling boulders, conduct radar altimetry, and perform a Touch-and-Go (TAG) sample capture.',
        briefing: 'Deep Space Lead: "Psyche Harvester, navigating the asteroid field requires utmost precision. Avoid rocky collisions, target the core metallic asteroid, and deploy your TAG sampling arm."',
        recommendedOrbit: 'transfer',
        recommendedRocket: 'atlas',
        budget: 380, // $380 Million
        spawn: {
            ship: new THREE.Vector3(750, 0, -650),
            shipLookAt: new THREE.Vector3(800, 0, -800),
            earth: new THREE.Vector3(0, 0, 0),
            moon: new THREE.Vector3(400, 20, -300),
            mars: new THREE.Vector3(1200, 80, -900),
            hasISS: false,
            asteroidCount: 85
        },
        objectives: [
            {
                id: 'belt_rendezvous',
                title: 'Rendezvous with Asteroid 16 Psyche Core',
                desc: 'Navigate to within 80 km of the primary metallic asteroid.',
                type: 'distance',
                targetEntity: 'psyche_core',
                targetDist: 80,
                progress: 0,
                completed: false,
                points: 500
            },
            {
                id: 'dodge_field',
                title: 'Navigate Tumbling Asteroid Hazard Zone',
                desc: 'Maneuver through the asteroid cluster without critical hull collision.',
                type: 'hazard',
                progress: 0,
                completed: false,
                points: 600
            },
            {
                id: 'tag_sample',
                title: 'Execute Touch-and-Go (TAG) Sampling',
                desc: 'Approach within 15 km of the metallic core node and trigger [COLLECT SAMPLE].',
                type: 'sample',
                markerId: 'asteroid_ore',
                progress: 0,
                completed: false,
                points: 800
            },
            {
                id: 'spectrometry_scan',
                title: 'Spectrometer Analysis of Rare Elements',
                desc: 'Perform full elemental breakdown scan of nickel-iron-platinum regolith.',
                type: 'scan',
                markerId: 'asteroid_scan',
                progress: 0,
                completed: false,
                points: 500
            },
            {
                id: 'earth_trajectory',
                title: 'Transmit Earth Return Trajectory Vector',
                desc: 'Calculate Hohmann return vector and upload telemetry to Earth.',
                type: 'transmit',
                progress: 0,
                completed: false,
                points: 500
            }
        ]
    }
};

class MissionManager {
    constructor(game) {
        this.game = game;
        this.currentMission = null;
        this.missionData = null;
        this.missionStartTime = 0;
        this.missionElapsedTime = 0;
        this.sciencePoints = 0;
        this.samplesCollected = 0;
        this.dataTransmittedGB = 0;
        this.completedObjectivesCount = 0;
        this.activeObjectives = [];
    }

    startMission(missionKey) {
        const rawMission = NASA_MISSIONS[missionKey];
        if (!rawMission) {
            console.error("Unknown mission key:", missionKey);
            return null;
        }

        // Clone mission data preserving proper Vector3 instances
        this.missionData = {
            id: rawMission.id,
            title: rawMission.title,
            subtitle: rawMission.subtitle,
            difficulty: rawMission.difficulty,
            targetBody: rawMission.targetBody,
            description: rawMission.description,
            briefing: rawMission.briefing,
            recommendedOrbit: rawMission.recommendedOrbit,
            recommendedRocket: rawMission.recommendedRocket,
            budget: rawMission.budget,
            spawn: {
                ship: rawMission.spawn.ship.clone(),
                shipLookAt: rawMission.spawn.shipLookAt.clone(),
                earth: rawMission.spawn.earth ? rawMission.spawn.earth.clone() : null,
                moon: rawMission.spawn.moon ? rawMission.spawn.moon.clone() : null,
                mars: rawMission.spawn.mars ? rawMission.spawn.mars.clone() : null,
                hasISS: rawMission.spawn.hasISS,
                asteroidCount: rawMission.spawn.asteroidCount
            },
            objectives: rawMission.objectives.map(o => Object.assign({}, o))
        };
        this.currentMission = missionKey;
        this.missionStartTime = Date.now();
        this.missionElapsedTime = 0;
        this.sciencePoints = 0;
        this.samplesCollected = 0;
        this.dataTransmittedGB = 0;
        this.completedObjectivesCount = 0;
        this.activeObjectives = this.missionData.objectives;

        console.log(`Mission Initialized: ${this.missionData.title}`);
        return this.missionData;
    }

    // Check progress on objectives
    update(shipPos, shipSpeed, distanceToTarget, scannerActive, delta) {
        if (!this.missionData) return;
        this.missionElapsedTime += delta;

        this.activeObjectives.forEach(obj => {
            if (obj.completed) return;

            if (obj.type === 'thrust') {
                if (shipSpeed > 0.5) {
                    obj.progress = Math.min(1.0, obj.progress + delta * 0.4);
                    if (obj.progress >= 1.0) {
                        this.completeObjective(obj);
                    }
                }
            } else if (obj.type === 'distance') {
                if (distanceToTarget <= obj.targetDist) {
                    obj.progress = 1.0;
                    this.completeObjective(obj);
                } else {
                    const ratio = Math.max(0, 1 - (distanceToTarget - obj.targetDist) / 500);
                    obj.progress = ratio;
                }
            }
        });
    }

    completeObjective(obj) {
        if (obj.completed) return;
        obj.completed = true;
        this.completedObjectivesCount++;
        this.sciencePoints += obj.points;

        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.playSuccess();
        }

        if (this.game && this.game.hud) {
            this.game.hud.showNotification(
                `OBJECTIVE COMPLETE: ${obj.title} (+${obj.points} PTS)`,
                'success'
            );
        }

        // Check if all objectives are completed
        const allDone = this.activeObjectives.every(o => o.completed);
        if (allDone && this.game) {
            setTimeout(() => {
                this.game.finishMission(true);
            }, 2500);
        }
    }

    triggerScanAction(targetMarker) {
        const scanObj = this.activeObjectives.find(
            o => !o.completed && (o.type === 'scan' || o.type === 'sample')
        );
        if (scanObj) {
            this.samplesCollected++;
            this.dataTransmittedGB += 42;
            this.completeObjective(scanObj);
            return true;
        }
        return false;
    }

    triggerDeployAction() {
        const deployObj = this.activeObjectives.find(o => !o.completed && o.type === 'deploy');
        if (deployObj) {
            this.completeObjective(deployObj);
            return true;
        }
        return false;
    }

    triggerTransmitAction() {
        const transObj = this.activeObjectives.find(o => !o.completed && o.type === 'transmit');
        if (transObj) {
            this.dataTransmittedGB += 85;
            this.completeObjective(transObj);
            return true;
        }
        return false;
    }
}
