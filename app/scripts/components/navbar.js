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

  handleClick(itemClicked) {
    if (itemClicked === "Connect") {
      console.log("Connecting Wallet");
    } else {
      console.log("Navigating to " + itemClicked);
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
            ? m("a", { onclick: () => this.handleClick(item.name) }, item.name)
            : m("a", { href: item.link }, item.name)
        );
      }),
      //   m(GameComponent, { session: this.session, roomCode: attrs.roomCode }),
    ]);
  }
}

export default Navbar;
