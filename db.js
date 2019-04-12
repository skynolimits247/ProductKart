const Sequelize = require('sequelize')
const op = Sequelize.Op

const db = new Sequelize('ProductVendor', '','',{
	host: '',
	dialect:'sqlite',
	operatorsAliases : op,
	pool: {
		min :0,
		max:5,
		//idle:5000,
	},
	"storage":__dirname + '/ProductVendor.db'
})
const Product = db.define('product',{
	id: {
		type: Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	name: {
		type: Sequelize.STRING,
		allowNull: false
    },
    price: {
		type: Sequelize.FLOAT,
		allowNull: false,
		defaultValue: 0.0
    },
	qty: {
		type: Sequelize.INTEGER,
		allowNull: false,
		defaultValue: 0
	},
  })

  const Cart = db.define('cart',{
	id: {
		type: Sequelize.INTEGER,
		autoIncrement:true,
		primaryKey:true
	},
	qty: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	productId: {
		type: Sequelize.INTEGER
    },
    userId: {
		type: Sequelize.INTEGER
    },
})

const Vendor = db.define('vendor',{
    	id: {
            type: Sequelize.INTEGER,
            autoIncrement:true,
            primaryKey:true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
        }
})

const User = db.define('users',{
	id: {
		type: Sequelize.INTEGER,
		autoIncrement: true,
		primaryKey: true
    },
    email: {
		type: Sequelize.STRING,
		allowNull: false,
		},
})

Cart.belongsTo(Product, { onDelete: 'cascade' });
Product.hasMany(Cart, { onDelete: 'cascade' });
Cart.belongsTo(User);
User.hasMany(Cart, { onDelete: 'cascade' });

    Product.belongsTo(Vendor);
    Vendor.hasMany(Product, {onDelete: 'cascade'})


exports = module.exports = {
	db, User, Product, Cart, Vendor
}
