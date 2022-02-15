import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host?: string): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(connectionOptions, {
      host: host ?? 'db_postgres',
    }),
  );
};
