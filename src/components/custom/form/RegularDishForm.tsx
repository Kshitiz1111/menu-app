"use client"
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchema } from '@/lib/validator'
import React, { useEffect, useState } from 'react'
import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'

const RegularDishForm = ({ form, hideCustom }: { form: UseFormReturn<z.infer<typeof ProductFormSchema>>, hideCustom: boolean }) => {
   const { register, control, watch, handleSubmit, setValue, formState: { errors } } = useForm({
      defaultValues: {
         base_ingredient: [{ ing_name: '', ing_qty: 1, ing_unit: '', custom_marker: false }],
         custom_ingredient: [{ ing_name: '', ing_qty: 1, ing_unit: '', ing_price: 0 }],

      },
   });

   const { fields: baseFields, append: appendBase, remove: removeBase } = useFieldArray({
      control,
      name: 'base_ingredient',
   });
   const watchedBaseIngredients = watch('base_ingredient');

   console.log(watchedBaseIngredients)
   const { fields: customFields, append: appendCustom, remove: removeCustom } = useFieldArray({
      control,
      name: 'custom_ingredient',
   });

   return (
      <>
         <div className="flex justify-between flex-col gap-5 md:flex-row">
            <FormField
               control={form.control}
               name="product_img"
               render={({ field }) => (
                  <FormItem className="w-full">
                     <FormLabel>Product Picture</FormLabel>
                     <FormControl>
                        <Input className="w-full" type="file" {...field} />
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
         <div className="flex flex-col gap-5 w-full md:flex-row">
            <FormField
               control={form.control}
               name="base_ingredient"
               render={({ field }) => (
                  <FormItem className='md:w-2/4'>
                     <FormLabel>Base Ingredient</FormLabel>
                     <FormControl>
                        <div className="flex flex-col flex-wrap gap-4">
                           {baseFields.map((field, index) => (
                              <>
                                 <div key={field.id} className="flex items-center gap-1">
                                    <Input type="text" placeholder="name" {...register(`base_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} />
                                    <Input type="number" placeholder="qty" {...register(`base_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} className="w-1/4" />
                                    <Input type="text" placeholder="unit" {...register(`base_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} className="w-1/4" />

                                    <button type="button" onClick={() => baseFields.length > 1 && removeBase(index)}>Delete</button>
                                 </div>
                                 {!hideCustom && <div className='flex gap-2 items-center'>
                                    <Checkbox className='w-5 h-5' {...register(`base_ingredient.${index}.custom_marker`)} />
                                    <FormDescription>mark as customizable</FormDescription>
                                 </div>}

                              </>
                           ))}




                           <Button
                              type='button'
                              onClick={() => {
                                 let newBaseIngredient = { ing_name: '', ing_qty: 1, ing_unit: '', custom_marker: false };

                                 // Check if the custom_marker of the last added item is true
                                 if (watchedBaseIngredients[watchedBaseIngredients.length - 1].custom_marker) {
                                    appendCustom({
                                       ing_name: newBaseIngredient.ing_name,
                                       ing_qty: newBaseIngredient.ing_qty,
                                       ing_unit: newBaseIngredient.ing_unit,
                                       ing_price: 0,
                                    });
                                 } else {
                                    console.log("hldf")
                                    appendBase(newBaseIngredient);
                                 }
                              }
                              }
                           >add</Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />

         </div>
         {!hideCustom &&
            <div className="flex flex-col gap-5 md:flex-row">
               <FormField
                  control={form.control}
                  name="custom_ingredient"
                  render={({ field }) => (
                     <FormItem className='md:w-2/4'>
                        <FormLabel>Customizable Ingredient (optional)</FormLabel>
                        <FormControl>
                           <div className="flex flex-col flex-wrap gap-4">
                              <FormDescription>enter price for 1 unit(eg: name=onion qty=1 unit=slice price=2)  </FormDescription>
                              {customFields.map((field, index) => (
                                 <div className='flex flex-wrap items-center justify-center'>
                                    <div key={field.id} className="flex items-center gap-1">
                                       <Input type="text" placeholder="name" {...register(`custom_ingredient.${index}.ing_name`)} defaultValue={field.ing_name} />
                                       <Input type="number" placeholder="qty" {...register(`custom_ingredient.${index}.ing_qty`)} defaultValue={field.ing_qty} className="w-1/4" readOnly />
                                       <Input type="text" placeholder="unit" {...register(`custom_ingredient.${index}.ing_unit`)} defaultValue={field.ing_unit} className="w-1/4" />
                                       <Input type="number" placeholder="price" {...register(`custom_ingredient.${index}.ing_price`)} defaultValue={field.ing_price} className="w-1/4" />
                                    </div>
                                    <button
                                       type="button"
                                       onClick={() => customFields.length > 1 && removeCustom(index)}
                                       className='bg-red-500 0 p-1 rounded-md m-1 w-full hover:shadow-md text-white'
                                    >Delete</button>
                                 </div>
                              ))}

                              <Button type='button' onClick={() => appendCustom({ ing_name: '', ing_qty: 1, ing_unit: '', ing_price: 0 })}>add</Button>
                           </div>
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

            </div>
         }
      </>
   )
}

export default RegularDishForm