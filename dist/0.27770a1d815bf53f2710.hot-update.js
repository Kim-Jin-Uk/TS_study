"use strict";
exports.id = 0;
exports.ids = null;
exports.modules = {

/***/ 59:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SwaggerModule = void 0;
const load_package_util_1 = __webpack_require__(60);
const swagger_scanner_1 = __webpack_require__(61);
const assign_two_levels_deep_1 = __webpack_require__(96);
const get_global_prefix_1 = __webpack_require__(94);
const validate_path_util_1 = __webpack_require__(97);
class SwaggerModule {
    static createDocument(app, config, options = {}) {
        const swaggerScanner = new swagger_scanner_1.SwaggerScanner();
        const document = swaggerScanner.scanApplication(app, options);
        document.components = assign_two_levels_deep_1.assignTwoLevelsDeep({}, config.components, document.components);
        return Object.assign(Object.assign({ openapi: '3.0.0', paths: {} }, config), document);
    }
    static setup(path, app, document, options) {
        const httpAdapter = app.getHttpAdapter();
        const globalPrefix = get_global_prefix_1.getGlobalPrefix(app);
        const finalPath = validate_path_util_1.validatePath((options === null || options === void 0 ? void 0 : options.useGlobalPrefix) && globalPrefix && !globalPrefix.match(/^(\/?)$/)
            ? `${globalPrefix}${validate_path_util_1.validatePath(path)}`
            : path);
        if (httpAdapter && httpAdapter.getType() === 'fastify') {
            return this.setupFastify(finalPath, httpAdapter, document, options);
        }
        return this.setupExpress(finalPath, app, document, options);
    }
    static setupExpress(path, app, document, options) {
        const httpAdapter = app.getHttpAdapter();
        const swaggerUi = load_package_util_1.loadPackage('swagger-ui-express', 'SwaggerModule', () => __webpack_require__(98));
        const swaggerHtml = swaggerUi.generateHTML(document, options);
        app.use(path, swaggerUi.serveFiles(document, options));
        httpAdapter.get(path, (req, res) => res.send(swaggerHtml));
        httpAdapter.get(path + '-json', (req, res) => res.json(document));
    }
    static setupFastify(path, httpServer, document, options) {
        const hasParserGetterDefined = Object.getPrototypeOf(httpServer).hasOwnProperty('isParserRegistered');
        if (hasParserGetterDefined && !httpServer.isParserRegistered) {
            httpServer.registerParserMiddleware();
        }
        httpServer.register((httpServer) => __awaiter(this, void 0, void 0, function* () {
            httpServer.register(load_package_util_1.loadPackage('fastify-swagger', 'SwaggerModule', () => __webpack_require__(119)), {
                swagger: document,
                exposeRoute: true,
                routePrefix: path,
                mode: 'static',
                specification: {
                    document
                },
                uiConfig: options === null || options === void 0 ? void 0 : options.uiConfig,
                initOAuth: options === null || options === void 0 ? void 0 : options.initOAuth,
                staticCSP: options === null || options === void 0 ? void 0 : options.staticCSP,
                transformStaticCSP: options === null || options === void 0 ? void 0 : options.transformStaticCSP,
                uiHooks: options === null || options === void 0 ? void 0 : options.uiHooks
            });
        }));
    }
}
exports.SwaggerModule = SwaggerModule;


/***/ }),

/***/ 132:
/***/ ((module) => {



function negotiate (header, supportedEncodings) {
  if (!header) {
    return undefined
  }
  const supportedEncodingMap = createMap(supportedEncodings)
  const acceptedEncodings = parse(header)
    .sort((a, b) => comparator(a, b, supportedEncodingMap))
    .filter(isNonZeroQuality)
  return determinePreffered(acceptedEncodings, supportedEncodingMap)
}

function determinePreffered (acceptedEncodings, supportedEncodings) {
  for (const encoding of acceptedEncodings) {
    const selected = supportedEncodings[encoding.name]
    if (selected) {
      return selected.encoding
    }
  }
  return null
}

function createMap (supported) {
  const supportedEncodings = {}
  let priority = 0
  if (supported.length > 0) {
    supportedEncodings['*'] = { encoding: supported[0], priority }
    priority++
  }
  for (const encoding of supported) {
    supportedEncodings[encoding] = { encoding, priority }
    priority++
  }
  return supportedEncodings
}

function parse (header) {
  const split = header.split(',')
  return split.map(parseEncoding)
}

function isNonZeroQuality (encoding) {
  return encoding.quality !== 0
}

function parseEncoding (encoding) {
  const [name, second] = encoding.trim().split(';')
  const quality = getQuality(second)
  return {
    name,
    quality
  }
}

function getQuality (second) {
  if (!second) {
    return 1
  }
  const [, quality] = second.trim().split('=')
  return parseFloat(quality)
}

function comparator (a, b, supportedEncodingMap) {
  if (a.quality === b.quality) {
    if (supportedEncodingMap[a.name] &&
      supportedEncodingMap[b.name] &&
      supportedEncodingMap[a.name].priority < supportedEncodingMap[b.name].priority) {
      return -1
    } else {
      return 1
    }
  }
  return b.quality - a.quality
}

module.exports = {
  negotiate
}


/***/ }),

/***/ 120:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const extractPluginName = __webpack_require__(121)

let count = 0

function plugin (fn, options = {}) {
  let autoName = false

  if (typeof fn.default !== 'undefined') {
    // Support for 'export default' behaviour in transpiled ECMAScript module
    fn = fn.default
  }

  if (typeof fn !== 'function') {
    throw new TypeError(
      `fastify-plugin expects a function, instead got a '${typeof fn}'`
    )
  }

  fn[Symbol.for('skip-override')] = true

  const pluginName = (options && options.name) || checkName(fn)

  if (typeof options === 'string') {
    options = {
      fastify: options
    }
  }

  if (
    typeof options !== 'object' ||
    Array.isArray(options) ||
    options === null
  ) {
    throw new TypeError('The options object should be an object')
  }

  if (options.fastify !== undefined && typeof options.fastify !== 'string') {
    throw new TypeError(`fastify-plugin expects a version string, instead got '${typeof options.fastify}'`)
  }

  if (!options.name) {
    autoName = true
    options.name = pluginName + '-auto-' + count++
  }

  fn[Symbol.for('fastify.display-name')] = options.name
  fn[Symbol.for('plugin-meta')] = options

  // Faux modules support
  if (!fn.default) {
    fn.default = fn
  }

  // TypeScript support for named imports
  // See https://github.com/fastify/fastify/issues/2404 for more details
  // The type definitions would have to be update to match this.
  const camelCase = toCamelCase(options.name)
  if (!autoName && !fn[camelCase]) {
    fn[camelCase] = fn
  }

  return fn
}

function checkName (fn) {
  if (fn.name.length > 0) return fn.name

  try {
    throw new Error('anonymous function')
  } catch (e) {
    return extractPluginName(e.stack)
  }
}

function toCamelCase (name) {
  const newName = name.replace(/-(.)/g, function (match, g1) {
    return g1.toUpperCase()
  })
  return newName
}

plugin.default = plugin
module.exports = plugin


/***/ }),

/***/ 121:
/***/ ((module) => {



const fpStackTracePattern = /at\s{1}(?:.*\.)?plugin\s{1}.*\n\s*(.*)/
const fileNamePattern = /(\w*(\.\w*)*)\..*/

module.exports = function extractPluginName (stack) {
  const m = stack.match(fpStackTracePattern)

  // get last section of path and match for filename
  return m ? m[1].split(/[/\\]/).slice(-1)[0].match(fileNamePattern)[1] : 'anonymous'
}


/***/ }),

/***/ 126:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const path = __webpack_require__(104)
const statSync = (__webpack_require__(123).statSync)
const { PassThrough } = __webpack_require__(127)
const glob = __webpack_require__(128)
const send = __webpack_require__(129)
const contentDisposition = __webpack_require__(130)
const fp = __webpack_require__(120)
const util = __webpack_require__(131)
const globPromise = util.promisify(glob)
const encodingNegotiator = __webpack_require__(132)

const dirList = __webpack_require__(133)

