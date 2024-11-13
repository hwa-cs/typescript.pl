var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import User from '../models/user';
const follow = (userId, followingId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User.findOne({ where: { id: userId } });
    if (user) {
        yield user.addFollowing(parseInt(followingId, 10));
        return 'ok';
    }
    else {
        return 'no user';
    }
});
export { follow };
