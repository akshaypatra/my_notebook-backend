const express=require('express');
const router=express.Router();
const User=require('../models/User');

const { query, validationResult } = require('express-validator');

//Create a User using : POST "api/auth/" . Doesn't require Auth
router.post('/',[
    query('name','Enter a valid name').isLength({min:3}),
    // email must be an valid email
    query('email','Enter a valid email').isEmail(),
    // password must be at least 5 chars long
    query('password','password length should be more than 5').isLength({min:5})

],(req,res)=>{
// Finds the validation errors in this request and wraps them in an object with handy functions
    
    const result = validationResult(req);
    if (result.isEmpty()) {
        return res.status(400).json({ errors: result.array() });
    }
    // console.log(req.body);
    // const user=User(req.body);
    // user.save();
    
    User.create({
        name: req.body.name,
        email:req.body.email,
        password: req.body.password
    }).then(user => res.json(user)).catch(err=>{
        console.log(err),
        res.json({error:'Please enter a Unique Email',message:err.message})
    });
    
    
});

module.exports=router