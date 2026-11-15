/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Random Space Challenges, Emergencies & Decision Engine
 */

const SPACE_CHALLENGES = [
    {
        id: 'solar_flare',
        title: 'CRITICAL ALERT: SOLAR FLARE RADIATION SURGE',
        category: 'radiation',
        desc: 'A Class-X coronal mass ejection is sweeping across your orbital vector. High-energy protons threaten to overwhelm electrical buses and corrupt flight memory.',
        choices: [
            {
                text: 'Orient Heat Shield / Gold Hull Toward Sun',
                desc: 'Consumes battery to maintain attitude. 100% electronics protection.',
                action: (game) => {
                    game.resources.battery = Math.max(10, game.resources.battery - 15);
                    game.hud.showNotification('Shield oriented. Radiation mitigated (-15% Battery).', 'info');
                    return { success: true, score: 250 };
                }
            },
            {
                text: 'Put Scientific Instruments into Safe Mode',
                desc: 'Powers down spectrometers. Protects hardware, but delays science collection.',
                action: (game) => {
                    game.hud.showNotification('Instruments powered down. Hardware secured.', 'info');
                    return { success: true, score: 180 };
                }
            },
            {
                text: 'Maintain Normal Operations (Risk Exposure)',
                desc: 'Risk radiation strike to maintain maximum science collection rate.',
                action: (game) => {
                    if (Math.random() > 0.4) {
                        game.resources.hullIntegrity = Math.max(20, game.resources.hullIntegrity - 25);
                        game.hud.showNotification('RADIATION DAMAGE! Avionics memory bit-flip detected.', 'danger');
                        return { success: false, score: -100 };
                    } else {
                        game.hud.showNotification('Radiation storm passed with minimal interference!', 'success');
                        return { success: true, score: 300 };
                    }
                }
            }
        ]
    },

    {
        id: 'comms_fade',
        title: 'COMMUNICATIONS CONJUNCTION INTERFERENCE',
        category: 'comms',
        desc: 'Deep Space Network ground link is degrading due to solar plasma radio scintillation. Downlink telemetry packet loss has reached 72%.',
        choices: [
            {
                text: 'Switch High-Gain Antenna to Maximum Amplification',
                desc: 'Increases RF transmitter power output. Preserves live high-speed downlink.',
                action: (game) => {
                    game.resources.battery = Math.max(10, game.resources.battery - 12);
                    game.resources.commsSignal = 95;
                    game.hud.showNotification('RF amplifier boosted. DSN carrier lock restored (-12% Battery).', 'success');
                    return { success: true, score: 220 };
                }
            },
            {
                text: 'Engage Autonomous Celestial Navigation (Star Tracker)',
                desc: 'Relies on onboard star tracker and inertial sensors. Zero power penalty.',
                action: (game) => {
                    game.hud.showNotification('Autonomous celestial tracking engaged. Navigation nominal.', 'info');
                    return { success: true, score: 200 };
                }
            },
            {
                text: 'Compress Telemetry & Buffer to Solid-State Memory',
                desc: 'Halts real-time stream. Queues scientific telemetry for later burst transmission.',
                action: (game) => {
                    game.hud.showNotification('Data buffered to solid-state memory. Uplink delayed.', 'info');
                    return { success: true, score: 150 };
                }
            }
        ]
    },

    {
        id: 'fuel_leak',
        title: 'PROPULSION PRESSURE ANOMALY',
        category: 'propulsion',
        desc: 'Micrometeorite debris impact detected on auxiliary propulsion manifold line. Slow propellant bleed detected in secondary RCS thruster bank.',
        choices: [
            {
                text: 'Isolate Manifold Valves Immediately',
                desc: 'Stops propellant leak. Reduces lateral RCS turn speed by 15%.',
                action: (game) => {
                    if (game.spacecraft) game.spacecraft.turnRate *= 0.85;
                    game.hud.showNotification('Valves isolated. Propellant leak arrested.', 'info');
                    return { success: true, score: 200 };
                }
            },
            {
                text: 'Deploy Thermal Self-Healing Sealant',
                desc: 'Activates internal micro-sealant matrix. Restores 100% thruster capacity.',
                action: (game) => {
                    game.resources.battery = Math.max(10, game.resources.battery - 18);
                    game.hud.showNotification('Sealant polymer cured. Full manifold pressure restored.', 'success');
                    return { success: true, score: 260 };
                }
            },
            {
                text: 'Vent Damaged Manifold Pressure',
                desc: 'Safely vents line. Loses 25 kg propellant but avoids manifold rupture.',
                action: (game) => {
                    game.resources.fuel = Math.max(10, game.resources.fuel - 25);
                    game.hud.showNotification('Line vented safely (-25 kg Propellant).', 'warning');
                    return { success: true, score: 140 };
                }
            }
        ]
    },

    {
        id: 'reaction_wheels',
        title: 'REACTION WHEEL DESATURATION REQUIRED',
        category: 'navigation',
        desc: 'Gyroscopic reaction wheels have reached 98% maximum rotational momentum. Spacecraft attitude stability is beginning to drift.',
        choices: [
            {
                text: 'Execute RCS Counter-Torque Burn',
                desc: 'Fires cold gas thrusters to dump angular momentum immediately.',
                action: (game) => {
                    game.resources.fuel = Math.max(10, game.resources.fuel - 15);
                    game.hud.showNotification('Momentum dumped. Gyros reset to 0 RPM (-15 kg Fuel).', 'success');
                    return { success: true, score: 210 };
                }
            },
            {
                text: 'Engage Planetary Magnetic Torquer Rods',
                desc: 'Uses Earth/Jupiter magnetic field gradient to bleed off spin. Zero fuel cost.',
                action: (game) => {
                    game.hud.showNotification('Magnetic torquing complete. Attitude nominal.', 'info');
                    return { success: true, score: 250 };
                }
            }
        ]
    },

    {
        id: 'debris_proximity',
        title: 'RADAR WARNING: HIGH-VELOCITY DEBRIS INTERSECT',
        category: 'hazard',
        desc: 'Orbital tracking radar has flagged an untracked fragmentation cloud on collision intercept course in 20 seconds!',
        choices: [
            {
                text: 'Perform Immediate Evasive Retro-Burn',
                desc: 'Burns main engine to alter orbital trajectory plane away from debris.',
                action: (game) => {
                    game.resources.fuel = Math.max(10, game.resources.fuel - 20);
                    game.hud.showNotification('Trajectory altered. Debris passed at safe standoff (-20 kg Fuel).', 'success');
                    return { success: true, score: 280 };
                }
            },
            {
                text: 'Manual Evasive Pilot Flight',
                desc: 'Spacecraft commander maintains manual control to visually dodge asteroids.',
                action: (game) => {
                    game.hud.showNotification('MANUAL EVASION ENGAGED! Steer craft clear of obstacles.', 'warning');
                    return { success: true, score: 320 };
                }
            }
        ]
    }
];

