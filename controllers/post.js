var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Post from '../models/post.js';
import Hashtag from '../models/hashtag.js';
const afterUploadImage = (req, res) => {
    var _a;
    console.log(req.file);
    res.json({ url: `/img/${(_a = req.file) === null || _a === void 0 ? void 0 : _a.filename}` });
};
const uploadPost = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const post = yield Post.create({
            content: req.body.content,
            img: req.body.url,
            UserId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id,
        });
        const hashtags = req.body.content.match(/#[^\s#]*/g);
        if (hashtags) {
            const result = yield Promise.all(hashtags.map(tag => {
                return Hashtag.findOrCreate({
                    where: { title: tag.slice(1).toLowerCase() },
                });
            }));
            yield post.addHashtags(...result.map(r => r[0]));
        }
        res.redirect('/');
    }
    catch (error) {
        console.error(error);
        next(error);
    }
});

const removePost = async (req, res, next) => {
    try {
      const { id } = req.params.id; // URL에서 id를 추출
      console.log(id)
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
export {  afterUploadImage, uploadPost, removePost  };
