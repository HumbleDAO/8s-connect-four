import m from "mithril";

class CreateGameModal {
  oninit({ attrs: { roomCode, game, session } }) {
    this.newPlayerName = "0x0000000000000000000000000000000000000000";
    this.roomCode = roomCode;
    this.game = game;
    this.session = session;
    console.log("Room Code: ", roomCode);
    this.addOnlinePlayer(roomCode);
  }

  setNewPlayerName(name) {
    this.newPlayerName = name;
  }

  addOnlinePlayer(roomCode) {
    console.log("adding online player", roomCode);
    if (roomCode) {
      this.setNewPlayerName("0x....SDK");
      this.submitNewPlayer(roomCode);
    }
  }

  submitNewPlayer(roomCode) {
    if (roomCode) {
      this.addNewPlayerToGame(roomCode);
    } else {
      this.startOnlineGame();
    }
  }

  addNewPlayerToGame(roomCode) {
    this.session.status = "connecting";
    const submittedPlayer = { name: this.newPlayerName, color: "blue" };
    this.session.emit(
      "add-player",
      { roomCode, player: submittedPlayer },
      ({ game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.redraw();
      }
    );
  }

  truncateAddress(address) {
    return address.slice(0, 6) + "..." + address.slice(-4);
  }

  startOnlineGame() {
    this.session.connect();
    // Construct a placeholder player with the name we entered and the default
    // first player color
    const submittedPlayer = { name: this.newPlayerName, color: "red" };
    // Request a new room and retrieve the room code returned from the server
    this.session.emit(
      "open-room",
      { player: submittedPlayer },
      ({ roomCode, game, localPlayer }) => {
        this.game.restoreFromServer({ game, localPlayer });
        m.route.set(`/room/${roomCode}`);
      }
    );
  }

  setPlayers(gameType) {
    if (this.game.players.length > 0) {
      // Reset new games before choosing number of players (no need to reset
      // the very first game)
      this.game.resetGame();
    }
    this.game.setPlayers(gameType);
  }

  promptToStartOnlineGame() {
    this.session.status = "creatingGame";
    this.setPlayers({ gameType: "online" });
  }

  createGame() {
    console.log("Creating Game");
    this.setNewPlayerName(this.truncateAddress(this.newPlayerName));
    this.promptToStartOnlineGame();
    this.startOnlineGame();
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  view({ roomCode = "" }) {
    return !roomCode
      ? m("div#createGameModal", [
          m("h1#createGameHeading", "Create Game"),
          m(
            "div#createGameForm",
            // {
            //   onsubmit: (submitEvent) => this.createGame(),
            // },
            [
              m("label", "Wager"),
              m("input", {
                type: "number",
                id: "wagerAmount",
                autofocus: true,
                required: true,
                // TODO: Should set players address here when they are connected.
              }),

              m("label", "Crypto"),
              m("input", {
                type: "text",
                id: "cryptoWagered",
                value: "MATIC",
                disabled: true,
              }),
              m("button", { onclick: () => this.createGame() }, "Create Game"),
            ]
          ),
          //   m(GameComponent, { session: this.session, roomCode: attrs.roomCode }),
        ])
      : null;
  }
}

export default CreateGameModal;
