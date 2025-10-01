import User from "../models/User.js";
import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// token generation
const createToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};


// signup
const signupUser=async(req,res)=>{
    try {
        const {name,email,password}= req.body;

        if(!name){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        if(!email){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        if(!password){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({success:false,message:"User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({success:false,message:"Enter valid email"})
        }
        if(password.length<8){
            return res.json({success:false,message:"Password should contain atleast 8 characters"})
        }

        const salt=await bcrypt.genSalt(8);
        const hashedPassword=await bcrypt.hash(password,salt);

        const newUser=new User({name,email,password:hashedPassword});

        const user=await newUser.save();

        const token= createToken(user)

        res.json({success:true,token})

    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

// login
const loginUser=async(req,res)=>{

    try {
        const {email, password}= req.body;
        if(!email){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        if(!password){
            return res.status(400).json({success:false,message:"Invalid credentials"})
        }
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({ message: "User does not exist" });
        }

        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = createToken(user);
        res.json({ success: true, token });


    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// admin
const adminLogin=async(req,res)=>{

    try {
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({success:false,message:"All fields are required"})
        }
        let token;
        if(email==process.env.ADMIN_EMAIL && password==process.env.ADMIN_PASSWORD){
            token = jwt.sign(email+password,process.env.JWT_SECRET);
            return res.json({success:true,token})
        }
        else{
            return res.status(400).json({success:false,message:"Invalid admin credentials"})
        }
        res.json({success:true,token})
    } catch (error) {
        res.status(500).json({success:false,message:error.message})
    }
}

export {loginUser,adminLogin,signupUser};