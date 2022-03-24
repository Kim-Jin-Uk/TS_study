/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ([
/* 0 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var __resourceQuery = "?100";
/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 0;
	var log = __webpack_require__(1);

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function (updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__(2)(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function (err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}


/***/ }),
/* 1 */
/***/ ((module) => {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function (level) {
	logLevel = level;
};

module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),
/* 2 */
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(1);

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
const core_1 = __webpack_require__(4);
const app_module_1 = __webpack_require__(5);
const swagger_1 = __webpack_require__(23);
const httpExxception_filter_1 = __webpack_require__(58);
const common_1 = __webpack_require__(6);
const passport_1 = __importDefault(__webpack_require__(59));
const cookie_parser_1 = __importDefault(__webpack_require__(60));
const express_session_1 = __importDefault(__webpack_require__(61));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const port = process.env.PORT || 3000;
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useGlobalFilters(new httpExxception_filter_1.HttpExceptionFilter());
    app.enableCors({
        origin: true,
        credentials: true,
    });
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Sleact example')
        .setDescription('Sleact 개발을 위한 API 문서입니다.')
        .setVersion('1.0')
        .addCookieAuth('connect.sid')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api', app, document);
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_session_1.default)({
        resave: false,
        saveUninitialized: false,
        secret: process.env.COOKIE_SECRET,
        cookie: {
            httpOnly: true,
        },
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    await app.listen(port);
    console.log(`listen ${port}`);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),
/* 4 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core");

/***/ }),
/* 5 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppModule = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(7);
const app_controller_1 = __webpack_require__(8);
const app_service_1 = __webpack_require__(9);
const nest_morgan_1 = __webpack_require__(10);
const users_module_1 = __webpack_require__(11);
const workspaces_module_1 = __webpack_require__(36);
const channels_module_1 = __webpack_require__(40);
const dms_module_1 = __webpack_require__(48);
const typeorm_1 = __webpack_require__(13);
const ormconfig = __importStar(__webpack_require__(51));
const Users_1 = __webpack_require__(14);
const auth_module_1 = __webpack_require__(53);
const events_module_1 = __webpack_require__(62);
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            nest_morgan_1.MorganModule,
            users_module_1.UsersModule,
            workspaces_module_1.WorkspacesModule,
            channels_module_1.ChannelsModule,
            dms_module_1.DMsModule,
            events_module_1.EventsModule,
            typeorm_1.TypeOrmModule.forRoot(ormconfig),
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users]),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, config_1.ConfigService],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),
/* 6 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common");

/***/ }),
/* 7 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/config");

/***/ }),
/* 8 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppController = void 0;
const common_1 = __webpack_require__(6);
const app_service_1 = __webpack_require__(9);
const nest_morgan_1 = __webpack_require__(10);
let AppController = class AppController {
    constructor(appService) {
        this.appService = appService;
    }
    getHello() {
        return this.appService.getHello();
    }
};
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", String)
], AppController.prototype, "getHello", null);
AppController = __decorate([
    (0, common_1.UseInterceptors)((0, nest_morgan_1.MorganInterceptor)('combined')),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [typeof (_a = typeof app_service_1.AppService !== "undefined" && app_service_1.AppService) === "function" ? _a : Object])
], AppController);
exports.AppController = AppController;


/***/ }),
/* 9 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AppService = void 0;
const common_1 = __webpack_require__(6);
const config_1 = __webpack_require__(7);
let AppService = class AppService {
    constructor(configService) {
        this.configService = configService;
    }
    getHello() {
        return this.configService.get('NAME');
    }
};
AppService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof config_1.ConfigService !== "undefined" && config_1.ConfigService) === "function" ? _a : Object])
], AppService);
exports.AppService = AppService;


/***/ }),
/* 10 */
/***/ ((module) => {

"use strict";
module.exports = require("nest-morgan");

/***/ }),
/* 11 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersModule = void 0;
const common_1 = __webpack_require__(6);
const users_service_1 = __webpack_require__(12);
const users_controller_1 = __webpack_require__(26);
const typeorm_1 = __webpack_require__(13);
const Users_1 = __webpack_require__(14);
const WorkspaceMembers_1 = __webpack_require__(22);
const ChannelMembers_1 = __webpack_require__(18);
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users, WorkspaceMembers_1.WorkspaceMembers, ChannelMembers_1.ChannelMembers]),
        ],
        providers: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),
/* 12 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const Users_1 = __webpack_require__(14);
const typeorm_2 = __webpack_require__(15);
const bcrypt_1 = __importDefault(__webpack_require__(25));
const WorkspaceMembers_1 = __webpack_require__(22);
const ChannelMembers_1 = __webpack_require__(18);
let UsersService = class UsersService {
    constructor(usersRepository, workspaceMembersRepository, channelMembersRepository, connection) {
        this.usersRepository = usersRepository;
        this.workspaceMembersRepository = workspaceMembersRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.connection = connection;
    }
    async join(email, nickname, password) {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const user = await queryRunner.manager
            .getRepository(Users_1.Users)
            .findOne({ where: { email } });
        if (user) {
            throw new common_1.UnauthorizedException('이미 존재하는 사용자 입니다');
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 12);
        try {
            const returnUser = await queryRunner.manager.getRepository(Users_1.Users).save({
                email,
                nickname,
                password: hashedPassword,
            });
            await queryRunner.manager.getRepository(WorkspaceMembers_1.WorkspaceMembers).save({
                UserId: returnUser.id,
                WorkspaceId: 1,
            });
            await queryRunner.manager.getRepository(ChannelMembers_1.ChannelMembers).save({
                UserId: returnUser.id,
                ChannelId: 1,
            });
            await queryRunner.commitTransaction();
            return true;
        }
        catch (err) {
            console.error(err);
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __param(1, (0, typeorm_1.InjectRepository)(WorkspaceMembers_1.WorkspaceMembers)),
    __param(2, (0, typeorm_1.InjectRepository)(ChannelMembers_1.ChannelMembers)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Connection !== "undefined" && typeorm_2.Connection) === "function" ? _d : Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),
/* 13 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/typeorm");

/***/ }),
/* 14 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Users = void 0;
const typeorm_1 = __webpack_require__(15);
const ChannelChats_1 = __webpack_require__(16);
const ChannelMembers_1 = __webpack_require__(18);
const Channels_1 = __webpack_require__(17);
const DMs_1 = __webpack_require__(20);
const Mentions_1 = __webpack_require__(21);
const WorkspaceMembers_1 = __webpack_require__(22);
const Workspaces_1 = __webpack_require__(19);
const swagger_1 = __webpack_require__(23);
const class_validator_1 = __webpack_require__(24);
let Users = class Users {
};
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 1,
        description: '사용자 아이디',
    }),
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Users.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsEmail)(),
    (0, typeorm_1.Column)('varchar', { name: 'email', unique: true, length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)('varchar', { name: 'nickname', length: 30 }),
    __metadata("design:type", String)
], Users.prototype, "nickname", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, typeorm_1.Column)('varchar', { name: 'password', length: 100, select: false }),
    __metadata("design:type", String)
], Users.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Users.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Users.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Users.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelChats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChannelMembers_1.ChannelMembers, (channelmembers) => channelmembers.User),
    __metadata("design:type", Array)
], Users.prototype, "ChannelMembers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DMs_1.DMs, (dms) => dms.Sender),
    __metadata("design:type", Array)
], Users.prototype, "DMs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DMs_1.DMs, (dms) => dms.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "DMs2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Mentions_1.Mentions, (mentions) => mentions.Sender),
    __metadata("design:type", Array)
], Users.prototype, "Mentions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Mentions_1.Mentions, (mentions) => mentions.Receiver),
    __metadata("design:type", Array)
], Users.prototype, "Mentions2", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.User),
    __metadata("design:type", Array)
], Users.prototype, "WorkspaceMembers", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Owner),
    __metadata("design:type", Array)
], Users.prototype, "OwnedWorkspaces", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Members),
    (0, typeorm_1.JoinTable)({
        name: 'workspacemembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'WorkspaceId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Workspaces", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Channels_1.Channels, (channels) => channels.Members),
    (0, typeorm_1.JoinTable)({
        name: 'channelmembers',
        joinColumn: {
            name: 'UserId',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'ChannelId',
            referencedColumnName: 'id',
        },
    }),
    __metadata("design:type", Array)
], Users.prototype, "Channels", void 0);
Users = __decorate([
    (0, typeorm_1.Index)('email', ['email'], { unique: true }),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'users' })
], Users);
exports.Users = Users;


/***/ }),
/* 15 */
/***/ ((module) => {

"use strict";
module.exports = require("typeorm");

/***/ }),
/* 16 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelChats = void 0;
const typeorm_1 = __webpack_require__(15);
const Users_1 = __webpack_require__(14);
const Channels_1 = __webpack_require__(17);
let ChannelChats = class ChannelChats {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content' }),
    __metadata("design:type", String)
], ChannelChats.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ChannelChats.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChannelChats.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'UserId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "UserId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ChannelId', nullable: true }),
    __metadata("design:type", Number)
], ChannelChats.prototype, "ChannelId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object)
], ChannelChats.prototype, "User", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channels_1.Channels, (channels) => channels.ChannelChats, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Channels_1.Channels !== "undefined" && Channels_1.Channels) === "function" ? _d : Object)
], ChannelChats.prototype, "Channel", void 0);
ChannelChats = __decorate([
    (0, typeorm_1.Index)('UserId', ['UserId'], {}),
    (0, typeorm_1.Index)('ChannelId', ['ChannelId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'channelchats' })
], ChannelChats);
exports.ChannelChats = ChannelChats;


/***/ }),
/* 17 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Channels = void 0;
const typeorm_1 = __webpack_require__(15);
const ChannelChats_1 = __webpack_require__(16);
const ChannelMembers_1 = __webpack_require__(18);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
let Channels = class Channels {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Channels.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', length: 30 }),
    __metadata("design:type", String)
], Channels.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('tinyint', {
        name: 'private',
        nullable: true,
        width: 1,
        default: () => "'0'",
    }),
    __metadata("design:type", Boolean)
], Channels.prototype, "private", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Channels.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Channels.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Channels.prototype, "WorkspaceId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChannelChats_1.ChannelChats, (channelchats) => channelchats.Channel),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelChats", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ChannelMembers_1.ChannelMembers, (channelMembers) => channelMembers.Channel, {
        cascade: ['insert'],
    }),
    __metadata("design:type", Array)
], Channels.prototype, "ChannelMembers", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Users_1.Users, (users) => users.Channels),
    __metadata("design:type", Array)
], Channels.prototype, "Members", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Channels, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], Channels.prototype, "Workspace", void 0);
Channels = __decorate([
    (0, typeorm_1.Index)('WorkspaceId', ['WorkspaceId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact' })
], Channels);
exports.Channels = Channels;


/***/ }),
/* 18 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelMembers = void 0;
const typeorm_1 = __webpack_require__(15);
const Channels_1 = __webpack_require__(17);
const Users_1 = __webpack_require__(14);
let ChannelMembers = class ChannelMembers {
};
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], ChannelMembers.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], ChannelMembers.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { primary: true, name: 'ChannelId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "ChannelId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], ChannelMembers.prototype, "UserId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Channels_1.Channels, (channels) => channels.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ChannelId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Channels_1.Channels !== "undefined" && Channels_1.Channels) === "function" ? _c : Object)
], ChannelMembers.prototype, "Channel", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.ChannelMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], ChannelMembers.prototype, "User", void 0);
ChannelMembers = __decorate([
    (0, typeorm_1.Index)('UserId', ['UserId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'channelmembers' })
], ChannelMembers);
exports.ChannelMembers = ChannelMembers;


/***/ }),
/* 19 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Workspaces = void 0;
const typeorm_1 = __webpack_require__(15);
const Channels_1 = __webpack_require__(17);
const DMs_1 = __webpack_require__(20);
const Mentions_1 = __webpack_require__(21);
const WorkspaceMembers_1 = __webpack_require__(22);
const Users_1 = __webpack_require__(14);
let Workspaces = class Workspaces {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Workspaces.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'name', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)('varchar', { name: 'url', unique: true, length: 30 }),
    __metadata("design:type", String)
], Workspaces.prototype, "url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Workspaces.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Workspaces.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)(),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], Workspaces.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'OwnerId', nullable: true }),
    __metadata("design:type", Number)
], Workspaces.prototype, "OwnerId", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Channels_1.Channels, (channels) => channels.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Channels", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => DMs_1.DMs, (dms) => dms.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "DMs", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Mentions_1.Mentions, (mentions) => mentions.Workspace),
    __metadata("design:type", Array)
], Workspaces.prototype, "Mentions", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => WorkspaceMembers_1.WorkspaceMembers, (workspacemembers) => workspacemembers.Workspace, { cascade: ['insert'] }),
    __metadata("design:type", Array)
], Workspaces.prototype, "WorkspaceMembers", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.Workspaces, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'OwnerId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], Workspaces.prototype, "Owner", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Users_1.Users, (users) => users.Workspaces),
    __metadata("design:type", Array)
], Workspaces.prototype, "Members", void 0);
Workspaces = __decorate([
    (0, typeorm_1.Index)('name', ['name'], { unique: true }),
    (0, typeorm_1.Index)('url', ['url'], { unique: true }),
    (0, typeorm_1.Index)('OwnerId', ['OwnerId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'workspaces' })
], Workspaces);
exports.Workspaces = Workspaces;


/***/ }),
/* 20 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DMs = void 0;
const typeorm_1 = __webpack_require__(15);
const Workspaces_1 = __webpack_require__(19);
const Users_1 = __webpack_require__(14);
let DMs = class DMs {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], DMs.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('text', { name: 'content' }),
    __metadata("design:type", String)
], DMs.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], DMs.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], DMs.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "WorkspaceId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'SenderId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "SenderId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ReceiverId', nullable: true }),
    __metadata("design:type", Number)
], DMs.prototype, "ReceiverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.DMs, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], DMs.prototype, "Workspace", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.DMs, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'SenderId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], DMs.prototype, "Sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.DMs2, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ReceiverId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], DMs.prototype, "Receiver", void 0);
DMs = __decorate([
    (0, typeorm_1.Index)('WorkspaceId', ['WorkspaceId'], {}),
    (0, typeorm_1.Index)('dms_ibfk_2', ['SenderId'], {}),
    (0, typeorm_1.Index)('dms_ibfk_3', ['ReceiverId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'dms' })
], DMs);
exports.DMs = DMs;


/***/ }),
/* 21 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Mentions = void 0;
const typeorm_1 = __webpack_require__(15);
const Workspaces_1 = __webpack_require__(19);
const Users_1 = __webpack_require__(14);
let Mentions = class Mentions {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: 'int', name: 'id' }),
    __metadata("design:type", Number)
], Mentions.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)('enum', { name: 'category', enum: ['chat', 'dm', 'system'] }),
    __metadata("design:type", String)
], Mentions.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ChatId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ChatId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], Mentions.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], Mentions.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'WorkspaceId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "WorkspaceId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'SenderId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "SenderId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { name: 'ReceiverId', nullable: true }),
    __metadata("design:type", Number)
], Mentions.prototype, "ReceiverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_c = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _c : Object)
], Mentions.prototype, "Workspace", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.Mentions, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'SenderId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object)
], Mentions.prototype, "Sender", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.Mentions2, {
        onDelete: 'SET NULL',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'ReceiverId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], Mentions.prototype, "Receiver", void 0);
Mentions = __decorate([
    (0, typeorm_1.Index)('WorkspaceId', ['WorkspaceId'], {}),
    (0, typeorm_1.Index)('SenderId', ['SenderId'], {}),
    (0, typeorm_1.Index)('ReceiverId', ['ReceiverId'], {}),
    (0, typeorm_1.Entity)({ schema: 'sleact', name: 'mentions' })
], Mentions);
exports.Mentions = Mentions;


/***/ }),
/* 22 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspaceMembers = void 0;
const typeorm_1 = __webpack_require__(15);
const Workspaces_1 = __webpack_require__(19);
const Users_1 = __webpack_require__(14);
let WorkspaceMembers = class WorkspaceMembers {
};
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", typeof (_a = typeof Date !== "undefined" && Date) === "function" ? _a : Object)
], WorkspaceMembers.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)(),
    __metadata("design:type", typeof (_b = typeof Date !== "undefined" && Date) === "function" ? _b : Object)
], WorkspaceMembers.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { primary: true, name: 'WorkspaceId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "WorkspaceId", void 0);
__decorate([
    (0, typeorm_1.Column)('int', { primary: true, name: 'UserId' }),
    __metadata("design:type", Number)
], WorkspaceMembers.prototype, "UserId", void 0);
__decorate([
    (0, typeorm_1.Column)('datetime', { name: 'loggedInAt', nullable: true }),
    __metadata("design:type", typeof (_c = typeof Date !== "undefined" && Date) === "function" ? _c : Object)
], WorkspaceMembers.prototype, "loggedInAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Workspaces_1.Workspaces, (workspaces) => workspaces.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'WorkspaceId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_d = typeof Workspaces_1.Workspaces !== "undefined" && Workspaces_1.Workspaces) === "function" ? _d : Object)
], WorkspaceMembers.prototype, "Workspace", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Users_1.Users, (users) => users.WorkspaceMembers, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)([{ name: 'UserId', referencedColumnName: 'id' }]),
    __metadata("design:type", typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object)
], WorkspaceMembers.prototype, "User", void 0);
WorkspaceMembers = __decorate([
    (0, typeorm_1.Index)('UserId', ['UserId'], {}),
    (0, typeorm_1.Entity)('workspacemembers', { schema: 'sleact' })
], WorkspaceMembers);
exports.WorkspaceMembers = WorkspaceMembers;


/***/ }),
/* 23 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/swagger");

/***/ }),
/* 24 */
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");

/***/ }),
/* 25 */
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");

