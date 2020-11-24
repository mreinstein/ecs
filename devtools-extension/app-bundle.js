var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var FUNC_ERROR_TEXT = "Expected a function";
var NAN = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var nativeMax = Math.max,nativeMin = Math.min;
var now = function () {
  return root.Date.now();
};
function debounce(func, wait, options) {
  var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime = 0,leading = false,maxing = false,trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs,thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,timeSinceLastInvoke = time - lastInvokeTime,result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(),isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var lodash_debounce = debounce;

function vnode(sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}

const array = Array.isArray;
function primitive(s) {
  return typeof s === 'string' || typeof s === 'number';
}

function createElement(tagName) {
  return document.createElement(tagName);
}
function createElementNS(namespaceURI, qualifiedName) {
  return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode(text) {
  return document.createTextNode(text);
}
function createComment(text) {
  return document.createComment(text);
}
function insertBefore(parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
  node.removeChild(child);
}
function appendChild(node, child) {
  node.appendChild(child);
}
function parentNode(node) {
  return node.parentNode;
}
function nextSibling(node) {
  return node.nextSibling;
}
function tagName(elm) {
  return elm.tagName;
}
function setTextContent(node, text) {
  node.textContent = text;
}
function getTextContent(node) {
  return node.textContent;
}
function isElement(node) {
  return node.nodeType === 1;
}
function isText(node) {
  return node.nodeType === 3;
}
function isComment(node) {
  return node.nodeType === 8;
}
const htmlDomApi = {
  createElement,
  createElementNS,
  createTextNode,
  createComment,
  insertBefore,
  removeChild,
  appendChild,
  parentNode,
  nextSibling,
  tagName,
  setTextContent,
  getTextContent,
  isElement,
  isText,
  isComment };

function isUndef(s) {
  return s === undefined;
}
function isDef(s) {
  return s !== undefined;
}
const emptyNode = vnode('', {}, [], undefined, undefined);
function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode) {
  return vnode.sel !== undefined;
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  var _a;
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
    if (key !== undefined) {
      map[key] = i;
    }
  }
  return map;
}
const hooks = ['create', 'update', 'remove', 'destroy', 'pre', 'post'];
function init(modules, domApi) {
  let i;
  let j;
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [] };

  const api = domApi !== undefined ? domApi : htmlDomApi;
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks[i]];
      if (hook !== undefined) {
        cbs[hooks[i]].push(hook);
      }
    }
  }
  function emptyNodeAt(elm) {
    const id = elm.id ? '#' + elm.id : '';
    const c = elm.className ? '.' + elm.className.split(' ').join('.') : '';
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], undefined, elm);
  }
  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }
  function createElm(vnode, insertedVnodeQueue) {
    var _a, _b;
    let i;
    let data = vnode.data;
    if (data !== undefined) {
      const init = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
      if (isDef(init)) {
        init(vnode);
        data = vnode.data;
      }
    }
    const children = vnode.children;
    const sel = vnode.sel;
    if (sel === '!') {
      if (isUndef(vnode.text)) {
        vnode.text = '';
      }
      vnode.elm = api.createComment(vnode.text);
    } else
    if (sel !== undefined) {
      // Parse selector
      const hashIdx = sel.indexOf('#');
      const dotIdx = sel.indexOf('.', hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode.elm = isDef(data) && isDef(i = data.ns) ?
      api.createElementNS(i, tag) :
      api.createElement(tag);
      if (hash < dot)
      elm.setAttribute('id', sel.slice(hash + 1, dot));
      if (dotIdx > 0)
      elm.setAttribute('class', sel.slice(dot + 1).replace(/\./g, ' '));
      for (i = 0; i < cbs.create.length; ++i)
      cbs.create[i](emptyNode, vnode);
      if (array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
          }
        }
      } else
      if (primitive(vnode.text)) {
        api.appendChild(elm, api.createTextNode(vnode.text));
      }
      const hook = vnode.data.hook;
      if (isDef(hook)) {
        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode);
        if (hook.insert) {
          insertedVnodeQueue.push(vnode);
        }
      }
    } else
    {
      vnode.elm = api.createTextNode(vnode.text);
    }
    return vnode.elm;
  }
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }
  function invokeDestroyHook(vnode) {
    var _a, _b;
    const data = vnode.data;
    if (data !== undefined) {
      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode);
      for (let i = 0; i < cbs.destroy.length; ++i)
      cbs.destroy[i](vnode);
      if (vnode.children !== undefined) {
        for (let j = 0; j < vnode.children.length; ++j) {
          const child = vnode.children[j];
          if (child != null && typeof child !== 'string') {
            invokeDestroyHook(child);
          }
        }
      }
    }
  }
  function removeVnodes(parentElm, vnodes, startIdx, endIdx) {
    var _a, _b;
    for (; startIdx <= endIdx; ++startIdx) {
      let listeners;
      let rm;
      const ch = vnodes[startIdx];
      if (ch != null) {
        if (isDef(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (let i = 0; i < cbs.remove.length; ++i)
          cbs.remove[i](ch, rm);
          const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else
          {
            rm();
          }
        } else
        {// Text node
          api.removeChild(parentElm, ch.elm);
        }
      }
    }
  }
  function updateChildren(parentElm, oldCh, newCh, insertedVnodeQueue) {
    let oldStartIdx = 0;
    let newStartIdx = 0;
    let oldEndIdx = oldCh.length - 1;
    let oldStartVnode = oldCh[0];
    let oldEndVnode = oldCh[oldEndIdx];
    let newEndIdx = newCh.length - 1;
    let newStartVnode = newCh[0];
    let newEndVnode = newCh[newEndIdx];
    let oldKeyToIdx;
    let idxInOld;
    let elmToMove;
    let before;
    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (oldStartVnode == null) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode might have been moved left
      } else
      if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else
      if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else
      if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else
      if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldStartVnode, newEndVnode)) {// Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else
      if (sameVnode(oldEndVnode, newStartVnode)) {// Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else
      {
        if (oldKeyToIdx === undefined) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) {// New element
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
        } else
        {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          } else
          {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else
      {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }
  function patchVnode(oldVnode, vnode, insertedVnodeQueue) {
    var _a, _b, _c, _d, _e;
    const hook = (_a = vnode.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode);
    const elm = vnode.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode.children;
    if (oldVnode === vnode)
    return;
    if (vnode.data !== undefined) {
      for (let i = 0; i < cbs.update.length; ++i)
      cbs.update[i](oldVnode, vnode);
      (_d = (_c = vnode.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode);
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else
      if (isDef(ch)) {
        if (isDef(oldVnode.text))
        api.setTextContent(elm, '');
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else
      if (isDef(oldVnode.text)) {
        api.setTextContent(elm, '');
      }
    } else
    if (oldVnode.text !== vnode.text) {
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vnode.text);
    }
    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode);
  }
  return function patch(oldVnode, vnode) {
    let i, elm, parent;
    const insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i)
    cbs.pre[i]();
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }
    if (sameVnode(oldVnode, vnode)) {
      patchVnode(oldVnode, vnode, insertedVnodeQueue);
    } else
    {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode, insertedVnodeQueue);
      if (parent !== null) {
        api.insertBefore(parent, vnode.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i)
    cbs.post[i]();
    return vnode;
  };
}

function addNS(data, children, sel) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== undefined) {
        addNS(childData, children[i].children, children[i].sel);
      }
    }
  }
}
function h(sel, b, c) {
  var data = {};
  var children;
  var text;
  var i;
  if (c !== undefined) {
    if (b !== null) {
      data = b;
    }
    if (array(c)) {
      children = c;
    } else
    if (primitive(c)) {
      text = c;
    } else
    if (c && c.sel) {
      children = [c];
    }
  } else
  if (b !== undefined && b !== null) {
    if (array(b)) {
      children = b;
    } else
    if (primitive(b)) {
      text = b;
    } else
    if (b && b.sel) {
      children = [b];
    } else
    {
      data = b;
    }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (primitive(children[i]))
      children[i] = vnode(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (
  sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, undefined);
}

function copyToThunk(vnode, thunk) {
  vnode.data.fn = thunk.data.fn;
  vnode.data.args = thunk.data.args;
  thunk.data = vnode.data;
  thunk.children = vnode.children;
  thunk.text = vnode.text;
  thunk.elm = vnode.elm;
}
function init$1(thunk) {
  const cur = thunk.data;
  const vnode = cur.fn.apply(undefined, cur.args);
  copyToThunk(vnode, thunk);
}
function prepatch(oldVnode, thunk) {
  let i;
  const old = oldVnode.data;
  const cur = thunk.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(undefined, args), thunk);
    return;
  }
  for (i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(undefined, args), thunk);
      return;
    }
  }
  copyToThunk(oldVnode, thunk);
}
const thunk = function thunk(sel, key, fn, args) {
  if (args === undefined) {
    args = fn;
    fn = key;
    key = undefined;
  }
  return h(sel, {
    key: key,
    hook: { init: init$1, prepatch },
    fn: fn,
    args: args });

};

