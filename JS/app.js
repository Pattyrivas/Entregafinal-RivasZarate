const menuIngredientes = [
    { nombre: "Queso", valor: 390, img: "../src/Queso.jpeg" },
    { nombre: "Pepperoni", valor: 1290, img: "./src/Pepperoni.jpeg" },
    { nombre: "Maiz", valor: 990, img: "./src/Maiz.jpeg" },
    { nombre: "Jamón Serrano", valor: 1490, img: "./src/Jamon.jpeg" },
    { nombre: "Aceitunas", valor: 790, img: "./src/Aceitunas.jpeg" },
    { nombre: "Piña", valor: 490, img: "./src/Piña.jpeg" },
    { nombre: "Tomate", valor: 390, img: "./src/Tomate.jpeg" },
    { nombre: "Tocino", valor: 990, img: "./src/Tocino.jpeg" },
];

const contenedor = document.getElementById("contenedorIngredientes");
const carritoContenido = document.getElementById("carritoContenido");
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
const repetirPedidoModal = new bootstrap.Modal(document.getElementById('repetirPedidoModal'));

function mostrarIngredientes() {
    menuIngredientes.map(ingrediente => {
        const divIngrediente = document.createElement("div");
        divIngrediente.classList.add("col-md-3", "mb-4");

        divIngrediente.innerHTML = `
                <div class="card">
                    <img src="${ingrediente.img}" class="card-img-top" alt="Imagen de ${ingrediente.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${ingrediente.nombre}</h5>
                        <p class="card-text">Valor: ${ingrediente.valor}</p>
                        <button class="btn btn-primary" onclick="agregarAlCarrito('${ingrediente.nombre}', ${ingrediente.valor})">Añadir a mi Pizza</button>
                    </div>
                </div>
            `;

        contenedor.appendChild(divIngrediente);
    });
}

function agregarAlCarrito(nombre, valor) {
    const nuevoElemento = document.createElement("div");
    nuevoElemento.innerHTML = `
          <p>${nombre} - Valor: ${valor} <button class="btn btn-danger btn-sm" onclick="eliminarIngrediente(this)">Eliminar</button></p>
        `;

    carritoContenido.appendChild(nuevoElemento);
    carritoModal.show();
}

function eliminarIngrediente(elemento) {
    elemento.parentNode.remove();
}

function mostrarModalRepetirPedido() {
    const ultimoPedidoJson = localStorage.getItem('ultimoPedido');

    if (ultimoPedidoJson) {
        const ultimoPedido = JSON.parse(ultimoPedidoJson);
        document.getElementById('repetirPedidoContenido').innerHTML = "";
        ultimoPedido.map(ingrediente => {
            const divIngrediente = document.createElement("div");
            divIngrediente.innerHTML = `<p>${ingrediente.nombre} - Valor: ${ingrediente.valor}</p>`;
            document.getElementById('repetirPedidoContenido').appendChild(divIngrediente);
        });
        repetirPedidoModal.show();
    } else {
        alert("No hay un pedido anterior almacenado.");
    }
}

function limpiarCarrito() {
    carritoContenido.innerHTML = '';
    repetirPedidoModal.hide();
    localStorage.clear();
}

function finalizarPedido(idResultadoModal, deberCerrarModal = true) {
    const elementosPedido = carritoContenido.getElementsByTagName("p");
    const ingredientesPedido = [];

    for (let i = 0; i < elementosPedido.length; i++) {
        const nombreValorMatch = elementosPedido[i].innerText.match(/([^\d]+) - Valor: (\d+)/);
        if (nombreValorMatch) {
            const ingrediente = { nombre: nombreValorMatch[1], valor: parseInt(nombreValorMatch[2]) };
            ingredientesPedido.push(ingrediente);
        }
    }

    let totalPedido = 0;
    ingredientesPedido.map(ingrediente => {
        totalPedido += ingrediente.valor;
    });

    const propina = totalPedido * 0.1;
    const totalPagar = totalPedido + propina;

    // Guardar el nombre y valor del último pedido en el localStorage como JSON
    localStorage.setItem('ultimoPedido', JSON.stringify(ingredientesPedido));

    document.getElementById(idResultadoModal).innerHTML = `
            <p>Total del Pedido: ${totalPedido}</p>
            <p>Propina (10%): ${propina}</p>
            <p>Total a Pagar: ${totalPagar}</p>
        `;

    if (deberCerrarModal) {
        repetirPedidoModal.hide();
    }
}

function filtrarPorPrecio() {
    const filtroPrecio = document.getElementById("filtroPrecio").value;

    if (filtroPrecio === "todos") {
        contenedor.innerHTML = "";
        mostrarIngredientes();
    } else {
        const ingredientesFiltrados = menuIngredientes.filter(ingrediente => ingrediente.valor < parseInt(filtroPrecio));
        contenedor.innerHTML = "";
        mostrarIngredientesFiltrados(ingredientesFiltrados);
    }
}

function mostrarIngredientesFiltrados(ingredientes) {
    ingredientes.map(ingrediente => {
        const divIngrediente = document.createElement("div");
        divIngrediente.classList.add("col-md-3", "mb-4");

        divIngrediente.innerHTML = `
                <div class="card">
                    <img src="${ingrediente.img}" class="card-img-top" alt="Imagen de ${ingrediente.nombre}">
                    <div class="card-body">
                        <h5 class="card-title">${ingrediente.nombre}</h5>
                        <p class="card-text">Valor: ${ingrediente.valor}</p>
                        <button class="btn btn-primary" onclick="agregarAlCarrito('${ingrediente.nombre}', ${ingrediente.valor})">Añadir a mi Pizza</button>
                    </div>
                </div>
            `;

        contenedor.appendChild(divIngrediente);
    });
}

window.onload = mostrarIngredientes;