/***/ }),
/* 26 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UsersController = void 0;
const common_1 = __webpack_require__(6);
const join_request_dto_1 = __webpack_require__(27);
const users_service_1 = __webpack_require__(12);
const swagger_1 = __webpack_require__(23);
const user_dto_1 = __webpack_require__(28);
const user_decorator_1 = __webpack_require__(29);
const undefinedToNull_interceptor_1 = __webpack_require__(30);
const local_auth_guard_1 = __webpack_require__(32);
const logged_in_guard_1 = __webpack_require__(34);
const not_logged_in_guard_1 = __webpack_require__(35);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUsers(user) {
        return user || false;
    }
    async join(data) {
        await this.usersService.join(data.email, data.nickname, data.password);
    }
    logIn(user) {
        return user;
    }
    logOut(req, res) {
        req.logOut();
        res.clearCookie('connect.sid', { httpOnly: true });
        res.send('ok');
    }
};
__decorate([
    (0, swagger_1.ApiResponse)({
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '내 정보 조회' }),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "getUsers", null);
__decorate([
    (0, common_1.UseGuards)(new not_logged_in_guard_1.NotLoggedInGuard()),
    (0, swagger_1.ApiOperation)({ summary: '회원가입' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof join_request_dto_1.JoinRequestDto !== "undefined" && join_request_dto_1.JoinRequestDto) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "join", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)('login'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "logIn", null);
__decorate([
    (0, common_1.UseGuards)(new logged_in_guard_1.LoggedInGuard()),
    (0, swagger_1.ApiOperation)({ summary: '로그아웃' }),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "logOut", null);
UsersController = __decorate([
    (0, common_1.UseInterceptors)(undefinedToNull_interceptor_1.UndefinedToNullInterceptor),
    (0, common_1.Controller)('api/users'),
    __metadata("design:paramtypes", [typeof (_b = typeof users_service_1.UsersService !== "undefined" && users_service_1.UsersService) === "function" ? _b : Object])
], UsersController);
exports.UsersController = UsersController;


/***/ }),
/* 27 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JoinRequestDto = void 0;
const swagger_1 = __webpack_require__(23);
const Users_1 = __webpack_require__(14);
class JoinRequestDto extends (0, swagger_1.PickType)(Users_1.Users, [
    'email',
    'nickname',
    'password',
]) {
}
exports.JoinRequestDto = JoinRequestDto;


/***/ }),
/* 28 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UserDto = void 0;
const swagger_1 = __webpack_require__(23);
const join_request_dto_1 = __webpack_require__(27);
class UserDto extends join_request_dto_1.JoinRequestDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        required: true,
        example: 1,
        description: '아이디',
    }),
    __metadata("design:type", Number)
], UserDto.prototype, "id", void 0);
exports.UserDto = UserDto;


/***/ }),
/* 29 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.User = void 0;
const common_1 = __webpack_require__(6);
exports.User = (0, common_1.createParamDecorator)((data, ctx) => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
});


/***/ }),
/* 30 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UndefinedToNullInterceptor = void 0;
const common_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(31);
let UndefinedToNullInterceptor = class UndefinedToNullInterceptor {
    intercept(context, next) {
        return next
            .handle()
            .pipe((0, rxjs_1.map)((data) => (data === undefined ? null : data)));
    }
};
UndefinedToNullInterceptor = __decorate([
    (0, common_1.Injectable)()
], UndefinedToNullInterceptor);
exports.UndefinedToNullInterceptor = UndefinedToNullInterceptor;


/***/ }),
/* 31 */
/***/ ((module) => {

"use strict";
module.exports = require("rxjs");

/***/ }),
/* 32 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalAuthGuard = void 0;
const passport_1 = __webpack_require__(33);
const common_1 = __webpack_require__(6);
let LocalAuthGuard = class LocalAuthGuard extends (0, passport_1.AuthGuard)('local') {
    async canActivate(context) {
        const can = await super.canActivate(context);
        if (can) {
            const request = context.switchToHttp().getRequest();
            console.log('auth guard log login for cookie');
            await super.logIn(request);
        }
        return true;
    }
};
LocalAuthGuard = __decorate([
    (0, common_1.Injectable)()
], LocalAuthGuard);
exports.LocalAuthGuard = LocalAuthGuard;


/***/ }),
/* 33 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/passport");

/***/ }),
/* 34 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LoggedInGuard = void 0;
const common_1 = __webpack_require__(6);
let LoggedInGuard = class LoggedInGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return request.isAuthenticated();
    }
};
LoggedInGuard = __decorate([
    (0, common_1.Injectable)()
], LoggedInGuard);
exports.LoggedInGuard = LoggedInGuard;


/***/ }),
/* 35 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NotLoggedInGuard = void 0;
const common_1 = __webpack_require__(6);
let NotLoggedInGuard = class NotLoggedInGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        return !request.isAuthenticated();
    }
};
NotLoggedInGuard = __decorate([
    (0, common_1.Injectable)()
], NotLoggedInGuard);
exports.NotLoggedInGuard = NotLoggedInGuard;


/***/ }),
/* 36 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacesModule = void 0;
const common_1 = __webpack_require__(6);
const workspaces_service_1 = __webpack_require__(37);
const workspaces_controller_1 = __webpack_require__(38);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
const Channels_1 = __webpack_require__(17);
const WorkspaceMembers_1 = __webpack_require__(22);
const ChannelMembers_1 = __webpack_require__(18);
const typeorm_1 = __webpack_require__(13);
let WorkspacesModule = class WorkspacesModule {
};
WorkspacesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Users_1.Users,
                Workspaces_1.Workspaces,
                Channels_1.Channels,
                WorkspaceMembers_1.WorkspaceMembers,
                ChannelMembers_1.ChannelMembers,
            ]),
        ],
        providers: [workspaces_service_1.WorkspacesService],
        controllers: [workspaces_controller_1.WorkspacesController],
    })
], WorkspacesModule);
exports.WorkspacesModule = WorkspacesModule;


/***/ }),
/* 37 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacesService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const Workspaces_1 = __webpack_require__(19);
const typeorm_2 = __webpack_require__(15);
const Channels_1 = __webpack_require__(17);
const WorkspaceMembers_1 = __webpack_require__(22);
const ChannelMembers_1 = __webpack_require__(18);
const Users_1 = __webpack_require__(14);
let WorkspacesService = class WorkspacesService {
    constructor(workspacesRepository, channelsRepository, workspaceMembersRepository, channelMembersRepository, usersRepository) {
        this.workspacesRepository = workspacesRepository;
        this.channelsRepository = channelsRepository;
        this.workspaceMembersRepository = workspaceMembersRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.usersRepository = usersRepository;
    }
    async findById(id) {
        return this.workspacesRepository.findOne({ where: { id } });
    }
    async findMyWorkspaces(myId) {
        return this.workspacesRepository.find({
            where: {
                WorkspaceMembers: [{ userId: myId }],
            },
        });
    }
    async createWorkspace(name, url, myId) {
        const workspace = new Workspaces_1.Workspaces();
        workspace.name = name;
        workspace.url = url;
        workspace.OwnerId = myId;
        const returned = await this.workspacesRepository.save(workspace);
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.UserId = myId;
        workspaceMember.WorkspaceId = returned.id;
        const channel = new Channels_1.Channels();
        channel.name = '일반';
        channel.WorkspaceId = returned.id;
        const [, channelReturned] = await Promise.all([
            this.workspaceMembersRepository.save(workspaceMember),
            this.channelsRepository.save(channel),
        ]);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMembers(url) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.WorkspaceMembers', 'members')
            .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceMembers(url, email) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
            join: {
                alias: 'workspace',
                innerJoinAndSelect: {
                    channels: 'workspace.Channels',
                },
            },
        });
        const user = await this.usersRepository.findOne({ where: { email } });
        if (!user) {
            return null;
        }
        const workspaceMember = new WorkspaceMembers_1.WorkspaceMembers();
        workspaceMember.WorkspaceId = workspace.id;
        workspaceMember.UserId = user.id;
        await this.workspaceMembersRepository.save(workspaceMember);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = workspace.Channels.find((v) => v.name === '일반').id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceMember(url, id) {
        return this.usersRepository
            .createQueryBuilder('user')
            .where('user.id = :id', { id })
            .innerJoin('user.Workspaces', 'workspaces', 'workspaces.url = :url', {
            url,
        })
            .getOne();
    }
};
WorkspacesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Workspaces_1.Workspaces)),
    __param(1, (0, typeorm_1.InjectRepository)(Channels_1.Channels)),
    __param(2, (0, typeorm_1.InjectRepository)(WorkspaceMembers_1.WorkspaceMembers)),
    __param(3, (0, typeorm_1.InjectRepository)(ChannelMembers_1.ChannelMembers)),
    __param(4, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object])
], WorkspacesService);
exports.WorkspacesService = WorkspacesService;


/***/ }),
/* 38 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacesController = void 0;
const common_1 = __webpack_require__(6);
const swagger_1 = __webpack_require__(23);
const logged_in_guard_1 = __webpack_require__(34);
const workspaces_service_1 = __webpack_require__(37);
const user_decorator_1 = __webpack_require__(29);
const Users_1 = __webpack_require__(14);
const create_workspace_dto_1 = __webpack_require__(39);
let WorkspacesController = class WorkspacesController {
    constructor(workspacesService) {
        this.workspacesService = workspacesService;
    }
    async getMyWorkspaces(user) {
        return this.workspacesService.findMyWorkspaces(user.id);
    }
    async createWorkspace(user, body) {
        return this.workspacesService.createWorkspace(body.workspace, body.url, user.id);
    }
    async getWorkspaceMembers(url) {
        return this.workspacesService.getWorkspaceMembers(url);
    }
    async createWorkspaceMembers(url, email) {
        return this.workspacesService.createWorkspaceMembers(url, email);
    }
    async getWorkspaceMember(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
    async DEPRECATED_getWorkspaceUser(url, id) {
        return this.workspacesService.getWorkspaceMember(url, id);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '내 워크스페이스 가져오기' }),
    (0, common_1.Get)(),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getMyWorkspaces", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 만들기' }),
    (0, common_1.Post)(),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_b = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _b : Object, typeof (_c = typeof create_workspace_dto_1.CreateWorkspaceDto !== "undefined" && create_workspace_dto_1.CreateWorkspaceDto) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspace", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 멤버 가져오기' }),
    (0, common_1.Get)(':url/members'),
    __param(0, (0, common_1.Param)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMembers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 멤버 초대하기' }),
    (0, common_1.Post)(':url/members'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "createWorkspaceMembers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정멤버 가져오기' }),
    (0, common_1.Get)(':url/members/:id'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "getWorkspaceMember", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정멤버 가져오기' }),
    (0, common_1.Get)(':url/users/:id'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", Promise)
], WorkspacesController.prototype, "DEPRECATED_getWorkspaceUser", null);
WorkspacesController = __decorate([
    (0, swagger_1.ApiTags)('WORKSPACES'),
    (0, swagger_1.ApiCookieAuth)('connect.sid'),
    (0, common_1.UseGuards)(logged_in_guard_1.LoggedInGuard),
    (0, common_1.Controller)('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_d = typeof workspaces_service_1.WorkspacesService !== "undefined" && workspaces_service_1.WorkspacesService) === "function" ? _d : Object])
], WorkspacesController);
exports.WorkspacesController = WorkspacesController;


/***/ }),
/* 39 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateWorkspaceDto = void 0;
const swagger_1 = __webpack_require__(23);
class CreateWorkspaceDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '슬리액트',
        description: '워크스페이스명',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "workspace", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'sleact',
        description: 'url 주소',
    }),
    __metadata("design:type", String)
], CreateWorkspaceDto.prototype, "url", void 0);
exports.CreateWorkspaceDto = CreateWorkspaceDto;


/***/ }),
/* 40 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelsModule = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const ChannelChats_1 = __webpack_require__(16);
const ChannelMembers_1 = __webpack_require__(18);
const Channels_1 = __webpack_require__(17);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
const channels_service_1 = __webpack_require__(41);
const channels_controller_1 = __webpack_require__(42);
const events_module_1 = __webpack_require__(62);
let ChannelsModule = class ChannelsModule {
};
ChannelsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                Channels_1.Channels,
                ChannelChats_1.ChannelChats,
                Users_1.Users,
                Workspaces_1.Workspaces,
                ChannelMembers_1.ChannelMembers,
            ]),
            events_module_1.EventsModule,
        ],
        providers: [channels_service_1.ChannelsService],
        controllers: [channels_controller_1.ChannelsController],
    })
], ChannelsModule);
exports.ChannelsModule = ChannelsModule;


/***/ }),
/* 41 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelsService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(15);
const ChannelChats_1 = __webpack_require__(16);
const ChannelMembers_1 = __webpack_require__(18);
const Channels_1 = __webpack_require__(17);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
const events_gateway_1 = __webpack_require__(63);
let ChannelsService = class ChannelsService {
    constructor(channelsRepository, channelMembersRepository, workspacesRepository, channelChatsRepository, usersRepository, eventsGateway) {
        this.channelsRepository = channelsRepository;
        this.channelMembersRepository = channelMembersRepository;
        this.workspacesRepository = workspacesRepository;
        this.channelChatsRepository = channelChatsRepository;
        this.usersRepository = usersRepository;
        this.eventsGateway = eventsGateway;
    }
    async findById(id) {
        return this.channelsRepository.findOne({ where: { id } });
    }
    async getWorkspaceChannels(url, myId) {
        return this.channelsRepository
            .createQueryBuilder('channels')
            .innerJoinAndSelect('channels.ChannelMembers', 'channelMembers', 'channelMembers.userId = :myId', { myId })
            .innerJoinAndSelect('channels.Workspace', 'workspace', 'workspace.url = :url', { url })
            .getMany();
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
    }
    async createWorkspaceChannels(url, name, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const channel = new Channels_1.Channels();
        channel.name = name;
        channel.WorkspaceId = workspace.id;
        const channelReturned = await this.channelsRepository.save(channel);
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.UserId = myId;
        channelMember.ChannelId = channelReturned.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.usersRepository
            .createQueryBuilder('user')
            .innerJoin('user.Channels', 'channels', 'channels.name = :name', {
            name,
        })
            .innerJoin('channels.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getMany();
    }
    async createWorkspaceChannelMembers(url, name, email) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        if (!channel) {
            return null;
        }
        const user = await this.usersRepository
            .createQueryBuilder('user')
            .where('user.email = :email', { email })
            .innerJoin('user.Workspaces', 'workspace', 'workspace.url = :url', {
            url,
        })
            .getOne();
        if (!user) {
            return null;
        }
        const channelMember = new ChannelMembers_1.ChannelMembers();
        channelMember.ChannelId = channel.id;
        channelMember.UserId = user.id;
        await this.channelMembersRepository.save(channelMember);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelChatsRepository
            .createQueryBuilder('channelChats')
            .innerJoin('channelChats.Channel', 'channel', 'channel.name = :name', {
            name,
        })
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .innerJoinAndSelect('channelChats.User', 'user')
            .orderBy('channelChats.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceChannelChats(url, name, content, myId) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        const chats = new ChannelChats_1.ChannelChats();
        chats.content = content;
        chats.UserId = myId;
        chats.ChannelId = channel.id;
        const savedChat = await this.channelChatsRepository.save(chats);
        const chatWithUser = await this.channelChatsRepository.findOne({
            where: { id: savedChat.id },
            relations: ['User', 'Channel'],
        });
        this.eventsGateway.server
            .to(`/ws-${url}-${chatWithUser.ChannelId}`)
            .emit('message', chatWithUser);
    }
    async createWorkspaceChannelImages(url, name, files, myId) {
        console.log(files);
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        for (let i = 0; i < files.length; i++) {
            const chats = new ChannelChats_1.ChannelChats();
            chats.content = files[i].path;
            chats.UserId = myId;
            chats.ChannelId = channel.id;
            const savedChat = await this.channelChatsRepository.save(chats);
            const chatWithUser = await this.channelChatsRepository.findOne({
                where: { id: savedChat.id },
                relations: ['User', 'Channel'],
            });
            this.eventsGateway.server
                .to(`/ws-${url}-${chatWithUser.ChannelId}`)
                .emit('message', chatWithUser);
        }
    }
    async getChannelUnreadsCount(url, name, after) {
        const channel = await this.channelsRepository
            .createQueryBuilder('channel')
            .innerJoin('channel.Workspace', 'workspace', 'workspace.url = :url', {
            url,
        })
            .where('channel.name = :name', { name })
            .getOne();
        return this.channelChatsRepository.count({
            where: {
                ChannelId: channel.id,
                createdAt: (0, typeorm_2.MoreThan)(new Date(after)),
            },
        });
    }
};
ChannelsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Channels_1.Channels)),
    __param(1, (0, typeorm_1.InjectRepository)(ChannelMembers_1.ChannelMembers)),
    __param(2, (0, typeorm_1.InjectRepository)(Workspaces_1.Workspaces)),
    __param(3, (0, typeorm_1.InjectRepository)(ChannelChats_1.ChannelChats)),
    __param(4, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object, typeof (_d = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _d : Object, typeof (_e = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _e : Object, typeof (_f = typeof events_gateway_1.EventsGateway !== "undefined" && events_gateway_1.EventsGateway) === "function" ? _f : Object])
], ChannelsService);
exports.ChannelsService = ChannelsService;


/***/ }),
/* 42 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ChannelsController = void 0;
const common_1 = __webpack_require__(6);
const platform_express_1 = __webpack_require__(43);
const swagger_1 = __webpack_require__(23);
const fs_1 = __importDefault(__webpack_require__(44));
const multer_1 = __importDefault(__webpack_require__(45));
const path_1 = __importDefault(__webpack_require__(46));
const logged_in_guard_1 = __webpack_require__(34);
const user_decorator_1 = __webpack_require__(29);
const Users_1 = __webpack_require__(14);
const create_channel_dto_1 = __webpack_require__(47);
const channels_service_1 = __webpack_require__(41);
try {
    fs_1.default.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs_1.default.mkdirSync('uploads');
}
let ChannelsController = class ChannelsController {
    constructor(channelsService) {
        this.channelsService = channelsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.channelsService.getWorkspaceChannels(url, user.id);
    }
    async getWorkspaceChannel(url, name) {
        return this.channelsService.getWorkspaceChannel(url, name);
    }
    async createWorkspaceChannels(url, body, user) {
        return this.channelsService.createWorkspaceChannels(url, body.name, user.id);
    }
    async getWorkspaceChannelMembers(url, name) {
        return this.channelsService.getWorkspaceChannelMembers(url, name);
    }
    async createWorkspaceMembers(url, name, email) {
        return this.channelsService.createWorkspaceChannelMembers(url, name, email);
    }
    async getWorkspaceChannelChats(url, name, perPage, page) {
        return this.channelsService.getWorkspaceChannelChats(url, name, perPage, page);
    }
    async createWorkspaceChannelChats(url, name, content, user) {
        return this.channelsService.createWorkspaceChannelChats(url, name, content, user.id);
    }
    async createWorkspaceChannelImages(url, name, files, user) {
        return this.channelsService.createWorkspaceChannelImages(url, name, files, user.id);
    }
    async getUnreads(url, name, after) {
        return this.channelsService.getChannelUnreadsCount(url, name, after);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 채널 모두 가져오기' }),
    (0, common_1.Get)(':url/channels'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannels", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 채널 가져오기' }),
    (0, common_1.Get)(':url/channels/:name'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannel", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 채널 만들기' }),
    (0, common_1.Post)(':url/channels'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof create_channel_dto_1.CreateChannelDto !== "undefined" && create_channel_dto_1.CreateChannelDto) === "function" ? _b : Object, typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannels", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 채널 멤버 가져오기' }),
    (0, common_1.Get)(':url/channels/:name/members'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelMembers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 채널 멤버 초대하기' }),
    (0, common_1.Post)(':url/channels/:name/members'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceMembers", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 채널 채팅 모두 가져오기' }),
    (0, common_1.Get)(':url/channels/:name/chats'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Query)('perPage', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Query)('page', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getWorkspaceChannelChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 채널 채팅 생성하기' }),
    (0, common_1.Post)(':url/channels/:name/chats'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Body)('content')),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 채널 이미지 업로드하기' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FilesInterceptor)('image', 10, {
        storage: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path_1.default.extname(file.originalname);
                cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, common_1.Post)(':url/channels/:name/images'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Array, typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "createWorkspaceChannelImages", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '안 읽은 개수 가져오기' }),
    (0, common_1.Get)(':url/channels/:name/unreads'),
    __param(0, (0, common_1.Param)('url')),
    __param(1, (0, common_1.Param)('name')),
    __param(2, (0, common_1.Query)('after', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Number]),
    __metadata("design:returntype", Promise)
], ChannelsController.prototype, "getUnreads", null);
ChannelsController = __decorate([
    (0, swagger_1.ApiTags)('CHANNELS'),
    (0, swagger_1.ApiCookieAuth)('connect.sid'),
    (0, common_1.UseGuards)(logged_in_guard_1.LoggedInGuard),
    (0, common_1.Controller)('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_f = typeof channels_service_1.ChannelsService !== "undefined" && channels_service_1.ChannelsService) === "function" ? _f : Object])
], ChannelsController);
exports.ChannelsController = ChannelsController;


/***/ }),
/* 43 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/platform-express");

/***/ }),
/* 44 */
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),
/* 45 */
/***/ ((module) => {

"use strict";
module.exports = require("multer");

/***/ }),
/* 46 */
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),
/* 47 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CreateChannelDto = void 0;
const swagger_1 = __webpack_require__(23);
class CreateChannelDto {
}
__decorate([
    (0, swagger_1.ApiProperty)({
        example: '수다방',
        description: '채널명',
    }),
    __metadata("design:type", String)
], CreateChannelDto.prototype, "name", void 0);
exports.CreateChannelDto = CreateChannelDto;


/***/ }),
/* 48 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DMsModule = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const DMs_1 = __webpack_require__(20);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
const dms_controller_1 = __webpack_require__(49);
const dms_service_1 = __webpack_require__(50);
let DMsModule = class DMsModule {
};
DMsModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([DMs_1.DMs, Users_1.Users, Workspaces_1.Workspaces])],
        controllers: [dms_controller_1.DMsController],
        providers: [dms_service_1.DMsService],
    })
], DMsModule);
exports.DMsModule = DMsModule;


/***/ }),
/* 49 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d, _e, _f;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DMsController = void 0;
const common_1 = __webpack_require__(6);
const common_2 = __webpack_require__(6);
const platform_express_1 = __webpack_require__(43);
const swagger_1 = __webpack_require__(23);
const fs = __importStar(__webpack_require__(44));
const multer_1 = __importDefault(__webpack_require__(45));
const path_1 = __importDefault(__webpack_require__(46));
const logged_in_guard_1 = __webpack_require__(34);
const user_decorator_1 = __webpack_require__(29);
const Users_1 = __webpack_require__(14);
const dms_service_1 = __webpack_require__(50);
try {
    fs.readdirSync('uploads');
}
catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
let DMsController = class DMsController {
    constructor(dmsService) {
        this.dmsService = dmsService;
    }
    async getWorkspaceChannels(url, user) {
        return this.dmsService.getWorkspaceDMs(url, user.id);
    }
    async getWorkspaceDMChats(url, id, perPage, page, user) {
        return this.dmsService.getWorkspaceDMChats(url, id, user.id, perPage, page);
    }
    async createWorkspaceDMChats(url, id, content, user) {
        return this.dmsService.createWorkspaceDMChats(url, content, id, user.id);
    }
    async createWorkspaceDMImages(url, id, user) {
    }
    async getUnreads(url, id, after, user) {
        return this.dmsService.getDMUnreadsCount(url, id, user.id, after);
    }
};
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 DM 모두 가져오기' }),
    (0, common_2.Get)(':url/dms'),
    __param(0, (0, common_2.Param)('url')),
    __param(1, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_a = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _a : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceChannels", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 DM 채팅 모두 가져오기' }),
    (0, common_2.Get)(':url/dms/:id/chats'),
    __param(0, (0, common_2.Param)('url')),
    __param(1, (0, common_2.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_2.Query)('perPage', common_1.ParseIntPipe)),
    __param(3, (0, common_2.Query)('page', common_1.ParseIntPipe)),
    __param(4, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, Number, typeof (_b = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _b : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getWorkspaceDMChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 DM 채팅 생성하기' }),
    (0, common_2.Post)(':url/dms/:id/chats'),
    __param(0, (0, common_2.Param)('url')),
    __param(1, (0, common_2.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_2.Body)('content')),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object, typeof (_c = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _c : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMChats", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '워크스페이스 특정 DM 이미지 업로드하기' }),
    (0, common_2.UseInterceptors)((0, platform_express_1.FilesInterceptor)('image', 10, {
        storage: multer_1.default.diskStorage({
            destination(req, file, cb) {
                cb(null, 'uploads/');
            },
            filename(req, file, cb) {
                const ext = path_1.default.extname(file.originalname);
                cb(null, path_1.default.basename(file.originalname, ext) + Date.now() + ext);
            },
        }),
        limits: { fileSize: 5 * 1024 * 1024 },
    })),
    (0, common_2.Post)(':url/dms/:id/images'),
    __param(0, (0, common_2.Param)('url')),
    __param(1, (0, common_2.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, typeof (_d = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _d : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "createWorkspaceDMImages", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: '안 읽은 개수 가져오기' }),
    (0, common_2.Get)(':url/dms/:id/unreads'),
    __param(0, (0, common_2.Param)('url')),
    __param(1, (0, common_2.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_2.Query)('after', common_1.ParseIntPipe)),
    __param(3, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, typeof (_e = typeof Users_1.Users !== "undefined" && Users_1.Users) === "function" ? _e : Object]),
    __metadata("design:returntype", Promise)
], DMsController.prototype, "getUnreads", null);
DMsController = __decorate([
    (0, swagger_1.ApiTags)('DMS'),
    (0, swagger_1.ApiCookieAuth)('connect.sid'),
    (0, common_2.UseGuards)(logged_in_guard_1.LoggedInGuard),
    (0, common_2.Controller)('api/workspaces'),
    __metadata("design:paramtypes", [typeof (_f = typeof dms_service_1.DMsService !== "undefined" && dms_service_1.DMsService) === "function" ? _f : Object])
], DMsController);
exports.DMsController = DMsController;


/***/ }),
/* 50 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DMsService = void 0;
const common_1 = __webpack_require__(6);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(15);
const DMs_1 = __webpack_require__(20);
const Users_1 = __webpack_require__(14);
const Workspaces_1 = __webpack_require__(19);
function getKeyByValue(object, value) {
    return Object.keys(object).find((key) => object[key] === value);
}
let DMsService = class DMsService {
    constructor(workspacesRepository, dmsRepository, usersRepository) {
        this.workspacesRepository = workspacesRepository;
        this.dmsRepository = dmsRepository;
        this.usersRepository = usersRepository;
    }
    async getWorkspaceDMs(url, myId) {
        return (this.usersRepository
            .createQueryBuilder('user')
            .leftJoin('user.dms', 'dms', 'dms.senderId = :myId', { myId })
            .leftJoin('dms', 'workspace', 'workspace.url = :url', { url })
            .getMany());
    }
    async getWorkspaceDMChats(url, id, myId, perPage, page) {
        return this.dmsRepository
            .createQueryBuilder('dms')
            .innerJoinAndSelect('dms.Sender', 'sender')
            .innerJoinAndSelect('dms.Receiver', 'receiver')
            .innerJoin('dms.Workspace', 'workspace')
            .where('workspace.url = :url', { url })
            .andWhere('((dms.SenderId = :myId AND dms.ReceiverId = :id) OR (dms.ReceiverId = :myId AND dms.SenderId = :id))', { id, myId })
            .orderBy('dms.createdAt', 'DESC')
            .take(perPage)
            .skip(perPage * (page - 1))
            .getMany();
    }
    async createWorkspaceDMChats(url, content, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        const dm = new DMs_1.DMs();
        dm.SenderId = myId;
        dm.ReceiverId = id;
        dm.content = content;
        dm.WorkspaceId = workspace.id;
        const savedDm = await this.dmsRepository.save(dm);
        const dmWithSender = await this.dmsRepository.findOne({
            where: { id: savedDm.id },
            relations: ['Sender'],
        });
    }
    async createWorkspaceDMImages(url, id, myId) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
    }
    async getDMUnreadsCount(url, id, myId, after) {
        const workspace = await this.workspacesRepository.findOne({
            where: { url },
        });
        return this.dmsRepository.count({
            where: {
                WorkspaceId: workspace.id,
                SenderId: id,
                ReceiverId: myId,
                createdAt: (0, typeorm_2.MoreThan)(new Date(after)),
            },
        });
    }
};
DMsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Workspaces_1.Workspaces)),
    __param(1, (0, typeorm_1.InjectRepository)(DMs_1.DMs)),
    __param(2, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object, typeof (_c = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _c : Object])
], DMsService);
exports.DMsService = DMsService;


/***/ }),
/* 51 */
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const ChannelChats_1 = __webpack_require__(16);
const ChannelMembers_1 = __webpack_require__(18);
const Channels_1 = __webpack_require__(17);
const DMs_1 = __webpack_require__(20);
const Mentions_1 = __webpack_require__(21);
const Users_1 = __webpack_require__(14);
const WorkspaceMembers_1 = __webpack_require__(22);
const Workspaces_1 = __webpack_require__(19);
const dotenv_1 = __importDefault(__webpack_require__(52));
dotenv_1.default.config();
const config = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        ChannelChats_1.ChannelChats,
        ChannelMembers_1.ChannelMembers,
        Channels_1.Channels,
        DMs_1.DMs,
        Mentions_1.Mentions,
        Users_1.Users,
        WorkspaceMembers_1.WorkspaceMembers,
        Workspaces_1.Workspaces,
    ],
    migrations: [__dirname + 'src/migrations/*.ts'],
    cli: { migrationsDir: 'src/migrations' },
    autoLoadEntities: true,
    charset: 'utf8mb4',
    synchronize: false,
    logging: true,
    keepConnectionAlive: true,
};
module.exports = config;


/***/ }),
/* 52 */
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");

/***/ }),
/* 53 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthModule = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(33);
const typeorm_1 = __webpack_require__(13);
const Users_1 = __webpack_require__(14);
const auth_service_1 = __webpack_require__(54);
const local_serializer_1 = __webpack_require__(55);
const local_strategy_1 = __webpack_require__(56);
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            passport_1.PassportModule.register({ session: true }),
            typeorm_1.TypeOrmModule.forFeature([Users_1.Users]),
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, local_serializer_1.LocalSerializer],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),
/* 54 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AuthService = void 0;
const common_1 = __webpack_require__(6);
const bcrypt_1 = __importDefault(__webpack_require__(25));
const typeorm_1 = __webpack_require__(13);
const Users_1 = __webpack_require__(14);
const typeorm_2 = __webpack_require__(15);
let AuthService = class AuthService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async validateUser(email, password) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: ['id', 'email', 'password', 'nickname'],
        });
        console.log('auth_service_log', email, password, user);
        if (!user) {
            return null;
        }
        const result = await bcrypt_1.default.compare(password, user.password);
        if (result) {
            const { password } = user, userWithoutPassword = __rest(user, ["password"]);
            console.log('auth_service_log2', user, result);
            return userWithoutPassword;
        }
        return null;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _a : Object])
], AuthService);
exports.AuthService = AuthService;


/***/ }),
/* 55 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalSerializer = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(33);
const typeorm_1 = __webpack_require__(13);
const typeorm_2 = __webpack_require__(15);
const Users_1 = __webpack_require__(14);
const auth_service_1 = __webpack_require__(54);
let LocalSerializer = class LocalSerializer extends passport_1.PassportSerializer {
    constructor(authService, usersRepository) {
        super();
        this.authService = authService;
        this.usersRepository = usersRepository;
    }
    serializeUser(user, done) {
        console.log('serial', user);
        done(null, user.id);
    }
    async deserializeUser(userId, done) {
        return await this.usersRepository
            .findOneOrFail({
            id: +userId,
        }, {
            select: ['id', 'email', 'nickname'],
            relations: ['Workspaces'],
        })
            .then((user) => {
            console.log('user', user);
            done(null, user);
        })
            .catch((error) => {
            console.log('deserialize', error);
            done(error);
        });
    }
};
LocalSerializer = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_1.InjectRepository)(Users_1.Users)),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object, typeof (_b = typeof typeorm_2.Repository !== "undefined" && typeorm_2.Repository) === "function" ? _b : Object])
], LocalSerializer);
exports.LocalSerializer = LocalSerializer;


/***/ }),
/* 56 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LocalStrategy = void 0;
const common_1 = __webpack_require__(6);
const passport_1 = __webpack_require__(33);
const passport_local_1 = __webpack_require__(57);
const auth_service_1 = __webpack_require__(54);
let LocalStrategy = class LocalStrategy extends (0, passport_1.PassportStrategy)(passport_local_1.Strategy) {
    constructor(authService) {
        super({ usernameField: 'email', passwordField: 'password' });
        this.authService = authService;
    }
    async validate(email, password, done) {
        const user = await this.authService.validateUser(email, password);
        console.log('strategy-log', user);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return done(null, user);
    }
};
LocalStrategy = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeof (_a = typeof auth_service_1.AuthService !== "undefined" && auth_service_1.AuthService) === "function" ? _a : Object])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),
/* 57 */
/***/ ((module) => {

"use strict";
module.exports = require("passport-local");

/***/ }),
/* 58 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpExceptionFilter = void 0;
const common_1 = __webpack_require__(6);
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(exception, host) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const status = exception.getStatus();
        const err = exception.getResponse();
        if (typeof err !== 'string' && err.statusCode === 400) {
            return response.status(status).json({
                success: false,
                code: status,
                data: err.message,
            });
        }
        response.status(status).json({
            success: false,
            code: status,
            data: err.message,
        });
    }
};
HttpExceptionFilter = __decorate([
    (0, common_1.Catch)(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),
/* 59 */
/***/ ((module) => {

"use strict";
module.exports = require("passport");

/***/ }),
/* 60 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie-parser");

/***/ }),
/* 61 */
/***/ ((module) => {

"use strict";
module.exports = require("express-session");

/***/ }),
/* 62 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsModule = void 0;
const common_1 = __webpack_require__(6);
const events_gateway_1 = __webpack_require__(63);
let EventsModule = class EventsModule {
};
EventsModule = __decorate([
    (0, common_1.Module)({
        providers: [events_gateway_1.EventsGateway],
        exports: [events_gateway_1.EventsGateway],
    })
], EventsModule);
exports.EventsModule = EventsModule;


/***/ }),
/* 63 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.EventsGateway = void 0;
const websockets_1 = __webpack_require__(64);
const socket_io_1 = __webpack_require__(95);
const onlineMap_1 = __webpack_require__(141);
let EventsGateway = class EventsGateway {
    handleTest(data) {
        console.log('test', data);
    }
    handleLogin(data, socket) {
        const newNamespace = socket.nsp;
        console.log('login', newNamespace);
        onlineMap_1.onlineMap[socket.nsp.name][socket.id] = data.id;
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
        data.channels.forEach((channel) => {
            console.log('join', socket.nsp.name, channel);
            socket.join(`${socket.nsp.name}-${channel}`);
        });
    }
    afterInit(server) {
        console.log('init');
    }
    handleConnection(socket) {
        console.log('connected', socket.nsp.name);
        if (!onlineMap_1.onlineMap[socket.nsp.name]) {
            onlineMap_1.onlineMap[socket.nsp.name] = {};
        }
        socket.emit('hello', socket.nsp.name);
    }
    handleDisconnect(socket) {
        console.log('disconnected', socket.nsp.name);
        const newNamespace = socket.nsp;
        delete onlineMap_1.onlineMap[socket.nsp.name][socket.id];
        newNamespace.emit('onlineList', Object.values(onlineMap_1.onlineMap[socket.nsp.name]));
    }
};
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", typeof (_a = typeof socket_io_1.Server !== "undefined" && socket_io_1.Server) === "function" ? _a : Object)
], EventsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('test'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleTest", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('login'),
    __param(0, (0, websockets_1.MessageBody)()),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, typeof (_b = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _b : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleLogin", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_c = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _c : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleConnection", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_d = typeof socket_io_1.Socket !== "undefined" && socket_io_1.Socket) === "function" ? _d : Object]),
    __metadata("design:returntype", void 0)
], EventsGateway.prototype, "handleDisconnect", null);
EventsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ namespace: /\/ws-.+/ })
], EventsGateway);
exports.EventsGateway = EventsGateway;


/***/ }),
/* 64 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
/*
 * Nest @websockets
 * Copyright(c) 2017 - 2021 Kamil Mysliwiec
 * https://nestjs.com
 * MIT Licensed
 */
__webpack_require__(66);
tslib_1.__exportStar(__webpack_require__(67), exports);
tslib_1.__exportStar(__webpack_require__(72), exports);
tslib_1.__exportStar(__webpack_require__(81), exports);
tslib_1.__exportStar(__webpack_require__(83), exports);
tslib_1.__exportStar(__webpack_require__(86), exports);


/***/ }),
/* 65 */
/***/ ((module) => {

"use strict";
module.exports = require("tslib");

/***/ }),
/* 66 */
/***/ ((module) => {

"use strict";
module.exports = require("reflect-metadata");

/***/ }),
/* 67 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(68), exports);


/***/ }),
/* 68 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.AbstractWsAdapter = void 0;
const shared_utils_1 = __webpack_require__(69);
const core_1 = __webpack_require__(4);
const constants_1 = __webpack_require__(70);
class AbstractWsAdapter {
    constructor(appOrHttpServer) {
        if (appOrHttpServer && appOrHttpServer instanceof core_1.NestApplication) {
            this.httpServer = appOrHttpServer.getUnderlyingHttpServer();
        }
        else {
            this.httpServer = appOrHttpServer;
        }
    }
    bindClientConnect(server, callback) {
        server.on(constants_1.CONNECTION_EVENT, callback);
    }
    bindClientDisconnect(client, callback) {
        client.on(constants_1.DISCONNECT_EVENT, callback);
    }
    async close(server) {
        const isCallable = server && (0, shared_utils_1.isFunction)(server.close);
        isCallable && (await new Promise(resolve => server.close(resolve)));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    async dispose() { }
}
exports.AbstractWsAdapter = AbstractWsAdapter;


/***/ }),
/* 69 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/utils/shared.utils");

/***/ }),
/* 70 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ERROR_EVENT = exports.CLOSE_EVENT = exports.DISCONNECT_EVENT = exports.CONNECTION_EVENT = exports.PARAM_ARGS_METADATA = exports.GATEWAY_OPTIONS = exports.PORT_METADATA = exports.NAMESPACE_METADATA = exports.GATEWAY_METADATA = exports.GATEWAY_SERVER_METADATA = exports.MESSAGE_METADATA = exports.MESSAGE_MAPPING_METADATA = void 0;
const constants_1 = __webpack_require__(71);
exports.MESSAGE_MAPPING_METADATA = 'websockets:message_mapping';
exports.MESSAGE_METADATA = 'message';
exports.GATEWAY_SERVER_METADATA = 'websockets:is_socket';
exports.GATEWAY_METADATA = 'websockets:is_gateway';
exports.NAMESPACE_METADATA = 'namespace';
exports.PORT_METADATA = 'port';
exports.GATEWAY_OPTIONS = 'websockets:gateway_options';
exports.PARAM_ARGS_METADATA = constants_1.ROUTE_ARGS_METADATA;
exports.CONNECTION_EVENT = 'connection';
exports.DISCONNECT_EVENT = 'disconnect';
exports.CLOSE_EVENT = 'close';
exports.ERROR_EVENT = 'error';


/***/ }),
/* 71 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/constants");

/***/ }),
/* 72 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(73), exports);
tslib_1.__exportStar(__webpack_require__(77), exports);
tslib_1.__exportStar(__webpack_require__(78), exports);
tslib_1.__exportStar(__webpack_require__(79), exports);
tslib_1.__exportStar(__webpack_require__(80), exports);


/***/ }),
/* 73 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ConnectedSocket = void 0;
const ws_paramtype_enum_1 = __webpack_require__(74);
const param_utils_1 = __webpack_require__(75);
exports.ConnectedSocket = (0, param_utils_1.createWsParamDecorator)(ws_paramtype_enum_1.WsParamtype.SOCKET);


/***/ }),
/* 74 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsParamtype = void 0;
var WsParamtype;
(function (WsParamtype) {
    WsParamtype[WsParamtype["SOCKET"] = 0] = "SOCKET";
    WsParamtype[WsParamtype["PAYLOAD"] = 3] = "PAYLOAD";
})(WsParamtype = exports.WsParamtype || (exports.WsParamtype = {}));


/***/ }),
/* 75 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPipesWsParamDecorator = exports.createWsParamDecorator = void 0;
const route_params_decorator_1 = __webpack_require__(76);
const shared_utils_1 = __webpack_require__(69);
__webpack_require__(66);
const constants_1 = __webpack_require__(70);
function createWsParamDecorator(paramtype) {
    return (...pipes) => (target, key, index) => {
        const args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
        Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, (0, route_params_decorator_1.assignMetadata)(args, paramtype, index, undefined, ...pipes), target.constructor, key);
    };
}
exports.createWsParamDecorator = createWsParamDecorator;
const createPipesWsParamDecorator = (paramtype) => (data, ...pipes) => (target, key, index) => {
    const args = Reflect.getMetadata(constants_1.PARAM_ARGS_METADATA, target.constructor, key) || {};
    const hasParamData = (0, shared_utils_1.isNil)(data) || (0, shared_utils_1.isString)(data);
    const paramData = hasParamData ? data : undefined;
    const paramPipes = hasParamData ? pipes : [data, ...pipes];
    Reflect.defineMetadata(constants_1.PARAM_ARGS_METADATA, (0, route_params_decorator_1.assignMetadata)(args, paramtype, index, paramData, ...paramPipes), target.constructor, key);
};
exports.createPipesWsParamDecorator = createPipesWsParamDecorator;


/***/ }),
/* 76 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/common/decorators/http/route-params.decorator");

/***/ }),
/* 77 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketServer = void 0;
const constants_1 = __webpack_require__(70);
/**
 * Attaches native Web Socket Server to a given property.
 */
const WebSocketServer = () => {
    return (target, propertyKey) => {
        Reflect.set(target, propertyKey, null);
        Reflect.defineMetadata(constants_1.GATEWAY_SERVER_METADATA, true, target, propertyKey);
    };
};
exports.WebSocketServer = WebSocketServer;


/***/ }),
/* 78 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageBody = void 0;
const ws_paramtype_enum_1 = __webpack_require__(74);
const param_utils_1 = __webpack_require__(75);
function MessageBody(propertyOrPipe, ...pipes) {
    return (0, param_utils_1.createPipesWsParamDecorator)(ws_paramtype_enum_1.WsParamtype.PAYLOAD)(propertyOrPipe, ...pipes);
}
exports.MessageBody = MessageBody;


/***/ }),
/* 79 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocketGateway = void 0;
const constants_1 = __webpack_require__(70);
function WebSocketGateway(portOrOptions, options) {
    const isPortInt = Number.isInteger(portOrOptions);
    // eslint-disable-next-line prefer-const
    let [port, opt] = isPortInt ? [portOrOptions, options] : [0, portOrOptions];
    opt = opt || {};
    return (target) => {
        Reflect.defineMetadata(constants_1.GATEWAY_METADATA, true, target);
        Reflect.defineMetadata(constants_1.PORT_METADATA, port, target);
        Reflect.defineMetadata(constants_1.GATEWAY_OPTIONS, opt, target);
    };
}
exports.WebSocketGateway = WebSocketGateway;


/***/ }),
/* 80 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SubscribeMessage = void 0;
const constants_1 = __webpack_require__(70);
/**
 * Subscribes to messages that fulfils chosen pattern.
 */