var hyperscriptAttributeToProperty = attributeToProperty;

var transform = {
  'class': 'className',
  'for': 'htmlFor',
  'http-equiv': 'httpEquiv' };


function attributeToProperty(h) {
  return function (tagName, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h(tagName, attrs, children);
  };
}

var VAR = 0,TEXT = 1,OPEN = 2,CLOSE = 3,ATTR = 4;
var ATTR_KEY = 5,ATTR_KEY_W = 6;
var ATTR_VALUE_W = 7,ATTR_VALUE = 8;
var ATTR_VALUE_SQ = 9,ATTR_VALUE_DQ = 10;
var ATTR_EQ = 11,ATTR_BREAK = 12;
var COMMENT = 13;

var hyperx = function (h, opts) {
  if (!opts) opts = {};
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b);
  };
  if (opts.attrToProp !== false) {
    h = hyperscriptAttributeToProperty(h);
  }

  return function (strings) {
    var state = TEXT,reg = '';
    var arglen = arguments.length;
    var parts = [];

    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i + 1];
        var p = parse(strings[i]);
        var xstate = state;
        if (xstate === ATTR_VALUE_DQ) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_SQ) xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_W) xstate = ATTR_VALUE;
        if (xstate === ATTR) xstate = ATTR_KEY;
        if (xstate === OPEN) {
          if (reg === '/') {
            p.push([OPEN, '/', arg]);
            reg = '';
          } else {
            p.push([OPEN, arg]);
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg);
        } else if (xstate !== COMMENT) {
          p.push([VAR, xstate, arg]);
        }
        parts.push.apply(parts, p);
      } else parts.push.apply(parts, parse(strings[i]));
    }

    var tree = [null, {}, []];
    var stack = [[tree, -1]];
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length - 1][0];
      var p = parts[i],s = p[0];
      if (s === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length - 1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h(
          cur[0], cur[1], cur[2].length ? cur[2] : undefined);

        }
      } else if (s === OPEN) {
        var c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (s === ATTR_KEY || s === VAR && p[1] === ATTR_KEY) {
        var key = '';
        var copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1]);
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === 'object' && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey];
                }
              }
            } else {
              key = concat(key, parts[i][2]);
            }
          } else break;
        }
        if (parts[i][0] === ATTR_EQ) i++;
        var j = i;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][1]);else
            parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR && (
          parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key]) cur[1][key] = strfn(parts[i][2]);else
            parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j && (
            parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              // https://html.spec.whatwg.org/multipage/infrastructure.html#boolean-attributes
              // empty string is falsy, not well behaved value in browser
              cur[1][key] = key.toLowerCase();
            }
            if (parts[i][0] === CLOSE) {
              i--;
            }
            break;
          }
        }
      } else if (s === ATTR_KEY) {
        cur[1][p[1]] = true;
      } else if (s === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true;
      } else if (s === CLOSE) {
        if (selfClosing(cur[0]) && stack.length) {
          var ix = stack[stack.length - 1][1];
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h(
          cur[0], cur[1], cur[2].length ? cur[2] : undefined);

        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === undefined || p[2] === null) p[2] = '';else
        if (!p[2]) p[2] = concat('', p[2]);
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2]);
        } else {
          cur[2].push(p[2]);
        }
      } else if (s === TEXT) {
        cur[2].push(p[1]);
      } else if (s === ATTR_EQ || s === ATTR_BREAK) ;else {
        throw new Error('unhandled: ' + s);
      }
    }

    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift();
    }

    if (tree[2].length > 2 ||
    tree[2].length === 2 && /\S/.test(tree[2][1])) {
      if (opts.createFragment) return opts.createFragment(tree[2]);
      throw new Error(
      'multiple root elements must be wrapped in an enclosing tag');

    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === 'string' &&
    Array.isArray(tree[2][0][2])) {
      tree[2][0] = h(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    }
    return tree[2][0];

    function parse(str) {
      var res = [];
      if (state === ATTR_VALUE_W) state = ATTR;
      for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (state === TEXT && c === '<') {
          if (reg.length) res.push([TEXT, reg]);
          reg = '';
          state = OPEN;
        } else if (c === '>' && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN, reg]);
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, reg]);
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE, reg]);
          }
          res.push([CLOSE]);
          reg = '';
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(reg) && c === '-') {
          if (opts.comments) {
            res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
          }
          reg = '';
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg], [ATTR_KEY, 'comment'], [ATTR_EQ]);
          }
          reg = c;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          reg += c;
        } else if (state === OPEN && c === '/' && reg.length) ;else if (state === OPEN && /\s/.test(c)) {
          if (reg.length) {
            res.push([OPEN, reg]);
          }
          reg = '';
          state = ATTR;
        } else if (state === OPEN) {
          reg += c;
        } else if (state === ATTR && /[^\s"'=/]/.test(c)) {
          state = ATTR_KEY;
          reg = c;
        } else if (state === ATTR && /\s/.test(c)) {
          if (reg.length) res.push([ATTR_KEY, reg]);
          res.push([ATTR_BREAK]);
        } else if (state === ATTR_KEY && /\s/.test(c)) {
          res.push([ATTR_KEY, reg]);
          reg = '';
          state = ATTR_KEY_W;
        } else if (state === ATTR_KEY && c === '=') {
          res.push([ATTR_KEY, reg], [ATTR_EQ]);
          reg = '';
          state = ATTR_VALUE_W;
        } else if (state === ATTR_KEY) {
          reg += c;
        } else if ((state === ATTR_KEY_W || state === ATTR) && c === '=') {
          res.push([ATTR_EQ]);
          state = ATTR_VALUE_W;
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c)) {
          res.push([ATTR_BREAK]);
          if (/[\w-]/.test(c)) {
            reg += c;
            state = ATTR_KEY;
          } else state = ATTR;
        } else if (state === ATTR_VALUE_W && c === '"') {
          state = ATTR_VALUE_DQ;
        } else if (state === ATTR_VALUE_W && c === "'") {
          state = ATTR_VALUE_SQ;
        } else if (state === ATTR_VALUE_DQ && c === '"') {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE_SQ && c === "'") {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE_W && !/\s/.test(c)) {
          state = ATTR_VALUE;
          i--;
        } else if (state === ATTR_VALUE && /\s/.test(c)) {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = '';
          state = ATTR;
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ ||
        state === ATTR_VALUE_DQ) {
          reg += c;
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT, reg]);
        reg = '';
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = '';
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = '';
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = '';
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY, reg]);
        reg = '';
      }
      return res;
    }
  };

  function strfn(x) {
    if (typeof x === 'function') return x;else
    if (typeof x === 'string') return x;else
    if (x && typeof x === 'object') return x;else
    if (x === null || x === undefined) return x;else
    return concat('', x);
  }
};

