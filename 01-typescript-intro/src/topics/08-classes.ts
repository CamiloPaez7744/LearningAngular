// short definition
// export class SimplePerson {
//     constructor(
//         public name: string, 
//         public age: number,
//         private address?: string
//     ) {}
// }

export class Person {
    public name: string;
    public age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
}

export class SuperHero extends Person {
    public superPower: string;

    constructor(name: string, age: number, superPower: string) {
        super(name, age);
        this.superPower = superPower;
    }
}

export class Hero {
    public name: string;
    public age: number;
    public superPower: string;
    public person: Person;

    constructor(
        name: string,
        age: number,
        superPower: string,
        person: Person
    ) {
        this.name = name;
        this.age = age;
        this.superPower = superPower;
        this.person = person;
    }
}

const ironMan = new SuperHero("Tony Stark", 45, "Genius Intellect");
const hulk = new SuperHero("Bruce Banner", 40, "Super Strength");
console.log(ironMan);
console.log(hulk);

const wonderWoman = new Hero("Diana Prince", 30, "Super Strength", new Person("Diana Prince", 30));