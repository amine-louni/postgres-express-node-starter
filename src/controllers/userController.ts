import { cathAsync } from '../helpers/catchAsync';
import { User } from '../entities/User';
import AppError from '../helpers/AppError';
import { NOT_FOUND } from '../constatns';




export const getUser = cathAsync(async (req, res, next) => {

    const { uuid } = req.params;
    console.log(uuid, 'uuid')
    // 1 ) find the user  &  check if exists    

    const theUser = await User.findOne({ uuid: uuid });
    console.log(theUser, 'the user')
    if (!theUser) {
        return next(new AppError('use not found', 404, NOT_FOUND));
    }







    // 3) Ok !
    return res.json({
        status: 'success',
        user: theUser
    })

})