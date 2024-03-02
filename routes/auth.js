const express=require('express');
const router=express.Router();

router.get('/',(req,res)=>{
    obj={
        a:'ak',
        number:34
    }
    res.json(obj)
})

module.exports=router