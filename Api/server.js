const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const AuthRoute=require("./Routes/AuthRoutes")

//create connection with mongo db 
const connect = async () => {
    try {
      mongoose.connect(process.env.MONGO);
      console.log("connected to mongo db");
    } catch (error) {
      console.error(error);
    }
  };
//
app.use(express.json())
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.listen(8000, () => {
    connect();
    console.log("backend server is running  at port 8000");
  });

app.use('/api/auth',AuthRoute)