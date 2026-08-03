import { isEmpty } from './isEmpty.js'
import validator from  'validator'

const EventValidation = (DATA) => {
    const errors = {}
    
    DATA.name = !isEmpty(DATA.name) ? DATA.name :''
    DATA.email = !isEmpty(DATA.email) ? DATA.email :''
    DATA.eventname = !isEmpty(DATA.eventname) ? DATA.eventname :''
    DATA.branchname = !isEmpty(DATA.branchname) ? DATA.branchname :''
    

    if(!validator.isEmail(DATA.email)){
        errors.email2 = 'Enter an valid email ID '
    }
    if(validator.isEmpty(DATA.email)){
        errors.email1 = 'Email field is required'
    }
    if(validator.isEmpty(DATA.name)){
        errors.name = 'Title field is required'
    }
    if(validator.isEmpty(DATA.eventname)){
        errors.eventname = 'eventname field is required'
    }
    if(validator.isEmpty(DATA.branchname)){
        errors.branchname = 'branchname field is required'
    }

    return {
        errors,
        valid : 'successfull',
        isValid : isEmpty(errors)
    }
}


export default EventValidation;