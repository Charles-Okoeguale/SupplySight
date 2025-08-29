import React from 'react'
import TopBar from './components/top-bar'
import KpiDashboard from './components/kpi-cards'
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
  
  const { data: kpiData, loading: kpiLoading, error: kpiError } = useQuery<KpiQueryResponse>(GET_KPIS_QUERY, {
    variables: { range: dateRange },
  });
  const { data: productData, loading: productsLoading, error: productsError } = useQuery<ProductQueryResponse>(GET_PRODUCTS_QUERY);

  const ranges = [
    { label: '7d', value: '7d' },
    { label: '14d', value: '14d' },
    { label: '30d', value: '30d' },
  ];

  if (kpiLoading || productsLoading) return <p>Loading...</p>;
  if (kpiError || productsError) return <p>Error : {kpiError?.message || productsError?.message}</p>;

  return (
    <div>
      <TopBar setDateRange={setDateRange} ranges={ranges} dateRange={dateRange}/>
      <KpiDashboard products={productData?.products} timeSeries={kpiData?.kpis} dateRange={dateRange}/>
    </div>
  )
}

export default App
