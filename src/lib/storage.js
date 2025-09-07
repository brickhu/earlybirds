export const storage = (() => {
  const DEFAULT_OPTIONS = {
    ttl: 0, // Default TTL is 0 (never expires) - in seconds
    type: 'localStorage', // Default to use localStorage, can be 'sessionStorage' or 'localStorage'
  };

  // 🔹 Get the appropriate storage object (localStorage or sessionStorage)
  // @param {string} type - The storage type to use ('localStorage' or 'sessionStorage')
  function getStorage(type) {
    return type === 'sessionStorage' ? sessionStorage : localStorage;
  }

  // 🔹 Set data in storage (synchronously)
  // @param {string} key - The key under which the data will be stored
  // @param {any} data - The data to store (can be any JavaScript value)
  // @param {Object} [options={}] - Options object to configure the behavior
  // @param {number} [options.ttl=0] - Time to live in seconds. Default is 0 (no expiry)
  // @param {string} [options.type='localStorage'] - The storage type ('localStorage' or 'sessionStorage')
  function set(key, data, options = {}) {
    const { ttl, type } = { ...DEFAULT_OPTIONS, ...options };
    const expiry = ttl > 0 ? Date.now() + ttl * 1000 : null; // Calculate expiry time
    const value = JSON.stringify({ data, expiry });

    // Store the data in the selected storage
    getStorage(type).setItem(key, value);
  }

  // 🔹 Get data from storage (synchronously)
  // @param {string} key - The key of the item to retrieve
  // @param {string} [type=DEFAULT_OPTIONS.type] - The storage type to use ('localStorage' or 'sessionStorage')
  // @returns {any} The stored data if valid, or null if not found or expired
  function get(key, type = DEFAULT_OPTIONS.type) {
    const item = getStorage("localStorage").getItem(key) || getStorage("sessionStorage").getItem(key)
    if (!item) return null; // Return null if no data found

    try {
      const { data, expiry } = JSON.parse(item); // Parse the stored JSON
      if (expiry && Date.now() > expiry) {
        del(key, type); // Delete the data if it has expired
        return null;
      }
      return data; // Return the actual stored data
    } catch (e) {
      return null; // Return null if JSON parsing fails
    }
  }

  // 🔹 Delete data from storage (synchronously)
  // @param {string} key - The key of the item to delete
  // @param {string} [type=DEFAULT_OPTIONS.type] - The storage type to use ('localStorage' or 'sessionStorage')
  function del(key, type = DEFAULT_OPTIONS.type) {
    getStorage(type).removeItem(key); // Remove the item from storage
  }


  return { set, get, delete: del };
})();