const SubscribeMessage = (message) => {
    return (target, key, descriptor) => {
        Reflect.defineMetadata(constants_1.MESSAGE_MAPPING_METADATA, true, descriptor.value);
        Reflect.defineMetadata(constants_1.MESSAGE_METADATA, message, descriptor.value);
        return descriptor;
    };
};
exports.SubscribeMessage = SubscribeMessage;


/***/ }),
/* 81 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(82), exports);


/***/ }),
/* 82 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WsException = void 0;
const shared_utils_1 = __webpack_require__(69);
class WsException extends Error {
    constructor(error) {
        super();
        this.error = error;
        this.initMessage();
    }
    initMessage() {
        if ((0, shared_utils_1.isString)(this.error)) {
            this.message = this.error;
        }
        else if ((0, shared_utils_1.isObject)(this.error) &&
            (0, shared_utils_1.isString)(this.error.message)) {
            this.message = this.error.message;
        }
        else if (this.constructor) {
            this.message = this.constructor.name
                .match(/[A-Z][a-z]+|[0-9]+/g)
                .join(' ');
        }
    }
    getError() {
        return this.error;
    }
}
exports.WsException = WsException;


/***/ }),
/* 83 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(84), exports);


/***/ }),
/* 84 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BaseWsExceptionFilter = void 0;
const common_1 = __webpack_require__(6);
const shared_utils_1 = __webpack_require__(69);
const constants_1 = __webpack_require__(85);
const ws_exception_1 = __webpack_require__(82);
class BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        this.handleError(client, exception);
    }
    handleError(client, exception) {
        if (!(exception instanceof ws_exception_1.WsException)) {
            return this.handleUnknownError(exception, client);
        }
        const status = 'error';
        const result = exception.getError();
        const message = (0, shared_utils_1.isObject)(result)
            ? result
            : {
                status,
                message: result,
            };
        client.emit('exception', message);
    }
    handleUnknownError(exception, client) {
        const status = 'error';
        client.emit('exception', {
            status,
            message: constants_1.MESSAGES.UNKNOWN_EXCEPTION_MESSAGE,
        });
        if (this.isExceptionObject(exception)) {
            return BaseWsExceptionFilter.logger.error(exception.message, exception.stack);
        }
        return BaseWsExceptionFilter.logger.error(exception);
    }
    isExceptionObject(err) {
        return (0, shared_utils_1.isObject)(err) && !!err.message;
    }
}
exports.BaseWsExceptionFilter = BaseWsExceptionFilter;
BaseWsExceptionFilter.logger = new common_1.Logger('WsExceptionsHandler');


/***/ }),
/* 85 */
/***/ ((module) => {

"use strict";
module.exports = require("@nestjs/core/constants");

/***/ }),
/* 86 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(87), exports);
tslib_1.__exportStar(__webpack_require__(88), exports);
tslib_1.__exportStar(__webpack_require__(92), exports);
tslib_1.__exportStar(__webpack_require__(93), exports);
tslib_1.__exportStar(__webpack_require__(94), exports);


/***/ }),
/* 87 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/**
 * @external https://github.com/socketio/socket.io/blob/master/lib/index.ts
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 88 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const tslib_1 = __webpack_require__(65);
tslib_1.__exportStar(__webpack_require__(89), exports);
tslib_1.__exportStar(__webpack_require__(90), exports);
tslib_1.__exportStar(__webpack_require__(91), exports);


/***/ }),
/* 89 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 90 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 91 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 92 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 93 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 94 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));


/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Namespace = exports.Socket = exports.Server = void 0;
const http = __webpack_require__(96);
const fs_1 = __webpack_require__(44);
const zlib_1 = __webpack_require__(97);
const accepts = __webpack_require__(98);
const stream_1 = __webpack_require__(99);
const path = __webpack_require__(46);
const engine_io_1 = __webpack_require__(100);
const client_1 = __webpack_require__(128);
const events_1 = __webpack_require__(109);
const namespace_1 = __webpack_require__(133);
Object.defineProperty(exports, "Namespace", ({ enumerable: true, get: function () { return namespace_1.Namespace; } }));
const parent_namespace_1 = __webpack_require__(137);
const socket_io_adapter_1 = __webpack_require__(138);
const parser = __importStar(__webpack_require__(129));
const debug_1 = __importDefault(__webpack_require__(116));
const socket_1 = __webpack_require__(134);
Object.defineProperty(exports, "Socket", ({ enumerable: true, get: function () { return socket_1.Socket; } }));
const typed_events_1 = __webpack_require__(135);
const uws_js_1 = __webpack_require__(139);
const debug = (0, debug_1.default)("socket.io:server");
const clientVersion = (__webpack_require__(140).version);
const dotMapRegex = /\.map/;
class Server extends typed_events_1.StrictEventEmitter {
    constructor(srv, opts = {}) {
        super();
        /**
         * @private
         */
        this._nsps = new Map();
        this.parentNsps = new Map();
        if ("object" === typeof srv &&
            srv instanceof Object &&
            !srv.listen) {
            opts = srv;
            srv = undefined;
        }
        this.path(opts.path || "/socket.io");
        this.connectTimeout(opts.connectTimeout || 45000);
        this.serveClient(false !== opts.serveClient);
        this._parser = opts.parser || parser;
        this.encoder = new this._parser.Encoder();
        this.adapter(opts.adapter || socket_io_adapter_1.Adapter);
        this.sockets = this.of("/");
        this.opts = opts;
        if (srv || typeof srv == "number")
            this.attach(srv);
    }
    serveClient(v) {
        if (!arguments.length)
            return this._serveClient;
        this._serveClient = v;
        return this;
    }
    /**
     * Executes the middleware for an incoming namespace not already created on the server.
     *
     * @param name - name of incoming namespace
     * @param auth - the auth parameters
     * @param fn - callback
     *
     * @private
     */
    _checkNamespace(name, auth, fn) {
        if (this.parentNsps.size === 0)
            return fn(false);
        const keysIterator = this.parentNsps.keys();
        const run = () => {
            const nextFn = keysIterator.next();
            if (nextFn.done) {
                return fn(false);
            }
            nextFn.value(name, auth, (err, allow) => {
                if (err || !allow) {
                    return run();
                }
                if (this._nsps.has(name)) {
                    // the namespace was created in the meantime
                    debug("dynamic namespace %s already exists", name);
                    return fn(this._nsps.get(name));
                }
                const namespace = this.parentNsps.get(nextFn.value).createChild(name);
                debug("dynamic namespace %s was created", name);
                // @ts-ignore
                this.sockets.emitReserved("new_namespace", namespace);
                fn(namespace);
            });
        };
        run();
    }
    path(v) {
        if (!arguments.length)
            return this._path;
        this._path = v.replace(/\/$/, "");
        const escapedPath = this._path.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
        this.clientPathRegex = new RegExp("^" +
            escapedPath +
            "/socket\\.io(\\.msgpack|\\.esm)?(\\.min)?\\.js(\\.map)?(?:\\?|$)");
        return this;
    }
    connectTimeout(v) {
        if (v === undefined)
            return this._connectTimeout;
        this._connectTimeout = v;
        return this;
    }
    adapter(v) {
        if (!arguments.length)
            return this._adapter;
        this._adapter = v;
        for (const nsp of this._nsps.values()) {
            nsp._initAdapter();
        }
        return this;
    }
    /**
     * Attaches socket.io to a server or port.
     *
     * @param srv - server or port
     * @param opts - options passed to engine.io
     * @return self
     * @public
     */
    listen(srv, opts = {}) {
        return this.attach(srv, opts);
    }
    /**
     * Attaches socket.io to a server or port.
     *
     * @param srv - server or port
     * @param opts - options passed to engine.io
     * @return self
     * @public
     */
    attach(srv, opts = {}) {
        if ("function" == typeof srv) {
            const msg = "You are trying to attach socket.io to an express " +
                "request handler function. Please pass a http.Server instance.";
            throw new Error(msg);
        }
        // handle a port as a string
        if (Number(srv) == srv) {
            srv = Number(srv);
        }
        if ("number" == typeof srv) {
            debug("creating http server and binding to %d", srv);
            const port = srv;
            srv = http.createServer((req, res) => {
                res.writeHead(404);
                res.end();
            });
            srv.listen(port);
        }
        // merge the options passed to the Socket.IO server
        Object.assign(opts, this.opts);
        // set engine.io path to `/socket.io`
        opts.path = opts.path || this._path;
        this.initEngine(srv, opts);
        return this;
    }
    attachApp(app /*: TemplatedApp */, opts = {}) {
        // merge the options passed to the Socket.IO server
        Object.assign(opts, this.opts);
        // set engine.io path to `/socket.io`
        opts.path = opts.path || this._path;
        // initialize engine
        debug("creating uWebSockets.js-based engine with opts %j", opts);
        const engine = new engine_io_1.uServer(opts);
        engine.attach(app, opts);
        // bind to engine events
        this.bind(engine);
        if (this._serveClient) {
            // attach static file serving
            app.get(`${this._path}/*`, (res, req) => {
                if (!this.clientPathRegex.test(req.getUrl())) {
                    req.setYield(true);
                    return;
                }
                const filename = req
                    .getUrl()
                    .replace(this._path, "")
                    .replace(/\?.*$/, "")
                    .replace(/^\//, "");
                const isMap = dotMapRegex.test(filename);
                const type = isMap ? "map" : "source";
                // Per the standard, ETags must be quoted:
                // https://tools.ietf.org/html/rfc7232#section-2.3
                const expectedEtag = '"' + clientVersion + '"';
                const weakEtag = "W/" + expectedEtag;
                const etag = req.getHeader("if-none-match");
                if (etag) {
                    if (expectedEtag === etag || weakEtag === etag) {
                        debug("serve client %s 304", type);
                        res.writeStatus("304 Not Modified");
                        res.end();
                        return;
                    }
                }
                debug("serve client %s", type);
                res.writeHeader("cache-control", "public, max-age=0");
                res.writeHeader("content-type", "application/" + (isMap ? "json" : "javascript"));
                res.writeHeader("etag", expectedEtag);
                const filepath = path.join(__dirname, "../client-dist/", filename);
                (0, uws_js_1.serveFile)(res, filepath);
            });
        }
        (0, uws_js_1.patchAdapter)(app);
    }
    /**
     * Initialize engine
     *
     * @param srv - the server to attach to
     * @param opts - options passed to engine.io
     * @private
     */
    initEngine(srv, opts) {
        // initialize engine
        debug("creating engine.io instance with opts %j", opts);
        this.eio = (0, engine_io_1.attach)(srv, opts);
        // attach static file serving
        if (this._serveClient)
            this.attachServe(srv);
        // Export http server
        this.httpServer = srv;
        // bind to engine events
        this.bind(this.eio);
    }
    /**
     * Attaches the static file serving.
     *
     * @param srv http server
     * @private
     */
    attachServe(srv) {
        debug("attaching client serving req handler");
        const evs = srv.listeners("request").slice(0);
        srv.removeAllListeners("request");
        srv.on("request", (req, res) => {
            if (this.clientPathRegex.test(req.url)) {
                this.serve(req, res);
            }
            else {
                for (let i = 0; i < evs.length; i++) {
                    evs[i].call(srv, req, res);
                }
            }
        });
    }
    /**
     * Handles a request serving of client source and map
     *
     * @param req
     * @param res
     * @private
     */
    serve(req, res) {
        const filename = req.url.replace(this._path, "").replace(/\?.*$/, "");
        const isMap = dotMapRegex.test(filename);
        const type = isMap ? "map" : "source";
        // Per the standard, ETags must be quoted:
        // https://tools.ietf.org/html/rfc7232#section-2.3
        const expectedEtag = '"' + clientVersion + '"';
        const weakEtag = "W/" + expectedEtag;
        const etag = req.headers["if-none-match"];
        if (etag) {
            if (expectedEtag === etag || weakEtag === etag) {
                debug("serve client %s 304", type);
                res.writeHead(304);
                res.end();
                return;
            }
        }
        debug("serve client %s", type);
        res.setHeader("Cache-Control", "public, max-age=0");
        res.setHeader("Content-Type", "application/" + (isMap ? "json" : "javascript"));
        res.setHeader("ETag", expectedEtag);
        Server.sendFile(filename, req, res);
    }
    /**
     * @param filename
     * @param req
     * @param res
     * @private
     */
    static sendFile(filename, req, res) {
        const readStream = (0, fs_1.createReadStream)(path.join(__dirname, "../client-dist/", filename));
        const encoding = accepts(req).encodings(["br", "gzip", "deflate"]);
        const onError = (err) => {
            if (err) {
                res.end();
            }
        };
        switch (encoding) {
            case "br":
                res.writeHead(200, { "content-encoding": "br" });
                readStream.pipe((0, zlib_1.createBrotliCompress)()).pipe(res);
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createBrotliCompress)(), res, onError);
                break;
            case "gzip":
                res.writeHead(200, { "content-encoding": "gzip" });
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createGzip)(), res, onError);
                break;
            case "deflate":
                res.writeHead(200, { "content-encoding": "deflate" });
                (0, stream_1.pipeline)(readStream, (0, zlib_1.createDeflate)(), res, onError);
                break;
            default:
                res.writeHead(200);
                (0, stream_1.pipeline)(readStream, res, onError);
        }
    }
    /**
     * Binds socket.io to an engine.io instance.
     *
     * @param {engine.Server} engine engine.io (or compatible) server
     * @return self
     * @public
     */
    bind(engine) {
        this.engine = engine;
        this.engine.on("connection", this.onconnection.bind(this));
        return this;
    }
    /**
     * Called with each incoming transport connection.
     *
     * @param {engine.Socket} conn
     * @return self
     * @private
     */
    onconnection(conn) {
        debug("incoming connection with id %s", conn.id);
        const client = new client_1.Client(this, conn);
        if (conn.protocol === 3) {
            // @ts-ignore
            client.connect("/");
        }
        return this;
    }
    /**
     * Looks up a namespace.
     *
     * @param {String|RegExp|Function} name nsp name
     * @param fn optional, nsp `connection` ev handler
     * @public
     */
    of(name, fn) {
        if (typeof name === "function" || name instanceof RegExp) {
            const parentNsp = new parent_namespace_1.ParentNamespace(this);
            debug("initializing parent namespace %s", parentNsp.name);
            if (typeof name === "function") {
                this.parentNsps.set(name, parentNsp);
            }
            else {
                this.parentNsps.set((nsp, conn, next) => next(null, name.test(nsp)), parentNsp);
            }
            if (fn) {
                // @ts-ignore
                parentNsp.on("connect", fn);
            }
            return parentNsp;
        }
        if (String(name)[0] !== "/")
            name = "/" + name;
        let nsp = this._nsps.get(name);
        if (!nsp) {
            debug("initializing namespace %s", name);
            nsp = new namespace_1.Namespace(this, name);
            this._nsps.set(name, nsp);
            if (name !== "/") {
                // @ts-ignore
                this.sockets.emitReserved("new_namespace", nsp);
            }
        }
        if (fn)
            nsp.on("connect", fn);
        return nsp;
    }
    /**
     * Closes server connection
     *
     * @param [fn] optional, called as `fn([err])` on error OR all conns closed
     * @public
     */
    close(fn) {
        for (const socket of this.sockets.sockets.values()) {
            socket._onclose("server shutting down");
        }
        this.engine.close();
        // restore the Adapter prototype
        (0, uws_js_1.restoreAdapter)();
        if (this.httpServer) {
            this.httpServer.close(fn);
        }
        else {
            fn && fn();
        }
    }
    /**
     * Sets up namespace middleware.
     *
     * @return self
     * @public
     */
    use(fn) {
        this.sockets.use(fn);
        return this;
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return this.sockets.to(room);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return this.sockets.in(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param name
     * @return self
     * @public
     */
    except(name) {
        return this.sockets.except(name);
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.sockets.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.sockets.emit("message", ...args);
        return this;
    }
    /**
     * Emit a packet to other Socket.IO servers
     *
     * @param ev - the event name
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     * @public
     */
    serverSideEmit(ev, ...args) {
        return this.sockets.serverSideEmit(ev, ...args);
    }
    /**
     * Gets a list of socket ids.
     *
     * @public
     */
    allSockets() {
        return this.sockets.allSockets();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        return this.sockets.compress(compress);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return self
     * @public
     */
    get volatile() {
        return this.sockets.volatile;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return self
     * @public
     */
    get local() {
        return this.sockets.local;
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return this.sockets.fetchSockets();
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        return this.sockets.socketsJoin(room);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        return this.sockets.socketsLeave(room);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        return this.sockets.disconnectSockets(close);
    }
}
exports.Server = Server;
/**
 * Expose main namespace (/).
 */
const emitterMethods = Object.keys(events_1.EventEmitter.prototype).filter(function (key) {
    return typeof events_1.EventEmitter.prototype[key] === "function";
});
emitterMethods.forEach(function (fn) {
    Server.prototype[fn] = function () {
        return this.sockets[fn].apply(this.sockets, arguments);
    };
});
module.exports = (srv, opts) => new Server(srv, opts);
module.exports.Server = Server;
module.exports.Namespace = namespace_1.Namespace;
module.exports.Socket = socket_1.Socket;


/***/ }),
/* 96 */
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),
/* 97 */
/***/ ((module) => {

"use strict";
module.exports = require("zlib");

/***/ }),
/* 98 */
/***/ ((module) => {

"use strict";
module.exports = require("accepts");

/***/ }),
/* 99 */
/***/ ((module) => {

"use strict";
module.exports = require("stream");

/***/ }),
/* 100 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.protocol = exports.Transport = exports.Socket = exports.uServer = exports.parser = exports.attach = exports.listen = exports.transports = exports.Server = void 0;
const http_1 = __webpack_require__(96);
const server_1 = __webpack_require__(101);
Object.defineProperty(exports, "Server", ({ enumerable: true, get: function () { return server_1.Server; } }));
const index_1 = __webpack_require__(106);
exports.transports = index_1.default;
const parser = __webpack_require__(110);
exports.parser = parser;
var userver_1 = __webpack_require__(124);
Object.defineProperty(exports, "uServer", ({ enumerable: true, get: function () { return userver_1.uServer; } }));
var socket_1 = __webpack_require__(119);
Object.defineProperty(exports, "Socket", ({ enumerable: true, get: function () { return socket_1.Socket; } }));
var transport_1 = __webpack_require__(108);
Object.defineProperty(exports, "Transport", ({ enumerable: true, get: function () { return transport_1.Transport; } }));
exports.protocol = parser.protocol;
/**
 * Creates an http.Server exclusively used for WS upgrades.
 *
 * @param {Number} port
 * @param {Function} callback
 * @param {Object} options
 * @return {Server} websocket.io server
 * @api public
 */
function listen(port, options, fn) {
    if ("function" === typeof options) {
        fn = options;
        options = {};
    }
    const server = (0, http_1.createServer)(function (req, res) {
        res.writeHead(501);
        res.end("Not Implemented");
    });
    // create engine server
    const engine = attach(server, options);
    engine.httpServer = server;
    server.listen(port, fn);
    return engine;
}
exports.listen = listen;
/**
 * Captures upgrade requests for a http.Server.
 *
 * @param {http.Server} server
 * @param {Object} options
 * @return {Server} engine server
 * @api public
 */
function attach(server, options) {
    const engine = new server_1.Server(options);
    engine.attach(server, options);
    return engine;
}
exports.attach = attach;


/***/ }),
/* 101 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Server = exports.BaseServer = void 0;
const qs = __webpack_require__(102);
const url_1 = __webpack_require__(103);
const base64id = __webpack_require__(104);
const transports_1 = __webpack_require__(106);
const events_1 = __webpack_require__(109);
const socket_1 = __webpack_require__(119);
const debug_1 = __webpack_require__(116);
const cookie_1 = __webpack_require__(121);
const ws_1 = __webpack_require__(122);
const debug = (0, debug_1.default)("engine");
class BaseServer extends events_1.EventEmitter {
    /**
     * Server constructor.
     *
     * @param {Object} opts - options
     * @api public
     */
    constructor(opts = {}) {
        super();
        this.clients = {};
        this.clientsCount = 0;
        this.opts = Object.assign({
            wsEngine: ws_1.Server,
            pingTimeout: 20000,
            pingInterval: 25000,
            upgradeTimeout: 10000,
            maxHttpBufferSize: 1e6,
            transports: Object.keys(transports_1.default),
            allowUpgrades: true,
            httpCompression: {
                threshold: 1024
            },
            cors: false,
            allowEIO3: false
        }, opts);
        if (opts.cookie) {
            this.opts.cookie = Object.assign({
                name: "io",
                path: "/",
                // @ts-ignore
                httpOnly: opts.cookie.path !== false,
                sameSite: "lax"
            }, opts.cookie);
        }
        if (this.opts.cors) {
            this.corsMiddleware = __webpack_require__(123)(this.opts.cors);
        }
        if (opts.perMessageDeflate) {
            this.opts.perMessageDeflate = Object.assign({
                threshold: 1024
            }, opts.perMessageDeflate);
        }
        this.init();
    }
    /**
     * Returns a list of available transports for upgrade given a certain transport.
     *
     * @return {Array}
     * @api public
     */
    upgrades(transport) {
        if (!this.opts.allowUpgrades)
            return [];
        return transports_1.default[transport].upgradesTo || [];
    }
    /**
     * Verifies a request.
     *
     * @param {http.IncomingMessage}
     * @return {Boolean} whether the request is valid
     * @api private
     */
    verify(req, upgrade, fn) {
        // transport check
        const transport = req._query.transport;
        if (!~this.opts.transports.indexOf(transport)) {
            debug('unknown transport "%s"', transport);
            return fn(Server.errors.UNKNOWN_TRANSPORT, { transport });
        }
        // 'Origin' header check
        const isOriginInvalid = checkInvalidHeaderChar(req.headers.origin);
        if (isOriginInvalid) {
            const origin = req.headers.origin;
            req.headers.origin = null;
            debug("origin header invalid");
            return fn(Server.errors.BAD_REQUEST, {
                name: "INVALID_ORIGIN",
                origin
            });
        }
        // sid check
        const sid = req._query.sid;
        if (sid) {
            if (!this.clients.hasOwnProperty(sid)) {
                debug('unknown sid "%s"', sid);
                return fn(Server.errors.UNKNOWN_SID, {
                    sid
                });
            }
            const previousTransport = this.clients[sid].transport.name;
            if (!upgrade && previousTransport !== transport) {
                debug("bad request: unexpected transport without upgrade");
                return fn(Server.errors.BAD_REQUEST, {
                    name: "TRANSPORT_MISMATCH",
                    transport,
                    previousTransport
                });
            }
        }
        else {
            // handshake is GET only
            if ("GET" !== req.method) {
                return fn(Server.errors.BAD_HANDSHAKE_METHOD, {
                    method: req.method
                });
            }
            if (transport === "websocket" && !upgrade) {
                debug("invalid transport upgrade");
                return fn(Server.errors.BAD_REQUEST, {
                    name: "TRANSPORT_HANDSHAKE_ERROR"
                });
            }
            if (!this.opts.allowRequest)
                return fn();
            return this.opts.allowRequest(req, (message, success) => {
                if (!success) {
                    return fn(Server.errors.FORBIDDEN, {
                        message
                    });
                }
                fn();
            });
        }
        fn();
    }
    /**
     * Closes all clients.
     *
     * @api public
     */
    close() {
        debug("closing all open clients");
        for (let i in this.clients) {
            if (this.clients.hasOwnProperty(i)) {
                this.clients[i].close(true);
            }
        }
        this.cleanup();
        return this;
    }
    /**
     * generate a socket id.
     * Overwrite this method to generate your custom socket id
     *
     * @param {Object} request object
     * @api public
     */
    generateId(req) {
        return base64id.generateId();
    }
    /**
     * Handshakes a new client.
     *
     * @param {String} transport name
     * @param {Object} request object
     * @param {Function} closeConnection
     *
     * @api protected
     */
    async handshake(transportName, req, closeConnection) {
        const protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        if (protocol === 3 && !this.opts.allowEIO3) {
            debug("unsupported protocol version");
            this.emit("connection_error", {
                req,
                code: Server.errors.UNSUPPORTED_PROTOCOL_VERSION,
                message: Server.errorMessages[Server.errors.UNSUPPORTED_PROTOCOL_VERSION],
                context: {
                    protocol
                }
            });
            closeConnection(Server.errors.UNSUPPORTED_PROTOCOL_VERSION);
            return;
        }
        let id;
        try {
            id = await this.generateId(req);
        }
        catch (e) {
            debug("error while generating an id");
            this.emit("connection_error", {
                req,
                code: Server.errors.BAD_REQUEST,
                message: Server.errorMessages[Server.errors.BAD_REQUEST],
                context: {
                    name: "ID_GENERATION_ERROR",
                    error: e
                }
            });
            closeConnection(Server.errors.BAD_REQUEST);
            return;
        }
        debug('handshaking client "%s"', id);
        try {
            var transport = this.createTransport(transportName, req);
            if ("polling" === transportName) {
                transport.maxHttpBufferSize = this.opts.maxHttpBufferSize;
                transport.httpCompression = this.opts.httpCompression;
            }
            else if ("websocket" === transportName) {
                transport.perMessageDeflate = this.opts.perMessageDeflate;
            }
            if (req._query && req._query.b64) {
                transport.supportsBinary = false;
            }
            else {
                transport.supportsBinary = true;
            }
        }
        catch (e) {
            debug('error handshaking to transport "%s"', transportName);
            this.emit("connection_error", {
                req,
                code: Server.errors.BAD_REQUEST,
                message: Server.errorMessages[Server.errors.BAD_REQUEST],
                context: {
                    name: "TRANSPORT_HANDSHAKE_ERROR",
                    error: e
                }
            });
            closeConnection(Server.errors.BAD_REQUEST);
            return;
        }
        const socket = new socket_1.Socket(id, this, transport, req, protocol);
        transport.on("headers", (headers, req) => {
            const isInitialRequest = !req._query.sid;
            if (isInitialRequest) {
                if (this.opts.cookie) {
                    headers["Set-Cookie"] = [
                        // @ts-ignore
                        (0, cookie_1.serialize)(this.opts.cookie.name, id, this.opts.cookie)
                    ];
                }
                this.emit("initial_headers", headers, req);
            }
            this.emit("headers", headers, req);
        });
        transport.onRequest(req);
        this.clients[id] = socket;
        this.clientsCount++;
        socket.once("close", () => {
            delete this.clients[id];
            this.clientsCount--;
        });
        this.emit("connection", socket);
        return transport;
    }
}
exports.BaseServer = BaseServer;
/**
 * Protocol errors mappings.
 */
BaseServer.errors = {
    UNKNOWN_TRANSPORT: 0,
    UNKNOWN_SID: 1,
    BAD_HANDSHAKE_METHOD: 2,
    BAD_REQUEST: 3,
    FORBIDDEN: 4,
    UNSUPPORTED_PROTOCOL_VERSION: 5
};
BaseServer.errorMessages = {
    0: "Transport unknown",
    1: "Session ID unknown",
    2: "Bad handshake method",
    3: "Bad request",
    4: "Forbidden",
    5: "Unsupported protocol version"
};
class Server extends BaseServer {
    /**
     * Initialize websocket server
     *
     * @api protected
     */
    init() {
        if (!~this.opts.transports.indexOf("websocket"))
            return;
        if (this.ws)
            this.ws.close();
        this.ws = new this.opts.wsEngine({
            noServer: true,
            clientTracking: false,
            perMessageDeflate: this.opts.perMessageDeflate,
            maxPayload: this.opts.maxHttpBufferSize
        });
        if (typeof this.ws.on === "function") {
            this.ws.on("headers", (headersArray, req) => {
                // note: 'ws' uses an array of headers, while Engine.IO uses an object (response.writeHead() accepts both formats)
                // we could also try to parse the array and then sync the values, but that will be error-prone
                const additionalHeaders = {};
                const isInitialRequest = !req._query.sid;
                if (isInitialRequest) {
                    this.emit("initial_headers", additionalHeaders, req);
                }
                this.emit("headers", additionalHeaders, req);
                Object.keys(additionalHeaders).forEach(key => {
                    headersArray.push(`${key}: ${additionalHeaders[key]}`);
                });
            });
        }
    }
    cleanup() {
        if (this.ws) {
            debug("closing webSocketServer");
            this.ws.close();
            // don't delete this.ws because it can be used again if the http server starts listening again
        }
    }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req) {
        // try to leverage pre-existing `req._query` (e.g: from connect)
        if (!req._query) {
            req._query = ~req.url.indexOf("?") ? qs.parse((0, url_1.parse)(req.url).query) : {};
        }
    }
    createTransport(transportName, req) {
        return new transports_1.default[transportName](req);
    }
    /**
     * Handles an Engine.IO HTTP request.
     *
     * @param {http.IncomingMessage} request
     * @param {http.ServerResponse|http.OutgoingMessage} response
     * @api public
     */
    handleRequest(req, res) {
        debug('handling "%s" http request "%s"', req.method, req.url);
        this.prepare(req);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext
                });
                abortRequest(res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        if (this.corsMiddleware) {
            this.corsMiddleware.call(null, req, res, () => {
                this.verify(req, false, callback);
            });
        }
        else {
            this.verify(req, false, callback);
        }
    }
    /**
     * Handles an Engine.IO HTTP Upgrade.
     *
     * @api public
     */
    handleUpgrade(req, socket, upgradeHead) {
        this.prepare(req);
        this.verify(req, true, (errorCode, errorContext) => {
            if (errorCode) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: Server.errorMessages[errorCode],
                    context: errorContext
                });
                abortUpgrade(socket, errorCode, errorContext);
                return;
            }
            const head = Buffer.from(upgradeHead); // eslint-disable-line node/no-deprecated-api
            upgradeHead = null;
            // delegate to ws
            this.ws.handleUpgrade(req, socket, head, websocket => {
                this.onWebSocket(req, socket, websocket);
            });
        });
    }
    /**
     * Called upon a ws.io connection.
     *
     * @param {ws.Socket} websocket
     * @api private
     */
    onWebSocket(req, socket, websocket) {
        websocket.on("error", onUpgradeError);
        if (transports_1.default[req._query.transport] !== undefined &&
            !transports_1.default[req._query.transport].prototype.handlesUpgrades) {
            debug("transport doesnt handle upgraded requests");
            websocket.close();
            return;
        }
        // get client id
        const id = req._query.sid;
        // keep a reference to the ws.Socket
        req.websocket = websocket;
        if (id) {
            const client = this.clients[id];
            if (!client) {
                debug("upgrade attempt for closed client");
                websocket.close();
            }
            else if (client.upgrading) {
                debug("transport has already been trying to upgrade");
                websocket.close();
            }
            else if (client.upgraded) {
                debug("transport had already been upgraded");
                websocket.close();
            }
            else {
                debug("upgrading existing transport");
                // transport error handling takes over
                websocket.removeListener("error", onUpgradeError);
                const transport = this.createTransport(req._query.transport, req);
                if (req._query && req._query.b64) {
                    transport.supportsBinary = false;
                }
                else {
                    transport.supportsBinary = true;
                }
                transport.perMessageDeflate = this.opts.perMessageDeflate;
                client.maybeUpgrade(transport);
            }
        }
        else {
            const closeConnection = (errorCode, errorContext) => abortUpgrade(socket, errorCode, errorContext);
            this.handshake(req._query.transport, req, closeConnection);
        }
        function onUpgradeError() {
            debug("websocket error before upgrade");
            // websocket.close() not needed
        }
    }
    /**
     * Captures upgrade requests for a http.Server.
     *
     * @param {http.Server} server
     * @param {Object} options
     * @api public
     */
    attach(server, options = {}) {
        let path = (options.path || "/engine.io").replace(/\/$/, "");
        const destroyUpgradeTimeout = options.destroyUpgradeTimeout || 1000;
        // normalize path
        path += "/";
        function check(req) {
            return path === req.url.substr(0, path.length);
        }
        // cache and clean up listeners
        const listeners = server.listeners("request").slice(0);
        server.removeAllListeners("request");
        server.on("close", this.close.bind(this));
        server.on("listening", this.init.bind(this));
        // add request handler
        server.on("request", (req, res) => {
            if (check(req)) {
                debug('intercepting request for path "%s"', path);
                this.handleRequest(req, res);
            }
            else {
                let i = 0;
                const l = listeners.length;
                for (; i < l; i++) {
                    listeners[i].call(server, req, res);
                }
            }
        });
        if (~this.opts.transports.indexOf("websocket")) {
            server.on("upgrade", (req, socket, head) => {
                if (check(req)) {
                    this.handleUpgrade(req, socket, head);
                }
                else if (false !== options.destroyUpgrade) {
                    // default node behavior is to disconnect when no handlers
                    // but by adding a handler, we prevent that
                    // and if no eio thing handles the upgrade
                    // then the socket needs to die!
                    setTimeout(function () {
                        // @ts-ignore
                        if (socket.writable && socket.bytesWritten <= 0) {
                            return socket.end();
                        }
                    }, destroyUpgradeTimeout);
                }
            });
        }
    }
}
exports.Server = Server;
/**
 * Close the HTTP long-polling request
 *
 * @param res - the response object
 * @param errorCode - the error code
 * @param errorContext - additional error context
 *
 * @api private
 */
