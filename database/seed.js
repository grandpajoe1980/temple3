const pool = require('../src/config/database');
const { hashPassword } = require('../src/utils/auth');

async function seedDatabase() {
  try {
    console.log('Seeding database with sample data...');
    
    // Create sample tenants and admin users
    const sampleTenants = [
      {
        name: 'First Community Church',
        subdomain: 'first-community',
        contactEmail: 'admin@firstcommunity.org',
        phone: '+1-555-0100',
        address: '123 Main Street, Springfield, IL 62701',
        admin: {
          email: 'admin@firstcommunity.org',
          firstName: 'Admin',
          lastName: 'User',
          phone: '+1-555-0101',
          password: 'admin123'
        }
      },
      {
        name: 'Zen Garden Collective',
        subdomain: 'zen-garden',
        contactEmail: 'hello@zengarden.org',
        phone: '+1-555-0200',
        address: '88 Lotus Way, Portland, OR 97205',
        admin: {
          email: 'abbot@zengarden.org',
          firstName: 'Mei',
          lastName: 'Tanaka',
          phone: '+1-555-0201',
          password: 'welcome123'
        }
      },
      {
        name: 'Sacred Path Fellowship',
        subdomain: 'sacred-path',
        contactEmail: 'connect@sacredpath.com',
        phone: '+1-555-0300',
        address: '450 Sunrise Ridge, Boulder, CO 80302',
        admin: {
          email: 'guide@sacredpath.com',
          firstName: 'Jordan',
          lastName: 'Singh',
          phone: '+1-555-0301',
          password: 'pathfinder'
        }
      }
    ];

    for (const tenant of sampleTenants) {
      const tenantResult = await pool.query(
        `INSERT INTO tenants (name, subdomain, contact_email, phone, address)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id`,
        [tenant.name, tenant.subdomain, tenant.contactEmail, tenant.phone, tenant.address]
      );

      const tenantId = tenantResult.rows[0].id;
      console.log(`✓ Created tenant: ${tenant.name} (${tenantId})`);

      const passwordHash = await hashPassword(tenant.admin.password);
      const userResult = await pool.query(
        `INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, phone, is_verified)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         RETURNING id`,
        [
          tenantId,
          tenant.admin.email,
          passwordHash,
          tenant.admin.firstName,
          tenant.admin.lastName,
          tenant.admin.phone,
          true
        ]
      );

      const userId = userResult.rows[0].id;
      console.log(
        `✓ Created admin user: ${tenant.admin.email} (password: ${tenant.admin.password})`
      );

      // Create sample content for the first tenant only to keep the dataset light
      if (tenant.subdomain === 'first-community') {
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
      }
    }
    console.log('\nDatabase seeded successfully!');
    console.log('\nSample login credentials:');
    sampleTenants.forEach((tenant) => {
      console.log(`  Tenant subdomain: ${tenant.subdomain}`);
      console.log(`  Email: ${tenant.admin.email}`);
      console.log(`  Password: ${tenant.admin.password}`);
      console.log('');
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
