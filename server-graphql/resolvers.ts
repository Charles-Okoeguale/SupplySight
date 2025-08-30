import { format, subDays } from 'date-fns';
import { ProductModel } from './models/productModel.js';

export const resolvers = {
  Query: {
    products: async () => {
      return await ProductModel.find(); 
    },
    kpis: (_: any, { range }: { range: string }) => {
      const kpiData: any[] = [];
      let days = range === "7d" ? 7 : range === "14d" ? 14 : 30;

      for (let i = days - 1; i >= 0; i--) {
        const date = subDays(new Date(), i);
        kpiData.push({
          date: format(date, "yyyy-MM-dd"),
          stock: 15000 + Math.floor(Math.random() * 2000) - 1000,
          demand: 12500 + Math.floor(Math.random() * 1500) - 750,
        });
      }
      return kpiData;
    },
  },

  Mutation: {
    updateDemand: async (_: any, { id, demand }: { id: string; demand: number }) => {
      return await ProductModel.findOneAndUpdate(
        { id },
        { demand },
        { new: true }
      );
    },
    
    transferStock: async (_: any, { id, from, to, qty }: any) => {
        const product: any = await ProductModel.findOne({ id });   
        if (!product) {
            throw new Error("Product not found");
        }
        
        if (product.warehouse !== from) {
            throw new Error("Product not in source warehouse");
        }
        
        if (product.stock < qty) {
            throw new Error("Not enough stock to transfer");
        }

        product.stock -= qty;
        await product.save();

        let targetProduct = await ProductModel.findOne({ sku: product.sku, warehouse: to });
        if (!targetProduct) {
            targetProduct = new ProductModel({
                id: `${product.sku}-${to}`, 
                name: product.name,
                sku: product.sku,
                warehouse: to,
                stock: qty,
                demand: product.demand,
            });
        } else {
            targetProduct.stock += qty;
        }
        await targetProduct.save();
        return product;
    }
  }
};
