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

const ExerciseController = require ('../controllers/exercise');

router.get('/', ExerciseController.exercise_get_all);

router.post('/', upload.single('exerciseImage'), ExerciseController.exercise_create_exercise);

router.get('/latest', ExerciseController.exercise_get_latest_exercises);

router.get('/most-watched', ExerciseController.exercise_get_most_viewed_exercises);

router.get('/:exerciseId', ExerciseController.exercise_get_exercise);

router.delete('/:exerciseId', ExerciseController.exercise_delete_exercise);

router.patch('/:exerciseId', ExerciseController.exercise_update_exercise);

module.exports = router; 