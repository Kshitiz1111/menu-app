import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse){

   try {
      if(req.method === 'POST'){
      
      }
   } catch (error) {
      console.log(error);
      res.status(500).json({error: error});
   }
   
}