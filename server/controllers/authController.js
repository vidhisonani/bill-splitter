const User = require("../models/User");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    // User Exist or not
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    };
    // Not exist creat e new user
    const user = await User.create({ firstName, lastName, email, password });
    const token = generateToken(user._id);
    return res.status(201).json({ message: "User Created", _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, token });
  } catch (err) {
    console.log("Something went wrong while registering process ", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.login = async (req, res) => {
  try{
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({email}).select("+password");
    if(!user){
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const matchPassword = await user.matchPassword(password);
    if(!matchPassword){
      return res.status(401).json({message: "Invalid email or password"});
    }
    const token = generateToken(user._id);
    return res.status(200).json({message: "User Logged In", _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, token});
  }catch(err){
    console.log("Error while Log in ", err);
    return res.status(500).json({message: "Internal Server Error"});
  } 
}

exports.getMe = async (req, res) => {
  try {
    // req.user is already here, thanks to protect middleware
    // your job: just send it back
    return res.status(200).json(req.user);

  } catch (err) {
    console.log("Error in getMe", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}