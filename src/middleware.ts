import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "./lib/auth";

export async function middleware(request: NextRequest){
   const adminTkn:string | undefined = request.cookies.get('admin_auth_tkn')?.value;
   // console.log("middelware ran: ",adminTkn)
   const verifiedAdminTkn = adminTkn && 
   (await verifyAdminAuth(adminTkn).catch((err:any)=>{
      console.log(err)
   }))

   if(request.nextUrl.pathname.startsWith('/admin/login') && !verifiedAdminTkn){
      return
   }

   if(request.url.includes('/admin/login') && verifiedAdminTkn){
      return NextResponse.redirect(new URL('/admin', request.url))
   }

   if(!verifiedAdminTkn){
      return NextResponse.redirect(new URL('/admin/login', request.url))
   }
} 

export const config={
   matcher:['/admin/:path*']
}