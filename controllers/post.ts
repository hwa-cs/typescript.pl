import { RequestHandler } from 'express';
import Post from '../models/post';
import Hashtag from '../models/hashtag';

const afterUploadImage: RequestHandler = (req, res) => {
  console.log(req.file);
  res.json({ url: `/img/${req.file?.filename}` });
};

const uploadPost: RequestHandler = async (req, res, next) => {
  try {
    const post = await Post.create({
      content: req.body.content,
      img: req.body.url,
      UserId: req.user?.id,
    });
    const hashtags: string[] = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      await post.addHashtags(...result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error);
    next(error);
  }
};

const removePost: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params; // URL에서 id를 추출
    const post = await Post.destroy({
      where: { id: id }
    });

    if (post) {
      res.redirect('/');
    } else {
      res.status(404).send('Post not found');
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
};


export { afterUploadImage, uploadPost, removePost };
