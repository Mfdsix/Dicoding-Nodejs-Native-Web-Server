const http = require('http');

function respSuccess(resp, message) {
    resp.setHeader('Content-Type', 'text/html')
    resp.statusCode = 200
    resp.end(`<p>${message}</p>`)
}

function respError(resp, message, code = 500) {
    resp.setHeader('Content-Type', 'text/html');
    resp.statusCode = code
    resp.end(`<p>${message}</p>`)
}

// request listener
const requestListener = (req, resp) => {
    resp.statusCode = 200;

    const { url, method } = req;
    let body = [];

    console.log("User hit", url)

    if (method === 'GET') {
        switch (url) {
            case '/':
                return respSuccess(resp, 'This is Homepage')
            case '/about':
                return respSuccess(resp, 'This is About Page')
            default:
                return respError(resp, "Not Found", 404)
        }
    } else if (method === 'POST') {
        req.on('data', (data) => {
            body.push(data);
        })
        req.on('end', () => {
            try {
                body = Buffer.concat(body).toString();
                if (body) {
                    console.log(body)
                    body = JSON.parse(body);
                    console.log("Found Request Body", body)
                }

                switch (url) {
                    case '/about':
                        if (body && body.name)
                            return respSuccess(resp, `Hi ${body.name}, You're now seeing about page`)
                        else
                            return respError(resp, "Please define your name first")
                    default:
                        return respError(resp, "Not Found", 404)
                }

            } catch (e) {
                console.log(e)
                console.log("Got error on parsing body", e.name ?? "Unknown Error")
                return respError(resp, "Interval Server Error", 500)
            }
        })
    }
}

const server = http.createServer(requestListener);

// setup the server
const port = 3000
const host = 'localhost'
server.listen(port, host, () => {
    console.log("Web Server Is Ready")
})