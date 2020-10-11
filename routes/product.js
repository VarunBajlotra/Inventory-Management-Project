const route = require('express').Router()
const Products = require("../db").Products

route.get('/add',(req,res)=>{
    res.render('../public/admin/addproduct')
})

route.post('/add',(req,res)=>{
    Products.create({
        name:req.body.name,
        companyname:req.body.companyname,
        price:req.body.price,
        quantity:req.body.quantity,
        description:req.body.description
    }).then(()=>{
        res.redirect('/admin/profile')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/admin/profile')
    })
})

module.exports={
    route
}