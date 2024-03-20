const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const token= req.cookies.acessToken;
   if (!token) {
     return res
       .status(401)
       .json({ message: "Login to create a community " });
   }
 
   try {
     const decoded = jwt.verify(token,  process.env.JWT_SECRET);
     req.userId = decoded.user.id;
     next();
   } catch (error) {
     return res.status(401).json({ message: "Unauthorized token." });
   }
 };
 
 module.exports = verifyToken;