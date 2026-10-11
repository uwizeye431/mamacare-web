// Makes an existing, verified account an admin. Usage: npm run admin:grant -- someone@example.com
import '../src/config/env';
import { query, closePool } from '../src/db/client';

(async () => {
  const email = (process.argv[2] || '').trim().toLowerCase();
  if (!email) {
    console.error('Usage: npm run admin:grant -- <email>');
    process.exitCode = 1;
  } else {
    const result = await query(
      `UPDATE users SET role = 'admin', updated_at = now() WHERE lower(email) = $1 RETURNING name, email, is_verified`,
      [email]
    );
    const user = result.rows[0];
    if (!user) {
      console.error(`No account found for ${email}. Sign up first, then run this again.`);
      process.exitCode = 1;
    } else {
      console.log(`${user.name} <${user.email}> is now an admin.${user.is_verified ? '' : ' Note: this account has not verified its email yet.'}`);
      console.log('They must log out and back in (or wait up to 15 minutes) for it to take effect.');
    }
  }
  await closePool();
})();
