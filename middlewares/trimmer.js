// It trims all the strings in the request body
export default async function trimData(req, res, next) {
    let data = req.body
    for (const key in data) {
        if (typeof data[key] === 'string') {
            data[key] = data[key].trim()
        }
    }
    next()
}