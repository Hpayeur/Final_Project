const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const servers = dns.getServers();
console.log("Node.js is using these DNS servers:", servers);
const expressLayouts = require("express-ejs-layouts");

require("dotenv").config();

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3002;

const connectDB = require("./server/config/db");
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(expressLayouts);
app.use(express.static("public"));
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/index"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// What my final project is going to be for this Application

// This is going to be A manage Pup App. This app will allow users to create a list that lets you add tasks, remove tasks, delete task, and even search for tasks.

// Goals for this project:
// 1. create add task functionality
// 2. create remove task functionality
// 3. create delete task functionality
// 4. create search for task functionality
// 5. Make the app look nice and user friendly2
