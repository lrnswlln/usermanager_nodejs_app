import express = require('express');
import cors = require('cors');
import { v4 as uuidv4 } from 'uuid';
import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv';
const app = express();
const PORT = 3001;

dotenv.config();

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// Funktion zur Bestätigung der Verbindung und Fehlerbehandlung
async function checkDatabaseConnection() {
    try {
        await (await connection).connect();
        console.log("Die Verbindung zur Datenbank wurde erfolgreich hergestellt.");
    } catch (error) {
        console.error("Fehler beim Herstellen der Verbindung zur Datenbank:", error);
        process.exit(1); // Beende den Prozess, wenn die Verbindung fehlschlägt
    }
}

checkDatabaseConnection();

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


// POST User
app.post('/users', async (req: express.Request, res: express.Response) => {
    try {
        const { firstname, lastname, mail, password } = req.body;

        if (!firstname || !lastname || !mail || !password) {
            res.status(400).json({ error: "Alle Felder müssen ausgefüllt sein." });
            return;
        }

        // Überprüfen, ob die E-Mail bereits vorhanden ist
        const [existingUser]: any[] = await (await connection).query('SELECT id FROM Users WHERE mail = ?', [mail]);
        if (existingUser && existingUser.length > 0) {
            res.status(400).json({ error: "Diese E-Mail-Adresse ist bereits registriert." });
            return;
        }

        const id = uuidv4();
        await (await connection).query('INSERT INTO Users (id, firstname, lastname, mail, password) VALUES (?, ?, ?, ?, ?)', [id, firstname, lastname, mail, password]);

        const newUser = { id, firstname, lastname, mail, password };
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET Users
app.get('/users', async (req: express.Request, res: express.Response) => {
    try {
        const [users] = await (await connection).execute('SELECT * FROM Users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE id = ?', [userId]);
        if (user && user.length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({ message: 'Benutzer nicht gefunden' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// PATCH User
app.patch('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const { firstname, lastname, mail, password } = req.body;

        let updateQuery = 'UPDATE Users SET';
        const updateUserValues = [];

        if (firstname) {
            updateQuery += ' firstname = ?,';
            updateUserValues.push(firstname);
        }
        if (lastname) {
            updateQuery += ' lastname = ?,';
            updateUserValues.push(lastname);
        }
        if (mail) {
            updateQuery += ' mail = ?,';
            updateUserValues.push(mail);
        }
        if (password) {
            updateQuery += ' password = ?,';
            updateUserValues.push(password);
        }

        // Entferne das letzte Komma
        updateQuery = updateQuery.slice(0, -1);

        updateQuery += ' WHERE id = ?';
        updateUserValues.push(userId);

        await (await connection).query(updateQuery, updateUserValues);

        res.status(200).json({ message: 'Benutzer aktualisiert' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE User
app.delete('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        await (await connection).execute('DELETE FROM Users WHERE id = ?', [userId]);
        res.status(200).json({ message: 'Benutzer wurde gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST Pet for user
app.post('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const newPet = new Pet(pets.length + 1, userId, req.body.name, req.body.kind);
        pets.push(newPet);
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: for user Pets
app.get('/users/:userId/pets', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const userPets: Pet[] = pets.filter(pet => pet.userId === userId);
        res.status(200).json(userPets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE for user Pets
app.delete('/users/:userId/pets/:petId', (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const petId: number = parseInt(req.params.petId);
        pets = pets.filter(pet => !(pet.id === petId && pet.userId === userId));
        res.status(200).json({ message: 'Haustier wurde gelöscht' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.use(notFound);

function notFound(req: express.Request, res: express.Response): void {
    res.status(404);
    res.send("Die Angeforderte Resource existiert nicht, überprüfe deine Anfrage");
}

app.listen(PORT, () => {
    console.log(`Die App läuft unter http://localhost:${PORT}`);
});
