export type Pattern = { name: string; regex: RegExp };

const patterns: Pattern[] = [
    { name: "AWS Access Key", regex: /AKIA[0-9A-Z]{16}/g },
    { name: "AWS Secret Access Key", regex: /aws(.{0,20})?(secret|access)?(.{0,20})?key\s*[:=]\s*["']?[A-Za-z0-9\/+=]{40}["']?/gi },
    { name: "Private Key", regex: /-----BEGIN (RSA )?PRIVATE KEY-----/g },
    { name: "Generic Password", regex: /password\s*[:=]\s*["'][^"']+["']/gi },
    { name: "GitHub Token", regex: /\bgh[pousr]_[A-Za-z0-9]{20,}\b/g },
    { name: "Slack Token", regex: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
    { name: "JWT Token", regex: /eyJ[A-Za-z0-9_-]+?\.[A-Za-z0-9._-]+\.[A-Za-z0-9._-]*/g },
    { name: "OpenAI API Key", regex: /\bsk-[A-Za-z0-9]{20,}\b/g },
    { name: "API Key", regex: /api[_-]?key\s*[:=]\s*["'][A-Za-z0-9-_]{16,}["']/gi }
];

export default patterns;