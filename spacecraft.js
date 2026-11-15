/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Modular Spacecraft 3D Generator & 6DOF Physics Simulation
 */

class Spacecraft {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();
        this.mesh = null;
        this.subsystems = {};
        
        // Physics & Motion State
        this.position = this.group.position;
        this.velocity = new THREE.Vector3();
        this.acceleration = new THREE.Vector3();
        this.angularVelocity = new THREE.Vector3(); // pitch, yaw, roll rates
        
        // Flight Controls & Limits
        this.throttle = 0;          // 0.0 to 1.0
        this.maxThrust = 12.0;       // Dependent on propulsion system
        this.turnRate = 1.4;        // Rotational torque
        this.flightAssist = true;   // SAS Attitude Stabilization
        this.linearDamping = 0.998; // Deep space minimal drag
        this.angularDamping = 0.94; // RCS reaction wheels damping

        // Particle Systems
        this.engineParticles = null;
        this.rcsParticles = [];
        this.engineGlowLight = null;

        // Current Design Configuration (Default or Custom)
        this.config = {
            structure: 'aluminum',
            solar: 'rigid',
            battery: 'li_ion',
            antenna: 'dish',
            computer: 'rad750',
            propulsion: 'bipropellant',
            instrument: 'spectrometer',
            sensor: 'star_tracker'
        };

