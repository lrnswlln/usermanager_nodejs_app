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


async function addUser() {

    const firstNameInput = document.getElementById("firstName") as HTMLInputElement;
    const lastNameInput = document.getElementById("lastName") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById("password") as HTMLInputElement;

    const firstname = firstNameInput.value.trim();
    const lastname = lastNameInput.value.trim();
    const mail = emailInput.value.trim();
    const password = passwordInput.value.trim();

    const response: Response = await fetch("https://userman.thuermer.red/api/users", {
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
        scrollDown();
    } else {
        console.log("Error: Response is not OK", response.statusText);
    }
}



async function renderUserList() {
    const tableBody: HTMLTableElement | null = document.getElementById("userTableBody") as HTMLTableElement;

    const response: Response = await fetch("https://userman.thuermer.red/api/users", {
        credentials: "include"
    });

    if (response?.ok) {
        const users = await response.json();

        if (tableBody) {
            tableBody.innerHTML = "";

            users.forEach((user: any) => {
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

                // Füge Editier- und Lösch-Buttons hinzu
                const actionsCell = row.insertCell(3);
                const editButton = document.createElement("button");
                editButton.className = "btn btn-warning m-3 bi bi-pen";
                editButton.addEventListener("click", () => editUserCloud(user.id));
                console.log(user.id);
                actionsCell.appendChild(editButton);

                const deleteButton = document.createElement("button");
                deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                deleteButton.addEventListener("click", () => deleteUserCloud(user.id));
                actionsCell.appendChild(deleteButton);
            });
        }
    } else {
        console.log("Error: Response is not OK", response.statusText);
    }
}

async function editUserCloud(id: number) {
    const response: Response = await fetch(`https://userman.thuermer.red/api/users/${id}`, {
        credentials: "include"
    });
    if (response?.ok) {
        const editUser = await response.json();

        console.log(editUser);

        const editFirstName = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastName = document.getElementById("editLastName") as HTMLInputElement;
        const editEmail = document.getElementById("editEmail") as HTMLInputElement;

        await if (editFirstName && editLastName && editEmail) {
            // setzt Userdaten in die Inputfelder
            editFirstName.value = editUser.firstname;
            editLastName.value = editUser.lastname;
            editEmail.value = editUser.mail;

            // Öffnet das Bootstrap 5 Modal für die Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.show();
        }

    } else {
        console.log("Error: Response is not OK", response.statusText);
    }
}



function updateUser() {
    console.log(userSelectIdx);

    // Überprüft, ob ein User bearbeitet wird
    if (userSelectIdx !== null) {
        // Input Felder für Bearbeitung
        const editFirstNameInput = document.getElementById("editFirstName") as HTMLInputElement;
        const editLastNameInput = document.getElementById("editLastName") as HTMLInputElement;

        // Trimmen der Werte
        const editFirstName = editFirstNameInput.value.trim();
        const editLastName = editLastNameInput.value.trim();

        // Checken, ob die Eingabefelder alle gefüllt sind
        if (editFirstName && editLastName) {
            // Aktualisiert die Daten des ausgewählten Users
            users[userSelectIdx].firstName = editFirstName;
            users[userSelectIdx].lastName = editLastName;

            // Versteckt das Modal nach Bearbeitung
            const editModal = new bootstrap.Modal(document.getElementById("editModal") as HTMLElement);
            editModal.hide();

            userSelectIdx = null;

            displayUserList();
        } else {
            alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    }
}

async function deleteUserCloud(id: number) {

    const result = window.confirm("Möchten Sie das Element wirklich löschen?");

    if (result) {
        const response: Response = await fetch(`https://userman.thuermer.red/api/users/${id}`, {
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



