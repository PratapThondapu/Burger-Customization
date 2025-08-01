const expressAsyncHandler = require('express-async-handler');
const Order = require('../models/Order');
const exportorderstoexcel=require('../Export_Services/orders_export_service')
const getallOrdersControllers = expressAsyncHandler(async (req, res) => {
    try {
        const orders = await Order.find();
        throw new Error("No orders found");
       exportorderstoexcel(orders); 
       res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: 'Error getting orders', error: error.message });
    }
 });
 const updateorderControllers = expressAsyncHandler(async (req, res) => {
    const { isDelivered } = req.body;
    console.log(isDelivered)
    try {
        const order = await Order.findById(req.params.id);
        if (order) {
            order.isDelivered = isDelivered;
            console.log(order.isDelivered)
            if(order.isDelivered==='Delivered') 
                {order.deliveredAt= new Date();}
            const updatedOrder = await order.save();
            const orders =await Order.find();
            await exportorderstoexcel(orders);
            res.json(updatedOrder);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (error) {
     console.log(error);
        res.status(400).json({ message: 'Error updating order', error: error.message });
    }

}); 

 module.exports={getallOrdersControllers,updateorderControllers}