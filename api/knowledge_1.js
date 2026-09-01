
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


===== DOCUMENT: PROJECT 01 — Thesis excerpt: Automated Elephant Detection & Early Warning System (Mechanical Design and YOLO-based Image Detection) =====
Introduction
	The goal of this project is to create a solar-powered device that can detect elephants in real time using audio and visual AI detection. The weatherproof, impact-resistant designed device is intended for outdoor deployment and acts as an early warning system to reduce conflicts between humans and elephants. The solution reduces the need for a powerful internet connection by processing data locally on an edge device, guaranteeing quicker response times and increased dependability in remote areas.
	However, the system has certain limitations. The device’s detection accuracy is influenced by the quality and quantities of the training data and the settings for training. The environmental conditions such as lighting, weather, and background noise at the deployment location could also affect the detection accuracy. The device is specifically trained to detect elephants and may not effectively differentiate other objects or wildlife species as there are limited datasets for other classes to be detected. Additionally, the extreme weather conditions and power constraints could impact its continuous operation, requiring further optimizations for long-term field deployment.
	This project aims to deliver a fully functional prototype integrating both image and audio-based detection capabilities. The AI models will be trained to recognize elephants with high accuracy while maintaining reasonable accuracy for other included classes. The system will transmit detection data, including timestamp, confidence level, images and audio recordings, to a database via an API and display the information on a dedicated website.
	The implementation of this system brings significant social and economic benefits. Socially, it helps reduce human-elephant conflicts, preventing injuries and damaging plantation areas while promoting peaceful coexistence. Farmers and local communities can better protect their crops and property, leading to improved livelihoods. 
	Economically, the system helps minimize agricultural losses caused by elephant intrusions, reducing the financial burden on farmers. It also decreases the need for costly physical barriers and human patrols, making it a cost-effective solution for wildlife management. 
Image Model Training
	For the device to detect elephants on an edge device in real time, the algorithm needs to be lightweight and computationally efficient. YOLO was chosen as the detection algorithm because of its small model size and fast processing speed
	A dataset with a total of  images are used in the image model training.  of the images are images with elephants and the remaining are images with other objects such as humans, cars, cows, etc. The images obtained from university and MEME are annotated locally to maintain the confidentiality of the data. The other images are obtained from public projects on Roboflow website.
	A Python script is used to randomly split the dataset into three folders: "train," "validation," and "test" in proportions of 70%, 20%, and 10%, respectively. The images in the train folder are used to train the detection model, while those in the validation folder help assess the model's accuracy during training. The images in the test folder are not exposed to the model during training and are used to evaluate the final trained model's accuracy.
Another Python script is used to train the image detection model using a pretrained YOLOv11 weight. Several parameters are configured for training, including setting the image size to 640 pixels and applying a 20% probability of flipping images during training to improve the model's ability to detect flipped objects.
	The number of epochs refers to how many times the entire training dataset is processed during training. While a higher number of epochs may cause overfitting, too few epochs can lead to underfitting. The image detection model is trained for up to  epochs, with early stopping triggered if no improvement is observed after  epochs.
Material Selection
3.1 3D Printing Material
	3D printing is an additive manufacturing method that can create complex sculptural bodies quickly and affordably. The inner holders for mounting the components are 3D printed using PETG (Polyethylene Terephthalate Glycol) filament. 
	PETG is compared with two other prominent 3D printing materials, namely PLA and ABS. The material of the inner holder should be light in weight, weatherproof and have a high tensile strength. Table 3.1.1 shows the comparison of the properties of the three filaments. 
Table 3.1.1: Comparison between PLA, ABS and PETG.
	From Table 3.1.1, among the three materials analyzed, PETG exhibits a well-balanced set of properties, giving a moderate performance relative to the other options. PETG is characterized by high chemical resistance, toughness, and a combination of ductility, transparency, and resistance to both chemicals and impact. Among these three materials, PETG is the most resistant material based on tensile test experiment result. 
	In terms of environmental impact, ABS, a petroleum-based plastic, has the highest overall environmental impact, particularly in manufacturing and recycling, due to its material properties. PETG has the lowest environmental impact across all parameters, making it the most sustainable choice. Compared to PLA, PETG performs slightly better in terms of human health and resource consumption. However, PLA has a significantly higher negative impact on ecosystem quality, second only to ABS.
	Due to PETG’s moderate performance across key criteria and its suitability for the intended application, it has been selected as the preferred option.
3.2 Material for Outer Case
	The outer case is manufactured from a 2mm thick 6061-O aluminum alloy sheets to achieve a lightweight casing design while having the strength to hold components. The 6061-O aluminum alloy sheet also provides high tensile strength, resistance to corrosion, etc. Table 3.2.1 shows the properties of a 6061-O aluminum alloy. 
Table 3.2.1: Properties of 6061-O aluminum alloy.
	From Table 3.2.1, 6061-O aluminum alloy has high tensile strength and fatigue strength while having a low density of . Aluminum in general also offers high resistance to corrosion due to its tendency to form an oxide layer over the surface. Therefore, 6061-O aluminum alloy is chosen to be used as the material of the outer case.
Inner Holder
	The inner holder is designed to securely accommodate all the components within the system, including the Raspberry Pi 5, solar charge controller, battery, cameras, and other necessary parts. Figure 4.1 shows the 3D model of the inner holder in isometric view.
Figure 4.1: 3D model of the inner holder.
	From Figure 4.1, the holder is designed to be small in size with a maximum dimension of  to minimize the size needed for the outer case and minimize the overall weight. The holder has a modulated design for ease of maintenance. The holder consists of 4 separate parts: a cameras holder, a microphone holder, a raspberry pi holder and a controller holder. Each individual holder is securely connected together with bolts to allow ease of disassembly, modifications or replacement of an individual holder in the future.
	The holder is designed to fully expose all components to the air, promoting airflow for enhanced heat dissipation. Its final weight is approximately .
Outer Case
	The outer case is built to enclose all components, including the inner holder, ensuring protection against external impacts. The casing comprises two parts: the main case and the case cover. A rubber gasket is placed between them, and bolts are used to secure the case, ensuring waterproof protection. Figure 5.1 shows the 3D model of the outer case in isometric view.
Figure 5.1: 3D model of the outer case.
	From Figure 5.1, the outer case is designed to hold the inner case and the components while having clearance for vent, sensors, wires and bolts. The maximum dimensions of the outer case are  with an inner capacity dimension of  which is able to fit in the inner holder and other components. The outer case is manufactured from two aluminum sheets and folded accordingly as shown in the flat view of the aluminum sheets in Figure 5.2.
Figure 5.2: Case and case cover in flat view.
	As illustrated in Figure 5.2, the case cover features a single  folding line, while the case has three. The two edges formed after folding will be joined through welding to ensure strong adhesion and an effective seal.
Final Assembly
	Figure 6.1 shows the isometric view of the 3D model of the device with all the components mounted to the device including vent, fan, microphone cover, sensors, raspberry pi 5, etc.
Figure 6.1: 3D model of the final assembly.
	From Figure 6.1, the components labelled in green are 3D printed parts. The final maximum dimension of the device is approximately  with an estimated weight of . Figure 6.2 shows that exploded view of the device.
Figure 6.2: Exploded view of the device.
The IPV-1116 vent from Bud Industries is used to provide waterproofing while allowing airflow. To enhance ventilation, an 80mm × 80mm Sunon EF80251S1-1000U-A99 fan is mounted to one of the vents. This fan has an airflow rate of 1.15 m³/min, a low power consumption of 1.44W, and generates approximately 33dB of noise, which must be considered since a microphone is mounted inside the case.
For waterproof sealing, a neoprene rubber sheet is used as a gasket between the case and the case cover. A cable gland ensures waterproofing for wires passing through the casing, such as the solar cable. Additionally, rubber washers are used with bolts to further enhance waterproofing.
Design Studies
	Design studies are carried out to verify that the outer case can support the system’s weight and withstand external impacts. It must successfully pass the drop test and exceed the required safety factor under the specified load.
7.1 Static Study
	The case, including the case cover and connectors, is assembled and prepared for a static study in SolidWorks. The total mass of the components it must support is approximately 3.48 kg, resulting in a weight of 34.15 N. Two studies are conducted: one applying a 34.15 N force and another with a 50 N force toward the base of the case with different thickness. The key results analyzed are the maximum deformation (displacement) and the factor of safety (FOS). The ideal condition is to maintain displacement below 25% of the thickness while ensuring a FOS greater than 2. Figure 7.1.1 shows the 3D model of the case with force and fixture defined.
Figure 5.1.1: 3D model prepared for static study.
	From Figure 7.1.1, the force is set downward toward the base of the case and the fixture is set at the back of the case. Figure 7.1.2 shows the graph of the results of static studies for both scenarios with different thickness of the outer case.
Figure 7.1.2: Graph of the results from static studies
	As shown in Figure 7.1.2, increasing thickness enhances the case's ability to withstand the load, resulting in a higher FOS and reduced displacement. However, the final thickness selection must consider supplier availability while maintaining a balance between minimal weight, minimal displacement, and reasonable FOS. To meet the requirement of the total weight of  while ensuring minimal displacement and a high FOS, a 2mm thick 6061 aluminum alloy sheets have been selected.
	With a 2mm thick 6061-O aluminum alloy, the outer case can withstand a maximum load of approximately 300N, resulting in a displacement of 0.48mm and a FOS of 1.97. This indicates that the case can support up to 30kg before exceeding the acceptable displacement and FOS limits.
7.2 Drop Test
Financial
	The total budget allocated to this project is RM. The development of the device that needs budget is split into 4 parts: Electronic components (sensor, microprocessor, etc.), case, power system, others (wires, bolts, nuts, vents, etc.). Table 8.1 shows the BOM of the components purchased for the device.
Table 8.1: BOM for components purchased for the device.
	From Table 8.1, the total cost of components amounted to approximately RM2275, exceeding the original budget by RM275. Table 8.2 provides a breakdown of the budget allocation for each category alongside the actual spending.
Table 8.2: Budget allocation and spending for each category.
	As shown in Table 8.2, the expenditure for the sensors and power categories exceeded their initial allocations. Initially, with some budget surplus, we decided to purchase an additional solar panel and a mounting bracket to maximize the use of the available funds and enhance the reliability of the system. However, unforeseen circumstances arose when the Raspberry Pi 5 initially purchased became faulty and malfunctioned. This necessitated the purchase of a replacement Raspberry Pi 5, which pushed the overall spending beyond the planned budget.
Despite this setback, it is important to note that without the replacement of the Raspberry Pi 5, the project would have remained realistic within the original RM2000 budget allocation. This scenario will be further reflected and addressed under the risk management section. High-cost critical components, such as the Raspberry Pi 5 and the PCIe M.2 HAT with SSD, naturally consumed a large portion of the budget, highlighting their importance to the system’s operation. Additionally, certain materials, including the neoprene rubber sheet and polycarbonate (PC) sheet, were purchased in larger quantities than required due to supplier packaging constraints. Nevertheless, these surplus materials can be repurposed for future projects, offering added value beyond the current scope.
Image Detection Accuracy
The training took approximately 20 hours to complete  epochs. The mean average precision (mAP50) matrix is calculated at an Intersection over Union (IoU) threshold of 0.50, serving as a key metric to evaluate the model's accuracy. The final average accuracy of the image detection model is approximately . Figure 9.1 shows the plot of accuracy of the image detection model.
Figure 9.1: Accuracy of the image detection model.
	As shown in Figure 9.1, overall accuracy stabilizes between 82% and 84% after the 350th epoch of training. However, as illustrated in Figure 9.2, the model achieves 95% accuracy in detecting elephants.
Figure 9.2: Accuracy of individual class.
	As shown in Figure 9.2, the accuracy is high for all classes except for sheep, primarily due to dataset inconsistencies. The sheep class has a limited number of images, and its annotations are inaccurate. By excluding the sheep class, the average accuracy of the image detection model can reach 94%. The confusion matrix offers a detailed representation of the model's performance, displaying the counts of true positives, true negatives, false positives, and false negatives for each class. Figure 9.3 shows the normalized confusion matrix of the image detection model.
Figure 9.3: Normalized confusion matrix of the image detection model.
	Figure 9.3 shows high true positive values for all classes except the sheep class, aligning with the accuracy trends observed in the mAP50 matrix. This model is saved and is implemented into the device. This trained model version is saved and implemented into the device. It can also be retrained in the future to enhance accuracy or incorporate additional classes.
Unforeseen Challenges and Time Delays
During this project, several tasks were not completed within the planned timeframe due to unforeseen circumstances. One of the primary causes of the delay was the late finalization of requirements, particularly those affecting the required capacity of the casing. This uncertainty prevented the casing design from proceeding as scheduled, leading to further postponements in finalizing the design. Additionally, delays in obtaining quotations and shipping from suppliers slowed the procurement process, affecting the overall project timeline. Since certain design and assembly tasks relied on obtaining and testing the components, these delays created a bottleneck in the workflow.
The impact of these delays was significant, resulting in a compressed schedule for critical tasks in March and April 2025. The initial project timeline had to be adjusted, leading to a more intensive workload towards the final stages. Some trade-offs had to be made, such as reducing the number of iterations for testing or limiting design modifications for both hardware and software to ensure the project stayed within the deadline. The accumulation of delayed tasks placed additional pressure on the final phases of development, affecting efficiency and testing time. Table 6.2.2.1 shows the approximate delay in weeks for the end of each stage.
Table 6.2.2.1: Approximate delay in weeks for the end of each stage.
To reduce the effects of these delays, several adjustments were made. Tasks were prioritized based on their urgency, and wherever possible, multiple tasks where processing parallelly. These challenges highlighted valuable lessons for project management. One key takeaway is the importance of early planning and risk assessment, particularly in areas dependent on 3rd parties. Future projects should include buffer time to accommodate unexpected delays and implement proactive strategies to minimize disruptions. By improving efficiency in procurement, design finalization, and task management, similar setbacks can be better managed or avoided altogether in future developments.
Results and Discussions
11.1 Casing Design
During the assembly of the components, holders, and casing, all parts successfully fit within the enclosure. However, the outer case design posed challenges when mounting the device to a tree using a cargo strap. While mounting is still possible, the available space for positioning the strap is limited due to the clearance required for the cameras. Additionally, the ventilation openings occupy a significant portion of the case's sides. Future improvements to the casing design should focus on enabling easier and more secure mounting to a tree.
The internal layout remains compact after all components are installed, effectively minimizing internal movement during transportation and helping to protect the components from potential damage. While the routing of thick cables from the battery and solar charge controller is tight due to limited space, it was still managed successfully.
Initially, the 4G dongle was intended to be mounted on top of the main component holder. However, the surrounding aluminum casing was found to interfere with signal strength. As a temporary solution, the dongle was repositioned to the side of the holder, closer to the ventilation area, to improve connectivity.
11.2 Waterproofing
The assembled casing demonstrates a good level of waterproofing, providing effective protection for the internal components against rain and moisture. A key feature of the design is the use of a vent cover that shields the ventilation openings, preventing rainwater from entering from various directions. Similarly, the microphone is protected by a dedicated cover that offers basic rain resistance. However, it is noted that under conditions of heavy rain, the microphone cover may not offer sufficient protection, posing a risk of water ingress. Future improvements are necessary either by enhancing the current mic cover design or by relocating the microphone to a more sheltered position within the casing to ensure better waterproofing performance.
To further improve waterproofing, a rubber sheet was installed between the contact surfaces of the case and its cover, acting as a gasket to prevent water from seeping inside. While this approach is largely effective, minor issues were observed. Due to tolerance variations introduced during the manual bending process of the aluminum casing, some unevenness exists at the contact surfaces. This misalignment has resulted in areas where the rubber gasket does not seal perfectly, creating potential leakage points. An initial solution to address this issue involved applying soft silicone at the uneven sections to improve the seal locally.
Looking ahead, a more robust solution would involve replacing the current rubber sheet with a softer, more adaptable material. Using a softer gasket material could better accommodate minor surface irregularities and provide a more consistent seal around the casing, ultimately enhancing the overall waterproofing reliability. This adjustment would ensure that the device remains resilient even under harsher weather conditions, such as prolonged heavy rainfall.
Conclusion and Future works
12.1 Casing Design
While the current casing design successfully protected the device's internal components and provided sufficient environmental shielding, several opportunities for enhancement have been identified. The compact internal layout minimized component movement, and the casing generally resisted rain exposure during testing. However, specific challenges related to mounting flexibility, waterproofing consistency, and manufacturing precision point toward necessary improvements for future iterations.
One of the primary areas for improvement is the mounting system. The current reliance on external cargo straps is limited by clearance constraints around the casing, especially due to camera placement and vent positioning. A future design could integrate molded strap channels or fixed mounting brackets into the casing structure, allowing for faster, more secure attachment to various surfaces without interfering with the components' field of view. Considering adjustable or modular mounting options would also improve the adaptability of the device to different field deployment conditions.
Enhancing waterproofing performance is another critical focus area. While the existing rubber gasket provides reasonable protection, inconsistencies caused by manual bending during manufacturing created slight misalignments at the sealing surfaces. A softer, more flexible gasket material could be introduced to better conform to surface irregularities, ensuring a more reliable seal. Additionally, critical areas such as the microphone housing require design revision; using waterproof acoustic membranes or relocating the microphone to a more sheltered internal compartment would significantly improve rain resistance without compromising sound detection capabilities. Incorporating these changes would not only increase durability but also reduce the maintenance required during long-term outdoor deployments.
12.2 Waterproofing
The casing design achieved a satisfactory level of waterproofing, providing essential protection for internal components during deployment. Key design features such as the vent cover and microphone cover contributed to shielding the device from rain exposure. The addition of a rubber sheet between the casing and its cover further enhanced water resistance by acting as a barrier against potential ingress. Overall, the casing maintained reliable protection under normal weather conditions.
However, several areas for improvement were identified. In particular, the microphone cover may not offer sufficient protection during heavy rainfall, and further refinement or repositioning of the microphone is necessary to enhance its resilience. Additionally, minor surface irregularities caused by manufacturing tolerances affected the effectiveness of the gasket seal. Addressing these issues could involve applying soft silicone at critical points or adopting a softer gasket material that conforms better to surface imperfections. These improvements would strengthen the waterproofing performance and ensure the device remains durable and reliable across a wider range of environmental conditions.
API
The device communicates with the website through an API for two main purposes. First, it performs a periodic handshake with the server at one-hour intervals to confirm that the device remains active and operational. This regular handshake mechanism allows users to monitor the device’s status in real time through the website. Second, the device sends detection data via the API whenever an event is recorded. Each detection event generates a payload containing relevant information such as the image file, audio file, timestamp, and the confidence levels for both image and audio detections.
To ensure security and proper authorization, each device is registered with a unique device name and API key. These credentials authenticate the device and ensure that only authorized devices can interact with the API. On the user side, access to the detection data through the website is restricted to registered users, further safeguarding the integrity and confidentiality of the data collected.
The reliability of data transmission largely depends on the quality of the network connection. To accommodate field deployments where Wi-Fi may not be available, a 4G dongle is used to provide mobile internet access. In scenarios where network connectivity is poor, the device is programmed to attempt resending the detection data up to three times. If all upload attempts fail, the unsent detection data is saved into a designated folder on the device. The data will not be automatically uploaded once the connection is restored; instead, it can be manually extracted by personnel during scheduled maintenance visits to the device, which may occur every few months. Additionally, a comprehensive logging system is implemented to record all major events, including successful handshakes, data transmissions, warnings, errors, and the saving of unsent detections. This logging feature plays a crucial role in troubleshooting and monitoring device performance over time.
Proposed Design of Commercial Product 
To transition from a functional prototype to a deployable commercial product, several key enhancements should be implemented. These improvements aim to increase the system’s performance, reliability, ease of deployment, and suitability for long-term operation in remote or harsh environments. The following subsections outline proposed design features for a commercial version of the elephant detection system.
14.1 Enhanced Power Generation
A commercial system would benefit from a significantly upgraded power generation set up. The integration of higher-capacity solar panels, preferably 100W or more, would ensure continuous operation even during periods of low sunlight. This would be complemented by larger battery banks, enabling the device to function reliably during nighttime or cloudy days. Additionally, power efficiency can be further optimized by using low-power microcontrollers and peripherals that consume minimal energy during idle or low-activity periods. Incorporating intelligent power management systems could also allow for adaptive power distribution, conserving energy during non-critical periods while prioritizing high-consumption tasks like real-time data transmission during detection events.
14.2 Improved Detection System
The commercial version could utilize more robust and scalable detection systems by leveraging advanced machine learning models, either deployed on edge devices or processed through a hybrid edge-cloud architecture. This would allow for dynamic updates to the detection algorithms without needing physical access to the system. Real-time model improvement could be achieved through cloud-assisted learning, further increasing detection accuracy and reducing false positives. Moreover, combining multi-modal sensory inputs, specifically synchronizing camera-based visual detection with audio analysis, would allow for cross-verification and more confident event classification. This fusion approach would increase reliability in diverse environmental conditions where one modality might fail due to noise, occlusion, or lighting.
14.3 Remote Connectivity
For commercial deployment in remote or undeveloped regions, the system must maintain consistent and reliable connectivity. Satellite communication systems or integration with low-power wide-area networks (LPWAN), such as LoRaWAN, would enable the device to transmit critical alerts and system status data without depending on mobile data coverage. This ensures real-time communication even in isolated areas with poor cellular reception. These connectivity solutions would also enable remote firmware updates, device health monitoring, and coordinated detection across multiple units.
14.4 Scalability and Networking
A key feature of the commercial product would be its ability to scale. A distributed network of detection units could be deployed across large geographical regions, communicating through a mesh network architecture. These units would relay data to a centralized server or control center, allowing broader area coverage and collaborative event tracking. This interconnected structure allows flexible deployment configurations, efficient use of resources, and redundancy in case one unit fails. By integrating GPS modules, the system could also offer geolocation tagging of detections, aiding conservationists in mapping wildlife movement patterns over time.
14.5 Durability and Design
To ensure resilience in real-world environments, the commercial system should be housed in a robust and tamper-resistant enclosure. The casing must be weatherproof to protect internal electronics from rain, dust, and temperature extremes. The outer casing should be fabricated from durable aluminum, offering structural integrity and corrosion resistance, while internal components such as holders can continue to utilize lightweight 3D-printed materials to reduce the overall system weight. The design should prioritize modularity to ease maintenance and allow for straightforward assembly and disassembly during deployment or servicing. These improvements in casing materials and construction would significantly increase the device’s lifespan and reliability in outdoor field conditions.
14.6 Security and Data Protection
For commercial deployment, securing both the hardware and transmitted data is crucial, particularly when dealing with sensitive wildlife detection information and network-connected devices. The system should implement secure communication protocols such as HTTPS and token-based API authentication to prevent unauthorized data access. Data collected on the device, including images and audio clips, should be encrypted locally to prevent misuse in the event of physical tampering or theft. To enhance physical security, tamper-evident seals or intrusion sensors could be added to the enclosure to alert administrators of any unauthorized access attempts. Additionally, periodic key rotation and access logging should be employed on the server side to ensure long-term protection against cyber threats.
14.7 Cost Optimization
Cost efficiency can be achieved through strategic sourcing of components in bulk, use of standardized parts, and streamlining the design to reduce assembly complexity. Alternative materials may be explored for non-critical parts to further lower production costs. By balancing performance, cost, and scalability, the system can be made more accessible to organizations with varying budgets while maintaining the quality required for long-term deployment.
Appendixes
Appendix A: Dimensions for outer casing
[Table 1]
Properties | PLA | ABS | PETG
Density  |  |  | 
Tensile Strength  |  |  | 
Flexural Strength  |  |  | 
Extrusion Temperature  |  |  | 
Recyclability | Yes | Yes | Yes
Biodegradability | Yes | No | No
Flume Toxicity | Less | Medium | Less
[Table 2]
Density | 
Ultimate Tensile Strength | 
Modulus of Elasticity | 
Poisson’s Ratio | 0.33
Fatigue Strength | 
Thermal Conductivity | 
[Table 3]
No. | Item | Variation | Supplier | Unit Price | Qty. | Total Price
1 | Raspberry Pi 5, 8GB | Mainboard  | Cytron | RM369.00 | 1 | RM369.00
2 | Camera Module 3 | 12MP NoIR  | Cytron | RM175.00 | 1 | RM175.00
3 | Heatsink & Active Cooler | - | Cytron | RM29.90 | 1 | RM29.90
4 | Raspberry Pi M.2 HAT | PCIe M.2 HAT + MakerDisk 256GB | Cytron | RM215.50 | 1 | RM215.50
5 | FPC 22-Way to 15-Way for Camera | 30cm | Cytron | RM9.90 | 2 | RM19.80
6 | USB to 3.5mm Audio Adapter - TRRS | - | Shopee | RM32.86 | 1 | RM32.86
7 | Microphone | Boya by mm1 | Shopee | RM81.62 | 1 | RM81.62
8 | Solar Panel | 50W | Shopee | RM91.38 | 1 | RM91.38
9 | Battery 18AH |  | Shopee | RM184.79 | 1 | RM184.79
10 | Solar Controller |  | Shopee | RM14.10 | 1 | RM14.10
11 | 5 METER Solar Cable  | 2.5mm | Shopee | RM24.63 | 1 | RM24.63
12 | Bolts, Nuts and Insert |  | Cytron | RM26.46 | 1 | RM26.46
13 | Filaments | PETG | Cytron | RM55.00 | 1 | RM55.00
14 | DC Current Sensor |  | Cytron | RM29.00 | 1 | RM29.00
15 | Fan Axial 12VDC Wire | 80x25mm | DigiKey | RM27.55 | 1 | RM27.55
16 | IPV Ext Vent |  | DigiKey | RM28.35 | 2 | RM56.70
17 | Cable Gland M20 | 6 - 12mm | DigiKey | RM3.28 | 1 | RM3.28
18 | Washer Flat | M4 | DigiKey | RM0.20 | 25 | RM5.09
19 | Battery Connector | 6.35mm | DigiKey | RM0.28 | 10 | RM2.79
20 | Aluminum Sheet | 550mm x 600mm | Shopee | RM135.00 | 1 | RM135.00
21 | USB Type C |  | Cytron | RM8.00 | 1 | RM8.00
22 | Neoprene Rubber Sheet | 1.5 x  600 x 600mm | Shopee | RM14.00 | 1 | RM14.00
23 | PC Sheet | 1 x 1000 x 1000mm | Shopee | RM7.00 | 1 | RM7.00
24 | IR Infrared LED Board | 940nm 48pcs | Shopee | RM14.04 | 1 | RM14.04
25 | Cargo Strap Belt |  | Shopee | RM10.90 | 1 | RM10.90
26 | 4G dongle |  | 3D Smith | RM30.00 | 1 | RM30.00
27 | Y Branch Solar Cable |  | Shopee | RM16.57 | 1 | RM16.57
28 | Solar Panel | 50W | Shopee | RM85.00 | 1 | RM85.00
29 | Mount Bracket |  | Shopee | RM100.00 | 1 | RM100.00
30 | Raspberry Pi 5, 8GB |  | PRECOMP | RM410.00 | 1 | RM410.00
[Table 4]
Category | Sensors | Case | Power | Others | Total
Budget | RM1000.00 | RM200.00 | RM300.00 | RM500.00 | RM2000.00
Total Spending | RM1324.16 | RM190.00 | RM491.84 | RM268.96 | RM2274.96
[Table 5]
Stages | Estimated Week of ending of stage | Approximated Weeks of Delay
Research and Requirements Finalization | Week 9 | 20
Logistics and Procurement | Week 12 | 4
Development | Week 25 | 2
Testing and Validation | Week 26 | 2
Assembly | Week 26 | 2
Documentation | Week 30 | 0


