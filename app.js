// Cotizador de seguros 

// Arrays con datos de ejemplo
const marcas = ["Toyota", "Ford", "Chevrolet", "Volkswagen", "Renault"];
const modelos = ["Sedán", "SUV", "Camioneta", "Hatchback"];

// Variables y constantes
const precioBase = 100000;
let marcaElegida, modeloElegido, año, tipoSeguro;

// Función para mostrar opciones con un ciclo
function mostrarOpciones(array) {
  let texto = "";
  for (let i = 0; i < array.length; i++) {
    texto += `${i + 1}. ${array[i]}\n`;
  }
  return texto;
}

// Función 
function cotizarSeguro() {
  alert("Bienvenido al cotizador de seguros!");

  // Elegir marca
  let marcaIndex = prompt(
    "Seleccioná la marca de tu vehículo:\n" + mostrarOpciones(marcas)
  );
  marcaElegida = marcas[marcaIndex - 1];

  // Validación
  if (!marcaElegida) {
    alert("Opción no válida. Intentalo de nuevo.");
    return;
  }

  // Elegir modelo
  let modeloIndex = prompt(
    "Seleccioná el modelo de tu vehículo:\n" + mostrarOpciones(modelos)
  );
  modeloElegido = modelos[modeloIndex - 1];

  if (!modeloElegido) {
    alert("Opción no válida. Intentalo de nuevo.");
    return;
  }

  // Año del auto
  anio = parseInt(prompt("Ingresá el año del vehículo (por ejemplo: 2018):"));
  if (isNaN(año)) {
    alert("Por favor ingresá un año válido.");
    return;
  }

  // Tipo de seguro
  let tipo = prompt("¿Qué tipo de seguro querés? (1 = Tercero completo, 2 = Todo Riesgo)");
  tipoSeguro = tipo === "1" ? "Tercero Completo" : "Todo Riesgo";

  // Calcular precio
  let precioFinal = calcularPrecio(marcaElegida, año, tipoSeguro);

  // resultado
  alert(
    `Resumen de tu cotización:\n
    Marca: ${marcaElegida}\n
    Modelo: ${modeloElegido}\n
    Año: ${año}\n
    Tipo de seguro: ${tipoSeguro}\n
    Precio estimado: $${precioFinal}`
  );

  console.log("Cotización generada:", {
    marca: marcaElegida,
    modelo: modeloElegido,
    año: año,
    tipo: tipoSeguro,
    precio: precioFinal,
  });
}

// Función que calcula el precio final
function calcularPrecio(marca, año, tipo) {
  let precio = precioBase;

  // Aumenta según marca
  if (marca === "Toyota" || marca === "Volkswagen") {
    precio += 30000;
  } else if (marca === "Ford") {
    precio += 20000;
  } else {
    precio += 15000;
  }

  // Descuento según año
  let antiguedad = 2025 - año;
  precio -= antiguedad * 2000;

  // Tipo de seguro
  if (tipo === "Todo Riesgo") {
    precio *= 1.5;
  }

  return precio;
}

// Confirmar para cotizar
let iniciar = confirm("¿Querés realizar una cotización?");
if (iniciar) {
  cotizarSeguro();
} else {
  alert("Gracias por visitar nuestra página de seguros.");
}
