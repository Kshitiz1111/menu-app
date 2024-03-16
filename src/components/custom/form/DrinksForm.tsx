import { Button } from '@/components/ui/button'
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ProductFormSchema } from '@/lib/validator'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod'
const DrinksForm = ({ form, isCombo }: { form: UseFormReturn<z.infer<typeof ProductFormSchema>>, isCombo: boolean }) => {
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
                     <FormLabel>Base Ingredient(optional)</FormLabel>
                     <FormControl>
                        <div className="flex flex-col flex-wrap gap-4">
                           <div className="flex items-center gap-1">
                              <Input type="text" placeholder="name" name='ing_name' />
                              <Input type="number" placeholder="qty" name='ing_qty' className="w-1/4" />
                              <Input type="text" placeholder="unit" name='ing_unit' className="w-1/4" />

                           </div>
                           <Button>add</Button>
                        </div>
                     </FormControl>
                     <FormMessage />
                  </FormItem>
               )}
            />
            {
               <div>
                  <p className='font-semibold text-sm'>Selected Base Ingredient </p>
                  <ul className='p-2 list-decimal'>
                     <li className='font-semibold mx-2'>name<span className='p-1 mx-2 rounded-md bg-red-400 text-white text-center cursor-pointer hover:shadow-md'>delete</span></li>
                  </ul>
               </div>
            }
         </div>
         {isCombo &&
            <div className="flex flex-col gap-5 w-full md:flex-row">
               <div className='p-2 bg-gray-300'>combo drink section</div>
            </div>
         }

      </>
   )
}

export default DrinksForm