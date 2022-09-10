import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// bcrypt - это библиотека позволяет шифровать пароль с фронтенда
import bcrypt from "bcrypt";
import { registerValidation } from "./validation/auth.js";
import { validationResult } from "express-validator";
import UserModel from "./models/User.js";

// эта библиотека позволяет работать с MONGODB
mongoose
  .connect(
    "mongodb+srv://fox:wwwwww@cluster0.wwxynyy.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB OK"))
  .catch((err) => console.log("DB ERROR", err));

const app = express();

// позволит читать JSON в запросах
app.use(express.json());

// авторизация
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    // отличный способ шифрования пароля ------>>>>>>> SALT-АЛГОРИТМ ШИФРОВАНИЯ
    const passwordHash = await bcrypt.hash(password, salt);

    // документ на создания нового пользователя
    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash,
    });

    // создаю самого пользователя в mongodb
    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    res.json({ ...user, token });
  } catch (error) {
    // это храню для себя
    console.log(error);
    //ЭТО ДЛЯ ПОЛЬЗОВАТЕЛЯ-пришёл ответ ввиде ошибке и вот ифа о ошибке
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

// обьясняю на какой порт прикрепить app - можно указать лбой ВТОРОЙ ПАРАМЕТР функция - если произошла ошибка
app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
