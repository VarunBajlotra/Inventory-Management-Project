const route = require('express').Router()
const {Users,Products,Transactions} = require('../db')
const passport = require('passport')

route.get('/login',(req,res)=>{
    console.log('In admin login')
    res.render('../public/admin/login')
})

route.post('/login',
    passport.authenticate('local',{
        successRedirect:'/admin/profile',
        failureRedirect:'/admin/login'
    })
    ,function(req,res){
        console.log("Logging In User: ")
        console.log(req.user)
        return res.redirect('/')
    }
)

route.get('/profile',(req,res)=>{
    console.log('In profile')
    products = []
    users = []
    transactions = []
    if(!req.user){
        return res.redirect('/admin/login')
    }
    Products.findAll({
        where:{
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            products.push(entries[i].dataValues)
        }
    })
    Users.findAll({
        where:{
            type:"Consumer"
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            users.push(entries[i].dataValues)
        }
    })
    Transactions.findAll({
        where:{
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            transactions.push(entries[i].dataValues)
        }
    })
    
    setTimeout(()=>{
        res.render('../public/admin/profile',{
            products,users,transactions
        })
    },1000)
})

route.post('/profile',(req,res)=>{
    console.log('In profile post')
    if(!req.user){
        return res.redirect('/admin/login')
    }
    res.render('../public/admin/profile',{
        user:req.user
    })
})

route.get('/logout',function(req,res){
    console.log("Logging Out " + req.user.username);
    req.logout();
    res.redirect('/')
});

module.exports={
    route
}