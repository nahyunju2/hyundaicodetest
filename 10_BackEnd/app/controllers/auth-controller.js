// jwt 라이브러리
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const uuid = require('uuid');

const db = require("../models");
const Op = db.Sequelize.Op;
const User = db.User;
const Folder = db.Folder;

// 로그인
exports.login = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(400).send({
        message: "Email empty!"
      });
      return;
    }

    const password = req.body.password;
    if (!password) {
      res.status(400).send({
        message: "Password empty!"
      });
      return;
    }

    const key = process.env.SECRET_KEY;
    const hashPassword = crypto.createHash("sha512").update(password).digest("hex");

    const user = await User.findOne(
      {
        where: {
          email: { [Op.eq]: email }
        }
      }
    );

    // 데이터베이스에 있는 유저
    if (user) {
      // 5번 이상 패스워드를 틀린 유저
      if (user.failPassword >= 5) {
        return res.status(200).json({
          success: false,
          message: "The user has been suspended."
        });
      }

      if (user.password == hashPassword) {
        const email = user.email;

        const myFolderInfo = await Folder.findOne({
          where: {
            owner: email,
            parent_folder_id: null,
            folder_type: 'my-folder'
          }
        });
        const myShareInfo = await Folder.findOne({
          where: {
            owner: email,
            parent_folder_id: null,
            folder_type: 'share-folder'
          }
        });
        const myTrashInfo = await Folder.findOne({
          where: {
            owner: email,
            parent_folder_id: null,
            folder_type: 'trash'
          }
        });

        const myFolderId = myFolderInfo.folder_id;
        const myShareId = myShareInfo.folder_id;
        const myTrashId = myTrashInfo.folder_id;


        const profile = {
          email: email,
          userName: user.userName,
          langId: user.langId,
          myFolderId: myFolderId,
          myShareId: myShareId,
          myTrashId: myTrashId
        }

        const token = jwt.sign(
          {
            type: "JWT",
            email: email,
            profile: profile,
          },
          key,
          {
            expiresIn: "24h", // 1일후 만료
            issuer: "admin",
          }
        );

        User.update({
          failPassword: 0,
          lastAccessTime: new Date()
        }, {
          where: {
            email: { [Op.eq]: email }
          }
        });

        // response
        return res.status(200).json({
          success: true,
          message: "token is created",
          token: token,
          folderId: myFolderId,
          shareId: myShareId,
          trashId: myTrashId
        });
      }
      // 패스워드를 틀린 유저
      else {
        User.update({ failPassword: user.failPassword + 1 }, {
          where: {
            email: { [Op.eq]: email }
          }
        });

        return res.status(200).json({
          success: false,
          message: "Password is incorrect."
        });
      }
    }
    // 없는 유저
    else {
      return res.status(200).json({
        success: false,
        message: "user not found"
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message
    });
  }
};

// 회원 등록
exports.registUser = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      // TODO: 이메일 형식 체크 필요
      res.status(400).send({
        message: "Email empty!"
      });
      return;
    }

    const password = req.body.password;
    if (!password) {
      res.status(400).send({
        message: "Password empty!"
      });
      return;
    }

    const userName = req.body.userName;
    if (!userName) {
      res.status(400).send({
        message: "UserName empty!"
      });
      return;
    }

    const user = await User.findOne(
      {
        where: {
          email: { [Op.eq]: email }
        }
      }
    );

    if (user) {
      res.status(400).send({
        message: "User is duplication!"
      });
    }
    else {
      let hashPassword = crypto.createHash("sha512").update(password).digest("hex");

      const createUser = await User.create({
        email: email,
        password: hashPassword,
        userName: userName,
        langId: 'ko',
        registTime: new Date(),
        lastAccessTime: new Date(),
        failPassword: 0
      }).catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial."
        });
      });

      if (createUser) {

        const myFolderId = uuid.v4();
        const myShareId = uuid.v4();
        const myTrashId = uuid.v4();

        /// 기본적으로 3개의 폴더 생성
        await Folder.create({
          folder_id: myFolderId,
          folder_type: 'my-folder',
          parent_folder_id: null,
          folder_name: '내 폴더',
          owner: createUser.email,
          is_deleted: false,
          deleted_date: null
        });

        await Folder.create({
          folder_id: myShareId,
          folder_type: 'share-folder',
          parent_folder_id: null,
          folder_name: '공유 폴더',
          owner: createUser.email,
          is_deleted: false,
          deleted_date: null
        });

        await Folder.create({
          folder_id: myTrashId,
          folder_type: 'trash',
          parent_folder_id: null,
          folder_name: '휴지통',
          owner: createUser.email,
          is_deleted: false,
          deleted_date: null
        });

        const key = process.env.SECRET_KEY;
        const profile = {
          email: createUser.email,
          userName: createUser.userName,
          langId: createUser.langId,
          myFolderId: myFolderId,
          myShareId: myShareId,
          myTrashId: myTrashId
        }

        const email = createUser.email;

        const token = jwt.sign(
          {
            type: "JWT",
            email: email,
            profile: profile,
          },
          key,
          {
            expiresIn: "24h", // 1일후 만료
            issuer: "admin",
          }
        );

        // response
        return res.status(200).json({
          success: true,
          message: "token is created",
          token: token,
          folderId: myFolderId,
          shareId: myShareId,
          trashId: myTrashId
        });
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message:
        err.message
    });
  }
}