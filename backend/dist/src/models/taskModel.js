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
exports.getTasksByProject = getTasksByProject;
exports.createTask = createTask;
exports.updateTaskStatus = updateTaskStatus;
exports.deleteTask = deleteTask;
const db_1 = require("../db");
function getTasksByProject(projectId) {
    return __awaiter(this, void 0, void 0, function* () {
        const { rows } = yield db_1.pool.query(`
    SELECT id,
           project_id AS "projectId",
           name, description, assignee,
           due_date   AS "dueDate",
           status, completed_at AS "completedAt"
    FROM tasks
    WHERE project_id = $1
    ORDER BY due_date
  `, [projectId]);
        return rows;
    });
}
function createTask(t) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query(`INSERT INTO tasks(
       id, project_id, name, description, assignee, due_date, status, completed_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`, [
            t.id,
            t.projectId,
            t.name,
            t.description,
            t.assignee,
            t.dueDate,
            t.status,
            t.completedAt
        ]);
    });
}
function updateTaskStatus(id, status) {
    return __awaiter(this, void 0, void 0, function* () {
        const completedAt = status === 'completed' ? new Date() : null;
        const { rows } = yield db_1.pool.query(`
    UPDATE tasks
    SET status = $2, completed_at = $3
    WHERE id = $1
    RETURNING id, project_id AS "projectId", name, description, assignee,
              due_date AS "dueDate", status, completed_at AS "completedAt"
  `, [id, status, completedAt]);
        return rows[0];
    });
}
function deleteTask(id) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db_1.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    });
}
