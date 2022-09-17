import m from "mithril";

class CreateGameModal {
  oninit({ attrs: { roomCode } }) {
    this.newPlayerName = "0x0000000000000000000000000000000000000000";
    this.roomCode = roomCode;
  
  }

  createGame() {
    console.log("Creating Game");
    this.setNewPlayerName(this.newPlayerName),
    this.startOnlineGame();
  }

  setNewPlayerName(inputEvent) {
    this.newPlayerName = inputEvent;
  }



  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  view({ isOpen = true }) {
    return isOpen
      ? m("div#createGameModal", [
          m("h1#createGameHeading", "Create Game"),
          m(
            "form#createGameForm",
            {
              onsubmit: (submitEvent) =>
                this.createGame(),
            },
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
              m(
                "button[type=submit]",
                "Create Game"
              ),
            ]
          ),
          //   m(GameComponent, { session: this.session, roomCode: attrs.roomCode }),
        ])
      : null;
  }
}

export default CreateGameModal;
