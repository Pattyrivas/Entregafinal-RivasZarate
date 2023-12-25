const contenedor = document.getElementById("contenedorIngredientes");
const carritoContenido = document.getElementById("carritoContenido");
const carritoModal = new bootstrap.Modal(document.getElementById('carritoModal'));
const repetirPedidoModal = new bootstrap.Modal(document.getElementById('repetirPedidoModal'));

async function cargarMenuDesdeJSON() {
    try {
        const response = await fetch('../json/productos.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al cargar el menú desde el JSON:', error);
        return [];
    }
}

let menuIngredientes;
async function mostrarIngredientes() {
    menuIngredientes = await cargarMenuDesdeJSON();

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

function filtrarPorPrecio() {
    const filtroPrecio = document.getElementById("filtroPrecio").value;

    if (filtroPrecio === "todos") {
        contenedor.innerHTML = "";
        mostrarIngredientes();
    } else {
        const menuIngredientesLocal = menuIngredientes || [];
        const ingredientesFiltrados = menuIngredientesLocal.filter(ingrediente => ingrediente.valor < parseInt(filtroPrecio));
        contenedor.innerHTML = "";
        mostrarIngredientesFiltrados(ingredientesFiltrados);
    }
}

function mostrarIngredientesFiltrados(ingredientes) {
    contenedor.innerHTML = "";
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

// Funciones para agregar al carrito sumar y restar cantidades - OK
let ingredientesSeleccionados = [];

function agregarAlCarrito(nombre, valor) {

    Toastify({
        text: "¡Se ha añadido a tu pizza!",
        className: "info",
        style: {
            background: "linear-gradient(to right,  #FFB534,  #FBF6EE)",
        }
    }).showToast();

    const ingredienteExistente = ingredientesSeleccionados.find(ingrediente => ingrediente.nombre === nombre);

    if (ingredienteExistente) {
        ingredienteExistente.cantidad += 1;
        actualizarModal();
    } else {
        const nuevoElemento = document.createElement("div");
        nuevoElemento.innerHTML = `
            <div class="d-flex justify-content-between">
                <p>${nombre} - Valor: ${valor}</p>
                <div>
                    <button class="btn btn-sm" onclick="restarCantidad('${nombre}')">-</button>
                    <span id="cantidad${nombre}">1</span>
                    <button class="btn btn-sm" onclick="sumarCantidad('${nombre}')">+</button>
                    <button class="btn btn-sm" onclick="eliminarIngrediente(this)"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `;
        carritoContenido.appendChild(nuevoElemento);

        ingredientesSeleccionados.push({ nombre, valor, cantidad: 1 });

        actualizarModal();
    }
}

function restarCantidad(nombre) {
    const ingrediente = ingredientesSeleccionados.find(ingrediente => ingrediente.nombre === nombre);
    if (ingrediente && ingrediente.cantidad > 1) {
        ingrediente.cantidad -= 1;
        // Actualizar el HTML del modal
        actualizarModal();
    }
}

function sumarCantidad(nombre) {
    const ingrediente = ingredientesSeleccionados.find(ingrediente => ingrediente.nombre === nombre);
    if (ingrediente) {
        ingrediente.cantidad += 1;
        // Actualizar el HTML del modal
        actualizarModal();
    }
}

function eliminarIngrediente(elemento) {
    const nombre = elemento.dataset.nombre;
    const valor = parseInt(elemento.dataset.valor);

    // Filtrar el array para eliminar el ingrediente
    ingredientesSeleccionados = ingredientesSeleccionados.filter(ingrediente => {
        return !(ingrediente.nombre === nombre && ingrediente.valor === valor);
    });

    // Actualizar el HTML del modal
    actualizarModal();
}

function actualizarModal() {
    carritoContenido.innerHTML = ""; // Limpiar el contenido actual
    const nuevosElementos = ingredientesSeleccionados.map(ingrediente => {
        return `
            <div class="d-flex justify-content-between">
                <p>${ingrediente.nombre} - Valor: ${ingrediente.valor}</p>
                <div>
                    <button class="btn btn-sm" onclick="restarCantidad('${ingrediente.nombre}')">-</button>
                    <span id="cantidad${ingrediente.nombre}">${ingrediente.cantidad}</span>
                    <button class="btn btn-sm" onclick="sumarCantidad('${ingrediente.nombre}')">+</button>
                    <button class="btn btn-sm" data-nombre="${ingrediente.nombre}" data-valor="${ingrediente.valor}" onclick="eliminarIngrediente(this)"><i class="fa-regular fa-trash-can"></i></button>
                </div>
            </div>
        `;
    });

    carritoContenido.innerHTML = nuevosElementos.join('');

    const totalPedido = actualizarCalculos();

    document.getElementById('resultadoModal').innerHTML = `
        <p>Total del Pedido: ${totalPedido}</p>
    `;
}

function limpiarCarrito() {
    carritoContenido.innerHTML = '';
    document.getElementById('resultadoModal').innerHTML = '';
    repetirPedidoModal.hide();
    localStorage.clear();
}

function finalizarPedido(deberCerrarModal = true) {
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Gracias por tu compra :)",
        showConfirmButton: false,
        timer: 2500
    });
    const elementosPedido = carritoContenido.querySelectorAll("p");
    const ingredientesPedido = Array.from(elementosPedido).map(elemento => {
        const nombreValorMatch = elemento.innerText.match(/([^\d]+) - Valor: (\d+)/);
        if (nombreValorMatch) {
            const ingrediente = { nombre: nombreValorMatch[1], valor: parseInt(nombreValorMatch[2]) };
            return ingrediente;
        }
    }).filter(ingrediente => ingrediente); 

    // Guardar el nombre y valor del último pedido en el localStorage como JSON
    localStorage.setItem('ultimoPedido', JSON.stringify(ingredientesPedido));

    if (deberCerrarModal) {
        carritoModal.hide();
    }
}

