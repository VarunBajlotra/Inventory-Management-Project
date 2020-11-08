const route = require('express').Router()
const passport = require('passport')
const {Users,Products,Transactions,TempProducts} = require('../db')
const moveFile = require('move-file')
const nodemailer = require('nodemailer')

let transport = nodemailer.createTransport({
    service:'gmail',
    auth: {
       user: 'varunbajlotra@gmail.com',
       pass: '17102000vb'
    }
});

route.get('/signup',(req,res)=>{
    res.render('../public/consumer/login-signup')
})

route.post('/signup',(req,res)=>{
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
    if(!req.user){
        return res.redirect('/user/login')
    }

    personal_transactions = []
    products = []
    tempproducts = []

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
    TempProducts.findAll({
        where:{
            user:req.user.username
        }
    }).then((entries)=>{
        for(i=0;i<entries.length;i++){
            tempproducts.push(entries[i].dataValues)
        }
    })

    setTimeout(()=>{
        res.render('../public/consumer/profile',{
            personal_transactions,products,tempproducts
        })
    },1000)
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
    if((+req.body.quantityordered)>(+req.body.stockavailable)){
        return res.redirect('/user/profile')
    }
    console.log('In order')
    Transactions.create({
        productid:req.body.productid,
        productname:req.body.productname,
        price:req.body.price,
        quantityordered:req.body.quantityordered,
        billamount:req.body.quantityordered*req.body.price,
        time:new Date().toLocaleString(),
        username:req.user.username,
        name:req.body.name,
        phoneno:req.body.phoneno,
        address:req.body.address
    }).then((item)=>{
        const message = {
            from: 'varunbajlotra@gmail.com',
            to: req.user.email,
            subject: 'Order Placed at Inventory Management System',
            html: 'Dear <b>'+item.dataValues.name+'</b>, you placed an order with the following details:<br><br>'+
                  '<b>Transaction ID :</b> '+item.dataValues.id+'<br>'+
                  '<b>Product Image</b><br><img src="cid:unique"/ width="200"><br>'+
                  '<b>Product Name :</b> '+item.dataValues.productname+'<br>'+
                  '<b>Quantity Ordered :</b> '+item.dataValues.quantityordered+'<br>'+
                  '<b>Bill Amount :</b> Rs '+item.dataValues.billamount+'<br><br>'+
                  'We have received your order. Your order will be delivered soon at your address : <b>'+item.dataValues.address+'</b>.<br>'+
                  'We will be reaching out to you at your phone number <b>'+item.dataValues.phoneno+'</b> if required.<br><br>'+
                  'Regards<br>'+
                  'Inventory Management',
            attachments: [{
                filename: item.dataValues.productid+'.jpg',
                path: './public/admin/productimages/'+item.dataValues.productid+'.jpg',
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
        Products.update({
            quantity:req.body.stockavailable-req.body.quantityordered
        },{
            where:{
                id:req.body.productid
            }
        })
        console.log('Rendering Bill')
        res.render('../public/consumer/billdisplay',{
            item
        })
    })
})

route.get('/addproduct',(req,res)=>{
    if(!req.user){
        return res.redirect('/user/login')
    }
    res.render('../public/consumer/addproduct')
})

route.post('/addproduct',(req,res)=>{
    if(!req.user){
        return res.redirect('/user/login')
    }
    TempProducts.create({
        name:req.body.name,
        companyname:req.body.companyname,
        costprice:req.body.costprice,
        quantity:req.body.quantity,
        description:req.body.description,
        time:new Date().toLocaleString(),
        user:req.user.username,
        usermail:req.user.email,
        status:'Pending'
    }).then((item)=>{
        setTimeout(()=>{
            //For Varun
            (async () => {
                await moveFile('C:/Users/varun/Downloads/product.jpg', './public/consumer/productimagestemp/'+item.dataValues.id+'.jpg')
                console.log('The file has been moved')
                const message = {
                    from: 'varunbajlotra@gmail.com',
                    to: req.user.email,
                    subject: 'Request to Add Product at Inventory Management System',
                    html: 'Dear <b>'+item.dataValues.user+'</b>, you have requested to add a product in our inventory with the following details:<br><br>'+
                          '<b>Product Image</b><br><img src="cid:unique"/ width="200"><br>'+
                          '<b>Product Name :</b> '+item.dataValues.name+'<br>'+
                          '<b>Company Name :</b> '+item.dataValues.companyname+'<br>'+
                          '<b>Cost Price :</b> '+item.dataValues.costprice+'<br>'+
                          '<b>Quantity :</b> '+item.dataValues.quantity+'<br>'+
                          '<b>Description :</b> '+item.dataValues.description+'<br><br>'+
                          'We have received your product request and are currently processing it.<br>'+
                          'We will inform you soon whether your Product Add Request was Accepted or Declined.<br><br>'+
                          'Regards<br>'+
                          'Inventory Management',
                    attachments: [{
                        filename: item.dataValues.id+'.jpg',
                        path: './public/consumer/productimagestemp/'+item.dataValues.id+'.jpg',
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
            })();
            // For Vaibhav
            // (async () => {
            //     await moveFile(Location of photo in downloads, './public/consumer/productimagestemp/'+item.dataValues.id+'.jpg')
            //     console.log('The file has been moved')
            //     const message = {
            //         from: 'varunbajlotra@gmail.com',
            //         to: req.user.email,
            //         subject: 'Request to Add Product at Inventory Management System',
            //         html: 'Dear <b>'+item.dataValues.user+'</b>, you have requested to add a product in our inventory with the following details:<br><br>'+
            //             '<b>Product Image</b><br><img src="cid:unique"/ width="200"><br>'+
            //             '<b>Product Name :</b> '+item.dataValues.name+'<br>'+
            //             '<b>Company Name :</b> '+item.dataValues.companyname+'<br>'+
            //             '<b>Cost Price :</b> '+item.dataValues.costprice+'<br>'+
            //             '<b>Quantity :</b> '+item.dataValues.quantity+'<br>'+
            //             '<b>Description :</b> '+item.dataValues.description+'<br><br>'+
            //             'We have received your product request and are currently processing it.<br>'+
            //             'We will inform you soon whether your Product Add Request was Accepted or Declined.<br><br>'+
            //             'Regards<br>'+
            //             'Inventory Management',
            //         attachments: [{
            //             filename: item.dataValues.id+'.jpg',
            //             path: './public/consumer/productimagestemp/'+item.dataValues.id+'.jpg',
            //             cid: 'unique'
            //         }]
            //     };
            //     transport.sendMail(message, function(err, info) {
            //         if (err) {
            //             console.log(err)
            //         } else {
            //             console.log(info);
            //         }
            //     });
            // })();
        },2000)
        res.redirect('/user/profile')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/user/profile')
    })
})

route.get('/logout',function(req,res){
    if(!req.user){
        return res.redirect('/user/login')
    }
    console.log("Logging Out " + req.user.username);
    req.logout();
    res.redirect('/')
});

module.exports={
    route
}