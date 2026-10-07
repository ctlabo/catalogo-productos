interface Producto2 {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  stock: number;
}

interface Proyecto {
  id: number;
  nombre: string;
  tecnologias: string[];
}

interface Alumno {
  id: number;
  nombre: string;
  email?: string;
  proyecto: Proyecto | null;
}

