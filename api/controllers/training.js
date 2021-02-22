const mongoose = require('mongoose');

const Training = require("../models/training");

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

exports.training_get_all = (req, res, next) => {
    Training.find({user: req.params.user})
    .select("_id name exercises lastChanged")
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            exercises: docs.map(doc => {
                console.log(doc)
                return {
                      _id: doc._id,
                      name: doc.name,
                      exercises: doc.exercises,
                      lastChanged: doc.lastChanged  
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

exports.training_create_training = (req, res, next) => {
    const today = getCurrentDate();
    const training = new Training({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        exercises: [],
        lastChanged: today,
        user: req.body.user
    });
    training
        .save()
        .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requests to /training',
            createdTraining: result
        });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.training_get_training = (req, res, next) => {

};

exports.training_update_training = (req, res, next) => {
    const id = req.params.trainingId;
    Training.updateMany({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Training updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/training/" + id
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

exports.training_delete_training = (req, res, next) => {
    const id = req.params.trainingId;
    Training.deleteOne({ _id: id})
        .exec()
        .then( result => {
            res.status(200).json({
                message: 'Training deleted',
            })
        })
        .catch( err => {
            console.log(err)
            res.status(500).json({
                error: err
            });
        });
};