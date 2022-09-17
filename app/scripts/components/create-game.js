import m from "mithril";

class CreateGameModal {
  oninit(isOpen) {
    this.isOpen = true;
  }

  createGame() {
    console.log("Creating Game");
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
                this.submitNewPlayer(submitEvent, roomCode),
            },
            [
              m("label", "Wager"),
              m("input", {
                type: "number",
                id: "wagerAmount",
                name: "new-player-name",
                autofocus: true,
                required: true,
                // TODO: Should set players address here when they are connected.
                oninput: (inputEvent) =>
                  this.setNewPlayerName(inputEvent + Math.random()),
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
                { onclick: this.createGame },
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
