const fs = require('fs').promises;
const crypto = require('node:crypto');
const randomId = () => { return crypto.randomUUID() }


class CartsManager {
   constructor(path) {
      this.path = path;
      this.carts = [];
   }

   async getCarts() {
      try {
         const data = await fs.readFile(this.path, 'utf-8');
         this.carts = JSON.parse(data);
      } catch (err) {
         console.error(err);
      }
   }

   async writeCarts() {
      try {
         await fs.writeFile(this.path, JSON.stringify(this.carts, null, 2));
      } catch (err) {
         console.error(err);
      }
   }

   // Crear un carrito nuevo
   async createCart() {
      try {
         // Crear un nuevo carrito
         const newCart = {
            cid: randomId(),
            products: [],
         };
         await this.getCarts();
         this.carts.push(newCart);

         // Guardar el nuevo carrito en el archivo JSON
         await this.writeCarts();

         // Retornar el nuevo carrito
         return { statusCode: 201, message: "Cart created", cart: newCart };
      } catch (error) {
         console.error("Error creating cart:", error);
         return { statusCode: 500, message: "Error creating cart", error };
      }
   }

   // Buscar un carrito por su id
   async getCart(cid) {
      try {
         await this.getCarts();
         const cart = this.carts.find((c) => c.cid === cid);
         if (cart) {
            return { statusCode: 200, message: "Cart found", cart };
         } else {
            return { statusCode: 404, message: "Cart not found" };
         }
      } catch (error) {
         console.error("Error getting cart:", error);
         return { statusCode: 500, message: "Error getting cart", error };
      }
   }

   // Añadir un producto al carrito solicitado
   async addProductToCart(cid, pid) {
      try {
         await this.getCarts();
         const cart = this.carts.find((c) => c.cid === cid);

         if (cart) {
            const product = cart.products.find((p) => p.pid === pid);

            if (product) {
               product.quantity += 1;
            } else {
               cart.products.push({ pid, quantity: 1 });
            }

            // Write the updated list of carts to file
            // Guardar la lista actualizada de carritos en el archivo JSON
            await this.writeCarts();

            return { statusCode: 200, message: "Product added to cart", cart };
         } else {
            return { statusCode: 404, message: "Cart not found" };
         }
      } catch (error) {
         console.error("Error adding product to cart:", error);
         return { statusCode: 500, message: "Error adding product to cart", error };
      }
   }

}

module.exports = CartsManager;
