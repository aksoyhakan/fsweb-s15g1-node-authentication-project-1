const db = require("../../data/db-config");

/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
async function bul() {
  const users = await db("users");
  let newUsers = users.map((item) => {
    return { user_id: item["user_id"], username: item["username"] };
  });
  return newUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
function goreBul(filtre) {
  return db("users").where(Object.keys(filtre)[0], Object.values(filtre)[0]);
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
function idyeGoreBul(user_id) {
  return db("users").where({ user_id }).first();
}

/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
function ekle(user) {
  return db("users")
    .insert(user)
    .then((r) => idyeGoreBul(r[0]));
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.

module.exports = { bul, goreBul, idyeGoreBul, ekle };
