var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import dotenv from "dotenv";
import express from "express";
import { NewsDataSource } from "./data-source.js";
const app = express();
app.use(express.json());
dotenv.config();
const port = parseInt(process.env.PORT || "4000", 10);
const hostname = process.env.HOST || "localhost";
NewsDataSource.initialize()
    .then(() => {
    console.log("Connected to the DB 📊");
})
    .catch((err) => {
    console.log(`Error in DB connection ${err}`);
});
app.get(["/api/newsposts", "/api", "/", ""], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("Hi there!");
}));
app.listen(port, hostname, () => {
    console.log(`Server is 🚀 & running on http://${hostname}:${port}`);
});
