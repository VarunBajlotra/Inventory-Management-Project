const route = require('express').Router()
const Products = require("../db").Products
const moveFile = require('move-file')
const del = require('del')
const fs = require('fs')

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
        costprice:req.body.costprice,
        sellingprice:req.body.sellingprice,
        quantity:req.body.quantity,
        description:req.body.description,
        time:new Date().toLocaleString()
    }).then((entry)=>{
        setTimeout(()=>{
            //For Varun
            (async () => {
                await moveFile('C:/Users/varun/Downloads/product.jpg', './public/admin/productimages/'+entry.dataValues.id+'.jpg')
                console.log('The file has been moved')
            })();
            //For Vaibhav
            // (async () => {
            //     await moveFile(Location of photo in downloads, './public/admin/productimages/'+entry.dataValues.id+'.jpg')
            //     console.log('The file has been moved')
            // })();
        },1000)
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
        costprice:req.body.costprice,
        sellingprice:req.body.sellingprice,
        quantity:req.body.quantity,
        description:req.body.description
    },{
        where:{
            id:req.body.id
        }
    }).then(()=>{
        setTimeout(()=>{
            //For Varun
            fs.access('C:/Users/varun/Downloads/product.jpg', fs.F_OK, (err) => {
                if (err) {
                  console.log('Error here')
                  console.log(err)
                  return
                }
                (async () => {
                    await del(['./public/admin/productimages/'+req.body.id+'.jpg']);
                })();
                setTimeout(()=>{
                    (async () => {
                        await moveFile('C:/Users/varun/Downloads/product.jpg', './public/admin/productimages/'+req.body.id+'.jpg')
                        console.log('The file has been moved')
                    })();
                },500)
            })
            //For Vaibhav
            // fs.access(download product.jpg, fs.F_OK, (err) => {
            //     if (err) {
            //       console.log('Error here')
            //       console.log(err)
            //       return
            //     }
            //     console.log('Is this executing?');
            //     (async () => {
            //         await del(['./public/admin/productimages/'+req.body.id+'.jpg']);
            //     })();
            //     setTimeout(()=>{
            //         (async () => {
            //             await moveFile(download product.jpg, './public/admin/productimages/'+req.body.id+'.jpg')
            //             console.log('The file has been moved')
            //         })();
            //     },500)
            // })
        },1000)
        res.redirect('/admin/profile')
    }).catch((err)=>{
        console.log(err)
        res.redirect('/admin/profile')
    })
})

module.exports={
    route
}