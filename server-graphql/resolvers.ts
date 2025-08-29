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
    }
    // transferStock: async (_: any, { id, from, to, qty }: any) => {
    //   const product = await ProductModel.findById(id);
    //   if (!product) throw new Error("Product not found");

    //   product.stock = ProductModel.stock - qty;
    //   return await product.save();
    // }
  }
};
