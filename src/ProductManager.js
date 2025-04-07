import fs from "fs";

class ProductManager {
    constructor() {
        this.path = "./src/products.json";
    }


    readProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.path, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error al leer los productos:", error);
            return [];
        }
    };


    writeProducts = async (products) => {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2), "utf-8");
        } catch (error) {
            console.error("Error al escribir los productos:", error);
        }
    };


    generateNewId = (products) => {
        return products.length > 0 ? products[products.length - 1].id + 1 : 1;
    };


    getProducts = async () => {
        return await this.readProducts();
    };


    getProductById = async (pid) => {
        const products = await this.readProducts();
        const product = products.find((product) => product.id == pid);
        return product || null;
    };


    addProduct = async (productData) => {
        const products = await this.readProducts();


        const codeExists = products.some((product) => product.code === productData.code);
        if (codeExists) {
            throw new Error("El código del producto ya existe");
        }

        const newProduct = {
            id: this.generateNewId(products), // Generar un ID secuencial
            ...productData,
            status: productData.status ?? true, // Valor por defecto para status
        };

        products.push(newProduct);
        await this.writeProducts(products);
        return newProduct;
    };


    updateProductById = async (pid, updatedFields) => {
        const products = await this.readProducts();
        const index = products.findIndex((product) => product.id == pid);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }


        const updatedProduct = { ...products[index], ...updatedFields, id: products[index].id };
        products[index] = updatedProduct;

        await this.writeProducts(products);
        return updatedProduct;
    };

    deleteProductById = async (pid) => {
        const products = await this.readProducts();
        const index = products.findIndex((product) => product.id == pid);

        if (index === -1) {
            throw new Error("Producto no encontrado");
        }

        const deletedProduct = products.splice(index, 1);
        await this.writeProducts(products);
        return deletedProduct[0];
    };
}

export default ProductManager;