import React from 'react';
import { ChartLineMultiple } from './line-chart';
import ProductsTable from './products-table';

interface KpiCardProps {
  label: string;
  value: string | number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

interface KpiObject {
  __typename: 'KPI';
  date: string;
  stock: number;
  demand: number;
}

interface KpiDashboardProps {
  products: Product[] | undefined;
  timeSeries: KpiObject[] | undefined;
  dateRange: string;
}


const KpiCard: React.FC<KpiCardProps> = ({ label, value }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex-1 text-center">
      <div className="text-sm font-medium text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
    </div>
  );
};

const calculateKpis = (products: Product[] | undefined) => {
  if (!products || products.length === 0) {
    return {
      totalStock: 0,
      totalDemand: 0,
      fillRate: 0,
    };
  }

  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  const filledDemand = products.reduce((sum, product) => sum + Math.min(product.stock, product.demand), 0);
  const fillRate = totalDemand > 0 ? (filledDemand / totalDemand) * 100 : 0;

  return {
    totalStock,
    totalDemand,
    fillRate: fillRate.toFixed(2),
  };
};

const KpiDashboard = ({ products, timeSeries, dateRange }: KpiDashboardProps) => {
  const { totalStock, totalDemand, fillRate } = calculateKpis(products);
  console.log(products, "products")
  console.log(timeSeries, "timeSeries")

  const chartData = timeSeries?.map((item: KpiObject) => ({
    date: item.date,
    stock: item.stock,
    demand: item.demand,
  }));

  return (
    <div className="p-4">
      <div className="flex flex-col md:flex-row space-y-16 md:space-y-0 md:space-x-4">
        <KpiCard label="Total Stock" value={totalStock} />
        <KpiCard label="Total Demand" value={totalDemand} />
        <KpiCard label="Fill Rate" value={`${fillRate}%`} />
      </div>

      <div className="mt-8 w-[65%] mx-auto">
        <ChartLineMultiple chartData={chartData} dateRange={dateRange}/>
      </div>

      <div className="mt-8 flex flex-col justify-around md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="Search by name, SKU, ID"
          className="text-black border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          className="text-black border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option>Warehouses</option>
          <option>Warehouse A</option>
          <option>Warehouse B</option>
          <option>Warehouse C</option>
        </select>
        <select
          className="text-black border border-gray-300 rounded-lg px-3 py-2 w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option>Status</option>
          <option>Healthy</option>
          <option>Low</option>
          <option>Critical</option>
        </select>
      </div>

      <div className="mt-8">
        <ProductsTable products={products} />
      </div>
    </div>
  );
};

export default KpiDashboard;