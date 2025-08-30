import type { Player } from './02-object-interface';


function logPlayerInfo(player: Player): void {
    console.log(`Name: ${player.name}`);
    console.log(`HP: ${player.hp}`);
    console.log(`Skills: ${player.skills.join(', ')}`);
    if (player.hometown) {
        console.log(`Hometown: ${player.hometown}`);
    }
}

const player: Player = {
    name: 'Voldemort',
    hp: 100,
    skills: ['magic', 'stealth', 'dueling'],
    hometown: 'Little Hangleton'
};

const logPlayerInfoArrow = (player: Player): void => {
    console.log(`Name: ${player.name}`);
    console.log(`HP: ${player.hp}`);
    console.log(`Skills: ${player.skills.join(', ')}`);
    if (player.hometown) {
        console.log(`Hometown: ${player.hometown}`);
    }
};

const healthStatus = (player: Player): string => {
    return player.hp > 0 ? 'Alive' : 'Defeated';
};

const healingPotion = (player: Player, amount: number = 20): void => {
    player.hp += amount;
    console.log(`${player.name} used a healing potion! HP is now ${player.hp}.`);
};

const magicScroll = (player: Player, spell: string): void => {
    console.log(`${player.name} used a magic scroll! Casting ${spell}...`);
};

const revivePlayer = (player: Player): void => {
    player.hp = 100;
    console.log(`${player.name} has been revived! HP is now ${player.hp}.`);
};

const result = healthStatus(player);
console.log(`Health Status: ${result}`);

console.log(magicScroll(player, 'Fireball'));

export {};