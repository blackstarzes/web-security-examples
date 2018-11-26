const gulp = require("gulp");
const http = require("http");
const crypto = require("crypto");

function serve() {
    // Create javascript and hash
    const alert = "alert('SRI allows this script to execute')";
    const alertEval = "eval('alert(\`unsafe-eval stops this script from executing\`)')";

    let server = http.createServer(function(request, response) {
        let code = 200;
        let headers = {};
        let content = "";
        console.log(request.url);
        switch (request.url) {
            case "/sri":
                headers["Content-Type"] = "text/html";
                headers["Content-Security-Policy"] = `default-src 'none'; script-src 'sha256-${crypto.createHash("sha256").update(alert).digest("base64")}'`;
                content = `<html><head><script src='alert.js' integrity='sha256-${crypto.createHash("sha256").update(alert).digest("base64")}'></script></head></head><body>SRI works here and allows the script to execute.</body></html>`;
                break;
            case "/sri-eval":
                headers["Content-Type"] = "text/html";
                headers["Content-Security-Policy"] = `default-src 'none'; script-src 'sha256-${crypto.createHash("sha256").update(alertEval).digest("base64")}'`;
                content = `<html><head><script src='alert-eval.js' integrity='sha256-${crypto.createHash("sha256").update(alertEval).digest("base64")}'></script></head></head><body>SRI works here, but due to the eval call, the script execution is blocked.</body></html>`;
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