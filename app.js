const express = require('express')
const app = express()

// routes import
const mainRouter = require('./routes/main.router');
const productsRouter = require('./routes/products.router');
const cartsRouter = require('./routes/carts.router');

// routes use
app.use(express.json());

app.use('/', mainRouter);
app.use('/products', productsRouter);
app.use('/carts', cartsRouter);


// server listening to port 8080
app.listen(8080, () => {
   console.log('listening on port 8080')
})