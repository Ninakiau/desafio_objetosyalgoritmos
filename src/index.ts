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
console.log("P R O D U C T O S   M A S   V E N D I D O S : ");
console.table(getMostPopularProduct());

/* Crear una función que calcule el total de ingresos por categoría de producto. */
function getProductsByCategory() {
    // Filtramos los productos por categoría
    const categoryFace = products.filter(({ category }) => category === 'Face');
    const categoryEyes = products.filter(({ category }) => category === 'Eyes');
    const categoryLips = products.filter(({ category }) => category === 'Lips');

    // Devolvemos un objeto con las categorías y sus productos correspondientes
    return { categoryFace, categoryEyes, categoryLips };

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
console.log("-------------------------------------------------------------")
console.log("T O T A L   D E   I N G R E S O S   P O R   C A T E G O R I A : ");
console.log("Total de ingresos por categoria Face: " + getSalesByCategory(getProductsByCategory().categoryFace));
console.log("Total de ingresos por categoria Eyes: " + getSalesByCategory(getProductsByCategory().categoryEyes));
console.log("Total de ingresos por categoria Lips: " + getSalesByCategory(getProductsByCategory().categoryLips));

/* Implementar una función que identifique a los clientes "VIP" (aquellos que han  gastado más de $1,000,000 en total). (2 Puntos)  La función debe retornar un array con los objetos de los clientes VIP, incluyendo el monto total de sus compras*/

function getVIPClients() {
    const clientsSummary = clients.map((client: IClient) => {
        // Filtra las ventas para el cliente actual
        const salesForClient = sales.filter(({ clientId }) => clientId === client.clientId);

        // Suma la cantidad de ingresos generados por el cliente actual
        const totalSales = salesForClient.reduce((acc, sale) => {
            // Encuentra el producto correspondiente a la venta actual del cliente
            const product = products.find(({ id }) => id === sale.productId);
            if (product) {
                // Suma el total de ingresos generados por el cliente
                acc += product.price * sale.quantity;
            }
            return acc;
        }, 0);

        // Retorna un objeto con el cliente y sus ingresos totales
        return {
            ...client,
            totalSales,
        };
    });

    // Ordena los clientes por el total de ventas en orden descendente
    const sortedClients = clientsSummary.sort((a, b) => b.totalSales - a.totalSales);

    // Retorna los clientes con mayores ingresos
    return sortedClients;
}

//Mostrar los clientes VIP
console.log("-------------------------------------------------------------")
console.log("C L I E N T E S   V I P: ");
console.table(getVIPClients().filter(client => client.totalSales > 1000000));

/* Crear una función que genere un reporte de inventario. (2 Puntos)
Esta función debe retornar un array de objetos, donde cada objeto contiene el nombre del producto, la categoría, el stock actual y un campo "status" que puede ser "Low Stock" si el stock es menor a 10, "In Stock" si está entre 10 y 20, y "Enough Stock" si es mayor a 20*/

function getStockReport() {
    const getStock = products.map((product: IProduct) => {
        const status = product.stock < 10 ? 'Low Stock' : product.stock >= 10 && product.stock <= 20 ? 'In Stock' : 'Enough Stock';
        return {
            name: product.name,
            category: product.category,
            stock: product.stock,
            status
        };
});
    return getStock;
}


//Mostrar el reporte de inventario
console.log("-------------------------------------------------------------")
console.log("R E P O R T E   D E   I N V E N T A R I O : ");

console.table(getStockReport());