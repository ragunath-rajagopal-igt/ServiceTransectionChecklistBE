const express = require("express");

const { getGenDocmentList} = require("../controllers/genDocumentController");

const router = express.Router();   

router.get("/list",  getGenDocmentList);

module.exports = router;