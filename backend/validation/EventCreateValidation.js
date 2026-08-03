import { isEmpty } from './isEmpty.js'
import validator from 'validator'

const EventcreateValidation = (DATA) => {
    const errors = {}

    DATA.title = !isEmpty(DATA.title) ? DATA.title : ''
    DATA.desc = !isEmpty(DATA.desc) ? DATA.desc : ''
    DATA.loca = !isEmpty(DATA.loca) ? DATA.loca : ''
    DATA.faculty = !isEmpty(DATA.faculty) ? DATA.faculty : ''


    if (validator.isEmpty(DATA.title)) {
        errors.title = 'Email field is required'
    }
    if (!validator.isLength(DATA.title, { min: 4, max: 200 })) {
        errors.lengthtitle = 'Title should be between 4 and 200 charecter'
    }
    if (validator.isEmpty(DATA.desc)) {
        errors.desc = 'desc field is required'
    }
    if (!validator.isLength(DATA.desc, { min: 5, max: 10000 })) {
        errors.lengthdesc = 'Title should be between 10 and 10000 charecter'
    }
    if (validator.isEmpty(DATA.loca)) {
        errors.loca = 'loca field is required'
    }
    if (validator.isEmpty(DATA.faculty)) {
        errors.faculty = 'faculty field is required'
    }

    return {
        errors,
        valid: 'successfull',
        isValid: isEmpty(errors)
    }
}


export default EventcreateValidation;