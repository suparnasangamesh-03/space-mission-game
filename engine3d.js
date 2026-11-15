/**
 * SPACE MISSION 3D – NASA EXPLORER
 * Three.js 3D Engine, Deep Space Environment, Lighting & Camera Manager
 */

class SpaceEngine {
    constructor(canvasContainerId) {
        this.container = document.getElementById(canvasContainerId);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        
        // Camera Modes: 'chase', 'cockpit', 'cinematic'
        this.cameraMode = 'chase';
        this.cameraOffset = new THREE.Vector3(0, 7.5, 22);
        this.cameraLookOffset = new THREE.Vector3(0, 1.5, -12);
        
        // Starfields & Nebulae
        this.starfield = null;
        this.nebulaParticles = null;
        this.sunLight = null;

        this.init();
    }

    init() {
        // 1. Scene
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.FogExp2(0x020512, 0.00012);

        // 2. Camera
        const aspect = window.innerWidth / window.innerHeight;
        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 50000);
        this.camera.position.set(0, 15, 35);

        // 3. WebGL Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.15;
        this.container.appendChild(this.renderer.domElement);

        // 4. Deep Space Illumination
        this.setupLighting();

        // 5. Starfields & Deep Galaxies
        this.setupCosmos();

        // 6. Window Resize Listener
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupLighting() {
        // The Sun (Primary Directional Light)
        this.sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
        this.sunLight.position.set(1800, 900, 1200);
        this.sunLight.castShadow = true;
        this.sunLight.shadow.mapSize.width = 2048;
        this.sunLight.shadow.mapSize.height = 2048;
        this.sunLight.shadow.camera.near = 10;
        this.sunLight.shadow.camera.far = 4000;
        const d = 300;
        this.sunLight.shadow.camera.left = -d;
        this.sunLight.shadow.camera.right = d;
        this.sunLight.shadow.camera.top = d;
        this.sunLight.shadow.camera.bottom = -d;
        this.scene.add(this.sunLight);

        // Ambient Deep Space Glow (Subtle starlight)
        const ambientLight = new THREE.AmbientLight(0x18243b, 0.55);
        this.scene.add(ambientLight);

        // Distant Sun Visual Flare Sphere
        const sunGeom = new THREE.SphereGeometry(75, 32, 32);
        const sunMat = new THREE.MeshBasicMaterial({ color: 0xfffaed });
        const sunMesh = new THREE.Mesh(sunGeom, sunMat);
        sunMesh.position.copy(this.sunLight.position);
        this.scene.add(sunMesh);

        // Sun Corona Glow
        const coronaGeom = new THREE.SphereGeometry(120, 32, 32);
        const coronaMat = new THREE.MeshBasicMaterial({
            color: 0xffaa33,
            transparent: true,
            opacity: 0.28,
            blending: THREE.AdditiveBlending,
            side: THREE.BackSide
        });
        const corona = new THREE.Mesh(coronaGeom, coronaMat);
        corona.position.copy(this.sunLight.position);
        this.scene.add(corona);
    }

    setupCosmos() {
        // Multi-layered Starfield (8,000 stars with spectral colors)
        const starCount = 8000;
        const starGeom = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);

        const colorPalette = [
            new THREE.Color(0xffffff), // White
            new THREE.Color(0x9db4ff), // O/B Blue
            new THREE.Color(0xffd2a1), // Yellow/Orange
            new THREE.Color(0xff6b6b), // Red Giant
            new THREE.Color(0x00f0ff)  // Cyan
        ];

        for (let i = 0; i < starCount; i++) {
            // Spherical distribution
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const r = 12000 + Math.random() * 8000;

            positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i * 3 + 2] = r * Math.cos(phi);

