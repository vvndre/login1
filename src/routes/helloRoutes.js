let express = require("express");

let router = express.Router();

let authMiddleware = require("../middleware/auths");

//this is unprotected (does not require the client to be auth)
router.get("/hello", function (req, res) {
  res.json("Hello there!");
});

//this is protected (requires the client to be auth)
router.get("/handshake", authsMiddleware.checkJWT, function (req, res) {
  // get the jwt from the client, & make sure its valid

  let userId = req.userinfo.id;

  res.json("I see you comrade #{userId}!");
});

module.exports = router;
