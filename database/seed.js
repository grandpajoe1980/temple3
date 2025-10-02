const pool = require('../src/config/database');
const { hashPassword } = require('../src/utils/auth');

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');
    
    // Create sample tenant
    const tenantResult = await pool.query(
      `INSERT INTO tenants (name, subdomain, contact_email, phone, address)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        'First Community Church',
        'first-community',
        'admin@firstcommunity.org',
        '+1-555-0100',
        '123 Main Street, Springfield, IL 62701'
      ]
    );
    
    const tenantId = tenantResult.rows[0].id;
    console.log(`✓ Created tenant: First Community Church (${tenantId})`);
    
    // Create sample admin user
    const passwordHash = await hashPassword('admin123');
    const userResult = await pool.query(
      `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, phone, is_verified)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id`,
      [
        tenantId,
        'admin@firstcommunity.org',
        passwordHash,
        'Admin',
        'User',
        '+1-555-0101',
        true
      ]
    );
    
    const userId = userResult.rows[0].id;
    console.log(`✓ Created admin user: admin@firstcommunity.org (password: admin123)`);
    
    // Create sample roles
    const adminRoleResult = await pool.query(
      `INSERT INTO roles (tenant_id, name, description, permissions)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [
        tenantId,
        'Admin',
        'Full system access',
        JSON.stringify(['all'])
      ]
    );
    
    const adminRoleId = adminRoleResult.rows[0].id;
    console.log('✓ Created role: Admin');
    
    await pool.query(
      `INSERT INTO roles (tenant_id, name, description, permissions)
       VALUES ($1, $2, $3, $4)`,
      [
        tenantId,
        'Staff',
        'Staff member access',
        JSON.stringify(['read', 'write_staff_posts', 'manage_events'])
      ]
    );
    console.log('✓ Created role: Staff');
    
    await pool.query(
      `INSERT INTO roles (tenant_id, name, description, permissions)
       VALUES ($1, $2, $3, $4)`,
      [
        tenantId,
        'Member',
        'Community member access',
        JSON.stringify(['read', 'write_posts', 'comment'])
      ]
    );
    console.log('✓ Created role: Member');
    
    // Assign admin role to user
    await pool.query(
      `INSERT INTO user_roles (user_id, role_id)
       VALUES ($1, $2)`,
      [userId, adminRoleId]
    );
    console.log('✓ Assigned Admin role to user');
    
    // Create sample religious text
    await pool.query(
      `INSERT INTO religious_texts (tenant_id, title, content, author, category, is_public, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        tenantId,
        'Weekly Message',
        'Welcome to our community. This is a sample religious text entry.',
        'Pastor John',
        'Sermons',
        true,
        userId
      ]
    );
    console.log('✓ Created sample religious text');
    
    // Create sample calendar event
    await pool.query(
      `INSERT INTO calendar_events (tenant_id, title, description, start_time, end_time, location, event_type, created_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        tenantId,
        'Sunday Service',
        'Weekly Sunday worship service',
        new Date('2024-01-07 10:00:00'),
        new Date('2024-01-07 11:30:00'),
        'Main Sanctuary',
        'Service',
        userId
      ]
    );
    console.log('✓ Created sample calendar event');
    
    console.log('\nDatabase seeded successfully!');
    console.log('\nYou can now test the API with:');
    console.log('  Tenant subdomain: first-community');
    console.log('  Email: admin@firstcommunity.org');
    console.log('  Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
