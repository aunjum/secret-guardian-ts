import fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import patterns, { Pattern } from "./patterns";

export type Finding = {
    file: string;
    patternName: string;
    line: number;
    snippet: string;
};

export async function getStagedFiles(git: SimpleGit): Promise<string[]> {
    const diff = await git.diff(["--cached", "--name-only"]);
    return diff.split("\n").map(s => s.trim()).filter(Boolean);
}

function isLikelyTextContent(content: Buffer): boolean {
    if (content.length === 0) return true;
    // Detect binary-ish content by null-byte ratio.
    let nullBytes = 0;
    for (const byte of content) {
        if (byte === 0) nullBytes++;
    }
    return nullBytes / content.length < 0.01;
}

export function scanText(content: string): Pattern[] {
    const found: Pattern[] = [];
    for (const p of patterns) {
        try {
            if (p.regex.test(content)) {
                found.push(p);
            }
            // reset lastIndex in case of global regex
            if ((p.regex as RegExp).global) (p.regex as RegExp).lastIndex = 0;
        } catch (e) {
            // ignore invalid pattern errors
        }
    }
    return found;
}

function maskSecret(value: string): string {
    if (value.length <= 8) return "***";
    return `${value.slice(0, 4)}***${value.slice(-2)}`;
}

function buildMaskedSnippet(line: string, secretValue: string): string {
    return line.replace(secretValue, maskSecret(secretValue)).trim();
}

function scanTextDetailed(content: string): Array<{ patternName: string; line: number; snippet: string }> {
    const lines = content.split(/\r?\n/);
    const findings: Array<{ patternName: string; line: number; snippet: string }> = [];

    for (const p of patterns) {
        try {
            const flags = p.regex.flags.includes("g") ? p.regex.flags : `${p.regex.flags}g`;
            const regex = new RegExp(p.regex.source, flags);
            let match: RegExpExecArray | null = null;

            while ((match = regex.exec(content)) !== null) {
                const before = content.slice(0, match.index);
                const line = before.split(/\r?\n/).length;
                const lineText = lines[line - 1] || "";
                const matchedValue = match[0];
                findings.push({
                    patternName: p.name,
                    line,
                    snippet: buildMaskedSnippet(lineText, matchedValue),
                });
            }
        } catch {
            // ignore invalid pattern errors
        }
    }

    return findings;
}

export async function scanStagedFiles(): Promise<Finding[]> {
    const git = simpleGit();
    const staged = await getStagedFiles(git);
    const findings: Finding[] = [];

    for (const relPath of staged) {
        const filePath = path.resolve(process.cwd(), relPath);
        try {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) continue;
            // Use staged blob content rather than working tree files.
            // This prevents bypasses where users stage safe code then edit locally.
            const stagedBlob = await git.show(`:${relPath}`);
            const contentBuffer = Buffer.from(stagedBlob, "utf8");
            if (!isLikelyTextContent(contentBuffer)) continue;
            const content = contentBuffer.toString("utf8");
            const matches = scanTextDetailed(content);
            for (const m of matches) findings.push({ file: relPath, patternName: m.patternName, line: m.line, snippet: m.snippet });
        } catch (e) {
            // Fall back to workspace file when staged blob isn't accessible.
            // This keeps behavior resilient in edge git environments.
            try {
                const fallback = fs.readFileSync(filePath);
                if (!isLikelyTextContent(fallback)) continue;
                const matches = scanTextDetailed(fallback.toString("utf8"));
                for (const m of matches) findings.push({ file: relPath, patternName: m.patternName, line: m.line, snippet: m.snippet });
            } catch {
                // Could not read file — skip
            }
        }
    }
    return findings;
}