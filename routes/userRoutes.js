const express = require("express");

// const validateToken = require("../middleware/validateTokenHandler");
// const vaidateOrganizationHandler = require('../middleware/vaidateOrganizationHandler');
const { getUsers, saveUser, generateForm, updateUser, deleteUser} = require("../controllers/userController");



const router = express.Router();

router.post("/generate-form", generateForm);

router.get("/list",  getUsers);

router.post("/save",  saveUser);

router.post("/update", updateUser);

router.delete("/delete/:id", deleteUser);



// router.post("/slocation",  validateToken, vaidateOrganizationHandler, subLocationuser);

// router.post("/igt-id-email-form",  validateToken, vaidateOrganizationHandler, generateIGTIdAndEmailForm);

// router.post("/igt-id-email-update",  validateToken, vaidateOrganizationHandler, updateIgtIdAndEmail);

// router.post("/update-status/:id", validateToken, vaidateOrganizationHandler, updateUserStatus);

module.exports = router;