import { hash } from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

import createConnection from '../index';

export async function create() {
  const connection = await createConnection('localhost');
  const id = uuidV4();
  const pass = await hash('admin', 8);

  connection.query(`
    INSERT INTO users(id, name, email, password, is_admin, driver_license, created_at)
      VALUES('${id}', 'admin', 'admin@email.com', '${pass}', true, 'AB', 'now()')
  `);

  await connection.close;
}

create().then(() => console.log('Admin account seeded'));
