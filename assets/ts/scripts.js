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
                    return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users", {
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
                    return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users", {
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
                    console.log("Error: Response is not OK", response.statusText);
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
function renderUserList() {
    return __awaiter(this, void 0, void 0, function () {
        var tableBody, response, users;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tableBody = document.getElementById("userTableBody");
                    return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users", {
                            credentials: "include"
                        })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, response.json()];
                case 2:
                    users = _a.sent();
                    if (tableBody) {
                        tableBody.innerHTML = "";
                        users.forEach(function (user) {
                            var row = tableBody.insertRow();
                            var emailCell = row.insertCell(0);
                            emailCell.textContent = user.mail;
                            emailCell.setAttribute("data-label", "E-Mail");
                            var lastNameCell = row.insertCell(1);
                            lastNameCell.textContent = user.lastname;
                            lastNameCell.setAttribute("data-label", "Nachname");
                            var firstNameCell = row.insertCell(2);
                            firstNameCell.textContent = user.firstname;
                            firstNameCell.setAttribute("data-label", "Vorname");
                            // Füge Editier- und Lösch-Buttons hinzu
                            var actionsCell = row.insertCell(3);
                            var editButton = document.createElement("button");
                            editButton.className = "btn btn-warning m-3 bi bi-pen";
                            editButton.addEventListener("click", function () { return editUserCloud(user.id); });
                            console.log(user.id);
                            actionsCell.appendChild(editButton);
                            var deleteButton = document.createElement("button");
                            deleteButton.className = "btn btn-danger m-3 bi bi-trash";
                            deleteButton.addEventListener("click", function () { return deleteUserCloud(user.id); });
                            actionsCell.appendChild(deleteButton);
                            renderUserPet(user.id);
                        });
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function renderUserPet(id) {
    return __awaiter(this, void 0, void 0, function () {
        var responsePet, userPet;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users/".concat(id, "/pets"), {
                        credentials: "include"
                    })];
                case 1:
                    responsePet = _a.sent();
                    if (!(responsePet === null || responsePet === void 0 ? void 0 : responsePet.ok)) return [3 /*break*/, 3];
                    return [4 /*yield*/, responsePet.json()];
                case 2:
                    userPet = _a.sent();
                    console.log(userPet);
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
function editUserCloud(id) {
    return __awaiter(this, void 0, void 0, function () {
        var response, editUser, editFirstName, editLastName, editEmail, button, editModal;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users/".concat(id), {
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
                            button.setAttribute('onclick', "updateUserCloud(".concat(id, ")"));
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
                    return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users/".concat(id), {
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
                        button.setAttribute('onclick', "updateUser(".concat(null, ")"));
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
function deleteUserCloud(id) {
    return __awaiter(this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    result = window.confirm("Möchten Sie das Element wirklich löschen?");
                    if (!result) return [3 /*break*/, 5];
                    return [4 /*yield*/, fetch("https://userman.thuermer.red/api/users/".concat(id), {
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