async function fastifyStatic (fastify, opts) {
  checkRootPathForErrors(fastify, opts.root)

  const setHeaders = opts.setHeaders

  if (setHeaders !== undefined && typeof setHeaders !== 'function') {
    throw new TypeError('The `setHeaders` option must be a function')
  }

  const invalidDirListOpts = dirList.validateOptions(opts.list)
  if (invalidDirListOpts) {
    throw invalidDirListOpts
  }

  const sendOptions = {
    root: opts.root,
    acceptRanges: opts.acceptRanges,
    cacheControl: opts.cacheControl,
    dotfiles: opts.dotfiles,
    etag: opts.etag,
    extensions: opts.extensions,
    immutable: opts.immutable,
    index: opts.index,
    lastModified: opts.lastModified,
    maxAge: opts.maxAge
  }

  const allowedPath = opts.allowedPath

  if (opts.prefix === undefined) opts.prefix = '/'

  let prefix = opts.prefix

  if (!opts.prefixAvoidTrailingSlash) {
    prefix =
      opts.prefix[opts.prefix.length - 1] === '/'
        ? opts.prefix
        : opts.prefix + '/'
  }

  function pumpSendToReply (
    request,
    reply,
    pathname,
    rootPath,
    rootPathOffset = 0,
    pumpOptions = {},
    checkedEncodings
  ) {
    const options = Object.assign({}, sendOptions, pumpOptions)

    if (rootPath) {
      if (Array.isArray(rootPath)) {
        options.root = rootPath[rootPathOffset]
      } else {
        options.root = rootPath
      }
    }

    if (allowedPath && !allowedPath(pathname, options.root)) {
      return reply.callNotFound()
    }

    let encoding
    let pathnameForSend = pathname

    if (opts.preCompressed) {
      /**
       * We conditionally create this structure to track our attempts
       * at sending pre-compressed assets
       */
      if (!checkedEncodings) {
        checkedEncodings = new Set()
      }

      encoding = getEncodingHeader(request.headers, checkedEncodings)

      if (encoding) {
        if (pathname.endsWith('/')) {
          pathname = findIndexFile(pathname, options.root, options.index)
          if (!pathname) {
            return reply.callNotFound()
          }
        }
        pathnameForSend = pathname + '.' + getEncodingExtension(encoding)
      }
    }

    const stream = send(request.raw, pathnameForSend, options)
    let resolvedFilename
    stream.on('file', function (file) {
      resolvedFilename = file
    })

    const wrap = new PassThrough({
      flush (cb) {
        this.finished = true
        if (reply.raw.statusCode === 304) {
          reply.send('')
        }
        cb()
      }
    })

    wrap.getHeader = reply.getHeader.bind(reply)
    wrap.setHeader = reply.header.bind(reply)
    wrap.finished = false

    Object.defineProperty(wrap, 'filename', {
      get () {
        return resolvedFilename
      }
    })
    Object.defineProperty(wrap, 'statusCode', {
      get () {
        return reply.raw.statusCode
      },
      set (code) {
        reply.code(code)
      }
    })

    if (request.method === 'HEAD') {
      wrap.on('finish', reply.send.bind(reply))
    } else {
      wrap.on('pipe', function () {
        if (encoding) {
          reply.header('content-type', getContentType(pathname))
          reply.header('content-encoding', encoding)
        }
        reply.send(wrap)
      })
    }

    if (setHeaders !== undefined) {
      stream.on('headers', setHeaders)
    }

    stream.on('directory', function (_, path) {
      if (opts.list) {
        dirList.send({
          reply,
          dir: path,
          options: opts.list,
          route: pathname,
          prefix
        }).catch((err) => reply.send(err))
        return
      }

      if (opts.redirect === true) {
        try {
          reply.redirect(301, getRedirectUrl(request.raw.url))
        } catch (error) {
          // the try-catch here is actually unreachable, but we keep it for safety and prevent DoS attack
          /* istanbul ignore next */
          reply.send(error)
        }
      } else {
        reply.callNotFound()
      }
    })

    stream.on('error', function (err) {
      if (err.code === 'ENOENT') {
        // if file exists, send real file, otherwise send dir list if name match
        if (opts.list && dirList.handle(pathname, opts.list)) {
          dirList.send({
            reply,
            dir: dirList.path(opts.root, pathname),
            options: opts.list,
            route: pathname,
            prefix
          }).catch((err) => reply.send(err))
          return
        }

        // root paths left to try?
        if (Array.isArray(rootPath) && rootPathOffset < (rootPath.length - 1)) {
          return pumpSendToReply(request, reply, pathname, rootPath, rootPathOffset + 1)
        }

        if (opts.preCompressed && !checkedEncodings.has(encoding)) {
          checkedEncodings.add(encoding)
          return pumpSendToReply(
            request,
            reply,
            pathname,
            rootPath,
            undefined,
            undefined,
            checkedEncodings
          )
        }

        return reply.callNotFound()
      }

      // The `send` library terminates the request with a 404 if the requested
      // path contains a dotfile and `send` is initialized with `{dotfiles:
      // 'ignore'}`. `send` aborts the request before getting far enough to
      // check if the file exists (hence, a 404 `NotFoundError` instead of
      // `ENOENT`).
      // https://github.com/pillarjs/send/blob/de073ed3237ade9ff71c61673a34474b30e5d45b/index.js#L582
      if (err.status === 404) {
        return reply.callNotFound()
      }

      reply.send(err)
    })

    // we cannot use pump, because send error
    // handling is not compatible
    stream.pipe(wrap)
  }

  const errorHandler = (error, request, reply) => {
    if (error && error.code === 'ERR_STREAM_PREMATURE_CLOSE') {
      reply.request.raw.destroy()
      return
    }

    fastify.errorHandler(error, request, reply)
  }

  // Set the schema hide property if defined in opts or true by default
  const routeOpts = {
    schema: {
      hide: typeof opts.schemaHide !== 'undefined' ? opts.schemaHide : true
    },
    errorHandler: fastify.errorHandler ? errorHandler : undefined
  }

  if (opts.decorateReply !== false) {
    fastify.decorateReply('sendFile', function (filePath, rootPath, options) {
      const opts = typeof rootPath === 'object' ? rootPath : options
      const root = typeof rootPath === 'string' ? rootPath : opts && opts.root
      pumpSendToReply(
        this.request,
        this,
        filePath,
        root || sendOptions.root,
        0,
        opts
      )
      return this
    })

    fastify.decorateReply(
      'download',
      function (filePath, fileName, options = {}) {
        const { root, ...opts } =
          typeof fileName === 'object' ? fileName : options
        fileName = typeof fileName === 'string' ? fileName : filePath

        // Set content disposition header
        this.header('content-disposition', contentDisposition(fileName))

        pumpSendToReply(this.request, this, filePath, root, 0, opts)

        return this
      }
    )
  }

  if (opts.serve !== false) {
    if (opts.wildcard && typeof opts.wildcard !== 'boolean') {
      throw new Error('"wildcard" option must be a boolean')
    }
    if (opts.wildcard === undefined || opts.wildcard === true) {
      fastify.head(prefix + '*', routeOpts, function (req, reply) {
        pumpSendToReply(req, reply, '/' + req.params['*'], sendOptions.root)
      })
      fastify.get(prefix + '*', routeOpts, function (req, reply) {
        pumpSendToReply(req, reply, '/' + req.params['*'], sendOptions.root)
      })
      if (opts.redirect === true && prefix !== opts.prefix) {
        fastify.get(opts.prefix, routeOpts, function (req, reply) {
          reply.redirect(301, getRedirectUrl(req.raw.url))
        })
      }
    } else {
      const globPattern = '**/*'
      const indexDirs = new Map()
      const routes = new Set()

      for (const rootPath of Array.isArray(sendOptions.root) ? sendOptions.root : [sendOptions.root]) {
        const files = await globPromise(path.join(rootPath, globPattern), { nodir: true })
        const indexes = typeof opts.index === 'undefined' ? ['index.html'] : [].concat(opts.index)

        for (let file of files) {
          file = file
            .replace(rootPath.replace(/\\/g, '/'), '')
            .replace(/^\//, '')
          const route = encodeURI(prefix + file).replace(/\/\//g, '/')
          if (routes.has(route)) {
            continue
          }
          routes.add(route)
          fastify.head(route, routeOpts, function (req, reply) {
            pumpSendToReply(req, reply, '/' + file, rootPath)
          })

          fastify.get(route, routeOpts, function (req, reply) {
            pumpSendToReply(req, reply, '/' + file, rootPath)
          })

          const key = path.posix.basename(route)
          if (indexes.includes(key) && !indexDirs.has(key)) {
            indexDirs.set(path.posix.dirname(route), rootPath)
          }
        }
      }

      for (const [dirname, rootPath] of indexDirs.entries()) {
        const pathname = dirname + (dirname.endsWith('/') ? '' : '/')
        const file = '/' + pathname.replace(prefix, '')

        fastify.head(pathname, routeOpts, function (req, reply) {
          pumpSendToReply(req, reply, file, rootPath)
        })

        fastify.get(pathname, routeOpts, function (req, reply) {
          pumpSendToReply(req, reply, file, rootPath)
        })

        if (opts.redirect === true) {
          fastify.head(pathname.replace(/\/$/, ''), routeOpts, function (req, reply) {
            pumpSendToReply(req, reply, file.replace(/\/$/, ''), rootPath)
          })
          fastify.get(pathname.replace(/\/$/, ''), routeOpts, function (req, reply) {
            pumpSendToReply(req, reply, file.replace(/\/$/, ''), rootPath)
          })
        }
      }
    }
  }
}

function checkRootPathForErrors (fastify, rootPath) {
  if (rootPath === undefined) {
    throw new Error('"root" option is required')
  }

  if (Array.isArray(rootPath)) {
    if (!rootPath.length) {
      throw new Error('"root" option array requires one or more paths')
    }

    if ([...new Set(rootPath)].length !== rootPath.length) {
      throw new Error(
        '"root" option array contains one or more duplicate paths'
      )
    }

    // check each path and fail at first invalid
    rootPath.map((path) => checkPath(fastify, path))
    return
  }

  if (typeof rootPath === 'string') {
    return checkPath(fastify, rootPath)
  }

  throw new Error('"root" option must be a string or array of strings')
}

function checkPath (fastify, rootPath) {
  if (typeof rootPath !== 'string') {
    throw new Error('"root" option must be a string')
  }
  if (path.isAbsolute(rootPath) === false) {
    throw new Error('"root" option must be an absolute path')
  }

  let pathStat

  try {
    pathStat = statSync(rootPath)
  } catch (e) {
    if (e.code === 'ENOENT') {
      fastify.log.warn(`"root" path "${rootPath}" must exist`)
      return
    }

    throw e
  }

  if (pathStat.isDirectory() === false) {
    throw new Error('"root" option must point to a directory')
  }
}

const supportedEncodings = ['br', 'gzip', 'deflate']

function getContentType (path) {
  const type = send.mime.lookup(path)
  const charset = send.mime.charsets.lookup(type)
  if (!charset) {
    return type
  }
  return `${type}; charset=${charset}`
}

function findIndexFile (pathname, root, indexFiles = ['index.html']) {
  return indexFiles.find(filename => {
    const p = path.join(root, pathname, filename)
    try {
      const stats = statSync(p)
      return !stats.isDirectory()
    } catch (e) {
      return false
    }
  })
}

// Adapted from https://github.com/fastify/fastify-compress/blob/665e132fa63d3bf05ad37df3c20346660b71a857/index.js#L451
function getEncodingHeader (headers, checked) {
  if (!('accept-encoding' in headers)) return

  const header = headers['accept-encoding'].toLowerCase().replace(/\*/g, 'gzip')
  return encodingNegotiator.negotiate(
    header,
    supportedEncodings.filter((enc) => !checked.has(enc))
  )
}

function getEncodingExtension (encoding) {
  switch (encoding) {
    case 'br':
      return 'br'

    case 'gzip':
      return 'gz'
  }
}

function getRedirectUrl (url) {
  let i = 0
  // we detech how many slash before a valid path
  for (i; i < url.length; i++) {
    if (url[i] !== '/' && url[i] !== '\\') break
  }
  // turns all leading / or \ into a single /
  url = '/' + url.substr(i)
  try {
    const parsed = new URL(url, 'http://localhost.com/')
    return parsed.pathname + (parsed.pathname[parsed.pathname.length - 1] !== '/' ? '/' : '') + (parsed.search || '')
  } catch (error) {
    // the try-catch here is actually unreachable, but we keep it for safety and prevent DoS attack
    /* istanbul ignore next */
    const err = new Error(`Invalid redirect URL: ${url}`)
    /* istanbul ignore next */
    err.statusCode = 400
    /* istanbul ignore next */
    throw err
  }
}

module.exports = fp(fastifyStatic, {
  fastify: '3.x',
  name: 'fastify-static'
})


/***/ }),

