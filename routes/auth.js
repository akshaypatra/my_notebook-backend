const express=require('express');
const router=express.Router();
const User=require('../models/User');

const { query, validationResult } = require('express-validator');

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
    user=await User.create({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    })
    
    // .then(user => res.json(user)).catch(err=>{
    //     console.log(err),
    //     res.json({error:'Please enter a Unique Email',message:err.message})
    // });
    res.json(user);

    //catch error if something happens
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Somne error Occured")
    }
    
});

module.exports=router