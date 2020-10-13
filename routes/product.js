const route = require('express').Router()
const Products = require("../db").Products

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

route.post('/delete',(req,res)=>{
    if(!req.user){
        return res.redirect('/admin/login')
    }
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
    Products.update({
        name:req.body.name,
        companyname:req.body.companyname,
        price:req.body.price,
        quantity:req.body.quantity,
        description:req.body.description
    },{
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

module.exports={
    route
}