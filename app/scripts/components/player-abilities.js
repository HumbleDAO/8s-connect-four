import m from "mithril";
import common from "mocha/lib/interfaces/common";
import classNames from "../classnames.js";

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAbilitiesComponent {
  oninit({ attrs: { game, session, player } }) {
    this.game = game;
    this.session = session;
    this.player = player;
    this.abilities = [{ type: "common", name: "twist", id: 0, localId: 0 }];
  }
  setAbilities(abilities) {
    this.abilities = abilities;
  }
  useAbility(ability) {
    if (ability.id === 0) {
      // TODO Modify some state to activate reverse
    }
    this.abilities = this.abilities.filter((ability) => {
      return ability.localId !== id;
    });
    // remove a single object from an array based on object property value
  }
  view({ attrs: { game, session } }) {
    return m("div#player-abilities", [
      this.abilities.map((ability) => {
        return m(`div.player-ability.${ability.type}`, {}, [
          m("button.player-ability-name", ability.name),
          // m('div.player-score', player.score),
        ]);
      }),
    ]);
  }
}
export default PlayerAbilitiesComponent;
