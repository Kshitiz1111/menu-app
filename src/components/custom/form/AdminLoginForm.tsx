'use client'
import React, { useState, FormEvent } from 'react';

const AdminLoginForm = () => {
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [errorString, setErrorString] = useState('');
   const [isLoading, setIsLoading] = useState(false);

   const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsLoading(true);

      const data = { email, password };
      try {
         const response = await fetch('http://localhost:3000/api/admin_auth', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
         });

         const responseData = await response.json();
         if (!response.ok) {
            setErrorString(responseData.error);
            throw new Error('Network response was not ok');
         }

         // if (!responseData.success)
         console.log(responseData); // Handle the response data as needed

      } catch (error) {
         console.error('There was a problem with the fetch operation:', error);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className=''>
         <p className='text-center'>admin login</p>
         <div className='w-1/2 m-auto'>
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
               <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                     type="email"
                     placeholder="Enter your email"
                     value={email}
                     onChange={(e) => setEmail(e.target.value)}
                     className="mt-1 block w-full shadow-sm sm:text-gray-900 bg-white border-gray-300 rounded-md"
                  />
               </div>
               <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                     type="password"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="mt-1 block w-full shadow-sm sm:text-gray-900 bg-white border-gray-300 rounded-md"
                  />
               </div>
               <div className="mt-4">
                  <button type="submit" disabled={isLoading} className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:border-indigo-700 focus:ring-indigo-500 focus:ring-offset-indigo-200">
                     {isLoading ? 'Logging...' : 'Log In'}
                  </button>
               </div>
            </form>
         </div>
         {errorString && <p className='text-red-500 text-center text-sm'>{errorString}</p>}
      </div>
   )
};

export default AdminLoginForm;