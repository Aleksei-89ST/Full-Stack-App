
import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

// эта библиотека позволяет работать с MONGODB
mongoose
  .connect(
    "mongodb+srv://lehaleonov52:6319cccfc3294c25191db7ec@cluster0.qpz6qye.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB"))
  .catch((err) => console.log("DB ERROR" + err));

const app = express();

// позволит читать JSON в запросах
app.use(express.json());

// req - будет хранится инфа о том что мне прислал клиент,в res я обьясняю что я буду передовать клиенту
// expess приложение которое хранится в app
// тут обьясняю что когда придет что-то (роут)-что вернуть пользователю
app.get("/", (req, res) => {
  res.send("Welcome");
});

// авторизация
app.post("/auth/login", (req, res) => {
  console.log(req.body);
// БЛАГОДАРЯ JWT ШИФРУЮ ИНФУ
  const token = jwt.sign(
    {
      email: req.body.email,
      fullName: "Алекс Фергюсон",
    },
    "secret123"
  );
  res.json({
    success: true,
    token,
  });
});

// обьясняю на какой порт прикрепить app - можно указать лбой ВТОРОЙ ПАРАМЕТР функция - если произошла ошибка
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
