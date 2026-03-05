const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const adminLayout = "../views/layouts/admin";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

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
router.get("/updateTask/:id", authMiddleware, async (req, res) => {
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