function quot(state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
}

var closeRE = RegExp('^(' + [
'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'command', 'embed',
'frame', 'hr', 'img', 'input', 'isindex', 'keygen', 'link', 'meta', 'param',
'source', 'track', 'wbr', '!--',
// SVG TAGS
'animate', 'animateTransform', 'circle', 'cursor', 'desc', 'ellipse',
'feBlend', 'feColorMatrix', 'feComposite',
'feConvolveMatrix', 'feDiffuseLighting', 'feDisplacementMap',
'feDistantLight', 'feFlood', 'feFuncA', 'feFuncB', 'feFuncG', 'feFuncR',
'feGaussianBlur', 'feImage', 'feMergeNode', 'feMorphology',
'feOffset', 'fePointLight', 'feSpecularLighting', 'feSpotLight', 'feTile',
'feTurbulence', 'font-face-format', 'font-face-name', 'font-face-uri',
'glyph', 'glyphRef', 'hkern', 'image', 'line', 'missing-glyph', 'mpath',
'path', 'polygon', 'polyline', 'rect', 'set', 'stop', 'tref', 'use', 'view',
'vkern'].
join('|') + ')(?:[\.#][a-zA-Z0-9\u007F-\uFFFF_:-]+)*$');
function selfClosing(tag) {return closeRE.test(tag);}

function create(modules, options = {}) {

  const directive = options.directive || '@';

  function createElement(sel, input, content) {
    if (content && content.length) {
      if (content.length === 1)
      content = content[0];else

      content = [].concat.apply([], content); // flatten nested arrays
    }

    // attribute names, and handling none faster:
    const names = Object.keys(input);
    if (!names || !names.length)
    return h(sel, content);

    // parse Snabbdom's `data` from attributes:
    const data = {};
    for (let i = 0, max = names.length; max > i; i++) {
      const name = names[i];
      if (input[name] === 'false')
      input[name] = false;

      // directive attributes
      if (name.indexOf(directive) === 0) {
        const parts = name.slice(1).split(':');
        let previous = data;
        for (let p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
          const part = parts[p];
          if (p === last)
          previous[part] = input[name];else
          if (!previous[part])
          previous = previous[part] = {};else

          previous = previous[part];
        }
      }

      // put all other attributes into `data.attrs`
      else {
          if (!data.attrs)
          data.attrs = {};
          data.attrs[name] = input[name];
        }
    }

    // return vnode:
    return h(sel, data, content);
  }

  // create the snabbdom + hyperx functions
  const patch = init(modules || []);

  // create snabby function
  const snabby = hyperx(createElement, { attrToProp: false });

  // create yo-yo-like update function
  snabby.update = function update(dest, src) {
    return patch(dest, src);
  };

  snabby.thunk = thunk;

  return snabby;
}

const xlinkNS = 'http://www.w3.org/1999/xlink';
const xmlNS = 'http://www.w3.org/XML/1998/namespace';
const colonChar = 58;
const xChar = 120;
function updateAttrs(oldVnode, vnode) {
  var key;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs;
  var attrs = vnode.data.attrs;
  if (!oldAttrs && !attrs)
  return;
  if (oldAttrs === attrs)
  return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};
  // update modified attributes, add new attributes
  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    if (old !== cur) {
      if (cur === true) {
        elm.setAttribute(key, '');
      } else
      if (cur === false) {
        elm.removeAttribute(key);
      } else
      {
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur);
        } else
        if (key.charCodeAt(3) === colonChar) {
          // Assume xml namespace
          elm.setAttributeNS(xmlNS, key, cur);
        } else
        if (key.charCodeAt(5) === colonChar) {
          // Assume xlink namespace
          elm.setAttributeNS(xlinkNS, key, cur);
        } else
        {
          elm.setAttribute(key, cur);
        }
      }
    }
  }
  // remove removed attributes
  // use `in` operator since the previous `for` iteration uses it (.i.e. add even attributes with undefined value)
  // the other option is to remove all attributes with value == undefined
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}
const attributesModule = { create: updateAttrs, update: updateAttrs };

function updateClass(oldVnode, vnode) {
  var cur;
  var name;
  var elm = vnode.elm;
  var oldClass = oldVnode.data.class;
  var klass = vnode.data.class;
  if (!oldClass && !klass)
  return;
  if (oldClass === klass)
  return;
  oldClass = oldClass || {};
  klass = klass || {};
  for (name in oldClass) {
    if (oldClass[name] &&
    !Object.prototype.hasOwnProperty.call(klass, name)) {
      // was `true` and now not provided
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? 'add' : 'remove'](name);
    }
  }
}
const classModule = { create: updateClass, update: updateClass };

function updateProps(oldVnode, vnode) {
  var key;
  var cur;
  var old;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.props;
  var props = vnode.data.props;
  if (!oldProps && !props)
  return;
  if (oldProps === props)
  return;
  oldProps = oldProps || {};
  props = props || {};
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== 'value' || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}
const propsModule = { create: updateProps, update: updateProps };

// Bindig `requestAnimationFrame` like this fixes a bug in IE/Edge. See #360 and #409.
var raf = typeof window !== 'undefined' && window.requestAnimationFrame.bind(window) || setTimeout;
var nextFrame = function (fn) {
  raf(function () {
    raf(fn);
  });
};
var reflowForced = false;
function setNextFrame(obj, prop, val) {
  nextFrame(function () {
    obj[prop] = val;
  });
}
function updateStyle(oldVnode, vnode) {
  var cur;
  var name;
  var elm = vnode.elm;
  var oldStyle = oldVnode.data.style;
  var style = vnode.data.style;
  if (!oldStyle && !style)
  return;
  if (oldStyle === style)
  return;
  oldStyle = oldStyle || {};
  style = style || {};
  var oldHasDel = ('delayed' in oldStyle);
  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.removeProperty(name);
      } else
      {
        elm.style[name] = '';
      }
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === 'delayed' && style.delayed) {
      for (const name2 in style.delayed) {
        cur = style.delayed[name2];
        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
          setNextFrame(elm.style, name2, cur);
        }
      }
    } else
    if (name !== 'remove' && cur !== oldStyle[name]) {
      if (name[0] === '-' && name[1] === '-') {
        elm.style.setProperty(name, cur);
      } else
      {
        elm.style[name] = cur;
      }
    }
  }
}
function applyDestroyStyle(vnode) {
  var style;
  var name;
  var elm = vnode.elm;
  var s = vnode.data.style;
  if (!s || !(style = s.destroy))
  return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
function applyRemoveStyle(vnode, rm) {
  var s = vnode.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    vnode.elm.offsetLeft;
    reflowForced = true;
  }
  var name;
  var elm = vnode.elm;
  var i = 0;
  var compStyle;
  var style = s.remove;
  var amount = 0;
  var applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  compStyle = getComputedStyle(elm);
  var props = compStyle['transition-property'].split(', ');
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1)
    amount++;
  }
  elm.addEventListener('transitionend', function (ev) {
    if (ev.target === elm)
    --amount;
    if (amount === 0)
    rm();
  });
}
function forceReflow() {
  reflowForced = false;
}
const styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle };

