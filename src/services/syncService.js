// services/syncService.js
const STORAGE_KEYS = {
  REPORTS: 'site_reports',
  SYNC_QUEUE: 'sync_queue',
  USER_SETTINGS: 'user_settings'
};

class SyncService {
  static async queueReport(report) {
    const queue = this.getQueue();
    queue.push({ type: 'ADD_REPORT', data: report, timestamp: Date.now() });
    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(queue));
  }

  static getQueue() {
    const queue = localStorage.getItem(STORAGE_KEYS.SYNC_QUEUE);
    return queue ? JSON.parse(queue) : [];
  }

  static async processSyncQueue() {
    if (!navigator.onLine) return;

    const queue = this.getQueue();
    const failedItems = [];

    for (const item of queue) {
      try {
        await fetch('/api/reports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item.data)
        });
      } catch (error) {
        failedItems.push(item);
      }
    }

    localStorage.setItem(STORAGE_KEYS.SYNC_QUEUE, JSON.stringify(failedItems));
  }

  static saveReports(reports) {
    localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(reports));
  }

  static getReports() {
    const reports = localStorage.getItem(STORAGE_KEYS.REPORTS);
    return reports ? JSON.parse(reports) : [];
  }

  static saveUserSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));
  }

  static getUserSettings() {
    const settings = localStorage.getItem(STORAGE_KEYS.USER_SETTINGS);
    return settings ? JSON.parse(settings) : {
      defaultCategory: 'maintenance',
      defaultPriority: 'medium',
      notificationsEnabled: true
    };
  }

  static init() {
    window.addEventListener('online', () => {
      this.processSyncQueue();
    });
  }

  static clearStorage() {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
}

export default SyncService;