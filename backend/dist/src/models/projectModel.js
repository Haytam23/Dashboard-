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
exports.getAllProjects = getAllProjects;
exports.createProject = createProject;
exports.deleteProject = deleteProject;
const db_1 = require("../db");
function getAllProjects() {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield db_1.pool.query(`
    SELECT id, name, description,
           start_date AS "startDate",
           end_date   AS "endDate",
           category, priority
    FROM projects
    ORDER BY created_at DESC
  `);
        return rows;
    });
}
function createProject(p) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query(`INSERT INTO projects(id,name,description,start_date,end_date,category,priority)
     VALUES($1,$2,$3,$4,$5,$6,$7)`, [p.id, p.name, p.description, p.startDate, p.endDate, p.category, p.priority]);
    });
}
function deleteProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query('DELETE FROM projects WHERE id = $1', [id]);
    });
}
