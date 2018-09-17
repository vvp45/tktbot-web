exports.responseWrapper = function (res) {
    return {
        end() {
            res.end();
            return this;
        },

        send(statusOrBody, maybeBody, callback) {
            var responseCode = 200;
            var responseBody = maybeBody;

            if (typeof statusOrBody == 'number') {
                responseCode = statusOrBody;
                responseBody = maybeBody;
            } else {
                responseBody = statusOrBody;
            }

            if (typeof responseBody != 'string') {
                responseBody = JSON.stringify(responseBody);
            }

            res.writeHead(responseCode);
            res.setHeader("Content-Type", "application/json");
            res.write(responseBody, callback);
            res.end();
            return this;
        },

        status(code) {
            res.writeHead(code);
            return this;
        }
    }
}

/**
 * 
 * interface IWebRequest {
 *     body: any;
 *     headers: {
 *         [name: string]: string;
 *     };
 *     on(event: string, ...args: any[]): void;
 * }
 * 
 */
exports.requestWrapper = function(request) {
    return {
        body: request.payload,
        headers: request.headers,
        on(event, listener) {
            request.raw.req.on(event, listener)
            return this;
        }
    }
}