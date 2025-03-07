const express = require("express");

const { getDataManagement, saveDataManagement, generateForm, updateDataManagement,  deleteDataManagement} = require("../controllers/dataManagementController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getDataManagement);

router.get("/get",  getDataManagement);

router.post("/save",  saveDataManagement);

router.delete("/delete/:id",  deleteDataManagement);

router.post("/update", updateDataManagement);

module.exports = router;