const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();

router.route("/signup")
    .get(authController.signup_get)
    .post(authController.signup_post);
// router.get("/signup", signup_get);
// router.post("/signup", signup_post);
router.get("/login", authController.login_get);
router.post("/login", authController.login_post);
router.get("/logout", authController.logout_get);

module.exports = router;
