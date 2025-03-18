const express = require("express");

const {  generateForm, saveStatus, getStatus, updateStatus , deleteStatus } = require("../controllers/adminControl/statusController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getStatus);

router.post("/save",  saveStatus);

router.post("/update", updateStatus);

router.delete("/delete/:id",  deleteStatus);

module.exports = router;