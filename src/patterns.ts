export type Pattern = { name: string; regex: RegExp };

const patterns: Pattern[] = [
    { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
    { name: "Private Key", regex: /-----BEGIN (RSA )?PRIVATE KEY-----/g },
    { name: "Generic Password", regex: /password\s*[:=]\s*["'][^"']+["']/gi },
    { name: "JWT Token", regex: /eyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]*/g },
    { name: "API Key", regex: /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9-_]{16,}["']/i }
];

export default patterns;