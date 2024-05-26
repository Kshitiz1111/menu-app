"use client"
import React, { useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { ProductFormSchema } from "@/lib/validator"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
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
import { useEditProductContext } from '@/context/editProductContext'

const UpdateProductForm = () => {

   const context = useEditProductContext();
   let toBeEditedProduct;
   console.log(toBeEditedProduct)
   // 1. Define your form.
   const form = useForm<z.infer<typeof ProductFormSchema>>({
      resolver: zodResolver(ProductFormSchema),
      defaultValues: JSON.parse(toBeEditedProduct?.product)
   })

   const { fields: baseFields, append: appendBase, remove: removeBase } = useFieldArray({
      control: form.control,
      name: 'base_ingredient',
   });
   const { fields: customFields, append: appendCustom, remove: removeCustom } = useFieldArray({
      control: form.control,
      name: 'custom_ingredient',
   });
   if (!context) {
      // Return null or some fallback UI
      return null;
   }
   toBeEditedProduct = context.toBeEditedProduct;

   const watchedBaseIngredients = form.watch('base_ingredient');
   // console.log('watch base', watchedBaseIngredients)
   const allValues = form.watch();
   // console.log('All form values', allValues);

   // const handleChange = (categoryName: string, categoryValue: string, field: any) => {
   //    // console.log(categoryName, categoryValue);
   //    if (categoryName === "product_type") setPType(categoryValue);
   //    if (categoryName === "product_category") setPCategory(categoryValue);
   //    if (categoryName === "diet_type") setPDiet(categoryValue);
   //    // console.log("pType: ", pType, "pCategory: ", pCategory, "pDite: ", pDiet, field);
   // }

   // 2. Define a submit handler.
   const onSubmit = async (values: z.infer<typeof ProductFormSchema>) => {
      console.log("product for update", values, JSON.parse(toBeEditedProduct.productRawData))
      values.base_ingredient = values?.base_ingredient?.map(item => ({
         ...item,
         ing_qty: (typeof (item.ing_qty) === "string") ? parseFloat(item.ing_qty) : item.ing_qty,
      }));

      try {
         let response = await fetch("/api/product", {
            method: 'PUT', // Specify the method
            headers: {
               'Content-Type': 'application/json' // Set the content type header
            },
            body: JSON.stringify(values) // Convert the JavaScript object to a JSON string
         })
         let result = await response.json();
         (result.message === "success") ? form.reset() : "";
      } catch (error) {
         console.log(error)
      }
   }
   // console.log("tobeupdate", form.getValues());

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
                                       {...field}

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
                                       {...field}
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
                                       {...field}
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
                           form.getValues("product_type") === "starter"
                           || form.getValues("product_type") === "main"
                           || form.getValues("product_type") === "dessert"
                        ) && form.getValues("product_category") === "combo")
                           ? <ComboDishForm
                              form={form}
                              baseFields={baseFields}
                              appendBase={appendBase}
                              removeBase={removeBase}
                           />
                           :
                           ((
                              form.getValues("product_type") === "starter"
                              || form.getValues("product_type") === "main"
                              || form.getValues("product_type") === "dessert"
                           ) && (form.getValues("product_category") === "regular" || form.getValues("product_category") === "special"))
                              ? (form.getValues("product_type") === "dessert")
                                 ? <RegularDishForm
                                    form={form}
                                    hideCustom={true}
                                    baseFields={baseFields}
                                    appendBase={appendBase}
                                    removeBase={removeBase}
                                    customFields={customFields}
                                    appendCustom={appendCustom}
                                    removeCustom={removeCustom}
                                 />
                                 : <RegularDishForm
                                    form={form}
                                    hideCustom={false}
                                    baseFields={baseFields}
                                    appendBase={appendBase}
                                    removeBase={removeBase}
                                    customFields={customFields}
                                    appendCustom={appendCustom}
                                    removeCustom={removeCustom}
                                 />
                              :
                              (
                                 form.getValues("product_type") === "drinks"
                                 && (form.getValues("product_category") === "regular" || form.getValues("product_category") === "special")
                              )
                                 ? <DrinksForm
                                    form={form}
                                    isCombo={false}
                                    baseFields={baseFields}
                                    appendBase={appendBase}
                                    removeBase={removeBase}
                                 />
                                 :
                                 (
                                    form.getValues("product_type") === "drinks"
                                    && form.getValues("product_category") === "combo"
                                 ) ? <DrinksForm
                                    form={form}
                                    isCombo={true}
                                    baseFields={baseFields}
                                    appendBase={appendBase}
                                    removeBase={removeBase}
                                 />
                                    : ""

                     }

                     <Button type="submit" disabled={!form.formState.isValid}>Update</Button>
                  </form>
               </Form>
            </div>
         </div>
      </div>
   )
}

export default UpdateProductForm