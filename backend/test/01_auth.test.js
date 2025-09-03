const request = require("supertest");
const app = require("../index");

const testAuthLoginError = {
    "usuario": "admin",
    "password": "admin1"
}

const testAuthLoginCorrect = {
    "usuario": "admin",
    "password": "admin"
}

describe("[AUTH] esta es la prueba de /api/usuarios/login", ()=>{
    test("Esto deberia retornar 400", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send(testAuthLoginError);

        expect(response.statusCode).toEqual(200);
    })

    test("Esto deberia retornar 200", async ()=>{
        const response = await request(app)
        .post('/api/usuarios/login')
        .send(testAuthLoginCorrect);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toHaveProperty("data");
        expect(response.body).toHaveProperty("data.token");
        expect(response.body).toHaveProperty("data.user");
    })
})

