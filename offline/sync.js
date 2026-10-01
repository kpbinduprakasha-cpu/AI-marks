import { getOfflineAnswers, clearOfflineAnswers } from './indexeddb.js';

export async function syncOfflineData() {
    if (!navigator.onLine) {
        console.log("Still offline, cannot sync.");
        return;
    }

    try {
        const offlineAnswers = await getOfflineAnswers();
        if (offlineAnswers.length === 0) {
            console.log("No offline data to sync.");
            return;
        }

        console.log(`Syncing ${offlineAnswers.length} answers to backend...`);
        
        // Mock sync logic
        const response = await fetch('/api/offline/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ answers: offlineAnswers })
        });

        if (response.ok) {
            console.log("Sync successful. Clearing local DB.");
            await clearOfflineAnswers();
        } else {
            console.error("Sync failed.");
        }
    } catch (error) {
        console.error("Error during sync:", error);
    }
}

// Add event listener for returning online
window.addEventListener('online', syncOfflineData);
