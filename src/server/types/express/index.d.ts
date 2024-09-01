import { Request } from 'express';

export interface CustomRequest extends Request {
    user?: any; // Replace 'any' with your User type if you have one
}