import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

let { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;

const sql = postgres({
  host: PGHOST,
  database: PGDATABASE,
  username: PGUSER,
  password: PGPASSWORD,
  port: 5432,
  ssl: 'require',
  connection: {
    options: `project=${ENDPOINT_ID}`,
  },
});

async function getPgVersion() {
  const result = await sql`select version()`;
  console.log(result);
}

getPgVersion();
const app = express();
const PORT =  5000;

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", async (req, res) => {
    try {
        const result = await sql`SELECT * FROM todo`;
        console.log(result);
        res.status(200).json(result.map(row => row.task));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/form", async (req, res) => {
    const name = req.body.name;
    try {
        await sql`INSERT INTO todo (task) VALUES (${name})`;
        res.status(200).json({ name });
    } catch (error) {
        console.error('Error inserting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/delete", async (req, res) => {
    const name = req.body.name;
    try {
        await sql`DELETE FROM todo WHERE task = ${name}`;
        res.status(200).json({ name });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
