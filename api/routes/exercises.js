const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.filename);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage, 
    limits:{
        fieldSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

const Exercise = require('../models/exercise');

router.get('/', (req, res, next) => {
    Exercise.find()
        .select("_id name exercisesImage")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                exercises: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        exerciseImage: doc.exerciseImage,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/exercises/" + doc._id
                        }
                    };
                })
            }
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        })
});

router.post('/', upload.single('exerciseImage'), (req, res, next) => {
    const exercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        exerciseImage: req.file.path
    });
    exercise
        .save()
        .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requests to /exercises',
            createdExercise: result
        });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
});

router.get('/:exerciseId', (req, res, next) => {
    const id = req.params.exerciseId;
    Exercise.findById(id)
        .exec()
        .then(doc => {
            console.log(doc);
            if (doc) {
                res.status(200).json(doc);
            } else {
                res.status(404).json({message: 'No valid entry found for provided ID'});
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

module.exports = router; 