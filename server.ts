import express  from "express";
import swaggerUi from 'swagger-ui-express'
import swaggerJsDoc from 'swagger-jsdoc'
import dotenv from "dotenv"
import usersRoutes from "./routes/usersRoutes"
import accountsRoutes from "./routes/accountsRoutes"
import cors from "cors";
import { limiter } from "./middleware/rateLimiter";
import helmet from "helmet";
import cookieParser from "cookie-parser"
import { xrfToken,Csrf} from "./middleware/crsfMiddleware";
import compression from 'compression'

dotenv.config();

const app=express()
const PORT = process.env.PORT;

//Configuration des cross-origin resouce sharing
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization"
}));

//limiteur de requêtes
app.use ('/api',limiter)

app.use(compression())

//la taille maximale du corps d'une requête est de 10kb
app.use(express.json({limit:'10kb'}));

//limiter les attaques 
//XSS
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

//CSRF
app.use(cookieParser());
app.use(Csrf);
app.use(xrfToken)

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