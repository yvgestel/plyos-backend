const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const TrainingController = require('../controllers/training');

router.get("/", checkAuth, TrainingController.training_get_all);

router.post("/", checkAuth, TrainingController.training_create_training) ;

router.get("/:trainingId", checkAuth, TrainingController.training_get_training);

router.patch("/:trainingId", checkAuth, TrainingController.training_update_training);

router.delete("/:trainingId", checkAuth, TrainingController.training_delete_training);

module.exports = router;