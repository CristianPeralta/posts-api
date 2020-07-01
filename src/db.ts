import { Pool } from 'pg';

const pool: Pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "mydb",
    password: '123456',
    port: 5432
});

export default pool;