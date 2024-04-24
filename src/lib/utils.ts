import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { drinksPlaceholder, dessertsPlaceholder } from "./placeHolderData"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface BaseIngredient {
  ing_name: string;
  ing_qty: number;
  ing_unit: string;
  custom_marker: boolean;
}
type Drink = {
  id: number; // Assuming the ID is a number
  name: string;
  img_src: string; // Assuming the image source is a string
  price: number; // Price can be a string or a number
  product_type: string;
  description: string;
  base_ingredient: BaseIngredient[]; // Assuming base_ingredient is an array of any type
  total_qty: number; // Assuming total_qty is a number
 };
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

export function getDrinksByMatchingName(searchParams: string, drinkOrDesert:string, drinks:Drink[], desserts:Dessert[]){
  // Convert searchParams to lowercase for case-insensitive comparison
 const lowerCaseSearchParams = searchParams.toLowerCase();

 let placeHolderData = (drinkOrDesert === "dessert")? desserts : drinks ; 
 // Filter the drinksPlaceholder array to find matches
 const matchingDrinks = placeHolderData?.filter(drink => {
    // Convert the drink name to lowercase for case-insensitive comparison
    const lowerCaseDrinkName = drink.name.toLowerCase();

    // Check if the drink name includes the searchParams
    return lowerCaseDrinkName.includes(lowerCaseSearchParams);
 });

 return matchingDrinks;
}
export function getDrinksByCategory(searchParams: string, drinkOrDesert:string, drinks:Drink[], desserts:Dessert[]){
  // Convert searchParams to lowercase for case-insensitive comparison
 const lowerCaseSearchParams = searchParams.toLowerCase();
 let placeHolderData = (drinkOrDesert === "dessert")? desserts : drinks; 
 console.log(placeHolderData)
 // Filter the drinksPlaceholder array to find matches
 const matchingDrinks = placeHolderData.filter(drink => {
    // Convert the drink name to lowercase for case-insensitive comparison
    const lowerCaseDrinkName = drink.product_type.toLowerCase();

    // Check if the drink name includes the searchParams
    return lowerCaseDrinkName.includes(lowerCaseSearchParams);
 });

 return matchingDrinks;
}