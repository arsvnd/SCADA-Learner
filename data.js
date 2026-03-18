// ============================================================
// SCADA / IIoT Course Data
// ============================================================

const COURSE_DATA = {
  phases: [
    {
      id: 1,
      title: "Foundation",
      color: "#378ADD",
      colorLight: "#E6F1FB",
      weeks: "1–2",
      modules: [1, 2]
    },
    {
      id: 2,
      title: "Data, Screens & Platforms",
      color: "#1D9E75",
      colorLight: "#E1F5EE",
      weeks: "3–5",
      modules: [3, 4, 5]
    },
    {
      id: 3,
      title: "Security, Critical Infra & Edge",
      color: "#BA7517",
      colorLight: "#FAEEDA",
      weeks: "6–8",
      modules: [6, 7, 8]
    },
    {
      id: 4,
      title: "Cloud & Predictive Analytics",
      color: "#7F77DD",
      colorLight: "#EEEDFE",
      weeks: "9–10",
      modules: [9, 10]
    },
    {
      id: 5,
      title: "ML, AI & Capstone Review",
      color: "#D85A30",
      colorLight: "#FAECE7",
      weeks: "11–12",
      modules: [11]
    }
  ],

  modules: [
    {
      id: 1,
      title: "SCADA Architecture, HMI, Protocols & IIoT",
      shortTitle: "SCADA Architecture",
      phase: 1,
      days: [
        {
          day: 1,
          title: "SCADA System Overview & Architecture Layers",
          topics: ["What SCADA is and why it exists", "The 4-layer architecture: field, control, supervisory, enterprise", "Key differences from DCS and plain PLC systems", "Where IIoT fits into traditional SCADA"],
          keywords: ["SCADA", "DCS", "Field layer", "Supervisory layer", "IIoT"]
        },
        {
          day: 2,
          title: "Communication Protocols Deep Dive",
          topics: ["Modbus RTU vs Modbus TCP — when each is used", "DNP3 protocol and why utilities love it", "OPC-UA architecture and its security model", "MQTT basics and why it's taking over IIoT"],
          keywords: ["Modbus", "DNP3", "OPC-UA", "MQTT", "Serial vs Ethernet"]
        },
        {
          day: 3,
          title: "HMI Types, Functions & Best Practices",
          topics: ["Panel HMI vs SCADA HMI vs web HMI", "Key HMI functions: monitoring, control, alarming", "Human factors in HMI design", "SCADA server-client architecture"],
          keywords: ["HMI", "Alarm management", "SCADA server", "Thin client"]
        },
        {
          day: 4,
          title: "IIoT Architecture & SCADA Integration Patterns",
          topics: ["IIoT reference architectures (ISA-95, IoT-A)", "Edge-to-cloud data flow in IIoT", "How SCADA and IIoT coexist in modern plants", "Real-world integration examples"],
          keywords: ["ISA-95", "Edge computing", "Cloud integration", "Digital twin"]
        },
        {
          day: 5,
          title: "Review, Quiz & Forward Link",
          topics: ["Recap all core concepts from days 1–4", "Common exam/interview questions on SCADA architecture", "How Module 1 connects to Module 2 (RTU/PLC/HMI hardware)", "Self-assessment checklist"],
          keywords: ["Review", "Self-assessment", "Interview prep"]
        }
      ]
    },
    {
      id: 2,
      title: "RTU, PLC & HMI Systems — Foundations of Industrial Automation & IoT",
      shortTitle: "RTU, PLC & HMI Foundations",
      phase: 1,
      days: [
        {
          day: 1,
          title: "RTU Architecture & Role in SCADA",
          topics: ["What an RTU is and how it differs from a PLC", "RTU internal architecture: CPU, I/O, comms module", "How RTUs communicate back to SCADA master", "Modern intelligent RTUs vs legacy units"],
          keywords: ["RTU", "Remote Terminal Unit", "I/O modules", "Poll cycle"]
        },
        {
          day: 2,
          title: "PLC Deep Dive — Hardware & Scan Cycle",
          topics: ["PLC hardware: chassis, power supply, processor, I/O", "The PLC scan cycle in detail (input scan → logic → output scan)", "Allen-Bradley ControlLogix vs MicroLogix — when to use each", "PLC vs RTU decision framework"],
          keywords: ["PLC scan cycle", "ControlLogix", "MicroLogix", "I/O addressing"]
        },
        {
          day: 3,
          title: "Ladder Logic, Function Blocks & Structured Text",
          topics: ["IEC 61131-3 programming languages overview", "Ladder logic: rungs, contacts, coils — building blocks", "Function block diagrams for process control", "When to use Structured Text (ST)"],
          keywords: ["IEC 61131-3", "Ladder logic", "FBD", "Structured Text", "Rung"]
        },
        {
          day: 4,
          title: "HMI Hardware, Connectivity & I/O Wiring",
          topics: ["HMI hardware options: Allen-Bradley PanelView, Siemens SIMATIC", "Connecting HMI to PLC: EtherNet/IP, Profibus, serial", "Digital vs analog I/O wiring basics", "4–20mA loops and signal conditioning"],
          keywords: ["PanelView", "EtherNet/IP", "4-20mA", "Signal conditioning", "Analog I/O"]
        },
        {
          day: 5,
          title: "Review, Hands-On Lab Ideas & Forward Link",
          topics: ["Module 2 full recap", "Free simulation tools: RSLogix 500/Studio 5000 emulator", "Practical exercises you can do without hardware", "Bridge to Module 3: from hardware to HMI design"],
          keywords: ["Studio 5000", "Emulator", "Simulation", "Review"]
        }
      ]
    },
    {
      id: 3,
      title: "Designing SCADA Screens & HMI Layouts",
      shortTitle: "SCADA Screen Design",
      phase: 2,
      days: [
        {
          day: 1,
          title: "ISA-101 Standard & HMI Design Philosophy",
          topics: ["What ISA-101 covers and why it matters", "High-performance HMI principles", "Color philosophy: abnormal state vs normal state", "Common mistakes in legacy HMI design"],
          keywords: ["ISA-101", "High-performance HMI", "Abnormal state", "Color coding"]
        },
        {
          day: 2,
          title: "Screen Hierarchy & Navigation Design",
          topics: ["Level 1–4 display hierarchy", "Global overview vs area displays vs detail displays vs diagnostic", "Navigation patterns that reduce operator error", "Call-up time standards"],
          keywords: ["Display hierarchy", "Level 1 display", "Navigation", "Operator effectiveness"]
        },
        {
          day: 3,
          title: "Alarm Management — Design & Implementation",
          topics: ["EEMUA 191 and ISA-18.2 alarm standards", "Alarm rationalization process", "Alarm floods and how to prevent them", "Priority levels, shelving, suppression"],
          keywords: ["EEMUA 191", "ISA-18.2", "Alarm rationalization", "Alarm flood"]
        },
        {
          day: 4,
          title: "Trends, Faceplates & Dynamic Objects",
          topics: ["Trend display best practices", "Faceplate design for consistent operator interaction", "Animation: when it helps vs when it distracts", "Responsive HMI for multiple screen sizes"],
          keywords: ["Trend display", "Faceplate", "Animation", "Dynamic graphics"]
        },
        {
          day: 5,
          title: "Review & Design Critique Exercise",
          topics: ["Review all ISA-101 principles", "Critique exercise: identifying bad HMI design", "Tools for HMI development: FactoryTalk View, Ignition Designer", "Bridge to Module 4: what happens to the data you're displaying"],
          keywords: ["Review", "HMI critique", "FactoryTalk View", "Ignition"]
        }
      ]
    },
    {
      id: 4,
      title: "Data Acquisition & Historian Systems — SCADA, IIoT & Analytics",
      shortTitle: "Data Acquisition & Historians",
      phase: 2,
      days: [
        {
          day: 1,
          title: "Data Acquisition Fundamentals",
          topics: ["Polling vs event-driven data collection", "Scan rates, deadbands and data compression", "Tag databases: structure and naming conventions", "Data quality flags (good/bad/uncertain)"],
          keywords: ["Tag database", "Polling", "Deadband", "Data quality", "Scan rate"]
        },
        {
          day: 2,
          title: "Process Historians — Architecture & Products",
          topics: ["What a historian does vs a relational database", "OSIsoft PI System architecture (PI Server, PI AF, PI Vision)", "AVEVA (Wonderware) Historian overview", "Open-source alternatives: InfluxDB, TimescaleDB"],
          keywords: ["PI System", "OSIsoft", "InfluxDB", "Time-series database", "Historian"]
        },
        {
          day: 3,
          title: "Data Compression, Storage & Retrieval",
          topics: ["Swinging door compression algorithm", "Exception and deviation reporting", "Retrieving historical data: PI AF queries, SQL", "Interpolation methods in historians"],
          keywords: ["Swinging door", "Exception reporting", "PI AF", "Interpolation"]
        },
        {
          day: 4,
          title: "Analytics on Historian Data",
          topics: ["KPI calculation from historian data", "OEE (Overall Equipment Effectiveness) basics", "Connecting historians to Power BI / Grafana", "IIoT analytics pipelines from field to dashboard"],
          keywords: ["OEE", "KPI", "Power BI", "Grafana", "Analytics pipeline"]
        },
        {
          day: 5,
          title: "Review & Data Flow Exercise",
          topics: ["End-to-end data flow recap: sensor → PLC → SCADA → Historian → Analytics", "Common interview questions on historians", "Bridge to Module 5: software platforms that host all of this"],
          keywords: ["Review", "Data flow", "End-to-end"]
        }
      ]
    },
    {
      id: 5,
      title: "SCADA Software Platforms, PLC Connectivity & IIoT Trends",
      shortTitle: "SCADA Platforms & Connectivity",
      phase: 2,
      days: [
        {
          day: 1,
          title: "Major SCADA Platforms Compared",
          topics: ["Inductive Automation Ignition — architecture and strengths", "AVEVA (Wonderware) System Platform", "Rockwell FactoryTalk View SE/ME", "GE iFIX / CIMPLICITY"],
          keywords: ["Ignition", "Wonderware", "FactoryTalk", "iFIX", "Platform comparison"]
        },
        {
          day: 2,
          title: "OPC-UA Deep Dive — The IIoT Backbone",
          topics: ["OPC-UA information model: nodes, objects, methods", "OPC-UA security: certificates, authentication, encryption", "OPC-UA Pub/Sub vs client-server", "Implementing OPC-UA in Ignition and Studio 5000"],
          keywords: ["OPC-UA", "Information model", "Pub/Sub", "Certificates", "Security"]
        },
        {
          day: 3,
          title: "MQTT & Sparkplug B Protocol",
          topics: ["MQTT broker architecture (Mosquitto, EMQX, HiveMQ)", "QoS levels 0/1/2 and when to use each", "Sparkplug B: MQTT with industrial context", "Birth/death certificates in Sparkplug"],
          keywords: ["MQTT", "Sparkplug B", "Broker", "QoS", "Birth certificate"]
        },
        {
          day: 4,
          title: "PLC Connectivity — Drivers, Gateways & Kepware",
          topics: ["KEPServerEX — the universal connectivity platform", "Native drivers vs OPC server approach", "Kepware EX with Studio 5000 and Siemens PLCs", "Protocol conversion at the edge gateway"],
          keywords: ["KEPServerEX", "Kepware", "Protocol conversion", "Gateway", "Driver"]
        },
        {
          day: 5,
          title: "Review & Platform Selection Exercise",
          topics: ["When to choose Ignition vs Wonderware vs FactoryTalk", "IIoT trends: unified namespace (UNS) concept", "Bridge to Phase 3: your beautiful connected system needs to be secure"],
          keywords: ["Review", "Platform selection", "Unified Namespace", "UNS"]
        }
      ]
    },
    {
      id: 6,
      title: "Security in SCADA — Cybersecurity for Critical Industrial Automation",
      shortTitle: "SCADA Cybersecurity",
      phase: 3,
      days: [
        {
          day: 1,
          title: "OT Security Fundamentals & Why It's Different from IT",
          topics: ["OT vs IT security priorities: availability first vs confidentiality first", "Common OT threat vectors", "Notable attacks: Stuxnet, Colonial Pipeline, Ukraine power grid", "OT security frameworks overview"],
          keywords: ["OT security", "Stuxnet", "Colonial Pipeline", "CIA triad", "Availability"]
        },
        {
          day: 2,
          title: "IEC 62443 Standard — The OT Security Bible",
          topics: ["IEC 62443 structure: series 1/2/3/4", "Security levels SL1–SL4", "Zones and conduits concept", "Applying 62443 to a real SCADA system"],
          keywords: ["IEC 62443", "Security level", "Zones and conduits", "IACS"]
        },
        {
          day: 3,
          title: "Purdue Model & Network Segmentation",
          topics: ["Purdue Enterprise Reference Architecture levels 0–5", "DMZ design between IT and OT", "Firewalls, data diodes and unidirectional gateways", "Jump servers and secure remote access for OT"],
          keywords: ["Purdue model", "DMZ", "Data diode", "Network segmentation", "Jump server"]
        },
        {
          day: 4,
          title: "Practical OT Security Controls",
          topics: ["Asset inventory and vulnerability management in OT", "Patch management challenges in operational environments", "Endpoint protection for HMIs and engineering workstations", "Security monitoring: OT-specific SIEM/IDS tools"],
          keywords: ["Asset inventory", "Patch management", "Endpoint protection", "Dragos", "Claroty"]
        },
        {
          day: 5,
          title: "Review & Threat Scenario Walkthrough",
          topics: ["Security review: from field device to cloud", "Common security interview/certification topics (ISA/IEC 62443)", "Bridge to Module 7: security in critical infrastructure sectors"],
          keywords: ["Review", "Threat scenario", "ISA99"]
        }
      ]
    },
    {
      id: 7,
      title: "SCADA in Critical Infrastructure — Power, Energy & Water Control",
      shortTitle: "Critical Infrastructure SCADA",
      phase: 3,
      days: [
        {
          day: 1,
          title: "Power & Energy SCADA — EMS & SCADA for Utilities",
          topics: ["EMS (Energy Management System) vs SCADA for utilities", "NERC CIP compliance requirements", "Substation automation: IEC 61850 standard", "PMU (Phasor Measurement Units) and synchrophasors"],
          keywords: ["EMS", "NERC CIP", "IEC 61850", "Substation automation", "PMU"]
        },
        {
          day: 2,
          title: "Oil & Gas SCADA — Pipelines & Process Facilities",
          topics: ["Pipeline SCADA: leak detection, pressure management", "LACT (Lease Automatic Custody Transfer) units", "Offshore platform control systems", "API 1164 pipeline SCADA security standard"],
          keywords: ["Pipeline SCADA", "LACT", "API 1164", "Leak detection", "Offshore"]
        },
        {
          day: 3,
          title: "Water & Wastewater SCADA",
          topics: ["Water system architecture: intake, treatment, distribution", "Key measurements: flow, level, chlorine residual, pH", "AWWA cybersecurity guidance for water utilities", "Lift station automation and remote monitoring"],
          keywords: ["Water SCADA", "AWWA", "Lift station", "Chlorine residual", "SCADA water treatment"]
        },
        {
          day: 4,
          title: "Building Automation & Smart Grid Integration",
          topics: ["BMS (Building Management Systems) and BACnet protocol", "Smart grid: AMI, demand response, grid edge", "VPP (Virtual Power Plants) and DERMS", "Integration of renewables with SCADA"],
          keywords: ["BMS", "BACnet", "Smart grid", "AMI", "DERMS", "VPP"]
        },
        {
          day: 5,
          title: "Review & Sector Comparison",
          topics: ["Critical infrastructure sectors compared by SCADA complexity", "Common certifications for this domain", "Bridge to Module 8: taking this to the edge and cloud"],
          keywords: ["Review", "NERC CIP", "Critical infrastructure sectors"]
        }
      ]
    },
    {
      id: 8,
      title: "Industrial IoT Integration with SCADA — Edge, Cloud & Automation",
      shortTitle: "IIoT Edge & Cloud Integration",
      phase: 3,
      days: [
        {
          day: 1,
          title: "Edge Computing in Industrial Environments",
          topics: ["What edge computing means in OT context", "Edge hardware: Moxa, Advantech, Siemens SIMATIC IOT2050", "Edge vs fog vs cloud processing decisions", "OPC-UA at the edge"],
          keywords: ["Edge computing", "Advantech", "Moxa", "SIMATIC IOT2050", "Edge gateway"]
        },
        {
          day: 2,
          title: "IIoT Platforms & Middleware",
          topics: ["Inductive Automation Ignition Edge", "PTC ThingWorx IIoT platform", "Siemens MindSphere", "Microsoft Azure IoT Edge runtime"],
          keywords: ["Ignition Edge", "ThingWorx", "MindSphere", "Azure IoT Edge", "IIoT platform"]
        },
        {
          day: 3,
          title: "Data Pipelines from Field to Cloud",
          topics: ["Field → Edge → Cloud data architecture patterns", "Kafka for industrial streaming data", "Time-series data at scale in cloud", "Handling intermittent connectivity (store and forward)"],
          keywords: ["Kafka", "Store and forward", "Data pipeline", "Streaming", "Time-series cloud"]
        },
        {
          day: 4,
          title: "Cloud-Connected SCADA & Remote Operations",
          topics: ["Cloud SCADA architectures (hosted vs hybrid)", "Remote operations center design", "Bandwidth and latency considerations for cloud SCADA", "Real-world examples: Yokogawa, ABB, Schneider cloud SCADA"],
          keywords: ["Cloud SCADA", "Remote operations", "Hybrid cloud", "Latency", "Bandwidth"]
        },
        {
          day: 5,
          title: "Review & Architecture Design Exercise",
          topics: ["Design a full IIoT architecture for a hypothetical plant", "Common patterns and antipatterns in IIoT deployments", "Bridge to Phase 4: Azure and AWS specifics"],
          keywords: ["Review", "Architecture design", "IIoT patterns"]
        }
      ]
    },
    {
      id: 9,
      title: "SCADA Integration with Azure & AWS IoT — Cloud, Analytics & Automation",
      shortTitle: "Azure & AWS IoT Integration",
      phase: 4,
      days: [
        {
          day: 1,
          title: "Azure IoT Hub & IoT Central for Industrial",
          topics: ["Azure IoT Hub architecture: device registration, messaging, twins", "Device twins and module twins concept", "Azure IoT Central — no-code IoT platform", "Connecting Ignition to Azure via MQTT"],
          keywords: ["Azure IoT Hub", "Device twin", "IoT Central", "Azure MQTT"]
        },
        {
          day: 2,
          title: "Azure Industrial IoT Stack",
          topics: ["Azure Industrial IoT GitHub solution", "OPC Publisher (edge module for Azure)", "Azure Time Series Insights / TSI Gen2", "Azure Data Explorer (ADX) for historian data"],
          keywords: ["OPC Publisher", "Azure TSI", "Azure Data Explorer", "Industrial IoT solution"]
        },
        {
          day: 3,
          title: "AWS IoT Greengrass & SiteWise",
          topics: ["AWS IoT Greengrass: edge runtime and components", "AWS IoT SiteWise: industrial asset modelling", "SiteWise Monitor for SCADA-like dashboards", "Connecting PLCs to AWS via Greengrass"],
          keywords: ["AWS IoT Greengrass", "AWS SiteWise", "SiteWise Monitor", "Edge runtime"]
        },
        {
          day: 4,
          title: "Cloud Analytics & Dashboarding",
          topics: ["Azure Stream Analytics for real-time OT data", "Power BI with historian data sources", "Grafana on Azure/AWS for industrial dashboards", "Building KPI dashboards from cloud data"],
          keywords: ["Stream Analytics", "Power BI", "Grafana", "Dashboard", "KPI"]
        },
        {
          day: 5,
          title: "Review & Cloud Architecture Comparison",
          topics: ["Azure vs AWS for industrial IoT — decision guide", "Hybrid cloud SCADA patterns", "Bridge to Module 10: now that data is in the cloud, let's predict failures"],
          keywords: ["Azure vs AWS", "Cloud comparison", "Review"]
        }
      ]
    },
    {
      id: 10,
      title: "Predictive Maintenance with SCADA & IoT Smart Monitoring",
      shortTitle: "Predictive Maintenance & Monitoring",
      phase: 4,
      days: [
        {
          day: 1,
          title: "Maintenance Strategies — from Reactive to Predictive",
          topics: ["Reactive vs preventive vs predictive vs prescriptive maintenance", "CBM (Condition-Based Monitoring) fundamentals", "ROI of predictive maintenance programs", "Key failure modes for rotating equipment"],
          keywords: ["CBM", "Predictive maintenance", "PdM", "Reactive maintenance", "MTBF", "MTTR"]
        },
        {
          day: 2,
          title: "Vibration & Condition Monitoring",
          topics: ["Vibration analysis basics: frequency, amplitude, waveform", "Common bearing and gear fault signatures", "Accelerometers and vibration sensor types", "ISO 10816 vibration severity standards"],
          keywords: ["Vibration analysis", "FFT", "Bearing fault", "ISO 10816", "Accelerometer"]
        },
        {
          day: 3,
          title: "Temperature, Pressure & Electrical Monitoring",
          topics: ["Thermal imaging for electrical panels and motors", "Oil analysis and tribology basics", "Motor current signature analysis (MCSA)", "Integrating condition monitoring with SCADA tags"],
          keywords: ["Thermal imaging", "MCSA", "Oil analysis", "Tribology", "Motor monitoring"]
        },
        {
          day: 4,
          title: "Anomaly Detection & Alert Systems",
          topics: ["Statistical process control in SCADA (control charts)", "Moving average and threshold-based alerting", "Simple ML models for anomaly detection", "SCADA/historian integration for PdM workflows"],
          keywords: ["SPC", "Control charts", "Anomaly detection", "Threshold alerting", "PdM workflow"]
        },
        {
          day: 5,
          title: "Review & PdM Use Case Design",
          topics: ["Design a PdM program for a pump or motor", "Connecting PdM to CMMS systems (SAP PM, Maximo)", "Bridge to Module 11: moving from rule-based to ML-based prediction"],
          keywords: ["Review", "CMMS", "SAP PM", "Maximo", "PdM design"]
        }
      ]
    },
    {
      id: 11,
      title: "SCADA & Machine Learning — Industrial AI & Predictive Insights",
      shortTitle: "ML & Industrial AI",
      phase: 5,
      days: [
        {
          day: 1,
          title: "ML in OT Context — Opportunities & Constraints",
          topics: ["Where ML adds value in industrial systems", "Data quality challenges: missing data, sensor drift, noise", "Supervised vs unsupervised vs reinforcement learning for OT", "MLOps challenges in industrial environments"],
          keywords: ["ML in OT", "Data quality", "Supervised learning", "MLOps", "Industrial AI"]
        },
        {
          day: 2,
          title: "Feature Engineering from SCADA/Historian Data",
          topics: ["Rolling statistics: mean, std, min/max over windows", "Lag features and time-series engineering", "Fourier transforms for vibration data features", "Python + pandas for historian data preprocessing"],
          keywords: ["Feature engineering", "Rolling statistics", "Lag features", "FFT", "Pandas"]
        },
        {
          day: 3,
          title: "Classification & Regression for Fault Detection",
          topics: ["Random forest for fault classification", "Gradient boosting (XGBoost) for RUL prediction", "LSTM for time-series anomaly detection", "Model evaluation: precision/recall for imbalanced OT data"],
          keywords: ["Random forest", "XGBoost", "LSTM", "RUL", "Precision recall", "Imbalanced data"]
        },
        {
          day: 4,
          title: "Deploying ML Models to OT Environments",
          topics: ["ONNX for cross-platform model deployment", "Edge inference vs cloud inference tradeoffs", "Integrating ML outputs back into SCADA displays", "Model monitoring and drift detection in production"],
          keywords: ["ONNX", "Edge inference", "Model deployment", "Drift detection", "ML pipeline"]
        },
        {
          day: 5,
          title: "Capstone Review — End-to-End Integration",
          topics: ["Full stack review: field device → SCADA → historian → cloud → ML → action", "Career paths: OT Integration Engineer, Systems Engineer, ML Engineer (industrial)", "Portfolio project ideas combining SCADA + Python + ML", "Final self-assessment across all 11 modules"],
          keywords: ["Capstone review", "Career paths", "Portfolio", "OT Integration Engineer"]
        }
      ]
    }
  ]
};

// Get module by ID
function getModule(moduleId) {
  return COURSE_DATA.modules.find(m => m.id === moduleId);
}

// Get phase for a module
function getPhaseForModule(moduleId) {
  return COURSE_DATA.phases.find(p => p.modules.includes(moduleId));
}

// Get day data
function getDayData(moduleId, day) {
  const mod = getModule(moduleId);
  if (!mod) return null;
  return mod.days.find(d => d.day === day) || null;
}

// Quick prompts per topic
function getQuickPrompts(moduleId, day) {
  const dayData = getDayData(moduleId, day);
  if (!dayData) return [];
  const kws = dayData.keywords || [];
  return [
    `Explain ${kws[0] || 'this concept'} like I'm a controls tech`,
    `Give me a real-world example of ${kws[1] || 'this'}`,
    `How does this relate to Allen-Bradley / Rockwell systems?`,
    `What interview questions should I expect on ${kws[0] || 'this topic'}?`
  ];
}
