import express  from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import dotenv from "dotenv"

dotenv.config();

const app=express()

app.use(express.json());

const PORT = process.env.PORT;

const swaggerOptions = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Mini Wallet Sylorion",
        version: "1.0.0",
        description: "API documentation for Mini Wallet",
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
        },
      ],
    },
    apis: ["./src/routes/*.ts"],
  };


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.get('/',(req,res)=>{
    res.send('Mini Wallet Sylorion Test')
});

app.listen(PORT,()=>{
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 API Docs available at http://localhost:${PORT}/api-docs`);
})