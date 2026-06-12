# GrowthHub 🌱
GrowthHub is a full-stack Portfolio Management System built with the MERN stack (MongoDB, Express, React, Node.js). It provides professionals with a centralized platform to manage their personal profile, showcase their skills, and highlight their projects in a modern, highly responsive interface.
## 🚀 Features
- **Authentication System**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Profile Management**: Upload a profile picture (managed via Multer) and update personal details, bio, and social links.
- **Skill Tracking**: Add, update, and categorize professional skills (Beginner, Intermediate, Advanced).
- **Project Showcase**: Maintain a portfolio of projects with descriptions, tech stacks, GitHub links, and live demos.
- **Premium UI/UX**: Designed with a cohesive "Emerald Tech" color palette featuring deep slate backgrounds, vibrant mint/teal accents, glassmorphism effects, and smooth hover micro-animations.
- **Responsive Layout**: Includes a fully responsive sidebar that gracefully collapses on mobile devices, ensuring a seamless experience across all screen sizes.
## 🛠️ Technology Stack
### Frontend (Client)
- **Framework**: React (built with Vite)
- **Routing**: React Router DOM (v6)
- **Styling**: Bootstrap + Vanilla CSS
- **HTTP Client**: Axios (with interceptors for JWT injection)
- **State Management**: Context API
### Backend (Server)
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose
- **Authentication**: JWT & Bcrypt.js
- **File Uploads**: Multer (configured with file type validation and size limits)
## 💻 Getting Started
### Prerequisites
- Node.js (v14 or higher)
- MongoDB running locally or a MongoDB Atlas URI
### 1. Clone the repository
```bash
git clone <repository-url>
cd "Portfolio Management System"
```
### 2. Backend Setup
Navigate to the server directory, install dependencies, and start the development server:
```bash
cd server
npm install
# Create a .env file based on environment variables needed (PORT, MONGO_URI, JWT_SECRET)
# Example .env:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/portfolio-db
# JWT_SECRET=your_super_secret_key
npm run dev
```
The backend server will run on `http://localhost:5000`.
### 3. Frontend Setup
Open a new terminal window, navigate to the client directory, install dependencies, and start the Vite development server:
```bash
cd client
npm install
npm run dev
```
The React frontend will be available at `http://localhost:3000`.
## 🎨 Theme & Visual Design
The application utilizes an "Emerald Tech" theme (`#10b981` to `#14b8a6`) over a deep slate background. Inputs feature mint outline glows, and buttons utilize gradient shadows with smooth hover transitions.
## 📝 License
This project is open-source and available under the [MIT License](LICENSE).
