import { IClient } from './interfaces/IClient';
import { IProduct } from './interfaces/IProduct';
import { ISale } from './interfaces/ISale';
import { clients } from './data/clientsData';
import { products } from './data/productsData';
import { sales } from './data/salesData';
import { get } from 'http';
/* Implementar una función que encuentre los 3 productos más vendidos. */
function getProductBySales() {

    const salesSummary = products.map((product: IProduct) => {
        // Filtra las ventas para el producto actual

        const salesForProduct = sales.filter(({ productId }) => productId === product.id);
        // Suma la cantidad de ventas para el producto actual
        const totalSales = salesForProduct.reduce((acc, { quantity }) => acc + quantity, 0);
        // Retorna un objeto con la información del producto y el total de ventas
        return {
            ...product,
            totalSales
        };
    });
    return salesSummary;

}
//Funcion para ordenar los productos por ventas de mayor a menor
function sortSales() {
    return getProductBySales().sort((a, b) => b.totalSales - a.totalSales);
}
//Funcion para obtener los 3 productos mas vendidos
function getMostPopularProduct() {
    return sortSales().slice(0, 3);
}

//Mostrar los 3 productos mas vendidos
console.table(getMostPopularProduct());

/* Crear una función que calcule el total de ingresos por categoría de producto. */
function getProductsByCategory() {
    // Filtramos los productos por categoría
    const categoryFace = products.filter(({ category }) => category === 'Face');
    const categoryEyes = products.filter(({ category }) => category === 'Eyes');
    const categoryLips = products.filter(({ category }) => category === 'Lips');
   
    // Devolvemos un objeto con las categorías y sus productos correspondientes
    return {categoryFace, categoryEyes, categoryLips};

}

function getSalesByCategory(products: IProduct[]) {
    // Sumamos las ventas por cada producto de la categoría
    return products.reduce((totalIncome, product) => {
        // Filtramos las ventas del producto actual
        const salesForProduct = sales.filter(({ productId }) => productId === product.id);

        // Sumamos el total de ventas para este producto
        const totalSales = salesForProduct.reduce((acc, { quantity }) => acc + (quantity * product.price), 0);

        // Sumamos el total de ventas de este producto al total de ingresos de la categoría
        return totalIncome + totalSales;
    }, 0);
}

//Mostrar el total de ingresos por categoria
console.log("Total de ingresos por categoria Face: " + getSalesByCategory(getProductsByCategory().categoryFace));
console.log("Total de ingresos por categoria Eyes: " + getSalesByCategory(getProductsByCategory().categoryEyes));
console.log("Total de ingresos por categoria Lips: " + getSalesByCategory(getProductsByCategory().categoryLips));