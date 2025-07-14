const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors');

// Crear servidor
const app = express();

// Conectar db
conectarDB();
app.use(cors());

app.use(express.json());

app.use('/api/pacientes', require('./routes/paciente'));

app.listen(4000, ()=>{
    console.log('El servidor esta corriendo');
})