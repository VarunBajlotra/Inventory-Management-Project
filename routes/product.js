 const route = require('express').Router()
const Products = require("../db").Products
const moveFile = require('move-file')
const del = require('del')
const fs = require('fs')
const multer = require('multer')

const storageAdd = multer.diskStorage({
    destination: './public/admin/productImages',
    filename: function (req, file, cb) {
                Products.create({
                    name:req.body.name,
                    companyname:req.body.companyname,
                    costprice:req.body.costprice,
                    sellingprice:req.body.sellingprice,
                    quantity:req.body.quantity,
                    description:req.body.description,
                    time:new Date().toLocaleString()
                }).then((entry)=>{
                    cb(null , entry.dataValues.id+'.jpg')
                }).catch((err)=>{
                    console.log(err)
                })
              }
});
const uploadAdd = multer({
    storage : storageAdd
}).single('photo')

route.get('/add',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    res.render('../public/admin/addproduct')
})

route.post('/add',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    uploadAdd(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        res.redirect('/admin/profile')
    })
})

route.post('/delete',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    (async () => {
        await del(['./public/admin/productimages/'+req.body.id+'.jpg']);
    })();
    Products.destroy({
        where:{
            id:req.body.id
        }
    }).then(()=>{
        res.redirect('/admin/profile')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/admin/profile')
    })
})

const storageUpdate = multer.diskStorage({
    destination: './public/admin/productImages',
    filename: function (req, file, cb) {
                console.log('In storageUpdate')
                cb(null , req.body.id+'.jpg')
              }
})

const uploadUpdate = multer({
    storage : storageUpdate
}).single('photo')

route.post('/update',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
    Products.findOne({
        where:{
            id:req.body.id
        }
    }).then((entry)=>{
        res.render('../public/admin/updateproduct',{
            entry
        })
    })
})

route.post('/updateindb',(req,res)=>{
    console.log('In UpdateInDB')
    if(!req.user){
        return res.redirect('/admin/login')
    }
    uploadUpdate(req,res,(err)=>{
        if(err){
            console.log(err)
        }
        console.log('In Upload Update')
        Products.update({
            name:req.body.name,
            companyname:req.body.companyname,
            costprice:req.body.costprice,
            sellingprice:req.body.sellingprice,
            quantity:req.body.quantity,
            description:req.body.description
        },{
            where:{
                id:req.body.id
            }
        })
        res.redirect('/admin/profile')
    })
})

module.exports={
    route
}