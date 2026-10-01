import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/error-handler.js";

const app = express();

app.use(cors());
app.use("/api", routes);

app.use((req, res) => {
    res.status(404).json({ message: "Ruta no encontrada" });
});

app.use(errorHandler);

export default app;