import {jwtVerify, SignJWT} from 'jose'
import { AdminJwtPayloadType } from '@/types/dish';

export const getAdminJwtSecretKey = () =>{
   const secret = process.env.JWT_ADMIN_SECRET_KEY;
   if(!secret || secret.length === 0){
      throw new Error("environment variable JWT_ADMIN_SECRET_KEY is not set.");
   }
   return secret;
}

export const verifyAdminAuth = async(tkn: string)=>{
   try {
      const verified = await jwtVerify(tkn, new TextEncoder().encode(getAdminJwtSecretKey())); 
      return verified.payload as AdminJwtPayloadType;
   } catch (error) {
      throw new Error("admin auth token expired.");
   }
}