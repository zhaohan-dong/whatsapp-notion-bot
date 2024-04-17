import jwt from 'jsonwebtoken';

export function generateToken(user: any): string {
    return jwt.sign(user, process.env.JWT_SECRET_KEY as string, { expiresIn: '1h' });
}