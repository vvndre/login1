let express = require("express");
let PORT = process.env.PORT || 9012;

require("dotenv").config();

let app = express();

app.use(express.json());

let authRoutes = require("./routes/authRoutes");
app.use(authRoutes);

// let todoRoutes = require("");
// app.use(todoRoutes);

app.listen(PORT, function () {
  console.log("Application listening on port ", PORT);
});
