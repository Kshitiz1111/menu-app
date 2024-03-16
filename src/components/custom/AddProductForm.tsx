"use client"
import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { ProductFormSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormDescription,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import RegularDishForm from './form/RegularDishForm'
import ComboDishForm from './form/ComboDishForm'
import DrinksForm from './form/DrinksForm'

const AddProductForm = () => {
   const [pType, setPType] = useState<string | undefined>();
   const [pCategory, setPCategory] = useState<string | undefined>();
   const [pDiet, setPDiet] = useState<string | undefined>();
   //set which formSchema is active

   // 1. Define your form.
   const form = useForm<z.infer<typeof ProductFormSchema>>({
      resolver: zodResolver(ProductFormSchema),
      // defaultValues: {
      //    product_category: "regular",
      //    product_type: "",
      //    diet_type: "",
      //    product_img: "",
      //    product_name: "",
      //    product_des: "",
      // },
   })

   const handleChange = (categoryName: string, categoryValue: string, field: any) => {
      // console.log(categoryName, categoryValue);
      if (categoryName === "product_type") setPType(categoryValue);
      if (categoryName === "product_category") setPCategory(categoryValue);
      if (categoryName === "diet_type") setPDiet(categoryValue);
      console.log("pType: ", pType, "pCategory: ", pCategory, "pDite: ", pDiet, field);
   }

   // 2. Define a submit handler.
   function onSubmit(values: z.infer<typeof ProductFormSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values)
   }
   return (
      <div className='p-4'>
         <div className="bg-gray-200 p-2 rounded-md">
            <h2 className="font-bold">AddProduct</h2>
            <div className="p-2">

               <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <div className="flex justify-between flex-col gap-5 md:flex-row">

                        <FormField
                           control={form.control}
                           name="product_type"
                           render={({ field }) => (
                              <FormItem className='p-2  w-full rounded-md border border-white'>
                                 <FormLabel>Product Type</FormLabel>
                                 <FormControl>
                                    <RadioGroup
                                       className="flex"
                                       onValueChange={(value) => {
                                          field.value = value;
                                          form.setValue("product_type", value);
                                          handleChange(field.name, field.value, field)
                                       }}

                                    >
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="starter" id="starter" />
                                          <Label htmlFor="starter">Starter</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="main" id="main" />
                                          <Label htmlFor="main">Main</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="dessert" id="dessert" />
                                          <Label htmlFor="dessert">Dessert</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="drinks" id="drinks" />
                                          <Label htmlFor="drinks">Drinks</Label>
                                       </div>
                                    </RadioGroup>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="product_category"
                           render={({ field }) => (
                              <FormItem className='p-2 w-full rounded-md border border-white'>
                                 <FormLabel>Product Category</FormLabel>
                                 <FormControl>
                                    <RadioGroup
                                       className="flex"
                                       onValueChange={(value) => {
                                          field.value = value;
                                          form.setValue("product_category", value);
                                          handleChange(field.name, field.value, field)
                                       }}
                                    >
                                       <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                             <RadioGroupItem value="regular" id="regular" />
                                          </FormControl>
                                          <Label htmlFor="regular">Regular</Label>
                                       </FormItem>
                                       <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                             <RadioGroupItem value="combo" id="combo" />
                                          </FormControl>
                                          <Label htmlFor="combo">Combo</Label>
                                       </FormItem>
                                       <FormItem className="flex items-center space-x-2">
                                          <FormControl>
                                             <RadioGroupItem value="special" id="special" />
                                          </FormControl>
                                          <Label htmlFor="special">Special</Label>
                                       </FormItem>
                                    </RadioGroup>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                        <FormField
                           control={form.control}
                           name="diet_type"
                           render={({ field }) => (
                              <FormItem className='p-2  w-full rounded-md border border-white'>
                                 <FormLabel>Diet Type</FormLabel>
                                 <FormControl>
                                    <RadioGroup
                                       className="flex"
                                       onValueChange={(value) => {
                                          field.value = value;
                                          form.setValue("diet_type", value);
                                          handleChange(field.name, field.value, field)
                                       }}
                                    >
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="veg" id="veg" />
                                          <Label htmlFor="veg">Veg</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="non-veg" id="non-veg" />
                                          <Label htmlFor="non-veg">Non-veg</Label>
                                       </div>
                                       <div className="flex items-center space-x-2">
                                          <RadioGroupItem value="vegan" id="vegan" />
                                          <Label htmlFor="vegan">Vegan</Label>
                                       </div>

                                    </RadioGroup>
                                 </FormControl>
                                 <FormMessage />
                              </FormItem>
                           )}
                        />
                     </div>
                     {
                        ((
                           pType === "starter"
                           || pType === "main"
                           || pType === "dessert"
                        ) && pCategory === "combo")
                           ? <ComboDishForm form={form} />
                           :
                           ((
                              pType === "starter"
                              || pType === "main"
                              || pType === "dessert"
                           ) && (pCategory === "regular" || pCategory === "special"))
                              ? (pType === "dessert")
                                 ? <RegularDishForm form={form} hideCustom={true} />
                                 : <RegularDishForm form={form} hideCustom={false} />
                              :
                              (
                                 pType === "drinks"
                                 && (pCategory === "regular" || pCategory === "special")
                              )
                                 ? <DrinksForm form={form} isCombo={false} />
                                 :
                                 (
                                    pType === "drinks"
                                    && pCategory === "combo"
                                 ) ? <DrinksForm form={form} isCombo={true} />
                                    : ""

                     }

                     <Button type="submit">Submit</Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   )
}

export default AddProductForm