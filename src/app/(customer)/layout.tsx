import CustomerNav from "@/components/custom/CustomerNav";
import '../globals.css'
import { SingleDishWrapper } from "@/context/singleDishContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
   return (
      <html>
         <body>
            <CustomerNav />
            <SingleDishWrapper>
               {children}
            </SingleDishWrapper>


         </body>
      </html>

   )
}