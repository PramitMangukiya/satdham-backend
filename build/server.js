"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const src_1 = __importDefault(require("./src"));
// if (cluster.isMaster)
//     for (let i = 0; i < os.cpus().length; i++) cluster.fork()
// else {
//     const port = process.env.PORT || 80;
//     server.listen(port, () => {
//         console.log(`server started on port ${port}`);
//     });
// }
const port = process.env.PORT || 2000;
src_1.default.listen(port, () => {
    console.log(`server started on port ${port}`);
});
//# sourceMappingURL=server.js.map