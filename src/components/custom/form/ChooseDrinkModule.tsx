import React, { useEffect, useState } from 'react'
import { drinksPlaceholder } from '@/lib/placeHolderData'
import { getDrinksByCategory, getDrinksByMatchingName } from '@/lib/utils'
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { ProductFormSchema } from '@/lib/validator';
import { UseFormReturn } from 'react-hook-form'
import { z } from 'zod';
import { FormField } from '@/components/ui/form';


interface BaseIngredient {
   ing_name: string;
   ing_qty: number;
   ing_unit: string;
   custom_marker: boolean;
}

interface Drink {
   name: string;
   product_type: string;
   id: number | string;
   img_src: string;
   description: string;
   base_ingredient: BaseIngredient[] | undefined;
   total_qty: number;
   price: number;
}
interface Dessert {
   name: string;
   product_type: string;
   id: number;
   img_src: string;
   description: string;
   base_ingredient: BaseIngredient[];
   total_qty: number;
   price: number;
}

const ChooseDrinkModule = ({ isCombo, form }: { isCombo: boolean, form: UseFormReturn<z.infer<typeof ProductFormSchema>> }) => {
   const [searchResult, setSearchResult] = useState<Array<Drink>>();
   const [selectedDrinks, setSelectedDrinks] = useState<Array<Drink>>(form.getValues('combo_drinks'));
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [hasQuery, setHasQuery] = useState<boolean>(false);

   function closeModal(): void {
      setOpenModal(false)
   }
   useEffect(() => {
      if (selectedDrinks && selectedDrinks.length > 0) {
         // Prepare the new array for combo_drinks
         const updatedComboDrinks = form.getValues('combo_drinks')?.map(existedItem => {
            // Find the corresponding item in selectedDrinks
            const selectedItem = selectedDrinks.find(item => item.id === existedItem.id);
            if (selectedItem) {
               // If the item exists, update its drink_total_count
               return { ...existedItem, total_qty: selectedItem.total_qty };
            }
            // If the item does not exist in selectedDrinks, return it as is
            return existedItem;
         }) || []; // Fallback to an empty array if combo_drinks is undefined

         // Add new items from selectedDrinks that are not in combo_drinks
         const newItems = selectedDrinks.filter(selectedItem => !updatedComboDrinks.some(existedItem => existedItem.id === selectedItem.id));
         updatedComboDrinks.push(...newItems);

         // Update the form state with the new array
         form.setValue('combo_drinks', updatedComboDrinks);
      }
   }, [selectedDrinks]);


   async function search(query: string, queryType: string) {
      setOpenModal(true);
      console.log(form.getValues("product_type"))

      try {
         let response = await fetch("/api/get_drinks", {
            method: 'GET', // Specify the method
            headers: {
               'Content-Type': 'application/json' // Set the content type header
            },
         });
         let result = await response.json();
         // console.log(result);

         // Assuming result.drinks contains the array of drinks
         // Call the utility function with the fetched drinks data
         const delayDebounceFn = setTimeout(() => {
            (query) ? setHasQuery(true) : setHasQuery(false);
            // console.log("query", query, hasQuery);
            if (query && queryType === "input") {
               let matchItem = getDrinksByMatchingName(query, "drinks", result.message.drinks, []);
               console.log(matchItem)
               setSearchResult(matchItem);
            } else if (query && queryType === "category") {
               let matchItem = getDrinksByCategory(query, "drinks", result.message.drinks, []);
               setSearchResult(matchItem);
            } else {
               setSearchResult([]);
            }
            return () => clearTimeout(delayDebounceFn);
         }, 300)
      } catch (error) {
         console.log(error);
      }


      // console.log("query", query, "search result", searchResult);
   }
   console.log("selectedDrinks", selectedDrinks)
   return (
      <div>
         {isCombo &&
            <div className="flex flex-col gap-5 w-full md:flex-row">
               <span className='font-semibold text-sm'>Add Drinks </span>
               <div className='border border-white rounded-md bg-gray-300 '>

                  <div id='drink-filters'>
                     <div className="flex min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 p-2 ">
                        <Input
                           type="text"
                           placeholder={"search"}
                           onChange={(e) => search(e.target.value, "input")}
                           className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <Image className="-ml-10" src="/icons/search.svg" alt="search" width={24} height={24} />
                     </div>
                     <div className='flex w-full md:flex-row gap-2 p-2'>
                        <span onClick={() => { search("regular", "category") }} className={`p-2 md:w-full w-1/2 rounded-md ${(searchResult && searchResult[0]?.product_type === "regular") ? 'bg-gray-500' : 'bg-gray-400'} text-white`}>Regular</span>
                        <span onClick={() => { search("special", "category") }} className={`p-2 md:w-full w-1/2 rounded-md ${(searchResult && searchResult[0]?.product_type === "special") ? 'bg-gray-500' : 'bg-gray-400'} text-white`}>Special</span>
                     </div>
                  </div>
                  {openModal && (searchResult && searchResult?.length > 0)
                     ?
                     <div className='p-2 m-2 rounded-md shadow-md bg-gray-200'>
                        <span onClick={() => closeModal()} className='cursor-pointer p-1 font-bold'>X</span>
                        <div id='search result' className=''>
                           <div className='flex flex-wrap gap-2 p-2 '>
                              {searchResult?.map((drink) =>
                                 <span className='flex items-center gap-1 border border-black p-2 rounded-md'>{drink?.name}
                                    <Checkbox className='w-5 h-5'
                                       checked={selectedDrinks?.some((item) => item.id === drink.id)}
                                       onClick={() => {
                                          selectedDrinks?.some((item) => item.id === drink.id)
                                             ? setSelectedDrinks(selectedDrinks.filter((item) => item.id !== drink.id))
                                             : setSelectedDrinks([...(selectedDrinks ?? []), drink])

                                       }}
                                    />
                                 </span>
                              )}
                           </div>
                        </div>
                     </div>
                     : (hasQuery)
                        ? (searchResult && searchResult?.length < 1)
                           ? <div className=' bg-yellow-400 w-full rounded-md p-1'><span className='text-sm p-2'>No Drinks Found! </span></div>
                           : ""
                        : ""
                  }
                  {(selectedDrinks && selectedDrinks?.length > 0)
                     &&
                     <div id='selected-drinks' className="">

                        <span className='text-sm font-semibold p-2'>Selected {(form.getValues("product_type") == "dessert") ? "Desserts" : "Drinks"}</span>
                        {selectedDrinks?.length === 0 && <p className='px-4 py-2 bg-gray-200 text-sm'>No Drinks Selected!</p>}
                        {selectedDrinks?.map((drink, index) => (
                           <FormField
                              control={form.control}
                              name='combo_drinks'
                              render={({ field }) => (
                                 <div key={drink.id} className="flex items-center justify-between bg-gray-100 p-2 m-2 rounded-md">
                                    <div className="flex items-center">
                                       <Checkbox
                                          className='w-5 h-5 mr-2'
                                          checked={selectedDrinks?.some((item) => item.id === drink.id)}
                                          onClick={() => {
                                             setSelectedDrinks(selectedDrinks.filter((item, i) => item.id !== drink.id));
                                          }}
                                       />
                                       <span>{drink.name}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                       <Input
                                          type="number"
                                          className="border px-2 py-1 rounded-md w-10"
                                          value={drink.total_qty}
                                          onChange={(e) => {
                                             const newQuantity = parseInt(e.target.value, 10);
                                             setSelectedDrinks(selectedDrinks.map((item, i) => i === index ? { ...item, total_qty: newQuantity } : item));
                                          }}
                                       />
                                       <span
                                          className="bg-blue-500 text-white px-2 py-1 rounded-md cursor-pointer"
                                          onClick={() => {
                                             setSelectedDrinks(selectedDrinks.map((item, i) => i === index ? { ...item, total_qty: item.total_qty + 1 } : item));
                                          }}
                                       >
                                          +
                                       </span>
                                       <span
                                          className="bg-red-500 text-white px-2 py-1 rounded-md cursor-pointer"
                                          onClick={() => {
                                             setSelectedDrinks(selectedDrinks.map((item, i) => i === index ? { ...item, total_qty: item.total_qty - 1 } : item));
                                          }}
                                       >
                                          -
                                       </span>
                                    </div>
                                 </div>
                              )}
                           />
                        ))}
                     </div>
                  }

               </div>
            </div>
         }
      </div>
   )
}

export default ChooseDrinkModule