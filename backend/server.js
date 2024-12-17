const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const cloudinary = require('./config/cloudinary');
const firestore = require('./config/firestore');

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.fields([{ name: 'photo' }, { name: 'video' }, { name: 'thumbnail' }]), async (req, res) => {
    try {
        const photoUrl = await cloudinary.upload(req.files['photo'][0].path);
        const videoUrl = await cloudinary.upload(req.files['video'][0].path);
        const thumbnailUrl = req.files['thumbnail'] 
            ? await cloudinary.upload(req.files['thumbnail'][0].path) 
            : null;

        const metadata = {
            photoUrl,
            videoUrl,
            thumbnailUrl,
        };

        await firestore.addMetadata(metadata);
        res.json(metadata);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error uploading files');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
