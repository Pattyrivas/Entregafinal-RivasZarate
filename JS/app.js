const userName = prompt("Hola, para comenzar indicanos tu nombre :)");
if (userName === "" || !isNaN(userName) || /\d/.test(userName)) {
    alert("Favor ingresar un nombre valido")
} else {
    alert("Bienvenido/a a Pattyta Pizzeria " + userName + ", que ingredientes quieres elegir el dia de hoy?")

    const menuPizza = {
        queso: 500,
        pepperoni: 1000,
        maiz: 250,
        jamon: 300,
    };

    let totalPedido = 0;
    let pedido = [];
    let propina = 0;

    while (true) {
        console.log("Menú Ingredientes:");
        for (const pizza in menuPizza) {
            console.log(`${pizza}: $${menuPizza[pizza]}`);
        }

        const eleccion = prompt("Elige tu ingrediente entre: queso, pepperoni, maiz, jamon o escribe 'fin' para terminar el pedido.");

        if (eleccion === 'fin') {
            break;
        }

        if (menuPizza[eleccion] !== undefined) {
            pedido.push(eleccion);
            totalPedido += menuPizza[eleccion];
            alert(`Añadiste ${eleccion} a tu pedido.`);
        } else {
            alert("Esa ingrediente no está en el menú. Por favor, elige otro.");
        }
    }

    function calcularPropina(totalPedido) {
        return totalPedido * 0.1;
    }

    propina = calcularPropina(totalPedido);

    alert(`Tu pedido es: Pizza con ${pedido.join(", ")}`);
    alert(`Total a pagar: $${totalPedido}`);
    alert(`Propina (10%): $${propina}`);
    alert(`Total a pagar con propina: $${totalPedido + propina}, gracias por tu compra :)`);
}