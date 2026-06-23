import express from "express";
import productsRouter from "./routes/products";

const app = express();

app.use(express.json());

app.use("/products", productsRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
