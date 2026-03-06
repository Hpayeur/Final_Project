const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

//Admin - Login Page
router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "A blog template made with NodeJS and ExpressJS",
    };
    res.render("admin/index", { locals, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//Admin - Login
router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Admin - Dashboard
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Dashboard",
      description: "A blog template made with NodeJS and ExpressJS",
    };
    const data = await Task.find();
    res.render("admin/dashboard", { locals, data, layout: adminLayout });
  } catch (error) {}
});

//Admin - Register
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({
        username,
        password: hashedPassword,
      });
      res.status(201).json({ message: "User created successfully", user });
    } catch (error) {
      if (error === 11000) {
        return res.status(500).json({ message: "Username already Exists" });
      } else {
        return res
          .status(500)
          .json({ message: "Something went wrong with the server" });
      }
    }
  } catch {
    console.log(error);
  }
});

//Admin - Logout
router.get("/logout", authMiddleware, async (req, res) => {
  try {
    res.clearCookie("token");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
});

//Adding Task
router.get("/add-task", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "create Task",
      description: "A blog template made with NodeJs, ExpressJs, and Ejs",
    };
    const data = await Task.find();
    res.render("admin/add-task", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

router.post("/add-task", authMiddleware, async (req, res) => {
  try {
    console.log(req.body);
    try {
      const newTask = new Task({
        title: req.body.title,
        body: req.body.body,
      });
      await Task.create(newTask);
      res.redirect("/dashboard");
    } catch (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
});

//Update Task
router.get("/edit-task/:id", authMiddleware, async (req, res) => {
  try {
    const locals = {
      title: "Updates a Task",
      description: "A blog template made with NodeJs, ExpressJs, and Ejs",
    };
    const data = await Task.findOne({ _id: req.params.id });
    res.render("admin/edit-task", { locals, data, layout: adminLayout });
  } catch (error) {
    console.log(error);
  }
});

//Edit Task
router.put("/edit-task/:id", authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

//Detele Task
router.delete("/delete-task/:id", authMiddleware, async (req, res) => {
  try {
    await Task.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
