// v2.3: explicit rig noise coverage and introduction scoped to profile questions.
// Sources: uploaded v2.1; portfolio role statement confirmed by Jing Siang;
// Project 02 thesis sections 3.5.2–3.5.3, 4.1 (noise data), 4.2 and 4.3.3.
module.exports = `
===== PROFILE =====
Full name: Cheng Jing Siang. Everyday name: Jing Siang.
Profile introduction (only when asked about Jing Siang): Cheng Jing Siang is a Mechatronic Engineering graduate from the University of Nottingham Malaysia, where he earned a master's degree with First-Class Honours.
Background: automation, mechanical design, programming and practical AI classification systems; hands-on SolidWorks, 3D printing, Python, C and MATLAB. Interests: automation, software development and practical engineering solutions. Strengths: problem-solving and teamwork.
Contact: 2306cjs@gmail.com; 012-548-8250.
Skills: SolidWorks, 3D printing, MATLAB, Python, AI, C, STM32, Raspberry Pi.
Languages: Mandarin, English.

EXPERIENCE
- Production Intern, META Research Sdn. Bhd., Selangor: production assembly, component inspection and troubleshooting; designed and fabricated SolidWorks/3D-printed fixtures and workstations to improve production efficiency.
- Technical Intern, Superdough Sdn. Bhd., Kuala Lumpur: designed IoT electronic props with integrated sensors; troubleshot and maintained electronic/sensor systems.

EDUCATION
- Sep 2022–Jul 2026: Master's degree in Mechatronic Engineering, First-Class Honours, University of Nottingham Malaysia, Selangor.
- Sep 2021–Sep 2022: Foundation in Engineering, University of Nottingham Malaysia.
- Aug 2016–Aug 2021: IGCSE, Austin Heights International School.

===== PROJECT 01 — Automated Elephant Detection & Early Warning System =====
Type: group project. Goal: solar-powered edge device for real-time elephant detection and early warning in remote areas, reducing human-elephant conflict.

JING SIANG'S DOCUMENTED ROLE
- Led enclosure and internal mechanical design.
- Trained and deployed the elephant image-detection AI model on Raspberry Pi 5.
- Developed the main Raspberry Pi 5 program coordinating detection, control and the device's operating workflow.
These contributions are stated on his portfolio and confirmed by Jing Siang. Mechanical-design leadership is documented; overall team leadership and individual authorship of every subsystem are not specified. The complete image/audio detection and warning system is the group outcome.

SYSTEM
- Raspberry Pi 5, camera and microphone; image/audio ML runs locally for quicker response and reduced cloud dependence.
- Detection image/audio, timestamp and confidence uploaded by API over 4G to a database/website; Telegram alerts; hourly device-status handshake.
- Failed uploads: up to three retries, then local storage for manual retrieval; no automatic upload of stored failures after reconnection.
- Power: 18Ah battery, two 50W solar panels (100W total), solar charge controller; prototype runtime about 16–18h. Poor sunlight limits autonomy.

AI RESULTS
- Image: pretrained YOLOv11, trained for elephant/other-object classes. Reported elephant-class detection performance about 95%; not overall multiclass or combined image/audio accuracy.
- Audio: PyTorch elephant/background classifier. One presentation reports 92.33% overall; best setup reports 95.56% elephant detection and 86.96% noise detection.
- Image/audio integration improved robustness, but combined-system accuracy is unspecified. Image false positives included humans resembling elephants. Audio depends on vocalization, microphone placement, distance and background noise.

MECHANICAL DESIGN
- Compact weather-resistant enclosure: 2mm 6061-O aluminium case and modular PETG 3D-printed holders for the Raspberry Pi, battery, cameras, microphone, controller and components.
- SolidWorks static simulations compared deformation and factor of safety across thicknesses, supporting the strength/weight trade-off for 2mm aluminium.
- Gasket, cable gland, vent and fan provide weather protection/cooling. Practical weather/impact tests were reported; manual bending caused gasket misalignment, microphone protection reduced sensitivity, and heavy-rain protection remained limited. No certified IP rating.
- SolidWorks-designed holders support assembly/maintenance. Cargo-strap tree mounting is constrained by camera/vent clearance.

LIMITATIONS / FUTURE
Limitations: power, rural 4G reliability, audio range/noise, image false positives, weatherproofing tolerances and tree mounting.
Future: 24h autonomy, fewer false alarms, better microphones, mounting, weatherproofing and connectivity. GPS, distributed networking and stronger security remain proposals.

===== PROJECT 02 — Edge AI Low-Power Water Leak Detection =====
Type: final-year project. Goal: proof-of-concept embedded pipe-leak detection combining acoustic/vibration sensing, on-device AI, temporal sensor fusion and wireless reporting, with low-power operation as an objective.

FINAL NANOEDGE AI SYSTEM
- STM32U585AI MCU on B-U585I-IOT02A; MP23DB01HP MEMS microphone and ISM330DHCX 3-axis accelerometer.
- NanoEdge AI Studio (NEAI) benchmarks signal preprocessing, machine-learning algorithms and parameters, then exports an embedded inference library for each sensing channel. Its generated pipelines include preprocessing and classification.
- Acoustic pipeline classifier: XGB, a gradient-boosted decision-tree machine-learning algorithm. Vibration pipeline classifier: MLP, a multilayer perceptron neural network.
- Jing Siang collected/prepared data, configured NEAI, integrated the exported libraries into STM32 firmware and developed the temporal decision/sensor-fusion logic combining their outputs.
- LoRa peer-to-peer transmits leak results. Operating cycle: wake, sense/infer, transmit, sleep.

RIG / DATA DEVELOPMENT
- Controlled laboratory rig: straight 25mm PVC pipe, replaceable no-leak/0.5/1/2.5/5/10mm circular-hole sections; sensor-to-leak distance about 30cm–1.14m.
- Built a Python GUI data logger: acoustic/vibration streams over ST-LINK virtual COM/UART, automatically exported as 512-sample NEAI training buffers.
- Collected leak/background recordings; acoustic sampling 16kHz, vibration about 6.667kHz. Also exported 16kHz mono WAV and one-column vibration signals for CNN experiments, reusing the recordings.
- NEAI development emphasized representative data, consistent sampling/buffer sizes and MCU constraints, with iterative dataset improvements.
- Background noise was deliberately included in rig recordings and training data: factory sounds were played through a speaker near the prototype. Leak and no-leak/background recordings included quiet and noisy cases, with broader noise coverage in V2/V3. These are selected interference scenarios, not evidence of complete field-noise coverage.

RIG LIMITATIONS / VALIDATION SCOPE
- Straight 25mm PVC pipe, limited sensor-to-leak distances (about 30cm–1.14m), and circular holes of selected sizes.
- Limited coverage of other pipe materials/diameters, bends/branches, longer distances, flow conditions and irregular leaks such as cracks.
- Added background noise was tested; the remaining question is generalization to more varied real installations and environmental conditions. Field pipeline accuracy is unmeasured.
- Board power consumption and a future low-power PCB are device-design limitations, addressed separately below.

TEMPORAL DECISION / FUSION
- 30s detection cycles contain 3s segments: aggregate short inferences per segment, then across the full window.
- V2 decision logic uses sustained leak evidence, strong segments, leak-segment ratio and agreement between modalities.
- Final weights: 80% acoustic, 20% vibration; thresholds/weights tuned empirically on the rig. V2-DL V2 denotes detection model V2 with decision logic V2.

FINAL NEAI RESULTS — CONTROLLED EMBEDDED RIG
- Best final fused system: V2-DL V2, 88.0% accuracy. Other versions: V1-DL V1 80%, V1-DL V2 84%, V3-DL V2 72%.
- Selected setup: raw acoustic/vibration accuracy 73%/65%; after 3s logic 75%/69%; final 30s fused accuracy 88%.
- Final precision 0.84, recall 1.00, specificity 0.67, F1 0.91, balanced accuracy 0.83. No missed leaks in evaluated cases; false alarms remained.
- Separate NEAI library/internal validation: 97.71% acoustic, 93.32% vibration. These are development-stage validation metrics, distinct from the physical rig results above (thesis section 4.2).
- Interpretation is limited to the controlled rig and scenarios described above; these scores do not establish field performance.

ALTERNATIVE YAMNET-INSPIRED CNN EXPERIMENTS — SEPARATE MODEL FAMILY
- Developed both classifiers: MFCC-based 2D CNN for acoustics; raw-signal 1D CNN for vibration. These are YAMNet-inspired experiments, not two standard pretrained YAMNet models.
- Trained/tested on PC, then converted through TensorFlow Lite and STM32Cube AI Studio and tested on the embedded rig. Both approaches therefore received embedded testing; the final selected system used NEAI.
- CNN acoustic accuracy: 96.7% on the PC test dataset; 38.8% after conversion in embedded-rig evaluation.
- CNN vibration accuracy: 94.5% on the PC test dataset; 30.4% after conversion in embedded-rig evaluation.
- Thesis section 4.3.3 attributes the CNN reduction to quantization, conversion-related architectural simplifications and embedded memory/processing constraints. This is the thesis's deployment explanation, not an isolated measurement of each factor's effect.
- The CNN percentages and NEAI's final fused 88% belong to different model families/evaluation stages. They do not describe one model dropping from 96.7% to 88%, nor a measured reduction after field deployment.

LOW POWER / MECHANICAL PROTOTYPE
- Periodic sleep/wake and MCU deep-sleep worked. Full-board power-saving current remained about 113–129mA; MCU-only STOP3 measured 3–8 microamps.
- Low-power objective partly achieved: board overhead dominates; a custom PCB with controlled peripheral power is needed for practical battery deployment.
- SolidWorks-designed 3D-printed holder clamps to the pipe without modification; integrates board, battery/power hardware and LoRa, with repeatable sensor coupling, switch/ST-LINK/antenna access, cable routing and maintenance access. Prototype-specific, not a finished field enclosure.

OBJECTIVES / FUTURE / REFLECTION
- Achieved: rig, embedded AI, holder/integrated prototype, controlled validation, LoRa P2P and alternative-model benchmarking. Partial: low power. Unachieved: refined LED indication, Bluetooth and leak localization.
- Future: diverse datasets/rigs (leak shapes, materials, diameters, bends/branches, flow, distances), adaptable waterproof holder, custom low-power PCB, acoustic sensitivity and field validation.
- Iteration drivers: board changes, deliveries, clarified requirements, dataset expansion and testing. Lessons: earlier requirements/procurement, risk buffers, better data, core-deliverable prioritization and continuous documentation.
`;
