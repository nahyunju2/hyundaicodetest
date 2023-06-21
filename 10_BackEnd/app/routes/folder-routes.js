module.exports = app => {
    const { auth } = require('../middleware/auth-middleware');
    const folder = require("../controllers/folder-controller.js");

    var router = require("express").Router();

    // JWT 인증 토큰 Parse
    router.get("/:id", auth);
    router.post("/:id", auth);

    // 대상폴더의 파일 목록 조회
    router.get("/list", folder.getFileListByFolderId);

    // 폴더 생성
    router.post("/add", folder.addFolder);

    // 폴더 이름변경
    router.post("/rename", folder.renameFolder);

    app.use("/api/folder", router);
};