===== DOCUMENT: PROJECT 01 — Presentation slides: An automated detection and early warning system for human-wildlife conflict =====
--- SLIDE 1 ---
AI in
Automated Elephant Detection and Early Warning System
Group 4
Chen Jun Han       
Cheng Jing Siang  
Wong Zhi Xuan    
Lim Kuan Ming    
[20409166]
[20409588]
[20393574]
[20413703]
--- SLIDE 2 ---
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
Background
--- SLIDE 3 ---
The Growing Problem of Human-Elephant Conflict
Dense vegetation and limited infrastructure make it hard to track elephants using traditional methods, delaying warnings and preventing timely interventions.
Monitoring Challenges
Elephants often enter farmlands in search of food, trampling and consuming crops, damaging fences, storage, and even homes, leading to significant economic loss for rural communities.
Close encounters with elephants, especially at night or during migration periods, can lead to injuries or fatalities, creating fear and tension among local residents.
Destruction of crops and property
Threats to human safety
--- SLIDE 4 ---
The system automatically detects elephants through camera and audio data using machine learning,.
The system sends immediate notifications to nearby communities, allowing proactive measures to avoid human-elephant conflicts.
The system operates on green energy, ensuring sustainable power without the need for direct electricity connections.
The system is designed for easy setup and low-maintenance operation, perfect for remote and off-grid locations.
Automated Elephant Detection
Real-time Warnings
Sustainable Operation
Easy Deployment
Objectives:
Aiming for a Sustainable Solution
--- SLIDE 5 ---
Combines visual and bioacoustic sensors for reliable elephant detection.
Dual Mode Detection
 Elephant Detection Approach
Solar-powered in remote areas, no external electricity required.
OFF-Grid Operation
Machine learning runs locally on the device, without the need for cloud connectivity..
Instant data transmission via API for live monitoring and alerts.
Easy installation and operation, designed for user-friendly interaction without technical complexity.
Edge Processing
Real-Time API
Plug and Play
🔋
🔍
🧠
☁️
⚙️
Designed for durability, able to function in tough environments with varying climates.
Weather Resistance
🌧️
--- SLIDE 6 ---
 A Path to Coexistence
Warns communities before elephants get too close
Prevents injuries and protects property
Supports peaceful living near elephant habitats
Early Detection
Safety for All
Empowered Communities
--- SLIDE 7 ---
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
Key Features of the System
--- SLIDE 8 ---
Car
Cow
Human
Motorbike
Sheep
With moderate accuracy.
Able to Detect Other Wildlife/Objects
Image Detection
YOLO-based image detection model.
Trained with large dataset of elephant image. 
High resolution
Workable during day and night
Box annotated for detected objects
Tracking ID, name and confidence level
Counter and FPS
High Accuracy on Elephants Detection
Capture & Annotate Images
--- SLIDE 9 ---
PyTourch-based audio detection model.
Detection model trained with a large dataset of elephant sounds.
High Accuracy on Elephant Detection
Audio Detection
Record 4s audio when elephant sound is detected
Name, confidence level and timestamp
Elephant
Gunshot
Background noise
Audio Recording
Multiple Detection Events
--- SLIDE 10 ---
Waterproof.
Corrosion resistance.
Impact resistance.
Weatherproof
Case Design
Aluminium outer case.
3D-printed inner holder.
Compact.
Mounted with a cargo strap.
Robust & Lightweight
Ease of Maintainence
Modular design.
Quick access to internal components by unscrewing front cover’s bolts.
Simplified assembly and disassembly process
--- SLIDE 11 ---
18Ah battery capacity.
Large Battery Capacity
Power Management System
100W solar panel.
Battery recharge during daytime.
Solar charge controller
Automatically turns off the system when the battery is too low
Turns back on when the battery recharges to a safe level
Solar Powered
Power Management
--- SLIDE 12 ---
Notification
Live updates
Live on Telegram
Alert and Logging
Detection data.
Timestamp
Handshake
Data protection
Save unsent data.
Error Logging
Ease debugging
Access through Website
Logging System Locally
--- SLIDE 13 ---
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
System Performance
--- SLIDE 14 ---
Scored 92.33% of accuracy using a deep learning-based audio recognition system.
Audio Detection Accuracy
Detection Accuracy
Achieved 95% accuracy in identifying elephants using a self trained model.
Effective integration of audio and image detection reduced false positives and provided robust early warnings.
Image Detection Accuracy
Combined Results
Elephant sound detection result:
Gunshot sound detection result:
--- SLIDE 15 ---
Final Accuracy:  95% for elephants
Stabilized after 350 epochs
Some false positives detecting humans as elephants (0.75 confusion rate) based on Confusion Matrix
Image Detection Model
Model Training Accuracy
Best Setup: 100 epochs with augmented dataset
95.56% Elephant Detection
86.96% Noise Detection percentage
Audio Recognition Model
--- SLIDE 16 ---
Power Uptime
The system achieves 16-18 hours of runtime, combining solar input and battery storage. This is sufficient for continuous operation until midnight. The API Handshake log is observed for a week to justify this.
Battery Uptime
Two 50W solar panels generate approximately 600 Wh/day under peak conditions, contributing to recharging the battery for the next cycle.
The battery would take approximately 4 to 5 hours to charge under peak sunlight, accounting for panel efficiency. 
Solar-Powered System
Charging Duration
API Handshake
The API handshake logs demonstrate consistent operation throughout the runtime
The solar panels generate enough power during peak sunlight to recharge 80% of the battery by evening.
Charging Power 
--- SLIDE 17 ---
 Enabled real-time data transmission via cellular networks, ensuring prompt alerts
4G LTE Module
Connectivity
Seamless connection with a centralized monitoring system, accessible from anywhere with internet connectivity.
Overcame signal interference by optimizing the 4G dongle’s placement within the casing.
API Integration
Challenges and Solutions
--- SLIDE 18 ---
Weatherproof aluminium casing (6061-O alloy) combined with PETG 3D-printed inner holders.
Material Selection
Casing
Waterproof and impact-resistant design tested under simulated field conditions
Ventilated design and cooling system to prevent overheating, ensuring component longevity 
Durability
Thermal Management
for supporting long-term field deployment in outdoors
Final Casing Assembly
--- SLIDE 19 ---
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
Challenges
--- SLIDE 20 ---
Detection Error
Protecting our Planet
Shotgun microphone struggles to pick up distant or off-axis elephant calls
Elephants rarely vocalize; detection window is small
Detection success depends heavily on mic placement and environmental noise
Audio detection challenges
Human detected as elephant 
Posture resembling elephant shapes
Large Size or backpacks
Dark Clothing confuse the model 
False positives in image detection 
--- SLIDE 21 ---
Satellite Monitoring
Satellite Monitoring
Hardware Constraints
Device often shuts down during night due to insufficient daytime solar charging
Rainy or cloudy weather affects solar panel efficiency, leading to early deactivation
System depends heavily on solar charging conditions
Power supply limitation
The bent metal casing introduces slight inconsistencies at the sealing edges. These gaps can reduce waterproof reliability.
Manufacturing tolerances lead to gasket misalignment 
The current microphone housing effectively blocks rain. However, it limits audio sensitivity.
Casing limitations
--- SLIDE 22 ---
Casing cannot be securely tied to narrow or irregular trees
Current cargo straps interfere with camera and vent positioning
Limits flexibility and quick deployment in the field
Once installed, repositioning is difficult
Placement of camera and vents restricts strapping angles
Can interfere with field-of-view or airflow
Tree mounting restrictions
Fixed installation point
No Remote access
Deployment Constraints
--- SLIDE 23 ---
Connectivity Issues
4G dongle experiences intermittent drops in rural zones
Signal fluctuations lead to lag or delayed API updates
Occasional dongle disconnection requires physical reconnection
Limits fully autonomous operation
Unreliable Connection
Manual Intervention Needed
Impact on API Communication
--- SLIDE 24 ---
Conclusion
Real-time detection minimizes conflict risk
Supports remote, off-grid communities with green energy
Easy to deploy and maintain in rural areas
Promotes harmony between humans and elephants
--- SLIDE 25 ---
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
Next Steps
Enhance solar panel efficiency to fully charge the battery during the day, ensuring uninterrupted performance throughout the night.
Optimize Power Management for 24-Hour Operation
Refine the machine learning model to reduce false positives and better distinguish elephants from humans and other animals.
Improve Detection Accuracy
Enhance microphone quality to improve elephant sound detection range and clarity, especially in noisy or forested environments.
Upgrade Audio Capture Hardware
🔋
🎯
🎤
Deforestation, urbanization, and climate change are rapidly destroying natural habitats, putting many species at risk of extinction.
Integrate GPS to track device location and monitor elephant movement paths, enhancing response planning and data analysis.
GPS Tracker


