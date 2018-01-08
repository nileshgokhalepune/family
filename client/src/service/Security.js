export const Security = {
  hash: '',
  ticket: '',
  current: {},
  getHeaders() {
    var header = {
      'Content-Type': 'application/json',
    }
    if (this.hash) {
      header['Authorization'] = 'Bearer ' + sessionStorage.getItem(this.hash)
    }
    return header;
  },
  get(key) {
    var value = !key ? sessionStorage.getItem(this.hash) : sessionStorage.getItem(key);
    if (!key) return value;
    return JSON.parse(value);
  },
  set(key, value) {
    sessionStorage.setItem(key, value);
  },
  getHash() {
    return new Promise((resolve, reject) => {
      fetch('/users/hash', {
        headers: this.getHeaders()
      })
        .then(this.checkstatus)
        .then(this.parseJson)
        .then(data => {
          this.hash = data;
          var store = sessionStorage.getItem(data);
          resolve(store);
        }).catch(err => reject(err));
    });
  },
  setHash(value) {
    sessionStorage.setItem(this.hash, value);
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
  invite(guest, source) {
    return new Promise((resolve, reject) => {
      fetch('/users/invite', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          guest: guest,
          source: source
        })
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  getRegData(ciphered) {
    return new Promise((resolve, reject) => {
      fetch('/registerd?r=' + ciphered, {
        method: 'GET',
        headers: this.getHeaders()
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
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
    } else if (response.status === 404) {
      var error = new Error("Resource not found");
      error.response = response;
      throw error;
    } else {
      error = new Error(response.statusText)
      error.response = response;
      throw error;
    }
  },
  parseJson(response) {
    return response.json();
  },
  logout() {
    sessionStorage.clear();
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
    sessionStorage.setItem(key, JSON.stringify(value));
  },
  register(user) {
    return new Promise((resolve, reject) => {
      fetch('/users/create', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          user: user
        })
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    });
  },
  relate(userId, newUserId, relation) {
    return new Promise((resolve, reject) => {
      fetch('/users/relate', {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          userId: userId,
          newUserId: newUserId,
          relation: relation
        })
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  findRelations() {
    return new Promise((resolve, reject) => {
      fetch('/users/relation/find', {
        method: 'GET',
        headers: this.getHeaders()
      }).then(this.checkstatus)
        .then(this.parseJson)
        .then(data => resolve(data))
        .catch(err => reject(err));
    })
  },
  setCurrent(current){
    this.current =current;
  },
  getCurrent(){
    return this.current;
  }
}