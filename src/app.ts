import http from 'http';
import fs from 'fs';

const server = http.createServer((req, res) => {
    const method = req.method;
    const url = req.url;
    console.log(`metodas: ${method}, url:${url}`);

    if(url === '/') {
        res.setHeader('Content-Type', 'text/html'); 
        const template = fs.readFileSync('templates/index.html');
        res.write(template)
        return res.end();
    }

    if(url === '/result' && method === "POST") {
        const reqBody: any[] = [];
    
        req.on('data', (d) => {
            console.log(d);
            reqBody.push(d);
        });
    
        req.on('end', () => {
            const reqData = Buffer.concat(reqBody).toString();
            console.log(reqData);
            const va = reqData.split('&');
            console.log(va);
            const number = parseFloat (va[0].split('=')[1]);
            const selectedValue = parseFloat (va[1].split('=')[1]);


            let template = fs.readFileSync('templates/result.html').toString();
            template = template.replace(`{{result}}`, `${number} ${selectedValue === 2.54? 'in' : 'cm'} yra ${number*selectedValue} ${selectedValue === 2.54? 'cm' : 'in'}.`)
            res.write(template)
            res.end();
        });
        return;
    }

    res.writeHead(404, {
        'Content-Type': 'text/html'
    });

    const template = fs.readFileSync('templates/404.html');
    res.write(template)
    return res.end();
})

server.listen(2999, 'localhost');