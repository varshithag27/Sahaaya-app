# 🏥 Sahaaya - Elderly-Friendly Healthcare Assistance App

> *Empowering senior citizens with safe, accessible, and privacy-focused healthcare management*

## 📖 About The Project

**Sahaaya** is a mobile healthcare application specifically designed for elderly users, addressing the critical challenges they face in managing their health independently. The app combines **emergency response**, **medication management**, **voice assistance**, and **robust privacy controls** into a unified, senior-friendly platform.

### 🎯 Problem Statement

Elderly individuals often struggle with:
- ❌ Complex mobile interfaces that are difficult to navigate
- ❌ Forgetting medication schedules
- ❌ Limited access to immediate emergency support
- ❌ Privacy concerns with digital healthcare solutions
- ❌ Lack of voice-guided assistance for those with vision or literacy challenges

**Sahaaya solves these problems** with an intuitive, accessible, and secure healthcare companion.

---

## ✨ Key Features

### 🚨 **SOS Emergency Button**
- One-tap emergency alert system
- Automatic location sharing with emergency contacts
- Instant notification to caregivers and healthcare providers
- Real-time GPS tracking during emergencies

### 💊 **Smart Medication Reminders**
- Customizable medication schedules
- Multi-modal alerts (sound, vibration, notification)
- Medication history tracking
- Dosage information and instructions
- Visual confirmation system

### 🗣️ **Voice Prompt Assistance**
- Voice-guided navigation throughout the app
- Text-to-speech for all critical information
- Speech recognition for hands-free interaction
- Multi-language support (planned)

### 🔒 **Privacy-Centered Design**
- End-to-end encryption for all health data
- Permission-based data sharing
- HIPAA/GDPR compliance standards
- Secure authentication (OTP-based)
- No third-party data selling

### 📱 **Elderly-Friendly UI/UX**
- Large, readable fonts (18-32px)
- High-contrast color schemes
- Big touch targets for easy interaction
- Minimal text with clear iconography
- Simplified navigation with fewer steps

### 👨‍⚕️ **Emergency Contact Management**
- Quick-access contact list
- One-tap calling to doctors and family
- Contact prioritization
- Relationship tagging

---

## 🏗️ Architecture

### **Frontend**
- **React Native** - Cross-platform mobile development
- **JavaScript/TypeScript** - Core programming language
- **React Navigation** - Screen navigation
- **Lucide Icons** - Modern, accessible icons

### **Backend**
- **Spring Boot (Java)** - RESTful API server
- **JWT Authentication** - Secure user sessions
- **Firebase Firestore** - Real-time NoSQL database
- **Firebase Auth** - User authentication

### **External Integrations**
- **Google Maps API** - Location services for SOS
- **Twilio/SMS Gateway** - Emergency alerts
- **Web Speech API** - Voice recognition and TTS
- **Push Notification Service** - Medication reminders

### **Security Layer**
- AES-256 encryption for data at rest
- TLS/SSL for data in transit
- Biometric authentication (optional)
- Role-based access control (RBAC)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- React Native CLI
- Android Studio (for Android) or Xcode (for iOS)
- Java JDK 11+
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sahaaya-app.git
   cd sahaaya-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Firebase**
   - Create a Firebase project
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Place them in appropriate directories

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

5. **Run the app**
   ```bash
   # For Android
   npx react-native run-android
   
   # For iOS
   npx react-native run-ios
   ```

---

## 📂 Project Structure

```
sahaaya-app/
├── src/
│   ├── screens/          # All app screens
│   │   ├── LoginScreen.js
│   │   ├── HomeScreen.js
│   │   ├── MedicationScreen.js
│   │   └── EmergencyScreen.js
│   ├── components/       # Reusable UI components
│   ├── navigation/       # Navigation configuration
│   ├── services/         # API calls and business logic
│   ├── utils/            # Helper functions
│   └── assets/           # Images, fonts, icons
├── backend/              # Spring Boot backend
│   ├── src/main/java/
│   └── src/main/resources/
├── android/              # Android native code
├── ios/                  # iOS native code
└── README.md
```

---

## 🎓 Academic Context

**Course:** Mini Project (CSEP23506)  
**Institution:** Department of CSE, GAT  
**Academic Year:** 2025-26  
**Team:**
- **Nandini K B** - 1GA23CS109
- **Varshitha G** - 1GA23CS188

**Guide:** Prof. Bharathy Vijayan (BVN)  
**Domain:** App Development  
**Group No:** 102

---

## 🛣️ Roadmap

### Phase 1: Mini Project (Current)
- [x] Core UI/UX design
- [x] Authentication system
- [x] Medication reminder module
- [x] SOS emergency button
- [ ] Voice prompt integration
- [ ] Privacy controls

### Phase 2: Extended Features (Future)
- [ ] AI-powered health predictions
- [ ] Video consultation with doctors
- [ ] Wearable device integration (smartwatch)
- [ ] Multi-language support (Hindi, Tamil, etc.)
- [ ] Offline mode
- [ ] Health report generation
- [ ] Caregiver dashboard (web portal)

---

## 📊 Literature Review

Our project is based on extensive research:

1. **"Design and Development of Mobile Health Applications for Elderly Patients"** - IEEE Access, 2020
   - User-centered design methodology
   - Simplified UI patterns for seniors

2. **"Medication Reminder and Management Systems: A Mobile Health Perspective"** - IEEE ICHI, 2020
   - Effectiveness of digital medication adherence tools

3. **"Privacy and Security in Mobile Health Applications"** - IEEE Journal of Biomedical and Health Informatics, 2021
   - Healthcare data protection standards

4. **"Emergency Response Systems Using IoT and Mobile Applications for Elderly Care"** - IEEE Sensors Journal, 2021
   - Real-time location-based emergency systems

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Nandini K B** - 1GA23CS109  
**Varshitha G** - 1GA23CS188

Project Link: [https://github.com/yourusername/sahaaya-app](https://github.com/yourusername/sahaaya-app)

---

## 🙏 Acknowledgments

- Prof. Bharathy Vijayan for guidance and support
- Department of CSE, GAT
- Research papers and open-source communities
- All contributors and testers

---

## 📱 Screenshots

> *Coming soon - Add screenshots of your app here*

---

## 🎬 Demo Video

> *Coming soon - Add demo video link here*

---

<div align="center">

**Made with ❤️ for our seniors**

*Helping elderly individuals live independently with confidence and safety*

</div>