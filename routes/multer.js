const multer = require('multer');
const path = require('path');
const fs = require('fs');

try {
    fs.readdirSync('images');
} catch (error) {
    console.error('images 폴더 생성');
    fs.mkdirSync('images');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null,'images/');
        },
        filename(req,file,cb) {
            const ext = path.extname(file.originalname); //확장자
            cb(null,path.basename(file.originalname, ext) + Date.now() + ext);
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024},
});

module.exports = upload;