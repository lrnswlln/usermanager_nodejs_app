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



//Session mit ID
declare module 'express-session' {
    interface SessionData {
        userId: string;
    }
}

// express-session cookie config
app.use(session({
    secret: Math.random().toString(),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        secure: false,
        httpOnly: true
    }
}));


const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

async function checkDatabaseConnection() {
    try {
        await (await connection).connect();
        console.log("Die Verbindung zur Datenbank wurde erfolgreich hergestellt.");
    } catch (error) {
        console.error("Fehler beim Herstellen der Verbindung zur Datenbank:", error);
        process.exit(1); // Beendet den Prozess bei Verbindungs fehlschlägen
    }
}

checkDatabaseConnection();


function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.status(401).json({ error: "Unauthorised Zugriff" });
    }
}



//Login/Logout
app.post('/login', async (req: express.Request, res: express.Response) => {
    try {
        const { mail, password } = req.body;

        // Checken ob E-Mail und Passwort beide angegebn
        if (!mail || !password) {
            res.status(400).json({ error: "E-Mail und Passwort werden benötigt." });
            return;
        }

        // Überprüfen, ob der Benutzer vorhanden
        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE mail = ? AND password = ?', [mail, password]);
        console.log('Test' + user.length);
        if (!user || user.length === 0) {
            res.status(401).json({ error: "Ungültige Anmeldeinformationen." });
            return;
        }

        // Benutzer in der Session speichern
        req.session.userId = user[0].id;


        // Debugger --Ausgabe der daten in der Konsole
        console.log("Erfolgreich angemeldeter Benutzer:", user);
        console.log(req.session.userId)
        res.status(200).json({ message: "Anmeldung erfolgreich" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/logout', async (req: express.Request, res: express.Response) => {
    try {
        req.session.destroy((err: any) => {
            if (err) {
                res.status(500).json({ error: "Beim Abmelden ist ein Fehler aufgetreten." });
                return;
            }
            res.clearCookie('sessionID');
            res.status(200).json({ message: "Abmeldung erfolgreich" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//User
app.get('/user/profile', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;

        const [user]: any[] = await (await connection).query('SELECT * FROM Users WHERE id = ?', [userId]);
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/users', async (req: express.Request, res: express.Response) => {
    try {
        const {firstname, lastname, mail, password} = req.body;

        if (!firstname || !lastname || !mail || !password) {
            res.status(400).json({error: "Alle Felder müssen ausgefüllt sein."});
            return;
        }

        const [existingUser]: any[] = await (await connection).query('SELECT id FROM Users WHERE mail = ?', [mail]);
        if (existingUser && existingUser.length > 0) {
            res.status(400).json({error: "Diese E-Mail-Adresse ist bereits registriert."});
            return;
        }

        const id = uuidv4();
        await (await connection).query('INSERT INTO Users (id, firstname, lastname, mail, password) VALUES (?, ?, ?, ?, ?)', [id, firstname, lastname, mail, password]);

        req.session.userId = id;

        const newUser = {id, firstname, lastname, mail, password};
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

app.patch('/user/update', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string | undefined = req.session?.userId;

        if (!userId) {
            throw new Error('Benutzer nicht authentifiziert');
        }

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

        // Entfernt das letzte Komma
        if (updateUserValues.length > 0) {
            updateQuery = updateQuery.slice(0, -1);
        }

        updateQuery += ' WHERE id = ?';
        updateUserValues.push(userId);

        await (await connection).query(updateQuery, updateUserValues);

        res.status(200).json({ message: 'Benutzer aktualisiert' });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/user/delete', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;
        await (await connection).execute('DELETE FROM Pets WHERE userId = ?', [userId]);
        await (await connection).execute('DELETE FROM Users WHERE id = ?', [userId]);
        req.session.destroy((err: any) => {
            if (err) {
                res.status(500).json({ error: "Beim Löschen des Benutzers ist ein Fehler aufgetreten." });
                return;
            }
            res.clearCookie('sessionID');
            res.status(200).json({ message: "Benutzer wurde gelöscht und abgemeldet" });
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


//Pets

app.post('/user/pets', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;
        const { name, kind } = req.body;

        if (!name || !kind) {
            res.status(400).json({ error: "Alle Felder müssen ausgefüllt sein." });
            return;
        }

        // schauen ob nutzer existiert
        const [existingUser]: any[] = await (await connection).query('SELECT id FROM Users WHERE id = ?', [userId]);
        if (!existingUser || existingUser.length === 0) {
            res.status(404).json({ error: "Benutzer nicht gefunden." });
            return;
        }

        // schauen ob nutzer schon ein gleichnamiges Tier hat
        const [existingPet]: any[] = await (await connection).query('SELECT id FROM Pets WHERE userId = ? AND name = ?', [userId, name]);
        if (existingPet && existingPet.length > 0) {
            res.status(409).json({ error: "Ein Haustier mit diesem Namen existiert bereits für diesen Benutzer." });
            return;
        }

        // Htier wird hinzugefügt
        const [result]: any[] = await (await connection).query('INSERT INTO Pets (userId, name, kind) VALUES (?, ?, ?)', [userId, name, kind]);
        const newPet = { id: result.insertId, userId, name, kind };
        res.status(201).json(newPet);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/user/pets', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;

        const [userPets]: any[] = await (await connection).query('SELECT * FROM Pets WHERE userId = ?', [userId]);
        res.status(200).json(userPets);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/user/pets/:petId', requireAuth, async (req: express.Request, res: express.Response) => {
    try {
        const userId: string = req.session.userId;
        const petId: number = parseInt(req.params.petId);

        const [pet]: any[] = await (await connection).query('SELECT * FROM Pets WHERE id = ? AND userId = ?', [petId, userId]);
        if (!pet || pet.length === 0) {
            res.status(404).json({ error: "Haustier nicht gefunden." });
            return;
        }

        await (await connection).query('DELETE FROM Pets WHERE id = ?', [petId]);
        res.status(200).json({ message: "Haustier wurde gelöscht." });
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
