const req = require('request')

/**
 * There should be a before & after function, the before action should setup the test suite, and the data,
 * for example setting up a user by name tim, and in the after function it should tear down the data
 */
describe('calc', () => {
    it('should multiply 2 and 2', () => {
        expect(2*2).toBe(4)
    })
})

describe('get messages', () => {
    it('should return 200 OK', (done) => {
        req.get('http://localhost:3000/messages', (err, res) => {
            console.log(res.body)
            expect(res.statusCode).toEqual(200)
            done()
        })
    })

    it('should return 2a list not empty', (done) => {
        req.get('http://localhost:3000/messages', (err, res) => {
            //res.body is actually a string, so we need to parse it to JSON
            expect(JSON.parse(res.body).length).toBeGreaterThan(0)
            done()
        })
    })
})

describe('should return the messages of a particular user', () => {
    it('should return 2a list not empty', (done) => {
        req.get('http://localhost:3000/messages/tim', (err, res) => {
            expect(JSON.parse(res.body)[0].name).toEqual("tim")
            done()
        })
    })
})