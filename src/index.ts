interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

const CLAVE = "catalogo:productos";
const STOCK_BAJO = 5;

const $ = <T extends HTMLElement>(id: string): T => document.getElementById(id) as T;

const moneda = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});
const entero = new Intl.NumberFormat("es-AR");

const semilla: Producto[] = [
  { id: "1", nombre: "Auriculares inalámbricos", categoria: "Electrónica", precio: 89900, stock: 14 },
  { id: "2", nombre: "Lámpara de escritorio", categoria: "Hogar", precio: 32500, stock: 4 },
  { id: "3", nombre: "Campera liviana", categoria: "Indumentaria", precio: 74000, stock: 0 },
  { id: "4", nombre: "Café de especialidad 1 kg", categoria: "Alimentos", precio: 21800, stock: 30 },
];

let productos: Producto[] = cargar();
let ultimoAgregado: string | null = null;

function cargar(): Producto[] {
  try {
    const guardado = localStorage.getItem(CLAVE);
    if (guardado) return JSON.parse(guardado) as Producto[];
  } catch {
    /* sin acceso a localStorage: se usan datos de ejemplo */
  }
  return semilla;
}

function guardar(): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(productos));
  } catch {
    /* ignorar */
  }
}

function escapar(texto: string): string {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function animarNumero(el: HTMLElement, hasta: number, formato: (n: number) => string): void {
  const desde = Number(el.dataset.valor ?? 0);
  el.dataset.valor = String(hasta);
  if (desde === hasta || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    el.textContent = formato(hasta);
    return;
  }
  const duracion = 600;
  const inicio = performance.now();
  const paso = (ahora: number) => {
    const t = Math.min((ahora - inicio) / duracion, 1);
    const suave = 1 - Math.pow(1 - t, 3);
    el.textContent = formato(desde + (hasta - desde) * suave);
    if (t < 1) requestAnimationFrame(paso);
  };
  requestAnimationFrame(paso);
}

function actualizarResumen(): void {
  const unidades = productos.reduce((suma, p) => suma + p.stock, 0);
  const valor = productos.reduce((suma, p) => suma + p.stock * p.precio, 0);
  const bajos = productos.filter((p) => p.stock <= STOCK_BAJO).length;
  animarNumero($("r-total"), productos.length, (n) => entero.format(Math.round(n)));
  animarNumero($("r-unidades"), unidades, (n) => entero.format(Math.round(n)));
  animarNumero($("r-valor"), valor, (n) => moneda.format(n));
  animarNumero($("r-bajo"), bajos, (n) => entero.format(Math.round(n)));
}

function filtrar(): Producto[] {
  const nombre = $<HTMLInputElement>("f-nombre").value.trim().toLowerCase();
  const categoria = $<HTMLSelectElement>("f-categoria").value;
  const stock = $<HTMLSelectElement>("f-stock").value;
  const precioTexto = $<HTMLInputElement>("f-precio").value;
  const maximo = precioTexto === "" ? Infinity : Number(precioTexto);

  return productos.filter((p) => {
    if (nombre && !p.nombre.toLowerCase().includes(nombre)) return false;
    if (categoria && p.categoria !== categoria) return false;
    if (p.precio > maximo) return false;
    if (stock === "con" && p.stock <= 0) return false;
    if (stock === "bajo" && !(p.stock > 0 && p.stock <= STOCK_BAJO)) return false;
    if (stock === "sin" && p.stock !== 0) return false;
    return true;
  });
}

function insignia(stock: number): string {
  if (stock === 0) return '<span class="badge badge-sin">Sin stock</span>';
  if (stock <= STOCK_BAJO) return '<span class="badge badge-bajo">Stock bajo</span>';
  return '<span class="badge badge-ok">En stock</span>';
}

function renderizar(): void {
  const lista = filtrar();
  const contenedor = $("lista");

  contenedor.innerHTML = lista
    .map(
      (p, i) => `
      <article class="card producto${p.id === ultimoAgregado ? " nuevo" : ""}" data-id="${p.id}" style="animation-delay:${Math.min(i, 8) * 40}ms">
        <div class="producto-top">
          <div>
            <span class="producto-cat">${escapar(p.categoria)}</span>
            <h3>${escapar(p.nombre)}</h3>
          </div>
          ${insignia(p.stock)}
        </div>
        <div class="producto-precio">${moneda.format(p.precio)}</div>
        <div class="producto-pie">
          <span>${entero.format(p.stock)} ${p.stock === 1 ? "unidad" : "unidades"}</span>
          <button type="button" class="btn btn-ghost btn-sm" data-eliminar="${p.id}">Eliminar</button>
        </div>
      </article>`
    )
    .join("");

  $("vacio").hidden = lista.length > 0;
  $("contador").textContent = `${lista.length} ${lista.length === 1 ? "resultado" : "resultados"}`;

  if (ultimoAgregado) {
    const tarjeta = contenedor.querySelector<HTMLElement>(`[data-id="${ultimoAgregado}"]`);
    tarjeta?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    ultimoAgregado = null;
  }
}

function refrescar(): void {
  actualizarResumen();
  renderizar();
}

// Alta de producto
$<HTMLFormElement>("form-producto").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.currentTarget as HTMLFormElement;
  const datos = new FormData(form);
  const nuevo: Producto = {
    id: crypto.randomUUID(),
    nombre: String(datos.get("nombre")).trim(),
    categoria: String(datos.get("categoria")),
    precio: Number(datos.get("precio")),
    stock: Math.floor(Number(datos.get("stock"))),
  };
  if (!nuevo.nombre) return;
  productos.unshift(nuevo);
  ultimoAgregado = nuevo.id;
  guardar();
  form.reset();
  $("nombre").focus();
  refrescar();
});

