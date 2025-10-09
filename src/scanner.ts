import fs from "fs";
import path from "path";
import simpleGit, { SimpleGit } from "simple-git";
import patterns, { Pattern } from "./patterns";

export type Finding = { file: string; patternName: string };

export async function getStagedFiles(git: SimpleGit): Promise<string[]> {
    const diff = await git.diff(["--cached", "--name-only"]);
    return diff.split("\n").map(s => s.trim()).filter(Boolean);
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

export async function scanStagedFiles(): Promise<Finding[]> {
    const git = simpleGit();
    const staged = await getStagedFiles(git);
    const findings: Finding[] = [];

    for (const relPath of staged) {
        const filePath = path.resolve(process.cwd(), relPath);
        try {
            const stats = fs.statSync(filePath);
            if (stats.isDirectory()) continue;
            const content = fs.readFileSync(filePath, "utf8");
            const matches = scanText(content);
            for (const m of matches) findings.push({ file: relPath, patternName: m.name });
        } catch (e) {
            // Could not read file — skip
        }
    }
    return findings;
}