            const col = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = col.r;
            colors[i * 3 + 1] = col.g;
            colors[i * 3 + 2] = col.b;
        }

        starGeom.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        starGeom.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const starMat = new THREE.PointsMaterial({
            size: 2.2,
            vertexColors: true,
            transparent: true,
            opacity: 0.9,
            sizeAttenuation: false
        });

        this.starfield = new THREE.Points(starGeom, starMat);
        this.scene.add(this.starfield);

        // Procedural Nebula Gas Clouds
        const nebulaCount = 600;
        const nebGeom = new THREE.BufferGeometry();
        const nebPositions = new Float32Array(nebulaCount * 3);
        const nebColors = new Float32Array(nebulaCount * 3);

        for (let i = 0; i < nebulaCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 3000 + Math.random() * 6000;
            const spread = 800;

            nebPositions[i * 3] = Math.cos(angle) * dist + (Math.random() - 0.5) * spread;
            nebPositions[i * 3 + 1] = (Math.random() - 0.5) * 1200;
            nebPositions[i * 3 + 2] = Math.sin(angle) * dist + (Math.random() - 0.5) * spread;

            // Deep purple / electric cyan cosmic dust colors
            const isCyan = Math.random() > 0.5;
            nebColors[i * 3] = isCyan ? 0.05 : 0.65;
            nebColors[i * 3 + 1] = isCyan ? 0.45 : 0.05;
            nebColors[i * 3 + 2] = isCyan ? 0.95 : 0.85;
        }

        nebGeom.setAttribute('position', new THREE.BufferAttribute(nebPositions, 3));
        nebGeom.setAttribute('color', new THREE.BufferAttribute(nebColors, 3));

        const nebMat = new THREE.PointsMaterial({
            size: 140,
            vertexColors: true,
            transparent: true,
            opacity: 0.22,
            blending: THREE.AdditiveBlending
        });

        this.nebulaParticles = new THREE.Points(nebGeom, nebMat);
        this.scene.add(this.nebulaParticles);
    }

    // Dynamic Smooth Camera Follow Modes
    updateCamera(spacecraft, delta) {
        if (!spacecraft || !spacecraft.mesh) return;

        if (this.cameraMode === 'chase') {
            // Chase camera: smooth spring follow behind and slightly above spacecraft
            const shipQuat = spacecraft.group.quaternion;
            const offset = this.cameraOffset.clone().applyQuaternion(shipQuat);
            const targetPos = spacecraft.position.clone().add(offset);

            // Add dynamic speed FOV expansion
            const targetFov = 60 + spacecraft.throttle * 12;
            this.camera.fov += (targetFov - this.camera.fov) * delta * 3.0;
            this.camera.updateProjectionMatrix();

            // Smooth interpolation
            this.camera.position.lerp(targetPos, delta * 4.5);

            const lookTarget = spacecraft.position.clone().add(
                this.cameraLookOffset.clone().applyQuaternion(shipQuat)
            );
            this.camera.lookAt(lookTarget);

        } else if (this.cameraMode === 'cockpit') {
            // Cockpit view: front sensor deck
            const shipQuat = spacecraft.group.quaternion;
            const cockpitOffset = new THREE.Vector3(0, 1.4, -2.8).applyQuaternion(shipQuat);
            this.camera.position.copy(spacecraft.position.clone().add(cockpitOffset));

            const forward = new THREE.Vector3(0, 0, -20).applyQuaternion(shipQuat);
            this.camera.lookAt(this.camera.position.clone().add(forward));

        } else if (this.cameraMode === 'cinematic') {
            // Orbiting cinematic inspection camera
            const time = Date.now() * 0.0004;
            const radius = 32;
            this.camera.position.set(
                spacecraft.position.x + Math.sin(time) * radius,
                spacecraft.position.y + 12 + Math.sin(time * 0.5) * 6,
                spacecraft.position.z + Math.cos(time) * radius
            );
            this.camera.lookAt(spacecraft.position);
        }
    }

    setCameraMode(mode) {
        this.cameraMode = mode;
        if (mode === 'cockpit') {
            this.camera.fov = 75;
            this.camera.updateProjectionMatrix();
        } else if (mode === 'chase') {
            this.camera.fov = 60;
            this.camera.updateProjectionMatrix();
        }
    }

    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    render() {
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
}
