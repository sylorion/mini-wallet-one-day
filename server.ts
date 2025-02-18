import express  from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import dotenv from "dotenv"
import usersRoutes from "./routes/usersRoutes"
import accountsRoutes from "./routes/accountsRoutes"
import cors from "cors";



dotenv.config();

const app=express()

app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

app.use(express.json());


const PORT = process.env.PORT;

//Configuration de swagger
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
    apis: ["./routes/*.ts"],
  };


const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


//Routes
app.use('/api/users',usersRoutes)
app.use('/api/accounts',accountsRoutes)


app.get('/',(req,res)=>{
    res.send('Mini Wallet Sylorion Test')
});

app.listen(PORT,()=>{
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📄 API Docs available at http://localhost:${PORT}/api-docs`);
})