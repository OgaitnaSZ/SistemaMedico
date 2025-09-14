const request = require("supertest");
const app = require("../index");
let JWT_TOKEN = "";
const { usuarioLogin } = require("./helper/helperData");

// Se ejecuta antes de las pruebas
beforeAll(async ()=>{
    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioLogin);
    
    JWT_TOKEN = response.body.data.token;
})

describe("[AUTH] esta es la prueba de /api/dashboard", ()=>{
    // Prueba sin login
    test("Esto deberia retornar 401", async ()=>{
        const response = await request(app)
        .get('/api/dashboard/')

        expect(response.statusCode).toEqual(401);
    })

    // Prueba con login
    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .get('/api/dashboard/')
        .set("Authorization", `Bearer ${JWT_TOKEN}`)

        expect(response.statusCode).toEqual(200);
    })
})