===== DOCUMENT: PROJECT 02 — Thesis: Edge AI Low-Power Water Leak Detection (Introduction, Methodology, Results & Discussion, Conclusion — literature review chapter omitted as it is generic academic background, not project-specific) =====
1. Introduction
1.1 Project Background
Water leakage in distribution systems is a major technical and operational problem because it
wastes treated water, increases operating costs, and reduces the overall efficiency and
sustainability of water utilities [1] [2]. Hidden leaks are particularly problematic because they
may persist for long periods before becoming visible, allowing water loss, infrastructure
deterioration, and repair cost to accumulate over time [2] [3]. As a result, there is strong
practical interest in monitoring approaches that can identify leakage earlier and more reliably
than conventional inspection-based methods [3] [4].
Recent developments in the Internet of Things (IoT), embedded sensing, and artificial
intelligence (AI) have created new opportunities for automated leak monitoring [5] [6]. AI-
based leak detection systems can learn to distinguish leak-related patterns from background
conditions using measured signals such as sound, vibration, or pressure, thereby reducing
dependence on purely manual interpretation [7] [6]. Such approaches are attractive because
they offer the possibility of continuous monitoring, faster response, and more scalable
deployment across distributed infrastructure [5] [6].
At the same time, practical deployment in water infrastructure introduces constraints beyond
detection accuracy alone. Monitoring points may be geographically dispersed, difficult to
access, and located where wired power and communication are not readily available [8] [9].
Under these conditions, a useful sensing node should not only detect leaks, but should also
operate with low energy consumption, perform robust local processing, and communicate
results efficiently [8] [9]. This makes low-power edge AI particularly relevant, since local
inference can reduce latency and lower the communication burden compared with cloud-
dependent architectures [8].
Among the available sensing approaches, acoustic and vibration measurements are especially
relevant because water leakage produces both airborne or structure-borne sound and
mechanical excitation of the pipe structure [10]. These two sensing modalities therefore
provide different but related views of the same physical event, and their combination has the
potential to improve detection robustness compared with relying on only one sensing channel
[10] [11]. Motivated by this context, the present project investigates a low-power embedded
leak detection system that combines acoustic sensing, vibration sensing, on-device AI
inference, and wireless result reporting within a single prototype architecture [8] [4] [11].
Beyond its technical motivation, improving the energy efficiency of distributed leak-
monitoring systems also supports more sustainable water management, which is consistent
with Sustainable Development Goal 6, aimed at ensuring the availability and sustainable
management of water and sanitation for all [12].
1.2 Project Overview
This project develops a proof-of-concept low-power edge AI system for water leak detection
using acoustic and vibration sensing on a microcontroller-based platform [4] [13]. The system
is designed around the STM32U585AI on the B-U585I-IOT02A development board, selected
for its embedded processing capability, integrated peripherals, and support for low-power
operation [14] [15]. Although STM32L562QE on the STM32L562E-DK development board
was initially considered during early project planning, the present prototype was ultimately
implemented on the STM32U585AI platform. The device performs sensing and inference
1
--- PAGE 14 ---
locally, with the aim of reducing dependence on continuous remote processing and limiting
unnecessary wireless transmission [8] [16]. Figure 1.2.1 illustrates the overall concept of the
proposed leak detection system, showing how acoustic and vibration signals are acquired by
the embedded node, processed locally using on-device AI, and then transmitted as compact
leak-related results through wireless communication.
Figure 1.2.1: System diagram
As illustrated in Figure 1.2.1, two sensing modalities are used in the proposed system. Acoustic
information is captured using the on-board MEMS microphone, while pipe vibration is
measured using the on-board accelerometer [13] [11]. These signals are processed separately
using embedded classification models generated through NanoEdge AI Studio, allowing each
sensing channel to contribute its own leak-related evidence while remaining compatible with
microcontroller deployment constraints [13] [17]. The outputs are then combined using a
structured late-fusion decision process rather than relying on a single short inference result
alone.
To support model development and controlled evaluation, a laboratory-scale leak simulation
rig was constructed to generate repeatable leak and non-leak conditions under different leak
sizes and mounting distances [4]. This rig provides the dataset used for model development
and also serves as the validation platform for the final embedded prototype. In the deployed
workflow, the system records a 30s detection interval, divides it into shorter 3s segments,
performs repeated short-buffer inferences, and then aggregates the results through a multi-stage
temporal decision logic before issuing a final verdict. This architecture was selected to improve
robustness against transient fluctuations and short-term misclassifications during real
embedded operation.
The project also investigates two supporting aspects of practical deployment. First, wireless
result transmission is implemented using a LoRa peer-to-peer arrangement to demonstrate
remote reporting of leak-related outputs without requiring a permanent wired connection [18].
Second, the system’s low-power behavior is evaluated through both MCU-level and full-board
current measurements in order to examine how effectively the periodic wake-sleep concept can
be implemented in the present prototype [15]. In addition, an alternative YAMNet-based model
is developed and benchmarked as part of a comparative study to assess whether a more
conventional deep-learning approach remains competitive after embedded conversion and
deployment.
2
--- PAGE 15 ---
Overall, the project is intended not as a final field-ready product, but as an integrated proof-of-
concept prototype that brings together multimodal sensing, embedded AI, temporal decision
logic, low-power scheduling, wireless reporting, and mechanical integration in a single leak-
monitoring system.
1.3 Aims and Objectives
The primary goal of this project is to create a reliable low-power edge AI system for pipe leak
detection. The system will utilize an embedded microcontroller platform, combined with
onboard and optional external sensors, to reliably detect vibration and acoustic signals caused
by leaks, thereby enabling early warning of leaks in water distribution networks.
To achieve this goal, the project has set the following specific objectives:
I. Define and set up a controlled experimental environment, including a leak simulation
rig, to collect acoustic and vibration data under various leak conditions and controlled
variables.
II. Develop an AI-based leak detection algorithm utilizing both acoustic and vibration
signal analysis.
III. Ensure low power operation.
IV. Design and assemble a fully functional prototype for development on a controlled test
rig.
V. Evaluate the complete system implementation by validating the data collection and
analysis intervals and verifying that power consumption and leak detection
performance meet the defined project goal.
1.4 Stretch goals
If time permits, this project aims to incorporate additional features that enhance the device’s
usability, user interface, and overall professionalism by utilizing the available onboard
peripherals. These enhancements are designed to improve convenience and user interaction
with the system. The proposed stretch goals include:
I. LEDs Indicator: Provide visual status feedback by using different LED activation
patterns (i.e., specific combinations of LEDs turned on) to represent the device’s current
operating mode, such as sleep, idle, detection, or dataset collection.
II. Wireless Data Transmission: Utilize the onboard ARDUINO® Uno V3 expansion
interface to send data (e.g., detection results and timestamps) via LoRa peer-to-peer
(P2P) communication.
III. Wireless Connectivity: Enable Bluetooth communication to either transmit alerts when
a leak is detected or allow users to retrieve system logs remotely via a smartphone or
PC.
IV. Leak Localization: In scenarios where multiple devices are deployed, explore strategies
to estimate the leak’s location using signal strength, detection time, or other
triangulation techniques, and include this information in the user alert.
V. AI Model Performance Comparison: Benchmark the device’s deployed AI model
against alternative models (e.g., YAMNet) to evaluate and compare detection
performance.
1.5 Risks Management
Effective risk management is essential for the successful development and implementation of
the proposed leak detection system. Table 1.5.1 lists the key operational and technical risks
identified during the planning phase, along with their likelihood of occurrence, potential
3
--- PAGE 16 ---
consequences, and mitigation methods. These risks include software, hardware, and integration
issues that could impact the project schedule or performance outcomes. Throughout the project
lifecycle, proactive planning, component testing, and phased verification will be employed to
minimize disruptions.
Table 1.5.1: Table of risks and mitigation.
Risk Risk
Risk Description Stages Likelihood Severity Mitigation
(Pre) (Post)
Proper maintenance of
hardware; perform
Hardware failure
Development 2 2 4 2 preliminary hardware
(e.g. MCU, sensors)
checks. Use backup board
(B-U585I-IOT02A).
Use backup components
Late delivery of
Development 3 2 6 3 such as backup board (B-
components
U585I-IOT02A)
Use modular code
Software bugs or
Development 3 2 6 4 structure, version control
firmware issues
and iterative testing.
Expand dataset diversity,
Inaccurate AI model improve feature
Testing 2 2 4 2
performance extraction, and validate
using real test cases.
Optimize the firmware
during development to
Excessive power
Testing 2 1 3 1 accommodate low power
consumption
modes and profile
consumption.
Take frequent break to
Back pain, RSI, eye
Development 3 1 3 2 prevent long use of
strain
computer.
Preprocess and label data
Dataset thoroughly; Combine
Development 3 1 3 1
quality/inconsistency public and locally
acquired datasets.
Use rigid 3D-printed
Board/sensor
Testing 2 1 2 1 housing; test mounting
mounting instability
under various conditions
As shown in Table 1.5.1, likelihood indicates how likely the risk will happen in a scale of 1
(Inconceivable) to 5 (Most likely). Severity is the measure of the negative impact of the risk in
a scale of 1 (Negligible) to 5 (Catastrophic). Risk is the product of likelihood and severity. The
risks for the project are calculated for before (Pre) and after (Post) the risk mitigation. The risks
are categorized into low (1-4), medium (5-12), or high (15-25) [19].
1.6 Project Schedule
The project timeline spans from September 25, 2025, to April 29, 2026, ending with the final
project presentation. The overall schedule is illustrated in Figure 1.6.1 while a detailed version
of the Gantt chart is provided in Appendix C for clearer visibility.
4
[Table 1 on page 16]
Risk Description | Stages | Likelihood | Severity | Risk
(Pre) | Risk
(Post) | Mitigation
Hardware failure
(e.g. MCU, sensors) | Development | 2 | 2 | 4 | 2 | Proper maintenance of
hardware; perform
preliminary hardware
checks. Use backup board
(B-U585I-IOT02A).
Late delivery of
components | Development | 3 | 2 | 6 | 3 | Use backup components
such as backup board (B-
U585I-IOT02A)
Software bugs or
firmware issues | Development | 3 | 2 | 6 | 4 | Use modular code
structure, version control
and iterative testing.
Inaccurate AI model
performance | Testing | 2 | 2 | 4 | 2 | Expand dataset diversity,
improve feature
extraction, and validate
using real test cases.
Excessive power
consumption | Testing | 2 | 1 | 3 | 1 | Optimize the firmware
during development to
accommodate low power
modes and profile
consumption.
Back pain, RSI, eye
strain | Development | 3 | 1 | 3 | 2 | Take frequent break to
prevent long use of
computer.
Dataset
quality/inconsistency | Development | 3 | 1 | 3 | 1 | Preprocess and label data
thoroughly; Combine
public and locally
acquired datasets.
Board/sensor
mounting instability | Testing | 2 | 1 | 2 | 1 | Use rigid 3D-printed
housing; test mounting
under various conditions
--- PAGE 17 ---
Figure 1.6.1: Ideal project Gantt chart.
As shown in Figure 1.6.1, the estimated time spent for development and testing is around 5 to
6 months. However, the actual project progress only partially followed the ideal timeline. The
early preparation stage generally progressed as planned, including initial board familiarization,
proposal development, early peripheral setup, and initial AI model testing. However, the
timeline later became more iterative due to several technical and logistical factors. The
hardware path changed multiple times, first from the B-U585I-IOT02A to the STM32H747I-
DISCO and then back again because of unresolved peripheral issues, while the originally
intended migration to the STM32L562E-DK as required by the company was delayed by
delivery constraints and was not completed within the planned period.
As a result, several tasks such as finalizing the decision logic, expanding the dataset, validating
low-power operation, and evaluating embedded accuracy extended into the later stages of the
project. In addition, the work shifted away from the originally planned outdoor testing phase
and instead focused on controlled rig-based validation, LoRa P2P testing, power-consumption
analysis, and thesis completion. Thesis writing also became more concentrated in the later
months of the project rather than progressing evenly alongside development. Overall, although
the actual timeline differed from the original plan, the main project milestones were still
achieved, with the final workflow becoming more iterative and development-driven than
initially anticipated.
3. Methodology
3.1 Overall Architecture
Figure 3.1.1 illustrates the overall architecture of the proposed system. Sensor inputs (vibration
and acoustic) are fed into the B-U585I-IOT02A microcontroller, where a lightweight AI model
performs leak classification locally. The NanoEdge AI Studio generated inference engine is
embedded within the MCU firmware. The device remains in low-power mode and activates
periodically. An alert signal (such as an alert message via LoRa P2P) is triggered upon leak
detection. The board’s available expansion interfaces and ports support future upgrades,
including LoRa P2P communication through the Arduino header, Bluetooth connectivity, and
LED-based mode indication.
Figure 3.1.1: Overview of the hardware and software used.
24
--- PAGE 37 ---
3.2 Design and Hardware Integration
Using the B-U585I-IOT02A board as the base platform, create a prototype leak detection
device. It was selected due to its integrated sensors and low-power Cortex-M33 MCU. This
involves developing a 3D-printed casing to firmly place the device on water pipes, as well as
incorporating an acoustic sensor (MEMS microphone) and vibration accelerometer (iNEMO
3D accelerometer) on the board.
Figure 3.2.1: Proposed system architecture for the low-power leak detection device.
Figure 3.2.1 shows a block diagram of the B-U585I-IOT02A microcontroller, along with its
main internal components and external peripherals. In addition to on-chip memory (2 MB flash
and 786 KB SRAM) for storing code, data, and machine learning models [14], the
STM32U585AI MCU (highlighted in blue) integrates an Arm Cortex-M33 CPU (160 MHz)
with TrustZone. It includes a flexible power management unit with deep sleep mode support,
and an internal clock system (MSI RC clock, HSE oscillator, etc.) [15]. The iNEMO 3D
accelerometer provides vibration data via an I²C interface, while a MEMS microphone
connects to the MCU to record acoustic leakage sound. These sensor inputs are read by the
Cortex-M33 core and combined in real time. To classify leakage signatures, an embedded
machine learning model (created using NanoEdge AI Studio) is stored in flash memory and
executed on the MCU. Arrows indicate data paths: output signals (or stored data) leave the
MCU, and sensor data enters the MCU.
3.2.1 Microphone
In this project, acoustic sensing is implemented using one of the two on-board digital
microphones, MP23DB01HP, to capture sound signatures associated with water leakage. The
MP23DB01HP is a compact, omnidirectional, low-power (2𝜇𝐴−800𝜇𝐴) digital MEMS
microphone that integrates a capacitive sensing element together with an interface IC, and it
supports configurations where two microphones can be operated in a stereo arrangement if
required [92].
Figure 3.2.2: MP23DB01HP [92].
25
--- PAGE 38 ---
Using an on-board microphone reduces hardware complexity and improves repeatability
because the acoustic front-end (microphone model, biasing, routing, and mechanical placement
on the PCB) is fixed by the development platform rather than relying on external sensors or
hand-wired assemblies. This also provides a stable baseline for dataset collection and
subsequent model validation, since variations in sensor type and mounting can otherwise
introduce unwanted shifts in the recorded signal characteristics.
The microphone signal path is configured to produce an audio stream suitable for embedded
machine learning. Specifically, the acquisition is set to mono with a 16 kHz sampling rate and
16-bit sample resolution. At 16 kHz, the digitized audio preserves frequency content up to 8
kHz by the Nyquist criterion, which offers a practical balance between retaining informative
acoustic details and controlling memory footprint, processing time, and energy consumption
on the MCU [93] [94]. In implementation terms, the microphone’s digital output is acquired
by the MCU’s digital audio capture path and converted into a 16-bit PCM stream suitable for
subsequent preprocessing (such as framing/windowing and feature extraction as required by
the model). Selecting a single-channel (mono) configuration further simplifies buffering and
ensures a consistent input shape for inference, while leaving the second on-board microphone
available for potential future enhancements such as spatial filtering, redundancy, or noise-
robust dual-microphone processing.
To ensure deterministic acquisition behavior across operating cycles, the microphone is
initialized as part of the device’s startup sequence and re-initialized whenever the system
transitions from sleep back to an idle state before starting audio recording. The same
initialization routine is also executed following a manual reset so that sampling parameters
(rate, channel mode, resolution, buffer handling) are restored to a known configuration before
any data collection or inference begins. This approach prevents inconsistent audio formatting
caused by partial peripheral states after low-power operation and helps ensure that the recorded
signals remain comparable across experiments. In addition, the microphone is only enabled
when the device is actively acquiring data, and it is disabled during sleep intervals to reduce
system power consumption, which is essential for achieving the project’s long-life operational
objective.
3.2.2 Accelerometer
In this project, vibration sensing is implemented using the on-board ISM330DHCX inertial
measurement unit (IMU) to capture mechanical vibrations propagating along the pipe during
leak and non-leak conditions. The ISM330DHCX as shown in Figure 3.2.3 integrates a high-
performance 3-axis digital accelerometer and 3-axis digital gyroscope in a compact system-in-
package, designed for high stability, low noise, low power(5.5𝜇𝐴−430𝜇𝐴) and synchronized
sensing across axes, which is beneficial for repeatable vibration acquisition in embedded
monitoring applications [95].
Figure 3.2.3: ISM330DHCX [95].
26
--- PAGE 39 ---
Leveraging the on-board IMU simplifies hardware integration because the sensor is already
electrically and mechanically coupled to the development board, reducing variability that could
arise from external sensor mounting, wiring, or inconsistent sensor placement. This provides a
consistent sensing front-end for both dataset collection and subsequent model validation.
For the leak detection pipeline, the accelerometer is configured to a full-scale range of ±4 g
with a maximum sampling rate of 6.667 kHz, enabling the capture of high-frequency vibration
components that may arise from turbulent flow and structural excitation near a leak site. The
±4 g range was selected to provide adequate sensitivity for small-amplitude pipe vibrations
while still providing headroom to avoid saturation under stronger mechanical disturbances such
as handling shocks or higher flow-induced vibration [96] [97]. The sampled vibration stream
is then buffered and segmented according to the project’s inference windowing strategy before
being used for preprocessing and classification. Maintaining a fixed sampling configuration
during both dataset recording and deployment is important to ensure that the statistical
properties of the input data remain aligned with the training distribution, which directly affects
embedded model reliability.
To ensure deterministic behavior across operating cycles, the accelerometer is initialized
during device startup and re-initialized whenever the system wakes from sleep or after a manual
reset. This approach ensures that key parameters, such as measurement range and output data
rate return to a known state before any recording or inference begins. In addition, the sensor
can be placed into a low-power state during sleep intervals to reduce idle energy consumption,
aligning with the project’s long-life operation objective. Overall, the ISM330DHCX provides
a robust vibration sensing modality that complements the acoustic channel, improving
detection resilience in scenarios where environmental noise may mask leak sound, while
vibration signatures remain detectable through structural propagation along the pipe.
3.2.3 LoRa P2P Communication Module
Wireless transmission is implemented using the RA-08H-Kit, shown in Figure 3.2.4, to provide
long-range communication between the prototype node mounted on the pipe and a receiving
unit connected to the monitoring computer. The communication module is included as a stretch
goal to support the project objective of edge deployment, where the leak detection result can
be transmitted without requiring a permanent wired connection to the sensing location.
Figure 3.2.4: RA-08H-Kit [98].
The RA-08H family is designed for low-power wide-area applications and supports sub-GHz
communication with UART-based host control and AT-command configuration. According to
available module specifications, the RA-08H operates from a low supply voltage, provides high
receiver sensitivity, and supports long-range communication with transmit current substantially
higher than its receive current, making it suitable for intermittent burst transmission rather than
27
--- PAGE 40 ---
continuous radio activity [99]. This aligns with the current operating strategies of the device,
which involves performing recording and inference locally on the B-U585I-IOT02A and
transmitting only a compact result payload after each predetermined detection cycle. The
transmitted payload consists only compact information such as timestamp, operating state,
classification result, and confidence-related fields, thereby keeping the airtime short and
limiting radio energy consumption.
In this project, two communication modules are used and are configured using a LoRa P2P
approach, in which the sensing node sends its detection payload directly to a receiving base
node connected to a computer. This was achieved by modifying a ping-pong example code
from [100] for payload transmission and reception. This method was selected because water
distribution systems may cover large and obstructed areas, making gateway-based
communication less practical due to coverage limitations and the possible need for multiple
gateways. A P2P arrangement provides a simpler and more suitable solution for the current
prototype.
In a larger future deployment, results could be forwarded from one node to another until they
reach the base node, allowing communication across extended infrastructure while keeping
neighboring nodes within effective transmission range. Such an approach would require
additional consideration of node identification, transmission delay, and node failure handling,
but these aspects are beyond the scope of the current study and are reserved for future
development.
Different antennas were used for the node and base communication modules, as shown in
Figure 3.2.5. The base module was equipped with a physically larger antenna to improve
transmission/reception capability and practical communication distance. In contrast, the node
module used a shorter antenna because the prototype device is intended to be mounted on a
pipe, where overall device size must remain compact. This design reflects a practical trade-off
between wireless performance and mechanical integration. Since the node is part of the
mounted leak-detection device, its antenna length and form factor must remain compatible with
the size limitations of the holder and the surrounding pipe installation environment.
Figure 3.2.5: Antenna used for LoRa modules: node (left), base (right).
Antenna gain also influences the effective communication range by shaping how efficiently
radiated power is concentrated in a preferred direction [101]. In general, a higher-gain antenna
can improve signal strength at the receiver and extend effective coverage, although this is
achieved by concentrating the radiation pattern rather than creating additional power [101].
The theoretical relationship between antenna gains and signal coverage is illustrated in Figure
3.2.6. In the present project, the larger antenna at the base side was selected to provide stronger
reception performance, while the smaller node antenna was retained to satisfy device size
constraints. This arrangement is suitable for the prototype because the sensing node prioritizes
compact deployment, whereas the base receiver can accommodate a less size-restricted
antenna.
28
--- PAGE 41 ---
Figure 3.2.6: Relationship between antenna gain and effective signal coverage [102] [103].
To support reliable communication, a simple handshake mechanism was also implemented in
the firmware using a ping-pong exchange with a nonce value. On the STM32 side, the host
generates a message in the format PING:<nonce> and waits for a matching PONG:<nonce>
reply within a defined timeout period. The node-side LoRa firmware forwards the ping
message over the radio link and opens a temporary receive window, while the base-side
firmware responds with the corresponding pong message upon successful reception. This
lightweight procedure provides a direct method to verify bidirectional wireless communication
before transmitting the actual detection payload and is therefore used as part of the
communication validation workflow.
Overall, the RA-08H-Kit provides a suitable communication interface for the prototype
because it allows leak decisions generated at the edge to be forwarded wirelessly using a
lightweight, low-duty-cycle transmission strategy. Its integration through UART keeps the
firmware architecture modular, such that sensing, inference, and communication remain
separable blocks. This is beneficial for debugging, staged validation, and future deployment
development, where the sensing node may participate in a wider multi-node relay structure
across extended water infrastructure.
3.2.4 Power Hardware
The power subsystem is made to accommodate the various electrical requirements of the
communication module and processing board while supporting battery-powered operation. The
overall arrangement is illustrated in Figure 3.2.7.
29
--- PAGE 42 ---
Figure 3.2.7: Device circuit diagram.
Figure 3.2.7 shows the connection between the battery ER34625, the DC-DC conversion stage,
the pulse-assist capacitor, the user power switch, the B-U585I-IOT02A board, and the external
LoRa P2P communication module. The design goal of this power hardware is not only to
provide the required operating voltages, but also to manage transient current demand in a way
that is compatible with long-life primary-battery operation.
The main energy source selected for the prototype is the ER34615 lithium thionyl chloride
primary cell. This battery chemistry is widely used in long-life industrial and metering
applications because it offers high energy density, low self-discharge, and long shelf life [104].
The ER34615 datasheet specifies a nominal voltage of 3.6 V and a nominal capacity of 19,000
mAh [105]. However, the datasheet also shows that while the cell is well suited to low average-
current operation, its continuous and pulse current capability is limited compared with the short
burst demands typically associated with radio transmission.
A DC-DC boost converter is used in the power path to increase the output voltage of the
ER34615 battery to a level suitable for powering the development board. With the converter
included, the board was able to power up successfully and remained operational.
Figure 3.2.7 shows the SPC1520 super pulse capacitor, connected in support of the Ra-08H-
Kit power path. The purpose of this capacitor is to buffer short-duration high-current bursts
during wireless transmission. A diode was added to prevent current backflow and damage the
B-U585I-IOT02A board. This design choice is particularly important for lithium thionyl
chloride battery, since these batteries are very suitable for long-duration sensing but are less
ideal for repetitive high pulse loads if used without an auxiliary storage element. Application
guidance for ER34615 systems commonly recommends pairing the battery with a capacitor or
pulse-assist energy-storage element when short transmit bursts are required, so that the
capacitor can supply the instantaneous current while the battery replenishes the charge more
gradually between events [104].
30
--- PAGE 43 ---
The power hardware also includes a manual ON/OFF switch, allowing the entire device to be
isolated during handling, transport, and maintenance. This is a practical feature for
experimental work because it provides a clear hardware-level means of disabling the prototype
without relying only on firmware state. In addition, it allows the power-up and reset sequence
of the full system to be repeated consistently during testing, which is useful when validating
startup behavior, peripheral reinitialization, and low-power wake-up transitions.
3.3 Simulation Rig
To enable controlled dataset collection and systematic validation of the proposed edge AI leak
detection system, a specialized laboratory-scale water leak simulation rig was designed and
constructed as shown in Figure 3.3.1. In methodological terms, the simulation rig functions as
a controlled physical system model of a leaking water pipe, allowing the sensing device to be
evaluated under repeatable and deliberately varied leak conditions before wider real-world
deployment.
Figure 3.3.1: Simulation Rig setup.
As illustrated in Figure 3.3.1, the rig consists of a water tap acting as the source of water, which
feeds water into a 25mm diameter main PVC pipe section where the detection device is
mounted. Downstream of the mounting point, just before the water flows into the sink, a 3D-
printed replaceable pipe with a calibration leak hole as shown in Figure 3.3.2 is installed to
simulate a leak.
Figure 3.3.2: 3D printed pipe section with different sizes of leak hole.
31
--- PAGE 44 ---
The leak generation mechanism is implemented using a custom 3D-printed 25 mm pipe section
with different sizes of leak hole, as shown in Figure 3.3.2. Multiple calibrated hole diameters
were fabricated, including a baseline condition (no hole), 0.5 mm, 1 mm, 2.5 mm, 5 mm, and
10 mm. This modular design allows precise control of leak severity and flow characteristics
and also allows for the easy creation of leaks of different sizes if needed in the future. Smaller
leak holes simulate early-stage pinhole leaks, while larger leak holes represent more severe
structural failures. The baseline configuration without any hole is used to collect non-leak
background data for model training and false alarm evaluation. The ability to change hole sizes
ensures that the dataset captures a broad spectrum of leak conditions, improving the
generalization capability of the trained AI model.
The main pipe section has an internal diameter of 25 mm, selected to represent typical domestic
or small-scale distribution pipelines, which is consistent with common sizes used in building
cold-water plumbing (e.g., 20 mm minimum branches and 25 mm feeders in some internal
plumbing specifications), but it does not capture the wider range of diameters found in service
connections and larger distribution mains [106] [107]. The device’s mounting position along
this pipe can be adjusted to evaluate detection performance at different distances from the leak
location. The maximum practical mounting distance from the leak hole is approximately 1.14
m, while the minimum distance is approximately 30 cm. This adjustable range enables
investigation of signal attenuation characteristics for both acoustic and vibration signals as they
propagate along the pipe. By systematically varying the mounting distance, the robustness and
sensitivity of the AI model can be assessed under realistic deployment scenarios.
The simulation rig serves two primary purposes in this project. First, it provides a repeatable
and controlled environment for dataset collection, enabling the collection of synchronized
acoustic and vibration signals under well-defined leak and non-leak conditions. Second, it
functions as the final verification platform for evaluating the deployed embedded AI model.
By comparing detection outcomes across different leak sizes and distances, the system’s
classification accuracy, sensitivity, and false alarm rate can be quantitatively assessed. The
controlled nature of the rig ensures consistency in experimental conditions, thereby improving
the reliability and reproducibility of performance evaluation results.
The simulation rig provides a controlled and repeatable environment for leak detection
development, but it remains a simplified physical representation of a real water distribution
system. The simulation rig is limited to a straight 25 mm PVC pipe, a maximum sensor-to-leak
separation of approximately 1.14 m, and a defined set of replaceable leak-hole geometries.
These constraints are acceptable for controlled comparative testing and dataset generation, but
they do not fully represent the wider range of pipe materials, diameters, geometries, and leak
forms encountered in practical infrastructure.
3.4 Device Holder
A dedicated device holder was developed to provide secure attachment of the leak detection
prototype device to the pipe during dataset collection and validation tests, while ensuring
consistent sensor coupling so that measured vibration and acoustic characteristics remain
comparable across experiments. Before fabrication, the holder was first designed and evaluated
in SolidWorks to ensure that the complete prototype could be assembled into a compact and
mechanically stable structure suitable for mounting on the simulation rig. The 3D CAD model,
shown in Figure 3.4.1, was used to determine the overall enclosure size, the arrangement of
internal components, and the positioning of external access features such as the ON/OFF
switch, LoRa antenna and ST-LINK port (for flashing and debugging) opening.
32
--- PAGE 45 ---
Figure 3.4.1: 3D CAD model of the prototype device holder developed in SolidWorks.
This modelling stage was important because the prototype had to accommodate the B-U585I-
IOT02A development board, battery holder, power hardware, and LoRa P2P communication
module within a single enclosure while still remaining sufficiently compact for pipe mounting.
By developing the holder first in CAD, dimensional compatibility and assembly feasibility
could be checked before printing, thereby reducing fabrication iteration and helping ensure that
the final holder matched the physical requirements of the prototype. A more detailed exploded
view of the holder assembly is shown in Figure 3.4.2, together with the bill of materials. This
figure provides a clearer representation of how the printed parts, fasteners, development board,
battery assembly, and pipe-clamping structure are integrated into the final prototype.
Figure 3.4.2: Exploded view and bill of materials of the prototype holder assembly developed in SolidWorks.
33
--- PAGE 46 ---
As shown in Figure 3.4.2, the exploded view also highlights several user-friendly design
features introduced to simplify assembly and maintenance. In particular, the bottom holder
includes a dedicated mounting guidance feature to help position the B-U585I-IOT02A
correctly before fastening, thereby making installation easier and reducing the likelihood of
incorrect placement during repeated assembly. The board is intended to be mounted in only
one correct orientation, such that the side requiring external access is aligned toward the
enclosure openings. In addition, a Type-C wire organizer was incorporated to manage cable
routing more neatly and reduce mechanical interference with surrounding components. These
design considerations improve assembly consistency and usability, which is beneficial during
repeated experimental installation and removal of the prototype.
Item number 10, 11, 12, 14, and 15 in Figure 3.4.2 are the parts of the mounting mechanism
that were developed around a clamp-based attachment method so that the enclosure could be
fixed to the pipe without permanently modifying the test rig. This approach was selected to
achieve a stiff, repeatable mechanical connection while avoiding destructive installation
methods such as drilling or tapping into the pipe. Such a choice aligns with established
vibration measurement guidance that emphasizes rigid mounting to preserve resonant
frequency and maintain measurement fidelity [108]. In addition, clamp-style mounting
methods are commonly used in experimental vibration monitoring when drilling or tapping is
impractical; published evaluation work shows that non-destructive mounting approaches,
including clamp-based methods, can provide usable bandwidth for monitoring applications
when care is taken to ensure secure attachment [109]. As a result, the holder was designed to
use a two-point fastening arrangement based on bolts and nuts that apply controlled
compression to the pipe-contacting surfaces.
Beyond mechanical retention, the holder geometry was also designed to avoid obstructing the
sensing elements, particularly the MEMS microphone. Dedicated microphone clearance
features were incorporated so that the acoustic port is not blocked by the holder during
operation. This design choice aligns with established MEMS microphone integration
guidelines, which emphasize that the housing ports and acoustic paths must be properly
positioned and kept unobstructed to avoid unnecessary attenuation, distortion, or abnormal
frequency response due to poor acoustic path design or partial obstruction [110]. The holder
and enclosure were therefore co-designed so that key device interfaces remain accessible when
mounted, including the switch and antenna routing required for practical system operation.
The external LoRa antenna was intentionally routed outside the enclosure wall, while the
ON/OFF switch was placed in a position that allows straightforward user access without
removing the unit from the pipe. Locating the antenna externally, while avoiding close
proximity to conductive parts, is a standard RF integration practice because nearby metal
objects and unfavorable enclosure configurations can detune antennas and degrade radiation
efficiency; hardware integration guidance typically recommends maintaining a keep-out region
from conductive materials and validating antenna performance in the final mechanical
assembly [111]. Overall, the CAD modelling stage was not only used to define the shape of the
holder, but also to integrate the electrical, sensing, and usability requirements of the prototype
into a manufacturable mechanical design before fabrication.
3.5 Edge AI Model Development
STMicroelectronics' NanoEdge AI Studio is used to train a lightweight machine learning model
for leak detection. NanoEdge AI Studio is an AutoML tool that generates optimized C libraries
of AI algorithms specifically designed for STM32 microcontrollers [13]. For training, the
sensor data were preprocessed into a format suitable for NanoEdge AI Studio. An optimized
34
--- PAGE 47 ---
signal-classification library that satisfies the STM32U585AI's memory and processing
limitations was automatically generated using the studio [76].
3.5.1 Dataset Collection and Preprocessing
Dataset collection involves using the prototype on a controlled leak simulation rig to record
baseline (no-leak) and leak event data. To prevent the model from overfitting specific
scenarios, it is important to focus on capturing a variety of conditions, such as varying leak
sizes, distance from leak, and background noise. Prior research has demonstrated the
importance of this diversity [16].
The first stage of the NanoEdge AI workflow is to prepare the recorded sensor data in a format
that matches the input requirements of the Studio. For time-series classification projects,
NanoEdge AI Studio expects the data to be provided as temporal buffers rather than as isolated
samples [76]. In this format, each line of the dataset corresponds to one independent signal
example containing multiple samples collected at a fixed sampling frequency. ST states that,
for time-series data, the buffer size and the sampling frequency must remain consistent
throughout the whole project, including dataset preparation, benchmarking, and later inference
[76]. The Studio also recommends using a buffer size that is a power of two. In this project, a
buffer length of 512 samples was selected for both the acoustic and vibration channels, and this
same buffer size was preserved throughout model development and embedded deployment.
This choice is consistent with the Studio requirements and also fits the later firmware design,
where the deployed inference libraries are called repeatedly using 512-sample sliding input
windows. The motivation for working with buffers instead of individual samples is illustrated
conceptually in Figure 3.5.1.
Figure 3.5.1: Samples independently (Left) versus Samples as temporal buffers (Right) [76].
As explained in the NanoEdge AI Studio documentation, a single sample represents only one
point in time and therefore contains limited information about the physical phenomenon being
studied [76]. A temporal buffer, in contrast, preserves the trace of the signal over time, making
it easier for the model to distinguish patterns that would be impossible to classify from isolated
scalar values alone [76]. ST’s example specifically shows that two classes can contain the same
individual values while still being distinguishable once their temporal ordering is preserved
[76]. For this reason, temporal buffers are more informative than standalone samples when the
classification problem depends on time-varying behavior, which is the case for leak-induced
acoustic and vibration signals.
To support practical dataset generation, a dedicated Python data logger was developed to
automate the conversion of raw prototype output into the required training format. In the
implemented workflow, the B-U585I-IOT02A prototype transmits sensed acoustic and
vibration data over the ST-LINK virtual COM port using structured UART markers such as --
-BEGIN_SAMPLE---, ---BEGIN_AUDIO_CSV---, and ---BEGIN_VIB_CSV---. The logger
running on the PC listens to these markers, extracts the incoming data streams, and saves them
35
--- PAGE 48 ---
into raw one-column CSV files for both modalities. It then automatically converts the raw
recordings into 512-sample buffer CSV files for NanoEdge AI training, placing them into the
respective directory under the selected label and modality. The script also keeps the sampling
assumptions explicit, using 16 kHz for the acoustic channel and approximately 6.667 kHz for
the vibration channel. A screenshot of the data logger user interface is shown in Figure 3.5.2
and the Python code can be found in this link.
Figure 3.5.2: Screenshot of the data logger UI.
In practical use, dataset collection was performed by mounting the prototype on the simulation
rig and connecting the B-U585I-IOT02A board to a PC through the ST-LINK port while the
logger script was running. The user first selected the required label (folder name) and base
name (of the file) in the logger interface, then operated the simulation rig under either leak or
background conditions. During recording, the firmware sent the acoustic and vibration samples
in the predefined UART format, and the PC software converted them automatically into the
required dataset outputs. This arrangement reduced manual formatting effort and helped keep
the training data consistent across repeated recording sessions. It also made the collection
process easier to scale when multiple leak sizes, distances, and noise conditions were being
recorded.
In addition to the NanoEdge AI training format, the logger also generated an optional secondary
dataset format for later benchmarking against an alternative model under Stretch Goal V.
Specifically, the raw acoustic CSV was converted into a 16 kHz mono WAV, while the
vibration CSV was converted into a one-column signal file. This additional export path did not
affect the NanoEdge AI workflow directly, but it was introduced so that the same rig recordings
could later be reused for YAMNet-based comparison, thereby avoiding duplicate recording
effort and preserving consistency across the two model-development tracks.
3.5.2 Model Training
For this project, model development did not follow a conventional manual training pipeline in
which the user explicitly selects feature extractors, defines the model architecture, and tunes
hyperparameters separately. Instead, NanoEdge AI Studio automates much of this process.
After the project type, target MCU constraints, sensor type, and dataset files are defined, the
Studio searches for suitable combinations of signal preprocessing methods, machine-learning
36
--- PAGE 49 ---
models, and internal hyperparameter settings [76]. In this sense, the training stage for the
present classification task is integrated into the Studio workflow itself rather than being handled
as a separate coding step by the user.
Accordingly, the main engineering task at this stage was not to hand-design the classifier, but
to ensure that the imported data, sampling conditions, and project setup were coherent with the
physical phenomenon being studied. This included keeping the buffer size and sampling
methodology constant, ensuring that the collected leak and background signals were
representative of the intended operating conditions, and iteratively improving the dataset when
necessary.
3.5.3 Benchmarking and Library Export
In NanoEdge AI Studio, the main model-development step for a classification project is carried
out through the benchmarking process. Rather than testing only one fixed pipeline, the Studio
evaluates a large number of candidate libraries built from different combinations of signal
preprocessing, machine-learning model type, and hyperparameter settings. ST describes this as
a search for the most relevant NanoEdge AI library given the user’s MCU target, memory
constraints, sensor type, and imported signal examples [76]. The resulting candidate libraries
may differ in their preprocessing flow, classifier family, internal parameters, and resource
usage. An example of the type of generated ML pipeline explored during this process is shown
in Figure 3.5.3.
Figure 3.5.3: Example of ML pipeline used in benchmarking in NEAI Studio.
Table 3.5.1 listed out the example candidate processing and model options explored during
benchmarking in NanoEdge AI Studio.
Table 3.5.1: Example candidate processing and model options explored during benchmarking in NanoEdge AI Studio.
Stage Candidate options
Detrend Linear, Poly, Aug, No
STFT/FFT STFT-0, STFT-1, STFT-3, STFT-4, STFT-5, FFT, No
Feature extraction Yes, No
Normalize Z-score, Min-Max, Robust, No
PCA PCA 80, PCA 85, PCA 90, PCA 95, No
Pooling Cut Beg, Cut End, Avg Ws, Avg Pool, Max Pool, No
Absolute value Yes, No
Model SEFR, SVM, XGB, RF, MLP
37
[Table 1 on page 49]
Stage | Candidate options
Detrend | Linear, Poly, Aug, No
STFT/FFT | STFT-0, STFT-1, STFT-3, STFT-4, STFT-5, FFT, No
Feature extraction | Yes, No
Normalize | Z-score, Min-Max, Robust, No
PCA | PCA 80, PCA 85, PCA 90, PCA 95, No
Pooling | Cut Beg, Cut End, Avg Ws, Avg Pool, Max Pool, No
Absolute value | Yes, No
Model | SEFR, SVM, XGB, RF, MLP
--- PAGE 50 ---
As illustrated by Figure 3.5.3 and summarized in Table 3.5.1, benchmarking in NEAI Studio
does not evaluate only one fixed processing pipeline. Instead, the Studio explores multiple
candidate combinations across several stages, including optional detrending, frequency-
domain conversion, feature-extraction, normalization, dimensionality reduction, pooling
strategy, absolute-value transformation, and the final machine-learning model type. The
presence of “No” in several stages indicates that the Studio may also choose to skip a
processing step entirely if that produces a better candidate library. In this way, benchmarking
functions as an automated search across multiple preprocessing and model-design alternatives
before selecting the best-performing embedded library. The final selected acoustic and
vibration pipelines are discussed later in Section 4.2.
During benchmarking, candidate libraries are ranked using a primary performance indicator
called the score, which is derived from several secondary metrics. For classification projects,
ST states that these secondary indicators include balanced accuracy, accuracy, F1-score,
Matthews correlation coefficient (MCC), a custom certainty-related measurement, and the
RAM and Flash memory requirements of the resulting library [76]. The benchmark therefore
does not optimize accuracy alone. Instead, the Studio searches for a library that provides strong
classification performance while still fitting within the memory limits of the selected embedded
target. The documentation also notes that execution time can be estimated during the
benchmark, although this is provided as an estimation rather than a direct measurement on the
final hardware [76]. This makes benchmarking particularly suitable for an embedded-AI
workflow, where predictive performance must be balanced against resource constraints rather
than being treated as an isolated objective.
For this project, benchmarking was used as the practical equivalent of model selection and
training. Multiple datasets were imported into the Studio, and the benchmark was allowed to
explore a large range of candidate libraries. From these, the best performing classification
library for each sensing modality was identified using the Studio’s ranking and validation
outputs. As emphasized in the ST documentation, benchmark quality depends strongly on the
coherence of the imported signals, the constancy of sampling conditions, and the
appropriateness of the chosen buffer size for the physical phenomenon under study [76]. Thus,
if benchmark quality is poor, the recommended corrective actions include adjusting the
sampling frequency, changing the buffer size, improving signal quality, and revising the
diversity or quantity of the imported signal examples rather than only rerunning the search
unchanged [76].
Once a suitable library had been identified, NanoEdge AI Studio was used to export the
deployment package. The Studio provides a deploy function that generates the files required to
integrate the selected library into embedded firmware. For deployment in the STM32 codebase,
the key files are the static precompiled NanoEdge AI library file, typically provided as
libneai.a, together with the associated main API header file NanoEdgeAI.h [76]. The export
package also includes additional metadata files such as a JSON description of the generated
library and benchmark information [76]. In the present implementation, the compiled library
file and the main header file were the essential files required for deployment on the
STM32U585AI, since they allow the firmware to initialize the model and call the inference
functions from C code. The resulting exported libraries were then integrated into the embedded
firmware as described later in Section 3.6.
3.5.4 YAMNet Detection Model Training
This section describes the development of an alternative AI model based on a YAMNet-
inspired approach, implemented as part of Stretch Goal V, AI Model Performance Comparison,
where the deployed embedded model (NEAI) is benchmarked against another model
38
--- PAGE 51 ---
(YAMNet) to evaluate detection performance. To achieve this, a Python-based training
pipeline was developed to construct both acoustic and vibration classification models. The
objective was not to replace the primary embedded model, but to provide a reference for
performance comparison under similar dataset conditions.
For the acoustic channel, the model adopted a feature extraction approach based on Mel-
Frequency Cepstral Coefficients (MFCCs). Raw audio signals sampled at 16 kHz were first
converted into time–frequency representations using Mel spectrograms, followed by MFCC
transformation to capture perceptually relevant features. The extracted features were
segmented into overlapping temporal patches (approximately 0.96 s per patch with 50%
overlap) to preserve temporal dynamics while maintaining compatibility with embedded
deployment constraints. A compact two-dimensional convolutional neural network (2D CNN)
was then trained using these MFCC patches. The dataset was split into training (70%),
validation (15%), and testing (15%) subsets. The model was trained using a batch size of 32, a
learning rate of 0.001, and up to 300 epochs, with reproducibility ensured through fixed random
seeds.
For the vibration channel, a similar training strategy was applied, but without MFCC feature
extraction. Instead, raw vibration signals sampled at approximately 6.6 kHz were segmented
into overlapping time windows of similar duration. These windows were used directly as input
to a one-dimensional convolutional neural network (1D CNN), allowing the model to learn
features directly from the temporal signal.
After training, both models were converted into TensorFlow Lite format and further processed
using STM32Cube AI Studio. The STM32Cude AI Studio was used to analyses the models,
optimize them for embedded deployment, and generate C code for integration into the STM32-
based prototype. The conversion process ensures that the trained models can be executed within
the memory and computational constraints of the embedded system [112]. The optimized
acoustic and vibration models’ architecture are shown and discussed in Section 4.3.2.
3.6 Deployment on Embedded Hardware
After benchmarking and exporting the trained models from NanoEdge AI Studio, the final
deployment step was to integrate the inference libraries into the STM32 firmware and execute
them within a periodical embedded workflow. In the final implementation, two separate
classification models were deployed, one for the acoustic channel and one for the vibration
channel. The system performs independent on-device inference for each sensing modality and
combines the results later using a late-fusion decision layer. This structure was selected because
it preserves modality-specific behavior, allows each model to be tuned separately, and
simplifies debugging during deployment. At firmware level, the acoustic and vibration models
are integrated as separate NanoEdge AI libraries with independent initialization and inference
calls.
The deployed firmware follows a periodic operating sequence of sleep → wake → sensing →
inference → LoRa P2P transmission → sleep. In practical operation, the MCU remains in a
low-power state for most of the time and wakes up only at scheduled intervals. Upon wake-up,
the required peripherals are re-enabled, the sensors are configured to their known operating
states, and a 30s detection cycle is started. During this active period, the board records both
microphone and accelerometer data, runs local inference, performs a compact leak decision,
transmits the result through the LoRa P2P module, and then returns to low-power mode. This
section focuses on the embedded deployment and execution of the models, while the detailed
electrical behavior of the wake-sleep cycle is discussed later in section 4.4 Power Consumption.
39
--- PAGE 52 ---
The inference process was constrained by the data shape expected by the exported NanoEdge
AI libraries. Each individual inference call receives a fixed-size input buffer of 512 samples,
which is the same signal length used during model training. Therefore, the firmware does not
classify an entire 30s recording in one pass. Instead, the 30s recording is made out of 10
segments and each segment is a 3s recording, and the segment is scanned repeatedly using a
sliding input buffer. For both sensing channels, the firmware performs 30 sliding inference
slots per segment, where each slot is a buffer containing 512 raw samples. Each slot produces
a pair of class probabilities, namely Leak and Background, together with the predicted class
label. These slot-level outputs are then accumulated into a higher-level decision for the full 3s
segment. This sliding arrangement is explicitly implemented in both the acoustic and vibration
inference modules.
The use of sliding inference slots serves two purposes. First, it allows the model to examine
local signal behavior throughout the whole 3s segment instead of depending on only one short
snapshot. Secondly, it reduces the risk that a short but meaningful leak signature is missed
simply because it occurs near the boundary of a single inference buffer. This is especially
relevant for leakage phenomena, where the signal may appear either as a more persistent
turbulent pattern or as short transient droplet-like events. Prior work in sound event detection
has shown that post-processing and temporal smoothing of frame-level probabilities can
materially affect the final detection score, while acoustic-emission leak studies have similarly
used sliding-window thresholding to retain both burst-type and continuous-type leak behavior
[113]. The present deployment therefore adopts sliding inference not only for compatibility
with the embedded model input length, but also as a practical way to strengthen temporal
robustness before making the final decision.
A further design choice was to keep the number of inference slots fixed at 30 for both sensing
channels, even though the sampling rates differ. The audio channel runs at 16 kHz, while the
vibration channel runs at approximately 6.67 kHz. By the Nyquist criterion, these correspond
to approximate upper retained frequency contents of 8 kHz and 3.33 kHz, respectively [93].
However, by keeping the inference buffer length fixed at 512 samples and using the same
number of sliding slots per 3s segment, both sensing modalities still produce temporally aligned
decision streams over the same observation period. In other words, the physical duration
represented by one slot is different for audio and vibration, but the overall segment-level
decision structure remains synchronized in time. This is advantageous for future development
because it preserves a common timing framework for dual-sensor fusion without forcing both
sensors to share an identical sampling rate.
The final embedded implementation therefore consists of three tightly connected layers. The
first layer is sensor acquisition, where raw acoustic and vibration signals are buffered during
the active interval. The second layer is modality-specific inference, where each sensor stream
is processed by its own NanoEdge AI model using repeated 512-sample sliding slots. The third
layer is the decision layer, where the slot outputs are converted into a 3s segment verdict, then
into a 30s sensor-level decision, and finally into a late-fusion final verdict. This layered
deployment strategy keeps the system modular, the sensing front end, the two AI models, and
the final decision logic can be updated independently without redesigning the whole firmware.
3.7 Decision Logic (Late Fusion)
In this project, the final leak decision was not taken directly from a single NanoEdge AI output,
because the embedded classifier operates on short fixed-length temporal buffers rather than on
a full longer recording. A structured multi-stage decision layer was therefore introduced to
combine multiple local predictions into one stable device-level verdict. This was expected to
40
--- PAGE 53 ---
improve robustness because leak signals are time-varying in nature and may not appear
uniformly throughout the recording. Instead, leak evidence may appear either as a continuous
leak signal over time or as short, irregular leak-related bursts. For this reason, the proposed
decision logic was designed to evaluate not only the confidence of individual inferences, but
also how that evidence behaves across time. It therefore combines two complementary ideas:
temporal hysteresis, which favors persistent evidence over time, and strong fraction, which
allows short but confident evidence to remain influential. Each detection cycle comprises a 30
s recording, which is subsequently partitioned into shorter segments and processed through the
proposed decision logic to determine the final classification result. A graphical overview of the
30 s segmentation is shown in Figure 3.7.1.
Figure 3.7.1: Segmentation of a 30s detection recording.
For clarity, the terminology used in this thesis is standardized as follows. As shown in Figure
3.7.1, one 3s recording is referred to as a segment. Each segment is divided, for decision
purposes, into six 0.5s windows. Each 0.5s window consists of five slots, and each slot
corresponds to one 512-sample inference input. This terminology is adopted to make the
explanation easier to follow, especially when comparing slot-level model outputs with
window-level and segment-level decisions.
The 30s recording duration was selected as a practical compromise between temporal
robustness, response time, and energy consumption. The intention was not to increase the
model input size, since each inference still uses only a 512-sample buffer, but to provide
repeated opportunities to observe whether leak evidence is persistent, intermittent, or isolated.
Dividing the 30s recording into ten 3s segments created ten comparable decision units that
were long enough to contain meaningful temporal behavior while still remaining manageable
for an embedded low-power implementation. Within each 3s segment, the signal was further
organized into six windows, with each window containing five slots, giving a total of 30 slots
per segment. This corresponds to an effective interval of about 0.1s per slot. This multi-level
41
--- PAGE 54 ---
structure was chosen so that the segment decision would depend on short-term temporal
consistency rather than a single isolated prediction. Grouping several nearby slots within one
window smooths fluctuations in the raw model output, while keeping six windows across the
3s segment still preserves enough temporal resolution to distinguish a sustained leak pattern
from a brief spike. Using substantially fewer windows would make the decision too coarse,
while using substantially more would make it more sensitive to random variation.
A buffer length of 512 samples was selected from the combined constraints of NanoEdge AI
requirements, temporal resolution, and embedded resource limits. NanoEdge AI requires a
fixed input size and recommends a power-of-two buffer length that remains consistent
throughout training and deployment. Within those constraints, 512 was considered an
appropriate compromise because it is short enough to preserve local time-domain behavior
while keeping RAM usage, computational cost, and latency within a practical range for the B-
U585I-IOT02A. Larger powers of two such as 1024 or 2048 would increase the duration
represented by each inference buffer, but this would also reduce temporal sensitivity and
increase the risk of mixing leak and background behavior within the same input. For this
project, such a trade-off was not preferred, because the decision logic was intended to observe
how evidence evolves over time using repeated short inferences rather than fewer but much
longer ones.
The choice of 512 samples was especially suitable for the vibration channel because, at an
effective sampling rate of about 6.67 kHz, each 0.1 s slot contains only about 667 samples.
This means that 512 samples already use most of the data available within a short local interval.
The same input length was then retained for the acoustic channel, not because the microphone
required the same physical time duration, but because a common buffer size simplified the
firmware structure, dataset preparation, and timing alignment between the two sensing
modalities. In the final late-fusion design, the two channels do not need identical physical
window durations, but it is beneficial that they follow the same segmentation framework so
that both contribute comparable streams of evidence over the same 3s segment and 30s
recording structure.
3.7.1 Three-Second Segment Decision Logic
For each 512-sample inference slot, the classifier outputs two probabilities, the probability of
the Leak class and the probability of the Background class. These slot-level probabilities are
not used directly as the final segment decision. Instead, they are aggregated within the 3s
segment using two complementary rules.
The 3s segment decision was intentionally based on two complementary rules namely temporal
hysteresis and strong fraction. Temporal hysteresis was introduced to favor sustained evidence
across time, which is useful when leak behavior is present but only at moderate confidence.
Strong fraction was introduced to preserve short-duration but highly confident leak events that
might otherwise be suppressed by averaging. These two rules were expected to complement
each other. A persistence-only rule would be more suitable for continuous leak behavior but
could miss intermittent events, whereas a strong-event-only rule would be too sensitive to
isolated spikes. Combining both allowed the logic to detect two possible leak patterns, weaker
signals that continue over time, and shorter signals that stand out more clearly.
The first rule is temporal hysteresis, implemented through the 0.5s windows. Within each 0.5s
window, the leak probabilities of all slot outputs that fall inside that window are averaged. A
window is considered leaky when its average leak confidence is above a predefined threshold
(thres.5 in Table 3.7.1 that summarizes the threshold value of the final version used.). For the
acoustic channel, the segment is classified as leak by this rule only when more than half
42
--- PAGE 55 ---
(thres.6) of the six windows are leaky as graphically illustrated in Figure 3.7.2. This makes the
acoustic channel intentionally conservative, because the microphone is generally more exposed
to environmental disturbances and should not trigger a leak verdict solely because of one short
spike. By contrast, the vibration channel uses a less permissive but still sensitive persistence
rule where it requires at least two (thres.14) leaky windows to be classified as leak.
Figure 3.7.2: Graphical interpretation of the temporal hysteresis detection logic.
The second rule is strong fraction. This rule is intended to preserve short-duration but highly
confident events that may be too brief to satisfy temporal hysteresis. In this rule, the system
counts how many sliding inference slots within the segment having a leak confidence above a
strong-confidence threshold (thres.7). If the fraction of such strong slots is sufficiently high
(thres.8), the segment is still classified as leak even if the persistent-window rule is not satisfied
as graphically illustrated in Figure 3.7.3. Conceptually, this protects the system from missing
leak events that are sharp, sparse, or intermittent, such as weak droplets or short bursts that
may not dominate the full segment but are nevertheless meaningful. In this way, temporal
hysteresis and strong fraction are not competing rules, but they are designed to complement
one another. Temporal hysteresis covers persistent leak behavior, while strong fraction covers
short but convincing leak evidence.
Figure 3.7.3: Graphical interpretation of the strong fraction detection logic.
43
--- PAGE 56 ---
A 3s segment is therefore declared as Leak when either temporal hysteresis or strong fraction
is triggered. If neither rule is triggered, the segment is declared as Background. The result of
each segment is stored together with its average leak confidence, average background
confidence, and strong-slot fraction. These stored values are then passed to the 30s decision
stage rather than being discarded. This makes the 3s logic meaningful beyond local
classification where it acts as a structured filter that produces interpretable evidence for the
higher-level decision layer. An example of this per-segment summary output is illustrated by
the detection log in Figure 3.7.4.
Figure 3.7.4: Per-segment detection summary output.
3.7.2 Thirty-Second Decision Logic
A single device decision is not made from only one 3s segment. Instead, the firmware records
and analyzes ten (thres.17) consecutive 3s segments, giving a total observation interval of 30s
for each sensing channel. This second aggregation stage was introduced to strengthen
robustness against short disturbances and to make the final decision depending on a pattern
observed over time rather than on one local event. Importantly, the 30s logic does not ignore
the 3s verdicts. The 30s logic explicitly uses the segment-level leak decisions generated by the
3s stage, thereby making the earlier decision layer functionally meaningful in the final result.
At the 30s stage, a segment is first labelled as a persistent leak segment when two conditions
are simultaneously satisfied:
1) the 3s segment has already been classified as Leak; and
2) its average leak confidence is at least 0.58 (thres.18).
A segment is labelled as a strong leak segment when the 3s segment has already been classified
as Leak and, in addition, either its average leak confidence is at least 0.75 (thres.21) or its
strong-slot fraction is at least 0.35 (thres.22). These definitions specifically place the 3s leak
verdict first. This makes the 30s stage more robust, because it builds on prior accepted leak
evidence instead of bypassing it.
44
--- PAGE 57 ---
The 30s temporal hysteresis rule is then applied at segment level. It is triggered when either at
least five (thres.19) persistent leak segments are observed out of the ten segments, or when
there is a consecutive run of at least three (thres.20) persistent leak segments. The first
condition captures distributed persistence across the full 30s observation period, while the
second condition preserves the ability to react to a shorter but clearly sustained run of leak
behavior.
The 30s strong fraction rule is triggered when at least three (thres.23) strong leak segments are
present within the 30s interval. This again provides a complementary pathway whereas, even
if the leak does not dominate the full 30s record, multiple highly confident segments can still
provide persuasive evidence of abnormality.
The 3s and 30s stages together form a temporal decision model, in which short-duration
inference outputs are progressively aggregated into higher-level decisions to improve
robustness against transient errors and unstable predictions.
3.7.3 Sensor Score
After the 30s logic is evaluated separately for the acoustic and vibration channels, each channel
is converted into a continuous sensor score between 0 and 1. This score is not produced from
a single threshold alone; instead, it combines several pieces of evidence. Specifically, the score
contains contributions from:
1) the ratio of 3s segments classified as leak,
2) the ratio of persistent leak segments,
3) the ratio of strong leak segments, and
4) the mean leak confidence among the segments already classified as leak.
Additional small bonuses are then added if the 30s temporal hysteresis rule is triggered and if
the 30s strong-fraction rule is triggered. This scoring method was chosen because it preserves
richer information than a purely binary decision. A channel that meets both of the 30s
conditions should be regarded as more convincing than one that does not, and a channel with
regular moderate evidence should not be regarded as being the same as a channel with only
one isolated spike. The resulting score therefore acts as a compact but evidence-aware
summary of each sensing modality.
In the current implementation, the sensor score for each channel is computed as
𝑆𝑒𝑛𝑠𝑜𝑟 𝑆𝑐𝑜𝑟𝑒 = 0.25(3𝑠 𝑙𝑒𝑎𝑘 𝑟𝑎𝑡𝑖𝑜)+0.35(𝑝𝑒𝑟𝑠𝑖𝑠𝑡𝑒𝑛𝑡 𝑙𝑒𝑎𝑘 𝑟𝑎𝑡𝑖𝑜)
+0.20(𝑠𝑡𝑟𝑜𝑛𝑔 𝑙𝑒𝑎𝑘 𝑟𝑎𝑡𝑖𝑜)
+0.20(𝑚𝑒𝑎𝑛 𝑙𝑒𝑎𝑘 𝑐𝑜𝑛𝑓𝑖𝑑𝑒𝑛𝑐𝑒 𝑜𝑛 𝑑𝑒𝑡𝑒𝑐𝑡𝑒𝑑 𝑠𝑒𝑔𝑚𝑒𝑛𝑡𝑠)+𝑏𝑜𝑛𝑢𝑠𝑒𝑠
where the temporal-hysteresis bonus is 0.05 (thres.28) and the strong-fraction bonus is also
0.05 (thres.29) when the corresponding rule is triggered. The stronger weighting on the
persistent leak ratio reflects the design intention that sustained leak evidence should be more
influential than isolated evidence.
3.7.4 Late Fusion and Final Verdict
The final device decision is obtained by late fusion of the acoustic and vibration sensor scores.
In the current implementation (final version, V2), the acoustic score is assigned a weight of
0.80 (thres.30), while the vibration score is assigned a weight of 0.20 (thres.31). The heavier
acoustic weighting reflects the stronger standalone performance of the acoustic model observed
during development, while the vibration channel is retained as a complementary cue that can
strengthen the final decision in cases where structural vibration remains informative.
Additional fusion bonuses are added when both channels simultaneously trigger 30s temporal
45
--- PAGE 58 ---
hysteresis (thres.32) and when both channels simultaneously trigger 30s strong fraction
(thres.33). This rewards cross-modal agreement without forcing both channels to be identical
in strength.
The final fusion score is therefore,
𝐹𝑢𝑠𝑖𝑜𝑛 𝑆𝑐𝑜𝑟𝑒 = 0.80(𝐴𝑐𝑜𝑢𝑠𝑡𝑖𝑐 𝑆𝑐𝑜𝑟𝑒)+0.20(𝑉𝑖𝑏𝑟𝑎𝑡𝑖𝑜𝑛 𝑆𝑐𝑜𝑟𝑒)+𝑎𝑔𝑟𝑒𝑒𝑚𝑒𝑛𝑡 𝑏𝑜𝑛𝑢𝑠𝑒𝑠.
A final verdict of Leak is issued when the fusion score is greater than or equal to 0.58 (thres.34).
Otherwise, the final verdict is Background. The firmware also reports the overall average leak
confidence and average background confidence across all processed slots, which provide an
interpretable confidence summary for logging and LoRa P2P transmission. The example late-
fusion detection output in Figure 3.7.5 demonstrates this final stage, showing the per-sensor
scores, fusion weights, fusion score, and final verdict.
Figure 3.7.5: 30s late fusion detection summary output.
Table 3.7.1 summarizes the thresholds used in the implementation for first (V1) and second
(V2) version. These values are firmware-defined and correspond to the deployed decision
logic. The values in Table 3.7.1 are further justified in Results and Discussion Section 4.1.
Table 3.7.1: Summary of the thresholds used in the implementation of decision logic.
Value Value (V1) Value
Stage thres. Parameter Meaning
Type (V2)
Segment One acoustic decision
1 Duration 3s 3s
duration segment
Sliding
Number of 512-sample slot
2 inference slots Value 30 30
inferences
per segment
Decision
Six 0.5s windows per
3 windows per Value 6 6
segment
3s segment
acoustic
segment 512 512 Raw samples passed into
4 Slot size Value
samples samples one inference
A 0.5s window is leaky if its
Window leak
5 Threshold 0.60 0.60 average leak confidence ≥
threshold
0.60
Temporal Acoustic leak if more than
> 50% of > 50% of
6 hysteresis Threshold half of the six windows are
windows windows
threshold leaky
46
[Table 1 on page 58]
Stage | thres. | Parameter | Value
Type | Value (V1) | Value
(V2) | Meaning
3s
acoustic
segment | 1 | Segment
duration | Duration | 3s | 3s | One acoustic decision
segment
 | 2 | Sliding
