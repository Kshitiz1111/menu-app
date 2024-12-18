export type DishType ={
   id?: string,
   name: string|undefined,
   imgSrc: string,
   price: number|undefined,
   qty: number,
   ingredient:{
      baseIngredients: string[],
      customIngredients?: CustomIngredient[]|null|undefined,
   }
   customizedIngredients?:{
      removeIngredients: string[]|null|undefined,
      extraIngredients: ExtraIngredient[]|null|undefined,
   }
   filter: Filter|undefined,
   specialNote?: string,
}
interface ExtraIngredient{
   name:string,
   qty:number,
   price:number,
}
interface CustomIngredient{
   name:string,
   qty: number,
   price: number,
}
interface Filter {
   dishType: string,
   dietType: string,
}
// combo dish
export type ComboDishType ={
   id?: string,
   name: string,
   description: string,
   imgSrc: string,
   price: number,
   qty?: number,
   ingredients?:{
      baseIngredients: string[],
      customIngredients?: CustomIngredient[],
   }
   drinks?: Drinks[],
   selectedDrinks?: Drinks[]|null|undefined;
   filter: Filter,
   specialNote?: string,
   createdBy: string,
   vote: number,
}

interface Drinks{
   name: string,
   description?: string,
   price: number,
   qty: number,
}

export type AdminJwtPayloadType = {
   jti: string;
   iat: number;
}