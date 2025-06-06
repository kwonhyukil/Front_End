var 이름 = ['kim', 'Lee'];
var 나이 = [20, 30];
var 이름2 = 123;
function 함수(X) {
    return X * 2;
}
함수(123);
var john = [123, true];
var john2 = { name: 'John', age: '30' };
var user = /** @class */ (function () {
    function user(name, age) {
        this.name = name;
        this.age = age;
    }
    user.prototype.sayHello = function () {
        console.log("Hello, my name is ".concat(this.name, " and I am ").concat(this.age, " years old."));
    };
    return user;
}());
