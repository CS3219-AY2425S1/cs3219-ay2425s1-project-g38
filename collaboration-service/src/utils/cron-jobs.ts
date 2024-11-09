import cron from 'node-cron';
import Session from '../model/session-model';

// Schedule a job to run every hour
cron.schedule('0 * * * *', async () => {
    const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000);

    try {
        // Find and update sessions that are older than 4 hours and still active
        await Session.updateMany(
            { date_created: { $lt: fourHoursAgo }, active: true },
            { $set: { active: false } }
        );
        console.log('Inactive sessions updated successfully');
    } catch (err) {
        console.error('Error updating inactive sessions:', err);
    }
});