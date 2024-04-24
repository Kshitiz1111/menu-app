"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchema } from '@/lib/validator'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const RegularDishForm = ({ form, hideCustom, baseFields, appendBase, removeBase, customFields, appendCustom, removeCustom }: { form: UseFormReturn<z.infer<typeof ProductFormSchema>>, hideCustom: boolean, baseFields: any, appendBase: any, removeBase: any, customFields: any, appendCustom: any, removeCustom: any }) => {
   let [checkBoxValue, setCheckBoxValue] = useState<boolean>(false);
   const [image, setImage] = useState<File>();

   const watchedBaseIngredients = form.watch('base_ingredient');
   const watchedCustomIngredients = form.watch('custom_ingredient');

   useEffect(() => {
      if (watchedBaseIngredients) {
         form.setValue(`base_ingredient.${watchedBaseIngredients?.length - 1}.custom_marker`, checkBoxValue);
      }
      console.log('sadf', form.getValues("product_img"))
      form.setValue("product_img", image ? image.name : form.getValues("product_img") ?? undefined)
   }, [checkBoxValue, watchedBaseIngredients, image])

   // console.log(watchedBaseIngredients, checkBoxValue)
   // console.log(watchedCustomIngredients)
   return (
      <>
         <div className="flex justify-between flex-col gap-5 md:flex-row">
            <FormField
               control={form.control}
               name="product_img"
               render={({ field }) => (
                  <FormItem className="w-full">
                     <FormLabel>Product Picture</FormLabel>
                     {form.getValues("product_img") &&
                        <div className="mt-4">
                           <Image
                              src={"/images/dish1.jpg"}
                              alt="Selected"
                              width={100}
                              height={100}
                              className='rounded-md'
                           />
                        </div>
                     }
                     <FormControl>
                        <Input
                           className="w-full"
                           type="file"
                           onChange={(e) => setImage(e.target.files ? e.target.files[0] : undefined)}
                        />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="product_name"
               render={({ field }) => (
                  <FormItem className="w-full">
                     <FormLabel>Product Name</FormLabel>
                     <FormControl>
                        <Input placeholder="product name" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         <div className="flex flex-col gap-5 md:flex-row">
            <FormField
               control={form.control}
               name="product_des"
               render={({ field }) => (
                  <FormItem className='w-full'>
                     <FormLabel>Product Discription</FormLabel>
                     <FormControl>
                        <Textarea placeholder="product descriiption" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         <div className="flex flex-col gap-5 md:flex-row">
            <FormField
               control={form.control}
               name="product_price"
               render={({ field }) => (
                  <FormItem className='w-full'>
                     <FormLabel>Product Price</FormLabel>
                     <FormControl>
                        <Input type='number' min={0} placeholder="product price" {...field} required />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         <div className="flex flex-col gap-10 w-full md:flex-row">
            <FormField
               control={form.control}
               name="base_ingredient"
               render={({ field }) => (
                  <FormItem className=''>
                     <FormLabel>Base Ingredient</FormLabel>
                     <FormControl>
                        <div className="flex flex-col flex-wrap gap-4">
                           {baseFields.map((field: any, index: any) => (
                              <div className='relative mt-1'>
                                 <div className='gap-1'>
                                    {(baseFields.length !== 0 && baseFields.length - 1 !== index) ?
                                       <div key={field.id} className="flex items-center px-1">
                                          <div className='flex items-center'><span className='text-sm font-semibold'>name: </span><Input className='bg-gray-200 ' type="text" placeholder="name" {...form.register(`base_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} /></div>
                                          <div className='flex items-center'><span className='text-sm font-semibold'>quantity: </span><Input className='bg-gray-200 ' type="number" placeholder="qty" {...form.register(`base_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} /></div>
                                          <div className='flex items-center'><span className='text-sm font-semibold'>unit: </span><Input className='bg-gray-200 ' type="text" placeholder="unit" {...form.register(`base_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} /></div>
                                       </div>
                                       :
                                       <div key={field.id} className="flex items-center gap-1">
                                          <Input type="text" placeholder="name" {...form.register(`base_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} />
                                          <Input type="number" placeholder="qty" {...form.register(`base_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} className="w-1/4" />
                                          <Input type="text" placeholder="unit" {...form.register(`base_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} className="w-1/4" />
                                       </div>

                                    }
                                    {(baseFields.length === 0 || index === baseFields.length - 1) ?
                                       ""
                                       : <button
                                          type="button"
                                          className='bg-red-500 p-1 rounded-md w-full hover:shadow-md text-white'
                                          onClick={() => baseFields.length > 1 && removeBase(index)}
                                       >Delete</button>
                                    }

                                 </div>

                                 {!hideCustom
                                    &&
                                    <>
                                       {(baseFields.length > 0 && index === baseFields.length - 1) ?

                                          <div className='flex gap-2 m-1 items-center'>

                                             <Checkbox
                                                className='w-5 h-5'
                                                onClick={() => setCheckBoxValue(!checkBoxValue)}
                                                {...form.register(`base_ingredient.${index}.custom_marker`)}
                                             />
                                             <FormDescription>mark as customizable</FormDescription>
                                          </div>
                                          : (watchedBaseIngredients && watchedBaseIngredients[index].custom_marker) ?
                                             <FormDescription className='absolute -top-5 right-0 font-semibold '>marked as customizable</FormDescription>
                                             : ""
                                       }
                                    </>

                                 }

                              </div>
                           ))}

                           <Button
                              type='button'
                              onClick={() => {
                                 if (watchedBaseIngredients) {
                                    if (watchedBaseIngredients.length > 0) {
                                       let newBaseIngredient = { ing_name: '', ing_qty: 0, ing_unit: '', custom_marker: checkBoxValue };

                                       // Check if the custom_marker of the last added item is true
                                       console.log(watchedBaseIngredients.length)
                                       if (checkBoxValue) {
                                          console.log("both")
                                          appendCustom({
                                             ing_name: watchedBaseIngredients[watchedBaseIngredients.length - 1].ing_name,
                                             ing_qty: 1,
                                             ing_unit: watchedBaseIngredients[watchedBaseIngredients.length - 1].ing_unit,
                                             ing_price: 0,
                                          });
                                          appendBase({ ...newBaseIngredient, custom_marker: checkBoxValue });
                                          setCheckBoxValue(!checkBoxValue);
                                       } else {
                                          console.log("hldf")
                                          appendBase(newBaseIngredient);
                                       }
                                    }
                                 }
                              }}

                           >add</Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />


            {!hideCustom &&
               <FormField
                  control={form.control}
                  name="custom_ingredient"
                  render={({ field }) => (
                     <FormItem className=''>
                        <FormLabel>Customizable Ingredient (optional)</FormLabel>
                        <FormControl>
                           <div className="flex flex-col flex-wrap gap-4">
                              <FormDescription>enter price for 1 unit(eg: name=onion qty=1 unit=slice price=2)  </FormDescription>
                              {customFields.map((field: any, index: any) => (
                                 <div className='flex flex-wrap items-center justify-center'>

                                    <div key={field.id} className="flex items-center gap-1">
                                       {(customFields.length !== 0 && customFields.length - 1 !== index) ?
                                          <div key={field.id} className="flex items-center px-1">
                                             <div className='flex items-center'>
                                                <span className='text-sm font-semibold'>name: </span>
                                                <Input className='bg-gray-200 ' type="text" placeholder="name" {...form.register(`custom_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} />
                                             </div>
                                             <div className='flex items-center'>
                                                <span className='text-sm font-semibold'>quantity: </span>
                                                <Input className='bg-gray-200 ' type="number" placeholder="qty" {...form.register(`custom_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} readOnly />
                                             </div>
                                             <div className='flex items-center'>
                                                <span className='text-sm font-semibold'>unit: </span>
                                                <Input className='bg-gray-200 ' type="text" placeholder="unit" {...form.register(`custom_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} />
                                             </div>
                                             <div className='flex items-center flex-start'>
                                                <span className='text-sm font-semibold'>price: </span>
                                                <Input className='bg-gray-200 ' type="number" placeholder="price" {...form.register(`custom_ingredient.${index}.ing_price`)} defaultValue={field.ing_price} />
                                             </div>

                                          </div>
                                          :
                                          <div key={field.id} className="flex-col items-center gap-8">
                                             <div className='flex items-center'>
                                                <Input type="text" placeholder="name" {...form.register(`custom_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} />
                                             </div>
                                             <div className="flex items-center">
                                                <Input type="number" placeholder="qty" {...form.register(`custom_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} className="w-1/3" readOnly />
                                                <Input type="text" placeholder="unit" {...form.register(`custom_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} className="w-1/3" />
                                                <Input type="number" placeholder="price" {...form.register(`custom_ingredient.${index}.ing_price`)} defaultValue={field.ing_price} className="w-1/3" />
                                             </div>
                                          </div>

                                       }

                                    </div>
                                    {(customFields.length === 0 || index === customFields.length - 1) ?
                                       ""
                                       : <button
                                          type="button"
                                          className='bg-red-500 0 p-1 rounded-md m-1 w-full hover:shadow-md text-white'
                                          onClick={() => customFields.length > 1 && removeCustom(index)}
                                       >Delete</button>
                                    }
                                    {/* <button
                                          type="button"
                                          onClick={() => customFields.length > 1 && removeCustom(index)}
                                          className='bg-red-500 0 p-1 rounded-md m-1 w-full hover:shadow-md text-white'
                                       >Delete</button> */}
                                 </div>
                              ))}

                              <Button type='button' onClick={() => appendCustom({ ing_name: '', ing_qty: 1, ing_unit: '', ing_price: 0 })}>add</Button>
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />
            }
         </div>
      </>
   )
}

export default RegularDishForm