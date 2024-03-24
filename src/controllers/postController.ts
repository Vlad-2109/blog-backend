/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import PostModel from '../models/post';

export const getAll = async (req: Request, res: Response) => {
  try {
    const posts = await PostModel.find()
      .populate({ path: 'user', select: ['fullName', 'avatarUrl'] })
      .exec();

    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Posts are not getted' });
  }
};

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndUpdate(
      {
        _id: postId,
      },
      {
        $inc: { viewsCount: 1 },
      },
      {
        returnDocument: 'after',
      },
    )
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: 'Post not found' });
        }
        res.json(doc);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ messsage: 'Post is not getted' });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Posts are not getted' });
  }
};

export const createOne = async (req: Request | any, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const doc = new PostModel({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags,
    });

    const post = await doc.save();

    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'The post has not be created',
    });
  }
};

export const removeOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;

    await PostModel.findOneAndDelete({
      _id: postId,
    })
      .then((doc) => {
        if (!doc) {
          return res.status(404).json({ message: 'Post not found' });
        }
        res.json({ success: true });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({ messsage: 'The post has not be deleted' });
      });
  } catch (err) {
    console.log(err);
  }
};

export const updateOne = async (req: Request | any, res: Response) => {
  try {
    const postId = req.params.id;

    const post = await PostModel.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const allowedFields = ['title', 'text', 'imageUrl', 'tags'];
    const unknownFields = Object.keys(req.body).filter(
      (field) => !allowedFields.includes(field),
    );
    if (unknownFields.length > 0) {
      return res
        .status(400)
        .json({ message: `Unknown fields: ${unknownFields.join(', ')}` });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    await PostModel.updateOne(
      { _id: postId },
      {
        title: req.body.title,
        text: req.body.text,
        imageUrl: req.body.imageUrl,
        user: req.userId,
        tags: req.body.tags,
      },
    );
    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).json({ messsage: 'The post has not be updated' });
  }
};
