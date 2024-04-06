import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { drinksPlaceholder, dessertsPlaceholder } from "./placeHolderData"


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getDrinksByMatchingName(searchParams: string, drinkOrDesert:string){
  // Convert searchParams to lowercase for case-insensitive comparison
 const lowerCaseSearchParams = searchParams.toLowerCase();

 let placeHolderData = (drinkOrDesert === "dessert")? dessertsPlaceholder : drinksPlaceholder ; 
 // Filter the drinksPlaceholder array to find matches
 const matchingDrinks = placeHolderData.filter(drink => {
    // Convert the drink name to lowercase for case-insensitive comparison
    const lowerCaseDrinkName = drink.name.toLowerCase();

    // Check if the drink name includes the searchParams
    return lowerCaseDrinkName.includes(lowerCaseSearchParams);
 });

 return matchingDrinks;
}
export function getDrinksByCategory(searchParams: string, drinkOrDesert:string){
  // Convert searchParams to lowercase for case-insensitive comparison
 const lowerCaseSearchParams = searchParams.toLowerCase();
 
 let placeHolderData = (drinkOrDesert === "dessert")? dessertsPlaceholder : drinksPlaceholder; 
 // Filter the drinksPlaceholder array to find matches
 const matchingDrinks = placeHolderData.filter(drink => {
    // Convert the drink name to lowercase for case-insensitive comparison
    const lowerCaseDrinkName = drink.product_type.toLowerCase();

    // Check if the drink name includes the searchParams
    return lowerCaseDrinkName.includes(lowerCaseSearchParams);
 });

 return matchingDrinks;
}