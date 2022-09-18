import m from "mithril";
import classNames from "../classnames.js";

class Navbar {
  oninit({ connection = null }) {
    this.connection = connection;
    this.navitems = [
      { name: "Home", link: "/" },
      { name: "Discord", link: "https://discord.gg/cbkDnqq4JB" },
      { name: "Connect", link: "/" },
    ];
  }

  async metmask() {
    const { ethereum } = window;
    if (Boolean(ethereum && ethereum.isMetaMask)) {
      let address = await ethereum.request({
        method: "eth_requestAccounts",
      });
      this.userAddress = address[0];
    }
  }

  view({ navitems = [] }) {
    return m("div#navbar", [
      this.navitems.map((item) => {
        return m(
          "div#navbaritem",
          {
            class: classNames({
              "float-left": item.name != "Connect",
              "float-right": item.name == "Connect",
            }),
          },
          item.name == "Connect"
            ? m(
                "a",
                { onclick: () => this.metmask() },
                this.userAddress ? this.userAddress : item.name
              )
            : m("a", { href: item.link }, item.name)
        );
      }),
      //   m(GameComponent, { session: this.session, roomCode: attrs.roomCode }),
    ]);
  }
}

export default Navbar;
