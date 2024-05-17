import express = require('express');
import cors = require('cors');
import {v4 as uuidv4} from 'uuid';
import * as mysql from 'mysql2/promise'
import * as dotenv from 'dotenv';
import session = require('express-session');


const app = express();
const PORT = 3001;

dotenv.config();

const corsOptions = {
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));



// Erweitere die SessionData-Schnittstelle
declare module 'express-session' {
    interface SessionData {
        userId: string; // Hinzufügen der userId-Eigenschaft zur Session
    }
}

// Konfiguriere express-session Middleware
app.use(session({
    secret: Math.random().toString(), // Bitte ersetze 'geheimnisvollesgeheimnis' durch ein zufälliges Geheimnis
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24, // Gültigkeitsdauer des Session-Cookies (hier: 1 Tag)
        secure: false, // Setze auf 'true', wenn du HTTPS verwendest
        httpOnly: true // Session-Cookie kann nur über HTTP übertragen werden, nicht über JavaScript
    }
}));


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


// Middleware für die Überprüfung der Authentifizierung
function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session && req.session.userId) {
        return next(); // Der Benutzer ist authentifiziert
    } else {
        res.status(401).json({ error: "Unauthorisierter Zugriff" });
    }
}





// POST Login
app.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { mail, password } = req.body;

        // Überprüfen, ob E-Mail und Passwort vorhanden sind
        if (!mail || !password) {
            res.status(400).json({ error: "E-Mail und Passwort werden benötigt." });
            return;
        }

        // Überprüfen, ob der Benutzer vorhanden ist
        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE mail = ? AND password = ?', [mail, password]);
        if (!user || user.length === 0) {
            res.status(401).json({ error: "Ungültige Anmeldeinformationen." });
            return;
        }

        // Benutzer in der Session speichern
        req.session.userId = user[0].id;


        // Testzwecke: Ausgabe der Benutzerdaten in der Konsole
        console.log("Erfolgreich angemeldeter Benutzer:", user);
        console.log(req.session.userId)
        res.status(200).json({ message: "Anmeldung erfolgreich" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// Geschützte Route für den Zugriff auf Benutzerdaten
app.get('/user/profile', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;

        // Benutzerdaten abrufen
        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE id = ?', [userId]);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Geschützte Route für den Zugriff auf die Haustiere des Benutzers
app.get('/user/pets', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;

        // Haustiere des Benutzers abrufen
        const [userPets]: any[] = await (await connection).query('SELECT * FROM Pets WHERE userId = ?', [userId]);
        res.status(200).json(userPets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// POST User
app.post('/users', async (req: express.Request, res: express.Response) => {
    try {
        const {firstname, lastname, mail, password} = req.body;

        if (!firstname || !lastname || !mail || !password) {
            res.status(400).json({error: "Alle Felder müssen ausgefüllt sein."});
            return;
        }

        // Überprüfen, ob die E-Mail bereits vorhanden ist
        const [existingUser]: any[] = await (await connection).query('SELECT id FROM Users WHERE mail = ?', [mail]);
        if (existingUser && existingUser.length > 0) {
            res.status(400).json({error: "Diese E-Mail-Adresse ist bereits registriert."});
            return;
        }

        const id = uuidv4();
        await (await connection).query('INSERT INTO Users (id, firstname, lastname, mail, password) VALUES (?, ?, ?, ?, ?)', [id, firstname, lastname, mail, password]);

        const newUser = {id, firstname, lastname, mail, password};
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// GET Users
app.get('/users', async (req: express.Request, res: express.Response) => {
    try {
        const [users] = await (await connection).execute('SELECT * FROM Users');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


//Get USer
app.get('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE id = ?', [userId]);
        if (user && user.length > 0) {
            res.status(200).json(user[0]);
        } else {
            res.status(404).json({message: 'Benutzer nicht gefunden'});
        }
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});


// PATCH User
app.patch('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const {firstname, lastname, mail, password} = req.body;

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

        res.status(200).json({message: 'Benutzer aktualisiert'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// DELETE User
app.delete('/users/:userId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        await (await connection).execute('DELETE FROM Users WHERE id = ?', [userId]);
        res.status(200).json({message: 'Benutzer wurde gelöscht'});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// POST Haustier für Benutzer

app.post('/users/:userId/pets', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const {name, kind} = req.body;

        if (!name || !kind) {
            res.status(400).json({error: "Alle Felder müssen ausgefüllt sein."});
            return;
        }

        const [existingUser]: any[] = await (await connection).query('SELECT id FROM Users WHERE id = ?', [userId]);
        if (!existingUser || existingUser.length === 0) {
            res.status(404).json({error: "Benutzer nicht gefunden."});
            return;
        }

        const [result]: any[] = await (await connection).query('INSERT INTO Pets (userId, name, kind) VALUES (?, ?, ?)', [userId, name, kind]);
        const newPet = {id: result.insertId, userId, name, kind};
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});
// GET Haustiere eines Benutzers
app.get('/users/:userId/pets', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const [userPets]: any[] = await (await connection).query('SELECT * FROM Pets WHERE userId = ?', [userId]);
        res.status(200).json(userPets);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// DELETE Haustier eines Benutzers
app.delete('/users/:userId/pets/:petId', async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.params.userId;
        const petId: number = parseInt(req.params.petId);

        const [pet]: any[] = await (await connection).query('SELECT * FROM Pets WHERE id = ? AND userId = ?', [petId, userId]);
        if (!pet || pet.length === 0) {
            res.status(404).json({error: "Haustier nicht gefunden."});
            return;
        }

        await (await connection).query('DELETE FROM Pets WHERE id = ?', [petId]);
        res.status(200).json({message: "Haustier wurde gelöscht."});
    } catch (error) {
        res.status(500).json({error: error.message});
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