function invokeHandler(handler, vnode, event) {
  if (typeof handler === 'function') {
    // call function handler
    handler.call(vnode, event, vnode);
  } else
  if (typeof handler === 'object') {
    // call multiple handlers
    for (var i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode, event);
    }
  }
}
function handleEvent(event, vnode) {
  var name = event.type;
  var on = vnode.data.on;
  // call event handler(s) if exists
  if (on && on[name]) {
    invokeHandler(on[name], vnode, event);
  }
}
function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  };
}
function updateEventListeners(oldVnode, vnode) {
  var oldOn = oldVnode.data.on;
  var oldListener = oldVnode.listener;
  var oldElm = oldVnode.elm;
  var on = vnode && vnode.data.on;
  var elm = vnode && vnode.elm;
  var name;
  // optimization for reused immutable handlers
  if (oldOn === on) {
    return;
  }
  // remove existing listeners which no longer used
  if (oldOn && oldListener) {
    // if element changed or deleted we remove all existing listeners unconditionally
    if (!on) {
      for (name in oldOn) {
        // remove listener if element was changed or existing listeners removed
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else
    {
      for (name in oldOn) {
        // remove listener if existing listener removed
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }
  // add new listeners which has not already attached
  if (on) {
    // reuse existing listener or create new
    var listener = vnode.listener = oldVnode.listener || createListener();
    // update vnode for listener
    listener.vnode = vnode;
    // if element changed or added we add all needed listeners unconditionally
    if (!oldOn) {
      for (name in on) {
        // add listener if element was changed or new listeners added
        elm.addEventListener(name, listener, false);
      }
    } else
    {
      for (name in on) {
        // add listener if new listener added
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}
const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners };

// Inits with common modules out of the box


var index = create([
attributesModule,
eventListenersModule,
classModule,
propsModule,
styleModule]);

function clamp(value, min, max) {
  return min < max ?
  value < min ? min : value > max ? max : value :
  value < max ? max : value > min ? min : value;
}

// given a value between a start and an end point, figure out how far
// along we are from 0..1
function findPosOnScale(start, end, value) {
  if (value === Infinity)
  return 1;

  const length = end - start;

  if (length === 0)
  return 0;

  if (value === 0)
  value = start;

  if (value === Infinity)
  value = end;

  const x = Math.max(0, value - start);

  return x / length;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var FUNC_ERROR_TEXT$1 = "Expected a function";
var NAN$1 = 0 / 0;
var symbolTag$1 = "[object Symbol]";
var reTrim$1 = /^\s+|\s+$/g;
var reIsBadHex$1 = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary$1 = /^0b[01]+$/i;
var reIsOctal$1 = /^0o[0-7]+$/i;
var freeParseInt$1 = parseInt;
var freeGlobal$1 = typeof commonjsGlobal$1 == "object" && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
var root$1 = freeGlobal$1 || freeSelf$1 || Function("return this")();
var objectProto$1 = Object.prototype;
var objectToString$1 = objectProto$1.toString;
var nativeMax$1 = Math.max,nativeMin$1 = Math.min;
var now$1 = function () {
  return root$1.Date.now();
};
function debounce$1(func, wait, options) {
  var lastArgs,lastThis,maxWait,result,timerId,lastCallTime,lastInvokeTime = 0,leading = false,maxing = false,trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  wait = toNumber$1(wait) || 0;
  if (isObject$1(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax$1(toNumber$1(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs,thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,timeSinceLastInvoke = time - lastInvokeTime,result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin$1(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now$1();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now$1());
  }
  function debounced() {
    var time = now$1(),isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function throttle(func, wait, options) {
  var leading = true,trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT$1);
  }
  if (isObject$1(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce$1(func, wait, {
    leading,
    maxWait: wait,
    trailing });

}
function isObject$1(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike$1(value) {
  return !!value && typeof value == "object";
}
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike$1(value) && objectToString$1.call(value) == symbolTag$1;
}
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol$1(value)) {
    return NAN$1;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject$1(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim$1, "");
  var isBinary = reIsBinary$1.test(value);
  return isBinary || reIsOctal$1.test(value) ? freeParseInt$1(value.slice(2), isBinary ? 2 : 8) : reIsBadHex$1.test(value) ? NAN$1 : +value;
}
var lodash_throttle = throttle;

const DOT_WIDTH = 4;
const FPS = 60;


function getTimePeriodData(graph) {
  return graph.data.filter(dataPoint => {
    // if data is outside of the time range skip it
    if (dataPoint.t < graph.timeRange.start)
    return false;

    if (dataPoint.t > graph.timeRange.end)
    return false;

    return true;
  });
}


function getGraphMetrics(model, graph) {
  let leftMargin = 10;
  const rightMargin = 10;
  let bottomMargin = graph.renderTicks ? 20 : 0;

  if (graph.renderValueLabel && graph.selection.type === 'value')
  bottomMargin += 30;

  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model.width - leftMargin - rightMargin;

  return {
    leftMargin, rightMargin, bottomMargin, graphHeight, graphWidth };

}


function verticalGridLinesMinor(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return;

  const m = getGraphMetrics(model, graph);
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  const { ctx } = graph;

  ctx.lineWidth = 1; //strokeWidth
  ctx.strokeStyle = graph.gridLines.vertical.minorColor;

  ctx.beginPath();

  for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
    const x = m.leftMargin + i + 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, m.graphHeight);
  }

  ctx.stroke();
}


function verticalGridLinesMajor(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return;

  const m = getGraphMetrics(model, graph);

  const pixelsPerTick = 6;
  const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;

  const { ctx } = graph;

  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = graph.gridLines.vertical.majorColor;

  ctx.beginPath();

  for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
    const x = m.leftMargin + i + 0.5;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, m.graphHeight);
  }

  ctx.stroke();
}


function gridLines(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.horizontal)
  return;

  const m = getGraphMetrics(model, graph);

  const { ctx } = graph;
  ctx.lineWidth = 0.5; //strokeWidth
  ctx.strokeStyle = graph.gridLines.horizontal.color;

  ctx.beginPath();

  ctx.setLineDash([4, 2]);

  const distanceBetweenLines = m.graphHeight / (graph.gridLines.horizontal.lineCount + 1);
  for (let y = distanceBetweenLines; y < m.graphHeight; y += distanceBetweenLines) {
    ctx.moveTo(m.leftMargin + 0.5, y + 0.5);
    ctx.lineTo(m.leftMargin + m.graphWidth + 0.5, y + 0.5);
  }

  ctx.stroke();
  ctx.setLineDash([]);
}


function renderLinePlotGraph(model, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model, graph);

  const { ctx } = graph;
  let lastX, lastY;

  if (graph.linePlotAreaColor) {
    const region = new Path2D();

    for (let i = 0; i < tp.length; i++) {
      const point = tp[i];

      const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
      const x = Math.round(startX * (m.graphWidth - dotWidth) + m.leftMargin) + 0.5;

      const yLength = graph.yRange.end - graph.yRange.start;
      const y = Math.round((1 - point.value / yLength) * (m.graphHeight - dotWidth)) + 0.5;

      if (i === 0)
      region.moveTo(x, m.graphHeight);

      region.lineTo(x, y);
      lastX = x;
    }

    region.lineTo(lastX, m.graphHeight);

    region.closePath();
    ctx.fillStyle = graph.linePlotAreaColor;
    ctx.fill(region);
  }

  ctx.beginPath();
  ctx.strokeStyle = graph.dataColor;
  ctx.lineWidth = 1;

  for (let i = 0; i < tp.length; i++) {
    const point = tp[i];

    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = Math.round(startX * (m.graphWidth - dotWidth) + m.leftMargin) + 0.5;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = Math.round((1 - point.value / yLength) * (m.graphHeight - dotWidth)) + 0.5;

    if (i > 0) {
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x, y);
    }

    lastX = x;
    lastY = y;
  }

  ctx.stroke();
}


function renderScatterPlotGraph(model, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model, graph);

  const { ctx } = graph;

  ctx.fillStyle = graph.dataColor;

  return tp.map(point => {
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);

    ctx.fillRect(Math.round(x), Math.round(y), dotWidth, dotWidth);
  });
}


function graphComponent(model, graph, update) {

  const dotWidth = 4;
  const m = getGraphMetrics(model, graph);

  // TODO: change mouse cursor to ew-resize when hovering over a drag handle

  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth); //x position within the element.

    if (graph.selection.dragging === 'time') {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.time = lerp(graph.timeRange.start, graph.timeRange.end, pos);

    } else if (graph.selection.dragging === 'start') {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);

      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);

      // prevent dragging the start control beyond end
      if (graph.selection.start > graph.selection.end)
      graph.selection.start = graph.selection.end;

    } else if (graph.selection.dragging === 'end') {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);

      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);

      // prevent dragging the end control beyond start
      if (graph.selection.end < graph.selection.start)
      graph.selection.end = graph.selection.start;
    }

    update();
  }, 1000 / FPS);

  const _mouseUp = function (ev) {
    graph.selection.dragging = undefined;
    document.removeEventListener('mouseup', _mouseUp);
    document.removeEventListener('mousemove', _mouseMove);
    update();
  };

  const _mouseDown = function (ev) {

    let draggingType; // start | end  | time | undefined

    if (graph.selection?.type === 'range' && ev.offsetY <= 21) {
      // check to see if the offsetX is within the bounds of the start or end drag controls
      const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
      const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);

      const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;
      const x2 = endX * (m.graphWidth - dotWidth) + m.leftMargin;

      if (Math.abs(ev.offsetX - x) < 10) {
        draggingType = 'start';
      } else if (Math.abs(ev.offsetX - x2) < 10) {
        draggingType = 'end';
      }
    } else if (graph.selection?.type === 'value') {
      const m = getGraphMetrics(model, graph);
      if (ev.offsetY >= m.graphHeight + 10)
      draggingType = 'time';
    }

    graph.selection.dragging = draggingType;

    if (draggingType) {
      document.addEventListener('mousemove', _mouseMove, { passive: true });
      document.addEventListener('mouseup', _mouseUp);
      update();
    }
  };

  const _insertHook = function (vnode) {
    model.elm = vnode.elm;
    graph.ctx = vnode.elm.getContext('2d');
  };

  if (graph.ctx) {
    graph.ctx.clearRect(0, 0, model.elm.width, model.elm.height);
    verticalGridLinesMinor(model, graph);
    verticalGridLinesMajor(model, graph);
    gridLines(model, graph);


    // draw the bottom line of the graph
    graph.ctx.beginPath();
    graph.ctx.strokeStyle = '#888';
    graph.ctx.lineWidth = 1;
    graph.ctx.moveTo(m.leftMargin + 0.5, m.graphHeight - 0.5);
    graph.ctx.lineTo(m.leftMargin + m.graphWidth + 0.5, m.graphHeight - 0.5);
    graph.ctx.stroke();


    if (graph.renderTicks) {
      tickMarksComponent(model, graph);
      tickLabelsComponent(model, graph);
    }

    graph.ctx.strokeStyle = graph.dataColor;
    if (graph.type === 'scatterPlot')
    renderScatterPlotGraph(model, graph, dotWidth);else

    renderLinePlotGraph(model, graph, dotWidth);
    timeSelectionComponent(model, graph);
    renderLabelComponent(model, graph);
  }

  if (!graph.key)
  graph.key = 'u' + Math.floor(Math.random() * 9999999);

  return index`<canvas width="${model.width}"
                        height="${graph.height}"
                        @hook:insert=${_insertHook}
                        @key=${graph.key}
                        style="height: ${graph.height}px; width: 100%; padding-top: 10px; background-color: white; image-rendering: pixelated"
                        @style:cursor=${graph.selection.dragging ? 'ew-resize' : 'inherit'}
                        @on:mousedown=${_mouseDown}></canvas>`;
}


