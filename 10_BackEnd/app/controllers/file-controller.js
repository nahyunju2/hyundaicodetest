const db = require("../models");
const fs = require("fs");
const dotenv = require("dotenv");
const uuid = require("uuid");

const contentDisposition = require('content-disposition');

const File = db.File;
const FileMap = db.FileMap;
const FileShare = db.FileShare;
const Disk = db.Disk;

dotenv.config();

// 업로드
exports.upload = async (req, res) => {
    try {
        // console.log(req.file);
        // {
        //     fieldname: 'file',
        //     originalname: 'eBook_Cloud Native Infrastructure with Azure.pdf',
        //     encoding: '7bit',
        //     mimetype: 'application/pdf',
        //     destination: 'tempUploadFiles/',
        //     filename: '4dc9cd76d6b30c9c97e43efde9df84d8',
        //     path: 'tempUploadFiles\\4dc9cd76d6b30c9c97e43efde9df84d8',
        //     size: 14250789
        //   }

        const diskId = process.env.TEMP_DISK_ID;
        const diskLocation = process.env.TEMP_DISK_LOCATION;
        const folderId = req.body.folderId;
        const email = req.profile.email;
        const fileFullPath = `${email}/${req.file.filename}`;
        const fileId = uuid.v4();

        // DB 삽입
        await File.create({
            file_id: fileId,
            file_name: req.file.originalname,
            file_size: req.file.size,
            owner: email,
            disk_id: diskId,
            file_full_path: fileFullPath,
            is_deleted: false,
            deleted_date: null
        })
        // DB 폴더 매핑
        await FileMap.create({
            email: email,
            file_id: fileId,
            folder_id: folderId
        });


        // 파일 이동
        const folderFullpath = `${diskLocation}\\${email}`;
        fs.mkdir(folderFullpath, (err) => {
            fs.copyFile(req.file.path, `${folderFullpath}\\${fileId}`, (err) => {
                // Nothing
            });
        });
        
        res.status(200).send({
            message: "uploaded"
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}

exports.download = async (req, res) => {
    try {
        const email = req.profile.email;
        const fileId = req.query.fileId;
        let canDownload = false;

        // 권한체크
        // 파일의 Owner인지 체크
        const fileInfo = await File.findOne({
            where: {
                file_id: fileId
            }
        });

        if (fileInfo.owner == email) {
            canDownload = true;
            console.log(canDownload);
        }
        // 공유파일인지 체크
        if (!canDownload) {
            const now = new Date();
            const shareInfo = await FileShare.findOne({
                where: {
                    file_id: fileId,
                    share_email: email
                }
            });

            if (shareInfo) {
                // 공유기간이면 가능
                if (shareInfo.share_start_date <= now && shareInfo.share_end_date >= now) {
                    canDownload = true;
                }
                // 공유기간 지남
                else {
                    return res.status(400).json({
                        success: false,
                        message: "공유 기간이 지났습니다."
                    });
                }
            }
        }

        // 파일 찾기
        const diskInfo = await Disk.findOne({
            where: {
                disk_id: fileInfo.disk_id
            }
        });

        const fileFullPath = `${diskInfo.disk_path}/${fileInfo.owner}/${fileInfo.file_id}`;


        console.log(`fileFullPath: ${fileFullPath}, fileInfo.file_name: ${fileInfo.file_name}`);

        res.writeHead(200, {
            'Content-Disposition': contentDisposition(fileInfo.file_name),
            'Content-Type': 'application/octet-stream',
            'Content_Length': fileInfo.file_size
        });
        
        var readStream = fs.createReadStream(fileFullPath);
        readStream.pipe(res);
        //readStream.on('error', (err) => console.log(err));

        // 파일 다운로드
        //res.download(fileFullPath, fileInfo.file_name);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message:
                err.message
        });
    }
}

// 파일 이름변경
exports.renameFile = async (req, res) => {
    try{
        const fileId = req.body.fileId;
        const fileName = req.body.fileName;
        const email = req.profile.email;

        // TODO: 권한처리

        await File.update({
            file_name: fileName
        },{
            where: {
                file_id: fileId
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

// 파일 삭제
exports.deleteFile = async (req, res) => {
    try{
        const fileId = req.body.fileId;
        const email = req.profile.email;

        // TODO: 권한처리

        await File.update({
            is_deleted: true,
            deleted_date: new Date()
        },{
            where: {
                file_id: fileId
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