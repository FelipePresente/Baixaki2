import bcrypt from 'bcrypt'

export default async function comparePassword(password, hash) {
    const comparation = await bcrypt.compare(password, hash)

    return comparation
}