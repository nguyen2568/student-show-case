# Smart Recycling Bin - Student Showcase Project

A comprehensive IoT-based smart recycling system that automatically detects, classifies, and tracks recycled materials while providing users with an engaging web interface to monitor their environmental impact.

## 🌟 Project Overview

This innovative recycling solution combines hardware sensors, cloud connectivity, and modern web technologies to create an intelligent waste management system. Users can scan QR codes at recycling bins, automatically detect material types (plastic bottles and aluminum cans), and track their environmental contributions through a beautiful dashboard interface.

## 🏗️ System Architecture

The project consists of three main components:

### 1. 📱 Frontend Application (`recycle_fe`)
- **Framework**: React 19 with Vite
- **Styling**: TailwindCSS with styled-components
- **Features**:
  - User authentication and registration
  - QR code generation for bin access
  - Real-time recycling progress tracking
  - Environmental impact dashboard
  - Milestone achievements and sharing
  - Socket.io integration for live updates

### 2. 🚀 Backend API (`recycle_api`)
- **Runtime**: Node.js with Express
- **Database**: MongoDB with Mongoose
- **Features**:
  - RESTful API for user management
  - JWT-based authentication
  - Real-time WebSocket communication
  - MQTT bridge for IoT device integration
  - Social sharing functionality
  - AWS IoT Core integration

### 3. 🔧 IoT Hardware (`material-sensor`)
- **Platform**: Raspberry Pi with Python
- **Sensors**: 
  - Metal detection sensor (for aluminum cans)
  - Object detection sensor (for plastic bottles)
  - Pi Camera for QR code scanning
- **Connectivity**: AWS IoT Core via MQTT over TLS
- **Features**:
  - Encrypted QR code authentication
  - Material detection and data transmission
  - Real-time sensor data processing
  - Audio feedback via buzzer

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- Python 3.8+
- MongoDB
- Raspberry Pi 4 (for IoT component)
- AWS IoT Core account

### Installation

#### 1. Backend Setup

```bash
cd recycle_api
npm install
```

Create `.env` file:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/recycling_db
JWT_SECRET=your_jwt_secret_key
AWS_IOT_ENDPOINT=your_aws_iot_endpoint
AWS_IOT_TOPIC=innovation/recycle_events
WEBSITE_URL=http://localhost:5173
```

Start the server:
```bash
npm start
```

#### 2. Frontend Setup

```bash
cd recycle_fe
npm install
```

Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

Start development server:
```bash
npm run dev
```

#### 3. IoT Sensor Setup (Raspberry Pi)

```bash
cd material-sensor
pip install -r requirements.txt
```

Create `.env` file:
```env
BIN_ID=recycling_bin_001
AWS_IOT_ENDPOINT=your_aws_iot_endpoint
AWS_IOT_CERT=path/to/certificate.pem
AWS_IOT_KEY=path/to/private.key
AWS_IOT_CA=path/to/AmazonRootCA1.pem
AWS_IOT_TOPIC=innovation/recycle_events
ENCRYPTION_KEY=your_32_character_encryption_key
```

Run the sensor program:
```bash
python program.py
```

## 🔧 Hardware Configuration

### GPIO Pin Assignments
- **Metal Sensor**: GPIO 17
- **Object Sensor**: GPIO 27  
- **Buzzer**: GPIO 22
- **Camera**: CSI Camera Module

### Sensor Logic
1. **QR Code Scan**: User scans encrypted QR code to authenticate
2. **Material Detection**: 
   - Metal sensor triggers → Sends "metal" detection data
   - Object sensor triggers → Sends "plastic" detection data
3. **Data Transmission**: Raw sensor data sent via MQTT to AWS IoT Core
4. **Backend Processing**: Server processes and classifies the material data
5. **User Feedback**: Buzzer confirmation and real-time dashboard updates

## 📊 Features

### For Users
- **🔐 Secure Authentication**: JWT-based login system
- **📱 QR Code Access**: Encrypted QR codes for bin access
- **📈 Progress Tracking**: Real-time recycling statistics
- **🎯 Milestone System**: Achievement badges and goals
- **🌍 Environmental Impact**: Track energy savings and environmental benefits
- **📤 Social Sharing**: Share achievements on social media
- **📊 Personal Dashboard**: Comprehensive recycling analytics

### For Administrators
- **🔄 Real-time Monitoring**: Live sensor data and user activity
- **📡 IoT Device Management**: Remote device status and control
- **👥 User Management**: Registration and authentication handling
- **📈 Analytics Dashboard**: System-wide recycling statistics

## 🛠️ Technology Stack

### Frontend
- **React 19**: Modern React with hooks and context
- **Vite**: Fast build tool and dev server
- **TailwindCSS**: Utility-first CSS framework
- **Socket.io Client**: Real-time communication
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls

### Backend
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Socket.io**: Real-time bidirectional communication
- **JWT**: JSON Web Token authentication
- **MQTT**: IoT device communication protocol
- **bcrypt**: Password hashing

### IoT/Hardware
- **Python 3**: Main programming language
- **gpiozero**: GPIO interface library
- **Picamera2**: Camera interface
- **pyzbar**: QR code decoding
- **paho-mqtt**: MQTT client
- **Crypto**: AES encryption/decryption

## 🔒 Security Features

- **Encrypted QR Codes**: AES-256 encryption for user authentication
- **TLS/SSL**: Secure MQTT communication with AWS IoT Core
- **JWT Authentication**: Secure API access with refresh tokens
- **Input Validation**: Comprehensive data validation and sanitization
- **Certificate-based IoT**: X.509 certificates for device authentication

## 📈 Environmental Impact Tracking

The system calculates and displays:
- **Energy Savings**: kWh saved through recycling
- **TV Operation Hours**: Equivalent TV watching time from energy saved
- **Light Bulb Hours**: Equivalent lighting time from energy savings
- **Environmental Benefits**: CO2 reduction and resource conservation

## 🎯 Milestone System

Progressive achievements encourage continued recycling:
- First recycling session milestone
- 5, 10, 25, 50, 100+ item milestones
- Energy saving achievements
- Consistency rewards

## 🔄 Real-time Communication Flow

1. **User Authentication**: QR code scanned at physical bin
2. **Sensor Detection**: Hardware sensors detect material presence and type
3. **Data Transmission**: Raw sensor data sent to AWS IoT Core via MQTT
4. **Backend Processing**: API receives, processes and classifies the material data
5. **WebSocket Broadcast**: Real-time updates sent to user dashboard
6. **Database Update**: User statistics and achievements updated

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of a student innovation showcase and is available for educational purposes.

## 👥 Team

This project was developed as part of an innovation project showcasing IoT integration, modern web development, and environmental sustainability.

## 🆘 Support

For questions or support, please contact author (it's me Truong Giang Nguyen)
[text](https://www.linkedin.com/in/giangnt0321/)
[text](https://www.giangnt.me/)

---

**🌱 Making recycling smart, engaging, and impactful - one scan at a time!**