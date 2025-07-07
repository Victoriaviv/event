"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const ormconfig_1 = require("../ormconfig");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const eventRoutes_1 = __importDefault(require("./routes/eventRoutes"));
const bookingRoutes_1 = __importDefault(require("./routes/bookingRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 5000;
ormconfig_1.AppDataSource.initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
    app.use('/api/auth', authRoutes_1.default);
    app.use('/api/events', eventRoutes_1.default);
    app.use('/api/bookings', bookingRoutes_1.default);
    app.use('/api/admins', adminRoutes_1.default);
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
})
    .catch((err) => {
    console.error('Error during Data Source initialization', err);
});
