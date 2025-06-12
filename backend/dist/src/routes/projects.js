"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.projectRouter = void 0;
// backend/src/routes/projects.ts
const express_1 = require("express");
const uuid_1 = require("uuid");
const pm = __importStar(require("../models/projectModel"));
const tm = __importStar(require("../models/taskModel"));
const auth_1 = require("../../middleware/auth");
exports.projectRouter = (0, express_1.Router)();
// protect every /tasks route
exports.projectRouter.use(auth_1.requireAuth);
// GET /projects
exports.projectRouter.get('/', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projects = yield pm.getAllProjects();
        res.json(projects);
    }
    catch (err) {
        console.error('Failed to fetch projects:', err);
        res.status(500).json({ error: 'Could not fetch projects' });
    }
}));
// POST /projects
exports.projectRouter.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = (0, uuid_1.v4)();
    const { name, description, startDate, endDate, category, priority, tasks, } = req.body;
    // 1) Insert project
    try {
        const project = {
            id,
            name,
            description,
            startDate,
            endDate,
            category,
            priority: priority,
        };
        yield pm.createProject(project);
    }
    catch (err) {
        console.error('Project insert failed:', err);
        res.status(500).json({ error: 'Failed to create project' });
        return; // <— stop further execution, but don’t return res
    }
    // 2) Insert tasks if any
    if (Array.isArray(tasks) && tasks.length) {
        for (const t of tasks) {
            try {
                const task = {
                    id: (0, uuid_1.v4)(),
                    projectId: id,
                    name: t.name,
                    description: t.description,
                    assignee: t.assignee,
                    dueDate: t.dueDate,
                    status: 'in-progress',
                    completedAt: undefined,
                    priority: 'medium', // Default priority, can be changed later
                };
                yield tm.createTask(task);
            }
            catch (taskErr) {
                console.error(`Failed to insert task "${t.name}":`, taskErr);
                // swallow and continue
            }
        }
    }
    // 3) Return success
    res.status(201).json({ id });
    // no `return res...`, just fall off
}));
// GET /projects/:id/tasks
exports.projectRouter.get('/:id/tasks', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield tm.getTasksByProject(req.params.id);
        res.json(tasks);
    }
    catch (err) {
        console.error('Failed to fetch tasks:', err);
        res.status(500).json({ error: 'Could not fetch tasks' });
    }
}));
// backend/src/routes/projects.ts
exports.projectRouter.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield pm.deleteProject(req.params.id);
        res.sendStatus(204);
    }
    catch (_a) {
        res.status(500).json({ error: 'Failed to delete project' });
    }
}));
