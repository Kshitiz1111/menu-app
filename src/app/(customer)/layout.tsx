import CustomerNav from "@/components/custom/CustomerNav";
import '../globals.css'
import { OrderWrapper } from "@/context/orderContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   return (
      <html>
         <body>
            <OrderWrapper>
               <CustomerNav />
               {children}
            </OrderWrapper>
         </body>
      </html>

   )
}