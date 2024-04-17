// Definiert die Benutzerklasse mit den erforderlichen Attributen
class UserObject {
    constructor(
        public firstName: string,
        public lastName: string,
        public email: string,
        public password: string
    ) {
    }
}

// Initialisiert ein leeres Array zur Speicherung von User objekten
let users: UserObject [] = [];

document.querySelector("#formCreate").addEventListener("submit", (event) => {
    event.preventDefault()
    createUserObject()
});



function createUserObjectRandom() {
    for (let i = 0; i < 10; i++) {
        const randomUser = createRandomUser();
        scrollDown();
        users.push(randomUser);
    }

    // Display function aufrufen
    displayUserList();
}


function createRandomUser(): UserObject {
    // Erzeugt einen zufälligen Benutzer
    const randomString = () => Math.random().toString(36).substring(7);

    return new UserObject(

        "FirstName_"+randomString(),
        "LastName_"+randomString(),
        randomString()+"@example.com",
        "Password_"+randomString()
    );
}


function createUserObject() {
    const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
    const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    const email = emailInput.value;
    const password = passwordInput.value;

    // Trimmen der Werte
    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (trimmedFirstName && trimmedLastName && trimmedEmail && trimmedPassword) {
        // Überprüfung, ob die Email im Array bereits existiert --> loopt durch jedes Array Element durch (for of loop)
        for (const existingUser of users) {
            if (existingUser.email === trimmedEmail) {
                alert("Die E-Mail Adresse " + trimmedEmail + " wird bereits benutzt. Bitte benutze eine andere Mail Adresse.");
                // Beendet die Funktion wenn die Email bereits existiert
                return;
            }
        }

        // Wenn die Email noch nicht benutzt wird, wird der Nutzer angelegt
        const newUser = new UserObject(trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword);
        users.push(newUser);

        // Formular leeren
        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";

        // Nutzer anzeigen
        displayUserList();
        scrollDown();
    } else {
        alert("Bitte alle Eingabefelder ausfüllen, um den Nutzer zu erstellen.");
    }
}


let userSelectIdx: number | null = null;


function displayUserList() {
    const tableBody: HTMLTableElement | null = document.getElementById("userTableBody") as HTMLTableElement;

    console.log(users);

    if (tableBody) {

        tableBody.innerHTML = "";

        users.forEach((user, index) => {
            const row  = tableBody.insertRow();

            const emailCell = row.insertCell(0);
            emailCell.textContent = user.email;
            emailCell.setAttribute("data-label", "E-Mail");

            const lastNameCell = row.insertCell(1);
            lastNameCell.textContent = user.lastName;
            lastNameCell.setAttribute("data-label", "Nachname");

            const firstNameCell = row.insertCell(2);
            firstNameCell.textContent = user.firstName;
            firstNameCell.setAttribute("data-label", "Vorname");


            // Füge Editier- und Lösch-Buttons hinzu
            const actionsCell = row.insertCell(3);
            const editButton = document.createElement("button");
            editButton.className = "btn btn-warning m-3 bi bi-pen"
            editButton.addEventListener("click", () => editUser(index));
            actionsCell.appendChild(editButton);

            const deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger m-3 bi bi-trash"
            deleteButton.addEventListener("click", () => deleteUser(index));
            actionsCell.appendChild(deleteButton);

        });
    }
}


function editUser(index: number) {
    // Setze den Index des bearbeiteten Benutzers
    userSelectIdx = index;
    console.log(userSelectIdx);

    // die Eingabefelder für die Bearbeitung
    const user = users[index];
    const editFirstName = document.getElementById("editFirstName") as HTMLInputElement;
    const editLastName = document.getElementById("editLastName") as HTMLInputElement;
    const editEmail = document.getElementById("editEmail") as HTMLInputElement;

    // Überprüfe, ob die Eingabefelder vorhanden sind
    if (editFirstName && editLastName && editEmail) {
        // setzt Userdaten in die Inputfelder
        editFirstName.value = user.firstName;
        editLastName.value = user.lastName;
        editEmail.value = user.email;

        // Öffnet das Bootstrap 5 Modal für die Bearbeitung
        const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
        editModal.show();
    }
}


function updateUser() {
    console.log(userSelectIdx);

    // Überprüft, ob ein User bearbeitet wird
    if (userSelectIdx !== null) {

        // Input Felder für Bearbeitung
        const editFirstNameInput = document.getElementById('editFirstName') as HTMLInputElement;
        const editLastNameInput = document.getElementById('editLastName') as HTMLInputElement;

        // Trimmen der Werte
        const editFirstName = editFirstNameInput.value.trim();
        const editLastName = editLastNameInput.value.trim();

        // Checken, ob die Eingabefelder alle gefüllt sind
        if (editFirstName && editLastName) {
            // Aktualisiert die Daten des ausgewählten Users
            users[userSelectIdx].firstName = editFirstName;
            users[userSelectIdx].lastName = editLastName;

            // Versteckt das Modal nach Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById('editModal') as HTMLElement);
            editModal.hide();

            userSelectIdx = null;

            displayUserList();
        } else {
            alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    }
}


function deleteUser(index: number) {
    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        users.splice(index, 1);
        console.log("Nutzer Gelöscht!")
    } else {
        // Element nicht löschen (Modal Hinzufuegen?)
    }
    displayUserList();
}

function scrollDown() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("userList").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}




