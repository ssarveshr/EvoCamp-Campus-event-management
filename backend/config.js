import dotenv from "dotenv";
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const MongoDB = process.env.MONGODB_URI || "mongodb+srv://soithesauce:ssr1032005@campusevent.lcoobnk.mongodb.net/campusevent?retryWrites=true&w=majority";
export const JWT_SECRET = process.env.JWT_SECRET || "a137be3c7746482559c528449bbc5d798be455065536ae869a08ee0d58354349";