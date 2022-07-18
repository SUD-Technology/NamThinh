let admin = require("firebase-admin");

let serviceAccount = require("../../config/namthinh-69ec0-firebase-adminsdk-1de5t-82a7c4cd8a.json");

const BUCKET_URL = "namthinh-69ec0.appspot.com"

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET_URL,
});

const bucket = admin.storage().bucket();

const uploadImage = (req, res, next) => {
    if(!req.files) {
        return next();
    }

    const images = req.files;
    images.forEach( (image, index) => {
        const filename = Date.now() + '.' + image.originalname.split('.').pop();
        
        const file = bucket.file(filename);
        
        const stream = file.createWriteStream({
            metadata: {
                contentType: image.mimetype,
            },
        });

        req.files[index].firebaseUrl = `https://storage.googleapis.com/${BUCKET_URL}/${filename}`;

        stream.on('error', (e) => {
            console.log(e);
        })

        stream.on('finish', async () => {
            await file.makePublic();
            
            next();
        })

        stream.end(image.buffer);
    })
    
};

module.exports = uploadImage;