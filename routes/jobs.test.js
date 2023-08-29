"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
    u1Token,
    u2Token
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /jobs */

describe("POST /jobs", function () {
    const newJob = {

        title: "new",
        salary: 130000,
        equity: 0.03,
        companyHandle: "c3"

    };

    test("ok for Admin users", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(201);
        expect('title' in resp.body.job).toEqual(true);
    });

    test("error for non-Admin users", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send(newJob)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("bad request with missing data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                title: "new",
                salary: 130000,
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request with invalid data", async function () {
        const resp = await request(app)
            .post("/jobs")
            .send({
                title: "new",
                salary: "pineapple",
                equity: 0.03,
                companyHandle: "c3"
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** GET /jobs */

describe("GET /jobs", function () {
    test("ok for anon", async function () {
        const resp = await request(app).get("/jobs");
        expect(resp.body.jobs.length).toEqual(2);

    });

    test("fails: test next() handler", async function () {

        await db.query("DROP TABLE companies CASCADE");
        const resp = await request(app)
            .get("/companies")
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(500);
    });
});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
    test("works for anon", async function () {
        const resp = await request(app).get(`/jobs/123`);
        expect(resp.body).toEqual({
            job: {
                id: 123,
                title: "j1",
                salary: 110000,
                equity: "0",
                companyHandle: "c1"
            },
        });
    });


    test("not found for no such job", async function () {
        const resp = await request(app).get(`/jobs/6484654`);
        expect(resp.statusCode).toEqual(404);
    });
});

/************************************** PATCH /jobs/:is */

describe("PATCH /jobs/:id", function () {
    test("works for Admin users", async function () {
        const resp = await request(app)
            .patch(`/jobs/123`)
            .send({
                title: "j1-new",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({
            job: {
                id: 123,
                title: "j1-new",
                salary: 110000,
                equity: "0",
                companyHandle: "c1"
            },
        });
    });

    test("error for non-Admin users", async function () {
        const resp = await request(app)
            .patch(`/jobs/123`)
            .send({
                title: "j1-new",
            })
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .patch(`/jobs/123`)
            .send({
                title: "j1-new",
            })
        expect(resp.statusCode).toEqual(401);
    });

    test("not found on no such job", async function () {
        const resp = await request(app)
            .patch(`/job/34843`)
            .send({
                title: "new nope",
            })
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });

    test("bad request on id change attempt", async function () {
        const resp = await request(app)
            .patch(`/jobs/123`)
            .send({
                id: 8764,
            })
            .set("authorization", `Bearer ${u1Token}`);
        console.log(resp.body);
        expect(resp.statusCode).toEqual(400);
    });

    test("bad request on invalid data", async function () {
        const resp = await request(app)
            .patch(`/jobs/123`)
            .send({
                salary: "50k",
            })
            .set("authorization", `Bearer ${u1Token}`);

        expect(resp.statusCode).toEqual(400);
    });
});

/************************************** DELETE /jobs/:id */

describe("DELETE /jobs/:id", function () {
    test("works for Admin users", async function () {
        const resp = await request(app)
            .delete(`/jobs/123`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.body).toEqual({ deleted: "123" });
    });

    test("error for non-Admin users", async function () {
        const resp = await request(app)
            .delete(`/jobs/123`)
            .set("authorization", `Bearer ${u2Token}`);
        expect(resp.statusCode).toEqual(401);
    });

    test("unauth for anon", async function () {
        const resp = await request(app)
            .delete(`/jobs/123`);
        expect(resp.statusCode).toEqual(401);
    });

    test("not found for no such job", async function () {
        const resp = await request(app)
            .delete(`/jobs/5646846`)
            .set("authorization", `Bearer ${u1Token}`);
        expect(resp.statusCode).toEqual(404);
    });
});
