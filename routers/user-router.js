import { Router } from 'express';

import signup from '../controllers/users/signup';
import login from '../controllers/users/login';
import authenticate from '../middleware/authenticate';
import profile from '../controllers/users/profile';
import update from '../controllers/users/update';
import remove from '../controllers/users/remove';
import sendReinitializationEmail from '../controllers/users/reinitialize-password';
import confirm from '../controllers/users/confirm';

const userRouter = Router();

userRouter.post('/signup', signup);
userRouter.post('/login', login);
userRouter.post('/confirm/:token', confirm);
userRouter.post('/reinitialize-password', sendReinitializationEmail);
userRouter.get('/', authenticate, profile);
userRouter.put('/', authenticate, update);
userRouter.delete('/', authenticate, remove);

export default userRouter;
