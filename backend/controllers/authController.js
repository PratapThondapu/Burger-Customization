const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler')
const exportUserstoExcel=require('../Export_Services/user_export_service')
//register
const registerhandler =asyncHandler(async(req,res)=>{
    const { name, email, password } = req.body;
    if (!name ||!email ||!password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }
    try {
      const existingUser = await User.findOne({ email });
    
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = new User({ name, email, password:  hashedPassword });
        const savedUser = await user.save();
        const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        savedUser.token = token;
        res.status(201).json({
          message: 'User created successfully',
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          token: savedUser.token,
          isAdmin: savedUser.isAdmin,   
      isEmployee: savedUser.isEmployee
        });
      } 
      catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error', error: error.message });
        
    }

})
//login
const loginhandler =asyncHandler( async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(401).json({ message: 'User not found' });
    }

    const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    existingUser.token = token; 

    res.status(200).json({
      message: 'Login successful',
      id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
      token: existingUser.token,
      isAdmin: existingUser.isAdmin,
      isEmployee: existingUser.isEmployee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})
//get current user

const profilehandler =asyncHandler( async (req, res) => {
  try {
    const user = req.params.id;
    console.log(user)
    const FoundUser=await User.findById(user)
    if (!FoundUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    console.log(FoundUser.name)

    res.status(200).json({
      id: FoundUser._id,
      name: FoundUser.name,
      email: FoundUser.email,
      token: FoundUser.token,
      isAdmin: FoundUser.isAdmin,
      isEmployee: FoundUser.isEmployee
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}) 
const getallUsers=asyncHandler(async(req, res)=>{
  try {
    const users = await User.find();
    await exportUserstoExcel(users)
    res.status(200).json(users);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})
const roleUpdateHandler=asyncHandler(async(req, res)=>{
  const { isEmployee } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    user.isEmployee = isEmployee;
    await user.save();
    const users= await User.find()
    await exportUserstoExcel(users)
    res.status(200).json({ message: 'Role updated successfully',user });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
})
const deleteUser=asyncHandler(async(req, res)=>{
  const {id}=req.params
  try {
    const user=await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.remove();
    res.status(200).json({ message: 'User deleted successfully',user });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
  }
})
module.exports = { loginhandler,profilehandler,registerhandler,getallUsers,roleUpdateHandler,deleteUser };
