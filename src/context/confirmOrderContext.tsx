"use client"
import { ProductFormSchema } from "@/lib/validator";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { z } from "zod";

export type confirmOrderContextType = {

}
const ConfirmOrderContext = createContext<confirmOrderContextType | []>([]);;

// Function to load orders from localStorage
const loadOrdersFromLocalStorage = () => {
   // Check if the code is running in a browser environment
   if (typeof window !== 'undefined') {
      const ordersString = localStorage.getItem('confirmOrders');

      return ordersString ? JSON.parse(ordersString).orders : [];
   }
   // Return an empty array if the code is not running in a browser environment
   return [];
};


export const ConfirmOrderWrapper = ({ children }: { children: React.ReactNode }) => {
   let [confirmOrders, setConfirmOrders] = useState<z.infer<typeof ProductFormSchema>[] | []>(loadOrdersFromLocalStorage());
   return (
      <ConfirmOrderContext.Provider value={{ confirmOrders, setConfirmOrders }}>
         {children}
      </ConfirmOrderContext.Provider>
   )
}

export const useConfirmOrderContext = () => useContext(ConfirmOrderContext);
