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

//Basic Users and Pets
const user1 = new User('2d4c3e2e-56b3-4a89-a2e0-3d53046f54a9', 'Max', 'Mustermann', 'max@example.com', '123456');
const user2 = new User('0c83b7c4-71e5-470b-85ca-4946b43ba2d5', 'Maria', 'Musterfrau', 'maria@example.com', 'abcdef');
users.push(user1, user2);

const pet1 = new Pet(1, '2d4c3e2e-56b3-4a89-a2e0-3d53046f54a9', 'Bello', 'Hund');
const pet2 = new Pet(2, '0c83b7c4-71e5-470b-85ca-4946b43ba2d5', 'Whiskers', 'Katze');
pets.push(pet1, pet2);




// POST: Erstellt einen neuen Benutzer
app.post('/users', (req: express.Request, res: express.Response) => {
    try {
        const { firstname, lastname, mail, password } = req.body;

        if (!firstname || !lastname || !mail || !password) {
            res.status(400).json({ error: "Alle Felder müssen ausgefüllt sein." });
            return;
        }

        const existingUser = users.find(user => user.mail === mail);
        if (existingUser) {
            res.status(400).json({ error: "Diese E-Mail-Adresse ist bereits registriert." });
            return;
        }

        const newUser = new User(uuidv4(), firstname, lastname, mail, password);
        users.push(newUser);
        res.status(201).json(newUser); // 201: Created
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Liefert alle Benutzer
app.get('/users', (req: express.Request, res: express.Response) => {
    try {
        res.status(200).json(users); // 200: OK
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Liefert einen einzelnen Benutzer basierend auf der ID
app.get('/users/:userId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const user = users.find(user => user.id === userId);
        if (user) {
            res.status(200).json(user); // 200: OK
        } else {
            res.status(404).json({ message: 'Benutzer nicht gefunden' }); // 404: Not Found
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH: Aktualisiert einen Benutzer
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
            res.status(200).json(updatedUser); // 200: OK
        } else {
            res.status(404).json({ message: 'Benutzer nicht gefunden' }); // 404: Not Found
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Löscht einen Benutzer
app.delete('/users/:userId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        users = users.filter(user => user.id !== userId);
        res.status(200).json({ message: 'Benutzer wurde gelöscht' }); // 200: OK
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST: Erstellt ein neues Haustier für einen Benutzer
app.post('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const newPet = new Pet(pets.length + 1, userId, req.body.name, req.body.kind);
        pets.push(newPet);
        res.status(201).json(newPet); // 201: Created
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Liefert alle Haustiere eines Benutzers
app.get('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const userPets: Pet[] = pets.filter(pet => pet.userId === userId);
        res.status(200).json(userPets); // 200: OK
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE: Löscht ein Haustier eines Benutzers
app.delete('/users/:userId/pets/:petId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const petId: number = parseInt(req.params.petId);
        pets = pets.filter(pet => !(pet.id === petId && pet.userId === userId));
        res.status(200).json({ message: 'Haustier wurde gelöscht' }); // 200: OK
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Die App läuft unter http://localhost:${PORT}`);
});
