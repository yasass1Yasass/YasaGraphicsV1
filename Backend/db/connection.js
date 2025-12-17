import mysql from 'mysql2/promise';
import { config } from '../config.js';

let pool;

export const initializeDatabase = async () => {
  try {
    pool = mysql.createPool(config.database);
    console.log('Database pool created successfully');
    return pool;
  } catch (error) {
    console.error('Database connection error:', error);
    throw error;
  }
};

export const getConnection = async () => {
  if (!pool) {
    await initializeDatabase();
  }
  return pool;
};

export const executeQuery = async (query, params = []) => {
  const connection = await getConnection();
  try {
    const [results] = await connection.execute(query, params);
    return results;
  } catch (error) {
    console.error('Query execution error:', error);
    throw error;
  }
};
