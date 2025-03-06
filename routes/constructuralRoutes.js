const express = require("express");

const { getConstructural, saveConstructural, generateForm, updateConstructural,  deleteConstructural} = require("../controllers/constructuralController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getConstructural);

router.get("/get",  getConstructural);

router.post("/save",  saveConstructural);

router.delete("/delete/:id",  deleteConstructural);

router.post("/update", updateConstructural);

module.exports = router;