"use client"
import React from 'react'
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
   SheetTrigger,
} from "@/components/ui/sheet"
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

const CustomerNav = () => {
   let currentPath = usePathname();
   return (
      <Sheet>
         <SheetTrigger className='p-1'>
            <Image src={'/icons/menu.svg'} width={30} height={30} alt='menu icon' />
         </SheetTrigger>
         <SheetContent side={"left"}>
            <SheetHeader className='w-full'>
               <Link href={"/"}><span className={`${currentPath === '/' ? 'bg-black text-white' : 'bg-gray-300 text-black'} hover:bg-black hover:text-white cursor-pointer px-2 py-1 rounded-full w-full`}>home</span></Link>
               {/* <Link href={"/cart"}><span className={`${currentPath === '/cart' ? 'bg-black text-white' : 'bg-gray-300 text-black'} hover:bg-black hover:text-white cursor-pointer px-2 py-1 rounded-full w-full`}>cart</span></Link>
               <Link href={"/dishes"}><span className={`${currentPath === '/dish' ? 'bg-black text-white' : 'bg-gray-300 text-black'} hover:bg-black hover:text-white cursor-pointer px-2 py-1 rounded-full w-full`}>dishes</span></Link> */}
            </SheetHeader>

         </SheetContent>
      </Sheet>

   )
}

export default CustomerNav