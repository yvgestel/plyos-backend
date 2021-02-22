const mongoose = require('mongoose');

const Exercise = require('../models/exercise');

const getCurrentDate = () => {
    const currentTime = new Date();
    const year = currentTime.getFullYear();
    let month = currentTime.getMonth()+1;
    if (month<10) month = "0" + month;
    let day = currentTime.getDate();
    if (day<10) day = "0" + day;
    const today = year+""+month+""+day;
    return today;
};

exports.exercise_get_all = (req, res, next) => {
    Exercise.find()
        .select("_id name exerciseImage tags markdown views")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                exercises: docs.map(doc => {
                    return {
                        _id: doc._id,
                        name: doc.name,
                        exerciseImage: doc.exerciseImage,
                        tags: doc.tags,
                        markdown: doc.markdown,
                        views: doc.views,
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
};

exports.exercise_create_exercise = (req, res, next) => {
    const today = getCurrentDate();
    const filePath = process.env.BASE_URL+req.file.path.replace("\\","/")
    const exercise = new Exercise({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        exerciseImage: filePath,
        tags: req.body.tags,
        dateCreated: today,
        markdown: req.body.markdown,
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
};

exports.exercise_get_exercise = (req, res, next) => {
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
};

exports.exercise_update_exercise = (req, res, next) => {
    const id = req.params.exerciseId;
    Exercise.updateMany({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Exercise updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/exercise/" + id
          }
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
};

exports.exercise_delete_exercise = (req, res, next) => {
    const id = req.params.exerciseId;
    Exercise.deleteOne({ _id: id})
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Exercise deleted',
            })
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
};

exports.exercise_get_latest_exercises = (req, res, next) => {
    Exercise.find()
    .sort({dateCreated: -1})
    .limit(10)
    .select("_id name exerciseImage tags markdown views")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            exercises: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    exerciseImage: doc.exerciseImage,
                    tags: doc.tags,
                    markdown: doc.markdown,
                    views: doc.views,
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
};

exports.exercise_get_most_viewed_exercises = (req, res, next) => {
    Exercise.find()
    .sort({views: -1})
    .limit(10)
    .select("_id name exerciseImage tags markdown views")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            exercises: docs.map(doc => {
                return {
                    _id: doc._id,
                    name: doc.name,
                    exerciseImage: doc.exerciseImage,
                    tags: doc.tags,
                    markdown: doc.markdown,
                    views: doc.views,
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
};