const express = require("express");
const router = express.Router();
const { auth, authorize } = require("../middleware/auth");
const Menu = require("../models/Menu");

// GET /api/menu — get the menu
router.get("/", auth, async (req, res) => {
  try {
    const menu = await Menu.find();
    res.json(menu);
  } catch (error) {
    console.error("Get menu error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/menu — warden creates menu
router.post("/", auth, async (req, res) => {
  try {
    const { meals } = req.body;

    const menu = await Menu.create({ meals });
    res.status(201).json(menu);
  } catch (error) {
    console.error("Create menu error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT /api/menu/:id — warden updates menu
router.put("/:id", auth, async (req, res) => {
  try {
    const { meals } = req.body;

    const menu = await Menu.findByIdAndUpdate(
      req.params.id,
      { meals },
     { returnDocument: "after" }
    );

    if (!menu) {
      return res.status(404).json({ message: "Menu not found" });
    }

    res.json(menu);
  } catch (error) {
    console.error("Update menu error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;