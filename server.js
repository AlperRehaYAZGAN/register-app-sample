// A simple user registration web applciation.
// With postgresql db knex adapter and express as a framework.


const express = require('express');
const app = express();
const knex = require("knex");

const db = knex({
    client: 'pg',
    connection: {
        // filename: process.cwd() +"/data/db.sq3",
        connectionString: process.env.PG_CONNECTION_STRING // postgres://alyafnuser:alyafnuserpassword@localhost:5432/alyagofndev
    }
});


const tableName = "users_test";
async function initDatabase() {
    await db.schema.hasTable(tableName).then(exists => {
        if (!exists) {
            db.schema.createTable(tableName, table => {
                table.increments('id').primary();
                table.string('name');
                table.string('email');
                table.string('password');
            }).then(() => {
                console.log("Table users created");
            }).catch(err => {
                console.log(err);
            });
        }
    });
}
initDatabase();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/register', (req, res) => {
    return res.sendFile(process.cwd() + '/public/register.html');
});

app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;

    console.log(name, email, password);

    try {
        const user = await db(tableName).insert({ name, email, password });

        const allUser = await db(tableName).select();
        res.json({
            success: true,
            user: user,
            allUser: allUser
        }); 
    } catch (error) {
        console.log(error);
        res.status(500).send(error);        
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log('Server is running on port http://localhost:3000');
});

