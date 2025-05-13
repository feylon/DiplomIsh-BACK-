import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { pool } from './functions/db.js';
import { } from './functions/bcrypt.js';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import {} from "./functions/crypto.js";
import { fileURLToPath } from 'url';
import path from 'path';
import swaggerSpec from "./swagger.js"; // yuqoridagi fayl

// import swaggerDocument from "./swagger.json" assert { type: "json" };


(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database');
        // Perform database operations here
        // ...
        client.release(); // Release the client back to the pool
    } catch (err) {
        console.error('Error connecting to the database', err);
    }
})()
// import { configDotenv } from 'dotenv';

dotenv.config(); // Load environment variables from a .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('./uploads')); // Serve static files from the 'public' directory
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        console.error('Bad JSON');
        return res.status(400).send({ error: 'Bad JSON' });
    }
    next(err);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Error handling middleware


// reusable routers
import login from "./Routers/Reusable/login.js";
import bio from "./Routers/Reusable/bio.js";
import sign from "./Routers/Reusable/sign.js";
import superadmin from "./Routers/Superadmin/index.js";
import admin from "./Routers/Admin/index.js";
import student from "./Routers/Student/index.js";


app.use("/api/login", login);
app.use("/api/sign", sign);
app.use("/api/bio", bio);

superadmin.forEach((i, j) => {
    app.use(`/api/superadmin${i.path}`, i.router);

});

admin.forEach((i, j) => {
    app.use(`/api/admin${i.path}`, i.router);

});


student.forEach((i, j) => {
    app.use(`/api/student${i.path}`, i.router);

});



// Swagger setup
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Kampus API',
            version: '1.0.0',
            description: 'Node.js moduli uchun API hujjatlari',
        },
    },
    apis: ['./routes/*.js'], 
};

// const swaggerSpec = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));





app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

