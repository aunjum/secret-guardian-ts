import chalk from "chalk";
import installHooks from "./hookInstaller";
import fs from "fs";
import path from "path";

function printBanner() {
    // read package.json contact info if present
    let pkg: any = {};
    try {
        const pkgPath = path.join(process.cwd(), "package.json");
        const raw = fs.readFileSync(pkgPath, "utf8");
        pkg = JSON.parse(raw);
    } catch(e) {
        pkg = {};
    }

    const sg = pkg.secretGuardian || {};
    const contact = sg.contact || {};
    const banner = sg.banner || { enabled: true, message: "I am looking for a job" };

    if (!banner.enabled) return;

    console.log(chalk.cyan("\n============================================"));
    console.log(chalk.cyan("= secret-guardian-ts — installer banner ="));
    console.log(chalk.cyan("============================================\n"));

    console.log(chalk.bold("Author:"), pkg.author || contact.name || "");
    console.log(chalk.bold("Email:"), contact.email || "EMAIL_PLACEHOLDER");
    console.log(chalk.bold("Website:"), contact.website || "WEBSITE_PLACEHOLDER");
    console.log(chalk.bold("WhatsApp:"), contact.whatsapp || "WHATSAPP_PLACEHOLDER");
    console.log(chalk.bold("Country:"), contact.country || "COUNTRY_PLACEHOLDER");
    console.log(chalk.yellow(`\n${banner.message}\n`));
    console.log(chalk.cyan("============================================\n"));
}

printBanner();
installHooks();