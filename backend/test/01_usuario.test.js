const request = require("supertest");
const app = require("../index");
const mongoose = require("mongoose");
let JWT_TOKEN = "";
const { usuarioLogin, usuarioUpdate } = require("./helper/helperData");

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    //await Usuario.deleteMany();
    
    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioLogin);
    
    JWT_TOKEN = response.body.data.token;
})

describe("[AUTH] esta es la prueba de /api/usuarios/login", ()=>{
    // Password erronea
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send({ ...usuarioLogin , password: "111111111"});

        expect(response.statusCode).toEqual(400);
    })

    // Usuario correcto
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioLogin);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("data.token");
        expect(response.body).toHaveProperty("data.user");
    })

    // Usuario no existe
    test("Esto deberia retornar 404", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send({ ...usuarioLogin, usuario: "testing"});

        expect(response.statusCode).toEqual(404);
    })
})

describe("[AUTH] esta es la prueba de /api/usuarios/actualizar", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .put('/api/usuarios/actualizar')
        .send(usuarioUpdate);

        expect(response.statusCode).toEqual(401);
    })


    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .put('/api/usuarios/actualizar')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(usuarioUpdate);

        expect(response.statusCode).toEqual(200);
    })

    // Prueba con usuario incorrecto
    test("Esto deberia retornar 404", async ()=>{
        const response = await request(app)
        .put('/api/usuarios/actualizar')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send({ ...usuarioUpdate, usuario: "test" });

        expect(response.statusCode).toEqual(404);
    })

    // Password erronea
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .put('/api/usuarios/actualizar')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send({ ...usuarioUpdate, password: "test"});

        expect(response.statusCode).toEqual(400);
    })
})

afterAll(()=>{
    mongoose.connection.close()
})
