const express = require("express");

const {  generateForm, saveSeveritiy, getSeveritiy, updateSeveritiy , deleteSeverity } = require("../controllers/adminControl/severityControl");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getSeveritiy);

router.post("/save",  saveSeveritiy);

router.post("/update", updateSeveritiy);

router.delete("/delete/:id",  deleteSeverity);

module.exports = router;