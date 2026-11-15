/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Spacecraft Engineering Bay, Parts Database, Launch Vehicles & Orbital Mechanics
 */

const SPACECRAFT_PARTS = {
    structure: {
        title: 'Structure & Chassis',
        options: {
            carbon: {
                name: 'Lightweight Carbon Composite',
                desc: 'Ultra-light carbon fiber weave with high rigidity and micrometeoroid resilience.',
                mass: 450,       // kg
                power: 0,        // W
                cost: 80,        // $M
                scienceBonus: 50,
                durability: 85,
                material: 'carbon'
            },
            aluminum: {
                name: 'Standard Aluminum-Lithium Bus',
                desc: 'NASA standard aerospace alloy. Well-tested, balanced mass and structural dampening.',
                mass: 750,
                power: 0,
                cost: 45,
                scienceBonus: 0,
                durability: 75,
                material: 'aluminum'
            },
            titanium: {
                name: 'Heavy Shielded Titanium / Gold MLI',
                desc: 'Heavy reinforced chassis with multi-layer radiation foil insulation for deep space storms.',
                mass: 1200,
                power: 0,
                cost: 65,
                scienceBonus: 80,
                durability: 98,
                material: 'titanium'
            }
        }
    },

    solar: {
        title: 'Solar Panels & Power Generation',
        options: {
            rigid: {
                name: 'Rigid Triple-Junction Arrays',
                desc: 'Dual articulated photovoltaic wings with 29.5% efficiency gallium arsenide cells.',
                mass: 180,
                power: 1200,     // +1200 Watts generation
                cost: 25,
                scienceBonus: 20,
                efficiency: 80
            },
            ultraflex: {
                name: 'UltraFlex Circular Deployable',
                desc: 'Accordion-folding circular fan arrays. High power-to-mass ratio used on Orion and Lucy.',
                mass: 120,
                power: 2000,
                cost: 40,
                scienceBonus: 60,
                efficiency: 92
            },
            perovskite: {
                name: 'Perovskite Quad Concentrators',
                desc: 'Next-generation tandem concentrator cells with peak 34% conversion efficiency.',
                mass: 90,
                power: 3200,
                cost: 70,
                scienceBonus: 100,
                efficiency: 96
            }
        }
    },

    battery: {
        title: 'Energy Storage & Batteries',
        options: {
            li_ion: {
                name: 'Lithium-Ion Standard Pack',
                desc: 'Proven flight heritage with 15 kWh capacity. Moderate cycle life.',
                mass: 150,
                power: -50,     // Parasitic baseline draw
                cost: 15,
                capacityKWh: 15,
                efficiency: 85
            },
            solid_state: {
                name: 'Solid-State Lithium Matrix',
                desc: 'High energy density without liquid electrolyte. 28 kWh capacity and immune to thermal runaway.',
                mass: 100,
                power: -30,
                cost: 35,
                capacityKWh: 28,
                efficiency: 95
            },
            rtg: {
                name: 'Radioisotope Thermoelectric (RTG)',
                desc: 'Plutonium-238 thermal decay source. Delivers steady 500W independent of solar distance.',
                mass: 220,
                power: 500,     // Generates constant power
                cost: 65,
                capacityKWh: 40,
                efficiency: 99
            }
        }
    },

    antenna: {
        title: 'Communication Subsystem',
        options: {
            omni: {
                name: 'Low-Gain Omnidirectional Patch',
                desc: 'Hemispherical coverage without steering. Low bandwidth (50 kbps), low power draw.',
                mass: 25,
                power: -20,
                cost: 8,
                bandwidthKbps: 50,
                rangeAU: 0.2
            },
            horn: {
                name: 'Medium-Gain Steerable Horn',
                desc: 'Articulated horn antenna. 500 kbps bandwidth, ideal for Lunar & LEO data transfer.',
                mass: 60,
                power: -60,
                cost: 18,
                bandwidthKbps: 500,
                rangeAU: 1.0
            },
            dish: {
                name: 'High-Gain Deep Space Parabolic Dish',
                desc: '2.5m carbon reflector with dual X/Ka-band feeds. High bandwidth (5,000 kbps) for Mars/Asteroids.',
                mass: 140,
                power: -150,
                cost: 38,
                bandwidthKbps: 5000,
                rangeAU: 5.0
            }
        }
    },

    computer: {
        title: 'Onboard Avionics & Flight Computer',
        options: {
            rad750: {
                name: 'BAE RAD750 Radiation-Hardened',
                desc: 'NASA workhorse processor. 100% radiation hardness, rock-solid stability.',
                mass: 30,
                power: -40,
                cost: 22,
                processingMips: 400,
                reliability: 99
            },
            dual_core: {
                name: 'Dual Redundant Quad-Core CPU',
                desc: 'Fault-tolerant architecture with voting logic for real-time instrument telemetry processing.',
                mass: 45,
                power: -90,
                cost: 35,
                processingMips: 1200,
                reliability: 95
            },
            quantum_ai: {
                name: 'Autonomous AI Quantum Co-Processor',
                desc: 'Neural optical engine for real-time hazard avoidance and automated celestial navigation.',
                mass: 35,
                power: -130,
                cost: 60,
                processingMips: 8500,
                reliability: 96
            }
        }
    },

    propulsion: {
        title: 'Propulsion & Reaction Control',
        options: {
            hydrazine: {
                name: 'Hydrazine Monopropellant',
                desc: 'Catalytic decomposition thruster. Simple, highly reliable, 230s specific impulse.',
                mass: 300,
                power: -30,
                cost: 20,
                isp: 230,
                thrustN: 400,
                fuelCapacity: 500
            },
            bipropellant: {
                name: 'MMH/NTO Bi-Propellant Rocket',
                desc: 'Hypergolic chemical engine. High thrust (1,500 N), 325s Isp for rapid orbital burns.',
                mass: 600,
                power: -50,
                cost: 40,
                isp: 325,
                thrustN: 1500,
                fuelCapacity: 850
            },
            ion: {
                name: 'Hall-Effect Xenon Ion Engine',
                desc: 'High-efficiency electrostatic engine. 3,100s Isp with continuous micro-thrust cruise.',
                mass: 200,
                power: -600,    // High electrical requirement!
                cost: 65,
                isp: 3100,
                thrustN: 150,
                fuelCapacity: 250
            },
            nuclear: {
                name: 'Nuclear Thermal Propulsion (NTP)',
                desc: 'Liquid hydrogen expanded through fission reactor core. 900s Isp with massive 4,000 N thrust.',
                mass: 950,
                power: 200,     // Auxiliary generator
                cost: 110,
                isp: 900,
                thrustN: 4000,
                fuelCapacity: 1100
            }
        }
    },

    instrument: {
        title: 'Primary Scientific Instrument',
        options: {
            magnetometer: {
                name: 'Fluxgate Magnetometer & Plasma Wave',
                desc: 'Measures planetary magnetic fields, solar wind interactions, and magnetosphere topology.',
                mass: 40,
                power: -30,
                cost: 15,
                sciencePoints: 200
            },
            spectrometer: {
                name: 'Hyperspectral Imaging Spectrometer',
                desc: 'Visible and infrared spectral analysis of surface minerals, volatiles, and organics.',
                mass: 80,
                power: -80,
                cost: 45,
                sciencePoints: 450
            },
            sar: {
                name: 'Synthetic Aperture Radar (SAR)',
                desc: 'Cloud-penetrating active microwave radar for 3D digital elevation and subsurface ice mapping.',
                mass: 150,
                power: -250,
                cost: 75,
                sciencePoints: 600
            },
            harpoon: {
                name: 'Surface Sampler / TAG Harpoon Arm',
                desc: 'Articulated Touch-and-Go arm with pneumatic canisters to collect physical surface regolith.',
                mass: 110,
                power: -70,
                cost: 55,
                sciencePoints: 800
            }
        }
    },

    sensor: {
        title: 'Cameras & Optical Navigation',
        options: {
            star_tracker: {
                name: 'Autonomous Multi-Star Tracker',
                desc: 'Precision attitude determination utilizing celestial star catalog matching.',
                mass: 15,
                power: -15,
                cost: 12,
                sciencePoints: 50,
                navPrecision: 99
            },
            telescope: {
                name: 'High-Resolution Telescopic Camera',
                desc: 'Sub-meter surface resolution telescopic optics for planetary crater and fracture imaging.',
                mass: 45,
                power: -40,
                cost: 28,
                sciencePoints: 300,
                navPrecision: 85
            },
            lidar: {
                name: '3D Flash LiDAR Altimeter',
                desc: 'Real-time laser terrain mapping and autonomous hazard detection during descent.',
                mass: 35,
                power: -65,
                cost: 36,
                sciencePoints: 250,
                navPrecision: 95
            }
        }
    }
};

