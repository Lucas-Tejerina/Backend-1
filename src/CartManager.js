import fs from "fs";

class CartManager {
    constructor() {
        this.path = "./src/carts.json";
    }

    readCarts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer los carritos:", error);
            return [];
        }
    };

    writeCarts = async (carts) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2), "utf-8");
        } catch (error) {
            console.error("Error al escribir los carritos:", error);
        }
    };

    generateNewId = (carts) => {
        return carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;
    };

    addCart = async () => {
        const carts = await this.readCarts();
        const id = this.generateNewId(carts);

        const newCart = { id, products: [] };
        carts.push(newCart);

        await this.writeCarts(carts);
        return newCart;
    };

    getProductsInCartById = async (cid) => {
        const carts = await this.readCarts();
        const cart = carts.find((cartData) => cartData.id == cid);

        if (!cart) throw new Error("Carrito no encontrado");
        return cart.products;
    };

    addProductInCart = async (cid, pid, quantity) => {
        const carts = await this.readCarts();
        const cart = carts.find((cartData) => cartData.id == cid);

        if (!cart) throw new Error("Carrito no encontrado");
        const productIndex = cart.products.findIndex((product) => product.id == pid);
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += quantity;
        } else {
            cart.products.push({ id: pid, quantity });
        }

        await this.writeCarts(carts);
        return cart;
    };
}

export default CartManager;