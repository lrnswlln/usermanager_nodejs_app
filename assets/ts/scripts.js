// Definiert die Benutzerklasse mit den erforderlichen Attributen
var UserObject = /** @class */ (function () {
    function UserObject(firstName, lastName, email, password) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
    }
    return UserObject;
}());
// Initialisiert ein leeres Array zur Speicherung von User objekten
var users = [];
document.querySelector("#formCreate").addEventListener("submit", function (event) {
    event.preventDefault();
    createUserObject();
});
function createUserObjectRandom() {
    for (var i = 0; i < 10; i++) {
        var randomUser = createRandomUser();
        scrollDown();
        users.push(randomUser);
    }
    // Display function aufrufen
    displayUserList();
}
function createRandomUser() {
    // Erzeugt einen zufälligen Benutzer
    var randomString = function () { return Math.random().toString(36).substring(7); };
    return new UserObject("FirstName_" + randomString(), "LastName_" + randomString(), randomString() + "@example.com", "Password_" + randomString());
}
function createUserObject() {
    var firstNameInput = document.getElementById("firstName");
    var lastNameInput = document.getElementById("lastName");
    var emailInput = document.getElementById("email");
    var passwordInput = document.getElementById("password");
    var firstName = firstNameInput.value;
    var lastName = lastNameInput.value;
    var email = emailInput.value;
    var password = passwordInput.value;
    // Trimmen der Werte
    var trimmedFirstName = firstName.trim();
    var trimmedLastName = lastName.trim();
    var trimmedEmail = email.trim();
    var trimmedPassword = password.trim();
    if (trimmedFirstName && trimmedLastName && trimmedEmail && trimmedPassword) {
        // Überprüfung, ob die Email im Array bereits existiert --> loopt durch jedes Array Element durch (for of loop)
        for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
            var existingUser = users_1[_i];
            if (existingUser.email === trimmedEmail) {
                alert("Die E-Mail Adresse " + trimmedEmail + " wird bereits benutzt. Bitte benutze eine andere Mail Adresse.");
                // Beendet die Funktion wenn die Email bereits existiert
                return;
            }
        }
        // Wenn die Email noch nicht benutzt wird, wird der Nutzer angelegt
        var newUser = new UserObject(trimmedFirstName, trimmedLastName, trimmedEmail, trimmedPassword);
        users.push(newUser);
        // Formular leeren
        firstNameInput.value = "";
        lastNameInput.value = "";
        emailInput.value = "";
        passwordInput.value = "";
        // Nutzer anzeigen
        displayUserList();
        scrollDown();
    }
    else {
        alert("Bitte alle Eingabefelder ausfüllen, um den Nutzer zu erstellen.");
    }
}
var userSelectIdx = null;
function displayUserList() {
    var tableBody = document.getElementById("userTableBody");
    console.log(users);
    if (tableBody) {
        tableBody.innerHTML = "";
        users.forEach(function (user, index) {
            var row = tableBody.insertRow();
            var emailCell = row.insertCell(0);
            emailCell.textContent = user.email;
            emailCell.setAttribute("data-label", "E-Mail");
            var lastNameCell = row.insertCell(1);
            lastNameCell.textContent = user.lastName;
            lastNameCell.setAttribute("data-label", "Nachname");
            var firstNameCell = row.insertCell(2);
            firstNameCell.textContent = user.firstName;
            firstNameCell.setAttribute("data-label", "Vorname");
            // Füge Editier- und Lösch-Buttons hinzu
            var actionsCell = row.insertCell(3);
            var editButton = document.createElement("button");
            editButton.className = "btn btn-warning m-3 bi bi-pen";
            editButton.addEventListener("click", function () { return editUser(index); });
            actionsCell.appendChild(editButton);
            var deleteButton = document.createElement("button");
            deleteButton.className = "btn btn-danger m-3 bi bi-trash";
            deleteButton.addEventListener("click", function () { return deleteUser(index); });
            actionsCell.appendChild(deleteButton);
        });
    }
}
function editUser(index) {
    // Setze den Index des bearbeiteten Benutzers
    userSelectIdx = index;
    console.log(userSelectIdx);
    // die Eingabefelder für die Bearbeitung
    var user = users[index];
    var editFirstName = document.getElementById("editFirstName");
    var editLastName = document.getElementById("editLastName");
    var editEmail = document.getElementById("editEmail");
    // Überprüfe, ob die Eingabefelder vorhanden sind
    if (editFirstName && editLastName && editEmail) {
        // setzt Userdaten in die Inputfelder
        editFirstName.value = user.firstName;
        editLastName.value = user.lastName;
        editEmail.value = user.email;
        // Öffnet das Bootstrap 5 Modal für die Bearbeitung
        var editModal = new bootstrap.Modal(document.getElementById("editModal"));
        editModal.show();
    }
}
function updateUser() {
    console.log(userSelectIdx);
    // Überprüft, ob ein User bearbeitet wird
    if (userSelectIdx !== null) {
        // Input Felder für Bearbeitung
        var editFirstNameInput = document.getElementById('editFirstName');
        var editLastNameInput = document.getElementById('editLastName');
        // Trimmen der Werte
        var editFirstName = editFirstNameInput.value.trim();
        var editLastName = editLastNameInput.value.trim();
        // Checken, ob die Eingabefelder alle gefüllt sind
        if (editFirstName && editLastName) {
            // Aktualisiert die Daten des ausgewählten Users
            users[userSelectIdx].firstName = editFirstName;
            users[userSelectIdx].lastName = editLastName;
            // Versteckt das Modal nach Bearbeitung
            var editModal = new bootstrap.Modal(document.getElementById('editModal'));
            editModal.hide();
            userSelectIdx = null;
            displayUserList();
        }
        else {
            alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
        }
    }
}
function deleteUser(index) {
    var result = window.confirm("Möchten Sie das Element wirklich löschen?");
    if (result) {
        users.splice(index, 1);
        console.log("Nutzer Gelöscht!");
    }
    else {
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
