import express from "express";
import mongoose from "mongoose";
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validation.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";

// эта библиотека позволяет работать с MONGODB
mongoose
  .connect(
    "mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

// express будет хранится в app
const app = express();

// позволит читать JSON в запросах
app.use(express.json());

// авторизация
app.post("/auth/login", loginValidation, UserController.login);
// регистрация
app.post("/auth/register", registerValidation, UserController.register);
// проверка моих данных
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/posts", checkAuth, postCreateValidation, PostController.create);

// обьясняю на какой порт прикрепить app - можно указать лЮбой ВТОРОЙ ПАРАМЕТР функция - если произошла ошибка
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
