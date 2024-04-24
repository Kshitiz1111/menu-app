import { createProduct, deleteProduct, getAllProduct, updateProduct } from "@/lib/actions/product.action";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){

   try {
      if(req.method === 'POST'){
       const result = await createProduct(req.body)
        res.json({ message: result });
      }
      if(req.method === 'GET'){
         const result = await getAllProduct()
         res.json({ message: result });
      }
      if(req.method === 'PUT'){
         const result = await updateProduct(req.body);
         res.json({ message: result });
      }if(req.method === 'DELETE'){
         // Access the product ID from the URL using req.query
         const productId = req.body.productId as string;
         console.log(productId)
         const result = await deleteProduct(productId);
         res.json({ message: result });
      }

   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   
}