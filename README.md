# ⚽ Monkae Footy Scouting Database

A full-stack, digital scouting platform designed to modernize football recruitment in South Africa. Monkae connects local talent with professional scouts through a verified, data-driven dashboard.

![Status](https://img.shields.io/badge/Status-MVP_Complete-success)
![Stack](https://img.shields.io/badge/Stack-Vue_3_%7C_Firebase_%7C_Tailwind-blue)

## 🚀 Key Features

### 👤 For Players
* **Digital Profile:** Replaces paper registration with a mobile-first digital form.
* **Highlight Reel:** Supports **video uploads (up to 20MB)** so players can showcase their best game moments directly on their profile.
* **Smart Validation:** Enforces age limits (U16 focus) and strict position codes.

### 🕵️‍♂️ For Scouts (Dashboard)
* **Visual Screening Room:** Scouts can view headshots, physical stats, and watch video highlights in a "Player Card" modal without leaving the dashboard.
* **Filtering Engine:** Instantly filter talent by position (GK, DEF, MID, FWD) using strict-type matching.
* **Secure Access:** Manually verified credentials ensure only legitimate team representatives access the database.

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | Vue 3 (Composition API), Vite |
| **Styling** | Tailwind CSS (Custom "Monkae" Brand System) |
| **Backend** | Firebase Cloud Functions (Node.js) |
| **Database** | Firestore (NoSQL) |
| **Storage** | Firebase Storage (Images & Video) |

## ⚙️ How to Run Locally

This project uses the Firebase Emulator Suite to mimic a production environment locally.

1.  **Clone the repo**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/monkae-footy.git](https://github.com/YOUR_USERNAME/monkae-footy.git)
    cd monkae-footy
    ```

2.  **Install Dependencies**
    ```bash
    npm install         # Backend dependencies
    cd client && npm install  # Frontend dependencies
    ```

3.  **Start the Backend (Emulators)**
    From the root folder:
    ```bash
    firebase emulators:start
    ```

4.  **Start the Frontend**
    From the `client/` folder:
    ```bash
    npm run dev
    ```

## 🔮 Future Roadmap (Production)
* **PWA Integration:** "Add to Home Screen" functionality for offline scouting.
* **Team Accounts:** Multi-tenant architecture for teams to manage their own "Shortlists."
* **Subscription Gate:** Automated billing (Paystack/Yoco) for 3/6/12 month access plans.

---
*Built by [Your Name] in Cape Town, SA 🇿🇦*