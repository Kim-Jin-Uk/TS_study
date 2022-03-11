"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 23:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacesController = void 0;
const common_1 = __webpack_require__(6);
let WorkspacesController = class WorkspacesController {
};
WorkspacesController = __decorate([
    (0, common_1.Controller)('workspaces')
], WorkspacesController);
exports.WorkspacesController = WorkspacesController;


/***/ }),

/***/ 12:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.WorkspacesModule = void 0;
const common_1 = __webpack_require__(6);
const workspaces_service_1 = __webpack_require__(22);
const workspaces_controller_1 = __webpack_require__(23);
let WorkspacesModule = class WorkspacesModule {
};
WorkspacesModule = __decorate([
    (0, common_1.Module)({
        providers: [workspaces_service_1.WorkspacesService],
        controllers: [workspaces_controller_1.WorkspacesController]
    })
], WorkspacesModule);
exports.WorkspacesModule = WorkspacesModule;


/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("5957f8bb79ee79caca5f")
/******/ })();
/******/ 
/******/ }
;