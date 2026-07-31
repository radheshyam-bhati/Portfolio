/**
 * @template T
 * @typedef {object} CacheInstance
 * @property {(key: string) => T|undefined} get
 * @property {(key: string, value: T) => void} set
 * @property {(key: string) => void} remove
 * @property {() => void} clear
 * @property {(key: string) => boolean} has
 */

/**
 * Creates a generic cache with TTL (time-to-live) expiry.
 *
 * Supports both **memory** and **localStorage** backends. When
 * `storage` is `'local'`, the cache persists across page reloads.
 *
 * Every service that needs caching should create its own instance via
 * this factory, passing the appropriate TTL.  This avoids duplicating
 * the inline-cache pattern that was previously repeated across services.
 *
 * @template T
 * @param {{ ttl?: number, storage?: 'memory'|'local' }} [options]
 * @param {number}  [options.ttl=1800000]  – TTL in ms (default 30 min).
 * @param {string}  [options.storage='memory']  – Backend: 'memory' or 'local'.
 * @returns {CacheInstance<T>}
 *
 * @example
 * // In-memory cache (default)
 * const repoCache = createCache({ ttl: 30 * 60 * 1000 });
 * repoCache.set('featured', data);
 * const cached = repoCache.get('featured');
 *
 * @example
 * // localStorage-backed cache (survives page reload)
 * const profileCache = createCache({ storage: 'local', ttl: 5 * 60 * 1000 });
 */
export function createCache({ ttl = 30 * 60 * 1000, storage = 'memory' } = {}) {
  const prefix = 'portfolio_cache:';  // Namespace to avoid collisions

  // -------------------------------------------------------------------
  // localStorage helpers
  // -------------------------------------------------------------------

  /**
   * @param {string} key
   * @param {{ value: T, timestamp: number }} entry
   */
  function writeLocal(key, entry) {
    try {
      localStorage.setItem(prefix + key, JSON.stringify(entry));
    } catch {
      // Storage full or unavailable — silently degrade
    }
  }

  /** @param {string} key */
  function removeLocal(key) {
    try {
      localStorage.removeItem(prefix + key);
    } catch {
      // Silently degrade
    }
  }

  // -------------------------------------------------------------------
  // Memory store (used regardless of storage mode for fast lookups,
  // acts as the exclusive store in 'memory' mode)
  // -------------------------------------------------------------------

  /** @type {Map<string, { value: T, timestamp: number }>} */
  const store = new Map();

  // If localStorage mode, hydrate the memory store on creation
  if (storage === 'local') {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        const raw = localStorage.getItem(key);
        if (raw) {
          try {
            const entry = JSON.parse(raw);
            store.set(key.slice(prefix.length), entry);
          } catch {
            // Skip corrupted entries
          }
        }
      }
    }
  }

  // -------------------------------------------------------------------
  // Core logic (shared by both backends)
  // -------------------------------------------------------------------

  return {
    /**
     * Returns the cached value for `key` if it exists and has not expired.
     *
     * @param {string} key
     * @returns {T|undefined}
     */
    get(key) {
      const entry = store.get(key);
      if (!entry) return undefined;

      if (Date.now() - entry.timestamp >= ttl) {
        store.delete(key);
        if (storage === 'local') removeLocal(key);
        return undefined;
      }

      return entry.value;
    },

    /**
     * Stores `value` under `key` with the current timestamp.
     *
     * @param {string} key
     * @param {T} value
     */
    set(key, value) {
      const entry = { value, timestamp: Date.now() };
      store.set(key, entry);
      if (storage === 'local') writeLocal(key, entry);
    },

    /**
     * Removes a single entry from the cache.
     *
     * @param {string} key
     */
    remove(key) {
      store.delete(key);
      if (storage === 'local') removeLocal(key);
    },

    /**
     * Empties the entire cache (both memory and localStorage).
     */
    clear() {
      if (storage === 'local') {
        for (const key of store.keys()) {
          removeLocal(key);
        }
      }
      store.clear();
    },

    /**
     * Returns `true` when a non-expired entry exists for `key`.
     *
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
      return this.get(key) !== undefined;
    },
  };
}
