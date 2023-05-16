const express = require('express');
const router = express.Router();
const cartsManager = require('../managers/cartsManager');
const productManager = require('../managers/productManager');

// Iniciar una instancia de cartsManager
const cm = new cartsManager('./db/carts.json');
const pm = new productManager('./db/products.json');

//! Crear nuevo carrito
router.post('/', async (req, res) => {
   try {
      const result = await cm.createCart();
      res.status(result.statusCode).send(result);
   } catch (error) {
      console.error(error);
      res.status(500).send({ statusCode: 500, message: "Internal server error" });
   }
});

//! Retornar carrito por su id
router.get('/:cid', async (req, res) => {
   try {
      const cid = req.params.cid;
      const result = await cm.getCart(cid);
      res.status(result.statusCode).send(result);
   } catch (error) {
      console.error(error);
      res.status(500).send({ statusCode: 500, message: "Internal server error" });
   }
});

//! Agregar un producto a un carrito especifico
router.post('/:cid/product/:pid', async (req, res) => {
   try {
      const cid = req.params.cid;
      const pid = req.params.pid;

      // Verificar si el producto existe
      const product = await pm.getProductById(pid);
      if (!product) {
         return res.status(400).send({ statusCode: 400, message: "Product not found" });
      }

      const result = await cm.addProductToCart(cid, pid);
      res.status(result.statusCode).send(result);
   } catch (error) {
      console.error(error);
      res.status(500).send({ statusCode: 500, message: "Internal server error" });
   }
});

module.exports = router;
