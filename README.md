# SPACE MISSION 3D – NASA EXPLORER
### NASA Space Apps Hackathon Project

> **"Exploring the Cosmos Through Spacecraft Engineering, Mission Planning & 3D Simulation"**

![NASA Space Apps](https://img.shields.io/badge/NASA-Space%20Apps%20Hackathon-0b3d91?style=for-the-badge)
![Three.js](https://img.shields.io/badge/Three.js-3D%20Graphics-000000?style=for-the-badge&logo=three.js)
![HTML5 Canvas](https://img.shields.io/badge/HTML5-WebGL-E34F26?style=for-the-badge&logo=html5)
![JavaScript ES6](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript)

---

## 🚀 Overview & Mission Statement

**SPACE MISSION 3D – NASA EXPLORER** is an educational, fully playable 3D space exploration and spacecraft engineering simulation game built for the **NASA Space Apps Hackathon**. 

The simulation teaches players how real NASA missions are architected and how critical spacecraft engineering trade-offs (mass, power generation, structural materials, specific impulse, launch vehicle payload margins, and communications latency) directly dictate mission success or failure.

Players design their own modular space probe in an interactive 3D CAD bay, select launch vehicles and orbital insertion trajectories, pilot through realistic 6DOF space environments, avoid hazardous asteroids, manage finite electrical and propellant budgets, withstand unforeseen space anomalies (solar flares, micrometeorite strikes, reaction wheel saturation), and conduct groundbreaking planetary science.

---

## 🎮 Key Features

### 1. 🌌 Photorealistic 3D Space Environment (Three.js)
- **Procedural Canvas Textures:** Earth (continents, ocean specular reflection, dynamic dual-layer cloud atmosphere, atmospheric blue halo glow), Moon (impact craters, basaltic maria plains), Mars (rust-red oxidized terrain, Valles Marineris rift, polar ice caps), and Asteroids (dodecahedron geometry distortion with jagged vertices).
- **Deep Space Cosmos:** Multi-layered starfield with 8,000+ stars colored by realistic stellar spectral types (O/B blue giants, G yellow stars, M red dwarfs) and procedural cosmic dust nebulae.
- **Detailed Space Assets:** Fully modular 3D spacecraft, International Space Station (ISS) with solar trusses and flashing docking beacon, and satellites.
- **Dynamic Camera Modes:**
  - **Chase Camera:** Smooth spring lag damping with speed-reactive Field of View (FOV).
  - **Cockpit View:** First-person forward sensor deck perspective.
  - **Cinematic Orbit:** Free 360-degree inspection camera.

### 2. 🛠️ Interactive 3D Spacecraft Engineering Bay (CAD)
Customize 8 modular spacecraft subsystems with real-time 3D visual updates:
- **Structure & Chassis:** Lightweight Carbon Composite (450 kg), Aluminum-Lithium Bus (750 kg), Heavy Shielded Titanium with Gold MLI (1200 kg).
- **Solar Panels:** Rigid Triple-Junction Arrays (1,200W), UltraFlex Pleated Circular Arrays (2,000W), Perovskite Concentrators (3,200W).
- **Energy Storage:** Li-Ion Standard (15 kWh), Solid-State Matrix (28 kWh), Radioisotope Thermoelectric Generator / RTG (constant 500W decay power).
- **Communication Antennas:** Low-Gain Omni Patch (50 kbps), Medium-Gain Horn (500 kbps), High-Gain Deep Space Parabolic Dish (5,000 kbps).
- **Avionics & Computers:** Radiation-Hardened BAE RAD750, Dual Redundant Quad-Core CPU, Autonomous AI Quantum Co-Processor.
- **Propulsion Systems:** Hydrazine Monopropellant (Isp 230s, 400N), Bi-Propellant Chemical Rocket (Isp 325s, 1,500N), Hall-Effect Xenon Ion Engine (Isp 3,100s, 150N), Nuclear Thermal Propulsion / NTP (Isp 900s, 4,000N).
- **Scientific Payloads:** Magnetometer & Plasma Wave, Hyperspectral Spectrometer, Synthetic Aperture Radar (SAR), Surface TAG Harpoon Arm.
- **Navigation Sensors:** Autonomous Star Tracker, High-Res Telescopic Camera, 3D Flash LiDAR Altimeter.

### 3. 🚀 Orbital Mechanics & Launch Vehicle Sizing
- **Launch Vehicles:** Pegasus-X Light (1,200 kg), Atlas V / Vulcan Centaur (8,500 kg), SLS Block 1 Deep Space (27,000 kg), Starship Super Heavy (100,000 kg).
- **Payload Capacity Warning Engine:** Real-time mass verification prevents launch if spacecraft wet mass exceeds launch vehicle capability.
- **Orbital Insertion Regimes:** Low Earth Orbit (LEO), Polar Sun-Synchronous (SSO), Geostationary Orbit (GEO), and Interplanetary Transfer Trajectories.
- **Tsiolkovsky Rocket Equation:** Computes mission \(\Delta v = I_{sp} \cdot g_0 \cdot \ln(m_{initial} / m_{final})\).

### 4. 🛰️ 4 Authentic NASA Flight Missions
1. **Moon Exploration – Artemis Vanguard:** Execute Trans-Lunar Injection (TLI), achieve Lunar Orbit Insertion (LOI), scan Shackleton Crater for water ice volatiles, and deploy an autonomous surface prospector.
2. **Mars Exploration – Ares Odyssey:** Interplanetary cruise to the Red Planet, endure high-radiation solar storm events, execute aerobraking orbit capture, survey Jezero Crater river delta, and collect organic atmospheric signatures.
3. **Earth Observation – Terra Sentinel:** Deploy into high-inclination Polar Sun-Synchronous Orbit, conduct station-keeping rendezvous with the International Space Station (ISS), calibrate hyperspectral environmental radar, and track severe cyclonic storms.
4. **Asteroid Exploration – Psyche Harvester:** Navigate the chaotic Main Asteroid Belt, dodge tumbling boulders, rendezvous with metallic M-type asteroid 16 Psyche, and execute a precision Touch-and-Go (TAG) nickel-iron-platinum sample extraction.

### 5. 👥 Team Mode (4-Player Cooperative Console)
Multi-role cooperative simulation supporting 4 critical flight specialist stations:
- **Mission Commander (CDR):** Orbital burn authorizations, trajectory planning, safety flight envelope verifications.
- **Spacecraft Engineer (ENG):** Power bus balancing, battery preservation, RCS line pressure purging, avionics diagnostics.
- **Science Specialist (SCI):** Spectrometer frequency calibration, LiDAR sweeps, mineral regolith core classification.
- **Communication Specialist (COM):** Deep Space Network (DSN) ground tracking azimuth alignment, RF signal amplification, packet loss error clearing.

### 6. ⚠️ Random Space Emergencies & Decision Engine
Procedural crisis events demand quick engineering decisions:
- **Solar Flare Radiation Surge:** Orient heat shield vs safe mode vs risk electronics.
- **DSN Communications Conjunction Fade:** Boost RF amplifier vs switch to star tracker navigation.
- **Propulsion Pressure Bleed:** Isolate manifold valves vs thermal self-sealing polymer.
- **Reaction Wheel Saturation:** RCS counter-torque desaturation burn vs magnetic torquing.
- **Debris Field Collision Warning:** Retrograde burn vs manual evasive flight.

### 7. 📊 NASA Mission Debriefing Report & LocalStorage Leaderboard
- Multi-dimensional scoring formula factoring objectives, science return, propellant efficiency, hull survival, and time management.
- Final NASA Mission Certificate with official Administrator Commendation (Grades: S, A, B, C, D).
- LocalStorage persistence saves high scores, mission archives, and badges.

### 8. 🔊 Procedural Web Audio API Synthesizer
- Rocket engine rumble tied to real-time throttle.
- RCS cold-gas thruster bursts.
- Iconic NASA Apollo/Artemis Quindar beeps (2524 Hz and 2475 Hz).
- Proximity alerts, science scanner sonar pings, and tactile cockpit switches.
- **Zero external audio file dependencies** — 100% reliable offline sound.

---

## 🕹️ Flight Controls

### Desktop & Laptop (Keyboard & Mouse)
| Action | Keybinding |
| :--- | :--- |
| **Main Engine Throttle Up** | `W` or `Arrow Up` |
| **Throttle Down / Cut** | `S` or `Arrow Down` |
| **Yaw Left / Yaw Right** | `A` / `D` or `Arrow Left` / `Arrow Right` |
| **Roll Left / Roll Right** | `Q` / `E` |
| **Vertical Strafe (Up / Down)** | `R` / `F` |
| **Lateral Strafe (Left / Right)** | `Z` / `X` |
| **RCS Emergency Retro-Brake** | `SPACEBAR` |
| **Cycle Camera (Chase / Cockpit / Orbit)** | `C` |
| **Toggle Flight Assist (SAS Stabilization)** | `T` |
| **Trigger Pulse Scanner** | `1` |
| **Collect Scientific Sample** | `2` |
| **Transmit Telemetry to DSN** | `3` |
| **Pause / Return to Menu** | `P` or `ESC` |

### Mobile & Tablet (Touch Controls)
- **Virtual Thumbstick (Lower Left):** Steer pitch and yaw.
- **Tactile HUD Buttons (Lower Right):** One-tap buttons for throttle, pulse scan, sample collection, probe deployment, and braking.

---

## 💻 Installation & How to Run

The game is completely standalone with **zero external npm build steps required**. Three.js and OrbitControls are bundled locally in `lib/` with automatic CDN fallback.

### Option 1: Direct Browser Launch (Fastest)
Double-click `index.html` in your file explorer to open directly in Google Chrome, Microsoft Edge, Firefox, or Safari.

### Option 2: Python 3 Development Server (Recommended)
Open a terminal in this project folder and run:
```bash
python server.py
```
Open your browser to: **`http://localhost:8000`**

### Option 3: Node.js Development Server
If Node.js is installed on your machine, run:
```bash
node server.js
```
Open your browser to: **`http://localhost:3000`**

---

## 📁 Project Structure

```
NASA_SPACE_MISSION/
├── index.html               # Main HTML5 interface with NASA Mission Control HUD & overlays
├── server.js                # Zero-dependency Node.js HTTP local development server
├── server.py                # Zero-dependency Python 3 HTTP local development server
├── README.md                # Comprehensive documentation, flight manual & hackathon guide
├── css/
│   └── style.css            # NASA dark space aesthetic, glass cockpit HUD, animations
├── js/
│   ├── main.js              # Master game coordinator, state machine & input engine
│   ├── engine3d.js          # Three.js scene, deep space lighting, stars, nebulae, cameras
│   ├── spacecraft.js        # Modular 3D spacecraft builder, RCS jets, plume & 6DOF physics
│   ├── celestial.js         # Procedural planet textures (Earth, Moon, Mars, Asteroids, ISS)
│   ├── missions.js          # 4 mission scenarios, objectives, checkpoints & coordinates
│   ├── customizer.js        # Spacecraft engineering bay, parts catalog & rocket calculations
│   ├── teamMode.js          # 4 cooperative stations (Commander, Engineer, Science, Comms)
│   ├── events.js            # Random space challenges, emergency alerts & branching decisions
│   ├── hud.js               # Real-time telemetry dashboard, 3D target reticle & navball
│   ├── scoring.js           # Multi-dimensional scoring, LocalStorage leaderboard & report
│   └── audio.js             # Web Audio API synthesizer for engine roar, Quindar tones & alarms
└── lib/
    ├── three.min.js         # Three.js 3D library (bundled for full offline capability)
    └── OrbitControls.js     # Three.js camera controls
```

---

## 🔬 Scientific & Engineering Principles

1. **Tsiolkovsky Rocket Equation:** Spacecraft velocity change (\(\Delta v\)) depends logarithmically on the mass ratio (\(m_0 / m_f\)) and specific impulse (\(I_{sp}\)). Choosing high-\(I_{sp}\) ion engines grants immense delta-V at the expense of electric power and thrust.
2. **Power Budgeting & The Inverse Square Law:** Solar panel power output is inversely proportional to the square of the distance from the Sun. For deep space missions to Mars and the Asteroid Belt, players are encouraged to equip RTGs (Radioisotope Thermoelectric Generators).
3. **Attitude Determination & Control (ADCS):** Reaction wheel momentum saturation requires RCS counter-torque desaturation maneuvers. The SAS (Stability Augmentation System) actively counteracts angular momentum drift.
4. **Deep Space Network (DSN) Communications:** Radio frequency link margins deteriorate across astronomical distances. High-gain parabolic antennas require accurate pointing and continuous electrical power to maintain high-bandwidth science downlinks.

---

## 🏆 NASA Space Apps Hackathon Submission Highlights

- **Educational Impact:** Directly exposes players to real aerospace engineering dilemmas.
- **Zero Asset Dependencies:** All planet textures, sound effects, and 3D models are generated procedurally in code — guaranteed to run anywhere, anytime, without CORS errors or broken asset links.
- **Cross-Platform:** Responsive on mobile, tablet, laptop, and ultra-wide desktop monitors.
- **Presentation Ready:** Includes printable NASA Flight Certificates, real-time telemetry HUD, and animated 3D celestial views.

*Developed for the NASA Space Apps Hackathon.*
