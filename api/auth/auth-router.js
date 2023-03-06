// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!
const md = require("./auth-middleware");
const UserModels = require("../users/users-model");
const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();

router.post(
  "/register",
  md.usernameBostami,
  md.sifreGecerlimi,
  (req, res, next) => {
    const hash = bcrypt.hashSync(req.body.password, 8);
    req.body.password = hash;
    UserModels.ekle(req.body)
      .then((response) =>
        res.status(201).json({
          user_id: response["user_id"],
          username: response["username"],
        })
      )
      .catch((err) => next(err));
  }
);
/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status: 201
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  status: 422
  {
    "message": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
 */

router.post("/login", md.usernameVarmi, (req, res, next) => {
  UserModels.goreBul({ username: req.body.username })
    .then((response) => {
      if (bcrypt.compareSync(req.body.password, response[0]["password"])) {
        req.session.user_id = response[0]["user_id"];
        req.session.cookie.cikolatacips = { name: "cikolatacips" };
        console.log(req.session);
        res.status(201).json({
          message: `geldin ${response[0]["username"]}`,
        });
      } else {
        next({ status: 401, message: "Geçersiz kriter" });
      }
    })
    .catch((err) => next(err));
});

/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status: 200
  {
    "message": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  status: 401
  {
    "message": "Geçersiz kriter!"
  }
 */

router.get("/logout", (req, res, next) => {
  if (req.session.user_id) {
    req.session.destroy((err) => {
      if (err) {
        next(err);
      } else {
        res.status(200).json({ message: "Çıkış yapildi" });
      }
    });
  } else {
    next({ status: 200, message: "Oturum bulunamadı!" });
  }
});

/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  status: 200
  {
    "message": "Çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  status: 200
  {
    "message": "Oturum bulunamadı!"
  }
 */

router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "database problem" });
});

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
module.exports = router;
