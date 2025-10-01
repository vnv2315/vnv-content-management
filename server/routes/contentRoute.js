import express from 'express'
import {addContent,listContent,removeContent,singleContent,updateContent} from "../controllers/contentController.js";
import adminAuth from '../middleware/adminAuth.js';


const contentRouter=express.Router();

contentRouter.post('/add',adminAuth,addContent);
contentRouter.get('/lists',listContent);
contentRouter.post('/remove',adminAuth,removeContent);
contentRouter.get('/list/:id',singleContent);
contentRouter.put('/update/:id',adminAuth,updateContent);

export default contentRouter;