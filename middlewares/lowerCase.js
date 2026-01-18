// It trims all the strings in the request body
export default async function trimData(req, res, next) {
    let data = req.body

    const safeFields = ['username', 'genre']

    for (const key in data) {
        if (safeFields.includes(key) && typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
        }
    }
    next()
}