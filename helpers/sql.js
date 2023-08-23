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




function sqlForFiltering(filterData) {

  if (filterData) {

    const acceptedSearch = ['name', 'minEmployees', 'maxEmployees'];
    const keys = Object.keys(filterData).filter((k) => acceptedSearch.includes(k));

    if (filterData.maxEmployees && filterData.minEmployees) {
      if (filterData.maxEmployees < filterData.minEmployees)
        throw new BadRequestError('Min search value cannot be greater than max.')
    }

    if (keys.length != 0) {
      const filters = keys.map((q) => {
        if (q == "name") {
          return `name ILIKE '%${filterData.name}%'`;
        }
        if (q == "minEmployees") {
          return `num_employees > ${filterData.minEmployees}`;
        }
        if (q == "maxEmployees") {

          return `num_employees < ${filterData.maxEmployees}`;
        }

      })

      console.log(filters);

      return `WHERE ${filters.join(' AND ')}`;

    }
  }

  return " ";



}

module.exports = { sqlForPartialUpdate, sqlForFiltering };


