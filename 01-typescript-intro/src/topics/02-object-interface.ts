const skills: string[] = ['magic', 'stealth', 'dueling'];

interface Player {
    name: string;
    hp: number;
    skills: string[];
    hometown?: string;
}

const player: Player = {
    name: 'Voldemort',
    hp: 100,
    skills: skills,
    hometown: 'Little Hangleton'
};

console.table(player);

export type { Player };