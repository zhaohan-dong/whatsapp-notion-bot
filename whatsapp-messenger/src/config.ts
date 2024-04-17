// TODO: make port configurable from environment variable
export const expressPort: number = (process.env.PORT || 3000) as number;
export const clientId: string = process.env.WHATSAPP_CLIENT_ID || "messenger1";
export const authDataPath: string = process.env.WHATSAPP_AUTH_DATA_PATH || "./.whatsapp_auth/";
export const jwtUsername: string = process.env.JWT_USERNAME as string;
export const jwtPassword: string = process.env.JWT_PASSWORD as string;