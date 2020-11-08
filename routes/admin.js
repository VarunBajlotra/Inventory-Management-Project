const route = require('express').Router()
const {Users,Products,Transactions,TempProducts} = require('../db')
const passport = require('passport')
const cpFile = require('cp-file')
const nodemailer = require('nodemailer')

let transport = nodemailer.createTransport({
    service:'gmail',
    auth: {
       user: 'varunbajlotra@gmail.com',
       pass: '17102000vb'
    }
});

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
            status:[
                'Accepted',
                'Declined'
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
        }).then((item)=>{
            const message = {
                from: 'varunbajlotra@gmail.com',
                to: entry.dataValues.usermail,
                subject: 'Add Product Request Accepted at Inventory Management System',
                html: 'Dear <b>'+entry.dataValues.user+'</b>, we are happy to inform you that your product request with the details mentioned below has been <b>ACCEPTED</b>.<br><br>'+
                      '<b>Product Image</b><br><img src="cid:unique"/ width="200"><br>'+
                      '<b>Product Name :</b> '+item.dataValues.name+'<br>'+
                      '<b>Company Name :</b> '+item.dataValues.companyname+'<br>'+
                      '<b>Cost Price :</b> '+item.dataValues.costprice+'<br>'+
                      '<b>Quantity :</b> '+item.dataValues.quantity+'<br>'+
                      '<b>Description :</b> '+item.dataValues.description+'<br><br>'+
                      'We look forward to get more products from you. Thank You!!<br><br>'+
                      'Regards<br>'+
                      'Inventory Management',
                attachments: [{
                    filename: req.body.id+'.jpg',
                    path: './public/consumer/productimagestemp/'+req.body.id+'.jpg',
                    cid: 'unique'
                }]
            };
            transport.sendMail(message, function(err, info) {
                if (err) {
                    console.log(err)
                } else {
                    console.log(info);
                }
            });
            TempProducts.update({
                status:'Accepted'
            },{
                where:{
                    id:req.body.id
                }
            });
            (async () => {
                await cpFile('./public/consumer/productimagestemp/'+req.body.id+'.jpg', './public/admin/productimages/'+item.dataValues.id+'.jpg')
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
    TempProducts.findOne({
        where:{
            id:req.body.id
        }
    }).then((item)=>{
        const message = {
            from: 'varunbajlotra@gmail.com',
            to: item.dataValues.usermail,
            subject: 'Add Product Request Declined at Inventory Management System',
            html: 'Dear <b>'+item.dataValues.user+'</b>, your product request with the details mentioned below has been <b>DECLINED</b>.<br><br>'+
                  '<b>Product Image</b><br><img src="cid:unique"/ width="200"><br>'+
                  '<b>Product Name :</b> '+item.dataValues.name+'<br>'+
                  '<b>Company Name :</b> '+item.dataValues.companyname+'<br>'+
                  '<b>Cost Price :</b> '+item.dataValues.costprice+'<br>'+
                  '<b>Quantity :</b> '+item.dataValues.quantity+'<br>'+
                  '<b>Description :</b> '+item.dataValues.description+'<br><br>'+
                  'Feel free to send us more offers.<br><br>'+
                  'Regards<br>'+
                  'Inventory Management',
            attachments: [{
                filename: req.body.id+'.jpg',
                path: './public/consumer/productimagestemp/'+req.body.id+'.jpg',
                cid: 'unique'
            }]
        };
        transport.sendMail(message, function(err, info) {
            if (err) {
                console.log(err)
            } else {
                console.log(info);
            }
        });
    })
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