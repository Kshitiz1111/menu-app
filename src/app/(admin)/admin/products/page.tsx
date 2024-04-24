import ProductTable from "@/components/custom/ProductsTable";
import Image from "next/image";


const Products = () => {
   let products = [
      {
         id: 1,
         name: "Product 1",
         description: "This is a description for Product 1.",
         image: "https://via.placeholder.com/150"
      },
      {
         id: 2,
         name: "Product 2",
         description: "This is a description for Product 2.",
         image: "https://via.placeholder.com/150"
      },
      {
         id: 3,
         name: "Product 3",
         description: "This is a description for Product 3.",
         image: "https://via.placeholder.com/150"
      },
      {
         id: 4,
         name: "Product 4",
         description: "This is a description for Product 4.",
         image: "https://via.placeholder.com/150"
      },
      {
         id: 5,
         name: "Product 5",
         description: "This is a description for Product 5.",
         image: "https://via.placeholder.com/150"
      }
   ];

   return (
      <div className="container mx-auto p-4">
         <h1 className="text-2xl font-bold mb-4">All Products</h1>
         <ProductTable />
      </div>
   )
}

export default Products