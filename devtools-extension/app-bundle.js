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


function gridLines(model, graph, update) {
  if (!graph.gridLines)
  return index``;

  const m = getGraphMetrics(model, graph);

  const gridLines = [];

  if (graph.gridLines.vertical) {
    const pixelsPerTick = 6;
    const pixelsPerMinorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMinor;
    for (let i = 0; i < m.graphWidth; i += pixelsPerMinorLine) {
      const x = m.leftMargin + i;
      gridLines.push({ x1: x, x2: x, y1: 0, y2: m.graphHeight, stroke: graph.gridLines.vertical.minorColor });
    }

    const pixelsPerMajorLine = pixelsPerTick * graph.gridLines.vertical.ticksPerMajor;
    for (let i = 0; i < m.graphWidth; i += pixelsPerMajorLine) {
      const x = m.leftMargin + i;
      gridLines.push({ x1: x, x2: x, y1: 0, y2: m.graphHeight, stroke: graph.gridLines.vertical.majorColor });
    }
  }

  if (graph.gridLines.horizontal) {
    const distanceBetweenLines = m.graphHeight / (graph.gridLines.horizontal.lineCount + 1);
    for (let i = distanceBetweenLines; i < m.graphHeight; i += distanceBetweenLines) {
      const y = i;
      gridLines.push({ x1: m.leftMargin, x2: m.leftMargin + m.graphWidth, y1: y, y2: y, stroke: graph.gridLines.horizontal.color, dashArray: '4 2' });
    }
  }

  const strokeWidth = 1 / (window.devicePixelRatio || 1);

  return gridLines.map(tick => {
    return index`<line x1="${tick.x1}" x2="${tick.x2}" y1="${tick.y1}" y2="${tick.y2}"
                          style="stroke: ${tick.stroke}; stroke-width: ${strokeWidth}"
                          @attrs:stroke-dasharray=${tick.dashArray}/>`;
  });
}


function renderLinePlotGraph(model, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model, graph);

  const lines = [];
  let lastX, lastY;

  for (let i = 0; i < tp.length; i++) {
    const point = tp[i];

    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);

    if (i > 0)
    lines.push(index`<line x1="${lastX}" y1="${lastY}" x2="${x}" y2="${y}" style="stroke: ${graph.dataColor}; stroke-width: 1;"/>`);

    lastX = x;
    lastY = y;
  }

  return lines;
}


function renderScatterPlotGraph(model, graph, dotWidth) {
  const tp = getTimePeriodData(graph);
  const m = getGraphMetrics(model, graph);

  return tp.map(point => {
    const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, point.t);
    const x = startX * (m.graphWidth - dotWidth) + m.leftMargin;

    const yLength = graph.yRange.end - graph.yRange.start;
    const y = (1 - point.value / yLength) * (m.graphHeight - dotWidth);

    return index`<rect x="${x}" y="${y}" style="fill: ${graph.dataColor};" data-value="${point.value}" width="${dotWidth}" height="${dotWidth}" />`;
  });
}


