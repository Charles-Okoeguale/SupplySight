import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from "sonner"
import { LoadingSpinner } from './ui/loading-spinner';
import { Package, Edit, ArrowRightLeft, AlertTriangle, X } from 'lucide-react';

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Dropdown from './dropdown';
import { getWarehouses } from '@/utils';

interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

interface ProductsTableProps {
  products: Product[] | undefined;
  isLoading?: boolean;
}

interface TransferStockResult {
  transferStock: {
    success: boolean;
    message?: string;
  };
}

const UPDATE_DEMAND_MUTATION = gql`
  mutation UpdateDemand($id: ID!, $demand: Int!) {
    updateDemand(id: $id, demand: $demand) {
      id
      demand
    }
  }
`;

const TRANSFER_STOCK_MUTATION = gql`
  mutation TransferStock($id: ID!, $from: String!, $to: String!, $qty: Int!) {
    transferStock(id: $id, from: $from, to: $to, qty: $qty) {
      success
      message
    }
  }
`;

const ProductsTable: React.FC<ProductsTableProps> = ({ products, isLoading }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updateDemand, { loading: demandLoading }] = useMutation(UPDATE_DEMAND_MUTATION, {
    refetchQueries: ["GetProducts"],
  });
  const [transferStock, { loading: transferLoading }] = useMutation<TransferStockResult>(TRANSFER_STOCK_MUTATION);

  const [newDemand, setNewDemand] = useState<number>(0);
  const [transferQty, setTransferQty] = useState<number>(0);
  const [toWarehouse, setToWarehouse] = useState<string>('');

    const handleUpdateDemand = async () => {
        if (!selectedProduct) return;
        try {
            await updateDemand({
                variables: { id: selectedProduct.id, demand: newDemand },
            });
            toast.success("Demand updated successfully!", {
              description: `Updated demand for ${selectedProduct.name} to ${newDemand}`
            });
            setSelectedProduct(null)
        } catch (err) {
            console.error(err);
            toast.error("Failed to update demand", {
              description: err instanceof Error ? err.message : "An unexpected error occurred"
            });
        }
    };

    const handleTransferStock = async () => {
        if (!selectedProduct) return;

        try {
            const { data } = await transferStock({
            variables: {
                id: selectedProduct.id,
                from: selectedProduct.warehouse,
                to: toWarehouse,
                qty: transferQty,
            },
            refetchQueries: ["GetProducts"],
            });

            if (data?.transferStock.success) {
                toast.success("Stock transferred successfully!", {
                  description: `Transferred ${transferQty} units from ${selectedProduct.warehouse} to ${toWarehouse}`
                });
                setSelectedProduct(null);
            } else {
                toast.error("Transfer failed", {
                  description: data?.transferStock.message || "Unknown error occurred"
                });
            }
        } catch (err) {
            console.error(err);
            toast.error("Error transferring stock", {
              description: err instanceof Error ? err.message : "An unexpected error occurred"
            });
        }
    };

  if (isLoading) {
    return (
      <div className="overflow-hidden">
        <div className="animate-pulse">
          <div className="bg-gray-50 px-6 py-3">
            <div className="flex space-x-4">
              <div className="h-4 bg-gray-300 rounded w-24"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-20"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="px-6 py-4">
                <div className="flex space-x-4">
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="w-12 h-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Drawer>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Demand
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => {
              const isHealthy = product.stock > product.demand;
              const isLow = product.stock === product.demand;
              const isCritical = product.stock < product.demand;

              return (
                <DrawerTrigger asChild key={product.id}>
                  <tr
                    className={`cursor-pointer transition-colors duration-150 ${
                      isCritical 
                        ? "bg-red-50 hover:bg-red-100" 
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setNewDemand(product.demand);
                      setTransferQty(0);
                      setToWarehouse("");
                    }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.warehouse}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.stock.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.demand.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {isHealthy && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></div>
                          Healthy
                        </span>
                      )}
                      {isLow && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          <div className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></div>
                          Low
                        </span>
                      )}
                      {isCritical && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Critical
                        </span>
                      )}
                    </td>
                  </tr>
                </DrawerTrigger>
              );
            })}
          </tbody>
        </table>

        {selectedProduct && (
          <DrawerContent className="bg-white text-black max-w-md mx-auto">
            {/* Close Button - Top Right */}
            <div className="absolute top-4 right-4 z-10">
              <DrawerClose asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </DrawerClose>
            </div>

            <div className="p-6 pb-8">
              <DrawerHeader className="px-0 pr-8">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <DrawerTitle className="text-lg font-semibold">{selectedProduct.name}</DrawerTitle>
                    <DrawerDescription className="text-sm text-gray-500">{selectedProduct.sku}</DrawerDescription>
                  </div>
                </div>
              </DrawerHeader>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">ID:</span>
                    <p className="font-medium">{selectedProduct.id}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Warehouse:</span>
                    <p className="font-medium">{selectedProduct.warehouse}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Stock:</span>
                    <p className="font-medium">{selectedProduct.stock.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Current Demand:</span>
                    <p className="font-medium">{selectedProduct.demand.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Edit className="h-4 w-4 text-gray-600" />
                  <h3 className="text-base font-semibold">Update Demand</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="demand-input" className="text-sm font-medium">New Demand</Label>
                    <Input
                      id="demand-input"
                      type="number"
                      value={newDemand}
                      onChange={(e) => setNewDemand(Number(e.target.value))}
                      className="mt-1"
                      min="0"
                    />
                  </div>
                  <Button
                    onClick={handleUpdateDemand}
                    disabled={demandLoading}
                    className="w-full"
                    size="sm"
                  >
                    {demandLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4 mr-2" />
                        Update Demand
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <ArrowRightLeft className="h-4 w-4 text-gray-600" />
                  <h3 className="text-base font-semibold">Transfer Stock</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="transfer-qty" className="text-sm font-medium">Quantity to Transfer</Label>
                    <Input
                      id="transfer-qty"
                      type="number"
                      value={transferQty}
                      onChange={(e) => setTransferQty(Number(e.target.value))}
                      className="mt-1"
                      min="0"
                      max={selectedProduct.stock}
                    />
                  </div>
                  <div>
                    <Label htmlFor="to-warehouse" className="text-sm font-medium">Destination Warehouse</Label>
                    <div className="mt-1">
                      <Dropdown
                        value={toWarehouse}
                        onChange={setToWarehouse}
                        options={getWarehouses(products)?.filter(w => w !== selectedProduct.warehouse)}
                        placeholder="Select destination warehouse"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={handleTransferStock}
                    disabled={transferLoading || !toWarehouse || transferQty <= 0 || transferQty > selectedProduct.stock}
                    className="w-full"
                    size="sm"
                  >
                    {transferLoading ? (
                      <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Transferring...
                      </>
                    ) : (
                      <>
                        <ArrowRightLeft className="h-4 w-4 mr-2" />
                        Transfer Stock
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

                      </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default ProductsTable;