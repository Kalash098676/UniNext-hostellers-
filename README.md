# 🏰 UniNest — Smart Hostel & Student Management System

[![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)](https://mongodb.com)
[![React](https://img.shields.io/badge/Frontend-React%20%2B%20Vite-61dafb.svg)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-green.svg)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248.svg)](https://www.mongodb.com/cloud/atlas)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

UniNest is a comprehensive, production-ready MERN-stack web application designed to revolutionize student accommodation and hostel operations. It bridges the gap between students, wardens, and administrative staff by providing intelligent roommate matching, streamlined maintenance reporting, digital visitor pass management, mess menu tracking, and administrative controls.

---

## 📌 Problem Statement

Traditional hostel management systems suffer from severe operational friction and communication gaps:

1. **Random / Incompatible Roommate Allocation**: Students are often assigned rooms without considering lifestyle, sleep schedules, study habits, or cleanliness preferences, leading to friction, academic distraction, and frequent room transfer requests.
2. **Untracked Complaints & Maintenance Delay**: Maintenance issues (water leakage, electrical issues, Wi-Fi outages) are reported verbally or through paper logs, resulting in delayed resolutions, lost requests, and lack of status visibility.
3. **Manual Gatekeeper Visitor Passes**: Managing visitors through paper registers is slow, error-prone, and poses security risks.
4. **Static Mess Schedules & Unheard Feedback**: Dining menus are posted on physical notice boards and student feedback regarding meal quality is rarely captured or analyzed.
5. **Fragmented Administrative Oversight**: Wardens lack a unified dashboard to monitor student registries, active complaints, staff assignments, and room allocations in real-time.

---

##💡 The UniNest Solution

UniNest solves these challenges by delivering an all-in-one digital ecosystem:
- 🤖 **Compatibility Algorithm**: Pairs students using a multi-parameter matching algorithm based on sleep schedule, cleanliness, noise tolerance, study preference, room temp, and room capacity.
- 🛠️ **Real-Time Issue Tracker**: Allows students to log complaints with category and room number, and gives wardens priority controls to resolve them.
- 🎟️ **Digital Visitor Pass Passports**: Generates secure QR-coded visitor passes with automatic timestamp tracking.
- 🍱 **Dynamic Mess Menu & Rating Analytics**: Real-time weekly menu displays with direct student feedback and rating aggregations.
- 🛡️ **Role-Based Portals**: Tailored interfaces for Students, Wardens, and Staff with JWT authentication and strict access controls.

---

## 🏗️ System Architecture

UniNest follows a decoupled **Client-Server Architecture** adhering to clean code and RESTful standards.

```mermaid
graph TD
    subgraph Client ["Frontend (React 19 + Vite)"]
        UI[Landing / Login / Dashboards]
        Axios[Axios API Client + JWT Interceptors]
        Context[Auth & Theme State Management]
        UI --> Axios
        UI --> Context
    end

    subgraph Server ["Backend (Node.js + Express.js)"]
        Routes[API Routing Layer]
        AuthMW[JWT Auth & Role Authorization Middleware]
        Controllers[Business Logic & Matching Engine]
        Routes --> AuthMW --> Controllers
    end

    subgraph DB ["Database (MongoDB Atlas)"]
        Users[(Users Collection)]
        Profiles[(Student / Warden / Staff Profiles)]
        Complaints[(Complaints Collection)]
        Matches[(Roommate Matches Collection)]
        Passes[(Visitor Passes Collection)]
        Menus[(Mess Menus Collection)]
        Controllers --> DB
    end

    Axios <== HTTP / REST ==> Routes
```

---

## 🛠️ Technology Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend** | React 19, Vite, React Router v7 | High-performance SPA frontend |
| **Styling** | Tailwind CSS v4, Lucide Icons | Responsive UI with Dark Mode support |
| **HTTP Client** | Axios | Interceptor-driven API communications |
| **Backend** | Node.js, Express.js | Modular RESTful API server |
| **Database** | MongoDB Atlas, Mongoose v9 | Cloud NoSQL database with strict schema validation |
| **Security** | JSON Web Tokens (JWT), bcryptjs | Role-Based Access Control (RBAC) & password hashing |
| **Deployment** | Vercel (Frontend), Render (Backend) | Cloud-hosted deployment infrastructure |

---

## 🖥️ Application Modules & Screenshots

### 1. Public Landing Page & Features Showcase
Professional landing page with dynamic rotating headlines, feature spotlights, hostel rules, emergency resources, and responsive navigation.

![Landing Page](frontend/public/student_accomodation1.png)
*Figure 1: UniNest Public Landing Page & Hero Section*

- **Key Functions**:
  - Hero introduction & dynamic text animation.
  - Interactive feature cards highlighting Intelligent Roommate Matching, Maintenance Tracking, and Simplified Living.
  - Direct access to Login / Registration portals.
  - Global responsive Footer with quick links and accreditation details.

---

### 2. Student Dashboard & Overview
Central hub for students displaying total filed complaints, current day mess menu, quick resource modals, and feedback submission.

![Student Overview](frontend/public/simplifiedhostellife.png)
*Figure 2: Student Dashboard & Quick Resources*

- **Key Functions**:
  - Live complaint status summary counters (Total, Pending, Resolved).
  - Dynamic **Today's Mess Menu** preview (Breakfast, Lunch, Snacks, Dinner).
  - Quick Resource triggers: **Visitor Pass Generator**, **Hostel Rules**, and **Emergency Siren Modal**.
  - Interactive Meal Feedback form with 5-star rating system.

---

### 3. Intelligent Roommate Matching Module
A data-driven compatibility engine matching students based on weighted lifestyle survey parameters.

![Roommate Match](frontend/public/roommatematch.png)
*Figure 3: Roommate Matching Algorithm Showcase*

- **Key Functions**:
  - **Preference Survey**: Captures Schedule (Morning/Night), Cleanliness (High/Medium/Low), Noise Tolerance (Quiet/Okay/Noisy), Study Habit (Alone/Group), Allergies, and Room Capacity preference (2, 3, 4, or 5 sharing).
  - **Compatibility Calculation**: Calculates pairwise compatibility scores (0–100%).
  - **Warden Execution & Override**: Warden runs the greedy grouping algorithm and can manually add unmatched students or assign room numbers.
  - **Student View**: Displays matched room partner profiles and assigned room details once confirmed.

---

### 4. Complaint & Issue Tracking Module
End-to-end maintenance lifecycle management.

![Issue Reporting](frontend/public/issuereporting.png)
*Figure 4: Issue Reporting & Complaint Management*

- **Key Functions**:
  - **Filing**: Students submit complaints specifying room number, category, title, and description.
  - **Student Tracking**: Real-time status badges (`PENDING`, `IN_PROGRESS`, `RESOLVED`).
  - **Warden Controls**: Filtering, priority assignment (`LOW`, `MEDIUM`, `HIGH`), and status progression with timestamp tracking.

---

### 5. Digital Visitor Pass Center
Paperless security entry pass management.

- **Key Functions**:
  - Request visitor pass with Visitor Name, Relation, Phone, Visit Date, Expected Time Slot, and Reason.
  - Generates a unique secure Pass Code (`VP-YYYY-XXXX`) and simulated QR Code for main gate verification.
  - Allows Warden/Staff to review, approve, reject, or expire passes.

---

### 6. Warden & Staff Administrative Dashboard
Central command center for administrative staff.

- **Key Functions**:
  - **Overview Stats**: Total student count, pending complaints, average feedback rating, and new registrations today.
  - **Student Registry**: Searchable student directory with branch, year, gender, room allocation, and full profile inspection.
  - **Staff Management**: Register new staff members (Maintenance, Security, Housekeeping, Mess, Cleaning, Laundry) with auto-generated passwords and shift assignments.
  - **Mess Menu Manager**: Weekly menu editor supporting meal item updates per day.

---

## 🗄️ Database Schema & Collections

All models persist in the **`uninest`** MongoDB database:

1. `users`: System authentication accounts (`name`, `email`, `password`, `contactNo`, `role`).
2. `studentprofiles`: Academic & residential records (`branch`, `year`, `gender`, `hostelType`, `roomId`, `parentContactNo`, `profileComplete`).
3. `wardenprofiles`: Warden profile details (`contactNo`, `hostelType`).
4. `staffprofiles`: Staff department & shift info (`dept`, `shift`, `hostelType`).
5. `complaints`: Maintenance issues (`title`, `description`, `roomId`, `status`, `priority`).
6. `feedbacks`: Mess ratings (`rating`, `comment`).
7. `menus`: Daily meal schedules (`meals` per day).
8. `notifications`: System alerts & event logs.
9. `preferences`: Roommate matching preferences.
10. `roommatematches`: Matched student groups with compatibility scores and room assignments.
11. `visitorpasses`: Digital entry passes with unique pass codes.

---

## ⚡ Quick Start & Local Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB instance)

### 1. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Configure Environment
cp .env.example .env
# Edit .env with your MongoDB Atlas MONGO_URI and JWT_SECRET

# Run Atlas database index & collection setup script
node setup-atlas.js

# Start Backend Server
npm run dev
```
Backend will start on `http://localhost:8080`.

### 2. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start Vite Dev Server
npm run dev
```
Frontend will start on `http://localhost:5173`.

---

## 🧪 Verification & E2E Testing

UniNest includes a comprehensive end-to-end integration test runner:

```bash
cd backend
node scratch/test-all-flows.js
```

### Verified Test Cases
- ✅ `GET /api/health` ➔ Returns 200 OK & Database status
- ✅ User Registration & Duplicate Email Rejection
- ✅ Login & Role-Based Token Generation
- ✅ Student Profile CRUD Operations
- ✅ Roommate Preference Persistence
- ✅ Complaint Filing & Status Resolution Workflow
- ✅ Digital Visitor Pass Allotment & Code Generation
- ✅ Warden Staff Registration & Management
- ✅ Mess Menu Management & Feedback Rating Aggregation

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Connect repository to Vercel.
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_URL`: `https://your-backend.onrender.com`
5. Vercel SPA routes are pre-configured via `frontend/vercel.json`.

### Backend Deployment (Render)
1. Create a **New Web Service** on Render.
2. Connect GitHub repository `UniNext-hostellers-`.
3. Set **Root Directory** to `backend`.
4. Set **Build Command** to `npm install`.
5. Set **Start Command** to `npm start`.
6. Add Environment Variables:
   - `MONGO_URI`: `mongodb+srv://<user>:<password>@cluster0.iox9c91.mongodb.net/uninest?retryWrites=true&w=majority`
   - `NODE_ENV`: `production`
   - `JWT_SECRET`: `your_secure_random_jwt_secret`
   - `FRONTEND_URL`: `https://your-app.vercel.app`

---

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
