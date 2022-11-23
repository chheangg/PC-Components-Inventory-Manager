const async = require('async');
const { body, validationResult } = require('express-validator')
const multer = require('multer');
const path = require('path');
const fs = require('fs')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './public/data/uploads')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  }
})

const upload = multer({storage: storage});


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
exports.index = (req, res, next) => {
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
exports.part_list = (req, res, next) => {
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
exports.part_detail = (req, res, next) => {
  Part.findById(req.params.id)
    .populate('category')
    .exec((err, part) => {
      if (err) {
        next(err);
      }

      if (part === null) {
        const err = new Error('Computer Part not found')
        err.status(404);
        next(err);
      }
      res.render('part_detail', {title: part.name, part})
    })
}

// Display a creation form page of a part
exports.part_create_get = (req, res, next) => {
  Category.find().exec((err, categories) => {
    if (err) {
      next(err);
    }

    res.render('part_form', {title: 'Create Part', categories})
  })
}

// Handle the creation of a part
exports.part_create_post = [
  upload.single('img'),
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty or too short')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('quantity', 'Quantity must not be empty')
    .trim()
    .isLength({ min: 1})
    .escape(),
    (req, res, next) => {
      const errors = validationResult(req);

      const part = new Part({
        name: req.body.name,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        quantity: req.body.quantity,
        img: req.file ? req.file.path : '', 
      })
      if (!errors.isEmpty()) {
        Category
          .find()
          .exec((err, categories) => {
            if (err) {
              next(err);
            }
            res.render('part_form', {title: 'Create Part', categories, part, errors: errors.array()})
          })
        return;
      }
      
      part.save((err) => {
        if (err) {
          next(err);
        }
        res.redirect(part.url);
      })
    }
]

// Display a updating form page of a part
exports.part_update_get = (req, res, err) => {
  async.parallel({
    part(callback) {
      Part.findById(req.params.id).populate('category').exec(callback);  
    },
    categories(callback) {
      Category.find().exec(callback);
    },
  }, (err, results) => {
    if (err) {
      next(err);
    }

    if (results.part === null) {
      res.redirect('/catalog/parts')
    }

    res.render('part_form', {title: 'Update Part', categories: results.categories, part: results.part, pass: true})
  })
}

// Handle the update of a part
exports.part_update_post = [
  upload.single('img'),
  body('name', 'Name must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('description', 'Description must not be empty or too short')
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body('category', 'Category must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('price', 'Price must not be empty')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('quantity', 'Quantity must not be empty')
    .trim()
    .isLength({ min: 1})
    .escape(),
  body('secret_pass', 'Secret pass is needed')
    .trim()
    .isLength({min: 1})
    .escape(),
  (req, res, next) => {
    const errors = validationResult(req);

    const part = {
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      category: req.body.category,
      price: req.body.price,
      quantity: req.body.quantity,
      img: req.file ? req.file.path : '',
    }
    
    if (req.body.secret_pass !== process.env.SECRET_PASS) {
      Category.find().exec((err, categories) => {
        if (err) {
          next(err);
        }

        res.render('part_form', {title: 'Update Part', categories: categories , part: part, pass: true, warning: 'Wrong password, not enough permission'})
      })
      return;
    }

    if (!errors.isEmpty()) {
      Category.find().exec((err, categories) => {
        if (err) {
          next(err);
        }
        res.render('part_form', {title: 'Update Part', categories: categories , part: part, pass: true, errors: errors.array()})
      })
    }

    Part.findByIdAndUpdate(req.params.id, part, {returnOriginal: true}, (err, oldPart) => {
      if (err) {
        next(err);
      }

      if (oldPart.img) {
        fs.unlink('./' + oldPart.img, (err) => {
          if (err) {
            next(err);
          }
          res.redirect(oldPart.url);
        })  
      } else {
        res.redirect(oldPart.url);
      }
    })
  }
]

// Display a deletion form page of a part
exports.part_delete_get = (req, res, err) => {
  Part
  .findById(req.params.id)
  .populate('category')
  .exec((err, part) => {
    if (err) {
      next(err);
    }

    if (part === null) {
      res.redirect('/catalog/parts');
    }

    res.render('part_delete', {title: `Delete Part ${part.name}`, part});
  })
}

// Handle the deletion of a part
exports.part_delete_post = (req, res, next) => {
  if (req.body.secret_pass !== process.env.SECRET_PASS) {
    Part.findById(req.params.id).populate('category').exec((err, part) => {
      if (err) {
        next(err);
      }

      res.render('part_delete', {title: `Delete Part ${part.name}`, part, warning: 'Wrong password, not enough permission'});
    })
    return;
  }
  Part.findByIdAndDelete(req.body.partid, {returnOriginal: true}, (err, oldPart) => {
    if (err) {
      next(err);
    }

    if (oldPart.img) {
      fs.unlink('./' + oldPart.img, (err) => {
        if (err) {
          next(err);
        }
        res.redirect('/catalog/parts');
      })  
    } else {
      res.redirect('/catalog/parts');
    }
  })
}