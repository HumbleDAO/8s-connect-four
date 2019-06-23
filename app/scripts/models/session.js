/* eslint-disable no-console */
import io from 'socket.io-client';

class Session {

  constructor({ url }) {
    this.url = url;
  }

  connect() {
    this.socket = io.connect(this.url);
    this.status = 'connecting';
  }

  on(eventName, callback) {
    this.socket.on(eventName, (args = {}) => {
      if (args.status) {
        this.status = args.status;
      }
      if (args.playerId) {
        this.playerId = args.playerId;
      }
      callback(args);
    });
  }

  emit(eventName, data, callback) {
    this.socket.emit(eventName, data, (args = {}) => {
      if (args.status) {
        this.status = args.status;
      }
      if (args.playerId) {
        this.playerId = args.playerId;
      }
      callback(args);
    });
  }

}

export default Session;
