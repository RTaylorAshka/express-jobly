const { sqlForPartialUpdate, sqlForFiltering } = require("./sql")

const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
};

describe("sqlForPartialUpdate", function () {
    test("Converts data to sql", function () {

        const sql = sqlForPartialUpdate({
            firstName: "Test",
            lastName: "McTest",
            isAdmin: false
        }, jsToSql)
        expect(sql.setCols).toEqual('"first_name"=$1, "last_name"=$2, "is_admin"=$3')
        expect(sql.values).toEqual(["Test", "McTest", false])

    })

    test("Throws error with empty data", function () {
        try {
            sqlForPartialUpdate({}, jsToSql)
            expect(true).toEqual(false)
        } catch {
            expect(true).toEqual(true)
        }
    })
})

describe("sqlForFiltering", function () {
    test("Converts data to sql", function () {

        const sql = sqlForFiltering({
            minEmployees: 50,
            name: "john"
        })
        expect(sql).toEqual("WHERE num_employees > 50 AND name ILIKE '%john%'")


    })

    test("Throws error when max greater than min", function () {
        try {
            sqlForPartialUpdate({ minEmployees: 200, maxEmployees: 3 })
            expect(true).toEqual(false)
        } catch {
            expect(true).toEqual(true)
        }
    })
})