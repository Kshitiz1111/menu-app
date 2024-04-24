"use client"
import { ProductFormSchema } from "@/lib/validator";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { z } from "zod";

interface EditProductContextType {
   toBeEditedProduct: {
      product: string;
      productRawData: string;
   };
   setToBeEditedProduct: Dispatch<SetStateAction<{ product: string, productRawData: string }>>;
}
const EditProductContext = createContext<EditProductContextType | undefined>(undefined);;

export const EditProductContextWrapper = ({ children }: { children: React.ReactNode }) => {
   let [toBeEditedProduct, setToBeEditedProduct] = useState({ product: "", productRawData: "" });
   return (
      <EditProductContext.Provider value={{ toBeEditedProduct, setToBeEditedProduct }}>
         {children}
      </EditProductContext.Provider>
   )
}

export const useEditProductContext = () => useContext(EditProductContext);
