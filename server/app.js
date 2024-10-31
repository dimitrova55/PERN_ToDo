import express from "express";
import cors from "cors";

import { db } from "./db.js";

const app = express();
const port = 5000;

// Connect to database
db.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Connection error', err.stack));

// Middleware
app.use(cors())
// app.use(express.urlencoded({extended: true}))
app.use(express.json())

/*
app.get('/', (req, res) => {
    res.status(200).json({messsage: 'TODO project'})
})
*/

// ROUTES

// create todo
app.post('/todos', async(req, res) => {

    if(!req.body.description) {
        // (422) -> Unprocessable Entity. 
        return res.status(422).json({error: 'Description is required!'});
    }

    try {        
        const insertTodo = await db.query({
            text:  `INSERT INTO todo (description) VALUES ($1) RETURNING *`,
            values: [req.body.description]
        });

        return res.status(201).json(insertTodo.rows)

    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

// get all todo
app.get('/todos', async(req, res) => {
    try {
        const data = await db.query(`SELECT * FROM todo`)

        if(data.rowCount <= 0) {
            return res.status(204).json({message: `No todos for today.`})
        }

        res.status(200).json(data.rows)
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

// get a todo
app.get('/todos/:id', async(req, res) => {

    const id = req.params.id

    try {
        const result = await db.query({
            text: `SELECT * FROM todo WHERE id = $1`,
            values: [id]
        })
        
        if(result.rowCount <= 0){
            return res.status(404).json({message: `Data not found.`})
        }
                
        return res.status(200).json(result.rows);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

// update a todo
app.put('/todos/:id', async(req, res) => {

    if(!req.body.description) {
        // (422) -> Unprocessable Entity. 
        return res.status(422).json({error: 'Description is required!'});
    }

    try {
        const result = await db.query({
            text: `
            UPDATE todo 
            SET description = $1 
            WHERE id = $2 
            RETURNING *`,
            values: [req.body.description, req.params.id]
        })

        return res.status(200).json(result.rows[0]);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

// delete a todo
app.delete('/todos/:id', async(req, res) => {
    try {
        const result = await db.query({
            text: `DELETE FROM todo WHERE id = $1`,
            values: [req.params.id]
        })

        if(result.rowCount <= 0)
            return res.status(409).json({error: "TODO not found."});

        return res.status(204).send("TODO deleted.");
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
})

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
})