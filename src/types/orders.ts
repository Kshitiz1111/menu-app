type Ingredient = {
   ing_id: number;
   ing_name: string;
   ing_qty: string|number; // Assuming quantity is stored as a string, adjust if necessary
   ing_unit: string;
   ing_price: string|number; // Assuming price is stored as a string, adjust if necessary
  };

type OrderDetail = {
   product_id: number;
   total_quantity: number;
   total_price: number;
   customized_ingredients: Ingredient[]|null; // Assuming customized_ingredients can be any JSON-compatible object
   customer_note?: string; // customer_note is optional
  };
  
export type OrderType = {
   purchase_order_id: string;
   no_of_item: number;
   total_price: number;
   compensation?: number|null; // compensation is optional
   status: string;
   details: OrderDetail[];
};