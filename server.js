const express = require('express')
require('dotenv').config()
const PORT = 8645
const userRouter = require('./router/userRouter')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc')


const app = express();
app.use(express.json())


app.use("/api/v1/user", userRouter)

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'The Curve Bank App',
        version: '2.0.0',
        description: 
            `This is a REST API application made with Express. It retrieves data from JSONPlaceholder.
             The base URL is: http://localhost:8645`,
        license: {
            name: 'Official URL',
            url: 'https://google.com',
        },
        contact: {
            name: 'JSONPlaceholder',
            url: 'https://jsonplaceholder.typicode.com',
        },
    },
    servers: [
        {
            url: 'the-curve-bank-app.vercel.app',
            description: 'development server',
        },
    ],
    security: [
        {
            bearerAuth: []
        }
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: ['./router/*.js']
}

const swaggerSpec = swaggerJsdoc(options);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerSpec))


app.use((req, res , next)=>{
    res.status(500).json({
        message: `route ${req.originalUrl} and ${req.method} not found`
    })
})

// app.use((error, req, res , next)=>{
//     res.status(error.statusCode).json({
//         message: error.message, 
//         status: error.statusCode
//     })
// })
app.use((error, req, res , next)=>{
    if (error.name === 'MulterError'){
        return res.status(400).json({
            message: 'file upload failed'
        })

    }
    if (error.name === 'JsonWebTokenError'){
        return res.status(401).json({
            message: 'session expired, please login again'
        })

    }
   return res.status(500).json({
        message: error.message
    })
})


const mongoose = require('mongoose');

mongoose.connect(process.env.DB_URI).then(()=>{
    console.log('database connected successfully'), app.listen(PORT, ()=>{
    
    console.log('app is listening to port', PORT)
})}).catch((error)=>{console.log(`error connecting to database, ${error.message}`);
})

