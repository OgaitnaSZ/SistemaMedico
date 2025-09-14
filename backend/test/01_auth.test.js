const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
const { usuarioPasswordErronea, usuarioCorrecto } = require("./helper/helperData");

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    //await Usuario.deleteMany();
})

describe("[AUTH] esta es la prueba de /api/usuarios/login", ()=>{
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioPasswordErronea);

        expect(response.statusCode).toEqual(400);
    })

    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioCorrecto);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("data.token");
        expect(response.body).toHaveProperty("data.user");
    })
})

afterAll(()=>{
    mongoose.connection.close()
})
