class Stroage {
  static set(key, value) {
    localStorage.setItem(key, value);
  }

  static get(key) {
    return localStorage.getItem(key);
  }

  static remove(key) {
    localStorage.removeItem(key);
  }

  static removeAll() {
    localStorage.clear();
  }
}
export default Stroage;
