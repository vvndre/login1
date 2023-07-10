let db = require("../model/db");

let argon = require("argon2");

let jwt = require("jsonwebtoken");

//accept user & pw
//store email & hash
let registerUser = async function (req, res) {
  //get email and pw from req
  let email = req.body.email;
  let password = req.body.password;

  //make sure the email is truthy
  if (!email) {
    res.status(400).json("Email is required");
    return;
  }

  //convert pw to hash
  let hash;
  try {
    hash = await argon.hash(password);
  } catch (err) {
    //if for some reason the conversion fails,
    // log the error and response w a 500 code
    console.log("Failed to hash password", err);
    res.sendStatus(500);
    return;
  }

  //i have hash & email
  let sql = "insert into todo_users (email, hash) values (?, ?)";
  let params = [email, hash];

  db.query(sql, params, function (err, results) {
    if (err) {
      console.log("Failed to register user", err);
      res.sendStatus(500);
    } else {
      res.sendStatus(204);
    }
  });
};

let loginUser = function (req, res) {
  //1. get the email & pw from req
  //2. generate the hash from pw
  //3. fetch the stored hash for the email from the database
  //4. if the user existing the database check the stored hash against the generated hash to decide if the login failed or not
  //5. if the user does not exist, fail login

  let email = req.body.email;
  let password = req.body.password;

  let sql = "select id, hash from todo_users where email = ?";
  let params = [email];

  db.query(sql, params, async function (err, results) {
    let storedHash;
    let storedId;
    if (err) {
      console.log("Failed to fetch hash for user", err);
    } else if (results.length > 1) {
      console.log("Returned more than 1 user for the email", email);
    } else if (results.length == 1) {
      storedHash = results[0].hash;
      storedId = results[0].id;
    } else if (results.length == 0) {
      console.log("Did not find a user for email", email);
    }

    try {
      let pass = await argon.verify(storedHash, password);
      if (pass) {
        // (new) we will generate a token and send it back
        let token = {
          id: storedId,
          email: email,
        };

        //token is good for 24hrs 86400 seconds
        let signedToken = jwt.sign(token, process.env.JWT_SECRET, {
          expiresIn: 86400
        });
        res.json(signedToken);
      } else {
        res.sendStatus(401);
      }
    } catch (err) {
      console.log("Failed when verifying the hash", err);
      res.sendStatus(401);
    }
  });
};

module.exports = {
  registerUser,
  loginUser,
};
