# ***Simple Chat Rooms***

This is a platform created by [SSbit01](https://ssbit01.github.io/) where users can create and join chat rooms without creating an account. It uses [WebSockets](https://datatracker.ietf.org/doc/html/rfc6455) to provide real-time chat functionality.

---

The source code consists of three [node](https://nodejs.org/) projects:

1. `/client`
: *front-end* project
2. `/server`
: *back-end* server
3. `/`
: root project, which allows to start or build the other projects at once

Each of them has its **local packages**, which must be installed manually.

Also, there is a `/global` folder that can be accessed on both the *front-end* and *back-end* to get some common variables and types.

A `README.md` file can be found in the `/client` and `/server` paths, with more information about each project.

You can check out all *WebSocket* events in `/global/socketScheme.ts`.

---

Once local packages for each project are installed, you can run the following *npm scripts* in the root (`/`):

- `dev`
: starts the *front-end* and *back-end* projects in development mode.
- `build`
: compiles and bundles the *front-end* and *back-end* projects, a new folder `/dist` is created.
- `start`
: starts the production build (*front-end* and *back-end* must be built).
