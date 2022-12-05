// http-url:https://cdn.skypack.dev/-/lodash.debounce@v4.0.8-aOLIwnE2RethWPrEzTeR/dist=es2019,mode=imports/optimized/lodash.debounce.js
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var NAN = 0 / 0;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;

// http-url:https://cdn.skypack.dev/-/snabbdom@v3.5.1-U7M7e0cLInttZGG9Vg9a/dist=es2019,mode=imports/optimized/snabbdom.js
function createElement(tagName2, options) {
  return document.createElement(tagName2, options);
}
function createElementNS(namespaceURI, qualifiedName, options) {
  return document.createElementNS(namespaceURI, qualifiedName, options);
}
function createDocumentFragment() {
  return parseFragment(document.createDocumentFragment());
}
function createTextNode(text) {
  return document.createTextNode(text);
}
function createComment(text) {
  return document.createComment(text);
}
function insertBefore(parentNode2, newNode, referenceNode) {
  if (isDocumentFragment(parentNode2)) {
    let node = parentNode2;
    while (node && isDocumentFragment(node)) {
      const fragment2 = parseFragment(node);
      node = fragment2.parent;
    }
    parentNode2 = node !== null && node !== void 0 ? node : parentNode2;
  }
  if (isDocumentFragment(newNode)) {
    newNode = parseFragment(newNode, parentNode2);
  }
  if (referenceNode && isDocumentFragment(referenceNode)) {
    referenceNode = parseFragment(referenceNode).firstChildNode;
  }
  parentNode2.insertBefore(newNode, referenceNode);
}
function removeChild(node, child) {
  node.removeChild(child);
}
function appendChild(node, child) {
  if (isDocumentFragment(child)) {
    child = parseFragment(child, node);
  }
  node.appendChild(child);
}
function parentNode(node) {
  if (isDocumentFragment(node)) {
    while (node && isDocumentFragment(node)) {
      const fragment2 = parseFragment(node);
      node = fragment2.parent;
    }
    return node !== null && node !== void 0 ? node : null;
  }
  return node.parentNode;
}
function nextSibling(node) {
  var _a;
  if (isDocumentFragment(node)) {
    const fragment2 = parseFragment(node);
    const parent = parentNode(fragment2);
    if (parent && fragment2.lastChildNode) {
      const children = Array.from(parent.childNodes);
      const index2 = children.indexOf(fragment2.lastChildNode);
      return (_a = children[index2 + 1]) !== null && _a !== void 0 ? _a : null;
    }
    return null;
  }
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
function isDocumentFragment(node) {
  return node.nodeType === 11;
}
function parseFragment(fragmentNode, parentNode2) {
  var _a, _b, _c;
  const fragment2 = fragmentNode;
  (_a = fragment2.parent) !== null && _a !== void 0 ? _a : fragment2.parent = parentNode2 !== null && parentNode2 !== void 0 ? parentNode2 : null;
  (_b = fragment2.firstChildNode) !== null && _b !== void 0 ? _b : fragment2.firstChildNode = fragmentNode.firstChild;
  (_c = fragment2.lastChildNode) !== null && _c !== void 0 ? _c : fragment2.lastChildNode = fragmentNode.lastChild;
  return fragment2;
}
var htmlDomApi = {
  createElement,
  createElementNS,
  createTextNode,
  createDocumentFragment,
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
  isComment,
  isDocumentFragment
};
function vnode(sel, data, children, text, elm) {
  const key = data === void 0 ? void 0 : data.key;
  return { sel, data, children, text, elm, key };
}
var array = Array.isArray;
function primitive(s) {
  return typeof s === "string" || typeof s === "number" || s instanceof String || s instanceof Number;
}
function isUndef(s) {
  return s === void 0;
}
function isDef(s) {
  return s !== void 0;
}
var emptyNode = vnode("", {}, [], void 0, void 0);
function sameVnode(vnode1, vnode22) {
  var _a, _b;
  const isSameKey = vnode1.key === vnode22.key;
  const isSameIs = ((_a = vnode1.data) === null || _a === void 0 ? void 0 : _a.is) === ((_b = vnode22.data) === null || _b === void 0 ? void 0 : _b.is);
  const isSameSel = vnode1.sel === vnode22.sel;
  const isSameTextOrFragment = !vnode1.sel && vnode1.sel === vnode22.sel ? typeof vnode1.text === typeof vnode22.text : true;
  return isSameSel && isSameKey && isSameIs && isSameTextOrFragment;
}
function documentFragmentIsNotSupported() {
  throw new Error("The document fragment is not supported on this platform.");
}
function isElement$1(api, vnode22) {
  return api.isElement(vnode22);
}
function isDocumentFragment$1(api, vnode22) {
  return api.isDocumentFragment(vnode22);
}
function createKeyToOldIdx(children, beginIdx, endIdx) {
  var _a;
  const map = {};
  for (let i = beginIdx; i <= endIdx; ++i) {
    const key = (_a = children[i]) === null || _a === void 0 ? void 0 : _a.key;
    if (key !== void 0) {
      map[key] = i;
    }
  }
  return map;
}
var hooks = [
  "create",
  "update",
  "remove",
  "destroy",
  "pre",
  "post"
];
function init(modules, domApi, options) {
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: []
  };
  const api = domApi !== void 0 ? domApi : htmlDomApi;
  for (const hook of hooks) {
    for (const module of modules) {
      const currentHook = module[hook];
      if (currentHook !== void 0) {
        cbs[hook].push(currentHook);
      }
    }
  }
  function emptyNodeAt(elm) {
    const id = elm.id ? "#" + elm.id : "";
    const classes = elm.getAttribute("class");
    const c = classes ? "." + classes.split(" ").join(".") : "";
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
  }
  function emptyDocumentFragmentAt(frag) {
    return vnode(void 0, {}, [], void 0, frag);
  }
  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }
  function createElm(vnode22, insertedVnodeQueue) {
    var _a, _b, _c, _d;
    let i;
    let data = vnode22.data;
    if (data !== void 0) {
      const init2 = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
      if (isDef(init2)) {
        init2(vnode22);
        data = vnode22.data;
      }
    }
    const children = vnode22.children;
    const sel = vnode22.sel;
    if (sel === "!") {
      if (isUndef(vnode22.text)) {
        vnode22.text = "";
      }
      vnode22.elm = api.createComment(vnode22.text);
    } else if (sel !== void 0) {
      const hashIdx = sel.indexOf("#");
      const dotIdx = sel.indexOf(".", hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode22.elm = isDef(data) && isDef(i = data.ns) ? api.createElementNS(i, tag, data) : api.createElement(tag, data);
      if (hash < dot)
        elm.setAttribute("id", sel.slice(hash + 1, dot));
      if (dotIdx > 0)
        elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
      for (i = 0; i < cbs.create.length; ++i)
        cbs.create[i](emptyNode, vnode22);
      if (array(children)) {
        for (i = 0; i < children.length; ++i) {
          const ch = children[i];
          if (ch != null) {
            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
          }
        }
      } else if (primitive(vnode22.text)) {
        api.appendChild(elm, api.createTextNode(vnode22.text));
      }
      const hook = vnode22.data.hook;
      if (isDef(hook)) {
        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode22);
        if (hook.insert) {
          insertedVnodeQueue.push(vnode22);
        }
      }
    } else if (((_c = options === null || options === void 0 ? void 0 : options.experimental) === null || _c === void 0 ? void 0 : _c.fragments) && vnode22.children) {
      vnode22.elm = ((_d = api.createDocumentFragment) !== null && _d !== void 0 ? _d : documentFragmentIsNotSupported)();
      for (i = 0; i < cbs.create.length; ++i)
        cbs.create[i](emptyNode, vnode22);
      for (i = 0; i < vnode22.children.length; ++i) {
        const ch = vnode22.children[i];
        if (ch != null) {
          api.appendChild(vnode22.elm, createElm(ch, insertedVnodeQueue));
        }
      }
    } else {
      vnode22.elm = api.createTextNode(vnode22.text);
    }
    return vnode22.elm;
  }
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }
  function invokeDestroyHook(vnode22) {
    var _a, _b;
    const data = vnode22.data;
    if (data !== void 0) {
      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode22);
      for (let i = 0; i < cbs.destroy.length; ++i)
        cbs.destroy[i](vnode22);
      if (vnode22.children !== void 0) {
        for (let j2 = 0; j2 < vnode22.children.length; ++j2) {
          const child = vnode22.children[j2];
          if (child != null && typeof child !== "string") {
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
          } else {
            rm();
          }
        } else if (ch.children) {
          invokeDestroyHook(ch);
          removeVnodes(parentElm, ch.children, 0, ch.children.length - 1);
        } else {
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
        oldStartVnode = oldCh[++oldStartIdx];
      } else if (oldEndVnode == null) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (newStartVnode == null) {
        newStartVnode = newCh[++newStartIdx];
      } else if (newEndVnode == null) {
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === void 0) {
          oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef(idxInOld)) {
          api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
        } else {
          elmToMove = oldCh[idxInOld];
          if (elmToMove.sel !== newStartVnode.sel) {
            api.insertBefore(parentElm, createElm(newStartVnode, insertedVnodeQueue), oldStartVnode.elm);
          } else {
            patchVnode(elmToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = void 0;
            api.insertBefore(parentElm, elmToMove.elm, oldStartVnode.elm);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (newStartIdx <= newEndIdx) {
      before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    }
    if (oldStartIdx <= oldEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }
  function patchVnode(oldVnode, vnode22, insertedVnodeQueue) {
    var _a, _b, _c, _d, _e2, _f, _g, _h;
    const hook = (_a = vnode22.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode22);
    const elm = vnode22.elm = oldVnode.elm;
    if (oldVnode === vnode22)
      return;
    if (vnode22.data !== void 0 || isDef(vnode22.text) && vnode22.text !== oldVnode.text) {
      (_c = vnode22.data) !== null && _c !== void 0 ? _c : vnode22.data = {};
      (_d = oldVnode.data) !== null && _d !== void 0 ? _d : oldVnode.data = {};
      for (let i = 0; i < cbs.update.length; ++i)
        cbs.update[i](oldVnode, vnode22);
      (_g = (_f = (_e2 = vnode22.data) === null || _e2 === void 0 ? void 0 : _e2.hook) === null || _f === void 0 ? void 0 : _f.update) === null || _g === void 0 ? void 0 : _g.call(_f, oldVnode, vnode22);
    }
    const oldCh = oldVnode.children;
    const ch = vnode22.children;
    if (isUndef(vnode22.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch)
          updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text))
          api.setTextContent(elm, "");
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        api.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode22.text) {
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vnode22.text);
    }
    (_h = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _h === void 0 ? void 0 : _h.call(hook, oldVnode, vnode22);
  }
  return function patch(oldVnode, vnode22) {
    let i, elm, parent;
    const insertedVnodeQueue = [];
    for (i = 0; i < cbs.pre.length; ++i)
      cbs.pre[i]();
    if (isElement$1(api, oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    } else if (isDocumentFragment$1(api, oldVnode)) {
      oldVnode = emptyDocumentFragmentAt(oldVnode);
    }
    if (sameVnode(oldVnode, vnode22)) {
      patchVnode(oldVnode, vnode22, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode22, insertedVnodeQueue);
      if (parent !== null) {
        api.insertBefore(parent, vnode22.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    for (i = 0; i < insertedVnodeQueue.length; ++i) {
      insertedVnodeQueue[i].data.hook.insert(insertedVnodeQueue[i]);
    }
    for (i = 0; i < cbs.post.length; ++i)
      cbs.post[i]();
    return vnode22;
  };
}
function addNS(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== void 0) {
    for (let i = 0; i < children.length; ++i) {
      const child = children[i];
      if (typeof child === "string")
        continue;
      const childData = child.data;
      if (childData !== void 0) {
        addNS(childData, child.children, child.sel);
      }
    }
  }
}
function h(sel, b, c) {
  let data = {};
  let children;
  let text;
  let i;
  if (c !== void 0) {
    if (b !== null) {
      data = b;
    }
    if (array(c)) {
      children = c;
    } else if (primitive(c)) {
      text = c.toString();
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== void 0 && b !== null) {
    if (array(b)) {
      children = b;
    } else if (primitive(b)) {
      text = b.toString();
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (children !== void 0) {
    for (i = 0; i < children.length; ++i) {
      if (primitive(children[i]))
        children[i] = vnode(void 0, void 0, void 0, children[i], void 0);
    }
  }
  if (sel[0] === "s" && sel[1] === "v" && sel[2] === "g" && (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
    addNS(data, children, sel);
  }
  return vnode(sel, data, children, text, void 0);
}
function copyToThunk(vnode22, thunk3) {
  var _a;
  const ns = (_a = thunk3.data) === null || _a === void 0 ? void 0 : _a.ns;
  vnode22.data.fn = thunk3.data.fn;
  vnode22.data.args = thunk3.data.args;
  thunk3.data = vnode22.data;
  thunk3.children = vnode22.children;
  thunk3.text = vnode22.text;
  thunk3.elm = vnode22.elm;
  if (ns)
    addNS(thunk3.data, thunk3.children, thunk3.sel);
}
function init$1(thunk3) {
  const cur = thunk3.data;
  const vnode22 = cur.fn(...cur.args);
  copyToThunk(vnode22, thunk3);
}
function prepatch(oldVnode, thunk3) {
  let i;
  const old = oldVnode.data;
  const cur = thunk3.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn(...args), thunk3);
    return;
  }
  for (i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn(...args), thunk3);
      return;
    }
  }
  copyToThunk(oldVnode, thunk3);
}
var thunk = function thunk2(sel, key, fn, args) {
  if (args === void 0) {
    args = fn;
    fn = key;
    key = void 0;
  }
  return h(sel, {
    key,
    hook: { init: init$1, prepatch },
    fn,
    args
  });
};
var xlinkNS = "http://www.w3.org/1999/xlink";
var xmlNS = "http://www.w3.org/XML/1998/namespace";
var colonChar = 58;
var xChar = 120;
function updateAttrs(oldVnode, vnode22) {
  let key;
  const elm = vnode22.elm;
  let oldAttrs = oldVnode.data.attrs;
  let attrs = vnode22.data.attrs;
  if (!oldAttrs && !attrs)
    return;
  if (oldAttrs === attrs)
    return;
  oldAttrs = oldAttrs || {};
  attrs = attrs || {};
  for (key in attrs) {
    const cur = attrs[key];
    const old = oldAttrs[key];
    if (old !== cur) {
      if (cur === true) {
        elm.setAttribute(key, "");
      } else if (cur === false) {
        elm.removeAttribute(key);
      } else {
        if (key.charCodeAt(0) !== xChar) {
          elm.setAttribute(key, cur);
        } else if (key.charCodeAt(3) === colonChar) {
          elm.setAttributeNS(xmlNS, key, cur);
        } else if (key.charCodeAt(5) === colonChar) {
          elm.setAttributeNS(xlinkNS, key, cur);
        } else {
          elm.setAttribute(key, cur);
        }
      }
    }
  }
  for (key in oldAttrs) {
    if (!(key in attrs)) {
      elm.removeAttribute(key);
    }
  }
}
var attributesModule = {
  create: updateAttrs,
  update: updateAttrs
};
function updateClass(oldVnode, vnode22) {
  let cur;
  let name;
  const elm = vnode22.elm;
  let oldClass = oldVnode.data.class;
  let klass = vnode22.data.class;
  if (!oldClass && !klass)
    return;
  if (oldClass === klass)
    return;
  oldClass = oldClass || {};
  klass = klass || {};
  for (name in oldClass) {
    if (oldClass[name] && !Object.prototype.hasOwnProperty.call(klass, name)) {
      elm.classList.remove(name);
    }
  }
  for (name in klass) {
    cur = klass[name];
    if (cur !== oldClass[name]) {
      elm.classList[cur ? "add" : "remove"](name);
    }
  }
}
var classModule = { create: updateClass, update: updateClass };
function invokeHandler(handler, vnode22, event) {
  if (typeof handler === "function") {
    handler.call(vnode22, event, vnode22);
  } else if (typeof handler === "object") {
    for (let i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode22, event);
    }
  }
}
function handleEvent(event, vnode22) {
  const name = event.type;
  const on = vnode22.data.on;
  if (on && on[name]) {
    invokeHandler(on[name], vnode22, event);
  }
}
function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  };
}
function updateEventListeners(oldVnode, vnode22) {
  const oldOn = oldVnode.data.on;
  const oldListener = oldVnode.listener;
  const oldElm = oldVnode.elm;
  const on = vnode22 && vnode22.data.on;
  const elm = vnode22 && vnode22.elm;
  let name;
  if (oldOn === on) {
    return;
  }
  if (oldOn && oldListener) {
    if (!on) {
      for (name in oldOn) {
        oldElm.removeEventListener(name, oldListener, false);
      }
    } else {
      for (name in oldOn) {
        if (!on[name]) {
          oldElm.removeEventListener(name, oldListener, false);
        }
      }
    }
  }
  if (on) {
    const listener = vnode22.listener = oldVnode.listener || createListener();
    listener.vnode = vnode22;
    if (!oldOn) {
      for (name in on) {
        elm.addEventListener(name, listener, false);
      }
    } else {
      for (name in on) {
        if (!oldOn[name]) {
          elm.addEventListener(name, listener, false);
        }
      }
    }
  }
}
var eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners
};
function updateProps(oldVnode, vnode22) {
  let key;
  let cur;
  let old;
  const elm = vnode22.elm;
  let oldProps = oldVnode.data.props;
  let props = vnode22.data.props;
  if (!oldProps && !props)
    return;
  if (oldProps === props)
    return;
  oldProps = oldProps || {};
  props = props || {};
  for (key in props) {
    cur = props[key];
    old = oldProps[key];
    if (old !== cur && (key !== "value" || elm[key] !== cur)) {
      elm[key] = cur;
    }
  }
}
var propsModule = { create: updateProps, update: updateProps };
var raf = typeof window !== "undefined" && window.requestAnimationFrame.bind(window) || setTimeout;
var nextFrame = function(fn) {
  raf(function() {
    raf(fn);
  });
};
var reflowForced = false;
function setNextFrame(obj, prop, val) {
  nextFrame(function() {
    obj[prop] = val;
  });
}
function updateStyle(oldVnode, vnode22) {
  let cur;
  let name;
  const elm = vnode22.elm;
  let oldStyle = oldVnode.data.style;
  let style = vnode22.data.style;
  if (!oldStyle && !style)
    return;
  if (oldStyle === style)
    return;
  oldStyle = oldStyle || {};
  style = style || {};
  const oldHasDel = "delayed" in oldStyle;
  for (name in oldStyle) {
    if (!style[name]) {
      if (name[0] === "-" && name[1] === "-") {
        elm.style.removeProperty(name);
      } else {
        elm.style[name] = "";
      }
    }
  }
  for (name in style) {
    cur = style[name];
    if (name === "delayed" && style.delayed) {
      for (const name2 in style.delayed) {
        cur = style.delayed[name2];
        if (!oldHasDel || cur !== oldStyle.delayed[name2]) {
          setNextFrame(elm.style, name2, cur);
        }
      }
    } else if (name !== "remove" && cur !== oldStyle[name]) {
      if (name[0] === "-" && name[1] === "-") {
        elm.style.setProperty(name, cur);
      } else {
        elm.style[name] = cur;
      }
    }
  }
}
function applyDestroyStyle(vnode22) {
  let style;
  let name;
  const elm = vnode22.elm;
  const s = vnode22.data.style;
  if (!s || !(style = s.destroy))
    return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
function applyRemoveStyle(vnode22, rm) {
  const s = vnode22.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    vnode22.elm.offsetLeft;
    reflowForced = true;
  }
  let name;
  const elm = vnode22.elm;
  let i = 0;
  const style = s.remove;
  let amount = 0;
  const applied = [];
  for (name in style) {
    applied.push(name);
    elm.style[name] = style[name];
  }
  const compStyle = getComputedStyle(elm);
  const props = compStyle["transition-property"].split(", ");
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1)
      amount++;
  }
  elm.addEventListener("transitionend", function(ev) {
    if (ev.target === elm)
      --amount;
    if (amount === 0)
      rm();
  });
}
function forceReflow() {
  reflowForced = false;
}
var styleModule = {
  pre: forceReflow,
  create: updateStyle,
  update: updateStyle,
  destroy: applyDestroyStyle,
  remove: applyRemoveStyle
};
function flattenAndFilter(children, flattened) {
  for (const child of children) {
    if (child !== void 0 && child !== null && child !== false && child !== "") {
      if (Array.isArray(child)) {
        flattenAndFilter(child, flattened);
      } else if (typeof child === "string" || typeof child === "number" || typeof child === "boolean") {
        flattened.push(vnode(void 0, void 0, void 0, String(child), void 0));
      } else {
        flattened.push(child);
      }
    }
  }
  return flattened;
}
function jsx(tag, data, ...children) {
  const flatChildren = flattenAndFilter(children, []);
  if (typeof tag === "function") {
    return tag(data, flatChildren);
  } else {
    if (flatChildren.length === 1 && !flatChildren[0].sel && flatChildren[0].text) {
      return h(tag, data, flatChildren[0].text);
    } else {
      return h(tag, data, flatChildren);
    }
  }
}
(function(jsx2) {
})(jsx || (jsx = {}));

