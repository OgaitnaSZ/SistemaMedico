const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Consulta = require("../models/Consulta");
let JWT_TOKEN = "";
const { usuarioCorrecto, pacienteDePrueba, consultaDePrueba } = require("./helper/helperData");

const newPaciente = () => ({ ...pacienteDePrueba });
const newConsulta = () => ({ ...consultaDePrueba });

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await Consulta.deleteMany();

    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioCorrecto);
    
    JWT_TOKEN = response.body.data.token;
})

// Crear consulta
describe("[Consulta] esta es la prueba de /api/consultas/Crear", ()=>{
    let pacienteCreado;
    let consultaCreada
    
    beforeAll(async () => {
        const res = await request(app)
        .post("/api/pacientes/Crear")
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(newPaciente());
        pacienteCreado = res.body.paciente;
        consultaCreada = { ...newConsulta(), idPaciente: pacienteCreado._id };
    });

    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .post('/api/consultas/Crear')
        .send(consultaCreada);

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/consultas/Crear')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(consultaCreada);

        const { body } = response;
        expect(response.statusCode).toEqual(201);
        expect(body).toHaveProperty("consulta");
    })
})

// Actualizar consulta
describe("[Consulta] esta es la prueba de /api/consultas/Actualizar", ()=>{
    let pacienteCreado;
    let consultaCreada;

    beforeAll(async () => {
        const pacienteRes = await request(app)
            .post("/api/pacientes/Crear")
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send(newPaciente());
        pacienteCreado = pacienteRes.body.paciente;

        const consultaRes = await request(app)
            .post("/api/consultas/Crear")
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({ ...newConsulta(), idPaciente: pacienteCreado._id });

        consultaCreada = consultaRes.body.consulta;
    });

    // Prueba con login y consulta existente
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .put('/api/consultas/Actualizar')
        .send({ ...consultaCreada, motivoConsulta: "Dolor de cuello" })
        .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(response.statusCode).toEqual(200);
        expect(response.body.consultaActualizada.motivoConsulta).toEqual("Dolor de cuello");
        expect(response.body.consultaActualizada._id).toEqual(consultaCreada._id);
    })

    // Prueba con consulta inexistente
    test("Esto deberia retornar 404", async ()=>{
        const fakeId = new mongoose.Types.ObjectId(); // MongoID aleatorio
        
        const response = await request(app)
        .put('/api/consultas/Actualizar')
        .send({ ...consultaCreada, _id: fakeId.toString() })
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(404);
    })
})