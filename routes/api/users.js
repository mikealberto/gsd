const express = require("express");
const router = express.Router();
const usersCtrl = require("../../controllers/api/users");
const ensureLoggedIn = require("../../config/ensureLoggedIn");

router.post("/", usersCtrl.create);
router.post("/login", usersCtrl.login);
// check token should on.y be reaached if you are logged in 
router.get("/check-token", ensureLoggedIn, usersCtrl.checkToken);

module.exports = router;