const fs = require('fs')

const data = fs.readdirSync('c:/')
//console.log(data)

console.log('this comes after')

fs.readdir('c:/', (err, files) => {
    //console.log("The list of files", files)
})

fs.readFile('./data.json', 'utf-8', (err, data) => {
    data = JSON.parse(data)
    console.log(data)
})