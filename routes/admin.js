const route = require('express').Router()
const {Users,Products,Transactions,TempProducts} = require('../db')
const passport = require('passport')
const moveFile = require('move-file')

route.get('/login',(req,res)=>{
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
    products = []
    users = []
    transactions = []
    tempproducts = []
    requestlog = []
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
    TempProducts.findAll({
        where:{
            status:'Pending'
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            tempproducts.push(entries[i].dataValues)
        }
    })
    TempProducts.findAll({
        where:{
            $or:[
                {
                    status:'Accepted'
                },
                {
                    status:'Declined'
                }
            ]
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            requestlog.push(entries[i].dataValues)
        }
    })
    
    setTimeout(()=>{
        res.render('../public/admin/profile',{
            products,users,transactions,tempproducts,requestlog
        })
    },1000)
})

route.post('/addtoinventory',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    TempProducts.findOne({
        where:{
            id:req.body.id
        }
    }).then((entry)=>{
        Products.create({
            name:entry.dataValues.name,
            companyname:entry.dataValues.companyname,
            costprice:entry.dataValues.costprice,
            sellingprice:req.body.sellingprice,
            quantity:entry.dataValues.quantity,
            description:entry.dataValues.description,
            time:new Date().toLocaleString()
        }).then((entry)=>{
            TempProducts.update({
                status:'Accepted'
            },{
                where:{
                    id:req.body.id
                }
            });
            (async () => {
                await moveFile('./public/consumer/productimagestemp/'+req.body.id+'.jpg', './public/admin/productimages/'+entry.dataValues.id+'.jpg')
                console.log('The file has been moved')
            })();
            res.redirect('/admin/profile')
        })
    })
})

route.post('/deleterequest',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    TempProducts.update({
        status:'Declined'
    },{
        where:{
            id:req.body.id
        }
    }).then(()=>{
        res.redirect('/admin/profile')
    })
})

route.get('/logout',function(req,res){
    if(!req.user){
        return res.redirect('/admin/login')
    }
    console.log("Logging Out " + req.user.username);
    req.logout();
    res.redirect('/')
});

module.exports={
    route
}