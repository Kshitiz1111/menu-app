import UpdateProductForm from '@/components/custom/UpdateProductForm';
import React from 'react'

const updateProduct = ({
   params: { id },
}: {
   params: { id: string };
}) => {
   return (
      <div>
         <UpdateProductForm />
      </div>
   )
}

export default updateProduct