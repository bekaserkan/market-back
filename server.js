const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = 3001;
const UPLOADS_DIR = "uploads/";

// Функция для создания папки uploads, если её нет
function createUploadsFolder() {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR);
  }
}

// Создаем папку uploads при старте сервера, если она не существует
createUploadsFolder();

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

let tasks = [];

app.get("/list", (req, res) => {
  const tasksWithImageUrls = tasks.map((task) => {
    const imageUrl = task.image
      ? `http://localhost:${PORT}/uploads/${task.image}`
      : null;

    return {
      ...task,
      image: imageUrl,
    };
  });

  res.json(tasksWithImageUrls);
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

app.post("/post", upload.single("image"), (req, res) => {
  const imageFileName = req.file ? req.file.filename : "beka";

  const newTask = {
    ...req.body,
    image: imageFileName,
  };

  tasks.push(newTask);

  res.json({ message: "Успешно добавлено" });
});

app.get("/favorite", (req, res) => {
  const favoriteTasks = tasks.filter((task) => task.favorite === true);
  res.json(favoriteTasks);
});

app.put("/favorite/:id", (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, ...updatedTask } : task
  );
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
