import mongoose from 'mongoose';
import { app } from './app';
import dotenv from 'dotenv';

dotenv.config();

const port = 5000;

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`);
        })
    } catch (error) {
        console.log(error);
    }
};

main();