/***/ 133:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const path = __webpack_require__(104)
const fs = (__webpack_require__(123).promises)
const pLimit = __webpack_require__(134)

const dirList = {
  /**
   * get files and dirs from dir, or error
   * @param {string} dir full path fs dir
   * @param {function(error, entries)} callback
   * note: can't use glob because don't get error on non existing dir
   */
  list: async function (dir, options) {
    const entries = { dirs: [], files: [] }
    const files = await fs.readdir(dir)
    if (files.length < 1) {
      return entries
    }

    const limit = pLimit(4)
    await Promise.all(files.map(filename => limit(async () => {
      let stats
      try {
        stats = await fs.stat(path.join(dir, filename))
      } catch (error) {
        return
      }
      const entry = { name: filename, stats }
      if (stats.isDirectory()) {
        if (options.extendedFolderInfo) {
          entry.extendedInfo = await getExtendedInfo(path.join(dir, filename))
        }
        entries.dirs.push(entry)
      } else {
        entries.files.push(entry)
      }
    })))

    async function getExtendedInfo (folderPath) {
      const depth = folderPath.split(path.sep).length
      let totalSize = 0
      let fileCount = 0
      let totalFileCount = 0
      let folderCount = 0
      let totalFolderCount = 0
      let lastModified = 0

      async function walk (dir) {
        const files = await fs.readdir(dir)
        const limit = pLimit(4)
        await Promise.all(files.map(filename => limit(async () => {
          const filePath = path.join(dir, filename)
          let stats
          try {
            stats = await fs.stat(filePath)
          } catch (error) {
            return
          }

          if (stats.isDirectory()) {
            totalFolderCount++
            if (filePath.split(path.sep).length === depth + 1) {
              folderCount++
            }
            await walk(filePath)
          } else {
            totalSize += stats.size
            totalFileCount++
            if (filePath.split(path.sep).length === depth + 1) {
              fileCount++
            }
            lastModified = Math.max(lastModified, stats.mtimeMs)
          }
        })))
      }

      await walk(folderPath)
      return {
        totalSize,
        fileCount,
        totalFileCount,
        folderCount,
        totalFolderCount,
        lastModified
      }
    }

    entries.dirs.sort((a, b) => a.name.localeCompare(b.name))
    entries.files.sort((a, b) => a.name.localeCompare(b.name))
    return entries
  },

  /**
   * send dir list content, or 404 on error
   * @param {Fastify.Reply} reply
   * @param {string} dir full path fs dir
   * @param {ListOptions} options
   * @param {string} route request route
   */
  send: async function ({ reply, dir, options, route, prefix }) {
    let entries
    try {
      entries = await dirList.list(dir, options)
    } catch (error) {
      return reply.callNotFound()
    }
    const format = reply.request.query.format || options.format
    if (format !== 'html') {
      if (options.jsonFormat !== 'extended') {
        const nameEntries = { dirs: [], files: [] }
        entries.dirs.forEach(entry => nameEntries.dirs.push(entry.name))
        entries.files.forEach(entry => nameEntries.files.push(entry.name))

        reply.send(nameEntries)
      } else {
        reply.send(entries)
      }
      return
    }

    const html = options.render(
      entries.dirs.map(entry => dirList.htmlInfo(entry, route, prefix, options)),
      entries.files.map(entry => dirList.htmlInfo(entry, route, prefix, options)))
    reply.type('text/html').send(html)
  },

  /**
   * provide the html information about entry and route, to get name and full route
   * @param entry file or dir name and stats
   * @param {string} route request route
   * @return {ListFile}
   */
  htmlInfo: function (entry, route, prefix, options) {
    if (options.names && options.names.includes(path.basename(route))) {
      route = path.normalize(path.join(route, '..'))
    }
    return {
      href: path.join(prefix, route, entry.name).replace(/\\/g, '/'),
      name: entry.name,
      stats: entry.stats,
      extendedInfo: entry.extendedInfo
    }
  },

  /**
   * say if the route can be handled by dir list or not
   * @param {string} route request route
   * @param {ListOptions} options
   * @return {boolean}
   */
  handle: function (route, options) {
    if (!options.names) {
      return false
    }
    return options.names.includes(path.basename(route)) ||
      // match trailing slash
      (options.names.includes('/') && route[route.length - 1] === '/')
  },

  /**
   * get path from route and fs root paths, considering trailing slash
   * @param {string} root fs root path
   * @param {string} route request route
   */
  path: function (root, route) {
    const _route = route[route.length - 1] === '/'
      ? route + 'none'
      : route
    return path.dirname(path.join(root, _route))
  },

  /**
   * validate options
   * @return {Error}
   */
  validateOptions: function (options) {
    if (!options) {
      return
    }
    if (options.format && options.format !== 'json' && options.format !== 'html') {
      return new TypeError('The `list.format` option must be json or html')
    }
    if (options.names && !Array.isArray(options.names)) {
      return new TypeError('The `list.names` option must be an array')
    }
    if (options.format === 'html' && typeof options.render !== 'function') {
      return new TypeError('The `list.render` option must be a function and is required with html format')
    }
  }

}

module.exports = dirList


/***/ }),

/***/ 119:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const fp = __webpack_require__(120)

function fastifySwagger (fastify, opts, next) {
  // by default the mode is dynamic, as plugin initially was developed
  opts.mode = opts.mode || 'dynamic'

  switch (opts.mode) {
    case 'static': {
      const setup = __webpack_require__(122)
      setup(fastify, opts, next)
      break
    }
    case 'dynamic': {
      const setup = __webpack_require__(136)
      setup(fastify, opts, next)
      break
    }
    default: {
      return next(new Error("unsupported mode, should be one of ['static', 'dynamic']"))
    }
  }

  fastify.decorate('swaggerCSP', __webpack_require__(135))
}

module.exports = fp(fastifySwagger, {
  fastify: '>=3.x',
  name: 'fastify-swagger'
})


/***/ }),

/***/ 144:
/***/ ((module) => {



const xConsume = 'x-consume'
const xResponseDescription = 'x-response-description'

module.exports = {
  xConsume,
  xResponseDescription
}


/***/ }),

/***/ 136:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const { addHook, resolveSwaggerFunction } = __webpack_require__(137)

module.exports = function (fastify, opts, done) {
  opts = Object.assign({}, {
    exposeRoute: false,
    hiddenTag: 'X-HIDDEN',
    hideUntagged: false,
    stripBasePath: true,
    openapi: null,
    swagger: {},
    transform: null,
    refResolver: {
      buildLocalReference (json, baseUri, fragment, i) {
        if (!json.title && json.$id) {
          json.title = json.$id
        }
        return `def-${i}`
      }
    }
  }, opts)

  const { routes, Ref } = addHook(fastify, opts)

  if (opts.exposeRoute === true) {
    const prefix = opts.routePrefix || '/documentation'
    const uiConfig = opts.uiConfig || {}
    const initOAuth = opts.initOAuth || {}
    const staticCSP = opts.staticCSP
    const transformStaticCSP = opts.transformStaticCSP
    fastify.register(__webpack_require__(125), {
      prefix,
      uiConfig,
      initOAuth,
      staticCSP,
      transformStaticCSP,
      hooks: opts.uiHooks
    })
  }

  const cache = {
    object: null,
    string: null
  }

  const swagger = resolveSwaggerFunction(opts, cache, routes, Ref, done)
  fastify.decorate('swagger', swagger)

  done()
}


/***/ }),

/***/ 122:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const path = __webpack_require__(104)
const fs = __webpack_require__(123)
const yaml = __webpack_require__(124)

module.exports = function (fastify, opts, done) {
  if (!opts.specification) return done(new Error('specification is missing in the module options'))
  if (typeof opts.specification !== 'object') return done(new Error('specification is not an object'))

  let swaggerObject = {}

  if (!opts.specification.path && !opts.specification.document) {
    return done(new Error('both specification.path and specification.document are missing, should be path to the file or swagger document spec'))
  } else if (opts.specification.path) {
    if (typeof opts.specification.path !== 'string') return done(new Error('specification.path is not a string'))

    if (!fs.existsSync(path.resolve(opts.specification.path))) return done(new Error(`${opts.specification.path} does not exist`))

    const extName = path.extname(opts.specification.path).toLowerCase()
    if (['.yaml', '.json'].indexOf(extName) === -1) return done(new Error("specification.path extension name is not supported, should be one from ['.yaml', '.json']"))

    if (opts.specification.postProcessor && typeof opts.specification.postProcessor !== 'function') return done(new Error('specification.postProcessor should be a function'))

    if (opts.specification.baseDir && typeof opts.specification.baseDir !== 'string') return done(new Error('specification.baseDir should be string'))

    if (!opts.specification.baseDir) {
      opts.specification.baseDir = path.resolve(path.dirname(opts.specification.path))
    } else {
      while (opts.specification.baseDir.endsWith('/')) {
        opts.specification.baseDir = opts.specification.baseDir.slice(0, -1)
      }
    }

    // read
    const source = fs.readFileSync(
      path.resolve(opts.specification.path),
      'utf8'
    )
    switch (extName) {
      case '.yaml':
        swaggerObject = yaml.load(source)
        break
      case '.json':
        swaggerObject = JSON.parse(source)
        break
    }

    // apply postProcessor, if one was passed as an argument
    if (opts.specification.postProcessor) {
      swaggerObject = opts.specification.postProcessor(swaggerObject)
    }
  } else {
    if (typeof opts.specification.document !== 'object') return done(new Error('specification.document is not an object'))

    swaggerObject = opts.specification.document
  }

  fastify.decorate('swagger', swagger)

  if (opts.exposeRoute === true) {
    const options = {
      prefix: opts.routePrefix || '/documentation',
      uiConfig: opts.uiConfig || {},
      initOAuth: opts.initOAuth || {},
      baseDir: opts.specification.baseDir,
      staticCSP: opts.staticCSP,
      transformStaticCSP: opts.transformStaticCSP,
      hooks: opts.uiHooks
    }

    fastify.register(__webpack_require__(125), options)
  }

  const cache = {
    swaggerObject: null,
    swaggerString: null
  }

  function swagger (opts) {
    if (opts && opts.yaml) {
      if (cache.swaggerString) return cache.swaggerString
    } else {
      if (cache.swaggerObject) return cache.swaggerObject
    }

    if (opts && opts.yaml) {
      const swaggerString = yaml.dump(swaggerObject, { skipInvalid: true })
      cache.swaggerString = swaggerString
      return swaggerString
    }

    cache.swaggerObject = swaggerObject
    return swaggerObject
  }

  done()
}


