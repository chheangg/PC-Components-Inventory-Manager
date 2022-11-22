const async = require('async');

// Models
const Part = require('../models/part');
const Category = require('../models/category');

// Display Catalog home page with count of each category and part

// Promise-based style
// exports.index = async (req, res) => {
//   const partsCount = await Part.countDocuments();
//   const categoriesCount = await Category.countDocuments();
//   const data = { part_count: partsCount, category_count: categoriesCount };
//   res.render('layout', {title: 'PC Component Inventory', data});
// }

// Async module style
// Better error handling for the side note :PP
exports.index = (req, res) => {
  async.parallel(
    {
      part_count(callback) {
        Part.countDocuments({}, callback);
      },
      category_count(callback) {
        Category.countDocuments({}, callback);
      }
    },
    (err, results) => {
      if (err) {
        next(err);
      }

      res.render('layout', {title: 'PC Component Inventory', data: results})
    }
  )
}

// Display a list of all parts
exports.part_list = (req, res) => {
  Part.find({})
    .populate('category')
    .sort({category: 1})
    .exec((err,  list_parts) => {
      if (err) {
        next(err);
      }
      res.render('part_list', {title: 'Computer part lists', part_list: list_parts});
    })
}

// Display a detailed page of a part
exports.part_detail = (req, res) => {
  Part.findById(req.params.id)
    .populate('category')
    .exec((err, part) => {
      if (err) {
        next(err);
      }
      res.render('part_detail', {title: part.name, part})
    })
}

// Display a creation form page of a part
exports.part_create_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Part create GET');
}

// Handle the creation of a part
exports.part_create_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Part create POST');
}

// Display a updating form page of a part
exports.part_update_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Part update GET on id ${req.params.id}`);
}

// Handle the update of a part
exports.part_update_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: Part update POST on id ${req.params.id}`);
}

// Display a deletion form page of a part
exports.part_delete_get = (req, res) => {
  res.send(`NOT IMPLEMENTED: Part delete GET on id ${req.params.id}`)
}

// Handle the deletion of a part
exports.part_delete_post = (req, res) => {
  res.send(`NOT IMPLEMENTED: Part delete POST on id ${req.params.id}`)
}