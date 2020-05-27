const express = require("express");
const router = express.Router();
const materialController = require("../Controllers/materialController.js");
const md_authen = require("../Middlewares/Authenticator.js");

router.post("/",  materialController.save);
router.delete("/",  materialController.delete);
router.post("/update",  materialController.update);

router.get("/all",  materialController.getAll);
router.get("/get",  materialController.getMatID);

module.exports = router;