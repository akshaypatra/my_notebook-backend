const connectToMongo=require('./db');
connectToMongo();


const express = require('express')
const app = express()
const port = 4000;


app.use(express.json());

//Available routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening  at http://localhost:${port}`)
})
