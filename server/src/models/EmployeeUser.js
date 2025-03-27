import mongoose, { mongo } from "mongoose";

const Schema = mongoose.Schema;

const EmployeeUserSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },  
},{ timestamps: true })

const EmployeeUser = mongoose.model('EmployeeUser', EmployeeUserSchema);

export default EmployeeUser;