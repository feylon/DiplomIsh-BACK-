import { configDotenv } from "dotenv";
import pg from "pg";

const {Pool} = pg;
configDotenv();

const pool = new Pool({
connectionString : process.env.DATABASE_URL,
ssl:true
});
pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the database');
    }
});
export {pool};