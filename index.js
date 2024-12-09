const express = require("express");
const app = express();
const PORT_NUMBER = 6000;

app.listen(PORT_NUMBER, () => {
  console.log(`Server is up and running on port number : ${PORT_NUMBER}`);
});
