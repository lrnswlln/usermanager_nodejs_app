var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function deleteUser() {
    return __awaiter(this, void 0, void 0, function () {
        var result, response, errorData, responseData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = window.confirm("Möchten Sie das Element wirklich löschen?");
                    if (!result) return [3 /*break*/, 7];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, fetch('/user/delete', {
                            method: 'DELETE',
                            credentials: 'include'
                        })];
                case 2:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, response.json()];
                case 3:
                    errorData = _a.sent();
                    console.error('Fehler beim Löschen des Benutzers:', errorData.error);
                    alert('Fehler beim Löschen des Benutzers: ' + errorData.error);
                    return [2 /*return*/];
                case 4: return [4 /*yield*/, response.json()];
                case 5:
                    responseData = _a.sent();
                    console.log(responseData.message);
                    window.location.reload();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    console.error('Unbekannter Fehler:', error_1);
                    errorModalCall('Ein unbekannter Fehler ist aufgetreten.');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function fetchUserProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var response, userDataArray, userData, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/user/profile', {
                            method: 'GET',
                            credentials: 'include'
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Fehler beim Abrufen der Benutzerdaten');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    userDataArray = _a.sent();
                    if (userDataArray.length === 0) {
                        throw new Error('Keine Benutzerdaten erhalten');
                    }
                    userData = userDataArray[0];
                    return [2 /*return*/, userData];
                case 3:
                    error_2 = _a.sent();
                    console.error('Fehler beim Abrufen der Benutzerdaten:', error_2.message);
                    throw error_2;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchUserPets() {
    return __awaiter(this, void 0, void 0, function () {
        var response, userPets, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch('/user/pets', {
                            method: 'GET',
                            credentials: 'include'
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error('Fehler beim Abrufen der Haustiere');
                    }
                    return [4 /*yield*/, response.json()];
                case 2:
                    userPets = _a.sent();
                    return [2 /*return*/, userPets];
                case 3:
                    error_3 = _a.sent();
                    console.error('Fehler beim Abrufen der Haustiere:', error_3.message);
                    throw error_3;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderUserProfile() {
    return __awaiter(this, void 0, void 0, function () {
        var userProfile, userData, userPets, userProfileContainer, userProfileDiv, userLoginDiv, userContainer, greetingMessage, userTableBody_1, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userProfile = document.getElementById('user-profile');
                    if (userProfile)
                        userProfile.innerHTML = "";
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, fetchUserProfile()];
                case 2:
                    userData = _a.sent();
                    return [4 /*yield*/, fetchUserPets()];
                case 3:
                    userPets = _a.sent();
                    console.log("Fetch Data aus Rendering Funktion" + userData);
                    console.log("Fetch Data aus Rendering Funktion" + userPets);
                    userProfileContainer = document.getElementById('user-profile-container');
                    userProfileDiv = document.getElementById('user-profile');
                    userLoginDiv = document.getElementById('register-login');
                    if (!userProfileDiv)
                        return [2 /*return*/];
                    userProfileContainer.style.display = "block";
                    userLoginDiv.style.display = "none";
                    userProfileDiv.innerHTML = '';
                    userContainer = document.createElement('div');
                    greetingMessage = greetUser(userData.firstname);
                    userContainer.innerHTML = "\n            <div class=\"d-flex justify-content-between align-items-center mb-5\">\n            <h2 class=\"mt-1\">".concat(greetingMessage, "</h2>\n                                        <button class=\"btn btn-danger my-3 p-3 bi bi-door-open-fill btn-sparkle\" id=\"userLogout\"\n                    onclick=\"userLogout()\">\n                <span class=\"mx-2\">Logout</span>\n            </button>\n            </div>\n            <img class=\"mb-4\" src=\"assets/media/Profile.png\" alt=\"Profile\" width=\"200px\">\n            <h5>Deine Daten:</h5>\n            <p><b>Vorname:</b> ").concat(userData.firstname, "</p>\n            <p><b>Nachname:</b> ").concat(userData.lastname, "</p>\n            <p><b>E-Mail:</b> ").concat(userData.mail, "</p>\n                        <button class=\"btn btn-danger my-3 p-3 bi bi-pen-fill btn-sparkle\" id=\"editUserModal\"\n                    onclick=\"editUserModal()\">\n                <span class=\"mx-2\">Bearbeiten</span>\n            </button>\n                            <button class=\"btn btn-danger my-3 p-3 bi bi-trash-fill btn-sparkle\"\n                        onclick=\"deleteUser()\">\n                    <span class=\"mx-2\">Nutzer L\u00F6schen</span>\n                </button>\n        ");
                    userProfileDiv.appendChild(userContainer);
                    userTableBody_1 = document.getElementById('userTableBody');
                    if (userTableBody_1) {
                        userTableBody_1.innerHTML = '';
                        userPets.forEach(function (pet) {
                            var petRow = document.createElement('tr');
                            petRow.innerHTML = "\n                    <td data-label=Name>".concat(pet.name, "</td>\n                    <td data-label=Tierart>").concat(pet.kind, "</td>\n                ");
                            userTableBody_1.appendChild(petRow);
                        });
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    console.error('Error rendering user profile:', error_4.message);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
renderUserProfile();
function userLogout() {
    return __awaiter(this, void 0, void 0, function () {
        var userProfile, userTableBody, userProfileContainer, userLoginDiv, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    userProfile = document.getElementById('user-profile');
                    userTableBody = document.getElementById('userTableBody');
                    userProfileContainer = document.getElementById('user-profile-container');
                    userLoginDiv = document.getElementById('register-login');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, fetch('/logout', {
                            method: 'POST',
                            credentials: 'same-origin',
                            headers: {
                                'Content-Type': 'application/json'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    if (response.ok) {
                        userProfileContainer.style.display = "none";
                        userLoginDiv.style.display = "block";
                        userProfile.innerHTML = "";
                        userTableBody.innerHTML = '';
                        //window.location.reload(); //Könnte man nen Reload erzwingen für vollständiges Daten clearen
                        console.log('Abmeldung erfolgreich');
                        errorModalCall('Abmeldung erfolgreich');
                    }
                    else {
                        console.error('Fehler beim Abmelden:', response.statusText);
                    }
                    return [3 /*break*/, 4];
                case 3:
                    error_5 = _a.sent();
                    console.error('Fehler beim Abmelden:', error_5.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function fetchData() {
    return __awaiter(this, void 0, void 0, function () {
        var userProfile, userPets, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetchUserProfile()];
                case 1:
                    userProfile = _a.sent();
                    console.log('Benutzerdaten:', userProfile);
                    return [4 /*yield*/, fetchUserPets()];
                case 2:
                    userPets = _a.sent();
                    console.log('Haustiere des Benutzers:', userPets);
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _a.sent();
                    console.error('Fehler beim Abrufen der Daten:', error_6.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function onPageLoaded(callback) {
    window.addEventListener('load', callback);
}
onPageLoaded(function () {
    fetchData();
});
document.querySelector("#formCreate").addEventListener("submit", function (event) {
    event.preventDefault();
    addUser();
});
document.querySelector("#formLogin").addEventListener("submit", function (event) {
    event.preventDefault();
    loginUser();
});
// @ts-ignore
function addUserPet() {
    return __awaiter(this, void 0, void 0, function () {
        var petName, petKind, name, kind, response, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    petName = document.getElementById("petName");
                    petKind = document.getElementById("petKind");
                    name = petName.value.trim();
                    kind = petKind.value.trim();
                    if (!name || !kind) {
                        errorModalCall("Bitte füllen Sie alle Felder aus.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, fetch('/user/pets', {
                            method: "POST",
                            body: JSON.stringify({ name: name, kind: kind }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        })];
                case 2:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 5];
                    console.log("Tier erfolgreich hinzugefügt");
                    return [4 /*yield*/, renderUserProfile()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, renderUserPetListAdmin()];
                case 4:
                    _a.sent();
                    petName.value = "";
                    petKind.value = "";
                    return [3 /*break*/, 6];
                case 5:
                    if (response.status === 409) {
                        errorModalCall("Ein Haustier mit diesem Namen existiert bereits für diesen Benutzer.");
                    }
                    else {
                        errorModalCall("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                    }
                    _a.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_7 = _a.sent();
                    console.error("Error adding pet:", error_7);
                    errorModalCall("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.");
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
function deleteUserPet(petId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = window.confirm("Möchten Sie das Tier des Nutzers wirklich löschen?");
                    if (!result) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetch("/user/pets/".concat(petId), {
                            method: "DELETE",
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    return [4 /*yield*/, renderUserPetListAdmin()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, renderUserProfile()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.error("Error: Response is not OK", response.statusText);
                    _a.label = 5;
                case 5:
                    console.log("Haustier gelöscht!");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function loginUser() {
    return __awaiter(this, void 0, void 0, function () {
        var emailLoginInput, passwordLoginInput, mail, password, response, errorMessage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    emailLoginInput = document.getElementById("emailLogin");
                    passwordLoginInput = document.getElementById("passwordLogin");
                    mail = emailLoginInput.value.trim();
                    password = passwordLoginInput.value.trim();
                    return [4 /*yield*/, fetch("/login", {
                            method: "POST",
                            body: JSON.stringify({
                                mail: mail,
                                password: password
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 2];
                    renderUserProfile();
                    emailLoginInput.value = "";
                    passwordLoginInput.value = "";
                    console.log("login successfulll!");
                    return [3 /*break*/, 4];
                case 2:
                    console.log("Error: Response is not OK", response.statusText);
                    return [4 /*yield*/, response.text()];
                case 3:
                    errorMessage = _a.sent();
                    errorModalCall("Fehler bei der Anmeldung, überprüfe deine Anmeldedaten!");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function addUser() {
    return __awaiter(this, void 0, void 0, function () {
        var firstNameInput, lastNameInput, emailInput, passwordInput, firstname, lastname, mail, password, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    firstNameInput = document.getElementById("firstName");
                    lastNameInput = document.getElementById("lastName");
                    emailInput = document.getElementById("email");
                    passwordInput = document.getElementById("password");
                    firstname = firstNameInput.value.trim();
                    lastname = lastNameInput.value.trim();
                    mail = emailInput.value.trim();
                    password = passwordInput.value.trim();
                    return [4 /*yield*/, fetch("/users", {
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
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    firstNameInput.value = "";
                    lastNameInput.value = "";
                    emailInput.value = "";
                    passwordInput.value = "";
                    return [4 /*yield*/, renderUserProfile()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log("Error: Response is not OK", response.status);
                    errorModalCall("Registrierung Fehlgeschlagen, E-Mail bereits vergeben");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function petAdmin() {
    var petFooterModal = document.getElementById("petModalFooter");
    if (petFooterModal) {
        // Zuerst alle vorhandenen Buttons entfernen, falls vorhanden -_> Clearen von vorhereigen Funktionscalls
        while (petFooterModal.firstChild) {
            petFooterModal.removeChild(petFooterModal.firstChild);
        }
        var petButton = document.createElement("button");
        petButton.className = "btn btn-info m-3 bi bi-database-fill-add";
        petButton.textContent = "Tier Hinzufügen";
        petButton.addEventListener("click", function () { return addUserPet(); });
        petFooterModal.appendChild(petButton);
    }
    renderUserPetListAdmin();
    var petAdminModal = new bootstrap.Modal(document.getElementById("petAdminModal"));
    petAdminModal.show();
}
// @ts-ignore
function renderUserPetListAdmin() {
    return __awaiter(this, void 0, void 0, function () {
        var tableBody, userPets, _loop_1, _i, userPets_1, pet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableBody = document.getElementById("userPetTableBody");
                    return [4 /*yield*/, fetchUserPets()];
                case 1:
                    userPets = _a.sent();
                    if (userPets) {
                        if (tableBody) {
                            tableBody.innerHTML = "";
                            _loop_1 = function (pet) {
                                var row = tableBody.insertRow();
                                var emailCell = row.insertCell(0);
                                emailCell.textContent = pet.name;
                                emailCell.setAttribute("data-label", "Tiername");
                                var lastNameCell = row.insertCell(1);
                                lastNameCell.textContent = pet.kind;
                                lastNameCell.setAttribute("data-label", "Tierart");
                                // Füge Editier- und Lösch-Buttons hinzu
                                var actionsCell = row.insertCell(2);
                                var deleteButton = document.createElement("button");
                                deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                                deleteButton.addEventListener("click", function () { return deleteUserPet(pet.id); });
                                actionsCell.appendChild(deleteButton);
                            };
                            for (_i = 0, userPets_1 = userPets; _i < userPets_1.length; _i++) {
                                pet = userPets_1[_i];
                                _loop_1(pet);
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function editUserModal() {
    return __awaiter(this, void 0, void 0, function () {
        var response, editUser, editFirstName, editLastName, editEmail, editModal, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 5, , 6]);
                    return [4 /*yield*/, fetch('/user/profile', {
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    editUser = _a.sent();
                    console.log(editUser);
                    editFirstName = document.getElementById("editFirstName");
                    editLastName = document.getElementById("editLastName");
                    editEmail = document.getElementById("editEmail");
                    if (editFirstName && editLastName && editEmail) {
                        editFirstName.value = editUser[0].firstname;
                        editLastName.value = editUser[0].lastname;
                        editEmail.value = editUser[0].mail;
                        editModal = new bootstrap.Modal(document.getElementById("editModal"));
                        editModal.show();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Error: Response is not OK", response.statusText);
                    _a.label = 4;
                case 4: return [3 /*break*/, 6];
                case 5:
                    error_8 = _a.sent();
                    console.error("Error:", error_8);
                    return [3 /*break*/, 6];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// Update USer
function updateUser() {
    return __awaiter(this, void 0, void 0, function () {
        var editFirstNameInput, editLastNameInput, editPasswordInput, editFirstName, editLastName, editPassword, response, editModal, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, , 9]);
                    editFirstNameInput = document.getElementById("editFirstName");
                    editLastNameInput = document.getElementById("editLastName");
                    editPasswordInput = document.getElementById("editPassword");
                    editFirstName = editFirstNameInput.value.trim();
                    editLastName = editLastNameInput.value.trim();
                    editPassword = editPasswordInput.value.trim();
                    if (!(editFirstName && editLastName)) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetch("/user/update", {
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
                        })];
                case 1:
                    response = _a.sent();
                    if (!!response.ok) return [3 /*break*/, 2];
                    throw new Error('Fehler beim Aktualisieren des Benutzers');
                case 2: return [4 /*yield*/, renderUserProfile()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    editModal = new bootstrap.Modal(document.getElementById("editModal"));
                    editModal.hide();
                    return [4 /*yield*/, renderUserProfile()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    errorModalCall("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_9 = _a.sent();
                    console.error('Fehler beim Aktualisieren des Benutzers:', error_9.message);
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
document.addEventListener("DOMContentLoaded", function () {
    var loginBtn = document.getElementById("loginBtn");
    var registerBtn = document.getElementById("registerBtn");
    var loginForm = document.getElementById("loginForm");
    var registerForm = document.getElementById("registerForm");
    loginBtn.addEventListener("click", function () {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
    });
    registerBtn.addEventListener("click", function () {
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
function greetUser(userName) {
    var greetings = [
        "Hallo, ".concat(userName, "!"),
        "Guten Tag, ".concat(userName, "!"),
        "Hi, ".concat(userName, "!"),
        "Gude, ".concat(userName, "!"),
        "Gr\u00FC\u00DF dich, ".concat(userName, "!"),
        "Servus, ".concat(userName, "!"),
        "Moin, ".concat(userName, "!"),
        "Hey, ".concat(userName, "!"),
        "Sch\u00F6n dich zu sehen, ".concat(userName, "!"),
        "Herzlich willkommen, ".concat(userName, "!")
    ];
    var randomIndex = Math.floor(Math.random() * greetings.length);
    return greetings[randomIndex];
}
function errorModalCall(errorMessage) {
    var errorModalMessage = document.getElementById("errorModalMessage");
    if (errorModalMessage) {
        errorModalMessage.textContent = errorMessage;
    }
    var errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
    errorModal.show();
}