// http-url:https://cdn.skypack.dev/-/hyperscript-attribute-to-property@v1.0.2-NWrlL2sKlrAom7KZzowd/dist=es2019,mode=imports/optimized/hyperscript-attribute-to-property.js
var hyperscriptAttributeToProperty = attributeToProperty;
var transform = {
  class: "className",
  for: "htmlFor",
  "http-equiv": "httpEquiv"
};
function attributeToProperty(h3) {
  return function(tagName2, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h3(tagName2, attrs, children);
  };
}
var hyperscript_attribute_to_property_default = hyperscriptAttributeToProperty;

// http-url:https://cdn.skypack.dev/-/hyperx-tmp@v2.5.6-WJbLsN8c6eZ4aM9MqNo7/dist=es2019,mode=imports/optimized/hyperx-tmp.js
var VAR = 0;
var TEXT = 1;
var OPEN = 2;
var CLOSE = 3;
var ATTR = 4;
var ATTR_KEY = 5;
var ATTR_KEY_W = 6;
var ATTR_VALUE_W = 7;
var ATTR_VALUE = 8;
var ATTR_VALUE_SQ = 9;
var ATTR_VALUE_DQ = 10;
var ATTR_EQ = 11;
var ATTR_BREAK = 12;
var COMMENT = 13;
var hyperxTmp = function(h3, opts) {
  if (!opts)
    opts = {};
  var concat = opts.concat || function(a, b) {
    return String(a) + String(b);
  };
  if (opts.attrToProp !== false)
    h3 = hyperscript_attribute_to_property_default(h3);
  return function(strings) {
    var state = TEXT, reg = "", isSelfClosing = false;
    var arglen = arguments.length;
    var parts = [];
    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i + 1];
        var p = parse(strings[i]);
        var xstate = state;
        if (xstate === ATTR_VALUE_DQ)
          xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_SQ)
          xstate = ATTR_VALUE;
        if (xstate === ATTR_VALUE_W)
          xstate = ATTR_VALUE;
        if (xstate === ATTR)
          xstate = ATTR_KEY;
        if (xstate === OPEN) {
          if (reg === "/") {
            p.push([OPEN, "/", arg]);
            reg = "";
          } else {
            p.push([OPEN, arg]);
          }
        } else if (xstate === COMMENT && opts.comments) {
          reg += String(arg);
        } else if (xstate !== COMMENT) {
          p.push([VAR, xstate, arg]);
        }
        parts.push.apply(parts, p);
      } else {
        parts.push.apply(parts, parse(strings[i]));
      }
    }
    var tree = [null, {}, []];
    var stack = [[tree, -1]];
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length - 1][0];
      var p = parts[i], state = p[0];
      if (state === OPEN && /^\//.test(p[1])) {
        var ix = stack[stack.length - 1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h3(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (state === OPEN) {
        var c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (state === ATTR_KEY || state === VAR && p[1] === ATTR_KEY) {
        var key = "";
        var copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1]);
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === "object" && !key) {
              for (copyKey in parts[i][2])
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey])
                  cur[1][copyKey] = parts[i][2][copyKey];
            } else {
              key = concat(key, parts[i][2]);
            }
          } else {
            break;
          }
        }
        if (parts[i][0] === ATTR_EQ)
          i++;
        var j2 = i;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key])
              cur[1][key] = strfn(parts[i][1]);
            else
              parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key])
              cur[1][key] = strfn(parts[i][2]);
            else
              parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j2 && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
              cur[1][key] = key.toLowerCase();
            }
            if (parts[i][0] === CLOSE)
              i--;
            break;
          }
        }
      } else if (state === ATTR_KEY) {
        cur[1][p[1]] = true;
      } else if (state === VAR && p[1] === ATTR_KEY) {
        cur[1][p[2]] = true;
      } else if (state === CLOSE) {
        const isSelfClosing2 = p[1] || selfClosingVoid(cur[0]);
        if (isSelfClosing2 && stack.length) {
          var ix = stack[stack.length - 1][1];
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h3(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (state === VAR && p[1] === TEXT) {
        if (p[2] === void 0 || p[2] === null)
          p[2] = "";
        else if (!p[2])
          p[2] = concat("", p[2]);
        if (Array.isArray(p[2][0]))
          cur[2].push.apply(cur[2], p[2]);
        else
          cur[2].push(p[2]);
      } else if (state === TEXT) {
        cur[2].push(p[1]);
      } else if (state === ATTR_EQ || state === ATTR_BREAK)
        ;
      else {
        throw new Error("unhandled: " + state);
      }
    }
    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0]))
      tree[2].shift();
    if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
      if (opts.createFragment)
        return opts.createFragment(tree[2]);
      throw new Error("multiple root elements must be wrapped in an enclosing tag");
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2]))
      tree[2][0] = h3(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    return tree[2][0];
    function parse(str) {
      var res = [];
      var isInStyleTag = false;
      if (state === ATTR_VALUE_W)
        state = ATTR;
      for (var i2 = 0; i2 < str.length; i2++) {
        var c2 = str.charAt(i2);
        if (state === TEXT && c2 === "<") {
          if (reg.length)
            res.push([TEXT, reg]);
          reg = "";
          state = OPEN;
          isInStyleTag = false;
        } else if (c2 === ">" && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN, reg]);
            if (reg === "style")
              isInStyleTag = true;
            else if (reg === "/style")
              isInStyleTag = false;
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, reg]);
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE, reg]);
          }
          if (state === TEXT && isInStyleTag) {
            reg += c2;
          } else {
            res.push([CLOSE, isSelfClosing]);
            isSelfClosing = false;
            reg = "";
          }
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(reg) && c2 === "-") {
          if (opts.comments) {
            res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
          }
          reg = "";
          isSelfClosing = true;
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg], [ATTR_KEY, "comment"], [ATTR_EQ]);
          }
          reg = c2;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          reg += c2;
        } else if (state === OPEN && c2 === "/" && reg.length) {
          isSelfClosing = true;
        } else if (state === OPEN && /\s/.test(c2)) {
          if (reg.length)
            res.push([OPEN, reg]);
          if (reg === "style")
            isInStyleTag = true;
          else if (reg === "/style")
            isInStyleTag = false;
          reg = "";
          state = ATTR;
        } else if (state === OPEN) {
          reg += c2;
        } else if (state === ATTR && /[^\s"'=/]/.test(c2)) {
          state = ATTR_KEY;
          reg = c2;
        } else if (state === ATTR && /\s/.test(c2)) {
          if (reg.length)
            res.push([ATTR_KEY, reg]);
          res.push([ATTR_BREAK]);
        } else if (state === ATTR_KEY && /\s/.test(c2)) {
          res.push([ATTR_KEY, reg]);
          reg = "";
          state = ATTR_KEY_W;
        } else if (state === ATTR_KEY && c2 === "=") {
          res.push([ATTR_KEY, reg], [ATTR_EQ]);
          reg = "";
          state = ATTR_VALUE_W;
        } else if (state === ATTR_KEY && c2 === "/") {
          isSelfClosing = true;
          reg = "";
          state = ATTR;
        } else if (state === ATTR_KEY) {
          reg += c2;
        } else if ((state === ATTR_KEY_W || state === ATTR) && c2 === "=") {
          res.push([ATTR_EQ]);
          state = ATTR_VALUE_W;
        } else if ((state === ATTR_KEY_W || state === ATTR) && !/\s/.test(c2)) {
          res.push([ATTR_BREAK]);
          if (/[\w-]/.test(c2)) {
            reg += c2;
            state = ATTR_KEY;
          } else if (c2 === "/") {
            isSelfClosing = true;
          } else {
            state = ATTR;
          }
        } else if (state === ATTR_VALUE_W && c2 === '"') {
          state = ATTR_VALUE_DQ;
        } else if (state === ATTR_VALUE_W && c2 === "'") {
          state = ATTR_VALUE_SQ;
        } else if (state === ATTR_VALUE_DQ && c2 === '"') {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_SQ && c2 === "'") {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = "";
          state = ATTR;
        } else if (state === ATTR_VALUE_W && !/\s/.test(c2)) {
          state = ATTR_VALUE;
          i2--;
        } else if (state === ATTR_VALUE && /\s/.test(c2)) {
          res.push([ATTR_VALUE, reg], [ATTR_BREAK]);
          reg = "";
          state = ATTR;
        } else if (state === ATTR_VALUE || state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ) {
          reg += c2;
        }
      }
      if (state === TEXT && reg.length) {
        res.push([TEXT, reg]);
        reg = "";
      } else if (state === ATTR_VALUE && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = "";
      } else if (state === ATTR_VALUE_DQ && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = "";
      } else if (state === ATTR_VALUE_SQ && reg.length) {
        res.push([ATTR_VALUE, reg]);
        reg = "";
      } else if (state === ATTR_KEY) {
        res.push([ATTR_KEY, reg]);
        reg = "";
      }
      return res;
    }
  };
  function strfn(x2) {
    if (typeof x2 === "function")
      return x2;
    else if (typeof x2 === "string")
      return x2;
    else if (x2 && typeof x2 === "object")
      return x2;
    else if (x2 === null || x2 === void 0)
      return x2;
    else
      return concat("", x2);
  }
};
function quot(state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
}
var voidCloseRE = RegExp("^(" + [
  "area",
  "base",
  "br",
  "col",
  "command",
  "embed",
  "hr",
  "img",
  "input",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
function selfClosingVoid(tag) {
  return voidCloseRE.test(tag);
}
var hyperx_tmp_default = hyperxTmp;

// http-url:https://cdn.skypack.dev/-/snabby@v5.0.0-IfdiC3ZbHdp4mlzzhmHK/dist=es2019,mode=imports/optimized/snabby.js
function create(modules, options = {}) {
  const directive = options.directive || "@";
  function createElement2(sel, input, content) {
    if (sel === "!--")
      return h("!", input.comment);
    if (content && content.length) {
      if (content.length === 1)
        content = content[0];
      else
        content = [].concat.apply([], content);
    }
    const names = Object.keys(input);
    if (!names || !names.length)
      return h(sel, content);
    const data = {};
    for (let i = 0, max = names.length; max > i; i++) {
      const name = names[i];
      if (input[name] === "false")
        input[name] = false;
      if (name.indexOf(directive) === 0) {
        const parts = name.slice(1).split(":");
        let previous = data;
        for (let p = 0, pmax = parts.length, last = pmax - 1; p < pmax; p++) {
          const part = parts[p];
          if (p === last)
            previous[part] = input[name];
          else if (!previous[part])
            previous = previous[part] = {};
          else
            previous = previous[part];
        }
      } else {
        if (!data.attrs)
          data.attrs = {};
        data.attrs[name] = input[name];
      }
    }
    return h(sel, data, content);
  }
  const patch = init(modules || []);
  const snabby = hyperx_tmp_default(createElement2, { comments: true, attrToProp: false });
  snabby.update = function update22(dest, src) {
    return patch(dest, src);
  };
  snabby.thunk = thunk;
  return snabby;
}
var observer = new window.ResizeObserver(function(entries) {
  for (const entry of entries) {
    const breakpoints = JSON.parse(entry.target.dataset.breakpoints);
    let highWaterMark = 0;
    let selectedClass = "";
    for (const breakpoint of Object.keys(breakpoints)) {
      const minWidth = breakpoints[breakpoint];
      if (entry.contentRect.width >= minWidth && minWidth > highWaterMark) {
        selectedClass = breakpoint;
        highWaterMark = minWidth;
      }
    }
    for (const breakpoint of Object.keys(breakpoints)) {
      if (breakpoint === selectedClass) {
        if (!entry.target.classList.contains(breakpoint))
          entry.target.classList.add(breakpoint);
      } else if (entry.target.classList.contains(breakpoint)) {
        entry.target.classList.remove(breakpoint);
      }
    }
  }
});
function update(oldVnode, vnode3) {
  if (vnode3.elm.dataset && vnode3.elm.dataset.breakpoints) {
    try {
      JSON.parse(vnode3.elm.dataset.breakpoints);
      observer.observe(vnode3.elm);
    } catch (er) {
    }
  } else if (vnode3.elm instanceof Element) {
    observer.unobserve(vnode3.elm);
  }
}
function destroy(vnode3) {
  if (vnode3.elm instanceof Element)
    observer.unobserve(vnode3.elm);
}
var containerQueryModule = {
  create: update,
  update,
  destroy
};
var index = create([
  attributesModule,
  eventListenersModule,
  classModule,
  propsModule,
  styleModule,
  containerQueryModule
]);
var snabby_default = index;

// http-url:https://cdn.skypack.dev/-/snabbdom-timeline@v0.8.0-EVzmxuYAowD8mKIsdXkw/dist=es2019,mode=imports/optimized/snabbdom-timeline.js
var global$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
function clamp(value, min, max) {
  return min < max ? value < min ? min : value > max ? max : value : value < max ? max : value > min ? min : value;
}
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
  const x2 = Math.max(0, value - start);
  return x2 / length;
}
var fe = typeof global$1 != "undefined" ? global$1 : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {};
function G(e, t, r, i, s) {
  const n = t === void 0 ? void 0 : t.key;
  return { sel: e, data: t, children: r, text: i, elm: s, key: n };
}
var ee = Array.isArray;
function U(e) {
  return typeof e == "string" || typeof e == "number";
}
function xe(e) {
  return document.createElement(e);
}
function Re(e, t) {
  return document.createElementNS(e, t);
}
function Se(e) {
  return document.createTextNode(e);
}
function Me(e) {
  return document.createComment(e);
}
function Le(e, t, r) {
  e.insertBefore(t, r);
}
function Ce(e, t) {
  e.removeChild(t);
}
function Ne(e, t) {
  e.appendChild(t);
}
function ke(e) {
  return e.parentNode;
}
function ze(e) {
  return e.nextSibling;
}
function Pe(e) {
  return e.tagName;
}
function je(e, t) {
  e.textContent = t;
}
function De(e) {
  return e.textContent;
}
function Fe(e) {
  return e.nodeType === 1;
}
function Be(e) {
  return e.nodeType === 3;
}
function $e(e) {
  return e.nodeType === 8;
}
var We = { createElement: xe, createElementNS: Re, createTextNode: Se, createComment: Me, insertBefore: Le, removeChild: Ce, appendChild: Ne, parentNode: ke, nextSibling: ze, tagName: Pe, setTextContent: je, getTextContent: De, isElement: Fe, isText: Be, isComment: $e };
function te(e) {
  return e === void 0;
}
function L(e) {
  return e !== void 0;
}
var le = G("", {}, [], void 0, void 0);
function I(e, t) {
  return e.key === t.key && e.sel === t.sel;
}
function He(e) {
  return e.sel !== void 0;
}
function Ie(e, t, r) {
  var i;
  const s = {};
  for (let n = t; n <= r; ++n) {
    const o = (i = e[n]) === null || i === void 0 ? void 0 : i.key;
    o !== void 0 && (s[o] = n);
  }
  return s;
}
var Y = ["create", "update", "remove", "destroy", "pre", "post"];
function qe(e, t) {
  let r, i;
  const s = { create: [], update: [], remove: [], destroy: [], pre: [], post: [] }, n = t !== void 0 ? t : We;
  for (r = 0; r < Y.length; ++r)
    for (s[Y[r]] = [], i = 0; i < e.length; ++i) {
      const a = e[i][Y[r]];
      a !== void 0 && s[Y[r]].push(a);
    }
  function o(a) {
    const f = a.id ? "#" + a.id : "", l = a.className ? "." + a.className.split(" ").join(".") : "";
    return G(n.tagName(a).toLowerCase() + f + l, {}, [], void 0, a);
  }
  function h22(a, f) {
    return function() {
      if (--f === 0) {
        const p = n.parentNode(a);
        n.removeChild(p, a);
      }
    };
  }
  function y(a, f) {
    var l, p;
    let m, c = a.data;
    if (c !== void 0) {
      const g = (l = c.hook) === null || l === void 0 ? void 0 : l.init;
      L(g) && (g(a), c = a.data);
    }
    const _ = a.children, w = a.sel;
    if (w === "!")
      te(a.text) && (a.text = ""), a.elm = n.createComment(a.text);
    else if (w !== void 0) {
      const g = w.indexOf("#"), O = w.indexOf(".", g), d = g > 0 ? g : w.length, T = O > 0 ? O : w.length, b = g !== -1 || O !== -1 ? w.slice(0, Math.min(d, T)) : w, k = a.elm = L(c) && L(m = c.ns) ? n.createElementNS(m, b) : n.createElement(b);
      for (d < T && k.setAttribute("id", w.slice(d + 1, T)), O > 0 && k.setAttribute("class", w.slice(T + 1).replace(/\./g, " ")), m = 0; m < s.create.length; ++m)
        s.create[m](le, a);
      if (ee(_))
        for (m = 0; m < _.length; ++m) {
          const H = _[m];
          H != null && n.appendChild(k, y(H, f));
        }
      else
        U(a.text) && n.appendChild(k, n.createTextNode(a.text));
      const z = a.data.hook;
      L(z) && ((p = z.create) === null || p === void 0 || p.call(z, le, a), z.insert && f.push(a));
    } else
      a.elm = n.createTextNode(a.text);
    return a.elm;
  }
  function v(a, f, l, p, m, c) {
    for (; p <= m; ++p) {
      const _ = l[p];
      _ != null && n.insertBefore(a, y(_, c), f);
    }
  }
  function u(a) {
    var f, l;
    const p = a.data;
    if (p !== void 0) {
      (l = (f = p == null ? void 0 : p.hook) === null || f === void 0 ? void 0 : f.destroy) === null || l === void 0 || l.call(f, a);
      for (let m = 0; m < s.destroy.length; ++m)
        s.destroy[m](a);
      if (a.children !== void 0)
        for (let m = 0; m < a.children.length; ++m) {
          const c = a.children[m];
          c != null && typeof c != "string" && u(c);
        }
    }
  }
  function S(a, f, l, p) {
    for (var m, c; l <= p; ++l) {
      let _, w;
      const g = f[l];
      if (g != null)
        if (L(g.sel)) {
          u(g), _ = s.remove.length + 1, w = h22(g.elm, _);
          for (let d = 0; d < s.remove.length; ++d)
            s.remove[d](g, w);
          const O = (c = (m = g == null ? void 0 : g.data) === null || m === void 0 ? void 0 : m.hook) === null || c === void 0 ? void 0 : c.remove;
          L(O) ? O(g, w) : w();
        } else
          n.removeChild(a, g.elm);
    }
  }
  function E(a, f, l, p) {
    let m = 0, c = 0, _ = f.length - 1, w = f[0], g = f[_], O = l.length - 1, d = l[0], T = l[O], b, k, z, H;
    for (; m <= _ && c <= O; )
      w == null ? w = f[++m] : g == null ? g = f[--_] : d == null ? d = l[++c] : T == null ? T = l[--O] : I(w, d) ? (A(w, d, p), w = f[++m], d = l[++c]) : I(g, T) ? (A(g, T, p), g = f[--_], T = l[--O]) : I(w, T) ? (A(w, T, p), n.insertBefore(a, w.elm, n.nextSibling(g.elm)), w = f[++m], T = l[--O]) : I(g, d) ? (A(g, d, p), n.insertBefore(a, g.elm, w.elm), g = f[--_], d = l[++c]) : (b === void 0 && (b = Ie(f, m, _)), k = b[d.key], te(k) ? n.insertBefore(a, y(d, p), w.elm) : (z = f[k], z.sel !== d.sel ? n.insertBefore(a, y(d, p), w.elm) : (A(z, d, p), f[k] = void 0, n.insertBefore(a, z.elm, w.elm))), d = l[++c]);
    (m <= _ || c <= O) && (m > _ ? (H = l[O + 1] == null ? null : l[O + 1].elm, v(a, H, l, c, O, p)) : S(a, f, m, _));
  }
  function A(a, f, l) {
    var p, m, c, _, w;
    const g = (p = f.data) === null || p === void 0 ? void 0 : p.hook;
    (m = g == null ? void 0 : g.prepatch) === null || m === void 0 || m.call(g, a, f);
    const O = f.elm = a.elm, d = a.children, T = f.children;
    if (a === f)
      return;
    if (f.data !== void 0) {
      for (let b = 0; b < s.update.length; ++b)
        s.update[b](a, f);
      (_ = (c = f.data.hook) === null || c === void 0 ? void 0 : c.update) === null || _ === void 0 || _.call(c, a, f);
    }
    te(f.text) ? L(d) && L(T) ? d !== T && E(O, d, T, l) : L(T) ? (L(a.text) && n.setTextContent(O, ""), v(O, null, T, 0, T.length - 1, l)) : L(d) ? S(O, d, 0, d.length - 1) : L(a.text) && n.setTextContent(O, "") : a.text !== f.text && (L(d) && S(O, d, 0, d.length - 1), n.setTextContent(O, f.text)), (w = g == null ? void 0 : g.postpatch) === null || w === void 0 || w.call(g, a, f);
  }
  return function(f, l) {
    let p, m, c;
    const _ = [];
    for (p = 0; p < s.pre.length; ++p)
      s.pre[p]();
    for (He(f) || (f = o(f)), I(f, l) ? A(f, l, _) : (m = f.elm, c = n.parentNode(m), y(l, _), c !== null && (n.insertBefore(c, l.elm, n.nextSibling(m)), S(c, [f], 0, 0))), p = 0; p < _.length; ++p)
      _[p].data.hook.insert(_[p]);
    for (p = 0; p < s.post.length; ++p)
      s.post[p]();
    return l;
  };
}
function ue(e, t, r) {
  if (e.ns = "http://www.w3.org/2000/svg", r !== "foreignObject" && t !== void 0)
    for (let i = 0; i < t.length; ++i) {
      const s = t[i].data;
      s !== void 0 && ue(s, t[i].children, t[i].sel);
    }
}
function J(e, t, r) {
  var i = {}, s, n, o;
  if (r !== void 0 ? (t !== null && (i = t), ee(r) ? s = r : U(r) ? n = r : r && r.sel && (s = [r])) : t != null && (ee(t) ? s = t : U(t) ? n = t : t && t.sel ? s = [t] : i = t), s !== void 0)
    for (o = 0; o < s.length; ++o)
      U(s[o]) && (s[o] = G(void 0, void 0, void 0, s[o], void 0));
  return e[0] === "s" && e[1] === "v" && e[2] === "g" && (e.length === 3 || e[3] === "." || e[3] === "#") && ue(i, s, e), G(e, i, s, n, void 0);
}
function K(e, t) {
  e.data.fn = t.data.fn, e.data.args = t.data.args, t.data = e.data, t.children = e.children, t.text = e.text, t.elm = e.elm;
}
function Ge(e) {
  const t = e.data, r = t.fn.apply(void 0, t.args);
  K(r, e);
}
function Ue(e, t) {
  let r;
  const i = e.data, s = t.data, n = i.args, o = s.args;
  if (i.fn !== s.fn || n.length !== o.length) {
    K(s.fn.apply(void 0, o), t);
    return;
  }
  for (r = 0; r < o.length; ++r)
    if (n[r] !== o[r]) {
      K(s.fn.apply(void 0, o), t);
      return;
    }
  K(e, t);
}
var Ye = function(t, r, i, s) {
  return s === void 0 && (s = i, i = r, r = void 0), J(t, { key: r, hook: { init: Ge, prepatch: Ue }, fn: i, args: s });
};
var Je = Ke;
var ce = { class: "className", for: "htmlFor", "http-equiv": "httpEquiv" };
function Ke(e) {
  return function(t, r, i) {
    for (var s in r)
      s in ce && (r[ce[s]] = r[s], delete r[s]);
    return e(t, r, i);
  };
}
var D = 0;
var N = 1;
var M = 2;
var X = 3;
var C = 4;
var x = 5;
var ne = 6;
var P = 7;
var R = 8;
var F = 9;
var B = 10;
var q = 11;
var j = 12;
var $ = 13;
var Xe = function(e, t) {
  t || (t = {});
  var r = t.concat || function(s, n) {
    return String(s) + String(n);
  };
  return t.attrToProp !== false && (e = Je(e)), function(s) {
    for (var n = N, o = "", h22 = false, y = arguments.length, v = [], u = 0; u < s.length; u++)
      if (u < y - 1) {
        var S = arguments[u + 1], E = g(s[u]), A = n;
        A === B && (A = R), A === F && (A = R), A === P && (A = R), A === C && (A = x), A === M ? o === "/" ? (E.push([M, "/", S]), o = "") : E.push([M, S]) : A === $ && t.comments ? o += String(S) : A !== $ && E.push([D, A, S]), v.push.apply(v, E);
      } else
        v.push.apply(v, g(s[u]));
    for (var a = [null, {}, []], f = [[a, -1]], u = 0; u < v.length; u++) {
      var l = f[f.length - 1][0], E = v[u], n = E[0];
      if (n === M && /^\//.test(E[1])) {
        var p = f[f.length - 1][1];
        f.length > 1 && (f.pop(), f[f.length - 1][0][2][p] = e(l[0], l[1], l[2].length ? l[2] : void 0));
      } else if (n === M) {
        var m = [E[1], {}, []];
        l[2].push(m), f.push([m, l[2].length - 1]);
      } else if (n === x || n === D && E[1] === x) {
        for (var c = "", _; u < v.length; u++)
          if (v[u][0] === x)
            c = r(c, v[u][1]);
          else if (v[u][0] === D && v[u][1] === x) {
            if (typeof v[u][2] == "object" && !c)
              for (_ in v[u][2])
                v[u][2].hasOwnProperty(_) && !l[1][_] && (l[1][_] = v[u][2][_]);
            else
              c = r(c, v[u][2]);
          } else
            break;
        v[u][0] === q && u++;
        for (var w = u; u < v.length; u++)
          if (v[u][0] === R || v[u][0] === x)
            l[1][c] ? v[u][1] === "" || (l[1][c] = r(l[1][c], v[u][1])) : l[1][c] = i(v[u][1]);
          else if (v[u][0] === D && (v[u][1] === R || v[u][1] === x))
            l[1][c] ? v[u][2] === "" || (l[1][c] = r(l[1][c], v[u][2])) : l[1][c] = i(v[u][2]);
          else {
            c.length && !l[1][c] && u === w && (v[u][0] === X || v[u][0] === j) && (l[1][c] = c.toLowerCase()), v[u][0] === X && u--;
            break;
          }
      } else if (n === x)
        l[1][E[1]] = true;
      else if (n === D && E[1] === x)
        l[1][E[2]] = true;
      else if (n === X) {
        const b = E[1] || Ve(l[0]);
        if (b && f.length) {
          var p = f[f.length - 1][1];
          f.pop(), f[f.length - 1][0][2][p] = e(l[0], l[1], l[2].length ? l[2] : void 0);
        }
      } else if (n === D && E[1] === N)
        E[2] === void 0 || E[2] === null ? E[2] = "" : E[2] || (E[2] = r("", E[2])), Array.isArray(E[2][0]) ? l[2].push.apply(l[2], E[2]) : l[2].push(E[2]);
      else if (n === N)
        l[2].push(E[1]);
      else if (!(n === q || n === j))
        throw new Error("unhandled: " + n);
    }
    if (a[2].length > 1 && /^\s*$/.test(a[2][0]) && a[2].shift(), a[2].length > 2 || a[2].length === 2 && /\S/.test(a[2][1])) {
      if (t.createFragment)
        return t.createFragment(a[2]);
      throw new Error("multiple root elements must be wrapped in an enclosing tag");
    }
    return Array.isArray(a[2][0]) && typeof a[2][0][0] == "string" && Array.isArray(a[2][0][2]) && (a[2][0] = e(a[2][0][0], a[2][0][1], a[2][0][2])), a[2][0];
    function g(O) {
      var d = [];
      n === P && (n = C);
      for (var T = 0; T < O.length; T++) {
        var b = O.charAt(T);
        n === N && b === "<" ? (o.length && d.push([N, o]), o = "", n = M) : b === ">" && !Ze(n) && n !== $ ? (n === M && o.length ? d.push([M, o]) : n === x ? d.push([x, o]) : n === R && o.length && d.push([R, o]), d.push([X, h22]), h22 = false, o = "", n = N) : n === $ && /-$/.test(o) && b === "-" ? (t.comments && d.push([R, o.substr(0, o.length - 1)]), o = "", h22 = true, n = N) : n === M && /^!--$/.test(o) ? (t.comments && d.push([M, o], [x, "comment"], [q]), o = b, n = $) : n === N || n === $ ? o += b : n === M && b === "/" && o.length ? h22 = true : n === M && /\s/.test(b) ? (o.length && d.push([M, o]), o = "", n = C) : n === M ? o += b : n === C && /[^\s"'=/]/.test(b) ? (n = x, o = b) : n === C && /\s/.test(b) ? (o.length && d.push([x, o]), d.push([j])) : n === x && /\s/.test(b) ? (d.push([x, o]), o = "", n = ne) : n === x && b === "=" ? (d.push([x, o], [q]), o = "", n = P) : n === x && b === "/" ? (h22 = true, o = "", n = C) : n === x ? o += b : (n === ne || n === C) && b === "=" ? (d.push([q]), n = P) : (n === ne || n === C) && !/\s/.test(b) ? (d.push([j]), /[\w-]/.test(b) ? (o += b, n = x) : b === "/" ? h22 = true : n = C) : n === P && b === '"' ? n = B : n === P && b === "'" ? n = F : n === B && b === '"' ? (d.push([R, o], [j]), o = "", n = C) : n === F && b === "'" ? (d.push([R, o], [j]), o = "", n = C) : n === P && !/\s/.test(b) ? (n = R, T--) : n === R && /\s/.test(b) ? (d.push([R, o], [j]), o = "", n = C) : (n === R || n === F || n === B) && (o += b);
      }
      return n === N && o.length ? (d.push([N, o]), o = "") : n === R && o.length ? (d.push([R, o]), o = "") : n === B && o.length ? (d.push([R, o]), o = "") : n === F && o.length ? (d.push([R, o]), o = "") : n === x && (d.push([x, o]), o = ""), d;
    }
  };
  function i(s) {
    return typeof s == "function" || typeof s == "string" || s && typeof s == "object" || s == null ? s : r("", s);
  }
};
function Ze(e) {
  return e === F || e === B;
}
var Qe = RegExp("^(" + ["area", "base", "br", "col", "command", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
function Ve(e) {
  return Qe.test(e);
}
function et(e, t = {}) {
  const r = t.directive || "@";
  function i(o, h22, y) {
    if (o === "!--")
      return J("!", h22.comment);
    y && y.length && (y.length === 1 ? y = y[0] : y = [].concat.apply([], y));
    const v = Object.keys(h22);
    if (!v || !v.length)
      return J(o, y);
    const u = {};
    for (let S = 0, E = v.length; E > S; S++) {
      const A = v[S];
      if (h22[A] === "false" && (h22[A] = false), A.indexOf(r) === 0) {
        const a = A.slice(1).split(":");
        let f = u;
        for (let l = 0, p = a.length, m = p - 1; l < p; l++) {
          const c = a[l];
          l === m ? f[c] = h22[A] : f[c] ? f = f[c] : f = f[c] = {};
        }
      } else
        u.attrs || (u.attrs = {}), u.attrs[A] = h22[A];
    }
    return J(o, u, y);
  }
  const s = qe(e || []), n = Xe(i, { comments: true, attrToProp: false });
  return n.update = function(h22, y) {
    return s(h22, y);
  }, n.thunk = Ye, n;
}
var tt = "http://www.w3.org/1999/xlink";
var nt = "http://www.w3.org/XML/1998/namespace";
var de = 58;
var rt = 120;
function he(e, t) {
  var r, i = t.elm, s = e.data.attrs, n = t.data.attrs;
  if (!s && !n)
    return;
  if (s === n)
    return;
  s = s || {}, n = n || {};
  for (r in n) {
    const o = n[r], h22 = s[r];
    h22 !== o && (o === true ? i.setAttribute(r, "") : o === false ? i.removeAttribute(r) : r.charCodeAt(0) !== rt ? i.setAttribute(r, o) : r.charCodeAt(3) === de ? i.setAttributeNS(nt, r, o) : r.charCodeAt(5) === de ? i.setAttributeNS(tt, r, o) : i.setAttribute(r, o));
  }
  for (r in s)
    r in n || i.removeAttribute(r);
}
var it = { create: he, update: he };
function pe(e, t) {
  var r, i, s = t.elm, n = e.data.class, o = t.data.class;
  if (!n && !o)
    return;
  if (n === o)
    return;
  n = n || {}, o = o || {};
  for (i in n)
    n[i] && !Object.prototype.hasOwnProperty.call(o, i) && s.classList.remove(i);
  for (i in o)
    r = o[i], r !== n[i] && s.classList[r ? "add" : "remove"](i);
}
var st = { create: pe, update: pe };
function ve(e, t) {
  var r, i, s, n = t.elm, o = e.data.props, h22 = t.data.props;
  if (!o && !h22)
    return;
  if (o === h22)
    return;
  o = o || {}, h22 = h22 || {};
  for (r in h22)
    i = h22[r], s = o[r], s !== i && (r !== "value" || n[r] !== i) && (n[r] = i);
}
var ot = { create: ve, update: ve };
var me = typeof window != "undefined" && window.requestAnimationFrame.bind(window) || setTimeout;
var at = function(e) {
  me(function() {
    me(e);
  });
};
var re = false;
function ft(e, t, r) {
  at(function() {
    e[t] = r;
  });
}
function ge(e, t) {
  var r, i, s = t.elm, n = e.data.style, o = t.data.style;
  if (!n && !o)
    return;
  if (n === o)
    return;
  n = n || {}, o = o || {};
  var h22 = "delayed" in n;
  for (i in n)
    o[i] || (i[0] === "-" && i[1] === "-" ? s.style.removeProperty(i) : s.style[i] = "");
  for (i in o)
    if (r = o[i], i === "delayed" && o.delayed)
      for (const y in o.delayed)
        r = o.delayed[y], (!h22 || r !== n.delayed[y]) && ft(s.style, y, r);
    else
      i !== "remove" && r !== n[i] && (i[0] === "-" && i[1] === "-" ? s.style.setProperty(i, r) : s.style[i] = r);
}
function lt(e) {
  var t, r, i = e.elm, s = e.data.style;
  if (!s || !(t = s.destroy))
    return;
  for (r in t)
    i.style[r] = t[r];
}
function ut(e, t) {
  var r = e.data.style;
  if (!r || !r.remove) {
    t();
    return;
  }
  re || (e.elm.offsetLeft, re = true);
  var i, s = e.elm, n = 0, o, h22 = r.remove, y = 0, v = [];
  for (i in h22)
    v.push(i), s.style[i] = h22[i];
  o = getComputedStyle(s);
  for (var u = o["transition-property"].split(", "); n < u.length; ++n)
    v.indexOf(u[n]) !== -1 && y++;
  s.addEventListener("transitionend", function(S) {
    S.target === s && --y, y === 0 && t();
  });
}
function ct() {
  re = false;
}
var dt = { pre: ct, create: ge, update: ge, destroy: lt, remove: ut };
function ye(e, t, r) {
  if (typeof e == "function")
    e.call(t, r, t);
  else if (typeof e == "object")
    for (var i = 0; i < e.length; i++)
      ye(e[i], t, r);
}
function ht(e, t) {
  var r = e.type, i = t.data.on;
  i && i[r] && ye(i[r], t, e);
}
function pt() {
  return function e(t) {
    ht(t, e.vnode);
  };
}
function ie(e, t) {
  var r = e.data.on, i = e.listener, s = e.elm, n = t && t.data.on, o = t && t.elm, h22;
  if (r === n)
    return;
  if (r && i)
    if (n)
      for (h22 in r)
        n[h22] || s.removeEventListener(h22, i, false);
    else
      for (h22 in r)
        s.removeEventListener(h22, i, false);
  if (n) {
    var y = t.listener = e.listener || pt();
    if (y.vnode = t, r)
      for (h22 in n)
        r[h22] || o.addEventListener(h22, y, false);
    else
      for (h22 in n)
        o.addEventListener(h22, y, false);
  }
}
var vt = { create: ie, update: ie, destroy: ie };
var se = typeof fe != "undefined" ? fe : typeof self != "undefined" ? self : typeof window != "undefined" ? window : {};
var be = function() {
  if (typeof Map != "undefined")
    return Map;
  function e(t, r) {
    var i = -1;
    return t.some(function(s, n) {
      return s[0] === r ? (i = n, true) : false;
    }), i;
  }
  return function() {
    function t() {
      this.__entries__ = [];
    }
    return Object.defineProperty(t.prototype, "size", { get: function() {
      return this.__entries__.length;
    }, enumerable: true, configurable: true }), t.prototype.get = function(r) {
      var i = e(this.__entries__, r), s = this.__entries__[i];
      return s && s[1];
    }, t.prototype.set = function(r, i) {
      var s = e(this.__entries__, r);
      ~s ? this.__entries__[s][1] = i : this.__entries__.push([r, i]);
    }, t.prototype.delete = function(r) {
      var i = this.__entries__, s = e(i, r);
      ~s && i.splice(s, 1);
    }, t.prototype.has = function(r) {
      return !!~e(this.__entries__, r);
    }, t.prototype.clear = function() {
      this.__entries__.splice(0);
    }, t.prototype.forEach = function(r, i) {
      i === void 0 && (i = null);
      for (var s = 0, n = this.__entries__; s < n.length; s++) {
        var o = n[s];
        r.call(i, o[1], o[0]);
      }
    }, t;
  }();
}();
var oe = typeof window != "undefined" && typeof document != "undefined" && window.document === document;
var Z = function() {
  return typeof se != "undefined" && se.Math === Math ? se : typeof self != "undefined" && self.Math === Math ? self : typeof window != "undefined" && window.Math === Math ? window : Function("return this")();
}();
var mt = function() {
  return typeof requestAnimationFrame == "function" ? requestAnimationFrame.bind(Z) : function(e) {
    return setTimeout(function() {
      return e(Date.now());
    }, 1e3 / 60);
  };
}();
var gt = 2;
function yt(e, t) {
  var r = false, i = false, s = 0;
  function n() {
    r && (r = false, e()), i && h22();
  }
  function o() {
    mt(n);
  }
  function h22() {
    var y = Date.now();
    if (r) {
      if (y - s < gt)
        return;
      i = true;
    } else
      r = true, i = false, setTimeout(o, t);
    s = y;
  }
  return h22;
}
var bt = 20;
var _t = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var wt = typeof MutationObserver != "undefined";
var Et = function() {
  function e() {
    this.connected_ = false, this.mutationEventsAdded_ = false, this.mutationsObserver_ = null, this.observers_ = [], this.onTransitionEnd_ = this.onTransitionEnd_.bind(this), this.refresh = yt(this.refresh.bind(this), bt);
  }
  return e.prototype.addObserver = function(t) {
    ~this.observers_.indexOf(t) || this.observers_.push(t), this.connected_ || this.connect_();
  }, e.prototype.removeObserver = function(t) {
    var r = this.observers_, i = r.indexOf(t);
    ~i && r.splice(i, 1), !r.length && this.connected_ && this.disconnect_();
  }, e.prototype.refresh = function() {
    var t = this.updateObservers_();
    t && this.refresh();
  }, e.prototype.updateObservers_ = function() {
    var t = this.observers_.filter(function(r) {
      return r.gatherActive(), r.hasActive();
    });
    return t.forEach(function(r) {
      return r.broadcastActive();
    }), t.length > 0;
  }, e.prototype.connect_ = function() {
    if (!oe || this.connected_)
      return;
    document.addEventListener("transitionend", this.onTransitionEnd_), window.addEventListener("resize", this.refresh), wt ? (this.mutationsObserver_ = new MutationObserver(this.refresh), this.mutationsObserver_.observe(document, { attributes: true, childList: true, characterData: true, subtree: true })) : (document.addEventListener("DOMSubtreeModified", this.refresh), this.mutationEventsAdded_ = true), this.connected_ = true;
  }, e.prototype.disconnect_ = function() {
    if (!oe || !this.connected_)
      return;
    document.removeEventListener("transitionend", this.onTransitionEnd_), window.removeEventListener("resize", this.refresh), this.mutationsObserver_ && this.mutationsObserver_.disconnect(), this.mutationEventsAdded_ && document.removeEventListener("DOMSubtreeModified", this.refresh), this.mutationsObserver_ = null, this.mutationEventsAdded_ = false, this.connected_ = false;
  }, e.prototype.onTransitionEnd_ = function(t) {
    var r = t.propertyName, i = r === void 0 ? "" : r, s = _t.some(function(n) {
      return !!~i.indexOf(n);
    });
    s && this.refresh();
  }, e.getInstance = function() {
    return this.instance_ || (this.instance_ = new e()), this.instance_;
  }, e.instance_ = null, e;
}();
var _e = function(e, t) {
  for (var r = 0, i = Object.keys(t); r < i.length; r++) {
    var s = i[r];
    Object.defineProperty(e, s, { value: t[s], enumerable: false, writable: false, configurable: true });
  }
  return e;
};
var W = function(e) {
  var t = e && e.ownerDocument && e.ownerDocument.defaultView;
  return t || Z;
};
var we = V(0, 0, 0, 0);
function Q(e) {
  return parseFloat(e) || 0;
}
function Ee(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return t.reduce(function(i, s) {
    var n = e["border-" + s + "-width"];
    return i + Q(n);
  }, 0);
}
function Ot(e) {
  for (var t = ["top", "right", "bottom", "left"], r = {}, i = 0, s = t; i < s.length; i++) {
    var n = s[i], o = e["padding-" + n];
    r[n] = Q(o);
  }
  return r;
}
function At(e) {
  var t = e.getBBox();
  return V(0, 0, t.width, t.height);
}
function Tt(e) {
  var t = e.clientWidth, r = e.clientHeight;
  if (!t && !r)
    return we;
  var i = W(e).getComputedStyle(e), s = Ot(i), n = s.left + s.right, o = s.top + s.bottom, h22 = Q(i.width), y = Q(i.height);
  if (i.boxSizing === "border-box" && (Math.round(h22 + n) !== t && (h22 -= Ee(i, "left", "right") + n), Math.round(y + o) !== r && (y -= Ee(i, "top", "bottom") + o)), !Rt(e)) {
    var v = Math.round(h22 + n) - t, u = Math.round(y + o) - r;
    Math.abs(v) !== 1 && (h22 -= v), Math.abs(u) !== 1 && (y -= u);
  }
  return V(s.left, s.top, h22, y);
}
var xt = function() {
  return typeof SVGGraphicsElement != "undefined" ? function(e) {
    return e instanceof W(e).SVGGraphicsElement;
  } : function(e) {
    return e instanceof W(e).SVGElement && typeof e.getBBox == "function";
  };
}();
function Rt(e) {
  return e === W(e).document.documentElement;
}
function St(e) {
  return oe ? xt(e) ? At(e) : Tt(e) : we;
}
function Mt(e) {
  var t = e.x, r = e.y, i = e.width, s = e.height, n = typeof DOMRectReadOnly != "undefined" ? DOMRectReadOnly : Object, o = Object.create(n.prototype);
  return _e(o, { x: t, y: r, width: i, height: s, top: r, right: t + i, bottom: s + r, left: t }), o;
}
function V(e, t, r, i) {
  return { x: e, y: t, width: r, height: i };
}
var Lt = function() {
  function e(t) {
    this.broadcastWidth = 0, this.broadcastHeight = 0, this.contentRect_ = V(0, 0, 0, 0), this.target = t;
  }
  return e.prototype.isActive = function() {
    var t = St(this.target);
    return this.contentRect_ = t, t.width !== this.broadcastWidth || t.height !== this.broadcastHeight;
  }, e.prototype.broadcastRect = function() {
    var t = this.contentRect_;
    return this.broadcastWidth = t.width, this.broadcastHeight = t.height, t;
  }, e;
}();
var Ct = function() {
  function e(t, r) {
    var i = Mt(r);
    _e(this, { target: t, contentRect: i });
  }
  return e;
}();
var Nt = function() {
  function e(t, r, i) {
    if (this.activeObservations_ = [], this.observations_ = new be(), typeof t != "function")
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    this.callback_ = t, this.controller_ = r, this.callbackCtx_ = i;
  }
  return e.prototype.observe = function(t) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element == "undefined" || !(Element instanceof Object))
      return;
    if (!(t instanceof W(t).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    var r = this.observations_;
    if (r.has(t))
      return;
    r.set(t, new Lt(t)), this.controller_.addObserver(this), this.controller_.refresh();
  }, e.prototype.unobserve = function(t) {
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    if (typeof Element == "undefined" || !(Element instanceof Object))
      return;
    if (!(t instanceof W(t).Element))
      throw new TypeError('parameter 1 is not of type "Element".');
    var r = this.observations_;
    if (!r.has(t))
      return;
    r.delete(t), r.size || this.controller_.removeObserver(this);
  }, e.prototype.disconnect = function() {
    this.clearActive(), this.observations_.clear(), this.controller_.removeObserver(this);
  }, e.prototype.gatherActive = function() {
    var t = this;
    this.clearActive(), this.observations_.forEach(function(r) {
      r.isActive() && t.activeObservations_.push(r);
    });
  }, e.prototype.broadcastActive = function() {
    if (!this.hasActive())
      return;
    var t = this.callbackCtx_, r = this.activeObservations_.map(function(i) {
      return new Ct(i.target, i.broadcastRect());
    });
    this.callback_.call(t, r, t), this.clearActive();
  }, e.prototype.clearActive = function() {
    this.activeObservations_.splice(0);
  }, e.prototype.hasActive = function() {
    return this.activeObservations_.length > 0;
  }, e;
}();
var Oe = typeof WeakMap != "undefined" ? /* @__PURE__ */ new WeakMap() : new be();
var Ae = function() {
  function e(t) {
    if (!(this instanceof e))
      throw new TypeError("Cannot call a class as a function.");
    if (!arguments.length)
      throw new TypeError("1 argument required, but only 0 present.");
    var r = Et.getInstance(), i = new Nt(t, r, this);
    Oe.set(this, i);
  }
  return e;
}();
["observe", "unobserve", "disconnect"].forEach(function(e) {
  Ae.prototype[e] = function() {
    var t;
    return (t = Oe.get(this))[e].apply(t, arguments);
  };
});
var kt = function() {
  return typeof Z.ResizeObserver != "undefined" ? Z.ResizeObserver : Ae;
}();
var ae = new kt(function(e) {
  for (const t of e) {
    const r = JSON.parse(t.target.dataset.breakpoints);
    let i = 0, s = "";
    for (const n of Object.keys(r)) {
      const o = r[n];
      t.contentRect.width >= o && o > i && (s = n, i = o);
    }
    for (const n of Object.keys(r))
      n === s ? t.target.classList.contains(n) || t.target.classList.add(n) : t.target.classList.contains(n) && t.target.classList.remove(n);
  }
});
function Te(e, t) {
  if (t.elm.dataset && t.elm.dataset.breakpoints)
    try {
      JSON.parse(t.elm.dataset.breakpoints), ae.observe(t.elm);
    } catch (r) {
    }
  else
    t.elm instanceof Element && ae.unobserve(t.elm);
}
function zt(e) {
  ae.unobserve(e.elm);
}
var Pt = { create: Te, update: Te, destroy: zt };
var jt = et([it, vt, st, ot, dt, Pt]);
function lerp(a, b, t) {
  return a + (b - a) * t;
}
var commonjsGlobal2 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global$1 !== "undefined" ? global$1 : typeof self !== "undefined" ? self : {};
var FUNC_ERROR_TEXT = "Expected a function";
var NAN2 = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal2 = typeof commonjsGlobal2 == "object" && commonjsGlobal2 && commonjsGlobal2.Object === Object && commonjsGlobal2;
var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
var objectProto2 = Object.prototype;
var objectToString2 = objectProto2.toString;
var nativeMax = Math.max;
var nativeMin = Math.min;
var now = function() {
  return root2.Date.now();
};
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
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
    var args = lastArgs, thisArg = lastThis;
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
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
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
    var time = now(), isInvoking = shouldInvoke(time);
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
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    leading,
    maxWait: wait,
    trailing
  });
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString2.call(value) == symbolTag;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN2;
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
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN2 : +value;
}
var lodash_throttle = throttle;
var DOT_WIDTH = 4;
var FPS$1 = 60;
function getTimePeriodData$1(graph) {
  return graph.data.filter((dataPoint) => {
    if (dataPoint.t < graph.timeRange.start)
      return false;
    if (dataPoint.t > graph.timeRange.end)
      return false;
    return true;
  });
}
function getGraphMetrics$1(model2, graph) {
  let leftMargin = 10;
  const rightMargin = 10;
  let bottomMargin = graph.renderTicks ? 20 : 0;
  if (graph.renderValueLabel && graph.selection.type === "value")
    bottomMargin += 30;
  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model2.width - leftMargin - rightMargin;
  return {
    leftMargin,
    rightMargin,
    bottomMargin,
    graphHeight,
    graphWidth
  };
}
function verticalGridLinesMinor$1(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.vertical)
    return;
  const m = getGraphMetrics$1(model2, graph);
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  const { ctx } = graph;
  ctx.lineWidth = 1;
  ctx.strokeStyle = graph.gridLines.vertical.minorColor;
  ctx.beginPath();
  for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
    const x2 = m.leftMargin + i + 0.5;
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, m.graphHeight);
  }
  ctx.stroke();
}
function verticalGridLinesMajor$1(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.vertical)
    return;
  const m = getGraphMetrics$1(model2, graph);
  const pixelsPerTick = 6;
  const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;
  const { ctx } = graph;
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  ctx.lineWidth = strokeWidth;
  ctx.strokeStyle = graph.gridLines.vertical.majorColor;
  ctx.beginPath();
  for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
    const x2 = m.leftMargin + i + 0.5;
    ctx.moveTo(x2, 0);
    ctx.lineTo(x2, m.graphHeight);
  }
  ctx.stroke();
}
function gridLines$1(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.horizontal)
    return;
  const m = getGraphMetrics$1(model2, graph);
  const { ctx } = graph;
  ctx.lineWidth = 0.5;
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
function renderLinePlotGraph$1(model2, graph, dotWidth) {
  const tp = getTimePeriodData$1(graph);
  const m = getGraphMetrics$1(model2, graph);
  const { ctx } = graph;
  let lastX, lastY;
  if (graph.linePlotAreaColor) {
    const region = new Path2D();
    for (let i = 0; i < tp.length; i++) {
      const point = tp[i];
      const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
      const x2 = Math.round(startX * (m.graphWidth - dotWidth) + m.leftMargin) + 0.5;
      const yLength = graph.yRange.end - graph.yRange.start;
      const y = Math.round((1 - point.value / yLength) * (m.graphHeight - dotWidth)) + 0.5;
      if (i === 0)
        region.moveTo(x2, m.graphHeight);
      region.lineTo(x2, y);
      lastX = x2;
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
    const x2 = Math.round(startX * (m.graphWidth - dotWidth) + m.leftMargin) + 0.5;
    const yLength = graph.yRange.end - graph.yRange.start;
    const y = Math.round((1 - point.value / yLength) * (m.graphHeight - dotWidth)) + 0.5;
    if (i > 0) {
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(x2, y);
    }
    lastX = x2;
    lastY = y;
  }
  ctx.stroke();
}
function renderScatterPlotGraph$1(model2, graph, dotWidth) {
  const tp = getTimePeriodData$1(graph);
  const m = getGraphMetrics$1(model2, graph);
  const { ctx } = graph;
  ctx.fillStyle = graph.dataColor;
  return tp.map((point) => {
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x2 = startX * (m.graphWidth - dotWidth) + m.leftMargin;
    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);
    ctx.fillRect(Math.round(x2), Math.round(y), dotWidth, dotWidth);
  });
}
function graphComponent$1(model2, graph, update3) {
  const dotWidth = 4;
  const m = getGraphMetrics$1(model2, graph);
  const _mouseMove = lodash_throttle(function(ev) {
    const rect = model2.elm.getBoundingClientRect();
    const x2 = clamp(ev.clientX - rect.left, 0, model2.elm.clientWidth);
    if (graph.selection.dragging === "time") {
      const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.time = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
    } else if (graph.selection.dragging === "start") {
      const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.start > graph.selection.end)
        graph.selection.start = graph.selection.end;
    } else if (graph.selection.dragging === "end") {
      const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.end < graph.selection.start)
        graph.selection.end = graph.selection.start;
    }
    update3();
  }, 1e3 / FPS$1);
  const _mouseUp = function(ev) {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update3();
  };
  const _mouseDown = function(ev) {
    var _a, _b;
    let draggingType;
    if (((_a = graph.selection) == null ? void 0 : _a.type) === "range" && ev.offsetY <= 21) {
      const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
      const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);
      const x2 = startX * (m.graphWidth - dotWidth) + m.leftMargin;
      const x22 = endX * (m.graphWidth - dotWidth) + m.leftMargin;
      if (Math.abs(ev.offsetX - x2) < 10) {
        draggingType = "start";
      } else if (Math.abs(ev.offsetX - x22) < 10) {
        draggingType = "end";
      }
    } else if (((_b = graph.selection) == null ? void 0 : _b.type) === "value") {
      const m2 = getGraphMetrics$1(model2, graph);
      if (ev.offsetY >= m2.graphHeight + 10)
        draggingType = "time";
    }
    graph.selection.dragging = draggingType;
    if (draggingType) {
      document.addEventListener("mousemove", _mouseMove, { passive: true });
      document.addEventListener("mouseup", _mouseUp);
      update3();
    }
  };
  const _insertHook = function(vnode22) {
    model2.elm = vnode22.elm;
    graph.ctx = vnode22.elm.getContext("2d");
  };
  if (graph.ctx) {
    graph.ctx.clearRect(0, 0, model2.elm.width, model2.elm.height);
    verticalGridLinesMinor$1(model2, graph);
    verticalGridLinesMajor$1(model2, graph);
    gridLines$1(model2, graph);
    graph.ctx.beginPath();
    graph.ctx.strokeStyle = "#888";
    graph.ctx.lineWidth = 1;
    graph.ctx.moveTo(m.leftMargin + 0.5, m.graphHeight - 0.5);
    graph.ctx.lineTo(m.leftMargin + m.graphWidth + 0.5, m.graphHeight - 0.5);
    graph.ctx.stroke();
    if (graph.renderTicks) {
      tickMarksComponent$1(model2, graph);
      tickLabelsComponent$1(model2, graph);
    }
    graph.ctx.strokeStyle = graph.dataColor;
    if (graph.type === "scatterPlot")
      renderScatterPlotGraph$1(model2, graph, dotWidth);
    else
      renderLinePlotGraph$1(model2, graph, dotWidth);
    timeSelectionComponent$1(model2, graph);
    renderLabelComponent$1(model2, graph);
  }
  if (!graph.key)
    graph.key = "u" + Math.floor(Math.random() * 9999999);
  return jt`<canvas width="${model2.width}"
                        height="${graph.height}"
                        @hook:insert=${_insertHook}
                        @key=${graph.key}
                        style="height: ${graph.height}px; width: 100%; padding-top: 10px; background-color: white; image-rendering: pixelated"
                        @style:cursor=${graph.selection.dragging ? "ew-resize" : "inherit"}
                        @on:mousedown=${_mouseDown}></canvas>`;
}
function renderLabelComponent$1(model2, graph, update3) {
  const { ctx } = graph;
  const m = getGraphMetrics$1(model2, graph);
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  if (graph.renderValueLabel && graph.selection.type === "value") {
    ctx.textAlign = "start";
    const t = (graph.selection.time === Infinity ? graph.timeRange.end : graph.selection.time).toFixed(1);
    ctx.fillText(`t: ${t}s`, 2, m.graphHeight + m.bottomMargin - 8);
  }
  ctx.textAlign = "end";
  ctx.fillText(graph.label, m.graphWidth + m.leftMargin - DOT_WIDTH, 12);
}
function tickMarksComponent$1(model2, graph, update3) {
  const m = getGraphMetrics$1(model2, graph);
  const { ctx } = graph;
  const constPixelsPerTick = 6;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#888";
  ctx.beginPath();
  for (let i = 0; i < m.graphWidth; i += constPixelsPerTick) {
    const tickHeight = i % 60 === 0 ? 8 : 4;
    const x2 = m.leftMargin + i + 0.5;
    ctx.moveTo(x2, m.graphHeight);
    ctx.lineTo(x2, m.graphHeight + tickHeight);
  }
  ctx.stroke();
}
function tickLabelsComponent$1(model2, graph, update3) {
  const m = getGraphMetrics$1(model2, graph);
  const timePeriod = graph.timeRange.end - graph.timeRange.start;
  const { ctx } = graph;
  const constPixelsPerTick = 6;
  ctx.font = "10px monospace";
  ctx.textAlign = "center";
  ctx.strokeStyle = "#888";
  const tickCount = m.graphWidth / constPixelsPerTick;
  const secondsPerTick = timePeriod / tickCount;
  let lastSecond;
  for (let i = 0; i < m.graphWidth; i += 60) {
    const tickIdx = i / constPixelsPerTick;
    const seconds = (graph.timeRange.start + tickIdx * secondsPerTick).toFixed(1);
    if (lastSecond !== seconds) {
      lastSecond = seconds;
      ctx.strokeText(seconds, m.leftMargin + i, m.graphHeight + 19);
    }
  }
}
function timeSelectionComponent$1(model2, graph, update3) {
  if (graph.selection.type === "range")
    timeRangeSelectionComponent$1(model2, graph);
  if (graph.selection.type === "value")
    timeValueSelectionComponent$1(model2, graph);
}
function timeRangeSelectionComponent$1(model2, graph, update3) {
  const m = getGraphMetrics$1(model2, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);
  const { ctx } = graph;
  ctx.fillStyle = "rgba(205,205,205, 0.85)";
  ctx.fillRect(m.leftMargin, 0, startX * m.graphWidth, m.graphHeight);
  ctx.fillRect(m.leftMargin + endX * m.graphWidth, 0, m.graphWidth - m.graphWidth * endX, m.graphHeight);
  const downHandlePath = [
    [-5, -4],
    [0, -8],
    [10, 0],
    [0, 8]
  ];
  renderDragHandle(ctx, m.leftMargin + startX * m.graphWidth, 12, downHandlePath);
  renderDragHandle(ctx, m.leftMargin + endX * m.graphWidth, 12, downHandlePath);
  ctx.strokeStyle = "rgb(255,64,129)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(m.leftMargin + startX * m.graphWidth - 0.5, 11);
  ctx.lineTo(m.leftMargin + startX * m.graphWidth - 0.5, m.graphHeight + 1);
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
  ctx.fillStyle = "rgba(255,64,129)";
  ctx.fill(region);
}
function timeValueSelectionComponent$1(model2, graph, update3) {
  const m = getGraphMetrics$1(model2, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.time);
  const x2 = startX * m.graphWidth + m.leftMargin;
  const y = m.graphHeight;
  const { ctx } = graph;
  const upHandlePath = [
    [5, 4],
    [0, 8],
    [-10, 0],
    [0, -8]
  ];
  renderDragHandle(ctx, x2, y - 1, upHandlePath);
  ctx.strokeStyle = "rgb(255,64,129)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x2 - 0.5, 0);
  ctx.lineTo(x2 - 0.5, m.graphHeight);
  ctx.stroke();
}
function timelineComponent$2(model2, update3) {
  const _insertHook = function(vnode22) {
    model2.container = vnode22;
  };
  if (model2.container)
    model2.width = model2.container.elm ? model2.container.elm.offsetWidth : model2.container.offsetWidth;
  return jt`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: ${model2.border || "none"};">
            ${model2.graphs.map((g) => graphComponent$1(model2, g, update3))}
        </div>`;
}
function vnode2(sel, data, children, text, elm) {
  const key = data === void 0 ? void 0 : data.key;
  return { sel, data, children, text, elm, key };
}
var array2 = Array.isArray;
function primitive2(s) {
  return typeof s === "string" || typeof s === "number";
}
function addNS2(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== void 0) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== void 0) {
        addNS2(childData, children[i].children, children[i].sel);
      }
    }
  }
}
function h2(sel, b, c) {
  var data = {};
  var children;
  var text;
  var i;
  if (c !== void 0) {
    if (b !== null) {
      data = b;
    }
    if (array2(c)) {
      children = c;
    } else if (primitive2(c)) {
      text = c;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== void 0 && b !== null) {
    if (array2(b)) {
      children = b;
    } else if (primitive2(b)) {
      text = b;
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (children !== void 0) {
    for (i = 0; i < children.length; ++i) {
      if (primitive2(children[i]))
        children[i] = vnode2(void 0, void 0, void 0, children[i], void 0);
    }
  }
  if (sel[0] === "s" && sel[1] === "v" && sel[2] === "g" && (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
    addNS2(data, children, sel);
  }
  return vnode2(sel, data, children, text, void 0);
}
var FPS = 60;
function getTimePeriodData(graph) {
  return graph.data.filter((dataPoint) => {
    if (dataPoint.t < graph.timeRange.start)
      return false;
    if (dataPoint.t > graph.timeRange.end)
      return false;
    return true;
  });
}
function getGraphMetrics(model2, graph) {
  let leftMargin = 10;
  const rightMargin = 10;
  let bottomMargin = graph.renderTicks ? 20 : 0;
  if (graph.renderValueLabel && graph.selection.type === "value")
    bottomMargin += 30;
  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model2.width - leftMargin - rightMargin;
  return {
    leftMargin,
    rightMargin,
    bottomMargin,
    graphHeight,
    graphWidth
  };
}
function verticalGridLinesMinor(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.vertical)
    return jt``;
  const m = getGraphMetrics(model2, graph);
  const gridLines2 = [];
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
    const x2 = m.leftMargin + i;
    gridLines2.push(h2("line", { attrs: { x1: x2, x2, y1: 0, y2: m.graphHeight } }));
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return jt`<g class="grid-minor" style="stroke: ${graph.gridLines.vertical.minorColor}; stroke-width: ${strokeWidth}">${gridLines2}</g>`;
}
function verticalGridLinesMajor(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.vertical)
    return jt``;
  const m = getGraphMetrics(model2, graph);
  const gridLines2 = [];
  const pixelsPerTick = 6;
  const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
    const x2 = m.leftMargin + i;
    gridLines2.push(h2("line", { attrs: { x1: x2, x2, y1: 0, y2: m.graphHeight } }));
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return jt`<g class="grid-major" style="stroke: ${graph.gridLines.vertical.majorColor}; stroke-width: ${strokeWidth}">${gridLines2}</g>`;
}
function gridLines(model2, graph, update3) {
  if (!graph.gridLines || !graph.gridLines.horizontal)
    return jt``;
  const m = getGraphMetrics(model2, graph);
  const gridLines2 = [];
  const distanceBetweenLines = m.graphHeight / (graph.gridLines.horizontal.lineCount + 1);
  for (let y = distanceBetweenLines; y < m.graphHeight; y += distanceBetweenLines) {
    gridLines2.push(jt`<line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${y}" y2="${y}"/>`);
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return jt`<g class="grid-horiz"
                   style="stroke: ${graph.gridLines.horizontal.color}; stroke-width: ${strokeWidth}"
                   stroke-dasharray="4 2">${gridLines2}</g>`;
}
function renderLinePlotGraph(model2, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model2, graph);
  const lines = [];
  let lastX, lastY;
  let pathString = "";
  for (let i = 0; i < tp.length; i++) {
    const point = tp[i];
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x2 = startX * (m.graphWidth - dotWidth) + m.leftMargin;
    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);
    if (i > 0) {
      lines.push(h2("line", { attrs: { x1: lastX, y1: lastY, x2, y2: y } }));
      pathString += `L ${x2} ${y}`;
    } else {
      pathString = `M ${x2} ${m.graphHeight}  L ${x2} ${y}`;
    }
    lastX = x2;
    lastY = y;
  }
  if (graph.linePlotAreaColor && tp.length) {
    pathString += ` L ${lastX} ${m.graphHeight} Z`;
    lines.unshift(h2("path", { attrs: { d: pathString, fill: graph.linePlotAreaColor, stroke: "transparent" } }));
  }
  return lines;
}
function renderScatterPlotGraph(model2, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model2, graph);
  return tp.map((point) => {
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x2 = startX * (m.graphWidth - dotWidth) + m.leftMargin;
    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);
    return h2("rect", {
      attrs: {
        x: x2,
        y,
        "data-value": point.value,
        width: dotWidth,
        height: dotWidth
      }
    });
  });
}
function graphComponent(model2, graph, update3) {
  const dotWidth = 4;
  const m = getGraphMetrics(model2, graph);
  const _stopDragging = function() {
    graph.selection.dragging = void 0;
    update3();
  };
  const _insertHook = function(vnode22) {
    model2.elm = vnode22.elm;
  };
  return jt`
        <svg xmlns="http://www.w3.org/2000/svg"
             class="graph"
             aria-labelledby="title"
             role="img"
             viewBox="0 0 ${model2.width} ${graph.height}"
             style="height: ${graph.height}px; width: 100%; padding-top: 10px; background-color: white; font-size: 10px; text-anchor: middle; -moz-user-select: none; -webkit-user-select: none; user-select: none; -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none;"
             @on:mouseup=${_stopDragging}
             @hook:insert=${_insertHook}>
            <title id="title">${graph.title}</title>

            ${verticalGridLinesMinor(model2, graph)}
            ${verticalGridLinesMajor(model2, graph)}
            ${gridLines(model2, graph)}

            <g style="stroke: #888; stroke-dasharray: 0; stroke-width: 1;">
                <line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${m.graphHeight}" y2="${m.graphHeight}" />
                ${tickMarksComponent(model2, graph)}
                ${tickLabelsComponent(model2, graph)}
            </g>

            <g class="data"
               style="fill: ${graph.dataColor}; stroke: ${graph.dataColor}; stroke-width: 1;">
               ${graph.type === "scatterPlot" ? renderScatterPlotGraph(model2, graph, dotWidth) : renderLinePlotGraph(model2, graph, dotWidth)}
            </g>

            ${timeSelectionComponent(model2, graph, update3)}

            <text x="${m.graphWidth + m.leftMargin - dotWidth}" y="12" style="fill: rgba(0, 0, 0, 0.7); text-anchor: end; pointer-events: none;">${graph.label}</text>
            ${renderLabelComponent(model2, graph)}
        </svg>`;
}
function renderLabelComponent(model2, graph, update3) {
  if (graph.renderValueLabel && graph.selection.type === "value") {
    const m = getGraphMetrics(model2, graph);
    const t = (graph.selection.time === Infinity ? graph.timeRange.end : graph.selection.time).toFixed(1);
    return jt`<text x="2" y="${m.graphHeight + m.bottomMargin - 8}" style="fill: rgba(0, 0, 0, 0.7); text-anchor: start; pointer-events: none;">t: ${t}s</text>`;
  }
  return jt``;
}
function tickMarksComponent(model2, graph, update3) {
  const m = getGraphMetrics(model2, graph);
  const tickMarks = [];
  const constPixelsPerTick = 6;
  if (graph.renderTicks) {
    for (let i = 0; i < m.graphWidth; i += constPixelsPerTick) {
      const tickHeight = i % 60 === 0 ? 8 : 4;
      const x2 = m.leftMargin + i;
      tickMarks.push(h2("line", { attrs: { x1: x2, x2, y1: m.graphHeight, y2: m.graphHeight + tickHeight } }));
    }
  }
  return tickMarks;
}
function tickLabelsComponent(model2, graph, update3) {
  const m = getGraphMetrics(model2, graph);
  const timePeriod = graph.timeRange.end - graph.timeRange.start;
  const tickLabels = [];
  const constPixelsPerTick = 6;
  if (graph.renderTicks) {
    const tickCount = m.graphWidth / constPixelsPerTick;
    const secondsPerTick = timePeriod / tickCount;
    let lastSecond;
    for (let i = 0; i < m.graphWidth; i += 60) {
      const tickIdx = i / constPixelsPerTick;
      const seconds = (graph.timeRange.start + tickIdx * secondsPerTick).toFixed(1);
      if (lastSecond !== seconds) {
        tickLabels.push({ x: m.leftMargin + i, seconds });
        lastSecond = seconds;
      }
    }
  }
  return tickLabels.map((tick) => {
    return jt`<text x="${tick.x}" y="${m.graphHeight + 19}">${tick.seconds}</text>`;
  });
}
function timeSelectionComponent(model2, graph, update3) {
  if (graph.selection.type === "range")
    return timeRangeSelectionComponent(model2, graph, update3);
  if (graph.selection.type === "value")
    return timeValueSelectionComponent(model2, graph, update3);
  return jt``;
}
function timeRangeSelectionComponent(model2, graph, update3) {
  const m = getGraphMetrics(model2, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);
  const _mouseMove = lodash_throttle(function(ev) {
    const rect = model2.elm.getBoundingClientRect();
    const x2 = clamp(ev.clientX - rect.left, 0, model2.elm.clientWidth);
    if (graph.selection.dragging === "start") {
      const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.start > graph.selection.end)
        graph.selection.start = graph.selection.end;
    } else if (graph.selection.dragging === "end") {
      const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.end < graph.selection.start)
        graph.selection.end = graph.selection.start;
    }
    update3();
  }, 1e3 / FPS);
  const _mouseUp = function() {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update3();
  };
  const _mouseDown = function(position) {
    graph.selection.dragging = position;
    document.addEventListener("mousemove", _mouseMove, { passive: true });
    document.addEventListener("mouseup", _mouseUp);
    update3();
  };
  return jt`
        <g class="time-selection">

            <rect x="${m.leftMargin}" y="0" width="${startX * m.graphWidth}" height="${m.graphHeight}"
                    @on:mousedown=${() => _mouseDown("start")}
                    style="fill: rgba(205,205,205, 0.85);"/>

            <path d="M ${m.leftMargin + startX * m.graphWidth} 12 l -5 -4 l 0 -8    l 10 0  l 0 8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  @on:mousedown=${() => _mouseDown("start")}/>

            <line x1="${m.leftMargin + startX * m.graphWidth}"
                  x2="${m.leftMargin + startX * m.graphWidth}"
                  y1="11"
                  y2="${m.graphHeight + 1}" stroke="rgb(255,64,129)"/>


            <rect x="${m.leftMargin + endX * m.graphWidth}" y="0" width="${m.graphWidth - m.graphWidth * endX}" height="${m.graphHeight}"
                    @on:mousedown=${() => _mouseDown("end")}
                    style="fill: rgba(205,205,205, 0.85);"/>

            <path d="M ${m.leftMargin + endX * m.graphWidth} 12 l -5 -4 l 0 -8    l 10 0  l 0 8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  @on:mousedown=${() => _mouseDown("end")}/>

            <line x1="${m.leftMargin + endX * m.graphWidth}"
                  x2="${m.leftMargin + endX * m.graphWidth}"
                  y1="11"
                  y2="${m.graphHeight + 1}" stroke="rgb(255,64,129)"/>
        </g>`;
}
function timeValueSelectionComponent(model2, graph, update3) {
  const _mouseMove = lodash_throttle(function(ev) {
    const rect = model2.elm.getBoundingClientRect();
    const x3 = clamp(ev.clientX - rect.left, 0, model2.elm.clientWidth);
    const pos = clamp((x3 - m.leftMargin) / m.graphWidth, 0, 1);
    graph.selection.time = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
    update3();
  }, 1e3 / 60);
  const _mouseUp = function() {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update3();
  };
  const _mouseDown = function(position) {
    graph.selection.dragging = true;
    document.addEventListener("mousemove", _mouseMove, { passive: true });
    document.addEventListener("mouseup", _mouseUp);
    update3();
  };
  const m = getGraphMetrics(model2, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.time);
  const x2 = startX * m.graphWidth + m.leftMargin;
  const y = m.graphHeight;
  return jt`
        <g class="time-selection" @on:mousedown=${_mouseDown}>
            <line x1="${x2}"
                  x2="${x2}"
                  y1="0"
                  y2="${m.graphHeight}" stroke="deeppink"/>

            <path d="M ${x2} ${y - 1} l 5 4 l 0 8    l -10 0  l 0 -8 Z"
                  style="fill: rgb(255,64,129); cursor: ew-resize;"
                  />
        </g>`;
}
function timelineComponent$1(model2, update3) {
  const _insertHook = function(vnode22) {
    model2.container = vnode22;
  };
  if (model2.container)
    model2.width = model2.container.elm ? model2.container.elm.offsetWidth : model2.container.offsetWidth;
  return jt`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: ${model2.border || "none"};">
            ${model2.graphs.map((g) => graphComponent(model2, g, update3))}
        </div>`;
}
function timelineComponent(model2, update3) {
  return model2.renderer === "canvas" ? timelineComponent$2(model2, update3) : timelineComponent$1(model2, update3);
}
var snabbdom_timeline_default = timelineComponent;

