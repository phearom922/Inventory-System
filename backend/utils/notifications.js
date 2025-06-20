const Lot = require('../models/Lot');
const cron = require('node-cron');

// Daily notification check for low stock and expiring lots
cron.schedule('0 0 * * *', async () => {
  try {
    const lots = await Lot.find().populate('productId');
    const notifications = [];
    
    lots.forEach(lot => {
      const expiryThreshold = new Date();
      expiryThreshold.setDate(expiryThreshold.getDate() + 30);
      if (lot.expiryDate <= expiryThreshold) {
        notifications.push({
          type: 'expiry',
          message: `Lot ${lot.lotId} of ${lot.productId.name} is nearing expiry on ${lot.expiryDate.toDateString()}`
        });
      }
      if (lot.quantity <= lot.productId.minimumStock) {
        notifications.push({
          type: 'lowStock',
          message: `Lot ${lot.lotId} of ${lot.productId.name} has ${lot.quantity} units, below minimum stock of ${lot.productId.minimumStock}`
        });
      }
    });
    
    // Store notifications in a collection or send via other means (e.g., UI display)
    console.log('Daily Notifications:', notifications);
    // Note: Actual notification display handled in frontend
  } catch (error) {
    console.error('Notification error:', error);
  }
});

module.exports = { checkNotifications: () => console.log('Notification cron job running') };