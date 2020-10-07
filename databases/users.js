const Sequelize = require('sequelize')

const dbuser = new Sequelize({
    dialect:'sqlite',
    storage: __dirname+'/usersdb.db'
})

const Users = dbuser.define('dbuser',{
    username:{
        type:Sequelize.STRING(30),
        unique:true,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    email:{
        type:Sequelize.STRING(50),
        allowNull:false
    }
})
dbuser.sync().then(()=>{
    console.log('DataBase Structure Ready Bancho')
})

module.exports={
    Users
}