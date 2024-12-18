'use client'
import AdminLoginForm from "@/components/custom/form/AdminLoginForm"
import { cookies } from 'next/headers'
import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const AdminLogin = () => {
   // console.log("restaurant id", cookies().getAll())
   return (
      <div className="">

         <DotLottieReact
            src="https://lottie.host/ca75d2b2-b0b2-4723-9a28-9255bcb7c516/GDTegXGNOg.lottie"
            loop
            autoplay
         />
         <AdminLoginForm />

      </div>
   )
}

export default AdminLogin