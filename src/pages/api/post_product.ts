import { createProduct } from "@/lib/actions/product.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){

   try {
      if(req.method === 'POST'){
       const result = await createProduct(req.body)
        res.json({ message: result });
      }
      if(req.method === 'GET'){

      }

   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   
}