const LAUNCH_VEHICLES = {
    pegasus: {
        id: 'pegasus',
        name: 'Pegasus-X Light Launcher',
        payloadCapacity: 1200,   // kg max to orbit
        cost: 40,                // $M
        reliability: 94,         // %
        maxDeltaV: 8200,         // m/s
        desc: 'Economical small-lift rocket suitable for lightweight Earth observation cubesats and probes.'
    },
    atlas: {
        id: 'atlas',
        name: 'Atlas V / Vulcan Centaur',
        payloadCapacity: 8500,
        cost: 110,
        reliability: 98,
        maxDeltaV: 9600,
        desc: 'Reliable NASA workhorse for medium lunar probes and interplanetary science orbiters.'
    },
    sls: {
        id: 'sls',
        name: 'SLS Block 1 Deep Space',
        payloadCapacity: 27000,
        cost: 220,
        reliability: 99,
        maxDeltaV: 11200,
        desc: 'Heavy-lift exploration rocket engineered for Artemis lunar missions and heavy deep space payloads.'
    },
    starship: {
        id: 'starship',
        name: 'Starship Super Heavy',
        payloadCapacity: 100000,
        cost: 90,
        reliability: 95,
        maxDeltaV: 12500,
        desc: 'Massive reusable spacecraft capable of launching colossal scientific expeditions to Mars and beyond.'
    }
};

