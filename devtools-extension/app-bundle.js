var commonjsGlobal$1 = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var freeGlobal$1 = typeof commonjsGlobal$1 == "object" && commonjsGlobal$1 && commonjsGlobal$1.Object === Object && commonjsGlobal$1;
var freeSelf$1 = typeof self == "object" && self && self.Object === Object && self;
freeGlobal$1 || freeSelf$1 || Function("return this")();

var global$1$1 = typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
function vnode$2(sel, data, children, text, elm) {
  const key = data === void 0 ? void 0 : data.key;
  return { sel, data, children, text, elm, key };
}
const array$2 = Array.isArray;
function primitive$2(s) {
  return typeof s === "string" || typeof s === "number";
}
function createElement$1(tagName2) {
  return document.createElement(tagName2);
}
function createElementNS$1(namespaceURI, qualifiedName) {
  return document.createElementNS(namespaceURI, qualifiedName);
}
function createTextNode$1(text) {
  return document.createTextNode(text);
}
function createComment$1(text) {
  return document.createComment(text);
}
function insertBefore$1(parentNode2, newNode, referenceNode) {
  parentNode2.insertBefore(newNode, referenceNode);
}
function removeChild$1(node, child) {
  node.removeChild(child);
}
function appendChild$1(node, child) {
  node.appendChild(child);
}
function parentNode$1(node) {
  return node.parentNode;
}
function nextSibling$1(node) {
  return node.nextSibling;
}
function tagName$1(elm) {
  return elm.tagName;
}
function setTextContent$1(node, text) {
  node.textContent = text;
}
function getTextContent$1(node) {
  return node.textContent;
}
function isElement$1(node) {
  return node.nodeType === 1;
}
function isText$1(node) {
  return node.nodeType === 3;
}
function isComment$1(node) {
  return node.nodeType === 8;
}
const htmlDomApi$1 = {
  createElement: createElement$1,
  createElementNS: createElementNS$1,
  createTextNode: createTextNode$1,
  createComment: createComment$1,
  insertBefore: insertBefore$1,
  removeChild: removeChild$1,
  appendChild: appendChild$1,
  parentNode: parentNode$1,
  nextSibling: nextSibling$1,
  tagName: tagName$1,
  setTextContent: setTextContent$1,
  getTextContent: getTextContent$1,
  isElement: isElement$1,
  isText: isText$1,
  isComment: isComment$1 };

