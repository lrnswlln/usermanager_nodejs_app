
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

async function deleteUser(): Promise<void> {

    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        try {
            const response = await fetch('/user/delete', {
                method: 'DELETE',
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Fehler beim Löschen des Benutzers:', errorData.error);
                alert('Fehler beim Löschen des Benutzers: ' + errorData.error);
                return;
            }

            const responseData = await response.json();
            console.log(responseData.message);
            window.location.reload();
        } catch (error) {
            console.error('Unbekannter Fehler:', error);
            errorModalCall('Ein unbekannter Fehler ist aufgetreten.');
        }
    }
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
    if (userProfile)
        userProfile.innerHTML = "";
    try {
        const userData: UserData = await fetchUserProfile();
        const userPets: PetData[] = await fetchUserPets();

        console.log("Fetch Data aus Rendering Funktion" + userData);
        console.log("Fetch Data aus Rendering Funktion" + userPets);

        const userProfileContainer: HTMLElement = document.getElementById('user-profile-container');
        const userProfileDiv: HTMLElement = document.getElementById('user-profile');
        const userLoginDiv: HTMLElement = document.getElementById('register-login');
        if (!userProfileDiv) return;

        userProfileContainer.style.display = "block";
        userLoginDiv.style.display = "none";

        userProfileDiv.innerHTML = '';

        const userContainer: HTMLDivElement = document.createElement('div');
        const greetingMessage = greetUser(userData.firstname);

        userContainer.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-5">
            <h2 class="mt-1">${greetingMessage}</h2>
                                        <button class="btn btn-danger my-3 p-3 bi bi-door-open-fill btn-sparkle" id="userLogout"
                    onclick="userLogout()">
                <span class="mx-2">Logout</span>
            </button>
            </div>
            <img class="mb-4" src="assets/media/Profile.png" alt="Profile" width="200px">
            <h5>Deine Daten:</h5>
            <p><b>Vorname:</b> ${userData.firstname}</p>
            <p><b>Nachname:</b> ${userData.lastname}</p>
            <p><b>E-Mail:</b> ${userData.mail}</p>
                        <button class="btn btn-danger my-3 p-3 bi bi-pen-fill btn-sparkle" id="editUserModal"
                    onclick="editUserModal()">
                <span class="mx-2">Bearbeiten</span>
            </button>
                            <button class="btn btn-danger my-3 p-3 bi bi-trash-fill btn-sparkle"
                        onclick="deleteUser()">
                    <span class="mx-2">Nutzer Löschen</span>
                </button>
        `;
        userProfileDiv.appendChild(userContainer);

        const userTableBody: HTMLElement | null = document.getElementById('userTableBody');
        if (userTableBody) {
            userTableBody.innerHTML = '';
            userPets.forEach((pet: PetData) => {
                const petRow: HTMLTableRowElement = document.createElement('tr');
                petRow.innerHTML = `
                    <td data-label=Name>${pet.name}</td>
                    <td data-label=Tierart>${pet.kind}</td>
                `;
                userTableBody.appendChild(petRow);
            });
        }
    } catch (error) {
        console.error('Error rendering user profile:', error.message);
    }
}

renderUserProfile();

async function userLogout(): Promise<void> {

    const userProfile: HTMLElement | null = document.getElementById('user-profile');
    const userTableBody: HTMLElement | null = document.getElementById('userTableBody');
    const userProfileContainer: HTMLElement = document.getElementById('user-profile-container');
    const userLoginDiv: HTMLElement = document.getElementById('register-login');

    try {
        const response = await fetch('/logout', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            userProfileContainer.style.display = "none";
            userLoginDiv.style.display = "block";
            userProfile.innerHTML = "";
            userTableBody.innerHTML = '';
            //window.location.reload(); //Könnte man nen Reload erzwingen für vollständiges Daten clearen
            console.log('Abmeldung erfolgreich');
            errorModalCall('Abmeldung erfolgreich');
        } else {
            console.error('Fehler beim Abmelden:', response.statusText);
        }
    } catch (error) {
        console.error('Fehler beim Abmelden:', error.message);
    }
}

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

// @ts-ignore
async function addUserPet() {
    const petName = document.getElementById("petName") as HTMLInputElement;
    const petKind = document.getElementById("petKind") as HTMLInputElement;

    const name = petName.value.trim();
    const kind = petKind.value.trim();

    if (!name || !kind) {
        errorModalCall("Bitte füllen Sie alle Felder aus.");
        return;
    }

    try {
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
            await renderUserProfile();
            await renderUserPetListAdmin();

            petName.value = "";
            petKind.value = "";
        } else if (response.status === 409) {
            errorModalCall("Ein Haustier mit diesem Namen existiert bereits für diesen Benutzer.");
        } else {
            errorModalCall("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
        }
    } catch (error) {
        console.error("Error adding pet:", error);
        errorModalCall("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
    }
}

async function deleteUserPet(petId: number) {
    const result = window.confirm("Möchten Sie das Tier des Nutzers wirklich löschen?");

    if (result) {
        const response: Response = await fetch(`/user/pets/${petId}`, {
            method: "DELETE",
            credentials: "include"
        });

        if (response.ok) {
            await renderUserPetListAdmin();
            await renderUserProfile();
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

        console.log("login successfulll!");
    } else {
        console.log("Error: Response is not OK", response.statusText);
        const errorMessage = await response.text();
        errorModalCall("Fehler bei der Anmeldung, überprüfe deine Anmeldedaten!");
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

        await renderUserProfile();
    } else {
        console.log("Error: Response is not OK", response.status);
        errorModalCall("Registrierung Fehlgeschlagen, E-Mail bereits vergeben");
    }
}

// @ts-ignore

function petAdmin() {
    const petFooterModal = document.getElementById("petModalFooter");

    if (petFooterModal) {
        // Zuerst alle vorhandenen Buttons entfernen, falls vorhanden -_> Clearen von vorhereigen Funktionscalls
        while (petFooterModal.firstChild) {
            petFooterModal.removeChild(petFooterModal.firstChild);
        }

        const petButton = document.createElement("button");
        petButton.className = "btn btn-info m-3 bi bi-database-fill-add";
        petButton.textContent = "Tier Hinzufügen";
        petButton.addEventListener("click", () => addUserPet());
        petFooterModal.appendChild(petButton);
    }

    renderUserPetListAdmin();
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
                editFirstName.value = editUser[0].firstname;
                editLastName.value = editUser[0].lastname;
                editEmail.value = editUser[0].mail;

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
        const editFirstNameInput = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastNameInput = document.getElementById("editLastName") as HTMLInputElement;
        const editPasswordInput = document.getElementById("editPassword") as HTMLInputElement;

        const editFirstName = editFirstNameInput.value.trim();
        const editLastName = editLastNameInput.value.trim();
        const editPassword = editPasswordInput.value.trim();

        if (editFirstName && editLastName) {
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

            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.hide();

            await renderUserProfile();
        } else {
            errorModalCall("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Benutzers:', error.message);
    }
}





document.addEventListener("DOMContentLoaded", function() {
    const loginBtn = document.getElementById("loginBtn");
    const registerBtn = document.getElementById("registerBtn");
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");

    loginBtn.addEventListener("click", function() {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });

    registerBtn.addEventListener("click", function() {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
    });
});

function scrollDown() {
    document.getElementById("userList").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function greetUser(userName: string): string {
    const greetings = [
        `Hallo, ${userName}!`,
        `Guten Tag, ${userName}!`,
        `Hi, ${userName}!`,
        `Gude, ${userName}!`,
        `Grüß dich, ${userName}!`,
        `Servus, ${userName}!`,
        `Moin, ${userName}!`,
        `Hey, ${userName}!`,
        `Schön dich zu sehen, ${userName}!`,
        `Herzlich willkommen, ${userName}!`
    ];

    const randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}


function errorModalCall(errorMessage: string) {
    const errorModalMessage = document.getElementById("errorModalMessage");
    if (errorModalMessage) {
        errorModalMessage.textContent = errorMessage;
    }

    const errorModal = new bootstrap.Modal(document.getElementById("errorModal") as HTMLElement);
    errorModal.show();
}