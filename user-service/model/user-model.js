import mongoose from "mongoose";
import bcrypt from 'bcrypt';

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

UserModelSchema.pre('validate', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPwd = await bcrypt.hash(this.password, salt)
        this.password = hashedPwd
        next()
    } catch (err) {
        next(error)
    }
})

export default mongoose.model("UserModel", UserModelSchema);
