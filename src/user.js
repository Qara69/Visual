"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trimAndUppercase = exports.capitalizeFirst = void 0;
exports.createUser = createUser;
exports.createBook = createBook;
exports.calculateArea = calculateArea;
exports.getStatusColor = getStatusColor;
exports.getFirstElement = getFirstElement;
exports.findById = findById;
function createUser(id, name, email, isActive) {
    if (isActive === void 0) { isActive = true; }
    return {
        id: id,
        name: name,
        email: email,
        isActive: isActive
    };
}
function createBook(book) {
    return book;
}
function calculateArea(shape, param) {
    if (shape === 'circle') {
        return 3.14 * param * param;
    }
    else {
        return param * param;
    }
}
function getStatusColor(status) {
    if (status === 'active') {
        return 'green';
    }
    else if (status === 'inactive') {
        return 'red';
    }
    else {
        return 'yellow';
    }
}
var capitalizeFirst = function (str) {
    if (!str || str.length === 0) {
        return "";
    }
    var firstChar = str.charAt(0).toUpperCase();
    var restOfString = str.slice(1).toLowerCase();
    return firstChar + restOfString;
};
exports.capitalizeFirst = capitalizeFirst;
var trimAndUppercase = function (str, uppercase) {
    if (uppercase === void 0) { uppercase = false; }
    if (!str) {
        return "";
    }
    var trimmed = str.trim();
    return uppercase ? trimmed.toUpperCase() : trimmed;
};
exports.trimAndUppercase = trimAndUppercase;
// Задача 6
function getFirstElement(arr) {
    if (!arr || arr.length === 0) {
        return undefined;
    }
    return arr[0];
}
function findById(items, id) {
    if (!items || items.length === 0) {
        return undefined;
    }
    for (var i = 0; i < items.length; i++) {
        var item = items[i];
        if (item && item.id === id) {
            return item;
        }
    }
    return undefined;
}