function abortRequest(res, errorCode, errorContext) {
    const statusCode = errorCode === Server.errors.FORBIDDEN ? 403 : 400;
    const message = errorContext && errorContext.message
        ? errorContext.message
        : Server.errorMessages[errorCode];
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
        code: errorCode,
        message
    }));
}
/**
 * Close the WebSocket connection
 *
 * @param {net.Socket} socket
 * @param {string} errorCode - the error code
 * @param {object} errorContext - additional error context
 *
 * @api private
 */
function abortUpgrade(socket, errorCode, errorContext = {}) {
    socket.on("error", () => {
        debug("ignoring error from closed connection");
    });
    if (socket.writable) {
        const message = errorContext.message || Server.errorMessages[errorCode];
        const length = Buffer.byteLength(message);
        socket.write("HTTP/1.1 400 Bad Request\r\n" +
            "Connection: close\r\n" +
            "Content-type: text/html\r\n" +
            "Content-Length: " +
            length +
            "\r\n" +
            "\r\n" +
            message);
    }
    socket.destroy();
}
/* eslint-disable */
/**
 * From https://github.com/nodejs/node/blob/v8.4.0/lib/_http_common.js#L303-L354
 *
 * True if val contains an invalid field-vchar
 *  field-value    = *( field-content / obs-fold )
 *  field-content  = field-vchar [ 1*( SP / HTAB ) field-vchar ]
 *  field-vchar    = VCHAR / obs-text
 *
 * checkInvalidHeaderChar() is currently designed to be inlinable by v8,
 * so take care when making changes to the implementation so that the source
 * code size does not exceed v8's default max_inlined_source_size setting.
 **/
// prettier-ignore
const validHdrChars = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 // ... 255
];
function checkInvalidHeaderChar(val) {
    val += "";
    if (val.length < 1)
        return false;
    if (!validHdrChars[val.charCodeAt(0)]) {
        debug('invalid header, index 0, char "%s"', val.charCodeAt(0));
        return true;
    }
    if (val.length < 2)
        return false;
    if (!validHdrChars[val.charCodeAt(1)]) {
        debug('invalid header, index 1, char "%s"', val.charCodeAt(1));
        return true;
    }
    if (val.length < 3)
        return false;
    if (!validHdrChars[val.charCodeAt(2)]) {
        debug('invalid header, index 2, char "%s"', val.charCodeAt(2));
        return true;
    }
    if (val.length < 4)
        return false;
    if (!validHdrChars[val.charCodeAt(3)]) {
        debug('invalid header, index 3, char "%s"', val.charCodeAt(3));
        return true;
    }
    for (let i = 4; i < val.length; ++i) {
        if (!validHdrChars[val.charCodeAt(i)]) {
            debug('invalid header, index "%i", char "%s"', i, val.charCodeAt(i));
            return true;
        }
    }
    return false;
}


/***/ }),
/* 102 */
/***/ ((module) => {

"use strict";
module.exports = require("querystring");

/***/ }),
/* 103 */
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),
/* 104 */
/***/ ((module, exports, __webpack_require__) => {

/*!
 * base64id v0.1.0
 */

/**
 * Module dependencies
 */

var crypto = __webpack_require__(105);

/**
 * Constructor
 */

var Base64Id = function() { };

/**
 * Get random bytes
 *
 * Uses a buffer if available, falls back to crypto.randomBytes
 */

Base64Id.prototype.getRandomBytes = function(bytes) {

  var BUFFER_SIZE = 4096
  var self = this;  
  
  bytes = bytes || 12;

  if (bytes > BUFFER_SIZE) {
    return crypto.randomBytes(bytes);
  }
  
  var bytesInBuffer = parseInt(BUFFER_SIZE/bytes);
  var threshold = parseInt(bytesInBuffer*0.85);

  if (!threshold) {
    return crypto.randomBytes(bytes);
  }

  if (this.bytesBufferIndex == null) {
     this.bytesBufferIndex = -1;
  }

  if (this.bytesBufferIndex == bytesInBuffer) {
    this.bytesBuffer = null;
    this.bytesBufferIndex = -1;
  }

  // No buffered bytes available or index above threshold
  if (this.bytesBufferIndex == -1 || this.bytesBufferIndex > threshold) {
     
    if (!this.isGeneratingBytes) {
      this.isGeneratingBytes = true;
      crypto.randomBytes(BUFFER_SIZE, function(err, bytes) {
        self.bytesBuffer = bytes;
        self.bytesBufferIndex = 0;
        self.isGeneratingBytes = false;
      }); 
    }
    
    // Fall back to sync call when no buffered bytes are available
    if (this.bytesBufferIndex == -1) {
      return crypto.randomBytes(bytes);
    }
  }
  
  var result = this.bytesBuffer.slice(bytes*this.bytesBufferIndex, bytes*(this.bytesBufferIndex+1)); 
  this.bytesBufferIndex++; 
  
  return result;
}

/**
 * Generates a base64 id
 *
 * (Original version from socket.io <http://socket.io>)
 */

Base64Id.prototype.generateId = function () {
  var rand = Buffer.alloc(15); // multiple of 3 for base64
  if (!rand.writeInt32BE) {
    return Math.abs(Math.random() * Math.random() * Date.now() | 0).toString()
      + Math.abs(Math.random() * Math.random() * Date.now() | 0).toString();
  }
  this.sequenceNumber = (this.sequenceNumber + 1) | 0;
  rand.writeInt32BE(this.sequenceNumber, 11);
  if (crypto.randomBytes) {
    this.getRandomBytes(12).copy(rand);
  } else {
    // not secure for node 0.4
    [0, 4, 8].forEach(function(i) {
      rand.writeInt32BE(Math.random() * Math.pow(2, 32) | 0, i);
    });
  }
  return rand.toString('base64').replace(/\//g, '_').replace(/\+/g, '-');
};

/**
 * Export
 */

exports = module.exports = new Base64Id();


/***/ }),
/* 105 */
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),
/* 106 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const polling_1 = __webpack_require__(107);
const polling_jsonp_1 = __webpack_require__(117);
const websocket_1 = __webpack_require__(118);
exports["default"] = {
    polling: polling,
    websocket: websocket_1.WebSocket
};
/**
 * Polling polymorphic constructor.
 *
 * @api private
 */
function polling(req) {
    if ("string" === typeof req._query.j) {
        return new polling_jsonp_1.JSONP(req);
    }
    else {
        return new polling_1.Polling(req);
    }
}
polling.upgradesTo = ["websocket"];


/***/ }),
/* 107 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polling = void 0;
const transport_1 = __webpack_require__(108);
const zlib_1 = __webpack_require__(97);
const accepts = __webpack_require__(98);
const debug_1 = __webpack_require__(116);
const debug = (0, debug_1.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate
};
class Polling extends transport_1.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param {http.IncomingMessage}
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if ("GET" === req.method) {
            this.onPollRequest(req, res);
        }
        else if ("POST" === req.method) {
            this.onDataRequest(req, res);
        }
        else {
            res.writeHead(500);
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeHead(500);
            res.end();
            return;
        }
        debug("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            req.removeListener("close", onClose);
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        req.on("close", onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeHead(500);
            res.end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let chunks = isBinary ? Buffer.concat([]) : "";
        const cleanup = () => {
            req.removeListener("data", onData);
            req.removeListener("end", onEnd);
            req.removeListener("close", onClose);
            this.dataReq = this.dataRes = chunks = null;
        };
        const onClose = () => {
            cleanup();
            this.onError("data request connection closed prematurely");
        };
        const onData = data => {
            let contentLength;
            if (isBinary) {
                chunks = Buffer.concat([chunks, data]);
                contentLength = chunks.length;
            }
            else {
                chunks += data;
                contentLength = Buffer.byteLength(chunks);
            }
            if (contentLength > this.maxHttpBufferSize) {
                chunks = isBinary ? Buffer.concat([]) : "";
                req.connection.destroy();
            }
        };
        const onEnd = () => {
            this.onData(chunks);
            const headers = {
                // text/html is required instead of text/plain to avoid an
                // unwanted download dialog on certain user-agents (GH-43)
                "Content-Type": "text/html",
                "Content-Length": 2
            };
            res.writeHead(200, this.headers(req, headers));
            res.end("ok");
            cleanup();
        };
        req.on("close", onClose);
        if (!isBinary)
            req.setEncoding("utf8");
        req.on("data", onData);
        req.on("end", onEnd);
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug('received "%s"', data);
        const callback = packet => {
            if ("close" === packet.type) {
                debug("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = data => {
            const compress = packets.some(packet => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType
        };
        const respond = data => {
            headers["Content-Length"] =
                "string" === typeof data ? Buffer.byteLength(data) : data.length;
            this.res.writeHead(200, this.headers(this.req, headers));
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeHead(500);
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        let closeTimeoutTimer;
        if (this.dataReq) {
            debug("aborting ongoing data request");
            this.dataReq.destroy();
        }
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug("transport discarded - closing right away");
            onClose();
        }
        else {
            debug("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param {http.IncomingMessage} request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
exports.Polling = Polling;


/***/ }),
/* 108 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Transport = void 0;
const events_1 = __webpack_require__(109);
const parser_v4 = __webpack_require__(110);
const parser_v3 = __webpack_require__(114);
const debug_1 = __webpack_require__(116);
const debug = (0, debug_1.default)("engine:transport");
/**
 * Noop function.
 *
 * @api private
 */
function noop() { }
class Transport extends events_1.EventEmitter {
    /**
     * Transport constructor.
     *
     * @param {http.IncomingMessage} request
     * @api public
     */
    constructor(req) {
        super();
        this.readyState = "open";
        this.discarded = false;
        this.protocol = req._query.EIO === "4" ? 4 : 3; // 3rd revision by default
        this.parser = this.protocol === 4 ? parser_v4 : parser_v3;
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug("readyState updated from %s to %s (%s)", this._readyState, state, this.name);
        this._readyState = state;
    }
    /**
     * Flags the transport as discarded.
     *
     * @api private
     */
    discard() {
        this.discarded = true;
    }
    /**
     * Called with an incoming HTTP request.
     *
     * @param {http.IncomingMessage} request
     * @api protected
     */
    onRequest(req) {
        debug("setting request");
        this.req = req;
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    close(fn) {
        if ("closed" === this.readyState || "closing" === this.readyState)
            return;
        this.readyState = "closing";
        this.doClose(fn || noop);
    }
    /**
     * Called with a transport error.
     *
     * @param {String} message error
     * @param {Object} error description
     * @api protected
     */
    onError(msg, desc) {
        if (this.listeners("error").length) {
            const err = new Error(msg);
            // @ts-ignore
            err.type = "TransportError";
            // @ts-ignore
            err.description = desc;
            this.emit("error", err);
        }
        else {
            debug("ignored transport error %s (%s)", msg, desc);
        }
    }
    /**
     * Called with parsed out a packets from the data stream.
     *
     * @param {Object} packet
     * @api protected
     */
    onPacket(packet) {
        this.emit("packet", packet);
    }
    /**
     * Called with the encoded packet data.
     *
     * @param {String} data
     * @api protected
     */
    onData(data) {
        this.onPacket(this.parser.decodePacket(data));
    }
    /**
     * Called upon transport close.
     *
     * @api protected
     */
    onClose() {
        this.readyState = "closed";
        this.emit("close");
    }
}
exports.Transport = Transport;


/***/ }),
/* 109 */
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),
/* 110 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodePayload = exports.decodePacket = exports.encodePayload = exports.encodePacket = exports.protocol = void 0;
const encodePacket_js_1 = __webpack_require__(111);
exports.encodePacket = encodePacket_js_1.default;
const decodePacket_js_1 = __webpack_require__(113);
exports.decodePacket = decodePacket_js_1.default;
const SEPARATOR = String.fromCharCode(30); // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const encodePayload = (packets, callback) => {
    // some packets may be added to the array while encoding, so the initial length must be saved
    const length = packets.length;
    const encodedPackets = new Array(length);
    let count = 0;
    packets.forEach((packet, i) => {
        // force base64 encoding for binary packets
        (0, encodePacket_js_1.default)(packet, false, encodedPacket => {
            encodedPackets[i] = encodedPacket;
            if (++count === length) {
                callback(encodedPackets.join(SEPARATOR));
            }
        });
    });
};
exports.encodePayload = encodePayload;
const decodePayload = (encodedPayload, binaryType) => {
    const encodedPackets = encodedPayload.split(SEPARATOR);
    const packets = [];
    for (let i = 0; i < encodedPackets.length; i++) {
        const decodedPacket = (0, decodePacket_js_1.default)(encodedPackets[i], binaryType);
        packets.push(decodedPacket);
        if (decodedPacket.type === "error") {
            break;
        }
    }
    return packets;
};
exports.decodePayload = decodePayload;
exports.protocol = 4;


/***/ }),
/* 111 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const commons_js_1 = __webpack_require__(112);
const encodePacket = ({ type, data }, supportsBinary, callback) => {
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
        const buffer = toBuffer(data);
        return callback(encodeBuffer(buffer, supportsBinary));
    }
    // plain string
    return callback(commons_js_1.PACKET_TYPES[type] + (data || ""));
};
const toBuffer = data => {
    if (Buffer.isBuffer(data)) {
        return data;
    }
    else if (data instanceof ArrayBuffer) {
        return Buffer.from(data);
    }
    else {
        return Buffer.from(data.buffer, data.byteOffset, data.byteLength);
    }
};
// only 'message' packets can contain binary, so the type prefix is not needed
const encodeBuffer = (data, supportsBinary) => {
    return supportsBinary ? data : "b" + data.toString("base64");
};
exports["default"] = encodePacket;


/***/ }),
/* 112 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ERROR_PACKET = exports.PACKET_TYPES_REVERSE = exports.PACKET_TYPES = void 0;
const PACKET_TYPES = Object.create(null); // no Map = no polyfill
exports.PACKET_TYPES = PACKET_TYPES;
PACKET_TYPES["open"] = "0";
PACKET_TYPES["close"] = "1";
PACKET_TYPES["ping"] = "2";
PACKET_TYPES["pong"] = "3";
PACKET_TYPES["message"] = "4";
PACKET_TYPES["upgrade"] = "5";
PACKET_TYPES["noop"] = "6";
const PACKET_TYPES_REVERSE = Object.create(null);
exports.PACKET_TYPES_REVERSE = PACKET_TYPES_REVERSE;
Object.keys(PACKET_TYPES).forEach(key => {
    PACKET_TYPES_REVERSE[PACKET_TYPES[key]] = key;
});
const ERROR_PACKET = { type: "error", data: "parser error" };
exports.ERROR_PACKET = ERROR_PACKET;


/***/ }),
/* 113 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const commons_js_1 = __webpack_require__(112);
const decodePacket = (encodedPacket, binaryType) => {
    if (typeof encodedPacket !== "string") {
        return {
            type: "message",
            data: mapBinary(encodedPacket, binaryType)
        };
    }
    const type = encodedPacket.charAt(0);
    if (type === "b") {
        const buffer = Buffer.from(encodedPacket.substring(1), "base64");
        return {
            type: "message",
            data: mapBinary(buffer, binaryType)
        };
    }
    if (!commons_js_1.PACKET_TYPES_REVERSE[type]) {
        return commons_js_1.ERROR_PACKET;
    }
    return encodedPacket.length > 1
        ? {
            type: commons_js_1.PACKET_TYPES_REVERSE[type],
            data: encodedPacket.substring(1)
        }
        : {
            type: commons_js_1.PACKET_TYPES_REVERSE[type]
        };
};
const mapBinary = (data, binaryType) => {
    const isBuffer = Buffer.isBuffer(data);
    switch (binaryType) {
        case "arraybuffer":
            return isBuffer ? toArrayBuffer(data) : data;
        case "nodebuffer":
        default:
            return data; // assuming the data is already a Buffer
    }
};
const toArrayBuffer = (buffer) => {
    const arrayBuffer = new ArrayBuffer(buffer.length);
    const view = new Uint8Array(arrayBuffer);
    for (let i = 0; i < buffer.length; i++) {
        view[i] = buffer[i];
    }
    return arrayBuffer;
};
exports["default"] = decodePacket;


/***/ }),
/* 114 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

// imported from https://github.com/socketio/engine.io-parser/tree/2.2.x
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodePayloadAsBinary = exports.encodePayloadAsBinary = exports.decodePayload = exports.encodePayload = exports.decodeBase64Packet = exports.decodePacket = exports.encodeBase64Packet = exports.encodePacket = exports.packets = exports.protocol = void 0;
/**
 * Module dependencies.
 */
var utf8 = __webpack_require__(115);
/**
 * Current protocol version.
 */
exports.protocol = 3;
const hasBinary = (packets) => {
    for (const packet of packets) {
        if (packet.data instanceof ArrayBuffer || ArrayBuffer.isView(packet.data)) {
            return true;
        }
    }
    return false;
};
/**
 * Packet types.
 */
exports.packets = {
    open: 0 // non-ws
    ,
    close: 1 // non-ws
    ,
    ping: 2,
    pong: 3,
    message: 4,
    upgrade: 5,
    noop: 6
};
var packetslist = Object.keys(exports.packets);
/**
 * Premade error packet.
 */
var err = { type: 'error', data: 'parser error' };
const EMPTY_BUFFER = Buffer.concat([]);
/**
 * Encodes a packet.
 *
 *     <packet type id> [ <data> ]
 *
 * Example:
 *
 *     5hello world
 *     3
 *     4
 *
 * Binary is encoded in an identical principle
 *
 * @api private
 */
function encodePacket(packet, supportsBinary, utf8encode, callback) {
    if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
    }
    if (typeof utf8encode === 'function') {
        callback = utf8encode;
        utf8encode = null;
    }
    if (Buffer.isBuffer(packet.data)) {
        return encodeBuffer(packet, supportsBinary, callback);
    }
    else if (packet.data && (packet.data.buffer || packet.data) instanceof ArrayBuffer) {
        return encodeBuffer({ type: packet.type, data: arrayBufferToBuffer(packet.data) }, supportsBinary, callback);
    }
    // Sending data as a utf-8 string
    var encoded = exports.packets[packet.type];
    // data fragment is optional
    if (undefined !== packet.data) {
        encoded += utf8encode ? utf8.encode(String(packet.data), { strict: false }) : String(packet.data);
    }
    return callback('' + encoded);
}
exports.encodePacket = encodePacket;
;
/**
 * Encode Buffer data
 */
function encodeBuffer(packet, supportsBinary, callback) {
    if (!supportsBinary) {
        return encodeBase64Packet(packet, callback);
    }
    var data = packet.data;
    var typeBuffer = Buffer.allocUnsafe(1);
    typeBuffer[0] = exports.packets[packet.type];
    return callback(Buffer.concat([typeBuffer, data]));
}
/**
 * Encodes a packet with binary data in a base64 string
 *
 * @param {Object} packet, has `type` and `data`
 * @return {String} base64 encoded message
 */
function encodeBase64Packet(packet, callback) {
    var data = Buffer.isBuffer(packet.data) ? packet.data : arrayBufferToBuffer(packet.data);
    var message = 'b' + exports.packets[packet.type];
    message += data.toString('base64');
    return callback(message);
}
exports.encodeBase64Packet = encodeBase64Packet;
;
/**
 * Decodes a packet. Data also available as an ArrayBuffer if requested.
 *
 * @return {Object} with `type` and `data` (if any)
 * @api private
 */
function decodePacket(data, binaryType, utf8decode) {
    if (data === undefined) {
        return err;
    }
    var type;
    // String data
    if (typeof data === 'string') {
        type = data.charAt(0);
        if (type === 'b') {
            return decodeBase64Packet(data.substr(1), binaryType);
        }
        if (utf8decode) {
            data = tryDecode(data);
            if (data === false) {
                return err;
            }
        }
        if (Number(type) != type || !packetslist[type]) {
            return err;
        }
        if (data.length > 1) {
            return { type: packetslist[type], data: data.substring(1) };
        }
        else {
            return { type: packetslist[type] };
        }
    }
    // Binary data
    if (binaryType === 'arraybuffer') {
        // wrap Buffer/ArrayBuffer data into an Uint8Array
        var intArray = new Uint8Array(data);
        type = intArray[0];
        return { type: packetslist[type], data: intArray.buffer.slice(1) };
    }
    if (data instanceof ArrayBuffer) {
        data = arrayBufferToBuffer(data);
    }
    type = data[0];
    return { type: packetslist[type], data: data.slice(1) };
}
exports.decodePacket = decodePacket;
;
function tryDecode(data) {
    try {
        data = utf8.decode(data, { strict: false });
    }
    catch (e) {
        return false;
    }
    return data;
}
/**
 * Decodes a packet encoded in a base64 string.
 *
 * @param {String} base64 encoded message
 * @return {Object} with `type` and `data` (if any)
 */
function decodeBase64Packet(msg, binaryType) {
    var type = packetslist[msg.charAt(0)];
    var data = Buffer.from(msg.substr(1), 'base64');
    if (binaryType === 'arraybuffer') {
        var abv = new Uint8Array(data.length);
        for (var i = 0; i < abv.length; i++) {
            abv[i] = data[i];
        }
        // @ts-ignore
        data = abv.buffer;
    }
    return { type: type, data: data };
}
exports.decodeBase64Packet = decodeBase64Packet;
;
/**
 * Encodes multiple messages (payload).
 *
 *     <length>:data
 *
 * Example:
 *
 *     11:hello world2:hi
 *
 * If any contents are binary, they will be encoded as base64 strings. Base64
 * encoded strings are marked with a b before the length specifier
 *
 * @param {Array} packets
 * @api private
 */
function encodePayload(packets, supportsBinary, callback) {
    if (typeof supportsBinary === 'function') {
        callback = supportsBinary;
        supportsBinary = null;
    }
    if (supportsBinary && hasBinary(packets)) {
        return encodePayloadAsBinary(packets, callback);
    }
    if (!packets.length) {
        return callback('0:');
    }
    function encodeOne(packet, doneCallback) {
        encodePacket(packet, supportsBinary, false, function (message) {
            doneCallback(null, setLengthHeader(message));
        });
    }
    map(packets, encodeOne, function (err, results) {
        return callback(results.join(''));
    });
}
exports.encodePayload = encodePayload;
;
function setLengthHeader(message) {
    return message.length + ':' + message;
}
/**
 * Async array map using after
 */
function map(ary, each, done) {
    const results = new Array(ary.length);
    let count = 0;
    for (let i = 0; i < ary.length; i++) {
        each(ary[i], (error, msg) => {
            results[i] = msg;
            if (++count === ary.length) {
                done(null, results);
            }
        });
    }
}
/*
 * Decodes data when a payload is maybe expected. Possible binary contents are
 * decoded from their base64 representation
 *
 * @param {String} data, callback method
 * @api public
 */
function decodePayload(data, binaryType, callback) {
    if (typeof data !== 'string') {
        return decodePayloadAsBinary(data, binaryType, callback);
    }
    if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
    }
    if (data === '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
    }
    var length = '', n, msg, packet;
    for (var i = 0, l = data.length; i < l; i++) {
        var chr = data.charAt(i);
        if (chr !== ':') {
            length += chr;
            continue;
        }
        // @ts-ignore
        if (length === '' || (length != (n = Number(length)))) {
            // parser error - ignoring payload
            return callback(err, 0, 1);
        }
        msg = data.substr(i + 1, n);
        if (length != msg.length) {
            // parser error - ignoring payload
            return callback(err, 0, 1);
        }
        if (msg.length) {
            packet = decodePacket(msg, binaryType, false);
            if (err.type === packet.type && err.data === packet.data) {
                // parser error in individual packet - ignoring payload
                return callback(err, 0, 1);
            }
            var more = callback(packet, i + n, l);
            if (false === more)
                return;
        }
        // advance cursor
        i += n;
        length = '';
    }
    if (length !== '') {
        // parser error - ignoring payload
        return callback(err, 0, 1);
    }
}
exports.decodePayload = decodePayload;
;
/**
 *
 * Converts a buffer to a utf8.js encoded string
 *
 * @api private
 */
function bufferToString(buffer) {
    var str = '';
    for (var i = 0, l = buffer.length; i < l; i++) {
        str += String.fromCharCode(buffer[i]);
    }
    return str;
}
/**
 *
 * Converts a utf8.js encoded string to a buffer
 *
 * @api private
 */
function stringToBuffer(string) {
    var buf = Buffer.allocUnsafe(string.length);
    for (var i = 0, l = string.length; i < l; i++) {
        buf.writeUInt8(string.charCodeAt(i), i);
    }
    return buf;
}
/**
 *
 * Converts an ArrayBuffer to a Buffer
 *
 * @api private
 */
function arrayBufferToBuffer(data) {
    // data is either an ArrayBuffer or ArrayBufferView.
    var length = data.byteLength || data.length;
    var offset = data.byteOffset || 0;
    return Buffer.from(data.buffer || data, offset, length);
}
/**
 * Encodes multiple messages (payload) as binary.
 *
 * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
 * 255><data>
 *
 * Example:
 * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
 *
 * @param {Array} packets
 * @return {Buffer} encoded payload
 * @api private
 */
function encodePayloadAsBinary(packets, callback) {
    if (!packets.length) {
        return callback(EMPTY_BUFFER);
    }
    map(packets, encodeOneBinaryPacket, function (err, results) {
        return callback(Buffer.concat(results));
    });
}
exports.encodePayloadAsBinary = encodePayloadAsBinary;
;
function encodeOneBinaryPacket(p, doneCallback) {
    function onBinaryPacketEncode(packet) {
        var encodingLength = '' + packet.length;
        var sizeBuffer;
        if (typeof packet === 'string') {
            sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
            sizeBuffer[0] = 0; // is a string (not true binary = 0)
            for (var i = 0; i < encodingLength.length; i++) {
                sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
            }
            sizeBuffer[sizeBuffer.length - 1] = 255;
            return doneCallback(null, Buffer.concat([sizeBuffer, stringToBuffer(packet)]));
        }
        sizeBuffer = Buffer.allocUnsafe(encodingLength.length + 2);
        sizeBuffer[0] = 1; // is binary (true binary = 1)
        for (var i = 0; i < encodingLength.length; i++) {
            sizeBuffer[i + 1] = parseInt(encodingLength[i], 10);
        }
        sizeBuffer[sizeBuffer.length - 1] = 255;
        doneCallback(null, Buffer.concat([sizeBuffer, packet]));
    }
    encodePacket(p, true, true, onBinaryPacketEncode);
}
/*
 * Decodes data when a payload is maybe expected. Strings are decoded by
 * interpreting each byte as a key code for entries marked to start with 0. See
 * description of encodePayloadAsBinary

 * @param {Buffer} data, callback method
 * @api public
 */
function decodePayloadAsBinary(data, binaryType, callback) {
    if (typeof binaryType === 'function') {
        callback = binaryType;
        binaryType = null;
    }
    var bufferTail = data;
    var buffers = [];
    var i;
    while (bufferTail.length > 0) {
        var strLen = '';
        var isString = bufferTail[0] === 0;
        for (i = 1;; i++) {
            if (bufferTail[i] === 255)
                break;
            // 310 = char length of Number.MAX_VALUE
            if (strLen.length > 310) {
                return callback(err, 0, 1);
            }
            strLen += '' + bufferTail[i];
        }
        bufferTail = bufferTail.slice(strLen.length + 1);
        var msgLength = parseInt(strLen, 10);
        var msg = bufferTail.slice(1, msgLength + 1);
        if (isString)
            msg = bufferToString(msg);
        buffers.push(msg);
        bufferTail = bufferTail.slice(msgLength + 1);
    }
    var total = buffers.length;
    for (i = 0; i < total; i++) {
        var buffer = buffers[i];
        callback(decodePacket(buffer, binaryType, true), i, total);
    }
}
exports.decodePayloadAsBinary = decodePayloadAsBinary;
;


