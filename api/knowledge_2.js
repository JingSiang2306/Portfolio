module.exports = `
===== DOCUMENT: Resume.pdf — Cheng Jing Siang's resume =====
--- PAGE 1 ---
SUMMARY
CHENG JING SIANG
Master’s degree with Honours in Mechatronic Engineering and graduate with a strong foundation in automation, mechanical
design, programming, and AI-based systems. Experienced in Mechatronic Engineering developing AI classification projects 
using machine learning, with hands-on expertise in SolidWorks, 3D printing, Python, C, and MATLAB. Strong problem-solving 
and teamwork skills, with an interest in automation, software development, and practical engineering solutions.

DETAILS
Email: 2306cjs@gmail.com
Phone: 012-548-8250

EXPERIENCE
1. Production Intern
META Research Sdn. Bhd., Selangor
•Supported production assembly, component inspection, and troubleshooting.
•Designed and fabricated 3D-printed fixtures and workstations using SolidWorks to improve production efficiency.

2. Technical Intern
Superdough Sdn. Bhd., Kuala Lumpur
•Designed and developed IoT-based electronic props with integrated sensors.
•Troubleshot and maintained electronic and sensor systems to ensure reliable operation.

SKILLS 
•Solidworks
•3D Printing
•MATLAB
•Python 
•Artificial Intelligence
•C Programming
•STM32
•Raspberry Pi

LANGUAGES
•Mandarin
•English

EDUCATION
Sep 2022 — Jul 2026
Master’s degree with Honours in Mechatronic Engineering
First-Class Honours
University of Nottingham Malaysia, Selangor

Sep 2021 — Sep 2022
Foundation in Engineering
University of Nottingham Malaysia, Selangor

Aug 2016 — Aug 2021
IGCSE
Austin Heights International School

PROJECTS
1. Automated Elephant Detection & Early Warning System (Group Project)

Developed an AI-based elephant detection device using Raspberry Pi with image/audio classification
and API alert notification.

2. Edge AI low-power water leak detection (FYP) 

Developed an STM32U5-based Edge AI leak detection system using acoustic-vibration sensor
fusion with LoRa communication.


===== PROJECT 01 — Automated Elephant Detection & Early Warning System =====
Type: Group project. Goal: solar-powered edge device for real-time elephant detection and early warning in remote areas to reduce human-elephant conflict.

SYSTEM
- Raspberry Pi-based device with camera + microphone; image and audio ML run locally for faster response and less dependence on internet/cloud.
- Detection data (image/audio, timestamp, confidence) is sent by API to a database/website; 4G provides connectivity, with local logging and resend attempts for failed uploads.
- Power: 18Ah battery + two 50W solar panels (100W total) + solar charge controller. Prototype runtime was about 16–18h; power remained a limitation in poor sunlight.

AI
- Image: YOLO-based object detection using a pretrained YOLOv11 model; trained on elephant and other-object classes. Best reported elephant detection accuracy: ~95%.
- Audio: PyTorch-based classifier trained on elephant/background sounds. Reported accuracy: 92.33% overall in one presentation result; best setup reported 95.56% elephant detection and 86.96% noise detection.
- Combining image + audio improves robustness, but false positives can occur, especially humans resembling elephants. Audio detection is limited by elephant vocalization frequency, microphone placement, distance, and environmental noise.

MECHANICAL DESIGN
- Compact weather-resistant enclosure: 2mm 6061-O aluminium outer case + PETG 3D-printed modular inner holders for Raspberry Pi, battery, cameras, microphone, controller and other components.
- Rubber gasket, cable gland, vent and fan provide weather protection and cooling. Prototype passed practical waterproof/impact checks, but manual bending caused gasket misalignment; microphone protection also reduced audio sensitivity.
- Tree mounting uses cargo straps, but camera/vent clearance restricts strap placement and deployment flexibility. 3D-printed holders were designed in SolidWorks for assembly and maintenance.

CHALLENGES
Power, rural 4G reliability, audio range/noise, image false positives, waterproofing tolerances, and tree-mounting constraints limited field readiness.

FUTURE
Improve 24h power autonomy, detection accuracy, microphone performance, mounting, weatherproofing, remote connectivity, GPS, scalability, and security. Commercial concepts include larger solar/battery capacity, better edge/hybrid models, LPWAN/satellite connectivity, distributed networking, rugged modular enclosure, encrypted/secure communication, and cost optimization.


===== PROJECT 02 — Edge AI Low-Power Water Leak Detection (FYP) =====
Goal: proof-of-concept low-power embedded leak detection using acoustic + vibration sensing, on-device AI, temporal late fusion, and wireless reporting.

CORE SYSTEM
- Platform: STM32U585AI MCU on B-U585I-IOT02A. Earlier plans considered other STM32 boards, but the final prototype used STM32U585AI.
- Sensors: onboard MEMS microphone MP23DB01HP for acoustic signals and ISM330DHCX 3-axis accelerometer for pipe vibration.
- AI: NanoEdge AI Studio (NEAI) generates embedded classification models. Acoustic and vibration models run separately, then outputs are combined by late-fusion decision logic.
- Wireless: LoRa peer-to-peer (P2P) transmits leak-related results.
- Operating concept: periodic wake → sense/infer → transmit result → sleep.

EXPERIMENTAL RIG
- Controlled laboratory rig uses a straight 25mm PVC pipe. Replaceable leak sections provide no-leak, 0.5, 1, 2.5, 5 and 10mm circular holes.
- Sensor-to-leak distance is adjustable from about 30cm to 1.14m.
- Rig supports repeatable leak/background data collection and final embedded validation. Main limitations: straight PVC only, limited distances, circular holes, and no broad variation in pipe material, diameter, flow rate, geometry or leak type.

DATASET / MODEL DEVELOPMENT
- Prototype recordings are collected on the rig under leak and background conditions. Data is exported for NEAI and optionally converted to 16kHz mono WAV for YAMNet benchmarking.
- NEAI benchmarking searches combinations of preprocessing/model settings suited to the MCU; the engineering focus is dataset quality, consistent sampling, and representative leak/background conditions.
- YAMNet was benchmarked as an alternative. It performed well in controlled training but degraded more after embedded conversion/deployment; NEAI was more practical for the constrained MCU.

DECISION LOGIC / LATE FUSION
- Each detection cycle lasts 30s and is divided into 3s segments. Short inferences are aggregated first at segment level, then across the 30s window.
- The later V2 decision logic uses sustained leak evidence, strong segments, leak-segment ratio, and agreement between modalities instead of relying on one short inference.
- Final acoustic/vibration fusion uses heavier acoustic weighting. The selected V2-DL V2 configuration was the best tested version.

RESULTS
- Best final embedded detection accuracy: 88.0% with V2-DL V2.
- Other final versions: V1-DL V1 80.0%, V1-DL V2 84.0%, V3-DL V2 72.0%.
- For the selected setup: raw acoustic/vibration accuracy 0.73/0.65; after 3s logic 0.75/0.69; final 30s accuracy 0.88. Final precision 0.84, recall 1.00, specificity 0.67, F1 0.91, balanced accuracy 0.83.
- The layered 3s→30s logic consistently improved stability and accuracy, but tests were controlled-rig results rather than proof of real-world pipeline performance.

LOW-POWER RESULTS
- Firmware successfully demonstrated periodic sleep/wake behavior and MCU deep-sleep modes.
- However, the full B-U585I-IOT02A board consumed about 113–129mA even during “Power saving”, so board-level overhead dominates total power.
- MCU-only sleep current was orders of magnitude lower; therefore the low-power objective was only partially achieved. A custom low-power PCB is needed for practical battery operation.

MECHANICAL PROTOTYPE
- SolidWorks-designed 3D-printed holder integrates the MCU board, battery/power hardware and LoRa module and clamps securely to the pipe without modifying it.
- Holder provides repeatable sensor coupling, access to switch/ST-LINK/antenna, cable routing and maintainability. It is prototype-specific rather than a finished field enclosure.

OBJECTIVES / STRETCH GOALS
- Achieved: controlled simulation rig, embedded acoustic/vibration AI, integrated prototype, complete system validation.
- Partially achieved: true low-power operation (MCU/firmware works; development board is too power-hungry).
- Achieved stretch goals: LoRa P2P and YAMNet benchmarking.
- Not achieved: refined LED indication, Bluetooth, leak localization.

FUTURE WORK
Expand dataset/rig diversity (leak shapes, pipe materials/diameters, bends/branches, flow rate, longer distances); improve holder adaptability and waterproofing; develop a custom low-power PCB; improve acoustic sensitivity and field validation.

PROJECT MANAGEMENT / REFLECTION
Project development became iterative due to board changes, component delivery, requirement clarification, dataset expansion and testing. Main lessons: finalize requirements earlier, plan procurement/risk buffers, improve dataset quality, prioritize core deliverables, and write documentation continuously.

`;