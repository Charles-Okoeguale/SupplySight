import React, { useMemo, useState } from 'react';
import { ChartLineMultiple } from './line-chart';
import ProductsTable from './products-table';
import Dropdown from './dropdown';
import { LoadingSpinner } from './ui/loading-spinner';
import { ErrorState } from './ui/error-state';
import { getWarehouses } from '@/utils';
import { Package, TrendingUp, Target, Search, RotateCcw } from 'lucide-react';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  isLoading?: boolean;
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
  isLoadingKpis?: boolean;
  isLoadingProducts?: boolean;
  kpiError?: unknown;
  productsError?: unknown;
}

const KpiCard: React.FC<KpiCardProps> = ({ label, value, icon, isLoading }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="text-sm font-medium text-gray-600 mb-1">{label}</div>
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <LoadingSpinner size="sm" />
              <span className="text-gray-400">Loading...</span>
            </div>
          ) : (
            <div className="text-2xl font-bold text-gray-900">{value}</div>
          )}
        </div>
        <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-lg">
          {icon}
        </div>
      </div>
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

const KpiDashboard = ({ 
  products, 
  timeSeries, 
  dateRange, 
  isLoadingKpis, 
  isLoadingProducts, 
  kpiError, 
  productsError 
}: KpiDashboardProps) => {
  const { totalStock, totalDemand, fillRate } = calculateKpis(products);

  const chartData = timeSeries?.map((item: KpiObject) => ({
    date: item.date,
    stock: item.stock,
    demand: item.demand,
  }));

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredProducts = useMemo(() => {
    return products?.filter((p) => {
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        const matches =
          p.id.toLowerCase().startsWith(lower) ||
          p.name.toLowerCase().startsWith(lower) ||
          p.sku.toLowerCase().startsWith(lower);
        if (!matches) return false;
      }

      if (selectedWarehouse && selectedWarehouse !== "Warehouses") {
        if (p.warehouse !== selectedWarehouse) return false;
      }

      const stock = Number(p.stock);
      const demand = Number(p.demand);

      if (selectedStatus && selectedStatus !== "Status") {
        let status: "Healthy" | "Low" | "Critical";
        if (stock > demand) status = "Healthy";    
        else if (stock === demand) status = "Low";    
        else status = "Critical"; 

        if (status !== selectedStatus) return false;
      }

      return true;
    });
  }, [products, searchTerm, selectedWarehouse, selectedStatus]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedWarehouse("");
    setSelectedStatus("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <KpiCard 
          label="Total Stock" 
          value={totalStock.toLocaleString()} 
          icon={<Package className="w-6 h-6 text-blue-600" />}
          isLoading={isLoadingProducts}
        />
        <KpiCard 
          label="Total Demand" 
          value={totalDemand.toLocaleString()} 
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
          isLoading={isLoadingProducts}
        />
        <KpiCard 
          label="Fill Rate" 
          value={`${fillRate}%`} 
          icon={<Target className="w-6 h-6 text-blue-600" />}
          isLoading={isLoadingProducts}
        />
      </div>

      <div className="mb-8">
        {kpiError ? (
          <ErrorState 
            title="Chart data unavailable"
            message={'Error loading Chart'}
            className="py-12"
          />
        ) : (
          <ChartLineMultiple 
            chartData={chartData} 
            dateRange={dateRange} 
            isLoading={isLoadingKpis}
          />
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, SKU, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Filter Dropdowns */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Dropdown
              value={selectedWarehouse}
              onChange={setSelectedWarehouse}
              options={getWarehouses(products)}
              placeholder="All Warehouses"
            />
            <Dropdown
              value={selectedStatus}
              onChange={setSelectedStatus}
              options={["Healthy", "Low", "Critical"]}
              placeholder="All Status"
            />
            
            <button
              onClick={resetFilters}
              className="flex items-center space-x-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {(searchTerm || selectedWarehouse || selectedStatus) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Search: "{searchTerm}"
              </span>
            )}
            {selectedWarehouse && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Warehouse: {selectedWarehouse}
              </span>
            )}
            {selectedStatus && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Status: {selectedStatus}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {productsError ? (
          <ErrorState 
            title="Products data unavailable"
            message={'Error loading product table'}
            className="py-12"
          />
        ) : (
          <ProductsTable 
            products={filteredProducts} 
            isLoading={isLoadingProducts}
          />
        )}
      </div>
    </div>
  );
};

export default KpiDashboard;