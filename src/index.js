var Phaser = require('phaser');
import logoImg from "./assets/logo.png";
import CardEditorScene from "./scenes/cardEditorScene.js";



const config = {
  type: Phaser.CANVAS,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: CardEditorScene,
  "transparent": true,
  "autoresize": true
};

const game = new Phaser.Game(config);

function preload() {
  this.load.image("logo", logoImg);
}

function create() {
  const logo = this.add.image(400, 150, "logo");

  this.tweens.add({
    targets: logo,
    y: 450,
    duration: 2000,
    ease: "Power2",
    yoyo: true,
    loop: -1
  });
}