inference slots
per segment | Value | 30 | 30 | Number of 512-sample slot
inferences
 | 3 | Decision
windows per
segment | Value | 6 | 6 | Six 0.5s windows per
segment
 | 4 | Slot size | Value | 512
samples | 512
samples | Raw samples passed into
one inference
 | 5 | Window leak
threshold | Threshold | 0.60 | 0.60 | A 0.5s window is leaky if its
average leak confidence ≥
0.60
 | 6 | Temporal
hysteresis
threshold | Threshold | > 50% of
windows | > 50% of
windows | Acoustic leak if more than
half of the six windows are
leaky
--- PAGE 59 ---
Strong slot A slot is strong if leak
7 Threshold 0.80 0.80
threshold confidence ≥ 0.80
Strong fraction Acoustic leak if strong slots
8 Threshold 0.30 0.30
threshold / all slots ≥ 0.30
Segment One vibration decision
9 Duration 3s 3s
duration segment
Sliding
Number of 512-sample slot
10 inference slots Value 30 30
inferences
per segment
Decision
Six 0.5s windows per
11 windows per Value 6 6
segment
segment
512 512 Raw samples passed into
12 Slot size Value
3s samples samples one inference
vibration
segment A 0.5s window is leaky if its
Window leak
13 Threshold 0.60 0.60 average leak confidence ≥
threshold
0.60
Temporal at least 1 at least 2 Vibration leak if at least 𝑛
14 hysteresis Threshold leaky leaky windows are leaky (V1: ≥1,
threshold window windows V2: ≥2)
Strong slot A slot is strong if leak
15 Threshold 0.80 0.80
threshold confidence ≥ 0.80
Strong fraction Vibration leak if strong slots
16 Threshold 0.30 0.35
threshold / all slots ≥ 0.35
Ten consecutive 3s segments
Number of
17 Value 10 10 form one 30s decision
segments
interval
Persistent In V2, Segment must
segment Not used in already be leak and have
18 Threshold 0.58
confidence V1 average leak confidence ≥
threshold 0.58
30s
V1 temporal rule based
sensor
Segment directly on segment average
log ic Persistent Average ≥ leak confidence.
19 segment count Threshold 5
threshold 0.60 and In V2, temporal hysteresis if
count > 5 at least 5 persistent segments
occur
In V2, temporal hysteresis
Consecutive
Not used in also triggers if 3 persistent
20 persistent run Threshold 3
V1 segments occur
threshold
consecutively
47
[Table 1 on page 59]
 | 7 | Strong slot
