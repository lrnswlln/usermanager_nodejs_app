// Definiert die Benutzerklasse mit den erforderlichen Attributen
class UserObject {
    constructor(
        public firstname: string,
        public lastname: string,
        public mail: string,
        public password: string
    ) {}
}



interface UserData {
    firstname: string;
    lastname: string;
    mail: string;
}

interface PetData {
    id: number;
    name: string;
    kind: string;
    userId: string;
}

async function fetchUserProfile(): Promise<UserData> {
    try {
        const response = await fetch('/user/profile', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Benutzerdaten');
        }
        const userDataArray: UserData[] = await response.json();
        if (userDataArray.length === 0) {
            throw new Error('Keine Benutzerdaten erhalten');
        }
        const userData: UserData = userDataArray[0];
        return userData;
    } catch (error) {
        console.error('Fehler beim Abrufen der Benutzerdaten:', error.message);
        throw error;
    }
}

async function fetchUserPets(): Promise<PetData[]> {
    try {
        const response = await fetch('/user/pets', {
            method: 'GET',
            credentials: 'include'
        });
        if (!response.ok) {
            throw new Error('Fehler beim Abrufen der Haustiere');
        }
        const userPets: PetData[] = await response.json();
        return userPets;
    } catch (error) {
        console.error('Fehler beim Abrufen der Haustiere:', error.message);
        throw error;
    }
}

async function renderUserProfile() {
    const userProfile: HTMLElement | null = document.getElementById('user-profile');
    userProfile.innerHTML = "";
    try {
        const userData: UserData = await fetchUserProfile();
        const userPets: PetData[] = await fetchUserPets();

        console.log("test" + userData);

        const userProfileDiv: HTMLElement | null = document.getElementById('user-profile');
        if (!userProfileDiv) return;

        userProfileDiv.innerHTML = '';

        const userContainer: HTMLDivElement = document.createElement('div');
        userContainer.innerHTML = `
            <h2>User Profile</h2>
            <p>First Name: ${userData.firstname}</p>
            <p>Last Name: ${userData.lastname}</p>
            <p>Email: ${userData.mail}</p>
                        <button class="btn btn-danger my-3 p-3 bi bi-gitlab btn-sparkle" id="editUserModal"
                    onclick="petAdmin()">
                <span class="mx-2">Tiere verwalten</span>
            </button>
        `;
        userProfileDiv.appendChild(userContainer);

        if (userPets.length > 0) {
            const petsContainer: HTMLDivElement = document.createElement('div');
            petsContainer.innerHTML = '<h3>Pets</h3>';
            const petsList: HTMLUListElement = document.createElement('ul');
            userPets.forEach((pet: PetData) => {
                const petItem: HTMLLIElement = document.createElement('li');
                petItem.textContent = `${pet.name} - ${pet.kind}`;
                petsList.appendChild(petItem);
            });
            petsContainer.appendChild(petsList);
            userProfileDiv.appendChild(petsContainer);
        }
    } catch (error) {
        console.error('Error rendering user profile:', error.message);
    }
}

renderUserProfile();

async function userLogout(): Promise<void> {

    const userProfile: HTMLElement | null = document.getElementById('user-profile');

    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            userProfile.innerHTML = "";
            console.log('Abmeldung erfolgreich');
        } else {
            console.error('Fehler beim Abmelden:', response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Abmelden:', error.message);
    }
}


// Beispiel für die Verwendung der Funktionen
async function fetchData() {
    try {
        const userProfile = await fetchUserProfile();
        console.log('Benutzerdaten:', userProfile);

        const userPets = await fetchUserPets();
        console.log('Haustiere des Benutzers:', userPets);
    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error.message);
    }
}

function onPageLoaded(callback: () => void): void {
    window.addEventListener('load', callback);
}

onPageLoaded(() => {
    fetchData();
});

document.querySelector("#formCreate").addEventListener("submit", (event) => {
    event.preventDefault();
    addUser();
});

