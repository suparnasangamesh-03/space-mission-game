/**
 * SPACE MISSION 3D – NASA EXPLORER
 * NASA Scoring System, Leaderboard (LocalStorage) & Final Mission Debriefing Report
 */

class ScoringSystem {
    constructor() {
        this.storageKey = 'NASA_SPACE_MISSION_LEADERBOARD_V1';
    }

    calculateMissionReport(game) {
        const mm = game.missionManager;
        const res = game.resources;
        const mission = mm.missionData;

        // 1. Objectives Score
        const totalObjs = mm.activeObjectives.length || 1;
        const completedObjs = mm.activeObjectives.filter(o => o.completed).length;
        const completionRate = completedObjs / totalObjs;
        const objectiveScore = Math.round(completionRate * 3500);

        // 2. Science Score
        const scienceScore = mm.sciencePoints + (mm.samplesCollected * 450) + Math.round(mm.dataTransmittedGB * 8);

        // 3. Resource Efficiency
        const fuelRatio = Math.max(0, res.fuel / res.maxFuel);
        const batteryRatio = Math.max(0, res.battery / 100);
        const hullRatio = Math.max(0, res.hullIntegrity / 100);
        const resourceScore = Math.round((fuelRatio * 1200) + (batteryRatio * 800) + (hullRatio * 1500));

        // 4. Spacecraft Design & Engineering Synergy
        const stats = game.customizer.calculateStats();
        const designScore = Math.max(0, Math.min(1000, Math.round((stats.isp * 0.25) + (stats.payloadMarginPct * 6))));

        // 5. Time Management
        const elapsedSecs = Math.round(mm.missionElapsedTime);
        const targetSecs = 180; // Target flight time
        let timeBonus = 0;
        if (elapsedSecs < targetSecs) {
            timeBonus = Math.round((targetSecs - elapsedSecs) * 8);
        } else {
            timeBonus = Math.max(-500, Math.round((targetSecs - elapsedSecs) * 3));
        }

        // Total Score
        const totalScore = Math.max(0, objectiveScore + scienceScore + resourceScore + designScore + timeBonus);

        // Grade
        let grade = 'B';
        let ratingTitle = 'Nominal Mission Success';
        let commendation = 'The mission achieved its primary objectives within acceptable operational parameters. Flight telemetry indicates solid spacecraft stability.';

        if (totalScore >= 7500) {
            grade = 'S';
            ratingTitle = 'Distinguished Spaceflight Achievement';
            commendation = 'Exceptional performance! NASA Associate Administrator hereby confers the Highest Exploration Commendation for flawless mission execution, outstanding scientific discovery, and peerless engineering resource management.';
        } else if (totalScore >= 6000) {
            grade = 'A';
            ratingTitle = 'Outstanding Mission Success';
            commendation = 'Superior piloting and spacecraft management. All high-priority scientific samples were successfully gathered and downlinked with high resource margins.';
        } else if (totalScore >= 4200) {
            grade = 'B';
            ratingTitle = 'Nominal Mission Success';
            commendation = 'Primary flight milestones achieved. Ground station received valuable telemetry data, though resource margins experienced minor strain.';
        } else if (totalScore >= 2500) {
            grade = 'C';
            ratingTitle = 'Marginal Mission Performance';
            commendation = 'Spacecraft completed secondary objectives, but experienced significant subsystem degradation and propellant depletion.';
        } else {
            grade = 'D';
            ratingTitle = 'Mission Sub-Optimal';
            commendation = 'Flight terminated with critical resource loss. Review flight recorder logs and engineering design tolerances before next launch.';
        }

        const report = {
            missionId: mission.id,
            missionTitle: mission.title,
            completedObjectives: completedObjs,
            totalObjectives: totalObjs,
            completionRate: Math.round(completionRate * 100),
            totalScore: totalScore,
            grade: grade,
            ratingTitle: ratingTitle,
            commendation: commendation,
            breakdown: {
                objectives: objectiveScore,
                science: scienceScore,
                resources: resourceScore,
                engineering: designScore,
                timeBonus: timeBonus
            },
            telemetry: {
                flightTimeSecs: elapsedSecs,
                fuelRemainingPct: Math.round(fuelRatio * 100),
                batteryRemainingPct: Math.round(batteryRatio * 100),
                hullIntegrityPct: Math.round(hullRatio * 100),
                samplesCollected: mm.samplesCollected,
                dataTransmittedGB: mm.dataTransmittedGB,
                finalBudgetRemainingM: Math.max(0, mission.budget - stats.totalMissionCost)
            },
            date: new Date().toLocaleDateString(),
            timestamp: Date.now()
        };

        // Automatically save to leaderboard
        this.saveScore(report);

        return report;
    }

    // Save record to LocalStorage
    saveScore(report) {
        try {
            const list = this.getLeaderboard();
            list.push({
                mission: report.missionTitle,
                score: report.totalScore,
                grade: report.grade,
                rating: report.ratingTitle,
                date: report.date,
                timestamp: report.timestamp
            });
            // Sort by score descending
            list.sort((a, b) => b.score - a.score);
            // Keep top 20
            const trimmed = list.slice(0, 20);
            localStorage.setItem(this.storageKey, JSON.stringify(trimmed));
        } catch (e) {
            console.warn("LocalStorage save error:", e);
        }
    }

    getLeaderboard() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) {
                // Populate initial realistic default NASA leaderboard
                const initial = [
                    { mission: 'Mars Exploration – Ares Odyssey', score: 7850, grade: 'S', rating: 'Distinguished Spaceflight Achievement', date: '2026-11-12' },
                    { mission: 'Moon Exploration – Artemis Vanguard', score: 7200, grade: 'S', rating: 'Distinguished Spaceflight Achievement', date: '2026-11-10' },
                    { mission: 'Asteroid Exploration – Psyche Harvester', score: 6450, grade: 'A', rating: 'Outstanding Mission Success', date: '2026-11-08' },
                    { mission: 'Earth Observation – Terra Sentinel', score: 5800, grade: 'B', rating: 'Nominal Mission Success', date: '2026-11-05' },
                    { mission: 'Moon Exploration – Artemis Vanguard', score: 4900, grade: 'B', rating: 'Nominal Mission Success', date: '2026-11-01' }
                ];
                localStorage.setItem(this.storageKey, JSON.stringify(initial));
                return initial;
            }
            return JSON.parse(raw);
        } catch (e) {
            return [];
        }
    }

    clearLeaderboard() {
        try {
            localStorage.removeItem(this.storageKey);
        } catch (e) {}
    }
}