threshold | Threshold | 0.80 | 0.80 | A slot is strong if leak
confidence ≥ 0.80
 | 8 | Strong fraction
threshold | Threshold | 0.30 | 0.30 | Acoustic leak if strong slots
/ all slots ≥ 0.30
3s
vibration
segment | 9 | Segment
duration | Duration | 3s | 3s | One vibration decision
segment
 | 10 | Sliding
inference slots
per segment | Value | 30 | 30 | Number of 512-sample slot
inferences
 | 11 | Decision
windows per
segment | Value | 6 | 6 | Six 0.5s windows per
segment
 | 12 | Slot size | Value | 512
samples | 512
samples | Raw samples passed into
one inference
 | 13 | Window leak
threshold | Threshold | 0.60 | 0.60 | A 0.5s window is leaky if its
average leak confidence ≥
0.60
 | 14 | Temporal
hysteresis
threshold | Threshold | at least 1
leaky
window | at least 2
leaky
windows | Vibration leak if at least 𝑛
windows are leaky (V1: ≥1,
V2: ≥2)
 | 15 | Strong slot
threshold | Threshold | 0.80 | 0.80 | A slot is strong if leak
confidence ≥ 0.80
 | 16 | Strong fraction
threshold | Threshold | 0.30 | 0.35 | Vibration leak if strong slots
/ all slots ≥ 0.35
30s
sensor
logic | 17 | Number of
segments | Value | 10 | 10 | Ten consecutive 3s segments
form one 30s decision
interval
 | 18 | Persistent
segment
confidence
threshold | Threshold | Not used in
V1 | 0.58 | In V2, Segment must
already be leak and have
average leak confidence ≥
0.58
 | 19 | Persistent
segment count
threshold | Threshold | Segment
Average ≥
0.60 and
count > 5 | 5 | V1 temporal rule based
directly on segment average
leak confidence.
In V2, temporal hysteresis if
at least 5 persistent segments
occur
 | 20 | Consecutive
persistent run
threshold | Threshold | Not used in
V1 | 3 | In V2, temporal hysteresis
also triggers if 3 persistent
segments occur
consecutively
--- PAGE 60 ---
V1 strong rule based directly
on segment average leak
Strong segment Segment
confidence.
21 confidence Threshold Average ≥ 0.75
In V2, strong segment if
threshold 0.80
already leak and average
leak confidence ≥ 0.75
Strong segment In V2, strong segment also if
Not used in
22 slot-fraction Threshold 0.35 already leak and strong-slot
V1
threshold fraction ≥ 0.35
Strong fraction triggers if at
Strong segment
23 Threshold 3 3 least 3 strong segments
count threshold
occur
3s leak-ratio Not used in Contribution from number
24 Weight 0.25
weight V1 of 3s leak segments
Persistent-ratio Not used in Contribution from number
25 Weight 0.35
weight V1 of persistent leak segments
V1 uses different score
weighting depending on
Strong-ratio Conditional triggered logic.
26 Weight 0.20
weight in V1 In V2, the value is the
contribution from number of
strong leak segments
Sensor
score V1 uses different score
weighting depending on
Mean leak- triggered logic.
Conditional
27 confidence Weight in V1 0.20 In V2, the value is the
weight contribution from average
leak confidence on detected
segments
Not used in Added if 30s temporal
28 Temporal bonus Score 0.05
V1 hysteresis triggers
Not used in Added if 30s strong fraction
29 Strong bonus Score 0.05
V1 triggers
Weight of acoustic sensor
30 Acoustic weight Weight 0.70 0.80
score
Vibration Weight of vibration sensor
31 Weight 0.30 0.20
weight score
Late Both-sensors Not used in Added when both channels
32 Score 0.05
fusion temporal bonus V1 trigger temporal hysteresis
Both-sensors Not used in Added when both channels
33 Score 0.05
strong bonus V1 trigger strong fraction
Final fusion Final verdict is Leak if
34 Threshold 0.60 0.58
threshold fusion score ≥ 0.58
48
[Table 1 on page 60]
 | 21 | Strong segment
confidence
threshold | Threshold | Segment
Average ≥
0.80 | 0.75 | V1 strong rule based directly
on segment average leak
confidence.
In V2, strong segment if
already leak and average
leak confidence ≥ 0.75
 | 22 | Strong segment
slot-fraction
threshold | Threshold | Not used in
V1 | 0.35 | In V2, strong segment also if
already leak and strong-slot
fraction ≥ 0.35
 | 23 | Strong segment
count threshold | Threshold | 3 | 3 | Strong fraction triggers if at
least 3 strong segments
occur
Sensor
score | 24 | 3s leak-ratio
weight | Weight | Not used in
V1 | 0.25 | Contribution from number
of 3s leak segments
 | 25 | Persistent-ratio
weight | Weight | Not used in
V1 | 0.35 | Contribution from number
of persistent leak segments
 | 26 | Strong-ratio
weight | Weight | Conditional
in V1 | 0.20 | V1 uses different score
weighting depending on
triggered logic.
In V2, the value is the
contribution from number of
strong leak segments
 | 27 | Mean leak-
confidence
weight | Weight | Conditional
in V1 | 0.20 | V1 uses different score
weighting depending on
triggered logic.
In V2, the value is the
contribution from average
leak confidence on detected
segments
 | 28 | Temporal bonus | Score | Not used in
V1 | 0.05 | Added if 30s temporal
hysteresis triggers
 | 29 | Strong bonus | Score | Not used in
V1 | 0.05 | Added if 30s strong fraction
triggers
Late
fusion | 30 | Acoustic weight | Weight | 0.70 | 0.80 | Weight of acoustic sensor
score
 | 31 | Vibration
weight | Weight | 0.30 | 0.20 | Weight of vibration sensor
score
 | 32 | Both-sensors
temporal bonus | Score | Not used in
V1 | 0.05 | Added when both channels
trigger temporal hysteresis
 | 33 | Both-sensors
strong bonus | Score | Not used in
V1 | 0.05 | Added when both channels
trigger strong fraction
 | 34 | Final fusion
threshold | Threshold | 0.60 | 0.58 | Final verdict is Leak if
fusion score ≥ 0.58
--- PAGE 61 ---
As shown in Table 3.7.1, the first version (V1) operates slightly different than the second
version (V2). In V1, the 30s sensor logic operated directly on the average leak confidence of
each 3s segment, rather than on the persistent-segment formulation introduced in V2. In V1,
the 30s sensor score was not formed using the V2 ratio-based weighting structure. Instead, it
was computed conditionally from the overall average leak confidence and the average
confidence of strong segments, using different weight combinations depending on whether the
temporal hysteresis, strong fraction, or both were triggered. This will be further justified in
Results and Discussion Section 4.1. Figure 3.7.6 illustrates the flow chart of the prototype’s
periodically detection with V2 decision logic implemented.
Figure 3.7.6: The device periodically detection flow chart with V2 decision logic implemented.
3.8 Testing and Validation
To evaluate whether the proposed system meets its functional and low-power objectives,
testing and validation were carried out from two perspectives. First, the leak detection
performance was assessed using labelled leak and background trials to quantify classification
accuracy and related metrics. Second, measurements were performed to evaluate the current
drawn by both the MCU alone and the entire board under different operating states. Together,
these tests provide evidence on whether the system is capable of reliable embedded leak
detection while also demonstrating the extent to which low-power operation is achieved in the
current implementation of the prototype.
49
--- PAGE 62 ---
3.8.1 Measuring AI Detection Model Accuracy
The accuracy of the proposed AI leak detection system was evaluated by running inference
directly on the embedded prototype during operation on the simulation rig, rather than by
exporting recorded files and testing them offline on a PC as shown in Figure 3.8.1.
Figure 3.8.1: AI model validating on simulation rig.
This approach was selected because the final system is intended to operate as a standalone
embedded device, where the combined effects of sensing, buffering, embedded inference,
decision logic, and wireless communication all influence the actual detection outcome.
Evaluating the model in this way therefore provides a more realistic measurement of deployed
performance than testing only pre-recorded signals in an offline software environment. Similar
studies in water-pipeline monitoring have also validated embedded or IoT-based leak detection
systems using a physical prototype and a real or representative testbed, rather than relying only
on offline file-based analysis. For example, Boujelben et al. reported a lightweight deep-
learning leak detection system evaluated on a real small-scale pipeline testbed using an IoT
device prototype, with the embedded model deployed on the sensing node itself [114].
In this project, the detection pipeline produces three levels of verdict, namely the raw inference
result, the 3-second verdict, and the 30-second verdict. The raw inference result corresponds
to the immediate class output produced by the NanoEdge AI model for each inference slot. The
3-second verdict is the result after the slot-level outputs are processed by the first stage of the
decision logic described in Section 3.7.1. The 30-second verdict is the final aggregated result
after temporal decision logic and late fusion have been applied over the full observation
interval, as described in Sections 3.7.2 to 3.7.4. Recording all three verdict types is important
because it allows the contribution of the decision logic to be assessed explicitly. In other words,
the methodology does not only measure whether the AI model can classify leak and
background conditions, but also whether the added decision structure improves the practical
detection accuracy of the full embedded system.
To make this evaluation manageable during repeated rig experiments, the STM32 firmware
was modified to transmit every detection result in a compact comma-separated format through
the LoRa P2P link. Each output line was structured as:
𝑟𝑒𝑠𝑢𝑙𝑡 𝑡𝑦𝑝𝑒,𝑐𝑙𝑎𝑠𝑠 𝑛𝑎𝑚𝑒,𝑐𝑜𝑛𝑓𝑖𝑑𝑒𝑛𝑐𝑒 𝑙𝑒𝑣𝑒𝑙
For example, a raw slot-level result, a 3-second result, and a 30-second result can all be
transmitted using the same general format while being distinguished by the first field. An
example of the transmitted output is shown in Figure 3.8.1.
50
--- PAGE 63 ---
Figure 3.8.2: Example LoRa P2P payload format for AI detection result extraction.
By separating the three fields with commas, the text captured from the serial monitor of the
base LoRa P2P module can be copied directly into a text file or spreadsheet software without
manual rewriting. This reduces transcription error and makes it possible to sort, filter, and
group the results efficiently according to verdict type and predicted class. Compared with
manual logging, this method is faster, more repeatable, and better suited for repeated
experimental trials.
After collecting, the transmitted results were imported into Microsoft Excel for organization
and counting. For each verdict type, the predicted class was compared against the known
ground-truth condition of the experiment, namely Leak or Background. Based on this
comparison, the outputs were grouped into the four standard entries of a confusion matrix:
1) True Positive (TP): a leak condition correctly classified as leak
2) True Negative (TN): a background condition correctly classified as background
3) False Positive (FP): a background condition incorrectly classified as leak
4) False Negative (FN): a leak condition incorrectly classified as background
Since the proposed device is intended for practical monitoring, all four outcomes are important:
missed leaks reduce safety and usefulness, while false alarms reduce trust in the system and
may increase unnecessary inspection effort. Once the confusion matrix was populated, several
standard classification metrics were calculated in Excel using formula-based cell references.
These metrics provide a more complete view of performance than accuracy alone. The metrics
are:
𝑇𝑃+𝑇𝑁
𝐴𝑐𝑐𝑢𝑟𝑎𝑐𝑦 = (Eq 3.8.1)
𝑇𝑃+𝑇𝑁+𝐹𝑃+𝐹𝑁
51
--- PAGE 64 ---
Accuracy gives the proportion of all classifications that were correct. It provides an overall
summary of performance, but by itself it may be misleading if one class is easier to predict than
the other [115].
𝑇𝑃
𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛 = (Eq 3.8.2)
𝑇𝑃+𝐹𝑃
Precision measures how often a predicted leak is truly a leak [115]. In practical terms, it
indicates how trustworthy a positive alarm is, and a high precision means the system generates
fewer false alarms [115].
𝑇𝑃
𝑅𝑒𝑐𝑎𝑙𝑙 = (Eq 3.8.3)
𝑇𝑃+𝐹𝑁
Recall, also referred to as sensitivity or true positive rate, measures how many actual leaks are
successfully detected [115]. In this project, recall is especially important because missed leaks
may reduce the usefulness of the device in real deployment.
𝑇𝑁
𝑆𝑝𝑒𝑐𝑖𝑓𝑖𝑐𝑖𝑡𝑦 = (Eq 3.8.4)
𝑇𝑁+𝐹𝑃
Specificity measures how well the system correctly identifies non-leak conditions [115]. This
metric is useful for evaluating resistance to false alarms during background operation. Since
𝐹𝑃
the false positive rate (FPR) is defined as , specificity can equivalently be understood as
𝐹𝑃+𝑇𝑁
1−𝐹𝑃𝑅.
𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛×𝑅𝑒𝑐𝑎𝑙𝑙
𝐹1 𝑆𝑐𝑜𝑟𝑒 = 2×
𝑃𝑟𝑒𝑐𝑖𝑠𝑖𝑜𝑛+𝑅𝑒𝑐𝑎𝑙𝑙 (Eq 3.8.5)
The F1 score combines precision and recall into a single value using their harmonic mean
[115]. It is useful when both missed detections and false alarms must be considered together,
rather than focusing on only one type of error.
1
𝐵𝑎𝑙𝑎𝑛𝑐𝑒𝑑 𝐴𝑐𝑐𝑢𝑟𝑎𝑐𝑦 = (𝑅𝑒𝑐𝑎𝑙𝑙+𝑆𝑝𝑒𝑐𝑖𝑓𝑖𝑐𝑖𝑡𝑦) (Eq 3.8.6)
2
Balanced accuracy is the average of sensitivity and specificity [116]. This is particularly useful
when comparing performance in cases where the numbers of leak and background samples are
not perfectly balanced, because it gives equal importance to both classes.
Using multiple performance metrics is important in this project because the device is intended
for real-world monitoring, where a high overall accuracy alone does not necessarily imply good
practical performance. For example, a model could achieve a seemingly good accuracy if it
predicts the majority class often, while still performing poorly at detecting true leaks. By
reporting precision, recall, specificity, F1 score, and balanced accuracy alongside accuracy, the
evaluation more clearly reflects both the leak-detection capability and the false-alarm behavior
of the system.
To improve fairness and repeatability, the same labelled test conditions were used across all
compared verdict types. In other words, the raw inference results, 3-second results, and 30-
second results were extracted from the same experimental runs so that differences in
52
--- PAGE 65 ---
performance could be attributed to the decision logic rather than to changes in the test
conditions. This is important because the purpose of the methodology is not only to measure
final system accuracy, but also to determine whether the intermediate and final decision layers
contribute meaningful improvement over direct slot-level inference.
Overall, this procedure provides a practical and deployment-relevant method for evaluating the
embedded AI system. It reflects the actual operating workflow of the prototype, reduces manual
logging effort through structured LoRa P2P output, and allows standard classification metrics
to be derived systematically from rig-based experiments. The resulting accuracy comparison
for the three verdict levels is presented and discussed later in Section 4.1
3.8.2 Measuring Power Consumption
Power consumption measurement was carried out to quantify the electrical demand of the
proposed device during both low-power and active operation. Since the prototype is intended
for battery-powered deployment, it is important to distinguish between the power consumed
by the STM32U585AI MCU itself and the power consumed by the entire development-board-
based prototype. For this reason, two complementary measurement approaches were used. The
first focused on the MCU supply path only, in order to evaluate the effectiveness of the
implemented low-power modes. The second measured the current drawn by the complete
hardware system, including the development board and connected external modules, in order
to estimate the practical power demand of the prototype as assembled. Figure 3.8.2 shows the
setup for the MCU-only measurement.
Figure 3.8.3: Setup for MCU current measurement.
From Figure 3.8.2, a digital multimeter was connected in series across JP3 on the B-U585I-
IOT02A. This jumper location is suitable because it lies on the supply path associated with the
target MCU domain, allowing the current drawn by the MCU to be observed without directly
measuring the total current consumed by the rest of the board. Figure 3.8.3 shows the power
tree diagram extracted from the datasheet that shows the position of the jumper JP3 in relation
to the MCU supply path [117].
53
--- PAGE 66 ---
Figure 3.8.4: Power-tree diagram of the B-U585I-IOT02A showing JP3 in the MCU supply path [117].
By opening the jumper at JP3 shown in Figure 3.8.3, and inserting the ammeter in series, the
current flowing into the MCU section can be measured while the firmware transitions the
device into different low-power modes, namely STOP2, STOP3, and SHUTDOWN. This
method is appropriate for characterizing the low-power behavior of the controller itself, which
is necessary because datasheet-level low-power claims apply primarily to the MCU rather than
to the full development platform [15]. The MCU-only current measurement results are
presented and discussed in section 4.4.
Although MCU-only measurement is useful for verifying low-power firmware operation, it
does not represent the actual current required by the full prototype in deployment. Therefore,
a second measurement was performed on the entire board-level system. In this setup, the
multimeter was connected in series with the output voltage terminal (𝑉 ) of the buck boost
𝑜𝑢𝑡
converter supplying the development board, as shown in Figure 3.8.4.
Figure 3.8.5: Setup for full board current measurement.
54
--- PAGE 67 ---
The configuration shown in Figure 3.8.4 is able to capture the current drawn by the entire B-
U585I-IOT02A board under a given test condition. Unlike the JP3 method, this measurement
reflects the practical current that must be supplied to keep the prototype operating as an
assembled device. The full board current measurement results are presented and discussed in
section 4.4.
4. Results and Discussion
4.1 AI Model Accuracy
This section presents the classification accuracy achieved by each version of the embedded AI
leak detection model under different decision logic schemes. In total, three AI model versions
and two decision logic versions were evaluated. For clarity, each model configuration is labeled
as V𝑛 - DL V𝑚, where V𝑛 denotes the model version, with later versions trained using larger
datasets, and DL V𝑚 denotes the decision logic version. The decision logic was updated once,
from DL V1 to DL V2, by adjusting the parameters and thresholds listed in Table 3.7.1.
Accordingly, V1 - DL V1 refers to the first model trained on the smallest dataset with the first
decision logic, whereas V1 - DL V2 refers to the same model and dataset evaluated using the
updated logic. Similarly, V2 - DL V2 represents the larger model trained with an expanded
dataset and evaluated using the updated logic, while V3 - DL V2 represents the largest model
version with the same updated logic. The number of training samples used for each model
version is summarized in Table 4.1.1.
Table 4.1.1: Dataset size of different model version (512 samples per buffer).
Dataset size
Model
Acoustic - Buffers (Samples) Vibration – Buffers (Samples)
version
Leak Background Leak Background
24,628 10112 4,992
V1 12,168 (6,230,016)
(12,609,536) (5,177,344) (2,555,904)
49,920
V2 39,936 (20,447,232) 34,304 (17,563,648) 20,224 (10,354,688)
(25,559,040)
71,136
V3 49,296 (25,239,552) 56,320 (28,835,840) 30,080 (15,400,960)
(36,421,632)
As shown in Table 4.1.1, the dataset size was increased progressively from V1 to V2, and then
to V3, for both the acoustic and vibration channels, rather than maintaining a fixed training
volume across all versions. This progressive increase was intended to improve the robustness
of the trained models by exposing them to a wider range of signal patterns and reducing the
likelihood that the classifier would learn only a narrow subset of leak conditions. As discussed
earlier in Section 3.5.1, improving model performance depends not only on increasing the
number of samples, but also on increasing the diversity of training conditions. In this sense, the
progression from V1 to V3 should be understood as a deliberate attempt to improve
generalization by expanding both the quantity of data and the variety of signal characteristics
presented during training.
A dataset that is too small, such as V1, may not provide sufficient variation for the model to
learn stable representations of leak and background conditions, which can reduce performance
when the embedded system is tested under unseen scenarios. Conversely, although a larger
55
[Table 1 on page 67]
Model
version | Dataset size |  |  | 
 | Acoustic - Buffers (Samples) |  | Vibration – Buffers (Samples) | 
 | Leak | Background | Leak | Background
