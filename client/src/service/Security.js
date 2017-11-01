export const Security = {
  hash: '',
  get() {
    return localStorage.getItem(this.hash);
  },
  set(key, value) {
    localStorage.setItem(key, value);
  },
  getHash() {
    return new Promise((resolve, reject) => {
      fetch('/users/hash')
        .then(res => res.json())
        .then(hash => {
          this.hash = hash;
          var store = localStorage.getItem(hash);
          resolve(store);
        }).catch(err => reject(err));
    });
  },
  setHash(value) {
    localStorage.setItem(this.hash, value);
  },
  validate(store) {
    return new Promise((resolve, reject) => {
      fetch('/users/valid', {
        method: 'POST',
        data: store
      }).then(res => res.json)
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  login(parms) {
    return new Promise((resolve, reject) => {
      fetch('/users/ticket', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(parms),
      }).then(res => res.json())
        .then(obj => {
          Security.setHash(obj.encrypted);
          resolve(obj);
        });
    });
  }

}