'use client'
import CartItem from "@/components/custom/CartItem"
import DishCard from "@/components/custom/DishCard"
import { Button } from "@/components/ui/button"
import { useSearchParams } from 'next/navigation'
import { useOrderContext } from '@/context/orderContext'
import type { orderContextType } from "@/context/orderContext"
import { useEffect, useState } from "react"
import { paymentVerificationLookup } from "@/lib/actions/payment.action"

interface TransactionDetails {
   pidx: string;
   oAuDJMmFVUzKnvgnpyySV7: string;
   transaction_id: string;
   tidx: string;
   amount: number;
   total_amount: number;
   mobile: string;
   status: string;
   purchase_order_id: string;
   purchase_order_name: string;
   username: string;
   extra: string;
}
interface toastInfoType {
   title: string;
   description: string;
   status: boolean;
}
const CustomerPage = () => {
   const searchParams = useSearchParams()
   let [toastInfo, setToastInfo] = useState<toastInfoType | undefined>(undefined);

   const context = useOrderContext()
   if (!context) {
      // Return null or some fallback UI
      return null;
   }
   const { orders, setOrders } = context as orderContextType;

   // Display the key/value pairs
   const entities = searchParams?.entries();
   if (entities) {
      const entriesArray = Array.from(entities);;
      const transactionDetails: TransactionDetails = entriesArray.reduce((acc: any, [key, value]) => {
         acc[key] = value;
         return acc;
      }, {});
      console.log(transactionDetails)
      const verifyPayment = async () => {
         const response = await paymentVerificationLookup(transactionDetails.pidx);
         const data = await response?.json();
         console.log("lookup data", data)
         if (!response?.ok) {
            if (data?.status === "Expired") {
               setToastInfo({
                  title: "Payment Link Expired!",
                  description: "please complete your transaction within 60min.",
                  status: false
               })
            }
            if (data?.status === "User canceled") {
               setToastInfo({
                  title: "Payment Canceled!",
                  description: "transaction has been successfully cancled, please try again later.",
                  status: false
               })
            }
         }
         if (data?.status === "Pending") {
            setToastInfo({
               title: "Payment Pending!",
               description: "please wait",
               status: true
            })
         }
         if (data?.status === "Refunded") {
            setToastInfo({
               title: "Payment Refunded!",
               description: "transaction has been refunded successfully.",
               status: true
            })
         }
         if (data?.status === "Partially refunded") {
            setToastInfo({
               title: "Payment Partially refunded!",
               description: "transaction has been partially refunded successfully.",
               status: true
            })
         }
         if (data?.status === "Completed") {
            setToastInfo({
               title: "Payment Successful!",
               description: "transaction has been successfully, thank you!.",
               status: true
            })
         }
      }
      //change purchase_confirm in order items
      const updatedOrders = orders.map((order, index) => {
         const isConditionMet = transactionDetails.purchase_order_id === order.purchase_order_id && transactionDetails.status === "Completed";

         // Return a new object that includes all properties of the original order and a new boolean property
         console.log(order.purchase_confirm, isConditionMet)
         return {
            ...order,
            purchase_confirm: (order.purchase_confirm === true) ? true : isConditionMet, // This is the new boolean property
         };
      });


      useEffect(() => {
         console.log("hello")
         setToastInfo(undefined)
         if (entities) {
            try {
               if (transactionDetails?.hasOwnProperty("pidx")) {
                  (async () => {
                     await verifyPayment();
                  })();
               }
               // Now, you can use setOrders to update your state with the new array
               setOrders(updatedOrders);
               let guestId = localStorage.getItem('guestId');

               const ordersWithUserId: any = {
                  orders: [...orders],
                  userId: guestId, // Use the guest ID for guests
               };

               const ordersString = JSON.stringify(ordersWithUserId);
               localStorage.setItem('orders', ordersString);
               console.log("totalOrder after edit from cart", ordersWithUserId,);

            } catch (error) {
               console.log("error", error)
            }
         }
      }, [])

      if (typeof window !== 'undefined' && transactionDetails?.hasOwnProperty("pidx")) {
         setTimeout(() => {
            window.history.pushState({}, document.title, "/" + "");
            console.log("time our run")
         }, 10000)
      }
   }

   return (
      <div className="p-2">
         {
            toastInfo &&
            <div className={`max-w-xs fixed bottom-4 border border-black right-4 bg-white text-black p-2 rounded-lg shadow-md flex gap-1 items-center justify-between ${toastInfo.status ? '' : 'border-red-500'}`}>
               <div>
                  <h3 className={`text-lg font-bold ${toastInfo.status ? '' : 'text-red-500'}`}>{toastInfo.title}</h3>
                  <p className="text-sm">{toastInfo.description}</p>
               </div>
               <button onClick={() => setToastInfo(undefined)} className={`bg-black text-white px-2 py-1 rounded-lg ${toastInfo.status ? '' : 'bg-red-500 text-white'}`}>
                  Close
               </button>
            </div>
         }
         <DishCard />
      </div>
   )
}

export default CustomerPage
