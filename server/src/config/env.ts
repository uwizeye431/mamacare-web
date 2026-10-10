import dotenv from 'dotenv';
import path from 'path';

// Loads server/.env once; every module that needs env vars imports this file first.
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