/***/ }),

/***/ 125:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const path = __webpack_require__(104)
const fastifyStatic = __webpack_require__(126)

// URI prefix to separate static assets for swagger UI
const staticPrefix = '/static'

function getRedirectPathForTheRootRoute (url) {
  let redirectPath

  if (url.substr(-1) === '/') {
    redirectPath = `.${staticPrefix}/index.html`
  } else {
    const urlPathParts = url.split('/')
    redirectPath = `./${urlPathParts[urlPathParts.length - 1]}${staticPrefix}/index.html`
  }

  return redirectPath
}

function fastifySwagger (fastify, opts, done) {
  let staticCSP = false
  if (opts.staticCSP === true) {
    const csp = __webpack_require__(135)
    staticCSP = `default-src 'self'; base-uri 'self'; block-all-mixed-content; font-src 'self' https: data:; frame-ancestors 'self'; img-src 'self' data: validator.swagger.io; object-src 'none'; script-src 'self' ${csp.script.join(' ')}; script-src-attr 'none'; style-src 'self' https: ${csp.style.join(' ')}; upgrade-insecure-requests;`
  }
  if (typeof opts.staticCSP === 'string') {
    staticCSP = opts.staticCSP
  }
  if (typeof opts.staticCSP === 'object' && opts.staticCSP !== null) {
    staticCSP = ''
    Object.keys(opts.staticCSP).forEach(function (key) {
      const value = Array.isArray(opts.staticCSP[key]) ? opts.staticCSP[key].join(' ') : opts.staticCSP[key]
      staticCSP += `${key.toLowerCase()} ${value}; `
    })
  }

  if (typeof staticCSP === 'string' || typeof opts.transformStaticCSP === 'function') {
    fastify.addHook('onSend', function (request, reply, payload, done) {
      // set static csp when it is passed
      if (typeof staticCSP === 'string') {
        reply.header('content-security-policy', staticCSP.trim())
      }
      // mutate the header when it is passed
      const header = reply.getHeader('content-security-policy')
      if (header && typeof opts.transformStaticCSP === 'function') {
        reply.header('content-security-policy', opts.transformStaticCSP(header))
      }
      done()
    })
  }

  const hooks = Object.create(null)
  if (opts.hooks) {
    const additionalHooks = [
      'onRequest',
      'preHandler'
    ]
    for (const hook of additionalHooks) {
      hooks[hook] = opts.hooks[hook]
    }
  }

  fastify.route({
    url: '/',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: (req, reply) => {
      reply.redirect(getRedirectPathForTheRootRoute(req.raw.url))
    }
  })

  fastify.route({
    url: '/uiConfig',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: (req, reply) => {
      reply.send(opts.uiConfig)
    }
  })

  fastify.route({
    url: '/initOAuth',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: (req, reply) => {
      reply.send(opts.initOAuth)
    }
  })

  fastify.route({
    url: '/json',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: function (req, reply) {
      reply.send(fastify.swagger())
    }
  })

  fastify.route({
    url: '/yaml',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: function (req, reply) {
      reply
        .type('application/x-yaml')
        .send(fastify.swagger({ yaml: true }))
    }
  })

  // serve swagger-ui with the help of fastify-static
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, '..', 'static'),
    prefix: staticPrefix,
    decorateReply: false
  })

  fastify.register(fastifyStatic, {
    root: opts.baseDir || path.join(__dirname, '..'),
    serve: false
  })

  // Handler for external documentation files passed via $ref
  fastify.route({
    url: '/*',
    method: 'GET',
    schema: { hide: true },
    ...hooks,
    handler: function (req, reply) {
      const file = req.params['*']
      reply.sendFile(file)
    }
  })

  done()
}

module.exports = fastifySwagger


/***/ }),

/***/ 147:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const yaml = __webpack_require__(124)
const { shouldRouteHide } = __webpack_require__(137)
const { prepareDefaultOptions, prepareOpenapiObject, prepareOpenapiMethod, prepareOpenapiSchemas, normalizeUrl } = __webpack_require__(148)

module.exports = function (opts, cache, routes, Ref, done) {
  let ref

  const defOpts = prepareDefaultOptions(opts)

  return function (opts) {
    if (opts && opts.yaml) {
      if (cache.string) return cache.string
    } else {
      if (cache.object) return cache.object
    }

    // Base Openapi info
    const openapiObject = prepareOpenapiObject(defOpts, done)

    ref = Ref()
    openapiObject.components.schemas = prepareOpenapiSchemas({
      ...openapiObject.components.schemas,
      ...(ref.definitions().definitions)
    }, ref)

    for (const route of routes) {
      const schema = defOpts.transform
        ? defOpts.transform(route.schema)
        : route.schema

      const shouldRouteHideOpts = {
        hiddenTag: defOpts.hiddenTag,
        hideUntagged: defOpts.hideUntagged
      }

      if (shouldRouteHide(schema, shouldRouteHideOpts)) continue

      const url = normalizeUrl(route.url, defOpts.servers, defOpts.stripBasePath)

      const openapiRoute = Object.assign({}, openapiObject.paths[url])

      const openapiMethod = prepareOpenapiMethod(schema, ref, openapiObject)

      if (route.links) {
        for (const statusCode of Object.keys(route.links)) {
          if (!openapiMethod.responses[statusCode]) {
            throw new Error(`missing status code ${statusCode} in route ${route.path}`)
          }
          openapiMethod.responses[statusCode].links = route.links[statusCode]
        }
      }

      // route.method should be either a String, like 'POST', or an Array of Strings, like ['POST','PUT','PATCH']
      const methods = typeof route.method === 'string' ? [route.method] : route.method

      for (const method of methods) {
        openapiRoute[method.toLowerCase()] = openapiMethod
      }

      openapiObject.paths[url] = openapiRoute
    }

    if (opts && opts.yaml) {
      cache.string = yaml.dump(openapiObject, { skipInvalid: true })
      return cache.string
    }

    cache.object = openapiObject
    return cache.object
  }
}


/***/ }),

/***/ 148:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const { readPackageJson, formatParamUrl, resolveLocalRef } = __webpack_require__(137)
const { xResponseDescription, xConsume } = __webpack_require__(144)
const { rawRequired } = __webpack_require__(143)

function prepareDefaultOptions (opts) {
  const openapi = opts.openapi
  const info = openapi.info || null
  const servers = openapi.servers || null
  const components = openapi.components || null
  const security = openapi.security || null
  const tags = openapi.tags || null
  const externalDocs = openapi.externalDocs || null
  const stripBasePath = opts.stripBasePath
  const transform = opts.transform
  const hiddenTag = opts.hiddenTag
  const hideUntagged = opts.hideUntagged
  const extensions = []

  for (const [key, value] of Object.entries(opts.openapi)) {
    if (key.startsWith('x-')) {
      extensions.push([key, value])
    }
  }

  return {
    info,
    servers,
    components,
    security,
    tags,
    externalDocs,
    stripBasePath,
    transform,
    hiddenTag,
    extensions,
    hideUntagged
  }
}

function prepareOpenapiObject (opts) {
  const pkg = readPackageJson()
  const openapiObject = {
    openapi: '3.0.3',
    info: {
      version: pkg.version || '1.0.0',
      title: pkg.name || ''
    },
    components: { schemas: {} },
    paths: {}
  }

  if (opts.info) openapiObject.info = opts.info
  if (opts.servers) openapiObject.servers = opts.servers
  if (opts.components) openapiObject.components = Object.assign({}, opts.components, { schemas: Object.assign({}, opts.components.schemas) })
  if (opts.security) openapiObject.security = opts.security
  if (opts.tags) openapiObject.tags = opts.tags
  if (opts.externalDocs) openapiObject.externalDocs = opts.externalDocs

  for (const [key, value] of opts.extensions) {
    // "x-" extension can not be typed
    openapiObject[key] = value
  }

  return openapiObject
}

function normalizeUrl (url, servers, stripBasePath) {
  if (!stripBasePath) return formatParamUrl(url)
  servers = Array.isArray(servers) ? servers : []
  servers.forEach(function (server) {
    const basePath = new URL(server.url).pathname
    if (url.startsWith(basePath) && basePath !== '/') {
      url = url.replace(basePath, '')
    }
  })
  return formatParamUrl(url)
}

