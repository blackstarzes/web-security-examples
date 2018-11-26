const gulp = require("gulp");
const http = require("http");
const crypto = require("crypto");

function serve() {
    // Create javascript and hash
    const alert = "alert('hello')";
    const alertEval = "eval('alert(\`hello\`)')";

    let server = http.createServer(function(request, response) {
        let code = 200;
        let headers = {};
        let content = "";
        console.log(request.url);
        switch (request.url) {
            case "/sri":
                headers["Content-Type"] = "text/html";
                headers["Content-Security-Policy"] = `default-src 'none'; script-src 'sha256-${crypto.createHash("sha256").update(alert).digest("base64")}'`;
                content = `<html><head><script src='alert.js' integrity='sha256-${crypto.createHash("sha256").update(alert).digest("base64")}'></script></head></head><body>Hello world</body></html>`;
                break;
            case "/sri-eval":
                headers["Content-Type"] = "text/html";
                headers["Content-Security-Policy"] = `default-src 'none'; script-src 'sha256-${crypto.createHash("sha256").update(alertEval).digest("base64")}'`;
                content = `<html><head><script src='alert-eval.js' integrity='sha256-${crypto.createHash("sha256").update(alertEval).digest("base64")}'></script></head></head><body>Hello world</body></html>`;
                break;
            case "/alert.js":
                headers["Content-Type"] = "text/javascript";
                content = alert;
                break;
            case "/alert-eval.js":
                headers["Content-Type"] = "text/javascript";
                content = alertEval;
                break;
            default:
                code = 404;
                headers["Content-Type"] = "text/plain";
                content = "Not found";
                break;
        }
        response.writeHead(
            code,
            headers);
        response.end(content);
    });
    server.listen(7000);
}

gulp.task("serve", serve);