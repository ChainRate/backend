import pkg from "express";
const { Request, Response } = pkg;
import express from "express";
import bodyParser from "body-parser";
import reviewRoutes from "./routes/reviewRouter.js";
import cors from "cors";
const programId = "FxDgbzSHngd27THEs7XMy7seVxnvw3qCom3UYqTEYF1";
const app = express();
app.use(bodyParser.json());
app.use(
    cors({
        origin: "*",
    })
);
app.use("/api/reviews", reviewRoutes);

app.get("/", (req, res) => {
    res.send("Hello World!");
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
