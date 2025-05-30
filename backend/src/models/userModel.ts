import {pool} from '../db';
import type { User } from '../types';


export async function findUserById(id: string): Promise<User|null> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function findUserByEmail(email: string): Promise<User|null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function createUser(email: string, hash: string): Promise<User> {
  const result = await pool.query(
    'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *',
    [email, hash]
  );
  return result.rows[0];
}

export async function setResetToken(id: string, token: string, expires: Date) {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_expires = $2 WHERE id = $3',
    [token, expires, id]
  );
}

export async function findByResetToken(token: string): Promise<User|null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE reset_token = $1 AND reset_expires > now()',
    [token]
  );
  return result.rows[0] || null;
}

export async function updatePassword(id: string, hash: string) {
  await pool.query(
    'UPDATE users SET password = $1, reset_token = NULL, reset_expires = NULL WHERE id = $2',
    [hash, id]
  );
}