function finalizarPedidoA(deberCerrarModal = true) {
    Swal.fire({
        position: "center",
        icon: "success",
        title: "Gracias por tu compra :)",
        showConfirmButton: false,
        timer: 2500
    });

    if (deberCerrarModal) {
        repetirPedidoModal.hide();
    }
}

function actualizarCalculos() {
    const totalPedido = ingredientesSeleccionados.reduce((total, ingrediente) => {
        return total + ingrediente.valor * ingrediente.cantidad;
    }, 0);

    return totalPedido;
}

function mostrarModalRepetirPedido() {
    const ultimoPedidoJson = localStorage.getItem('ultimoPedido');

    if (ultimoPedidoJson) {
        try {
            const ultimoPedido = JSON.parse(ultimoPedidoJson);
            document.getElementById('repetirPedidoContenido').innerHTML = "";

            let totalPedido = 0;

            ultimoPedido.map(ingrediente => {
                const divIngrediente = document.createElement("div");
                divIngrediente.innerHTML = `<p>${ingrediente.nombre} - Valor: ${ingrediente.valor}</p>`;
                document.getElementById('repetirPedidoContenido').appendChild(divIngrediente);

                // Sumar al total del pedido
                totalPedido += ingrediente.valor;
            });

            // Mostrar el total del pedido
            document.getElementById('resultadoRepetirPedidoModal').innerHTML = `
                <p>Total del Pedido Anterior: ${totalPedido}</p>
            `;

            repetirPedidoModal.show();
        } catch (error) {
            console.error('Error al parsear la cadena JSON:', error);
            alert("Hubo un problema al cargar el pedido anterior. Por favor, intenta de nuevo.");
        }
    } else {
        alert("No hay un pedido anterior almacenado.");
    }
}

window.onload = async function () {
    await mostrarIngredientes();

    // Agregar evento al botón "Pedido Anterior"
    const botonPedidoAnterior = document.querySelector('.btn-outline-secondary[type="button"][onclick="mostrarModalRepetirPedido()"]');
    if (botonPedidoAnterior) {
        botonPedidoAnterior.addEventListener('click', mostrarModalRepetirPedido);
    }

    // Agregar evento al botón "Tu Pedido Aquí"
    const botonTuPedidoAqui = document.querySelector('.btn-outline-success[type="button"]');
    if (botonTuPedidoAqui) {
        botonTuPedidoAqui.addEventListener('click', function () {
            // Realizar cálculos y mostrar resultados cuando se abre el modal
            actualizarCalculos();
            carritoModal.show();
        });
    }

    // Agregar evento al botón "Finalizar PedidoA"
    const botonFinalizarPedidoA = document.querySelector('.btn-outline-danger[type="button"][onclick="finalizarPedido()"]');
    if (botonFinalizarPedidoA) {
        botonFinalizarPedido.addEventListener('click', finalizarPedido);
    }
};




