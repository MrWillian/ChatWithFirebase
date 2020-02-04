import firebase from 'firebase';

class Fire {
  constructor() {
    this.init();
    this.checkAuth();
  }

  init = () => {
    if (!firebase.apps.length) {
      firebase.initializeApp({
        apiKey: "AIzaSyAm-I6pecRjcUHYkHRhmY4Dn-0N-z8QleY",
        authDomain: "chatwithfirebase-dc060.firebaseapp.com",
        databaseURL: "https://chatwithfirebase-dc060.firebaseio.com",
        projectId: "chatwithfirebase-dc060",
        storageBucket: "chatwithfirebase-dc060.appspot.com",
        messagingSenderId: "217799988233",
        appId: "1:217799988233:web:f3f6b6716c41ecdd7f54d8",
        measurementId: "G-BKR9VVVSG1"
      });
    }
  };

  checkAuth = () => {
    firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        firebase.auth().signInAnonymously();
      }
    });
  }

  send = messages => {
    messages.forEach(item => {
      const message = {
        text: item.text,
        timestamp: firebase.database.ServerValue.TIMESTAMP,
        user: item.user
      }

      this.db.push(message);
    })
  };

  parse = message => {
    const { user, text, timestamp } = message.val();
    const { key: _id } = message;
    const createdAt = new Date(timestamp);
    
    return {
      _id,
      createdAt,
      text,
      user
    };
  };

  get = callback => {
    this.db.on('child_added', snapshot => callback(this.parse(snapshot)));
  };

  off() {
    this.db.off();
  }

  get db() {
    return firebase.database().ref('messages')
  }

  get uuid() {
    return (firebase.auth().currentUser || {}).uid;
  }
}

export default new Fire();