function transformDefsToComponents (jsonSchema) {
  if (typeof jsonSchema === 'object' && jsonSchema !== null) {
    // Handle patternProperties, that is not part of OpenAPI definitions
    if (jsonSchema.patternProperties) {
      jsonSchema.additionalProperties = { type: 'string' }
      delete jsonSchema.patternProperties
    } else if (jsonSchema.const) {
      // OAS 3.1 supports `const` but it is not supported by `swagger-ui`
      // https://swagger.io/docs/specification/data-models/keywords/
      jsonSchema.enum = [jsonSchema.const]
      delete jsonSchema.const
    }

    Object.keys(jsonSchema).forEach(function (key) {
      if (key === 'properties') {
        Object.keys(jsonSchema[key]).forEach(function (prop) {
          jsonSchema[key][prop] = transformDefsToComponents(jsonSchema[key][prop])
        })
      } else if (key === '$ref') {
        jsonSchema[key] = jsonSchema[key].replace('definitions', 'components/schemas')
      } else if (key === 'examples' && Array.isArray(jsonSchema[key]) && (jsonSchema[key].length > 1)) {
        jsonSchema.examples = convertExamplesArrayToObject(jsonSchema.examples)
      } else if (key === 'examples' && Array.isArray(jsonSchema[key]) && (jsonSchema[key].length === 1)) {
        jsonSchema.example = jsonSchema[key][0]
        delete jsonSchema[key]
      } else if (key === '$id' || key === '$schema') {
        delete jsonSchema[key]
      } else {
        jsonSchema[key] = transformDefsToComponents(jsonSchema[key])
      }
    })
  }
  return jsonSchema
}

function convertExamplesArrayToObject (examples) {
  return examples.reduce((examplesObject, example, index) => {
    if (typeof example === 'object') {
      examplesObject['example' + (index + 1)] = { value: example }
    } else {
      examplesObject[example] = { value: example }
    }

    return examplesObject
  }, {})
}

// For supported keys read:
// https://swagger.io/docs/specification/describing-parameters/
function plainJsonObjectToOpenapi3 (container, jsonSchema, externalSchemas, securityIgnores = []) {
  const obj = transformDefsToComponents(resolveLocalRef(jsonSchema, externalSchemas))
  let toOpenapiProp
  switch (container) {
    case 'cookie':
    case 'query':
      toOpenapiProp = function (propertyName, jsonSchemaElement) {
        const result = {
          in: container,
          name: propertyName,
          required: jsonSchemaElement.required
        }
        // complex serialization in query or cookie, eg. JSON
        // https://swagger.io/docs/specification/describing-parameters/#schema-vs-content
        if (jsonSchemaElement[xConsume]) {
          result.content = {
            [jsonSchemaElement[xConsume]]: {
              schema: {
                ...jsonSchemaElement,
                required: jsonSchemaElement[rawRequired]
              }
            }
          }

          delete result.content[jsonSchemaElement[xConsume]].schema[xConsume]
        } else {
          result.schema = jsonSchemaElement
        }
        // description should be optional
        if (jsonSchemaElement.description) result.description = jsonSchemaElement.description
        // optionally add serialization format style
        if (jsonSchema.style) result.style = jsonSchema.style
        if (jsonSchema.explode != null) result.explode = jsonSchema.explode
        return result
      }
      break
    case 'path':
      toOpenapiProp = function (propertyName, jsonSchemaElement) {
        const result = {
          in: container,
          name: propertyName,
          required: true,
          schema: jsonSchemaElement
        }
        // description should be optional
        if (jsonSchemaElement.description) result.description = jsonSchemaElement.description
        return result
      }
      break
    case 'header':
      toOpenapiProp = function (propertyName, jsonSchemaElement) {
        return {
          in: 'header',
          name: propertyName,
          required: jsonSchemaElement.required,
          description: jsonSchemaElement.description,
          schema: {
            type: jsonSchemaElement.type
          }
        }
      }
      break
  }

  return Object.keys(obj)
    .filter((propKey) => (!securityIgnores.includes(propKey)))
    .map((propKey) => {
      const jsonSchema = toOpenapiProp(propKey, obj[propKey])
      if (jsonSchema.schema) {
        // it is needed as required in schema is invalid prop - delete only if needed
        if (typeof jsonSchema.schema.required !== 'undefined') delete jsonSchema.schema.required
        // it is needed as description in schema is invalid prop - delete only if needed
        if (typeof jsonSchema.schema.description !== 'undefined') delete jsonSchema.schema.description
      }
      return jsonSchema
    })
}

function resolveBodyParams (body, schema, consumes, ref) {
  const resolved = transformDefsToComponents(ref.resolve(schema))
  if ((Array.isArray(consumes) && consumes.length === 0) || typeof consumes === 'undefined') {
    consumes = ['application/json']
  }

  consumes.forEach((consume) => {
    body.content[consume] = {
      schema: resolved
    }
  })
  if (resolved && resolved.required && resolved.required.length) {
    body.required = true
  }
}

function resolveCommonParams (container, parameters, schema, ref, sharedSchemas, securityIgnores) {
  const schemasPath = '#/components/schemas/'
  let resolved = transformDefsToComponents(ref.resolve(schema))

  // if the resolved definition is in global schema
  if (resolved.$ref && resolved.$ref.startsWith(schemasPath)) {
    const parts = resolved.$ref.split(schemasPath)
    const pathParts = parts[1].split('/')
    resolved = pathParts.reduce((resolved, pathPart) => resolved[pathPart], ref.definitions().definitions)
  }

  const arr = plainJsonObjectToOpenapi3(container, resolved, sharedSchemas, securityIgnores)
  arr.forEach(swaggerSchema => parameters.push(swaggerSchema))
}

// https://swagger.io/docs/specification/describing-responses/
function resolveResponse (fastifyResponseJson, produces, ref) {
  // if the user does not provided an out schema
  if (!fastifyResponseJson) {
    return { 200: { description: 'Default Response' } }
  }

  const responsesContainer = {}

  const statusCodes = Object.keys(fastifyResponseJson)

  statusCodes.forEach(statusCode => {
    const rawJsonSchema = fastifyResponseJson[statusCode]
    const resolved = transformDefsToComponents(ref.resolve(rawJsonSchema))

    /**
     * 2xx require to be all upper-case
     * converts statusCode to upper case only when it is not "default"
     */
    if (statusCode !== 'default') {
      statusCode = statusCode.toUpperCase()
    }

    const response = {
      description: resolved[xResponseDescription] || rawJsonSchema.description || 'Default Response'
    }

    // add headers when there are any.
    if (rawJsonSchema.headers) {
      response.headers = {}
      Object.keys(rawJsonSchema.headers).forEach(function (key) {
        const header = {
          schema: rawJsonSchema.headers[key]
        }

        if (rawJsonSchema.headers[key].description) {
          header.description = rawJsonSchema.headers[key].description
          // remove invalid field
          delete header.schema.description
        }

        response.headers[key] = header
      })
      // remove invalid field
      delete resolved.headers
    }

    // add schema when type is not 'null'
    if (rawJsonSchema.type !== 'null') {
      const content = {}

      if ((Array.isArray(produces) && produces.length === 0) || typeof produces === 'undefined') {
        produces = ['application/json']
      }

      delete resolved[xResponseDescription]
      produces.forEach((produce) => {
        content[produce] = {
          schema: resolved
        }
      })

      response.content = content
    }

    responsesContainer[statusCode] = response
  })

  return responsesContainer
}

function prepareOpenapiMethod (schema, ref, openapiObject) {
  const openapiMethod = {}
  const parameters = []

  // Parse out the security prop keys to ignore
  const securityIgnores = [
    ...(openapiObject && openapiObject.security ? openapiObject.security : []),
    ...(schema && schema.security ? schema.security : [])
  ]
    .reduce((acc, securitySchemeGroup) => {
      Object.keys(securitySchemeGroup).forEach((securitySchemeLabel) => {
        const { name, in: category } = openapiObject.components.securitySchemes[securitySchemeLabel]
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(name)
      })
      return acc
    }, {})

  // All the data the user can give us, is via the schema object
  if (schema) {
    if (schema.operationId) openapiMethod.operationId = schema.operationId
    if (schema.summary) openapiMethod.summary = schema.summary
    if (schema.tags) openapiMethod.tags = schema.tags
    if (schema.description) openapiMethod.description = schema.description
    if (schema.externalDocs) openapiMethod.externalDocs = schema.externalDocs
    if (schema.querystring) resolveCommonParams('query', parameters, schema.querystring, ref, openapiObject.definitions, securityIgnores.query)
    if (schema.body) {
      openapiMethod.requestBody = { content: {} }
      resolveBodyParams(openapiMethod.requestBody, schema.body, schema.consumes, ref)
    }
    if (schema.params) resolveCommonParams('path', parameters, schema.params, ref, openapiObject.definitions)
    if (schema.headers) resolveCommonParams('header', parameters, schema.headers, ref, openapiObject.definitions, securityIgnores.header)
    // TODO: need to documentation, we treat it same as the querystring
    // fastify do not support cookies schema in first place
    if (schema.cookies) resolveCommonParams('cookie', parameters, schema.cookies, ref, openapiObject.definitions, securityIgnores.cookie)
    if (parameters.length > 0) openapiMethod.parameters = parameters
    if (schema.deprecated) openapiMethod.deprecated = schema.deprecated
    if (schema.security) openapiMethod.security = schema.security
    if (schema.servers) openapiMethod.servers = schema.servers
    for (const key of Object.keys(schema)) {
      if (key.startsWith('x-')) {
        openapiMethod[key] = schema[key]
      }
    }
  }

  openapiMethod.responses = resolveResponse(schema ? schema.response : null, schema ? schema.produces : null, ref)

  return openapiMethod
}

function prepareOpenapiSchemas (schemas, ref) {
  return Object.entries(schemas)
    .reduce((res, [name, schema]) => {
      const _ = { ...schema }
      const resolved = transformDefsToComponents(ref.resolve(_, { externalSchemas: [schemas] }))

      // Swagger doesn't accept $id on /definitions schemas.
      // The $ids are needed by Ref() to check the URI so we need
      // to remove them at the end of the process
      // definitions are added by resolve but they are replace by components.schemas
      delete resolved.$id
      delete resolved.definitions

      res[name] = resolved
      return res
    }, {})
}

module.exports = {
  prepareDefaultOptions,
  prepareOpenapiObject,
  prepareOpenapiMethod,
  prepareOpenapiSchemas,
  normalizeUrl
}


