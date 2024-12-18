import { object, z } from "zod"

export const AdminLoginType = z.object({
   email: z.string().email(),
   password: z.string(),
   remember: z.boolean()
})

export const ProductFormSchema = z.object({
   product_id:z.optional(z.number().or(z.string())),
   product_category: z.string(),
   product_price: z.number().min(1,{message:"enter valid price"}).or(z.string().min(1,{message:"price field empty"})),
   product_type: z.string(),
   diet_type: z.string(),
   product_img: z.string().or(z.undefined()),
   product_name: z.string().min(2, {
      message: "Product name must be at least 3 characters."
   }).max(20,{
      message: "Product name must be less than 20 characters."
   }),
   product_des: z.string().min(10, {
      message: "Product description must be at least 10 characters."
   }).max(100,{
      message: "Product description must be less than 100 characters."
   }),
   customer_note: z.optional(z.string()),
   total_quantity: z.optional(z.string().or(z.number())),
   total_price: z.optional(z.string().or(z.number())),
   purchase_order_id:z.optional(z.string()),
   purchase_confirm:z.optional(z.boolean()),
   base_ingredient: z.optional(
      z.array(
         z.object({
            ing_id:z.optional(z.string().or(z.number())),
            ing_name:z.string(),
            ing_qty:z.number().or(z.string()), 
            ing_unit:z.string(),
            custom_marker:z.optional(z.boolean()),
         })
      ),
   ),
   custom_ingredient: z.optional(
      z.array(
         z.object({
            ing_id:z.optional(z.string().or(z.number())),
            ing_name:z.string(),
            ing_qty:z.number().or(z.string()), 
            ing_unit:z.string(),
            ing_price:z.number().or(z.string())
         })
      )
   ),
   combo_drinks: z.optional(
      z.array(
         z.object({
            name: z.string(),
            product_type: z.string(),
            id: z.number().or(z.string()),
            combo_drinks_id:z.optional(z.number()),
            img_src: z.string(),
            description: z.string(),
            base_ingredient: z.optional(
               z.array(
                  z.object({
                    ing_id:z.optional(z.string().or(z.number())),
                    ing_name: z.string(),
                    ing_qty: z.number().or(z.string()),
                    ing_unit: z.string(),
                    custom_marker: z.boolean().optional().or(z.string()),
                  })
                )
            ),
            total_qty: z.number(),
            price: z.number().or(z.string()),
         })
      )
   ),
   combo_desserts: z.optional(
      z.array(
         z.object({
            name: z.string(),
            product_type: z.string(),
            id: z.number().or(z.string()),
            combo_dessert_id:z.optional(z.number()),
            img_src: z.string(),
            description: z.string(),
            base_ingredient: z.optional(
               z.array(
                  z.object({
                    ing_id:z.optional(z.string().or(z.number())),
                    ing_name: z.string(),
                    ing_qty: z.number().or(z.string()),
                    ing_unit: z.string(),
                    custom_marker: z.boolean().optional().or(z.string()),
                  })
                )
            ),
            total_qty: z.number(),
            price: z.number().or(z.string()),
         })
      )
   )
})


interface CustomerInfo {
   name: string;
   email: string;
   phone: string;
  }
  
  interface AmountBreakdown {
   label: string;
   amount: number;
  }
  
  interface ProductDetails {
   identity: string;
   name: string;
   total_price: number;
   quantity: number;
   unit_price: number;
  }
  
  export interface PaymentPayload {
   return_url: string;
   website_url: string;
   amount: number;
   purchase_order_id: string;
   purchase_order_name: string;
   customer_info: CustomerInfo;
   amount_breakdown: AmountBreakdown[];
   product_details: ProductDetails[];
   merchant_username: string;
   merchant_extra: string;
  }