import RestaurantProfile from '@/components/custom/temp';
import { cookies } from 'next/headers';
import Link from 'next/link'
import React from 'react'


const Dashboard = async () => {
   const restaurant_id = cookies().get("restaurant_id")?.value;
   console.log("restaurant_id", restaurant_id)

   return (
      <div>admin Dashboard
         <RestaurantProfile rid={restaurant_id || undefined} />
      </div>
   )
}

export default Dashboard