/***/ }),
/* 115 */
/***/ ((module) => {

/*! https://mths.be/utf8js v2.1.2 by @mathias */
var stringFromCharCode = String.fromCharCode;
// Taken from https://mths.be/punycode
function ucs2decode(string) {
    var output = [];
    var counter = 0;
    var length = string.length;
    var value;
    var extra;
    while (counter < length) {
        value = string.charCodeAt(counter++);
        if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
            // high surrogate, and there is a next character
            extra = string.charCodeAt(counter++);
            if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
            }
            else {
                // unmatched surrogate; only append this code unit, in case the next
                // code unit is the high surrogate of a surrogate pair
                output.push(value);
                counter--;
            }
        }
        else {
            output.push(value);
        }
    }
    return output;
}
// Taken from https://mths.be/punycode
function ucs2encode(array) {
    var length = array.length;
    var index = -1;
    var value;
    var output = '';
    while (++index < length) {
        value = array[index];
        if (value > 0xFFFF) {
            value -= 0x10000;
            output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
            value = 0xDC00 | value & 0x3FF;
        }
        output += stringFromCharCode(value);
    }
    return output;
}
function checkScalarValue(codePoint, strict) {
    if (codePoint >= 0xD800 && codePoint <= 0xDFFF) {
        if (strict) {
            throw Error('Lone surrogate U+' + codePoint.toString(16).toUpperCase() +
                ' is not a scalar value');
        }
        return false;
    }
    return true;
}
/*--------------------------------------------------------------------------*/
function createByte(codePoint, shift) {
    return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
}
function encodeCodePoint(codePoint, strict) {
    if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
        return stringFromCharCode(codePoint);
    }
    var symbol = '';
    if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
        symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
    }
    else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
        if (!checkScalarValue(codePoint, strict)) {
            codePoint = 0xFFFD;
        }
        symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
        symbol += createByte(codePoint, 6);
    }
    else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
        symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
        symbol += createByte(codePoint, 12);
        symbol += createByte(codePoint, 6);
    }
    symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
    return symbol;
}
function utf8encode(string, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    var codePoints = ucs2decode(string);
    var length = codePoints.length;
    var index = -1;
    var codePoint;
    var byteString = '';
    while (++index < length) {
        codePoint = codePoints[index];
        byteString += encodeCodePoint(codePoint, strict);
    }
    return byteString;
}
/*--------------------------------------------------------------------------*/
function readContinuationByte() {
    if (byteIndex >= byteCount) {
        throw Error('Invalid byte index');
    }
    var continuationByte = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    if ((continuationByte & 0xC0) == 0x80) {
        return continuationByte & 0x3F;
    }
    // If we end up here, it’s not a continuation byte
    throw Error('Invalid continuation byte');
}
function decodeSymbol(strict) {
    var byte1;
    var byte2;
    var byte3;
    var byte4;
    var codePoint;
    if (byteIndex > byteCount) {
        throw Error('Invalid byte index');
    }
    if (byteIndex == byteCount) {
        return false;
    }
    // Read first byte
    byte1 = byteArray[byteIndex] & 0xFF;
    byteIndex++;
    // 1-byte sequence (no continuation bytes)
    if ((byte1 & 0x80) == 0) {
        return byte1;
    }
    // 2-byte sequence
    if ((byte1 & 0xE0) == 0xC0) {
        byte2 = readContinuationByte();
        codePoint = ((byte1 & 0x1F) << 6) | byte2;
        if (codePoint >= 0x80) {
            return codePoint;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 3-byte sequence (may include unpaired surrogates)
    if ((byte1 & 0xF0) == 0xE0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
        if (codePoint >= 0x0800) {
            return checkScalarValue(codePoint, strict) ? codePoint : 0xFFFD;
        }
        else {
            throw Error('Invalid continuation byte');
        }
    }
    // 4-byte sequence
    if ((byte1 & 0xF8) == 0xF0) {
        byte2 = readContinuationByte();
        byte3 = readContinuationByte();
        byte4 = readContinuationByte();
        codePoint = ((byte1 & 0x07) << 0x12) | (byte2 << 0x0C) |
            (byte3 << 0x06) | byte4;
        if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
            return codePoint;
        }
    }
    throw Error('Invalid UTF-8 detected');
}
var byteArray;
var byteCount;
var byteIndex;
function utf8decode(byteString, opts) {
    opts = opts || {};
    var strict = false !== opts.strict;
    byteArray = ucs2decode(byteString);
    byteCount = byteArray.length;
    byteIndex = 0;
    var codePoints = [];
    var tmp;
    while ((tmp = decodeSymbol(strict)) !== false) {
        codePoints.push(tmp);
    }
    return ucs2encode(codePoints);
}
module.exports = {
    version: '2.1.2',
    encode: utf8encode,
    decode: utf8decode
};


/***/ }),
/* 116 */
/***/ ((module) => {

"use strict";
module.exports = require("debug");

/***/ }),
/* 117 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JSONP = void 0;
const polling_1 = __webpack_require__(107);
const qs = __webpack_require__(102);
const rDoubleSlashes = /\\\\n/g;
const rSlashes = /(\\)?\\n/g;
class JSONP extends polling_1.Polling {
    /**
     * JSON-P polling transport.
     *
     * @api public
     */
    constructor(req) {
        super(req);
        this.head = "___eio[" + (req._query.j || "").replace(/[^0-9]/g, "") + "](";
        this.foot = ");";
    }
    /**
     * Handles incoming data.
     * Due to a bug in \n handling by browsers, we expect a escaped string.
     *
     * @api private
     */
    onData(data) {
        // we leverage the qs module so that we get built-in DoS protection
        // and the fast alternative to decodeURIComponent
        data = qs.parse(data).d;
        if ("string" === typeof data) {
            // client will send already escaped newlines as \\\\n and newlines as \\n
            // \\n must be replaced with \n and \\\\n with \\n
            data = data.replace(rSlashes, function (match, slashes) {
                return slashes ? match : "\n";
            });
            super.onData(data.replace(rDoubleSlashes, "\\n"));
        }
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // we must output valid javascript, not valid json
        // see: http://timelessrepo.com/json-isnt-a-javascript-subset
        const js = JSON.stringify(data)
            .replace(/\u2028/g, "\\u2028")
            .replace(/\u2029/g, "\\u2029");
        // prepare response
        data = this.head + js + this.foot;
        super.doWrite(data, options, callback);
    }
}
exports.JSONP = JSONP;


/***/ }),
/* 118 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocket = void 0;
const transport_1 = __webpack_require__(108);
const debug_1 = __webpack_require__(116);
const debug = (0, debug_1.default)("engine:ws");
class WebSocket extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param {http.IncomingMessage}
     * @api public
     */
    constructor(req) {
        super(req);
        this.socket = req.websocket;
        this.socket.on("message", (data, isBinary) => {
            const message = isBinary ? data : data.toString();
            debug('received "%s"', message);
            super.onData(message);
        });
        this.socket.once("close", this.onClose.bind(this));
        this.socket.on("error", this.onError.bind(this));
        this.writable = true;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        const packet = packets.shift();
        if (typeof packet === "undefined") {
            this.writable = true;
            this.emit("drain");
            return;
        }
        // always creates a new object since ws modifies it
        const opts = {};
        if (packet.options) {
            opts.compress = packet.options.compress;
        }
        const send = data => {
            if (this.perMessageDeflate) {
                const len = "string" === typeof data ? Buffer.byteLength(data) : data.length;
                if (len < this.perMessageDeflate.threshold) {
                    opts.compress = false;
                }
            }
            debug('writing "%s"', data);
            this.writable = false;
            this.socket.send(data, opts, err => {
                if (err)
                    return this.onError("write error", err.stack);
                this.send(packets);
            });
        };
        if (packet.options && typeof packet.options.wsPreEncoded === "string") {
            send(packet.options.wsPreEncoded);
        }
        else {
            this.parser.encodePacket(packet, this.supportsBinary, send);
        }
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        this.socket.close();
        fn && fn();
    }
}
exports.WebSocket = WebSocket;


/***/ }),
/* 119 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Socket = void 0;
const events_1 = __webpack_require__(109);
const debug_1 = __webpack_require__(116);
const timers_1 = __webpack_require__(120);
const debug = (0, debug_1.default)("engine:socket");
class Socket extends events_1.EventEmitter {
    /**
     * Client class (abstract).
     *
     * @api private
     */
    constructor(id, server, transport, req, protocol) {
        super();
        this.id = id;
        this.server = server;
        this.upgrading = false;
        this.upgraded = false;
        this.readyState = "opening";
        this.writeBuffer = [];
        this.packetsFn = [];
        this.sentCallbackFn = [];
        this.cleanupFn = [];
        this.request = req;
        this.protocol = protocol;
        // Cache IP since it might not be in the req later
        if (req.websocket && req.websocket._socket) {
            this.remoteAddress = req.websocket._socket.remoteAddress;
        }
        else {
            this.remoteAddress = req.connection.remoteAddress;
        }
        this.checkIntervalTimer = null;
        this.upgradeTimeoutTimer = null;
        this.pingTimeoutTimer = null;
        this.pingIntervalTimer = null;
        this.setTransport(transport);
        this.onOpen();
    }
    get readyState() {
        return this._readyState;
    }
    set readyState(state) {
        debug("readyState updated from %s to %s", this._readyState, state);
        this._readyState = state;
    }
    /**
     * Called upon transport considered open.
     *
     * @api private
     */
    onOpen() {
        this.readyState = "open";
        // sends an `open` packet
        this.transport.sid = this.id;
        this.sendPacket("open", JSON.stringify({
            sid: this.id,
            upgrades: this.getAvailableUpgrades(),
            pingInterval: this.server.opts.pingInterval,
            pingTimeout: this.server.opts.pingTimeout
        }));
        if (this.server.opts.initialPacket) {
            this.sendPacket("message", this.server.opts.initialPacket);
        }
        this.emit("open");
        if (this.protocol === 3) {
            // in protocol v3, the client sends a ping, and the server answers with a pong
            this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        }
        else {
            // in protocol v4, the server sends a ping, and the client answers with a pong
            this.schedulePing();
        }
    }
    /**
     * Called upon transport packet.
     *
     * @param {Object} packet
     * @api private
     */
    onPacket(packet) {
        if ("open" !== this.readyState) {
            return debug("packet received with closed socket");
        }
        // export packet event
        debug(`received packet ${packet.type}`);
        this.emit("packet", packet);
        // Reset ping timeout on any packet, incoming data is a good sign of
        // other side's liveness
        this.resetPingTimeout(this.server.opts.pingInterval + this.server.opts.pingTimeout);
        switch (packet.type) {
            case "ping":
                if (this.transport.protocol !== 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug("got ping");
                this.sendPacket("pong");
                this.emit("heartbeat");
                break;
            case "pong":
                if (this.transport.protocol === 3) {
                    this.onError("invalid heartbeat direction");
                    return;
                }
                debug("got pong");
                this.pingIntervalTimer.refresh();
                this.emit("heartbeat");
                break;
            case "error":
                this.onClose("parse error");
                break;
            case "message":
                this.emit("data", packet.data);
                this.emit("message", packet.data);
                break;
        }
    }
    /**
     * Called upon transport error.
     *
     * @param {Error} error object
     * @api private
     */
    onError(err) {
        debug("transport error");
        this.onClose("transport error", err);
    }
    /**
     * Pings client every `this.pingInterval` and expects response
     * within `this.pingTimeout` or closes connection.
     *
     * @api private
     */
    schedulePing() {
        this.pingIntervalTimer = (0, timers_1.setTimeout)(() => {
            debug("writing ping packet - expecting pong within %sms", this.server.opts.pingTimeout);
            this.sendPacket("ping");
            this.resetPingTimeout(this.server.opts.pingTimeout);
        }, this.server.opts.pingInterval);
    }
    /**
     * Resets ping timeout.
     *
     * @api private
     */
    resetPingTimeout(timeout) {
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
        this.pingTimeoutTimer = (0, timers_1.setTimeout)(() => {
            if (this.readyState === "closed")
                return;
            this.onClose("ping timeout");
        }, timeout);
    }
    /**
     * Attaches handlers for the given transport.
     *
     * @param {Transport} transport
     * @api private
     */
    setTransport(transport) {
        const onError = this.onError.bind(this);
        const onPacket = this.onPacket.bind(this);
        const flush = this.flush.bind(this);
        const onClose = this.onClose.bind(this, "transport close");
        this.transport = transport;
        this.transport.once("error", onError);
        this.transport.on("packet", onPacket);
        this.transport.on("drain", flush);
        this.transport.once("close", onClose);
        // this function will manage packet events (also message callbacks)
        this.setupSendCallback();
        this.cleanupFn.push(function () {
            transport.removeListener("error", onError);
            transport.removeListener("packet", onPacket);
            transport.removeListener("drain", flush);
            transport.removeListener("close", onClose);
        });
    }
    /**
     * Upgrades socket to the given transport
     *
     * @param {Transport} transport
     * @api private
     */
    maybeUpgrade(transport) {
        debug('might upgrade socket transport from "%s" to "%s"', this.transport.name, transport.name);
        this.upgrading = true;
        // set transport upgrade timer
        this.upgradeTimeoutTimer = (0, timers_1.setTimeout)(() => {
            debug("client did not complete upgrade - closing transport");
            cleanup();
            if ("open" === transport.readyState) {
                transport.close();
            }
        }, this.server.opts.upgradeTimeout);
        const onPacket = packet => {
            if ("ping" === packet.type && "probe" === packet.data) {
                debug("got probe ping packet, sending pong");
                transport.send([{ type: "pong", data: "probe" }]);
                this.emit("upgrading", transport);
                clearInterval(this.checkIntervalTimer);
                this.checkIntervalTimer = setInterval(check, 100);
            }
            else if ("upgrade" === packet.type && this.readyState !== "closed") {
                debug("got upgrade packet - upgrading");
                cleanup();
                this.transport.discard();
                this.upgraded = true;
                this.clearTransport();
                this.setTransport(transport);
                this.emit("upgrade", transport);
                this.flush();
                if (this.readyState === "closing") {
                    transport.close(() => {
                        this.onClose("forced close");
                    });
                }
            }
            else {
                cleanup();
                transport.close();
            }
        };
        // we force a polling cycle to ensure a fast upgrade
        const check = () => {
            if ("polling" === this.transport.name && this.transport.writable) {
                debug("writing a noop packet to polling for fast upgrade");
                this.transport.send([{ type: "noop" }]);
            }
        };
        const cleanup = () => {
            this.upgrading = false;
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            (0, timers_1.clearTimeout)(this.upgradeTimeoutTimer);
            this.upgradeTimeoutTimer = null;
            transport.removeListener("packet", onPacket);
            transport.removeListener("close", onTransportClose);
            transport.removeListener("error", onError);
            this.removeListener("close", onClose);
        };
        const onError = err => {
            debug("client did not complete upgrade - %s", err);
            cleanup();
            transport.close();
            transport = null;
        };
        const onTransportClose = () => {
            onError("transport closed");
        };
        const onClose = () => {
            onError("socket closed");
        };
        transport.on("packet", onPacket);
        transport.once("close", onTransportClose);
        transport.once("error", onError);
        this.once("close", onClose);
    }
    /**
     * Clears listeners and timers associated with current transport.
     *
     * @api private
     */
    clearTransport() {
        let cleanup;
        const toCleanUp = this.cleanupFn.length;
        for (let i = 0; i < toCleanUp; i++) {
            cleanup = this.cleanupFn.shift();
            cleanup();
        }
        // silence further transport errors and prevent uncaught exceptions
        this.transport.on("error", function () {
            debug("error triggered by discarded transport");
        });
        // ensure transport won't stay open
        this.transport.close();
        (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
    }
    /**
     * Called upon transport considered closed.
     * Possible reasons: `ping timeout`, `client error`, `parse error`,
     * `transport error`, `server close`, `transport close`
     */
    onClose(reason, description) {
        if ("closed" !== this.readyState) {
            this.readyState = "closed";
            // clear timers
            (0, timers_1.clearTimeout)(this.pingIntervalTimer);
            (0, timers_1.clearTimeout)(this.pingTimeoutTimer);
            clearInterval(this.checkIntervalTimer);
            this.checkIntervalTimer = null;
            (0, timers_1.clearTimeout)(this.upgradeTimeoutTimer);
            // clean writeBuffer in next tick, so developers can still
            // grab the writeBuffer on 'close' event
            process.nextTick(() => {
                this.writeBuffer = [];
            });
            this.packetsFn = [];
            this.sentCallbackFn = [];
            this.clearTransport();
            this.emit("close", reason, description);
        }
    }
    /**
     * Setup and manage send callback
     *
     * @api private
     */
    setupSendCallback() {
        // the message was sent successfully, execute the callback
        const onDrain = () => {
            if (this.sentCallbackFn.length > 0) {
                const seqFn = this.sentCallbackFn.splice(0, 1)[0];
                if ("function" === typeof seqFn) {
                    debug("executing send callback");
                    seqFn(this.transport);
                }
                else if (Array.isArray(seqFn)) {
                    debug("executing batch send callback");
                    const l = seqFn.length;
                    let i = 0;
                    for (; i < l; i++) {
                        if ("function" === typeof seqFn[i]) {
                            seqFn[i](this.transport);
                        }
                    }
                }
            }
        };
        this.transport.on("drain", onDrain);
        this.cleanupFn.push(() => {
            this.transport.removeListener("drain", onDrain);
        });
    }
    /**
     * Sends a message packet.
     *
     * @param {Object} data
     * @param {Object} options
     * @param {Function} callback
     * @return {Socket} for chaining
     * @api public
     */
    send(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    write(data, options, callback) {
        this.sendPacket("message", data, options, callback);
        return this;
    }
    /**
     * Sends a packet.
     *
     * @param {String} type - packet type
     * @param {String} data
     * @param {Object} options
     * @param {Function} callback
     *
     * @api private
     */
    sendPacket(type, data, options, callback) {
        if ("function" === typeof options) {
            callback = options;
            options = null;
        }
        options = options || {};
        options.compress = false !== options.compress;
        if ("closing" !== this.readyState && "closed" !== this.readyState) {
            debug('sending packet "%s" (%s)', type, data);
            const packet = {
                type,
                options
            };
            if (data)
                packet.data = data;
            // exports packetCreate event
            this.emit("packetCreate", packet);
            this.writeBuffer.push(packet);
            // add send callback to object, if defined
            if (callback)
                this.packetsFn.push(callback);
            this.flush();
        }
    }
    /**
     * Attempts to flush the packets buffer.
     *
     * @api private
     */
    flush() {
        if ("closed" !== this.readyState &&
            this.transport.writable &&
            this.writeBuffer.length) {
            debug("flushing buffer to transport");
            this.emit("flush", this.writeBuffer);
            this.server.emit("flush", this, this.writeBuffer);
            const wbuf = this.writeBuffer;
            this.writeBuffer = [];
            if (!this.transport.supportsFraming) {
                this.sentCallbackFn.push(this.packetsFn);
            }
            else {
                this.sentCallbackFn.push.apply(this.sentCallbackFn, this.packetsFn);
            }
            this.packetsFn = [];
            this.transport.send(wbuf);
            this.emit("drain");
            this.server.emit("drain", this);
        }
    }
    /**
     * Get available upgrades for this socket.
     *
     * @api private
     */
    getAvailableUpgrades() {
        const availableUpgrades = [];
        const allUpgrades = this.server.upgrades(this.transport.name);
        let i = 0;
        const l = allUpgrades.length;
        for (; i < l; ++i) {
            const upg = allUpgrades[i];
            if (this.server.opts.transports.indexOf(upg) !== -1) {
                availableUpgrades.push(upg);
            }
        }
        return availableUpgrades;
    }
    /**
     * Closes the socket and underlying transport.
     *
     * @param {Boolean} discard - optional, discard the transport
     * @return {Socket} for chaining
     * @api public
     */
    close(discard) {
        if ("open" !== this.readyState)
            return;
        this.readyState = "closing";
        if (this.writeBuffer.length) {
            this.once("drain", this.closeTransport.bind(this, discard));
            return;
        }
        this.closeTransport(discard);
    }
    /**
     * Closes the underlying transport.
     *
     * @param {Boolean} discard
     * @api private
     */
    closeTransport(discard) {
        if (discard)
            this.transport.discard();
        this.transport.close(this.onClose.bind(this, "forced close"));
    }
}
exports.Socket = Socket;


/***/ }),
/* 120 */
/***/ ((module) => {

"use strict";
module.exports = require("timers");

/***/ }),
/* 121 */
/***/ ((module) => {

"use strict";
module.exports = require("cookie");

/***/ }),
/* 122 */
/***/ ((module) => {

"use strict";
module.exports = require("ws");

/***/ }),
/* 123 */
/***/ ((module) => {

"use strict";
module.exports = require("cors");

/***/ }),
/* 124 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uServer = void 0;
const debug_1 = __webpack_require__(116);
const server_1 = __webpack_require__(101);
const transports_uws_1 = __webpack_require__(125);
const debug = (0, debug_1.default)("engine:uws");
class uServer extends server_1.BaseServer {
    init() { }
    cleanup() { }
    /**
     * Prepares a request by processing the query string.
     *
     * @api private
     */
    prepare(req, res) {
        req.method = req.getMethod().toUpperCase();
        const params = new URLSearchParams(req.getQuery());
        req._query = Object.fromEntries(params.entries());
        req.headers = {};
        req.forEach((key, value) => {
            req.headers[key] = value;
        });
        req.connection = {
            remoteAddress: Buffer.from(res.getRemoteAddressAsText()).toString()
        };
        res.onAborted(() => {
            debug("response has been aborted");
        });
    }
    createTransport(transportName, req) {
        return new transports_uws_1.default[transportName](req);
    }
    /**
     * Attach the engine to a µWebSockets.js server
     * @param app
     * @param options
     */
    attach(app /* : TemplatedApp */, options = {}) {
        const path = (options.path || "/engine.io").replace(/\/$/, "") + "/";
        app
            .any(path, this.handleRequest.bind(this))
            //
            .ws(path, {
            compression: options.compression,
            idleTimeout: options.idleTimeout,
            maxBackpressure: options.maxBackpressure,
            maxPayloadLength: this.opts.maxHttpBufferSize,
            upgrade: this.handleUpgrade.bind(this),
            open: ws => {
                ws.transport.socket = ws;
                ws.transport.writable = true;
                ws.transport.emit("drain");
            },
            message: (ws, message, isBinary) => {
                ws.transport.onData(isBinary ? message : Buffer.from(message).toString());
            },
            close: (ws, code, message) => {
                ws.transport.onClose(code, message);
            }
        });
    }
    handleRequest(res, req) {
        debug('handling "%s" http request "%s"', req.getMethod(), req.getUrl());
        this.prepare(req, res);
        req.res = res;
        const callback = (errorCode, errorContext) => {
            if (errorCode !== undefined) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext
                });
                this.abortRequest(req.res, errorCode, errorContext);
                return;
            }
            if (req._query.sid) {
                debug("setting new request for existing client");
                this.clients[req._query.sid].transport.onRequest(req);
            }
            else {
                const closeConnection = (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext);
                this.handshake(req._query.transport, req, closeConnection);
            }
        };
        if (this.corsMiddleware) {
            // needed to buffer headers until the status is computed
            req.res = new ResponseWrapper(res);
            this.corsMiddleware.call(null, req, req.res, () => {
                this.verify(req, false, callback);
            });
        }
        else {
            this.verify(req, false, callback);
        }
    }
    handleUpgrade(res, req, context) {
        debug("on upgrade");
        this.prepare(req, res);
        // @ts-ignore
        req.res = res;
        this.verify(req, true, async (errorCode, errorContext) => {
            if (errorCode) {
                this.emit("connection_error", {
                    req,
                    code: errorCode,
                    message: server_1.Server.errorMessages[errorCode],
                    context: errorContext
                });
                this.abortRequest(res, errorCode, errorContext);
                return;
            }
            const id = req._query.sid;
            let transport;
            if (id) {
                const client = this.clients[id];
                if (!client) {
                    debug("upgrade attempt for closed client");
                    res.close();
                }
                else if (client.upgrading) {
                    debug("transport has already been trying to upgrade");
                    res.close();
                }
                else if (client.upgraded) {
                    debug("transport had already been upgraded");
                    res.close();
                }
                else {
                    debug("upgrading existing transport");
                    transport = this.createTransport(req._query.transport, req);
                    client.maybeUpgrade(transport);
                }
            }
            else {
                transport = await this.handshake(req._query.transport, req, (errorCode, errorContext) => this.abortRequest(res, errorCode, errorContext));
                if (!transport) {
                    return;
                }
            }
            res.upgrade({
                transport
            }, req.getHeader("sec-websocket-key"), req.getHeader("sec-websocket-protocol"), req.getHeader("sec-websocket-extensions"), context);
        });
    }
    abortRequest(res, errorCode, errorContext) {
        const statusCode = errorCode === server_1.Server.errors.FORBIDDEN
            ? "403 Forbidden"
            : "400 Bad Request";
        const message = errorContext && errorContext.message
            ? errorContext.message
            : server_1.Server.errorMessages[errorCode];
        res.writeStatus(statusCode);
        res.writeHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            code: errorCode,
            message
        }));
    }
}
exports.uServer = uServer;
class ResponseWrapper {
    constructor(res) {
        this.res = res;
        this.statusWritten = false;
        this.headers = [];
    }
    set statusCode(status) {
        this.writeStatus(status === 200 ? "200 OK" : "204 No Content");
    }
    setHeader(key, value) {
        this.writeHeader(key, value);
    }
    // needed by vary: https://github.com/jshttp/vary/blob/5d725d059b3871025cf753e9dfa08924d0bcfa8f/index.js#L134
    getHeader() { }
    writeStatus(status) {
        this.res.writeStatus(status);
        this.statusWritten = true;
        this.writeBufferedHeaders();
    }
    writeHeader(key, value) {
        if (key === "Content-Length") {
            // the content length is automatically added by uWebSockets.js
            return;
        }
        if (this.statusWritten) {
            this.res.writeHeader(key, value);
        }
        else {
            this.headers.push([key, value]);
        }
    }
    writeBufferedHeaders() {
        this.headers.forEach(([key, value]) => {
            this.res.writeHeader(key, value);
        });
    }
    end(data) {
        if (!this.statusWritten) {
            // status will be inferred as "200 OK"
            this.writeBufferedHeaders();
        }
        this.res.end(data);
    }
    onData(fn) {
        this.res.onData(fn);
    }
    onAborted(fn) {
        this.res.onAborted(fn);
    }
}


