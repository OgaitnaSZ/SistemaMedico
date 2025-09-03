const express = require('express');
const conectarDB = require('./config/db')
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
const openApiConfiguration = require('./docs/swagger');

// Crear servidor
const app = express();

// Ejecutar servidor en dev o prod
const NODE_ENV = process.env.NODE_ENV || 'development';

// Conectar db
conectarDB();

app.use(cors());
app.use(express.json());

/**
 * Documentacion de rutas
 */
app.use('/documentation', 
    swaggerUI.serve,
    swaggerUI.setup(openApiConfiguration)
)


// Rutas
app.use('/api/pacientes', require('./routes/paciente'));
app.use('/api/usuarios', require('./routes/usuario'));
app.use('/api/consultas', require('./routes/consulta'));
app.use('/api/archivos', require('./routes/archivo'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Correr el servidor
const port = 4000;
if(NODE_ENV !== 'test') app.listen(port);


// Importar app para fines de testing
module.exports = app