V1 | 24,628
(12,609,536) | 12,168 (6,230,016) | 10112
(5,177,344) | 4,992
(2,555,904)
V2 | 49,920
(25,559,040) | 39,936 (20,447,232) | 34,304 (17,563,648) | 20,224 (10,354,688)
V3 | 71,136
(36,421,632) | 49,296 (25,239,552) | 56,320 (28,835,840) | 30,080 (15,400,960)
--- PAGE 68 ---
dataset is generally expected to improve performance, a much larger dataset such as V3 may
still introduce difficulties if the additional data are not sufficiently consistent, are more
challenging, or are not well matched to the model capacity and decision logic. Therefore, the
impact of increasing dataset size cannot be assessed purely from sample count alone, and its
effect must be interpreted together with the later accuracy results presented in this section. The
composition of the collected dataset for each model version is further summarized in Table
4.1.2.
Table 4.1.2: Type of leak/background recorded in the dataset of each model version.
Type of leak/background collected as dataset
Model version
Hole (mm) Distance (m)
0.3 V1, V2, V3
2.5 0.5 V2, V3
1.0 V1, V2, V3
0.3 V1, V2, V3
5.0 0.5 V2, V3
1.0 V1, V2, V3
0.3 V3
10.0
1.0 V3
0.3 V1, V2, V3
Baseline 0.5 V2, V3
1.0 V1, V2, V3
2.5 (with noise) 0.3 V2, V3
5.0 (with noise) 0.3 V3
10.0 (with noise) 0.3 V3
Baseline (with noise) 0.3 V2, V3
As shown in Table 4.1.2, the changes between model versions reflect not only an increase in
dataset size, but also a progressive increase in dataset diversity. Across the three model
versions, the data collected were expanded to include different leak hole sizes, different
distances between the prototype and the leak location, and both quiet and noisy operating
conditions. In addition to the baseline background condition, both the leak and background
datasets included recordings collected with and without added environmental disturbance,
while the leak dataset further covered multiple hole diameters. The noisy cases were introduced
by playing factory sound obtained online through a speaker placed near the detection prototype
during recording, thereby exposing the acoustic channel to more realistic environmental
interference instead of only controlled laboratory silence.
56
[Table 1 on page 68]
Type of leak/background collected as dataset |  | Model version
Hole (mm) | Distance (m) | 
2.5 | 0.3 | V1, V2, V3
 | 0.5 | V2, V3
 | 1.0 | V1, V2, V3
5.0 | 0.3 | V1, V2, V3
 | 0.5 | V2, V3
 | 1.0 | V1, V2, V3
10.0 | 0.3 | V3
 | 1.0 | V3
Baseline | 0.3 | V1, V2, V3
 | 0.5 | V2, V3
 | 1.0 | V1, V2, V3
2.5 (with noise) | 0.3 | V2, V3
5.0 (with noise) | 0.3 | V3
10.0 (with noise) | 0.3 | V3
Baseline (with noise) | 0.3 | V2, V3
--- PAGE 69 ---
Compared with V1, which was trained on a more limited combination of leak sizes, distances,
and noise conditions, V2 introduced additional distances together with noisy leak and baseline
recordings. V3 further extended the dataset to include larger leak openings and more
challenging noise-influenced scenarios. This indicates that the model versions differ not only
in total data volume, but also in the breadth of physical conditions represented during training.
Consequently, the progression from V1 to V3 should be interpreted as an expansion in both
dataset quantity and scenario coverage, which is important when assessing why certain model
versions perform better than others in the subsequent accuracy comparison. For reproducibility
and future reference, the dataset used in this study has been uploaded to Kaggle and can be
accessed through the following link.
To give a clearer view of the signal content used for training, representative baseline and leak
buffers uploaded to NanoEdge AI Studio are shown in Figure 4.1.1 for the vibration channel
and Figure 4.1.2 for the acoustic channel. These plots were extracted directly from the Studio
and are included to illustrate how the two sensing modalities differ visually before
classification. In each figure, the time-series plot shows the variation of signal amplitude over
the buffer, the FFT plot shows the distribution of signal energy across frequency components,
and the browser plot provides an overlaid view of multiple buffers to help visualize the spread
and repeatability of the dataset. Together, these views help explain why the leak and
background classes are distinguishable and also show the differences in character between the
vibration and acoustic signals.
Figure 4.1.1: Vibration signal buffers uploaded to NEAI Studio for baseline and leak conditions, shown in time-series, FFT,
and browser-plot views.
57
--- PAGE 70 ---
Figure 4.1.2: Acoustic signal buffers uploaded to NanoEdge AI Studio for baseline and leak conditions, shown in time-
series, FFT, and browser-plot views.
From Figure 4.1.1, the vibration leak buffers show a visibly larger signal range than the
baseline case in the time-series view, indicating stronger mechanical excitation when leakage
is present. A similar difference is observed in the FFT view, where the leak case shows higher
spectral magnitude than the baseline case, suggesting that the leak condition introduces
stronger vibration energy across the frequency range. As illustrated in Figure 4.1.2, a similar
overall contrast is observed in the acoustic channel. Comparing both figures, the acoustic
signals show a significantly higher amplitudes compared to the vibration signals. This
observation is anticipated, as the microphone directly captures both airborne and structure-
borne leak noise, whereas the accelerometer records a more attenuated structural vibration
signals transmitted through the pipe. Overall, these plots support the expectation that leak and
background classes are separable in both sensing modalities, while also showing that the
acoustic and vibration channels provide different forms of physical information. Figure 4.1.3
presents the detection accuracy by sensor modality (audio and vibration) and by decision stage
(raw inference, 3s decision logic, and 30s fused logic).
58
--- PAGE 71 ---
Figure 4.1.3: Detection accuracy breakdown by modality and decision stage.
Figure 4.1.3 compares the detection accuracy of the different model and logic configurations
by separating the results into audio accuracy, vibration accuracy, and 30s fusion accuracy. For
the audio and vibration plots, each model configuration on the horizontal axis is represented
by two bars, the raw inference result and the corresponding 3s decision logic result. A
consistent pattern can be observed in the audio channel, where the 3s decision logic improves
the accuracy over the raw model output for all evaluated configurations. For example, in V1 -
DL V1, the audio accuracy increases from 67.2% in the raw inference stage to 72.8% after the
3s decision logic is applied. Similar improvements are also seen in V1 - DL V2, V2 - DL V2,
and V3 - DL V2, although the magnitude of improvement varies. This indicates that the short-
term temporal decision stage is able to refine the raw model output by reducing isolated
misclassifications and producing a more stable intermediate decision.
A similar trend is also evident in the vibration channel, although the degree of improvement
differs more clearly between versions. In V1 - DL V1, the vibration accuracy increases from
52.1% to 58.6%, while in V1 - DL V2 it increases from 53.4% to 58.0%. The largest vibration
performance is achieved by V2 - DL V2, where the accuracy improves from 65.0% in the raw
stage to 69.4% after the 3s decision logic. These results demonstrate that 3s logic has a positive
effect not only on the acoustic channel but also on the vibration channel, which would
otherwise result in unstable initial predictions due to signal fluctuations and transient noise.
However, the vibration results also show that the improvement is not always large enough to
compensate for weak raw model performance, as seen in V3 - DL V2, where both the raw and
3s accuracies remain low.
The rightmost plot in Figure 4.1.3 shows the 30s fusion accuracy, which represents the final
decision after longer temporal aggregation and multimodal fusion have been applied. In all
cases, the 30s fusion stage produces a further increase in accuracy compared with the preceding
raw and 3s stages, confirming that the final decision logic strengthens the overall detection
reliability. The highest final performance is achieved by V2 - DL V2 with 88.0%, followed by
V1 - DL V2 with 84.0% and V1 - DL V1 with 80.0%. Although V3 - DL V2 also benefits from
the 30s fusion stage, its final accuracy remains lower at 72.0%, indicating that temporal fusion
can improve performance but cannot fully compensate for weaker intermediate model outputs.
Overall, Figure 4.1.3 demonstrates that the proposed decision hierarchy, from raw inference to
3s decision logic and finally to 30s fusion, consistently improves detection accuracy, thereby
supporting the effectiveness of the embedded decision-logic design. Figure 4.1.4 shows the
overall average detection accuracy trend across model and detection logic versions.
59
--- PAGE 72 ---
Figure 4.1.4: Overall detection accuracy trend across model and logic versions.
As shown in Figure 4.1.4, all model configurations follow the same general trend, where the
overall detection accuracy increases progressively from raw inference to 3s decision logic, and
then rises further at the 30s decision logic stage. This confirms that the layered decision
structure contributes positively to the final detection outcome, since each additional processing
stage refine the result beyond the previous one. Among all evaluated configurations, V2 - DL
V2 achieves the highest performance throughout the final stage, reaching 88.0% overall
accuracy, which is higher than V1 - DL V1 (80.0%), V1 - DL V2 (84.0%), and V3 - DL V2
(72.0%). For this reason, V2 - DL V2 was selected as the final implemented version for the
proposed embedded leak detection system.
The comparison between V1 - DL V1 and V1 - DL V2 shows that the performance
improvement in the second version of the decision logic was not caused merely by threshold
adjustment, but by a more substantial redesign of the decision structure itself. In the first
version, the 3s acoustic and vibration decision rules were already present, but the later 30s stage
did not explicitly make use of the 3s leak verdict as a structured intermediate decision. Instead,
the V1 30s logic operated mainly on the average leak confidence of each 3s segment and then
applied simple count-based rules and a conditional score accumulation scheme before late
fusion. The final score in V1 was therefore driven mainly by segment-level average confidence
and strong-segment confidence, with a fixed acoustic-to-vibration weighting of 0.70 and 0.30,
but without the explicit persistent-segment formulation, leak-segment ratio term, persistent-
ratio term, or agreement bonuses introduced in V2.
The threshold values used in V1 were not derived from a closed-form optimization but were
selected as interpretable engineering starting points based on the intended behavior of the
decision logic. A confidence level around 0.60 was treated as moderate leak evidence, while a
level around 0.80 was treated as strong evidence. The associated count thresholds were chosen
so that a final leak decision would not be dominated by a single isolated segment or by one
short high-confidence event. In this way, the V1 design aimed to reflect a simple and
conservative principle, where the system should respond either to repeated leak-like behavior
over time or to a sufficient number of strongly leak-like events. This provided a reasonable
first operating point before the later embedded validation results were available.
60
--- PAGE 73 ---
In contrast, V2 redesigned the 30s stage so that it explicitly reused the 3s segment verdict as
meaningful intermediate evidence rather than depending mainly on average segment
confidence alone. This allowed the final decision to be based not only on confidence
magnitude, but also on whether leak evidence was sustained over time, whether strong
segments occurred repeatedly, and whether both sensing modalities agreed. The threshold and
weighting values in V2 were not obtained from a closed-form analytical optimization, but from
a systematic empirical tuning process within the embedded validation workflow, where raw
slot outputs, 3s summaries, 30s final decisions, confusion matrices, and performance metrics
were compared under the same simulation-rig conditions. In this way, the final V2 values were
selected to improve the trade-off between missed leaks and false alarms while preserving an
interpretable and lightweight decision structure suitable for embedded implementation. A
further revision beyond V2 was not pursued because V2 had already addressed the main
structural weakness identified in V1, and increasing the complexity of the logic further without
a clearly observed new failure mode would have reduced interpretability without strong
justification.
The comparison also suggests that V2 detection model benefits from the expanded and more
diverse training data relative to V1 detection model, leading to a stronger model without the
instability observed in the largest dataset version. In contrast, although V3 detection model was
trained using the largest dataset, its lower accuracy indicates that increasing dataset size alone
does not guarantee better performance, especially when the added data may introduce greater
complexity or mismatch with the model capacity and decision logic. Therefore, the results in
Figure 4.1.4 indicate that V2 - DL V2 provides the most suitable balance between training
dataset scale, decision-logic refinement, and final detection accuracy. Figure 4.1.5 shows the
normalized confusion matrices for the selected detection model V2 - DL V2 at three decision
stages, raw NEAI output, 3s detection logic, and final 30s fusion logic.
Figure 4.1.5: Confusion matrices for detection model v2 - DL v2.
61
--- PAGE 74 ---
As shown in Figure 4.1.5, a clear pattern can be observed across the matrices. For both the
acoustic and vibration channels, the 3s detection logic improves the proportion of correctly
identified leak cases compared with the raw model output, as shown by the increase in the
normalized Leak-Leak cell from 0.80 to 0.93 for acoustic and from 0.78 to 0.91 for vibration.
This indicates that the intermediate logic is effective in strengthening leak recognition.
However, the background class remains more challenging, particularly for vibration, where the
Background-Background cell remains relatively low at 0.35 even after 3s processing. The final
30s fusion matrix shows the strongest overall performance, with a perfect normalized leak
detection rate of 1.00 and no missed leak cases. Although some background cases are still
misclassified as leak, the final fusion stage clearly provides the most reliable overall decision
among the three levels. The numerical performance calculated using the equations provided in
Section 3.8.1, corresponding to these confusion matrices is summarized in Table 4.1.3.
Table 4.1.3: Performance matrices for detection model v2 - DL v2.
Raw NEAI 3s Detection Logic
Performance 30s Detection
matric Logic
Acoustic Vibration Acoustic Vibration
Accuracy 0.73 0.65 0.75 0.69 0.88
Precision 0.76 0.69 0.73 0.69 0.84
Recall 0.80 0.78 0.93 0.91 1.00
Specificity 0.61 0.45 0.48 0.35 0.67
F1 0.78 0.73 0.82 0.79 0.91
Balanced
0.71 0.61 0.70 0.63 0.83
Accuracy
As shown in Table 4.1.3, the performance of V2 - DL V2 improves progressively as the
decision process moves from raw inference to 3s logic and finally to 30s logic. In terms of
accuracy, the acoustic channel improves from 0.73 to 0.75, while the vibration channel
improves from 0.65 to 0.69 after 3s logic. The final 30s detection logic reaches 0.88, confirming
that the layered decision structure substantially improves the final system output. A similar
pattern is seen in the F1 score, which rises from 0.78 to 0.82 for acoustics, from 0.73 to 0.79
for vibration, and then to 0.91 at the 30s stage, indicating a better overall balance between
positive prediction reliability and leak detection capability. The most notable improvement is
in recall, where the acoustic channel increases from 0.80 to 0.93, the vibration channel from
0.78 to 0.91, and the final 30s fusion reaches 1.00. This means that, under the tested conditions,
the final implemented system did not miss any actual leak cases, which is particularly important
for a monitoring application where false negatives are more critical than false positives.
At the same time, specificity remains lower than recall across all stages, with values of 0.61
and 0.45 for the raw acoustic and vibration outputs, 0.48 and 0.35 after 3s logic, and 0.67 at
the final 30s stage. This indicates that the system is comparatively stronger at identifying leak
cases than at rejecting background cases, meaning some false alarms are still present. This
pattern is also reflected in precision, which remains moderate for the single-modality stages
(0.76, 0.69, 0.73, and 0.69) before increasing to 0.84 at the 30s stage. In practical terms, this
means that the final fusion logic not only improves leak sensitivity but also produces a more
reliable positive alarm than either the raw or 3s outputs alone. The balanced accuracy values
further support this interpretation, increasing from 0.71 and 0.61 in the raw acoustic and
62
[Table 1 on page 74]
Performance
matric | Raw NEAI |  | 3s Detection Logic |  | 30s Detection
Logic
 | Acoustic | Vibration | Acoustic | Vibration | 
