//import stuffImg from "../assets/stuff.jpg"
//import stuffJson from "../assets/sprites.json"
import backImg from "../assets/card_frame_back.png"
import unitImg from "../assets/card_frame_unit.png"

import delayedInfantry from "../assets/proto/infantry_delayed.png"
import instantInfantry from "../assets/proto/infantry_instant.png"
import instantVehicle from "../assets/proto/vehicle_instant.png"
import delayedVehicle from "../assets/proto/vehicle_delayed.png"
import instantPlane from "../assets/proto/plane_instant.png"
import delayedPlane from "../assets/proto/plane_delayed.png"
import instantStructure from "../assets/proto/structure_instant.png"
import delayedStructure from "../assets/proto/structure_delayed.png"
import instantSpy from "../assets/proto/spy_instant.png"
import delayedSpy from "../assets/proto/spy_delayed.png"
import research from "../assets/proto/research.png"
import actionOverlay from "../assets/proto/action_overlay.png"
import actionCostIcon from "../assets/proto/icon_action_cost.png"
import actionDamageIcon from "../assets/proto/icon_action_damage.png"
import actionEffectIcon from "../assets/proto/icon_action_effect.png"
import lineOfSightIcon from "../assets/proto/binoculars.png"
import ammoIcon from "../assets/proto/bullets.png"
import goldIcon from "../assets/proto/coins.png"
import techIcon from "../assets/proto/idea.png"
import movementIcon from "../assets/proto/login.png"
import oilIcon from "../assets/proto/barrel.png"
import spyIcon from "../assets/proto/detective.png"

import testDetailImg from "../assets/cruiser.png"

var Phaser = require('phaser');

var axios = require('axios');

//axios.defaults.headers.get['Content-Type'] = 'application/json';

//TODO 
//
//fix empty card list bug
//fix img generation from canvas ?
//refactor some functions and vars to /domain ?

const CARD_API_URL = 'http://localhost:8888/api/cards';
const CARD_RESOURCE_CHOICES = [
    { value: "GOLD", choice: "Cash" },
    { value: "OIL", choice: "Treibstoff" },
    { value: "AMMO", choice: "Munition" },
    { value: "SPY", choice: "Spionage" },
    { value: "RESEARCH", choice: "Forschung" }
];
const CARD_TURN_TYPE_CHOICES = [
    { value: "INSTANT", choice: "Sofort" },
    { value: "DELAYED", choice: "Normal" }
];

const CARD_TYPE_CHOICES = [
    { value: "STRUCTURE", choice: "Gebäude" },
    { value: "INFANTRY", choice: "Infanterie" },
    { value: "VEHICLE", choice: "Fahrzeug" },
    { value: "PLANE", choice: "Flugzeug" },
    { value: "COMMAND", choice: "Befehl" },
    { value: "SPY", choice: "Spionage" },
    { value: "RESEARCH", choice: "Forschung" }
];

const CARD_FACTION_CHOICES = [
    { value: "THIRD_REICH", choice: "Deutsches Reich" },
    { value: "UNITED_KINGDOM", choice: "Großbritannien" },
    { value: "FRANCE", choice: "Frankreich" },
    { value: "UDSSR", choice: "Sowjetunion" },
    { value: "ITALY", choice: "Italien" },
    { value: "JAPAN", choice: "Japan" },
    { value: "FINLAND", choice: "Finnland" },
    { value: "UNITED_STATES", choice: "USA" },
    { value: "NEUTRAL", choice: "Neutral" }
];

const CARD_ACTION_EFFECT_CHOICES = [
    { value: "BURN", choice: "Verbrennung" },
    { value: "STUN", choice: "Betäubung" }
];

export default class CardEditorScene extends Phaser.Scene {

    cards = [];
    currentCard = {};
    cardImg;
    cartTypeText;
    cardNameTxt;
    cardDescTxt;
    cardFactionTxt;
    cardArmorTxt;
    cardHealthTxt;
    cardSummonCostTxt;
    cardTurnCostTxt;
    cardTurnCostIcon;
    cardSummonCostIcon;
    cardLosIcon;
    cardMovementRangeIcon;
    cardLosText;
    cardMovementRangeText;
    cardBottomOverlay;
    cardActions = [];
    minRangeTxt;
    maxRangeTxt;
    bottomOverlayObjects = [];

