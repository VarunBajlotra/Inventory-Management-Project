const route = require('express').Router()
const passport = require('passport')
// const { Transaction } = require('sequelize/types')
const {Users,Products,Transactions} = require('../db')

route.get('/signup',(req,res)=>{
    res.render('../public/consumer/login-signup')
})

route.post('/signup',(req,res)=>{
    console.log(req.body.username+" "+req.body.password+" "+req.body.email)
    Users.create({
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        type:"Consumer"
    }).then(()=>{
        res.redirect('/user/login')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/user/signup')
    })
})

route.get('/login',(req,res)=>{
    res.render('../public/consumer/login-signup')
})

route.post('/login',
    passport.authenticate('local',{
        successRedirect:'/user/profile',
        failureRedirect:'/user/login'
    })
)

route.get('/profile',(req,res)=>{
    console.log('In profile')
    if(!req.user){
        return res.redirect('/user/login')
    }

    personal_transactions = []
    products = []

    Transactions.findAll({
        where:{
            username:req.user.username
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            personal_transactions.push(entries[i].dataValues)
        }
    })
    Products.findAll({
        where:{
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            products.push(entries[i].dataValues)
        }
    })

    setTimeout(()=>{
        res.render('../public/consumer/profile',{
            personal_transactions,products
        })
    },1000)
})

route.post('/profile',(req,res)=>{
    console.log('In profile')
    if(!req.user){
        return res.redirect('/user/login')
    }
    res.render('../public/consumer/profile',{
        user:req.user
    })
})

route.post('/buy',(req,res)=>{
    if(!req.user){
        return res.redirect('/user/login')
    }
    Products.findOne({
        where:{
            id:req.body.id
        }
    }).then((entry)=>{
        res.render('../public/consumer/buyproduct',{
            entry
        })
    })
})

route.post('/order',(req,res)=>{
    if(!req.user){
        return res.redirect('/user/login')
    }
    if(req.body.quantityordered>req.body.stockavailable){
        return res.redirect('/user/profile')
    }
    Transactions.create({
        productid:req.body.productid,
        productname:req.body.productname,
        price:req.body.price,
        quantityordered:req.body.quantityordered,
        billamount:req.body.quantityordered*req.body.price,
        username:req.user.username,
        name:req.body.name,
        phoneno:req.body.phoneno,
        address:req.body.address
    }).then((item)=>{
        Products.update({
            quantity:req.body.stockavailable-req.body.quantityordered
        },{
            where:{
                id:req.body.productid
            }
        })
        res.render('../public/consumer/billdisplay',{
            item
        })
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