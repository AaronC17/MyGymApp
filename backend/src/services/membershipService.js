const Membership = require('../models/Membership');
const { sendEmail } = require('../config/azure');

// Check and update expired memberships
const checkExpiredMemberships = async () => {
  try {
    const now = new Date();
    const expired = await Membership.updateMany(
      {
        status: 'active',
        endDate: { $lt: now },
      },
      {
        $set: { status: 'expired' },
      }
    );

    console.log(`Updated ${expired.modifiedCount} expired memberships`);
    return expired.modifiedCount;
  } catch (error) {
    console.error('Error checking expired memberships:', error);
    throw error;
  }
};

// Send expiration notifications
const sendExpirationNotifications = async (days = 7) => {
  try {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);

    const memberships = await Membership.find({
      status: 'active',
      endDate: { $lte: expirationDate, $gte: new Date() },
    }).populate('userId', 'email name');

    for (const membership of memberships) {
      const daysUntilExpiration = Math.ceil(
        (new Date(membership.endDate) - new Date()) / (1000 * 60 * 60 * 24)
      );

      const subject = `Tu membresía de Energym expira en ${daysUntilExpiration} días`;
      const htmlContent = `
        <h2>Recordatorio de Membresía</h2>
        <p>Hola ${membership.userId.name},</p>
        <p>Tu membresía de Energym expirará en ${daysUntilExpiration} días (${new Date(membership.endDate).toLocaleDateString()}).</p>
        <p>Por favor, renueva tu membresía para continuar disfrutando de nuestros servicios.</p>
        <p>¡Te esperamos en Energym!</p>
      `;

      try {
        await sendEmail(membership.userId.email, subject, htmlContent);
        console.log(`Notification sent to ${membership.userId.email}`);
      } catch (error) {
        console.error(`Error sending email to ${membership.userId.email}:`, error);
      }
    }

    return memberships.length;
  } catch (error) {
    console.error('Error sending expiration notifications:', error);
    throw error;
  }
};

// Run daily checks (can be scheduled with cron or Azure Functions)
const runDailyChecks = async () => {
  try {
    await checkExpiredMemberships();
    await sendExpirationNotifications(7); // 7 days before
    await sendExpirationNotifications(1); // 1 day before
    console.log('Daily membership checks completed');
  } catch (error) {
    console.error('Error in daily checks:', error);
  }
};

module.exports = {
  checkExpiredMemberships,
  sendExpirationNotifications,
  runDailyChecks,
};

