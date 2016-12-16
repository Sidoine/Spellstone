import cardStrings = require('./cards.json');
import * as ko from 'knockout';

interface CardView {
    name: string;
    cost: number;
    attack: number;
    health: number;
}

const myCards = ko.observableArray<CardView>(); 
const enemyCards = ko.observableArray<CardView>();

function isSkill(k: any):k is Skill{
    return k['id'] !== undefined;
}

const enemyDamage = [];
const myDamage = [];

interface CardState {
    card: CardView;
    health: number;
    turns: number;
}

function attack(mines: CardState[], enemies: CardState[], extraCard: CardState | null) {
    let attacks = 0 
    for (let mine of mines) {
        attacks += mine.card.attack;
    }

    let num;

    if (extraCard) {
        attacks += extraCard.card.attack;
        num = mines.length + 1;
    }
    else{
        num = mines.length;
    }

    attacks /= num;
     
    let result:CardState[] = []
    for (let enemy of enemies) {
        if (enemy.health > attacks) {
            const state:CardState = {
                card: enemy.card,
                health: enemy.health - attacks,
                turns: enemy.turns - 1
            } 
            result.push(state);
        }
    }
    return result;
}

for (let i = 0; i < 10; i++) {
    enemyDamage.push(ko.pureComputed(() => {
        let sum = 0;
        for (const card of enemyCards()) {
            if (i > card.cost){
                sum += card.attack;
            }
        }
        return sum / enemyCards().length;
    }));
} 

class CardViewModel implements CardView {
    name: string;
    mine = ko.observable(false);
    enemy = ko.observable(false);
    cost: number;
    attack: number;
    health: number;
    skills: {[key:string]:Skill};
    skillList: Skill[];
    type: number;
    subTypeList: number[] = [];
    subTypes: {[key:number]:boolean} = {};
    
    mineCheck = ko.pureComputed(() => this.mine() ? "X" : "-");
    enemyCheck = ko.pureComputed(() => this.enemy() ? "X" : "-");
    
    toggleMine = () => { 
        if (this.mine()){
            myCards.remove(this);
        }
        else{
            myCards.push(this);
        }
        this.mine(!this.mine());
    }

    toggleEnemy = () => {
        if (this.enemy()){
            enemyCards.remove(this);
        }
        else{
            enemyCards.push(this);
        }
        this.enemy(!this.enemy());
    }

    constructor(card: Unit) {
        this.name = card.name;
        this.attack = parseInt(card.attack) || 0;
        this.cost = parseInt(card.cost) || 0;
        this.health = parseInt(card.health) || 0;
        this.skills = {};
        if (card.skill){
            this.addSkills(card.skill);
        }

        this.type = parseInt(card.type);

        if (typeof card.sub_type === "string") {
            this.subTypeList.push(parseInt(card.sub_type));
            this.subTypes[card.sub_type] = true;
        }
        else if (card.sub_type !== undefined) {
            for (const subType of card.sub_type) {
                this.subTypeList.push(parseInt(subType));
                this.subTypes[subType] = true;
            }
        }

        if (card.upgrade) {
            for (let upgrade of card.upgrade) {
                if (upgrade.health) {
                    this.health = parseInt(upgrade.health);
                }
                if (upgrade.attack) {
                    this.attack = parseInt(upgrade.attack);
                }
                if (upgrade.cost) {
                    this.cost = parseInt(upgrade.cost);
                }
                if (upgrade.skill) {
                    this.addSkills(upgrade.skill);   
                }
            }
        }
        this.skillList = [];
        for (const skillId in this.skills){
            this.skillList.push(this.skills[skillId]);
        }
    }

    value = ko.pureComputed(() => {

    });

    private addSkills(skills: Skill|Skill[]){
        if (isSkill(skills)){
            this.skills[skills.id] = skills;
        }
        else {
            for (let skill of skills){
                this.skills[skill.id] = skill;
            }
        }
    }
}

const root =  (<CardData>JSON.parse(cardStrings)).root;
const model = {
    cards: root.unit.map(x => new CardViewModel(x)),
    myCards: myCards,
    enemyCards: enemyCards
};

if (document.readyState === "loading") {
    document.onreadystatechange = () => { if (document.readyState === "interactive") initApplication(); }
}
else{
    initApplication();
}

function initApplication(){
    ko.applyBindings(model);
}