# Simple Chat Rooms

A lightweight platform where users can **create and join chat rooms without an account**.  
It leverages [Socket.IO](https://socket.io/) to provide real-time chat functionality.

---

## 📂 Project Structure

The source code is organized into three [Node.js](https://nodejs.org/) projects:

1. **`/client`** → Front-end project  
2. **`/server`** → Back-end server  
3. **`/` (root)** → Allows starting or building both projects at once  

Each project has its own **local packages**, which must be installed manually.

Additionally, there is a **`/global`** folder shared between the front-end and back-end, containing common variables and types.

- Each project (`/client` and `/server`) includes its own `README.md` with more details.  
- All Socket.IO events are defined in **`/global/socketScheme.ts`**.

---

## ⚙️ Available Scripts

After installing local packages for each project, you can run the following **npm scripts** from the root (`/`):

- **`dev:client`** → Starts the front-end server in development mode  
- **`dev:server`** → Starts the back-end server in development mode  
- **`dev`** → Starts both front-end and back-end servers in development mode  
- **`build`** → Compiles and bundles both projects, creating a new `/dist` folder  
- **`start`** → Runs the production build (requires prior build of front-end and back-end)

---

## License

```txt
Copyright © 2022 Stefan Samson <ss42701@outlook.com> (https://ssbit01.github.io/)

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0).
See the LICENSE file for the full license text.
```
