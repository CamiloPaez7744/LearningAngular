
interface Product {
    description: string;
    price: number;
    category: string;
}


const phone: Product = {
    description: "Latest smartphone",
    price: 999,
    category: "Electronics"
}

const asusPC: Product = {
    description: "Gaming laptop",
    price: 1999,
    category: "Computers"
}

const shoppingCart: Product[] = [phone, asusPC];

interface TaxCalculationOptions {
    taxRate: number;
    shoppingCart: Product[];
}

function taxCalculation(options: TaxCalculationOptions): [number, number] {
    const total = options.shoppingCart.reduce((sum, item) => sum + item.price, 0);
    const totalWithTax = total + (total * options.taxRate);
    return [total, totalWithTax];
}

const [total, totalWithTax] = taxCalculation({
    taxRate: 0.2,
    shoppingCart
});

console.log(`Total: ${total}, Total with Tax: ${totalWithTax}`);

export {};