import express from "express";
import CartManager from "./src/CartManager.js";
import ProductManager from "./src/ProductManager.js";

const app = express();
app.use(express.json());

const cartManager = new CartManager();
const productManager = new ProductManager();

app.get("/api/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
});

app.get("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const product = await productManager.getProductById(pid);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto", error: error.message });
    }
});

app.post("/api/products", async (req, res) => {
    try {
        const newProduct = await productManager.addProduct(req.body);
        res.status(201).json({ newProduct, message: "Producto agregado con éxito" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.put("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const updatedProduct = await productManager.updateProductById(pid, req.body);
        res.status(200).json({ updatedProduct, message: "Producto actualizado con éxito" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.delete("/api/products/:pid", async (req, res) => {
    try {
        const pid = req.params.pid;
        const deletedProduct = await productManager.deleteProductById(pid);
        res.status(200).json({ deletedProduct, message: "Producto eliminado con éxito" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});


app.post("/api/carts", async (req, res) => {
    try {
        const newCart = await cartManager.addCart();
        res.status(201).json({ newCart, message: "Carrito creado con éxito" });
    } catch (error) {
        res.status(500).json({ message: "Error al crear el carrito", error: error.message });
    }
});

app.get("/api/carts/:cid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const products = await cartManager.getProductsInCartById(cid);
        res.status(200).json({ products, message: "Lista de productos del carrito" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;
        const { quantity } = req.body;
        const updatedCart = await cartManager.addProductInCart(cid, pid, quantity);
        res.status(200).json({ updatedCart, message: "Producto añadido al carrito con éxito" });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
});

app.listen(8080, () => {
    console.log("Servidor iniciado en el puerto 8080");
});