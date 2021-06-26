# How to build
Firstly, in the root directory, run this command:
```bash
npm install
```
Then, in the client folder, run these commands:
```bash
npm install
npm run build
```
Finally, in the root directory:
```bash
npm start
```

## Important
* You need to create the `.env` file with the **PORT** variable
* If you modify the `client` project and you want to run `npm run serve`, you need to add the **URL** parameter with the server port in the `window.socket` variable, which can be found in `\client\src\main.js`. For example: `window.socket = require("socket.io-client")("http://localhost:{server port}")`


### Created By [SSbit01](https://github.com/ssbit01) 
### License [MIT](https://choosealicense.com/licenses/mit/)