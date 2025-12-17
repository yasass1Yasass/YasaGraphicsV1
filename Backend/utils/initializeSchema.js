import { executeQuery } from '../db/connection.js';

export const initializeDiscountColumns = async () => {
  try {
    // Check if discount_enabled column exists
    const checkQuery = `
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'designs' AND COLUMN_NAME = 'discount_enabled'
    `;
    
    const result = await executeQuery(checkQuery);
    
    if (result.length === 0) {
      console.log('Adding discount columns to designs table...');
      
      // Add discount_enabled column
      await executeQuery(`
        ALTER TABLE designs ADD COLUMN discount_enabled BOOLEAN DEFAULT FALSE
      `);
      
      // Add discount_percentage column
      await executeQuery(`
        ALTER TABLE designs ADD COLUMN discount_percentage INT DEFAULT 0
      `);
      
      console.log('✓ Discount columns added successfully');
      return true;
    } else {
      console.log('✓ Discount columns already exist');
      return false;
    }
  } catch (error) {
    console.error('Error initializing discount columns:', error.message);
    // Continue anyway - the columns might already exist
    return false;
  }
};
