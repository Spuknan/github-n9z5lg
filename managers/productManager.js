const fs = require('fs')
const crypto = require('node:crypto');
const randomId = () => { return crypto.randomUUID()}


class productManager {
   constructor(path) {
      this.path = path;
      this.products = [];
   }

   async getProducts(limit) {
      try {
         const data = await fs.promises.readFile(this.path, 'utf8');
         this.products = JSON.parse(data);
         return limit ? this.products.slice(0, limit) : this.products;
      } catch (err) {
         if (err.code === 'ENOENT') { // Archivo no encontrado
            console.log("No file found with that specific name.")
         } else {
            console.error(`Error loading products: ${err}`);
         }
         this.products = [];
         return this.products;
      }
   }

   async addProduct(title, description, price, thumbnail, code, category, stock) {
      // Cargar los productos existentes
      await this.getProducts();

      // Comprobar que se proporcionan todos los datos necesarios
      if (!title || !description || !price || !thumbnail || !code || !category || !stock) {
         console.error("Missing product data");
         return false
      }

      // Generar un nuevo ID de producto
      const pid = randomId()

      // Comprobar que no exista otro producto con el mismo code
      if (this.products.some(product => product.code === code)) {
         console.error(`A product with code ${code} already exists`);
         return { statusCode: 409, message: `A product with code ${code} already exists` };
      }

      // Crear un nuevo objeto de producto
      const newProduct = {
         id: pid,
         title: title,
         description: description,
         category: category,
         price: price,
         thumbnail: thumbnail,
         code: code,
         stock: stock,
         status: true
      };

      // Agregar el nuevo producto a la lista de productos
      this.products.push(newProduct);
      console.log("New product created:")
      console.table(newProduct)

      // Guardar los productos en el archivo JSON
      try {
         console.log(`Saving product in path file`)
         await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
      } catch (error) {
         throw new Error(`Error saving product data: ${error}`);
      }

      // Devolver el nuevo objeto de producto
      return { statusCode: 201, message: "Product created", product: newProduct };
   }

   async updateProduct(pid, newData) {
      try {
         // Cargar los productos existentes
         await this.getProducts();
   
         // Buscar el producto que coincide con el ID dado
         const productIndex = this.products.findIndex(product => product.id === pid);
   
         if (productIndex === -1) {
            console.error(`Product with ID ${pid} not found`);
            return null;
         }
   
         // Verificar si el código ha sido actualizado en newData y si existe para otro producto
         if (newData.code && this.products.some(product => product.code === newData.code && product.id !== pid)) {
            console.error(`A product with code ${newData.code} already exists`);
            return { statusCode: 409, message: `A product with code ${newData.code} already exists` };
         }
   
         // Actualizar los campos del producto que se hayan pasado en newData
         const updatedProduct = { ...this.products[productIndex] };
         for (const [key, value] of Object.entries(newData)) {
            if (value !== undefined) {
               updatedProduct[key] = value;
            }
         }
   
         // Actualizar el producto en la lista de productos
         this.products[productIndex] = updatedProduct;
   
         // Guardar los productos actualizados en el archivo JSON
         console.log(`Saving updated products to file`);
         await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
   
         return updatedProduct;
      } catch (error) {
         throw new Error(`Error updating product: ${error}`);
      }
   }

   async getProductById(pid) {
      // Cargar los productos existentes
      await this.getProducts();

      // Buscar el producto por ID
      const product = this.products.find(p => p.id === pid);

      if (!product) {
         console.log(`Couldn't find a product with id ${pid}`)
         return null
      }

      // Devolver el producto
      console.log(`Product with id ${pid} found:`)
      console.table(product)
      return product
   }

   async deleteProduct(pid) {
      // Buscar el producto por ID
      const product = await this.getProductById(pid);

      // Verificar si el producto existe
      if (!product) {
         throw new Error(`Product with ID ${pid} not found`);
      }

      // Filtrar la lista de productos para excluir el producto con el ID dado
      this.products = this.products.filter(product => product.id !== pid);

      // Guardar los productos actualizados en el archivo JSON
      try {
         console.log(`Product with id ${pid} deleted`);
         console.log(`Saving updated products list to file`);
         await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf8');
      } catch (error) {
         throw new Error(`Error saving product data: ${error}`);
      }

      return pid;
   }
}

module.exports = productManager;