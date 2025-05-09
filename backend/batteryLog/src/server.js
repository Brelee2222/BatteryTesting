const express = require("express");
const app = express();

app.use(express.json());

Object.entries(require("./requests.js")).forEach(method => {
    const requestMethod = app[method[0]].bind(app);
    const requests = method[1];
    
    Object.entries(requests).forEach(request => {
        requestMethod(request[0], async (req, res) => {
            try {
                res.send(await request[1](req));
            } catch (e) {
                console.error(e);
                res.sendStatus(500);
            }
        });
    });
});

app.listen(process.env.PORT);