import { getAllDesserts } from "@/lib/actions/product.action";
import { getRestaurantData } from "@/lib/actions/restaurant.action";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
   let restaurant_id: string = req.body
   console.log('helald',restaurant_id)
   if(restaurant_id){
      try {
      if(req.method === 'POST'){
         console.log("heloadf")
         const result = await getRestaurantData(restaurant_id);
         return res.json({ message: result });
         
      }
      if(req.method === 'GET'){
      }

   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   }
   
}