function renderLabelComponent(model, graph, update) {
  const { ctx } = graph;
  const m = getGraphMetrics(model, graph);
  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';

  if (graph.renderValueLabel && graph.selection.type === 'value') {
    ctx.textAlign = 'start';
    ctx.fillText(`t: ${graph.selection.time.toFixed(1)}s`, 2, m.graphHeight + m.bottomMargin - 8);
  }

  ctx.textAlign = 'end';
  ctx.fillText(graph.label, m.graphWidth + m.leftMargin - DOT_WIDTH, 12);
}


function tickMarksComponent(model, graph, update) {

  const m = getGraphMetrics(model, graph);

  const { ctx } = graph;

  const constPixelsPerTick = 6;

  ctx.lineWidth = 1;
  ctx.strokeStyle = '#888';

  ctx.beginPath();

  for (let i = 0; i < m.graphWidth; i += constPixelsPerTick) {
    const tickHeight = i % 60 === 0 ? 8 : 4;
    const x = m.leftMargin + i + 0.5;
    ctx.moveTo(x, m.graphHeight);
    ctx.lineTo(x, m.graphHeight + tickHeight);
  }

  ctx.stroke();
}


function tickLabelsComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);

  const timePeriod = graph.timeRange.end - graph.timeRange.start;

  const { ctx } = graph;

  const constPixelsPerTick = 6;

  ctx.font = '10px monospace';
  ctx.textAlign = 'center';
  //ctx.fillStyle = '#888'
  ctx.strokeStyle = '#888';
  //ctx.strokeWidth = 1

  const tickCount = m.graphWidth / constPixelsPerTick;
  const secondsPerTick = timePeriod / tickCount;
  let lastSecond;

  // every 10 ticks, draw the seconds
  for (let i = 0; i < m.graphWidth; i += 60) {
    const tickIdx = i / constPixelsPerTick;
    const seconds = (graph.timeRange.start + tickIdx * secondsPerTick).toFixed(1);
    if (lastSecond !== seconds) {
      lastSecond = seconds;
      ctx.strokeText(seconds, m.leftMargin + i, m.graphHeight + 19);
    }
  }
}


function timeSelectionComponent(model, graph, update) {
  if (graph.selection.type === 'range')
  timeRangeSelectionComponent(model, graph);

  if (graph.selection.type === 'value')
  timeValueSelectionComponent(model, graph);
}


function timeRangeSelectionComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);

  const { ctx } = graph;

  // draw left and right greyed out graph areas (unselected regions)
  ctx.fillStyle = 'rgba(205,205,205, 0.85)';
  ctx.fillRect(m.leftMargin,
  0,
  startX * m.graphWidth,
  m.graphHeight);


  ctx.fillRect(m.leftMargin + endX * m.graphWidth,
  0,
  m.graphWidth - m.graphWidth * endX,
  m.graphHeight);

  const downHandlePath = [
  [-5, -4],
  [0, -8],
  [10, 0],
  [0, 8]];


  // left drag handle
  renderDragHandle(ctx, m.leftMargin + startX * m.graphWidth, 12, downHandlePath);

  // right drag handle
  renderDragHandle(ctx, m.leftMargin + endX * m.graphWidth, 12, downHandlePath);

  ctx.strokeStyle = 'rgb(255,64,129)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  // left drag line
  ctx.moveTo(m.leftMargin + startX * m.graphWidth - 0.5, 11);
  ctx.lineTo(m.leftMargin + startX * m.graphWidth - 0.5, m.graphHeight + 1);

  // right drag line
  ctx.moveTo(m.leftMargin + endX * m.graphWidth - 0.5, 11);
  ctx.lineTo(m.leftMargin + endX * m.graphWidth - 0.5, m.graphHeight + 1);

  ctx.stroke();
}


function renderDragHandle(ctx, startX, startY, path) {
  const region = new Path2D();

  const currentPoint = [startX, startY];
  region.moveTo(currentPoint[0], currentPoint[1]);

  for (const p of path) {
    currentPoint[0] += p[0];
    currentPoint[1] += p[1];
    region.lineTo(currentPoint[0], currentPoint[1]);
  }

  region.closePath();
  ctx.fillStyle = 'rgba(255,64,129)';
  ctx.fill(region);
}


function timeValueSelectionComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);

  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.time);

  const x = startX * m.graphWidth + m.leftMargin;
  const y = m.graphHeight;

  const { ctx } = graph;

  const upHandlePath = [
  [5, 4],
  [0, 8],
  [-10, 0],
  [0, -8]];


  renderDragHandle(ctx, x, y - 1, upHandlePath);

  ctx.strokeStyle = 'rgb(255,64,129)';
  ctx.lineWidth = 1;
  ctx.beginPath();

  // drag line
  ctx.moveTo(x - 0.5, 0);
  ctx.lineTo(x - 0.5, m.graphHeight);
  ctx.stroke();
}


function timelineComponent(model, update) {
  const _insertHook = function (vnode) {
    model.container = vnode;
  };

  if (model.container)
  model.width = model.container.elm ? model.container.elm.offsetWidth : model.container.offsetWidth;

  return index`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: 1px solid #adafaf;">
            ${model.graphs.map(g => graphComponent(model, g, update))}
        </div>`;
}

function vnode$1(sel, data, children, text, elm) {
  const key = data === undefined ? undefined : data.key;
  return { sel, data, children, text, elm, key };
}

const array$1 = Array.isArray;
function primitive$1(s) {
  return typeof s === 'string' || typeof s === 'number';
}

function addNS$1(data, children, sel) {
  data.ns = 'http://www.w3.org/2000/svg';
  if (sel !== 'foreignObject' && children !== undefined) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== undefined) {
        addNS$1(childData, children[i].children, children[i].sel);
      }
    }
  }
}
function h$1(sel, b, c) {
  var data = {};
  var children;
  var text;
  var i;
  if (c !== undefined) {
    if (b !== null) {
      data = b;
    }
    if (array$1(c)) {
      children = c;
    } else
    if (primitive$1(c)) {
      text = c;
    } else
    if (c && c.sel) {
      children = [c];
    }
  } else
  if (b !== undefined && b !== null) {
    if (array$1(b)) {
      children = b;
    } else
    if (primitive$1(b)) {
      text = b;
    } else
    if (b && b.sel) {
      children = [b];
    } else
    {
      data = b;
    }
  }
  if (children !== undefined) {
    for (i = 0; i < children.length; ++i) {
      if (primitive$1(children[i]))
      children[i] = vnode$1(undefined, undefined, undefined, children[i], undefined);
    }
  }
  if (sel[0] === 's' && sel[1] === 'v' && sel[2] === 'g' && (
  sel.length === 3 || sel[3] === '.' || sel[3] === '#')) {
    addNS$1(data, children, sel);
  }
  return vnode$1(sel, data, children, text, undefined);
}

const FPS$1 = 60;


function getTimePeriodData$1(graph) {
  return graph.data.filter(dataPoint => {
    // if data is outside of the time range skip it
    if (dataPoint.t < graph.timeRange.start)
    return false;

    if (dataPoint.t > graph.timeRange.end)
    return false;

    return true;
  });
}


function getGraphMetrics$1(model, graph) {
  let leftMargin = 10;
  const rightMargin = 10;
  let bottomMargin = graph.renderTicks ? 20 : 0;

  if (graph.renderValueLabel && graph.selection.type === 'value')
  bottomMargin += 30;

  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model.width - leftMargin - rightMargin;

  return {
    leftMargin, rightMargin, bottomMargin, graphHeight, graphWidth };

}


function verticalGridLinesMinor$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return index``;

  const m = getGraphMetrics$1(model, graph);

  const gridLines = [];
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
    const x = m.leftMargin + i;
    //gridLines.push(html`<line x1="${x}" x2="${x}" y1="0" y2="${m.graphHeight}"/>`)
    gridLines.push(h$1('line', { attrs: { x1: x, x2: x, y1: 0, y2: m.graphHeight } }));
  }

  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return index`<g class="grid-minor" style="stroke: ${graph.gridLines.vertical.minorColor}; stroke-width: ${strokeWidth}">${gridLines}</g>`;
}


function verticalGridLinesMajor$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return index``;

  const m = getGraphMetrics$1(model, graph);

  const gridLines = [];
  const pixelsPerTick = 6;
  const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
    const x = m.leftMargin + i;
    //gridLines.push(html`<line x1="${x}" x2="${x}" y1="0" y2="${m.graphHeight}"/>`)
    gridLines.push(h$1('line', { attrs: { x1: x, x2: x, y1: 0, y2: m.graphHeight } }));
  }

  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return index`<g class="grid-major" style="stroke: ${graph.gridLines.vertical.majorColor}; stroke-width: ${strokeWidth}">${gridLines}</g>`;
}


function gridLines$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.horizontal)
  return index``;

  const m = getGraphMetrics$1(model, graph);

  const gridLines = [];
  const distanceBetweenLines = m.graphHeight / (graph.gridLines.horizontal.lineCount + 1);
  for (let y = distanceBetweenLines; y < m.graphHeight; y += distanceBetweenLines) {
    gridLines.push(index`<line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${y}" y2="${y}"/>`);
  }

  const strokeWidth = 1 / (window.devicePixelRatio || 1);

  return index`<g class="grid-horiz"
                   style="stroke: ${graph.gridLines.horizontal.color}; stroke-width: ${strokeWidth}"
                   stroke-dasharray="4 2">${gridLines}</g>`;
}


function renderLinePlotGraph$1(model, graph, dotWidth) {
  const tp = getTimePeriodData$1(graph);
  const m = getGraphMetrics$1(model, graph);

  const lines = [];
  let lastX, lastY;

  let pathString = '';

  for (let i = 0; i < tp.length; i++) {
    const point = tp[i];

    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);

    if (i > 0) {
      lines.push(h$1('line', { attrs: { x1: lastX, y1: lastY, x2: x, y2: y } }));
      pathString += `L ${x} ${y}`;
    } else {
      pathString = `M ${x} ${m.graphHeight}  L ${x} ${y}`;
    }

    lastX = x;
    lastY = y;
  }

  if (graph.linePlotAreaColor && tp.length) {
    pathString += ` L ${lastX} ${m.graphHeight} Z`;
    lines.unshift(h$1('path', { attrs: { d: pathString, fill: graph.linePlotAreaColor, stroke: 'transparent' } }));
  }

  return lines;
}


