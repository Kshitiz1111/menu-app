import { getAllDrinks } from "@/lib/actions/product.action";
import { NextApiRequest, NextApiResponse } from "next";
import cookie from "cookie"
export default async function handler(req:NextApiRequest, res:NextApiResponse){

   try {
      // cookies().set("restaurant_id", req.body.restaurant_id)
      res.setHeader('Set-Cookie', cookie.serialize("restaurant_id", req.body.restaurant_id,{
         httpOnly: true,
         path: '/',
         secure: process.env.NODE_ENV === 'production'
      }));
      // if(req.method === 'POST'){
      
      // }
      // if(req.method === 'GET'){
        
         
      //    res.json({ message: result });
      // }
      res.json({message: "restaurnat set"})

   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   
}