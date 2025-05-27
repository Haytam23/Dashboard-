import { pool } from '../db';
import { Task } from '../types';

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const { rows } = await pool.query(`
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
}

export async function createTask(t: Task): Promise<void> {
  await pool.query(
    `INSERT INTO tasks(
       id, project_id, name, description, assignee, due_date, status, completed_at
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      t.id,
      t.projectId,
      t.name,
      t.description,
      t.assignee,
      t.dueDate,
      t.status,
      t.completedAt
    ]
  );
}

export async function updateTaskStatus(id: string, status: Task['status']): Promise<Task> {
  const completedAt = status === 'completed' ? new Date() : null;
  const { rows } = await pool.query(`
    UPDATE tasks
    SET status = $2, completed_at = $3
    WHERE id = $1
    RETURNING id, project_id AS "projectId", name, description, assignee,
              due_date AS "dueDate", status, completed_at AS "completedAt"
  `, [id, status, completedAt]);
  return rows[0];
}
