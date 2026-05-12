#!/usr/bin/env node

import chalk from "chalk";
import inquirer from "inquirer";
import { scanStagedFiles } from "./scanner";
import installHooks from "./hookInstaller";

async function run(kind: string | undefined) {
    // mode: "strict" | "prompt"
    const cfgMode = (process.env.SECRET_GUARDIAN_MODE || process.env.npm_package_secretGuardian_mode || "prompt").toLowerCase();
    const mode = cfgMode === "strict" ? "strict" : "prompt";

    const findings = await scanStagedFiles();
    if (findings.length === 0) {
        console.log(chalk.green("✅ No secrets detected."));
        process.exit(0);
    }

    console.log(chalk.redBright(`\n⚠️ Potential secrets found (${findings.length}):`));
    for (const f of findings) {
        console.log(chalk.yellow(`• ${f.file}:${f.line} (${f.patternName})`));
        console.log(chalk.gray(`  ${f.snippet}`));
    }

    if (mode === "strict") {
        console.log(chalk.red("\n🚫 Commit/push blocked by secret-guardian-ts (strict mode)."));
        process.exit(1);
    }

    const ans = await inquirer.prompt([{ type: "confirm", name: "proceed", message: "Proceed with commit/push anyway?", default: false }]);
    if (!ans.proceed) {
        console.log(chalk.red("Commit/push cancelled by user."));
        process.exit(1);
    }

    console.log(chalk.green("Proceeding with commit/push..."));
    process.exit(0);
}

// If called with --install-hooks or without args in a postinstall context
if (process.argv.includes("--install-hooks") || process.argv[2] === "install-hooks") {
    installHooks();
    process.exit(0);
}

run(process.argv[2]).catch(err => {
    console.error("Error running secret-guardian-ts:", err);
    const failOpen = (process.env.SECRET_GUARDIAN_FAIL_OPEN || "").toLowerCase() === "true";
    process.exit(failOpen ? 0 : 1);
});