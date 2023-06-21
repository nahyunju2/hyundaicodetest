module.exports = app => {
  const auth = require("../controllers/auth-controller.js");

  var router = require("express").Router();

  // 로그인
  router.post("/login", auth.login);

  // 회원등록
  router.post("/registUser", auth.registUser);

  app.use("/api/auth", router);
};