// app.js
var currentVnode = document.querySelector("main");
var model = {
  startTime: Date.now(),
  maxSampleCount: 100,
  entityCount: {
    instanceCount: 0,
    maxValue: 0,
    timeline: {
      container: void 0,
      width: 0,
      renderer: "canvas",
      graphs: [
        {
          title: "Entity Count",
          label: "",
          type: "linePlot",
          linePlotAreaColor: "rgba(41, 147, 251, 0.3)",
          timeRange: {
            start: 0,
            end: 0
          },
          yRange: {
            start: 0,
            end: 100
          },
          selection: {
            type: "none",
            start: 0,
            end: Infinity,
            dragging: false
          },
          height: 40,
          dataColor: "dodgerblue",
          renderTicks: false,
          renderValueLabel: false,
          data: [],
          gridLines: {}
        }
      ]
    }
  },
  componentCount: {
    totalUniqueComponentTypes: 0,
    maxValue: 0,
    timeline: {
      container: void 0,
      width: 0,
      renderer: "canvas",
      graphs: [
        {
          title: "Components Count",
          label: "",
          type: "linePlot",
          linePlotAreaColor: "rgba(41, 147, 251, 0.3)",
          timeRange: {
            start: 0,
            end: 0
          },
          yRange: {
            start: 0,
            end: 100
          },
          selection: {
            type: "none",
            start: 0,
            end: Infinity,
            dragging: false
          },
          height: 40,
          dataColor: "dodgerblue",
          renderTicks: false,
          renderValueLabel: false,
          data: [],
          gridLines: {}
        }
      ]
    }
  },
  components: {},
  systems: []
};
var backgroundPageConnection = chrome.runtime.connect({
  name: "mreinstein/ecs-devtools"
});
backgroundPageConnection.postMessage({
  name: "init",
  tabId: chrome.devtools.inspectedWindow.tabId
});
function createComponentTimeline(componentId) {
  return {
    instanceCount: 0,
    maxValue: 0,
    timeline: {
      container: void 0,
      width: 0,
      renderer: "canvas",
      graphs: [
        {
          title: "Component Count",
          label: "",
          type: "linePlot",
          linePlotAreaColor: "rgba(41, 147, 251, 0.3)",
          timeRange: {
            start: 0,
            end: 0
          },
          yRange: {
            start: 0,
            end: 100
          },
          selection: {
            type: "none",
            start: 0,
            end: Infinity,
            dragging: false
          },
          height: 40,
          dataColor: "dodgerblue",
          renderTicks: false,
          renderValueLabel: false,
          data: [],
          gridLines: {}
        }
      ]
    }
  };
}
backgroundPageConnection.onMessage.addListener(function(message) {
  if (message.method === "worldCreated" || message.method === "tab-complete") {
    model.entityCount.instanceCount = 0;
    model.entityCount.maxValue = 100;
    model.entityCount.timeline.graphs[0].data.length = 0;
    model.componentCount.totalUniqueComponentTypes = 0;
    model.componentCount.maxValue = 100;
    model.componentCount.timeline.graphs[0].data.length = 0;
    model.componentCount.timeline.graphs[0].label = "";
    model.components = {};
    model.systems.length = 0;
  } else if (message.method === "refreshData") {
    const stats = message.data;
    const t = (Date.now() - model.startTime) / 1e3;
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
        model.components[componentId] = createComponentTimeline(componentId);
      const ct2 = model.components[componentId];
      ct2.maxValue = Math.max(ct2.maxValue, componentCount + 10);
      ct2.instanceCount = componentCount;
      ct2.timeline.graphs[0].data.push({ t, value: componentCount });
      ct2.timeline.graphs[0].yRange.end = Math.round(ct2.maxValue * 1.1);
      ct2.timeline.graphs[0].label = componentCount;
      if (ct2.timeline.graphs[0].data.length > model.maxSampleCount) {
        ct2.timeline.graphs[0].data.shift();
        ct2.timeline.graphs[0].timeRange.start = ct2.timeline.graphs[0].data[0].t;
      }
      ct2.timeline.graphs[0].timeRange.end = t;
    }
    model.componentCount.timeline.graphs[0].data.push({ t, value: totalCount });
    model.componentCount.timeline.graphs[0].label = totalCount;
    model.componentCount.maxValue = Math.max(model.componentCount.maxValue, totalCount);
    model.componentCount.timeline.graphs[0].yRange.end = Math.round(model.componentCount.maxValue * 1.1);
    if (model.entityCount.timeline.graphs[0].data.length > model.maxSampleCount) {
      model.entityCount.timeline.graphs[0].data.shift();
      model.entityCount.timeline.graphs[0].timeRange.start = model.entityCount.timeline.graphs[0].data[0].t;
      model.componentCount.timeline.graphs[0].data.shift();
      model.componentCount.timeline.graphs[0].timeRange.start = model.componentCount.timeline.graphs[0].data[0].t;
    }
    model.entityCount.timeline.graphs[0].timeRange.end = t;
    model.componentCount.timeline.graphs[0].timeRange.end = t;
    model.systems = message.data.systems;
  }
  update2();
});
function update2() {
  const newVnode = render(model, update2);
  currentVnode = snabby_default.update(currentVnode, newVnode);
}
function renderEntityGraph(timelineModel, update3) {
  const c = snabbdom_timeline_default(timelineModel, update3);
  timelineModel.container = c;
  return c;
}
function renderComponentGraphs(components, update3) {
  return Object.keys(components).map((componentId) => {
    const c = components[componentId];
    return snabby_default`<div class="component-graph-row">
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-right: 6px;">${componentId}</div>${renderEntityGraph(c.timeline, update3)}
        </div>`;
  });
}
function filtersView(systems, update3) {
  const filters = {};
  for (const s of systems)
    for (const f of Object.keys(s.filters))
      filters[f] = s.filters[f];
  const filterViews = Object.keys(filters).filter((f) => filters[f] > 0).map((f) => {
    const components = f.split(",").map((c) => snabby_default`<div class="system-filter-component">${c}</div>`);
    const entityCount = filters[f];
    return snabby_default`<div class="system-filter" style="padding: 4px; margin-bottom: 6px;">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`;
  });
  return snabby_default`<div class="filters">
        <h3>Filters (${Object.keys(filters).length})</h3>
        ${filterViews}
    </div>`;
}
function systemsOverviewGraphView(systems, update3) {
  const segments = [];
  let totalTime = 0;
  for (const s of systems)
    totalTime += s.timeElapsed;
  const significant = [];
  if (systems.length) {
    const colorDivisor = 360 / systems.length;
    let totalPercent = 0;
    for (let i = 0; i < systems.length; i++) {
      const system = systems[i];
      const percent = Math.floor(system.timeElapsed / totalTime * 100);
      if (percent === 0)
        continue;
      const strokeDasharray = `${percent} ${100 - percent}`;
      const color = Math.round(i * colorDivisor);
      const strokeColor = `hsl(${color}, 100%, 50%)`;
      if (percent > 3)
        significant.push({ name: system.name, percent, strokeColor });
      const strokeDashOffset = -totalPercent;
      segments.push(snabby_default`<circle class="donut-segment" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="${strokeColor}" stroke-width="3" stroke-dasharray="${strokeDasharray}" stroke-dashoffset="${strokeDashOffset}" title="${system.name}"/>`);
      totalPercent += percent;
    }
  }
  return snabby_default`<div style="display:flex; grid-template-columns: 1fr 110px">
        <svg width="110px" height="110px" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg">
            <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" fill="#fff"/>
            <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#e2e3e4" stroke-width="3"/>
            ${segments}
        </svg>
        <div style="display: flex; flex-direction: column; align-items: flex-start; justify-content: center; padding-left: 10px;">
            ${significant.map((s) => {
    return snabby_default`<div style="display: flex;flex-direction: row; align-items: center;">
                    <div style="background-color: ${s.strokeColor}; width: 10px; height: 10px; margin-right: 5px;"></div>
                    <div> ${s.percent}%  ${s.name}</div>
                </div>`;
  })}
        </div>
    </div>`;
}
function systemsView(systems, update3) {
  let totalTime = 0;
  for (const s of systems)
    totalTime += s.timeElapsed;
  const systemViews = systems.map((s, i) => {
    const percent = Math.round(s.timeElapsed / totalTime * 100);
    const filterViews = Object.keys(s.filters).map((f) => {
      const components = f.split(",").map((c) => snabby_default`<div class="system-filter-component">${c}</div>`);
      const entityCount = s.filters[f];
      return snabby_default`<div class="system-filter">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    <div style="padding-right: 6px;">FILTER:</div>
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`;
    });
    const colorDivisor = 360 / systems.length;
    const color = Math.round(i * colorDivisor);
    const strokeColor = `hsl(${color}, 100%, 50%)`;
    return snabby_default`<div class="system">
            <div style="grid-area: systemName; border-left: 4px solid ${strokeColor}; padding: 8px;">${s.name}</div>
            <div style="grid-area: systemTime; padding: 8px;">${s.timeElapsed.toFixed(2)}ms</div>
            <div style="grid-area: systemPercent; padding: 8px;">${percent}%</div>
            <div style="grid-area: systemQueries; padding-left: 20px; background-color: white;">
                ${filterViews}
            </div>
        </div>`;
  });
  return snabby_default`<div class="systems">
        <h3>Systems (${systems.length})</h3>
        <p>Total Time: ${totalTime.toFixed(2)}ms</p>
        ${systemsOverviewGraphView(systems, update3)}
        <div></div>
        ${systemViews}
    </div>`;
}
function render(model2, update3) {
  return snabby_default`<main data-breakpoints='{ "col2": 640, "col3": 1024 }'>
        <div class="entities" key="entities">
            <h2>Entities (${model2.entityCount.instanceCount})</h2>
            ${renderEntityGraph(model2.entityCount.timeline, update3)}
        </div>

        <div class="components">
            <h2>Components (${model2.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model2.componentCount.timeline, update3)}
            ${renderComponentGraphs(model2.components, update3)}
        </div>

        ${filtersView(model2.systems, update3)}

        ${systemsView(model2.systems, update3)}
    </main>`;
}
