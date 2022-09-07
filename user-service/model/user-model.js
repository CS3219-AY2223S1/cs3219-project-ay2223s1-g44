import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

var Schema = mongoose.Schema;
let UserModelSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});

UserModelSchema.pre('validate', async (next) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(this.password, salt);
        this.password = hashedPwd;
        next();
    } catch (err) {
        next(err);
    }
});

export default mongoose.model('UserModel', UserModelSchema);
