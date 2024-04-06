"use server";
import pool from "@/lib/database/db";
import { z } from "zod";
import { ProductFormSchema } from "../validator";
import { PoolClient } from "pg";

export const createProduct = async (
  productData: z.infer<typeof ProductFormSchema>
) => {
  let client = await pool.connect();

  const {
    product_category,
    product_price,
    product_type,
    diet_type,
    product_img,
    product_name,
    product_des,
    base_ingredient,
    custom_ingredient,
    combo_drinks,
    combo_desserts,
  } = productData;

  let pCategoryId;
  let pTypeId;
  let pDietTypeId;
  let baseIngIds:Array<number>=[];
  let customIngIds:Array<number>=[];
  let comboDrinkId;
  let comboDessertId;

  try {
    pCategoryId = await createCategory(
      { name: product_category, tableName: "product_category" },
      client
    );
    pTypeId = await createCategory(
      { name: product_type, tableName: "product_type" },
      client
    );
    pDietTypeId = await createCategory(
      { name: diet_type, tableName: "product_diet_type" },
      client
    );
    if (base_ingredient) {
      let result = await createBaseIngredient(base_ingredient, client);
      let {ids} = result
      if(ids) baseIngIds = ids;
    }
    if (custom_ingredient) {
      let result = await createCustomIngredient(custom_ingredient, client);
      let {ids} = result
      if(ids) customIngIds = ids;
    }
  
    if(product_type && product_category !== "combo"){
      let result = await postProduct(
        {
          name:product_name,
          img:product_img,
          description:product_des,
          price:product_price,
          pCategoryId:pCategoryId.id,
          pTypeId:pTypeId.id,
          pDietTypeId:pDietTypeId.id,
          baseIngIds:baseIngIds,
          customIngIds:customIngIds,
          comboDrinkId:comboDrinkId,
          comboDessertId: comboDessertId
        }, 
        client
      );
      console.log("product result",result)
    }

    if(product_type && product_category === "combo"){

      if (combo_drinks && combo_drinks?.length >0) {
        let result = await createComboDrinks(productData, client);
        let {id} = result
        if(id) comboDrinkId = id;
        console.log("comboDrinkid", result)
      }
      if (combo_desserts && combo_desserts?.length >0) {
        let result = await createComboDessert(productData, client);
        let {id} = result
        if(id) comboDessertId = id;
        console.log("comboDessertid", result)
      }
      
      let result = await postProduct(
        {
          name:product_name,
          img:product_img,
          description:product_des,
          price:product_price,
          pCategoryId:pCategoryId.id,
          pTypeId:pTypeId.id,
          pDietTypeId:pDietTypeId.id,
          baseIngIds:baseIngIds,
          customIngIds:customIngIds,
          comboDrinkId:comboDrinkId,
          comboDessertId: comboDessertId
        }, 
        client
      );
      console.log("combo product result",result)
    }
   

    // console.log(pCategoryId, pTypeId, pDietTypeId, "baseIngIds: ",baseIngIds);
    return "success";
  } catch (error) {
    console.log("error");
  } finally {
    client.release();
  }
};


