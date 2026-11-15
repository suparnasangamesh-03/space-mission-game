/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Celestial Bodies & Environment Builder
 * Procedural texture generation for Earth, Moon, Mars, Asteroids, ISS, and Deep Space.
 */

class CelestialManager {
    constructor(scene) {
        this.scene = scene;
        this.bodies = {};
        this.satellites = [];
        this.scienceMarkers = [];
        this.asteroids = [];
        this.debrisField = [];
        this.textureCache = {};
    }

    // Helper: Simplex-like noise generator on 2D canvas for procedural planetary textures
    createProceduralCanvas(width, height, drawFn) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        drawFn(ctx, width, height);
        const texture = new THREE.CanvasTexture(canvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        return texture;
    }

    // Generate Earth Surface Texture (Oceans, Continents, Greenery, Deserts)
    getEarthTexture() {
        if (this.textureCache.earth) return this.textureCache.earth;
        this.textureCache.earth = this.createProceduralCanvas(1024, 512, (ctx, w, h) => {
            // Deep ocean base
            const oceanGrad = ctx.createLinearGradient(0, 0, 0, h);
            oceanGrad.addColorStop(0, '#0c2340');
            oceanGrad.addColorStop(0.5, '#123e6d');
            oceanGrad.addColorStop(1, '#0c2340');
            ctx.fillStyle = oceanGrad;
            ctx.fillRect(0, 0, w, h);

            // Continents outline (North America, South America, Eurasia, Africa, Australia, Antarctica)
            ctx.fillStyle = '#2c5d3f'; // Lush green/forest
            
            // Random continent landmass patches
            const landPatches = [
                // Americas
                { x: 0.22, y: 0.32, rx: 0.1, ry: 0.12 },
                { x: 0.28, y: 0.62, rx: 0.08, ry: 0.16 },
                // Africa
                { x: 0.52, y: 0.55, rx: 0.09, ry: 0.15 },
                // Europe / Asia
                { x: 0.55, y: 0.32, rx: 0.12, ry: 0.1 },
                { x: 0.72, y: 0.35, rx: 0.18, ry: 0.12 },
                // Australia
                { x: 0.82, y: 0.70, rx: 0.07, ry: 0.06 },
                // Greenland
                { x: 0.35, y: 0.16, rx: 0.06, ry: 0.05 },
                // Antarctica
                { x: 0.5, y: 0.94, rx: 0.48, ry: 0.05 }
            ];

            landPatches.forEach(lp => {
                ctx.beginPath();
                ctx.ellipse(lp.x * w, lp.y * h, lp.rx * w, lp.ry * h, 0, 0, Math.PI * 2);
                ctx.fill();

                // Add mountain/desert brown highlights
                ctx.fillStyle = '#8a6d3b';
                ctx.beginPath();
                ctx.ellipse((lp.x + 0.02) * w, (lp.y - 0.01) * h, lp.rx * 0.6 * w, lp.ry * 0.5 * h, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#2c5d3f';
            });

            // Detailed fractal-like noise dots for natural coastlines
            for (let i = 0; i < 4000; i++) {
                const rx = Math.random() * w;
                const ry = Math.random() * h;
                const distToLand = landPatches.some(p => {
                    const dx = (rx - p.x * w) / (p.rx * w);
                    const dy = (ry - p.y * h) / (p.ry * h);
                    return dx * dx + dy * dy < 1.4;
                });
                if (distToLand) {
                    ctx.fillStyle = Math.random() > 0.4 ? '#386641' : '#bc6c25';
                    ctx.fillRect(rx, ry, 2 + Math.random() * 4, 2 + Math.random() * 4);
                }
            }

            // Ice caps
            ctx.fillStyle = '#f0f8ff';
            ctx.fillRect(0, 0, w, h * 0.07);
            ctx.fillRect(0, h * 0.93, w, h * 0.07);
        });
        return this.textureCache.earth;
    }

    // Generate Earth Clouds Texture
    getCloudsTexture() {
        if (this.textureCache.clouds) return this.textureCache.clouds;
        this.textureCache.clouds = this.createProceduralCanvas(1024, 512, (ctx, w, h) => {
            ctx.clearRect(0, 0, w, h);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';

            for (let i = 0; i < 180; i++) {
                const cx = Math.random() * w;
                const cy = (0.15 + Math.random() * 0.7) * h;
                const rad = 20 + Math.random() * 45;
                ctx.beginPath();
                ctx.arc(cx, cy, rad, 0, Math.PI * 2);
                ctx.fill();

                // Swirl tendrils
                ctx.beginPath();
                ctx.ellipse(cx + 25, cy + 5, rad * 1.5, rad * 0.5, Math.PI / 6, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        return this.textureCache.clouds;
    }

    // Generate Moon Surface Texture (Regolith, Maria, Craters)
    getMoonTexture() {
        if (this.textureCache.moon) return this.textureCache.moon;
        this.textureCache.moon = this.createProceduralCanvas(1024, 512, (ctx, w, h) => {
            // Lunar highland gray base
            ctx.fillStyle = '#9e9e9e';
            ctx.fillRect(0, 0, w, h);

            // Dark basaltic plains (Lunar Maria)
            ctx.fillStyle = '#5c5c5c';
            const maria = [
                { x: 0.35, y: 0.38, r: 65 },
                { x: 0.45, y: 0.32, r: 50 },
                { x: 0.52, y: 0.48, r: 80 },
                { x: 0.28, y: 0.52, r: 40 },
                { x: 0.70, y: 0.40, r: 55 }
            ];
            maria.forEach(m => {
                ctx.beginPath();
                ctx.arc(m.x * w, m.y * h, m.r, 0, Math.PI * 2);
                ctx.fill();
            });

            // Impact Craters with bright rims and shadows
            for (let i = 0; i < 500; i++) {
                const cx = Math.random() * w;
                const cy = Math.random() * h;
                const r = 3 + Math.random() * 18;

                // Outer bright ejecta ring
                ctx.strokeStyle = '#d5d5d5';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.stroke();

                // Inner dark crater pit
                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.arc(cx - 0.5, cy - 0.5, r * 0.75, 0, Math.PI * 2);
                ctx.fill();

                // Central peak
                if (r > 10) {
                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        });
        return this.textureCache.moon;
    }

    // Generate Mars Surface Texture (Rust red, Canyons, Ice Caps)
    getMarsTexture() {
        if (this.textureCache.mars) return this.textureCache.mars;
        this.textureCache.mars = this.createProceduralCanvas(1024, 512, (ctx, w, h) => {
            // Red-orange oxidized iron surface
            const grad = ctx.createLinearGradient(0, 0, 0, h);
            grad.addColorStop(0, '#c1440e');
            grad.addColorStop(0.5, '#e06d3b');
            grad.addColorStop(1, '#c1440e');
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, w, h);

            // Dark volcanic highlands (Syrtis Major, Tharsis)
            ctx.fillStyle = '#6e260e';
            for (let i = 0; i < 60; i++) {
                const cx = Math.random() * w;
                const cy = (0.2 + Math.random() * 0.6) * h;
                ctx.beginPath();
                ctx.ellipse(cx, cy, 30 + Math.random() * 60, 15 + Math.random() * 30, Math.PI / 4, 0, Math.PI * 2);
                ctx.fill();
            }

            // Valles Marineris canyon rift
            ctx.strokeStyle = '#421607';
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(w * 0.35, h * 0.52);
            ctx.bezierCurveTo(w * 0.45, h * 0.54, w * 0.52, h * 0.50, w * 0.65, h * 0.53);
            ctx.stroke();

            // Polar CO2 / water ice caps
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.ellipse(w * 0.5, h * 0.04, w * 0.25, h * 0.04, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.beginPath();
            ctx.ellipse(w * 0.5, h * 0.96, w * 0.22, h * 0.04, 0, 0, Math.PI * 2);
            ctx.fill();
        });
        return this.textureCache.mars;
    }

    // Generate Asteroid Rocky Surface Texture
    getAsteroidTexture() {
        if (this.textureCache.asteroid) return this.textureCache.asteroid;
        this.textureCache.asteroid = this.createProceduralCanvas(512, 256, (ctx, w, h) => {
            ctx.fillStyle = '#4a443d';
            ctx.fillRect(0, 0, w, h);

            // Craggy variations
            for (let i = 0; i < 400; i++) {
                const cx = Math.random() * w;
                const cy = Math.random() * h;
                const r = 2 + Math.random() * 12;
                ctx.fillStyle = Math.random() > 0.5 ? '#695f54' : '#2b2723';
                ctx.beginPath();
                ctx.arc(cx, cy, r, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        return this.textureCache.asteroid;
    }

    // Build the Earth System (Earth, Clouds, Atmospheric Glow)
    createEarth(radius = 120, pos = new THREE.Vector3(0, 0, 0)) {
        const earthGroup = new THREE.Group();
        earthGroup.position.copy(pos);

        // Core Planet Sphere
        const geom = new THREE.SphereGeometry(radius, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            map: this.getEarthTexture(),
            roughness: 0.65,
            metalness: 0.1
        });
        const earthMesh = new THREE.Mesh(geom, mat);
        earthMesh.castShadow = true;
        earthMesh.receiveShadow = true;
        earthGroup.add(earthMesh);

        // Cloud Layer
        const cloudGeom = new THREE.SphereGeometry(radius * 1.018, 64, 64);
        const cloudMat = new THREE.MeshStandardMaterial({
            map: this.getCloudsTexture(),
            transparent: true,
            opacity: 0.7,
            blending: THREE.AdditiveBlending
        });
        const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
        earthGroup.add(cloudMesh);

        // Atmospheric Fresnel Halo Glow
        const atmosGeom = new THREE.SphereGeometry(radius * 1.06, 64, 64);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0x4da6ff,
            transparent: true,
            opacity: 0.22,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
        earthGroup.add(atmosMesh);

        this.bodies.earth = {
            group: earthGroup,
            planet: earthMesh,
            clouds: cloudMesh,
            radius: radius,
            rotationSpeed: 0.0008,
            cloudSpeed: 0.0012,
            name: "Earth"
        };
        this.scene.add(earthGroup);
        return earthGroup;
    }

    // Build the Moon
    createMoon(radius = 35, pos = new THREE.Vector3(750, 40, -400)) {
        const moonGroup = new THREE.Group();
        moonGroup.position.copy(pos);

        const geom = new THREE.SphereGeometry(radius, 48, 48);
        const mat = new THREE.MeshStandardMaterial({
            map: this.getMoonTexture(),
            roughness: 0.92,
            metalness: 0.05
        });
        const moonMesh = new THREE.Mesh(geom, mat);
        moonMesh.castShadow = true;
        moonMesh.receiveShadow = true;
        moonGroup.add(moonMesh);

        this.bodies.moon = {
            group: moonGroup,
            mesh: moonMesh,
            radius: radius,
            rotationSpeed: 0.0003,
            name: "Moon"
        };
        this.scene.add(moonGroup);
        return moonGroup;
    }

    // Build Mars
    createMars(radius = 70, pos = new THREE.Vector3(1600, 120, -1200)) {
        const marsGroup = new THREE.Group();
        marsGroup.position.copy(pos);

        const geom = new THREE.SphereGeometry(radius, 64, 64);
        const mat = new THREE.MeshStandardMaterial({
            map: this.getMarsTexture(),
            roughness: 0.85,
            metalness: 0.12
        });
        const marsMesh = new THREE.Mesh(geom, mat);
        marsMesh.castShadow = true;
        marsMesh.receiveShadow = true;
        marsGroup.add(marsMesh);

        // Thin Martian Dust Haze
        const atmosGeom = new THREE.SphereGeometry(radius * 1.035, 48, 48);
        const atmosMat = new THREE.MeshBasicMaterial({
            color: 0xdf8450,
            transparent: true,
            opacity: 0.18,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        const atmosMesh = new THREE.Mesh(atmosGeom, atmosMat);
        marsGroup.add(atmosMesh);

        this.bodies.mars = {
            group: marsGroup,
            mesh: marsMesh,
            radius: radius,
            rotationSpeed: 0.0007,
            name: "Mars"
        };
        this.scene.add(marsGroup);
        return marsGroup;
    }

    // Build a Detailed 3D Space Station (ISS style)
    createSpaceStation(pos = new THREE.Vector3(0, 160, -80)) {
        const station = new THREE.Group();
        station.position.copy(pos);

        // Materials
        const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.3 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.2 });
        const panelMat = new THREE.MeshStandardMaterial({
            color: 0x0a3c74,
            emissive: 0x051b36,
            roughness: 0.2,
            metalness: 0.7
        });

        // Central Habitation Spine (Pressurized Modules)
        const spineGeom = new THREE.CylinderGeometry(2.5, 2.5, 36, 16);
        const spine = new THREE.Mesh(spineGeom, metalMat);
        spine.rotation.z = Math.PI / 2;
        station.add(spine);

        // Cross Module / Node
        const crossGeom = new THREE.CylinderGeometry(2.2, 2.2, 22, 16);
        const cross = new THREE.Mesh(crossGeom, metalMat);
        station.add(cross);

        // Integrated Truss Structure (Main Girder)
        const trussGeom = new THREE.BoxGeometry(75, 1.2, 1.2);
        const truss = new THREE.Mesh(trussGeom, metalMat);
        truss.position.y = 4;
        station.add(truss);

        // Solar Array Wings (4 giant double arrays)
        const wingXOffsets = [-32, -18, 18, 32];
        wingXOffsets.forEach(x => {
            const arrayGeom = new THREE.BoxGeometry(8, 0.2, 24);
            const arrayMesh = new THREE.Mesh(arrayGeom, panelMat);
            arrayMesh.position.set(x, 4, 0);
            station.add(arrayMesh);
        });

        // Radiator Heat Dissipation Panels
        const radGeom = new THREE.BoxGeometry(12, 0.1, 7);
        const radMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
        const rad1 = new THREE.Mesh(radGeom, radMat);
        rad1.position.set(-6, -3, 0);
        rad1.rotation.x = Math.PI / 4;
        station.add(rad1);

        // Docking Port Ring
        const ringGeom = new THREE.TorusGeometry(2.8, 0.4, 8, 24);
        const ringMesh = new THREE.Mesh(ringGeom, goldMat);
        ringMesh.position.set(0, 11, 0);
        ringMesh.rotation.x = Math.PI / 2;
        station.add(ringMesh);

        // Flashing Docking Beacon Light
        const beaconLight = new THREE.PointLight(0x00ff88, 1.5, 60);
        beaconLight.position.set(0, 12, 0);
        station.add(beaconLight);

        this.bodies.iss = {
            group: station,
            radius: 40,
            beacon: beaconLight,
            name: "International Space Station"
        };
        this.scene.add(station);
        return station;
    }

    // Build Realistic 3D Procedural Asteroids (with vertex distortion)
    createAsteroid(radius = 15, pos = new THREE.Vector3(0, 0, 0), metalType = false) {
        // Distort sphere vertices to create jagged asteroid shape
        const geom = new THREE.DodecahedronGeometry(radius, 2);
        const posAttr = geom.attributes.position;
        const v = new THREE.Vector3();
        for (let i = 0; i < posAttr.count; i++) {
            v.fromBufferAttribute(posAttr, i);
            const noise = 1 + (Math.sin(v.x * 0.4) * Math.cos(v.y * 0.4) * Math.sin(v.z * 0.4)) * 0.35;
            v.multiplyScalar(noise);
            posAttr.setXYZ(i, v.x, v.y, v.z);
        }
        geom.computeVertexNormals();

        const mat = new THREE.MeshStandardMaterial({
            map: this.getAsteroidTexture(),
            roughness: metalType ? 0.35 : 0.88,
            metalness: metalType ? 0.75 : 0.15,
            color: metalType ? 0xc4b7a6 : 0x777067
        });

        const asteroid = new THREE.Mesh(geom, mat);
        asteroid.position.copy(pos);
        asteroid.castShadow = true;
        asteroid.receiveShadow = true;

        asteroid.userData = {
            radius: radius,
            rotAxis: new THREE.Vector3(
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02,
                (Math.random() - 0.5) * 0.02
            ),
            isAsteroid: true,
            isMetal: metalType
        };

        this.asteroids.push(asteroid);
        this.scene.add(asteroid);
        return asteroid;
    }

    // Generate an Asteroid Belt / Field around a target region
    createAsteroidField(count = 70, center = new THREE.Vector3(800, 0, -800), spread = 650) {
        for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * spread;
            const px = center.x + Math.cos(angle) * dist;
            const py = center.y + (Math.random() - 0.5) * (spread * 0.4);
            const pz = center.z + Math.sin(angle) * dist;
            const r = 4 + Math.random() * 26;
            const isMetal = Math.random() < 0.25;
            this.createAsteroid(r, new THREE.Vector3(px, py, pz), isMetal);
        }
    }

    // Interactive 3D Science Anomalies & Target Checkpoints
    createScienceMarker(pos, label = "Water Ice Signature", points = 250, type = "ice") {
        const markerGroup = new THREE.Group();
        markerGroup.position.copy(pos);

        // Holographic Glowing Ring
        const ringGeom = new THREE.TorusGeometry(6, 0.4, 16, 32);
        const color = type === 'ice' ? 0x00f0ff : (type === 'metal' ? 0xffcc00 : 0x00ff88);
        const ringMat = new THREE.MeshBasicMaterial({
            color: color,
            wireframe: true,
            transparent: true,
            opacity: 0.85
        });
        const ring = new THREE.Mesh(ringGeom, ringMat);
        ring.rotation.x = Math.PI / 2;
        markerGroup.add(ring);

        // Core Glowing Crystal / Specimen
        const coreGeom = new THREE.OctahedronGeometry(2.5, 0);
        const coreMat = new THREE.MeshStandardMaterial({
            color: color,
            emissive: color,
            emissiveIntensity: 0.6,
            roughness: 0.2
        });
        const core = new THREE.Mesh(coreGeom, coreMat);
        markerGroup.add(core);

        // Pulsing Point Light
        const pLight = new THREE.PointLight(color, 2, 45);
        markerGroup.add(pLight);

        markerGroup.userData = {
            label: label,
            points: points,
            type: type,
            collected: false,
            core: core,
            ring: ring,
            light: pLight
        };

        this.scienceMarkers.push(markerGroup);
        this.scene.add(markerGroup);
        return markerGroup;
    }

    // Animation Tick for Celestial Bodies, Clouds, and Asteroids
    update(delta = 0.016, time = 0) {
        // Rotate Earth & Clouds
        if (this.bodies.earth) {
            this.bodies.earth.planet.rotation.y += this.bodies.earth.rotationSpeed;
            this.bodies.earth.clouds.rotation.y += this.bodies.earth.cloudSpeed;
        }

        // Rotate Moon
        if (this.bodies.moon) {
            this.bodies.moon.mesh.rotation.y += this.bodies.moon.rotationSpeed;
        }

        // Rotate Mars
        if (this.bodies.mars) {
            this.bodies.mars.mesh.rotation.y += this.bodies.mars.rotationSpeed;
        }

        // Rotate ISS Space Station
        if (this.bodies.iss) {
            this.bodies.iss.group.rotation.y += 0.0005;
            // Beacon blink
            if (this.bodies.iss.beacon) {
                this.bodies.iss.beacon.intensity = 1.0 + Math.sin(time * 5) * 0.8;
            }
        }

        // Rotate Asteroids
        this.asteroids.forEach(ast => {
            ast.rotation.x += ast.userData.rotAxis.x;
            ast.rotation.y += ast.userData.rotAxis.y;
            ast.rotation.z += ast.userData.rotAxis.z;
        });

        // Animate Science Markers
        this.scienceMarkers.forEach(m => {
            if (!m.userData.collected) {
                m.userData.core.rotation.y += 0.02;
                m.userData.core.rotation.x += 0.015;
                m.userData.ring.rotation.z += 0.01;
                const scale = 1.0 + Math.sin(time * 4) * 0.15;
                m.userData.core.scale.set(scale, scale, scale);
            }
        });
    }

    // Clear and reset celestial environment for new mission
    clearEnvironment() {
        this.asteroids.forEach(ast => this.scene.remove(ast));
        this.asteroids = [];
        this.scienceMarkers.forEach(m => this.scene.remove(m));
        this.scienceMarkers = [];
        Object.keys(this.bodies).forEach(k => {
            this.scene.remove(this.bodies[k].group);
        });
        this.bodies = {};
    }
}
