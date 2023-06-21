const db = require("../models");
const dotenv = require("dotenv");
const uuid = require("uuid");

const File = db.File;
const FileMap = db.FileMap;
const Folder = db.Folder;

dotenv.config();

// 대상폴더의 파일 목록 조회
exports.getFileListByFolderId = async (req, res) => {
    try {
        const folderId = req.query.folderId;
        const email = req.profile.email;

        const fileList = await File.findAll({
            include: [{
                model: FileMap,
                where: {
                    folder_id: folderId,
                    email: email
                }
            }]
        });

        const folderList = await Folder.findAll({
            where: {
                parent_folder_id: folderId,
                owner: email
            }
        });

        //const folderPathList = await Folder.findAll({ hierarchy: true });
        
        const folderPathList = await Folder.findOne({
            where: { folder_id: folderId },
            include: [ { model: Folder, as: 'ancestors' } ],
            order: [ [ { model: Folder, as: 'ancestors' }, 'hierarchyLevel' ] ]
          });

        

        return res.status(200).json({
            success: true,
            message: "Success",
            fileList: fileList,
            folderList: folderList,
            folderPathList: folderPathList
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}

// 폴더 생성
exports.addFolder = async (req, res) => {
    try {
        const parentFolderId = req.body.folderId;
        const folderType = req.body.folderType;
        const folderName = req.body.folderName;
        const email = req.profile.email;
        const folderId = uuid.v4();

        await Folder.create({
            folder_id: folderId,
            folder_type: folderType,
            parent_folder_id: parentFolderId,
            folder_name: folderName,
            owner: email,
            is_deleted: false,
            deleted_date: null
        })

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}

// 폴더 이름변경
exports.renameFolder = async (req, res) => {
    try {
        const folderId = req.body.folderId;
        const folderName = req.body.folderName;
        const email = req.profile.email;

        // TODO: 권한처리

        await Folder.update({
            folder_name: folderName
        }, {
            where: {
                folder_id: folderId
            }
        });

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}

// 폴더 삭제
exports.deleteFolder = async (req, res) => {
    try {
        const folderId = req.body.folderId;
        const email = req.profile.email;

        // TODO: 권한처리

        await Folder.update({
            is_deleted: true,
            deleted_date: new Date()
        }, {
            where: {
                folder_id: folderId
            }
        });

        res.status(200).send();
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}