type categoryType = {
  name: string;
  tableName: string;
};
const createCategory = async (category: categoryType, client: PoolClient) => {
  // Start a transaction
  await client.query("BEGIN");

  try {
    // Check if the table exists and create it if not
    await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = '${category.tableName}'
            ) THEN
                CREATE TABLE ${category.tableName} (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    UNIQUE (name)
                );
            END IF;
        END $$;
      `);

    // Check if the name exists
    const exists = await client.query(
      `
        SELECT id FROM ${category.tableName} 
        WHERE name = $1
      `,
      [category.name]
    );

    if (exists.rows.length > 0) {
      // If the name exists, return the existing id
      return {
        success: true,
        message: "Category already exists.",
        id: exists.rows[0].id,
      };
    } else {
      // If the name does not exist, insert it and return the new id
      const result = await client.query(
        `INSERT INTO ${category.tableName} (name) VALUES ($1) RETURNING id;`,
        [category.name]
      );

      // Commit the transaction
      await client.query("COMMIT");
      return {
        success: true,
        message: "Category successfully created.",
        id: result.rows[0].id,
      };
    }
  } catch (error: any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    return { success: false, message: error.message };
  }
};


type baseIngType = {
  ing_name: string;
  ing_qty: string | number;
  ing_unit: string;
  custom_marker?: boolean | string |  undefined;
};
const createBaseIngredient = async (
  baseIng: baseIngType[],
  client: PoolClient
) => {
  // Start a transaction
  await client.query("BEGIN");

  try {
    // Check if the table exists and create it if not
    await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'base_ingredient'
            ) THEN
                CREATE TABLE base_ingredient (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    qty VARCHAR(255) NOT NULL,
                    unit VARCHAR(255) NOT NULL,
                    is_custom Boolean NOT NULL
                );
            END IF;
        END $$;
    `);

    // Prepare arrays to hold the query strings and values for insertions
    let insertQueries: string[] = [];
    let insertValues: any[] = [];

    // array for existing ids 
    let existIngArrIds:Array<number>=[];

    //remove last element because it is empty
    baseIng.pop();
    // console.log("baseIng",baseIng);

    // Iterate over each base ingredient
    for (const ingredient of baseIng) {
      // Check if the ingredient already exists
      const exists = await client.query(
        `SELECT id FROM base_ingredient WHERE name = $1 AND qty = $2 AND unit = $3`,
        [
          ingredient.ing_name,
          ingredient.ing_qty.toString(),
          ingredient.ing_unit,
        ]
      );

      //collect existed ingredient id into an array
      exists.rows.forEach(row => {
        existIngArrIds.push(row.id)
      });

      // If the ingredient does not exist, prepare to insert it
      if (exists.rows.length === 0) {
        insertQueries.push(
          `($${insertValues.length + 1}, $${insertValues.length + 2}, $${insertValues.length + 3}, $${insertValues.length + 4})`
        );
        insertValues.push(
          ingredient.ing_name,
          ingredient.ing_qty,
          ingredient.ing_unit,
          ingredient?.custom_marker
        );
      }
    }

    // If there are ingredients to insert, execute the insert query
    if (insertQueries.length > 0) {
      let queryString = `INSERT INTO base_ingredient (name, qty, unit, is_custom) VALUES ${insertQueries.join(",")} RETURNING id;`;
      console.log('queryString',queryString);
      const result = await client.query(queryString, insertValues);
      
      // Assuming you want to return the IDs of the inserted ingredients
      await client.query("COMMIT");
      let insertedIngIds = result.rows.map((row) => row.id);
      return {
        success: true,
        message: "Base ingredients successfully created.",
        ids: [...insertedIngIds,...existIngArrIds],
      };
    } else {
      // If no ingredients were inserted, return a message indicating this
      return {
        success: true,
        message: "All base ingredients already exist.",
        ids: existIngArrIds,
      };
    }
    
  } catch (error: any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.log(error)
    return { success: false, message: "baseIng error: "+error.message };
  }
};


