/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Team Mode: 4-Player Cooperative Mission Station Simulator
 */

const TEAM_ROLES = {
    commander: {
        id: 'commander',
        name: 'Mission Commander',
        title: 'Flight Director & Navigation Authority',
        badge: 'CDR',
        color: '#ff4444',
        responsibilities: 'Flight trajectory planning, orbital burn approvals, SAS attitude stabilization, and emergency abort decisions.',
        duties: [
            { id: 'auth_burn', label: 'Authorize Orbital Burn', status: 'ready', bonus: 150 },
            { id: 'sas_lock', label: 'Engage SAS Trajectory Hold', status: 'ready', bonus: 100 },
            { id: 'abort_criteria', label: 'Verify Safety Flight Envelope', status: 'ready', bonus: 120 }
        ]
    },
    engineer: {
        id: 'engineer',
        name: 'Spacecraft Engineer',
        title: 'Power & Propulsion Systems Lead',
        badge: 'ENG',
        color: '#ffaa00',
        responsibilities: 'Power grid balancing, battery health monitoring, RCS line pressure, and reaction wheel desaturation.',
        duties: [
            { id: 'power_balance', label: 'Optimize Electrical Power Grid', status: 'ready', bonus: 140 },
            { id: 'purge_rcs', label: 'Purge RCS Propellant Lines', status: 'ready', bonus: 110 },
            { id: 'diag_check', label: 'Run Avionics Diagnostic Check', status: 'ready', bonus: 130 }
        ]
    },
    science: {
        id: 'science',
        name: 'Science Specialist',
        title: 'Payload & Planetary Geology Lead',
        badge: 'SCI',
        color: '#00ff88',
        responsibilities: 'Sensor array calibration, hyperspectral spectrometer tuning, sample extraction, and astrobiological data analysis.',
        duties: [
            { id: 'tune_spec', label: 'Tune Hyperspectral Spectrometer', status: 'ready', bonus: 160 },
            { id: 'lidar_sweep', label: 'Trigger 3D LiDAR Surface Sweep', status: 'ready', bonus: 140 },
            { id: 'analyze_ore', label: 'Analyze Mineral Sample Core', status: 'ready', bonus: 180 }
        ]
    },
    comms: {
        id: 'comms',
        name: 'Communication Specialist',
        title: 'Deep Space Network & Telemetry Lead',
        badge: 'COM',
        color: '#00f0ff',
        responsibilities: 'Ground station antenna azimuth tracking, carrier signal amplification, downlink packet validation, and cosmic noise filtering.',
        duties: [
            { id: 'align_antenna', label: 'Align High-Gain Antenna to DSN', status: 'ready', bonus: 130 },
            { id: 'amplify_signal', label: 'Boost Downlink RF Amplifier', status: 'ready', bonus: 120 },
            { id: 'clear_packets', label: 'Purge Downlink Telemetry Queue', status: 'ready', bonus: 150 }
        ]
    }
};

class TeamManager {
    constructor(game) {
        this.game = game;
        this.activeRole = 'commander'; // Currently viewed role
        this.crewAssigned = {
            commander: 'Player 1',
            engineer: 'Player 2',
            science: 'Player 3',
            comms: 'Player 4'
        };
        this.teamEfficiency = 100; // % (0 - 100)
        this.completedDutiesCount = 0;
        this.dutyCooldowns = {};
    }

    setRole(roleKey) {
        if (TEAM_ROLES[roleKey]) {
            this.activeRole = roleKey;
            if (window.NASA_AUDIO) {
                window.NASA_AUDIO.playClick();
            }
        }
    }

    executeDuty(dutyId) {
        const now = Date.now();
        if (this.dutyCooldowns[dutyId] && now - this.dutyCooldowns[dutyId] < 12000) {
            const rem = Math.ceil((12000 - (now - this.dutyCooldowns[dutyId])) / 1000);
            if (this.game && this.game.hud) {
                this.game.hud.showNotification(`Station task cooling down (${rem}s remaining)`, 'warning');
            }
            return false;
        }

        // Find duty in active role
        const role = TEAM_ROLES[this.activeRole];
        const duty = role.duties.find(d => d.id === dutyId);
        if (!duty) return false;

        this.dutyCooldowns[dutyId] = now;
        this.completedDutiesCount++;
        this.teamEfficiency = Math.min(100, this.teamEfficiency + 5);

        // Apply reward
        if (this.game) {
            if (this.game.missionManager) {
                this.game.missionManager.sciencePoints += duty.bonus;
            }
            if (this.game.hud) {
                this.game.hud.showNotification(
                    `[${role.badge}] ${duty.label} EXECUTED! (+${duty.bonus} PTS)`,
                    'success'
                );
            }
        }

        if (window.NASA_AUDIO) {
            window.NASA_AUDIO.playSuccess();
        }

        return true;
    }

    update(delta) {
        // Subtle drift in team efficiency if neglected
        this.teamEfficiency = Math.max(70, this.teamEfficiency - delta * 0.05);
    }
}
