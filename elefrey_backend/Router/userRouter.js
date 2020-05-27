const express = require("express");
const router = express.Router();
const userController = require("../Controllers/userController.js");
const md_authen = require("../Middlewares/Authenticator.js");

router.post("/",  userController.save);
router.delete("/",  userController.delete);
router.post("/update",  userController.update);
router.post("/login",  userController.logIn);

router.get("/all",  userController.getAll);
router.get("/get",  userController.getUserID);

module.exports = router;