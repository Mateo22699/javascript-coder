document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cotizacion");
  const tipoSeguro = document.getElementById("tipoSeguro");
  const marca = document.getElementById("marca");
  const modelo = document.getElementById("modelo");
  const anio = document.getElementById("anio");
  const resultado = document.getElementById("resultado");
  const historial = document.getElementById("historial");
  const borrarHistorialBtn = document.getElementById("borrarHistorial");

  const precioBase = 100000;

  // Llenar años desde 2025 hasta 1990
  for (let i = 2025; i >= 1990; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    anio.appendChild(option);
  }

  // Guardar cotización en localStorage
  function guardarCotizacion(data) {
    const cotizaciones = JSON.parse(localStorage.getItem("historial")) || [];
    cotizaciones.push(data);
    localStorage.setItem("historial", JSON.stringify(cotizaciones));
  }

  // Mostrar historial
  function mostrarHistorial() {
    historial.innerHTML = "<h2>Historial de Cotizaciones</h2>";
    const cotizaciones = JSON.parse(localStorage.getItem("historial")) || [];
    cotizaciones.forEach(c => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <p><strong>Tipo:</strong> ${c.tipo}</p>
        ${c.tipo === "auto" ? `<p><strong>Marca:</strong> ${c.marca}</p>` : ""}
        ${c.tipo === "auto" ? `<p><strong>Modelo:</strong> ${c.modelo}</p>` : ""}
        ${c.tipo === "auto" ? `<p><strong>Año:</strong> ${c.anio}</p>` : ""}
        <p><strong>Precio:</strong> $${c.precioFinal}</p>
      `;
      historial.appendChild(div);
    });
  }

  // Calcular precio
  function calcularPrecio(tipo, marca, anio) {
    let precio = precioBase;

    switch (tipo) {
      case "auto":
        if (marca === "Toyota" || marca === "Volkswagen") precio += 30000;
        else if (marca === "Ford") precio += 20000;
        else precio += 15000;
        const antiguedad = 2025 - anio;
        precio -= antiguedad * 2000;
        break;
      case "hogar":
        precio *= 1.3;
        break;
      case "vida":
        precio *= 1.5;
        break;
      case "comercio":
        precio *= 1.8;
        break;
      default:
        precio *= 1.1;
    }

    return Math.max(precio, 30000); // evita que sea negativo
  }

  // Evento submit
  form.addEventListener("submit", e => {
    e.preventDefault();

    const tipo = tipoSeguro.value;
    const marcaSeleccionada = marca.value;
    const modeloSeleccionado = modelo.value;
    const anioSeleccionado = anio.value;

    if (!tipo) {
      alert("Seleccioná el tipo de seguro.");
      return;
    }

    const precioFinal = calcularPrecio(tipo, marcaSeleccionada, anioSeleccionado);

    const cotizacion = { tipo, marca: marcaSeleccionada, modelo: modeloSeleccionado, anio: anioSeleccionado, precioFinal };

    guardarCotizacion(cotizacion);

    resultado.innerHTML = `
      <div class="card">
        <h2>Resultado de cotización:</h2>
        <p><strong>Tipo:</strong> ${tipo}</p>
        ${tipo === "auto" ? `<p><strong>Marca:</strong> ${marcaSeleccionada}</p>` : ""}
        ${tipo === "auto" ? `<p><strong>Modelo:</strong> ${modeloSeleccionado}</p>` : ""}
        ${tipo === "auto" ? `<p><strong>Año:</strong> ${anioSeleccionado}</p>` : ""}
        <p><strong>Precio estimado:</strong> $${precioFinal}</p>
      </div>
    `;

    mostrarHistorial();
  });

  // Botón borrar historial
  borrarHistorialBtn.addEventListener("click", () => {
    localStorage.removeItem("historial");
    historial.innerHTML = "";
    alert("Historial eliminado correctamente");
  });

  mostrarHistorial();
});
