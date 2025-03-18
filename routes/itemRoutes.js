const express = require("express");

const {  generateForm, saveItem, getItem, updateItem , deleteItem } = require("../controllers/adminControl/itemController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getItem);

router.post("/save",  saveItem);

router.post("/update", updateItem);

router.delete("/delete/:id",  deleteItem);

module.exports = router;