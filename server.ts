import express = require('express');
import cors = require('cors');
import {v4 as uuidv4} from 'uuid';
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

// Benutzerdaten lesen
app.get('/users', (req, res) => {
    try {
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:userId', (req, res) => {
    try {
        const userId: number = parseInt(req.params.userId);
        const user = users.find(user => user.id === userId);
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Benutzerdaten aktualisieren
app.patch('/users/:userId', (req, res) => {
    try {
        const userId: number = parseInt(req.params.userId);
        const index: number = users.findIndex(user => user.id === userId);
        if (index !== -1) {
            const updatedUser = users[index];
            updatedUser.firstname = req.body.firstname || updatedUser.firstname;
            updatedUser.lastname = req.body.lastname || updatedUser.lastname;
            updatedUser.mail = req.body.mail || updatedUser.mail;
            updatedUser.password = req.body.password || updatedUser.password;
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Benutzer löschen
app.delete('/users/:userId', (req, res) => {
    try {
        const userId: number = parseInt(req.params.userId);
        users = users.filter(user => user.id !== userId);
        res.json({ message: 'Benutzer wurde gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`app läuft unter http://localhost:${PORT}`);
});
