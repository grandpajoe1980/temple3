const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');

async function setupDatabase() {
  try {
    console.log('Setting up database...');
    
    // Read schema file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    await pool.query(schema);
    
    console.log('Database setup completed successfully!');
    console.log('Tables created:');
    console.log('  - tenants');
    console.log('  - users');
    console.log('  - roles');
    console.log('  - user_roles');
    console.log('  - religious_texts');
    console.log('  - calendar_events');
    console.log('  - messages');
    console.log('  - podcasts');
    console.log('  - videos');
    console.log('  - reminder_bells');
    console.log('  - staff_posts');
    console.log('  - layperson_posts');
    console.log('  - comments');
    
    process.exit(0);
  } catch (error) {
    console.error('Database setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
