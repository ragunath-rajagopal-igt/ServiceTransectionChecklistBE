const express = require("express");

const {  generateForm, saveSite, getSite, updateSite, deleteSite } = require("../controllers/adminControl/siteController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getSite);

router.post("/save",  saveSite);

router.post("/update", updateSite);

router.delete("/delete/:id",  deleteSite);

module.exports = router;