import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = 'db_postgres'): Promise<Connection> => {
  const connectionOptions = await getConnectionOptions();
  return createConnection(
    Object.assign(connectionOptions, {
      host: process.env.NODE_ENV === 'test' ? 'localhost' : host,
      database:
        process.env.NODE_ENV === 'test'
          ? 'dev_rentalx'
          : connectionOptions.database,
    }),
  );
};
