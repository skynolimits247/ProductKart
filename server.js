const express = require('express')
const {
    db, 
    User, 
    Product, 
    Cart, 
    Vendor
} = require('./db')
const app = express()

const SERVER_PORT = process.env.PORT || 9090

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/',
  express.static(__dirname + '/public')
)
app.use('/vendor', 
    express.static(__dirname + '/VendorComponent')
);

app.use('/checkout', 
    express.static(__dirname + '/CartComponent')
);
app.use('/product', 
    express.static(__dirname + '/ProductComponent')
);

/*
API to getAll products
*/
app.get('/products', async (req, res) => {
  const products = await Product.findAll({
      include:Vendor
  })
  res.send(products)
})

/*
API to addNew product
*/
app.post('/products', async (req, res) => {
    try{
            const products = await Product.create({
                name:req.body.name,
                price:req.body.price,
                qty:req.body.qty
            })
            const vendor = await Vendor.findOne({
                where:{
                    id:req.body.vendor
                }
            })
            vendor.addProduct(products)
            res.send({success: true})
        } catch (e) {
        console.log(e.message)
            res.send({success: false, err: e.message})
        }
})
/*
API to delete Product
*/
app.delete('/products/:id', async (req, res) => {
    try{
        const result = await Product.destroy({
            where:{
                id:req.params.id
            }
        })
        res.send({success: true})
    }catch(e){
        console.log(e.message)
        res.send({success: false, err: e.message})
    }
})



/*
API to getAll vendors
*/
app.get('/vendors', async (req, res) => {
  const vendors = await Vendor.findAll()
  res.send(vendors)
})
/*
API to addNew vendor
*/
app.post('/vendors', async (req, res) => {
      try {
            const result = await Vendor.create({
            name: req.body.vendorName,
            email: req.body.vendorEmail
            })
            res.send({success: true})
        } catch (e) {
            res.send({success: false, err: e.message})
        }

})
/*
API to delete Vendor
*/
app.delete('/vendors/:id', async (req, res) => {
    try{
        const vendor = await Vendor.findOne({
            where:{
                id:req.params.id
            }
        })
        const prod = await Product.destroy({
            where:{
                vendorId:vendor.id
            }
        })
        const result = await Vendor.destroy({
            where:{
                id:req.params.id
            }
        })

    }catch(e){
        console.log(e.message)
        res.send({success: false, err: e.message})
    }
})
/*
API to logIn and create new user
*/
app.post('/user', async (req, res) => {
    let data;
      try {
            const result = await User.findOne({
                            where:{
                        email:req.body.email
                                  }
            })
            if(result === null){
            const user = await User.create({
                    email: req.body.email
                })
             const temp = await User.findOne({
                            where:{
                        email:req.body.email
                                  }
                })
                data = {
                    id: temp.id,
                    email: temp.email,
                    success: true
                }
                res.send(data)
            }else{
                    data = {
                    id: result.id,
                    email: result.email,
                    success: true
                }
                res.send(data)
            }
            
        } catch (e) {
            console.log("exception occured"+e.message)
            res.send({success: false, err: e.message})
        }

})
/*
API to add product to cart
*/
app.post('/cart', async (req, res) => {
    try{
            const cart = await Cart.findOne({
                where:{
                    productId:req.body.productId,
                    userId:req.body.userId
                },
                include:Product,
            }) 
            if(cart === null){
                const user = await User.findOne({
                                        where:{
                                    id:req.body.userId
                                            }
                            })
                const product = await Product.findOne({
                                        where:{
                                    id:req.body.productId
                                            }
                            })
                const tempcart = await Cart.create({
                        qty:1
                }) 
                user.addCart(tempcart)
                product.addCart(tempcart)
                res.send({success: true})
            }else{
                if(cart.qty < cart.product.qty){
                  const tempcart = Cart.update({
                    qty: cart.qty+1,
                    }, {
                    where: {
                        id: cart.id
                    }
                    })
                res.send({success: true})
                }else{
                    res.send({success: false, err:"quantity exceeded"})
                }
            }
            
        }  catch (e) {
            console.log("exception occured"+e.message)
            res.send({success: false, err: e.message})
        }                                                 
})
/*
API to get cart count
*/
app.get('/cart/:id',async (req, res) => {
    try{
            Cart.sum('Qty', { where: { userId: parseInt(req.params.id) } }).then(sum => {
                res.send({success: true, count: sum})
            })
            
        }  catch (e) {
            console.log("exception occured"+e.message)
            res.send({success: false, err: e.message})
        }             
})

/*
API to get cart elements
*/
app.get('/checkout/:id',async (req, res) => {
    try{
            const cart = await Cart.findAll({
                where: {
                   userId: parseInt(req.params.id)
                },
                include:[{model:Product, include:[{model:Vendor}]},
                        {model:User
                        }]
             })
            res.send(cart)
        }  catch (e) {
            console.log("exception occured "+e.message)
            res.send({success: false, err: e.message})
        }             
})

/*
API to delete cart product
*/
app.delete('/delcartprod/:id', async (req, res) => {
    try{
        console.log("deleting cart product")
        const result = await Cart.destroy({
            where:{
                id:req.params.id
            }
        })
        res.send({success: true})
    }catch(e){
        console.log(e.message)
        res.send({success: false, err: e.message})
    }
})

/*
API to delete cart of a User
*/
app.delete('/sale/:id', async (req, res) => {
        try{
        const result = await Cart.destroy({
            where:{
                UserId:req.params.id
            }
        })
        res.send({success: true})
    }catch(e){
        console.log(e.message)
        res.send({success: false, err: e.message})
    }
})
/*
API to subtract qty form cart
*/
app.post('/remqty/:id', async (req, res) => {
        try{
            const cart = await Cart.findOne({
                where: {
                   id: parseInt(req.params.id)
                },
                include:[{model:Product, include:[{model:Vendor}]},
                        {model:User
                        }]
             })
                    if(cart.qty - 1 > 0 ){
                        const tempcart = await Cart.update({
                            qty: cart.qty-1,
                            }, {
                            where: {
                                id: cart.id
                            }
                            })
                        res.send({success:true})
                    }else{
                               const result = await Cart.destroy({
                                where:{
                                    id: parseInt(req.params.id)
                                }
                            })
                            res.send({success:true})
                    }
         res.send({success: true})
        }catch(e){
            console.log(e.message)
            res.send({success: false, err: e.message})
        }
})

db.sync()
    .then(() => {
                console.log("Database have been synced")
                console.log("Server started on http://localhost:7070")
                app.listen(SERVER_PORT, function () {
   		 console.log("Server started on http://localhost:3333");
});
                }
        )
	.catch((err) => console.error(err))