class EventManager {
    constructor(game) {
        this.game = game;
        this.lastEventTime = 0;
        this.eventInterval = 45000; // Trigger roughly every 45-60 seconds of flight
        this.activeEvent = null;
        this.isModalOpen = false;
    }

    update(currentTime) {
        if (this.isModalOpen || !this.game.isPlaying) return;

        if (currentTime - this.lastEventTime > this.eventInterval) {
            this.lastEventTime = currentTime;
            // 60% chance of triggering an anomaly
            if (Math.random() < 0.6) {
                this.triggerRandomChallenge();
            }
        }
    }

    triggerRandomChallenge() {
        const challenge = SPACE_CHALLENGES[Math.floor(Math.random() * SPACE_CHALLENGES.length)];
        this.activeEvent = challenge;
        this.isModalOpen = true;

        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.playAlarm();
        }

        if (this.game && this.game.hud) {
            this.game.hud.showChallengeModal(challenge);
        }
    }

    resolveChoice(choiceIndex) {
        if (!this.activeEvent || !this.activeEvent.choices[choiceIndex]) return;
        const choice = this.activeEvent.choices[choiceIndex];
        const res = choice.action(this.game);

        if (res.score && this.game.missionManager) {
            this.game.missionManager.sciencePoints += res.score;
        }

        if (window.NASA_AUDIO) {
            if (res.success) {
                window.NASA_AUDIO.playSuccess();
            } else {
                window.NASA_AUDIO.playAlarm();
            }
        }

        this.activeEvent = null;
        this.isModalOpen = false;

        if (this.game && this.game.hud) {
            this.game.hud.hideChallengeModal();
        }
    }
}
