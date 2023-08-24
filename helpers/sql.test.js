const { sqlForPartialUpdate, sqlForFiltering } = require("./sql")

const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
};

const queryRef = {
    firstName: {
        typeValidator: (d) => { return typeof d == 'string' },
        sqlComparitor: (d) => { return `first_name ILIKE '%${d}%'` },
        expectedErr: "expected string from name parameter"

    },
    minAge: {
        typeValidator: (d) => { return !isNaN(d) },
        sqlComparitor: (d) => { return `age >= ${d}` },
        expectedErr: "expecter number from age parameter"

    },
    maxAge: {
        typeValidator: (d) => { return !isNaN(d) },
        sqlComparitor: (d) => { return `age >= ${d}` },
        expectedErr: "expecter number from age parameter"

    }
}

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
            minAge: 23,
            firstName: "john"
        }, queryRef)
        expect(sql).toEqual("WHERE first_name ILIKE '%john%' AND age >= 23")


    })

    test("Throws error when max greater than min", function () {
        try {
            sqlForFiltering({
                minAge: 60,
                firstName: "john",
                maxAge: 2
            }, queryRef)

            expect(true).toEqual(false)
        } catch {
            expect(true).toEqual(true)
        }
    })
})