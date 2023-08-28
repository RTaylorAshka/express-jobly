"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
    commonBeforeAll,
    commonBeforeEach,
    commonAfterEach,
    commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** create */

describe("create", function () {
    const newJob = {

        title: "new",
        salary: 130000,
        equity: 0.03,
        companyHandle: "c3"

    };

    test("works", async function () {
        await Job.create(newJob);

        const result = await db.query(
            `SELECT 
                title,
                salary,
                equity,
                company_handle AS "companyHandle"
           FROM jobs
           WHERE title = 'new'`);
        expect(result.rows[0]).toEqual(
            {
                title: "new",
                salary: 130000,
                equity: "0.03",
                companyHandle: "c3"

            },
        );
    });

});

/************************************** findAll */

describe("findAll", function () {
    test("works: no filter", async function () {
        let jobs = await Job.findAll();
        expect(jobs).toEqual([
            {
                id: 123,
                title: "j1",
                salary: 110000,
                equity: "0",
                companyHandle: "c1"
            },
            {
                id: 456,
                title: "j2",
                salary: 120000,
                equity: "0.02",
                companyHandle: "c2"
            }

        ]);
    });

    test("works: with filter", async function () {
        const filter = { minSalary: '105000', hasEquity: 'true', pineapple: 'true' }
        let jobs = await Job.findAll(filter);
        expect(jobs).toEqual([
            {
                id: 456,
                title: "j2",
                salary: 120000,
                equity: "0.02",
                companyHandle: "c2"
            },
        ]);
    });
});

/************************************** get */

describe("get", function () {
    test("works", async function () {
        let job = await Job.get('456');
        expect(job).toEqual({
            id: 456,
            title: "j2",
            salary: 120000,
            equity: "0.02",
            companyHandle: "c2"
        });
    });

    test("not found if no such job", async function () {
        try {
            await Job.get("846876");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});

/************************************** update */

describe("update", function () {
    const updateData = {

        title: "updated",
        salary: 130000,
        equity: "0.03"

    };

    test("works", async function () {
        let job = await Job.update("123", updateData);
        expect(job).toEqual({
            id: 123,
            ...updateData,
            companyHandle: "c1"
        });

        const result = await db.query(
            `SELECT title, salary, equity FROM jobs
           WHERE id = '123'`);
        expect(result.rows).toEqual([{
            ...updateData,
        }]);
    });

    test("works: null fields", async function () {
        const updateDataSetNulls = {

            title: "updated",
            salary: null,
            equity: null

        };

        let job = await Job.update("123", updateDataSetNulls);
        expect(job).toEqual({
            id: 123,
            ...updateDataSetNulls,
            companyHandle: "c1"
        });

        const result = await db.query(
            `SELECT title, salary, equity FROM jobs
           WHERE id = '123'`);
        expect(result.rows).toEqual([{
            ...updateDataSetNulls,
        }]);
    });

    test("not found if no such job", async function () {
        try {
            await Job.update("876134", updateData);
            fail();
        } catch (err) {
            console.log("ERROR: ", err)
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });

    test("bad request with no data", async function () {
        try {
            await Job.update("123", {});
            fail();
        } catch (err) {
            expect(err instanceof BadRequestError).toBeTruthy();
        }
    });
});

/************************************** remove */

describe("remove", function () {
    test("works", async function () {
        await Job.remove("123");
        const res = await db.query(
            "SELECT id FROM jobs WHERE id='123'");
        expect(res.rows.length).toEqual(0);
    });

    test("not found if no such job", async function () {
        try {
            await Job.remove("4354834");
            fail();
        } catch (err) {
            expect(err instanceof NotFoundError).toBeTruthy();
        }
    });
});
