interface AudioPlayer {
    audioVolume: number;
    songDuration: number;
    details: Details;
    play: () => void;
    pause: () => void;
    stop: () => void;
}

interface Details {
    title: string;
    artist: string;
    album: string;
    year: number;
}

const audioPlayer: AudioPlayer = {
    audioVolume: 80,
    songDuration: 240,
    details: {
        title: "Song Title",
        artist: "Artist Name",
        album: "Album Name",
        year: 2020
    },
    play: () => {
        console.log("Playing audio...");
    },
    pause: () => {
        console.log("Audio paused.");
    },
    stop: () => {
        console.log("Audio stopped.");
    }
}

const { audioVolume, songDuration, details } = audioPlayer;

const { title, artist, album, year } = details;

console.log(`Now playing: ${title} by ${artist}`);
console.log(`Volume: ${audioVolume}`);
console.log(`Duration: ${songDuration} seconds`);
console.log(`Album: ${album}`);
console.log(`Year: ${year}`);

// destructuring Array

const dbz: string[] = ['Goku', 'Vegeta', 'Trunks'];

const [first, second, third] = dbz;

console.log(`First: ${first}`);
console.log(`Second: ${second}`);
console.log(`Third: ${third}`);

const [,, trunks = 'default'] = dbz;

console.log(`Trunks: ${trunks}`);

// ..rest and more difficult cases

const [...rest] = dbz;

console.log(`Rest: ${rest}`);

const [,, ...more] = dbz;

console.log(`More: ${more}`);

const [goku, ...others] = dbz;

console.log(`Goku: ${goku}`);
console.log(`Others: ${others}`);



export {};
