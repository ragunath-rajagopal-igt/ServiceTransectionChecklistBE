const express = require("express");

const {  generateForm, saveProductName, getProductName, updateProductName , deleteProductName } = require("../controllers/adminControl/productNameController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getProductName);

router.post("/save",  saveProductName);

router.post("/update", updateProductName);

router.delete("/delete/:id",  deleteProductName);

module.exports = router;