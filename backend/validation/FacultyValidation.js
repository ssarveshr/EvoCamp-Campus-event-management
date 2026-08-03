import { isEmpty } from './isEmpty.js'
import validator from  'validator'

const ValidateStudentData = (DATA) => {
    const errors = {}

    DATA.name = !isEmpty(DATA.name) ? DATA.name :''
    DATA.department = !isEmpty(DATA.department) ? DATA.department :''
    DATA.email = !isEmpty(DATA.email) ? DATA.email :''
    DATA.password = !isEmpty(DATA.password) ? DATA.password :''

    if(!validator.isEmail(DATA.email)){
        errors.email2 = 'Enter an valid email ID '
    }
    if(!validator.isLength(DATA.password,{min : 2 , max : 15})){
        errors.password = 'Password must be between 2 and 15 only'
    }
    if(!validator.isLength(DATA.department,{min : 3 , max : 4})){
        errors.department = 'Department code must be 3 characters long'
    }
    if(validator.isEmpty(DATA.name)){
        errors.name = 'Name field is required'
    }
    if(validator.isEmpty(DATA.email)){
        errors.email1 = 'Email field is required'
    }
    if(validator.isEmpty(DATA.password)){
        errors.password = 'Password field is required'
    }
    if(validator.isEmpty(DATA.department)){
        errors.department = 'Department field is required'
    }

    return {
        errors,
        isValid : isEmpty(errors)
    }
}


export default ValidateStudentData;