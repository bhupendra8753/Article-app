const express = require('express');
const router = express.Router();
const multer = require("multer");

//import article controller so that we can pass the route to right controller
const articles = require('./../controllers/articleController');

//create file mime type object which check the upload file mime type
const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

//we use multer library to handle the
//all file upload in the backend
//here we check the upload file type and validate it and 
//give it a unique name to store in the database 
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'images/');
  },
  filename: function(req, file, cb) {
    const name = file.originalname
    cb(null, new Date().toISOString().replace(/[\/\\:]/g, "_") + name);
  }
});



//get all articles
router.get('/',articles.findAllArticles);

//get single article by id
router.get('/:articleid',articles.findSingleArticle);

//add new article
router.post('/', multer({ storage: storage }).single("image"),articles.addArticles);

//update single article by id
router.put('/:articleid', multer({ storage: storage }).single("image"),articles.updateSingleArticle);

module.exports = router;