/***/ }),
/* 125 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
const polling_1 = __webpack_require__(126);
const websocket_1 = __webpack_require__(127);
exports["default"] = {
    polling: polling_1.Polling,
    websocket: websocket_1.WebSocket
};


/***/ }),
/* 126 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Polling = void 0;
const transport_1 = __webpack_require__(108);
const zlib_1 = __webpack_require__(97);
const accepts = __webpack_require__(98);
const debug_1 = __webpack_require__(116);
const debug = (0, debug_1.default)("engine:polling");
const compressionMethods = {
    gzip: zlib_1.createGzip,
    deflate: zlib_1.createDeflate
};
class Polling extends transport_1.Transport {
    /**
     * HTTP polling constructor.
     *
     * @api public.
     */
    constructor(req) {
        super(req);
        this.closeTimeout = 30 * 1000;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "polling";
    }
    get supportsFraming() {
        return false;
    }
    /**
     * Overrides onRequest.
     *
     * @param req
     *
     * @api private
     */
    onRequest(req) {
        const res = req.res;
        if (req.getMethod() === "get") {
            this.onPollRequest(req, res);
        }
        else if (req.getMethod() === "post") {
            this.onDataRequest(req, res);
        }
        else {
            res.writeStatus("500 Internal Server Error");
            res.end();
        }
    }
    /**
     * The client sends a request awaiting for us to send data.
     *
     * @api private
     */
    onPollRequest(req, res) {
        if (this.req) {
            debug("request overlap");
            // assert: this.res, '.req and .res should be (un)set together'
            this.onError("overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        debug("setting request");
        this.req = req;
        this.res = res;
        const onClose = () => {
            this.writable = false;
            this.onError("poll connection closed prematurely");
        };
        const cleanup = () => {
            this.req = this.res = null;
        };
        req.cleanup = cleanup;
        res.onAborted(onClose);
        this.writable = true;
        this.emit("drain");
        // if we're still writable but had a pending close, trigger an empty send
        if (this.writable && this.shouldClose) {
            debug("triggering empty send to append close packet");
            this.send([{ type: "noop" }]);
        }
    }
    /**
     * The client sends a request with data.
     *
     * @api private
     */
    onDataRequest(req, res) {
        if (this.dataReq) {
            // assert: this.dataRes, '.dataReq and .dataRes should be (un)set together'
            this.onError("data request overlap from client");
            res.writeStatus("500 Internal Server Error");
            res.end();
            return;
        }
        const expectedContentLength = Number(req.headers["content-length"]);
        if (!expectedContentLength) {
            this.onError("content-length header required");
            res.writeStatus("411 Length Required").end();
            return;
        }
        if (expectedContentLength > this.maxHttpBufferSize) {
            this.onError("payload too large");
            res.writeStatus("413 Payload Too Large").end();
            return;
        }
        const isBinary = "application/octet-stream" === req.headers["content-type"];
        if (isBinary && this.protocol === 4) {
            return this.onError("invalid content");
        }
        this.dataReq = req;
        this.dataRes = res;
        let buffer;
        let offset = 0;
        const headers = {
            // text/html is required instead of text/plain to avoid an
            // unwanted download dialog on certain user-agents (GH-43)
            "Content-Type": "text/html"
        };
        this.headers(req, headers);
        for (let key in headers) {
            res.writeHeader(key, String(headers[key]));
        }
        const onEnd = buffer => {
            this.onData(buffer.toString());
            this.onDataRequestCleanup();
            res.end("ok");
        };
        res.onAborted(() => {
            this.onDataRequestCleanup();
            this.onError("data request connection closed prematurely");
        });
        res.onData((arrayBuffer, isLast) => {
            const totalLength = offset + arrayBuffer.byteLength;
            if (totalLength > expectedContentLength) {
                this.onError("content-length mismatch");
                res.close(); // calls onAborted
                return;
            }
            if (!buffer) {
                if (isLast) {
                    onEnd(Buffer.from(arrayBuffer));
                    return;
                }
                buffer = Buffer.allocUnsafe(expectedContentLength);
            }
            Buffer.from(arrayBuffer).copy(buffer, offset);
            if (isLast) {
                if (totalLength != expectedContentLength) {
                    this.onError("content-length mismatch");
                    res.writeStatus("400 Content-Length Mismatch").end();
                    this.onDataRequestCleanup();
                    return;
                }
                onEnd(buffer);
                return;
            }
            offset = totalLength;
        });
    }
    /**
     * Cleanup request.
     *
     * @api private
     */
    onDataRequestCleanup() {
        this.dataReq = this.dataRes = null;
    }
    /**
     * Processes the incoming data payload.
     *
     * @param {String} encoded payload
     * @api private
     */
    onData(data) {
        debug('received "%s"', data);
        const callback = packet => {
            if ("close" === packet.type) {
                debug("got xhr close packet");
                this.onClose();
                return false;
            }
            this.onPacket(packet);
        };
        if (this.protocol === 3) {
            this.parser.decodePayload(data, callback);
        }
        else {
            this.parser.decodePayload(data).forEach(callback);
        }
    }
    /**
     * Overrides onClose.
     *
     * @api private
     */
    onClose() {
        if (this.writable) {
            // close pending poll request
            this.send([{ type: "noop" }]);
        }
        super.onClose();
    }
    /**
     * Writes a packet payload.
     *
     * @param {Object} packet
     * @api private
     */
    send(packets) {
        this.writable = false;
        if (this.shouldClose) {
            debug("appending close packet to payload");
            packets.push({ type: "close" });
            this.shouldClose();
            this.shouldClose = null;
        }
        const doWrite = data => {
            const compress = packets.some(packet => {
                return packet.options && packet.options.compress;
            });
            this.write(data, { compress });
        };
        if (this.protocol === 3) {
            this.parser.encodePayload(packets, this.supportsBinary, doWrite);
        }
        else {
            this.parser.encodePayload(packets, doWrite);
        }
    }
    /**
     * Writes data as response to poll request.
     *
     * @param {String} data
     * @param {Object} options
     * @api private
     */
    write(data, options) {
        debug('writing "%s"', data);
        this.doWrite(data, options, () => {
            this.req.cleanup();
        });
    }
    /**
     * Performs the write.
     *
     * @api private
     */
    doWrite(data, options, callback) {
        // explicit UTF-8 is required for pages not served under utf
        const isString = typeof data === "string";
        const contentType = isString
            ? "text/plain; charset=UTF-8"
            : "application/octet-stream";
        const headers = {
            "Content-Type": contentType
        };
        const respond = data => {
            this.headers(this.req, headers);
            Object.keys(headers).forEach(key => {
                this.res.writeHeader(key, String(headers[key]));
            });
            this.res.end(data);
            callback();
        };
        if (!this.httpCompression || !options.compress) {
            respond(data);
            return;
        }
        const len = isString ? Buffer.byteLength(data) : data.length;
        if (len < this.httpCompression.threshold) {
            respond(data);
            return;
        }
        const encoding = accepts(this.req).encodings(["gzip", "deflate"]);
        if (!encoding) {
            respond(data);
            return;
        }
        this.compress(data, encoding, (err, data) => {
            if (err) {
                this.res.writeStatus("500 Internal Server Error");
                this.res.end();
                callback(err);
                return;
            }
            headers["Content-Encoding"] = encoding;
            respond(data);
        });
    }
    /**
     * Compresses data.
     *
     * @api private
     */
    compress(data, encoding, callback) {
        debug("compressing");
        const buffers = [];
        let nread = 0;
        compressionMethods[encoding](this.httpCompression)
            .on("error", callback)
            .on("data", function (chunk) {
            buffers.push(chunk);
            nread += chunk.length;
        })
            .on("end", function () {
            callback(null, Buffer.concat(buffers, nread));
        })
            .end(data);
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        let closeTimeoutTimer;
        const onClose = () => {
            clearTimeout(closeTimeoutTimer);
            fn();
            this.onClose();
        };
        if (this.writable) {
            debug("transport writable - closing right away");
            this.send([{ type: "close" }]);
            onClose();
        }
        else if (this.discarded) {
            debug("transport discarded - closing right away");
            onClose();
        }
        else {
            debug("transport not writable - buffering orderly close");
            this.shouldClose = onClose;
            closeTimeoutTimer = setTimeout(onClose, this.closeTimeout);
        }
    }
    /**
     * Returns headers for a response.
     *
     * @param req - request
     * @param {Object} extra headers
     * @api private
     */
    headers(req, headers) {
        headers = headers || {};
        // prevent XSS warnings on IE
        // https://github.com/LearnBoost/socket.io/pull/1333
        const ua = req.headers["user-agent"];
        if (ua && (~ua.indexOf(";MSIE") || ~ua.indexOf("Trident/"))) {
            headers["X-XSS-Protection"] = "0";
        }
        this.emit("headers", headers, req);
        return headers;
    }
}
exports.Polling = Polling;


/***/ }),
/* 127 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WebSocket = void 0;
const transport_1 = __webpack_require__(108);
const debug_1 = __webpack_require__(116);
const debug = (0, debug_1.default)("engine:ws");
class WebSocket extends transport_1.Transport {
    /**
     * WebSocket transport
     *
     * @param req
     * @api public
     */
    constructor(req) {
        super(req);
        this.writable = false;
        this.perMessageDeflate = null;
    }
    /**
     * Transport name
     *
     * @api public
     */
    get name() {
        return "websocket";
    }
    /**
     * Advertise upgrade support.
     *
     * @api public
     */
    get handlesUpgrades() {
        return true;
    }
    /**
     * Advertise framing support.
     *
     * @api public
     */
    get supportsFraming() {
        return true;
    }
    /**
     * Writes a packet payload.
     *
     * @param {Array} packets
     * @api private
     */
    send(packets) {
        const packet = packets.shift();
        if (typeof packet === "undefined") {
            this.writable = true;
            this.emit("drain");
            return;
        }
        // always creates a new object since ws modifies it
        const opts = {};
        if (packet.options) {
            opts.compress = packet.options.compress;
        }
        const send = data => {
            const isBinary = typeof data !== "string";
            const compress = this.perMessageDeflate &&
                Buffer.byteLength(data) > this.perMessageDeflate.threshold;
            debug('writing "%s"', data);
            this.writable = false;
            this.socket.send(data, isBinary, compress);
            this.send(packets);
        };
        if (packet.options && typeof packet.options.wsPreEncoded === "string") {
            send(packet.options.wsPreEncoded);
        }
        else {
            this.parser.encodePacket(packet, this.supportsBinary, send);
        }
    }
    /**
     * Closes the transport.
     *
     * @api private
     */
    doClose(fn) {
        debug("closing");
        fn && fn();
        // call fn first since socket.close() immediately emits a "close" event
        this.socket.close();
    }
}
exports.WebSocket = WebSocket;


/***/ }),
/* 128 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Client = void 0;
const socket_io_parser_1 = __webpack_require__(129);
const debugModule = __webpack_require__(116);
const url = __webpack_require__(103);
const debug = debugModule("socket.io:client");
class Client {
    /**
     * Client constructor.
     *
     * @param server instance
     * @param conn
     * @package
     */
    constructor(server, conn) {
        this.sockets = new Map();
        this.nsps = new Map();
        this.server = server;
        this.conn = conn;
        this.encoder = server.encoder;
        this.decoder = new server._parser.Decoder();
        this.id = conn.id;
        this.setup();
    }
    /**
     * @return the reference to the request that originated the Engine.IO connection
     *
     * @public
     */
    get request() {
        return this.conn.request;
    }
    /**
     * Sets up event listeners.
     *
     * @private
     */
    setup() {
        this.onclose = this.onclose.bind(this);
        this.ondata = this.ondata.bind(this);
        this.onerror = this.onerror.bind(this);
        this.ondecoded = this.ondecoded.bind(this);
        // @ts-ignore
        this.decoder.on("decoded", this.ondecoded);
        this.conn.on("data", this.ondata);
        this.conn.on("error", this.onerror);
        this.conn.on("close", this.onclose);
        this.connectTimeout = setTimeout(() => {
            if (this.nsps.size === 0) {
                debug("no namespace joined yet, close the client");
                this.close();
            }
            else {
                debug("the client has already joined a namespace, nothing to do");
            }
        }, this.server._connectTimeout);
    }
    /**
     * Connects a client to a namespace.
     *
     * @param {String} name - the namespace
     * @param {Object} auth - the auth parameters
     * @private
     */
    connect(name, auth = {}) {
        if (this.server._nsps.has(name)) {
            debug("connecting to namespace %s", name);
            return this.doConnect(name, auth);
        }
        this.server._checkNamespace(name, auth, (dynamicNspName) => {
            if (dynamicNspName) {
                this.doConnect(name, auth);
            }
            else {
                debug("creation of namespace %s was denied", name);
                this._packet({
                    type: socket_io_parser_1.PacketType.CONNECT_ERROR,
                    nsp: name,
                    data: {
                        message: "Invalid namespace",
                    },
                });
            }
        });
    }
    /**
     * Connects a client to a namespace.
     *
     * @param name - the namespace
     * @param {Object} auth - the auth parameters
     *
     * @private
     */
    doConnect(name, auth) {
        const nsp = this.server.of(name);
        const socket = nsp._add(this, auth, () => {
            this.sockets.set(socket.id, socket);
            this.nsps.set(nsp.name, socket);
            if (this.connectTimeout) {
                clearTimeout(this.connectTimeout);
                this.connectTimeout = undefined;
            }
        });
    }
    /**
     * Disconnects from all namespaces and closes transport.
     *
     * @private
     */
    _disconnect() {
        for (const socket of this.sockets.values()) {
            socket.disconnect();
        }
        this.sockets.clear();
        this.close();
    }
    /**
     * Removes a socket. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            const nsp = this.sockets.get(socket.id).nsp.name;
            this.sockets.delete(socket.id);
            this.nsps.delete(nsp);
        }
        else {
            debug("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Closes the underlying connection.
     *
     * @private
     */
    close() {
        if ("open" === this.conn.readyState) {
            debug("forcing transport close");
            this.conn.close();
            this.onclose("forced server close");
        }
    }
    /**
     * Writes a packet to the transport.
     *
     * @param {Object} packet object
     * @param {Object} opts
     * @private
     */
    _packet(packet, opts = {}) {
        if (this.conn.readyState !== "open") {
            debug("ignoring packet write %j", packet);
            return;
        }
        const encodedPackets = opts.preEncoded
            ? packet // previous versions of the adapter incorrectly used socket.packet() instead of writeToEngine()
            : this.encoder.encode(packet);
        this.writeToEngine(encodedPackets, opts);
    }
    writeToEngine(encodedPackets, opts) {
        if (opts.volatile && !this.conn.transport.writable) {
            debug("volatile packet is discarded since the transport is not currently writable");
            return;
        }
        const packets = Array.isArray(encodedPackets)
            ? encodedPackets
            : [encodedPackets];
        for (const encodedPacket of packets) {
            this.conn.write(encodedPacket, opts);
        }
    }
    /**
     * Called with incoming transport data.
     *
     * @private
     */
    ondata(data) {
        // try/catch is needed for protocol violations (GH-1880)
        try {
            this.decoder.add(data);
        }
        catch (e) {
            this.onerror(e);
        }
    }
    /**
     * Called when parser fully decodes a packet.
     *
     * @private
     */
    ondecoded(packet) {
        if (socket_io_parser_1.PacketType.CONNECT === packet.type) {
            if (this.conn.protocol === 3) {
                const parsed = url.parse(packet.nsp, true);
                this.connect(parsed.pathname, parsed.query);
            }
            else {
                this.connect(packet.nsp, packet.data);
            }
        }
        else {
            const socket = this.nsps.get(packet.nsp);
            if (socket) {
                process.nextTick(function () {
                    socket._onpacket(packet);
                });
            }
            else {
                debug("no socket for namespace %s", packet.nsp);
            }
        }
    }
    /**
     * Handles an error.
     *
     * @param {Object} err object
     * @private
     */
    onerror(err) {
        for (const socket of this.sockets.values()) {
            socket._onerror(err);
        }
        this.conn.close();
    }
    /**
     * Called upon transport close.
     *
     * @param reason
     * @private
     */
    onclose(reason) {
        debug("client close with reason %s", reason);
        // ignore a potential subsequent `close` event
        this.destroy();
        // `nsps` and `sockets` are cleaned up seamlessly
        for (const socket of this.sockets.values()) {
            socket._onclose(reason);
        }
        this.sockets.clear();
        this.decoder.destroy(); // clean up decoder
    }
    /**
     * Cleans up event listeners.
     * @private
     */
    destroy() {
        this.conn.removeListener("data", this.ondata);
        this.conn.removeListener("error", this.onerror);
        this.conn.removeListener("close", this.onclose);
        // @ts-ignore
        this.decoder.removeListener("decoded", this.ondecoded);
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = undefined;
        }
    }
}
exports.Client = Client;


/***/ }),
/* 129 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Decoder = exports.Encoder = exports.PacketType = exports.protocol = void 0;
const Emitter = __webpack_require__(130);
const binary_1 = __webpack_require__(131);
const is_binary_1 = __webpack_require__(132);
const debug = __webpack_require__(116)("socket.io-parser");
/**
 * Protocol version.
 *
 * @public
 */
exports.protocol = 5;
var PacketType;
(function (PacketType) {
    PacketType[PacketType["CONNECT"] = 0] = "CONNECT";
    PacketType[PacketType["DISCONNECT"] = 1] = "DISCONNECT";
    PacketType[PacketType["EVENT"] = 2] = "EVENT";
    PacketType[PacketType["ACK"] = 3] = "ACK";
    PacketType[PacketType["CONNECT_ERROR"] = 4] = "CONNECT_ERROR";
    PacketType[PacketType["BINARY_EVENT"] = 5] = "BINARY_EVENT";
    PacketType[PacketType["BINARY_ACK"] = 6] = "BINARY_ACK";
})(PacketType = exports.PacketType || (exports.PacketType = {}));
/**
 * A socket.io Encoder instance
 */
class Encoder {
    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     */
    encode(obj) {
        debug("encoding packet %j", obj);
        if (obj.type === PacketType.EVENT || obj.type === PacketType.ACK) {
            if (is_binary_1.hasBinary(obj)) {
                obj.type =
                    obj.type === PacketType.EVENT
                        ? PacketType.BINARY_EVENT
                        : PacketType.BINARY_ACK;
                return this.encodeAsBinary(obj);
            }
        }
        return [this.encodeAsString(obj)];
    }
    /**
     * Encode packet as string.
     */
    encodeAsString(obj) {
        // first is type
        let str = "" + obj.type;
        // attachments if we have them
        if (obj.type === PacketType.BINARY_EVENT ||
            obj.type === PacketType.BINARY_ACK) {
            str += obj.attachments + "-";
        }
        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && "/" !== obj.nsp) {
            str += obj.nsp + ",";
        }
        // immediately followed by the id
        if (null != obj.id) {
            str += obj.id;
        }
        // json data
        if (null != obj.data) {
            str += JSON.stringify(obj.data);
        }
        debug("encoded %j as %s", obj, str);
        return str;
    }
    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     */
    encodeAsBinary(obj) {
        const deconstruction = binary_1.deconstructPacket(obj);
        const pack = this.encodeAsString(deconstruction.packet);
        const buffers = deconstruction.buffers;
        buffers.unshift(pack); // add packet info to beginning of data list
        return buffers; // write all the buffers
    }
}
exports.Encoder = Encoder;
/**
 * A socket.io Decoder instance
 *
 * @return {Object} decoder
 */
class Decoder extends Emitter {
    constructor() {
        super();
    }
    /**
     * Decodes an encoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     */
    add(obj) {
        let packet;
        if (typeof obj === "string") {
            packet = this.decodeString(obj);
            if (packet.type === PacketType.BINARY_EVENT ||
                packet.type === PacketType.BINARY_ACK) {
                // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);
                // no attachments, labeled binary but no binary data to follow
                if (packet.attachments === 0) {
                    super.emit("decoded", packet);
                }
            }
            else {
                // non-binary full packet
                super.emit("decoded", packet);
            }
        }
        else if (is_binary_1.isBinary(obj) || obj.base64) {
            // raw binary data
            if (!this.reconstructor) {
                throw new Error("got binary data when not reconstructing a packet");
            }
            else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) {
                    // received final buffer
                    this.reconstructor = null;
                    super.emit("decoded", packet);
                }
            }
        }
        else {
            throw new Error("Unknown type: " + obj);
        }
    }
    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     */
    decodeString(str) {
        let i = 0;
        // look up type
        const p = {
            type: Number(str.charAt(0)),
        };
        if (PacketType[p.type] === undefined) {
            throw new Error("unknown packet type " + p.type);
        }
        // look up attachments if type binary
        if (p.type === PacketType.BINARY_EVENT ||
            p.type === PacketType.BINARY_ACK) {
            const start = i + 1;
            while (str.charAt(++i) !== "-" && i != str.length) { }
            const buf = str.substring(start, i);
            if (buf != Number(buf) || str.charAt(i) !== "-") {
                throw new Error("Illegal attachments");
            }
            p.attachments = Number(buf);
        }
        // look up namespace (if any)
        if ("/" === str.charAt(i + 1)) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if ("," === c)
                    break;
                if (i === str.length)
                    break;
            }
            p.nsp = str.substring(start, i);
        }
        else {
            p.nsp = "/";
        }
        // look up id
        const next = str.charAt(i + 1);
        if ("" !== next && Number(next) == next) {
            const start = i + 1;
            while (++i) {
                const c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                if (i === str.length)
                    break;
            }
            p.id = Number(str.substring(start, i + 1));
        }
        // look up json data
        if (str.charAt(++i)) {
            const payload = tryParse(str.substr(i));
            if (Decoder.isPayloadValid(p.type, payload)) {
                p.data = payload;
            }
            else {
                throw new Error("invalid payload");
            }
        }
        debug("decoded %s as %j", str, p);
        return p;
    }
    static isPayloadValid(type, payload) {
        switch (type) {
            case PacketType.CONNECT:
                return typeof payload === "object";
            case PacketType.DISCONNECT:
                return payload === undefined;
            case PacketType.CONNECT_ERROR:
                return typeof payload === "string" || typeof payload === "object";
            case PacketType.EVENT:
            case PacketType.BINARY_EVENT:
                return Array.isArray(payload) && payload.length > 0;
            case PacketType.ACK:
            case PacketType.BINARY_ACK:
                return Array.isArray(payload);
        }
    }
    /**
     * Deallocates a parser's resources
     */
    destroy() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    }
}
exports.Decoder = Decoder;
function tryParse(str) {
    try {
        return JSON.parse(str);
    }
    catch (e) {
        return false;
    }
}
/**
 * A manager of a binary event's 'buffer sequence'. Should
 * be constructed whenever a packet of type BINARY_EVENT is
 * decoded.
 *
 * @param {Object} packet
 * @return {BinaryReconstructor} initialized reconstructor
 */
class BinaryReconstructor {
    constructor(packet) {
        this.packet = packet;
        this.buffers = [];
        this.reconPack = packet;
    }
    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     */
    takeBinaryData(binData) {
        this.buffers.push(binData);
        if (this.buffers.length === this.reconPack.attachments) {
            // done with buffer list
            const packet = binary_1.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    }
    /**
     * Cleans up binary packet reconstruction variables.
     */
    finishedReconstruction() {
        this.reconPack = null;
        this.buffers = [];
    }
}


/***/ }),
/* 130 */
/***/ ((module) => {

"use strict";
module.exports = require("component-emitter");

/***/ }),
/* 131 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.reconstructPacket = exports.deconstructPacket = void 0;
const is_binary_1 = __webpack_require__(132);
/**
 * Replaces every Buffer | ArrayBuffer | Blob | File in packet with a numbered placeholder.
 *
 * @param {Object} packet - socket.io event packet
 * @return {Object} with deconstructed packet and list of buffers
 * @public
 */
function deconstructPacket(packet) {
    const buffers = [];
    const packetData = packet.data;
    const pack = packet;
    pack.data = _deconstructPacket(packetData, buffers);
    pack.attachments = buffers.length; // number of binary 'attachments'
    return { packet: pack, buffers: buffers };
}
exports.deconstructPacket = deconstructPacket;
function _deconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (is_binary_1.isBinary(data)) {
        const placeholder = { _placeholder: true, num: buffers.length };
        buffers.push(data);
        return placeholder;
    }
    else if (Array.isArray(data)) {
        const newData = new Array(data.length);
        for (let i = 0; i < data.length; i++) {
            newData[i] = _deconstructPacket(data[i], buffers);
        }
        return newData;
    }
    else if (typeof data === "object" && !(data instanceof Date)) {
        const newData = {};
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                newData[key] = _deconstructPacket(data[key], buffers);
            }
        }
        return newData;
    }
    return data;
}
/**
 * Reconstructs a binary packet from its placeholder packet and buffers
 *
 * @param {Object} packet - event packet with placeholders
 * @param {Array} buffers - binary buffers to put in placeholder positions
 * @return {Object} reconstructed packet
 * @public
 */
function reconstructPacket(packet, buffers) {
    packet.data = _reconstructPacket(packet.data, buffers);
    packet.attachments = undefined; // no longer useful
    return packet;
}
exports.reconstructPacket = reconstructPacket;
function _reconstructPacket(data, buffers) {
    if (!data)
        return data;
    if (data && data._placeholder) {
        return buffers[data.num]; // appropriate buffer (should be natural order anyway)
    }
    else if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
            data[i] = _reconstructPacket(data[i], buffers);
        }
    }
    else if (typeof data === "object") {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                data[key] = _reconstructPacket(data[key], buffers);
            }
        }
    }
    return data;
}


/***/ }),
/* 132 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasBinary = exports.isBinary = void 0;
const withNativeArrayBuffer = typeof ArrayBuffer === "function";
const isView = (obj) => {
    return typeof ArrayBuffer.isView === "function"
        ? ArrayBuffer.isView(obj)
        : obj.buffer instanceof ArrayBuffer;
};
const toString = Object.prototype.toString;
const withNativeBlob = typeof Blob === "function" ||
    (typeof Blob !== "undefined" &&
        toString.call(Blob) === "[object BlobConstructor]");
const withNativeFile = typeof File === "function" ||
    (typeof File !== "undefined" &&
        toString.call(File) === "[object FileConstructor]");
/**
 * Returns true if obj is a Buffer, an ArrayBuffer, a Blob or a File.
 *
 * @private
 */
function isBinary(obj) {
    return ((withNativeArrayBuffer && (obj instanceof ArrayBuffer || isView(obj))) ||
        (withNativeBlob && obj instanceof Blob) ||
        (withNativeFile && obj instanceof File));
}
exports.isBinary = isBinary;
function hasBinary(obj, toJSON) {
    if (!obj || typeof obj !== "object") {
        return false;
    }
    if (Array.isArray(obj)) {
        for (let i = 0, l = obj.length; i < l; i++) {
            if (hasBinary(obj[i])) {
                return true;
            }
        }
        return false;
    }
    if (isBinary(obj)) {
        return true;
    }
    if (obj.toJSON &&
        typeof obj.toJSON === "function" &&
        arguments.length === 1) {
        return hasBinary(obj.toJSON(), true);
    }
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key) && hasBinary(obj[key])) {
            return true;
        }
    }
    return false;
}
exports.hasBinary = hasBinary;


/***/ }),
/* 133 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Namespace = exports.RESERVED_EVENTS = void 0;
const socket_1 = __webpack_require__(134);
const typed_events_1 = __webpack_require__(135);
const debug_1 = __importDefault(__webpack_require__(116));
const broadcast_operator_1 = __webpack_require__(136);
const debug = (0, debug_1.default)("socket.io:namespace");
exports.RESERVED_EVENTS = new Set(["connect", "connection", "new_namespace"]);
class Namespace extends typed_events_1.StrictEventEmitter {
    /**
     * Namespace constructor.
     *
     * @param server instance
     * @param name
     */
    constructor(server, name) {
        super();
        this.sockets = new Map();
        /** @private */
        this._fns = [];
        /** @private */
        this._ids = 0;
        this.server = server;
        this.name = name;
        this._initAdapter();
    }
    /**
     * Initializes the `Adapter` for this nsp.
     * Run upon changing adapter by `Server#adapter`
     * in addition to the constructor.
     *
     * @private
     */
    _initAdapter() {
        // @ts-ignore
        this.adapter = new (this.server.adapter())(this);
    }
    /**
     * Sets up namespace middleware.
     *
     * @return self
     * @public
     */
    use(fn) {
        this._fns.push(fn);
        return this;
    }
    /**
     * Executes the middleware for an incoming client.
     *
     * @param socket - the socket that will get added
     * @param fn - last fn call in the middleware
     * @private
     */
    run(socket, fn) {
        const fns = this._fns.slice(0);
        if (!fns.length)
            return fn(null);
        function run(i) {
            fns[i](socket, function (err) {
                // upon error, short-circuit
                if (err)
                    return fn(err);
                // if no middleware left, summon callback
                if (!fns[i + 1])
                    return fn(null);
                // go on to next
                run(i + 1);
            });
        }
        run(0);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).to(room);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).in(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param room
     * @return self
     * @public
     */
    except(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).except(room);
    }
    /**
     * Adds a new client.
     *
     * @return {Socket}
     * @private
     */
    _add(client, query, fn) {
        debug("adding socket to nsp %s", this.name);
        const socket = new socket_1.Socket(this, client, query);
        this.run(socket, (err) => {
            process.nextTick(() => {
                if ("open" == client.conn.readyState) {
                    if (err) {
                        if (client.conn.protocol === 3) {
                            return socket._error(err.data || err.message);
                        }
                        else {
                            return socket._error({
                                message: err.message,
                                data: err.data,
                            });
                        }
                    }
                    // track socket
                    this.sockets.set(socket.id, socket);
                    // it's paramount that the internal `onconnect` logic
                    // fires before user-set events to prevent state order
                    // violations (such as a disconnection before the connection
                    // logic is complete)
                    socket._onconnect();
                    if (fn)
                        fn();
                    // fire user-set events
                    this.emitReserved("connect", socket);
                    this.emitReserved("connection", socket);
                }
                else {
                    debug("next called after client was closed - ignoring socket");
                }
            });
        });
        return socket;
    }
    /**
     * Removes a client. Called by each `Socket`.
     *
     * @private
     */
    _remove(socket) {
        if (this.sockets.has(socket.id)) {
            this.sockets.delete(socket.id);
        }
        else {
            debug("ignoring remove for %s", socket.id);
        }
    }
    /**
     * Emits to all clients.
     *
     * @return Always true
     * @public
     */
    emit(ev, ...args) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).emit(ev, ...args);
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event to all clients.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Emit a packet to other Socket.IO servers
     *
     * @param ev - the event name
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     * @public
     */
    serverSideEmit(ev, ...args) {
        if (exports.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        args.unshift(ev);
        this.adapter.serverSideEmit(args);
        return true;
    }
    /**
     * Called when a packet is received from another Socket.IO server
     *
     * @param args - an array of arguments, which may include an acknowledgement callback at the end
     *
     * @private
     */
    _onServerSideEmit(args) {
        super.emitUntyped.apply(this, args);
    }
    /**
     * Gets a list of clients.
     *
     * @return self
     * @public
     */
    allSockets() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).allSockets();
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return self
     * @public
     */
    compress(compress) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).compress(compress);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return self
     * @public
     */
    get volatile() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).volatile;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return self
     * @public
     */
    get local() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).local;
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).fetchSockets();
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsJoin(room);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).socketsLeave(room);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        return new broadcast_operator_1.BroadcastOperator(this.adapter).disconnectSockets(close);
    }
}
exports.Namespace = Namespace;


