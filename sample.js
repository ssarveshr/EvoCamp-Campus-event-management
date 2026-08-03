const array = []

const obj_1 = {
    "name": "samudra",
    "usn": "1RN23CS185"
}
const obj_2 = {
    "name": "sai",
    "usn": "1RN23CS178"
}
const obj_3 = {
    "name": "praveen",
    "usn": "1RN23CS152"
}
const obj_4 = {
    "name": "ranjitha",
    "usn": "1RN23CS167"
}

array.push(obj_1,obj_2,obj_3,obj_4)

console.log(array.some((item) => item.name === "samudra"))




















































// const a = {
//     'name':1,
//     'std':2,
//     'class':3
// }


// console.log(a.name)

// const a = []

// const obj = {
//     1 : '1',
//     2 : '2'
// }

// a.unshift(obj)
// a.unshift(obj)
// a.unshift(obj)

// console.log(a)


// const a = {
//     name : 'samudra',
//     role : 'student',
//     marks : {
//         m1 : '10',
//         m2 : '20',
//         m3 : '30'
//     },
//     'skills' : {
//         1 : 'js',
//         2 : 'react',
//         3 : 'express',
//     }
// }
// const answer = a.role === 'student' ? 'marks' : 'skills'

// console.log(a[answer])

// const Role = 'p'



//     const answer = [Role === 'student' ? 'studentInfo' : 'organizerInfo'][0]

// console.log(answer)
// function getRandomLengthNumber(minDigits, maxDigits) {
//     const length = Math.floor(Math.random() * (maxDigits - minDigits + 1)) + minDigits;
//     const min = Math.pow(10, length - 1);
//     const max = Math.pow(10, length) - 1;
//     return Math.floor(Math.random() * (max - min + 1)) + min;
// }


// console.log(getRandomLengthNumber(20,20))