function renderScatterPlotGraph$1(model, graph, dotWidth) {
  const tp = getTimePeriodData$1(graph);
  const m = getGraphMetrics$1(model, graph);

  return tp.map(point => {
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);

    return h$1('rect', {
      attrs: {
        x,
        y,
        'data-value': point.value,
        width: dotWidth,
        height: dotWidth } });


  });
}


function graphComponent$1(model, graph, update) {

  const dotWidth = 4;
  const m = getGraphMetrics$1(model, graph);

  const _stopDragging = function () {
    graph.selection.dragging = undefined;
    update();
  };

  const _insertHook = function (vnode) {
    model.elm = vnode.elm;
  };

  return index`
        <svg xmlns="http://www.w3.org/2000/svg"
             class="graph"
             aria-labelledby="title"
             role="img"
             viewBox="0 0 ${model.width} ${graph.height}"
             style="height: ${graph.height}px; width: 100%; padding-top: 10px; background-color: white; font-size: 10px; text-anchor: middle; -moz-user-select: none; -webkit-user-select: none; user-select: none; -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none;"
             @on:mouseup=${_stopDragging}
             @hook:insert=${_insertHook}>
            <title id="title">${graph.title}</title>

            ${verticalGridLinesMinor$1(model, graph)}
            ${verticalGridLinesMajor$1(model, graph)}
            ${gridLines$1(model, graph)}

            <g style="stroke: #888; stroke-dasharray: 0; stroke-width: 1;">
                <line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${m.graphHeight}" y2="${m.graphHeight}" />
                ${tickMarksComponent$1(model, graph)}
                ${tickLabelsComponent$1(model, graph)}
            </g>

            <g class="data"
               style="fill: ${graph.dataColor}; stroke: ${graph.dataColor}; stroke-width: 1;">
               ${graph.type === 'scatterPlot' ? renderScatterPlotGraph$1(model, graph, dotWidth) : renderLinePlotGraph$1(model, graph, dotWidth)}
            </g>

            ${timeSelectionComponent$1(model, graph, update)}

            <text x="${m.graphWidth + m.leftMargin - dotWidth}" y="12" style="fill: rgba(0, 0, 0, 0.7); text-anchor: end; pointer-events: none;">${graph.label}</text>
            ${renderLabelComponent$1(model, graph)}
        </svg>`;
}


function renderLabelComponent$1(model, graph, update) {
  if (graph.renderValueLabel && graph.selection.type === 'value') {
    const m = getGraphMetrics$1(model, graph);
    return index`<text x="2" y="${m.graphHeight + m.bottomMargin - 8}" style="fill: rgba(0, 0, 0, 0.7); text-anchor: start; pointer-events: none;">t: ${graph.selection.time.toFixed(1)}s</text>`;
  }

  return index``;
}


function tickMarksComponent$1(model, graph, update) {
  const m = getGraphMetrics$1(model, graph);

  const tickMarks = [];

  const constPixelsPerTick = 6;

  if (graph.renderTicks) {
    for (let i = 0; i < m.graphWidth; i += constPixelsPerTick) {
      const tickHeight = i % 60 === 0 ? 8 : 4;
      const x = m.leftMargin + i;
      tickMarks.push(
      h$1('line', { attrs: { x1: x, x2: x, y1: m.graphHeight, y2: m.graphHeight + tickHeight } }));

    }
  }

  return tickMarks;
}


function tickLabelsComponent$1(model, graph, update) {
  const m = getGraphMetrics$1(model, graph);

  const timePeriod = graph.timeRange.end - graph.timeRange.start;

  const tickLabels = [];
  const constPixelsPerTick = 6;

  if (graph.renderTicks) {
    const tickCount = m.graphWidth / constPixelsPerTick;
    const secondsPerTick = timePeriod / tickCount;
    let lastSecond;

    // every 10 ticks, draw the seconds
    for (let i = 0; i < m.graphWidth; i += 60) {
      const tickIdx = i / constPixelsPerTick;
      const seconds = (graph.timeRange.start + tickIdx * secondsPerTick).toFixed(1);
      if (lastSecond !== seconds) {
        tickLabels.push({ x: m.leftMargin + i, seconds });
        lastSecond = seconds;
      }
    }
  }

  return tickLabels.map(tick => {
    return index`<text x="${tick.x}" y="${m.graphHeight + 19}">${tick.seconds}</text>`;
  });
}


function timeSelectionComponent$1(model, graph, update) {
  if (graph.selection.type === 'range')
  return timeRangeSelectionComponent$1(model, graph, update);

  if (graph.selection.type === 'value')
  return timeValueSelectionComponent$1(model, graph, update);

  return index``;
}


function timeRangeSelectionComponent$1(model, graph, update) {
  const m = getGraphMetrics$1(model, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);

  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth); //x position within the element.

    if (graph.selection.dragging === 'start') {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);

      // prevent dragging the start control beyond end
      if (graph.selection.start > graph.selection.end)
      graph.selection.start = graph.selection.end;

    } else if (graph.selection.dragging === 'end') {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);

      // prevent dragging the end control beyond start
      if (graph.selection.end < graph.selection.start)
      graph.selection.end = graph.selection.start;
    }

    update();
  }, 1000 / FPS$1);

  const _mouseUp = function () {
    graph.selection.dragging = undefined;
    document.removeEventListener('mouseup', _mouseUp);
    document.removeEventListener('mousemove', _mouseMove);
    update();
  };

  // @param String position  start | end
  const _mouseDown = function (position) {
    graph.selection.dragging = position;
    document.addEventListener('mousemove', _mouseMove, { passive: true });
    document.addEventListener('mouseup', _mouseUp);
    update();
  };

  return index`
        <g class="time-selection">

            <rect x="${m.leftMargin}" y="0" width="${startX * m.graphWidth}" height="${m.graphHeight}"
                    @on:mousedown=${() => _mouseDown('start')}
                    style="fill: rgba(205,205,205, 0.85);"/>

            <path d="M ${m.leftMargin + startX * m.graphWidth} 12 l -5 -4 l 0 -8    l 10 0  l 0 8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  @on:mousedown=${() => _mouseDown('start')}/>

            <line x1="${m.leftMargin + startX * m.graphWidth}"
                  x2="${m.leftMargin + startX * m.graphWidth}"
                  y1="11"
                  y2="${m.graphHeight + 1}" stroke="rgb(255,64,129)"/>


            <rect x="${m.leftMargin + endX * m.graphWidth}" y="0" width="${m.graphWidth - m.graphWidth * endX}" height="${m.graphHeight}"
                    @on:mousedown=${() => _mouseDown('end')}
                    style="fill: rgba(205,205,205, 0.85);"/>

            <path d="M ${m.leftMargin + endX * m.graphWidth} 12 l -5 -4 l 0 -8    l 10 0  l 0 8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  @on:mousedown=${() => _mouseDown('end')}/>

            <line x1="${m.leftMargin + endX * m.graphWidth}"
                  x2="${m.leftMargin + endX * m.graphWidth}"
                  y1="11"
                  y2="${m.graphHeight + 1}" stroke="rgb(255,64,129)"/>
        </g>`;
}


