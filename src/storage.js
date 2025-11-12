// IndexedDB Storage Manager - Much larger storage capacity
class StorageManager {
  constructor() {
    this.dbName = 'FinanceInventoryDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('finances')) {
          db.createObjectStore('finances', { keyPath: 'id', autoIncrement: true });
        }
        if (!db.objectStoreNames.contains('inventory')) {
          db.createObjectStore('inventory', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveData(type, data) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([type], 'readwrite');
      const store = transaction.objectStore(type);
      const request = store.put({ id: 1, data: data });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async loadData(type) {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([type], 'readonly');
      const store = transaction.objectStore(type);
      const request = store.get(1);
      
      request.onsuccess = () => {
        resolve(request.result ? request.result.data : []);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async clearData() {
    if (!this.db) await this.init();
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(['finances', 'inventory'], 'readwrite');
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      
      transaction.objectStore('finances').clear();
      transaction.objectStore('inventory').clear();
    });
  }
}

// Create global storage manager
window.storageManager = new StorageManager();
