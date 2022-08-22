class sessionCache {
  setItem(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }

  getItem(key) {
    const cache = window.sessionStorage.getItem(key) ? window.sessionStorage.getItem(key) : null
    if (cache === null) return cache
    return JSON.parse(cache)
  }

  deleteItem(key) {
    window.sessionStorage.removeItem(key)
  }

  clearItem() {
    window.sessionStorage.clear()
  }
}

// eslint-disable-next-line new-cap
export default new sessionCache()
