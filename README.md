Monkae Footy Scouting Database (In Development)

A full-stack scouting platform being built to help local talent meet endless possibility by being exposed to established teams both locally and eventually internationally via a scouting database. The player will register though a frontend form web app which communicates with a dashboard belonging to teams and scouts subscribed to the service.

![Status](https://img.shields.io/badge/Status-In_Development-yellow)
![Stack](https://img.shields.io/badge/Stack-Vue_3_&_Firebase-orange)

## 🚧 Project Status
**Current Phase:** Core Logic & Infrastructure
**Next Phase:** UI/UX Polish & V1 Feature Completion

* ✅ **Backend:** Firebase functions connected and running.
* ✅ **Database:** Firestore set up with strict typing.
* ✅ **Auth:** Basic authentication structure in place.
* ✅ **Uploads:** Image storage logic implemented.
* 🚧 **UI:** Tailwind styling is currently in progress.

## 🎯 V1 Goals (Upcoming Features)
I am currently working towards the V1 release, which will include:

1.  **Visual Overhaul:** Complete responsive styling using the Monkae Brand System.

## 🛠️ Tech Stack
* **Frontend:** Vue 3 (Composition API), Vite
* **Styling:** Tailwind CSS (Custom Config)
* **Backend:** Node.js (Firebase Cloud Functions)
* **Data:** Firestore (NoSQL) & Firebase Storage

## ⚙️ How to Run Locally
Since this project uses Firebase Emulators, follow these steps to run it offline:

1.  **Clone the repo**
    ```bash
    git clone https://github.com/tevcodes/Football-Scout-Form.git
    ```

2.  **Install Dependencies** (Root & Client)
    ```bash
    npm install
    cd client && npm install
    ```

3.  **Start the Backend**
    ```bash
    firebase emulators:start
    ```

4.  **Start the Frontend**
    ```bash
    cd client
    npm run dev
    ```

---
*Created by tevcodes as part of a Full Stack Portfolio.*
