import { saveOrders } from "@/lib/actions/order.action";
import { OrderType } from "@/types/orders";
import { throws } from "assert";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){
   try {
      if(req.method === "POST"){
         const result = await saveOrders(req.body);
         if(!result.success){
            res.json({ message: result });
            throw new Error("error on order handler: ", result.message);
         }
         res.json({ message: result });
      }
      if(req.method === "GET"){

      }
      if(req.method === "PUT"){

      }

      
   } catch (error:any) {
      console.log("error on order handler", error)
      res.status(500).json({error: error});
   }
}