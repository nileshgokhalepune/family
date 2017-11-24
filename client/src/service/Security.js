import { locale } from "moment";

export const Security = {
  hash: '',
  ticket: '',
  getHeaders() {
    var header = {
      'Content-Type': 'application/json',
    }
    if (this.hash) {
      header['Authorization'] = 'Bearer ' + localStorage.getItem(this.hash)
    }
    return header;
  },
  get(key) {
    var value = !key ? localStorage.getItem(this.hash) : localStorage.getItem(key);
    if (!key) return value;
    return JSON.parse(value);
  },
  set(key, value) {
    localStorage.setItem(key, value);
  },
  getHash() {
    return new Promise((resolve, reject) => {
      fetch('/users/hash', {
        headers: this.getHeaders()
      })
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
  validate() {
    return new Promise((resolve, reject) => {
      fetch('/users/valid', {
        headers: this.getHeaders(),
        method: 'GET'
      }).then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  login(parms) {
    return new Promise((resolve, reject) => {
      fetch('/users/ticket', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(parms),
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(error => reject(error));
    });
  },
  invite(guest) {
    return new Promise((resolve, reject) => {
      fetch('/users/invite', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          guest: guest
        })
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  getData() {
    return new Promise((resolve, reject) => {
      fetch('/users/data', {
        headers: this.getHeaders()
      }).then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  },
  getResponse(res) {
    return {
      status: res.status,
      body: res.json()
    }
  },
  checkstatus(response) {
    if (response.status >= 200 && response.status <= 300) {
      return response;
    } else {
      var error = new Error(response.statusText)
      error.response = response;
      throw error;
    }
  },
  parseJson(response) {
    return response.json();
  },
  logout() {
    localStorage.clear();
  //localStorage.removeItem(this.hash);
  },
  avatar() {
    return new Promise((resolve, reject) => {
      fetch('/users/avatar', {
        headers: this.getHeaders()
      }).then(res => res.json())
        .then(data => resolve(data))
        .catch(err => reject(err))
    })
  },
  setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}