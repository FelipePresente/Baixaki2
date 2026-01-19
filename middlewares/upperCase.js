export default async function upperCase(req, res, next) {
    let data = req.body

    const safeFields = ['size']

    for (const key in data) {
        if (safeFields.includes(key) && typeof data[key] === 'string') {
            data[key] = data[key].toUpperCase()
        }
    }
    next()
}