/***/ }),

/***/ 145:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const yaml = __webpack_require__(124)
const { shouldRouteHide } = __webpack_require__(137)
const { prepareDefaultOptions, prepareSwaggerObject, prepareSwaggerMethod, normalizeUrl, prepareSwaggerDefinitions } = __webpack_require__(146)

module.exports = function (opts, cache, routes, Ref, done) {
  let ref

  const defOpts = prepareDefaultOptions(opts)

  return function (opts) {
    if (opts && opts.yaml) {
      if (cache.string) return cache.string
    } else {
      if (cache.object) return cache.object
    }

    const swaggerObject = prepareSwaggerObject(defOpts, done)

    ref = Ref()
    swaggerObject.definitions = prepareSwaggerDefinitions({
      ...swaggerObject.definitions,
      ...(ref.definitions().definitions)
    }, ref)

    swaggerObject.paths = {}
    for (const route of routes) {
      const schema = defOpts.transform
        ? defOpts.transform(route.schema)
        : route.schema

      const shouldRouteHideOpts = {
        hiddenTag: defOpts.hiddenTag,
        hideUntagged: defOpts.hideUntagged
      }

      if (shouldRouteHide(schema, shouldRouteHideOpts)) continue

      const url = normalizeUrl(route.url, defOpts.basePath, defOpts.stripBasePath)

      const swaggerRoute = Object.assign({}, swaggerObject.paths[url])

      const swaggerMethod = prepareSwaggerMethod(schema, ref, swaggerObject)

      if (route.links) {
        throw new Error('Swagger (Open API v2) does not support Links. Upgrade to OpenAPI v3 (see fastify-swagger readme)')
      }

      // route.method should be either a String, like 'POST', or an Array of Strings, like ['POST','PUT','PATCH']
      const methods = typeof route.method === 'string' ? [route.method] : route.method

      for (const method of methods) {
        swaggerRoute[method.toLowerCase()] = swaggerMethod
      }

      swaggerObject.paths[url] = swaggerRoute
    }

    if (opts && opts.yaml) {
      cache.string = yaml.dump(swaggerObject, { skipInvalid: true })
      return cache.string
    }

    cache.object = swaggerObject
    return cache.object
  }
}


/***/ }),

/***/ 146:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const { readPackageJson, formatParamUrl, resolveLocalRef } = __webpack_require__(137)
const { xResponseDescription, xConsume } = __webpack_require__(144)

function prepareDefaultOptions (opts) {
  const swagger = opts.swagger
  const info = swagger.info || null
  const host = swagger.host || null
  const schemes = swagger.schemes || null
  const consumes = swagger.consumes || null
  const produces = swagger.produces || null
  const definitions = swagger.definitions || null
  const basePath = swagger.basePath || null
  const securityDefinitions = swagger.securityDefinitions || null
  const security = swagger.security || null
  const tags = swagger.tags || null
  const externalDocs = swagger.externalDocs || null
  const stripBasePath = opts.stripBasePath
  const transform = opts.transform
  const hiddenTag = opts.hiddenTag
  const hideUntagged = opts.hideUntagged
  const extensions = []

  for (const [key, value] of Object.entries(opts.swagger)) {
    if (key.startsWith('x-')) {
      extensions.push([key, value])
    }
  }

  return {
    info,
    host,
    schemes,
    consumes,
    produces,
    definitions,
    basePath,
    securityDefinitions,
    security,
    tags,
    externalDocs,
    stripBasePath,
    transform,
    hiddenTag,
    extensions,
    hideUntagged
  }
}

function prepareSwaggerObject (opts) {
  const pkg = readPackageJson()
  const swaggerObject = {
    swagger: '2.0',
    info: {
      version: pkg.version || '1.0.0',
      title: pkg.name || ''
    },
    definitions: {},
    paths: {}
  }

  if (opts.info) swaggerObject.info = opts.info
  if (opts.host) swaggerObject.host = opts.host
  if (opts.schemes) swaggerObject.schemes = opts.schemes
  if (opts.basePath) swaggerObject.basePath = opts.basePath
  if (opts.consumes) swaggerObject.consumes = opts.consumes
  if (opts.produces) swaggerObject.produces = opts.produces
  if (opts.definitions) swaggerObject.definitions = opts.definitions
  if (opts.securityDefinitions) swaggerObject.securityDefinitions = opts.securityDefinitions
  if (opts.security) swaggerObject.security = opts.security
  if (opts.tags) swaggerObject.tags = opts.tags
  if (opts.externalDocs) swaggerObject.externalDocs = opts.externalDocs

  for (const [key, value] of opts.extensions) {
    // "x-" extension can not be typed
    swaggerObject[key] = value
  }

  return swaggerObject
}

function normalizeUrl (url, basePath, stripBasePath) {
  let path
  if (stripBasePath && url.startsWith(basePath)) {
    path = url.replace(basePath, '')
  } else {
    path = url
  }
  if (!path.startsWith('/')) {
    path = '/' + String(path)
  }
  return formatParamUrl(path)
}

// For supported keys read:
// https://swagger.io/docs/specification/2-0/describing-parameters/
function plainJsonObjectToSwagger2 (container, jsonSchema, externalSchemas, securityIgnores = []) {
  const obj = resolveLocalRef(jsonSchema, externalSchemas)
  let toSwaggerProp
  switch (container) {
    case 'query':
      toSwaggerProp = function (propertyName, jsonSchemaElement) {
        // complex serialization is not supported by swagger
        if (jsonSchemaElement[xConsume]) {
          throw new Error('Complex serialization is not supported by Swagger. ' +
            'Remove "' + xConsume + '" for "' + propertyName + '" querystring schema or ' +
            'change specification to OpenAPI')
        }
        jsonSchemaElement.in = container
        jsonSchemaElement.name = propertyName
        return jsonSchemaElement
      }
      break
    case 'formData':
      toSwaggerProp = function (propertyName, jsonSchemaElement) {
        delete jsonSchemaElement.$id
        jsonSchemaElement.in = container
        jsonSchemaElement.name = propertyName

        // https://json-schema.org/understanding-json-schema/reference/non_json_data.html#contentencoding
        if (jsonSchemaElement.contentEncoding === 'binary') {
          delete jsonSchemaElement.contentEncoding // Must be removed
          jsonSchemaElement.type = 'file'
        }

        return jsonSchemaElement
      }
      break
    case 'path':
      toSwaggerProp = function (propertyName, jsonSchemaElement) {
        jsonSchemaElement.in = container
        jsonSchemaElement.name = propertyName
        jsonSchemaElement.required = true
        return jsonSchemaElement
      }
      break
    case 'header':
      toSwaggerProp = function (propertyName, jsonSchemaElement) {
        return {
          in: 'header',
          name: propertyName,
          required: jsonSchemaElement.required,
          description: jsonSchemaElement.description,
          type: jsonSchemaElement.type
        }
      }
      break
  }

  return Object.keys(obj)
    .filter((propKey) => (!securityIgnores.includes(propKey)))
    .map((propKey) => {
      return toSwaggerProp(propKey, obj[propKey])
    })
}

/*
* Map  unsupported JSON schema definitions to Swagger definitions
*/
function replaceUnsupported (jsonSchema) {
  if (typeof jsonSchema === 'object' && jsonSchema !== null) {
    // Handle patternProperties, that is not part of OpenAPI definitions
    if (jsonSchema.patternProperties) {
      jsonSchema.additionalProperties = { type: 'string' }
      delete jsonSchema.patternProperties
    } else if (jsonSchema.const) {
      // Handle const, that is not part of OpenAPI definitions
      jsonSchema.enum = [jsonSchema.const]
      delete jsonSchema.const
    }

    Object.keys(jsonSchema).forEach(function (key) {
      jsonSchema[key] = replaceUnsupported(jsonSchema[key])
    })
  }

  return jsonSchema
}

function isConsumesFormOnly (schema) {
  const consumes = schema.consumes
  return (
    consumes &&
      consumes.length === 1 &&
      (consumes[0] === 'application/x-www-form-urlencoded' ||
        consumes[0] === 'multipart/form-data')
  )
}

function resolveBodyParams (parameters, schema, ref) {
  const resolved = ref.resolve(schema)
  replaceUnsupported(resolved)

  parameters.push({
    name: 'body',
    in: 'body',
    schema: resolved
  })
}

function resolveCommonParams (container, parameters, schema, ref, sharedSchemas, securityIgnores) {
  const resolved = ref.resolve(schema)
  const arr = plainJsonObjectToSwagger2(container, resolved, sharedSchemas, securityIgnores)
  arr.forEach(swaggerSchema => parameters.push(swaggerSchema))
}

// https://swagger.io/docs/specification/2-0/describing-responses/
function resolveResponse (fastifyResponseJson, ref) {
  // if the user does not provided an out schema
  if (!fastifyResponseJson) {
    return { 200: { description: 'Default Response' } }
  }

  const responsesContainer = {}

  const statusCodes = Object.keys(fastifyResponseJson)

  statusCodes.forEach(statusCode => {
    const rawJsonSchema = fastifyResponseJson[statusCode]
    const resolved = ref.resolve(rawJsonSchema)

    delete resolved.$schema

    // 2xx is not supported by swagger
    const deXXStatusCode = statusCode.toUpperCase().replace('XX', '00')
    // conflict when we have both 2xx and 200
    if (statusCode.toUpperCase().includes('XX') && statusCodes.includes(deXXStatusCode)) {
      return
    }

    // converts statusCode to upper case only when it is not "default"
    if (statusCode !== 'default') {
      statusCode = deXXStatusCode
    }

    const response = {
      description: rawJsonSchema[xResponseDescription] || rawJsonSchema.description || 'Default Response'
    }

    // add headers when there are any.
    if (rawJsonSchema.headers) {
      response.headers = rawJsonSchema.headers
      // remove invalid field
      delete resolved.headers
    }

    // add schema when type is not 'null'
    if (rawJsonSchema.type !== 'null') {
      const schema = { ...resolved }
      replaceUnsupported(schema)
      delete schema[xResponseDescription]
      response.schema = schema
    }

    responsesContainer[statusCode] = response
  })

  return responsesContainer
}

