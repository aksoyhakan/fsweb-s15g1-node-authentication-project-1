const UserModels = require("../users/users-model");
/*
  Kullanıcının sunucuda kayıtlı bir oturumu yoksa

  status: 401
  {
    "message": "Geçemezsiniz!"
  }
*/
function sinirli(req, res, next) {
  console.log(req.session);
  req.session && req.session.user_id
    ? next()
    : next({ status: 401, message: "Geçemezsiniz!" });
}

/*
  req.body de verilen username halihazırda veritabanında varsa

  status: 422
  {
    "message": "Username kullaniliyor"
  }
*/
function usernameBostami(req, res, next) {
  UserModels.goreBul({ username: req.body.username })
    .then((response) =>
      response.length > 0
        ? next({ status: 422, message: "Username kullaniliyor" })
        : next()
    )
    .catch((err) => next(err));
}

/*
  req.body de verilen username veritabanında yoksa

  status: 401
  {
    "message": "Geçersiz kriter"
  }
*/
function usernameVarmi(req, res, next) {
  UserModels.goreBul({ username: req.body.username })
    .then((response) =>
      response.length > 0
        ? next()
        : next({ status: 401, message: "Geçersiz kriter" })
    )
    .catch((err) => next(err));
}

/*
  req.body de şifre yoksa veya 3 karakterden azsa

  status: 422
  {
    "message": "Şifre 3 karakterden fazla olmalı"
  }
*/
function sifreGecerlimi(req, res, next) {
  const { password } = req.body;
  password && password.length > 3
    ? next()
    : next({ status: 422, message: "Şifre 3 karakterden fazla olmalır" });
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports = { sinirli, usernameBostami, usernameVarmi, sifreGecerlimi };