    updateCurrentCard() {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Credentials': true,
                'Authorization': 'Basic Y2FyZHRlc3Q6YsO8Y2tlbG5taXRiaXNp'
            },
            data: {},
        };

        return new Promise((resolve, reject) => {
            axios.get(CARD_API_URL + '/list', config).then((response) => {
                console.debug(response.data);
                this.cards = response.data;
                console.debug(this.cards);
                this.currentCard = window.lastEdit != undefined ? window.lastEdit : this.cards[0];

                resolve(response);
                /*console.log(response);
                console.log(this.cards);*/
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });

    }

    preload() {
        //this.load.image("tstuff", stuffImg);
        //this.load.atlas("tstuff", stuffImg, "src/assets/sprites.json")
        //this.load.json("spstuff", "src/assets/sprites.json");
        //this.load.image('back_frame', backImg);
        //this.load.image('unit_frame', unitImg);
        //this.cards = [];
        this.load.image('infantry_instant', instantInfantry);
        this.load.image('infantry_delayed', delayedInfantry);
        this.load.image('vehicle_instant', instantVehicle);
        this.load.image('vehicle_delayed', delayedVehicle);
        this.load.image('plane_instant', instantPlane);
        this.load.image('plane_delayed', delayedPlane);
        this.load.image('structure_instant', instantStructure);
        this.load.image('structure_delayed', delayedStructure);
        this.load.image('spy_instant', instantSpy);
        this.load.image('spy_delayed', delayedSpy);
        this.load.image('research_delayed', research);
        this.load.image('research_instant', research);
        this.load.image('action_overlay', actionOverlay);
        this.load.image('icon_action_cost', actionCostIcon);
        this.load.image('icon_action_damage', actionDamageIcon);
        this.load.image('icon_action_effect', actionEffectIcon);
        this.load.image('icon_los', lineOfSightIcon);
        this.load.image('icon_ammo', ammoIcon);
        this.load.image('icon_gold', goldIcon);
        this.load.image('icon_tech', techIcon);
        this.load.image('icon_movement', movementIcon);
        this.load.image('icon_oil', oilIcon);
        this.load.image('icon_spy', spyIcon);
        this.updateCurrentCard.bind(this)().then(succ => { console.log(succ) }).catch(err => console.error(err));
    }

    create() {

        //let img_unit = this.add.image(this.game.config.width / 2, this.game.config.height / 2, 'unit_frame');
        //let img_unit = this.add.image(250, this.game.config.height - 300, 'unit_frame');

        if (this.cards.length == 0 && Object.keys(this.currentCard).length == 0) {
            setTimeout(this.createEditor.bind(this), 6000);
        }
        else {
            this.createEditor.bind(this)();
        }

        //window.onbeforeunload = function (e) {e.preventDefault();}
        /* window.addEventListener('unload', function(event){
             event.preventDefault();
             this.updateCurrentCard.bind(this)();
         }.bind(this));*/

        window.refreshEditor = function () {
            this.updateCurrentCard.bind(this)().then(success => {
                console.debug(success);
                this.destroyBottomOverlay.bind(this)();
                this.updateCardProperties.bind(this)();
                this.destroyCardOverlay.bind(this)();
                this.createCardActionOverlay.bind(this)();
            }).catch(error => {
                console.error(error);
            });

        }.bind(this);

        //img_unit.scaleX = 0.75;
        //img_unit.scaleY = 0.75;
        /*let img_back = this.add.image(this.game.config.width / 2 + 200, this.game.config.height / 2, 'back_frame');
        img_back.scaleX = 0.5;
        img_back.scaleY = 0.5;*/
        //let tImg = this.add.image(0,0, "tstuff");
        /*console.log(this.load.json("spstuff"));
        let stuffs = [];
        for(let i = 1; i < 16; i++){
            let texture = this.textures.addSpriteSheetFromAtlas(
                'sprite' + i, {
                    atlas: 'tstuff',
                    frame: 'sprite' + i,
                    frameWidth: 400,
                    frameHeight: 550
                }
            )
            stuffs = [...stuffs, texture];
        }*/

    }

    shortFaction(faction) {
        switch (faction) {
            case "UNITED_STATES":
                return "US";
            case "UDSSR":
                return "RUS";
            case "THIRD_REICH":
                return "GER";
            case "FINLAND":
                return "FIN";
            case "ITALY":
                return "ITA";
            case "UNITED_KINGDOM":
                return "UK";
            case "FRANCE":
                return "FR";
            case "JAPAN":
                return "JAP";
            case "NEUTRAL":
                return "N";
            default:
                return "NYI";
        }
    }

    resourceIcon(resourceType) {
        switch (resourceType) {
            case "GOLD":
                return 'icon_gold';
            case "OIL":
                return 'icon_oil'
            case "AMMO":
                return 'icon_ammo';
            case "SPY":
                return 'icon_spy';
            case "RESEARCH":
                return 'icon_research';
            default:
                throw new Error('Could not handle resourceType ' + resourceType);
        }

    }

    disableInteractive() {
        this.cardTypeText.disableInteractive();
        this.cardNameTxt.disableInteractive();
        this.cardDescTxt.disableInteractive();
        this.cardFactionTxt.disableInteractive();
        this.cardArmorTxt.disableInteractive();
        this.cardHealthTxt.disableInteractive();
        //console.log(this.currentCard.type);
        //console.log(this.currentCard.type == 'INFANTRY');
        if (this.currentCard.type == 'INFANTRY' || this.currentCard.type == 'VEHICLE' || this.currentCard.type == 'PLANE') {
            this.cardLosText.disableInteractive();
            this.cardMovementRangeText.disableInteractive();
        }
        this.turnCostTxt.disableInteractive();
        this.cardTurnCostIcon.disableInteractive();
        this.minRangeTxt.disableInteractive();
        this.maxRangeTxt.disableInteractive();
        this.summonCostTxt.disableInteractive();
        this.cardSummonCostIcon.disableInteractive();
        //this.cardLosText.disableInteractive();
        //console.log("disabled Interactives");
        //console.log(this.summonCostTxt);
    }
    enableInteractive() {
        //console.log(this.cardLosText.enableInteractive);
        this.cardTypeText.setInteractive();
        this.cardNameTxt.setInteractive();
        this.cardDescTxt.setInteractive();
        this.cardFactionTxt.setInteractive();
        this.cardArmorTxt.setInteractive();
        this.cardHealthTxt.setInteractive();
        if (this.currentCard.type == 'INFANTRY' || this.currentCard.type == 'VEHICLE' || this.currentCard.type == 'PLANE') {
            this.cardLosText.setInteractive();
            this.cardMovementRangeText.setInteractive();
        }
        this.turnCostTxt.setInteractive();
        this.cardTurnCostIcon.setInteractive();
        this.minRangeTxt.setInteractive();
        this.maxRangeTxt.setInteractive();
        this.summonCostTxt.setInteractive();
        this.cardSummonCostIcon.setInteractive();
    }

    changeProperty(modalProps) {
        this.disableInteractive();
        let modal = window.createModal(modalProps);
        if (modalProps.indexedEdit) {
            //modalProps.indexedEdit == 'ACTION' ? this.currentCard.actions[modalProps.index][modalProps.valToEdit] = window.lastNewVal : this.currentCard.actions[window.index][window.valToEdit][window.effectIndex] = window.lastNewVal;
            window.indexedEdit = modalProps.indexedEdit;
            window.index = modalProps.index;
            if (modalProps.indexedEdit == 'EFFECT') {
                window.effectIndex = modalProps.effectIndex;
            }
        }
        /*else{
            this.currentCard[modalProps.valToEdit] = window.lastNewVal;
        }*/
        window.currentCard = modalProps.card;
        window.currentModal = modal;
        window.valToEdit = modalProps.valToEdit;
        /*if(modalProps.indexedEdit){
            window.indexedEdit == 'ACTION' ? card.actions[window.index][window.valToEdit] = newVal : card.actions[window.index][window.valToEdit][window.effectIndex] = newVal;
            window.indexedEdit = undefined;
          }
          else{
            card[window.valToEdit] = newVal;
        } */

        $('#' + modalProps.id).modal('toggle');
    }

    createEditor() {
        this.scene.scene.input.setTopOnly(true);
        console.warn(this.scene);
        //this.currentCard = this.cards[0];
        //console.log(this.currentCard);
        this.cardDetailImg = this.add.image()
        this.cardImg = this.add.image(this.game.config.width / 2, this.game.config.height / 2, this.currentCard.summonActionCost == 'DELAYED' ? this.currentCard.type.toLowerCase() + '_delayed' : this.currentCard.type.toLowerCase() + '_instant');
        this.cardTypeText = this.add.text(540, 50, this.currentCard.type, { fontSize: 10 });
        this.cardTypeText.setInteractive().on('pointerdown', function (e, x, y) {
            this.changeProperty({
                id: 'changeCardTypeModal', title: 'Kartentyp ändern', currentVal: this.currentCard.type, card: this.currentCard, valToEdit: 'type', choice: true, choices: CARD_TYPE_CHOICES
            });
        }.bind(this));
        this.cardImg.setScale(0.4);

        this.cardNameTxt = this.add.text(250, 50, this.currentCard.name);
        this.cardNameTxt.setInteractive().on('pointerdown', function (event, x, y) {
            this.changeProperty(({ id: 'changeCardNameModal', title: 'Kartennamen ändern', currentVal: this.currentCard.name, card: this.currentCard, valToEdit: 'name' }));
        }.bind(this));

        this.cardDescTxt = this.add.text(250, 500, this.currentCard.description);
        this.cardDescTxt.setInteractive().on('pointerdown', function (e, x, y) {
            this.changeProperty({ id: 'changeCardDescModal', title: 'Beschreibung ändern', currentVal: this.currentCard.description, card: this.currentCard, valToEdit: 'description' });
        }.bind(this));
        this.cardFactionTxt = this.add.text(550, 85, this.shortFaction(this.currentCard.faction));
        this.cardFactionTxt.setInteractive().on('pointerdown', function (e, x, y) {
            this.changeProperty({
                id: 'changeCardFactionModal', title: "Fraktion ändern", currentVal: this.currentCard.faction, card: this.currentCard, valToEdit: 'faction', choice: true, choices: CARD_FACTION_CHOICES
            });
        }.bind(this));
        if (this.currentCard.type != "RESEARCH") {
            if (this.currentCard.type != "SPY" || this.currentCard.type != "MODIFICATION") {
                this.cardArmorTxt = this.add.text(547, 230, this.currentCard.armor, { color: 'black', fontSize: 24 });
                this.cardArmorTxt.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({ id: 'changeCardArmorModal', title: 'Rüstung ändern', currentVal: this.currentCard.armor, card: this.currentCard, valToEdit: 'armor' });
                }.bind(this));
                this.cardHealthTxt = this.add.text(547, 285, this.currentCard.health, { color: 'black', fontSize: 24 });
                this.cardHealthTxt.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({ id: 'changeCardHealthModal', title: 'Hitpoints ändern', currentVal: this.currentCard.health, card: this.currentCard, valToEdit: 'health' });
                }.bind(this));
                if (this.currentCard.type != "STRUCTURE") {
                    this.cardBottomOverlay = this.add.image(250, 580, 'action_overlay');
                    this.cardBottomOverlay.setScale(0.1);
                    this.cardLosIcon = this.add.image(210, 580, 'icon_los');
                    this.cardLosIcon.setScale(0.04);
                    this.cardLosText = this.add.text(225, 572, this.currentCard.lineOfSight);
                    this.cardLosText.setInteractive().on('pointerdown', function (e, x, y) {
                        this.changeProperty({
                            id: 'changeCardLosModal', title: 'Sichtweite ändern', currentVal: this.currentCard.lineOfSight, card: this.currentCard, valToEdit: 'lineOfSight'
                        });
                    }.bind(this));
                    this.cardMovementRangeIcon = this.add.image(250, 580, 'icon_movement');
                    this.cardMovementRangeIcon.setScale(0.04);
                    this.cardMovementRangeText = this.add.text(265, 572, this.currentCard.movementRange);
                    this.cardMovementRangeText.setInteractive().on('pointerdown', function (e, x, y) {
                        this.changeProperty({
                            id: 'changeCardMovementRangeModal', title: 'Bewegungsreichweite ändern', currentVal: this.currentCard.movementRange, card: this.currentCard, valToEdit: 'movementRange'
                        });
                    }.bind(this));
                    this.bottomOverlayObjects.push(this.cardBottomOverlay, this.cardLosIcon, this.cardLosText, this.cardMovementRangeIcon, this.cardMovementRangeText);
                }
            }
            console.log(this.currentCard);
            this.turnCostTxt = this.add.text(285, 82, this.currentCard.turnCost, { color: 'black', fontSize: 24 });
            this.turnCostTxt.setInteractive().on('pointerdown', function (e, x, y) {
                this.changeProperty({ id: 'changeCardTurnCostModal', title: 'Unterhaltskosten ändern', currentVal: this.currentCard.turnCost, card: this.currentCard, valToEdit: 'turnCost' });
            }.bind(this));
            this.cardTurnCostIcon = this.add.image(292, 115, this.resourceIcon(this.currentCard.turnCostType));
            this.cardTurnCostIcon.setInteractive().on('pointerdown', function (e, x, y) {
                this.changeProperty({
                    id: 'changeCardTurnCostIcon', title: "Unterhaltskostentyp ändern", currentVal: this.currentCard.turnCostType, card: this.currentCard, valToEdit: 'turnCostType', choice: true, choices: CARD_RESOURCE_CHOICES
                });
            }.bind(this));
            this.cardTurnCostIcon.setScale(0.04);
            this.minRangeTxt = this.add.text(349, 85, this.currentCard.minRange + '-', { color: 'black', fontSize: 14 });
            this.maxRangeTxt = this.add.text(366, 85, this.currentCard.maxRange, { color: 'black', fontSize: 14 });
            this.minRangeTxt.setInteractive().on('pointerdown', function (e, x, y) {
                this.changeProperty({ id: 'changeCardMinRangeModal', title: 'minmale Beschwörungsreichweite ändern', currentVal: this.currentCard.minRange, card: this.currentCard, valToEdit: 'minRange' });
            }.bind(this));
            this.maxRangeTxt.setInteractive().on('pointerdown', function (e, x, y) {
                this.changeProperty({ id: 'changeCardMaxRangeModal', title: 'maximale Beschwörungsreichweite ändern', currentVal: this.currentCard.maxRange, card: this.currentCard, valToEdit: 'maxRange' });
            }.bind(this));
        }
        this.summonCostTxt = this.add.text(238, 85, this.currentCard.summonCost, { color: 'black', fontSize: 24 });
        this.summonCostTxt.setInteractive().on('pointerdown', function (e, x, y) {
            this.changeProperty({ id: 'changeCardSummonCostModal', title: 'Beschwörungskosten ändern', currentVal: this.currentCard.summonCost, card: this.currentCard, valToEdit: 'summonCost' });
        }.bind(this));
        this.cardSummonCostIcon = this.add.image(245, 115, this.resourceIcon(this.currentCard.summonCostType));
        this.cardSummonCostIcon.setInteractive().on('pointerdown', function (e, x, y) {
            this.changeProperty({
                id: 'changeCardSummonCostIcon', title: "Beschwärungskostentyp ändern", currentVal: this.currentCard.summonCostType, card: this.currentCard, valToEdit: 'summonCostType', choice: true, choices: CARD_RESOURCE_CHOICES
            });
        }.bind(this));
        this.cardSummonCostIcon.setScale(0.04);

        this.createCardActionOverlay.bind(this)();

        /*let div = document.createElement('div');
        div.style = 'background-color: grey; overflow:scroll;';
        div.id = 'cardList';
        let el = this.add.dom(400, 200, div);
        let container = this.add.container(400, 200)
        container.add([el]);
        this.cardUiList = [];*/
        let contDiv = $('body').append('<div style="background-color: grey; overflow:scroll;" id="cardList"></div>');
        this.cards.forEach((card, index) => {


            /*let cardBar = this.add.image(700, 50 + index * 40, 'action_overlay');
            cardBar.setScale(0.2);
            let cardBarText = this.add.text(620, 50 + index * 40, card.name);*/
            $('#cardList').append('<div id="' + card.number + '" onclick="selectCard(\'' + card.number + '\')">' + card.name + '</div>');
            //this.cardUiList.push({bar: cardBar, text: cardBarText});
        });
    }

    createCardActionOverlay() {
        if (this.currentCard.actions.length > 0) {
            for (let j = 0; j < this.currentCard.actions.length; j++) {
                let objects = [];
                let actionOverlay = this.add.image(this.game.config.width / 2, 370 + (j * 73), 'action_overlay');
                actionOverlay.setScale(0.4);
                objects.push(actionOverlay);
                let iconCostAction = this.add.image(250, 380, 'icon_action_effect');
                iconCostAction.setScale(0.4);
                objects.push(iconCostAction);
                let iconActionDamage = this.add.image(410, 380, 'icon_action_damage');
                iconActionDamage.setScale(0.4);
                objects.push(iconActionDamage);
                let iconActionEffect = this.add.image(500, 380, 'icon_action_effect');
                iconActionEffect.setScale(0.4);
                objects.push(iconActionEffect);
                let actionName = this.add.text(360, 345, this.currentCard.actions[j].name);
                actionName.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardActionName' + j,
                        title: 'Aktionsnamen ändern',
                        currentVal: this.currentCard.actions[j].name,
                        card: this.currentCard,
                        valToEdit: 'name',
                        indexedEdit: 'ACTION',
                        index: j
                    });
                }.bind(this));
                objects.push(actionName);
                let actionCost = this.add.text(250, 380, this.currentCard.actions[j].cost);
                actionCost.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardActionCost' + j,
                        title: 'Aktionskosten ändern',
                        currentVal: this.currentCard.actions[j].cost,
                        card: this.currentCard,
                        valToEdit: 'cost',
                        indexedEdit: 'ACTION',
                        index: j
                    });
                }.bind(this));
                objects.push(actionCost);
                let iconActionResource = this.add.image(290, 380, this.resourceIcon(this.currentCard.actions[j].costType));
                iconActionResource.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardActionIconCostIcon' + j,
                        title: 'Aktionskostentyp ändern',
                        currentVal: this.currentCard.actions[j].costType,
                        card: this.currentCard,
                        valToEdit: 'costType',
                        choice: true,
                        choices: CARD_RESOURCE_CHOICES,
                        indexedEdit: 'ACTION',
                        index: j,

                    });
                }.bind(this));
                iconActionResource.setScale(0.04);
                objects.push(iconActionResource);
                let actionAttack = this.add.text(400, 380, this.currentCard.actions[j].attack);
                actionAttack.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardActionAttack' + j,
                        title: 'Aktionsangriff ändern',
                        currentVal: this.currentCard.actions[j].attack,
                        card: this.currentCard,
                        valToEdit: 'attack',
                        indexedEdit: 'ACTION',
                        index: j
                    });
                }.bind(this));
                objects.push(actionAttack);
                if (this.currentCard.actions[j].attackEffect) {//TODO
                    let actionEffect = this.add.text(320, 350, this.currentCard.actions[j].attackEffect);
                    objects.push(actionEffect);
                }
                for (let i = 0; i < this.currentCard.actions[j].effects.length; i++) {
                    let effectRequirementText = this.add.text(480, 365 + 15 * i, this.currentCard.actions[j].effectRequirements[i] + '=', { fontSize: 11 });
                    effectRequirementText.setInteractive().on('pointerdown', function (e, x, y) {
                        this.changeProperty({
                            id: 'changeCardAction' + j + 'Effect' + i + 'Requirement',
                            title: 'Bedingung für Effekt(' + i + ') ändern',
                            currentVal: this.currentCard.actions[j].effectRequirements[i],
                            card: this.currentCard,
                            valToEdit: 'effectRequirements',
                            indexedEdit: 'EFFECT',
                            index: j,
                            effectIndex: i
                        });
                    }.bind(this));
                    let effectText = this.add.text(492, 365 + 15 * i, this.currentCard.actions[j].effects[i], { fontSize: 11 });
                    effectText.setInteractive().on('pointerdown', function (e, x, y) {
                        this.changeProperty({
                            id: 'changeCardAction' + j + 'Effect' + i,
                            title: 'Effekt(' + i + ') ändern',
                            currentVal: this.currentCard.actions[j].effects[i],
                            card: this.currentCard,
                            valToEdit: 'effects',
                            choice: true,
                            choices: CARD_ACTION_EFFECT_CHOICES,
                            indexedEdit: 'EFFECT',
                            index: j,
                            effectIndex: i
                        });
                    }.bind(this));
                    objects.push(effectRequirementText, effectText);
                }
                this.cardActions.push({ objects: objects });
            }
        }
    }

    destroyCardOverlay() {
        this.cardActions.forEach(action => {
            action.objects.forEach(object => object.destroy());
        });
    }

    destroyBottomOverlay() {
        this.bottomOverlayObjects.forEach(object => {

            if (object && object.destroy) object.destroy();
        });
    }

    updateCardProperties() {
        this.cardImg.setTexture(this.currentCard.summonActionCost == 'DELAYED' ? this.currentCard.type.toLowerCase() + '_delayed' : this.currentCard.type.toLowerCase() + '_instant');
        this.cardTypeText.text = this.currentCard.type;
        this.cardNameTxt.text = this.currentCard.name;
        this.cardDescTxt.text = this.currentCard.description;
        this.cardFactionTxt.text = this.shortFaction(this.currentCard.faction);
        if (this.currentCard.type != "RESEARCH") {
            if (this.currentCard.type != "SPY" || this.currentCard.type != "MODIFICATION") {
                this.cardArmorTxt.text = this.currentCard.armor;
                this.cardHealthTxt.text = this.currentCard.health;
            }
            this.summonCostTxt.text = this.currentCard.summonCost;
            this.turnCostTxt.text = this.currentCard.turnCost;
            this.cardTurnCostIcon.setTexture(this.resourceIcon(this.currentCard.turnCostType));
            this.minRangeTxt.text = this.currentCard.minRange + '-';
            this.maxRangeTxt.text = this.currentCard.maxRange;
            if (this.currentCard.type != "STRUCTURE") {
                this.cardBottomOverlay = this.add.image(250, 580, 'action_overlay');
                this.cardBottomOverlay.setScale(0.1);
                this.cardLosIcon = this.add.image(210, 580, 'icon_los');
                this.cardLosIcon.setScale(0.04);
                this.cardLosText = this.add.text(225, 572, this.currentCard.lineOfSight);
                this.cardLosText.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardLosModal', title: 'Sichtweite ändern', currentVal: this.currentCard.lineOfSight, card: this.currentCard, valToEdit: 'lineOfSight'
                    });
                }.bind(this));
                this.cardMovementRangeIcon = this.add.image(250, 580, 'icon_movement');
                this.cardMovementRangeIcon.setScale(0.04);
                this.cardMovementRangeText = this.add.text(265, 572, this.currentCard.movementRange);
                this.cardMovementRangeText.setInteractive().on('pointerdown', function (e, x, y) {
                    this.changeProperty({
                        id: 'changeCardMovementRangeModal', title: 'Bewegungsreichweite ändern', currentVal: this.currentCard.movementRange, card: this.currentCard, valToEdit: 'movementRange'
                    });
                }.bind(this));
                this.bottomOverlayObjects.push(this.cardBottomOverlay, this.cardLosIcon, this.cardLosText, this.cardMovementRangeIcon, this.cardMovementRangeText);
            }
        }

        this.cardSummonCostIcon.setTexture(this.resourceIcon(this.currentCard.summonCostType));
        $('#cardList').empty();
        this.cards.forEach((card, index) => {

            console.log(card, index);
            /*let cardBar = this.add.image(700, 50 + index * 40, 'action_overlay');
            cardBar.setScale(0.2);
            let cardBarText = this.add.text(620, 50 + index * 40, card.name);*/
            $('#cardList').append('<div id="' + card.number + '" onclick="selectCard(\'' + card.number + '\')">' + card.name + '</div>');
            //this.cardUiList.push({bar: cardBar, text: cardBarText});
        });
    }

    /*updateCardList(){
        const config = {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Credentials': true,
              'Authorization': 'Basic Y2FyZHRlc3Q6YsO8Y2tlbG5taXRiaXNp'
            },
            data: {},
          };
          return new Promise((resolve, reject) => {
            axios.get(CARD_API_URL + '/list', config).then((response) => {
                console.log(response);
                this.cards = response.data;
                resolve(response);
                
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
          });
    }*/

    update() {
        if (window.changeCard) {

            this.currentCard = this.cards.filter(card => {
                return card.number == window.changeCard
                //console.log(card.number, window.changeCard, card.number == window.changeCard);
            })[0];

            this.destroyBottomOverlay.bind(this)();
            this.updateCardProperties.bind(this)();
            this.destroyCardOverlay.bind(this)();
            this.createCardActionOverlay.bind(this)();
            window.changeCard = undefined;

        }
        if (window.setInteractive) {
            this.enableInteractive.bind(this)();
            window.setInteractive = false;
        }
    }

}