// Eliminar producto con salida suave
$("lista").addEventListener("click", (e) => {
  const boton = (e.target as HTMLElement).closest<HTMLElement>("[data-eliminar]");
  if (!boton) return;
  const id = boton.dataset.eliminar!;
  const tarjeta = boton.closest<HTMLElement>(".producto");
  tarjeta?.classList.add("saliendo");
  window.setTimeout(() => {
    productos = productos.filter((p) => p.id !== id);
    guardar();
    refrescar();
  }, 200);
});

// Filtros
["f-nombre", "f-categoria", "f-stock", "f-precio"].forEach((id) => {
  $(id).addEventListener("input", renderizar);
});

$("limpiar").addEventListener("click", () => {
  $<HTMLInputElement>("f-nombre").value = "";
  $<HTMLSelectElement>("f-categoria").value = "";
  $<HTMLSelectElement>("f-stock").value = "";
  $<HTMLInputElement>("f-precio").value = "";
  renderizar();
});

refrescar();

//boton de prueba
// Prueba de conexión con el botón y el párrafo
const botonPrueba = $<HTMLButtonElement>("boton-prueba");
const mensajePrueba = $<HTMLParagraphElement>("mensaje-prueba");
const buscador = document.querySelector<HTMLInputElement>("#busqueda");

botonPrueba.addEventListener("click", () => {
    mensajePrueba.textContent = "La conexión funciona";
    mensajePrueba.style.color = "#0f2";
});
if (buscador !== null && mensajePrueba !== null) {
  buscador.addEventListener("input", () => {
    mensajePrueba.textContent = "Estás buscando: " + buscador.value;
        mensajePrueba.style.color = "rgb(0, 0, 0)";

  });
}

// creacion de productos
const productoA: Producto2 = {
  id: 1,
  nombre: "Auriculares inalambricos",
  categoria: "electronica",
  precio: 89900,
  stock: 14
};
const productoB: Producto2 = {
  id: 2,
  nombre: "estanozolol",
  categoria: "suplementacion",
  precio: 55000,
  stock: 26
};
const productoC: Producto2 = {
  id: 3,
  nombre: "trembolona",
  categoria: "suplementacion",
  precio: 85000,
  stock: 8
};


//array de objetos
const productos_2: Producto2[] = [ 
  { id: 1, nombre: "Auriculares inalambricos", categoria: "electronica", precio: 89900, stock: 14 },
  { id: 2, nombre: "estanozolol", categoria: "suplementacion", precio: 55000, stock: 26 },
  { id: 3, nombre: "trembolona", categoria: "suplementacion", precio: 85000, stock: 8 },
  { id: 4, nombre: "RTX 4070ti", categoria: "informatica", precio: 700000, stock: 0 },
  { id: 5, nombre: "RAM DDR5 32g 7500mhz", categoria: "informatica", precio: 750000, stock: 1 }
]

console.log(productos_2)