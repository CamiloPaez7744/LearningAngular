export interface Passenger {
    name: string;
    age: number;
    email?: string;
}

const passenger1: Passenger = {
    name: "Alice",
    age: 30,
    email: "alice@example.com"
};

const passenger2: Passenger = {
    name: "Bob",
    age: 25
};


passenger2.email?.toUpperCase();

// not null assertion operator
passenger1.email!.toUpperCase();

// Nullish coalescing operator
const email1 = passenger1.email ?? "No email provided";
const email2 = passenger2.email ?? "No email provided";

// Logical AND operator
const isAdultWithEmail = passenger1.age >= 18 && !!passenger1.email;

// Logical OR operator
const contactEmail = passenger2.email || "default@example.com";

// Ternary operator
const emailStatus = passenger2.email ? "Email exists" : "Email missing";

console.log(email1);
console.log(email2);
console.log(isAdultWithEmail);
console.log(contactEmail);
console.log(emailStatus);