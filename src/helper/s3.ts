"use strict"
import multer from 'multer'
import AWS from 'aws-sdk'
import { logger, reqInfo } from './winston_logger'
import multerS3 from 'multer-s3'
import { Request, Response } from 'express'
import { apiResponse } from '../common'
import multer_s3_transform from 'multer-s3-transform'
import sharp from 'sharp'

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION
})
const bucket_name = process.env.BUCKET_NAME
const bucket_url = process.env.BUCKET_URL

export const deleteImage = async function (file: any, folder: any , type : any , name : any) {
    return new Promise(async function (resolve, reject) {
        try {
            const bucketPath = `${bucket_name}/${folder}/${type}/${file}`
            // console.log(bucketPath,"bucketPath");
            let params = {
                Bucket: bucketPath,
                Key: name
            }
            await s3.deleteObject(params, function (err, data) {
                if (err) {
                    console.log(err)
                    reject(err)
                } else {
                    logger.info("File successfully delete")
                    resolve("File successfully delete")
                }
            })
        } catch (error) {
            console.log(error)
            reject(false)
        }
    })
}

export const uploadS3 = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req: any, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: any, file, cb) {
            logger.info('file successfully upload')
            const file_type = file.originalname.split('.')
            req.body.location = `${bucket_url}/${req.header('user')?._id}/${req.params.file}/${Date.now().toString()}/${file_type[0]}.${file_type[file_type.length - 1]}`
            cb(
                null,
                `${req.header('user')?._id}/${req.params.file}/${Date.now().toString()}/${file_type[0]}.${file_type[file_type.length - 1]}`
            );
        },
    }),
});

export const compress_image = multer({
    storage: multer_s3_transform({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        shouldTransform: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname })
        },
        transforms: [{
            id: 'image_500_300',
            key: function (req, file, cb) {
                const file_type = file.originalname.split('.')
                req.body.location = `${bucket_url}/${req.header('user')?._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
                cb(null, `${req.header('user')?._id}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`)
            },
            transform: function (req, file, cb) {
                logger.info('compress image successfully upload')
                cb(null, sharp().withMetadata().jpeg({ quality: 50 }))
            }
        }]
    })
})

export const uploadS3_icon_theme = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req: any, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: any, file, cb) {
            logger.info('file successfully upload')
            const file_type = file.originalname.split('.')
            req.body.location = `${bucket_url}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
            cb(
                null,
                `${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
            );
        },
    }),
});

export const uploadS3_contributor = multer({
    storage: multerS3({
        s3: s3,
        bucket: bucket_name,
        acl: 'public-read',
        contentType: multerS3.AUTO_CONTENT_TYPE,
        metadata: function (req: any, file, cb) {
            cb(null, { fieldName: file.fieldname });
        },
        key: function (req: any, file, cb) {
            logger.info('file successfully upload')
            const file_type = file.originalname.split('.')
            req.body.location = `${bucket_url}/${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
            cb(
                null,
                `${req.params.file}/${Date.now().toString()}.${file_type[file_type.length - 1]}`
            );
        },
    }),
});


export const image_compress_response = async (req, res) => {
    reqInfo(req)
    try {
        let file: any = req.file;
        return res.status(200).json({
            status: 200,
            message: "Image successfully uploaded",
            // data: { image: file?.transforms[0]?.location }
            data: { image: req.body.location }
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error', {}, error));
    }
}

export const delete_file = async (req: Request, res: Response) => {
    reqInfo(req)
    let { folder ,type , file , name} = req.params
    try {
        console.log(req.params , "request params");
        // console.log("data" , file , "folder" , folder , "type" , type);
        let message = await deleteImage(file, folder , type , name);
        return res.status(200).json(new apiResponse(200, `${message}`, {}, {}))
    } catch (error) {
        console.log(error)
        return res.status(500).json(new apiResponse(500, 'Internal Server Error ', {}, error));
    }
}

