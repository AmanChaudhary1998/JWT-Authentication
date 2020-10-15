const express = require("express");
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const router = express.Router();
const config = require('config')
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const auth=require("../../middleware/auth");
const User = require("../../models/User");


router.get("/",auth, async (req, res) => {
  try{
    const user= await User.findById(req.user.id).select('-password');
    res.json(user);
  }catch(err){
    console.log(err.message);
    res.status(500).send('Server Error');
  }
});

router.get("/register",(req,res)=>{
  res.render('register');
})

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please enter the valid email").isEmail(),
    check(
      "password",
      "Please enter the password with 6 or more character"
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password } = req.body;
    const {image} = req.files;
    try {
      // See if the user exists
      
      let user = await User.findOne({ email });

      if (user) {
        return res.status(400).json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        image,
        password
      });

      await user.save()
      // Return jsonwebtoken

      const payload= {
        user: {
          id : user.id
        }
      }

      jwt.sign(payload, config.get('jwtSecret'),{expiresIn: 36000}, (err,token)=>{
        if(err){
          console.log(err)
        }else{
          res.json({token})
        }
      })
      //res.send("User Registered");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server error");
    }
  }
);
module.exports = router;
