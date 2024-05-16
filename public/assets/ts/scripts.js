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
// Definiert die Benutzerklasse mit den erforderlichen Attributen
var UserObject = /** @class */ (function () {
    function UserObject(firstname, lastname, mail, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.mail = mail;
        this.password = password;
    }
    return UserObject;
}());
document.querySelector("#formCreate").addEventListener("submit", function (event) {
    event.preventDefault();
    addUser();
});
function generateRandomUser() {
    var firstNames = ["John", "Emma", "Michael", "Sophia", "William", "Olivia"];
    var lastNames = ["Smith", "Johnson", "Brown", "Williams", "Jones", "Garcia"];
    var domains = ["gmail.com", "yahoo.com", "outlook.com", "example.com"];
    var passwords = ["password123", "abc123", "qwerty", "letmein", "password"];
    var randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    var randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    var randomDomain = domains[Math.floor(Math.random() * domains.length)];
    var randomPassword = passwords[Math.floor(Math.random() * passwords.length)];
    var randomEmail = "".concat(randomFirstName.toLowerCase(), ".").concat(randomLastName.toLowerCase(), "@").concat(randomDomain);
    return new UserObject(randomFirstName, randomLastName, randomEmail, randomPassword);
}
function addRandomUser() {
    return __awaiter(this, void 0, void 0, function () {
        var randomUser, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    randomUser = generateRandomUser();
                    return [4 /*yield*/, fetch("/users", {
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
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 3];
                    console.log("Random user added successfully!");
                    return [4 /*yield*/, renderUserList()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.error("Error adding random user:", response.statusText);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function addUserPet(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var petName, petKind, name, kind, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    petName = document.getElementById("petName");
                    petKind = document.getElementById("petKind");
                    name = petName.value.trim();
                    kind = petKind.value.trim();
                    return [4 /*yield*/, fetch("/users/".concat(userId, "/pets"), {
                            method: "POST",
                            body: JSON.stringify({
                                name: name,
                                kind: kind
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!response.ok) return [3 /*break*/, 4];
                    console.log("Tier erfolgreich hinzugefügt");
                    return [4 /*yield*/, renderUserList()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, renderUserPetListAdmin(userId)];
                case 3:
                    _a.sent();
                    petName.value = "";
                    petKind.value = "";
                    return [3 /*break*/, 5];
                case 4:
                    console.error("Error adding pet:", response.statusText);
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function deleteUserPet(userId, petId) {
    return __awaiter(this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = window.confirm("Möchten Sie das Element wirklich löschen?");
                    if (!result) return [3 /*break*/, 6];
                    return [4 /*yield*/, fetch("/users/".concat(userId, "/pets/").concat(petId), {
                            method: "DELETE",
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 4];
                    return [4 /*yield*/, renderUserPetListAdmin(userId)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, renderUserList()];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    console.log("Error: Response is not OK", response.statusText);
                    _a.label = 5;
                case 5:
                    console.log("Nutzer Gelöscht!");
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
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
                    return [4 /*yield*/, renderUserList()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log("Error: Response is not OK", response.status);
                    alert(response.body);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function renderUserList() {
    return __awaiter(this, void 0, void 0, function () {
        var tableBody, response, users, _loop_1, _i, users_1, user;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableBody = document.getElementById("userTableBody");
                    return [4 /*yield*/, fetch("/users", {
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 7];
                    return [4 /*yield*/, response.json()];
                case 2:
                    users = _a.sent();
                    if (!tableBody) return [3 /*break*/, 6];
                    tableBody.innerHTML = "";
                    _loop_1 = function (user) {
                        var userPets, row, emailCell, lastNameCell, firstNameCell, petCell, actionsCell, editButton, deleteButton, petButton;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0: return [4 /*yield*/, renderUserPetMain(user.id)];
                                case 1:
                                    userPets = _b.sent();
                                    row = tableBody.insertRow();
                                    emailCell = row.insertCell(0);
                                    emailCell.textContent = user.mail;
                                    emailCell.setAttribute("data-label", "E-Mail");
                                    lastNameCell = row.insertCell(1);
                                    lastNameCell.textContent = user.lastname;
                                    lastNameCell.setAttribute("data-label", "Nachname");
                                    firstNameCell = row.insertCell(2);
                                    firstNameCell.textContent = user.firstname;
                                    firstNameCell.setAttribute("data-label", "Vorname");
                                    petCell = row.insertCell(3);
                                    petCell.textContent = userPets.map(function (pet) { return pet.name; }).join(", ");
                                    petCell.setAttribute("data-label", "Pets");
                                    actionsCell = row.insertCell(4);
                                    editButton = document.createElement("button");
                                    editButton.className = "btn btn-warning m-3 bi bi-pen";
                                    editButton.addEventListener("click", function () { return editUserCloud(user.id); });
                                    console.log(user.id);
                                    actionsCell.appendChild(editButton);
                                    deleteButton = document.createElement("button");
                                    deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                                    deleteButton.addEventListener("click", function () { return deleteUserCloud(user.id); });
                                    actionsCell.appendChild(deleteButton);
                                    petButton = document.createElement("button");
                                    petButton.className = "btn btn-primary m-3 bi bi-gitlab";
                                    petButton.addEventListener("click", function () { return petAdmin(user.id); });
                                    actionsCell.appendChild(petButton);
                                    return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, users_1 = users;
                    _a.label = 3;
                case 3:
                    if (!(_i < users_1.length)) return [3 /*break*/, 6];
                    user = users_1[_i];
                    return [5 /*yield**/, _loop_1(user)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    _i++;
                    return [3 /*break*/, 3];
                case 6: return [3 /*break*/, 8];
                case 7:
                    console.log("Error: Response is not OK", response.statusText);
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    });
}
function renderUserPetMain(id) {
    return __awaiter(this, void 0, void 0, function () {
        var responsePet, userPets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/users/".concat(id, "/pets"), {
                        credentials: "include"
                    })];
                case 1:
                    responsePet = _a.sent();
                    if (!(responsePet === null || responsePet === void 0 ? void 0 : responsePet.ok)) return [3 /*break*/, 3];
                    return [4 /*yield*/, responsePet.json()];
                case 2:
                    userPets = _a.sent();
                    return [2 /*return*/, userPets];
                case 3: return [2 /*return*/, []]; // Falls keine Haustiere gefunden wurden, gib ein leeres Array zurück
            }
        });
    });
}
function petAdmin(userId) {
    var petFooterModal = document.getElementById("petModalFooter");
    if (petFooterModal) {
        // Zuerst alle vorhandenen Buttons entfernen, falls vorhanden
        while (petFooterModal.firstChild) {
            petFooterModal.removeChild(petFooterModal.firstChild);
        }
        // Das Button-Element erstellen
        var petButton = document.createElement("button");
        petButton.className = "btn btn-info m-3 bi bi-database-fill-add";
        petButton.textContent = "Tier Hinzufügen";
        petButton.addEventListener("click", function () { return addUserPet(userId); });
        petFooterModal.appendChild(petButton);
    }
    renderUserPetListAdmin(userId);
    // Öffnet das Bootstrap 5 Modal für die Bearbeitung
    var petAdminModal = new bootstrap.Modal(document.getElementById("petAdminModal"));
    petAdminModal.show();
}
// @ts-ignore
function renderUserPetListAdmin(userId) {
    return __awaiter(this, void 0, void 0, function () {
        var tableBody, userPets, _loop_2, _i, userPets_1, pet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableBody = document.getElementById("userPetTableBody");
                    return [4 /*yield*/, renderUserPetMain(userId)];
                case 1:
                    userPets = _a.sent();
                    if (userPets) {
                        if (tableBody) {
                            tableBody.innerHTML = "";
                            _loop_2 = function (pet) {
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
                                deleteButton.addEventListener("click", function () { return deleteUserPet(userId, pet.id); });
                                actionsCell.appendChild(deleteButton);
                            };
                            for (_i = 0, userPets_1 = userPets; _i < userPets_1.length; _i++) {
                                pet = userPets_1[_i];
                                _loop_2(pet);
                            }
                        }
                    }
                    return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function editUserCloud(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, editUser, editFirstName, editLastName, editEmail, button, editModal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("/users/".concat(id), {
                        credentials: "include"
                    })];
                case 1:
                    response = _a.sent();
                    if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 3];
                    return [4 /*yield*/, response.json()];
                case 2:
                    editUser = _a.sent();
                    console.log(editUser);
                    editFirstName = document.getElementById("editFirstName");
                    editLastName = document.getElementById("editLastName");
                    editEmail = document.getElementById("editEmail");
                    if (editFirstName && editLastName && editEmail) {
                        // setzt Userdaten in die Inputfelder
                        editFirstName.value = editUser.firstname;
                        editLastName.value = editUser.lastname;
                        editEmail.value = editUser.mail;
                        button = document.getElementById('updateUser');
                        if (button) {
                            button.setAttribute('onclick', "updateUserCloud('".concat(id, "')"));
                        }
                        editModal = new bootstrap.Modal(document.getElementById("editModal"));
                        editModal.show();
                    }
                    return [3 /*break*/, 4];
                case 3:
                    console.log("Error: Response is not OK", response.statusText);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function updateUserCloud(id) {
    return __awaiter(this, void 0, void 0, function () {
        var editFirstNameInput, editLastNameInput, editFirstName, editLastName, response, editModal, button;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(id !== null)) return [3 /*break*/, 4];
                    editFirstNameInput = document.getElementById("editFirstName");
                    editLastNameInput = document.getElementById("editLastName");
                    editFirstName = editFirstNameInput.value.trim();
                    editLastName = editLastNameInput.value.trim();
                    if (!(editFirstName && editLastName)) return [3 /*break*/, 3];
                    return [4 /*yield*/, fetch("/users/".concat(id), {
                            method: "PATCH",
                            body: JSON.stringify({
                                firstname: editFirstName,
                                lastname: editLastName,
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            },
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    editModal = new bootstrap.Modal(document.getElementById("editModal"));
                    editModal.hide();
                    button = document.getElementById('updateUser');
                    if (button) {
                        button.setAttribute('onclick', "updateUserCloud(".concat(null, ")"));
                    }
                    return [4 /*yield*/, renderUserList()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    alert("Daten wurden nicht aktualisiert, weil nicht alle Felder ausgefüllt waren!");
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
// @ts-ignore
function deleteUserCloud(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = window.confirm("Möchten Sie das Element wirklich löschen?");
                    if (!result) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch("/users/".concat(id), {
                            method: "DELETE",
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    if (!(response === null || response === void 0 ? void 0 : response.ok)) return [3 /*break*/, 3];
                    return [4 /*yield*/, renderUserList()];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    console.log("Error: Response is not OK", response.statusText);
                    _a.label = 4;
                case 4:
                    console.log("Nutzer Gelöscht!");
                    _a.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
}
function scrollDown() {
    //this.scroller.scrollToAnchor("targetGreen");
    document.getElementById("userList").scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}
