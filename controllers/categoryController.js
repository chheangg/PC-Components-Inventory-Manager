const async = require('async');

// Models
const Category = require('../models/category');
const Part = require('../models/part');

// Display a list of all categories
exports.category_list = (req, res) => {
  Category.find()
    .sort({name: 1})
    .exec((err, list_category) => {
      if (err) {
        next(err);
      }

      res.render('category_list', {title: 'Computer Part Category list', category_list: list_category})
    })
}

// Display a detailed page of a category
exports.category_detail = (req, res) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      parts(callback) {
        Part.find({category: req.params.id}).exec(callback);
      }
    },
    (err, results) => {
      if (err) {
        next(err);
      }
      if (results === null) {
        const err = new Error('Category not found')
        err.status = 404;
        next(err);
      }
      res.render('category_detail', {title: results.category.name, category: results.category, parts: results.parts});
    }
  )
}

// Display a creation form page of a catagory
exports.category_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: category create GET');
}

// Handle the creation of a catagory
exports.category_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: category create POST');
}

// Display a updating form page of a category
exports.category_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: category update GET on id ${req.params.id}`);
}

// Handle the update of a catagory
exports.category_update_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: category update POST on id ${req.params.id}`);
}

// Display a deletion form page of a catagory
exports.category_delete_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: category delete GET on id ${req.params.id}`)
}

// Handle the deletion of a catagory
exports.category_delete_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: category delete POST on id ${req.params.id}`)
}