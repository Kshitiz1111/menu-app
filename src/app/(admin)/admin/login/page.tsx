import AdminLoginForm from "@/components/custom/form/AdminLoginForm"
import { cookies } from 'next/headers'
const AdminLogin = () => {
   // console.log("restaurant id", cookies().getAll())
   return (
      <div className="">
         <AdminLoginForm />
      </div>
   )
}

export default AdminLogin