function prepareSwaggerMethod (schema, ref, swaggerObject) {
  const swaggerMethod = {}
  const parameters = []

  // Parse out the security prop keys to ignore
  const securityIgnores = [
    ...(swaggerObject && swaggerObject.security ? swaggerObject.security : []),
    ...(schema && schema.security ? schema.security : [])
  ]
    .reduce((acc, securitySchemeGroup) => {
      Object.keys(securitySchemeGroup).forEach((securitySchemeLabel) => {
        const { name, in: category } = swaggerObject.securityDefinitions[securitySchemeLabel]
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(name)
      })
      return acc
    }, {})

  // All the data the user can give us, is via the schema object
  if (schema) {
    if (schema.operationId) swaggerMethod.operationId = schema.operationId
    if (schema.summary) swaggerMethod.summary = schema.summary
    if (schema.description) swaggerMethod.description = schema.description
    if (schema.externalDocs) swaggerMethod.externalDocs = schema.externalDocs
    if (schema.tags) swaggerMethod.tags = schema.tags
    if (schema.produces) swaggerMethod.produces = schema.produces
    if (schema.consumes) swaggerMethod.consumes = schema.consumes
    if (schema.querystring) resolveCommonParams('query', parameters, schema.querystring, ref, swaggerObject.definitions, securityIgnores.query)
    if (schema.body) {
      const isConsumesAllFormOnly = isConsumesFormOnly(schema) || isConsumesFormOnly(swaggerObject)
      isConsumesAllFormOnly
        ? resolveCommonParams('formData', parameters, schema.body, ref, swaggerObject.definitions)
        : resolveBodyParams(parameters, schema.body, ref)
    }
    if (schema.params) resolveCommonParams('path', parameters, schema.params, ref, swaggerObject.definitions)
    if (schema.headers) resolveCommonParams('header', parameters, schema.headers, ref, swaggerObject.definitions, securityIgnores.header)
    if (parameters.length > 0) swaggerMethod.parameters = parameters
    if (schema.deprecated) swaggerMethod.deprecated = schema.deprecated
    if (schema.security) swaggerMethod.security = schema.security
    for (const key of Object.keys(schema)) {
      if (key.startsWith('x-')) {
        swaggerMethod[key] = schema[key]
      }
    }
  }

  swaggerMethod.responses = resolveResponse(schema ? schema.response : null, ref)

  return swaggerMethod
}

function prepareSwaggerDefinitions (definitions, ref) {
  return Object.entries(definitions)
    .reduce((res, [name, definition]) => {
      const _ = { ...definition }
      const resolved = ref.resolve(_, { externalSchemas: [definitions] })

      // Swagger doesn't accept $id on /definitions schemas.
      // The $ids are needed by Ref() to check the URI so we need
      // to remove them at the end of the process
      delete resolved.$id
      delete resolved.definitions

      res[name] = resolved
      return res
    }, {})
}

module.exports = {
  prepareDefaultOptions,
  prepareSwaggerObject,
  prepareSwaggerMethod,
  normalizeUrl,
  prepareSwaggerDefinitions
}


/***/ }),

/***/ 143:
/***/ ((module) => {



const rawRequired = Symbol('fastify-swagger.rawRequired')

module.exports = {
  rawRequired
}


/***/ }),

/***/ 137:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const fs = __webpack_require__(123)
const path = __webpack_require__(104)
const Ref = __webpack_require__(138)
const { rawRequired } = __webpack_require__(143)
const { xConsume } = __webpack_require__(144)

function addHook (fastify, pluginOptions) {
  const routes = []
  const sharedSchemasMap = new Map()

  fastify.addHook('onRoute', (routeOptions) => {
    routes.push(routeOptions)
  })

  fastify.addHook('onRegister', async (instance) => {
    // we need to wait the ready event to get all the .getSchemas()
    // otherwise it will be empty
    // TODO: better handle for schemaId
    // when schemaId is the same in difference instance
    // the latter will lost
    instance.addHook('onReady', (done) => {
      const allSchemas = instance.getSchemas()
      for (const schemaId of Object.keys(allSchemas)) {
        if (!sharedSchemasMap.has(schemaId)) {
          sharedSchemasMap.set(schemaId, allSchemas[schemaId])
        }
      }
      done()
    })
  })

  return {
    routes,
    Ref () {
      const externalSchemas = Array.from(sharedSchemasMap.values())
      return Ref(Object.assign(
        { applicationUri: 'todo.com' },
        pluginOptions.refResolver,
        { clone: true, externalSchemas })
      )
    }
  }
}

function shouldRouteHide (schema, opts) {
  const { hiddenTag, hideUntagged } = opts

  if (schema && schema.hide) {
    return true
  }

  const tags = (schema && schema.tags) || []

  if (tags.length === 0 && hideUntagged) {
    return true
  }

  if (tags.includes(hiddenTag)) {
    return schema.tags.includes(hiddenTag)
  }

  return false
}

// The swagger standard does not accept the url param with ':'
// so '/user/:id' is not valid.
// This function converts the url in a swagger compliant url string
// => '/user/{id}'
// custom verbs at the end of a url are okay => /user::watch but should be rendered as /user:watch in swagger
const COLON = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789_'
function formatParamUrl (str) {
  let i, char
  let state = 'skip'
  let path = ''
  let param = ''
  let level = 0
  // count for regex if no param exist
  let regexp = 0
  for (i = 0; i < str.length; i++) {
    char = str[i]
    switch (state) {
      case 'colon': {
        // we only accept a-zA-Z0-9_ in param
        if (COLON.indexOf(char) !== -1) {
          param += char
        } else if (char === '(') {
          state = 'regexp'
          level++
        } else {
          // end
          state = 'skip'
          path += '{' + param + '}'
          path += char
          param = ''
        }
        break
      }
      case 'regexp': {
        if (char === '(') {
          level++
        } else if (char === ')') {
          level--
        }
        // we end if the level reach zero
        if (level === 0) {
          state = 'skip'
          if (param === '') {
            regexp++
            param = 'regexp' + String(regexp)
          }
          path += '{' + param + '}'
          param = ''
        }
        break
      }
      default: {
        // we check if we need to change state
        if (char === ':' && str[i + 1] === ':') {
          // double colon -> single colon
          path += char
          // skip one more
          i++
        } else if (char === ':') {
          // single colon -> state colon
          state = 'colon'
        } else if (char === '(') {
          state = 'regexp'
          level++
        } else if (char === '*') {
          // * -> wildcard
          // should be exist once only
          path += '{wildcard}'
        } else {
          path += char
        }
      }
    }
  }
  // clean up
  if (state === 'colon' && param !== '') {
    path += '{' + param + '}'
  }
  return path
}

function resolveLocalRef (jsonSchema, externalSchemas) {
  if (typeof jsonSchema.type !== 'undefined' && typeof jsonSchema.properties !== 'undefined') {
    // for the shorthand querystring/params/headers declaration
    const propertiesMap = Object.keys(jsonSchema.properties).reduce((acc, headers) => {
      const rewriteProps = {}
      rewriteProps.required = (Array.isArray(jsonSchema.required) && jsonSchema.required.indexOf(headers) >= 0) || false
      // save raw required for next restore in the content/<media-type>
      if (jsonSchema.properties[headers][xConsume]) {
        rewriteProps[rawRequired] = jsonSchema.properties[headers].required
      }
      const newProps = Object.assign({}, jsonSchema.properties[headers], rewriteProps)

      return Object.assign({}, acc, { [headers]: newProps })
    }, {})

    return propertiesMap
  }

  // for oneOf, anyOf, allOf support in querystring/params/headers
  if (jsonSchema.oneOf || jsonSchema.anyOf || jsonSchema.allOf) {
    const schemas = jsonSchema.oneOf || jsonSchema.anyOf || jsonSchema.allOf
    return schemas.reduce(function (acc, schema) {
      const json = resolveLocalRef(schema, externalSchemas)
      return { ...acc, ...json }
    }, {})
  }

  // $ref is in the format: #/definitions/<resolved definition>/<optional fragment>
  const localRef = jsonSchema.$ref.split('/')[2]
  return resolveLocalRef(externalSchemas[localRef], externalSchemas)
}

function readPackageJson () {
  try {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'package.json')))
  } catch (err) {
    return {}
  }
}

function resolveSwaggerFunction (opts, cache, routes, Ref, done) {
  if (typeof opts.openapi === 'undefined' || opts.openapi === null) {
    return __webpack_require__(145)(opts, cache, routes, Ref, done)
  } else {
    return __webpack_require__(147)(opts, cache, routes, Ref, done)
  }
}

module.exports = {
  addHook,
  shouldRouteHide,
  readPackageJson,
  formatParamUrl,
  resolveLocalRef,
  resolveSwaggerFunction
}


/***/ }),

/***/ 138:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



const URI = __webpack_require__(139)
const cloner = __webpack_require__(140)({ proto: true, circles: false })
const { EventEmitter } = __webpack_require__(141)
const debug = __webpack_require__(142)('json-schema-resolver')

const kIgnore = Symbol('json-schema-resolver.ignore') // untrack a schema (usually the root one)
const kRefToDef = Symbol('json-schema-resolver.refToDef') // assign to an external json a new reference
const kConsumed = Symbol('json-schema-resolver.consumed') // when an external json has been referenced

// ! Target: DRAFT-07
// https://tools.ietf.org/html/draft-handrews-json-schema-01

// ? Open to DRAFT 08
// https://json-schema.org/draft/2019-09/json-schema-core.html

const defaultOpts = {
  target: 'draft-07',
  clone: false,
  buildLocalReference (json, baseUri, fragment, i) {
    return `def-${i}`
  }
}

const targetSupported = ['draft-07'] // TODO , 'draft-08'
const targetCfg = {
  'draft-07': {
    def: 'definitions'
  },
  'draft-08': {
    def: '$defs'
  }
}

