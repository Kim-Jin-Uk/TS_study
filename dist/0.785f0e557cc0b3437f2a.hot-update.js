"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 27:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UndefinedToNullInterceptor = void 0;
const common_1 = __webpack_require__(6);
const rxjs_1 = __webpack_require__(28);
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

/***/ 13:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
const join_request_dto_1 = __webpack_require__(14);
const users_service_1 = __webpack_require__(12);
const swagger_1 = __webpack_require__(15);
const user_dto_1 = __webpack_require__(16);
const user_decorator_1 = __webpack_require__(26);
const undefinedToNull_interceptor_1 = __webpack_require__(27);
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    getUsers(user) {
        return user;
    }
    postUsers(data) {
        this.usersService.postUsers(data);
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
    (0, swagger_1.ApiOperation)({ summary: '회원가입' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [typeof (_a = typeof join_request_dto_1.JoinRequestDto !== "undefined" && join_request_dto_1.JoinRequestDto) === "function" ? _a : Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "postUsers", null);
__decorate([
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: '성공',
        type: user_dto_1.UserDto,
    }),
    (0, swagger_1.ApiOperation)({ summary: '로그인' }),
    (0, common_1.Post)('login'),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], UsersController.prototype, "logIn", null);
__decorate([
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

/***/ 28:
/***/ ((module) => {

module.exports = require("rxjs");

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("81419a48535ce122180a")
/******/ })();
/******/ 
/******/ }
;