Accuracy | 0.73 | 0.65 | 0.75 | 0.69 | 0.88
Precision | 0.76 | 0.69 | 0.73 | 0.69 | 0.84
Recall | 0.80 | 0.78 | 0.93 | 0.91 | 1.00
Specificity | 0.61 | 0.45 | 0.48 | 0.35 | 0.67
F1 | 0.78 | 0.73 | 0.82 | 0.79 | 0.91
Balanced
Accuracy | 0.71 | 0.61 | 0.70 | 0.63 | 0.83
--- PAGE 75 ---
vibration stages to 0.70 and 0.63 after 3s logic, and finally to 0.83 after 30s fusion. This
indicates that the final version strikes the best balance between detecting real leaks and
maintaining acceptable background discrimination. Overall, the results in Table 4.1.3 confirm
that the selected V2 - DL V2 configuration provides the strongest practical performance,
especially when the full 30s detection logic is applied, and therefore justifies its use as the final
implemented model in this project.
Although the results in this section demonstrate strong performance for the selected V2 – DL
V2 configuration, they should be interpreted within the context of the current simulation rig.
The reported accuracy was obtained using a controlled straight-pipe setup with a maximum
sensor-to-leak separation of approximately 1.14 m, which is considerably shorter than the
spacing likely to occur in real water distribution networks. In practical systems, attenuation
with distance is an important factor affecting leak-signal propagation and the reliability of
acoustic or correlation-based detection approaches [118]. In addition, the simulated leaks were
generated using replaceable circular holes with limited diameters, whereas real leaks may occur
as cracks, irregular openings, or other non-uniform defects. The prototype and leak source were
also positioned along the same straight pipe section, while practical installations may include
bends, junctions, and more complex pipe routing that can alter vibro-acoustic signal
propagation and introduce wave scattering and mode conversion, thereby complicating signal
interpretation compared with an ideal straight pipeline [119]. In addition, the simulated leaks
were generated using replaceable circular holes with limited diameters, whereas real leaks may
occur as cracks, irregular openings, or other non-uniform defects. The prototype and leak
source were also positioned along the same straight pipe section, while practical installations
may include bends, junctions, and more complex pipe routing that can alter vibro-acoustic
signal propagation and introduce wave scattering and mode conversion, thereby complicating
signal interpretation compared with an ideal straight pipeline [120]. These constraints do not
invalidate the present results; rather, they define the boundary of the current validation and
indicate that the measured accuracy should be regarded as performance within a controlled
physical test model, with broader generalization to real infrastructure requiring future
validation on a more representative rig or field installation.
4.2 AI Model Architecture
Figure 4.2.1 shows the performance matrices extracted from the library reports of the selected
acoustic and vibration models.
Figure 4.2.1: Performance matrices extracted from the acoustic (left) and vibration (right) library report.
As shown in Figure 4.2.1, the library-reported validation performance is much higher than the
actual embedded detection performance discussed earlier in Table 4.1.3. For the acoustic
63
--- PAGE 76 ---
model, the library report indicates 97.71% accuracy, 97.67% F1-score, and 97.61% balanced
accuracy, while the vibration model reports 93.32% accuracy, 92.89% F1-score, and 93.22%
balanced accuracy. In contrast, the real embedded results in Table 4.1.3 are significantly lower,
where the raw NEAI stage achieved 73% accuracy for acoustic and 65% accuracy for vibration,
and even after the full decision hierarchy the final 30s detection logic reached 88% accuracy.
This gap indicates that the performance reported during library generation should be interpreted
as an internal validation result under the model-development workflow, whereas the values in
Table 4.1.3 reflect the more demanding condition of a fully deployed prototype operating on
the simulation rig. In practice, the embedded system is influenced by additional factors such as
physical sensor coupling, environmental interference, timing behavior, signal variation
introduced by the rig, and the accumulation of errors across sensing, buffering, inference,
decision logic, and transmission. As highlighted in an embedded-AI deployment reviews,
accuracy measured after deployment on target hardware may differ significantly from
development-stage validation, and representative on-device validation is necessary to assess
real-world performance reliably [121]. Figure 4.2.2 shows the algorithm flow chart of the
selected acoustic and vibration models.
Figure 4.2.2: Algorithm flowchart extracted from the acoustic (top) and vibration (bottom) library report.
From Figure 4.2.2, the acoustic and vibration models also differ in their underlying signal-
processing pipelines. For the acoustic model (top), the input signal buffer first passes through
STFT, followed by pooling, and then absolute value processing before entering the machine
learning model. The classifier used is XGB, indicating that the final decision is produced by an
Extreme Gradient Boosting model rather than by a deep neural network with multiple hidden
layers.
For the vibration model (bottom), the signal-processing chain begins with detrending, followed
by STFT and pooling, before entering an MLP classifier. The vibration model uses a Multi-
Layer Perceptron, meaning that its prediction is based on a neural-network structure rather than
a tree-based boosting model. The exact number of hidden layers is not stated explicitly in the
extracted flowchart, so from the report it can only be concluded that the vibration model is
MLP-based, while the acoustic model is XGB-based. In both cases, the feature-extraction stage
precedes the classifier, meaning that the raw time-domain signal is not used directly. Instead,
each model first converts the input buffer into a more informative feature representation before
classification.
From the architecture shown in Figure 4.2.2, it can be seen that both models follow the same
broad flow of input signal buffer, to signal processing, to ML model and finally output class
probabilities, but they differ in the pre-processing steps and in the type of classifier used. For
the acoustic model, the inclusion of STFT, pooling, and absolute value suggests that the
classifier is operating on a magnitude-based time-frequency representation, which is consistent
with common audio-classification practice using spectral features [122]. For the vibration
model, the addition of detrending before STFT suggests that slowly varying trend or drift
components are first removed so that the later spectral representation is less influenced by
64
--- PAGE 77 ---
baseline variation [123]. These differences indicate that the preprocessing chain was adapted
to the different characteristics of the acoustic and vibration signals before they were passed to
their respective classifiers.
Overall, the library reports show that both architectures are capable of strong validation
performance during model development, but the comparison with Table 4.1.3 confirms that
deployment on the embedded prototype remains the more meaningful indicator of final system
performance. For this reason, the real on-device results discussed in Section 4.1 are more
representative of the practical detection capability of the proposed leak detection system than
the library-reported metrics alone.
4.3 YAMNet Model Accuracy Comparison
4.3.1 Training Performance Evaluation
Figure 4.3.1 shows the training accuracy of the YAMNet-based acoustic and vibration models
as a function of the number of training epochs.
Figure 4.3.1: Training accuracy for YAMNet acoustic and vibration model versus number of epochs used for training.
As shown in Figure 4.3.1, both the acoustic and vibration models demonstrate a steady increase
in training accuracy as the number of epochs increases, indicating that the models are
progressively learning meaningful features from the dataset. The acoustic model reaches a
higher accuracy and converges more smoothly compared to the vibration model, suggesting
that the MFCC-based representation provides clearer and more distinguishable patterns for
classification. In contrast, the vibration model shows a slightly lower final accuracy and more
fluctuation during training, which may be attributed to the more complex and less structured
nature of raw vibration signals. Despite this, both models achieve high training performance
overall, indicating that the selected model architectures and training parameters are sufficient
to capture the underlying characteristics of leak and background conditions under controlled
dataset evaluation. Figure 4.3.2 shows the confusion matrices obtained from the trained
acoustic and vibration models, respectively, evaluated on the test dataset. Both models
demonstrate strong classification performance, with clear separation between leak and
background classes.
Figure 4.3.2: Confusion matrix for YAMNet acoustic and vibration best model.
65
--- PAGE 78 ---
As shown in Figure 4.3.2, the acoustic model shows a great classification, with minimal
misclassification between classes. Similarly, the vibration model also achieves a high level of
classification accuracy, although with slightly more overlap between predicted and actual
labels compared to the acoustic channel. Based on the test dataset evaluation, the acoustic
model achieved an accuracy of 96.7%, while the vibration model achieved 94.5%. These results
indicate that both models are capable of learning meaningful patterns from their respective
modalities under controlled conditions.
4.3.2 Model Conversion and Architecture Analysis
Figure 4.3.3 illustrate the model architectures before and after conversion of the YAMNet-
based model using STM32Cube AI Studio for the acoustic channels.
Figure 4.3.3: Architecture of the YAMNet acoustic model before and after the optimization in STM32Cube AI Studio.
From Figure 4.3.3, the overall structure of the acoustic channel remains largely consistent after
conversion. The model retains its compact 2D convolutional layers operating on MFCC feature
maps, with only minor optimizations applied during conversion. This suggests that the original
architecture is already well-suited for embedded deployment. Figure 4.3.4 illustrate the model
66
--- PAGE 79 ---
architectures before and after conversion of the YAMNet-based model using STM32Cube AI
Studio for the vibration channels.
Figure 4.3.4: Architecture of the YAMNet vibration model before and after the optimization in STM32Cube AI Studio.
From Figure 4.3.4, the vibration model shows a more noticeable simplification after
conversion. The number of layers is reduced, and certain operations are merged or optimized
to meet embedded constraints. This reduction indicates that the original model contained
elements that were either unsupported or inefficient for deployment, leading to a streamlined
architecture in the final implementation.
Overall, the conversion process highlights the trade-off between model complexity and
deployability, particularly for resource-constrained systems.
4.3.3 Embedded Accuracy Evaluation
Figure 4.3.5 shows the accuracy comparison between the original trained YAMNet-based
models and the converted YAMNet-based model implemented into the B-U585I-IOT02A. The
accuracy of the original trained YAMNet-based models is evaluated on the test dataset running
67
--- PAGE 80 ---
on PC. On the other side, the evaluation methodology for the converted YAMNet-based models
follows a similar approach to the NEAI classification model validation process, where the
prototype is loaded with the model and tested directly under real operating conditions.
Figure 4.3.5: Comparison of detection accuracy between converted and original YAMNet models.
As shown in Figure 4.3.5, the converted YAMNet-based models exhibit a noticeable reduction
in accuracy when deployed on the embedded system from 96.7% to 38.8% for acoustic channel
and 94.5% to 30.4% for vibration channel. This drop in performance is mainly due to several
practical limitations during deployment. First, model quantization reduces numerical precision,
which can affect how well the model represents learned features. Second, some architectural
simplifications are required to make the model compatible with the embedded platform. In
addition, real-time execution constraints, such as limited memory and processing power,
further restrict the model’s performance. These factors together explain why the embedded
version cannot fully match the accuracy achieved during PC-based evaluation. Figure 4.3.6
shows the accuracy comparison between the original trained YAMNet-based models, the
converted YAMNet-based model and the NEAI classification model at different stages.
Figure 4.3.6: Comparison of detection accuracy between NEAI and YAMNet models.
As shown in Figure 4.3.6, the YAMNet-based converted model achieves lower accuracy at the
raw detection level compared to the NEAI model. After applying the 30-second decision logic,
the performance of the NEAI approach improves further, reaching a level close to the original
YAMNet-based model evaluated on a PC, although still slightly lower.
68
--- PAGE 81 ---
This comparison highlights an important observation. While deep learning models such as
YAMNet can achieve high accuracy in controlled environments, their performance may
degrade when deployed on constrained hardware. While deep learning models such as
YAMNet can achieve high accuracy under controlled conditions, their performance may
decrease when implemented on resource-limited embedded systems. In contrast, the NEAI
approach, when combined with a well-designed decision logic, provides a more practical and
robust solution for real-time applications. This makes it more suitable for deployment in real-
world scenarios, where consistency and reliability are more important than achieving the
highest possible accuracy under ideal conditions.
4.4 Power Consumption
4.4.1 Measurement Overview and Operating States
Power consumption was evaluated to quantify how effectively the device enters low-power
operation between periodic wake cycles. Two measurement scopes were used:
1. Entire development board (B-U585I-IOT02A) powered from an external 6 V supply
regulated to ≥ 5 𝑉 at the board input and the target ER34615 battery connected to the
board supply path.
2. MCU-only low-power modes, where the STM32U585 was configured to enter STOP2,
STOP3, and SHUTDOWN during the “Power saving” state.
Four system states were considered in the dataset: Power saving, Idle, Detection, and LoRa.
Power Saving corresponds to the planned sleep period between scheduled detection cycles. Idle
refers to the device being awake but not performing any recording or inference. Detection
describes the active phase where sensor data acquisition and model inference are executed.
LoRa denotes the transmission phase when the device sends its payload through the LoRa P2P
module. Table 4.4.1 shows the measured current drawn from the entire development board.
Table 4.4.1: Entire-board current consumption (measured)
Min
Min Voltage Max Voltage Max Current
Power source Mode Current
(V) (V) (mA)
(mA)
Power saving 5.52 5.53 113.0 113.0
External Idle 5.46 5.47 130.0 131.0
s upply (6V) Detection 5.35 5.36 137.0 138.0
LoRa 5.34 5.35 137.0 138.0
Power saving 3.20 3.24 123.8 129.3
ER34615 Idle 3.02 3.06 129.7 131.5
battery Detection 3.10 3.14 121.0 135.0
LoRa 2.86 2.95 130.0 140.1
The full development board (B-U585I-IOT02A) draws approximately 113−129 𝑚𝐴 even in
“Power saving” mode. This indicates that, although low-power firmware states were
implemented, the development board platform contributes substantial baseline current that
dominates the system’s power budget. Table 4.4.2 shows the measured current drawn by the
MCU only at different sleep modes.
Table 4.4.2: MCU-only sleep current drawn by different low-power modes (measured).
Min Max Min Max
MCU mode Voltage Voltage Current Current Notes
(V) (V) (mA) (mA)
STOP 2 3.3 3.3 0.170 0.180 MCU in STOP2
69
[Table 1 on page 81]
Power source | Mode | Min Voltage
(V) | Max Voltage
(V) | Min
Current
(mA) | Max Current
(mA)
External
s upply (6V) | Power saving | 5.52 | 5.53 | 113.0 | 113.0
 | Idle | 5.46 | 5.47 | 130.0 | 131.0
 | Detection | 5.35 | 5.36 | 137.0 | 138.0
 | LoRa | 5.34 | 5.35 | 137.0 | 138.0
ER34615
battery | Power saving | 3.20 | 3.24 | 123.8 | 129.3
 | Idle | 3.02 | 3.06 | 129.7 | 131.5
 | Detection | 3.10 | 3.14 | 121.0 | 135.0
 | LoRa | 2.86 | 2.95 | 130.0 | 140.1
