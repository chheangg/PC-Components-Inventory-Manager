const async = require('async');
const { body, validationResult } = require('express-validator')

// Models
const Category = require('../models/category');
const Part = require('../models/part');

// Display a list of all categories
exports.category_list = (req, res, next) => {
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
exports.category_detail = (req, res, next) => {
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
  res.render('category_form', {title: 'Create Category'});
}

// Handle the creation of a catagory
exports.category_create_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'Description must not be empty or too short')
    .trim()
    .isLength({min: 3})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req)

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
    })

    if (!errors.isEmpty()) {
      res.render('category_form', {title: 'Create Category', category, errors: errors.array()});
    }

    category.save((err) => {
      if (err) {
        next(err);
      }
      res.redirect(category.url);
    })
  }
]

// Display a updating form page of a category
exports.category_update_get = (req, res, err) => {
  Category.findById(req.params.id).exec((err, category) => {
    if (err) {
      return err;
    }

    res.render('category_form', {title: 'Update Category', category, pass: true});
  })
}

// Handle the update of a catagory
exports.category_update_post = [
  body('name', 'Name must not be empty')
    .trim()
    .isLength({min: 1})
    .escape(),
  body('description', 'Description must not be empty or too short')
    .trim()
    .isLength({min: 3})
    .escape(),
  body('secret_pass', 'Secret pass is needed')
    .trim()
    .isLength({min: 1})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const category = {
      name: req.body.name,
      description: req.body.description,
      _id: req.params.id,
    };

    if (req.body.secret_pass !== process.env.SECRET_PASS) {
      res.render('category_form', {title: 'Create Category', category, pass: true, warning: 'Wrong password, not enough permission'});
      return;
    }

    if (!errors.isEmpty()) {
      res.render('category_form', {title: 'Create Category', category, pass: true, errors: errors.array()});
      return;
    }

    Category.findByIdAndUpdate(req.params.id, category, {} ,(err, updatedCategory) => {
      if (err) {
        next(err);
      }
      console.log('hello');
      res.redirect(updatedCategory.url);
    })
    
  }
]

// Display a deletion form page of a catagory
exports.category_delete_get = (req, res) => {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    parts(callback) {
      Part.find({category: req.params.id}).populate().exec(callback);
    }
  },
  (err, results) => {
    if (err) {
      next(err);
    }

    if (results.category === null || results === null) {
      res.redirect('/catalog/categories');
    }
    res.render('category_delete', {title: `Delete Category ${results.category.name}`, category: results.category, parts: results.parts});
  })
}

// Handle the deletion of a catagory
exports.category_delete_post = (req, res) => {
  async.parallel({
    category(callback) {
      Category.findById(req.params.id).exec(callback);
    },
    parts(callback) {
      Part.find({category: req.params.id}).populate().exec(callback);
    }
  },
  (err, results) => {
    if (err) {
      next(err);
    }

    if (req.body.secret_pass !== process.env.SECRET_PASS) {
      res.render('category_delete', {title: `Delete Category ${results.category.name}`, category: results.category, parts: results.parts, warning: 'Wrong password, not enough permission'});
    }

    if (results.parts.length > 0) {
      res.render('category_delete', {title: `Delete Category ${results.category.name}`, category: results.category, parts: results.parts});
    }

    Category.findByIdAndDelete(req.body.categoryid, (err) => {
      if (err) {
        next(err);
      }
      console.log('hey')
      res.redirect('/catalog/categories');
    })
  })
}