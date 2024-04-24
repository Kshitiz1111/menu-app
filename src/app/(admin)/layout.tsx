import AdminNav from "@/components/custom/AdminNav";
import '../globals.css'
import { EditProductContextWrapper } from "@/context/editProductContext";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <html>
         <body>
            <AdminNav />
            <EditProductContextWrapper>
               {children}
            </EditProductContextWrapper>
         </body>
      </html>

   )
}