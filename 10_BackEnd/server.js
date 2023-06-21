const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");


const app = express();

// 환경변수 사용선언
dotenv.config();

var corsOptions = {
   origin: "http://localhost:80"
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./app/models");

db.sequelize.sync();
// 개발 중에는 기존 테이블을 삭제하고 데이터베이스를 다시 동기화해야 할 수 있습니다. force: true다음 코드로 사용
// db.sequelize.sync({ 
//   force: true 
// }).then(() => {
//   // 임시 폴더 생성
//   db.Disk.create({
//     disk_id: process.env.TEMP_DISK_ID,
//     disk_name: 'TEMP',
//     disk_path: process.env.TEMP_DISK_LOCATION
//   });
//   fs.mkdir(process.env.TEMP_DISK_LOCATION, (err) => { });
// });

require("./app/routes/auth-routes")(app);
require("./app/routes/file-routes")(app);
require("./app/routes/folder-routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});