document.querySelector("#formLogin").addEventListener("submit", (event) => {
    event.preventDefault();
    loginUser();
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
async function addUserPet() {
    const petName = document.getElementById("petName") as HTMLInputElement;
    const petKind = document.getElementById("petKind") as HTMLInputElement;

    const name = petName.value.trim();
    const kind = petKind.value.trim();

    const response = await fetch('/user/pets', {
        method: "POST",
        body: JSON.stringify({ name, kind }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });

    if (response.ok) {
        console.log("Tier erfolgreich hinzugefügt");
        await renderUserList();
        await renderUserPetListAdmin();

        petName.value = "";
        petKind.value = "";
    } else {
        console.error("Error adding pet:", response.statusText);
    }
}

async function deleteUserPet(petId: string) {
    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        const response: Response = await fetch(`/user/pets/${petId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.ok) {
            await renderUserPetListAdmin();
            await renderUserList();
        } else {
            console.error("Error: Response is not OK", response.statusText);
        }

        console.log("Haustier gelöscht!");
    }
}


// @ts-ignore

async function loginUser() {

    const emailLoginInput = document.getElementById("emailLogin") as HTMLInputElement;
    const passwordLoginInput = document.getElementById("passwordLogin") as HTMLInputElement;

    const mail: string = emailLoginInput.value.trim();
    const password: string = passwordLoginInput.value.trim();

    const response: Response = await fetch("/login", {
        method: "POST",
        body: JSON.stringify({
            mail: mail,
            password: password
        }),
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include"
    });
    if (response.ok) {
        renderUserProfile();
        emailLoginInput.value = "";
        passwordLoginInput.value = "";

        console.log("login successfully!");
    } else {
        console.log("Error: Response is not OK", response.statusText);
        const errorMessage = await response.text();
        alert(errorMessage);
    }
}


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
        console.log("Error: Response is not OK", response.status);
        alert(response.body)
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

function petAdmin() {
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
        petButton.addEventListener("click", () => addUserPet());
        petFooterModal.appendChild(petButton);
    }

    renderUserPetListAdmin();
    // Öffnet das Bootstrap 5 Modal für die Bearbeitung
    const petAdminModal = new bootstrap.Modal(document.getElementById("petAdminModal") as HTMLElement);
    petAdminModal.show();
}

// @ts-ignore
async function renderUserPetListAdmin() {
    const tableBody: HTMLTableElement | null = document.getElementById("userPetTableBody") as HTMLTableElement;

    const userPets = await fetchUserPets();

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
                deleteButton.addEventListener("click", () => deleteUserPet(pet.id));
                actionsCell.appendChild(deleteButton);
            }
        }
    }
}

/*
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
        const editPassword = document.getElementById("editPassword") as HTMLInputElement;
        const editEmail = document.getElementById("editEmail") as HTMLInputElement;

        if (editFirstName && editLastName && editEmail) {
            // setzt Userdaten in die Inputfelder
            editFirstName.value = editUser.firstname;
            editLastName.value = editUser.lastname;
            editPassword.value = editUser.password;
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
*/


async function editUserModal() {
    try {
        const response: Response = await fetch('/user/profile', {
            credentials: "include"
        });

        if (response.ok) {
            const editUser = await response.json();

            console.log(editUser);

            const editFirstName = document.getElementById("editFirstName") as HTMLInputElement;
            const editLastName = document.getElementById("editLastName") as HTMLInputElement;
            const editEmail = document.getElementById("editEmail") as HTMLInputElement;

            if (editFirstName && editLastName && editEmail) {
                // Setze Userdaten in die Inputfelder
                editFirstName.value = editUser[0].firstname;
                editLastName.value = editUser[0].lastname;
                editEmail.value = editUser[0].mail;


                // Öffne das Bootstrap 5 Modal für die Bearbeitung
                const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
                editModal.show();
            }
        } else {
            console.error("Error: Response is not OK", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}


// Update USer
async function updateUser(): Promise<void> {
    try {
        // Input Felder für Bearbeitung
        const editFirstNameInput = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastNameInput = document.getElementById("editLastName") as HTMLInputElement;
        const editPasswordInput = document.getElementById("editPassword") as HTMLInputElement;

        // Trimmen der Werte
        const editFirstName = editFirstNameInput.value.trim();
        const editLastName = editLastNameInput.value.trim();
        const editPassword = editPasswordInput.value.trim();

        // Überprüft, ob ein User bearbeitet wird
        if (editFirstName && editLastName && editPassword) {
            // Aktualisiert die Daten des ausgewählten Users
            const response = await fetch(`/user/update`, {
                method: "PATCH",
                body: JSON.stringify({
                    firstname: editFirstName,
                    lastname: editLastName,
                    password: editPassword
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            if (!response.ok) {
                throw new Error('Fehler beim Aktualisieren des Benutzers');

            } else {
                await renderUserProfile();
            }

            // Versteckt das Modal nach Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.hide();

            await renderUserProfile();
        } else {
            alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error.message);
        // Hier kannst du Fehlerhandhabung hinzufügen, falls erforderlich
    }
}

/*
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
*/

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



