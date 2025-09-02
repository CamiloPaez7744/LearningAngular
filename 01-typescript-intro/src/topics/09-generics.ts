export function whatsMyType<T>(arg: T): string {
  return typeof arg;
}


const result1 = whatsMyType<string>("Hello");
const result2 = whatsMyType<number>(42);
const result3 = whatsMyType<{ name: string; age: number }>({ name: "Alice", age: 30 });

console.log(result1); // "string"
console.log(result2); // "number"
console.log(result3); // "object"
