import express from "express";
import cors from "cors";
import author from "./routes/author.js";
import list from "./routes/list.js";
import entry from "./routes/entry.js";

const app = express();

// Middleware

app.use(express.json());
app.use(cors());

// Routes

app.use(author);
app.use(list);
app.use(entry);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

export default app;