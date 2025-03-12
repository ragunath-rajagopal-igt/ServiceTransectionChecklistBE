const express = require("express");

const { getServiceManagement, saveServiceManagement, generateForm, updateServiceManagement,  deleteServiceManagement} = require("../controllers/serviceManagementController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getServiceManagement);

router.get("/get",  getServiceManagement);

router.post("/save",  saveServiceManagement);

router.delete("/delete/:id",  deleteServiceManagement);

router.post("/update", updateServiceManagement);

module.exports = router;