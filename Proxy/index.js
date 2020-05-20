const net = require("net");
const fs = require("fs").promises;
const client = net.createServer();

const serverPort = 8090;
let logURL;
const blockPath = "C:/Users/evgen/source/repos/Proxy/block.html";
const logPath = "C:/Users/evgen/source/repos/Proxy/log.txt";
const blockArray = require("C:/Users/evgen/source/repos/Proxy/blockArray.json");
fs.writeFile(logPath, ``);

client.on("connection", (clientProxy) => {
    clientProxy.on("data", async(data) => {
        let d = data.toString();
        logURL = (data.toString().split("\r\n")[0]);
        let servURL = /(?<=Host: )[^\:\r\n]*/m.exec(data.toString())[0];

        if (!blockArray.includes(servURL)) {
            const proxyServ = net.createConnection({ port: getPort(data), host: servURL
            }, async() => {
                let d = data.toString();    
                const modifiedData = data.toString().replace(/(?<=^GET )http:\/\/[^/]*/, "");

                    proxyServ.write(modifiedData);
                    clientProxy.pipe(proxyServ);
                    proxyServ.pipe(clientProxy);
                }
            );
            proxyServ.on("data", async(data) => {
                let response = data.toString("UTF-8").split("\r\n")[0];
                fs.appendFile( logPath, `${logURL}/ ${servURL}\n${response}\n\n`);
            });

            proxyServ.on("error", () => {
                proxyServ.end();
            });
        } else {
            let blocked = await fs.readFile(blockPath);
            clientProxy.write(blocked);
            fs.appendFile( logPath, `${logURL}/ ${servURL}\nSite at BlockArray\n\n`);
            clientProxy.end();
        }
    });

    clientProxy.on("error", () => {
        clientProxy.end(); }); });

client.on("error", (err) => {
    throw err; });
    
client.listen(serverPort, () => {
    console.log(`Connect proxy as localhost:${serverPort}`); });

function getPort(val) {
    const port = /(?<=:).*/m.exec(/(?<=Host: ).*/m.exec(val.toString())[0]);
    if (port === null) {
        return 80;
    } else {
        return Number(port[0]);
    }
}