        this.scene.add(this.group);
    }

    // Build or Rebuild the 3D Spacecraft from configuration
    build(config = {}) {
        this.config = Object.assign(this.config, config);

        // Remove previous 3D geometry if rebuilding
        while (this.group.children.length > 0) {
            const child = this.group.children[0];
            this.group.remove(child);
            if (child.geometry) child.geometry.dispose();
        }

        const root = new THREE.Group();

        // 1. CHASSIS / STRUCTURE
        let busMat;
        if (this.config.structure === 'carbon') {
            busMat = new THREE.MeshStandardMaterial({
                color: 0x1f2421,
                roughness: 0.3,
                metalness: 0.85
            });
        } else if (this.config.structure === 'titanium') {
            busMat = new THREE.MeshStandardMaterial({
                color: 0xd4af37, // Gold MLI Foil
                roughness: 0.25,
                metalness: 0.95
            });
        } else {
            // Aluminum-Lithium (NASA White/Silver)
            busMat = new THREE.MeshStandardMaterial({
                color: 0xeeeeee,
                roughness: 0.45,
                metalness: 0.6
            });
        }

        // Main Service Module / Bus Body (Octagonal prism or cylinder)
        const busGeom = new THREE.CylinderGeometry(2.4, 2.7, 5.0, 8);
        const busMesh = new THREE.Mesh(busGeom, busMat);
        busMesh.rotation.x = Math.PI / 2;
        root.add(busMesh);

        // Avionics Equipment Deck (Upper Cap)
        const deckGeom = new THREE.CylinderGeometry(2.1, 2.4, 1.2, 8);
        const deckMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.3 });
        const deckMesh = new THREE.Mesh(deckGeom, deckMat);
        deckMesh.rotation.x = Math.PI / 2;
        deckMesh.position.z = -3.1;
        root.add(deckMesh);

        // NASA Meatball Decal Embellishment (Front Shield)
        const decalGeom = new THREE.CircleGeometry(0.8, 16);
        const decalMat = new THREE.MeshBasicMaterial({ color: 0x0b3d91 }); // NASA Blue
        const decalMesh = new THREE.Mesh(decalGeom, decalMat);
        decalMesh.position.set(0, 1.25, 1.5);
        decalMesh.rotation.x = -Math.PI / 3;
        root.add(decalMesh);

        // 2. SOLAR PANELS
        const panelMat = new THREE.MeshStandardMaterial({
            color: 0x051f42,
            roughness: 0.2,
            metalness: 0.85
        });
        const panelFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });

        if (this.config.solar === 'ultraflex') {
            // Circular Pleated UltraFlex Panels (like Orion & Lucy)
            [-1, 1].forEach(side => {
                const armGeom = new THREE.CylinderGeometry(0.15, 0.15, 3.5, 8);
                const arm = new THREE.Mesh(armGeom, panelFrameMat);
                arm.rotation.z = Math.PI / 2;
                arm.position.set(side * 3.8, 0, 0);
                root.add(arm);

                const diskGeom = new THREE.CylinderGeometry(3.0, 3.0, 0.1, 24);
                const disk = new THREE.Mesh(diskGeom, panelMat);
                disk.rotation.z = Math.PI / 2;
                disk.position.set(side * 6.5, 0, 0);
                root.add(disk);
            });
        } else if (this.config.solar === 'perovskite') {
            // Quad Multi-Angle Solar Wings
            const angles = [-0.6, 0.6];
            [-1, 1].forEach(side => {
                angles.forEach(ang => {
                    const wingGeom = new THREE.BoxGeometry(4.8, 0.1, 1.8);
                    const wing = new THREE.Mesh(wingGeom, panelMat);
                    wing.position.set(side * 4.6, Math.sin(ang) * 1.5, Math.cos(ang) * 1.5);
                    wing.rotation.x = ang;
                    root.add(wing);
                });
            });
        } else {
            // Standard Rigid Rectangular Photovoltaic Wings
            [-1, 1].forEach(side => {
                const armGeom = new THREE.CylinderGeometry(0.18, 0.18, 2.2, 8);
                const arm = new THREE.Mesh(armGeom, panelFrameMat);
                arm.rotation.z = Math.PI / 2;
                arm.position.set(side * 3.2, 0, 0);
                root.add(arm);

                // Multi-section panel grid
                const wingGeom = new THREE.BoxGeometry(5.4, 0.12, 2.4);
                const wing = new THREE.Mesh(wingGeom, panelMat);
                wing.position.set(side * 6.2, 0, 0);
                root.add(wing);

                // Panel Gold Cell Grid Lines
                const gridGeom = new THREE.BoxGeometry(5.3, 0.13, 0.05);
                const gridMat = new THREE.MeshBasicMaterial({ color: 0xd4af37 });
                const grid = new THREE.Mesh(gridGeom, gridMat);
                grid.position.set(side * 6.2, 0, 0);
                root.add(grid);
            });
        }

        // 3. PROPULSION SYSTEM & MAIN ENGINE NOZZLE
        let nozzleColor = 0x555555;
        let plumeColor = 0xff6600;
        let plumeSize = 1.0;

        if (this.config.propulsion === 'ion') {
            plumeColor = 0x00f0ff; // Electric Cyan Xenon Plasma
            this.maxThrust = 8.5;
            // Dual Xenon Ion Thrusters
            [-0.7, 0.7].forEach(x => {
                const ionGeom = new THREE.CylinderGeometry(0.5, 0.7, 1.2, 16);
                const ionMesh = new THREE.Mesh(ionGeom, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9 }));
                ionMesh.rotation.x = Math.PI / 2;
                ionMesh.position.set(x, 0, 2.8);
                root.add(ionMesh);
            });
        } else if (this.config.propulsion === 'nuclear') {
            plumeColor = 0xaa00ff; // High-energy purple NTP exhaust
            this.maxThrust = 20.0;
            // Heavy Nuclear Thermal Rocket Bell
            const ntpGeom = new THREE.ConeGeometry(1.4, 2.5, 16, 1, true);
            const ntpMesh = new THREE.Mesh(ntpGeom, new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.95 }));
            ntpMesh.rotation.x = -Math.PI / 2;
            ntpMesh.position.set(0, 0, 3.4);
            root.add(ntpMesh);
        } else if (this.config.propulsion === 'hydrazine') {
            plumeColor = 0xffaa33;
            this.maxThrust = 9.5;
            const nozGeom = new THREE.ConeGeometry(0.8, 1.6, 16, 1, true);
            const nozMesh = new THREE.Mesh(nozGeom, new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.8 }));
            nozMesh.rotation.x = -Math.PI / 2;
            nozMesh.position.set(0, 0, 3.1);
            root.add(nozMesh);
        } else {
            // Bi-propellant Chemical Engine (Standard)
            plumeColor = 0xff5500;
            this.maxThrust = 14.0;
            const nozGeom = new THREE.ConeGeometry(1.1, 2.0, 16, 1, true);
            const nozMesh = new THREE.Mesh(nozGeom, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.85 }));
            nozMesh.rotation.x = -Math.PI / 2;
            nozMesh.position.set(0, 0, 3.2);
            root.add(nozMesh);
        }

        // Engine dynamic glow light
        this.engineGlowLight = new THREE.PointLight(plumeColor, 0, 25);
        this.engineGlowLight.position.set(0, 0, 4.0);
        root.add(this.engineGlowLight);

        // Animated Exhaust Plume Cone
        const plumeGeom = new THREE.ConeGeometry(0.9, 3.8, 16, 1, true);
        const plumeMat = new THREE.MeshBasicMaterial({
            color: plumeColor,
            transparent: true,
            opacity: 0.0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });
        this.enginePlume = new THREE.Mesh(plumeGeom, plumeMat);
        this.enginePlume.rotation.x = -Math.PI / 2;
        this.enginePlume.position.set(0, 0, 4.8);
        root.add(this.enginePlume);

        // 4. COMMUNICATION ANTENNA
        if (this.config.antenna === 'dish') {
            // High-Gain Parabolic Deep Space Dish
            const dishGeom = new THREE.SphereGeometry(1.6, 16, 16, 0, Math.PI * 2, 0, Math.PI / 3);
            const dishMat = new THREE.MeshStandardMaterial({
                color: 0xf5f5f5,
                metalness: 0.5,
                roughness: 0.3,
                side: THREE.DoubleSide
            });
            const dish = new THREE.Mesh(dishGeom, dishMat);
            dish.position.set(0, 2.4, -1.0);
            dish.rotation.x = -Math.PI / 3;
            root.add(dish);

            // Feedhorn Mast
            const feedGeom = new THREE.CylinderGeometry(0.06, 0.06, 1.2, 8);
            const feedMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
            const feed = new THREE.Mesh(feedGeom, feedMat);
            feed.position.set(0, 2.8, -0.6);
            feed.rotation.x = -Math.PI / 3;
            root.add(feed);
        } else if (this.config.antenna === 'horn') {
            // Medium-Gain Horn
            const hornGeom = new THREE.ConeGeometry(0.6, 1.5, 12, 1, true);
            const hornMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.85, roughness: 0.2 });
            const horn = new THREE.Mesh(hornGeom, hornMat);
            horn.position.set(0, 2.2, -1.0);
            horn.rotation.x = -Math.PI / 4;
            root.add(horn);
        } else {
            // Low-Gain Omnidirectional Patch Antenna
            const mastGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.0, 8);
            const mastMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8 });
            const mast = new THREE.Mesh(mastGeom, mastMat);
            mast.position.set(0, 2.2, -1.0);
            root.add(mast);

            const tipGeom = new THREE.SphereGeometry(0.2, 8, 8);
            const tipMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
            const tip = new THREE.Mesh(tipGeom, tipMat);
            tip.position.set(0, 3.2, -1.0);
            root.add(tip);
        }

        // 5. SCIENTIFIC INSTRUMENTS
        if (this.config.instrument === 'magnetometer') {
            // Long Deployable Boom with Sensor Canister
            const boomGeom = new THREE.CylinderGeometry(0.06, 0.06, 6.0, 8);
            const boomMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 });
            const boom = new THREE.Mesh(boomGeom, boomMat);
            boom.position.set(0, -3.2, -1.0);
            root.add(boom);

            const sensGeom = new THREE.BoxGeometry(0.4, 0.4, 0.6);
            const sensMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9 });
            const sens = new THREE.Mesh(sensGeom, sensMat);
            sens.position.set(0, -6.2, -1.0);
            root.add(sens);
        } else if (this.config.instrument === 'sar') {
            // Synthetic Aperture Radar Array
            const sarGeom = new THREE.BoxGeometry(4.0, 1.2, 0.15);
            const sarMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, wireframe: true });
            const sar = new THREE.Mesh(sarGeom, sarMat);
            sar.position.set(0, -2.4, 0);
            root.add(sar);
        } else if (this.config.instrument === 'harpoon') {
            // Sample TAG Harpoon Arm
            const armGeom = new THREE.CylinderGeometry(0.12, 0.12, 3.2, 8);
            const armMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.8 });
            const arm = new THREE.Mesh(armGeom, armMat);
            arm.rotation.x = -Math.PI / 4;
            arm.position.set(0, -1.8, -2.6);
            root.add(arm);

            const clawGeom = new THREE.ConeGeometry(0.4, 0.8, 6);
            const clawMat = new THREE.MeshStandardMaterial({ color: 0xffaa00, metalness: 0.9 });
            const claw = new THREE.Mesh(clawGeom, clawMat);
            claw.rotation.x = -Math.PI / 4;
            claw.position.set(0, -2.9, -3.7);
            root.add(claw);
        } else {
            // Spectrometer Optical Barrel
            const specGeom = new THREE.CylinderGeometry(0.35, 0.45, 1.6, 16);
            const specMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.9, roughness: 0.1 });
            const spec = new THREE.Mesh(specGeom, specMat);
            spec.rotation.x = Math.PI / 2;
            spec.position.set(0, -1.8, -3.2);
            root.add(spec);
        }

        // 6. CAMERAS & NAVIGATION SENSORS
        const camGeom = new THREE.BoxGeometry(0.5, 0.4, 0.6);
        const camMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 });
        const cam = new THREE.Mesh(camGeom, camMat);
        cam.position.set(0.9, 1.6, -3.2);
        root.add(cam);

        // Lens
        const lensGeom = new THREE.CylinderGeometry(0.15, 0.15, 0.2, 16);
        const lensMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
        const lens = new THREE.Mesh(lensGeom, lensMat);
        lens.rotation.x = Math.PI / 2;
        lens.position.set(0.9, 1.6, -3.6);
        root.add(lens);

        // 7. RCS QUAD BLOCKS (4 corners for 6DOF maneuvering)
        const rcsPositions = [
            [2.4, 0, 1.8],
            [-2.4, 0, 1.8],
            [2.4, 0, -1.8],
            [-2.4, 0, -1.8]
        ];
        rcsPositions.forEach(p => {
            const rcsBlock = new THREE.Mesh(
                new THREE.BoxGeometry(0.4, 0.4, 0.4),
                new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.8 })
            );
            rcsBlock.position.set(p[0], p[1], p[2]);
            root.add(rcsBlock);
        });

        this.mesh = root;
        this.group.add(root);
    }

    // 6DOF Physics & Motion Update
    update(delta = 0.016, controls = {}) {
        if (!this.mesh) return;

        // 1. ROTATIONAL CONTROLS (Pitch, Yaw, Roll)
        let pitchInput = 0;
        let yawInput = 0;
        let rollInput = 0;

        if (controls.pitchUp) pitchInput += 1;
        if (controls.pitchDown) pitchInput -= 1;
        if (controls.yawLeft) yawInput += 1;
        if (controls.yawRight) yawInput -= 1;
        if (controls.rollLeft) rollInput += 1;
        if (controls.rollRight) rollInput -= 1;

        // Apply angular acceleration
        const turnSpeed = this.turnRate * delta;
        this.angularVelocity.x += pitchInput * turnSpeed;
        this.angularVelocity.y += yawInput * turnSpeed;
        this.angularVelocity.z += rollInput * turnSpeed;

        // SAS Stabilization / Attitude Damping
        if (this.flightAssist) {
            this.angularVelocity.multiplyScalar(this.angularDamping);
        }

        // Apply rotation to spacecraft
        this.group.rotateX(this.angularVelocity.x * delta);
        this.group.rotateY(this.angularVelocity.y * delta);
        this.group.rotateZ(this.angularVelocity.z * delta);

        // 2. LINEAR THRUST & TRANSLATION
        // Forward vector in Three.js (spacecraft points along -Z)
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(this.group.quaternion);
        const right = new THREE.Vector3(1, 0, 0).applyQuaternion(this.group.quaternion);
        const up = new THREE.Vector3(0, 1, 0).applyQuaternion(this.group.quaternion);

        // Throttle Control (W/S or Up/Down)
        if (controls.thrustForward) {
            this.throttle = Math.min(1.0, this.throttle + delta * 1.5);
        } else if (controls.thrustBackward) {
            this.throttle = Math.max(0.0, this.throttle - delta * 2.0);
        } else if (controls.brake) {
            // Emergency RCS Retro-Brake
            this.throttle = 0;
            this.velocity.multiplyScalar(0.95);
        }

        // Compute forward thrust force
        const thrustForce = forward.clone().multiplyScalar(this.throttle * this.maxThrust * delta);
        this.velocity.add(thrustForce);

        // Lateral Strafe (A/D or Left/Right)
        if (controls.strafeLeft) {
            this.velocity.add(right.clone().multiplyScalar(-this.maxThrust * 0.4 * delta));
        }
        if (controls.strafeRight) {
            this.velocity.add(right.clone().multiplyScalar(this.maxThrust * 0.4 * delta));
        }

        // Vertical Strafe (R/F or Shift/Ctrl)
        if (controls.strafeUp) {
            this.velocity.add(up.clone().multiplyScalar(this.maxThrust * 0.4 * delta));
        }
        if (controls.strafeDown) {
            this.velocity.add(up.clone().multiplyScalar(-this.maxThrust * 0.4 * delta));
        }

        // Damping
        if (this.flightAssist && this.throttle === 0 && !controls.strafeLeft && !controls.strafeRight) {
            this.velocity.multiplyScalar(this.linearDamping);
        }

        // Safety NaN Check
        if (isNaN(this.velocity.x) || isNaN(this.velocity.y) || isNaN(this.velocity.z)) {
            this.velocity.set(0, 0, 0);
        }

        // Position update
        this.position.add(this.velocity);

        if (isNaN(this.position.x) || isNaN(this.position.y) || isNaN(this.position.z)) {
            this.position.set(0, 180, 280);
        }

        // 3. VISUAL ENGINE PLUME & GLOW
        if (this.enginePlume && this.engineGlowLight) {
            const targetOpacity = this.throttle > 0.05 ? 0.35 + this.throttle * 0.65 : 0.0;
            this.enginePlume.material.opacity = targetOpacity;
            const flicker = 1.0 + (Math.random() - 0.5) * 0.25;
            this.enginePlume.scale.set(
                0.8 + this.throttle * 0.5,
                (0.6 + this.throttle * 1.6) * flicker,
                0.8 + this.throttle * 0.5
            );
            this.engineGlowLight.intensity = this.throttle * 3.5 * flicker;
        }
    }

    // Reset Spacecraft State for new mission
    reset(pos = new THREE.Vector3(0, 0, 0)) {
        if (pos && typeof pos.x === 'number') {
            this.position.set(pos.x, pos.y, pos.z);
        } else {
            this.position.set(0, 0, 0);
        }
        this.velocity.set(0, 0, 0);
        this.angularVelocity.set(0, 0, 0);
        this.throttle = 0;
        this.group.rotation.set(0, 0, 0);
        this.group.quaternion.set(0, 0, 0, 1);
    }
}
