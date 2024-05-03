const express = require('express');

const app = express();

class User {
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public mail: string,
        public password: string
    ) {}
}

class Pet {
    constructor(
        public id: number,
        public userId: number,
        public name: string,
        public kind: string
    ) {}
}

let users: User[] = [];
let pets: Pet[] = [];



const PORT: number =  3000;
app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
