const express = require('express');
const router = express.Router();

// Controller imports
const categoryController = require('../controllers/categoryController');
const partController = require('../controllers/partController');

/// CATALOG ROUTES ///

// GET request for catalog home page //
router.get('/', partController.index);

/// CATeGORY ROUTES ///

// GET request for the creation of a category
router.get('/category/create', categoryController.category_create_get)

// POST request for the creation of a category
router.post('/category/create', categoryController.category_create_post);

// GET request for the update of a category
router.get('/category/:id/update', categoryController.category_update_get);

// POST request for the update of a category
router.post('/category/:id/update', categoryController.category_create_post);

// GET request for the deletion of a category
router.get('/category/:id/delete', categoryController.category_delete_get);

// POST request for the deletion of a category
router.post('/category/:id/delete', categoryController.category_delete_post);

// GET request for a detailed page of a category //
router.get('/category/:id', categoryController.category_detail);

// GET request for a list of all category //
router.get('/categories', categoryController.category_list);

/// PART ROUTES ///

// GET request for the creation of a part
router.get('/part/create', partController.part_create_get);

// POST request for the creation of a part
router.post('/part/create', partController.part_create_post);

// GET request for the update of a part
router.get('/part/:id/update', partController.part_update_get);

// POST request for the update of a part
router.post('/part/:id/update', partController.part_create_post);

// GET request for the deletion of a part
router.get('/part/:id/delete', partController.part_delete_get);

// POST request for the deletion of a part
router.post('/part/:id/delete', partController.part_delete_post);

// GET request for a detailed page of a part //
router.get('/part/:id', partController.part_detail);

// GET request for a list of all part //
router.get('/parts', partController.part_list);

module.exports = router;
