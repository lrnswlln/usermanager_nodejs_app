// Definiert die Benutzerklasse mit den erforderlichen Attributen
class UserObject {
    constructor(
        public firstname: string,
        public lastname: string,
        public mail: string,
        public password: string
    ) {}
}



document.querySelector("#formCreate").addEventListener("submit", (event) => {
    event.preventDefault();
    addUser();
});

function generateRandomUser() {
    const firstNames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia"];
    const lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia"];
    const domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
    const passwords = ["password123", "abc123", "qwerty", "letmein", "password"];

    const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const randomDomain = domains[Math.floor(Math.random() * domains.length)];
    const randomPassword = passwords[Math.floor(Math.random() * passwords.length)];

    const randomEmail = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}@${randomDomain}`;

    return new UserObject(randomFirstName, randomLastName, randomEmail, randomPassword);
}

async function addRandomUser() {
    const randomUser = generateRandomUser();

    const response = await fetch("/users", {
        method: "POST",
        body: JSON.stringify({
            firstname: randomUser.firstname,
            lastname: randomUser.lastname,
            mail: randomUser.mail,
            password: randomUser.password
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    if (response.ok) {
        console.log("Random user added successfully!");
        await renderUserList();
    } else {
        console.error("Error adding random user:", response.statusText);
    }
}

// @ts-ignore
async function addUserPet(userId: string) {

    const petName = document.getElementById("petName") as HTMLInputElement;
    const petKind = document.getElementById("petKind") as HTMLInputElement;




    const name = petName.value.trim();
    const kind = petKind.value.trim();

    const response = await fetch(`/users/${userId}/pets`, {
        method: "POST",
        body: JSON.stringify({
            name: name,
            kind: kind
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    if (response.ok) {
        console.log("Tier erfolgreich hinzugefügt");
        await renderUserList();
        await renderUserPetListAdmin(userId);

        petName.value = "";
        petKind.value = "";

    } else {
        console.error("Error adding pet:", response.statusText);
    }
}

// @ts-ignore
async function deleteUserPet(userId: string, petId: string) {

    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        const response: Response = await fetch(`/users/${userId}/pets/${petId}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (response?.ok) {

            await renderUserPetListAdmin(userId);
            await renderUserList();
        } else {
            console.log("Error: Response is not OK", response.statusText);
        }
        console.log("Nutzer Gelöscht!");
    }
}

