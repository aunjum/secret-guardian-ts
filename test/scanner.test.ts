import { scanText } from "../src/scanner";

describe("scanText", () => {
    test("should detect AWS access key", () => {
        const content = "AWS_KEY=AKIAIOSFODNN7EXAMPLE";
        const results = scanText(content);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe("AWS Access Key");
    });

    test("should detect private key", () => {
        const content = "-----BEGIN RSA PRIVATE KEY-----\ntest\n-----END RSA PRIVATE KEY-----";
        const results = scanText(content);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe("Private Key");
    });

    test("should detect generic password", () => {
        const content = 'password: "mySecretPassword123"';
        const results = scanText(content);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe("Generic Password");
    });

    test("should not detect secrets in clean code", () => {
        const content = "const foo = 'bar'; console.log('Hello World');";
        const results = scanText(content);
        expect(results.length).toBe(0);
    });

    test("should detect JWT token", () => {
        const content = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";
        const results = scanText(content);
        expect(results.length).toBeGreaterThan(0);
        expect(results[0].name).toBe("JWT Token");
    });
});

