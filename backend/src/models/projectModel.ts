import { pool } from '../db';
import { Project } from '../types';

export async function getAllProjects(): Promise<Project[]> {
  const { rows } = await pool.query(`
    SELECT id, name, description,
           start_date AS "startDate",
           end_date   AS "endDate",
           category, priority
    FROM projects
    ORDER BY created_at DESC
  `);
  return rows;
}

export async function createProject(p: Project): Promise<void> {
  await pool.query(
    `INSERT INTO projects(id,name,description,start_date,end_date,category,priority)
     VALUES($1,$2,$3,$4,$5,$6,$7)`,
    [p.id,p.name,p.description,p.startDate,p.endDate,p.category,p.priority]
  );
}
