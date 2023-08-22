const { sqlForPartialUpdate } = require("./sql")

const jsToSql = {
    firstName: "first_name",
    lastName: "last_name",
    isAdmin: "is_admin"
};


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