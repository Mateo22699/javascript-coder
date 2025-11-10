document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-cotizacion");
  const tipoSeguro = document.getElementById("tipoSeguro");
  const marca = document.getElementById("marca");
  const modelo = document.getElementById("modelo");
  const anio = document.getElementById("anio");
  const resultado = document.getElementById("resultado");
  const historial = document.getElementById("historial");
  const borrarHistorialBtn = document.getElementById("borrarHistorial");
  const loader = document.getElementById("loader");
  const campoCobertura = document.getElementById("campo-cobertura");
  const coberturaSelect = document.getElementById("cobertura");

  const precioBase = 100000;

  // Mostrar/ocultar cobertura según tipo de seguro
  tipoSeguro.addEventListener("change", () => {
    if (tipoSeguro.value === "auto") {
      campoCobertura.style.display = "block";
    } else {
      campoCobertura.style.display = "none";
      coberturaSelect.value = "";
    }
  });

  // Llenar años desde 2025 hasta 1990
  for (let i = 2025; i >= 1990; i--) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    anio.appendChild(option);
  }

  // Cargar marcas desde JSON
  async function cargarMarcas() {
    loader.classList.remove("oculto");
    try {
      const response = await fetch("json");
      await new Promise((resolve) => setTimeout(resolve, 3000));
      const data = await response.json();

      marca.innerHTML = `<option value="">Seleccioná una marca</option>`;
      data.marcas.forEach((m) => {
        const option = document.createElement("option");
        option.value = m;
        option.textContent = m;
        marca.appendChild(option);
      });
    } catch (error) {
      alert("Error al cargar las marcas. Intentalo nuevamente.");
    } finally {
      loader.classList.add("oculto");
    }
  }

  cargarMarcas();

  function guardarCotizacion(data) {
    const cotizaciones = JSON.parse(localStorage.getItem("historial")) || [];
    cotizaciones.push(data);
    localStorage.setItem("historial", JSON.stringify(cotizaciones));
  }

  function mostrarHistorial() {
    historial.innerHTML = "<h2>Historial de Cotizaciones</h2>";
    const cotizaciones = JSON.parse(localStorage.getItem("historial")) || [];
    cotizaciones.forEach((c) => {
      const div = document.createElement("div");
      div.classList.add("card");
      div.innerHTML = `
        <p><strong>Tipo:</strong> ${c.tipo}</p>
        ${c.tipo === "auto" ? `<p><strong>Marca:</strong> ${c.marca}</p>` : ""}
        ${c.tipo === "auto" ? `<p><strong>Modelo:</strong> ${c.modelo}</p>` : ""}
        ${c.tipo === "auto" ? `<p><strong>Año:</strong> ${c.anio}</p>` : ""}
        ${c.cobertura ? `<p><strong>Cobertura:</strong> ${c.cobertura}</p>` : ""}
        <p><strong>Precio:</strong> $${c.precioFinal}</p>
      `;
      historial.appendChild(div);
    });
  }

  function calcularPrecio(tipo, marca, anio, cobertura) {
    let precio = precioBase;

    switch (tipo) {
      case "auto":
        if (marca === "Toyota" || marca === "Volkswagen") precio += 30000;
        else if (marca === "Ford") precio += 20000;
        else precio += 15000;
        const antiguedad = 2025 - anio;
        precio -= antiguedad * 2000;

        // 🔹 Ajuste por tipo de cobertura
        if (cobertura === "completo") precio *= 1.25;
        else if (cobertura === "todo") precio *= 1.5;
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

    return Math.max(precio, 30000);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const tipo = tipoSeguro.value;
    const marcaSeleccionada = marca.value;
    const modeloSeleccionado = modelo.value;
    const anioSeleccionado = anio.value;
    const coberturaSeleccionada = coberturaSelect.value;

    if (!tipo) {
      alert("Seleccioná el tipo de seguro.");
      return;
    }

    const precioFinal = calcularPrecio(
      tipo,
      marcaSeleccionada,
      anioSeleccionado,
      coberturaSeleccionada
    );

    const cotizacion = {
      tipo,
      marca: marcaSeleccionada,
      modelo: modeloSeleccionado,
      anio: anioSeleccionado,
      cobertura: coberturaSeleccionada,
      precioFinal,
    };

    guardarCotizacion(cotizacion);

    resultado.innerHTML = `
      <div class="card">
        <h2>Resultado de cotización:</h2>
        <p><strong>Tipo:</strong> ${tipo}</p>
        ${tipo === "auto" ? `<p><strong>Marca:</strong> ${marcaSeleccionada}</p>` : ""}
        ${tipo === "auto" ? `<p><strong>Modelo:</strong> ${modeloSeleccionado}</p>` : ""}
        ${tipo === "auto" ? `<p><strong>Año:</strong> ${anioSeleccionado}</p>` : ""}
        ${coberturaSeleccionada ? `<p><strong>Cobertura:</strong> ${coberturaSeleccionada}</p>` : ""}
        <p><strong>Precio estimado:</strong> $${precioFinal}</p>
      </div>
    `;

    mostrarHistorial();
  });

  borrarHistorialBtn.addEventListener("click", () => {
    localStorage.removeItem("historial");
    historial.innerHTML = "";
    alert("Historial eliminado correctamente");
  });

  mostrarHistorial();
});
