const exporttoexcel = require('./export_service');
const path = require('path');

const exportorderstoexcel = (orders) => {
    if(orders.length>0)
        {
    const worksheetColumnNames = [
        'Order ID', 'User ID','Email', 'Order Status', 'Item Names with Quantity and Price', 
        'Name', 'Address', 'City', 'Country', 'Postal Code', 
        'Payment Method', 'Total Price', 'Paid At', 'Created At'
    ];

    const filepath = path.join(__dirname, '../../frontend/public/datafiles/orders.xlsx');
    const worksheetName = 'Orders';

    const data = orders.map((order) => {
        const itemNamesWithQuantityAndPrice = order.orderItems.map((item) => {
            const selectedIngredients = item.selectedIngredients 
                ? Array.from(item.selectedIngredients).map(([ingredient, qty]) => `${ingredient} (${qty})`).join(', ')
                : 'None';
            return `${item.name} (qty-${item.qty}) (price-${item.price}) (ingredients-${selectedIngredients})\n`;
        }).join(`\n`);

        return [
            order?._id?.toString(),
            order.User.toString(),
            order?.email?.toString(),
            order?.isDelivered?.toString(),
            itemNamesWithQuantityAndPrice, 
            order?.shippingAddress?.name,
            order?.shippingAddress?.address,
            order?.shippingAddress?.city,
            order?.shippingAddress?.country,
            order?.shippingAddress?.postalCode,
            order?.paymentMethod,
            order?.totalprice?.toFixed(2),
            order?.paidAt ? new Date(order.paidAt).toISOString() : '',
            new Date(order?.createdAt).toISOString()
        ];
    });

    try {
        exporttoexcel(data, worksheetColumnNames, worksheetName, filepath);
        console.log(`Orders successfully exported to ${filepath}`);
    } catch (error) {
        console.error('Error exporting orders to Excel:', error);
    }}else{
        console.log('No orders found to export to Excel')
    }
};

module.exports = exportorderstoexcel;
