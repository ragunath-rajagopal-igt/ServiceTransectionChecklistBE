const express = require("express");

const {  generateForm , saveSubarea, getSubarea, updateSubarea, deleteSubarea} = require("../controllers/adminControl/subAreaControl");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getSubarea);

router.post("/save",  saveSubarea);

router.post("/update", updateSubarea);

router.delete("/delete/:id",  deleteSubarea);

module.exports = router;