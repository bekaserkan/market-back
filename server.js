const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Указываем папку для сохранения файлов
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Генерируем уникальное имя для файла
  },
});
const upload = multer({ storage: storage });

let tasks = [];

app.get("/list", (req, res) => {
  const tasksWithImageUrls = tasks.map((task) => {
    const imageUrl = task.file
      ? `https://market-back-bx.onrender.com/uploads/${task.file.filename}`
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
  const newTask = {
    ...req.body,
    image: req.image ? req.image.filename : null,
  };

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
