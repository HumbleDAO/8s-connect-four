import m from "mithril";

class createGameModal {
  oninit(isOpen) {
    this.isOpen = false;
  }

  createGame() {
    console.log("Creating Game");
  }

  toggleModal() {
    this.isOpen = !this.isOpen;
  }

  view({ isOpen = false }) {
    return isOpen
      ? m("div#createGameModal", [
          m("h1#createGameHeading", "Create Game"),
          m("div#createGameForm", [
            m("label", "Wager"),
            m("input", { type: "number", id: "wagerAmount" }),
            m("label", "Crypto"),
            m("input", { type: "text", id: "gamePassword", disabled: true }),
            m("button", { onclick: this.createGame }, "Create Game"),
          ]),
          //   m(GameComponent, { session: this.session, roomCode: attrs.roomCode }),
        ])
      : null;
  }
}

export default Navbar;
