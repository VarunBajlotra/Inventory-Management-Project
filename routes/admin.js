const route = require('express').Router()
const passport = require('passport')

route.get('/login',(req,res)=>{
    res.render('../public/admin')
})

route.post('/login',
    passport.authenticate('local',{
        successRedirect:'/admin/profile',
        failureRedirect:'/admin/login'
    })
)

module.exports={
    route
}