/***/ }),
/* 134 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Socket = exports.RESERVED_EVENTS = void 0;
const socket_io_parser_1 = __webpack_require__(129);
const debug_1 = __importDefault(__webpack_require__(116));
const typed_events_1 = __webpack_require__(135);
const base64id_1 = __importDefault(__webpack_require__(104));
const broadcast_operator_1 = __webpack_require__(136);
const debug = (0, debug_1.default)("socket.io:socket");
exports.RESERVED_EVENTS = new Set([
    "connect",
    "connect_error",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener",
]);
class Socket extends typed_events_1.StrictEventEmitter {
    /**
     * Interface to a `Client` for a given `Namespace`.
     *
     * @param {Namespace} nsp
     * @param {Client} client
     * @param {Object} auth
     * @package
     */
    constructor(nsp, client, auth) {
        super();
        this.nsp = nsp;
        this.client = client;
        /**
         * Additional information that can be attached to the Socket instance and which will be used in the fetchSockets method
         */
        this.data = {};
        this.connected = false;
        this.acks = new Map();
        this.fns = [];
        this.flags = {};
        this.server = nsp.server;
        this.adapter = this.nsp.adapter;
        if (client.conn.protocol === 3) {
            // @ts-ignore
            this.id = nsp.name !== "/" ? nsp.name + "#" + client.id : client.id;
        }
        else {
            this.id = base64id_1.default.generateId(); // don't reuse the Engine.IO id because it's sensitive information
        }
        this.handshake = this.buildHandshake(auth);
    }
    /**
     * Builds the `handshake` BC object
     *
     * @private
     */
    buildHandshake(auth) {
        return {
            headers: this.request.headers,
            time: new Date() + "",
            address: this.conn.remoteAddress,
            xdomain: !!this.request.headers.origin,
            // @ts-ignore
            secure: !!this.request.connection.encrypted,
            issued: +new Date(),
            url: this.request.url,
            // @ts-ignore
            query: this.request._query,
            auth,
        };
    }
    /**
     * Emits to this client.
     *
     * @return Always returns `true`.
     * @public
     */
    emit(ev, ...args) {
        if (exports.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: data,
        };
        // access last argument to see if it's an ACK callback
        if (typeof data[data.length - 1] === "function") {
            const id = this.nsp._ids++;
            debug("emitting packet with ack id %d", id);
            this.registerAckCallback(id, data.pop());
            packet.id = id;
        }
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        this.packet(packet, flags);
        return true;
    }
    /**
     * @private
     */
    registerAckCallback(id, ack) {
        const timeout = this.flags.timeout;
        if (timeout === undefined) {
            this.acks.set(id, ack);
            return;
        }
        const timer = setTimeout(() => {
            debug("event with ack id %d has timed out after %d ms", id, timeout);
            this.acks.delete(id);
            ack.call(this, new Error("operation has timed out"));
        }, timeout);
        this.acks.set(id, (...args) => {
            clearTimeout(timer);
            ack.apply(this, [null, ...args]);
        });
    }
    /**
     * Targets a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    to(room) {
        return this.newBroadcastOperator().to(room);
    }
    /**
     * Targets a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    in(room) {
        return this.newBroadcastOperator().in(room);
    }
    /**
     * Excludes a room when broadcasting.
     *
     * @param room
     * @return self
     * @public
     */
    except(room) {
        return this.newBroadcastOperator().except(room);
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    send(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Sends a `message` event.
     *
     * @return self
     * @public
     */
    write(...args) {
        this.emit("message", ...args);
        return this;
    }
    /**
     * Writes a packet.
     *
     * @param {Object} packet - packet object
     * @param {Object} opts - options
     * @private
     */
    packet(packet, opts = {}) {
        packet.nsp = this.nsp.name;
        opts.compress = false !== opts.compress;
        this.client._packet(packet, opts);
    }
    /**
     * Joins a room.
     *
     * @param {String|Array} rooms - room or array of rooms
     * @return a Promise or nothing, depending on the adapter
     * @public
     */
    join(rooms) {
        debug("join room %s", rooms);
        return this.adapter.addAll(this.id, new Set(Array.isArray(rooms) ? rooms : [rooms]));
    }
    /**
     * Leaves a room.
     *
     * @param {String} room
     * @return a Promise or nothing, depending on the adapter
     * @public
     */
    leave(room) {
        debug("leave room %s", room);
        return this.adapter.del(this.id, room);
    }
    /**
     * Leave all rooms.
     *
     * @private
     */
    leaveAll() {
        this.adapter.delAll(this.id);
    }
    /**
     * Called by `Namespace` upon successful
     * middleware execution (ie: authorization).
     * Socket is added to namespace array before
     * call to join, so adapters can access it.
     *
     * @private
     */
    _onconnect() {
        debug("socket connected - writing packet");
        this.connected = true;
        this.join(this.id);
        if (this.conn.protocol === 3) {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT });
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.CONNECT, data: { sid: this.id } });
        }
    }
    /**
     * Called with each packet. Called by `Client`.
     *
     * @param {Object} packet
     * @private
     */
    _onpacket(packet) {
        debug("got packet %j", packet);
        switch (packet.type) {
            case socket_io_parser_1.PacketType.EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_EVENT:
                this.onevent(packet);
                break;
            case socket_io_parser_1.PacketType.ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.BINARY_ACK:
                this.onack(packet);
                break;
            case socket_io_parser_1.PacketType.DISCONNECT:
                this.ondisconnect();
                break;
            case socket_io_parser_1.PacketType.CONNECT_ERROR:
                this._onerror(new Error(packet.data));
        }
    }
    /**
     * Called upon event packet.
     *
     * @param {Packet} packet - packet object
     * @private
     */
    onevent(packet) {
        const args = packet.data || [];
        debug("emitting event %j", args);
        if (null != packet.id) {
            debug("attaching ack callback to event");
            args.push(this.ack(packet.id));
        }
        if (this._anyListeners && this._anyListeners.length) {
            const listeners = this._anyListeners.slice();
            for (const listener of listeners) {
                listener.apply(this, args);
            }
        }
        this.dispatch(args);
    }
    /**
     * Produces an ack callback to emit with an event.
     *
     * @param {Number} id - packet id
     * @private
     */
    ack(id) {
        const self = this;
        let sent = false;
        return function () {
            // prevent double callbacks
            if (sent)
                return;
            const args = Array.prototype.slice.call(arguments);
            debug("sending ack %j", args);
            self.packet({
                id: id,
                type: socket_io_parser_1.PacketType.ACK,
                data: args,
            });
            sent = true;
        };
    }
    /**
     * Called upon ack packet.
     *
     * @private
     */
    onack(packet) {
        const ack = this.acks.get(packet.id);
        if ("function" == typeof ack) {
            debug("calling ack %s with %j", packet.id, packet.data);
            ack.apply(this, packet.data);
            this.acks.delete(packet.id);
        }
        else {
            debug("bad ack %s", packet.id);
        }
    }
    /**
     * Called upon client disconnect packet.
     *
     * @private
     */
    ondisconnect() {
        debug("got disconnect packet");
        this._onclose("client namespace disconnect");
    }
    /**
     * Handles a client error.
     *
     * @private
     */
    _onerror(err) {
        if (this.listeners("error").length) {
            this.emitReserved("error", err);
        }
        else {
            console.error("Missing error handler on `socket`.");
            console.error(err.stack);
        }
    }
    /**
     * Called upon closing. Called by `Client`.
     *
     * @param {String} reason
     * @throw {Error} optional error object
     *
     * @private
     */
    _onclose(reason) {
        if (!this.connected)
            return this;
        debug("closing socket - reason %s", reason);
        this.emitReserved("disconnecting", reason);
        this.leaveAll();
        this.nsp._remove(this);
        this.client._remove(this);
        this.connected = false;
        this.emitReserved("disconnect", reason);
        return;
    }
    /**
     * Produces an `error` packet.
     *
     * @param {Object} err - error object
     *
     * @private
     */
    _error(err) {
        this.packet({ type: socket_io_parser_1.PacketType.CONNECT_ERROR, data: err });
    }
    /**
     * Disconnects this client.
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return {Socket} self
     *
     * @public
     */
    disconnect(close = false) {
        if (!this.connected)
            return this;
        if (close) {
            this.client._disconnect();
        }
        else {
            this.packet({ type: socket_io_parser_1.PacketType.DISCONNECT });
            this._onclose("server namespace disconnect");
        }
        return this;
    }
    /**
     * Sets the compress flag.
     *
     * @param {Boolean} compress - if `true`, compresses the sending data
     * @return {Socket} self
     * @public
     */
    compress(compress) {
        this.flags.compress = compress;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return {Socket} self
     * @public
     */
    get volatile() {
        this.flags.volatile = true;
        return this;
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to every sockets but the
     * sender.
     *
     * @return {Socket} self
     * @public
     */
    get broadcast() {
        return this.newBroadcastOperator();
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return {Socket} self
     * @public
     */
    get local() {
        return this.newBroadcastOperator().local;
    }
    /**
     * Sets a modifier for a subsequent event emission that the callback will be called with an error when the
     * given number of milliseconds have elapsed without an acknowledgement from the client:
     *
     * ```
     * socket.timeout(5000).emit("my-event", (err) => {
     *   if (err) {
     *     // the client did not acknowledge the event in the given delay
     *   }
     * });
     * ```
     *
     * @returns self
     * @public
     */
    timeout(timeout) {
        this.flags.timeout = timeout;
        return this;
    }
    /**
     * Dispatch incoming event to socket listeners.
     *
     * @param {Array} event - event that will get emitted
     * @private
     */
    dispatch(event) {
        debug("dispatching an event %j", event);
        this.run(event, (err) => {
            process.nextTick(() => {
                if (err) {
                    return this._onerror(err);
                }
                if (this.connected) {
                    super.emitUntyped.apply(this, event);
                }
                else {
                    debug("ignore packet received after disconnection");
                }
            });
        });
    }
    /**
     * Sets up socket middleware.
     *
     * @param {Function} fn - middleware function (event, next)
     * @return {Socket} self
     * @public
     */
    use(fn) {
        this.fns.push(fn);
        return this;
    }
    /**
     * Executes the middleware for an incoming event.
     *
     * @param {Array} event - event that will get emitted
     * @param {Function} fn - last fn call in the middleware
     * @private
     */
    run(event, fn) {
        const fns = this.fns.slice(0);
        if (!fns.length)
            return fn(null);
        function run(i) {
            fns[i](event, function (err) {
                // upon error, short-circuit
                if (err)
                    return fn(err);
                // if no middleware left, summon callback
                if (!fns[i + 1])
                    return fn(null);
                // go on to next
                run(i + 1);
            });
        }
        run(0);
    }
    /**
     * Whether the socket is currently disconnected
     */
    get disconnected() {
        return !this.connected;
    }
    /**
     * A reference to the request that originated the underlying Engine.IO Socket.
     *
     * @public
     */
    get request() {
        return this.client.request;
    }
    /**
     * A reference to the underlying Client transport connection (Engine.IO Socket object).
     *
     * @public
     */
    get conn() {
        return this.client.conn;
    }
    /**
     * @public
     */
    get rooms() {
        return this.adapter.socketRooms(this.id) || new Set();
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback.
     *
     * @param listener
     * @public
     */
    onAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.push(listener);
        return this;
    }
    /**
     * Adds a listener that will be fired when any event is emitted. The event name is passed as the first argument to the
     * callback. The listener is added to the beginning of the listeners array.
     *
     * @param listener
     * @public
     */
    prependAny(listener) {
        this._anyListeners = this._anyListeners || [];
        this._anyListeners.unshift(listener);
        return this;
    }
    /**
     * Removes the listener that will be fired when any event is emitted.
     *
     * @param listener
     * @public
     */
    offAny(listener) {
        if (!this._anyListeners) {
            return this;
        }
        if (listener) {
            const listeners = this._anyListeners;
            for (let i = 0; i < listeners.length; i++) {
                if (listener === listeners[i]) {
                    listeners.splice(i, 1);
                    return this;
                }
            }
        }
        else {
            this._anyListeners = [];
        }
        return this;
    }
    /**
     * Returns an array of listeners that are listening for any event that is specified. This array can be manipulated,
     * e.g. to remove listeners.
     *
     * @public
     */
    listenersAny() {
        return this._anyListeners || [];
    }
    newBroadcastOperator() {
        const flags = Object.assign({}, this.flags);
        this.flags = {};
        return new broadcast_operator_1.BroadcastOperator(this.adapter, new Set(), new Set([this.id]), flags);
    }
}
exports.Socket = Socket;


/***/ }),
/* 135 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.StrictEventEmitter = void 0;
const events_1 = __webpack_require__(109);
/**
 * Strictly typed version of an `EventEmitter`. A `TypedEventEmitter` takes type
 * parameters for mappings of event names to event data types, and strictly
 * types method calls to the `EventEmitter` according to these event maps.
 *
 * @typeParam ListenEvents - `EventsMap` of user-defined events that can be
 * listened to with `on` or `once`
 * @typeParam EmitEvents - `EventsMap` of user-defined events that can be
 * emitted with `emit`
 * @typeParam ReservedEvents - `EventsMap` of reserved events, that can be
 * emitted by socket.io with `emitReserved`, and can be listened to with
 * `listen`.
 */
class StrictEventEmitter extends events_1.EventEmitter {
    /**
     * Adds the `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    on(ev, listener) {
        return super.on(ev, listener);
    }
    /**
     * Adds a one-time `listener` function as an event listener for `ev`.
     *
     * @param ev Name of the event
     * @param listener Callback function
     */
    once(ev, listener) {
        return super.once(ev, listener);
    }
    /**
     * Emits an event.
     *
     * @param ev Name of the event
     * @param args Values to send to listeners of this event
     */
    emit(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits a reserved event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can emit its own reserved events.
     *
     * @param ev Reserved event name
     * @param args Arguments to emit along with the event
     */
    emitReserved(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Emits an event.
     *
     * This method is `protected`, so that only a class extending
     * `StrictEventEmitter` can get around the strict typing. This is useful for
     * calling `emit.apply`, which can be called as `emitUntyped.apply`.
     *
     * @param ev Event name
     * @param args Arguments to emit along with the event
     */
    emitUntyped(ev, ...args) {
        return super.emit(ev, ...args);
    }
    /**
     * Returns the listeners listening to an event.
     *
     * @param event Event name
     * @returns Array of listeners subscribed to `event`
     */
    listeners(event) {
        return super.listeners(event);
    }
}
exports.StrictEventEmitter = StrictEventEmitter;


/***/ }),
/* 136 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RemoteSocket = exports.BroadcastOperator = void 0;
const socket_1 = __webpack_require__(134);
const socket_io_parser_1 = __webpack_require__(129);
class BroadcastOperator {
    constructor(adapter, rooms = new Set(), exceptRooms = new Set(), flags = {}) {
        this.adapter = adapter;
        this.rooms = rooms;
        this.exceptRooms = exceptRooms;
        this.flags = flags;
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    to(room) {
        const rooms = new Set(this.rooms);
        if (Array.isArray(room)) {
            room.forEach((r) => rooms.add(r));
        }
        else {
            rooms.add(room);
        }
        return new BroadcastOperator(this.adapter, rooms, this.exceptRooms, this.flags);
    }
    /**
     * Targets a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    in(room) {
        return this.to(room);
    }
    /**
     * Excludes a room when emitting.
     *
     * @param room
     * @return a new BroadcastOperator instance
     * @public
     */
    except(room) {
        const exceptRooms = new Set(this.exceptRooms);
        if (Array.isArray(room)) {
            room.forEach((r) => exceptRooms.add(r));
        }
        else {
            exceptRooms.add(room);
        }
        return new BroadcastOperator(this.adapter, this.rooms, exceptRooms, this.flags);
    }
    /**
     * Sets the compress flag.
     *
     * @param compress - if `true`, compresses the sending data
     * @return a new BroadcastOperator instance
     * @public
     */
    compress(compress) {
        const flags = Object.assign({}, this.flags, { compress });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data may be lost if the client is not ready to
     * receive messages (because of network slowness or other issues, or because they’re connected through long polling
     * and is in the middle of a request-response cycle).
     *
     * @return a new BroadcastOperator instance
     * @public
     */
    get volatile() {
        const flags = Object.assign({}, this.flags, { volatile: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Sets a modifier for a subsequent event emission that the event data will only be broadcast to the current node.
     *
     * @return a new BroadcastOperator instance
     * @public
     */
    get local() {
        const flags = Object.assign({}, this.flags, { local: true });
        return new BroadcastOperator(this.adapter, this.rooms, this.exceptRooms, flags);
    }
    /**
     * Emits to all clients.
     *
     * @return Always true
     * @public
     */
    emit(ev, ...args) {
        if (socket_1.RESERVED_EVENTS.has(ev)) {
            throw new Error(`"${ev}" is a reserved event name`);
        }
        // set up packet object
        const data = [ev, ...args];
        const packet = {
            type: socket_io_parser_1.PacketType.EVENT,
            data: data,
        };
        if ("function" == typeof data[data.length - 1]) {
            throw new Error("Callbacks are not supported when broadcasting");
        }
        this.adapter.broadcast(packet, {
            rooms: this.rooms,
            except: this.exceptRooms,
            flags: this.flags,
        });
        return true;
    }
    /**
     * Gets a list of clients.
     *
     * @public
     */
    allSockets() {
        if (!this.adapter) {
            throw new Error("No adapter for this namespace, are you trying to get the list of clients of a dynamic namespace?");
        }
        return this.adapter.sockets(this.rooms);
    }
    /**
     * Returns the matching socket instances
     *
     * @public
     */
    fetchSockets() {
        return this.adapter
            .fetchSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        })
            .then((sockets) => {
            return sockets.map((socket) => {
                if (socket instanceof socket_1.Socket) {
                    // FIXME the TypeScript compiler complains about missing private properties
                    return socket;
                }
                else {
                    return new RemoteSocket(this.adapter, socket);
                }
            });
        });
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param room
     * @public
     */
    socketsJoin(room) {
        this.adapter.addSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param room
     * @public
     */
    socketsLeave(room) {
        this.adapter.delSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, Array.isArray(room) ? room : [room]);
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param close - whether to close the underlying connection
     * @public
     */
    disconnectSockets(close = false) {
        this.adapter.disconnectSockets({
            rooms: this.rooms,
            except: this.exceptRooms,
        }, close);
    }
}
exports.BroadcastOperator = BroadcastOperator;
/**
 * Expose of subset of the attributes and methods of the Socket class
 */
class RemoteSocket {
    constructor(adapter, details) {
        this.id = details.id;
        this.handshake = details.handshake;
        this.rooms = new Set(details.rooms);
        this.data = details.data;
        this.operator = new BroadcastOperator(adapter, new Set([this.id]));
    }
    emit(ev, ...args) {
        return this.operator.emit(ev, ...args);
    }
    /**
     * Joins a room.
     *
     * @param {String|Array} room - room or array of rooms
     * @public
     */
    join(room) {
        return this.operator.socketsJoin(room);
    }
    /**
     * Leaves a room.
     *
     * @param {String} room
     * @public
     */
    leave(room) {
        return this.operator.socketsLeave(room);
    }
    /**
     * Disconnects this client.
     *
     * @param {Boolean} close - if `true`, closes the underlying connection
     * @return {Socket} self
     *
     * @public
     */
    disconnect(close = false) {
        this.operator.disconnectSockets(close);
        return this;
    }
}
exports.RemoteSocket = RemoteSocket;


/***/ }),
/* 137 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ParentNamespace = void 0;
const namespace_1 = __webpack_require__(133);
class ParentNamespace extends namespace_1.Namespace {
    constructor(server) {
        super(server, "/_" + ParentNamespace.count++);
        this.children = new Set();
    }
    /**
     * @private
     */
    _initAdapter() {
        const broadcast = (packet, opts) => {
            this.children.forEach((nsp) => {
                nsp.adapter.broadcast(packet, opts);
            });
        };
        // @ts-ignore FIXME is there a way to declare an inner class in TypeScript?
        this.adapter = { broadcast };
    }
    emit(ev, ...args) {
        this.children.forEach((nsp) => {
            nsp.emit(ev, ...args);
        });
        return true;
    }
    createChild(name) {
        const namespace = new namespace_1.Namespace(this.server, name);
        namespace._fns = this._fns.slice(0);
        this.listeners("connect").forEach((listener) => namespace.on("connect", listener));
        this.listeners("connection").forEach((listener) => namespace.on("connection", listener));
        this.children.add(namespace);
        this.server._nsps.set(name, namespace);
        return namespace;
    }
    fetchSockets() {
        // note: we could make the fetchSockets() method work for dynamic namespaces created with a regex (by sending the
        // regex to the other Socket.IO servers, and returning the sockets of each matching namespace for example), but
        // the behavior for namespaces created with a function is less clear
        // note²: we cannot loop over each children namespace, because with multiple Socket.IO servers, a given namespace
        // may exist on one node but not exist on another (since it is created upon client connection)
        throw new Error("fetchSockets() is not supported on parent namespaces");
    }
}
exports.ParentNamespace = ParentNamespace;
ParentNamespace.count = 0;


/***/ }),
/* 138 */
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Adapter = void 0;
const events_1 = __webpack_require__(109);
class Adapter extends events_1.EventEmitter {
    /**
     * In-memory adapter constructor.
     *
     * @param {Namespace} nsp
     */
    constructor(nsp) {
        super();
        this.nsp = nsp;
        this.rooms = new Map();
        this.sids = new Map();
        this.encoder = nsp.server.encoder;
    }
    /**
     * To be overridden
     */
    init() { }
    /**
     * To be overridden
     */
    close() { }
    /**
     * Adds a socket to a list of room.
     *
     * @param {SocketId}  id      the socket id
     * @param {Set<Room>} rooms   a set of rooms
     * @public
     */
    addAll(id, rooms) {
        if (!this.sids.has(id)) {
            this.sids.set(id, new Set());
        }
        for (const room of rooms) {
            this.sids.get(id).add(room);
            if (!this.rooms.has(room)) {
                this.rooms.set(room, new Set());
                this.emit("create-room", room);
            }
            if (!this.rooms.get(room).has(id)) {
                this.rooms.get(room).add(id);
                this.emit("join-room", room, id);
            }
        }
    }
    /**
     * Removes a socket from a room.
     *
     * @param {SocketId} id     the socket id
     * @param {Room}     room   the room name
     */
    del(id, room) {
        if (this.sids.has(id)) {
            this.sids.get(id).delete(room);
        }
        this._del(room, id);
    }
    _del(room, id) {
        const _room = this.rooms.get(room);
        if (_room != null) {
            const deleted = _room.delete(id);
            if (deleted) {
                this.emit("leave-room", room, id);
            }
            if (_room.size === 0 && this.rooms.delete(room)) {
                this.emit("delete-room", room);
            }
        }
    }
    /**
     * Removes a socket from all rooms it's joined.
     *
     * @param {SocketId} id   the socket id
     */
    delAll(id) {
        if (!this.sids.has(id)) {
            return;
        }
        for (const room of this.sids.get(id)) {
            this._del(room, id);
        }
        this.sids.delete(id);
    }
    /**
     * Broadcasts a packet.
     *
     * Options:
     *  - `flags` {Object} flags for this packet
     *  - `except` {Array} sids that should be excluded
     *  - `rooms` {Array} list of rooms to broadcast to
     *
     * @param {Object} packet   the packet object
     * @param {Object} opts     the options
     * @public
     */
    broadcast(packet, opts) {
        const flags = opts.flags || {};
        const packetOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        this.apply(opts, socket => {
            socket.client.writeToEngine(encodedPackets, packetOpts);
        });
    }
    /**
     * Gets a list of sockets by sid.
     *
     * @param {Set<Room>} rooms   the explicit set of rooms to check.
     */
    sockets(rooms) {
        const sids = new Set();
        this.apply({ rooms }, socket => {
            sids.add(socket.id);
        });
        return Promise.resolve(sids);
    }
    /**
     * Gets the list of rooms a given socket has joined.
     *
     * @param {SocketId} id   the socket id
     */
    socketRooms(id) {
        return this.sids.get(id);
    }
    /**
     * Returns the matching socket instances
     *
     * @param opts - the filters to apply
     */
    fetchSockets(opts) {
        const sockets = [];
        this.apply(opts, socket => {
            sockets.push(socket);
        });
        return Promise.resolve(sockets);
    }
    /**
     * Makes the matching socket instances join the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to join
     */
    addSockets(opts, rooms) {
        this.apply(opts, socket => {
            socket.join(rooms);
        });
    }
    /**
     * Makes the matching socket instances leave the specified rooms
     *
     * @param opts - the filters to apply
     * @param rooms - the rooms to leave
     */
    delSockets(opts, rooms) {
        this.apply(opts, socket => {
            rooms.forEach(room => socket.leave(room));
        });
    }
    /**
     * Makes the matching socket instances disconnect
     *
     * @param opts - the filters to apply
     * @param close - whether to close the underlying connection
     */
    disconnectSockets(opts, close) {
        this.apply(opts, socket => {
            socket.disconnect(close);
        });
    }
    apply(opts, callback) {
        const rooms = opts.rooms;
        const except = this.computeExceptSids(opts.except);
        if (rooms.size) {
            const ids = new Set();
            for (const room of rooms) {
                if (!this.rooms.has(room))
                    continue;
                for (const id of this.rooms.get(room)) {
                    if (ids.has(id) || except.has(id))
                        continue;
                    const socket = this.nsp.sockets.get(id);
                    if (socket) {
                        callback(socket);
                        ids.add(id);
                    }
                }
            }
        }
        else {
            for (const [id] of this.sids) {
                if (except.has(id))
                    continue;
                const socket = this.nsp.sockets.get(id);
                if (socket)
                    callback(socket);
            }
        }
    }
    computeExceptSids(exceptRooms) {
        const exceptSids = new Set();
        if (exceptRooms && exceptRooms.size > 0) {
            for (const room of exceptRooms) {
                if (this.rooms.has(room)) {
                    this.rooms.get(room).forEach(sid => exceptSids.add(sid));
                }
            }
        }
        return exceptSids;
    }
    /**
     * Send a packet to the other Socket.IO servers in the cluster
     * @param packet - an array of arguments, which may include an acknowledgement callback at the end
     */
    serverSideEmit(packet) {
        throw new Error("this adapter does not support the serverSideEmit() functionality");
    }
}
exports.Adapter = Adapter;


/***/ }),
/* 139 */
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.serveFile = exports.restoreAdapter = exports.patchAdapter = void 0;
const socket_io_adapter_1 = __webpack_require__(138);
const fs_1 = __webpack_require__(44);
const debug_1 = __importDefault(__webpack_require__(116));
const debug = (0, debug_1.default)("socket.io:adapter-uws");
const SEPARATOR = "\x1f"; // see https://en.wikipedia.org/wiki/Delimiter#ASCII_delimited_text
const { addAll, del, broadcast } = socket_io_adapter_1.Adapter.prototype;
function patchAdapter(app /* : TemplatedApp */) {
    socket_io_adapter_1.Adapter.prototype.addAll = function (id, rooms) {
        const isNew = !this.sids.has(id);
        addAll.call(this, id, rooms);
        const socket = this.nsp.sockets.get(id);
        if (!socket) {
            return;
        }
        if (socket.conn.transport.name === "websocket") {
            subscribe(this.nsp.name, socket, isNew, rooms);
            return;
        }
        if (isNew) {
            socket.conn.on("upgrade", () => {
                const rooms = this.sids.get(id);
                subscribe(this.nsp.name, socket, isNew, rooms);
            });
        }
    };
    socket_io_adapter_1.Adapter.prototype.del = function (id, room) {
        del.call(this, id, room);
        const socket = this.nsp.sockets.get(id);
        if (socket && socket.conn.transport.name === "websocket") {
            // @ts-ignore
            const sessionId = socket.conn.id;
            // @ts-ignore
            const websocket = socket.conn.transport.socket;
            const topic = `${this.nsp.name}${SEPARATOR}${room}`;
            debug("unsubscribe connection %s from topic %s", sessionId, topic);
            websocket.unsubscribe(topic);
        }
    };
    socket_io_adapter_1.Adapter.prototype.broadcast = function (packet, opts) {
        const useFastPublish = opts.rooms.size <= 1 && opts.except.size === 0;
        if (!useFastPublish) {
            broadcast.call(this, packet, opts);
            return;
        }
        const flags = opts.flags || {};
        const basePacketOpts = {
            preEncoded: true,
            volatile: flags.volatile,
            compress: flags.compress,
        };
        packet.nsp = this.nsp.name;
        const encodedPackets = this.encoder.encode(packet);
        const topic = opts.rooms.size === 0
            ? this.nsp.name
            : `${this.nsp.name}${SEPARATOR}${opts.rooms.keys().next().value}`;
        debug("fast publish to %s", topic);
        // fast publish for clients connected with WebSocket
        encodedPackets.forEach((encodedPacket) => {
            const isBinary = typeof encodedPacket !== "string";
            // "4" being the message type in the Engine.IO protocol, see https://github.com/socketio/engine.io-protocol
            app.publish(topic, isBinary ? encodedPacket : "4" + encodedPacket, isBinary);
        });
        this.apply(opts, (socket) => {
            if (socket.conn.transport.name !== "websocket") {
                // classic publish for clients connected with HTTP long-polling
                socket.client.writeToEngine(encodedPackets, basePacketOpts);
            }
        });
    };
}
exports.patchAdapter = patchAdapter;
function subscribe(namespaceName, socket, isNew, rooms) {
    // @ts-ignore
    const sessionId = socket.conn.id;
    // @ts-ignore
    const websocket = socket.conn.transport.socket;
    if (isNew) {
        debug("subscribe connection %s to topic %s", sessionId, namespaceName);
        websocket.subscribe(namespaceName);
    }
    rooms.forEach((room) => {
        const topic = `${namespaceName}${SEPARATOR}${room}`; // '#' can be used as wildcard
        debug("subscribe connection %s to topic %s", sessionId, topic);
        websocket.subscribe(topic);
    });
}
function restoreAdapter() {
    socket_io_adapter_1.Adapter.prototype.addAll = addAll;
    socket_io_adapter_1.Adapter.prototype.del = del;
    socket_io_adapter_1.Adapter.prototype.broadcast = broadcast;
}
exports.restoreAdapter = restoreAdapter;
const toArrayBuffer = (buffer) => {
    const { buffer: arrayBuffer, byteOffset, byteLength } = buffer;
    return arrayBuffer.slice(byteOffset, byteOffset + byteLength);
};
// imported from https://github.com/kolodziejczak-sz/uwebsocket-serve
function serveFile(res /* : HttpResponse */, filepath) {
    const { size } = (0, fs_1.statSync)(filepath);
    const readStream = (0, fs_1.createReadStream)(filepath);
    const destroyReadStream = () => !readStream.destroyed && readStream.destroy();
    const onError = (error) => {
        destroyReadStream();
        throw error;
    };
    const onDataChunk = (chunk) => {
        const arrayBufferChunk = toArrayBuffer(chunk);
        const lastOffset = res.getWriteOffset();
        const [ok, done] = res.tryEnd(arrayBufferChunk, size);
        if (!done && !ok) {
            readStream.pause();
            res.onWritable((offset) => {
                const [ok, done] = res.tryEnd(arrayBufferChunk.slice(offset - lastOffset), size);
                if (!done && ok) {
                    readStream.resume();
                }
                return ok;
            });
        }
    };
    res.onAborted(destroyReadStream);
    readStream
        .on("data", onDataChunk)
        .on("error", onError)
        .on("end", destroyReadStream);
}
exports.serveFile = serveFile;


/***/ }),
/* 140 */
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"name":"socket.io","version":"4.4.1","description":"node.js realtime framework server","keywords":["realtime","framework","websocket","tcp","events","socket","io"],"files":["dist/","client-dist/","wrapper.mjs","!**/*.tsbuildinfo"],"directories":{"doc":"docs/","example":"example/","lib":"lib/","test":"test/"},"type":"commonjs","main":"./dist/index.js","exports":{"import":"./wrapper.mjs","require":"./dist/index.js","types":"./dist/index.d.ts"},"types":"./dist/index.d.ts","license":"MIT","repository":{"type":"git","url":"git://github.com/socketio/socket.io"},"scripts":{"compile":"rimraf ./dist && tsc","test":"npm run format:check && npm run compile && npm run test:types && npm run test:unit","test:types":"tsd","test:unit":"nyc mocha --require ts-node/register --reporter spec --slow 200 --bail --timeout 10000 test/socket.io.ts","format:check":"prettier --check \\"lib/**/*.ts\\" \\"test/**/*.ts\\"","format:fix":"prettier --write \\"lib/**/*.ts\\" \\"test/**/*.ts\\"","prepack":"npm run compile"},"dependencies":{"accepts":"~1.3.4","base64id":"~2.0.0","debug":"~4.3.2","engine.io":"~6.1.0","socket.io-adapter":"~2.3.3","socket.io-parser":"~4.0.4"},"devDependencies":{"@types/mocha":"^9.0.0","expect.js":"0.3.1","mocha":"^3.5.3","nyc":"^15.1.0","prettier":"^2.3.2","rimraf":"^3.0.2","socket.io-client":"4.4.1","socket.io-client-v2":"npm:socket.io-client@^2.4.0","superagent":"^6.1.0","supertest":"^6.1.6","ts-node":"^10.2.1","tsd":"^0.17.0","typescript":"^4.4.2","uWebSockets.js":"github:uNetworking/uWebSockets.js#v20.0.0"},"contributors":[{"name":"Guillermo Rauch","email":"rauchg@gmail.com"},{"name":"Arnout Kazemier","email":"info@3rd-eden.com"},{"name":"Vladimir Dronnikov","email":"dronnikov@gmail.com"},{"name":"Einar Otto Stangvik","email":"einaros@gmail.com"}],"engines":{"node":">=10.0.0"},"tsd":{"directory":"test"}}');

/***/ }),
/* 141 */
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.onlineMap = void 0;
exports.onlineMap = {};


