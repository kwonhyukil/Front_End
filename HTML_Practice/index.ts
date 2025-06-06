let 이름: string[] = ['kim', 'Lee'];
let 나이: number[] = [20, 30];

type Name = string | number;
let 이름2: Name = 123;

function 함수(X :number) : number{
    return X * 2;
}

함수(123);

type Member = [number, boolean];

let john : Member = [123, true];

type Member2 = {
    [key :string] : string;
}

let john2 : Member2 = {name : 'John', age : '30'};

class user {
    name: string;
    age: number;

    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }

    sayHello() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }

}