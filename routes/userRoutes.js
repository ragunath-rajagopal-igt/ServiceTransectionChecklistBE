const express = require("express");

const validateToken = require("../middleware/validateTokenHandler");
const vaidateOrganizationHandler = require('../middleware/vaidateOrganizationHandler');
const { createUser,getUsers, saveUser, generateForm, updateUser, subLocationuser, deleteNewUser, generateIGTIdAndEmailForm, updateIgtIdAndEmail, updateUserStatus} = require("../controllers/userController");



const router = express.Router();


router.post("/generate-form", validateToken, vaidateOrganizationHandler, generateForm);

router.get("/list", validateToken, vaidateOrganizationHandler, getUsers);

router.get("/get", validateToken, vaidateOrganizationHandler, getUsers);

router.post("/save", validateToken, vaidateOrganizationHandler,  saveUser);

router.delete("/delete/:id",  validateToken, vaidateOrganizationHandler, deleteNewUser);

router.post("/updateuser",  validateToken, vaidateOrganizationHandler, updateUser);

router.post("/slocation",  validateToken, vaidateOrganizationHandler, subLocationuser);

router.post("/igt-id-email-form",  validateToken, vaidateOrganizationHandler, generateIGTIdAndEmailForm);

router.post("/igt-id-email-update",  validateToken, vaidateOrganizationHandler, updateIgtIdAndEmail);

router.post("/update-status/:id", validateToken, vaidateOrganizationHandler, updateUserStatus);

module.exports = router;