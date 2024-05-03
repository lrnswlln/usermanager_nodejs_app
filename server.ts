import express = require('express');
import cors = require('cors');
const app = express();
const PORT = 3001;
import * as Path from "path";

app.use(cors()); // Aktiviere CORS für alle Routen
app.use(express.static('public'));
app.use(express.json()); // Erlaube das Parsen von JSON-Anfragen
app.use(express.urlencoded({extended: false}));


class User {
    constructor(
        public id: number,
        public firstname: string,
        public lastname: string,
        public mail: string,
        public password: string
    ) {}
}

let users: User[] = [];

app.post('/users', (req, res) => {
    try {
        const { firstname, lastname, mail, password } = req.body;
        const newUser = new User(users.length + 1, firstname, lastname, mail, password);
        users.push(newUser);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`app läuft unter http://localhost:${PORT}`);
});
