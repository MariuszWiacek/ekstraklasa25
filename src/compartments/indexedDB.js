// indexedDB.js

const DB_NAME = 'gameDataDB';
const STORE_NAME = 'games';

// Function to open the IndexedDB database
export function openDatabase() {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, 1);

    request.onerror = (event) => {
      console.error('Failed to open database:', event.target.errorCode);
      reject(event.target.errorCode);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      console.log('Database opened successfully');
      resolve(db);
    };

    // This event is only implemented in recent browsers
    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store for storing games
      const objectStore = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });

      console.log('Database upgrade needed - creating object store');
      objectStore.createIndex('home', 'home', { unique: false });
      objectStore.createIndex('away', 'away', { unique: false });
      objectStore.createIndex('disabled', 'disabled', { unique: false });
    };
  });
}

// Function to add or update a game in the IndexedDB
export function addOrUpdateGame(game) {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        const request = objectStore.put(game);

        request.onsuccess = () => {
          console.log('Game added/updated successfully');
          resolve();
        };

        request.onerror = (event) => {
          console.error('Error adding/updating game:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        console.error('Failed to open database:', error);
        reject(error);
      });
  });
}

// Function to get all games from the IndexedDB
export function getAllGames() {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const objectStore = transaction.objectStore(STORE_NAME);

        const request = objectStore.getAll();

        request.onsuccess = () => {
          console.log('Games retrieved successfully');
          resolve(request.result);
        };

        request.onerror = (event) => {
          console.error('Error getting games:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        console.error('Failed to open database:', error);
        reject(error);
      });
  });
}

// Function to delete a game from the IndexedDB
export function deleteGame(id) {
  return new Promise((resolve, reject) => {
    openDatabase()
      .then((db) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const objectStore = transaction.objectStore(STORE_NAME);

        const request = objectStore.delete(id);

        request.onsuccess = () => {
          console.log('Game deleted successfully');
          resolve();
        };

        request.onerror = (event) => {
          console.error('Error deleting game:', event.target.error);
          reject(event.target.error);
        };
      })
      .catch((error) => {
        console.error('Failed to open database:', error);
        reject(error);
      });
  });
}
