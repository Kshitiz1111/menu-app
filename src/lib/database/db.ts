import { Pool } from 'pg';


const pool = new Pool({
 user: process.env.DB_USER,
 host: process.env.DB_HOST,
 database: process.env.DB_NAME,
 password: process.env.DB_PWD,
 port: Number(process.env.DB_PORT),
});

// Function to check database connection
async function checkDatabaseConnection() {
   try {
      await pool.query('SELECT 1');
      console.log('Database connection successful');
   } catch (error) {
      console.error('Failed to connect to the database', error);
   }
  }
  
  // Call the function to check the connection
  checkDatabaseConnection();
  

export default pool;