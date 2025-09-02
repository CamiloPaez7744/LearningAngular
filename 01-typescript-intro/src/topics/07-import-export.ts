import { taxCalculation, type Product } from './06-function-destructuring';

const shoppingCart: Product[] = [
    {
        description: "Latest smartphone",
        price: 999,
        category: "Electronics"
    },
    {
        description: "Gaming laptop",
        price: 1999,
        category: "Computers"
    }
];

const [total, totalWithTax] = taxCalculation({
    taxRate: 0.15,
    shoppingCart
});

console.log(`Total: ${total}, Total with Tax: ${totalWithTax}`);