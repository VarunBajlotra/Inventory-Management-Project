const express = require('express')
// const {db} = require('./db')
const session = require('express-session')
const passport = require('./databases/passport-user')

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(session({
    secret: 'bhjcdvdkbzckdsbscsjvsh',
    resave: false,
    saveUninitialized: true
}))

app.use('/',express.static('public'))
app.use(passport.initialize())
app.use(passport.session())

app.set('view engine','hbs')

// app.use('/temp',res.render('./public/landing'))

app.use('/signup-user',(require('./routes/signup-user').route))
// app.use('/login-user',(require('./routes/login-user').route))
// app.use('/login-admin',(require('./routes/login-admin').route))

app.get('/',(req,res)=>{
    res.redirect('signup-user')
})

// db.sync({alter:true}).then(()=>{
    app.listen(4321,()=>{
        console.log('Server started at http://localhost:4321')
    })
// })