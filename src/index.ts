/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import {registerValidation, loginValidation, postCreateValidation, postUpdateValidation} from './validations/validations';
import {UserController, PostController} from './controllers/index'
import { checkAuth, handleValidationErrors } from './utils';

mongoose
  .connect(
    'mongodb+srv://admin:Vlad21092000@cluster0.vbnvcd3.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0',
  )
  .then(() => console.log('Database is connected'))
  .catch((err) => console.log('DB error', err));

const port = 7005;
const app = express();

const storage = multer.diskStorage({
  destination: (_: any, __: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, 'uploads');
  },
  filename: (_: any, file: any, cb: (arg0: null, arg1: string) => void) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req: Request, res: Response) => {
  if (req.file) {
    res.json({ url: `/uploads/${req.file.originalname}` });
  } else {
    res.status(400).json({ error: 'No file uploaded' });
  }
}) ;

app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.createOne);
app.patch('/posts/:id', checkAuth, postUpdateValidation, handleValidationErrors, PostController.updateOne);
app.delete('/posts/:id', checkAuth, PostController.removeOne);


app.listen(port, (err?: Error) => {
  if (err) {
    return console.log(err);
  }
  console.log(`Server started on port ${port}`);
});
