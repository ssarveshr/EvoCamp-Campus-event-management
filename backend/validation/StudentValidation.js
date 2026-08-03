import { isEmpty } from './isEmpty.js'
import validator from  'validator'

const ValidateStudentData = (DATA) => {
    const errors = {}
    const subdata = DATA.RoleData
    
    DATA.email = !isEmpty(DATA.email) ? DATA.email :''
    DATA.role = !isEmpty(DATA.role) ? DATA.role :''
    DATA.password = !isEmpty(DATA.password) ? DATA.password :''
    if(DATA.role === 'student'){
        subdata.name = !isEmpty(subdata.name) ? subdata.name :''
        if(validator.isEmpty(subdata.name)){
            errors.subdata.name = 'name field is required'
        }
        if(subdata.name === null){
            errors.subdata.name = 'name field should not be null'
        }
    }else if(DATA.role === 'organiser'){
        subdata.orgname = !isEmpty(subdata.orgname) ? subdata.orgname :''
        if(validator.isEmpty(subdata.orgname)){
            errors.subdata.orgname = 'orgname field is required'
        }
        if(subdata.orgname === null){
            errors.subdata.orgname = 'orgname field should not be null'
        }
    }

    if(!validator.isEmail(DATA.email)){
        errors.email2 = 'Enter an valid email ID '
    }
    if(!validator.isLength(DATA.password,{min : 2 , max : 30})){
        errors.passwordlength = 'Password must be between 2 and 15 only'
    }
    if(validator.isEmpty(DATA.email)){
        errors.email1 = 'Email field is required'
    }
    if(validator.isEmpty(DATA.password)){
        errors.password = 'Password field is required'
    }
    if(validator.isEmpty(DATA.role)){
        errors.role = 'role field is required'
    }

    
    return {
        errors,
        isValid : isEmpty(errors)
    }
}


export default ValidateStudentData;