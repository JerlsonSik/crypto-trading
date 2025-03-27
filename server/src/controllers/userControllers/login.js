import EmployeeUser from "../../models/EmployeeUser.js";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import config from "../../utility/configs.js";
// Get Test Router
const testLoginRouter = async (req, res) => {
  try{
    return res.status(200).json('Successfully hit login router');
  }catch(err){
    return res.status(400).json({error : `testLoginRouter Error: ${err}`})
  }
};

const login = async (req, res) => {
  try{
    const {email, password} = req.body;

    // Find User
    const user = await EmployeeUser.findOne({email: email});
    if(!user){
      return res.status(401).json({message : "Wrong Email"})
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message : "Wrong Password" });
    }

    const token = jwt.sign(
      {userId: user._id, username: user.username, email: user.email},
      config.JWT_SECRET,
      {expiresIn: "24h"}
    );

    return res.status(200).json({"Token": token, "User": user});

  }catch(err){
    console.log(err)
    return res.status(400).json({error : `loginRouter Error: ${err}`})
  }
}

export {
  testLoginRouter,
  login
}