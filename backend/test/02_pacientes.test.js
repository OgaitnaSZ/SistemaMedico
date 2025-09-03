const request = require("supertest");
const app = require("../index");
const Paciente = require("../models/Paciente");
const Usuario = require("../models/Usuario");
let JWT_TOKEN = "";
const { pacienteDePrueba, usuarioCorrecto } = require("./helper/helperData");


// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    await Paciente.deleteMany();

    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioCorrecto);
    
    JWT_TOKEN = response.body.data.token;
})

// Crear paciente
describe("[Paciente] esta es la prueba de /api/pacientes/Crear", ()=>{

    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .post('/api/pacientes/Crear')
        .send(pacienteDePrueba);

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 201", async ()=>{
        const response = await request(app)
        .post('/api/pacientes/Crear')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(pacienteDePrueba);

        const { body } = response;
        expect(response.statusCode).toEqual(201);
        expect(body).toHaveProperty("paciente");
    })
})

