// Display Catalog home page with count of each category and part
exports.index = (req, res) => {
  res.send('NOT IMPLEMENTED: Catalog home page');
}

// Display a list of all parts
exports.part_list = (req, res) => {
  res.send('NOT IMPLEMENTED: Part list');
}

// Display a detailed page of a part
exports.part_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Part detail GET on id ${req.params.id}`);
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