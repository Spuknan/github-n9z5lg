const express = require('express');
const router = express.Router();
const productManager = require('../managers/productManager');

// Instancia un objeto de productManager
const pm = new productManager('./db/products.json');



//! Ruta para obtener todos los productos
router.get('/', async (req, res) => {
   try {
      const limit = req.query.limit ? parseInt(req.query.limit) : null;

      const products = await pm.getProducts(limit);
      res.json(products);
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

//! Ruta para agregar un nuevo producto
router.post('/', async (req, res) => {
   console.log(req.body)
   const { title, description, price, thumbnail, code, stock, status } = req.body;
   try {
      const result = await pm.addProduct(title, description, price, thumbnail, code, stock, status);
      if (result.statusCode === 201) {
         res.status(201).json(result.product);
      } else {
         res.status(result.statusCode || 500).json({ error: result.message || 'Internal server error' });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});


//! Ruta para actualizar un producto existente
router.put('/:pid', async (req, res) => {
   const pid = (req.params.pid);
   const { title, description, price, thumbnail, code, stock, status } = req.body;
   try {
      const updatedProduct = await pm.updateProduct(pid, { title, description, price, thumbnail, code, stock, status });
      if (updatedProduct) {
         res.json(updatedProduct);
      } else {
         res.status(404).json({ error: `Product with id ${pid} not found` });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

//! Ruta para obtener un producto por ID
router.get('/:pid', async (req, res) => {
   const pid = req.params.pid;
   console.log(pid)
   try {
      const product = await pm.getProductById(pid);
      if (product) {
         res.json(product);
      } else {
         res.status(404).json({ error: `Product with id ${pid} not found` });
      }
   } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

//! Ruta para eliminar un producto existente
router.delete('/:id', async (req, res) => {
   const id = req.params.id;
   try {
      const deletedProductId = await pm.deleteProduct(id);
      res.json({ message: `Product with id ${deletedProductId} deleted` });
   } catch (error) {
      console.error(error);
      res.status(404).json({ error: `Product with id ${id} not found` });
   }
});

module.exports = router;