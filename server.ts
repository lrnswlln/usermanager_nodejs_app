import express = require('express');
import cors = require('cors');
import { v4 as uuidv4 } from 'uuid';
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

class User {
    constructor(
        public id: string,
        public firstname: string,
        public lastname: string,
        public mail: string,
        public password: string
    ) {}
}

class Pet {
    constructor(
        public id: number,
        public userId: string,
        public name: string,
        public kind: string
    ) {}
}

let users: User[] = [];
let pets: Pet[] = [];

app.post('/users', (req: express.Request, res: express.Response) => {
    try {
        const { firstname, lastname, mail, password } = req.body;

        // Überprüfen, ob alle Felder ausgefüllt sind
        if (!firstname || !lastname || !mail || !password) {
            throw new Error("Alle Felder müssen ausgefüllt sein.");
        }

        // Überprüfen, ob die E-Mail-Adresse bereits vorhanden ist
        const existingUser = users.find(user => user.mail === mail);
        if (existingUser) {
            throw new Error("Diese E-Mail-Adresse ist bereits registriert.");
        }

        const newUser = new User(uuidv4(), firstname, lastname, mail, password);
        users.push(newUser);
        res.json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/users', (req: express.Request, res: express.Response) => {
    try {
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:userId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
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

app.patch('/users/:userId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
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

app.delete('/users/:userId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        users = users.filter(user => user.id !== userId);
        res.json({ message: 'Benutzer wurde gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const newPet = new Pet(pets.length + 1, userId, req.body.name, req.body.kind);
        pets.push(newPet);
        res.json(newPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const userPets: Pet[] = pets.filter(pet => pet.userId === userId);
        res.json(userPets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/users/:userId/pets/:petId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const petId: number = parseInt(req.params.petId);
        pets = pets.filter(pet => !(pet.id === petId && pet.userId === userId));
        res.json({ message: 'Haustier wurde gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`app läuft unter http://localhost:${PORT}`);
});
