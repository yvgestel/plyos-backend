const mongoose = require('mongoose');

const Blog = require('../models/blog');

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

exports.blog_get_all = (req, res, next) => {
    Blog.find()
        .select("_id title blogImage markdown date")
        .exec()
        .then(docs => {
            const response = {
                count: docs.length,
                exercises: docs.map(doc => {
                    return {
                        _id: doc._id,
                        title: doc.title,
                        blogImage: doc.blogImage,
                        markdown: doc.markdown,
                        date: doc.date,
                        request: {
                            type: "GET",
                            url: "http://localhost:3000/blog/" + doc._id
                        }
                    };
                })
            }
            res.status(200).json(docs);
        })
        .catch(err => {
            console.log(err);
        });
            
};

exports.blog_get_blog = (req, res, next) => {
    const id = req.params.blogId;
    Blog.findById(id)
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

exports.blog_create_blog = (req, res, next) => {
    const today = getCurrentDate();
    const filePath = process.env.BASE_URL+req.file.path.replace("\\","/")
    const blog = new Blog({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        blogImage: filePath,
        date: today,
        markdown: req.body.markdown,
    });
    blog
        .save()
        .then(result => {
        console.log(result);
        res.status(200).json({
            message: 'Handling POST requests to /blog',
            createdBlog: result
        });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
};

exports.blog_update_blog = (req, res, next) => {
    const id = req.params.blogId;
    Blog.updateMany({ _id: id }, { $set: req.body })
      .exec()
      .then(result => {
        res.status(200).json({
          message: "Blog updated",
          request: {
            type: "GET",
            url: "http://localhost:3000/blog/" + id
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

exports.blog_delete_blog = (req, res, next) => {
    const id = req.params.blogId;
    Blog.deleteOne({ _id: id})
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