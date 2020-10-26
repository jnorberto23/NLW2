import express from 'express';
import ClassesController from './controllers/classesController'; 
const routes = express.Router();

const classController = new ClassesController();
routes.post('/classes', classController.create);
routes.get('/classes', classController.index);
export default routes;