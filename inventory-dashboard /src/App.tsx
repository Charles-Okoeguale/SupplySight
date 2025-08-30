import React from 'react'
import TopBar from './components/top-bar'
import KpiDashboard from './components/kpi-cards'
import { LoadingState } from './components/ui/loading-spinner'
import { ErrorState } from './components/ui/error-state'
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const GET_KPIS_QUERY = gql`
  query GetKpis($range: String!) {
    kpis(range: $range) {
      date
      stock
      demand
    }
  }
`;

const GET_PRODUCTS_QUERY = gql`
  query GetProducts {
    products {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

interface ProductQueryResponse {
  products: Product[];
}

interface KpiObject {
  __typename: 'KPI';
  date: string;
  stock: number;
  demand: number;
}

interface KpiQueryResponse {
  kpis: KpiObject[];
}

function App() {
  const [dateRange, setDateRange] = React.useState('7d');
  
  const { data: kpiData, loading: kpiLoading, error: kpiError, refetch: refetchKpis } = useQuery<KpiQueryResponse>(GET_KPIS_QUERY, {
    variables: { range: dateRange },
    errorPolicy: 'all'
  });
  
  const { data: productData, loading: productsLoading, error: productsError, refetch: refetchProducts } = useQuery<ProductQueryResponse>(GET_PRODUCTS_QUERY, {
    errorPolicy: 'all'
  });

  const ranges = [
    { label: '7d', value: '7d' },
    { label: '14d', value: '14d' },
    { label: '30d', value: '30d' },
  ];

  const handleRetry = () => {
    refetchKpis();
    refetchProducts();
  };

  if ((kpiLoading || productsLoading) && !kpiData && !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar setDateRange={setDateRange} ranges={ranges} dateRange={dateRange} />
        <LoadingState message="Loading dashboard data..." className="min-h-[60vh]" />
      </div>
    );
  }

  if ((kpiError && productsError) && !kpiData && !productData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar setDateRange={setDateRange} ranges={ranges} dateRange={dateRange} />
        <ErrorState 
          title="Failed to load dashboard"
          message={kpiError?.message || productsError?.message || "Unable to fetch dashboard data. Please try again."}
          onRetry={handleRetry}
          className="min-h-[60vh]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar setDateRange={setDateRange} ranges={ranges} dateRange={dateRange} />
      <KpiDashboard 
        products={productData?.products} 
        timeSeries={kpiData?.kpis} 
        dateRange={dateRange}
        isLoadingKpis={kpiLoading}
        isLoadingProducts={productsLoading}
        kpiError={kpiError}
        productsError={productsError}
      />
    </div>
  )
}

export default App
