import { PaymentPayload } from "../validator";

export const khaltiPay = async(payload:PaymentPayload)=>{
   try {
      let response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
         method: "POST",
         headers: {
            "Authorization": `key faec6057a16449a6ae2866e07b2935f6`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify(payload)
      })
       // Handle the response data as needed
       return response;

   } catch (error: any) {
      console.log("error in khalti test", error)
   }

}

export const paymentVerificationLookup = async(paymentId:string)=>{
   try {
      let response = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
         method: "POST",
         headers: {
            "Authorization": `key faec6057a16449a6ae2866e07b2935f6`,
            "Content-Type": "application/json"
         },
         body: JSON.stringify({pidx: paymentId})
      })
       // Handle the response data as needed
       return response;

   } catch (error: any) {
      console.log("error in khalti lookup", error)
   }
}