import AdminNav from "@/components/custom/AdminNav";
import '../globals.css'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
   return (
      <html>
         <body>
            <AdminNav />
            {children}

         </body>
      </html>

   )
}