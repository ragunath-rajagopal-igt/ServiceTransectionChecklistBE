const express = require("express");

const { getOperations, saveOperations, generateForm, updateOperations,  deleteOperations} = require("../controllers/operationsController");

const router = express.Router();   

router.post("/generate-form", generateForm);

router.get("/list",  getOperations);

router.get("/get",  getOperations);

router.post("/save",  saveOperations);

router.delete("/delete/:id",  deleteOperations);

router.post("/update", updateOperations);

module.exports = router;