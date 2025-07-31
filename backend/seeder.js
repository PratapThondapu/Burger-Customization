const dotenv=require('dotenv')
dotenv.config()
const express=require('express')
const app=express();
const initialIngredient=require('../frontend/src/logs/ingredients')
const Burger=require('./logs/Burgers')
const Burgers=require('./models/burgerSchema')
const Users=require('./models/Users')
const initialIngredients=require('./models/initialIngredients')
const connectdb=require('./config/db')
connectdb();
const importdata=async()=>{
try {
    const sampleBurgers=Burger.map(burger=>({...burger,User:'66633ef65bcc4a8fe8975da7'}))
    console.log(sampleBurgers)
    await Burgers.insertMany(sampleBurgers)
    console.log('data imported')
   // await initialIngredients.insertMany(initialIngredient)
    //console.log('data imported')
    process.exit()

} catch (error) {
    console.log(`${error}`)
    process.exit(1)
}
}
const dataDestroy=async()=>{
  /* await Order.deleteMany()
   await Users.deleteMany()
   await Burgers.deleteMany()*/
   console.log('data destroy')
   process.exit()
   
}

if(process.argv[2]==='-d'){
    dataDestroy()
}else{
    importdata()
}