function timeValueSelectionComponent$1(model, graph, update) {

  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth); //x position within the element.

    const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
    graph.selection.time = lerp(graph.timeRange.start, graph.timeRange.end, pos);
    update();
  }, 1000 / 60);

  const _mouseUp = function () {
    graph.selection.dragging = undefined;
    document.removeEventListener('mouseup', _mouseUp);
    document.removeEventListener('mousemove', _mouseMove);
    update();
  };

  const _mouseDown = function (position) {
    graph.selection.dragging = true;
    document.addEventListener('mousemove', _mouseMove, { passive: true });
    document.addEventListener('mouseup', _mouseUp);
    update();
  };

  const m = getGraphMetrics$1(model, graph);

  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.time);

  const x = startX * m.graphWidth + m.leftMargin;
  const y = m.graphHeight;

  return index`
        <g class="time-selection" @on:mousedown=${_mouseDown}>
            <line x1="${x}"
                  x2="${x}"
                  y1="0"
                  y2="${m.graphHeight}" stroke="deeppink"/>

            <path d="M ${x} ${y - 1} l 5 4 l 0 8    l -10 0  l 0 -8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  />
        </g>`;
}


function timelineComponent$1(model, update) {
  const _insertHook = function (vnode) {
    model.container = vnode;
  };

  if (model.container)
  model.width = model.container.elm ? model.container.elm.offsetWidth : model.container.offsetWidth;

  return index`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: 1px solid #adafaf;">
            ${model.graphs.map(g => graphComponent$1(model, g, update))}
        </div>`;
}

function timelineComponent$2(model, update) {
  return model.renderer === 'canvas' ? timelineComponent(model, update) : timelineComponent$1(model, update);
}

let currentVnode = document.querySelector('main');

const model = {
    startTime: Date.now(),
    maxSampleCount: 1000,

    mainWidth: 0,

    entityCount: {
        instanceCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Entity Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    },

    componentCount: {
        totalUniqueComponentTypes: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Components Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    },

    components: { } // key is component id/name, value is the timeline for each component
};


const backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});


function createComponentTimeline (componentId) {
    return {
        instanceCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            renderer: 'canvas',
            graphs: [
                {
                    title: 'Component Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
                    linePlotAreaColor: 'rgba(41, 147, 251, 0.3)', // color to fill area if in linePlot mode
                    timeRange: {
                        start: 0,  // seconds
                        end: 0     // seconds
                    },
                    yRange: {
                        start: 0,
                        end: 100
                    },

                    // optional: render a selection control
                    selection: {
                        type: 'none',
                        start: 0,       // seconds | 0
                        end: Infinity,  // seconds | Infinity
                        dragging: false
                    },

                    height: 40,              // pixels
                    dataColor: 'dodgerblue', // color of data points on the graph
                    renderTicks: false,
                    renderValueLabel: false,

                    // the data points to render
                    data: [ ],

                    // optional: settings for grid background lines
                    gridLines: { }
                }
            ]
        }
    }
}


backgroundPageConnection.onMessage.addListener(function (message) {
    // worldCreated || refreshData || disabled
    if (message.method === 'worldCreated' || message.method === 'tab-complete') {
        // reset the model

        model.entityCount.instanceCount = 0;
        model.entityCount.maxValue = 100;
        model.entityCount.timeline.graphs[0].data.length = 0;

        model.componentCount.totalUniqueComponentTypes = 0;
        model.componentCount.maxValue = 100;
        model.componentCount.timeline.graphs[0].data.length = 0;
        model.componentCount.timeline.graphs[0].label = '';

        model.components = { };

    } else if (message.method === 'refreshData') {
        const stats = message.data;
        const t = (Date.now() - model.startTime) / 1000;

        model.entityCount.maxValue = Math.max(model.entityCount.maxValue, stats.entityCount);
        model.entityCount.instanceCount = stats.entityCount;

        model.entityCount.timeline.graphs[0].data.push({ t, value: stats.entityCount });
        model.entityCount.timeline.graphs[0].yRange.end = Math.round(model.entityCount.maxValue * 1.1);


        model.componentCount.totalUniqueComponentTypes = Object.keys(stats.componentCount).length;
        let totalCount = 0;
        for (const componentId in stats.componentCount) {
            const componentCount = stats.componentCount[componentId];

            totalCount += componentCount;

            if (!model.components[componentId])
                model.components[componentId] = createComponentTimeline();

            const ct = model.components[componentId];

            ct.maxValue = Math.max(ct.maxValue, componentCount + 10);
            ct.instanceCount = componentCount;
            ct.timeline.graphs[0].data.push({ t, value: componentCount });
            ct.timeline.graphs[0].yRange.end = Math.round(ct.maxValue * 1.1);

            ct.timeline.graphs[0].label = componentCount;

            // limit the number of samples in the graph
            if (ct.timeline.graphs[0].data.length > model.maxSampleCount) {
                ct.timeline.graphs[0].data.shift();
                ct.timeline.graphs[0].timeRange.start = ct.timeline.graphs[0].data[0].t;
            }

            ct.timeline.graphs[0].timeRange.end = t;
        }

        model.componentCount.timeline.graphs[0].data.push({ t, value: totalCount });
        model.componentCount.timeline.graphs[0].label = totalCount;
        model.componentCount.maxValue = Math.max(model.componentCount.maxValue, totalCount);
        model.componentCount.timeline.graphs[0].yRange.end = Math.round(model.componentCount.maxValue * 1.1);


        // limit the number of samples in the graph
        if (model.entityCount.timeline.graphs[0].data.length > model.maxSampleCount) {
            model.entityCount.timeline.graphs[0].data.shift();
            model.entityCount.timeline.graphs[0].timeRange.start = model.entityCount.timeline.graphs[0].data[0].t;
            // TODO: re-calculate entity graph max value

            model.componentCount.timeline.graphs[0].data.shift();
            model.componentCount.timeline.graphs[0].timeRange.start = model.componentCount.timeline.graphs[0].data[0].t;
            // TODO: re-calculate component graph max value
        }

        model.entityCount.timeline.graphs[0].timeRange.end = t;
        model.componentCount.timeline.graphs[0].timeRange.end = t;
    }

    update();
});


function update () {
    const newVnode = render(model, update);
    currentVnode = index.update(currentVnode, newVnode);
}


function renderEntityGraph (timelineModel, update) {
    const c = timelineComponent$2(timelineModel, update);
    timelineModel.container = c;
    return c
}


function renderComponentGraphs(components, update) {
    return Object.keys(components).map((componentId) => {
        const c = components[componentId];
        return index`<div class="component-graph-row">
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-right: 6px;">${componentId}</div>${renderEntityGraph(c.timeline, update)}
        </div>`
    })
}


function render (model, update) {

    const _insertHook = function (vnode) {
        const main = vnode.elm.parentNode;

        const waitMs = 200;
        const resizeHandler = lodash_debounce(function () {
            model.mainWidth = main.offsetWidth;
            update();
        }, waitMs);

        const ro = new ResizeObserver(resizeHandler);
        ro.observe(main);
    };

    let resp = '';
    if (model.mainWidth > 1024)
        resp = 'col3';
    else if (model.mainWidth > 640)
        resp = 'col2';

    return index`<main class="${resp}">
        <div class="entities" key="entities" @hook:insert=${_insertHook}>
            <h2>Entities (${model.entityCount.instanceCount})</h2>
            ${renderEntityGraph(model.entityCount.timeline, update)}
        </div>

        <div class="components">
            <h2>Components (${model.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model.componentCount.timeline, update)}
            ${renderComponentGraphs(model.components, update)}
        </div>

        <div class="queries"></div>

        <div class="systems"></div>

    </main>`
}
