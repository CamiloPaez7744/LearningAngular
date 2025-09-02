function classDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
    return class extends constructor {
        public myProperty: string = "Hello, World!";
    };
}

@classDecorator
export class SuperClass {
    public myProperty: string = "Hello, World!";

    print() {
        console.log(this.myProperty);
    }
}

console.log(SuperClass);

const myInstance = new SuperClass();
myInstance.print();
