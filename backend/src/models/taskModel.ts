import { pool } from '../db';
import { Tasks } from '../types';

export async function getTasksByProject(projectId: string): Promise<Tasks[]> {
  console.log(`[TASK MODEL] Querying tasks for project: ${projectId}`);
  
  // Try with priority field first, fallback to without priority if it fails
  try {
    const { rows } = await pool.query(`
      SELECT id,
             project_id AS "projectId",
             name, description, assignee,
             due_date   AS "dueDate",
             status, completed_at AS "completedAt",
             priority
      FROM tasks
      WHERE project_id = $1
      ORDER BY due_date
    `, [projectId]);
    console.log(`[TASK MODEL] Query with priority returned ${rows.length} tasks`);
    return rows;
  } catch (priorityError: any) {
    console.log(`[TASK MODEL] Priority column not found, trying without priority: ${priorityError.message}`);
    // Fallback: try without priority column (for older database schemas)
    const { rows } = await pool.query(`
      SELECT id,
             project_id AS "projectId",
             name, description, assignee,
             due_date   AS "dueDate",
             status, completed_at AS "completedAt",
             'medium' as priority
      FROM tasks
      WHERE project_id = $1
      ORDER BY due_date
    `, [projectId]);
    console.log(`[TASK MODEL] Query without priority returned ${rows.length} tasks`);
    return rows;
  }
}

export async function createTask(t: Tasks): Promise<void> {
  console.log(`[TASK MODEL] Creating task: ${JSON.stringify(t)}`);
  
  // Try with priority field first, fallback to without priority if it fails
  try {
    await pool.query(
      `INSERT INTO tasks(
         id, project_id, name, description, assignee, due_date, status, completed_at, priority
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [
        t.id,
        t.projectId,
        t.name,
        t.description,
        t.assignee,
        t.dueDate,
        t.status,
        t.completedAt,
        t.priority
      ]
    );
    console.log(`[TASK MODEL] Task created successfully with priority: ${t.name}`);
  } catch (priorityError: any) {
    console.log(`[TASK MODEL] Priority column not found, trying without priority: ${priorityError.message}`);
    // Fallback: try without priority column (for older database schemas)
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
    console.log(`[TASK MODEL] Task created successfully without priority: ${t.name}`);
  }
}

export async function updateTaskStatus(id: string, status: Tasks['status']): Promise<Tasks> {
  const completedAt = status === 'completed' ? new Date() : null;
  
  // Try with priority field first, fallback to without priority if it fails
  try {
    const { rows } = await pool.query(`
      UPDATE tasks
      SET status = $2, completed_at = $3
      WHERE id = $1
      RETURNING id, project_id AS "projectId", name, description, assignee,
                due_date AS "dueDate", status, completed_at AS "completedAt", priority
    `, [id, status, completedAt]);
    return rows[0];
  } catch (priorityError: any) {
    console.log(`[TASK MODEL] Priority column not found in update, trying without priority: ${priorityError.message}`);
    // Fallback: try without priority column (for older database schemas)
    const { rows } = await pool.query(`
      UPDATE tasks
      SET status = $2, completed_at = $3
      WHERE id = $1
      RETURNING id, project_id AS "projectId", name, description, assignee,
                due_date AS "dueDate", status, completed_at AS "completedAt", 'medium' as priority
    `, [id, status, completedAt]);
    return rows[0];
  }
}

export async function deleteTask(id: string): Promise<void> {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
}

