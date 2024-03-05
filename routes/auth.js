const express=require('express');
const router=express.Router();
const User=require('../models/User');
const bcrypt = require('bcryptjs');
const { query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');



//jwt secret
const JWT_secret="akshayJwtSectret";

//Create a User using : POST "api/auth/createuser" . No loginm required
router.post('/createuser',[
    query('name','Enter a valid name').isLength({min:3}),
    // email must be an valid email
    query('email','Enter a valid email').isEmail(),
    // password must be at least 5 chars long
    query('password','password length should be more than 5').isLength({min:5})

],async(req,res)=>{
// Finds the validation errors in this request and wraps them in an object with handy functions
    

//if there are errors return bad error and the errors
    const result = validationResult(req);
    //here ! is missing below
    if (result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    // console.log(req.body);
    // const user=User(req.body);
    // user.save();
    
    try {
        

    //check whether the user with this email exists already
    let user=await User.findOne({email:req.body.email});
    
    if(user){
        return res.status(400).json({error:"Sorry a user with this email already exist"})
    }

    const salt=await bcrypt.genSalt(10);
    const secPass =await bcrypt.hash(req.body.password,salt);

    //Create new user
    user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: secPass
    })
    

    const data={
        user:{
            id:user.id
        }
    }

    //creating a token to give it to the user
    const authToken=jwt.sign(data,JWT_secret);
    // console.log(token);

    // res.json(user);
    res.json({authToken});

    //catch error if something happens
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some error Occured")
    }
    
});

module.exports=router