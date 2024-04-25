"use client"
import { ProductFormSchema } from "@/lib/validator";
import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { z } from "zod";

interface singleDishContextType {
   product: string;
   setSingleDish: Dispatch<SetStateAction<string>>;
}
const singleDishContext = createContext<singleDishContextType | undefined>(undefined);;

export const SingleDishWrapper = ({ children }: { children: React.ReactNode }) => {
   let [product, setSingleDish] = useState("");
   return (
      <singleDishContext.Provider value={{ product, setSingleDish }}>
         {children}
      </singleDishContext.Provider>
   )
}

export const useSingleDishContext = () => useContext(singleDishContext);
