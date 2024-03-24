import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Invalid format of email').isEmail(),
  body('password', 'Password should have min 5 characters').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Invalid format of email').isEmail(),
  body('password', 'Password should have min 5 characters').isLength({ min: 5 }),
  body('fullName', 'Enter your name').isLength({ min: 3 }),
  body('avatarUrl', 'Incorrect url to avatar').optional().isURL(),
];

export const postCreateValidation = [
  body('title', `Put title's header`).isLength({min:3}).isString(),
  body('text', `Put title's text`).isLength({ min: 3 }).isString(),
  body('tags', 'Incorrect format of tags (put the array)').optional().isArray(),
  body('imageUrl', 'Incorrect url to image').optional().isString(),
];

export const postUpdateValidation = [
  body('title', `Put title's header`).optional().isLength({ min: 3 }).isString(),
  body('text', `Put title's text`).optional().isLength({ min: 3 }).isString(),
  body('tags', 'Incorrect format of tags (put the array)').optional().isArray(),
  body('imageUrl', 'Incorrect url to image').optional().isString(),
];
