const { BadRequestError } = require("../expressError");

/** Writes sql for a partial update.
  *
  * Property 'dataToUpdate' contains object of property names and their new values that are being assigned.
  * 
  * The object keys in 'dataToUpdate' are written like javascript variables and do not match the names of their respective database collums,
  * 'jsToSql' is an object acting as reference for what each collum's name is in the actual sql table:
  *   {firstName : 'first_name'}
  * 
  * Returns and object with the sql to be added to the query and an array containing the values.
  */

function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
