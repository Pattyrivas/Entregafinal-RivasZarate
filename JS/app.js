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

    alert(`Tu pedido es: Pizza con ${pedido.join(", ")}`);
    alert(`Total a pagar: $${totalPedido}, gracias por tu compra :)`);
}