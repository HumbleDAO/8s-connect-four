import m from "mithril";

// The player area container which contains both the name/score of each player,
// as well as the reactions UI
class PlayerAbilitiesComponent {
  oninit({ attrs: { game, session, player } }) {
    this.game = game;
    this.session = session;
    this.player = player;
    this.abilities = [
      { type: "common", name: "skip", id: 0, localId: 0 },
      { type: "rare", name: "reset", id: 1, localId: 1 },
    ];
  }
  setAbilities(abilities) {
    this.abilities = abilities;
  }
  useAbility(ability) {
    console.log(
      ability,
      "Ability Used By",
      this.player,
      this.session,
      this.game
    );
    let id = ability.localId;
    if (ability.id === 0) {
      this.game.enableSkipTurn(); // TODO Modify some state to activate reverse
    }
    if (ability.id === 1) {
      this.game.resetGame(); // TODO Modify some state to activate reverse
    }

    this.abilities = this.abilities.filter((ability) => {
      return ability.localId !== id;
    });
    // remove a single object from an array based on object property value
  }
  view({ attrs: { game, session } }) {
     m("div#player-abilities", [
          this.abilities.map((ability) => {
            return m(`div.player-ability.${ability.type}`, {}, [
              m(
                "button.player-ability-name",
                {
                  onclick: () => {
                    this.useAbility(ability);
                  },
                },
                ability.name
              ),
              // m('div.player-score', player.score),
            ]);
          }),
        ])
      : null;
  }
}
export default PlayerAbilitiesComponent;
