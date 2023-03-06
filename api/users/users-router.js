// `sinirli` middleware'ını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!
const UserModels = require("./users-model");
const md = require("../auth/auth-middleware");
const router = require("express").Router();

router.get("/", md.sinirli, (req, res, next) => {
  UserModels.bul()
    .then((response) => res.status(200).json(response))
    .catch((err) => next(err));
});

router.use((err, req, res, next) => {
  res
    .status(err.status || 500)
    .json({ message: err.message || "database problem" });
});
/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  status: 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  status: 401
  {
    "message": "Geçemezsiniz!"
  }
 */

// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

module.exports = router;
