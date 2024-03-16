import CustomerNav from "@/components/custom/CustomerNav";
import '../globals.css'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   return (
      <html>
         <body>
            <CustomerNav />
            {children}

         </body>
      </html>

   )
}