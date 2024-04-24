import { getAllDesserts } from "@/lib/actions/product.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){

   try {
      if(req.method === 'POST'){
      
      }
      if(req.method === 'GET'){
         const result = await getAllDesserts()
         
         res.json({ message: result });
      }

   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   
}