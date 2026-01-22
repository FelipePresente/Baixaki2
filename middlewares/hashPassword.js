import bcrypt from 'bcrypt'

export default async function hashPassword(password) {
    const hash = await bcrypt.hash(password, 12)
    return hash
}