export function loadEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`No environment variable named ${key}`);
    }
    return value;
}