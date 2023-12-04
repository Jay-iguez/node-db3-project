const Schemes = require('../schemes/scheme-model')

/*
  If `scheme_id` does not exist in the database:

  status 404
  {
    "message": "scheme with scheme_id <actual id> not found"
  }
*/
const checkSchemeId = async (req, res, next) => {
  const { scheme_id } = req.params

  const schemes = await Schemes.find()
  let is_found = false

  for (let i = 0; i < schemes.length; i++) {
    if (schemes[i].scheme_id === parseInt(scheme_id)) {
      is_found = true
      break
    }
  }

  if (is_found) {
    next()
  } else {
    const error = Schemes.create_error(404, `scheme with scheme_id ${scheme_id} not found`)
    next(error)
  }

}

/*
  If `scheme_name` is missing, empty string or not a string:

  status 400
  {
    "message": "invalid scheme_name"
  }
*/
const validateScheme = (req, res, next) => {

}

/*
  If `instructions` is missing, empty string or not a string, or
  if `step_number` is not a number or is smaller than one:

  status 400
  {
    "message": "invalid step"
  }
*/
const validateStep = (req, res, next) => {

}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