// @ts-ignore
async function addUser() {

    const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
    const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const firstname = firstNameInput.value.trim();
    const lastname = lastNameInput.value.trim();
    const mail = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const response: Response = await fetch("/users", {
        method: "POST",
        body: JSON.stringify({
            firstname: firstname,
            lastname: lastname,
            mail: mail,
            password: password
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    if (response.ok) {

        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";

        await renderUserList();
    } else {
        console.log("Error: Response is not OK", response.statusText);
        alert(response.statusText)
    }
}

// @ts-ignore
async function renderUserList() {
    const tableBody: HTMLTableElement | null = document.getElementById("userTableBody") as HTMLTableElement;

    const response: Response = await fetch("/users", {
        credentials: "include"
    });

    if (response?.ok) {
        const users = await response.json();

        if (tableBody) {
            tableBody.innerHTML = "";

            for (const user of users) {
                const userPets = await renderUserPetMain(user.id);

                const row = tableBody.insertRow();

                const emailCell = row.insertCell(0);
                emailCell.textContent = user.mail;
                emailCell.setAttribute("data-label", "E-Mail");

                const lastNameCell = row.insertCell(1);
                lastNameCell.textContent = user.lastname;
                lastNameCell.setAttribute("data-label", "Nachname");

                const firstNameCell = row.insertCell(2);
                firstNameCell.textContent = user.firstname;
                firstNameCell.setAttribute("data-label", "Vorname");

                const petCell = row.insertCell(3);
                petCell.textContent = userPets.map((pet: any) => pet.name).join(", ");
                petCell.setAttribute("data-label", "Pets");

                // Füge Editier- und Lösch-Buttons hinzu
                const actionsCell = row.insertCell(4);
                const editButton = document.createElement("button");
                editButton.className = "btn btn-warning m-3 bi bi-pen";
                editButton.addEventListener("click", () => editUserCloud(user.id));
                console.log(user.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                deleteButton.addEventListener("click", () => deleteUserCloud(user.id));
                actionsCell.appendChild(deleteButton);

                const petButton = document.createElement("button");
                petButton.className = "btn btn-primary m-3 bi bi-gitlab";
                petButton.addEventListener("click", () => petAdmin(user.id));
                actionsCell.appendChild(petButton);
            }
        }
    } else {
        console.log("Error: Response is not OK", response.statusText);
    }
}

async function renderUserPetMain(id: string) {
    const responsePet: Response = await fetch(`/users/${id}/pets`, {
        credentials: "include"
    });
    if (responsePet?.ok) {
        const userPets = await responsePet.json();
        return userPets;
    }
    return []; // Falls keine Haustiere gefunden wurden, gib ein leeres Array zurück
}

function petAdmin(userId: string) {

    const petFooterModal = document.getElementById("petModalFooter");

    if (petFooterModal) {
        // Zuerst alle vorhandenen Buttons entfernen, falls vorhanden
        while (petFooterModal.firstChild) {
            petFooterModal.removeChild(petFooterModal.firstChild);
        }

        // Das Button-Element erstellen
        const petButton = document.createElement("button");
        petButton.className = "btn btn-info m-3 bi bi-database-fill-add";
        petButton.textContent = "Tier Hinzufügen";
        petButton.addEventListener("click", () => addUserPet(userId));
        petFooterModal.appendChild(petButton);
    }

    renderUserPetListAdmin(userId);
    // Öffnet das Bootstrap 5 Modal für die Bearbeitung
    const petAdminModal = new bootstrap.Modal(document.getElementById("petAdminModal") as HTMLElement);
    petAdminModal.show();
}

// @ts-ignore
async function renderUserPetListAdmin(userId: string) {
    const tableBody: HTMLTableElement | null = document.getElementById("userPetTableBody") as HTMLTableElement;

    const userPets = await renderUserPetMain(userId);

    if (userPets) {

        if (tableBody) {
            tableBody.innerHTML = "";

            for (const pet of userPets) {

                const row = tableBody.insertRow();

                const emailCell = row.insertCell(0);
                emailCell.textContent = pet.name;
                emailCell.setAttribute("data-label", "Tiername");

                const lastNameCell = row.insertCell(1);
                lastNameCell.textContent = pet.kind;
                lastNameCell.setAttribute("data-label", "Tierart");

                // Füge Editier- und Lösch-Buttons hinzu
                const actionsCell = row.insertCell(2);
                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                deleteButton.addEventListener("click", () => deleteUserPet(userId, pet.id));
                actionsCell.appendChild(deleteButton);

            }
        }
    }
}

// @ts-ignore
async function editUserCloud(id: string) {
    const response: Response = await fetch(`/users/${id}`, {
        credentials: "include"
    });
    if (response?.ok) {
        const editUser = await response.json();

        console.log(editUser);

        const editFirstName = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastName = document.getElementById("editLastName") as HTMLInputElement;
        const editEmail = document.getElementById("editEmail") as HTMLInputElement;

        if (editFirstName && editLastName && editEmail) {
            // setzt Userdaten in die Inputfelder
            editFirstName.value = editUser.firstname;
            editLastName.value = editUser.lastname;
            editEmail.value = editUser.mail;

            const button = document.getElementById('updateUser') as HTMLButtonElement;
            if (button) {
                button.setAttribute('onclick', `updateUserCloud('${id}')`);
            }

            // Öffnet das Bootstrap 5 Modal für die Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.show();
        }

    } else {
        console.log("Error: Response is not OK", response.statusText);
    }
}

async function updateUserCloud(id: string) {

    // Überprüft, ob ein User bearbeitet wird
    if (id !== null) {
        // Input Felder für Bearbeitung
        const editFirstNameInput = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastNameInput = document.getElementById("editLastName") as HTMLInputElement;

        // Trimmen der Werte
        const editFirstName = editFirstNameInput.value.trim();
        const editLastName = editLastNameInput.value.trim();

        // Checken, ob die Eingabefelder alle gefüllt sind
        if (editFirstName && editLastName) {
            // Aktualisiert die Daten des ausgewählten Users

            const response: Response = await fetch(`/users/${id}`, {
                method: "PATCH",
                body: JSON.stringify({
                    firstname: editFirstName,
                    lastname: editLastName,
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            // Versteckt das Modal nach Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.hide();


            const button = document.getElementById('updateUser') as HTMLButtonElement;
            if (button) {
                button.setAttribute('onclick', `updateUserCloud(${null})`);
            }

            await renderUserList()
        } else {
            alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    }
}

// @ts-ignore
async function deleteUserCloud(id: string) {

    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        const response: Response = await fetch(`/users/${id}`, {
            method: "DELETE",
            credentials: "include"
        });
        if (response?.ok) {

            await renderUserList();
        } else {
            console.log("Error: Response is not OK", response.statusText);
        }
        console.log("Nutzer Gelöscht!");
    }
}

function scrollDown() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("userList").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}



