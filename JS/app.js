let userName = prompt("Hola, para comenzar indicanos tu nombre :)");
if (userName === "" || !isNaN(userName) || /\d/.test(userName)) {
    alert("Favor ingresar un nombre valido")
} else {
    alert("Bienvenido/a a Pattyta Pizzeria " + userName + ", que ingredientes quieres elegir el dia de hoy?")
}

let pepperoni = 1000
let queso = 500
let maiz = 250
let jamon = 300

