const AWS = require('aws-sdk');
const s3Region = process.env.UPLOAD_BUCKET_REGION;
const s3Bucket = process.env.UPLOAD_BUCKET;
const uuid = require('uuid');


AWS.config.update({
  accessKeyId: process.env.UPLOAD_AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.UPLOAD_AWS_SECRET_ACCESS_KEY,
  region: s3Region,
});


const s3 = new AWS.S3({
	signatureVersion: 'v4',
	region: s3Region,
	accessKeyId: process.env.UPLOAD_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.UPLOAD_AWS_SECRET_ACCESS_KEY,
});


const getPublicUploadSign = async (key) => {
	const signedUrl = await s3.getSignedUrl('putObject', {
		Bucket: s3Bucket,
		Key: key,
		Expires: 1200,
		ACL: 'public-read',
	});
	const objectUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}`;
	return { signedUrl, objectUrl };
};


const uploadToS3PM = (path, filename, buffer, header) => new Promise((resolve, reject) => {
	s3.upload({
		Key: `${path}/${filename}`,
		Body: buffer,
		Bucket: s3Bucket,
		ContentType: header
	}, (err, data) => {
		if (err){console.log(err); reject(err);}
		resolve(data);
	});
});


const deleteFileFromS3=(key)=>new Promise((resolve,reject)=>{
	s3.deleteObject({
		Bucket: s3Bucket,
		Key: key
	  },function (err,data){
		if (err){console.log(err); reject(err);}
		resolve(data);
	  })
});


module.exports = {
    uploadToS3PM,
    getPublicUploadSign,
    s3,
	deleteFileFromS3,
}