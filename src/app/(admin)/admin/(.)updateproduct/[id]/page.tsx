import React, { useContext } from 'react'
import { Modal } from './modal';
import UpdateProductForm from '@/components/custom/UpdateProductForm';

const updateProductModal = ({
   params: { id },
}: {
   params: { id: string };
}) => {

   return (
      <Modal>
         <div className=''>
            <UpdateProductForm />
         </div>
      </Modal>
   )
}

export default updateProductModal