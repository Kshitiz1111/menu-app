'use client';

import { type ElementRef, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

export function Modal({ children }: { children: React.ReactNode }) {
   const router = useRouter();
   const dialogRef = useRef<ElementRef<'dialog'>>(null);

   useEffect(() => {
      if (!dialogRef.current?.open) {
         dialogRef.current?.showModal();
      }
   }, []);

   function onDismiss() {
      router.back();
   }

   return (
      <div className="">
         <dialog ref={dialogRef} className="rounded-md" onClose={onDismiss}>
            <button onClick={onDismiss} className="text-white bg-black px-2 py-1 rounded-md w-full" >close</button>
            {children}
         </dialog>
      </div>
   );
}