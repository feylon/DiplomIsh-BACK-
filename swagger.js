import swaggerJSDoc from "swagger-jsdoc";

// Swagger sozlamalari
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Campus CRM API",
      version: "1.0.0",
      description: "Kommentariyalar asosida avtomatik yaratilgan API hujjatlar",
    },
    servers: [
      {
        url: "http://localhost:3000", 
      },
    ],
  },
  apis: ["./Routers/**/*.js"], 
};

// Swagger spetsifikatsiyasini yaratish
const swaggerSpec = swaggerJSDoc(swaggerOptions);
export default swaggerSpec;
