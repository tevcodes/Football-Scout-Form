const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const cors = require("cors");

// Initialize Firebase
admin.initializeApp();
const db = admin.firestore();

// Initialize Express
const app = express();
app.use(cors({origin: true}));

// Define Routes
app.post("/register", async (req, res) => {
  try {
    const {fullName, dob, position, phone} = req.body;

    // Basic Validation
    if (!fullName || !position || !phone) {
      return res.status(400).json({error: "Missing required fields"});
    }
    const newPlayer = {
      fullName,
      dob,
      position,
      phone,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    // Save to Firestore Collection
    const docRef = await db.collection("registrations").add(newPlayer);

    // Return Success
    return res.status(201).json({
      message: "Registration successful",
      id: docRef.id,
    });
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

app.get("/players", async (req, res) => {
  try {
    const snapshot = await db.collection("registrations").get();
    const players = [];

    snapshot.forEach((doc) => {
      players.push({id: doc.id, ...doc.data()});
    });

    return res.status(200).json(players);
  } catch (error) {
    return res.status(500).json({error: error.message});
  }
});

exports.api = functions.https.onRequest(app);
