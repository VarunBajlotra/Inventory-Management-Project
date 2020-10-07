const route = require('express').Router()
const Users = require('../databases/users').Users

route.get('/',(req,res)=>{
    res.render('../public/consumer/index')
})

route.post('/',(req,res)=>{
    console.log(req.body.username+" "+req.body.password+" "+req.body.email)
    Users.create({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email
    }).then(()=>{
        res.redirect('/login-user')
    }).catch((err)=>{
        console.log(err)
        // alert("Username already exists!! Choose a different username!!")
        res.redirect('/signup-user')
    })
})

module.exports={
    route
}