import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchema } from '@/lib/validator'
import React, { useEffect, useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
import { Checkbox } from '@/components/ui/checkbox'
import Image from "next/image"
import ChooseDrinkModule from './ChooseDrinkModule'



const DrinksForm = ({ form, isCombo, baseFields, appendBase, removeBase }: { form: UseFormReturn<z.infer<typeof ProductFormSchema>>, isCombo: boolean, baseFields: any, appendBase: any, removeBase: any, }) => {
   let checkBoxValue = false;
   const [image, setImage] = useState<File>();
   useEffect(() => { form.setValue("product_img", image ? image.name : form.getValues("product_img") ?? undefined) }, [image])

   // console.log('basefield', baseFields);


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
                        <Input className="w-full" type="file" onChange={(e) => setImage(e.target.files ? e.target.files[0] : undefined)} />
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
                        <Input type='number' min={0} placeholder="product price" {...field} />
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>
         {!isCombo && <div className="flex flex-col gap-5 w-full md:flex-row">
            <FormField
               control={form.control}
               name="base_ingredient"
               render={({ field }) => (
                  <FormItem className='md:w-2/4'>
                     <FormLabel>Base Ingredient(optional)</FormLabel>
                     <FormControl>
                        <div className="flex flex-col flex-wrap gap-4">
                           {baseFields.map((field: any, index: any) => (
                              <div className='relative mt-1'>
                                 <div className='gap-1'>
                                    {(baseFields.length !== 0 && baseFields.length - 1 !== index) ?
                                       <div key={field.id} className="flex items-center px-1">
                                          <div className='flex items-center'><span className='text-sm font-semibold'>name: </span><Input className='bg-gray-200 ' type="text" placeholder="name"  {...form.register(`base_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} /></div>
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



                              </div>
                           ))}

                           <Button
                              type='button'
                              onClick={() => {
                                 let newBaseIngredient = { ing_name: '', ing_qty: 0, ing_unit: '', custom_marker: checkBoxValue };
                                 appendBase(newBaseIngredient);
                              }}

                           >add</Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
         </div>}
         <div className="flex flex-col gap-5 w-full md:flex-row">
            <ChooseDrinkModule isCombo={isCombo} form={form} />
         </div>

      </>
   )
}

export default DrinksForm