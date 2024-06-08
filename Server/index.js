import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pg from 'pg';

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "ToDo",
    password: "importjava.UTIL.*",
    port: 5432,
  });


const app = express();
const PORT = process.env.PORT || 5000;

db.connect();

app.use(cors());
app.use(bodyParser.json());

app.get("/tasks", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM todo");
        res.status(200).json(result.rows.map(row => row.task));
    } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post("/form",async(req,res)=>{
    const name=req.body.name;
    await db.query("Insert into todo(task) values ($1)",[name]);
    res.status(200).json({name});
})

app.post("/delete", async (req, res) => {
    const name = req.body.name;
    await db.query("DELETE FROM todo WHERE task = $1", [name]);
    res.status(200).json({ name });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  