function graphComponent(model, graph, update) {

  const dotWidth = 4;
  const m = getGraphMetrics(model, graph);
  //const timePeriod = (graph.timeRange.end - graph.timeRange.start)
  //const pixelsPerSecond = m.graphWidth / timePeriod


  const _mouseMove = function (ev) {
    if (!graph.selection.dragging)
    return;

    if (graph.selection.dragging === 'start') {
      const pos = clamp((ev.offsetX - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.start = lerp(graph.timeRange.start, graph.timeRange.end, pos);
    } else if (graph.selection.dragging === 'end') {
      const pos = clamp((ev.offsetX - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.end = pos === 1 ? Infinity : lerp(graph.timeRange.start, graph.timeRange.end, pos);
    } else {
      const pos = clamp((ev.offsetX - m.leftMargin) / m.graphWidth, 0, 1);
      graph.selection.time = lerp(graph.timeRange.start, graph.timeRange.end, pos);
    }

    update();
  };

  const _stopDragging = function () {
    graph.selection.dragging = undefined;
    update();
  };

  return index`
        <svg xmlns="http://www.w3.org/2000/svg"
             class="graph"
             aria-labelledby="title"
             role="img"
             viewBox="0 0 ${model.width} ${graph.height}" 
             style="height: ${graph.height}px; width: 100%; background-color: white; font-size: 10px; text-anchor: middle; -moz-user-select: none; -webkit-user-select: none; user-select: none; -webkit-user-drag: none; -khtml-user-drag: none; -moz-user-drag: none; -o-user-drag: none; user-drag: none;"
             @on:mouseup=${_stopDragging}
             @on:mouseleave=${_stopDragging}
             @on:mousemove=${_mouseMove}>
            <title id="title">${graph.title}</title>

            <g class="grid y-grid" id="yGrid"
               style="stroke: #888; stroke-dasharray: 0; stroke-width: 1;">
                ${gridLines(model, graph)}
                <line x1="${m.leftMargin}" x2="${m.leftMargin + m.graphWidth}" y1="${m.graphHeight}" y2="${m.graphHeight}" />
                ${tickMarksComponent(model, graph)}
                ${tickLabelsComponent(model, graph)}
            </g>

            <g class="data"
               style="stroke-width: 1;">
               ${graph.type === 'scatterPlot' ? renderScatterPlotGraph(model, graph, dotWidth) : renderLinePlotGraph(model, graph, dotWidth)}
            </g>

            ${timeSelectionComponent(model, graph, update)}

            <text x="${m.graphWidth + m.leftMargin - dotWidth}" y="12" style="fill: rgba(0, 0, 0, 0.7); text-anchor: end; pointer-events: none;">${graph.label}</text>
            ${renderLabelComponent(model, graph)}
        </svg>`;
}


function renderLabelComponent(model, graph, update) {
  if (graph.renderValueLabel && graph.selection.type === 'value') {
    const m = getGraphMetrics(model, graph);
    return index`<text x="2" y="${m.graphHeight + m.bottomMargin - 8}" style="fill: rgba(0, 0, 0, 0.7); text-anchor: start; pointer-events: none;">t: ${graph.selection.time.toFixed(1)}s</text>
            `;
  }

  return index``;
}


function tickMarksComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);

  const tickMarks = [];

  const constPixelsPerTick = 6;
  const tickHeight = 4;

  if (graph.renderTicks)
  for (let i = 0; i < m.graphWidth; i += constPixelsPerTick)
  tickMarks.push({ x: m.leftMargin + i, height: tickHeight });

  return tickMarks.map(tick => {
    return index`<line x1="${tick.x}" x2="${tick.x}" y1="${m.graphHeight}" y2="${m.graphHeight + tick.height}" />`;
  });
}


function tickLabelsComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);

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


function timeSelectionComponent(model, graph, update) {
  if (graph.selection.type === 'range')
  return timeRangeSelectionComponent(model, graph, update);

  if (graph.selection.type === 'value')
  return timeValueSelectionComponent(model, graph, update);

  return index``;
}


function timeRangeSelectionComponent(model, graph, update) {
  const m = getGraphMetrics(model, graph);
  const startX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.start);
  const endX = findPosOnScale(graph.timeRange.start, graph.timeRange.end, graph.selection.end);

  const _mouseDown = function (position) {
    graph.selection.dragging = position;
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


function timeValueSelectionComponent(model, graph, update) {
  const _mouseDown = function (ev) {
    graph.selection.dragging = true;
    update();
  };

  const m = getGraphMetrics(model, graph);

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

//const ID = Math.ceil(Math.random() * 10000)
//console.log('invoked devtools scr:', ID)

let currentVnode = document.querySelector('main');
const model = {
    startTime: Date.now(),
    maxSampleCount: 4000,

    entityCount: {
        currentCount: 0,
        maxValue: 0,
        timeline: {
            container: undefined,
            width: 0,
            graphs: [
                {
                    title: 'Entity Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
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
                    gridLines: {
                        /*
                        vertical: {
                            majorColor: '#dedede',
                            minorColor: '#f3f3f3',
                            ticksPerMinor: 2.5,
                            ticksPerMajor: 10
                        },
                        horizontal: {
                            color: '#eeeeee',
                            lineCount: 2
                        }
                        */
                    }
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
            graphs: [
                {
                    title: 'Component Count',
                    label: '',
                    type: 'linePlot',  // scatterPlot | linePlot
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
                    gridLines: {
                        /*
                        vertical: {
                            majorColor: '#dedede',
                            minorColor: '#f3f3f3',
                            ticksPerMinor: 2.5,
                            ticksPerMajor: 10
                        },
                        horizontal: {
                            color: '#eeeeee',
                            lineCount: 2
                        }
                        */
                    }
                }
            ]
        }
    }
};


window.MM = model;

const backgroundPageConnection = chrome.runtime.connect({
    name: 'mreinstein/ecs-devtools'
});

backgroundPageConnection.postMessage({
    name: 'init',
    tabId: chrome.devtools.inspectedWindow.tabId
});


backgroundPageConnection.onMessage.addListener(function (message) {
    // worldCreated || refreshData || disabled
    if (message.method === 'worldCreated') {
        model.entityCount.currentCount = 0;
        model.entityCount.maxValue = 100;
        model.entityCount.timeline.graphs[0].data.length = 0;

        model.componentCount.totalUniqueComponentTypes = 0;
        model.componentCount.maxValue = 100;
        model.componentCount.timeline.graphs[0].data.length = 0;

    } else if (message.method === 'refreshData') {
        const stats = message.data;
        const t = (Date.now() - model.startTime) / 1000;

        model.entityCount.maxValue = Math.max(model.entityCount.maxValue, stats.entityCount);
        model.entityCount.currentCount = stats.entityCount;

        model.entityCount.timeline.graphs[0].data.push({ t, value: stats.entityCount });
        model.entityCount.timeline.graphs[0].yRange.end = Math.round(model.entityCount.maxValue * 1.1);


        model.componentCount.totalUniqueComponentTypes = Object.keys(stats.componentCount).length;
        let totalCount = 0;
        for (const componentId in stats.componentCount) {
            totalCount += stats.componentCount[componentId];
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
    // TODO: draw the snabbdom timeline here for last 60 seconds of data
    const c = timelineComponent(timelineModel, update);
    timelineModel.container = c;
    return c
}


function render (model, update) {
    //const { stats } = model.worldEntries[model.worldEntries.length-1]

    //console.log('cm:', currentModel)

    return index`<main>
        <div class="entities">
            <h2>Entities (${model.entityCount.currentCount})</h2>
            ${renderEntityGraph(model.entityCount.timeline, update)}
        </div>

        <div class="components">
            <h2>Components (${model.componentCount.totalUniqueComponentTypes})</h2>
            ${renderEntityGraph(model.componentCount.timeline, update)}
        </div>

        <div class="queries"></div>

        <div class="systems"></div>

    </main>`
}


/*
chrome.runtime.onConnect.addListener(m => {
    console.log('connection happened, sending init message to bg!')
    model.worldEntries.length = 0
    backgroundPageConnection.postMessage({
        name: 'init',
        tabId: chrome.devtools.inspectedWindow.tabId
    })
})

backgroundPageConnection.onDisconnect.addListener(function () {
    console.log('background page disconnected :(')
})

window.panelShowing = function (p) {
    console.log('panel is showing. backgroundPageConnection:', backgroundPageConnection)
    console.log('SHOWing:', ID)
}
*/
