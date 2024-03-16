import { object, z } from "zod"



export const ProductFormSchema = z.object({
   product_category: z.string(),
   product_type: z.string(),
   diet_type: z.string(),
   product_img: z.string(),
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
   base_ingredient: z.optional(
      z.array(
         z.object({
            ing_name:z.string(),
            ing_qty:z.number(), 
            ing_unit:z.string(),
            custom_marker:z.optional(z.boolean()),
         })
      ),
   ),
   custom_ingredient: z.optional(
      z.array(
         z.object({
            ing_name:z.string(),
            ing_qty:z.number(), 
            ing_unit:z.string(),
            ing_price:z.number()
         })
      )
   )

})

