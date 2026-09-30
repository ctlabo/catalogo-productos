# Catálogo de productos

Aplicación web para gestionar un inventario de productos. Cargá, buscá y controlá tu catálogo con filtros avanzados, resumen de inventario en tiempo real y una interfaz premium.

## Características

- **Formulario de alta**: Agregá productos con nombre, categoría, precio y stock.
- **Filtros avanzados**: Buscá por nombre, categoría, nivel de stock y precio máximo.
- **Resumen de inventario**: Métricas en tiempo real: cantidad de productos, unidades en stock, valor total del inventario y productos con stock bajo.
- **Listado interactivo**: Visualizá los productos en una grilla responsive con insignias de estado (en stock, stock bajo, sin stock).
- **Persistencia**: Los datos se guardan en `localStorage` del navegador.
- **Animaciones suaves**: Transiciones y entrances fluidas, respeta `prefers-reduced-motion`.
- **Diseño premium**: Componentes estilo shadcn/ui, fuente Inter, modo claro y oscuro automático.

## Requisitos

- Node.js y npm (para compilar TypeScript)
- Navegador moderno con soporte para ES2020

## Instalación

1. Cloná o descargá los archivos del proyecto.
2. Asegurate de tener la estructura correcta:
   ```
   .
   ├── index.html
   ├── estilos.css
   ├── tsconfig.json
   ├── src/
   │   └── index.ts
   └── dist/
       └── index.js (se genera tras compilar)
   ```

3. Compilá TypeScript:
   ```bash
   npx tsc
   ```
   Esto genera `dist/index.js` con la lógica de la aplicación.

4. Abrí `index.html` en el navegador.

## Uso

### Agregar un producto

1. Completá el formulario en el panel izquierdo:
   - **Nombre**: Nombre del producto (hasta 80 caracteres)
   - **Categoría**: Elegí entre Electrónica, Hogar, Indumentaria, Alimentos u Otros
   - **Precio**: Valor unitario en pesos
   - **Stock**: Cantidad disponible

2. Hacé click en **Agregar producto**. La tarjeta nueva aparecerá resaltada en la lista.

### Filtrar productos

Usá los campos en la parte superior del listado:

- **Nombre**: Buscá por nombre exacto (búsqueda parcial).
- **Categoría**: Filtrá por categoría específica o mostrá todas.
- **Stock**: 
  - "Con stock": Solo productos con unidades disponibles
  - "Stock bajo": Productos con 5 unidades o menos
  - "Sin stock": Solo productos agotados
- **Precio máximo**: Establecé un techo de precio (dejá vacío para sin límite)

Hacé click en **Limpiar filtros** para resetear todo.

### Eliminar un producto

En cada tarjeta, hacé click en el botón **Eliminar** para sacarlo del catálogo.

### Resumen de inventario

En la parte superior ves métricas actualizadas en tiempo real:
- **Productos**: Cantidad total de artículos
- **Unidades en stock**: Total de unidades disponibles
- **Valor del inventario**: Precio total de lo que tenés en stock
- **Con stock bajo**: Cuántos productos están bajo el umbral

## Estructura de archivos

```
.
├── index.html           # Estructura HTML, formulario y contenedores
├── estilos.css          # Estilos con tokens CSS y animaciones
├── tsconfig.json        # Configuración de TypeScript
├── src/
│   └── index.ts         # Lógica de la aplicación (TypeScript)
├── dist/
│   └── index.js         # Código compilado (generado)
└── README.md            # Este archivo
```

## Configuración

### Moneda

Por defecto usa pesos argentinos (ARS). Para cambiar:

En `src/index.ts`, buscá esta línea:
```typescript
const moneda = new Intl.NumberFormat("es-AR", {
```

Reemplazá `"es-AR"` por tu locale (ej: `"es-ES"` para España, `"en-US"` para USD).

### Stock bajo

El umbral por defecto es 5 unidades. Para cambiarlo:

En `src/index.ts`, buscá:
```typescript
const STOCK_BAJO = 5;
```

### Datos de ejemplo

Si querés cambiar los productos de ejemplo, editá el array `semilla` en `src/index.ts`:

```typescript
const semilla: Producto[] = [
  { id: "1", nombre: "...", categoria: "...", precio: 0, stock: 0 },
  // ...
];
```

Volvé a compilar con `npx tsc`.

## Notas

- **localStorage**: Los datos se guardan automáticamente en el navegador. Si borrás los datos de sitio, se perderán (pero se cargarán los datos de ejemplo).
- **Animaciones**: Se desactivan automáticamente si el sistema operativo tiene habilitada la opción de reducir movimiento.
- **Responsive**: La interfaz se adapta a pantallas pequeñas. En dispositivos mobiles, los filtros se apilan verticalmente.
- **Accesibilidad**: Todos los elementos tienen foco visible y soportan navegación por teclado.

## Desarrollo

Para hacer cambios:

1. Editá los archivos según necesites:
   - `src/index.ts`: Lógica y funcionalidad
   - `estilos.css`: Estilos y temas
   - `index.html`: Estructura

2. Compilá TypeScript:
   ```bash
   npx tsc
   ```

3. Recargá `index.html` en el navegador.

## Licencia

Uso libre. Adaptá y distribuí como consideres.