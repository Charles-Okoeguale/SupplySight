import React, { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { toast } from "sonner"

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

const ProductsTable: React.FC<ProductsTableProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [updateDemand, { loading: demandLoading }] = useMutation(UPDATE_DEMAND_MUTATION, {
    refetchQueries: ["Products"],
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
            toast.success("Demand updated successfully!")
            setSelectedProduct(null)
        } catch (err) {
            console.error(err);
            alert("error updating demand")
        }
    };

    const handleTransferStock = async () => {
        if (!selectedProduct) return;

        try {
            console.log({id: selectedProduct.id,
                from: selectedProduct.warehouse,
                to: toWarehouse,
                qty: transferQty
            })
            const { data } = await transferStock({
            variables: {
                id: selectedProduct.id,
                from: selectedProduct.warehouse,
                to: toWarehouse,
                qty: transferQty,
            },
            refetchQueries: ["Products"],
            });

            if (data?.transferStock.success) {
                toast.success(data.transferStock.message);
                setSelectedProduct(null);
            } else {
                toast.error(data?.transferStock.message || "Transfer failed");
            }
        } catch (err) {
            console.error(err);
            toast.error("Error transferring stock");
        }
    };

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border">
      <Drawer>
        <table className="min-w-full bg-white text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                SKU
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                Warehouse
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                Demand
              </th>
              <th className="py-3 px-6 text-left font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products?.map((product) => {
              const isHealthy = product.stock > product.demand;
              const isLow = product.stock === product.demand;
              const isCritical = product.stock < product.demand;

              return (
                <DrawerTrigger asChild key={product.id}>
                  <tr
                    className={`cursor-pointer ${
                      isCritical ? "bg-red-50" : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedProduct(product);
                      setNewDemand(product.demand);
                      setTransferQty(0);
                      setToWarehouse("");
                    }}
                  >
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{product.sku}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {product.warehouse}
                    </td>
                    <td className="py-4 px-6 text-gray-500">{product.stock}</td>
                    <td className="py-4 px-6 text-gray-500">
                      {product.demand}
                    </td>
                    <td className="py-4 px-6">
                      {isHealthy && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Healthy
                        </span>
                      )}
                      {isLow && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Low
                        </span>
                      )}
                      {isCritical && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
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
          <DrawerContent className="bg-white text-black">
            <div className="mx-auto w-full max-w-sm p-4">
              <DrawerHeader>
                <DrawerTitle>{selectedProduct.name}</DrawerTitle>
                <DrawerDescription>{selectedProduct.sku}</DrawerDescription>
              </DrawerHeader>

              <div className="space-y-4">
                <p>
                  <strong>ID:</strong> {selectedProduct.id}
                </p>
                <p>
                  <strong>Warehouse:</strong> {selectedProduct.warehouse}
                </p>
                <p>
                  <strong>Current Stock:</strong> {selectedProduct.stock}
                </p>
                <p>
                  <strong>Current Demand:</strong> {selectedProduct.demand}
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold">Update Demand</h3>
                <div className="flex items-center space-x-2">
                  <Label htmlFor="demand-input">New Demand:</Label>
                  <Input
                    id="demand-input"
                    type="number"
                    value={newDemand}
                    onChange={(e) => setNewDemand(Number(e.target.value))}
                  />
                  <Button
                    onClick={handleUpdateDemand}
                    disabled={demandLoading}
                  >
                    {demandLoading ? "Updating..." : "Update"}
                  </Button>
                </div>
              </div>

              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-bold">Transfer Stock</h3>
                <div className="space-y-2">
                  <Label htmlFor="transfer-qty">Quantity:</Label>
                  <Input
                    id="transfer-qty"
                    type="number"
                    value={transferQty}
                    onChange={(e) => setTransferQty(Number(e.target.value))}
                  />
                  <Label htmlFor="to-warehouse">To:</Label>
                  
                <Dropdown
                    value={toWarehouse}
                    onChange={setToWarehouse}
                    options={getWarehouses(products)}
                    placeholder="Select Warehouse"
                />
                </div>
                <Button
                  onClick={handleTransferStock}
                  disabled={transferLoading}
                >
                  {transferLoading ? "Transferring..." : "Transfer"}
                </Button>
              </div>
            </div>

            <DrawerFooter className="mt-4">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
};

export default ProductsTable;