const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads');
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
};

const upload = multer(
    {
    storage: storage, 
    limits:{
        fieldSize: 1024 * 1024 * 15
    },
    fileFilter: fileFilter
});

const BlogController = require('../controllers/blog');

router.post('/', upload.single('blogImage'), BlogController.blog_create_blog);

router.get('/', BlogController.blog_get_all);

router.get('/:blogId', BlogController.blog_get_blog);

router.patch('/:blogId', BlogController.blog_update_blog);

router.delete('/:blogId', BlogController.blog_delete_blog);

module.exports = router;