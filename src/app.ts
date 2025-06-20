import express, { Application } from 'express';

export const app: Application = express();

app.use('/', () => {
    console.log('Welcome to LMS');
}) ;