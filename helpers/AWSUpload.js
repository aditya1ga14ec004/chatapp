const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const secret = require('../secret/secretFile');

AWS.config.update({
    accessKeyId: secret.AWSKEYS.accessKeyId,
    secretAccessKey: secret.AWSKEYS.secretAccessKey,
    region: secret.AWSKEYS.region
});

const mys3 = new AWS.S3({});
const  upload = multer({
    storage: multerS3({
        s3: mys3,
        bucket: 'mychatappbucketnumberone',
        acl: 'public-read',
        metadata:function(req, file, cb){
            cb(null, {fieldName:file.fieldname});
        },
        key:function(req, file, cb){
            cb(null, file.originalname);
        }
    }),
    rename:function(fieldname, filename){
        return filename.replace(/\W+/g, '-').toLowerCase();
        }
})

exports.Upload = upload;




















