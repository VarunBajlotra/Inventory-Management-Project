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
    costprice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    sellingprice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING(400)
    },
    time:{
        type:Sequelize.STRING(40)
    }
})

const Transactions = database.define('transactions',{
    productid:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    productname:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    price:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    quantityordered:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    billamount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    time:{
        type:Sequelize.STRING(40)
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

const TempProducts = database.define('tempproducts',{
    name:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    companyname:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    costprice:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    sellingprice:{
        type:Sequelize.INTEGER
    },
    quantity:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    description:{
        type:Sequelize.STRING(400)
    },
    time:{
        type:Sequelize.STRING(40)
    },
    user:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    usermail:{
        type:Sequelize.STRING(40),
        allowNull:false
    },
    status:{
        type:Sequelize.STRING(40)
    }
})

database.sync().then(()=>{
    console.log('DataBase Structure Ready')
})

module.exports={
    Users,Products,Transactions,TempProducts
}