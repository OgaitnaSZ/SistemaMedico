const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../index");
const Turno = require("../models/Turno");
const Paciente = require("../models/Paciente");
let JWT_TOKEN = "";
const { usuarioLogin, pacienteDePrueba } = require("./helper/helperData");

const newPaciente = () => ({ ...pacienteDePrueba, dni: "99887766" });

const turnoDePrueba = {
    fecha: "2026-10-20",
    hora: "10:30",
    estado: "Pendiente",
    motivo: "Control de rutina",
    notas: "Traer análisis previos"
};

let pacienteCreado;
let turnoCreado;

beforeAll(async () => {
    await Turno.deleteMany();
    await Paciente.deleteMany();

    const response = await request(app)
        .post('/api/usuarios/login')
        .send(usuarioLogin);

    JWT_TOKEN = response.body.data.token;

    // Crear paciente de prueba
    const pacienteRes = await request(app)
        .post("/api/pacientes/Crear")
        .set("Authorization", `Bearer ${JWT_TOKEN}`)
        .send(newPaciente());

    pacienteCreado = pacienteRes.body.paciente;
});

// Crear Turno
describe("[Turno] POST /api/turnos/Crear", () => {
    test("Debería retornar 401 si no hay token", async () => {
        const res = await request(app)
            .post('/api/turnos/Crear')
            .send({ ...turnoDePrueba, idPaciente: pacienteCreado._id });

        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 403 si faltan campos obligatorios", async () => {
        const res = await request(app)
            .post('/api/turnos/Crear')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({ hora: "10:30" }); // Faltan idPaciente y fecha

        expect(res.statusCode).toEqual(403);
    });

    test("Debería retornar 404 si el paciente no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .post('/api/turnos/Crear')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({ ...turnoDePrueba, idPaciente: fakeId.toString() });

        expect(res.statusCode).toEqual(404);
    });

    test("Debería retornar 201 y crear el turno", async () => {
        const res = await request(app)
            .post('/api/turnos/Crear')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({ ...turnoDePrueba, idPaciente: pacienteCreado._id });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty("turno");
        expect(res.body.turno.hora).toEqual("10:30");
        expect(res.body.turno.idPaciente).toHaveProperty("nombre");

        turnoCreado = res.body.turno;
    });

    test("Debería retornar 400 por turno superpuesto en misma fecha y hora", async () => {
        const res = await request(app)
            .post('/api/turnos/Crear')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({ ...turnoDePrueba, idPaciente: pacienteCreado._id });

        expect(res.statusCode).toEqual(400);
        expect(res.body.error).toContain("Ya existe un turno programado");
    });
});

// Obtener Turnos
describe("[Turno] GET /api/turnos/Turnos", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app).get('/api/turnos/Turnos');
        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 y listar los turnos del médico", async () => {
        const res = await request(app)
            .get('/api/turnos/Turnos')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("turnos");
        expect(Array.isArray(res.body.turnos)).toBe(true);
        expect(res.body.turnos.length).toBeGreaterThan(0);
        expect(res.body.turnos[0]).toHaveProperty("idPaciente");
        expect(res.body.turnos[0].idPaciente).toHaveProperty("nombre");
    });

    test("Debería filtrar turnos por fecha", async () => {
        const res = await request(app)
            .get('/api/turnos/Turnos?fecha=2026-10-20')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.turnos.length).toBeGreaterThan(0);
    });
});

// Obtener Próximo Turno
describe("[Turno] GET /api/turnos/Proximo", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app).get('/api/turnos/Proximo');
        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 y el próximo turno del médico", async () => {
        const res = await request(app)
            .get('/api/turnos/Proximo')
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty("turno");
        expect(res.body.turno).not.toBeNull();
        expect(res.body.turno._id).toEqual(turnoCreado._id);
    });
});

// Obtener Turno por ID
describe("[Turno] GET /api/turnos/Turno/:id", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app).get(`/api/turnos/Turno/${turnoCreado._id}`);
        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 con los datos del turno", async () => {
        const res = await request(app)
            .get(`/api/turnos/Turno/${turnoCreado._id}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body._id).toEqual(turnoCreado._id);
        expect(res.body.motivo).toEqual("Control de rutina");
    });

    test("Debería retornar 404 si el turno no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .get(`/api/turnos/Turno/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(404);
    });
});

// Actualizar Turno
describe("[Turno] PUT /api/turnos/Actualizar", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app)
            .put('/api/turnos/Actualizar')
            .send({ ...turnoCreado, motivo: "Control cardiológico" });

        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 y actualizar el turno", async () => {
        const res = await request(app)
            .put('/api/turnos/Actualizar')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({
                ...turnoCreado,
                idPaciente: pacienteCreado._id,
                motivo: "Control cardiológico actualizado",
                estado: "Confirmado"
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.turnoActualizado.motivo).toEqual("Control cardiológico actualizado");
        expect(res.body.turnoActualizado.estado).toEqual("Confirmado");
    });

    test("Debería retornar 404 si el turno no existe", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .put('/api/turnos/Actualizar')
            .set("Authorization", `Bearer ${JWT_TOKEN}`)
            .send({
                ...turnoCreado,
                _id: fakeId.toString(),
                idPaciente: pacienteCreado._id
            });

        expect(res.statusCode).toEqual(404);
    });
});

// Cancelar Turno
describe("[Turno] PUT /api/turnos/Cancelar/:id", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app).put(`/api/turnos/Cancelar/${turnoCreado._id}`);
        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 y cambiar estado a Cancelado", async () => {
        const res = await request(app)
            .put(`/api/turnos/Cancelar/${turnoCreado._id}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.turno.estado).toEqual("Cancelado");
    });
});

// Eliminar Turno
describe("[Turno] DELETE /api/turnos/Eliminar/:id", () => {
    test("Debería retornar 401 sin sesión", async () => {
        const res = await request(app).delete(`/api/turnos/Eliminar/${turnoCreado._id}`);
        expect(res.statusCode).toEqual(401);
    });

    test("Debería retornar 200 y eliminar el turno", async () => {
        const res = await request(app)
            .delete(`/api/turnos/Eliminar/${turnoCreado._id}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(200);
        expect(res.body.success).toBe(true);

        const check = await Turno.findById(turnoCreado._id);
        expect(check).toBeNull();
    });

    test("Debería retornar 404 al intentar eliminar turno inexistente", async () => {
        const fakeId = new mongoose.Types.ObjectId();
        const res = await request(app)
            .delete(`/api/turnos/Eliminar/${fakeId}`)
            .set("Authorization", `Bearer ${JWT_TOKEN}`);

        expect(res.statusCode).toEqual(404);
    });
});

afterAll(async () => {
    await Turno.deleteMany();
    await Paciente.deleteMany();
    await mongoose.connection.close();
});