type customIngType = {
  ing_name: string;
  ing_qty: string | number;
  ing_unit: string;
  ing_price: string | number;
};
const createCustomIngredient = async (
  customIng: customIngType[],
  client: PoolClient
) => {
  // Start a transaction
  await client.query("BEGIN");

  try {
    // Check if the table exists and create it if not
    await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'custom_ingredient'
            ) THEN
                CREATE TABLE custom_ingredient (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    qty VARCHAR(255) NOT NULL,
                    unit VARCHAR(255) NOT NULL,
                    price VARCHAR(255) NOT NULL
                );
            END IF;
        END $$;
    `);

    // Prepare arrays to hold the query strings and values for insertions
    let insertQueries: string[] = [];
    let insertValues: any[] = [];

    // array for existing ids 
    let existIngArrIds:Array<number>=[];

    //remove last element because it is empty
    customIng.pop();
    
    // Iterate over each base ingredient
    for (const ingredient of customIng) {
      // Check if the ingredient already exists
      const exists = await client.query(
        `SELECT id FROM custom_ingredient WHERE name = $1 AND qty = $2 AND unit = $3 AND price = $4`,
        [
          ingredient.ing_name,
          ingredient.ing_qty.toString(),
          ingredient.ing_unit,
          ingredient.ing_price.toString(),
        ]
      );

      //collect existed ingredient id into an array
      exists.rows.forEach(row => {
        existIngArrIds.push(row.id)
      });

      // If the ingredient does not exist, prepare to insert it
      if (exists.rows.length === 0) {
        insertQueries.push(
          `($${insertValues.length + 1}, $${insertValues.length + 2}, $${insertValues.length + 3}, $${insertValues.length + 4})`
        );
        insertValues.push(
          ingredient.ing_name,
          ingredient.ing_qty,
          ingredient.ing_unit,
          ingredient.ing_price
        );
      }
    }

    // If there are ingredients to insert, execute the insert query
    if (insertQueries.length > 0) {
      let queryString = `INSERT INTO custom_ingredient (name, qty, unit, price) VALUES ${insertQueries.join(",")} RETURNING id;`;
      // console.log('queryString',queryString);
      const result = await client.query(queryString, insertValues);
      
      // Assuming you want to return the IDs of the inserted ingredients
      await client.query("COMMIT");
      let insertedIngIds = result.rows.map((row) => row.id);

      return {
        success: true,
        message: "Custom ingredients successfully created.",
        ids: [...insertedIngIds,...existIngArrIds],
      };
    } else {
      // If no ingredients were inserted, return a message indicating this
      return {
        success: true,
        message: "All custom ingredients already exist.",
        ids: existIngArrIds,
      };
    }
    
  } catch (error: any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.log(error)
    return { success: false, message: "custom ingredient error: "+error.message };
  }
};


const createComboDessert = async(
  productData: z.infer<typeof ProductFormSchema>,
  client: PoolClient
)=>{

  const{ product_name, product_des, combo_desserts} = productData;

  // Start a transaction
  await client.query("BEGIN");

  try {
     // Check if the table exists and create it if not
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'combo_desserts'
          ) THEN
              CREATE TABLE combo_desserts (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  description VARCHAR(255) NOT NULL,
                  price VARCHAR(255) NOT NULL
              );
          END IF;
      END $$;
    `);  

    // Calculate the total price for the combo dessert
    let totalPrice = 0;
    combo_desserts?.forEach(dessert => {
      console.log("selected combo desserts: ",dessert)
      totalPrice += dessert.total_qty * dessert.price;
    });

    const price = totalPrice.toString();

    // Construct the INSERT query
    const insertQuery = `
    INSERT INTO combo_desserts (name, description, price)
    VALUES ($1, $2, $3)
    RETURNING id;
    `;

    // Assuming client is an instance of PoolClient
    const ComboDessertResult = await client.query(insertQuery, [product_name, product_des, price])

    if(ComboDessertResult.rowCount! > 0){
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'combo_dessert_details'
            ) THEN
                CREATE TABLE combo_dessert_details (
                    id SERIAL PRIMARY KEY,
                    combo_dessert_id INTEGER,
                    dessert_id INTEGER,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (combo_dessert_id) REFERENCES combo_desserts(id),
                    FOREIGN KEY (dessert_id) REFERENCES products(id)
                );
            END IF;
        END $$;
      `); 

      const comboDessertId = ComboDessertResult.rows[0].id;

      // Iterate over the combo_dessert array
      if(combo_desserts){
        for (const dessert of combo_desserts) {
          // Extract the dessert_id and quantity from each item in the combo_desserts array
          const dessertId = dessert.id;
          const quantity = dessert.total_qty;
        
          // Construct the INSERT query for the combo_dessert_details table
          const insertQueryDetails = `
            INSERT INTO combo_dessert_details (combo_dessert_id, dessert_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING id;
          `;
        
          // Execute the INSERT query                                               //change dessert_id to dynamic
          const resultDetails = await client.query(insertQueryDetails, [comboDessertId, 1, quantity]);
        
          // Log the ID of the newly inserted row in the combo_dessert_details table
          console.log("Inserted combo dessert detail with ID:", resultDetails.rows[0].id);
        }
      }
    }  
    
    // Return the ID of the newly inserted Combo dessert
    await client.query("COMMIT");
    return { success: true, message: "combo dessert successfully added.", id: ComboDessertResult.rows[0].id };
  } catch (error:any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.log(error)
    return { success: false, message: "combo desserts error: "+error.message };
  }

}


const createComboDrinks = async(
    productData: z.infer<typeof ProductFormSchema>,
    client: PoolClient
)=>{

  const{ product_name, product_des, combo_drinks} = productData;

  // Start a transaction
  await client.query("BEGIN");

  try {
     // Check if the table exists and create it if not
    await client.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = 'combo_drinks'
          ) THEN
              CREATE TABLE combo_drinks (
                  id SERIAL PRIMARY KEY,
                  name VARCHAR(255) NOT NULL,
                  description VARCHAR(255) NOT NULL,
                  price VARCHAR(255) NOT NULL
              );
          END IF;
      END $$;
    `);  

    // Calculate the total price for the combo drink
    let totalPrice = 0;
    combo_drinks?.forEach(drink => {
      console.log("selected combo drinks: ",drink)
      totalPrice += drink.total_qty * drink.price;
    });

    const price = totalPrice.toString();

    // Construct the INSERT query
    const insertQuery = `
    INSERT INTO combo_drinks (name, description, price)
    VALUES ($1, $2, $3)
    RETURNING id;
    `;

    // Assuming client is an instance of PoolClient
    const ComboDrinkResult = await client.query(insertQuery, [product_name, product_des, price])

    if(ComboDrinkResult.rowCount! > 0){
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'combo_drink_details'
            ) THEN
                CREATE TABLE combo_drink_details (
                    id SERIAL PRIMARY KEY,
                    combo_drink_id INTEGER,
                    drink_id INTEGER,
                    quantity INTEGER NOT NULL,
                    FOREIGN KEY (combo_drink_id) REFERENCES combo_drinks(id),
                    FOREIGN KEY (drink_id) REFERENCES products(id)
                );
            END IF;
        END $$;
      `); 

      const comboDrinkId = ComboDrinkResult.rows[0].id;

      // Iterate over the combo_drinks array
      if(combo_drinks){
        for (const drink of combo_drinks) {
          // Extract the drink_id and quantity from each item in the combo_drinks array
          const drinkId = drink.id;
          const quantity = drink.total_qty;
        
          // Construct the INSERT query for the combo_drink_details table
          const insertQueryDetails = `
            INSERT INTO combo_drink_details (combo_drink_id, drink_id, quantity)
            VALUES ($1, $2, $3)
            RETURNING id;
          `;
        
          // Execute the INSERT query                                               //change drink_id to dynamic
          const resultDetails = await client.query(insertQueryDetails, [comboDrinkId, 1, quantity]);
        
          // Log the ID of the newly inserted row in the combo_drink_details table
          console.log("Inserted combo drink detail with ID:", resultDetails.rows[0].id);
        }
      }
    }  
    
    // Return the ID of the newly inserted Combo drink
    await client.query("COMMIT");
    return { success: true, message: "combo drinks successfully added.", id: ComboDrinkResult.rows[0].id };
  } catch (error:any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");
    console.log(error)
    return { success: false, message: "combo drinks error: "+error.message };
  }

}


const postProduct = async(
  {name,img,description,price, pCategoryId, pTypeId, pDietTypeId, baseIngIds, customIngIds, comboDrinkId, comboDessertId}
  :{
    name:string,
    img:string|undefined,
    description:string,
    price:string|number, 
    pCategoryId:number, 
    pTypeId:number, 
    pDietTypeId:number, 
    baseIngIds:number[],
    customIngIds:number[],
    comboDrinkId?:number,
    comboDessertId?:number
  }
  ,
  client: PoolClient)=>{
  // Start a transaction
  
  await client.query("BEGIN");
  try {
      // Check if the table exists and create it if not
      await client.query(`
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = 'products'
            ) THEN
                CREATE TABLE products (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    img VARCHAR(255) NOT NULL,
                    description VARCHAR(255) NOT NULL,
                    price VARCHAR(255) NOT NULL,
                    category_id INTEGER NOT NULL,
                    type_id INTEGER NOT NULL,
                    dietType_id INTEGER NOT NULL,
                    baseIng_ids INTEGER[],
                    customIng_ids INTEGER[],
                    combo_drinks_id INTEGER,
                    combo_dessert_id INTEGER,
                    FOREIGN KEY (category_id) REFERENCES product_category(id),
                    FOREIGN KEY (type_id) REFERENCES product_type(id),
                    FOREIGN KEY (dietType_id) REFERENCES product_diet_type(id)
                );
            END IF;
        END $$;
      `);

      const insertQuery = `
        INSERT INTO products (name, img, description, price, category_id, type_id, dietType_id, baseIng_ids, customIng_ids, combo_drinks_id, combo_dessert_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING id;
      `;
      const values:any = [name, img, description, price, pCategoryId, pTypeId, pDietTypeId, baseIngIds??null, customIngIds??null, comboDrinkId??null, comboDessertId??null];
      const result = await client.query(insertQuery, values);

      // Commit the transaction
      await client.query("COMMIT");

      // Return the ID of the newly inserted products
      return { success: true, message: "products successfully created.", id: result.rows[0].id };
    
  } catch (error:any) {
    // Rollback the transaction in case of error
    await client.query("ROLLBACK");

    // Log the error and return an error message
    console.error("Error inserting product:", error);
    return { success: false, message: "Error inserting products: " + error.message };
  }

}

export const getAllDrinks = async()=>{
  let client = await pool.connect();
  try {
    // SQL query to fetch drinks along with their base ingredients aggregated into a JSON array
    const query = `
      SELECT p.*, json_agg(bi)::text AS base_ingredients
      FROM products p
      JOIN product_type pt ON p.type_id = pt.id
      LEFT JOIN base_ingredient bi ON bi.id = ANY(p.baseIng_ids)
      WHERE pt.name = 'drinks' AND p.combo_drinks_id IS NULL
      GROUP BY p.id;
    `;

    // Execute the query
    const result = await client.query(query);

    // The result now includes a JSON array of base ingredients for each drink
    const drinks = result.rows.map(row => ({
      ...row,
      base_ingredients: JSON.parse(row.base_ingredients), // Parse the JSON string into an array of objects
    }));

    // Return the fetched drinks with their base ingredients
    return {
      success: true,
      message: "Drinks with base ingredients successfully fetched.",
      drinks: drinks,
    };
 } catch (error) {
    // Handle any errors
    console.error("Error fetching drinks with base ingredients:", error);
    return {
      success: false,
      message: "Error fetching drinks with base ingredients: " + error.message,
    };
 }
}

