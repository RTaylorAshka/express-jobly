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


/** Create sql for filtering companies 
 * queryRef is an object passed by the model that is structured like so: {
 * 
 *  query_parameter_name: {
        typeValidator: (d) => { returns true if 'd' is correct data type or not undefined}, 
        sqlComparitor: (d) => { `collum_name SQL_COMPARITOR ${d}` },
        expectedErr: "typeValidator error message"
        

      }
 * }
* sqlForFiltering uses the query ref to 
*   - validate the data with typeValidator, 
*   - get the sql used to compare the data with sqlValidator
*   - throw an error if data type is not accepted
*  
* After collecting all the resulting strings of sqlComparitor into an array, they are joined together
* into a valid sql string. Said string is then returned to be injected into a sql query.
*/


function sqlForFiltering(queryData, queryRef) {
  if (queryData && queryRef) {

    if (Object.keys(queryData).length != 0) {

      let filters = [];
      let minMax = {};
      let params = Object.keys(queryRef)

      params.forEach((p) => {
        if (p in queryData) {
          let value = queryData[p];
          let refParam = queryRef[p];

          console.log(queryData[p])
          console.log(refParam.typeValidator(value))

          if (!(refParam.typeValidator(value)) && refParam.expectedErr) {
            throw new BadRequestError(refParam.expectedErr)
          }

          if (p.startsWith('min')) {
            minMax['min'] = Number(value);
          }

          if (p.startsWith('max')) {
            minMax['max'] = Number(value);
          }

          if (minMax['min'] && minMax['max']) {
            if (minMax['min'] > minMax['max']) {
              throw new BadRequestError('Min parameter cannot be greater than max.')
            }
          }

          filters.push(refParam.sqlComparitor(value))

        }
      })


      return `WHERE ${filters.join(' AND ')}`
    }


  }
  return " ";

}




module.exports = { sqlForPartialUpdate, sqlForFiltering };


