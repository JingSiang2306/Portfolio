module.exports = `
===== PROFILE — Cheng Jing Siang =====
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

Contributed to a group project developing a Raspberry Pi elephant detection device with image/audio classification and API alerts.

2. Edge AI low-power water leak detection (FYP)

Developed an STM32U5-based Edge AI leak detection system using acoustic-vibration sensor
fusion with LoRa communication.


===== PROJECT 01 — Automated Elephant Detection & Early Warning System =====
Type: Group project. Goal: solar-powered edge device for real-time elephant detection and early warning in remote areas to reduce human-elephant conflict.

CONTRIBUTION CONTEXT
- Group outcome: the complete image/audio detection and warning system. The supplied project excerpt focuses on mechanical design, structural analysis and YOLO image training. The full allocation of individual responsibilities is not documented; do not attribute all subsystems or team leadership to Jing Siang.

SYSTEM
- Raspberry Pi 5-based device with camera + microphone; image and audio ML run locally for faster response and less dependence on internet/cloud.
- Detection data (image/audio, timestamp, confidence) is sent by API over 4G to a database/website; Telegram provides alerts. An hourly handshake reports device status.
- Failed uploads are retried up to three times, then saved locally for manual retrieval. Stored failures are not automatically uploaded when connectivity returns.
- Power: 18Ah battery + two 50W solar panels (100W total) + solar charge controller. Prototype runtime was about 16–18h; power remained a limitation in poor sunlight.

AI
- Image: YOLO-based object detection using a pretrained YOLOv11 model; trained on elephant and other-object classes. Reported elephant-class image detection performance: ~95%; this is not overall multi-class or combined image/audio system accuracy.
- Audio: PyTorch-based classifier trained on elephant/background sounds. Reported accuracy: 92.33% overall in one presentation result; best setup reported 95.56% elephant detection and 86.96% noise detection.
- Image + audio integration was reported to improve robustness, but no combined-system accuracy is specified. False positives include humans resembling elephants. Audio detection is limited by elephant vocalization frequency, microphone placement, distance, and environmental noise.

MECHANICAL DESIGN
- Compact weather-resistant enclosure: 2mm 6061-O aluminium outer case + PETG 3D-printed modular inner holders for Raspberry Pi, battery, cameras, microphone, controller and other components.
- Rubber gasket, cable gland, vent and fan provide weather protection and cooling. Practical weather/impact testing was reported, but manual bending caused gasket misalignment and microphone protection reduced audio sensitivity. Heavy-rain protection remained limited; no certified IP rating is documented.
- SolidWorks static simulations compared enclosure thicknesses using deformation and factor of safety to support the 2mm aluminium choice, balancing strength and weight.
- Tree mounting uses cargo straps, but camera/vent clearance restricts strap placement and deployment flexibility. 3D-printed holders were designed in SolidWorks for assembly and maintenance.

CHALLENGES
Power, rural 4G reliability, audio range/noise, image false positives, waterproofing tolerances, and tree-mounting constraints limited field readiness.

FUTURE
Improve 24h power autonomy, false alarms, microphone sensitivity, mounting, weatherproofing and connectivity. GPS, distributed networking and stronger security are future concepts, not completed features.


===== PROJECT 02 — Edge AI Low-Power Water Leak Detection (FYP) =====
Goal: proof-of-concept low-power embedded leak detection using acoustic + vibration sensing, on-device AI, temporal late fusion, and wireless reporting.

CORE SYSTEM
- Platform: STM32U585AI MCU on B-U585I-IOT02A.
- Sensors: onboard MEMS microphone MP23DB01HP for acoustic signals and ISM330DHCX 3-axis accelerometer for pipe vibration.
- AI: NanoEdge AI Studio (NEAI) generated separate embedded classifiers: XGB (gradient-boosted trees) for acoustics and MLP (a neural network) for vibration. Firmware combines their outputs using late-fusion decision logic.
- Wireless: LoRa peer-to-peer (P2P) transmits leak-related results.
- Operating concept: periodic wake → sense/infer → transmit result → sleep.

EXPERIMENTAL RIG
- Controlled laboratory rig uses a straight 25mm PVC pipe. Replaceable leak sections provide no-leak, 0.5, 1, 2.5, 5 and 10mm circular holes.
- Sensor-to-leak distance is adjustable from about 30cm to 1.14m.
- Rig supports repeatable leak/background data collection and final embedded validation. Main limitations: straight PVC only, limited distances, circular holes, and no broad variation in pipe material, diameter, flow rate, geometry or leak type.

DATASET / MODEL DEVELOPMENT
- Developed a Python data logger with a user interface to capture acoustic/vibration streams over ST-LINK virtual COM/UART and automatically generate 512-sample training buffers for NEAI.
- Collected leak/background recordings on the rig. Acoustic sampling was 16kHz; vibration approximately 6.667kHz. Optional benchmark exports were 16kHz mono WAV for acoustics and a one-column signal file for vibration.
- NEAI benchmarking searches combinations of preprocessing/model settings suited to the MCU; the engineering focus is dataset quality, consistent sampling, and representative leak/background conditions.
- Developed both acoustic and vibration classifiers in a YAMNet-inspired comparison pipeline: an MFCC-based 2D CNN for acoustics and a raw-signal 1D CNN for vibration. Do not describe both as standard pretrained YAMNet models.
- Converted both through TensorFlow Lite and STM32Cube AI Studio for embedded deployment. PC test accuracy was 96.7% acoustic/94.5% vibration; deployed rig accuracy fell to 38.8%/30.4%. These were different evaluation settings, so the drop cannot be attributed to conversion alone. NEAI was more practical in this prototype.

DECISION LOGIC / LATE FUSION
- Each detection cycle lasts 30s and is divided into 3s segments. Short inferences are aggregated first at segment level, then across the 30s window.
- The later V2 decision logic uses sustained leak evidence, strong segments, leak-segment ratio, and agreement between modalities instead of relying on one short inference.
- Final fusion weights are 80% acoustic and 20% vibration, reflecting stronger acoustic performance. Thresholds and weights were tuned empirically on the rig. V2-DL V2 means detection model V2 with decision logic V2.

RESULTS
- Best final embedded detection accuracy: 88.0% with V2-DL V2.
- Other final versions: V1-DL V1 80.0%, V1-DL V2 84.0%, V3-DL V2 72.0%.
- For the selected setup: raw acoustic/vibration accuracy 0.73/0.65; after 3s logic 0.75/0.69; final 30s accuracy 0.88. Final precision 0.84, recall 1.00, specificity 0.67, F1 0.91, balanced accuracy 0.83.
- The layered 3s→30s logic improved accuracy and stability. Recall 1.00 means no missed leaks in the evaluated cases; false alarms remained. These controlled-rig results do not establish real-world pipeline performance.

LOW-POWER RESULTS
- Firmware successfully demonstrated periodic sleep/wake behavior and MCU deep-sleep modes.
- However, the full B-U585I-IOT02A board consumed about 113–129mA even during “Power saving”, so board-level overhead dominates total power.
- MCU-only STOP3 measured 3–8 microamps, far below full-board current. Low-power operation was therefore only partially achieved; a custom PCB with controlled peripheral power is needed for practical battery deployment.

MECHANICAL PROTOTYPE
- SolidWorks-designed 3D-printed holder integrates the MCU board, battery/power hardware and LoRa module and clamps securely to the pipe without modifying it.
- Holder provides repeatable sensor coupling, access to switch/ST-LINK/antenna, cable routing and maintainability. It is prototype-specific rather than a finished field enclosure.

OBJECTIVES / STRETCH GOALS
- Achieved: rig, embedded AI, integrated holder/prototype, controlled system validation, LoRa P2P and alternative-model benchmarking.
- Partially achieved: low-power operation. Not achieved: refined LED indication, Bluetooth and leak localization.

FUTURE WORK
Expand dataset/rig diversity (leak shapes, pipe materials/diameters, bends/branches, flow rate, longer distances); improve holder adaptability and waterproofing; develop a custom low-power PCB; improve acoustic sensitivity and field validation.

PROJECT MANAGEMENT / REFLECTION
Project development became iterative due to board changes, component delivery, requirement clarification, dataset expansion and testing. Main lessons: finalize requirements earlier, plan procurement/risk buffers, improve dataset quality, prioritize core deliverables, and write documentation continuously.

`;