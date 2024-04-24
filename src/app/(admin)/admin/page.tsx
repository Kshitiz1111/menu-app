import Link from 'next/link'
import React from 'react'

const Dashboard = () => {
   return (
      <div>admin Dashboard

         <Link href={`/admin/updateproduct/${1232}`}><button className="text-blue-500 hover:text-blue-700 font-bold py-1 px-2 rounded mr-2">Edit</button></Link>

      </div>
   )
}

export default Dashboard