[Table 2 on page 81]
MCU mode | Min
Voltage
(V) | Max
Voltage
(V) | Min
Current
(mA) | Max
Current
(mA) | Notes
STOP 2 | 3.3 | 3.3 | 0.170 | 0.180 | MCU in STOP2
--- PAGE 82 ---
STOP 3 3.3 3.3 0.003 0.008 MCU in STOP3
Limited by 1 µA meter
SHUTDOWN 3.3 3.3 0.001 0.002
resolution (true may be lower)
The MCU-only measurements demonstrate that firmware-controlled deep sleep is achievable
at microamp-to-sub-milliamp levels, whereas the full-board baseline (≈ 100 𝑚𝐴) is dominated
by non-MCU circuitry on the development kit. Figure 4.4.1 shows the comparison of the
maximum sleep current drawn by entire development board vs MCU-only with different sleep
modes.
Figure 4.4.1: Comparison of Sleep Current (Full Board vs MCU-only).
Figure 4.4.1 highlights a clear separation between platform-level and MCU-level sleep
behavior. The two full-board measurements (Battery 6V and ER34615) remain in the ~10² 𝑚𝐴
order of magnitude during the sleep interval, whereas all MCU-only modes fall between
10⁻¹ 𝑚𝐴 to 10⁻³ 𝑚𝐴. Because the y-axis is logarithmic, this figure directly presents the orders-
of-magnitude gap rather than just absolute differences.
A key observation is that the full-board “sleep” current (~113−129 𝑚𝐴) is approximately
three to five orders of magnitude higher than the MCU-only sleep currents. For example,
comparing the ER34615 full-board sleep level (~129 𝑚𝐴) with MCU STOP3 mode
(~0.008 𝑚𝐴) shows a difference of roughly 16,000×, and compared with MCU SHUTDOWN
mode (~0.002 𝑚𝐴) the difference is about 64,000×. This means that, in the current prototype,
system sleep consumption is not limited by the STM32U585AI low-power modes, but instead
by the development board’s always-powered circuitry (power conversion, debug domain, and
other board-level loads). As a result, further firmware-only optimization will have limited
impact on total sleep current unless the system-level power domains can be reduced or gated.
70
[Table 1 on page 82]
STOP 3 | 3.3 | 3.3 | 0.003 | 0.008 | MCU in STOP3
SHUTDOWN | 3.3 | 3.3 | 0.001 | 0.002 | Limited by 1 µA meter
resolution (true may be lower)
--- PAGE 83 ---
The figure also demonstrates the value of deeper MCU sleep states. Moving from STOP2
(~0.18 𝑚𝐴) to STOP3 (~0.008 𝑚𝐴) yields an additional reduction of about 22×, and STOP3
to SHUTDOWN (~0.002 𝑚𝐴) gives about 4× further reductions. Although these reductions
are significant at the MCU level, they become negligible at the total-board level when the
platform baseline sits near 100 mA. In other words, the MCU can already achieve microamp-
to-sub-milliamp sleep or even lower, but the system will not benefit unless the rest of the
hardware is designed to match that low-power capability by custom hardware implementation
in the future. Figure 4.4.2 compares the total daily energy consumption for the prototype under
a fixed operating schedule of 24 detections per day, where the daily energy includes the
combined contribution from sleep + idle + detection + LoRa P2P transmission.
Figure 4.4.2: Comparison of Total Daily Energy Consumption (Full Board vs MCU-only).
A clear outcome from Figure 4.4.2 is that the full-board implementation dominates the energy
budget. The development kit operating from the external 6V supply corresponds to
approximately 15,162.79 mWh/day, while the ER34615-powered case is 10,051.94 mWh/day.
In contrast, the MCU-only cases are approximately 36.72 mWh/day (STOP2), 23.75 mWh/day
(STOP3), and 20.30 mWh/day (SHUTDOWN). This indicates a reduction of roughly two to
three orders of magnitude when comparing the system energy dominated by the development
board platform versus the MCU-only low-power operation.
The difference between the two “full board” bars (Battery 6V vs ER34615) also highlights why
energy (mWh/day) is a more appropriate metric than current when voltages differ. Although
both full-board cases show similarly high current during sleep, the daily energy differs because
the measured supply voltages are not the same and because the power path and regulation losses
can vary across configurations. Presenting results in energy terms therefore avoids misleading
conclusions that could arise from comparing currents measured at different voltages.
71
--- PAGE 84 ---
Importantly, the daily energy values in Figure 4.4.2 should be interpreted as a rough estimation
rather than a precise energy audit. The estimate is based on the observed duration of a single
detection cycle and then extrapolated to 24 detections per day as shown in Table 4.4.3. Any
variation in real operation, such as longer inference time, lagging, etc. would change the total
daily energy. Nevertheless, this approach remains valuable for preliminary assessment, as it
captures the expected trend and provides a consistent framework for comparing operating
modes under a common assumed duty cycle.
Table 4.4.3: Estimated maximum duration for each state of the device per day.
No. of detection per day 1 24
Power saving duration 86,304.38 s/day 84,795.12 s/day
Idle duration 60.00 s/day 750.00 s/day
Detection duration 33.32 s/day 799.68 s/day
LoRa duration 2.30 s/day 55.20 s/day
4.4.2 Datasheet Comparison (STM32U585)
The STM32U585 family is specified for ultra-low-power operation, with typical currents in
deep low-power modes in the µA or sub-µA range depending on SRAM retention, RTC, and
wake configuration [15]. Table 4.4.4 shows the current drawn by the MCU at different power
modes based on the datasheet [15].
Table 4.4.4: Current Drawn by MCU at Different Power Mode from Datasheet [15].
Power Mode Current
Stop 2 mode with full SRAM 8.95 𝜇𝐴
Stop 2 mode with 16-Kbyte SRAM 4.0 𝜇𝐴
Stop 3 mode with full SRAM 4.3 𝜇𝐴
Stop 3 mode with 16-Kbyte SRAM 1.9 𝜇𝐴
Shutdown mode (24 wake-up pins) 160 𝑛𝐴
In practice, measured currents can exceed datasheet “typical” values due to factors explicitly
highlighted by ST, including retained domains, enabled clocks/peripherals, regulator
configuration, and debug circuitry [124]. ST’s power optimization guidance notes that Stop
modes place most domains into low-leakage states, but the actual current depends strongly on
software configuration and what remains powered/clocked [124].
4.4.3 Battery Lifetime Estimation
The battery lifetime presented in this section should be interpreted as an analytical model based
on measured electrical consumption and nominal battery capacity, rather than as a direct long-
duration run-down measurement. This analytical model is useful for comparing operating
modes and estimating the effect of design decisions, even though the absolute lifetime will still
depend on real deployment conditions and battery behavior over time. The battery (ER34615)
lifetime can be estimated using the equation,
72
[Table 1 on page 84]
No. of detection per day | 1 | 24
Power saving duration | 86,304.38 s/day | 84,795.12 s/day
Idle duration | 60.00 s/day | 750.00 s/day
Detection duration | 33.32 s/day | 799.68 s/day
LoRa duration | 2.30 s/day | 55.20 s/day
[Table 2 on page 84]
Power Mode | Current
Stop 2 mode with full SRAM | 8.95 𝜇𝐴
Stop 2 mode with 16-Kbyte SRAM | 4.0 𝜇𝐴
Stop 3 mode with full SRAM | 4.3 𝜇𝐴
Stop 3 mode with 16-Kbyte SRAM | 1.9 𝜇𝐴
Shutdown mode (24 wake-up pins) | 160 𝑛𝐴
--- PAGE 85 ---
𝐶𝑎𝑝𝑎𝑐𝑖𝑡𝑦×𝑛𝑜𝑚𝑖𝑛𝑎𝑙 𝑣𝑜𝑙𝑡𝑎𝑔𝑒
𝐿𝑖𝑓𝑒𝑡𝑖𝑚𝑒 (𝑑𝑎𝑦𝑠) =
𝑇𝑜𝑡𝑎𝑙 𝐷𝑎𝑖𝑙𝑦 𝐸𝑛𝑒𝑟𝑔𝑦 𝑓𝑜𝑟 𝑑𝑒𝑡𝑒𝑐𝑡𝑖𝑜𝑛
Using ER34615 capacity ≈ 19,000 𝑚𝐴ℎ (nominal) and nominal voltage = 3.3𝑉, The lifetime
of the battery can be calculated. Figure 4.4.3 shows the estimated lifetime based on ER34614
capacity.
Figure 4.4.3: Estimated lifetime based on ER34614 capacity.
From Figure 4.4.3, the bars represent the average lifetime, while the error bars indicate the min-
max lifetime computed from the measured current variation. A strong contrast is observed
between the full development board and MCU-only low-power modes. The full-board
configuration yields only ~6.4 days of expected lifetime, whereas the MCU-only cases extend
to ~4.9 years (STOP2), ~8.0 years (STOP3), and ~9.0 years (SHUTDOWN). This figure
therefore illustrates that battery lifetime is primarily limited by board-level baseline
consumption rather than the STM32U585 low-power capability.
4.4.4 Effect of Detection Frequency on Daily Energy Consumption and Battery
Lifetime
This section extends the power analysis by examining how the number of detections per day
affects the worst-case total daily energy consumption and the corresponding minimum battery
lifetime. In this analysis, the worst-case condition was estimated using the maximum measured
power together with the maximum observed duration for each state, namely sleep, idle,
detection, and LoRa P2P transmission. Therefore, these plots should be interpreted as
conservative design estimates rather than exact field lifetime predictions. Figure 4.4.4 shows
the worst case total daily energy consumption versus the number of detections per day for the
entire board powered by the ER34615 battery.
73
--- PAGE 86 ---
Figure 4.4.4: Total daily energy consumption of the full board versus number of detections per day.
For the full-board implementation, Figure 4.4.4 shows that the total daily energy remains
almost constant at approximately 10,052 mWh/day across 1 to 48 detections per day. This
indicates that the energy budget is overwhelmingly dominated by the board’s baseline
consumption during non-active periods, rather than by the incremental energy required for each
additional detection cycle. In other words, increasing the detection frequency has only a very
small effect on the total daily energy when the system is deployed on the complete B-U585I-
IOT02A platform, because the development board itself already consumes a large amount of
energy even when the application is intended to be in a low-power state. This trend is reflected
again in Figure 4.4.5 which shows the minimum lifetime versus the number of detections per
day for the entire board powered by the ER34615 battery.
Figure 4.4.5: Minimum lifetime of the full board versus the number of detections per day.
As shown in Figure 4.4.5, the estimated minimum lifetime of the full-board system stays almost
flat at around 6.24 days regardless of whether the device performs 1 detection or 48 detections
per day. Figure 4.4.5 shows that, under the current development-board implementation, battery
lifetime is effectively constrained by the persistent platform-level load. As a result, adjusting
the detection frequency alone does not provide a meaningful extension of operating life. This
supports the earlier conclusion that the development board is suitable for validating firmware
74
--- PAGE 87 ---
functionality and wake-sleep operation, but it is not representative of the final energy profile
expected from a custom low-power product design. In contrast, the MCU-only results reveal a
much clearer relationship between detection frequency and energy usage. Figure 4.4.6 shows
the worst case total daily energy consumption versus the number of detections per day for the
MCU-only configurations, STOP2, STOP3, and SHUTDOWN.
Figure 4.4.6: Total daily energy consumption of the MCU-only configurations versus number of detections per day.
Figure 4.4.6 shows that the worst-case total daily energy increases approximately linearly as
the number of detections per day increases. Among the three MCU-only sleep modes, STOP2
exhibits the highest daily energy, followed by STOP3, while SHUTDOWN gives the lowest
daily energy throughout the entire range. Similar trends appear in Figure 4.4.7 which shows
the minimum lifetime versus the number of detections per day for the MCU-only
configurations, STOP2, STOP3, and SHUTDOWN.
Figure 4.4.7: Minimum lifetime of the MCU-only configurations versus the number of detections per day.
75
--- PAGE 88 ---
From Figure 4.4.7, the minimum lifetime of the MCU-only system decreases as the number of
detections per day increases. At lower detection rates, the estimated lifetime is very long
because the MCU spends most of its time in deep sleep. As the detection frequency increases,
more time is spent in active operation, causing the lifetime to drop progressively. Even so, the
relative ranking remains unchanged, where the SHUTDOWN mode provides the longest
lifetime, followed by STOP3, then STOP2.
This confirms that, for a future custom hardware implementation, selecting a deeper sleep mode
remains beneficial, but the final lifetime will still depend strongly on how often the node is
required to wake and perform detection.
The vertical dashed line in Figure 4.4.4 to Figure 4.4.7 marks the current selected operating
point of 24 detections per day, which corresponds to one detection every hour. This setting was
chosen as a practical middle ground to balance between battery lifetime and monitoring
effectiveness. One detection every hour interval is frequent enough to provide regular
monitoring of the water distribution system while avoiding the much higher energy cost
associated with very frequent wake schedules.
The results also show that the daily detections rate is a configurable design parameter rather
than a fixed requirement. It can be adjusted according to operational needs. For example, a
company may select a higher detection frequency for crucial facilities or sites with a high
leakage risk, where earlier leak event awareness is more valuable than maximum battery life.
In contrast, a lower detection frequency may be preferred in lower-risk deployments to extend
maintenance intervals and reduce battery replacement cost. This means that the final detection
rate can be aligned with broader deployment strategy, service expectations, and maintenance
planning, provided that the associated reduction in lifetime is clearly understood from the
trends shown in Figure 4.4.4 to Figure 4.4.7.
4.4.5 Development Board Limitation in Low-Power Operation
The measured full-board sleep current (~113−129 𝑚𝐴) indicates that the prototype, as
implemented on the B-U585I-IOT02A Discovery kit, cannot meet that requirement in its
current hardware form. This outcome should be presented as a platform limitation rather than
a firmware failure for two reasons.
First, the discovery kit is not a low-power product design. The development boards typically
include always-available debug and support circuits such as the ST-LINK domain, power
switches, multiple regulators, indicator LEDs, and sensor expansion circuitry, that raise
baseline current.
Secondly, the MCU-only results confirm low-power capability at the controller level. When
measuring the MCU low-power modes, STOP2, STOP3 and SHUTDOWN modes, the current
drawn is much lower than the full-board baseline. Also, the SHUTDOWN mode reading is
constrained by the 1 µA meter resolution, so the real SHUTDOWN mode current could be
lower. This aligns with the low-power positioning and datasheet low-power currents for
STM32U585 deep sleep states [15].
The prototype successfully demonstrates the critical architectural elements of low-power Edge-
AI operation:
1. Periodic wake-up (RTC),
2. Execution of on-device inference,
3. Wireless communication (LoRa P2P),
4. Returning to low-power mode.
76
--- PAGE 89 ---
However, the results also show that achieving a persuasive battery lifetime requires moving
from a development kit to a custom low-power hardware design.
4.4.6 Implication for the final design
A practical path to meet the low power operation is to design a dedicated PCB containing only
the required components/peripherals for this project and to explicitly power-gate everything
else. Based on the current system requirements, the essential components/peripherals are:
1. STM32U585 MCU (core processing + RTC/backup domain)
2. Microphone front-end (only powered during sampling for inference)
3. Accelerometer (only powered during sampling for inference)
4. LoRa P2P module such as RA-08H (powered only around transmission)
5. Efficient power regulation
Therefore, the development kit results are best interpreted as proof of functionality for the low-
power firmware strategy, while the MCU-only measurements indicate that a future custom
board can realistically achieve the intended low-power behavior when the peripheral power
domains are specifically designed for battery operation.
4.5 LoRa P2P Transmission
This section presents the implementation and validation of the wireless data transmission
Stretch Goal III, namely: “Utilize the onboard ARDUINO® Uno V3 expansion interface to
send data (e.g., detection results and timestamps) via LoRa peer-to-peer (P2P)
communication.”. In the current prototype, the communication was implemented as a LoRa
P2P link between the sensing node and a base receiver, rather than through a gateway-based
network. This arrangement is consistent with the communication architecture described earlier
in Section 3.2.3 and provides a practical way to validate wireless transmission of leak-detection
results with reduced system complexity.
Communication validation showed that the handshake mechanism described in the
methodology was able to confirm successful bidirectional wireless communication before
payload transfer. After successful link establishment, the STM32U585AI MCU transmitted a
multi-line detection payload containing the start date and time, recording duration, acoustic
per-segment average leak confidence (confidence level of each segment), vibration per-
segment average leak confidence (confidence level of each segment), final fused score and
verdict, and end time. The payload was sent from the STM32U585AI MCU to the node LoRa
through UART and then forwarded over the radio link to the base receiver. The example shown
in Figure 4.5.1 confirms that the base LoRa was able to receive and display the transmitted
detection information correctly and perform the handshake during wake. This demonstrates
that the device is capable not only of local embedded inference, but also of wirelessly
forwarding summarized leak-detection results to an external receiver for monitoring and
logging purposes.
Figure 4.5.1: Example payload received by the base LoRa.
77
--- PAGE 90 ---
Communication range testing further showed that, under obstructed conditions, smooth and
reliable transmission was maintained up to approximately 40m, as shown in Figure 4.4.2. In
this test, the node LoRa P2P module was placed inside a room while the base receiver was
located inside a box, such that both ends were surrounded by solid obstructions. Beyond this
range, the link could still reach up to approximately 60m, but with an increased risk of
intermittent packet loss where some messages were not received successfully. Although the
reliable range is not long, maintaining performance within 40m is sufficient for the present
proof-of-concept because the future deployment concept does not depend on a single direct
transmission from every node to one base station.
Figure 4.5.2: LoRa P2P communication range test under obstructed conditions.
As discussed earlier in Section 3.2.3, a larger deployment could instead adopt a multi-node
forwarding strategy, where data are relayed from one node to another until they reach the base
node. Under such an arrangement, each hop only needs to remain within a manageable
communication range, making the present result acceptable as an initial validation of the LoRa
P2P transmission concept.
4.6 Device Holder
The device holder developed in this project successfully supported Objective IV, to design and
assemble a fully functional prototype for development on a controlled test rig. By integrating
the B-U585I-IOT02A development board, battery-powered hardware, and LoRa P2P
communication module into a single mounted structure, the holder enabled the sensing device
to be attached directly to the pipe during dataset collection and embedded testing. In this way,
the holder is not only a mechanical accessory, but also an important component of the prototype
system, enabling the leak detection workflow to be evaluated in a real installation
configuration. The inner view of the complete fabricated prototype is shown in Figure 4.6.1.
78
--- PAGE 91 ---
Figure 4.6.1: Inner view of the prototype device.
In practical use, the holder provided a stable and repeatable mounting mechanism on the pipe,
which is important for maintaining consistent sensor coupling during experiments. This is
particularly relevant for the vibration channel, where changes in mechanical contact can affect
the transmitted signal characteristics. The outer mounting arrangement is illustrated in Figure
4.6.2, where the enclosure is clamped onto the pipe using the two-point fastening arrangement
described earlier in the methodology.
Figure 4.6.2: Outer view and mounting mechanism of the holder.
As shown in Figure 4.6.2, the successful mounting and operation of the prototype demonstrates
that the holder fulfilled its intended role for controlled rig-based development and testing. At
the same time, the assembled holder kept the major hardware components physically organized
and functional during operation, thereby improving the overall robustness of the prototype
during repeated experiments. The holder also contributed to the overall usability of the
prototype by making the system easier to install, remove, and reposition during repeated
experiments. This was beneficial during dataset collection and leak validation, where the
device had to be mounted consistently across multiple trials. As shown in Figure 4.6.3, the
enclosure design maintained access to important external parts such as the LoRa antenna, ST-
79
--- PAGE 92 ---
LINK port and power switch, allowing the prototype to be operated without disassembly once
mounted. From a prototype-development perspective, the holder therefore helped bridge the
gap between circuit-level functionality and a more complete deployable system form. This
makes it an important enabling component of the project, even though its primary role is
mechanical rather than algorithmic.
Figure 4.6.3: Components that are accessible from outside.
Although the holder meets the needs of controlled laboratory testing, it should still be regarded
as a first-generation laboratory prototype rather than a finalized field-ready enclosure. The pipe
mounting geometry is optimized for the 25mm pipe used in the simulation rig, so adaptation
would be required for other diameters or for pipes with poor accessibility. In addition, clamp
torque and long-term polymer creep could change the contact pressure over time, potentially
affecting vibration transmissibility and therefore the measured features [108].
Finally, although microphone clearance is provided, a real-world installation would benefit
from an acoustic vent or membrane solution to reduce the risk of dust or water ingress while
maintaining acoustic transparency. Commercial acoustic vents are widely used to protect
microphone ports while minimizing insertion loss, and they are commonly specified to achieve
ingress-protection ratings in harsh environments [125]. Consequently, further refinement
would still be needed before the holder could be considered suitable for wider field deployment.
Nevertheless, within the scope of the current work, the holder successfully enabled a complete
and functional prototype to be assembled and tested on the simulation rig. It provided the
necessary mechanical integration, external accessibility, and mounting repeatability required
for the present study, and therefore satisfied its intended role in supporting the overall leak
detection system.
5. Conclusion and Future Works
5.1 Detection System Performance
The performance of the developed leak detection system demonstrates that Objective II, which
aims to develop an AI-based leak detection algorithm using both acoustic and vibration signal
analysis, has been successfully achieved. The proposed approach combines modality-specific
classification models with temporal decision logic to improve robustness. While the raw
classification outputs show moderate accuracy, the integration of time-based decision
strategies significantly enhances overall detection performance. The final system achieves a
80
--- PAGE 93 ---
high level of accuracy and consistency, indicating that the combination of acoustic and
vibration sensing provides complementary information that strengthens leak detection
reliability under practical operating conditions.
The results further show that system-level performance is not solely dependent on model
accuracy, but also on how detection decisions are aggregated over time. By incorporating
structured decision logic over multiple time windows, the system is able to reduce false
detections and better capture sustained leak behavior. This highlights the importance of
designing not only the AI model, but also the surrounding inference framework, particularly
for embedded applications where signals are dynamic and noisy.
In relation to Stretch Goal V, which involves benchmarking the deployed AI model against
alternative approaches such as YAMNet, the comparison demonstrates that the NEAI-based
model is more suitable for embedded deployment. Although the YAMNet-based models
achieve high accuracy during training under controlled conditions, their performance degrades
significantly after conversion and deployment onto the embedded platform. In contrast, the
NEAI model maintains stronger on-device performance and benefits further from the applied
decision logic. This indicates that models specifically optimized for embedded systems can
provide more reliable real-time performance than more complex deep learning models when
operating under hardware constraints.
The reported detection performance validation was conducted on the same simulation rig
developed for Objective I, which was used to collect acoustic and vibration data under defined
leak conditions and controlled variables. The use of a simplified simulation rig with limited
leak geometries and relatively short sensor-to-leak distances provides a consistent environment
for evaluation but does not fully represent real-world pipeline conditions. Factors such as
longer propagation distances, complex pipe structures, and irregular leak formations may
influence signal characteristics and detection accuracy. As such, the current results should be
interpreted as validation within a controlled environment, with further testing required to
confirm performance in real deployment scenarios.
Overall, the system demonstrates a strong balance between accuracy, robustness, and
deployability. The integration of multi-modal sensing, embedded AI models, and application-
specific decision logic enables reliable leak detection within the constraints of a low-power
embedded platform. These results confirm the feasibility of the proposed approach as a
practical solution for real-time water leak detection and provide a solid foundation for future
improvements and field deployment.
5.2 Power Consumption and Low-Power Operation
In relation to Objective III, to ensure low power operation, the project demonstrates that low-
power behavior was successfully achieved at the MCU and firmware level, but not yet at the
level of the complete development-board-based prototype. The implemented power strategy
enabled the STM32U585AI to periodically wake from sleep, perform sensing and on-device
inference, transmit the detection result through the LoRa P2P communication, and then return
to a low-power state. This confirms that the proposed periodically edge-AI operating concept
is feasible and that the firmware architecture supports low-power scheduling as intended.
The measurement results further show that STM32U585AI itself is capable of very low current
operation in deep sleep modes, as evidenced by the MCU-only STOP2, STOP3, and
SHUTDOWN current measurements. However, the full-board measurements clearly indicate
that the assembled prototype based on the B-U585I-IOT02A Discovery kit remains dominated
by platform-level power consumption. Even during the intended sleep interval, the full-board
current remained at approximately 113−129 𝑚𝐴, leading to short estimated battery lifetime
81
--- PAGE 94 ---
when evaluated using the ER34615 battery. This means that, although low-power operation
was demonstrated conceptually, the present prototype cannot yet be regarded as a truly low-
power field-ready node. Therefore, the limiting factor in the current prototype is not the low-
power capability of the MCU itself, but the overhead introduced by the general-purpose
development platform.
Accordingly, this objective is best conclude as partially achieved. The project has successfully
verified the required low-power operating sequence and has shown that the controller can be
driven into deep sleep modes appropriate for periodically embedded monitoring. At the same
time, the measured full-board consumption demonstrates that additional hardware optimization
is essential before the design can deliver persuasive long-term battery operation in practice. A
future deployment-oriented implementation should therefore be developed using a custom
hardware platform that includes only the required functions and explicitly accounts for the
power demand of the major peripherals, including the microphone, accelerometer, LoRa P2P
communication module, power-conversion stage, and supporting circuitry.
Further reduction in controller-side power may also be possible through selection of an MCU
family with even lower published deep-sleep current. As noted earlier in the project overview,
STM32L562QEI6Q is a possible alternative candidate. Nevertheless, MCU substitution alone
would not fully solve the overall power issue, because the final system lifetime will still depend
on the combined contribution of the sensors, radio, regulators, and supporting hardware. For
this reason, the main conclusion of this study is that low-power operation is technically
achievable, but its practical realization requires both firmware-level sleep management and
hardware specifically designed for battery-powered deployment.
5.3 Holder Design
The holder design can be concluded to have successfully supported Objective IV, by enabling
the leak detection system to exist as an integrated prototype rather than as a collection of
separate electronic parts. Through the CAD modelling, assembly planning, and final
fabrication stages, the holder provided a practical mechanical platform for combining the MCU
board, battery-powered hardware, and LoRa P2P communication module into a single pipe-
mounted device. This was important for the project because it allowed the proposed sensing
and detection concept to be developed in a form that more closely reflects a deployable
engineering prototype.
From the overall project perspective, the main contribution of the holder was to translate the
electronic and embedded subsystems into a usable physical structure suitable for controlled
experimental work. It provided the foundation for repeatable installation on the pipe and
supported the operation of the prototype as one complete unit during testing. In this sense, the
holder was not only a packaging component, but also an enabling part of the prototype-
development process, since it allowed the leak detection device to be evaluated under mounted
conditions relevant to the intended application.
However, the holder should still be regarded as a prototype-stage design rather than a finalized
field enclosure. Its present form is suitable for the laboratory rig and the pipe configuration
used in this study, but further development would be required before broader deployment.
Future refinement should focus on improving compactness, environmental protection,
adaptability to different pipe installations, and closer integration with a custom low-power
PCB. Nevertheless, within the scope of this project, the holder design fulfilled its intended role
by enabling a complete, functional, and testable prototype system.
82
--- PAGE 95 ---
5.4 Overall Conclusion
As discussed in Sections 5.1 to 5.3, the main technical objectives of this project have largely
been addressed. Objective I was achieved through the development of a controlled leak
simulation rig for repeatable dataset collection and validation. Objective II was achieved
through the development of an embedded AI leak detection system using acoustic and vibration
sensing, with the selected V2 - DL V2 configuration providing the best overall performance.
Objective III was partially achieved, as low-power operation was demonstrated successfully at
MCU and firmware level, although a custom hardware platform is still required for full battery-
powered deployment in the future. Objective IV was also achieved through the successful
development of a holder that enabled the complete prototype to be mounted and tested as an
integrated device.
Objective V was also achieved within the scope of this project. The complete system was
evaluated through embedded validation of detection performance, low-power operation, LoRa
P2P communication, and mechanical integration on the simulation rig. This confirms that the
final prototype was not only developed at subsystem level but was also tested as one complete
proof-of-concept system. In terms of stretch goals, LoRa P2P wireless transmission and AI
model benchmarking against YAMNet were successfully completed. By contrast, Bluetooth
connectivity, refined LED mode indication, and leak localization were not completed within
the available project duration, as priority was given to the core detection, validation, and low-
power aspects of the project. Table 5.4.1 shows a summary of the objective and stretch goal
status.
Table 5.4.1: Summary of the objective and stretch goal status.
Objective/Stretch Goal Status Evidence
Objective I: Simulation rig developed and used for dataset collection
Achieved
Controlled experimental environment and validation
Objective II:
Embedded NEAI system deployed; best configuration
AI leak detection using acoustic and Achieved
achieved 88.0% final accuracy
vibration sensing
Objective III: Partially MCU low-power behavior demonstrated; full board is
Ensure low power operation achieved still limited by development-board consumption
Objective IV:
Holder and integrated prototype successfully mounted
Functional prototype on controlled Achieved
and tested
test rig
Objective V:
Detection, power, LoRa, and holder performance
Evaluate complete system Achieved
validated on the prototype
implementation
Stretch Goal I: Not
Deferred due to time constraints
LED indication refinement achieved
Stretch Goal II:
Achieved Wireless payload successfully transmitted and received
LoRa P2P
Stretch Goal III: Not
Deferred due to priority on core objectives
Bluetooth achieved
Stretch Goal IV: Not
Beyond current project scope
Leak localization achieved
Stretch Goal V:
Achieved Benchmarking completed against NEAI
YAMNet benchmarking
Overall, this project has demonstrated the feasibility of an edge AI based low-power water leak
detection system that combines acoustic sensing, vibration sensing, embedded intelligence,
periodic low-power operation, wireless communication, and prototype mechanical integration
into a single proof-of-concept platform. The results show that leak detection can be performed
locally on a resource-constrained STM32 microcontroller with meaningful performance under
controlled conditions. More importantly, the project shows that practical embedded leak
83
[Table 1 on page 95]
Objective/Stretch Goal | Status | Evidence
Objective I:
Controlled experimental environment | Achieved | Simulation rig developed and used for dataset collection
and validation
Objective II:
AI leak detection using acoustic and
vibration sensing | Achieved | Embedded NEAI system deployed; best configuration
achieved 88.0% final accuracy
Objective III:
Ensure low power operation | Partially
achieved | MCU low-power behavior demonstrated; full board is
still limited by development-board consumption
Objective IV:
Functional prototype on controlled
test rig | Achieved | Holder and integrated prototype successfully mounted
and tested
Objective V:
Evaluate complete system
implementation | Achieved | Detection, power, LoRa, and holder performance
validated on the prototype
Stretch Goal I:
LED indication refinement | Not
achieved | Deferred due to time constraints
Stretch Goal II:
LoRa P2P | Achieved | Wireless payload successfully transmitted and received
Stretch Goal III:
Bluetooth | Not
achieved | Deferred due to priority on core objectives
Stretch Goal IV:
Leak localization | Not
achieved | Beyond current project scope
Stretch Goal V:
YAMNet benchmarking | Achieved | Benchmarking completed against NEAI
--- PAGE 96 ---
detection depends not only on the AI model itself, but also on the quality of the dataset, the
decision logic, the sensing configuration, the power-management strategy, the communication
method, and the physical prototype design. Although further refinement is still required before
real deployment, the work has achieved its core purpose and established a credible foundation
for future development of compact, low-power, and field-oriented smart water leak detection
systems.
5.5 Future Improvement
Although the developed prototype has demonstrated the feasibility of embedded leak detection
under controlled conditions, several areas remain for future improvement in order to strengthen
the system’s realism, deployability, and practical performance.
The first important direction is to expand the diversity of the simulation rig and dataset
conditions. In the present study, the simulation rig was sufficient for controlled comparative
testing, but future work should broaden the range of physical variables represented during data
collection. This includes incorporating different leak forms, such as cracks, seal-related
leakage, and other irregular defect shapes, in addition to circular holes. The pipe network
geometry should also be made more representative by including bends, loops, branches, and
other structural features that can alter signal propagation. Further variation in pipe material,
pipe diameter, and water flow rate would also improve the realism of the collected signals.
Such expansion would allow the detection system to be evaluated under conditions that are
closer to practical water distribution environments. At the same time, these additions should be
introduced in a controlled and well-documented way so that data consistency is preserved and
the effect of each variable can still be interpreted clearly.
A second area of improvement concerns the mechanical design of the prototype holder. The
current holder is suitable for the specific pipe configuration used in this study, but future
versions should adopt a more flexible mounting mechanism so that the device can be attached
securely to pipes of different diameters. This would improve the adaptability of the system for
wider testing and future deployment. In addition, the enclosure should be further developed
into a more protective waterproof design to improve environmental robustness. This is
particularly important if the device is to be used outside controlled laboratory environment.
The present microphone opening is also a simple exposed hole, and future work may explore
reshaping this region into a structure that provides mechanical acoustic amplification or
improved sound guidance. Such refinement may help improve acoustic sensitivity while
maintaining enclosure protection.
Another major improvement is the development of a custom hardware board. While the present
project successfully demonstrated the intended embedded operating sequence and low-power
concept, a dedicated board would be needed to fully realize the low-power objective in practice.
A future design should include only the necessary components required for this application,
such as the MCU, microphone, accelerometer, LoRa communication module, and an efficient
power-management circuit. Removing unnecessary components would provide a much more
realistic platform for long-term battery-powered deployment.
Wireless transmission performance could also be further improved through antenna
refinement. The current LoRa setup was sufficient for the proof of concept, but future versions
could use a better antenna or a more suitable antenna placement to achieve longer transmission
range and more reliable communication. This would be beneficial for larger deployment
scenarios, especially where obstacles, longer distances, or more complex installation
environments are expected.
84
--- PAGE 97 ---
Overall, these improvements would move the current prototype from a controlled experimental
prototype toward a more robust and deployment-oriented leak detection system. Future work
should therefore focus not only on improving individual subsystems, but also on ensuring that
sensing performance, mechanical design, hardware efficiency, and wireless reliability are
improved together as one integrated engineering solution.
5.6 Reflection on Project Management
This project gave several useful lessons in project management, especially in hardware
planning, time management, budget use, and communication with external parties. Although
the main technical objectives were mostly achieved, the overall progress of the project was
affected not only by engineering challenges, but also by how well the resources, schedule, and
coordination were managed.
One important lesson was related to hardware procurement. The STM32L562E-DK board was
ordered on 22 October 2025 but was only received on 8 April 2026, which was already close
to the project deadline. Because of this delay, the board could not be used meaningfully in the
main development work. However, as identified earlier in the risk management plan, the
backup B-U585I-IOT02A board was available and allowed the project to continue
successfully. This showed that the backup-board strategy was effective, but it also highlighted
the importance of checking stock availability, delivery source, and expected shipping time
more carefully before making a purchase, especially when overseas delivery and customs
clearance may be involved.
Another lesson was related to time and resource management during experimental work.
Dataset collection was carried out over many separate sessions instead of being completed in
one more organized phase. Although this allowed the model to be improved gradually, it also
meant that the simulation rig and recording setup had to be prepared repeatedly, which used
more time than expected. In addition, the project budget was used quite conservatively, with
much of the spending focused on the STM32L562E-DK board. Looking back, it would have
been better to spend more of the budget on improving the simulation rig, since a better rig could
have supported better dataset quality and stronger model validation.
The project also showed the importance of earlier communication with the company. More
detailed information about the intended system design, including the preference for the
STM32L series board, ER34625 battery, and SPC1520 pulse-assist capacitor, was only
clarified later in the project. Earlier discussion on these technical requirements would have
made planning more consistent and reduced the need for later adjustments.
Finally, this project also showed the importance of focusing on the main deliverables first and
writing more consistently throughout the project. Some parts of the work, such as debugging,
decision-logic refinement, dataset expansion, and validation, took more time than originally
expected. This made it necessary to prioritize the core objectives over some stretch goals. At
the same time, much of the thesis writing was completed near the later stage of the project,
which increased the workload close to the deadline. A better approach would have been to
write and update sections more steadily alongside the technical progress.
Overall, this project showed that completing an engineering project successfully depends not
only on solving technical problems, but also on planning purchases carefully, managing time
well, using resources effectively, and maintaining clear communication from the beginning.
85
--- PAGE 98 ---

`;
