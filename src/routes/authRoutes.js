let express = require ("express");

let router = express.Router();

let controller = require("../controllers/authController");

router.post("/register", controller.registerUser);

router.post("/login", controller.loginUser);

// let helloRoutes = require("../routes/helloRoutes")
// app.use(helloRoutes);

module.exports = router;