/***/ })
/******/ 	]);
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			if (cachedModule.error !== undefined) throw cachedModule.error;
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		try {
/******/ 			var execOptions = { id: moduleId, module: module, factory: __webpack_modules__[moduleId], require: __webpack_require__ };
/******/ 			__webpack_require__.i.forEach(function(handler) { handler(execOptions); });
/******/ 			module = execOptions.module;
/******/ 			execOptions.factory.call(module.exports, module, module.exports, execOptions.require);
/******/ 		} catch(e) {
/******/ 			module.error = e;
/******/ 			throw e;
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = __webpack_module_cache__;
/******/ 	
/******/ 	// expose the module execution interceptor
/******/ 	__webpack_require__.i = [];
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/get javascript update chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.hu = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + "." + __webpack_require__.h() + ".hot-update.js";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get update manifest filename */
/******/ 	(() => {
/******/ 		__webpack_require__.hmrF = () => ("main." + __webpack_require__.h() + ".hot-update.json");
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/getFullHash */
/******/ 	(() => {
/******/ 		__webpack_require__.h = () => ("f3bc515aa659af5fc28e")
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hot module replacement */
/******/ 	(() => {
/******/ 		var currentModuleData = {};
/******/ 		var installedModules = __webpack_require__.c;
/******/ 		
/******/ 		// module and require creation
/******/ 		var currentChildModule;
/******/ 		var currentParents = [];
/******/ 		
/******/ 		// status
/******/ 		var registeredStatusHandlers = [];
/******/ 		var currentStatus = "idle";
/******/ 		
/******/ 		// while downloading
/******/ 		var blockingPromises;
/******/ 		
/******/ 		// The update info
/******/ 		var currentUpdateApplyHandlers;
/******/ 		var queuedInvalidatedModules;
/******/ 		
/******/ 		// eslint-disable-next-line no-unused-vars
/******/ 		__webpack_require__.hmrD = currentModuleData;
/******/ 		
/******/ 		__webpack_require__.i.push(function (options) {
/******/ 			var module = options.module;
/******/ 			var require = createRequire(options.require, options.id);
/******/ 			module.hot = createModuleHotObject(options.id, module);
/******/ 			module.parents = currentParents;
/******/ 			module.children = [];
/******/ 			currentParents = [];
/******/ 			options.require = require;
/******/ 		});
/******/ 		
/******/ 		__webpack_require__.hmrC = {};
/******/ 		__webpack_require__.hmrI = {};
/******/ 		
/******/ 		function createRequire(require, moduleId) {
/******/ 			var me = installedModules[moduleId];
/******/ 			if (!me) return require;
/******/ 			var fn = function (request) {
/******/ 				if (me.hot.active) {
/******/ 					if (installedModules[request]) {
/******/ 						var parents = installedModules[request].parents;
/******/ 						if (parents.indexOf(moduleId) === -1) {
/******/ 							parents.push(moduleId);
/******/ 						}
/******/ 					} else {
/******/ 						currentParents = [moduleId];
/******/ 						currentChildModule = request;
/******/ 					}
/******/ 					if (me.children.indexOf(request) === -1) {
/******/ 						me.children.push(request);
/******/ 					}
/******/ 				} else {
/******/ 					console.warn(
/******/ 						"[HMR] unexpected require(" +
/******/ 							request +
/******/ 							") from disposed module " +
/******/ 							moduleId
/******/ 					);
/******/ 					currentParents = [];
/******/ 				}
/******/ 				return require(request);
/******/ 			};
/******/ 			var createPropertyDescriptor = function (name) {
/******/ 				return {
/******/ 					configurable: true,
/******/ 					enumerable: true,
/******/ 					get: function () {
/******/ 						return require[name];
/******/ 					},
/******/ 					set: function (value) {
/******/ 						require[name] = value;
/******/ 					}
/******/ 				};
/******/ 			};
/******/ 			for (var name in require) {
/******/ 				if (Object.prototype.hasOwnProperty.call(require, name) && name !== "e") {
/******/ 					Object.defineProperty(fn, name, createPropertyDescriptor(name));
/******/ 				}
/******/ 			}
/******/ 			fn.e = function (chunkId) {
/******/ 				return trackBlockingPromise(require.e(chunkId));
/******/ 			};
/******/ 			return fn;
/******/ 		}
/******/ 		
/******/ 		function createModuleHotObject(moduleId, me) {
/******/ 			var _main = currentChildModule !== moduleId;
/******/ 			var hot = {
/******/ 				// private stuff
/******/ 				_acceptedDependencies: {},
/******/ 				_acceptedErrorHandlers: {},
/******/ 				_declinedDependencies: {},
/******/ 				_selfAccepted: false,
/******/ 				_selfDeclined: false,
/******/ 				_selfInvalidated: false,
/******/ 				_disposeHandlers: [],
/******/ 				_main: _main,
/******/ 				_requireSelf: function () {
/******/ 					currentParents = me.parents.slice();
/******/ 					currentChildModule = _main ? undefined : moduleId;
/******/ 					__webpack_require__(moduleId);
/******/ 				},
/******/ 		
/******/ 				// Module API
/******/ 				active: true,
/******/ 				accept: function (dep, callback, errorHandler) {
/******/ 					if (dep === undefined) hot._selfAccepted = true;
/******/ 					else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 					else if (typeof dep === "object" && dep !== null) {
/******/ 						for (var i = 0; i < dep.length; i++) {
/******/ 							hot._acceptedDependencies[dep[i]] = callback || function () {};
/******/ 							hot._acceptedErrorHandlers[dep[i]] = errorHandler;
/******/ 						}
/******/ 					} else {
/******/ 						hot._acceptedDependencies[dep] = callback || function () {};
/******/ 						hot._acceptedErrorHandlers[dep] = errorHandler;
/******/ 					}
/******/ 				},
/******/ 				decline: function (dep) {
/******/ 					if (dep === undefined) hot._selfDeclined = true;
/******/ 					else if (typeof dep === "object" && dep !== null)
/******/ 						for (var i = 0; i < dep.length; i++)
/******/ 							hot._declinedDependencies[dep[i]] = true;
/******/ 					else hot._declinedDependencies[dep] = true;
/******/ 				},
/******/ 				dispose: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				addDisposeHandler: function (callback) {
/******/ 					hot._disposeHandlers.push(callback);
/******/ 				},
/******/ 				removeDisposeHandler: function (callback) {
/******/ 					var idx = hot._disposeHandlers.indexOf(callback);
/******/ 					if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 				},
/******/ 				invalidate: function () {
/******/ 					this._selfInvalidated = true;
/******/ 					switch (currentStatus) {
/******/ 						case "idle":
/******/ 							currentUpdateApplyHandlers = [];
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							setStatus("ready");
/******/ 							break;
/******/ 						case "ready":
/******/ 							Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 								__webpack_require__.hmrI[key](
/******/ 									moduleId,
/******/ 									currentUpdateApplyHandlers
/******/ 								);
/******/ 							});
/******/ 							break;
/******/ 						case "prepare":
/******/ 						case "check":
/******/ 						case "dispose":
/******/ 						case "apply":
/******/ 							(queuedInvalidatedModules = queuedInvalidatedModules || []).push(
/******/ 								moduleId
/******/ 							);
/******/ 							break;
/******/ 						default:
/******/ 							// ignore requests in error states
/******/ 							break;
/******/ 					}
/******/ 				},
/******/ 		
/******/ 				// Management API
/******/ 				check: hotCheck,
/******/ 				apply: hotApply,
/******/ 				status: function (l) {
/******/ 					if (!l) return currentStatus;
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				addStatusHandler: function (l) {
/******/ 					registeredStatusHandlers.push(l);
/******/ 				},
/******/ 				removeStatusHandler: function (l) {
/******/ 					var idx = registeredStatusHandlers.indexOf(l);
/******/ 					if (idx >= 0) registeredStatusHandlers.splice(idx, 1);
/******/ 				},
/******/ 		
/******/ 				//inherit from previous dispose call
/******/ 				data: currentModuleData[moduleId]
/******/ 			};
/******/ 			currentChildModule = undefined;
/******/ 			return hot;
/******/ 		}
/******/ 		
/******/ 		function setStatus(newStatus) {
/******/ 			currentStatus = newStatus;
/******/ 			var results = [];
/******/ 		
/******/ 			for (var i = 0; i < registeredStatusHandlers.length; i++)
/******/ 				results[i] = registeredStatusHandlers[i].call(null, newStatus);
/******/ 		
/******/ 			return Promise.all(results);
/******/ 		}
/******/ 		
/******/ 		function trackBlockingPromise(promise) {
/******/ 			switch (currentStatus) {
/******/ 				case "ready":
/******/ 					setStatus("prepare");
/******/ 					blockingPromises.push(promise);
/******/ 					waitForBlockingPromises(function () {
/******/ 						return setStatus("ready");
/******/ 					});
/******/ 					return promise;
/******/ 				case "prepare":
/******/ 					blockingPromises.push(promise);
/******/ 					return promise;
/******/ 				default:
/******/ 					return promise;
/******/ 			}
/******/ 		}
/******/ 		
/******/ 		function waitForBlockingPromises(fn) {
/******/ 			if (blockingPromises.length === 0) return fn();
/******/ 			var blocker = blockingPromises;
/******/ 			blockingPromises = [];
/******/ 			return Promise.all(blocker).then(function () {
/******/ 				return waitForBlockingPromises(fn);
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function hotCheck(applyOnUpdate) {
/******/ 			if (currentStatus !== "idle") {
/******/ 				throw new Error("check() is only allowed in idle status");
/******/ 			}
/******/ 			return setStatus("check")
/******/ 				.then(__webpack_require__.hmrM)
/******/ 				.then(function (update) {
/******/ 					if (!update) {
/******/ 						return setStatus(applyInvalidatedModules() ? "ready" : "idle").then(
/******/ 							function () {
/******/ 								return null;
/******/ 							}
/******/ 						);
/******/ 					}
/******/ 		
/******/ 					return setStatus("prepare").then(function () {
/******/ 						var updatedModules = [];
/******/ 						blockingPromises = [];
/******/ 						currentUpdateApplyHandlers = [];
/******/ 		
/******/ 						return Promise.all(
/******/ 							Object.keys(__webpack_require__.hmrC).reduce(function (
/******/ 								promises,
/******/ 								key
/******/ 							) {
/******/ 								__webpack_require__.hmrC[key](
/******/ 									update.c,
/******/ 									update.r,
/******/ 									update.m,
/******/ 									promises,
/******/ 									currentUpdateApplyHandlers,
/******/ 									updatedModules
/******/ 								);
/******/ 								return promises;
/******/ 							},
/******/ 							[])
/******/ 						).then(function () {
/******/ 							return waitForBlockingPromises(function () {
/******/ 								if (applyOnUpdate) {
/******/ 									return internalApply(applyOnUpdate);
/******/ 								} else {
/******/ 									return setStatus("ready").then(function () {
/******/ 										return updatedModules;
/******/ 									});
/******/ 								}
/******/ 							});
/******/ 						});
/******/ 					});
/******/ 				});
/******/ 		}
/******/ 		
/******/ 		function hotApply(options) {
/******/ 			if (currentStatus !== "ready") {
/******/ 				return Promise.resolve().then(function () {
/******/ 					throw new Error("apply() is only allowed in ready status");
/******/ 				});
/******/ 			}
/******/ 			return internalApply(options);
/******/ 		}
/******/ 		
/******/ 		function internalApply(options) {
/******/ 			options = options || {};
/******/ 		
/******/ 			applyInvalidatedModules();
/******/ 		
/******/ 			var results = currentUpdateApplyHandlers.map(function (handler) {
/******/ 				return handler(options);
/******/ 			});
/******/ 			currentUpdateApplyHandlers = undefined;
/******/ 		
/******/ 			var errors = results
/******/ 				.map(function (r) {
/******/ 					return r.error;
/******/ 				})
/******/ 				.filter(Boolean);
/******/ 		
/******/ 			if (errors.length > 0) {
/******/ 				return setStatus("abort").then(function () {
/******/ 					throw errors[0];
/******/ 				});
/******/ 			}
/******/ 		
/******/ 			// Now in "dispose" phase
/******/ 			var disposePromise = setStatus("dispose");
/******/ 		
/******/ 			results.forEach(function (result) {
/******/ 				if (result.dispose) result.dispose();
/******/ 			});
/******/ 		
/******/ 			// Now in "apply" phase
/******/ 			var applyPromise = setStatus("apply");
/******/ 		
/******/ 			var error;
/******/ 			var reportError = function (err) {
/******/ 				if (!error) error = err;
/******/ 			};
/******/ 		
/******/ 			var outdatedModules = [];
/******/ 			results.forEach(function (result) {
/******/ 				if (result.apply) {
/******/ 					var modules = result.apply(reportError);
/******/ 					if (modules) {
/******/ 						for (var i = 0; i < modules.length; i++) {
/******/ 							outdatedModules.push(modules[i]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			});
/******/ 		
/******/ 			return Promise.all([disposePromise, applyPromise]).then(function () {
/******/ 				// handle errors in accept handlers and self accepted module load
/******/ 				if (error) {
/******/ 					return setStatus("fail").then(function () {
/******/ 						throw error;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				if (queuedInvalidatedModules) {
/******/ 					return internalApply(options).then(function (list) {
/******/ 						outdatedModules.forEach(function (moduleId) {
/******/ 							if (list.indexOf(moduleId) < 0) list.push(moduleId);
/******/ 						});
/******/ 						return list;
/******/ 					});
/******/ 				}
/******/ 		
/******/ 				return setStatus("idle").then(function () {
/******/ 					return outdatedModules;
/******/ 				});
/******/ 			});
/******/ 		}
/******/ 		
/******/ 		function applyInvalidatedModules() {
/******/ 			if (queuedInvalidatedModules) {
/******/ 				if (!currentUpdateApplyHandlers) currentUpdateApplyHandlers = [];
/******/ 				Object.keys(__webpack_require__.hmrI).forEach(function (key) {
/******/ 					queuedInvalidatedModules.forEach(function (moduleId) {
/******/ 						__webpack_require__.hmrI[key](
/******/ 							moduleId,
/******/ 							currentUpdateApplyHandlers
/******/ 						);
/******/ 					});
/******/ 				});
/******/ 				queuedInvalidatedModules = undefined;
/******/ 				return true;
/******/ 			}
/******/ 		}
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/require chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded chunks
/******/ 		// "1" means "loaded", otherwise not loaded yet
/******/ 		var installedChunks = __webpack_require__.hmrS_require = __webpack_require__.hmrS_require || {
/******/ 			0: 1
/******/ 		};
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no chunk install function needed
/******/ 		
/******/ 		// no chunk loading
/******/ 		
/******/ 		// no external install chunk
/******/ 		
/******/ 		function loadUpdateChunk(chunkId, updatedModulesList) {
/******/ 			var update = require("./" + __webpack_require__.hu(chunkId));
/******/ 			var updatedModules = update.modules;
/******/ 			var runtime = update.runtime;
/******/ 			for(var moduleId in updatedModules) {
/******/ 				if(__webpack_require__.o(updatedModules, moduleId)) {
/******/ 					currentUpdate[moduleId] = updatedModules[moduleId];
/******/ 					if(updatedModulesList) updatedModulesList.push(moduleId);
/******/ 				}
/******/ 			}
/******/ 			if(runtime) currentUpdateRuntime.push(runtime);
/******/ 		}
/******/ 		
/******/ 		var currentUpdateChunks;
/******/ 		var currentUpdate;
/******/ 		var currentUpdateRemovedChunks;
/******/ 		var currentUpdateRuntime;
/******/ 		function applyHandler(options) {
/******/ 			if (__webpack_require__.f) delete __webpack_require__.f.requireHmr;
/******/ 			currentUpdateChunks = undefined;
/******/ 			function getAffectedModuleEffects(updateModuleId) {
/******/ 				var outdatedModules = [updateModuleId];
/******/ 				var outdatedDependencies = {};
/******/ 		
/******/ 				var queue = outdatedModules.map(function (id) {
/******/ 					return {
/******/ 						chain: [id],
/******/ 						id: id
/******/ 					};
/******/ 				});
/******/ 				while (queue.length > 0) {
/******/ 					var queueItem = queue.pop();
/******/ 					var moduleId = queueItem.id;
/******/ 					var chain = queueItem.chain;
/******/ 					var module = __webpack_require__.c[moduleId];
/******/ 					if (
/******/ 						!module ||
/******/ 						(module.hot._selfAccepted && !module.hot._selfInvalidated)
/******/ 					)
/******/ 						continue;
/******/ 					if (module.hot._selfDeclined) {
/******/ 						return {
/******/ 							type: "self-declined",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					if (module.hot._main) {
/******/ 						return {
/******/ 							type: "unaccepted",
/******/ 							chain: chain,
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					for (var i = 0; i < module.parents.length; i++) {
/******/ 						var parentId = module.parents[i];
/******/ 						var parent = __webpack_require__.c[parentId];
/******/ 						if (!parent) continue;
/******/ 						if (parent.hot._declinedDependencies[moduleId]) {
/******/ 							return {
/******/ 								type: "declined",
/******/ 								chain: chain.concat([parentId]),
/******/ 								moduleId: moduleId,
/******/ 								parentId: parentId
/******/ 							};
/******/ 						}
/******/ 						if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 						if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 							if (!outdatedDependencies[parentId])
/******/ 								outdatedDependencies[parentId] = [];
/******/ 							addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 							continue;
/******/ 						}
/******/ 						delete outdatedDependencies[parentId];
/******/ 						outdatedModules.push(parentId);
/******/ 						queue.push({
/******/ 							chain: chain.concat([parentId]),
/******/ 							id: parentId
/******/ 						});
/******/ 					}
/******/ 				}
/******/ 		
/******/ 				return {
/******/ 					type: "accepted",
/******/ 					moduleId: updateModuleId,
/******/ 					outdatedModules: outdatedModules,
/******/ 					outdatedDependencies: outdatedDependencies
/******/ 				};
/******/ 			}
/******/ 		
/******/ 			function addAllToSet(a, b) {
/******/ 				for (var i = 0; i < b.length; i++) {
/******/ 					var item = b[i];
/******/ 					if (a.indexOf(item) === -1) a.push(item);
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			// at begin all updates modules are outdated
/******/ 			// the "outdated" status can propagate to parents if they don't accept the children
/******/ 			var outdatedDependencies = {};
/******/ 			var outdatedModules = [];
/******/ 			var appliedUpdate = {};
/******/ 		
/******/ 			var warnUnexpectedRequire = function warnUnexpectedRequire(module) {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" + module.id + ") to disposed module"
/******/ 				);
/******/ 			};
/******/ 		
/******/ 			for (var moduleId in currentUpdate) {
/******/ 				if (__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 					var newModuleFactory = currentUpdate[moduleId];
/******/ 					/** @type {TODO} */
/******/ 					var result;
/******/ 					if (newModuleFactory) {
/******/ 						result = getAffectedModuleEffects(moduleId);
/******/ 					} else {
/******/ 						result = {
/******/ 							type: "disposed",
/******/ 							moduleId: moduleId
/******/ 						};
/******/ 					}
/******/ 					/** @type {Error|false} */
/******/ 					var abortError = false;
/******/ 					var doApply = false;
/******/ 					var doDispose = false;
/******/ 					var chainInfo = "";
/******/ 					if (result.chain) {
/******/ 						chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 					}
/******/ 					switch (result.type) {
/******/ 						case "self-declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of self decline: " +
/******/ 										result.moduleId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "declined":
/******/ 							if (options.onDeclined) options.onDeclined(result);
/******/ 							if (!options.ignoreDeclined)
/******/ 								abortError = new Error(
/******/ 									"Aborted because of declined dependency: " +
/******/ 										result.moduleId +
/******/ 										" in " +
/******/ 										result.parentId +
/******/ 										chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "unaccepted":
/******/ 							if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 							if (!options.ignoreUnaccepted)
/******/ 								abortError = new Error(
/******/ 									"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 								);
/******/ 							break;
/******/ 						case "accepted":
/******/ 							if (options.onAccepted) options.onAccepted(result);
/******/ 							doApply = true;
/******/ 							break;
/******/ 						case "disposed":
/******/ 							if (options.onDisposed) options.onDisposed(result);
/******/ 							doDispose = true;
/******/ 							break;
/******/ 						default:
/******/ 							throw new Error("Unexception type " + result.type);
/******/ 					}
/******/ 					if (abortError) {
/******/ 						return {
/******/ 							error: abortError
/******/ 						};
/******/ 					}
/******/ 					if (doApply) {
/******/ 						appliedUpdate[moduleId] = newModuleFactory;
/******/ 						addAllToSet(outdatedModules, result.outdatedModules);
/******/ 						for (moduleId in result.outdatedDependencies) {
/******/ 							if (__webpack_require__.o(result.outdatedDependencies, moduleId)) {
/******/ 								if (!outdatedDependencies[moduleId])
/******/ 									outdatedDependencies[moduleId] = [];
/******/ 								addAllToSet(
/******/ 									outdatedDependencies[moduleId],
/******/ 									result.outdatedDependencies[moduleId]
/******/ 								);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 					if (doDispose) {
/******/ 						addAllToSet(outdatedModules, [result.moduleId]);
/******/ 						appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 			currentUpdate = undefined;
/******/ 		
/******/ 			// Store self accepted outdated modules to require them later by the module system
/******/ 			var outdatedSelfAcceptedModules = [];
/******/ 			for (var j = 0; j < outdatedModules.length; j++) {
/******/ 				var outdatedModuleId = outdatedModules[j];
/******/ 				var module = __webpack_require__.c[outdatedModuleId];
/******/ 				if (
/******/ 					module &&
/******/ 					(module.hot._selfAccepted || module.hot._main) &&
/******/ 					// removed self-accepted modules should not be required
/******/ 					appliedUpdate[outdatedModuleId] !== warnUnexpectedRequire &&
/******/ 					// when called invalidate self-accepting is not possible
/******/ 					!module.hot._selfInvalidated
/******/ 				) {
/******/ 					outdatedSelfAcceptedModules.push({
/******/ 						module: outdatedModuleId,
/******/ 						require: module.hot._requireSelf,
/******/ 						errorHandler: module.hot._selfAccepted
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 		
/******/ 			var moduleOutdatedDependencies;
/******/ 		
/******/ 			return {
/******/ 				dispose: function () {
/******/ 					currentUpdateRemovedChunks.forEach(function (chunkId) {
/******/ 						delete installedChunks[chunkId];
/******/ 					});
/******/ 					currentUpdateRemovedChunks = undefined;
/******/ 		
/******/ 					var idx;
/******/ 					var queue = outdatedModules.slice();
/******/ 					while (queue.length > 0) {
/******/ 						var moduleId = queue.pop();
/******/ 						var module = __webpack_require__.c[moduleId];
/******/ 						if (!module) continue;
/******/ 		
/******/ 						var data = {};
/******/ 		
/******/ 						// Call dispose handlers
/******/ 						var disposeHandlers = module.hot._disposeHandlers;
/******/ 						for (j = 0; j < disposeHandlers.length; j++) {
/******/ 							disposeHandlers[j].call(null, data);
/******/ 						}
/******/ 						__webpack_require__.hmrD[moduleId] = data;
/******/ 		
/******/ 						// disable module (this disables requires from this module)
/******/ 						module.hot.active = false;
/******/ 		
/******/ 						// remove module from cache
/******/ 						delete __webpack_require__.c[moduleId];
/******/ 		
/******/ 						// when disposing there is no need to call dispose handler
/******/ 						delete outdatedDependencies[moduleId];
/******/ 		
/******/ 						// remove "parents" references from all children
/******/ 						for (j = 0; j < module.children.length; j++) {
/******/ 							var child = __webpack_require__.c[module.children[j]];
/******/ 							if (!child) continue;
/******/ 							idx = child.parents.indexOf(moduleId);
/******/ 							if (idx >= 0) {
/******/ 								child.parents.splice(idx, 1);
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// remove outdated dependency from module children
/******/ 					var dependency;
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									dependency = moduleOutdatedDependencies[j];
/******/ 									idx = module.children.indexOf(dependency);
/******/ 									if (idx >= 0) module.children.splice(idx, 1);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				},
/******/ 				apply: function (reportError) {
/******/ 					// insert new code
/******/ 					for (var updateModuleId in appliedUpdate) {
/******/ 						if (__webpack_require__.o(appliedUpdate, updateModuleId)) {
/******/ 							__webpack_require__.m[updateModuleId] = appliedUpdate[updateModuleId];
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// run new runtime modules
/******/ 					for (var i = 0; i < currentUpdateRuntime.length; i++) {
/******/ 						currentUpdateRuntime[i](__webpack_require__);
/******/ 					}
/******/ 		
/******/ 					// call accept handlers
/******/ 					for (var outdatedModuleId in outdatedDependencies) {
/******/ 						if (__webpack_require__.o(outdatedDependencies, outdatedModuleId)) {
/******/ 							var module = __webpack_require__.c[outdatedModuleId];
/******/ 							if (module) {
/******/ 								moduleOutdatedDependencies =
/******/ 									outdatedDependencies[outdatedModuleId];
/******/ 								var callbacks = [];
/******/ 								var errorHandlers = [];
/******/ 								var dependenciesForCallbacks = [];
/******/ 								for (var j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 									var dependency = moduleOutdatedDependencies[j];
/******/ 									var acceptCallback =
/******/ 										module.hot._acceptedDependencies[dependency];
/******/ 									var errorHandler =
/******/ 										module.hot._acceptedErrorHandlers[dependency];
/******/ 									if (acceptCallback) {
/******/ 										if (callbacks.indexOf(acceptCallback) !== -1) continue;
/******/ 										callbacks.push(acceptCallback);
/******/ 										errorHandlers.push(errorHandler);
/******/ 										dependenciesForCallbacks.push(dependency);
/******/ 									}
/******/ 								}
/******/ 								for (var k = 0; k < callbacks.length; k++) {
/******/ 									try {
/******/ 										callbacks[k].call(null, moduleOutdatedDependencies);
/******/ 									} catch (err) {
/******/ 										if (typeof errorHandlers[k] === "function") {
/******/ 											try {
/******/ 												errorHandlers[k](err, {
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k]
/******/ 												});
/******/ 											} catch (err2) {
/******/ 												if (options.onErrored) {
/******/ 													options.onErrored({
/******/ 														type: "accept-error-handler-errored",
/******/ 														moduleId: outdatedModuleId,
/******/ 														dependencyId: dependenciesForCallbacks[k],
/******/ 														error: err2,
/******/ 														originalError: err
/******/ 													});
/******/ 												}
/******/ 												if (!options.ignoreErrored) {
/******/ 													reportError(err2);
/******/ 													reportError(err);
/******/ 												}
/******/ 											}
/******/ 										} else {
/******/ 											if (options.onErrored) {
/******/ 												options.onErrored({
/******/ 													type: "accept-errored",
/******/ 													moduleId: outdatedModuleId,
/******/ 													dependencyId: dependenciesForCallbacks[k],
/******/ 													error: err
/******/ 												});
/******/ 											}
/******/ 											if (!options.ignoreErrored) {
/******/ 												reportError(err);
/******/ 											}
/******/ 										}
/******/ 									}
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					// Load self accepted modules
/******/ 					for (var o = 0; o < outdatedSelfAcceptedModules.length; o++) {
/******/ 						var item = outdatedSelfAcceptedModules[o];
/******/ 						var moduleId = item.module;
/******/ 						try {
/******/ 							item.require(moduleId);
/******/ 						} catch (err) {
/******/ 							if (typeof item.errorHandler === "function") {
/******/ 								try {
/******/ 									item.errorHandler(err, {
/******/ 										moduleId: moduleId,
/******/ 										module: __webpack_require__.c[moduleId]
/******/ 									});
/******/ 								} catch (err2) {
/******/ 									if (options.onErrored) {
/******/ 										options.onErrored({
/******/ 											type: "self-accept-error-handler-errored",
/******/ 											moduleId: moduleId,
/******/ 											error: err2,
/******/ 											originalError: err
/******/ 										});
/******/ 									}
/******/ 									if (!options.ignoreErrored) {
/******/ 										reportError(err2);
/******/ 										reportError(err);
/******/ 									}
/******/ 								}
/******/ 							} else {
/******/ 								if (options.onErrored) {
/******/ 									options.onErrored({
/******/ 										type: "self-accept-errored",
/******/ 										moduleId: moduleId,
/******/ 										error: err
/******/ 									});
/******/ 								}
/******/ 								if (!options.ignoreErrored) {
/******/ 									reportError(err);
/******/ 								}
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 		
/******/ 					return outdatedModules;
/******/ 				}
/******/ 			};
/******/ 		}
/******/ 		__webpack_require__.hmrI.require = function (moduleId, applyHandlers) {
/******/ 			if (!currentUpdate) {
/******/ 				currentUpdate = {};
/******/ 				currentUpdateRuntime = [];
/******/ 				currentUpdateRemovedChunks = [];
/******/ 				applyHandlers.push(applyHandler);
/******/ 			}
/******/ 			if (!__webpack_require__.o(currentUpdate, moduleId)) {
/******/ 				currentUpdate[moduleId] = __webpack_require__.m[moduleId];
/******/ 			}
/******/ 		};
/******/ 		__webpack_require__.hmrC.require = function (
/******/ 			chunkIds,
/******/ 			removedChunks,
/******/ 			removedModules,
/******/ 			promises,
/******/ 			applyHandlers,
/******/ 			updatedModulesList
/******/ 		) {
/******/ 			applyHandlers.push(applyHandler);
/******/ 			currentUpdateChunks = {};
/******/ 			currentUpdateRemovedChunks = removedChunks;
/******/ 			currentUpdate = removedModules.reduce(function (obj, key) {
/******/ 				obj[key] = false;
/******/ 				return obj;
/******/ 			}, {});
/******/ 			currentUpdateRuntime = [];
/******/ 			chunkIds.forEach(function (chunkId) {
/******/ 				if (
/******/ 					__webpack_require__.o(installedChunks, chunkId) &&
/******/ 					installedChunks[chunkId] !== undefined
/******/ 				) {
/******/ 					promises.push(loadUpdateChunk(chunkId, updatedModulesList));
/******/ 					currentUpdateChunks[chunkId] = true;
/******/ 				}
/******/ 			});
/******/ 			if (__webpack_require__.f) {
/******/ 				__webpack_require__.f.requireHmr = function (chunkId, promises) {
/******/ 					if (
/******/ 						currentUpdateChunks &&
/******/ 						!__webpack_require__.o(currentUpdateChunks, chunkId) &&
/******/ 						__webpack_require__.o(installedChunks, chunkId) &&
/******/ 						installedChunks[chunkId] !== undefined
/******/ 					) {
/******/ 						promises.push(loadUpdateChunk(chunkId));
/******/ 						currentUpdateChunks[chunkId] = true;
/******/ 					}
/******/ 				};
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.hmrM = function() {
/******/ 			return Promise.resolve().then(function() {
/******/ 				return require("./" + __webpack_require__.hmrF());
/******/ 			})['catch'](function(err) { if(err.code !== 'MODULE_NOT_FOUND') throw err; });
/******/ 		}
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// module cache are used so entry inlining is disabled
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	__webpack_require__(0);
/******/ 	var __webpack_exports__ = __webpack_require__(3);
/******/ 	
/******/ })()
;