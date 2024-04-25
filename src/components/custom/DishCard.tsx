"use client"
import { Button } from "@/components/ui/button"
import {
   Card,
   // CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Toggle } from "@/components/ui/toggle"
import { Separator } from "@/components/ui/separator"
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog"

import { useSingleDishContext } from "@/context/singleDishContext"
import { getSingleProduct } from "@/lib/actions/product.action"
import Image from "next/image"
import { useEffect, useState } from "react"
import { json } from "stream/consumers"
import { ProductFormSchema } from "@/lib/validator"
import { z } from "zod"
import { Input } from "../ui/input"
import { Textarea } from "../ui/textarea"

interface Product {
   baseing_ids: number[] | null;
   combo_dessert_id: number | null;
   combo_drinks_id: number | null;
   customing_ids: number[];
   product_id: number;
   product_name: string;
   product_des: string;
   product_img: string;
   product_category: string;
   product_type: string;
   diet_type: string;
   product_price: string;
}


const DishCard = () => {
   const [products, setProducts] = useState<Array<Product>>();
   const [singleProduct, setSingleProduct] = useState<z.infer<typeof ProductFormSchema>>()
   const [openNote, setOpenNote] = useState(false);

   async function getProducts() {
      try {
         let response = await fetch("/api/product", {
            method: 'GET', // Specify the method
            headers: {
               'Content-Type': 'application/json' // Set the content type header
            },
         })
         let result = await response.json();
         setProducts(result.message.products);
         console.log(result)
      } catch (error) {
         console.log(error)
      }
   }
   useEffect(() => {
      getProducts()
   }, [])

   // const context = useSingleDishContext()
   // if (!context) {
   //    // Return null or some fallback UI
   //    return null;
   // }
   // const { setSingleDish, product } = context;

   const handleSelect = async (dish: any) => {
      try {
         let result = await getSingleProduct(dish);
         setSingleProduct(result.product)
         // setSingleDish(JSON.stringify(result.product));
         // console.log('customer context product', JSON.parse(product))
      } catch (error) {
         console.log(error)
      }
   }
   return (
      <div className="flex flex-wrap gap-1">
         {(products && products.length > 0) ?
            products?.map((product, index) => {
               return (

                  <Dialog>
                     <Card key={product.product_id}
                     >
                        <CardHeader>
                           <CardTitle>{product.product_name}</CardTitle>
                           <CardDescription>{product.product_des.substring(0, 20) + "..."}</CardDescription>
                           <Image src={'/images/dish1.jpg'} className="m-auto" alt="dish image" width={50} height={50}></Image>
                        </CardHeader>
                        <DialogTrigger asChild>
                           <Button className="w-full" onClick={() => handleSelect(product)}>
                              open
                           </Button>
                        </DialogTrigger>
                        {singleProduct &&
                           <DialogContent className={`${(product.customing_ids.length > 2) ? 'overflow-y-scroll h-screen ' : 'overflow-hidden h-auto'} md:h-auto`}>
                              <DialogHeader>
                                 <DialogTitle>{singleProduct.product_name}</DialogTitle>
                                 <Image src={'/images/dish1.jpg'} className={"rounded-md mx-auto block md:mx-0"} alt="dish image" width={50} height={50}></Image>
                                 <DialogDescription>
                                    {singleProduct.product_des}
                                 </DialogDescription>
                              </DialogHeader>

                              <div className="block m-auto md:m-1">
                                 {/* <Badge >{`${singleProduct.product_category}`}</Badge> */}
                                 <Badge className="mr-1">{` ${singleProduct.product_type}`}</Badge>
                                 <Badge >{` ${singleProduct.diet_type}`}</Badge>
                              </div>


                              {singleProduct.base_ingredient && singleProduct.base_ingredient?.length > 0 &&
                                 <div>
                                    <strong>base ingredients</strong>
                                    <div className="flex flex-wrap gap-1">
                                       {
                                          singleProduct.base_ingredient && singleProduct.base_ingredient?.length > 0 &&

                                          singleProduct.base_ingredient.map((baseing) => (
                                             <span className={'text-gray-500 font-semibold text-sm'}>{baseing.ing_name} ,</span>
                                          ))
                                       }
                                    </div>
                                 </div>
                              }

                              {singleProduct.custom_ingredient && singleProduct.custom_ingredient?.length > 0 &&
                                 <div>
                                    <strong>customizable ingredients</strong>
                                    <div className="">
                                       {
                                          singleProduct.custom_ingredient && singleProduct.custom_ingredient?.length > 0 &&

                                          singleProduct.custom_ingredient.map((customing, index) => (
                                             <div className="flex flex-wrap justify-between items-center mb-1">
                                                <span className="text-gray-500 font-semibold text-sm">{customing.ing_name}</span>
                                                <div className="flex gap-1">
                                                   <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l"
                                                      onClick={() => {
                                                         if (!singleProduct.custom_ingredient) return; // Safety check

                                                         const updatedIngredients = [...singleProduct.custom_ingredient];
                                                         let temp: any = (typeof (updatedIngredients[index].ing_qty) === "string") ? Number(updatedIngredients[index].ing_qty) : updatedIngredients[index].ing_qty;

                                                         if (temp === 0) return;

                                                         temp--;
                                                         updatedIngredients[index].ing_qty = temp.toString(); // Increment the quantity

                                                         setSingleProduct({
                                                            ...singleProduct,
                                                            custom_ingredient: updatedIngredients,
                                                         });
                                                      }}
                                                   >-</button>
                                                   <Input
                                                      type="number"
                                                      value={customing.ing_qty}
                                                      min={0}
                                                      className="text-center bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4"
                                                      readOnly
                                                   />
                                                   <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r"
                                                      onClick={() => {
                                                         if (!singleProduct.custom_ingredient) return; // Safety check

                                                         const updatedIngredients = [...singleProduct.custom_ingredient];
                                                         let temp: any = (typeof (updatedIngredients[index].ing_qty) === "string") ? Number(updatedIngredients[index].ing_qty) : updatedIngredients[index].ing_qty;

                                                         temp++;
                                                         updatedIngredients[index].ing_qty = temp.toString(); // Increment the quantity

                                                         setSingleProduct({
                                                            ...singleProduct,
                                                            custom_ingredient: updatedIngredients,
                                                         });
                                                      }}
                                                   >+</button>
                                                </div>
                                             </div>

                                          ))
                                       }
                                    </div>
                                 </div>
                              }


                              {singleProduct.combo_drinks && singleProduct.combo_drinks?.length > 0 &&
                                 <div>
                                    <strong>drinks</strong>
                                    <div className="">
                                       {
                                          singleProduct.combo_drinks && singleProduct.combo_drinks?.length > 0 &&
                                          singleProduct.combo_drinks.map((drink) => (
                                             <div className="flex items-center gap-1 m-1">
                                                <span className="text-sm bg-black rounded-full px-2 text-white">{drink.total_qty}</span>
                                                <span className="text-gray text-md mr-2"> - {drink.name}</span>
                                             </div>
                                          ))
                                       }
                                    </div>
                                 </div>
                              }

                              {singleProduct.combo_desserts && singleProduct.combo_desserts?.length > 0 &&
                                 <div>
                                    <strong>dessert</strong>
                                    <div className="">
                                       {
                                          singleProduct.combo_desserts && singleProduct.combo_desserts?.length > 0 &&
                                          singleProduct.combo_desserts.map((dessert) => (
                                             <div className="flex items-center gap-1 m-1">
                                                <span className="text-sm bg-black rounded-full px-2 text-white">{dessert.total_qty}</span>
                                                <span className="text-gray text-md mr-2"> - {dessert.name}</span>
                                             </div>
                                          ))
                                       }
                                    </div>
                                 </div>
                              }

                              <div className="p-2 border border-gray-500 rounded-md">
                                 <div className="flex flex-wrap items-center justify-between">
                                    <p className="text-xs">if you have any <strong>special request</strong> / <strong>dietary note</strong></p>
                                    <Toggle onClick={() => setOpenNote(!openNote)} className="mb-1 shadow-md">add +</Toggle>
                                 </div>
                                 {openNote && <Textarea placeholder="inform us if you have allergy with any ingredients in this dish or any special request"
                                    value={singleProduct.customer_note}
                                    onChange={(e) => {
                                       setSingleProduct({ ...singleProduct, customer_note: e.currentTarget.value })
                                    }}
                                 ></Textarea>}
                              </div>

                              <Separator />

                              <div>
                                 combo section
                              </div>
                           </DialogContent>

                        }


                     </Card>
                  </Dialog>

               )
            })
            : "loading..."
         }

      </div >
   )
}

export default DishCard