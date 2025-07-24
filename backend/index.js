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
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/consultas', require('./routes/consulta'));
app.use('/api/archivo', require('./routes/archivo'));
app.use('/api/dashboard', require('./routes/dashboard'));

app.listen(4000, ()=>{
    console.log('El servidor esta corriendo');
})