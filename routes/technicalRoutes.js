const express = require("express");

const { getTechnical, saveTechnical, generateForm, updateTechnical,  deleteTechnical} = require("../controllers/technicalController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getTechnical);

router.get("/get",  getTechnical);

router.post("/save",  saveTechnical);

router.delete("/delete/:id",  deleteTechnical);

router.post("/update", updateTechnical);

module.exports = router;