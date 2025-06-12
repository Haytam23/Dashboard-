"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUserById = findUserById;
exports.findUserByEmail = findUserByEmail;
exports.createUser = createUser;
exports.setResetToken = setResetToken;
exports.findByResetToken = findByResetToken;
exports.updatePassword = updatePassword;
const db_1 = require("../db");
function findUserById(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0] || null;
    });
}
function findUserByEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0] || null;
    });
}
function createUser(email, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.pool.query('INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *', [email, hash]);
        return result.rows[0];
    });
}
function setResetToken(id, token, expires) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query('UPDATE users SET reset_token = $1, reset_expires = $2 WHERE id = $3', [token, expires, id]);
    });
}
function findByResetToken(token) {
    return __awaiter(this, void 0, void 0, function* () {
        const result = yield db_1.pool.query('SELECT * FROM users WHERE reset_token = $1 AND reset_expires > now()', [token]);
        return result.rows[0] || null;
    });
}
function updatePassword(id, hash) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2', [hash, id]);
    });
}