// logic: https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.appendix.B.1
function jsonSchemaResolver (options) {
  const ee = new EventEmitter()
  const {
    clone,
    target,
    applicationUri,
    externalSchemas: rootExternalSchemas,
    buildLocalReference
  } = Object.assign({}, defaultOpts, options)

  const allIds = new Map()
  let rolling = 0
  ee.on('$id', collectIds)

  const allRefs = []
  ee.on('$ref', collectRefs)

  if (!targetSupported.includes(target)) {
    throw new Error(`Unsupported JSON schema version ${target}`)
  }

  let defaultUri
  if (applicationUri) {
    defaultUri = getRootUri(applicationUri)

    if (rootExternalSchemas) {
      for (const es of rootExternalSchemas) { mapIds(ee, defaultUri, es) }
      debug('Processed root external schemas')
    }
  } else if (rootExternalSchemas) {
    throw new Error('If you set root externalSchema, the applicationUri option is needed')
  }

  return {
    resolve,
    definitions () {
      const defKey = targetCfg[target].def
      const x = { [defKey]: {} }
      allIds.forEach((json, baseUri) => {
        x[defKey][json[kRefToDef]] = json
      })
      return x
    }
  }

  function resolve (rootSchema, opts) {
    const { externalSchemas } = opts || {}

    if (!rootExternalSchemas) {
      allIds.clear()
    }
    allRefs.length = 0

    if (clone) {
      rootSchema = cloner(rootSchema)
    }

    const appUri = defaultUri || getRootUri(rootSchema.$id)
    debug('Found app URI %o', appUri)

    if (externalSchemas) {
      for (const es of externalSchemas) { mapIds(ee, appUri, es) }
      debug('Processed external schemas')
    }

    const baseUri = URI.serialize(appUri) // canonical absolute-URI
    if (rootSchema.$id) {
      rootSchema.$id = baseUri // fix the schema $id value
    }
    rootSchema[kIgnore] = true

    mapIds(ee, appUri, rootSchema)
    debug('Processed root schema')

    debug('Generating %d refs', allRefs.length)
    allRefs.forEach(({ baseUri, ref, refUri, json }) => {
      debug('Evaluating $ref %s', ref)
      if (ref[0] === '#') { return }

      const evaluatedJson = allIds.get(baseUri)
      if (!evaluatedJson) {
        debug('External $ref %s not provided with baseUri %s', ref, baseUri)
        return
      }
      evaluatedJson[kConsumed] = true
      json.$ref = `#/definitions/${evaluatedJson[kRefToDef]}${refUri.fragment || ''}`
    })

    if (externalSchemas) {
      // only if user sets external schema add it to the definitions
      const defKey = targetCfg[target].def
      allIds.forEach((json, baseUri) => {
        if (json[kConsumed] === true) {
          if (!rootSchema[defKey]) {
            rootSchema[defKey] = {}
          }

          rootSchema[defKey][json[kRefToDef]] = json
        }
      })
    }

    return rootSchema
  }

  function collectIds (json, baseUri, fragment) {
    if (json[kIgnore]) { return }

    const rel = (fragment && URI.serialize(fragment)) || ''
    const id = URI.serialize(baseUri) + rel
    if (!allIds.has(id)) {
      debug('Collected $id %s', id)
      json[kRefToDef] = buildLocalReference(json, baseUri, fragment, rolling++)
      allIds.set(id, json)
    } else {
      debug('WARN duplicated id %s .. IGNORED - ', id)
    }
  }

  function collectRefs (json, baseUri, refVal) {
    const refUri = URI.parse(refVal)
    debug('Pre enqueue $ref %o', refUri)

    // "same-document";
    // "relative";
    // "absolute";
    // "uri";
    if (refUri.reference === 'relative') {
      refUri.scheme = baseUri.scheme
      refUri.userinfo = baseUri.userinfo
      refUri.host = baseUri.host
      refUri.port = baseUri.port

      const newBaseUri = Object.assign({}, baseUri)
      newBaseUri.path = refUri.path
      baseUri = newBaseUri
    } else if (refUri.reference === 'uri' || refUri.reference === 'absolute') {
      baseUri = { ...refUri, fragment: undefined }
    }

    const ref = URI.serialize(refUri)
    allRefs.push({
      baseUri: URI.serialize(baseUri),
      refUri,
      ref,
      json
    })
    debug('Enqueue $ref %s', ref)
  }
}

/**
   *
   * @param {URI} baseUri
   * @param {*} json
   */
function mapIds (ee, baseUri, json) {
  if (!(json instanceof Object)) return

  if (json.$id) {
    const $idUri = URI.parse(json.$id)
    let fragment = null

    if ($idUri.reference === 'absolute') {
      // "$id": "http://example.com/root.json"
      baseUri = $idUri // a new baseURI for children
    } else if ($idUri.reference === 'relative') {
      // "$id": "other.json",
      const newBaseUri = Object.assign({}, baseUri)
      newBaseUri.path = $idUri.path
      newBaseUri.fragment = $idUri.fragment
      baseUri = newBaseUri
    } else {
      // { "$id": "#bar" }
      fragment = $idUri
    }
    ee.emit('$id', json, baseUri, fragment)
  }
  // else if (json.$anchor) {
  // TODO the $id should manage $anchor to support draft 08
  // }

  const fields = Object.keys(json)
  for (const prop of fields) {
    if (prop === '$ref') {
      ee.emit('$ref', json, baseUri, json[prop])
    }
    mapIds(ee, baseUri, json[prop])
  }
}

function getRootUri (strUri = 'application.uri') {
  // If present, the value for this keyword MUST be a string, and MUST
  // represent a valid URI-reference [RFC3986].  This value SHOULD be
  // normalized, and SHOULD NOT be an empty fragment <#> or an empty
  // string <>.
  const uri = URI.parse(strUri)
  uri.fragment = undefined
  return uri
}

module.exports = jsonSchemaResolver


/***/ }),

/***/ 140:
/***/ ((module) => {


module.exports = rfdc

function copyBuffer (cur) {
  if (cur instanceof Buffer) {
    return Buffer.from(cur)
  }

  return new cur.constructor(cur.buffer.slice(), cur.byteOffset, cur.length)
}

function rfdc (opts) {
  opts = opts || {}

  if (opts.circles) return rfdcCircles(opts)
  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        a2[k] = fn(cur)
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = clone(cur)
      }
    }
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        o2[k] = cloneProto(cur)
      }
    }
    return o2
  }
}

function rfdcCircles (opts) {
  var refs = []
  var refsNew = []

  return opts.proto ? cloneProto : clone

  function cloneArray (a, fn) {
    var keys = Object.keys(a)
    var a2 = new Array(keys.length)
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i]
      var cur = a[k]
      if (typeof cur !== 'object' || cur === null) {
        a2[k] = cur
      } else if (cur instanceof Date) {
        a2[k] = new Date(cur)
      } else if (ArrayBuffer.isView(cur)) {
        a2[k] = copyBuffer(cur)
      } else {
        var index = refs.indexOf(cur)
        if (index !== -1) {
          a2[k] = refsNew[index]
        } else {
          a2[k] = fn(cur)
        }
      }
    }
    return a2
  }

  function clone (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, clone)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), clone))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), clone))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      if (Object.hasOwnProperty.call(o, k) === false) continue
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), clone))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), clone))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = clone(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }

  function cloneProto (o) {
    if (typeof o !== 'object' || o === null) return o
    if (o instanceof Date) return new Date(o)
    if (Array.isArray(o)) return cloneArray(o, cloneProto)
    if (o instanceof Map) return new Map(cloneArray(Array.from(o), cloneProto))
    if (o instanceof Set) return new Set(cloneArray(Array.from(o), cloneProto))
    var o2 = {}
    refs.push(o)
    refsNew.push(o2)
    for (var k in o) {
      var cur = o[k]
      if (typeof cur !== 'object' || cur === null) {
        o2[k] = cur
      } else if (cur instanceof Date) {
        o2[k] = new Date(cur)
      } else if (cur instanceof Map) {
        o2[k] = new Map(cloneArray(Array.from(cur), cloneProto))
      } else if (cur instanceof Set) {
        o2[k] = new Set(cloneArray(Array.from(cur), cloneProto))
      } else if (ArrayBuffer.isView(cur)) {
        o2[k] = copyBuffer(cur)
      } else {
        var i = refs.indexOf(cur)
        if (i !== -1) {
          o2[k] = refsNew[i]
        } else {
          o2[k] = cloneProto(cur)
        }
      }
    }
    refs.pop()
    refsNew.pop()
    return o2
  }
}


/***/ }),

/***/ 130:
/***/ ((module) => {

module.exports = require("content-disposition");

/***/ }),

/***/ 142:
/***/ ((module) => {

module.exports = require("debug");

/***/ }),

/***/ 141:
/***/ ((module) => {

module.exports = require("events");

/***/ }),

/***/ 128:
/***/ ((module) => {

module.exports = require("glob");

/***/ }),

/***/ 124:
/***/ ((module) => {

module.exports = require("js-yaml");

/***/ }),

/***/ 134:
/***/ ((module) => {

module.exports = require("p-limit");

/***/ }),

/***/ 127:
/***/ ((module) => {

module.exports = require("readable-stream");

/***/ }),

/***/ 129:
/***/ ((module) => {

module.exports = require("send");

/***/ }),

/***/ 139:
/***/ ((module) => {

module.exports = require("uri-js");

/***/ }),

/***/ 123:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 131:
/***/ ((module) => {

module.exports = require("util");

/***/ }),

/***/ 135:
/***/ ((module) => {

module.exports = JSON.parse('{"script":["\'sha256-2yQBTLGLI1sDcBILfj/o6b5ufMv6CEwPYOk3RZI/WjE=\'","\'sha256-GeDavzSZ8O71Jggf/pQkKbt52dfZkrdNMQ3e+Ox+AkI=\'"],"style":["\'sha256-pyVPiLlnqL9OWVoJPs/E6VVF5hBecRzM2gBiarnaqAo=\'"]}');

/***/ })

};
exports.runtime =
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("a8e734447d60b76b7c6c")
/******/ })();
/******/ 
/******/ }
;