interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export function getWarehouses(products: Product[] | undefined): string[] {
  if (!products) return [];
  
  const warehouses = products.map((p) => p.warehouse);
  return Array.from(new Set(warehouses));
}
