const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

let tasks = [];

app.get("/list", (req, res) => {
  res.json(tasks);
});

app.get("/list/:id", (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find((task) => task.id === taskId);
  if (task) {
    res.json(task);
  } else {
    res.status(404).json({ message: "Задача не найдена" });
  }
});

app.post("/post", (req, res) => {
  const newTask = req.body;
  tasks.push(newTask);
  res.json({ message: "Успешно добавлено" });
});

app.get("/favorite/", (req, res) => {
  const array = tasks.filter((obj) => {
    return obj.favorite == true;
  });
  res.json(array);
});

app.put("/favorite/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;
  tasks = tasks.map((task) => (task.id === taskId ? updatedTask : task));
  res.json(tasks);
});

app.delete("/delete/:id", (req, res) => {
  const taskId = req.params.id;
  tasks = tasks.filter((task) => task.id !== taskId);
  res.json({ message: "Успешно удалена" });
});

app.listen(PORT, () => {
  console.log(`Сервер работает по адресу http://localhost:${PORT}`);
});