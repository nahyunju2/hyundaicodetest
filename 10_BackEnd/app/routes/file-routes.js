module.exports = app => {
    const { auth } = require('../middleware/auth-middleware');
    const multer = require("multer");
    const upload = multer({ dest: "tempUploadFiles/" });
    const file = require("../controllers/file-controller.js");

    var router = require("express").Router();

    // JWT 인증 토큰 Parse
    router.post("/:id", auth);
    router.get("/:id", auth);

    // 파일 업로드
    router.post("/upload", upload.single('file'), file.upload);

    // 파일 다운로드
    router.get("/download", file.download);

    // 파일 삭제
    router.post("/delete", file.deleteFile);

    // 파일 이름변경
    router.post("/rename", file.renameFile);

    app.use("/api/file", router);
};