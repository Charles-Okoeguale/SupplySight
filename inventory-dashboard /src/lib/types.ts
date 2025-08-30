export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading?: boolean;
}

export interface TransferStockResult {
  transferStock: Product
}


export interface RangeOption {
  label: string;
  value: string;
}

export interface TopBarProps {
  dateRange: string;
  setDateRange: (range: string) => void;
  ranges: RangeOption[];
}

export interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface KpiObject {
  __typename: 'KPI';
  date: string;
  stock: number;
  demand: number;
}

export interface KpiDashboardProps {
  products: Product[] | undefined;
  timeSeries: KpiObject[] | undefined;
  dateRange: string;
  isLoadingKpis?: boolean;
  isLoadingProducts?: boolean;
  kpiError?: unknown;
  productsError?: unknown;
}