const Sequelize = require('sequelize')

const database = new Sequelize({
    dialect:'sqlite',
    storage: __dirname+'/database.db',
    transactionType: 'IMMEDIATE'
})

const Users = database.define('users',{
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
    },
    type:{
        type:Sequelize.STRING(15)
    }
})

const Products = database.define('products',{
    name:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    companyname:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING(400)
    }
})

const Transactions = database.define('transactions',{
    productid:{
        type:Sequelize.INTEGER,
        unique:true,
        allowNull:false
    },
    productname:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    billamount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    username:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    name:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    phoneno:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    address:{
        type:Sequelize.STRING(40),
        allowNull:false
    }
})

database.sync().then(()=>{
    console.log('DataBase Structure Ready')
})

module.exports={
    Users,Products,Transactions
}