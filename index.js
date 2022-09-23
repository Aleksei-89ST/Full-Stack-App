import express from "express";
// библиотека для загрузки картинок на сервер
import multer from "multer";
import cors from "cors";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleErrors } from "./utils/index.js";

// эта библиотека позволяет работать с MONGODB
mongoose

  .connect("mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority")
  // .connect(process.env.MONGODB_URI) - это для HEROKU
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

// express будет хранится в app
const app = express();

const storage = multer.diskStorage({
  // функция - показывает куда сохранить наши картинки
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

// сохрания картинки в express
const upload = multer({ storage });

// позволит читать JSON в запросах
app.use(express.json());
// позволяет убрать блокировку доменов
app.use(cors());
app.use("/uploads", express.static("uploads"));

// авторизация
app.post("/auth/login", loginValidation, handleErrors, UserController.login);
// регистрация
app.post(
  "/auth/register",
  registerValidation,
  handleErrors,
  UserController.register
);
// проверка моих данных
app.get("/auth/me", checkAuth, UserController.getMe);

// получение картинок
app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});
// получение одного тега
app.get("/tags", PostController.getLastTags);
// получение всех постов
app.get("/posts", PostController.getAll);
// получение всех тегов
app.get("/posts/tags", PostController.getLastTags);
// получение одного поста
app.get("/posts/:id", PostController.getOne);
// создание одного поста
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleErrors,
  PostController.create
);
// удаление одной статьи
app.delete("/posts/:id", checkAuth, PostController.remove);
// обновление статьи
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleErrors,
  PostController.update
);

// обьясняю на какой порт прикрепить app - можно указать лЮбой ВТОРОЙ ПАРАМЕТР функция - если произошла ошибка
app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
