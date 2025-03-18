const express = require("express");

const {  generateForm, saveOwner, getOwner, updateOwner , deleteOwner } = require("../controllers/adminControl/ownerController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getOwner);

router.post("/save",  saveOwner);

router.post("/update", updateOwner);

router.delete("/delete/:id",  deleteOwner);

module.exports = router;