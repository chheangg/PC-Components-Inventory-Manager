// Display a list of all categories
exports.category_list = (req, res) => {
  res.send('NOT IMPLEMENTED: category list GET');
}

// Display a detailed page of a category
exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: category detail GET on id ${req.params.id}`);
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