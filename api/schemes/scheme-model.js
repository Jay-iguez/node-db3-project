const db = require('../../data/db-config')

const create_error = (status, msg) => {
  const error = new Error(msg)
  error.status = status
  return error
}

const is_type_of = (value, type) => {
  return typeof value === type ? true : false
}

async function find() { // EXERCISE A

  const rows = await db('schemes as sc')
    .select('sc.*')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')

  return rows
  /*
    1A- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`.
    What happens if we change from a LEFT join to an INNER join?

      SELECT
          sc.*,
          count(st.step_id) as number_of_steps
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      GROUP BY sc.scheme_id
      ORDER BY sc.scheme_id ASC;

    2A- When you have a grasp on the query go ahead and build it in Knex.
    Return from this function the resulting dataset.
  */
}

async function findById(scheme_id) { // EXERCISE B

  const row_by_id = await db('schemes as sc')
    .select('sc.scheme_id', 'sc.scheme_name', 'st.*')
    .leftJoin('steps as st', 'sc.scheme_id', '=', 'st.scheme_id')
    .where('sc.scheme_id', scheme_id)
    .orderBy('st.step_number')

  const row_formatted_result = {
    scheme_id: row_by_id[0].scheme_id || parseInt(scheme_id),
    scheme_name: row_by_id[0].scheme_name,
    steps: []
  }

  if (row_by_id[0].step_id === null) {
    return row_formatted_result
  }

  row_formatted_result.steps = row_by_id.map(step => {
    return {
      step_id: step.step_id,
      step_number: step.step_number,
      instructions: step.instructions
    }
  })

  return row_formatted_result
  /**
   * 
   * 
   */


  /*
    1B- Study the SQL query below running it in SQLite Studio against `data/schemes.db3`:

      SELECT
          sc.scheme_name,
          st.*
      FROM schemes as sc
      LEFT JOIN steps as st
          ON sc.scheme_id = st.scheme_id
      WHERE sc.scheme_id = 1
      ORDER BY st.step_number ASC;

    2B- When you have a grasp on the query go ahead and build it in Knex
    making it parametric: instead of a literal `1` you should use `scheme_id`.

    3B- Test in Postman and see that the resulting data does not look like a scheme,
    but more like an array of steps each including scheme information:

      [
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 2,
          "step_number": 1,
          "instructions": "solve prime number theory"
        },
        {
          "scheme_id": 1,
          "scheme_name": "World Domination",
          "step_id": 1,
          "step_number": 2,
          "instructions": "crack cyber security"
        },
        // etc
      ]

    4B- Using the array obtained and vanilla JavaScript, create an object with
    the structure below, for the case _when steps exist_ for a given `scheme_id`:

     

    5B- This is what the result should look like _if there are no steps_ for a `scheme_id`:

      {
        "scheme_id": 7,
        "scheme_name": "Have Fun!",
        "steps": []
      }
  */
}

async function findSteps(scheme_id) { // EXERCISE C

  const rows = await db('schemes as s')
    .select('step_id', 'step_number', 'instructions', 'scheme_name')
    .join('steps as st', 's.scheme_id', '=', 'st.scheme_id')
    .orderBy('step_number')
    .where('s.scheme_id', scheme_id)

  return rows

  /*
    1C- Build a query in Knex that returns the following data.
    The steps should be sorted by step_number, and the array
    should be empty if there are no steps for the scheme:

      [
        {
          "step_id": 5,
          "step_number": 1,
          "instructions": "collect all the sheep in Scotland",
          "scheme_name": "Get Rich Quick"
        },
        {
          "step_id": 4,
          "step_number": 2,
          "instructions": "profit",
          "scheme_name": "Get Rich Quick"
        }
      ]
  */
}

async function add(scheme) { // EXERCISE D
  const [id] = await db('schemes').insert(scheme)

  const newScheme = await findById(id)

  return newScheme

  /*
    1D- This function creates a new scheme and resolves to _the newly created scheme_.
  */
}

async function addStep(scheme_id, step) { // EXERCISE E

  console.log('what;', step)
  const body = {
    scheme_id: scheme_id,
    step_number: step.step_number,
    instructions: step.instructions
  }
  console.log(body)

  await db('steps').insert(body)

  const steps = await findSteps(scheme_id)

  return steps

  /*
    1E- This function adds a step to the scheme with the given `scheme_id`
    and resolves to _all the steps_ belonging to the given `scheme_id`,
    including the newly created one.
  */
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  create_error,
  is_type_of
}