function isUndef$1(s) {
  return s === void 0;
}
function isDef$1(s) {
  return s !== void 0;
}
const emptyNode$1 = vnode$2("", {}, [], void 0, void 0);
function sameVnode$1(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode$1(vnode2) {
  return vnode2.sel !== void 0;
}
function createKeyToOldIdx$1(children, beginIdx, endIdx) {
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
const hooks$1 = ["create", "update", "remove", "destroy", "pre", "post"];
function init$2(modules, domApi) {
  let i;
  let j;
  const cbs = {
    create: [],
    update: [],
    remove: [],
    destroy: [],
    pre: [],
    post: [] };

  const api = domApi !== void 0 ? domApi : htmlDomApi$1;
  for (i = 0; i < hooks$1.length; ++i) {
    cbs[hooks$1[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks$1[i]];
      if (hook !== void 0) {
        cbs[hooks$1[i]].push(hook);
      }
    }
  }
  function emptyNodeAt(elm) {
    const id = elm.id ? "#" + elm.id : "";
    const c = elm.className ? "." + elm.className.split(" ").join(".") : "";
    return vnode$2(api.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
  }
  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }
  function createElm(vnode2, insertedVnodeQueue) {
    var _a, _b;
    let i2;
    let data = vnode2.data;
    if (data !== void 0) {
      const init2 = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
      if (isDef$1(init2)) {
        init2(vnode2);
        data = vnode2.data;
      }
    }
    const children = vnode2.children;
    const sel = vnode2.sel;
    if (sel === "!") {
      if (isUndef$1(vnode2.text)) {
        vnode2.text = "";
      }
      vnode2.elm = api.createComment(vnode2.text);
    } else if (sel !== void 0) {
      const hashIdx = sel.indexOf("#");
      const dotIdx = sel.indexOf(".", hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode2.elm = isDef$1(data) && isDef$1(i2 = data.ns) ? api.createElementNS(i2, tag) : api.createElement(tag);
      if (hash < dot)
      elm.setAttribute("id", sel.slice(hash + 1, dot));
      if (dotIdx > 0)
      elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
      for (i2 = 0; i2 < cbs.create.length; ++i2)
      cbs.create[i2](emptyNode$1, vnode2);
      if (array$2(children)) {
        for (i2 = 0; i2 < children.length; ++i2) {
          const ch = children[i2];
          if (ch != null) {
            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
          }
        }
      } else if (primitive$2(vnode2.text)) {
        api.appendChild(elm, api.createTextNode(vnode2.text));
      }
      const hook = vnode2.data.hook;
      if (isDef$1(hook)) {
        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode$1, vnode2);
        if (hook.insert) {
          insertedVnodeQueue.push(vnode2);
        }
      }
    } else {
      vnode2.elm = api.createTextNode(vnode2.text);
    }
    return vnode2.elm;
  }
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }
  function invokeDestroyHook(vnode2) {
    var _a, _b;
    const data = vnode2.data;
    if (data !== void 0) {
      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode2);
      for (let i2 = 0; i2 < cbs.destroy.length; ++i2)
      cbs.destroy[i2](vnode2);
      if (vnode2.children !== void 0) {
        for (let j2 = 0; j2 < vnode2.children.length; ++j2) {
          const child = vnode2.children[j2];
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
        if (isDef$1(ch.sel)) {
          invokeDestroyHook(ch);
          listeners = cbs.remove.length + 1;
          rm = createRmCb(ch.elm, listeners);
          for (let i2 = 0; i2 < cbs.remove.length; ++i2)
          cbs.remove[i2](ch, rm);
          const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
          if (isDef$1(removeHook)) {
            removeHook(ch, rm);
          } else {
            rm();
          }
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
      } else if (sameVnode$1(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode$1(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode$1(oldStartVnode, newEndVnode)) {
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldStartVnode.elm, api.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode$1(oldEndVnode, newStartVnode)) {
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        api.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (oldKeyToIdx === void 0) {
          oldKeyToIdx = createKeyToOldIdx$1(oldCh, oldStartIdx, oldEndIdx);
        }
        idxInOld = oldKeyToIdx[newStartVnode.key];
        if (isUndef$1(idxInOld)) {
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
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }
  function patchVnode(oldVnode, vnode2, insertedVnodeQueue) {
    var _a, _b, _c, _d, _e;
    const hook = (_a = vnode2.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode2);
    const elm = vnode2.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode2.children;
    if (oldVnode === vnode2)
    return;
    if (vnode2.data !== void 0) {
      for (let i2 = 0; i2 < cbs.update.length; ++i2)
      cbs.update[i2](oldVnode, vnode2);
      (_d = (_c = vnode2.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode2);
    }
    if (isUndef$1(vnode2.text)) {
      if (isDef$1(oldCh) && isDef$1(ch)) {
        if (oldCh !== ch)
        updateChildren(elm, oldCh, ch, insertedVnodeQueue);
      } else if (isDef$1(ch)) {
        if (isDef$1(oldVnode.text))
        api.setTextContent(elm, "");
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef$1(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef$1(oldVnode.text)) {
        api.setTextContent(elm, "");
      }
    } else if (oldVnode.text !== vnode2.text) {
      if (isDef$1(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vnode2.text);
    }
    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode2);
  }
  return function patch(oldVnode, vnode2) {
    let i2, elm, parent;
    const insertedVnodeQueue = [];
    for (i2 = 0; i2 < cbs.pre.length; ++i2)
    cbs.pre[i2]();
    if (!isVnode$1(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }
    if (sameVnode$1(oldVnode, vnode2)) {
      patchVnode(oldVnode, vnode2, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode2, insertedVnodeQueue);
      if (parent !== null) {
        api.insertBefore(parent, vnode2.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    for (i2 = 0; i2 < insertedVnodeQueue.length; ++i2) {
      insertedVnodeQueue[i2].data.hook.insert(insertedVnodeQueue[i2]);
    }
    for (i2 = 0; i2 < cbs.post.length; ++i2)
    cbs.post[i2]();
    return vnode2;
  };
}
function addNS$2(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== void 0) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== void 0) {
        addNS$2(childData, children[i].children, children[i].sel);
      }
    }
  }
}
function h$2(sel, b, c) {
  var data = {};
  var children;
  var text;
  var i;
  if (c !== void 0) {
    if (b !== null) {
      data = b;
    }
    if (array$2(c)) {
      children = c;
    } else if (primitive$2(c)) {
      text = c;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== void 0 && b !== null) {
    if (array$2(b)) {
      children = b;
    } else if (primitive$2(b)) {
      text = b;
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (children !== void 0) {
    for (i = 0; i < children.length; ++i) {
      if (primitive$2(children[i]))
      children[i] = vnode$2(void 0, void 0, void 0, children[i], void 0);
    }
  }
  if (sel[0] === "s" && sel[1] === "v" && sel[2] === "g" && (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
    addNS$2(data, children, sel);
  }
  return vnode$2(sel, data, children, text, void 0);
}
function copyToThunk$1(vnode2, thunk3) {
  vnode2.data.fn = thunk3.data.fn;
  vnode2.data.args = thunk3.data.args;
  thunk3.data = vnode2.data;
  thunk3.children = vnode2.children;
  thunk3.text = vnode2.text;
  thunk3.elm = vnode2.elm;
}
function init$1$1(thunk3) {
  const cur = thunk3.data;
  const vnode2 = cur.fn.apply(void 0, cur.args);
  copyToThunk$1(vnode2, thunk3);
}
function prepatch$1(oldVnode, thunk3) {
  let i;
  const old = oldVnode.data;
  const cur = thunk3.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk$1(cur.fn.apply(void 0, args), thunk3);
    return;
  }
  for (i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk$1(cur.fn.apply(void 0, args), thunk3);
      return;
    }
  }
  copyToThunk$1(oldVnode, thunk3);
}
const thunk$1 = function thunk2(sel, key, fn, args) {
  if (args === void 0) {
    args = fn;
    fn = key;
    key = void 0;
  }
  return h$2(sel, {
    key,
    hook: { init: init$1$1, prepatch: prepatch$1 },
    fn,
    args });

};
var hyperscriptAttributeToProperty$1 = attributeToProperty$1;
var transform$1 = {
  class: "className",
  for: "htmlFor",
  "http-equiv": "httpEquiv" };

function attributeToProperty$1(h2) {
  return function (tagName2, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform$1) {
        attrs[transform$1[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h2(tagName2, attrs, children);
  };
}
var VAR$1 = 0,TEXT$1 = 1,OPEN$1 = 2,CLOSE$1 = 3,ATTR$1 = 4;
var ATTR_KEY$1 = 5,ATTR_KEY_W$1 = 6;
var ATTR_VALUE_W$1 = 7,ATTR_VALUE$1 = 8;
var ATTR_VALUE_SQ$1 = 9,ATTR_VALUE_DQ$1 = 10;
var ATTR_EQ$1 = 11,ATTR_BREAK$1 = 12;
var COMMENT$1 = 13;
var hyperx$1 = function (h2, opts) {
  if (!opts)
  opts = {};
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b);
  };
  if (opts.attrToProp !== false) {
    h2 = hyperscriptAttributeToProperty$1(h2);
  }
  return function (strings) {
    var state = TEXT$1,reg = "";
    var arglen = arguments.length;
    var parts = [];
    for (var i = 0; i < strings.length; i++) {
      if (i < arglen - 1) {
        var arg = arguments[i + 1];
        var p = parse(strings[i]);
        var xstate = state;
        if (xstate === ATTR_VALUE_DQ$1)
        xstate = ATTR_VALUE$1;
        if (xstate === ATTR_VALUE_SQ$1)
        xstate = ATTR_VALUE$1;
        if (xstate === ATTR_VALUE_W$1)
        xstate = ATTR_VALUE$1;
        if (xstate === ATTR$1)
        xstate = ATTR_KEY$1;
        if (xstate === OPEN$1) {
          if (reg === "/") {
            p.push([OPEN$1, "/", arg]);
            reg = "";
          } else {
            p.push([OPEN$1, arg]);
          }
        } else if (xstate === COMMENT$1 && opts.comments) {
          reg += String(arg);
        } else if (xstate !== COMMENT$1) {
          p.push([VAR$1, xstate, arg]);
        }
        parts.push.apply(parts, p);
      } else
      parts.push.apply(parts, parse(strings[i]));
    }
    var tree = [null, {}, []];
    var stack = [[tree, -1]];
    for (var i = 0; i < parts.length; i++) {
      var cur = stack[stack.length - 1][0];
      var p = parts[i],s = p[0];
      if (s === OPEN$1 && /^\//.test(p[1])) {
        var ix = stack[stack.length - 1][1];
        if (stack.length > 1) {
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h2(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (s === OPEN$1) {
        var c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (s === ATTR_KEY$1 || s === VAR$1 && p[1] === ATTR_KEY$1) {
        var key = "";
        var copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY$1) {
            key = concat(key, parts[i][1]);
          } else if (parts[i][0] === VAR$1 && parts[i][1] === ATTR_KEY$1) {
            if (typeof parts[i][2] === "object" && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey];
                }
              }
            } else {
              key = concat(key, parts[i][2]);
            }
          } else
          break;
        }
        if (parts[i][0] === ATTR_EQ$1)
        i++;
        var j = i;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE$1 || parts[i][0] === ATTR_KEY$1) {
            if (!cur[1][key])
            cur[1][key] = strfn(parts[i][1]);else

            parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR$1 && (parts[i][1] === ATTR_VALUE$1 || parts[i][1] === ATTR_KEY$1)) {
            if (!cur[1][key])
            cur[1][key] = strfn(parts[i][2]);else

            parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j && (parts[i][0] === CLOSE$1 || parts[i][0] === ATTR_BREAK$1)) {
              cur[1][key] = key.toLowerCase();
            }
            if (parts[i][0] === CLOSE$1) {
              i--;
            }
            break;
          }
        }
      } else if (s === ATTR_KEY$1) {
        cur[1][p[1]] = true;
      } else if (s === VAR$1 && p[1] === ATTR_KEY$1) {
        cur[1][p[2]] = true;
      } else if (s === CLOSE$1) {
        if (selfClosing$1(cur[0]) && stack.length) {
          var ix = stack[stack.length - 1][1];
          stack.pop();
          stack[stack.length - 1][0][2][ix] = h2(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (s === VAR$1 && p[1] === TEXT$1) {
        if (p[2] === void 0 || p[2] === null)
        p[2] = "";else
        if (!p[2])
        p[2] = concat("", p[2]);
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2]);
        } else {
          cur[2].push(p[2]);
        }
      } else if (s === TEXT$1) {
        cur[2].push(p[1]);
      } else if (s === ATTR_EQ$1 || s === ATTR_BREAK$1)
      ;else
      {
        throw new Error("unhandled: " + s);
      }
    }
    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift();
    }
    if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
      if (opts.createFragment)
      return opts.createFragment(tree[2]);
      throw new Error("multiple root elements must be wrapped in an enclosing tag");
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h2(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    }
    return tree[2][0];
    function parse(str) {
      var res = [];
      if (state === ATTR_VALUE_W$1)
      state = ATTR$1;
      for (var i2 = 0; i2 < str.length; i2++) {
        var c2 = str.charAt(i2);
        if (state === TEXT$1 && c2 === "<") {
          if (reg.length)
          res.push([TEXT$1, reg]);
          reg = "";
          state = OPEN$1;
        } else if (c2 === ">" && !quot$1(state) && state !== COMMENT$1) {
          if (state === OPEN$1 && reg.length) {
            res.push([OPEN$1, reg]);
          } else if (state === ATTR_KEY$1) {
            res.push([ATTR_KEY$1, reg]);
          } else if (state === ATTR_VALUE$1 && reg.length) {
            res.push([ATTR_VALUE$1, reg]);
          }
          res.push([CLOSE$1]);
          reg = "";
          state = TEXT$1;
        } else if (state === COMMENT$1 && /-$/.test(reg) && c2 === "-") {
          if (opts.comments) {
            res.push([ATTR_VALUE$1, reg.substr(0, reg.length - 1)]);
          }
          reg = "";
          state = TEXT$1;
        } else if (state === OPEN$1 && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN$1, reg], [ATTR_KEY$1, "comment"], [ATTR_EQ$1]);
          }
          reg = c2;
          state = COMMENT$1;
        } else if (state === TEXT$1 || state === COMMENT$1) {
          reg += c2;
        } else if (state === OPEN$1 && c2 === "/" && reg.length)
        ;else
        if (state === OPEN$1 && /\s/.test(c2)) {
          if (reg.length) {
            res.push([OPEN$1, reg]);
          }
          reg = "";
          state = ATTR$1;
        } else if (state === OPEN$1) {
          reg += c2;
        } else if (state === ATTR$1 && /[^\s"'=/]/.test(c2)) {
          state = ATTR_KEY$1;
          reg = c2;
        } else if (state === ATTR$1 && /\s/.test(c2)) {
          if (reg.length)
          res.push([ATTR_KEY$1, reg]);
          res.push([ATTR_BREAK$1]);
        } else if (state === ATTR_KEY$1 && /\s/.test(c2)) {
          res.push([ATTR_KEY$1, reg]);
          reg = "";
          state = ATTR_KEY_W$1;
        } else if (state === ATTR_KEY$1 && c2 === "=") {
          res.push([ATTR_KEY$1, reg], [ATTR_EQ$1]);
          reg = "";
          state = ATTR_VALUE_W$1;
        } else if (state === ATTR_KEY$1) {
          reg += c2;
        } else if ((state === ATTR_KEY_W$1 || state === ATTR$1) && c2 === "=") {
          res.push([ATTR_EQ$1]);
          state = ATTR_VALUE_W$1;
        } else if ((state === ATTR_KEY_W$1 || state === ATTR$1) && !/\s/.test(c2)) {
          res.push([ATTR_BREAK$1]);
          if (/[\w-]/.test(c2)) {
            reg += c2;
            state = ATTR_KEY$1;
          } else
          state = ATTR$1;
        } else if (state === ATTR_VALUE_W$1 && c2 === '"') {
          state = ATTR_VALUE_DQ$1;
        } else if (state === ATTR_VALUE_W$1 && c2 === "'") {
          state = ATTR_VALUE_SQ$1;
        } else if (state === ATTR_VALUE_DQ$1 && c2 === '"') {
          res.push([ATTR_VALUE$1, reg], [ATTR_BREAK$1]);
          reg = "";
          state = ATTR$1;
        } else if (state === ATTR_VALUE_SQ$1 && c2 === "'") {
          res.push([ATTR_VALUE$1, reg], [ATTR_BREAK$1]);
          reg = "";
          state = ATTR$1;
        } else if (state === ATTR_VALUE_W$1 && !/\s/.test(c2)) {
          state = ATTR_VALUE$1;
          i2--;
        } else if (state === ATTR_VALUE$1 && /\s/.test(c2)) {
          res.push([ATTR_VALUE$1, reg], [ATTR_BREAK$1]);
          reg = "";
          state = ATTR$1;
        } else if (state === ATTR_VALUE$1 || state === ATTR_VALUE_SQ$1 || state === ATTR_VALUE_DQ$1) {
          reg += c2;
        }
      }
      if (state === TEXT$1 && reg.length) {
        res.push([TEXT$1, reg]);
        reg = "";
      } else if (state === ATTR_VALUE$1 && reg.length) {
        res.push([ATTR_VALUE$1, reg]);
        reg = "";
      } else if (state === ATTR_VALUE_DQ$1 && reg.length) {
        res.push([ATTR_VALUE$1, reg]);
        reg = "";
      } else if (state === ATTR_VALUE_SQ$1 && reg.length) {
        res.push([ATTR_VALUE$1, reg]);
        reg = "";
      } else if (state === ATTR_KEY$1) {
        res.push([ATTR_KEY$1, reg]);
        reg = "";
      }
      return res;
    }
  };
  function strfn(x) {
    if (typeof x === "function")
    return x;else
    if (typeof x === "string")
    return x;else
    if (x && typeof x === "object")
    return x;else
    if (x === null || x === void 0)
    return x;else

    return concat("", x);
  }
};
function quot$1(state) {
  return state === ATTR_VALUE_SQ$1 || state === ATTR_VALUE_DQ$1;
}
var closeRE$1 = RegExp("^(" + [
"area",
"base",
"basefont",
"bgsound",
"br",
"col",
"command",
"embed",
"frame",
"hr",
"img",
"input",
"isindex",
"keygen",
"link",
"meta",
"param",
"source",
"track",
"wbr",
"!--",
"animate",
"animateTransform",
"circle",
"cursor",
"desc",
"ellipse",
"feBlend",
"feColorMatrix",
"feComposite",
"feConvolveMatrix",
"feDiffuseLighting",
"feDisplacementMap",
"feDistantLight",
"feFlood",
"feFuncA",
"feFuncB",
"feFuncG",
"feFuncR",
"feGaussianBlur",
"feImage",
"feMergeNode",
"feMorphology",
"feOffset",
"fePointLight",
"feSpecularLighting",
"feSpotLight",
"feTile",
"feTurbulence",
"font-face-format",
"font-face-name",
"font-face-uri",
"glyph",
"glyphRef",
"hkern",
"image",
"line",
"missing-glyph",
"mpath",
"path",
"polygon",
"polyline",
"rect",
"set",
"stop",
"tref",
"use",
"view",
"vkern"].
join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
function selfClosing$1(tag) {
  return closeRE$1.test(tag);
}
function create$1(modules, options = {}) {
  const directive = options.directive || "@";
  function createElement2(sel, input, content) {
    if (content && content.length) {
      if (content.length === 1)
      content = content[0];else

      content = [].concat.apply([], content);
    }
    const names = Object.keys(input);
    if (!names || !names.length)
    return h$2(sel, content);
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
          previous[part] = input[name];else
          if (!previous[part])
          previous = previous[part] = {};else

          previous = previous[part];
        }
      } else {
        if (!data.attrs)
        data.attrs = {};
        data.attrs[name] = input[name];
      }
    }
    return h$2(sel, data, content);
  }
  const patch = init$2(modules || []);
  const snabby = hyperx$1(createElement2, { attrToProp: false });
  snabby.update = function update2(dest, src) {
    return patch(dest, src);
  };
  snabby.thunk = thunk$1;
  return snabby;
}
const xlinkNS$1 = "http://www.w3.org/1999/xlink";
const xmlNS$1 = "http://www.w3.org/XML/1998/namespace";
const colonChar$1 = 58;
const xChar$1 = 120;
function updateAttrs$1(oldVnode, vnode2) {
  var key;
  var elm = vnode2.elm;
  var oldAttrs = oldVnode.data.attrs;
  var attrs = vnode2.data.attrs;
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
        if (key.charCodeAt(0) !== xChar$1) {
          elm.setAttribute(key, cur);
        } else if (key.charCodeAt(3) === colonChar$1) {
          elm.setAttributeNS(xmlNS$1, key, cur);
        } else if (key.charCodeAt(5) === colonChar$1) {
          elm.setAttributeNS(xlinkNS$1, key, cur);
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
const attributesModule$1 = { create: updateAttrs$1, update: updateAttrs$1 };
function updateClass$1(oldVnode, vnode2) {
  var cur;
  var name;
  var elm = vnode2.elm;
  var oldClass = oldVnode.data.class;
  var klass = vnode2.data.class;
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
const classModule$1 = { create: updateClass$1, update: updateClass$1 };
function updateProps$1(oldVnode, vnode2) {
  var key;
  var cur;
  var old;
  var elm = vnode2.elm;
  var oldProps = oldVnode.data.props;
  var props = vnode2.data.props;
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
const propsModule$1 = { create: updateProps$1, update: updateProps$1 };
var raf$1 = typeof window !== "undefined" && window.requestAnimationFrame.bind(window) || setTimeout;
var nextFrame$1 = function (fn) {
  raf$1(function () {
    raf$1(fn);
  });
};
var reflowForced$1 = false;
function setNextFrame$1(obj, prop, val) {
  nextFrame$1(function () {
    obj[prop] = val;
  });
}
function updateStyle$1(oldVnode, vnode2) {
  var cur;
  var name;
  var elm = vnode2.elm;
  var oldStyle = oldVnode.data.style;
  var style = vnode2.data.style;
  if (!oldStyle && !style)
  return;
  if (oldStyle === style)
  return;
  oldStyle = oldStyle || {};
  style = style || {};
  var oldHasDel = ("delayed" in oldStyle);
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
          setNextFrame$1(elm.style, name2, cur);
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
function applyDestroyStyle$1(vnode2) {
  var style;
  var name;
  var elm = vnode2.elm;
  var s = vnode2.data.style;
  if (!s || !(style = s.destroy))
  return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
function applyRemoveStyle$1(vnode2, rm) {
  var s = vnode2.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced$1) {
    vnode2.elm.offsetLeft;
    reflowForced$1 = true;
  }
  var name;
  var elm = vnode2.elm;
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
  var props = compStyle["transition-property"].split(", ");
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1)
    amount++;
  }
  elm.addEventListener("transitionend", function (ev) {
    if (ev.target === elm)
    --amount;
    if (amount === 0)
    rm();
  });
}
function forceReflow$1() {
  reflowForced$1 = false;
}
const styleModule$1 = {
  pre: forceReflow$1,
  create: updateStyle$1,
  update: updateStyle$1,
  destroy: applyDestroyStyle$1,
  remove: applyRemoveStyle$1 };

function invokeHandler$1(handler, vnode2, event) {
  if (typeof handler === "function") {
    handler.call(vnode2, event, vnode2);
  } else if (typeof handler === "object") {
    for (var i = 0; i < handler.length; i++) {
      invokeHandler$1(handler[i], vnode2, event);
    }
  }
}
function handleEvent$1(event, vnode2) {
  var name = event.type;
  var on = vnode2.data.on;
  if (on && on[name]) {
    invokeHandler$1(on[name], vnode2, event);
  }
}
function createListener$1() {
  return function handler(event) {
    handleEvent$1(event, handler.vnode);
  };
}
function updateEventListeners$1(oldVnode, vnode2) {
  var oldOn = oldVnode.data.on;
  var oldListener = oldVnode.listener;
  var oldElm = oldVnode.elm;
  var on = vnode2 && vnode2.data.on;
  var elm = vnode2 && vnode2.elm;
  var name;
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
    var listener = vnode2.listener = oldVnode.listener || createListener$1();
    listener.vnode = vnode2;
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
const eventListenersModule$1 = {
  create: updateEventListeners$1,
  update: updateEventListeners$1,
  destroy: updateEventListeners$1 };

var global$1$1$1 = typeof global$1$1 !== "undefined" ? global$1$1 : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};
var MapShim = function () {
  if (typeof Map !== "undefined") {
    return Map;
  }
  function getIndex(arr, key) {
    var result = -1;
    arr.some(function (entry, index2) {
      if (entry[0] === key) {
        result = index2;
        return true;
      }
      return false;
    });
    return result;
  }
  return function () {
    function class_1() {
      this.__entries__ = [];
    }
    Object.defineProperty(class_1.prototype, "size", {
      get: function () {
        return this.__entries__.length;
      },
      enumerable: true,
      configurable: true });

    class_1.prototype.get = function (key) {
      var index2 = getIndex(this.__entries__, key);
      var entry = this.__entries__[index2];
      return entry && entry[1];
    };
    class_1.prototype.set = function (key, value) {
      var index2 = getIndex(this.__entries__, key);
      if (~index2) {
        this.__entries__[index2][1] = value;
      } else {
        this.__entries__.push([key, value]);
      }
    };
    class_1.prototype.delete = function (key) {
      var entries = this.__entries__;
      var index2 = getIndex(entries, key);
      if (~index2) {
        entries.splice(index2, 1);
      }
    };
    class_1.prototype.has = function (key) {
      return !!~getIndex(this.__entries__, key);
    };
    class_1.prototype.clear = function () {
      this.__entries__.splice(0);
    };
    class_1.prototype.forEach = function (callback, ctx) {
      if (ctx === void 0) {
        ctx = null;
      }
      for (var _i = 0, _a = this.__entries__; _i < _a.length; _i++) {
        var entry = _a[_i];
        callback.call(ctx, entry[1], entry[0]);
      }
    };
    return class_1;
  }();
}();
var isBrowser = typeof window !== "undefined" && typeof document !== "undefined" && window.document === document;
var global$1$1$1$1 = function () {
  if (typeof global$1$1$1 !== "undefined" && global$1$1$1.Math === Math) {
    return global$1$1$1;
  }
  if (typeof self !== "undefined" && self.Math === Math) {
    return self;
  }
  if (typeof window !== "undefined" && window.Math === Math) {
    return window;
  }
  return Function("return this")();
}();
var requestAnimationFrame$1 = function () {
  if (typeof requestAnimationFrame === "function") {
    return requestAnimationFrame.bind(global$1$1$1$1);
  }
  return function (callback) {
    return setTimeout(function () {
      return callback(Date.now());
    }, 1e3 / 60);
  };
}();
var trailingTimeout = 2;
function throttle$1(callback, delay) {
  var leadingCall = false,trailingCall = false,lastCallTime = 0;
  function resolvePending() {
    if (leadingCall) {
      leadingCall = false;
      callback();
    }
    if (trailingCall) {
      proxy();
    }
  }
  function timeoutCallback() {
    requestAnimationFrame$1(resolvePending);
  }
  function proxy() {
    var timeStamp = Date.now();
    if (leadingCall) {
      if (timeStamp - lastCallTime < trailingTimeout) {
        return;
      }
      trailingCall = true;
    } else {
      leadingCall = true;
      trailingCall = false;
      setTimeout(timeoutCallback, delay);
    }
    lastCallTime = timeStamp;
  }
  return proxy;
}
var REFRESH_DELAY = 20;
var transitionKeys = ["top", "right", "bottom", "left", "width", "height", "size", "weight"];
var mutationObserverSupported = typeof MutationObserver !== "undefined";
var ResizeObserverController = function () {
  function ResizeObserverController2() {
    this.connected_ = false;
    this.mutationEventsAdded_ = false;
    this.mutationsObserver_ = null;
    this.observers_ = [];
    this.onTransitionEnd_ = this.onTransitionEnd_.bind(this);
    this.refresh = throttle$1(this.refresh.bind(this), REFRESH_DELAY);
  }
  ResizeObserverController2.prototype.addObserver = function (observer2) {
    if (!~this.observers_.indexOf(observer2)) {
      this.observers_.push(observer2);
    }
    if (!this.connected_) {
      this.connect_();
    }
  };
  ResizeObserverController2.prototype.removeObserver = function (observer2) {
    var observers2 = this.observers_;
    var index2 = observers2.indexOf(observer2);
    if (~index2) {
      observers2.splice(index2, 1);
    }
    if (!observers2.length && this.connected_) {
      this.disconnect_();
    }
  };
  ResizeObserverController2.prototype.refresh = function () {
    var changesDetected = this.updateObservers_();
    if (changesDetected) {
      this.refresh();
    }
  };
  ResizeObserverController2.prototype.updateObservers_ = function () {
    var activeObservers = this.observers_.filter(function (observer2) {
      return observer2.gatherActive(), observer2.hasActive();
    });
    activeObservers.forEach(function (observer2) {
      return observer2.broadcastActive();
    });
    return activeObservers.length > 0;
  };
  ResizeObserverController2.prototype.connect_ = function () {
    if (!isBrowser || this.connected_) {
      return;
    }
    document.addEventListener("transitionend", this.onTransitionEnd_);
    window.addEventListener("resize", this.refresh);
    if (mutationObserverSupported) {
      this.mutationsObserver_ = new MutationObserver(this.refresh);
      this.mutationsObserver_.observe(document, {
        attributes: true,
        childList: true,
        characterData: true,
        subtree: true });

    } else {
      document.addEventListener("DOMSubtreeModified", this.refresh);
      this.mutationEventsAdded_ = true;
    }
    this.connected_ = true;
  };
  ResizeObserverController2.prototype.disconnect_ = function () {
    if (!isBrowser || !this.connected_) {
      return;
    }
    document.removeEventListener("transitionend", this.onTransitionEnd_);
    window.removeEventListener("resize", this.refresh);
    if (this.mutationsObserver_) {
      this.mutationsObserver_.disconnect();
    }
    if (this.mutationEventsAdded_) {
      document.removeEventListener("DOMSubtreeModified", this.refresh);
    }
    this.mutationsObserver_ = null;
    this.mutationEventsAdded_ = false;
    this.connected_ = false;
  };
  ResizeObserverController2.prototype.onTransitionEnd_ = function (_a) {
    var _b = _a.propertyName,propertyName = _b === void 0 ? "" : _b;
    var isReflowProperty = transitionKeys.some(function (key) {
      return !!~propertyName.indexOf(key);
    });
    if (isReflowProperty) {
      this.refresh();
    }
  };
  ResizeObserverController2.getInstance = function () {
    if (!this.instance_) {
      this.instance_ = new ResizeObserverController2();
    }
    return this.instance_;
  };
  ResizeObserverController2.instance_ = null;
  return ResizeObserverController2;
}();
var defineConfigurable = function (target, props) {
  for (var _i = 0, _a = Object.keys(props); _i < _a.length; _i++) {
    var key = _a[_i];
    Object.defineProperty(target, key, {
      value: props[key],
      enumerable: false,
      writable: false,
      configurable: true });

  }
  return target;
};
var getWindowOf = function (target) {
  var ownerGlobal = target && target.ownerDocument && target.ownerDocument.defaultView;
  return ownerGlobal || global$1$1$1$1;
};
var emptyRect = createRectInit(0, 0, 0, 0);
function toFloat(value) {
  return parseFloat(value) || 0;
}
function getBordersSize(styles) {
  var positions = [];
  for (var _i = 1; _i < arguments.length; _i++) {
    positions[_i - 1] = arguments[_i];
  }
  return positions.reduce(function (size, position) {
    var value = styles["border-" + position + "-width"];
    return size + toFloat(value);
  }, 0);
}
function getPaddings(styles) {
  var positions = ["top", "right", "bottom", "left"];
  var paddings = {};
  for (var _i = 0, positions_1 = positions; _i < positions_1.length; _i++) {
    var position = positions_1[_i];
    var value = styles["padding-" + position];
    paddings[position] = toFloat(value);
  }
  return paddings;
}
function getSVGContentRect(target) {
  var bbox = target.getBBox();
  return createRectInit(0, 0, bbox.width, bbox.height);
}
function getHTMLElementContentRect(target) {
  var clientWidth = target.clientWidth,clientHeight = target.clientHeight;
  if (!clientWidth && !clientHeight) {
    return emptyRect;
  }
  var styles = getWindowOf(target).getComputedStyle(target);
  var paddings = getPaddings(styles);
  var horizPad = paddings.left + paddings.right;
  var vertPad = paddings.top + paddings.bottom;
  var width = toFloat(styles.width),height = toFloat(styles.height);
  if (styles.boxSizing === "border-box") {
    if (Math.round(width + horizPad) !== clientWidth) {
      width -= getBordersSize(styles, "left", "right") + horizPad;
    }
    if (Math.round(height + vertPad) !== clientHeight) {
      height -= getBordersSize(styles, "top", "bottom") + vertPad;
    }
  }
  if (!isDocumentElement(target)) {
    var vertScrollbar = Math.round(width + horizPad) - clientWidth;
    var horizScrollbar = Math.round(height + vertPad) - clientHeight;
    if (Math.abs(vertScrollbar) !== 1) {
      width -= vertScrollbar;
    }
    if (Math.abs(horizScrollbar) !== 1) {
      height -= horizScrollbar;
    }
  }
  return createRectInit(paddings.left, paddings.top, width, height);
}
var isSVGGraphicsElement = function () {
  if (typeof SVGGraphicsElement !== "undefined") {
    return function (target) {
      return target instanceof getWindowOf(target).SVGGraphicsElement;
    };
  }
  return function (target) {
    return target instanceof getWindowOf(target).SVGElement && typeof target.getBBox === "function";
  };
}();
function isDocumentElement(target) {
  return target === getWindowOf(target).document.documentElement;
}
function getContentRect(target) {
  if (!isBrowser) {
    return emptyRect;
  }
  if (isSVGGraphicsElement(target)) {
    return getSVGContentRect(target);
  }
  return getHTMLElementContentRect(target);
}
function createReadOnlyRect(_a) {
  var x = _a.x,y = _a.y,width = _a.width,height = _a.height;
  var Constr = typeof DOMRectReadOnly !== "undefined" ? DOMRectReadOnly : Object;
  var rect = Object.create(Constr.prototype);
  defineConfigurable(rect, {
    x,
    y,
    width,
    height,
    top: y,
    right: x + width,
    bottom: height + y,
    left: x });

  return rect;
}
function createRectInit(x, y, width, height) {
  return { x, y, width, height };
}
var ResizeObservation = function () {
  function ResizeObservation2(target) {
    this.broadcastWidth = 0;
    this.broadcastHeight = 0;
    this.contentRect_ = createRectInit(0, 0, 0, 0);
    this.target = target;
  }
  ResizeObservation2.prototype.isActive = function () {
    var rect = getContentRect(this.target);
    this.contentRect_ = rect;
    return rect.width !== this.broadcastWidth || rect.height !== this.broadcastHeight;
  };
  ResizeObservation2.prototype.broadcastRect = function () {
    var rect = this.contentRect_;
    this.broadcastWidth = rect.width;
    this.broadcastHeight = rect.height;
    return rect;
  };
  return ResizeObservation2;
}();
var ResizeObserverEntry = function () {
  function ResizeObserverEntry2(target, rectInit) {
    var contentRect = createReadOnlyRect(rectInit);
    defineConfigurable(this, { target, contentRect });
  }
  return ResizeObserverEntry2;
}();
var ResizeObserverSPI = function () {
  function ResizeObserverSPI2(callback, controller, callbackCtx) {
    this.activeObservations_ = [];
    this.observations_ = new MapShim();
    if (typeof callback !== "function") {
      throw new TypeError("The callback provided as parameter 1 is not a function.");
    }
    this.callback_ = callback;
    this.controller_ = controller;
    this.callbackCtx_ = callbackCtx;
  }
  ResizeObserverSPI2.prototype.observe = function (target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (observations.has(target)) {
      return;
    }
    observations.set(target, new ResizeObservation(target));
    this.controller_.addObserver(this);
    this.controller_.refresh();
  };
  ResizeObserverSPI2.prototype.unobserve = function (target) {
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    if (typeof Element === "undefined" || !(Element instanceof Object)) {
      return;
    }
    if (!(target instanceof getWindowOf(target).Element)) {
      throw new TypeError('parameter 1 is not of type "Element".');
    }
    var observations = this.observations_;
    if (!observations.has(target)) {
      return;
    }
    observations.delete(target);
    if (!observations.size) {
      this.controller_.removeObserver(this);
    }
  };
  ResizeObserverSPI2.prototype.disconnect = function () {
    this.clearActive();
    this.observations_.clear();
    this.controller_.removeObserver(this);
  };
  ResizeObserverSPI2.prototype.gatherActive = function () {
    var _this = this;
    this.clearActive();
    this.observations_.forEach(function (observation) {
      if (observation.isActive()) {
        _this.activeObservations_.push(observation);
      }
    });
  };
  ResizeObserverSPI2.prototype.broadcastActive = function () {
    if (!this.hasActive()) {
      return;
    }
    var ctx = this.callbackCtx_;
    var entries = this.activeObservations_.map(function (observation) {
      return new ResizeObserverEntry(observation.target, observation.broadcastRect());
    });
    this.callback_.call(ctx, entries, ctx);
    this.clearActive();
  };
  ResizeObserverSPI2.prototype.clearActive = function () {
    this.activeObservations_.splice(0);
  };
  ResizeObserverSPI2.prototype.hasActive = function () {
    return this.activeObservations_.length > 0;
  };
  return ResizeObserverSPI2;
}();
var observers = typeof WeakMap !== "undefined" ? new WeakMap() : new MapShim();
var ResizeObserver = function () {
  function ResizeObserver2(callback) {
    if (!(this instanceof ResizeObserver2)) {
      throw new TypeError("Cannot call a class as a function.");
    }
    if (!arguments.length) {
      throw new TypeError("1 argument required, but only 0 present.");
    }
    var controller = ResizeObserverController.getInstance();
    var observer2 = new ResizeObserverSPI(callback, controller, this);
    observers.set(this, observer2);
  }
  return ResizeObserver2;
}();
[
"observe",
"unobserve",
"disconnect"].
forEach(function (method) {
  ResizeObserver.prototype[method] = function () {
    var _a;
    return (_a = observers.get(this))[method].apply(_a, arguments);
  };
});
var index$1 = function () {
  if (typeof global$1$1$1$1.ResizeObserver !== "undefined") {
    return global$1$1$1$1.ResizeObserver;
  }
  return ResizeObserver;
}();
const observer = new index$1(function (entries) {
  for (const entry of entries) {
    const breakpoints = JSON.parse(entry.target.dataset.breakpoints);
    let prev;
    let highWaterMark = 0;
    for (const breakpoint of Object.keys(breakpoints)) {
      const minWidth = breakpoints[breakpoint];
      if (entry.contentRect.width >= minWidth && minWidth > highWaterMark) {
        entry.target.classList.add(breakpoint);
        highWaterMark = minWidth;
        if (prev)
        entry.target.classList.remove(prev);
      } else {
        entry.target.classList.remove(breakpoint);
      }
      prev = breakpoint;
    }
  }
});
function update$1(oldVnode, vnode2) {
  if (vnode2.elm.dataset.breakpoints) {
    try {
      JSON.parse(vnode2.elm.dataset.breakpoints);
      observer.observe(vnode2.elm);
    } catch (er) {
    }
  } else {
    observer.unobserve(vnode2.elm);
  }
}
function destroy(vnode2) {
  observer.unobserve(vnode2.elm);
}
var containerQueryModule = {
  create: update$1,
  update: update$1,
  destroy };

var index$1$1 = create$1([
attributesModule$1,
eventListenersModule$1,
classModule$1,
propsModule$1,
styleModule$1,
containerQueryModule]);

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
  const x = Math.max(0, value - start);
  return x / length;
}
function vnode(sel, data, children, text, elm) {
  const key = data === void 0 ? void 0 : data.key;
  return { sel, data, children, text, elm, key };
}
const array = Array.isArray;
function primitive(s) {
  return typeof s === "string" || typeof s === "number";
}
function createElement(tagName2) {
  return document.createElement(tagName2);
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
function insertBefore(parentNode2, newNode, referenceNode) {
  parentNode2.insertBefore(newNode, referenceNode);
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
  return s === void 0;
}
function isDef(s) {
  return s !== void 0;
}
const emptyNode = vnode("", {}, [], void 0, void 0);
function sameVnode(vnode1, vnode2) {
  return vnode1.key === vnode2.key && vnode1.sel === vnode2.sel;
}
function isVnode(vnode2) {
  return vnode2.sel !== void 0;
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
const hooks = ["create", "update", "remove", "destroy", "pre", "post"];
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

  const api = domApi !== void 0 ? domApi : htmlDomApi;
  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      const hook = modules[j][hooks[i]];
      if (hook !== void 0) {
        cbs[hooks[i]].push(hook);
      }
    }
  }
  function emptyNodeAt(elm) {
    const id = elm.id ? "#" + elm.id : "";
    const c = elm.className ? "." + elm.className.split(" ").join(".") : "";
    return vnode(api.tagName(elm).toLowerCase() + id + c, {}, [], void 0, elm);
  }
  function createRmCb(childElm, listeners) {
    return function rmCb() {
      if (--listeners === 0) {
        const parent = api.parentNode(childElm);
        api.removeChild(parent, childElm);
      }
    };
  }
  function createElm(vnode2, insertedVnodeQueue) {
    var _a, _b;
    let i2;
    let data = vnode2.data;
    if (data !== void 0) {
      const init2 = (_a = data.hook) === null || _a === void 0 ? void 0 : _a.init;
      if (isDef(init2)) {
        init2(vnode2);
        data = vnode2.data;
      }
    }
    const children = vnode2.children;
    const sel = vnode2.sel;
    if (sel === "!") {
      if (isUndef(vnode2.text)) {
        vnode2.text = "";
      }
      vnode2.elm = api.createComment(vnode2.text);
    } else if (sel !== void 0) {
      const hashIdx = sel.indexOf("#");
      const dotIdx = sel.indexOf(".", hashIdx);
      const hash = hashIdx > 0 ? hashIdx : sel.length;
      const dot = dotIdx > 0 ? dotIdx : sel.length;
      const tag = hashIdx !== -1 || dotIdx !== -1 ? sel.slice(0, Math.min(hash, dot)) : sel;
      const elm = vnode2.elm = isDef(data) && isDef(i2 = data.ns) ? api.createElementNS(i2, tag) : api.createElement(tag);
      if (hash < dot)
      elm.setAttribute("id", sel.slice(hash + 1, dot));
      if (dotIdx > 0)
      elm.setAttribute("class", sel.slice(dot + 1).replace(/\./g, " "));
      for (i2 = 0; i2 < cbs.create.length; ++i2)
      cbs.create[i2](emptyNode, vnode2);
      if (array(children)) {
        for (i2 = 0; i2 < children.length; ++i2) {
          const ch = children[i2];
          if (ch != null) {
            api.appendChild(elm, createElm(ch, insertedVnodeQueue));
          }
        }
      } else if (primitive(vnode2.text)) {
        api.appendChild(elm, api.createTextNode(vnode2.text));
      }
      const hook = vnode2.data.hook;
      if (isDef(hook)) {
        (_b = hook.create) === null || _b === void 0 ? void 0 : _b.call(hook, emptyNode, vnode2);
        if (hook.insert) {
          insertedVnodeQueue.push(vnode2);
        }
      }
    } else {
      vnode2.elm = api.createTextNode(vnode2.text);
    }
    return vnode2.elm;
  }
  function addVnodes(parentElm, before, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      const ch = vnodes[startIdx];
      if (ch != null) {
        api.insertBefore(parentElm, createElm(ch, insertedVnodeQueue), before);
      }
    }
  }
  function invokeDestroyHook(vnode2) {
    var _a, _b;
    const data = vnode2.data;
    if (data !== void 0) {
      (_b = (_a = data === null || data === void 0 ? void 0 : data.hook) === null || _a === void 0 ? void 0 : _a.destroy) === null || _b === void 0 ? void 0 : _b.call(_a, vnode2);
      for (let i2 = 0; i2 < cbs.destroy.length; ++i2)
      cbs.destroy[i2](vnode2);
      if (vnode2.children !== void 0) {
        for (let j2 = 0; j2 < vnode2.children.length; ++j2) {
          const child = vnode2.children[j2];
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
          for (let i2 = 0; i2 < cbs.remove.length; ++i2)
          cbs.remove[i2](ch, rm);
          const removeHook = (_b = (_a = ch === null || ch === void 0 ? void 0 : ch.data) === null || _a === void 0 ? void 0 : _a.hook) === null || _b === void 0 ? void 0 : _b.remove;
          if (isDef(removeHook)) {
            removeHook(ch, rm);
          } else {
            rm();
          }
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
    if (oldStartIdx <= oldEndIdx || newStartIdx <= newEndIdx) {
      if (oldStartIdx > oldEndIdx) {
        before = newCh[newEndIdx + 1] == null ? null : newCh[newEndIdx + 1].elm;
        addVnodes(parentElm, before, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
      } else {
        removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
      }
    }
  }
  function patchVnode(oldVnode, vnode2, insertedVnodeQueue) {
    var _a, _b, _c, _d, _e;
    const hook = (_a = vnode2.data) === null || _a === void 0 ? void 0 : _a.hook;
    (_b = hook === null || hook === void 0 ? void 0 : hook.prepatch) === null || _b === void 0 ? void 0 : _b.call(hook, oldVnode, vnode2);
    const elm = vnode2.elm = oldVnode.elm;
    const oldCh = oldVnode.children;
    const ch = vnode2.children;
    if (oldVnode === vnode2)
    return;
    if (vnode2.data !== void 0) {
      for (let i2 = 0; i2 < cbs.update.length; ++i2)
      cbs.update[i2](oldVnode, vnode2);
      (_d = (_c = vnode2.data.hook) === null || _c === void 0 ? void 0 : _c.update) === null || _d === void 0 ? void 0 : _d.call(_c, oldVnode, vnode2);
    }
    if (isUndef(vnode2.text)) {
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
    } else if (oldVnode.text !== vnode2.text) {
      if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      }
      api.setTextContent(elm, vnode2.text);
    }
    (_e = hook === null || hook === void 0 ? void 0 : hook.postpatch) === null || _e === void 0 ? void 0 : _e.call(hook, oldVnode, vnode2);
  }
  return function patch(oldVnode, vnode2) {
    let i2, elm, parent;
    const insertedVnodeQueue = [];
    for (i2 = 0; i2 < cbs.pre.length; ++i2)
    cbs.pre[i2]();
    if (!isVnode(oldVnode)) {
      oldVnode = emptyNodeAt(oldVnode);
    }
    if (sameVnode(oldVnode, vnode2)) {
      patchVnode(oldVnode, vnode2, insertedVnodeQueue);
    } else {
      elm = oldVnode.elm;
      parent = api.parentNode(elm);
      createElm(vnode2, insertedVnodeQueue);
      if (parent !== null) {
        api.insertBefore(parent, vnode2.elm, api.nextSibling(elm));
        removeVnodes(parent, [oldVnode], 0, 0);
      }
    }
    for (i2 = 0; i2 < insertedVnodeQueue.length; ++i2) {
      insertedVnodeQueue[i2].data.hook.insert(insertedVnodeQueue[i2]);
    }
    for (i2 = 0; i2 < cbs.post.length; ++i2)
    cbs.post[i2]();
    return vnode2;
  };
}
function addNS(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== void 0) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== void 0) {
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
  if (c !== void 0) {
    if (b !== null) {
      data = b;
    }
    if (array(c)) {
      children = c;
    } else if (primitive(c)) {
      text = c;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== void 0 && b !== null) {
    if (array(b)) {
      children = b;
    } else if (primitive(b)) {
      text = b;
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
function copyToThunk(vnode2, thunk3) {
  vnode2.data.fn = thunk3.data.fn;
  vnode2.data.args = thunk3.data.args;
  thunk3.data = vnode2.data;
  thunk3.children = vnode2.children;
  thunk3.text = vnode2.text;
  thunk3.elm = vnode2.elm;
}
function init$1(thunk3) {
  const cur = thunk3.data;
  const vnode2 = cur.fn.apply(void 0, cur.args);
  copyToThunk(vnode2, thunk3);
}
function prepatch(oldVnode, thunk3) {
  let i;
  const old = oldVnode.data;
  const cur = thunk3.data;
  const oldArgs = old.args;
  const args = cur.args;
  if (old.fn !== cur.fn || oldArgs.length !== args.length) {
    copyToThunk(cur.fn.apply(void 0, args), thunk3);
    return;
  }
  for (i = 0; i < args.length; ++i) {
    if (oldArgs[i] !== args[i]) {
      copyToThunk(cur.fn.apply(void 0, args), thunk3);
      return;
    }
  }
  copyToThunk(oldVnode, thunk3);
}
const thunk = function thunk2(sel, key, fn, args) {
  if (args === void 0) {
    args = fn;
    fn = key;
    key = void 0;
  }
  return h(sel, {
    key,
    hook: { init: init$1, prepatch },
    fn,
    args });

};
var hyperscriptAttributeToProperty = attributeToProperty;
var transform = {
  class: "className",
  for: "htmlFor",
  "http-equiv": "httpEquiv" };

function attributeToProperty(h2) {
  return function (tagName2, attrs, children) {
    for (var attr in attrs) {
      if (attr in transform) {
        attrs[transform[attr]] = attrs[attr];
        delete attrs[attr];
      }
    }
    return h2(tagName2, attrs, children);
  };
}
var VAR = 0,TEXT = 1,OPEN = 2,CLOSE = 3,ATTR = 4;
var ATTR_KEY = 5,ATTR_KEY_W = 6;
var ATTR_VALUE_W = 7,ATTR_VALUE = 8;
var ATTR_VALUE_SQ = 9,ATTR_VALUE_DQ = 10;
var ATTR_EQ = 11,ATTR_BREAK = 12;
var COMMENT = 13;
var hyperx = function (h2, opts) {
  if (!opts)
  opts = {};
  var concat = opts.concat || function (a, b) {
    return String(a) + String(b);
  };
  if (opts.attrToProp !== false) {
    h2 = hyperscriptAttributeToProperty(h2);
  }
  return function (strings) {
    var state = TEXT,reg = "";
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
      } else
      parts.push.apply(parts, parse(strings[i]));
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
          stack[stack.length - 1][0][2][ix] = h2(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (s === OPEN) {
        var c = [p[1], {}, []];
        cur[2].push(c);
        stack.push([c, cur[2].length - 1]);
      } else if (s === ATTR_KEY || s === VAR && p[1] === ATTR_KEY) {
        var key = "";
        var copyKey;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_KEY) {
            key = concat(key, parts[i][1]);
          } else if (parts[i][0] === VAR && parts[i][1] === ATTR_KEY) {
            if (typeof parts[i][2] === "object" && !key) {
              for (copyKey in parts[i][2]) {
                if (parts[i][2].hasOwnProperty(copyKey) && !cur[1][copyKey]) {
                  cur[1][copyKey] = parts[i][2][copyKey];
                }
              }
            } else {
              key = concat(key, parts[i][2]);
            }
          } else
          break;
        }
        if (parts[i][0] === ATTR_EQ)
        i++;
        var j = i;
        for (; i < parts.length; i++) {
          if (parts[i][0] === ATTR_VALUE || parts[i][0] === ATTR_KEY) {
            if (!cur[1][key])
            cur[1][key] = strfn(parts[i][1]);else

            parts[i][1] === "" || (cur[1][key] = concat(cur[1][key], parts[i][1]));
          } else if (parts[i][0] === VAR && (parts[i][1] === ATTR_VALUE || parts[i][1] === ATTR_KEY)) {
            if (!cur[1][key])
            cur[1][key] = strfn(parts[i][2]);else

            parts[i][2] === "" || (cur[1][key] = concat(cur[1][key], parts[i][2]));
          } else {
            if (key.length && !cur[1][key] && i === j && (parts[i][0] === CLOSE || parts[i][0] === ATTR_BREAK)) {
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
          stack[stack.length - 1][0][2][ix] = h2(cur[0], cur[1], cur[2].length ? cur[2] : void 0);
        }
      } else if (s === VAR && p[1] === TEXT) {
        if (p[2] === void 0 || p[2] === null)
        p[2] = "";else
        if (!p[2])
        p[2] = concat("", p[2]);
        if (Array.isArray(p[2][0])) {
          cur[2].push.apply(cur[2], p[2]);
        } else {
          cur[2].push(p[2]);
        }
      } else if (s === TEXT) {
        cur[2].push(p[1]);
      } else if (s === ATTR_EQ || s === ATTR_BREAK)
      ;else
      {
        throw new Error("unhandled: " + s);
      }
    }
    if (tree[2].length > 1 && /^\s*$/.test(tree[2][0])) {
      tree[2].shift();
    }
    if (tree[2].length > 2 || tree[2].length === 2 && /\S/.test(tree[2][1])) {
      if (opts.createFragment)
      return opts.createFragment(tree[2]);
      throw new Error("multiple root elements must be wrapped in an enclosing tag");
    }
    if (Array.isArray(tree[2][0]) && typeof tree[2][0][0] === "string" && Array.isArray(tree[2][0][2])) {
      tree[2][0] = h2(tree[2][0][0], tree[2][0][1], tree[2][0][2]);
    }
    return tree[2][0];
    function parse(str) {
      var res = [];
      if (state === ATTR_VALUE_W)
      state = ATTR;
      for (var i2 = 0; i2 < str.length; i2++) {
        var c2 = str.charAt(i2);
        if (state === TEXT && c2 === "<") {
          if (reg.length)
          res.push([TEXT, reg]);
          reg = "";
          state = OPEN;
        } else if (c2 === ">" && !quot(state) && state !== COMMENT) {
          if (state === OPEN && reg.length) {
            res.push([OPEN, reg]);
          } else if (state === ATTR_KEY) {
            res.push([ATTR_KEY, reg]);
          } else if (state === ATTR_VALUE && reg.length) {
            res.push([ATTR_VALUE, reg]);
          }
          res.push([CLOSE]);
          reg = "";
          state = TEXT;
        } else if (state === COMMENT && /-$/.test(reg) && c2 === "-") {
          if (opts.comments) {
            res.push([ATTR_VALUE, reg.substr(0, reg.length - 1)]);
          }
          reg = "";
          state = TEXT;
        } else if (state === OPEN && /^!--$/.test(reg)) {
          if (opts.comments) {
            res.push([OPEN, reg], [ATTR_KEY, "comment"], [ATTR_EQ]);
          }
          reg = c2;
          state = COMMENT;
        } else if (state === TEXT || state === COMMENT) {
          reg += c2;
        } else if (state === OPEN && c2 === "/" && reg.length)
        ;else
        if (state === OPEN && /\s/.test(c2)) {
          if (reg.length) {
            res.push([OPEN, reg]);
          }
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
          } else
          state = ATTR;
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
  function strfn(x) {
    if (typeof x === "function")
    return x;else
    if (typeof x === "string")
    return x;else
    if (x && typeof x === "object")
    return x;else
    if (x === null || x === void 0)
    return x;else

    return concat("", x);
  }
};
function quot(state) {
  return state === ATTR_VALUE_SQ || state === ATTR_VALUE_DQ;
}
var closeRE = RegExp("^(" + [
"area",
"base",
"basefont",
"bgsound",
"br",
"col",
"command",
"embed",
"frame",
"hr",
"img",
"input",
"isindex",
"keygen",
"link",
"meta",
"param",
"source",
"track",
"wbr",
"!--",
"animate",
"animateTransform",
"circle",
"cursor",
"desc",
"ellipse",
"feBlend",
"feColorMatrix",
"feComposite",
"feConvolveMatrix",
"feDiffuseLighting",
"feDisplacementMap",
"feDistantLight",
"feFlood",
"feFuncA",
"feFuncB",
"feFuncG",
"feFuncR",
"feGaussianBlur",
"feImage",
"feMergeNode",
"feMorphology",
"feOffset",
"fePointLight",
"feSpecularLighting",
"feSpotLight",
"feTile",
"feTurbulence",
"font-face-format",
"font-face-name",
"font-face-uri",
"glyph",
"glyphRef",
"hkern",
"image",
"line",
"missing-glyph",
"mpath",
"path",
"polygon",
"polyline",
"rect",
"set",
"stop",
"tref",
"use",
"view",
"vkern"].
join("|") + ")(?:[.#][a-zA-Z0-9\x7F-\uFFFF_:-]+)*$");
function selfClosing(tag) {
  return closeRE.test(tag);
}
function create(modules, options = {}) {
  const directive = options.directive || "@";
  function createElement2(sel, input, content) {
    if (content && content.length) {
      if (content.length === 1)
      content = content[0];else

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
          previous[part] = input[name];else
          if (!previous[part])
          previous = previous[part] = {};else

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
  const snabby = hyperx(createElement2, { attrToProp: false });
  snabby.update = function update(dest, src) {
    return patch(dest, src);
  };
  snabby.thunk = thunk;
  return snabby;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
const xmlNS = "http://www.w3.org/XML/1998/namespace";
const colonChar = 58;
const xChar = 120;
function updateAttrs(oldVnode, vnode2) {
  var key;
  var elm = vnode2.elm;
  var oldAttrs = oldVnode.data.attrs;
  var attrs = vnode2.data.attrs;
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
const attributesModule = { create: updateAttrs, update: updateAttrs };
function updateClass(oldVnode, vnode2) {
  var cur;
  var name;
  var elm = vnode2.elm;
  var oldClass = oldVnode.data.class;
  var klass = vnode2.data.class;
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
const classModule = { create: updateClass, update: updateClass };
function updateProps(oldVnode, vnode2) {
  var key;
  var cur;
  var old;
  var elm = vnode2.elm;
  var oldProps = oldVnode.data.props;
  var props = vnode2.data.props;
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
const propsModule = { create: updateProps, update: updateProps };
var raf = typeof window !== "undefined" && window.requestAnimationFrame.bind(window) || setTimeout;
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
function updateStyle(oldVnode, vnode2) {
  var cur;
  var name;
  var elm = vnode2.elm;
  var oldStyle = oldVnode.data.style;
  var style = vnode2.data.style;
  if (!oldStyle && !style)
  return;
  if (oldStyle === style)
  return;
  oldStyle = oldStyle || {};
  style = style || {};
  var oldHasDel = ("delayed" in oldStyle);
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
function applyDestroyStyle(vnode2) {
  var style;
  var name;
  var elm = vnode2.elm;
  var s = vnode2.data.style;
  if (!s || !(style = s.destroy))
  return;
  for (name in style) {
    elm.style[name] = style[name];
  }
}
function applyRemoveStyle(vnode2, rm) {
  var s = vnode2.data.style;
  if (!s || !s.remove) {
    rm();
    return;
  }
  if (!reflowForced) {
    vnode2.elm.offsetLeft;
    reflowForced = true;
  }
  var name;
  var elm = vnode2.elm;
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
  var props = compStyle["transition-property"].split(", ");
  for (; i < props.length; ++i) {
    if (applied.indexOf(props[i]) !== -1)
    amount++;
  }
  elm.addEventListener("transitionend", function (ev) {
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

function invokeHandler(handler, vnode2, event) {
  if (typeof handler === "function") {
    handler.call(vnode2, event, vnode2);
  } else if (typeof handler === "object") {
    for (var i = 0; i < handler.length; i++) {
      invokeHandler(handler[i], vnode2, event);
    }
  }
}
function handleEvent(event, vnode2) {
  var name = event.type;
  var on = vnode2.data.on;
  if (on && on[name]) {
    invokeHandler(on[name], vnode2, event);
  }
}
function createListener() {
  return function handler(event) {
    handleEvent(event, handler.vnode);
  };
}
function updateEventListeners(oldVnode, vnode2) {
  var oldOn = oldVnode.data.on;
  var oldListener = oldVnode.listener;
  var oldElm = oldVnode.elm;
  var on = vnode2 && vnode2.data.on;
  var elm = vnode2 && vnode2.elm;
  var name;
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
    var listener = vnode2.listener = oldVnode.listener || createListener();
    listener.vnode = vnode2;
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
const eventListenersModule = {
  create: updateEventListeners,
  update: updateEventListeners,
  destroy: updateEventListeners };

var index = create([
attributesModule,
eventListenersModule,
classModule,
propsModule,
styleModule]);

function lerp(a, b, t) {
  return a + (b - a) * t;
}
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global$1 !== "undefined" ? global$1 : typeof self !== "undefined" ? self : {};
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
function throttle(func, wait, options) {
  var leading = true,trailing = true;
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
    trailing });

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
var lodash_throttle = throttle;
const DOT_WIDTH = 4;
const FPS = 60;
function getTimePeriodData(graph) {
  return graph.data.filter(dataPoint => {
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
  if (graph.renderValueLabel && graph.selection.type === "value")
  bottomMargin += 30;
  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model.width - leftMargin - rightMargin;
  return {
    leftMargin,
    rightMargin,
    bottomMargin,
    graphHeight,
    graphWidth };

}
function verticalGridLinesMinor(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return;
  const m = getGraphMetrics(model, graph);
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  const { ctx } = graph;
  ctx.lineWidth = 1;
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
  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth);
    if (graph.selection.dragging === "time") {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.time = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
    } else if (graph.selection.dragging === "start") {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.start > graph.selection.end)
      graph.selection.start = graph.selection.end;
    } else if (graph.selection.dragging === "end") {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.end < graph.selection.start)
      graph.selection.end = graph.selection.start;
    }
    update();
  }, 1e3 / FPS);
  const _mouseUp = function (ev) {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update();
  };
  const _mouseDown = function (ev) {
    let draggingType;
    if (graph.selection?.type === "range" && ev.offsetY <= 21) {
      const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
      const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);
      const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;
      const x2 = endX * (m.graphWidth - dotWidth) + m.leftMargin;
      if (Math.abs(ev.offsetX - x) < 10) {
        draggingType = "start";
      } else if (Math.abs(ev.offsetX - x2) < 10) {
        draggingType = "end";
      }
    } else if (graph.selection?.type === "value") {
      const m2 = getGraphMetrics(model, graph);
      if (ev.offsetY >= m2.graphHeight + 10)
      draggingType = "time";
    }
    graph.selection.dragging = draggingType;
    if (draggingType) {
      document.addEventListener("mousemove", _mouseMove, { passive: true });
      document.addEventListener("mouseup", _mouseUp);
      update();
    }
  };
  const _insertHook = function (vnode2) {
    model.elm = vnode2.elm;
    graph.ctx = vnode2.elm.getContext("2d");
  };
  if (graph.ctx) {
    graph.ctx.clearRect(0, 0, model.elm.width, model.elm.height);
    verticalGridLinesMinor(model, graph);
    verticalGridLinesMajor(model, graph);
    gridLines(model, graph);
    graph.ctx.beginPath();
    graph.ctx.strokeStyle = "#888";
    graph.ctx.lineWidth = 1;
    graph.ctx.moveTo(m.leftMargin + 0.5, m.graphHeight - 0.5);
    graph.ctx.lineTo(m.leftMargin + m.graphWidth + 0.5, m.graphHeight - 0.5);
    graph.ctx.stroke();
    if (graph.renderTicks) {
      tickMarksComponent(model, graph);
      tickLabelsComponent(model, graph);
    }
    graph.ctx.strokeStyle = graph.dataColor;
    if (graph.type === "scatterPlot")
    renderScatterPlotGraph(model, graph, dotWidth);else

    renderLinePlotGraph(model, graph, dotWidth);
    timeSelectionComponent(model, graph);
    renderLabelComponent(model, graph);
  }
  if (!graph.key)
  graph.key = "u" + Math.floor(Math.random() * 9999999);
  return index`<canvas width="${model.width}"
                        height="${graph.height}"
                        @hook:insert=${_insertHook}
                        @key=${graph.key}
                        style="height: ${graph.height}px; width: 100%; padding-top: 10px; background-color: white; image-rendering: pixelated"
                        @style:cursor=${graph.selection.dragging ? "ew-resize" : "inherit"}
                        @on:mousedown=${_mouseDown}></canvas>`;
}
function renderLabelComponent(model, graph, update) {
  const { ctx } = graph;
  const m = getGraphMetrics(model, graph);
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  if (graph.renderValueLabel && graph.selection.type === "value") {
    ctx.textAlign = "start";
    const t = (graph.selection.time === Infinity ? graph.timeRange.end : graph.selection.time).toFixed(1);
    ctx.fillText(`t: ${t}s`, 2, m.graphHeight + m.bottomMargin - 8);
  }
  ctx.textAlign = "end";
  ctx.fillText(graph.label, m.graphWidth + m.leftMargin - DOT_WIDTH, 12);
}
function tickMarksComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);
  const { ctx } = graph;
  const constPixelsPerTick = 6;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#888";
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
function timeSelectionComponent(model, graph, update) {
  if (graph.selection.type === "range")
  timeRangeSelectionComponent(model, graph);
  if (graph.selection.type === "value")
  timeValueSelectionComponent(model, graph);
}
function timeRangeSelectionComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);
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
  [0, 8]];

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
  ctx.strokeStyle = "rgb(255,64,129)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 0.5, 0);
  ctx.lineTo(x - 0.5, m.graphHeight);
  ctx.stroke();
}
function timelineComponent(model, update) {
  const _insertHook = function (vnode2) {
    model.container = vnode2;
  };
  if (model.container)
  model.width = model.container.elm ? model.container.elm.offsetWidth : model.container.offsetWidth;
  return index`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: ${model.border || "none"};">
            ${model.graphs.map(g => graphComponent(model, g, update))}
        </div>`;
}
function vnode$1(sel, data, children, text, elm) {
  const key = data === void 0 ? void 0 : data.key;
  return { sel, data, children, text, elm, key };
}
const array$1 = Array.isArray;
function primitive$1(s) {
  return typeof s === "string" || typeof s === "number";
}
function addNS$1(data, children, sel) {
  data.ns = "http://www.w3.org/2000/svg";
  if (sel !== "foreignObject" && children !== void 0) {
    for (let i = 0; i < children.length; ++i) {
      const childData = children[i].data;
      if (childData !== void 0) {
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
  if (c !== void 0) {
    if (b !== null) {
      data = b;
    }
    if (array$1(c)) {
      children = c;
    } else if (primitive$1(c)) {
      text = c;
    } else if (c && c.sel) {
      children = [c];
    }
  } else if (b !== void 0 && b !== null) {
    if (array$1(b)) {
      children = b;
    } else if (primitive$1(b)) {
      text = b;
    } else if (b && b.sel) {
      children = [b];
    } else {
      data = b;
    }
  }
  if (children !== void 0) {
    for (i = 0; i < children.length; ++i) {
      if (primitive$1(children[i]))
      children[i] = vnode$1(void 0, void 0, void 0, children[i], void 0);
    }
  }
  if (sel[0] === "s" && sel[1] === "v" && sel[2] === "g" && (sel.length === 3 || sel[3] === "." || sel[3] === "#")) {
    addNS$1(data, children, sel);
  }
  return vnode$1(sel, data, children, text, void 0);
}
const FPS$1 = 60;
function getTimePeriodData$1(graph) {
  return graph.data.filter(dataPoint => {
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
  if (graph.renderValueLabel && graph.selection.type === "value")
  bottomMargin += 30;
  const graphHeight = graph.height - bottomMargin;
  const graphWidth = model.width - leftMargin - rightMargin;
  return {
    leftMargin,
    rightMargin,
    bottomMargin,
    graphHeight,
    graphWidth };

}
function verticalGridLinesMinor$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return index``;
  const m = getGraphMetrics$1(model, graph);
  const gridLines2 = [];
  const pixelsPerTick = 6;
  const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
    const x = m.leftMargin + i;
    gridLines2.push(h$1("line", { attrs: { x1: x, x2: x, y1: 0, y2: m.graphHeight } }));
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return index`<g class="grid-minor" style="stroke: ${graph.gridLines.vertical.minorColor}; stroke-width: ${strokeWidth}">${gridLines2}</g>`;
}
function verticalGridLinesMajor$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.vertical)
  return index``;
  const m = getGraphMetrics$1(model, graph);
  const gridLines2 = [];
  const pixelsPerTick = 6;
  const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;
  for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
    const x = m.leftMargin + i;
    gridLines2.push(h$1("line", { attrs: { x1: x, x2: x, y1: 0, y2: m.graphHeight } }));
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return index`<g class="grid-major" style="stroke: ${graph.gridLines.vertical.majorColor}; stroke-width: ${strokeWidth}">${gridLines2}</g>`;
}
function gridLines$1(model, graph, update) {
  if (!graph.gridLines || !graph.gridLines.horizontal)
  return index``;
  const m = getGraphMetrics$1(model, graph);
  const gridLines2 = [];
  const distanceBetweenLines = m.graphHeight / (graph.gridLines.horizontal.lineCount + 1);
  for (let y = distanceBetweenLines; y < m.graphHeight; y += distanceBetweenLines) {
    gridLines2.push(index`<line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${y}" y2="${y}"/>`);
  }
  const strokeWidth = 1 / (window.devicePixelRatio || 1);
  return index`<g class="grid-horiz"
                   style="stroke: ${graph.gridLines.horizontal.color}; stroke-width: ${strokeWidth}"
                   stroke-dasharray="4 2">${gridLines2}</g>`;
}
function renderLinePlotGraph$1(model, graph, dotWidth) {
  const tp = getTimePeriodData$1(graph);
  const m = getGraphMetrics$1(model, graph);
  const lines = [];
  let lastX, lastY;
  let pathString = "";
  for (let i = 0; i < tp.length; i++) {
    const point = tp[i];
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;
    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);
    if (i > 0) {
      lines.push(h$1("line", { attrs: { x1: lastX, y1: lastY, x2: x, y2: y } }));
      pathString += `L ${x} ${y}`;
    } else {
      pathString = `M ${x} ${m.graphHeight}  L ${x} ${y}`;
    }
    lastX = x;
    lastY = y;
  }
  if (graph.linePlotAreaColor && tp.length) {
    pathString += ` L ${lastX} ${m.graphHeight} Z`;
    lines.unshift(h$1("path", { attrs: { d: pathString, fill: graph.linePlotAreaColor, stroke: "transparent" } }));
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
    return h$1("rect", {
      attrs: {
        x,
        y,
        "data-value": point.value,
        width: dotWidth,
        height: dotWidth } });


  });
}
function graphComponent$1(model, graph, update) {
  const dotWidth = 4;
  const m = getGraphMetrics$1(model, graph);
  const _stopDragging = function () {
    graph.selection.dragging = void 0;
    update();
  };
  const _insertHook = function (vnode2) {
    model.elm = vnode2.elm;
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
               ${graph.type === "scatterPlot" ? renderScatterPlotGraph$1(model, graph, dotWidth) : renderLinePlotGraph$1(model, graph, dotWidth)}
            </g>

            ${timeSelectionComponent$1(model, graph, update)}

            <text x="${m.graphWidth + m.leftMargin - dotWidth}" y="12" style="fill: rgba(0, 0, 0, 0.7); text-anchor: end; pointer-events: none;">${graph.label}</text>
            ${renderLabelComponent$1(model, graph)}
        </svg>`;
}
function renderLabelComponent$1(model, graph, update) {
  if (graph.renderValueLabel && graph.selection.type === "value") {
    const m = getGraphMetrics$1(model, graph);
    const t = (graph.selection.time === Infinity ? graph.timeRange.end : graph.selection.time).toFixed(1);
    return index`<text x="2" y="${m.graphHeight + m.bottomMargin - 8}" style="fill: rgba(0, 0, 0, 0.7); text-anchor: start; pointer-events: none;">t: ${t}s</text>`;
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
      tickMarks.push(h$1("line", { attrs: { x1: x, x2: x, y1: m.graphHeight, y2: m.graphHeight + tickHeight } }));
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
  if (graph.selection.type === "range")
  return timeRangeSelectionComponent$1(model, graph, update);
  if (graph.selection.type === "value")
  return timeValueSelectionComponent$1(model, graph, update);
  return index``;
}
function timeRangeSelectionComponent$1(model, graph, update) {
  const m = getGraphMetrics$1(model, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);
  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth);
    if (graph.selection.dragging === "start") {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.start > graph.selection.end)
      graph.selection.start = graph.selection.end;
    } else if (graph.selection.dragging === "end") {
      const pos = clamp((x - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
      if (graph.selection.end < graph.selection.start)
      graph.selection.end = graph.selection.start;
    }
    update();
  }, 1e3 / FPS$1);
  const _mouseUp = function () {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update();
  };
  const _mouseDown = function (position) {
    graph.selection.dragging = position;
    document.addEventListener("mousemove", _mouseMove, { passive: true });
    document.addEventListener("mouseup", _mouseUp);
    update();
  };
  return index`
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
function timeValueSelectionComponent$1(model, graph, update) {
  const _mouseMove = lodash_throttle(function (ev) {
    const rect = model.elm.getBoundingClientRect();
    const x2 = clamp(ev.clientX - rect.left, 0, model.elm.clientWidth);
    const pos = clamp((x2 - m.leftMargin) / m.graphWidth, 0, 1);
    graph.selection.time = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
    update();
  }, 1e3 / 60);
  const _mouseUp = function () {
    graph.selection.dragging = void 0;
    document.removeEventListener("mouseup", _mouseUp);
    document.removeEventListener("mousemove", _mouseMove);
    update();
  };
  const _mouseDown = function (position) {
    graph.selection.dragging = true;
    document.addEventListener("mousemove", _mouseMove, { passive: true });
    document.addEventListener("mouseup", _mouseUp);
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
  const _insertHook = function (vnode2) {
    model.container = vnode2;
  };
  if (model.container)
  model.width = model.container.elm ? model.container.elm.offsetWidth : model.container.offsetWidth;
  return index`
        <div class="graph-stack"
             @hook:insert=${_insertHook}
             style="width: 100%; display: grid; grid-template-columns: 1fr; border: ${model.border || "none"};">
            ${model.graphs.map(g => graphComponent$1(model, g, update))}
        </div>`;
}
function timelineComponent$2(model, update) {
  return model.renderer === "canvas" ? timelineComponent(model, update) : timelineComponent$1(model, update);
}

// inspired by ecsy https://blog.mozvr.com/ecsy-developer-tools/

/*
<svg viewBox="0 0 100 100" width="100%" height="100%" style="display: block;">
    <path d="M 96.25 50 A 46.25 46.25 0 0 1 90.88702513282273 71.61743915888101" stroke-width="7.5" stroke="hsl(54, 100%, 57%)" fill="none">
        <title>MovableSystem</title>
    </path>
    <path d="M 87.48054937231139 77.09743380377057 A 46.25 46.25 0 1 1 95.79989817929763 43.563244080596995" stroke-width="7.5" stroke="hsl(34, 100%, 57%)" fill="none">
        <title>RendererSystem</title>
    </path>
</svg>
*/


let currentVnode = document.querySelector('main');

const model = {
    startTime: Date.now(),
    maxSampleCount: 100,

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

    components: { }, // key is component id/name, value is the timeline for each component

    /*
    example system:
        {
            filters: {
                hero,rigidBody,facing: 1
                transform,pointLight: 21
            },
            name: "lightSystem",
            timeElapsed: 0.025000001187436283
        }
    */
    systems: [ ]
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
        model.systems.length = 0;

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

            // limit the n sd..fumber of samples in the graph
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

        model.systems = message.data.systems;
    }

    update();
});


function update () {
    const newVnode = render(model, update);
    currentVnode = index$1$1.update(currentVnode, newVnode);
}


function renderEntityGraph (timelineModel, update) {
    const c = timelineComponent$2(timelineModel, update);
    timelineModel.container = c;
    return c
}


function renderComponentGraphs(components, update) {
    return Object.keys(components).map((componentId) => {
        const c = components[componentId];
        return index$1$1`<div class="component-graph-row">
        <div style="display: flex; justify-content: flex-end; align-items: center; margin-right: 6px;">${componentId}</div>${renderEntityGraph(c.timeline, update)}
        </div>`
    })
}


function filtersView (systems, update) {

    // get all unique filters
    const filters = { };

    for (const s of systems)
        for (const f of Object.keys(s.filters))
            filters[f] = s.filters[f];

    const filterViews = Object.keys(filters)
        .filter((f) => filters[f] > 0)
        .map((f) => {
            const components = f.split(',').map((c) => index$1$1`<div class="system-filter-component">${c}</div>`);
            const entityCount = filters[f];
            return index$1$1`<div class="system-filter" style="padding: 4px; margin-bottom: 6px;">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`
        });

    return index$1$1`<div class="filters">
        <h3>Filters (${Object.keys(filters).length})</h3>
        ${filterViews}
    </div>`
}


function systemsView (systems, update) {
    /*
    example system:
        {
            filters: {
                hero,rigidBody,facing: 1
                transform,pointLight: 21
            },
            name: "lightSystem",
            timeElapsed: 0.025000001187436283
        }
    */

    let totalTime = 0;
    for (const s of systems)
        totalTime += s.timeElapsed;

    const systemViews = systems.map((s) => {
        const percent = Math.round(s.timeElapsed / totalTime * 100);

        const filterViews = Object.keys(s.filters).map((f) => {
            const components = f.split(',').map((c) => index$1$1`<div class="system-filter-component">${c}</div>`);
            const entityCount = s.filters[f];
            return index$1$1`<div class="system-filter">
                <div style="padding-right: 4px; display: flex; align-items: center;">
                    <div style="padding-right: 6px;">FILTER:</div>
                    ${components}
                </div>
                <div>${entityCount}</div>
            </div>`
        });

        return index$1$1`<div class="system">
            <div style="grid-area: systemName; border-left: 4px solid dodgerblue; padding: 8px;">${s.name}</div>
            <div style="grid-area: systemTime; padding: 8px;">${s.timeElapsed.toFixed(2)}ms</div>
            <div style="grid-area: systemPercent; padding: 8px;">${percent}%</div>
            <div style="grid-area: systemQueries; padding-left: 20px; background-color: white;">
                ${filterViews}
            </div>
        </div>`
    });

    return index$1$1`<div class="systems">
        <h3>Systems (${systems.length})</h3>
        <p>Total Time: ${totalTime.toFixed(2)}ms</p>
        <div></div>
        ${systemViews}
    </div>`
}


function render (model, update) {

    return index$1$1`<main data-breakpoints='{ "col2": 640, "col3": 1024 }'>
        <div class="entities" key="entities">
            <h2>Entities (${model.entityCount.instanceCount})</h2>
            ${renderEntityGraph(model.entityCount.timeline, update)}
        </div>

        <div class="components">
            <h2>Components (${model.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model.componentCount.timeline, update)}
            ${renderComponentGraphs(model.components, update)}
        </div>

        ${filtersView(model.systems)}

        ${systemsView(model.systems)}
    </main>`
}