const ORBITS = {
    leo: {
        id: 'leo',
        name: 'Low Earth Orbit (LEO)',
        altitudeKm: 400,
        deltaVReq: 9400,
        desc: '400 km altitude. Rapid 92-minute orbit around Earth. Ideal for ISS rendezvous and Earth photography.'
    },
    sso: {
        id: 'sso',
        name: 'Polar Sun-Synchronous (SSO)',
        altitudeKm: 800,
        deltaVReq: 9800,
        desc: '800 km altitude, 98° inclination. Passes over poles at identical solar time for consistent climate monitoring.'
    },
    geo: {
        id: 'geo',
        name: 'Geostationary Orbit (GEO)',
        altitudeKm: 35786,
        deltaVReq: 12800,
        desc: '35,786 km altitude. Orbital period matches Earth rotation for persistent ground coverage and high-gain comms.'
    },
    transfer: {
        id: 'transfer',
        name: 'Interplanetary Transfer Trajectory',
        altitudeKm: 384400,
        deltaVReq: 13200,
        desc: 'Hohmann elliptical transfer trajectory escaping Earth gravity well toward Moon, Mars, or Asteroid Belt.'
    }
};

class SpacecraftCustomizer {
    constructor(game) {
        this.game = game;
        this.selections = {
            structure: 'aluminum',
            solar: 'rigid',
            battery: 'li_ion',
            antenna: 'dish',
            computer: 'rad750',
            propulsion: 'bipropellant',
            instrument: 'spectrometer',
            sensor: 'star_tracker',
            rocket: 'atlas',
            orbit: 'transfer'
        };
    }

    setSelection(category, key) {
        if (this.selections[category] !== undefined) {
            this.selections[category] = key;
            this.calculateStats();
            // Update 3D spacecraft visual in real-time
            if (this.game && this.game.spacecraft) {
                this.game.spacecraft.build(this.selections);
            }
        }
    }

    calculateStats() {
        let totalMass = 0;
        let totalPowerGen = 0;
        let totalPowerDrain = 0;
        let totalCraftCost = 0;
        let totalScienceValue = 0;

        // Loop over the 8 subsystems
        const subCats = ['structure', 'solar', 'battery', 'antenna', 'computer', 'propulsion', 'instrument', 'sensor'];
        subCats.forEach(cat => {
            const key = this.selections[cat];
            const part = SPACECRAFT_PARTS[cat].options[key];
            if (part) {
                totalMass += part.mass || 0;
                if ((part.power || 0) > 0) {
                    totalPowerGen += part.power;
                } else {
                    totalPowerDrain += Math.abs(part.power || 0);
                }
                totalCraftCost += part.cost || 0;
                totalScienceValue += (part.scienceBonus || 0) + (part.sciencePoints || 0);
            }
        });

        // Add propellant mass based on propulsion type
        const propPart = SPACECRAFT_PARTS.propulsion.options[this.selections.propulsion];
        const fuelMass = propPart.fuelCapacity || 500;
        const wetMass = totalMass + fuelMass;
        const dryMass = totalMass;

        // Launch vehicle stats
        const rocket = LAUNCH_VEHICLES[this.selections.rocket] || LAUNCH_VEHICLES.atlas;
        const totalMissionCost = totalCraftCost + rocket.cost;

        // Rocket payload capacity check
        const payloadMarginKg = rocket.payloadCapacity - wetMass;
        const payloadMarginPct = Math.round((payloadMarginKg / rocket.payloadCapacity) * 100);
        const isOverweight = wetMass > rocket.payloadCapacity;

        // Net power balance
        const netPower = totalPowerGen - totalPowerDrain;
        const isPowerDeficit = netPower < 0;

        // Tsiolkovsky Delta-V calculation (m/s)
        const g0 = 9.80665;
        const deltaV = Math.round(propPart.isp * g0 * Math.log(wetMass / dryMass));

        return {
            dryMass,
            fuelMass,
            wetMass,
            totalPowerGen,
            totalPowerDrain,
            netPower,
            isPowerDeficit,
            totalCraftCost,
            rocketCost: rocket.cost,
            totalMissionCost,
            totalScienceValue,
            deltaV,
            isp: propPart.isp,
            rocket,
            payloadMarginKg,
            payloadMarginPct,
            isOverweight,
            orbit: ORBITS[this.selections.orbit] || ORBITS.transfer
        };
    }
}
