export default async function lowerCase(req, res, next) {
    let data = req.body

    const safeFields = ['username', 'email']

    for (const key in data) {
        if (safeFields.includes(key) && typeof data[key] === 'string') {
            data[key] = data[key].toLowerCase()
        }
    }
    next()
}