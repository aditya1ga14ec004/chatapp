const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.update({
    accessKeyId: 'AKIAI5IV5CZK7JVJNMSA',
    secretAccessKey: '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',
    region: 'us-east-1'
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




















