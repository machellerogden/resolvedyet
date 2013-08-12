/*!
  * =============================================================
  * Ender: open module JavaScript framework (https://ender.no.de)
  * Build: ender build knockout-client qwery bonzo domready underscore bean traversty ender-validator moment ender-deferred
  * =============================================================
  */

/*!
  * Ender: open module JavaScript framework (client-lib)
  * copyright Dustin Diaz & Jacob Thornton 2011-2012 (@ded @fat)
  * http://ender.jit.su
  * License MIT
  */
(function (context) {

  // a global object for node.js module compatiblity
  // ============================================

  context['global'] = context

  // Implements simple module system
  // losely based on CommonJS Modules spec v1.1.1
  // ============================================

  var modules = {}
    , old = context['$']
    , oldEnder = context['ender']
    , oldRequire = context['require']
    , oldProvide = context['provide']

  function require (identifier) {
    // modules can be required from ender's build system, or found on the window
    var module = modules['$' + identifier] || window[identifier]
    if (!module) throw new Error("Ender Error: Requested module '" + identifier + "' has not been defined.")
    return module
  }

  function provide (name, what) {
    return (modules['$' + name] = what)
  }

  context['provide'] = provide
  context['require'] = require

  function aug(o, o2) {
    for (var k in o2) k != 'noConflict' && k != '_VERSION' && (o[k] = o2[k])
    return o
  }

  /**
   * main Ender return object
   * @constructor
   * @param {Array|Node|string} s a CSS selector or DOM node(s)
   * @param {Array.|Node} r a root node(s)
   */
  function Ender(s, r) {
    var elements
      , i

    this.selector = s
    // string || node || nodelist || window
    if (typeof s == 'undefined') {
      elements = []
      this.selector = ''
    } else if (typeof s == 'string' || s.nodeName || (s.length && 'item' in s) || s == window) {
      elements = ender._select(s, r)
    } else {
      elements = isFinite(s.length) ? s : [s]
    }
    this.length = elements.length
    for (i = this.length; i--;) this[i] = elements[i]
  }

  /**
   * @param {function(el, i, inst)} fn
   * @param {Object} opt_scope
   * @returns {Ender}
   */
  Ender.prototype['forEach'] = function (fn, opt_scope) {
    var i, l
    // opt out of native forEach so we can intentionally call our own scope
    // defaulting to the current item and be able to return self
    for (i = 0, l = this.length; i < l; ++i) i in this && fn.call(opt_scope || this[i], this[i], i, this)
    // return self for chaining
    return this
  }

  Ender.prototype.$ = ender // handy reference to self


  function ender(s, r) {
    return new Ender(s, r)
  }

  ender['_VERSION'] = '0.4.3-dev'

  ender.fn = Ender.prototype // for easy compat to jQuery plugins

  ender.ender = function (o, chain) {
    aug(chain ? Ender.prototype : ender, o)
  }

  ender._select = function (s, r) {
    if (typeof s == 'string') return (r || document).querySelectorAll(s)
    if (s.nodeName) return [s]
    return s
  }


  // use callback to receive Ender's require & provide and remove them from global
  ender.noConflict = function (callback) {
    context['$'] = old
    if (callback) {
      context['provide'] = oldProvide
      context['require'] = oldRequire
      context['ender'] = oldEnder
      if (typeof callback == 'function') callback(require, provide, this)
    }
    return this
  }

  if (typeof module !== 'undefined' && module.exports) module.exports = ender
  // use subscript notation as extern for Closure compilation
  context['ender'] = context['$'] = ender

}(this));

(function () {

  var module = { exports: {} }, exports = module.exports;

  // Knockout JavaScript library v2.2.1
  // (c) Steven Sanderson - http://knockoutjs.com/
  // License: MIT (http://www.opensource.org/licenses/mit-license.php)
  
  (function() {function j(w){throw w;}var m=!0,p=null,r=!1;function u(w){return function(){return w}};var x=window,y=document,ga=navigator,F=window.jQuery,I=void 0;
  function L(w){function ha(a,d,c,e,f){var g=[];a=b.j(function(){var a=d(c,f)||[];0<g.length&&(b.a.Ya(M(g),a),e&&b.r.K(e,p,[c,a,f]));g.splice(0,g.length);b.a.P(g,a)},p,{W:a,Ka:function(){return 0==g.length||!b.a.X(g[0])}});return{M:g,j:a.pa()?a:I}}function M(a){for(;a.length&&!b.a.X(a[0]);)a.splice(0,1);if(1<a.length){for(var d=a[0],c=a[a.length-1],e=[d];d!==c;){d=d.nextSibling;if(!d)return;e.push(d)}Array.prototype.splice.apply(a,[0,a.length].concat(e))}return a}function S(a,b,c,e,f){var g=Math.min,
  h=Math.max,k=[],l,n=a.length,q,s=b.length,v=s-n||1,G=n+s+1,J,A,z;for(l=0;l<=n;l++){A=J;k.push(J=[]);z=g(s,l+v);for(q=h(0,l-1);q<=z;q++)J[q]=q?l?a[l-1]===b[q-1]?A[q-1]:g(A[q]||G,J[q-1]||G)+1:q+1:l+1}g=[];h=[];v=[];l=n;for(q=s;l||q;)s=k[l][q]-1,q&&s===k[l][q-1]?h.push(g[g.length]={status:c,value:b[--q],index:q}):l&&s===k[l-1][q]?v.push(g[g.length]={status:e,value:a[--l],index:l}):(g.push({status:"retained",value:b[--q]}),--l);if(h.length&&v.length){a=10*n;var t;for(b=c=0;(f||b<a)&&(t=h[c]);c++){for(e=
  0;k=v[e];e++)if(t.value===k.value){t.moved=k.index;k.moved=t.index;v.splice(e,1);b=e=0;break}b+=e}}return g.reverse()}function T(a,d,c,e,f){f=f||{};var g=a&&N(a),g=g&&g.ownerDocument,h=f.templateEngine||O;b.za.vb(c,h,g);c=h.renderTemplate(c,e,f,g);("number"!=typeof c.length||0<c.length&&"number"!=typeof c[0].nodeType)&&j(Error("Template engine must return an array of DOM nodes"));g=r;switch(d){case "replaceChildren":b.e.N(a,c);g=m;break;case "replaceNode":b.a.Ya(a,c);g=m;break;case "ignoreTargetNode":break;
  default:j(Error("Unknown renderMode: "+d))}g&&(U(c,e),f.afterRender&&b.r.K(f.afterRender,p,[c,e.$data]));return c}function N(a){return a.nodeType?a:0<a.length?a[0]:p}function U(a,d){if(a.length){var c=a[0],e=a[a.length-1];V(c,e,function(a){b.Da(d,a)});V(c,e,function(a){b.s.ib(a,[d])})}}function V(a,d,c){var e;for(d=b.e.nextSibling(d);a&&(e=a)!==d;)a=b.e.nextSibling(e),(1===e.nodeType||8===e.nodeType)&&c(e)}function W(a,d,c){a=b.g.aa(a);for(var e=b.g.Q,f=0;f<a.length;f++){var g=a[f].key;if(e.hasOwnProperty(g)){var h=
  e[g];"function"===typeof h?(g=h(a[f].value))&&j(Error(g)):h||j(Error("This template engine does not support the '"+g+"' binding within its templates"))}}a="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+b.g.ba(a)+" } })()})";return c.createJavaScriptEvaluatorBlock(a)+d}function X(a,d,c,e){function f(a){return function(){return k[a]}}function g(){return k}var h=0,k,l;b.j(function(){var n=c&&c instanceof b.z?c:new b.z(b.a.d(c)),q=n.$data;e&&b.eb(a,n);if(k=("function"==typeof d?
  d(n,a):d)||b.J.instance.getBindings(a,n)){if(0===h){h=1;for(var s in k){var v=b.c[s];v&&8===a.nodeType&&!b.e.I[s]&&j(Error("The binding '"+s+"' cannot be used with virtual elements"));if(v&&"function"==typeof v.init&&(v=(0,v.init)(a,f(s),g,q,n))&&v.controlsDescendantBindings)l!==I&&j(Error("Multiple bindings ("+l+" and "+s+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.")),l=s}h=2}if(2===h)for(s in k)(v=b.c[s])&&"function"==
  typeof v.update&&(0,v.update)(a,f(s),g,q,n)}},p,{W:a});return{Nb:l===I}}function Y(a,d,c){var e=m,f=1===d.nodeType;f&&b.e.Ta(d);if(f&&c||b.J.instance.nodeHasBindings(d))e=X(d,p,a,c).Nb;e&&Z(a,d,!f)}function Z(a,d,c){for(var e=b.e.firstChild(d);d=e;)e=b.e.nextSibling(d),Y(a,d,c)}function $(a,b){var c=aa(a,b);return c?0<c.length?c[c.length-1].nextSibling:a.nextSibling:p}function aa(a,b){for(var c=a,e=1,f=[];c=c.nextSibling;){if(H(c)&&(e--,0===e))return f;f.push(c);B(c)&&e++}b||j(Error("Cannot find closing comment tag to match: "+
  a.nodeValue));return p}function H(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ia)}function B(a){return 8==a.nodeType&&(K?a.text:a.nodeValue).match(ja)}function P(a,b){for(var c=p;a!=c;)c=a,a=a.replace(ka,function(a,c){return b[c]});return a}function la(){var a=[],d=[];this.save=function(c,e){var f=b.a.i(a,c);0<=f?d[f]=e:(a.push(c),d.push(e))};this.get=function(c){c=b.a.i(a,c);return 0<=c?d[c]:I}}function ba(a,b,c){function e(e){var g=b(a[e]);switch(typeof g){case "boolean":case "number":case "string":case "function":f[e]=
  g;break;case "object":case "undefined":var h=c.get(g);f[e]=h!==I?h:ba(g,b,c)}}c=c||new la;a=b(a);if(!("object"==typeof a&&a!==p&&a!==I&&!(a instanceof Date)))return a;var f=a instanceof Array?[]:{};c.save(a,f);var g=a;if(g instanceof Array){for(var h=0;h<g.length;h++)e(h);"function"==typeof g.toJSON&&e("toJSON")}else for(h in g)e(h);return f}function ca(a,d){if(a)if(8==a.nodeType){var c=b.s.Ua(a.nodeValue);c!=p&&d.push({sb:a,Fb:c})}else if(1==a.nodeType)for(var c=0,e=a.childNodes,f=e.length;c<f;c++)ca(e[c],
  d)}function Q(a,d,c,e){b.c[a]={init:function(a){b.a.f.set(a,da,{});return{controlsDescendantBindings:m}},update:function(a,g,h,k,l){h=b.a.f.get(a,da);g=b.a.d(g());k=!c!==!g;var n=!h.Za;if(n||d||k!==h.qb)n&&(h.Za=b.a.Ia(b.e.childNodes(a),m)),k?(n||b.e.N(a,b.a.Ia(h.Za)),b.Ea(e?e(l,g):l,a)):b.e.Y(a),h.qb=k}};b.g.Q[a]=r;b.e.I[a]=m}function ea(a,d,c){c&&d!==b.k.q(a)&&b.k.T(a,d);d!==b.k.q(a)&&b.r.K(b.a.Ba,p,[a,"change"])}var b="undefined"!==typeof w?w:{};b.b=function(a,d){for(var c=a.split("."),e=b,f=0;f<
  c.length-1;f++)e=e[c[f]];e[c[c.length-1]]=d};b.p=function(a,b,c){a[b]=c};b.version="2.2.1";b.b("version",b.version);b.a=new function(){function a(a,d){if("input"!==b.a.u(a)||!a.type||"click"!=d.toLowerCase())return r;var c=a.type;return"checkbox"==c||"radio"==c}var d=/^(\s|\u00A0)+|(\s|\u00A0)+$/g,c={},e={};c[/Firefox\/2/i.test(ga.userAgent)?"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];c.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");
  for(var f in c){var g=c[f];if(g.length)for(var h=0,k=g.length;h<k;h++)e[g[h]]=f}var l={propertychange:m},n,c=3;f=y.createElement("div");for(g=f.getElementsByTagName("i");f.innerHTML="\x3c!--[if gt IE "+ ++c+"]><i></i><![endif]--\x3e",g[0];);n=4<c?c:I;return{Na:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],o:function(a,b){for(var d=0,c=a.length;d<c;d++)b(a[d])},i:function(a,b){if("function"==typeof Array.prototype.indexOf)return Array.prototype.indexOf.call(a,b);for(var d=0,c=a.length;d<
  c;d++)if(a[d]===b)return d;return-1},lb:function(a,b,d){for(var c=0,e=a.length;c<e;c++)if(b.call(d,a[c]))return a[c];return p},ga:function(a,d){var c=b.a.i(a,d);0<=c&&a.splice(c,1)},Ga:function(a){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)0>b.a.i(d,a[c])&&d.push(a[c]);return d},V:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)d.push(b(a[c]));return d},fa:function(a,b){a=a||[];for(var d=[],c=0,e=a.length;c<e;c++)b(a[c])&&d.push(a[c]);return d},P:function(a,b){if(b instanceof Array)a.push.apply(a,
  b);else for(var d=0,c=b.length;d<c;d++)a.push(b[d]);return a},extend:function(a,b){if(b)for(var d in b)b.hasOwnProperty(d)&&(a[d]=b[d]);return a},ka:function(a){for(;a.firstChild;)b.removeNode(a.firstChild)},Hb:function(a){a=b.a.L(a);for(var d=y.createElement("div"),c=0,e=a.length;c<e;c++)d.appendChild(b.A(a[c]));return d},Ia:function(a,d){for(var c=0,e=a.length,g=[];c<e;c++){var f=a[c].cloneNode(m);g.push(d?b.A(f):f)}return g},N:function(a,d){b.a.ka(a);if(d)for(var c=0,e=d.length;c<e;c++)a.appendChild(d[c])},
  Ya:function(a,d){var c=a.nodeType?[a]:a;if(0<c.length){for(var e=c[0],g=e.parentNode,f=0,h=d.length;f<h;f++)g.insertBefore(d[f],e);f=0;for(h=c.length;f<h;f++)b.removeNode(c[f])}},bb:function(a,b){7>n?a.setAttribute("selected",b):a.selected=b},D:function(a){return(a||"").replace(d,"")},Rb:function(a,d){for(var c=[],e=(a||"").split(d),f=0,g=e.length;f<g;f++){var h=b.a.D(e[f]);""!==h&&c.push(h)}return c},Ob:function(a,b){a=a||"";return b.length>a.length?r:a.substring(0,b.length)===b},tb:function(a,b){if(b.compareDocumentPosition)return 16==
  (b.compareDocumentPosition(a)&16);for(;a!=p;){if(a==b)return m;a=a.parentNode}return r},X:function(a){return b.a.tb(a,a.ownerDocument)},u:function(a){return a&&a.tagName&&a.tagName.toLowerCase()},n:function(b,d,c){var e=n&&l[d];if(!e&&"undefined"!=typeof F){if(a(b,d)){var f=c;c=function(a,b){var d=this.checked;b&&(this.checked=b.nb!==m);f.call(this,a);this.checked=d}}F(b).bind(d,c)}else!e&&"function"==typeof b.addEventListener?b.addEventListener(d,c,r):"undefined"!=typeof b.attachEvent?b.attachEvent("on"+
  d,function(a){c.call(b,a)}):j(Error("Browser doesn't support addEventListener or attachEvent"))},Ba:function(b,d){(!b||!b.nodeType)&&j(Error("element must be a DOM node when calling triggerEvent"));if("undefined"!=typeof F){var c=[];a(b,d)&&c.push({nb:b.checked});F(b).trigger(d,c)}else"function"==typeof y.createEvent?"function"==typeof b.dispatchEvent?(c=y.createEvent(e[d]||"HTMLEvents"),c.initEvent(d,m,m,x,0,0,0,0,0,r,r,r,r,0,b),b.dispatchEvent(c)):j(Error("The supplied element doesn't support dispatchEvent")):
  "undefined"!=typeof b.fireEvent?(a(b,d)&&(b.checked=b.checked!==m),b.fireEvent("on"+d)):j(Error("Browser doesn't support triggering events"))},d:function(a){return b.$(a)?a():a},ua:function(a){return b.$(a)?a.t():a},da:function(a,d,c){if(d){var e=/[\w-]+/g,f=a.className.match(e)||[];b.a.o(d.match(e),function(a){var d=b.a.i(f,a);0<=d?c||f.splice(d,1):c&&f.push(a)});a.className=f.join(" ")}},cb:function(a,d){var c=b.a.d(d);if(c===p||c===I)c="";if(3===a.nodeType)a.data=c;else{var e=b.e.firstChild(a);
  !e||3!=e.nodeType||b.e.nextSibling(e)?b.e.N(a,[y.createTextNode(c)]):e.data=c;b.a.wb(a)}},ab:function(a,b){a.name=b;if(7>=n)try{a.mergeAttributes(y.createElement("<input name='"+a.name+"'/>"),r)}catch(d){}},wb:function(a){9<=n&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom))},ub:function(a){if(9<=n){var b=a.style.width;a.style.width=0;a.style.width=b}},Lb:function(a,d){a=b.a.d(a);d=b.a.d(d);for(var c=[],e=a;e<=d;e++)c.push(e);return c},L:function(a){for(var b=[],d=0,c=a.length;d<
  c;d++)b.push(a[d]);return b},Pb:6===n,Qb:7===n,Z:n,Oa:function(a,d){for(var c=b.a.L(a.getElementsByTagName("input")).concat(b.a.L(a.getElementsByTagName("textarea"))),e="string"==typeof d?function(a){return a.name===d}:function(a){return d.test(a.name)},f=[],g=c.length-1;0<=g;g--)e(c[g])&&f.push(c[g]);return f},Ib:function(a){return"string"==typeof a&&(a=b.a.D(a))?x.JSON&&x.JSON.parse?x.JSON.parse(a):(new Function("return "+a))():p},xa:function(a,d,c){("undefined"==typeof JSON||"undefined"==typeof JSON.stringify)&&
  j(Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js"));return JSON.stringify(b.a.d(a),d,c)},Jb:function(a,d,c){c=c||{};var e=c.params||{},f=c.includeFields||this.Na,g=a;if("object"==typeof a&&"form"===b.a.u(a))for(var g=a.action,h=f.length-1;0<=h;h--)for(var k=b.a.Oa(a,f[h]),l=k.length-1;0<=l;l--)e[k[l].name]=k[l].value;d=b.a.d(d);var n=y.createElement("form");
  n.style.display="none";n.action=g;n.method="post";for(var w in d)a=y.createElement("input"),a.name=w,a.value=b.a.xa(b.a.d(d[w])),n.appendChild(a);for(w in e)a=y.createElement("input"),a.name=w,a.value=e[w],n.appendChild(a);y.body.appendChild(n);c.submitter?c.submitter(n):n.submit();setTimeout(function(){n.parentNode.removeChild(n)},0)}}};b.b("utils",b.a);b.b("utils.arrayForEach",b.a.o);b.b("utils.arrayFirst",b.a.lb);b.b("utils.arrayFilter",b.a.fa);b.b("utils.arrayGetDistinctValues",b.a.Ga);b.b("utils.arrayIndexOf",
  b.a.i);b.b("utils.arrayMap",b.a.V);b.b("utils.arrayPushAll",b.a.P);b.b("utils.arrayRemoveItem",b.a.ga);b.b("utils.extend",b.a.extend);b.b("utils.fieldsIncludedWithJsonPost",b.a.Na);b.b("utils.getFormFields",b.a.Oa);b.b("utils.peekObservable",b.a.ua);b.b("utils.postJson",b.a.Jb);b.b("utils.parseJson",b.a.Ib);b.b("utils.registerEventHandler",b.a.n);b.b("utils.stringifyJson",b.a.xa);b.b("utils.range",b.a.Lb);b.b("utils.toggleDomNodeCssClass",b.a.da);b.b("utils.triggerEvent",b.a.Ba);b.b("utils.unwrapObservable",
  b.a.d);Function.prototype.bind||(Function.prototype.bind=function(a){var b=this,c=Array.prototype.slice.call(arguments);a=c.shift();return function(){return b.apply(a,c.concat(Array.prototype.slice.call(arguments)))}});b.a.f=new function(){var a=0,d="__ko__"+(new Date).getTime(),c={};return{get:function(a,d){var c=b.a.f.la(a,r);return c===I?I:c[d]},set:function(a,d,c){c===I&&b.a.f.la(a,r)===I||(b.a.f.la(a,m)[d]=c)},la:function(b,f){var g=b[d];if(!g||!("null"!==g&&c[g])){if(!f)return I;g=b[d]="ko"+
  a++;c[g]={}}return c[g]},clear:function(a){var b=a[d];return b?(delete c[b],a[d]=p,m):r}}};b.b("utils.domData",b.a.f);b.b("utils.domData.clear",b.a.f.clear);b.a.F=new function(){function a(a,d){var e=b.a.f.get(a,c);e===I&&d&&(e=[],b.a.f.set(a,c,e));return e}function d(c){var e=a(c,r);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);b.a.f.clear(c);"function"==typeof F&&"function"==typeof F.cleanData&&F.cleanData([c]);if(f[c.nodeType])for(e=c.firstChild;c=e;)e=c.nextSibling,8===c.nodeType&&d(c)}
  var c="__ko_domNodeDisposal__"+(new Date).getTime(),e={1:m,8:m,9:m},f={1:m,9:m};return{Ca:function(b,d){"function"!=typeof d&&j(Error("Callback must be a function"));a(b,m).push(d)},Xa:function(d,e){var f=a(d,r);f&&(b.a.ga(f,e),0==f.length&&b.a.f.set(d,c,I))},A:function(a){if(e[a.nodeType]&&(d(a),f[a.nodeType])){var c=[];b.a.P(c,a.getElementsByTagName("*"));for(var k=0,l=c.length;k<l;k++)d(c[k])}return a},removeNode:function(a){b.A(a);a.parentNode&&a.parentNode.removeChild(a)}}};b.A=b.a.F.A;b.removeNode=
  b.a.F.removeNode;b.b("cleanNode",b.A);b.b("removeNode",b.removeNode);b.b("utils.domNodeDisposal",b.a.F);b.b("utils.domNodeDisposal.addDisposeCallback",b.a.F.Ca);b.b("utils.domNodeDisposal.removeDisposeCallback",b.a.F.Xa);b.a.ta=function(a){var d;if("undefined"!=typeof F)if(F.parseHTML)d=F.parseHTML(a);else{if((d=F.clean([a]))&&d[0]){for(a=d[0];a.parentNode&&11!==a.parentNode.nodeType;)a=a.parentNode;a.parentNode&&a.parentNode.removeChild(a)}}else{var c=b.a.D(a).toLowerCase();d=y.createElement("div");
  c=c.match(/^<(thead|tbody|tfoot)/)&&[1,"<table>","</table>"]||!c.indexOf("<tr")&&[2,"<table><tbody>","</tbody></table>"]||(!c.indexOf("<td")||!c.indexOf("<th"))&&[3,"<table><tbody><tr>","</tr></tbody></table>"]||[0,"",""];a="ignored<div>"+c[1]+a+c[2]+"</div>";for("function"==typeof x.innerShiv?d.appendChild(x.innerShiv(a)):d.innerHTML=a;c[0]--;)d=d.lastChild;d=b.a.L(d.lastChild.childNodes)}return d};b.a.ca=function(a,d){b.a.ka(a);d=b.a.d(d);if(d!==p&&d!==I)if("string"!=typeof d&&(d=d.toString()),
  "undefined"!=typeof F)F(a).html(d);else for(var c=b.a.ta(d),e=0;e<c.length;e++)a.appendChild(c[e])};b.b("utils.parseHtmlFragment",b.a.ta);b.b("utils.setHtml",b.a.ca);var R={};b.s={ra:function(a){"function"!=typeof a&&j(Error("You can only pass a function to ko.memoization.memoize()"));var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);R[b]=a;return"\x3c!--[ko_memo:"+b+"]--\x3e"},hb:function(a,b){var c=R[a];c===I&&j(Error("Couldn't find any memo with ID "+
  a+". Perhaps it's already been unmemoized."));try{return c.apply(p,b||[]),m}finally{delete R[a]}},ib:function(a,d){var c=[];ca(a,c);for(var e=0,f=c.length;e<f;e++){var g=c[e].sb,h=[g];d&&b.a.P(h,d);b.s.hb(c[e].Fb,h);g.nodeValue="";g.parentNode&&g.parentNode.removeChild(g)}},Ua:function(a){return(a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:p}};b.b("memoization",b.s);b.b("memoization.memoize",b.s.ra);b.b("memoization.unmemoize",b.s.hb);b.b("memoization.parseMemoText",b.s.Ua);b.b("memoization.unmemoizeDomNodeAndDescendants",
  b.s.ib);b.Ma={throttle:function(a,d){a.throttleEvaluation=d;var c=p;return b.j({read:a,write:function(b){clearTimeout(c);c=setTimeout(function(){a(b)},d)}})},notify:function(a,d){a.equalityComparer="always"==d?u(r):b.m.fn.equalityComparer;return a}};b.b("extenders",b.Ma);b.fb=function(a,d,c){this.target=a;this.ha=d;this.rb=c;b.p(this,"dispose",this.B)};b.fb.prototype.B=function(){this.Cb=m;this.rb()};b.S=function(){this.w={};b.a.extend(this,b.S.fn);b.p(this,"subscribe",this.ya);b.p(this,"extend",
  this.extend);b.p(this,"getSubscriptionsCount",this.yb)};b.S.fn={ya:function(a,d,c){c=c||"change";var e=new b.fb(this,d?a.bind(d):a,function(){b.a.ga(this.w[c],e)}.bind(this));this.w[c]||(this.w[c]=[]);this.w[c].push(e);return e},notifySubscribers:function(a,d){d=d||"change";this.w[d]&&b.r.K(function(){b.a.o(this.w[d].slice(0),function(b){b&&b.Cb!==m&&b.ha(a)})},this)},yb:function(){var a=0,b;for(b in this.w)this.w.hasOwnProperty(b)&&(a+=this.w[b].length);return a},extend:function(a){var d=this;if(a)for(var c in a){var e=
  b.Ma[c];"function"==typeof e&&(d=e(d,a[c]))}return d}};b.Qa=function(a){return"function"==typeof a.ya&&"function"==typeof a.notifySubscribers};b.b("subscribable",b.S);b.b("isSubscribable",b.Qa);var C=[];b.r={mb:function(a){C.push({ha:a,La:[]})},end:function(){C.pop()},Wa:function(a){b.Qa(a)||j(Error("Only subscribable things can act as dependencies"));if(0<C.length){var d=C[C.length-1];d&&!(0<=b.a.i(d.La,a))&&(d.La.push(a),d.ha(a))}},K:function(a,b,c){try{return C.push(p),a.apply(b,c||[])}finally{C.pop()}}};
  var ma={undefined:m,"boolean":m,number:m,string:m};b.m=function(a){function d(){if(0<arguments.length){if(!d.equalityComparer||!d.equalityComparer(c,arguments[0]))d.H(),c=arguments[0],d.G();return this}b.r.Wa(d);return c}var c=a;b.S.call(d);d.t=function(){return c};d.G=function(){d.notifySubscribers(c)};d.H=function(){d.notifySubscribers(c,"beforeChange")};b.a.extend(d,b.m.fn);b.p(d,"peek",d.t);b.p(d,"valueHasMutated",d.G);b.p(d,"valueWillMutate",d.H);return d};b.m.fn={equalityComparer:function(a,
  b){return a===p||typeof a in ma?a===b:r}};var E=b.m.Kb="__ko_proto__";b.m.fn[E]=b.m;b.ma=function(a,d){return a===p||a===I||a[E]===I?r:a[E]===d?m:b.ma(a[E],d)};b.$=function(a){return b.ma(a,b.m)};b.Ra=function(a){return"function"==typeof a&&a[E]===b.m||"function"==typeof a&&a[E]===b.j&&a.zb?m:r};b.b("observable",b.m);b.b("isObservable",b.$);b.b("isWriteableObservable",b.Ra);b.R=function(a){0==arguments.length&&(a=[]);a!==p&&(a!==I&&!("length"in a))&&j(Error("The argument passed when initializing an observable array must be an array, or null, or undefined."));
  var d=b.m(a);b.a.extend(d,b.R.fn);return d};b.R.fn={remove:function(a){for(var b=this.t(),c=[],e="function"==typeof a?a:function(b){return b===a},f=0;f<b.length;f++){var g=b[f];e(g)&&(0===c.length&&this.H(),c.push(g),b.splice(f,1),f--)}c.length&&this.G();return c},removeAll:function(a){if(a===I){var d=this.t(),c=d.slice(0);this.H();d.splice(0,d.length);this.G();return c}return!a?[]:this.remove(function(d){return 0<=b.a.i(a,d)})},destroy:function(a){var b=this.t(),c="function"==typeof a?a:function(b){return b===
  a};this.H();for(var e=b.length-1;0<=e;e--)c(b[e])&&(b[e]._destroy=m);this.G()},destroyAll:function(a){return a===I?this.destroy(u(m)):!a?[]:this.destroy(function(d){return 0<=b.a.i(a,d)})},indexOf:function(a){var d=this();return b.a.i(d,a)},replace:function(a,b){var c=this.indexOf(a);0<=c&&(this.H(),this.t()[c]=b,this.G())}};b.a.o("pop push reverse shift sort splice unshift".split(" "),function(a){b.R.fn[a]=function(){var b=this.t();this.H();b=b[a].apply(b,arguments);this.G();return b}});b.a.o(["slice"],
  function(a){b.R.fn[a]=function(){var b=this();return b[a].apply(b,arguments)}});b.b("observableArray",b.R);b.j=function(a,d,c){function e(){b.a.o(z,function(a){a.B()});z=[]}function f(){var a=h.throttleEvaluation;a&&0<=a?(clearTimeout(t),t=setTimeout(g,a)):g()}function g(){if(!q)if(n&&w())A();else{q=m;try{var a=b.a.V(z,function(a){return a.target});b.r.mb(function(c){var d;0<=(d=b.a.i(a,c))?a[d]=I:z.push(c.ya(f))});for(var c=s.call(d),e=a.length-1;0<=e;e--)a[e]&&z.splice(e,1)[0].B();n=m;h.notifySubscribers(l,
  "beforeChange");l=c}finally{b.r.end()}h.notifySubscribers(l);q=r;z.length||A()}}function h(){if(0<arguments.length)return"function"===typeof v?v.apply(d,arguments):j(Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.")),this;n||g();b.r.Wa(h);return l}function k(){return!n||0<z.length}var l,n=r,q=r,s=a;s&&"object"==typeof s?(c=s,s=c.read):(c=c||{},s||(s=c.read));"function"!=typeof s&&j(Error("Pass a function that returns the value of the ko.computed"));
  var v=c.write,G=c.disposeWhenNodeIsRemoved||c.W||p,w=c.disposeWhen||c.Ka||u(r),A=e,z=[],t=p;d||(d=c.owner);h.t=function(){n||g();return l};h.xb=function(){return z.length};h.zb="function"===typeof c.write;h.B=function(){A()};h.pa=k;b.S.call(h);b.a.extend(h,b.j.fn);b.p(h,"peek",h.t);b.p(h,"dispose",h.B);b.p(h,"isActive",h.pa);b.p(h,"getDependenciesCount",h.xb);c.deferEvaluation!==m&&g();if(G&&k()){A=function(){b.a.F.Xa(G,arguments.callee);e()};b.a.F.Ca(G,A);var D=w,w=function(){return!b.a.X(G)||D()}}return h};
  b.Bb=function(a){return b.ma(a,b.j)};w=b.m.Kb;b.j[w]=b.m;b.j.fn={};b.j.fn[w]=b.j;b.b("dependentObservable",b.j);b.b("computed",b.j);b.b("isComputed",b.Bb);b.gb=function(a){0==arguments.length&&j(Error("When calling ko.toJS, pass the object you want to convert."));return ba(a,function(a){for(var c=0;b.$(a)&&10>c;c++)a=a();return a})};b.toJSON=function(a,d,c){a=b.gb(a);return b.a.xa(a,d,c)};b.b("toJS",b.gb);b.b("toJSON",b.toJSON);b.k={q:function(a){switch(b.a.u(a)){case "option":return a.__ko__hasDomDataOptionValue__===
  m?b.a.f.get(a,b.c.options.sa):7>=b.a.Z?a.getAttributeNode("value").specified?a.value:a.text:a.value;case "select":return 0<=a.selectedIndex?b.k.q(a.options[a.selectedIndex]):I;default:return a.value}},T:function(a,d){switch(b.a.u(a)){case "option":switch(typeof d){case "string":b.a.f.set(a,b.c.options.sa,I);"__ko__hasDomDataOptionValue__"in a&&delete a.__ko__hasDomDataOptionValue__;a.value=d;break;default:b.a.f.set(a,b.c.options.sa,d),a.__ko__hasDomDataOptionValue__=m,a.value="number"===typeof d?
  d:""}break;case "select":for(var c=a.options.length-1;0<=c;c--)if(b.k.q(a.options[c])==d){a.selectedIndex=c;break}break;default:if(d===p||d===I)d="";a.value=d}}};b.b("selectExtensions",b.k);b.b("selectExtensions.readValue",b.k.q);b.b("selectExtensions.writeValue",b.k.T);var ka=/\@ko_token_(\d+)\@/g,na=["true","false"],oa=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;b.g={Q:[],aa:function(a){var d=b.a.D(a);if(3>d.length)return[];"{"===d.charAt(0)&&(d=d.substring(1,d.length-1));a=[];for(var c=
  p,e,f=0;f<d.length;f++){var g=d.charAt(f);if(c===p)switch(g){case '"':case "'":case "/":c=f,e=g}else if(g==e&&"\\"!==d.charAt(f-1)){g=d.substring(c,f+1);a.push(g);var h="@ko_token_"+(a.length-1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f=f-(g.length-h.length),c=p}}e=c=p;for(var k=0,l=p,f=0;f<d.length;f++){g=d.charAt(f);if(c===p)switch(g){case "{":c=f;l=g;e="}";break;case "(":c=f;l=g;e=")";break;case "[":c=f,l=g,e="]"}g===l?k++:g===e&&(k--,0===k&&(g=d.substring(c,f+1),a.push(g),h="@ko_token_"+(a.length-
  1)+"@",d=d.substring(0,c)+h+d.substring(f+1),f-=g.length-h.length,c=p))}e=[];d=d.split(",");c=0;for(f=d.length;c<f;c++)k=d[c],l=k.indexOf(":"),0<l&&l<k.length-1?(g=k.substring(l+1),e.push({key:P(k.substring(0,l),a),value:P(g,a)})):e.push({unknown:P(k,a)});return e},ba:function(a){var d="string"===typeof a?b.g.aa(a):a,c=[];a=[];for(var e,f=0;e=d[f];f++)if(0<c.length&&c.push(","),e.key){var g;a:{g=e.key;var h=b.a.D(g);switch(h.length&&h.charAt(0)){case "'":case '"':break a;default:g="'"+h+"'"}}e=e.value;
  c.push(g);c.push(":");c.push(e);e=b.a.D(e);0<=b.a.i(na,b.a.D(e).toLowerCase())?e=r:(h=e.match(oa),e=h===p?r:h[1]?"Object("+h[1]+")"+h[2]:e);e&&(0<a.length&&a.push(", "),a.push(g+" : function(__ko_value) { "+e+" = __ko_value; }"))}else e.unknown&&c.push(e.unknown);d=c.join("");0<a.length&&(d=d+", '_ko_property_writers' : { "+a.join("")+" } ");return d},Eb:function(a,d){for(var c=0;c<a.length;c++)if(b.a.D(a[c].key)==d)return m;return r},ea:function(a,d,c,e,f){if(!a||!b.Ra(a)){if((a=d()._ko_property_writers)&&
  a[c])a[c](e)}else(!f||a.t()!==e)&&a(e)}};b.b("expressionRewriting",b.g);b.b("expressionRewriting.bindingRewriteValidators",b.g.Q);b.b("expressionRewriting.parseObjectLiteral",b.g.aa);b.b("expressionRewriting.preProcessBindings",b.g.ba);b.b("jsonExpressionRewriting",b.g);b.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",b.g.ba);var K="\x3c!--test--\x3e"===y.createComment("test").text,ja=K?/^\x3c!--\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*--\x3e$/:/^\s*ko(?:\s+(.+\s*\:[\s\S]*))?\s*$/,ia=K?/^\x3c!--\s*\/ko\s*--\x3e$/:
  /^\s*\/ko\s*$/,pa={ul:m,ol:m};b.e={I:{},childNodes:function(a){return B(a)?aa(a):a.childNodes},Y:function(a){if(B(a)){a=b.e.childNodes(a);for(var d=0,c=a.length;d<c;d++)b.removeNode(a[d])}else b.a.ka(a)},N:function(a,d){if(B(a)){b.e.Y(a);for(var c=a.nextSibling,e=0,f=d.length;e<f;e++)c.parentNode.insertBefore(d[e],c)}else b.a.N(a,d)},Va:function(a,b){B(a)?a.parentNode.insertBefore(b,a.nextSibling):a.firstChild?a.insertBefore(b,a.firstChild):a.appendChild(b)},Pa:function(a,d,c){c?B(a)?a.parentNode.insertBefore(d,
  c.nextSibling):c.nextSibling?a.insertBefore(d,c.nextSibling):a.appendChild(d):b.e.Va(a,d)},firstChild:function(a){return!B(a)?a.firstChild:!a.nextSibling||H(a.nextSibling)?p:a.nextSibling},nextSibling:function(a){B(a)&&(a=$(a));return a.nextSibling&&H(a.nextSibling)?p:a.nextSibling},jb:function(a){return(a=B(a))?a[1]:p},Ta:function(a){if(pa[b.a.u(a)]){var d=a.firstChild;if(d){do if(1===d.nodeType){var c;c=d.firstChild;var e=p;if(c){do if(e)e.push(c);else if(B(c)){var f=$(c,m);f?c=f:e=[c]}else H(c)&&
  (e=[c]);while(c=c.nextSibling)}if(c=e){e=d.nextSibling;for(f=0;f<c.length;f++)e?a.insertBefore(c[f],e):a.appendChild(c[f])}}while(d=d.nextSibling)}}}};b.b("virtualElements",b.e);b.b("virtualElements.allowedBindings",b.e.I);b.b("virtualElements.emptyNode",b.e.Y);b.b("virtualElements.insertAfter",b.e.Pa);b.b("virtualElements.prepend",b.e.Va);b.b("virtualElements.setDomNodeChildren",b.e.N);b.J=function(){this.Ha={}};b.a.extend(b.J.prototype,{nodeHasBindings:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind")!=
  p;case 8:return b.e.jb(a)!=p;default:return r}},getBindings:function(a,b){var c=this.getBindingsString(a,b);return c?this.parseBindingsString(c,b,a):p},getBindingsString:function(a){switch(a.nodeType){case 1:return a.getAttribute("data-bind");case 8:return b.e.jb(a);default:return p}},parseBindingsString:function(a,d,c){try{var e;if(!(e=this.Ha[a])){var f=this.Ha,g,h="with($context){with($data||{}){return{"+b.g.ba(a)+"}}}";g=new Function("$context","$element",h);e=f[a]=g}return e(d,c)}catch(k){j(Error("Unable to parse bindings.\nMessage: "+
  k+";\nBindings value: "+a))}}});b.J.instance=new b.J;b.b("bindingProvider",b.J);b.c={};b.z=function(a,d,c){d?(b.a.extend(this,d),this.$parentContext=d,this.$parent=d.$data,this.$parents=(d.$parents||[]).slice(0),this.$parents.unshift(this.$parent)):(this.$parents=[],this.$root=a,this.ko=b);this.$data=a;c&&(this[c]=a)};b.z.prototype.createChildContext=function(a,d){return new b.z(a,this,d)};b.z.prototype.extend=function(a){var d=b.a.extend(new b.z,this);return b.a.extend(d,a)};b.eb=function(a,d){if(2==
  arguments.length)b.a.f.set(a,"__ko_bindingContext__",d);else return b.a.f.get(a,"__ko_bindingContext__")};b.Fa=function(a,d,c){1===a.nodeType&&b.e.Ta(a);return X(a,d,c,m)};b.Ea=function(a,b){(1===b.nodeType||8===b.nodeType)&&Z(a,b,m)};b.Da=function(a,b){b&&(1!==b.nodeType&&8!==b.nodeType)&&j(Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node"));b=b||x.document.body;Y(a,b,m)};b.ja=function(a){switch(a.nodeType){case 1:case 8:var d=b.eb(a);if(d)return d;
  if(a.parentNode)return b.ja(a.parentNode)}return I};b.pb=function(a){return(a=b.ja(a))?a.$data:I};b.b("bindingHandlers",b.c);b.b("applyBindings",b.Da);b.b("applyBindingsToDescendants",b.Ea);b.b("applyBindingsToNode",b.Fa);b.b("contextFor",b.ja);b.b("dataFor",b.pb);var fa={"class":"className","for":"htmlFor"};b.c.attr={update:function(a,d){var c=b.a.d(d())||{},e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]),g=f===r||f===p||f===I;g&&a.removeAttribute(e);8>=b.a.Z&&e in fa?(e=fa[e],g?a.removeAttribute(e):
  a[e]=f):g||a.setAttribute(e,f.toString());"name"===e&&b.a.ab(a,g?"":f.toString())}}};b.c.checked={init:function(a,d,c){b.a.n(a,"click",function(){var e;if("checkbox"==a.type)e=a.checked;else if("radio"==a.type&&a.checked)e=a.value;else return;var f=d(),g=b.a.d(f);"checkbox"==a.type&&g instanceof Array?(e=b.a.i(g,a.value),a.checked&&0>e?f.push(a.value):!a.checked&&0<=e&&f.splice(e,1)):b.g.ea(f,c,"checked",e,m)});"radio"==a.type&&!a.name&&b.c.uniqueName.init(a,u(m))},update:function(a,d){var c=b.a.d(d());
  "checkbox"==a.type?a.checked=c instanceof Array?0<=b.a.i(c,a.value):c:"radio"==a.type&&(a.checked=a.value==c)}};b.c.css={update:function(a,d){var c=b.a.d(d());if("object"==typeof c)for(var e in c){var f=b.a.d(c[e]);b.a.da(a,e,f)}else c=String(c||""),b.a.da(a,a.__ko__cssValue,r),a.__ko__cssValue=c,b.a.da(a,c,m)}};b.c.enable={update:function(a,d){var c=b.a.d(d());c&&a.disabled?a.removeAttribute("disabled"):!c&&!a.disabled&&(a.disabled=m)}};b.c.disable={update:function(a,d){b.c.enable.update(a,function(){return!b.a.d(d())})}};
  b.c.event={init:function(a,d,c,e){var f=d()||{},g;for(g in f)(function(){var f=g;"string"==typeof f&&b.a.n(a,f,function(a){var g,n=d()[f];if(n){var q=c();try{var s=b.a.L(arguments);s.unshift(e);g=n.apply(e,s)}finally{g!==m&&(a.preventDefault?a.preventDefault():a.returnValue=r)}q[f+"Bubble"]===r&&(a.cancelBubble=m,a.stopPropagation&&a.stopPropagation())}})})()}};b.c.foreach={Sa:function(a){return function(){var d=a(),c=b.a.ua(d);if(!c||"number"==typeof c.length)return{foreach:d,templateEngine:b.C.oa};
  b.a.d(d);return{foreach:c.data,as:c.as,includeDestroyed:c.includeDestroyed,afterAdd:c.afterAdd,beforeRemove:c.beforeRemove,afterRender:c.afterRender,beforeMove:c.beforeMove,afterMove:c.afterMove,templateEngine:b.C.oa}}},init:function(a,d){return b.c.template.init(a,b.c.foreach.Sa(d))},update:function(a,d,c,e,f){return b.c.template.update(a,b.c.foreach.Sa(d),c,e,f)}};b.g.Q.foreach=r;b.e.I.foreach=m;b.c.hasfocus={init:function(a,d,c){function e(e){a.__ko_hasfocusUpdating=m;var f=a.ownerDocument;"activeElement"in
  f&&(e=f.activeElement===a);f=d();b.g.ea(f,c,"hasfocus",e,m);a.__ko_hasfocusUpdating=r}var f=e.bind(p,m),g=e.bind(p,r);b.a.n(a,"focus",f);b.a.n(a,"focusin",f);b.a.n(a,"blur",g);b.a.n(a,"focusout",g)},update:function(a,d){var c=b.a.d(d());a.__ko_hasfocusUpdating||(c?a.focus():a.blur(),b.r.K(b.a.Ba,p,[a,c?"focusin":"focusout"]))}};b.c.html={init:function(){return{controlsDescendantBindings:m}},update:function(a,d){b.a.ca(a,d())}};var da="__ko_withIfBindingData";Q("if");Q("ifnot",r,m);Q("with",m,r,function(a,
  b){return a.createChildContext(b)});b.c.options={update:function(a,d,c){"select"!==b.a.u(a)&&j(Error("options binding applies only to SELECT elements"));for(var e=0==a.length,f=b.a.V(b.a.fa(a.childNodes,function(a){return a.tagName&&"option"===b.a.u(a)&&a.selected}),function(a){return b.k.q(a)||a.innerText||a.textContent}),g=a.scrollTop,h=b.a.d(d());0<a.length;)b.A(a.options[0]),a.remove(0);if(h){c=c();var k=c.optionsIncludeDestroyed;"number"!=typeof h.length&&(h=[h]);if(c.optionsCaption){var l=y.createElement("option");
  b.a.ca(l,c.optionsCaption);b.k.T(l,I);a.appendChild(l)}d=0;for(var n=h.length;d<n;d++){var q=h[d];if(!q||!q._destroy||k){var l=y.createElement("option"),s=function(a,b,c){var d=typeof b;return"function"==d?b(a):"string"==d?a[b]:c},v=s(q,c.optionsValue,q);b.k.T(l,b.a.d(v));q=s(q,c.optionsText,v);b.a.cb(l,q);a.appendChild(l)}}h=a.getElementsByTagName("option");d=k=0;for(n=h.length;d<n;d++)0<=b.a.i(f,b.k.q(h[d]))&&(b.a.bb(h[d],m),k++);a.scrollTop=g;e&&"value"in c&&ea(a,b.a.ua(c.value),m);b.a.ub(a)}}};
  b.c.options.sa="__ko.optionValueDomData__";b.c.selectedOptions={init:function(a,d,c){b.a.n(a,"change",function(){var e=d(),f=[];b.a.o(a.getElementsByTagName("option"),function(a){a.selected&&f.push(b.k.q(a))});b.g.ea(e,c,"value",f)})},update:function(a,d){"select"!=b.a.u(a)&&j(Error("values binding applies only to SELECT elements"));var c=b.a.d(d());c&&"number"==typeof c.length&&b.a.o(a.getElementsByTagName("option"),function(a){var d=0<=b.a.i(c,b.k.q(a));b.a.bb(a,d)})}};b.c.style={update:function(a,
  d){var c=b.a.d(d()||{}),e;for(e in c)if("string"==typeof e){var f=b.a.d(c[e]);a.style[e]=f||""}}};b.c.submit={init:function(a,d,c,e){"function"!=typeof d()&&j(Error("The value for a submit binding must be a function"));b.a.n(a,"submit",function(b){var c,h=d();try{c=h.call(e,a)}finally{c!==m&&(b.preventDefault?b.preventDefault():b.returnValue=r)}})}};b.c.text={update:function(a,d){b.a.cb(a,d())}};b.e.I.text=m;b.c.uniqueName={init:function(a,d){if(d()){var c="ko_unique_"+ ++b.c.uniqueName.ob;b.a.ab(a,
  c)}}};b.c.uniqueName.ob=0;b.c.value={init:function(a,d,c){function e(){h=r;var e=d(),f=b.k.q(a);b.g.ea(e,c,"value",f)}var f=["change"],g=c().valueUpdate,h=r;g&&("string"==typeof g&&(g=[g]),b.a.P(f,g),f=b.a.Ga(f));if(b.a.Z&&("input"==a.tagName.toLowerCase()&&"text"==a.type&&"off"!=a.autocomplete&&(!a.form||"off"!=a.form.autocomplete))&&-1==b.a.i(f,"propertychange"))b.a.n(a,"propertychange",function(){h=m}),b.a.n(a,"blur",function(){h&&e()});b.a.o(f,function(c){var d=e;b.a.Ob(c,"after")&&(d=function(){setTimeout(e,
  0)},c=c.substring(5));b.a.n(a,c,d)})},update:function(a,d){var c="select"===b.a.u(a),e=b.a.d(d()),f=b.k.q(a),g=e!=f;0===e&&(0!==f&&"0"!==f)&&(g=m);g&&(f=function(){b.k.T(a,e)},f(),c&&setTimeout(f,0));c&&0<a.length&&ea(a,e,r)}};b.c.visible={update:function(a,d){var c=b.a.d(d()),e="none"!=a.style.display;c&&!e?a.style.display="":!c&&e&&(a.style.display="none")}};b.c.click={init:function(a,d,c,e){return b.c.event.init.call(this,a,function(){var a={};a.click=d();return a},c,e)}};b.v=function(){};b.v.prototype.renderTemplateSource=
  function(){j(Error("Override renderTemplateSource"))};b.v.prototype.createJavaScriptEvaluatorBlock=function(){j(Error("Override createJavaScriptEvaluatorBlock"))};b.v.prototype.makeTemplateSource=function(a,d){if("string"==typeof a){d=d||y;var c=d.getElementById(a);c||j(Error("Cannot find template with ID "+a));return new b.l.h(c)}if(1==a.nodeType||8==a.nodeType)return new b.l.O(a);j(Error("Unknown template type: "+a))};b.v.prototype.renderTemplate=function(a,b,c,e){a=this.makeTemplateSource(a,e);
  return this.renderTemplateSource(a,b,c)};b.v.prototype.isTemplateRewritten=function(a,b){return this.allowTemplateRewriting===r?m:this.makeTemplateSource(a,b).data("isRewritten")};b.v.prototype.rewriteTemplate=function(a,b,c){a=this.makeTemplateSource(a,c);b=b(a.text());a.text(b);a.data("isRewritten",m)};b.b("templateEngine",b.v);var qa=/(<[a-z]+\d*(\s+(?!data-bind=)[a-z0-9\-]+(=(\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind=(["'])([\s\S]*?)\5/gi,ra=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;b.za={vb:function(a,
  d,c){d.isTemplateRewritten(a,c)||d.rewriteTemplate(a,function(a){return b.za.Gb(a,d)},c)},Gb:function(a,b){return a.replace(qa,function(a,e,f,g,h,k,l){return W(l,e,b)}).replace(ra,function(a,e){return W(e,"\x3c!-- ko --\x3e",b)})},kb:function(a){return b.s.ra(function(d,c){d.nextSibling&&b.Fa(d.nextSibling,a,c)})}};b.b("__tr_ambtns",b.za.kb);b.l={};b.l.h=function(a){this.h=a};b.l.h.prototype.text=function(){var a=b.a.u(this.h),a="script"===a?"text":"textarea"===a?"value":"innerHTML";if(0==arguments.length)return this.h[a];
  var d=arguments[0];"innerHTML"===a?b.a.ca(this.h,d):this.h[a]=d};b.l.h.prototype.data=function(a){if(1===arguments.length)return b.a.f.get(this.h,"templateSourceData_"+a);b.a.f.set(this.h,"templateSourceData_"+a,arguments[1])};b.l.O=function(a){this.h=a};b.l.O.prototype=new b.l.h;b.l.O.prototype.text=function(){if(0==arguments.length){var a=b.a.f.get(this.h,"__ko_anon_template__")||{};a.Aa===I&&a.ia&&(a.Aa=a.ia.innerHTML);return a.Aa}b.a.f.set(this.h,"__ko_anon_template__",{Aa:arguments[0]})};b.l.h.prototype.nodes=
  function(){if(0==arguments.length)return(b.a.f.get(this.h,"__ko_anon_template__")||{}).ia;b.a.f.set(this.h,"__ko_anon_template__",{ia:arguments[0]})};b.b("templateSources",b.l);b.b("templateSources.domElement",b.l.h);b.b("templateSources.anonymousTemplate",b.l.O);var O;b.wa=function(a){a!=I&&!(a instanceof b.v)&&j(Error("templateEngine must inherit from ko.templateEngine"));O=a};b.va=function(a,d,c,e,f){c=c||{};(c.templateEngine||O)==I&&j(Error("Set a template engine before calling renderTemplate"));
  f=f||"replaceChildren";if(e){var g=N(e);return b.j(function(){var h=d&&d instanceof b.z?d:new b.z(b.a.d(d)),k="function"==typeof a?a(h.$data,h):a,h=T(e,f,k,h,c);"replaceNode"==f&&(e=h,g=N(e))},p,{Ka:function(){return!g||!b.a.X(g)},W:g&&"replaceNode"==f?g.parentNode:g})}return b.s.ra(function(e){b.va(a,d,c,e,"replaceNode")})};b.Mb=function(a,d,c,e,f){function g(a,b){U(b,k);c.afterRender&&c.afterRender(b,a)}function h(d,e){k=f.createChildContext(b.a.d(d),c.as);k.$index=e;var g="function"==typeof a?
  a(d,k):a;return T(p,"ignoreTargetNode",g,k,c)}var k;return b.j(function(){var a=b.a.d(d)||[];"undefined"==typeof a.length&&(a=[a]);a=b.a.fa(a,function(a){return c.includeDestroyed||a===I||a===p||!b.a.d(a._destroy)});b.r.K(b.a.$a,p,[e,a,h,c,g])},p,{W:e})};b.c.template={init:function(a,d){var c=b.a.d(d());if("string"!=typeof c&&!c.name&&(1==a.nodeType||8==a.nodeType))c=1==a.nodeType?a.childNodes:b.e.childNodes(a),c=b.a.Hb(c),(new b.l.O(a)).nodes(c);return{controlsDescendantBindings:m}},update:function(a,
  d,c,e,f){d=b.a.d(d());c={};e=m;var g,h=p;"string"!=typeof d&&(c=d,d=c.name,"if"in c&&(e=b.a.d(c["if"])),e&&"ifnot"in c&&(e=!b.a.d(c.ifnot)),g=b.a.d(c.data));"foreach"in c?h=b.Mb(d||a,e&&c.foreach||[],c,a,f):e?(f="data"in c?f.createChildContext(g,c.as):f,h=b.va(d||a,f,c,a)):b.e.Y(a);f=h;(g=b.a.f.get(a,"__ko__templateComputedDomDataKey__"))&&"function"==typeof g.B&&g.B();b.a.f.set(a,"__ko__templateComputedDomDataKey__",f&&f.pa()?f:I)}};b.g.Q.template=function(a){a=b.g.aa(a);return 1==a.length&&a[0].unknown||
  b.g.Eb(a,"name")?p:"This template engine does not support anonymous templates nested within its templates"};b.e.I.template=m;b.b("setTemplateEngine",b.wa);b.b("renderTemplate",b.va);b.a.Ja=function(a,b,c){a=a||[];b=b||[];return a.length<=b.length?S(a,b,"added","deleted",c):S(b,a,"deleted","added",c)};b.b("utils.compareArrays",b.a.Ja);b.a.$a=function(a,d,c,e,f){function g(a,b){t=l[b];w!==b&&(z[a]=t);t.na(w++);M(t.M);s.push(t);A.push(t)}function h(a,c){if(a)for(var d=0,e=c.length;d<e;d++)c[d]&&b.a.o(c[d].M,
  function(b){a(b,d,c[d].U)})}d=d||[];e=e||{};var k=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")===I,l=b.a.f.get(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult")||[],n=b.a.V(l,function(a){return a.U}),q=b.a.Ja(n,d),s=[],v=0,w=0,B=[],A=[];d=[];for(var z=[],n=[],t,D=0,C,E;C=q[D];D++)switch(E=C.moved,C.status){case "deleted":E===I&&(t=l[v],t.j&&t.j.B(),B.push.apply(B,M(t.M)),e.beforeRemove&&(d[D]=t,A.push(t)));v++;break;case "retained":g(D,v++);break;case "added":E!==I?
  g(D,E):(t={U:C.value,na:b.m(w++)},s.push(t),A.push(t),k||(n[D]=t))}h(e.beforeMove,z);b.a.o(B,e.beforeRemove?b.A:b.removeNode);for(var D=0,k=b.e.firstChild(a),H;t=A[D];D++){t.M||b.a.extend(t,ha(a,c,t.U,f,t.na));for(v=0;q=t.M[v];k=q.nextSibling,H=q,v++)q!==k&&b.e.Pa(a,q,H);!t.Ab&&f&&(f(t.U,t.M,t.na),t.Ab=m)}h(e.beforeRemove,d);h(e.afterMove,z);h(e.afterAdd,n);b.a.f.set(a,"setDomNodeChildrenFromArrayMapping_lastMappingResult",s)};b.b("utils.setDomNodeChildrenFromArrayMapping",b.a.$a);b.C=function(){this.allowTemplateRewriting=
  r};b.C.prototype=new b.v;b.C.prototype.renderTemplateSource=function(a){var d=!(9>b.a.Z)&&a.nodes?a.nodes():p;if(d)return b.a.L(d.cloneNode(m).childNodes);a=a.text();return b.a.ta(a)};b.C.oa=new b.C;b.wa(b.C.oa);b.b("nativeTemplateEngine",b.C);b.qa=function(){var a=this.Db=function(){if("undefined"==typeof F||!F.tmpl)return 0;try{if(0<=F.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();this.renderTemplateSource=function(b,c,e){e=e||{};2>a&&j(Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later."));
  var f=b.data("precompiled");f||(f=b.text()||"",f=F.template(p,"{{ko_with $item.koBindingContext}}"+f+"{{/ko_with}}"),b.data("precompiled",f));b=[c.$data];c=F.extend({koBindingContext:c},e.templateOptions);c=F.tmpl(f,b,c);c.appendTo(y.createElement("div"));F.fragments={};return c};this.createJavaScriptEvaluatorBlock=function(a){return"{{ko_code ((function() { return "+a+" })()) }}"};this.addTemplate=function(a,b){y.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>")};0<a&&(F.tmpl.tag.ko_code=
  {open:"__.push($1 || '');"},F.tmpl.tag.ko_with={open:"with($1) {",close:"} "})};b.qa.prototype=new b.v;w=new b.qa;0<w.Db&&b.wa(w);b.b("jqueryTmplTemplateEngine",b.qa)}"function"===typeof require&&"object"===typeof exports&&"object"===typeof module?L(module.exports||exports):"function"===typeof define&&define.amd?define(["exports"],L):L(x.ko={});m;
  })();
  

  provide("knockout-client", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * @preserve Qwery - A Blazing Fast query selector engine
    * https://github.com/ded/qwery
    * copyright Dustin Diaz 2012
    * MIT License
    */
  
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('qwery', this, function () {
    var doc = document
      , html = doc.documentElement
      , byClass = 'getElementsByClassName'
      , byTag = 'getElementsByTagName'
      , qSA = 'querySelectorAll'
      , useNativeQSA = 'useNativeQSA'
      , tagName = 'tagName'
      , nodeType = 'nodeType'
      , select // main select() method, assign later
  
      , id = /#([\w\-]+)/
      , clas = /\.[\w\-]+/g
      , idOnly = /^#([\w\-]+)$/
      , classOnly = /^\.([\w\-]+)$/
      , tagOnly = /^([\w\-]+)$/
      , tagAndOrClass = /^([\w]+)?\.([\w\-]+)$/
      , splittable = /(^|,)\s*[>~+]/
      , normalizr = /^\s+|\s*([,\s\+\~>]|$)\s*/g
      , splitters = /[\s\>\+\~]/
      , splittersMore = /(?![\s\w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^'"]*\]|[\s\w\+\-]*\))/
      , specialChars = /([.*+?\^=!:${}()|\[\]\/\\])/g
      , simple = /^(\*|[a-z0-9]+)?(?:([\.\#]+[\w\-\.#]+)?)/
      , attr = /\[([\w\-]+)(?:([\|\^\$\*\~]?\=)['"]?([ \w\-\/\?\&\=\:\.\(\)\!,@#%<>\{\}\$\*\^]+)["']?)?\]/
      , pseudo = /:([\w\-]+)(\(['"]?([^()]+)['"]?\))?/
      , easy = new RegExp(idOnly.source + '|' + tagOnly.source + '|' + classOnly.source)
      , dividers = new RegExp('(' + splitters.source + ')' + splittersMore.source, 'g')
      , tokenizr = new RegExp(splitters.source + splittersMore.source)
      , chunker = new RegExp(simple.source + '(' + attr.source + ')?' + '(' + pseudo.source + ')?')
  
    var walker = {
        ' ': function (node) {
          return node && node !== html && node.parentNode
        }
      , '>': function (node, contestant) {
          return node && node.parentNode == contestant.parentNode && node.parentNode
        }
      , '~': function (node) {
          return node && node.previousSibling
        }
      , '+': function (node, contestant, p1, p2) {
          if (!node) return false
          return (p1 = previous(node)) && (p2 = previous(contestant)) && p1 == p2 && p1
        }
      }
  
    function cache() {
      this.c = {}
    }
    cache.prototype = {
      g: function (k) {
        return this.c[k] || undefined
      }
    , s: function (k, v, r) {
        v = r ? new RegExp(v) : v
        return (this.c[k] = v)
      }
    }
  
    var classCache = new cache()
      , cleanCache = new cache()
      , attrCache = new cache()
      , tokenCache = new cache()
  
    function classRegex(c) {
      return classCache.g(c) || classCache.s(c, '(^|\\s+)' + c + '(\\s+|$)', 1)
    }
  
    // not quite as fast as inline loops in older browsers so don't use liberally
    function each(a, fn) {
      var i = 0, l = a.length
      for (; i < l; i++) fn(a[i])
    }
  
    function flatten(ar) {
      for (var r = [], i = 0, l = ar.length; i < l; ++i) arrayLike(ar[i]) ? (r = r.concat(ar[i])) : (r[r.length] = ar[i])
      return r
    }
  
    function arrayify(ar) {
      var i = 0, l = ar.length, r = []
      for (; i < l; i++) r[i] = ar[i]
      return r
    }
  
    function previous(n) {
      while (n = n.previousSibling) if (n[nodeType] == 1) break;
      return n
    }
  
    function q(query) {
      return query.match(chunker)
    }
  
    // called using `this` as element and arguments from regex group results.
    // given => div.hello[title="world"]:foo('bar')
    // div.hello[title="world"]:foo('bar'), div, .hello, [title="world"], title, =, world, :foo('bar'), foo, ('bar'), bar]
    function interpret(whole, tag, idsAndClasses, wholeAttribute, attribute, qualifier, value, wholePseudo, pseudo, wholePseudoVal, pseudoVal) {
      var i, m, k, o, classes
      if (this[nodeType] !== 1) return false
      if (tag && tag !== '*' && this[tagName] && this[tagName].toLowerCase() !== tag) return false
      if (idsAndClasses && (m = idsAndClasses.match(id)) && m[1] !== this.id) return false
      if (idsAndClasses && (classes = idsAndClasses.match(clas))) {
        for (i = classes.length; i--;) if (!classRegex(classes[i].slice(1)).test(this.className)) return false
      }
      if (pseudo && qwery.pseudos[pseudo] && !qwery.pseudos[pseudo](this, pseudoVal)) return false
      if (wholeAttribute && !value) { // select is just for existance of attrib
        o = this.attributes
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k) && (o[k].name || k) == attribute) {
            return this
          }
        }
      }
      if (wholeAttribute && !checkAttr(qualifier, getAttr(this, attribute) || '', value)) {
        // select is for attrib equality
        return false
      }
      return this
    }
  
    function clean(s) {
      return cleanCache.g(s) || cleanCache.s(s, s.replace(specialChars, '\\$1'))
    }
  
    function checkAttr(qualify, actual, val) {
      switch (qualify) {
      case '=':
        return actual == val
      case '^=':
        return actual.match(attrCache.g('^=' + val) || attrCache.s('^=' + val, '^' + clean(val), 1))
      case '$=':
        return actual.match(attrCache.g('$=' + val) || attrCache.s('$=' + val, clean(val) + '$', 1))
      case '*=':
        return actual.match(attrCache.g(val) || attrCache.s(val, clean(val), 1))
      case '~=':
        return actual.match(attrCache.g('~=' + val) || attrCache.s('~=' + val, '(?:^|\\s+)' + clean(val) + '(?:\\s+|$)', 1))
      case '|=':
        return actual.match(attrCache.g('|=' + val) || attrCache.s('|=' + val, '^' + clean(val) + '(-|$)', 1))
      }
      return 0
    }
  
    // given a selector, first check for simple cases then collect all base candidate matches and filter
    function _qwery(selector, _root) {
      var r = [], ret = [], i, l, m, token, tag, els, intr, item, root = _root
        , tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        , dividedTokens = selector.match(dividers)
  
      if (!tokens.length) return r
  
      token = (tokens = tokens.slice(0)).pop() // copy cached tokens, take the last one
      if (tokens.length && (m = tokens[tokens.length - 1].match(idOnly))) root = byId(_root, m[1])
      if (!root) return r
  
      intr = q(token)
      // collect base candidates to filter
      els = root !== _root && root[nodeType] !== 9 && dividedTokens && /^[+~]$/.test(dividedTokens[dividedTokens.length - 1]) ?
        function (r) {
          while (root = root.nextSibling) {
            root[nodeType] == 1 && (intr[1] ? intr[1] == root[tagName].toLowerCase() : 1) && (r[r.length] = root)
          }
          return r
        }([]) :
        root[byTag](intr[1] || '*')
      // filter elements according to the right-most part of the selector
      for (i = 0, l = els.length; i < l; i++) {
        if (item = interpret.apply(els[i], intr)) r[r.length] = item
      }
      if (!tokens.length) return r
  
      // filter further according to the rest of the selector (the left side)
      each(r, function (e) { if (ancestorMatch(e, tokens, dividedTokens)) ret[ret.length] = e })
      return ret
    }
  
    // compare element to a selector
    function is(el, selector, root) {
      if (isNode(selector)) return el == selector
      if (arrayLike(selector)) return !!~flatten(selector).indexOf(el) // if selector is an array, is el a member?
  
      var selectors = selector.split(','), tokens, dividedTokens
      while (selector = selectors.pop()) {
        tokens = tokenCache.g(selector) || tokenCache.s(selector, selector.split(tokenizr))
        dividedTokens = selector.match(dividers)
        tokens = tokens.slice(0) // copy array
        if (interpret.apply(el, q(tokens.pop())) && (!tokens.length || ancestorMatch(el, tokens, dividedTokens, root))) {
          return true
        }
      }
      return false
    }
  
    // given elements matching the right-most part of a selector, filter out any that don't match the rest
    function ancestorMatch(el, tokens, dividedTokens, root) {
      var cand
      // recursively work backwards through the tokens and up the dom, covering all options
      function crawl(e, i, p) {
        while (p = walker[dividedTokens[i]](p, e)) {
          if (isNode(p) && (interpret.apply(p, q(tokens[i])))) {
            if (i) {
              if (cand = crawl(p, i - 1, p)) return cand
            } else return p
          }
        }
      }
      return (cand = crawl(el, tokens.length - 1, el)) && (!root || isAncestor(cand, root))
    }
  
    function isNode(el, t) {
      return el && typeof el === 'object' && (t = el[nodeType]) && (t == 1 || t == 9)
    }
  
    function uniq(ar) {
      var a = [], i, j;
      o:
      for (i = 0; i < ar.length; ++i) {
        for (j = 0; j < a.length; ++j) if (a[j] == ar[i]) continue o
        a[a.length] = ar[i]
      }
      return a
    }
  
    function arrayLike(o) {
      return (typeof o === 'object' && isFinite(o.length))
    }
  
    function normalizeRoot(root) {
      if (!root) return doc
      if (typeof root == 'string') return qwery(root)[0]
      if (!root[nodeType] && arrayLike(root)) return root[0]
      return root
    }
  
    function byId(root, id, el) {
      // if doc, query on it, else query the parent doc or if a detached fragment rewrite the query and run on the fragment
      return root[nodeType] === 9 ? root.getElementById(id) :
        root.ownerDocument &&
          (((el = root.ownerDocument.getElementById(id)) && isAncestor(el, root) && el) ||
            (!isAncestor(root, root.ownerDocument) && select('[id="' + id + '"]', root)[0]))
    }
  
    function qwery(selector, _root) {
      var m, el, root = normalizeRoot(_root)
  
      // easy, fast cases that we can dispatch with simple DOM calls
      if (!root || !selector) return []
      if (selector === window || isNode(selector)) {
        return !_root || (selector !== window && isNode(root) && isAncestor(selector, root)) ? [selector] : []
      }
      if (selector && arrayLike(selector)) return flatten(selector)
      if (m = selector.match(easy)) {
        if (m[1]) return (el = byId(root, m[1])) ? [el] : []
        if (m[2]) return arrayify(root[byTag](m[2]))
        if (hasByClass && m[3]) return arrayify(root[byClass](m[3]))
      }
  
      return select(selector, root)
    }
  
    // where the root is not document and a relationship selector is first we have to
    // do some awkward adjustments to get it to work, even with qSA
    function collectSelector(root, collector) {
      return function (s) {
        var oid, nid
        if (splittable.test(s)) {
          if (root[nodeType] !== 9) {
            // make sure the el has an id, rewrite the query, set root to doc and run it
            if (!(nid = oid = root.getAttribute('id'))) root.setAttribute('id', nid = '__qwerymeupscotty')
            s = '[id="' + nid + '"]' + s // avoid byId and allow us to match context element
            collector(root.parentNode || root, s, true)
            oid || root.removeAttribute('id')
          }
          return;
        }
        s.length && collector(root, s, false)
      }
    }
  
    var isAncestor = 'compareDocumentPosition' in html ?
      function (element, container) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (element, container) {
        container = container[nodeType] === 9 || container == window ? html : container
        return container !== element && container.contains(element)
      } :
      function (element, container) {
        while (element = element.parentNode) if (element === container) return 1
        return 0
      }
    , getAttr = function () {
        // detect buggy IE src/href getAttribute() call
        var e = doc.createElement('p')
        return ((e.innerHTML = '<a href="#x">x</a>') && e.firstChild.getAttribute('href') != '#x') ?
          function (e, a) {
            return a === 'class' ? e.className : (a === 'href' || a === 'src') ?
              e.getAttribute(a, 2) : e.getAttribute(a)
          } :
          function (e, a) { return e.getAttribute(a) }
      }()
    , hasByClass = !!doc[byClass]
      // has native qSA support
    , hasQSA = doc.querySelector && doc[qSA]
      // use native qSA
    , selectQSA = function (selector, root) {
        var result = [], ss, e
        try {
          if (root[nodeType] === 9 || !splittable.test(selector)) {
            // most work is done right here, defer to qSA
            return arrayify(root[qSA](selector))
          }
          // special case where we need the services of `collectSelector()`
          each(ss = selector.split(','), collectSelector(root, function (ctx, s) {
            e = ctx[qSA](s)
            if (e.length == 1) result[result.length] = e.item(0)
            else if (e.length) result = result.concat(arrayify(e))
          }))
          return ss.length > 1 && result.length > 1 ? uniq(result) : result
        } catch (ex) { }
        return selectNonNative(selector, root)
      }
      // no native selector support
    , selectNonNative = function (selector, root) {
        var result = [], items, m, i, l, r, ss
        selector = selector.replace(normalizr, '$1')
        if (m = selector.match(tagAndOrClass)) {
          r = classRegex(m[2])
          items = root[byTag](m[1] || '*')
          for (i = 0, l = items.length; i < l; i++) {
            if (r.test(items[i].className)) result[result.length] = items[i]
          }
          return result
        }
        // more complex selector, get `_qwery()` to do the work for us
        each(ss = selector.split(','), collectSelector(root, function (ctx, s, rewrite) {
          r = _qwery(s, ctx)
          for (i = 0, l = r.length; i < l; i++) {
            if (ctx[nodeType] === 9 || rewrite || isAncestor(r[i], root)) result[result.length] = r[i]
          }
        }))
        return ss.length > 1 && result.length > 1 ? uniq(result) : result
      }
    , configure = function (options) {
        // configNativeQSA: use fully-internal selector or native qSA where present
        if (typeof options[useNativeQSA] !== 'undefined')
          select = !options[useNativeQSA] ? selectNonNative : hasQSA ? selectQSA : selectNonNative
      }
  
    configure({ useNativeQSA: true })
  
    qwery.configure = configure
    qwery.uniq = uniq
    qwery.is = is
    qwery.pseudos = {}
  
    return qwery
  });
  

  provide("qwery", module.exports);

  (function ($) {
    var q = function () {
      var r
      try {
        r = require('qwery')
      } catch (ex) {
        r = require('qwery-mobile')
      } finally {
        return r
      }
    }()
  
    $.pseudos = q.pseudos
  
    $._select = function (s, r) {
      // detect if sibling module 'bonzo' is available at run-time
      // rather than load-time since technically it's not a dependency and
      // can be loaded in any order
      // hence the lazy function re-definition
      return ($._select = (function () {
        var b
        if (typeof $.create == 'function') return function (s, r) {
          return /^\s*</.test(s) ? $.create(s, r) : q(s, r)
        }
        try {
          b = require('bonzo')
          return function (s, r) {
            return /^\s*</.test(s) ? b.create(s, r) : q(s, r)
          }
        } catch (e) { }
        return q
      })())(s, r)
    }
  
    $.ender({
        find: function (s) {
          var r = [], i, l, j, k, els
          for (i = 0, l = this.length; i < l; i++) {
            els = q(s, this[i])
            for (j = 0, k = els.length; j < k; j++) r.push(els[j])
          }
          return $(q.uniq(r))
        }
      , and: function (s) {
          var plus = $(s)
          for (var i = this.length, j = 0, l = this.length + plus.length; i < l; i++, j++) {
            this[i] = plus[j]
          }
          this.length += plus.length
          return this
        }
      , is: function(s, r) {
          var i, l
          for (i = 0, l = this.length; i < l; i++) {
            if (q.is(this[i], s, r)) {
              return true
            }
          }
          return false
        }
    }, true)
  }(ender));
  

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bonzo: DOM Utility (c) Dustin Diaz 2012
    * https://github.com/ded/bonzo
    * License MIT
    */
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('bonzo', this, function() {
    var win = window
      , doc = win.document
      , html = doc.documentElement
      , parentNode = 'parentNode'
      , specialAttributes = /^(checked|value|selected|disabled)$/i
        // tags that we have trouble inserting *into*
      , specialTags = /^(select|fieldset|table|tbody|tfoot|td|tr|colgroup)$/i
      , simpleScriptTagRe = /\s*<script +src=['"]([^'"]+)['"]>/
      , table = ['<table>', '</table>', 1]
      , td = ['<table><tbody><tr>', '</tr></tbody></table>', 3]
      , option = ['<select>', '</select>', 1]
      , noscope = ['_', '', 0, 1]
      , tagMap = { // tags that we have trouble *inserting*
            thead: table, tbody: table, tfoot: table, colgroup: table, caption: table
          , tr: ['<table><tbody>', '</tbody></table>', 2]
          , th: td , td: td
          , col: ['<table><colgroup>', '</colgroup></table>', 2]
          , fieldset: ['<form>', '</form>', 1]
          , legend: ['<form><fieldset>', '</fieldset></form>', 2]
          , option: option, optgroup: option
          , script: noscope, style: noscope, link: noscope, param: noscope, base: noscope
        }
      , stateAttributes = /^(checked|selected|disabled)$/
      , ie = /msie/i.test(navigator.userAgent)
      , hasClass, addClass, removeClass
      , uidMap = {}
      , uuids = 0
      , digit = /^-?[\d\.]+$/
      , dattr = /^data-(.+)$/
      , px = 'px'
      , setAttribute = 'setAttribute'
      , getAttribute = 'getAttribute'
      , byTag = 'getElementsByTagName'
      , features = function() {
          var e = doc.createElement('p')
          e.innerHTML = '<a href="#x">x</a><table style="float:left;"></table>'
          return {
            hrefExtended: e[byTag]('a')[0][getAttribute]('href') != '#x' // IE < 8
          , autoTbody: e[byTag]('tbody').length !== 0 // IE < 8
          , computedStyle: doc.defaultView && doc.defaultView.getComputedStyle
          , cssFloat: e[byTag]('table')[0].style.styleFloat ? 'styleFloat' : 'cssFloat'
          , transform: function () {
              var props = ['transform', 'webkitTransform', 'MozTransform', 'OTransform', 'msTransform'], i
              for (i = 0; i < props.length; i++) {
                if (props[i] in e.style) return props[i]
              }
            }()
          , classList: 'classList' in e
          , opasity: function () {
              return typeof doc.createElement('a').style.opacity !== 'undefined'
            }()
          }
        }()
      , trimReplace = /(^\s*|\s*$)/g
      , whitespaceRegex = /\s+/
      , toString = String.prototype.toString
      , unitless = { lineHeight: 1, zoom: 1, zIndex: 1, opacity: 1, boxFlex: 1, WebkitBoxFlex: 1, MozBoxFlex: 1 }
      , query = doc.querySelectorAll && function (selector) { return doc.querySelectorAll(selector) }
      , trim = String.prototype.trim ?
          function (s) {
            return s.trim()
          } :
          function (s) {
            return s.replace(trimReplace, '')
          }
  
      , getStyle = features.computedStyle
          ? function (el, property) {
              var value = null
                , computed = doc.defaultView.getComputedStyle(el, '')
              computed && (value = computed[property])
              return el.style[property] || value
            }
          : !(ie && html.currentStyle)
            ? function (el, property) {
                return el.style[property]
              }
            :
            /**
             * @param {Element} el
             * @param {string} property
             * @return {string|number}
             */
            function (el, property) {
              var val, value
              if (property == 'opacity' && !features.opasity) {
                val = 100
                try {
                  val = el['filters']['DXImageTransform.Microsoft.Alpha'].opacity
                } catch (e1) {
                  try {
                    val = el['filters']('alpha').opacity
                  } catch (e2) {}
                }
                return val / 100
              }
              value = el.currentStyle ? el.currentStyle[property] : null
              return el.style[property] || value
            }
  
    function isNode(node) {
      return node && node.nodeName && (node.nodeType == 1 || node.nodeType == 11)
    }
  
  
    function normalize(node, host, clone) {
      var i, l, ret
      if (typeof node == 'string') return bonzo.create(node)
      if (isNode(node)) node = [ node ]
      if (clone) {
        ret = [] // don't change original array
        for (i = 0, l = node.length; i < l; i++) ret[i] = cloneNode(host, node[i])
        return ret
      }
      return node
    }
  
    /**
     * @param {string} c a class name to test
     * @return {boolean}
     */
    function classReg(c) {
      return new RegExp('(^|\\s+)' + c + '(\\s+|$)')
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @param {boolean=} opt_rev
     * @return {Bonzo|Array}
     */
    function each(ar, fn, opt_scope, opt_rev) {
      var ind, i = 0, l = ar.length
      for (; i < l; i++) {
        ind = opt_rev ? ar.length - i - 1 : i
        fn.call(opt_scope || ar[ind], ar[ind], ind, ar)
      }
      return ar
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {Bonzo|Array}
     */
    function deepEach(ar, fn, opt_scope) {
      for (var i = 0, l = ar.length; i < l; i++) {
        if (isNode(ar[i])) {
          deepEach(ar[i].childNodes, fn, opt_scope)
          fn.call(opt_scope || ar[i], ar[i], i, ar)
        }
      }
      return ar
    }
  
  
    /**
     * @param {string} s
     * @return {string}
     */
    function camelize(s) {
      return s.replace(/-(.)/g, function (m, m1) {
        return m1.toUpperCase()
      })
    }
  
  
    /**
     * @param {string} s
     * @return {string}
     */
    function decamelize(s) {
      return s ? s.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() : s
    }
  
  
    /**
     * @param {Element} el
     * @return {*}
     */
    function data(el) {
      el[getAttribute]('data-node-uid') || el[setAttribute]('data-node-uid', ++uuids)
      var uid = el[getAttribute]('data-node-uid')
      return uidMap[uid] || (uidMap[uid] = {})
    }
  
  
    /**
     * removes the data associated with an element
     * @param {Element} el
     */
    function clearData(el) {
      var uid = el[getAttribute]('data-node-uid')
      if (uid) delete uidMap[uid]
    }
  
  
    function dataValue(d) {
      var f
      try {
        return (d === null || d === undefined) ? undefined :
          d === 'true' ? true :
            d === 'false' ? false :
              d === 'null' ? null :
                (f = parseFloat(d)) == d ? f : d;
      } catch(e) {}
      return undefined
    }
  
  
    /**
     * @param {Bonzo|Array} ar
     * @param {function(Object, number, (Bonzo|Array))} fn
     * @param {Object=} opt_scope
     * @return {boolean} whether `some`thing was found
     */
    function some(ar, fn, opt_scope) {
      for (var i = 0, j = ar.length; i < j; ++i) if (fn.call(opt_scope || null, ar[i], i, ar)) return true
      return false
    }
  
  
    /**
     * this could be a giant enum of CSS properties
     * but in favor of file size sans-closure deadcode optimizations
     * we're just asking for any ol string
     * then it gets transformed into the appropriate style property for JS access
     * @param {string} p
     * @return {string}
     */
    function styleProperty(p) {
        (p == 'transform' && (p = features.transform)) ||
          (/^transform-?[Oo]rigin$/.test(p) && (p = features.transform + 'Origin')) ||
          (p == 'float' && (p = features.cssFloat))
        return p ? camelize(p) : null
    }
  
    // this insert method is intense
    function insert(target, host, fn, rev) {
      var i = 0, self = host || this, r = []
        // target nodes could be a css selector if it's a string and a selector engine is present
        // otherwise, just use target
        , nodes = query && typeof target == 'string' && target.charAt(0) != '<' ? query(target) : target
      // normalize each node in case it's still a string and we need to create nodes on the fly
      each(normalize(nodes), function (t, j) {
        each(self, function (el) {
          fn(t, r[i++] = j > 0 ? cloneNode(self, el) : el)
        }, null, rev)
      }, this, rev)
      self.length = i
      each(r, function (e) {
        self[--i] = e
      }, null, !rev)
      return self
    }
  
  
    /**
     * sets an element to an explicit x/y position on the page
     * @param {Element} el
     * @param {?number} x
     * @param {?number} y
     */
    function xy(el, x, y) {
      var $el = bonzo(el)
        , style = $el.css('position')
        , offset = $el.offset()
        , rel = 'relative'
        , isRel = style == rel
        , delta = [parseInt($el.css('left'), 10), parseInt($el.css('top'), 10)]
  
      if (style == 'static') {
        $el.css('position', rel)
        style = rel
      }
  
      isNaN(delta[0]) && (delta[0] = isRel ? 0 : el.offsetLeft)
      isNaN(delta[1]) && (delta[1] = isRel ? 0 : el.offsetTop)
  
      x != null && (el.style.left = x - offset.left + delta[0] + px)
      y != null && (el.style.top = y - offset.top + delta[1] + px)
  
    }
  
    // classList support for class management
    // altho to be fair, the api sucks because it won't accept multiple classes at once
    if (features.classList) {
      hasClass = function (el, c) {
        return el.classList.contains(c)
      }
      addClass = function (el, c) {
        el.classList.add(c)
      }
      removeClass = function (el, c) {
        el.classList.remove(c)
      }
    }
    else {
      hasClass = function (el, c) {
        return classReg(c).test(el.className)
      }
      addClass = function (el, c) {
        el.className = trim(el.className + ' ' + c)
      }
      removeClass = function (el, c) {
        el.className = trim(el.className.replace(classReg(c), ' '))
      }
    }
  
  
    /**
     * this allows method calling for setting values
     *
     * @example
     * bonzo(elements).css('color', function (el) {
     *   return el.getAttribute('data-original-color')
     * })
     *
     * @param {Element} el
     * @param {function (Element)|string}
     * @return {string}
     */
    function setter(el, v) {
      return typeof v == 'function' ? v(el) : v
    }
  
    function scroll(x, y, type) {
      var el = this[0]
      if (!el) return this
      if (x == null && y == null) {
        return (isBody(el) ? getWindowScroll() : { x: el.scrollLeft, y: el.scrollTop })[type]
      }
      if (isBody(el)) {
        win.scrollTo(x, y)
      } else {
        x != null && (el.scrollLeft = x)
        y != null && (el.scrollTop = y)
      }
      return this
    }
  
    /**
     * @constructor
     * @param {Array.<Element>|Element|Node|string} elements
     */
    function Bonzo(elements) {
      this.length = 0
      if (elements) {
        elements = typeof elements !== 'string' &&
          !elements.nodeType &&
          typeof elements.length !== 'undefined' ?
            elements :
            [elements]
        this.length = elements.length
        for (var i = 0; i < elements.length; i++) this[i] = elements[i]
      }
    }
  
    Bonzo.prototype = {
  
        /**
         * @param {number} index
         * @return {Element|Node}
         */
        get: function (index) {
          return this[index] || null
        }
  
        // itetators
        /**
         * @param {function(Element|Node)} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , each: function (fn, opt_scope) {
          return each(this, fn, opt_scope)
        }
  
        /**
         * @param {Function} fn
         * @param {Object=} opt_scope
         * @return {Bonzo}
         */
      , deepEach: function (fn, opt_scope) {
          return deepEach(this, fn, opt_scope)
        }
  
  
        /**
         * @param {Function} fn
         * @param {Function=} opt_reject
         * @return {Array}
         */
      , map: function (fn, opt_reject) {
          var m = [], n, i
          for (i = 0; i < this.length; i++) {
            n = fn.call(this, this[i], i)
            opt_reject ? (opt_reject(n) && m.push(n)) : m.push(n)
          }
          return m
        }
  
      // text and html inserters!
  
      /**
       * @param {string} h the HTML to insert
       * @param {boolean=} opt_text whether to set or get text content
       * @return {Bonzo|string}
       */
      , html: function (h, opt_text) {
          var method = opt_text
                ? html.textContent === undefined ? 'innerText' : 'textContent'
                : 'innerHTML'
            , that = this
            , append = function (el, i) {
                each(normalize(h, that, i), function (node) {
                  el.appendChild(node)
                })
              }
            , updateElement = function (el, i) {
                try {
                  if (opt_text || (typeof h == 'string' && !specialTags.test(el.tagName))) {
                    return el[method] = h
                  }
                } catch (e) {}
                append(el, i)
              }
          return typeof h != 'undefined'
            ? this.empty().each(updateElement)
            : this[0] ? this[0][method] : ''
        }
  
        /**
         * @param {string=} opt_text the text to set, otherwise this is a getter
         * @return {Bonzo|string}
         */
      , text: function (opt_text) {
          return this.html(opt_text, true)
        }
  
        // more related insertion methods
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , append: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el.appendChild(i)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , prepend: function (node) {
          var that = this
          return this.each(function (el, i) {
            var first = el.firstChild
            each(normalize(node, that, i), function (i) {
              el.insertBefore(i, first)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , appendTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.appendChild(el)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , prependTo: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t.insertBefore(el, t.firstChild)
          }, 1)
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , before: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el)
            })
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , after: function (node) {
          var that = this
          return this.each(function (el, i) {
            each(normalize(node, that, i), function (i) {
              el[parentNode].insertBefore(i, el.nextSibling)
            }, null, 1)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertBefore: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            t[parentNode].insertBefore(el, t)
          })
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} target the location for which you'll insert your new content
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , insertAfter: function (target, opt_host) {
          return insert.call(this, target, opt_host, function (t, el) {
            var sibling = t.nextSibling
            sibling ?
              t[parentNode].insertBefore(el, sibling) :
              t[parentNode].appendChild(el)
          }, 1)
        }
  
  
        /**
         * @param {Bonzo|string|Element|Array} node
         * @return {Bonzo}
         */
      , replaceWith: function (node) {
          bonzo(normalize(node)).insertAfter(this)
          return this.remove()
        }
  
        /**
         * @param {Object=} opt_host an optional host scope (primarily used when integrated with Ender)
         * @return {Bonzo}
         */
      , clone: function (opt_host) {
          var ret = [] // don't change original array
            , l, i
          for (i = 0, l = this.length; i < l; i++) ret[i] = cloneNode(opt_host || this, this[i])
          return bonzo(ret)
        }
  
        // class management
  
        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , addClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            // we `each` here so you can do $el.addClass('foo bar')
            each(c, function (c) {
              if (c && !hasClass(el, setter(el, c)))
                addClass(el, setter(el, c))
            })
          })
        }
  
  
        /**
         * @param {string} c
         * @return {Bonzo}
         */
      , removeClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c && hasClass(el, setter(el, c)))
                removeClass(el, setter(el, c))
            })
          })
        }
  
  
        /**
         * @param {string} c
         * @return {boolean}
         */
      , hasClass: function (c) {
          c = toString.call(c).split(whitespaceRegex)
          return some(this, function (el) {
            return some(c, function (c) {
              return c && hasClass(el, c)
            })
          })
        }
  
  
        /**
         * @param {string} c classname to toggle
         * @param {boolean=} opt_condition whether to add or remove the class straight away
         * @return {Bonzo}
         */
      , toggleClass: function (c, opt_condition) {
          c = toString.call(c).split(whitespaceRegex)
          return this.each(function (el) {
            each(c, function (c) {
              if (c) {
                typeof opt_condition !== 'undefined' ?
                  opt_condition ? !hasClass(el, c) && addClass(el, c) : removeClass(el, c) :
                  hasClass(el, c) ? removeClass(el, c) : addClass(el, c)
              }
            })
          })
        }
  
        // display togglers
  
        /**
         * @param {string=} opt_type useful to set back to anything other than an empty string
         * @return {Bonzo}
         */
      , show: function (opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : ''
          return this.each(function (el) {
            el.style.display = opt_type
          })
        }
  
  
        /**
         * @return {Bonzo}
         */
      , hide: function () {
          return this.each(function (el) {
            el.style.display = 'none'
          })
        }
  
  
        /**
         * @param {Function=} opt_callback
         * @param {string=} opt_type
         * @return {Bonzo}
         */
      , toggle: function (opt_callback, opt_type) {
          opt_type = typeof opt_type == 'string' ? opt_type : '';
          typeof opt_callback != 'function' && (opt_callback = null)
          return this.each(function (el) {
            el.style.display = (el.offsetWidth || el.offsetHeight) ? 'none' : opt_type;
            opt_callback && opt_callback.call(el)
          })
        }
  
  
        // DOM Walkers & getters
  
        /**
         * @return {Element|Node}
         */
      , first: function () {
          return bonzo(this.length ? this[0] : [])
        }
  
  
        /**
         * @return {Element|Node}
         */
      , last: function () {
          return bonzo(this.length ? this[this.length - 1] : [])
        }
  
  
        /**
         * @return {Element|Node}
         */
      , next: function () {
          return this.related('nextSibling')
        }
  
  
        /**
         * @return {Element|Node}
         */
      , previous: function () {
          return this.related('previousSibling')
        }
  
  
        /**
         * @return {Element|Node}
         */
      , parent: function() {
          return this.related(parentNode)
        }
  
  
        /**
         * @private
         * @param {string} method the directional DOM method
         * @return {Element|Node}
         */
      , related: function (method) {
          return bonzo(this.map(
            function (el) {
              el = el[method]
              while (el && el.nodeType !== 1) {
                el = el[method]
              }
              return el || 0
            },
            function (el) {
              return el
            }
          ))
        }
  
  
        /**
         * @return {Bonzo}
         */
      , focus: function () {
          this.length && this[0].focus()
          return this
        }
  
  
        /**
         * @return {Bonzo}
         */
      , blur: function () {
          this.length && this[0].blur()
          return this
        }
  
        // style getter setter & related methods
  
        /**
         * @param {Object|string} o
         * @param {string=} opt_v
         * @return {Bonzo|string}
         */
      , css: function (o, opt_v) {
          var p, iter = o
          // is this a request for just getting a style?
          if (opt_v === undefined && typeof o == 'string') {
            // repurpose 'v'
            opt_v = this[0]
            if (!opt_v) return null
            if (opt_v === doc || opt_v === win) {
              p = (opt_v === doc) ? bonzo.doc() : bonzo.viewport()
              return o == 'width' ? p.width : o == 'height' ? p.height : ''
            }
            return (o = styleProperty(o)) ? getStyle(opt_v, o) : null
          }
  
          if (typeof o == 'string') {
            iter = {}
            iter[o] = opt_v
          }
  
          if (ie && iter.opacity) {
            // oh this 'ol gamut
            iter.filter = 'alpha(opacity=' + (iter.opacity * 100) + ')'
            // give it layout
            iter.zoom = o.zoom || 1;
            delete iter.opacity;
          }
  
          function fn(el, p, v) {
            for (var k in iter) {
              if (iter.hasOwnProperty(k)) {
                v = iter[k];
                // change "5" to "5px" - unless you're line-height, which is allowed
                (p = styleProperty(k)) && digit.test(v) && !(p in unitless) && (v += px)
                try { el.style[p] = setter(el, v) } catch(e) {}
              }
            }
          }
          return this.each(fn)
        }
  
  
        /**
         * @param {number=} opt_x
         * @param {number=} opt_y
         * @return {Bonzo|number}
         */
      , offset: function (opt_x, opt_y) {
          if (opt_x && typeof opt_x == 'object' && (typeof opt_x.top == 'number' || typeof opt_x.left == 'number')) {
            return this.each(function (el) {
              xy(el, opt_x.left, opt_x.top)
            })
          } else if (typeof opt_x == 'number' || typeof opt_y == 'number') {
            return this.each(function (el) {
              xy(el, opt_x, opt_y)
            })
          }
          if (!this[0]) return {
              top: 0
            , left: 0
            , height: 0
            , width: 0
          }
          var el = this[0]
            , de = el.ownerDocument.documentElement
            , bcr = el.getBoundingClientRect()
            , scroll = getWindowScroll()
            , width = el.offsetWidth
            , height = el.offsetHeight
            , top = bcr.top + scroll.y - Math.max(0, de && de.clientTop, doc.body.clientTop)
            , left = bcr.left + scroll.x - Math.max(0, de && de.clientLeft, doc.body.clientLeft)
  
          return {
              top: top
            , left: left
            , height: height
            , width: width
          }
        }
  
  
        /**
         * @return {number}
         */
      , dim: function () {
          if (!this.length) return { height: 0, width: 0 }
          var el = this[0]
            , de = el.nodeType == 9 && el.documentElement // document
            , orig = !de && !!el.style && !el.offsetWidth && !el.offsetHeight ?
               // el isn't visible, can't be measured properly, so fix that
               function (t) {
                 var s = {
                     position: el.style.position || ''
                   , visibility: el.style.visibility || ''
                   , display: el.style.display || ''
                 }
                 t.first().css({
                     position: 'absolute'
                   , visibility: 'hidden'
                   , display: 'block'
                 })
                 return s
              }(this) : null
            , width = de
                ? Math.max(el.body.scrollWidth, el.body.offsetWidth, de.scrollWidth, de.offsetWidth, de.clientWidth)
                : el.offsetWidth
            , height = de
                ? Math.max(el.body.scrollHeight, el.body.offsetHeight, de.scrollHeight, de.offsetHeight, de.clientHeight)
                : el.offsetHeight
  
          orig && this.first().css(orig)
          return {
              height: height
            , width: width
          }
        }
  
        // attributes are hard. go shopping
  
        /**
         * @param {string} k an attribute to get or set
         * @param {string=} opt_v the value to set
         * @return {Bonzo|string}
         */
      , attr: function (k, opt_v) {
          var el = this[0]
            , n
  
          if (typeof k != 'string' && !(k instanceof String)) {
            for (n in k) {
              k.hasOwnProperty(n) && this.attr(n, k[n])
            }
            return this
          }
  
          return typeof opt_v == 'undefined' ?
            !el ? null : specialAttributes.test(k) ?
              stateAttributes.test(k) && typeof el[k] == 'string' ?
                true : el[k] : (k == 'href' || k =='src') && features.hrefExtended ?
                  el[getAttribute](k, 2) : el[getAttribute](k) :
            this.each(function (el) {
              specialAttributes.test(k) ? (el[k] = setter(el, opt_v)) : el[setAttribute](k, setter(el, opt_v))
            })
        }
  
  
        /**
         * @param {string} k
         * @return {Bonzo}
         */
      , removeAttr: function (k) {
          return this.each(function (el) {
            stateAttributes.test(k) ? (el[k] = false) : el.removeAttribute(k)
          })
        }
  
  
        /**
         * @param {string=} opt_s
         * @return {Bonzo|string}
         */
      , val: function (s) {
          return (typeof s == 'string') ?
            this.attr('value', s) :
            this.length ? this[0].value : null
        }
  
        // use with care and knowledge. this data() method uses data attributes on the DOM nodes
        // to do this differently costs a lot more code. c'est la vie
        /**
         * @param {string|Object=} opt_k the key for which to get or set data
         * @param {Object=} opt_v
         * @return {Bonzo|Object}
         */
      , data: function (opt_k, opt_v) {
          var el = this[0], o, m
          if (typeof opt_v === 'undefined') {
            if (!el) return null
            o = data(el)
            if (typeof opt_k === 'undefined') {
              each(el.attributes, function (a) {
                (m = ('' + a.name).match(dattr)) && (o[camelize(m[1])] = dataValue(a.value))
              })
              return o
            } else {
              if (typeof o[opt_k] === 'undefined')
                o[opt_k] = dataValue(this.attr('data-' + decamelize(opt_k)))
              return o[opt_k]
            }
          } else {
            return this.each(function (el) { data(el)[opt_k] = opt_v })
          }
        }
  
        // DOM detachment & related
  
        /**
         * @return {Bonzo}
         */
      , remove: function () {
          this.deepEach(clearData)
          return this.detach()
        }
  
  
        /**
         * @return {Bonzo}
         */
      , empty: function () {
          return this.each(function (el) {
            deepEach(el.childNodes, clearData)
  
            while (el.firstChild) {
              el.removeChild(el.firstChild)
            }
          })
        }
  
  
        /**
         * @return {Bonzo}
         */
      , detach: function () {
          return this.each(function (el) {
            el[parentNode] && el[parentNode].removeChild(el)
          })
        }
  
        // who uses a mouse anyway? oh right.
  
        /**
         * @param {number} y
         */
      , scrollTop: function (y) {
          return scroll.call(this, null, y, 'y')
        }
  
  
        /**
         * @param {number} x
         */
      , scrollLeft: function (x) {
          return scroll.call(this, x, null, 'x')
        }
  
    }
  
  
    function cloneNode(host, el) {
      var c = el.cloneNode(true)
        , cloneElems
        , elElems
        , i
  
      // check for existence of an event cloner
      // preferably https://github.com/fat/bean
      // otherwise Bonzo won't do this for you
      if (host.$ && typeof host.cloneEvents == 'function') {
        host.$(c).cloneEvents(el)
  
        // clone events from every child node
        cloneElems = host.$(c).find('*')
        elElems = host.$(el).find('*')
  
        for (i = 0; i < elElems.length; i++)
          host.$(cloneElems[i]).cloneEvents(elElems[i])
      }
      return c
    }
  
    function isBody(element) {
      return element === win || (/^(?:body|html)$/i).test(element.tagName)
    }
  
    function getWindowScroll() {
      return { x: win.pageXOffset || html.scrollLeft, y: win.pageYOffset || html.scrollTop }
    }
  
    function createScriptFromHtml(html) {
      var scriptEl = document.createElement('script')
        , matches = html.match(simpleScriptTagRe)
      scriptEl.src = matches[1]
      return scriptEl
    }
  
    /**
     * @param {Array.<Element>|Element|Node|string} els
     * @return {Bonzo}
     */
    function bonzo(els) {
      return new Bonzo(els)
    }
  
    bonzo.setQueryEngine = function (q) {
      query = q;
      delete bonzo.setQueryEngine
    }
  
    bonzo.aug = function (o, target) {
      // for those standalone bonzo users. this love is for you.
      for (var k in o) {
        o.hasOwnProperty(k) && ((target || Bonzo.prototype)[k] = o[k])
      }
    }
  
    bonzo.create = function (node) {
      // hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh
      return typeof node == 'string' && node !== '' ?
        function () {
          if (simpleScriptTagRe.test(node)) return [createScriptFromHtml(node)]
          var tag = node.match(/^\s*<([^\s>]+)/)
            , el = doc.createElement('div')
            , els = []
            , p = tag ? tagMap[tag[1].toLowerCase()] : null
            , dep = p ? p[2] + 1 : 1
            , ns = p && p[3]
            , pn = parentNode
            , tb = features.autoTbody && p && p[0] == '<table>' && !(/<tbody/i).test(node)
  
          el.innerHTML = p ? (p[0] + node + p[1]) : node
          while (dep--) el = el.firstChild
          // for IE NoScope, we may insert cruft at the begining just to get it to work
          if (ns && el && el.nodeType !== 1) el = el.nextSibling
          do {
            // tbody special case for IE<8, creates tbody on any empty table
            // we don't want it if we're just after a <thead>, <caption>, etc.
            if ((!tag || el.nodeType == 1) && (!tb || (el.tagName && el.tagName != 'TBODY'))) {
              els.push(el)
            }
          } while (el = el.nextSibling)
          // IE < 9 gives us a parentNode which messes up insert() check for cloning
          // `dep` > 1 can also cause problems with the insert() check (must do this last)
          each(els, function(el) { el[pn] && el[pn].removeChild(el) })
          return els
        }() : isNode(node) ? [node.cloneNode(true)] : []
    }
  
    bonzo.doc = function () {
      var vp = bonzo.viewport()
      return {
          width: Math.max(doc.body.scrollWidth, html.scrollWidth, vp.width)
        , height: Math.max(doc.body.scrollHeight, html.scrollHeight, vp.height)
      }
    }
  
    bonzo.firstChild = function (el) {
      for (var c = el.childNodes, i = 0, j = (c && c.length) || 0, e; i < j; i++) {
        if (c[i].nodeType === 1) e = c[j = i]
      }
      return e
    }
  
    bonzo.viewport = function () {
      return {
          width: ie ? html.clientWidth : self.innerWidth
        , height: ie ? html.clientHeight : self.innerHeight
      }
    }
  
    bonzo.isAncestor = 'compareDocumentPosition' in html ?
      function (container, element) {
        return (container.compareDocumentPosition(element) & 16) == 16
      } : 'contains' in html ?
      function (container, element) {
        return container !== element && container.contains(element);
      } :
      function (container, element) {
        while (element = element[parentNode]) {
          if (element === container) {
            return true
          }
        }
        return false
      }
  
    return bonzo
  }); // the only line we care about using a semi-colon. placed here for concatenation tools
  

  provide("bonzo", module.exports);

  (function ($) {
  
    var b = require('bonzo')
    b.setQueryEngine($)
    $.ender(b)
    $.ender(b(), true)
    $.ender({
      create: function (node) {
        return $(b.create(node))
      }
    })
  
    $.id = function (id) {
      return $([document.getElementById(id)])
    }
  
    function indexOf(ar, val) {
      for (var i = 0; i < ar.length; i++) if (ar[i] === val) return i
      return -1
    }
  
    function uniq(ar) {
      var r = [], i = 0, j = 0, k, item, inIt
      for (; item = ar[i]; ++i) {
        inIt = false
        for (k = 0; k < r.length; ++k) {
          if (r[k] === item) {
            inIt = true; break
          }
        }
        if (!inIt) r[j++] = item
      }
      return r
    }
  
    $.ender({
      parents: function (selector, closest) {
        if (!this.length) return this
        if (!selector) selector = '*'
        var collection = $(selector), j, k, p, r = []
        for (j = 0, k = this.length; j < k; j++) {
          p = this[j]
          while (p = p.parentNode) {
            if (~indexOf(collection, p)) {
              r.push(p)
              if (closest) break;
            }
          }
        }
        return $(uniq(r))
      }
  
    , parent: function() {
        return $(uniq(b(this).parent()))
      }
  
    , closest: function (selector) {
        return this.parents(selector, true)
      }
  
    , first: function () {
        return $(this.length ? this[0] : this)
      }
  
    , last: function () {
        return $(this.length ? this[this.length - 1] : [])
      }
  
    , next: function () {
        return $(b(this).next())
      }
  
    , previous: function () {
        return $(b(this).previous())
      }
  
    , related: function (t) {
        return $(b(this).related(t))
      }
  
    , appendTo: function (t) {
        return b(this.selector).appendTo(t, this)
      }
  
    , prependTo: function (t) {
        return b(this.selector).prependTo(t, this)
      }
  
    , insertAfter: function (t) {
        return b(this.selector).insertAfter(t, this)
      }
  
    , insertBefore: function (t) {
        return b(this.selector).insertBefore(t, this)
      }
  
    , clone: function () {
        return $(b(this).clone(this))
      }
  
    , siblings: function () {
        var i, l, p, r = []
        for (i = 0, l = this.length; i < l; i++) {
          p = this[i]
          while (p = p.previousSibling) p.nodeType == 1 && r.push(p)
          p = this[i]
          while (p = p.nextSibling) p.nodeType == 1 && r.push(p)
        }
        return $(r)
      }
  
    , children: function () {
        var i, l, el, r = []
        for (i = 0, l = this.length; i < l; i++) {
          if (!(el = b.firstChild(this[i]))) continue;
          r.push(el)
          while (el = el.nextSibling) el.nodeType == 1 && r.push(el)
        }
        return $(uniq(r))
      }
  
    , height: function (v) {
        return dimension.call(this, 'height', v)
      }
  
    , width: function (v) {
        return dimension.call(this, 'width', v)
      }
    }, true)
  
    /**
     * @param {string} type either width or height
     * @param {number=} opt_v becomes a setter instead of a getter
     * @return {number}
     */
    function dimension(type, opt_v) {
      return typeof opt_v == 'undefined'
        ? b(this).dim()[type]
        : this.css(type, opt_v)
    }
  }(ender));

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * domready (c) Dustin Diaz 2012 - License MIT
    */
  !function (name, definition) {
    if (typeof module != 'undefined') module.exports = definition()
    else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
    else this[name] = definition()
  }('domready', function (ready) {
  
    var fns = [], fn, f = false
      , doc = document
      , testEl = doc.documentElement
      , hack = testEl.doScroll
      , domContentLoaded = 'DOMContentLoaded'
      , addEventListener = 'addEventListener'
      , onreadystatechange = 'onreadystatechange'
      , readyState = 'readyState'
      , loaded = /^loade|c/.test(doc[readyState])
  
    function flush(f) {
      loaded = 1
      while (f = fns.shift()) f()
    }
  
    doc[addEventListener] && doc[addEventListener](domContentLoaded, fn = function () {
      doc.removeEventListener(domContentLoaded, fn, f)
      flush()
    }, f)
  
  
    hack && doc.attachEvent(onreadystatechange, fn = function () {
      if (/^c/.test(doc[readyState])) {
        doc.detachEvent(onreadystatechange, fn)
        flush()
      }
    })
  
    return (ready = hack ?
      function (fn) {
        self != top ?
          loaded ? fn() : fns.push(fn) :
          function () {
            try {
              testEl.doScroll('left')
            } catch (e) {
              return setTimeout(function() { ready(fn) }, 50)
            }
            fn()
          }()
      } :
      function (fn) {
        loaded ? fn() : fns.push(fn)
      })
  })

  provide("domready", module.exports);

  !function ($) {
    var ready = require('domready')
    $.ender({domReady: ready})
    $.ender({
      ready: function (f) {
        ready(f)
        return this
      }
    }, true)
  }(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  //     Underscore.js 1.4.4
  //     http://underscorejs.org
  //     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
  //     Underscore may be freely distributed under the MIT license.
  
  (function() {
  
    // Baseline setup
    // --------------
  
    // Establish the root object, `window` in the browser, or `global` on the server.
    var root = this;
  
    // Save the previous value of the `_` variable.
    var previousUnderscore = root._;
  
    // Establish the object that gets returned to break out of a loop iteration.
    var breaker = {};
  
    // Save bytes in the minified (but not gzipped) version:
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
  
    // Create quick reference variables for speed access to core prototypes.
    var push             = ArrayProto.push,
        slice            = ArrayProto.slice,
        concat           = ArrayProto.concat,
        toString         = ObjProto.toString,
        hasOwnProperty   = ObjProto.hasOwnProperty;
  
    // All **ECMAScript 5** native function implementations that we hope to use
    // are declared here.
    var
      nativeForEach      = ArrayProto.forEach,
      nativeMap          = ArrayProto.map,
      nativeReduce       = ArrayProto.reduce,
      nativeReduceRight  = ArrayProto.reduceRight,
      nativeFilter       = ArrayProto.filter,
      nativeEvery        = ArrayProto.every,
      nativeSome         = ArrayProto.some,
      nativeIndexOf      = ArrayProto.indexOf,
      nativeLastIndexOf  = ArrayProto.lastIndexOf,
      nativeIsArray      = Array.isArray,
      nativeKeys         = Object.keys,
      nativeBind         = FuncProto.bind;
  
    // Create a safe reference to the Underscore object for use below.
    var _ = function(obj) {
      if (obj instanceof _) return obj;
      if (!(this instanceof _)) return new _(obj);
      this._wrapped = obj;
    };
  
    // Export the Underscore object for **Node.js**, with
    // backwards-compatibility for the old `require()` API. If we're in
    // the browser, add `_` as a global object via a string identifier,
    // for Closure Compiler "advanced" mode.
    if (typeof exports !== 'undefined') {
      if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = _;
      }
      exports._ = _;
    } else {
      root._ = _;
    }
  
    // Current version.
    _.VERSION = '1.4.4';
  
    // Collection Functions
    // --------------------
  
    // The cornerstone, an `each` implementation, aka `forEach`.
    // Handles objects with the built-in `forEach`, arrays, and raw objects.
    // Delegates to **ECMAScript 5**'s native `forEach` if available.
    var each = _.each = _.forEach = function(obj, iterator, context) {
      if (obj == null) return;
      if (nativeForEach && obj.forEach === nativeForEach) {
        obj.forEach(iterator, context);
      } else if (obj.length === +obj.length) {
        for (var i = 0, l = obj.length; i < l; i++) {
          if (iterator.call(context, obj[i], i, obj) === breaker) return;
        }
      } else {
        for (var key in obj) {
          if (_.has(obj, key)) {
            if (iterator.call(context, obj[key], key, obj) === breaker) return;
          }
        }
      }
    };
  
    // Return the results of applying the iterator to each element.
    // Delegates to **ECMAScript 5**'s native `map` if available.
    _.map = _.collect = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
      each(obj, function(value, index, list) {
        results[results.length] = iterator.call(context, value, index, list);
      });
      return results;
    };
  
    var reduceError = 'Reduce of empty array with no initial value';
  
    // **Reduce** builds up a single result from a list of values, aka `inject`,
    // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduce && obj.reduce === nativeReduce) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
      }
      each(obj, function(value, index, list) {
        if (!initial) {
          memo = value;
          initial = true;
        } else {
          memo = iterator.call(context, memo, value, index, list);
        }
      });
      if (!initial) throw new TypeError(reduceError);
      return memo;
    };
  
    // The right-associative version of reduce, also known as `foldr`.
    // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
      var initial = arguments.length > 2;
      if (obj == null) obj = [];
      if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
        if (context) iterator = _.bind(iterator, context);
        return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
      }
      var length = obj.length;
      if (length !== +length) {
        var keys = _.keys(obj);
        length = keys.length;
      }
      each(obj, function(value, index, list) {
        index = keys ? keys[--length] : --length;
        if (!initial) {
          memo = obj[index];
          initial = true;
        } else {
          memo = iterator.call(context, memo, obj[index], index, list);
        }
      });
      if (!initial) throw new TypeError(reduceError);
      return memo;
    };
  
    // Return the first value which passes a truth test. Aliased as `detect`.
    _.find = _.detect = function(obj, iterator, context) {
      var result;
      any(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) {
          result = value;
          return true;
        }
      });
      return result;
    };
  
    // Return all the elements that pass a truth test.
    // Delegates to **ECMAScript 5**'s native `filter` if available.
    // Aliased as `select`.
    _.filter = _.select = function(obj, iterator, context) {
      var results = [];
      if (obj == null) return results;
      if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
      each(obj, function(value, index, list) {
        if (iterator.call(context, value, index, list)) results[results.length] = value;
      });
      return results;
    };
  
    // Return all the elements for which a truth test fails.
    _.reject = function(obj, iterator, context) {
      return _.filter(obj, function(value, index, list) {
        return !iterator.call(context, value, index, list);
      }, context);
    };
  
    // Determine whether all of the elements match a truth test.
    // Delegates to **ECMAScript 5**'s native `every` if available.
    // Aliased as `all`.
    _.every = _.all = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = true;
      if (obj == null) return result;
      if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
      each(obj, function(value, index, list) {
        if (!(result = result && iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if at least one element in the object matches a truth test.
    // Delegates to **ECMAScript 5**'s native `some` if available.
    // Aliased as `any`.
    var any = _.some = _.any = function(obj, iterator, context) {
      iterator || (iterator = _.identity);
      var result = false;
      if (obj == null) return result;
      if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
      each(obj, function(value, index, list) {
        if (result || (result = iterator.call(context, value, index, list))) return breaker;
      });
      return !!result;
    };
  
    // Determine if the array or object contains a given value (using `===`).
    // Aliased as `include`.
    _.contains = _.include = function(obj, target) {
      if (obj == null) return false;
      if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
      return any(obj, function(value) {
        return value === target;
      });
    };
  
    // Invoke a method (with arguments) on every item in a collection.
    _.invoke = function(obj, method) {
      var args = slice.call(arguments, 2);
      var isFunc = _.isFunction(method);
      return _.map(obj, function(value) {
        return (isFunc ? method : value[method]).apply(value, args);
      });
    };
  
    // Convenience version of a common use case of `map`: fetching a property.
    _.pluck = function(obj, key) {
      return _.map(obj, function(value){ return value[key]; });
    };
  
    // Convenience version of a common use case of `filter`: selecting only objects
    // containing specific `key:value` pairs.
    _.where = function(obj, attrs, first) {
      if (_.isEmpty(attrs)) return first ? null : [];
      return _[first ? 'find' : 'filter'](obj, function(value) {
        for (var key in attrs) {
          if (attrs[key] !== value[key]) return false;
        }
        return true;
      });
    };
  
    // Convenience version of a common use case of `find`: getting the first object
    // containing specific `key:value` pairs.
    _.findWhere = function(obj, attrs) {
      return _.where(obj, attrs, true);
    };
  
    // Return the maximum element or (element-based computation).
    // Can't optimize arrays of integers longer than 65,535 elements.
    // See: https://bugs.webkit.org/show_bug.cgi?id=80797
    _.max = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
        return Math.max.apply(Math, obj);
      }
      if (!iterator && _.isEmpty(obj)) return -Infinity;
      var result = {computed : -Infinity, value: -Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed >= result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Return the minimum element (or element-based computation).
    _.min = function(obj, iterator, context) {
      if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
        return Math.min.apply(Math, obj);
      }
      if (!iterator && _.isEmpty(obj)) return Infinity;
      var result = {computed : Infinity, value: Infinity};
      each(obj, function(value, index, list) {
        var computed = iterator ? iterator.call(context, value, index, list) : value;
        computed < result.computed && (result = {value : value, computed : computed});
      });
      return result.value;
    };
  
    // Shuffle an array.
    _.shuffle = function(obj) {
      var rand;
      var index = 0;
      var shuffled = [];
      each(obj, function(value) {
        rand = _.random(index++);
        shuffled[index - 1] = shuffled[rand];
        shuffled[rand] = value;
      });
      return shuffled;
    };
  
    // An internal function to generate lookup iterators.
    var lookupIterator = function(value) {
      return _.isFunction(value) ? value : function(obj){ return obj[value]; };
    };
  
    // Sort the object's values by a criterion produced by an iterator.
    _.sortBy = function(obj, value, context) {
      var iterator = lookupIterator(value);
      return _.pluck(_.map(obj, function(value, index, list) {
        return {
          value : value,
          index : index,
          criteria : iterator.call(context, value, index, list)
        };
      }).sort(function(left, right) {
        var a = left.criteria;
        var b = right.criteria;
        if (a !== b) {
          if (a > b || a === void 0) return 1;
          if (a < b || b === void 0) return -1;
        }
        return left.index < right.index ? -1 : 1;
      }), 'value');
    };
  
    // An internal function used for aggregate "group by" operations.
    var group = function(obj, value, context, behavior) {
      var result = {};
      var iterator = lookupIterator(value || _.identity);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  
    // Groups the object's values by a criterion. Pass either a string attribute
    // to group by, or a function that returns the criterion.
    _.groupBy = function(obj, value, context) {
      return group(obj, value, context, function(result, key, value) {
        (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
      });
    };
  
    // Counts instances of an object that group by a certain criterion. Pass
    // either a string attribute to count by, or a function that returns the
    // criterion.
    _.countBy = function(obj, value, context) {
      return group(obj, value, context, function(result, key) {
        if (!_.has(result, key)) result[key] = 0;
        result[key]++;
      });
    };
  
    // Use a comparator function to figure out the smallest index at which
    // an object should be inserted so as to maintain order. Uses binary search.
    _.sortedIndex = function(array, obj, iterator, context) {
      iterator = iterator == null ? _.identity : lookupIterator(iterator);
      var value = iterator.call(context, obj);
      var low = 0, high = array.length;
      while (low < high) {
        var mid = (low + high) >>> 1;
        iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
      }
      return low;
    };
  
    // Safely convert anything iterable into a real, live array.
    _.toArray = function(obj) {
      if (!obj) return [];
      if (_.isArray(obj)) return slice.call(obj);
      if (obj.length === +obj.length) return _.map(obj, _.identity);
      return _.values(obj);
    };
  
    // Return the number of elements in an object.
    _.size = function(obj) {
      if (obj == null) return 0;
      return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
    };
  
    // Array Functions
    // ---------------
  
    // Get the first element of an array. Passing **n** will return the first N
    // values in the array. Aliased as `head` and `take`. The **guard** check
    // allows it to work with `_.map`.
    _.first = _.head = _.take = function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 0, n) : array[0];
    };
  
    // Returns everything but the last entry of the array. Especially useful on
    // the arguments object. Passing **n** will return all the values in
    // the array, excluding the last N. The **guard** check allows it to work with
    // `_.map`.
    _.initial = function(array, n, guard) {
      return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
    };
  
    // Get the last element of an array. Passing **n** will return the last N
    // values in the array. The **guard** check allows it to work with `_.map`.
    _.last = function(array, n, guard) {
      if (array == null) return void 0;
      if ((n != null) && !guard) {
        return slice.call(array, Math.max(array.length - n, 0));
      } else {
        return array[array.length - 1];
      }
    };
  
    // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
    // Especially useful on the arguments object. Passing an **n** will return
    // the rest N values in the array. The **guard**
    // check allows it to work with `_.map`.
    _.rest = _.tail = _.drop = function(array, n, guard) {
      return slice.call(array, (n == null) || guard ? 1 : n);
    };
  
    // Trim out all falsy values from an array.
    _.compact = function(array) {
      return _.filter(array, _.identity);
    };
  
    // Internal implementation of a recursive `flatten` function.
    var flatten = function(input, shallow, output) {
      each(input, function(value) {
        if (_.isArray(value)) {
          shallow ? push.apply(output, value) : flatten(value, shallow, output);
        } else {
          output.push(value);
        }
      });
      return output;
    };
  
    // Return a completely flattened version of an array.
    _.flatten = function(array, shallow) {
      return flatten(array, shallow, []);
    };
  
    // Return a version of the array that does not contain the specified value(s).
    _.without = function(array) {
      return _.difference(array, slice.call(arguments, 1));
    };
  
    // Produce a duplicate-free version of the array. If the array has already
    // been sorted, you have the option of using a faster algorithm.
    // Aliased as `unique`.
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
      if (_.isFunction(isSorted)) {
        context = iterator;
        iterator = isSorted;
        isSorted = false;
      }
      var initial = iterator ? _.map(array, iterator, context) : array;
      var results = [];
      var seen = [];
      each(initial, function(value, index) {
        if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
          seen.push(value);
          results.push(array[index]);
        }
      });
      return results;
    };
  
    // Produce an array that contains the union: each distinct element from all of
    // the passed-in arrays.
    _.union = function() {
      return _.uniq(concat.apply(ArrayProto, arguments));
    };
  
    // Produce an array that contains every item shared between all the
    // passed-in arrays.
    _.intersection = function(array) {
      var rest = slice.call(arguments, 1);
      return _.filter(_.uniq(array), function(item) {
        return _.every(rest, function(other) {
          return _.indexOf(other, item) >= 0;
        });
      });
    };
  
    // Take the difference between one array and a number of other arrays.
    // Only the elements present in just the first array will remain.
    _.difference = function(array) {
      var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
      return _.filter(array, function(value){ return !_.contains(rest, value); });
    };
  
    // Zip together multiple lists into a single array -- elements that share
    // an index go together.
    _.zip = function() {
      var args = slice.call(arguments);
      var length = _.max(_.pluck(args, 'length'));
      var results = new Array(length);
      for (var i = 0; i < length; i++) {
        results[i] = _.pluck(args, "" + i);
      }
      return results;
    };
  
    // Converts lists into objects. Pass either a single array of `[key, value]`
    // pairs, or two parallel arrays of the same length -- one of keys, and one of
    // the corresponding values.
    _.object = function(list, values) {
      if (list == null) return {};
      var result = {};
      for (var i = 0, l = list.length; i < l; i++) {
        if (values) {
          result[list[i]] = values[i];
        } else {
          result[list[i][0]] = list[i][1];
        }
      }
      return result;
    };
  
    // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
    // we need this function. Return the position of the first occurrence of an
    // item in an array, or -1 if the item is not included in the array.
    // Delegates to **ECMAScript 5**'s native `indexOf` if available.
    // If the array is large and already in sort order, pass `true`
    // for **isSorted** to use binary search.
    _.indexOf = function(array, item, isSorted) {
      if (array == null) return -1;
      var i = 0, l = array.length;
      if (isSorted) {
        if (typeof isSorted == 'number') {
          i = (isSorted < 0 ? Math.max(0, l + isSorted) : isSorted);
        } else {
          i = _.sortedIndex(array, item);
          return array[i] === item ? i : -1;
        }
      }
      if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
      for (; i < l; i++) if (array[i] === item) return i;
      return -1;
    };
  
    // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
    _.lastIndexOf = function(array, item, from) {
      if (array == null) return -1;
      var hasIndex = from != null;
      if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
        return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
      }
      var i = (hasIndex ? from : array.length);
      while (i--) if (array[i] === item) return i;
      return -1;
    };
  
    // Generate an integer Array containing an arithmetic progression. A port of
    // the native Python `range()` function. See
    // [the Python documentation](http://docs.python.org/library/functions.html#range).
    _.range = function(start, stop, step) {
      if (arguments.length <= 1) {
        stop = start || 0;
        start = 0;
      }
      step = arguments[2] || 1;
  
      var len = Math.max(Math.ceil((stop - start) / step), 0);
      var idx = 0;
      var range = new Array(len);
  
      while(idx < len) {
        range[idx++] = start;
        start += step;
      }
  
      return range;
    };
  
    // Function (ahem) Functions
    // ------------------
  
    // Create a function bound to a given object (assigning `this`, and arguments,
    // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
    // available.
    _.bind = function(func, context) {
      if (func.bind === nativeBind && nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
      var args = slice.call(arguments, 2);
      return function() {
        return func.apply(context, args.concat(slice.call(arguments)));
      };
    };
  
    // Partially apply a function by creating a version that has had some of its
    // arguments pre-filled, without changing its dynamic `this` context.
    _.partial = function(func) {
      var args = slice.call(arguments, 1);
      return function() {
        return func.apply(this, args.concat(slice.call(arguments)));
      };
    };
  
    // Bind all of an object's methods to that object. Useful for ensuring that
    // all callbacks defined on an object belong to it.
    _.bindAll = function(obj) {
      var funcs = slice.call(arguments, 1);
      if (funcs.length === 0) funcs = _.functions(obj);
      each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
      return obj;
    };
  
    // Memoize an expensive function by storing its results.
    _.memoize = function(func, hasher) {
      var memo = {};
      hasher || (hasher = _.identity);
      return function() {
        var key = hasher.apply(this, arguments);
        return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
      };
    };
  
    // Delays a function for the given number of milliseconds, and then calls
    // it with the arguments supplied.
    _.delay = function(func, wait) {
      var args = slice.call(arguments, 2);
      return setTimeout(function(){ return func.apply(null, args); }, wait);
    };
  
    // Defers a function, scheduling it to run after the current call stack has
    // cleared.
    _.defer = function(func) {
      return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
    };
  
    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time.
    _.throttle = function(func, wait) {
      var context, args, timeout, result;
      var previous = 0;
      var later = function() {
        previous = new Date;
        timeout = null;
        result = func.apply(context, args);
      };
      return function() {
        var now = new Date;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0) {
          clearTimeout(timeout);
          timeout = null;
          previous = now;
          result = func.apply(context, args);
        } else if (!timeout) {
          timeout = setTimeout(later, remaining);
        }
        return result;
      };
    };
  
    // Returns a function, that, as long as it continues to be invoked, will not
    // be triggered. The function will be called after it stops being called for
    // N milliseconds. If `immediate` is passed, trigger the function on the
    // leading edge, instead of the trailing.
    _.debounce = function(func, wait, immediate) {
      var timeout, result;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) result = func.apply(context, args);
        return result;
      };
    };
  
    // Returns a function that will be executed at most one time, no matter how
    // often you call it. Useful for lazy initialization.
    _.once = function(func) {
      var ran = false, memo;
      return function() {
        if (ran) return memo;
        ran = true;
        memo = func.apply(this, arguments);
        func = null;
        return memo;
      };
    };
  
    // Returns the first function passed as an argument to the second,
    // allowing you to adjust arguments, run code before and after, and
    // conditionally execute the original function.
    _.wrap = function(func, wrapper) {
      return function() {
        var args = [func];
        push.apply(args, arguments);
        return wrapper.apply(this, args);
      };
    };
  
    // Returns a function that is the composition of a list of functions, each
    // consuming the return value of the function that follows.
    _.compose = function() {
      var funcs = arguments;
      return function() {
        var args = arguments;
        for (var i = funcs.length - 1; i >= 0; i--) {
          args = [funcs[i].apply(this, args)];
        }
        return args[0];
      };
    };
  
    // Returns a function that will only be executed after being called N times.
    _.after = function(times, func) {
      if (times <= 0) return func();
      return function() {
        if (--times < 1) {
          return func.apply(this, arguments);
        }
      };
    };
  
    // Object Functions
    // ----------------
  
    // Retrieve the names of an object's properties.
    // Delegates to **ECMAScript 5**'s native `Object.keys`
    _.keys = nativeKeys || function(obj) {
      if (obj !== Object(obj)) throw new TypeError('Invalid object');
      var keys = [];
      for (var key in obj) if (_.has(obj, key)) keys[keys.length] = key;
      return keys;
    };
  
    // Retrieve the values of an object's properties.
    _.values = function(obj) {
      var values = [];
      for (var key in obj) if (_.has(obj, key)) values.push(obj[key]);
      return values;
    };
  
    // Convert an object into a list of `[key, value]` pairs.
    _.pairs = function(obj) {
      var pairs = [];
      for (var key in obj) if (_.has(obj, key)) pairs.push([key, obj[key]]);
      return pairs;
    };
  
    // Invert the keys and values of an object. The values must be serializable.
    _.invert = function(obj) {
      var result = {};
      for (var key in obj) if (_.has(obj, key)) result[obj[key]] = key;
      return result;
    };
  
    // Return a sorted list of the function names available on the object.
    // Aliased as `methods`
    _.functions = _.methods = function(obj) {
      var names = [];
      for (var key in obj) {
        if (_.isFunction(obj[key])) names.push(key);
      }
      return names.sort();
    };
  
    // Extend a given object with all the properties in passed-in object(s).
    _.extend = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
  
    // Return a copy of the object only containing the whitelisted properties.
    _.pick = function(obj) {
      var copy = {};
      var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
      each(keys, function(key) {
        if (key in obj) copy[key] = obj[key];
      });
      return copy;
    };
  
     // Return a copy of the object without the blacklisted properties.
    _.omit = function(obj) {
      var copy = {};
      var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
      for (var key in obj) {
        if (!_.contains(keys, key)) copy[key] = obj[key];
      }
      return copy;
    };
  
    // Fill in a given object with default properties.
    _.defaults = function(obj) {
      each(slice.call(arguments, 1), function(source) {
        if (source) {
          for (var prop in source) {
            if (obj[prop] == null) obj[prop] = source[prop];
          }
        }
      });
      return obj;
    };
  
    // Create a (shallow-cloned) duplicate of an object.
    _.clone = function(obj) {
      if (!_.isObject(obj)) return obj;
      return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
  
    // Invokes interceptor with the obj, and then returns obj.
    // The primary purpose of this method is to "tap into" a method chain, in
    // order to perform operations on intermediate results within the chain.
    _.tap = function(obj, interceptor) {
      interceptor(obj);
      return obj;
    };
  
    // Internal recursive comparison function for `isEqual`.
    var eq = function(a, b, aStack, bStack) {
      // Identical objects are equal. `0 === -0`, but they aren't identical.
      // See the Harmony `egal` proposal: http://wiki.ecmascript.org/doku.php?id=harmony:egal.
      if (a === b) return a !== 0 || 1 / a == 1 / b;
      // A strict comparison is necessary because `null == undefined`.
      if (a == null || b == null) return a === b;
      // Unwrap any wrapped objects.
      if (a instanceof _) a = a._wrapped;
      if (b instanceof _) b = b._wrapped;
      // Compare `[[Class]]` names.
      var className = toString.call(a);
      if (className != toString.call(b)) return false;
      switch (className) {
        // Strings, numbers, dates, and booleans are compared by value.
        case '[object String]':
          // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
          // equivalent to `new String("5")`.
          return a == String(b);
        case '[object Number]':
          // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
          // other numeric values.
          return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
        case '[object Date]':
        case '[object Boolean]':
          // Coerce dates and booleans to numeric primitive values. Dates are compared by their
          // millisecond representations. Note that invalid dates with millisecond representations
          // of `NaN` are not equivalent.
          return +a == +b;
        // RegExps are compared by their source patterns and flags.
        case '[object RegExp]':
          return a.source == b.source &&
                 a.global == b.global &&
                 a.multiline == b.multiline &&
                 a.ignoreCase == b.ignoreCase;
      }
      if (typeof a != 'object' || typeof b != 'object') return false;
      // Assume equality for cyclic structures. The algorithm for detecting cyclic
      // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
      var length = aStack.length;
      while (length--) {
        // Linear search. Performance is inversely proportional to the number of
        // unique nested structures.
        if (aStack[length] == a) return bStack[length] == b;
      }
      // Add the first object to the stack of traversed objects.
      aStack.push(a);
      bStack.push(b);
      var size = 0, result = true;
      // Recursively compare objects and arrays.
      if (className == '[object Array]') {
        // Compare array lengths to determine if a deep comparison is necessary.
        size = a.length;
        result = size == b.length;
        if (result) {
          // Deep compare the contents, ignoring non-numeric properties.
          while (size--) {
            if (!(result = eq(a[size], b[size], aStack, bStack))) break;
          }
        }
      } else {
        // Objects with different constructors are not equivalent, but `Object`s
        // from different frames are.
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                                 _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
          return false;
        }
        // Deep compare objects.
        for (var key in a) {
          if (_.has(a, key)) {
            // Count the expected number of properties.
            size++;
            // Deep compare each member.
            if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
          }
        }
        // Ensure that both objects contain the same number of properties.
        if (result) {
          for (key in b) {
            if (_.has(b, key) && !(size--)) break;
          }
          result = !size;
        }
      }
      // Remove the first object from the stack of traversed objects.
      aStack.pop();
      bStack.pop();
      return result;
    };
  
    // Perform a deep comparison to check if two objects are equal.
    _.isEqual = function(a, b) {
      return eq(a, b, [], []);
    };
  
    // Is a given array, string, or object empty?
    // An "empty" object has no enumerable own-properties.
    _.isEmpty = function(obj) {
      if (obj == null) return true;
      if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
      for (var key in obj) if (_.has(obj, key)) return false;
      return true;
    };
  
    // Is a given value a DOM element?
    _.isElement = function(obj) {
      return !!(obj && obj.nodeType === 1);
    };
  
    // Is a given value an array?
    // Delegates to ECMA5's native Array.isArray
    _.isArray = nativeIsArray || function(obj) {
      return toString.call(obj) == '[object Array]';
    };
  
    // Is a given variable an object?
    _.isObject = function(obj) {
      return obj === Object(obj);
    };
  
    // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
    each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
      _['is' + name] = function(obj) {
        return toString.call(obj) == '[object ' + name + ']';
      };
    });
  
    // Define a fallback version of the method in browsers (ahem, IE), where
    // there isn't any inspectable "Arguments" type.
    if (!_.isArguments(arguments)) {
      _.isArguments = function(obj) {
        return !!(obj && _.has(obj, 'callee'));
      };
    }
  
    // Optimize `isFunction` if appropriate.
    if (typeof (/./) !== 'function') {
      _.isFunction = function(obj) {
        return typeof obj === 'function';
      };
    }
  
    // Is a given object a finite number?
    _.isFinite = function(obj) {
      return isFinite(obj) && !isNaN(parseFloat(obj));
    };
  
    // Is the given value `NaN`? (NaN is the only number which does not equal itself).
    _.isNaN = function(obj) {
      return _.isNumber(obj) && obj != +obj;
    };
  
    // Is a given value a boolean?
    _.isBoolean = function(obj) {
      return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
    };
  
    // Is a given value equal to null?
    _.isNull = function(obj) {
      return obj === null;
    };
  
    // Is a given variable undefined?
    _.isUndefined = function(obj) {
      return obj === void 0;
    };
  
    // Shortcut function for checking if an object has a given property directly
    // on itself (in other words, not on a prototype).
    _.has = function(obj, key) {
      return hasOwnProperty.call(obj, key);
    };
  
    // Utility Functions
    // -----------------
  
    // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
    // previous owner. Returns a reference to the Underscore object.
    _.noConflict = function() {
      root._ = previousUnderscore;
      return this;
    };
  
    // Keep the identity function around for default iterators.
    _.identity = function(value) {
      return value;
    };
  
    // Run a function **n** times.
    _.times = function(n, iterator, context) {
      var accum = Array(n);
      for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
      return accum;
    };
  
    // Return a random integer between min and max (inclusive).
    _.random = function(min, max) {
      if (max == null) {
        max = min;
        min = 0;
      }
      return min + Math.floor(Math.random() * (max - min + 1));
    };
  
    // List of HTML entities for escaping.
    var entityMap = {
      escape: {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      }
    };
    entityMap.unescape = _.invert(entityMap.escape);
  
    // Regexes containing the keys and values listed immediately above.
    var entityRegexes = {
      escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
      unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
    };
  
    // Functions for escaping and unescaping strings to/from HTML interpolation.
    _.each(['escape', 'unescape'], function(method) {
      _[method] = function(string) {
        if (string == null) return '';
        return ('' + string).replace(entityRegexes[method], function(match) {
          return entityMap[method][match];
        });
      };
    });
  
    // If the value of the named property is a function then invoke it;
    // otherwise, return it.
    _.result = function(object, property) {
      if (object == null) return null;
      var value = object[property];
      return _.isFunction(value) ? value.call(object) : value;
    };
  
    // Add your own custom functions to the Underscore object.
    _.mixin = function(obj) {
      each(_.functions(obj), function(name){
        var func = _[name] = obj[name];
        _.prototype[name] = function() {
          var args = [this._wrapped];
          push.apply(args, arguments);
          return result.call(this, func.apply(_, args));
        };
      });
    };
  
    // Generate a unique integer id (unique within the entire client session).
    // Useful for temporary DOM ids.
    var idCounter = 0;
    _.uniqueId = function(prefix) {
      var id = ++idCounter + '';
      return prefix ? prefix + id : id;
    };
  
    // By default, Underscore uses ERB-style template delimiters, change the
    // following template settings to use alternative delimiters.
    _.templateSettings = {
      evaluate    : /<%([\s\S]+?)%>/g,
      interpolate : /<%=([\s\S]+?)%>/g,
      escape      : /<%-([\s\S]+?)%>/g
    };
  
    // When customizing `templateSettings`, if you don't want to define an
    // interpolation, evaluation or escaping regex, we need one that is
    // guaranteed not to match.
    var noMatch = /(.)^/;
  
    // Certain characters need to be escaped so that they can be put into a
    // string literal.
    var escapes = {
      "'":      "'",
      '\\':     '\\',
      '\r':     'r',
      '\n':     'n',
      '\t':     't',
      '\u2028': 'u2028',
      '\u2029': 'u2029'
    };
  
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
  
    // JavaScript micro-templating, similar to John Resig's implementation.
    // Underscore templating handles arbitrary delimiters, preserves whitespace,
    // and correctly escapes quotes within interpolated code.
    _.template = function(text, data, settings) {
      var render;
      settings = _.defaults({}, settings, _.templateSettings);
  
      // Combine delimiters into one regular expression via alternation.
      var matcher = new RegExp([
        (settings.escape || noMatch).source,
        (settings.interpolate || noMatch).source,
        (settings.evaluate || noMatch).source
      ].join('|') + '|$', 'g');
  
      // Compile the template source, escaping string literals appropriately.
      var index = 0;
      var source = "__p+='";
      text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
        source += text.slice(index, offset)
          .replace(escaper, function(match) { return '\\' + escapes[match]; });
  
        if (escape) {
          source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
        }
        if (interpolate) {
          source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
        }
        if (evaluate) {
          source += "';\n" + evaluate + "\n__p+='";
        }
        index = offset + match.length;
        return match;
      });
      source += "';\n";
  
      // If a variable is not specified, place data values in local scope.
      if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';
  
      source = "var __t,__p='',__j=Array.prototype.join," +
        "print=function(){__p+=__j.call(arguments,'');};\n" +
        source + "return __p;\n";
  
      try {
        render = new Function(settings.variable || 'obj', '_', source);
      } catch (e) {
        e.source = source;
        throw e;
      }
  
      if (data) return render(data, _);
      var template = function(data) {
        return render.call(this, data, _);
      };
  
      // Provide the compiled function source as a convenience for precompilation.
      template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';
  
      return template;
    };
  
    // Add a "chain" function, which will delegate to the wrapper.
    _.chain = function(obj) {
      return _(obj).chain();
    };
  
    // OOP
    // ---------------
    // If Underscore is called as a function, it returns a wrapped object that
    // can be used OO-style. This wrapper holds altered versions of all the
    // underscore functions. Wrapped objects may be chained.
  
    // Helper function to continue chaining intermediate results.
    var result = function(obj) {
      return this._chain ? _(obj).chain() : obj;
    };
  
    // Add all of the Underscore functions to the wrapper object.
    _.mixin(_);
  
    // Add all mutator Array functions to the wrapper.
    each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        var obj = this._wrapped;
        method.apply(obj, arguments);
        if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
        return result.call(this, obj);
      };
    });
  
    // Add all accessor Array functions to the wrapper.
    each(['concat', 'join', 'slice'], function(name) {
      var method = ArrayProto[name];
      _.prototype[name] = function() {
        return result.call(this, method.apply(this._wrapped, arguments));
      };
    });
  
    _.extend(_.prototype, {
  
      // Start chaining a wrapped Underscore object.
      chain: function() {
        this._chain = true;
        return this;
      },
  
      // Extracts the result from a wrapped and chained object.
      value: function() {
        return this._wrapped;
      }
  
    });
  
  }).call(this);
  

  provide("underscore", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
    * Bean - copyright (c) Jacob Thornton 2011-2012
    * https://github.com/fat/bean
    * MIT license
    */
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports) module.exports = definition()
    else if (typeof define == 'function' && define.amd) define(definition)
    else context[name] = definition()
  })('bean', this, function (name, context) {
    name    = name    || 'bean'
    context = context || this
  
    var win            = window
      , old            = context[name]
      , namespaceRegex = /[^\.]*(?=\..*)\.|.*/
      , nameRegex      = /\..*/
      , addEvent       = 'addEventListener'
      , removeEvent    = 'removeEventListener'
      , doc            = document || {}
      , root           = doc.documentElement || {}
      , W3C_MODEL      = root[addEvent]
      , eventSupport   = W3C_MODEL ? addEvent : 'attachEvent'
      , ONE            = {} // singleton for quick matching making add() do one()
  
      , slice          = Array.prototype.slice
      , str2arr        = function (s, d) { return s.split(d || ' ') }
      , isString       = function (o) { return typeof o == 'string' }
      , isFunction     = function (o) { return typeof o == 'function' }
  
        // events that we consider to be 'native', anything not in this list will
        // be treated as a custom event
      , standardNativeEvents =
          'click dblclick mouseup mousedown contextmenu '                  + // mouse buttons
          'mousewheel mousemultiwheel DOMMouseScroll '                     + // mouse wheel
          'mouseover mouseout mousemove selectstart selectend '            + // mouse movement
          'keydown keypress keyup '                                        + // keyboard
          'orientationchange '                                             + // mobile
          'focus blur change reset select submit '                         + // form elements
          'load unload beforeunload resize move DOMContentLoaded '         + // window
          'readystatechange message '                                      + // window
          'error abort scroll '                                              // misc
        // element.fireEvent('onXYZ'... is not forgiving if we try to fire an event
        // that doesn't actually exist, so make sure we only do these on newer browsers
      , w3cNativeEvents =
          'show '                                                          + // mouse buttons
          'input invalid '                                                 + // form elements
          'touchstart touchmove touchend touchcancel '                     + // touch
          'gesturestart gesturechange gestureend '                         + // gesture
          'textinput'                                                      + // TextEvent
          'readystatechange pageshow pagehide popstate '                   + // window
          'hashchange offline online '                                     + // window
          'afterprint beforeprint '                                        + // printing
          'dragstart dragenter dragover dragleave drag drop dragend '      + // dnd
          'loadstart progress suspend emptied stalled loadmetadata '       + // media
          'loadeddata canplay canplaythrough playing waiting seeking '     + // media
          'seeked ended durationchange timeupdate play pause ratechange '  + // media
          'volumechange cuechange '                                        + // media
          'checking noupdate downloading cached updateready obsolete '       // appcache
  
        // convert to a hash for quick lookups
      , nativeEvents = (function (hash, events, i) {
          for (i = 0; i < events.length; i++) events[i] && (hash[events[i]] = 1)
          return hash
        }({}, str2arr(standardNativeEvents + (W3C_MODEL ? w3cNativeEvents : ''))))
  
        // custom events are events that we *fake*, they are not provided natively but
        // we can use native events to generate them
      , customEvents = (function () {
          var isAncestor = 'compareDocumentPosition' in root
                ? function (element, container) {
                    return container.compareDocumentPosition && (container.compareDocumentPosition(element) & 16) === 16
                  }
                : 'contains' in root
                  ? function (element, container) {
                      container = container.nodeType === 9 || container === window ? root : container
                      return container !== element && container.contains(element)
                    }
                  : function (element, container) {
                      while (element = element.parentNode) if (element === container) return 1
                      return 0
                    }
            , check = function (event) {
                var related = event.relatedTarget
                return !related
                  ? related == null
                  : (related !== this && related.prefix !== 'xul' && !/document/.test(this.toString())
                      && !isAncestor(related, this))
              }
  
          return {
              mouseenter: { base: 'mouseover', condition: check }
            , mouseleave: { base: 'mouseout', condition: check }
            , mousewheel: { base: /Firefox/.test(navigator.userAgent) ? 'DOMMouseScroll' : 'mousewheel' }
          }
        }())
  
        // we provide a consistent Event object across browsers by taking the actual DOM
        // event object and generating a new one from its properties.
      , Event = (function () {
              // a whitelist of properties (for different event types) tells us what to check for and copy
          var commonProps  = str2arr('altKey attrChange attrName bubbles cancelable ctrlKey currentTarget ' +
                'detail eventPhase getModifierState isTrusted metaKey relatedNode relatedTarget shiftKey '  +
                'srcElement target timeStamp type view which propertyName')
            , mouseProps   = commonProps.concat(str2arr('button buttons clientX clientY dataTransfer '      +
                'fromElement offsetX offsetY pageX pageY screenX screenY toElement'))
            , mouseWheelProps = mouseProps.concat(str2arr('wheelDelta wheelDeltaX wheelDeltaY wheelDeltaZ ' +
                'axis')) // 'axis' is FF specific
            , keyProps     = commonProps.concat(str2arr('char charCode key keyCode keyIdentifier '          +
                'keyLocation location'))
            , textProps    = commonProps.concat(str2arr('data'))
            , touchProps   = commonProps.concat(str2arr('touches targetTouches changedTouches scale rotation'))
            , messageProps = commonProps.concat(str2arr('data origin source'))
            , stateProps   = commonProps.concat(str2arr('state'))
            , overOutRegex = /over|out/
              // some event types need special handling and some need special properties, do that all here
            , typeFixers   = [
                  { // key events
                      reg: /key/i
                    , fix: function (event, newEvent) {
                        newEvent.keyCode = event.keyCode || event.which
                        return keyProps
                      }
                  }
                , { // mouse events
                      reg: /click|mouse(?!(.*wheel|scroll))|menu|drag|drop/i
                    , fix: function (event, newEvent, type) {
                        newEvent.rightClick = event.which === 3 || event.button === 2
                        newEvent.pos = { x: 0, y: 0 }
                        if (event.pageX || event.pageY) {
                          newEvent.clientX = event.pageX
                          newEvent.clientY = event.pageY
                        } else if (event.clientX || event.clientY) {
                          newEvent.clientX = event.clientX + doc.body.scrollLeft + root.scrollLeft
                          newEvent.clientY = event.clientY + doc.body.scrollTop + root.scrollTop
                        }
                        if (overOutRegex.test(type)) {
                          newEvent.relatedTarget = event.relatedTarget
                            || event[(type == 'mouseover' ? 'from' : 'to') + 'Element']
                        }
                        return mouseProps
                      }
                  }
                , { // mouse wheel events
                      reg: /mouse.*(wheel|scroll)/i
                    , fix: function () { return mouseWheelProps }
                  }
                , { // TextEvent
                      reg: /^text/i
                    , fix: function () { return textProps }
                  }
                , { // touch and gesture events
                      reg: /^touch|^gesture/i
                    , fix: function () { return touchProps }
                  }
                , { // message events
                      reg: /^message$/i
                    , fix: function () { return messageProps }
                  }
                , { // popstate events
                      reg: /^popstate$/i
                    , fix: function () { return stateProps }
                  }
                , { // everything else
                      reg: /.*/
                    , fix: function () { return commonProps }
                  }
              ]
            , typeFixerMap = {} // used to map event types to fixer functions (above), a basic cache mechanism
  
            , Event = function (event, element, isNative) {
                if (!arguments.length) return
                event = event || ((element.ownerDocument || element.document || element).parentWindow || win).event
                this.originalEvent = event
                this.isNative       = isNative
                this.isBean         = true
  
                if (!event) return
  
                var type   = event.type
                  , target = event.target || event.srcElement
                  , i, l, p, props, fixer
  
                this.target = target && target.nodeType === 3 ? target.parentNode : target
  
                if (isNative) { // we only need basic augmentation on custom events, the rest expensive & pointless
                  fixer = typeFixerMap[type]
                  if (!fixer) { // haven't encountered this event type before, map a fixer function for it
                    for (i = 0, l = typeFixers.length; i < l; i++) {
                      if (typeFixers[i].reg.test(type)) { // guaranteed to match at least one, last is .*
                        typeFixerMap[type] = fixer = typeFixers[i].fix
                        break
                      }
                    }
                  }
  
                  props = fixer(event, this, type)
                  for (i = props.length; i--;) {
                    if (!((p = props[i]) in this) && p in event) this[p] = event[p]
                  }
                }
              }
  
          // preventDefault() and stopPropagation() are a consistent interface to those functions
          // on the DOM, stop() is an alias for both of them together
          Event.prototype.preventDefault = function () {
            if (this.originalEvent.preventDefault) this.originalEvent.preventDefault()
            else this.originalEvent.returnValue = false
          }
          Event.prototype.stopPropagation = function () {
            if (this.originalEvent.stopPropagation) this.originalEvent.stopPropagation()
            else this.originalEvent.cancelBubble = true
          }
          Event.prototype.stop = function () {
            this.preventDefault()
            this.stopPropagation()
            this.stopped = true
          }
          // stopImmediatePropagation() has to be handled internally because we manage the event list for
          // each element
          // note that originalElement may be a Bean#Event object in some situations
          Event.prototype.stopImmediatePropagation = function () {
            if (this.originalEvent.stopImmediatePropagation) this.originalEvent.stopImmediatePropagation()
            this.isImmediatePropagationStopped = function () { return true }
          }
          Event.prototype.isImmediatePropagationStopped = function () {
            return this.originalEvent.isImmediatePropagationStopped && this.originalEvent.isImmediatePropagationStopped()
          }
          Event.prototype.clone = function (currentTarget) {
            //TODO: this is ripe for optimisation, new events are *expensive*
            // improving this will speed up delegated events
            var ne = new Event(this, this.element, this.isNative)
            ne.currentTarget = currentTarget
            return ne
          }
  
          return Event
        }())
  
        // if we're in old IE we can't do onpropertychange on doc or win so we use doc.documentElement for both
      , targetElement = function (element, isNative) {
          return !W3C_MODEL && !isNative && (element === doc || element === win) ? root : element
        }
  
        /**
          * Bean maintains an internal registry for event listeners. We don't touch elements, objects
          * or functions to identify them, instead we store everything in the registry.
          * Each event listener has a RegEntry object, we have one 'registry' for the whole instance.
          */
      , RegEntry = (function () {
          // each handler is wrapped so we can handle delegation and custom events
          var wrappedHandler = function (element, fn, condition, args) {
              var call = function (event, eargs) {
                    return fn.apply(element, args ? slice.call(eargs, event ? 0 : 1).concat(args) : eargs)
                  }
                , findTarget = function (event, eventElement) {
                    return fn.__beanDel ? fn.__beanDel.ft(event.target, element) : eventElement
                  }
                , handler = condition
                    ? function (event) {
                        var target = findTarget(event, this) // deleated event
                        if (condition.apply(target, arguments)) {
                          if (event) event.currentTarget = target
                          return call(event, arguments)
                        }
                      }
                    : function (event) {
                        if (fn.__beanDel) event = event.clone(findTarget(event)) // delegated event, fix the fix
                        return call(event, arguments)
                      }
              handler.__beanDel = fn.__beanDel
              return handler
            }
  
          , RegEntry = function (element, type, handler, original, namespaces, args, root) {
              var customType     = customEvents[type]
                , isNative
  
              if (type == 'unload') {
                // self clean-up
                handler = once(removeListener, element, type, handler, original)
              }
  
              if (customType) {
                if (customType.condition) {
                  handler = wrappedHandler(element, handler, customType.condition, args)
                }
                type = customType.base || type
              }
  
              this.isNative      = isNative = nativeEvents[type] && !!element[eventSupport]
              this.customType    = !W3C_MODEL && !isNative && type
              this.element       = element
              this.type          = type
              this.original      = original
              this.namespaces    = namespaces
              this.eventType     = W3C_MODEL || isNative ? type : 'propertychange'
              this.target        = targetElement(element, isNative)
              this[eventSupport] = !!this.target[eventSupport]
              this.root          = root
              this.handler       = wrappedHandler(element, handler, null, args)
            }
  
          // given a list of namespaces, is our entry in any of them?
          RegEntry.prototype.inNamespaces = function (checkNamespaces) {
            var i, j, c = 0
            if (!checkNamespaces) return true
            if (!this.namespaces) return false
            for (i = checkNamespaces.length; i--;) {
              for (j = this.namespaces.length; j--;) {
                if (checkNamespaces[i] == this.namespaces[j]) c++
              }
            }
            return checkNamespaces.length === c
          }
  
          // match by element, original fn (opt), handler fn (opt)
          RegEntry.prototype.matches = function (checkElement, checkOriginal, checkHandler) {
            return this.element === checkElement &&
              (!checkOriginal || this.original === checkOriginal) &&
              (!checkHandler || this.handler === checkHandler)
          }
  
          return RegEntry
        }())
  
      , registry = (function () {
          // our map stores arrays by event type, just because it's better than storing
          // everything in a single array.
          // uses '$' as a prefix for the keys for safety and 'r' as a special prefix for
          // rootListeners so we can look them up fast
          var map = {}
  
            // generic functional search of our registry for matching listeners,
            // `fn` returns false to break out of the loop
            , forAll = function (element, type, original, handler, root, fn) {
                var pfx = root ? 'r' : '$'
                if (!type || type == '*') {
                  // search the whole registry
                  for (var t in map) {
                    if (t.charAt(0) == pfx) {
                      forAll(element, t.substr(1), original, handler, root, fn)
                    }
                  }
                } else {
                  var i = 0, l, list = map[pfx + type], all = element == '*'
                  if (!list) return
                  for (l = list.length; i < l; i++) {
                    if ((all || list[i].matches(element, original, handler)) && !fn(list[i], list, i, type)) return
                  }
                }
              }
  
            , has = function (element, type, original, root) {
                // we're not using forAll here simply because it's a bit slower and this
                // needs to be fast
                var i, list = map[(root ? 'r' : '$') + type]
                if (list) {
                  for (i = list.length; i--;) {
                    if (!list[i].root && list[i].matches(element, original, null)) return true
                  }
                }
                return false
              }
  
            , get = function (element, type, original, root) {
                var entries = []
                forAll(element, type, original, null, root, function (entry) {
                  return entries.push(entry)
                })
                return entries
              }
  
            , put = function (entry) {
                var has = !entry.root && !this.has(entry.element, entry.type, null, false)
                  , key = (entry.root ? 'r' : '$') + entry.type
                ;(map[key] || (map[key] = [])).push(entry)
                return has
              }
  
            , del = function (entry) {
                forAll(entry.element, entry.type, null, entry.handler, entry.root, function (entry, list, i) {
                  list.splice(i, 1)
                  entry.removed = true
                  if (list.length === 0) delete map[(entry.root ? 'r' : '$') + entry.type]
                  return false
                })
              }
  
              // dump all entries, used for onunload
            , entries = function () {
                var t, entries = []
                for (t in map) {
                  if (t.charAt(0) == '$') entries = entries.concat(map[t])
                }
                return entries
              }
  
          return { has: has, get: get, put: put, del: del, entries: entries }
        }())
  
        // we need a selector engine for delegated events, use querySelectorAll if it exists
        // but for older browsers we need Qwery, Sizzle or similar
      , selectorEngine
      , setSelectorEngine = function (e) {
          if (!arguments.length) {
            selectorEngine = doc.querySelectorAll
              ? function (s, r) {
                  return r.querySelectorAll(s)
                }
              : function () {
                  throw new Error('Bean: No selector engine installed') // eeek
                }
          } else {
            selectorEngine = e
          }
        }
  
        // we attach this listener to each DOM event that we need to listen to, only once
        // per event type per DOM element
      , rootListener = function (event, type) {
          if (!W3C_MODEL && type && event && event.propertyName != '_on' + type) return
  
          var listeners = registry.get(this, type || event.type, null, false)
            , l = listeners.length
            , i = 0
  
          event = new Event(event, this, true)
          if (type) event.type = type
  
          // iterate through all handlers registered for this type, calling them unless they have
          // been removed by a previous handler or stopImmediatePropagation() has been called
          for (; i < l && !event.isImmediatePropagationStopped(); i++) {
            if (!listeners[i].removed) listeners[i].handler.call(this, event)
          }
        }
  
        // add and remove listeners to DOM elements
      , listener = W3C_MODEL
          ? function (element, type, add) {
              // new browsers
              element[add ? addEvent : removeEvent](type, rootListener, false)
            }
          : function (element, type, add, custom) {
              // IE8 and below, use attachEvent/detachEvent and we have to piggy-back propertychange events
              // to simulate event bubbling etc.
              var entry
              if (add) {
                registry.put(entry = new RegEntry(
                    element
                  , custom || type
                  , function (event) { // handler
                      rootListener.call(element, event, custom)
                    }
                  , rootListener
                  , null
                  , null
                  , true // is root
                ))
                if (custom && element['_on' + custom] == null) element['_on' + custom] = 0
                entry.target.attachEvent('on' + entry.eventType, entry.handler)
              } else {
                entry = registry.get(element, custom || type, rootListener, true)[0]
                if (entry) {
                  entry.target.detachEvent('on' + entry.eventType, entry.handler)
                  registry.del(entry)
                }
              }
            }
  
      , once = function (rm, element, type, fn, originalFn) {
          // wrap the handler in a handler that does a remove as well
          return function () {
            fn.apply(this, arguments)
            rm(element, type, originalFn)
          }
        }
  
      , removeListener = function (element, orgType, handler, namespaces) {
          var type     = orgType && orgType.replace(nameRegex, '')
            , handlers = registry.get(element, type, null, false)
            , removed  = {}
            , i, l
  
          for (i = 0, l = handlers.length; i < l; i++) {
            if ((!handler || handlers[i].original === handler) && handlers[i].inNamespaces(namespaces)) {
              // TODO: this is problematic, we have a registry.get() and registry.del() that
              // both do registry searches so we waste cycles doing this. Needs to be rolled into
              // a single registry.forAll(fn) that removes while finding, but the catch is that
              // we'll be splicing the arrays that we're iterating over. Needs extra tests to
              // make sure we don't screw it up. @rvagg
              registry.del(handlers[i])
              if (!removed[handlers[i].eventType] && handlers[i][eventSupport])
                removed[handlers[i].eventType] = { t: handlers[i].eventType, c: handlers[i].type }
            }
          }
          // check each type/element for removed listeners and remove the rootListener where it's no longer needed
          for (i in removed) {
            if (!registry.has(element, removed[i].t, null, false)) {
              // last listener of this type, remove the rootListener
              listener(element, removed[i].t, false, removed[i].c)
            }
          }
        }
  
        // set up a delegate helper using the given selector, wrap the handler function
      , delegate = function (selector, fn) {
          //TODO: findTarget (therefore $) is called twice, once for match and once for
          // setting e.currentTarget, fix this so it's only needed once
          var findTarget = function (target, root) {
                var i, array = isString(selector) ? selectorEngine(selector, root) : selector
                for (; target && target !== root; target = target.parentNode) {
                  for (i = array.length; i--;) {
                    if (array[i] === target) return target
                  }
                }
              }
            , handler = function (e) {
                var match = findTarget(e.target, this)
                if (match) fn.apply(match, arguments)
              }
  
          // __beanDel isn't pleasant but it's a private function, not exposed outside of Bean
          handler.__beanDel = {
              ft       : findTarget // attach it here for customEvents to use too
            , selector : selector
          }
          return handler
        }
  
      , fireListener = W3C_MODEL ? function (isNative, type, element) {
          // modern browsers, do a proper dispatchEvent()
          var evt = doc.createEvent(isNative ? 'HTMLEvents' : 'UIEvents')
          evt[isNative ? 'initEvent' : 'initUIEvent'](type, true, true, win, 1)
          element.dispatchEvent(evt)
        } : function (isNative, type, element) {
          // old browser use onpropertychange, just increment a custom property to trigger the event
          element = targetElement(element, isNative)
          isNative ? element.fireEvent('on' + type, doc.createEventObject()) : element['_on' + type]++
        }
  
        /**
          * Public API: off(), on(), add(), (remove()), one(), fire(), clone()
          */
  
        /**
          * off(element[, eventType(s)[, handler ]])
          */
      , off = function (element, typeSpec, fn) {
          var isTypeStr = isString(typeSpec)
            , k, type, namespaces, i
  
          if (isTypeStr && typeSpec.indexOf(' ') > 0) {
            // off(el, 't1 t2 t3', fn) or off(el, 't1 t2 t3')
            typeSpec = str2arr(typeSpec)
            for (i = typeSpec.length; i--;)
              off(element, typeSpec[i], fn)
            return element
          }
  
          type = isTypeStr && typeSpec.replace(nameRegex, '')
          if (type && customEvents[type]) type = customEvents[type].base
  
          if (!typeSpec || isTypeStr) {
            // off(el) or off(el, t1.ns) or off(el, .ns) or off(el, .ns1.ns2.ns3)
            if (namespaces = isTypeStr && typeSpec.replace(namespaceRegex, '')) namespaces = str2arr(namespaces, '.')
            removeListener(element, type, fn, namespaces)
          } else if (isFunction(typeSpec)) {
            // off(el, fn)
            removeListener(element, null, typeSpec)
          } else {
            // off(el, { t1: fn1, t2, fn2 })
            for (k in typeSpec) {
              if (typeSpec.hasOwnProperty(k)) off(element, k, typeSpec[k])
            }
          }
  
          return element
        }
  
        /**
          * on(element, eventType(s)[, selector], handler[, args ])
          */
      , on = function(element, events, selector, fn) {
          var originalFn, type, types, i, args, entry, first
  
          //TODO: the undefined check means you can't pass an 'args' argument, fix this perhaps?
          if (selector === undefined && typeof events == 'object') {
            //TODO: this can't handle delegated events
            for (type in events) {
              if (events.hasOwnProperty(type)) {
                on.call(this, element, type, events[type])
              }
            }
            return
          }
  
          if (!isFunction(selector)) {
            // delegated event
            originalFn = fn
            args       = slice.call(arguments, 4)
            fn         = delegate(selector, originalFn, selectorEngine)
          } else {
            args       = slice.call(arguments, 3)
            fn         = originalFn = selector
          }
  
          types = str2arr(events)
  
          // special case for one(), wrap in a self-removing handler
          if (this === ONE) {
            fn = once(off, element, events, fn, originalFn)
          }
  
          for (i = types.length; i--;) {
            // add new handler to the registry and check if it's the first for this element/type
            first = registry.put(entry = new RegEntry(
                element
              , types[i].replace(nameRegex, '') // event type
              , fn
              , originalFn
              , str2arr(types[i].replace(namespaceRegex, ''), '.') // namespaces
              , args
              , false // not root
            ))
            if (entry[eventSupport] && first) {
              // first event of this type on this element, add root listener
              listener(element, entry.eventType, true, entry.customType)
            }
          }
  
          return element
        }
  
        /**
          * add(element[, selector], eventType(s), handler[, args ])
          *
          * Deprecated: kept (for now) for backward-compatibility
          */
      , add = function (element, events, fn, delfn) {
          return on.apply(
              null
            , !isString(fn)
                ? slice.call(arguments)
                : [ element, fn, events, delfn ].concat(arguments.length > 3 ? slice.call(arguments, 5) : [])
          )
        }
  
        /**
          * one(element, eventType(s)[, selector], handler[, args ])
          */
      , one = function () {
          return on.apply(ONE, arguments)
        }
  
        /**
          * fire(element, eventType(s)[, args ])
          *
          * The optional 'args' argument must be an array, if no 'args' argument is provided
          * then we can use the browser's DOM event system, otherwise we trigger handlers manually
          */
      , fire = function (element, type, args) {
          var types = str2arr(type)
            , i, j, l, names, handlers
  
          for (i = types.length; i--;) {
            type = types[i].replace(nameRegex, '')
            if (names = types[i].replace(namespaceRegex, '')) names = str2arr(names, '.')
            if (!names && !args && element[eventSupport]) {
              fireListener(nativeEvents[type], type, element)
            } else {
              // non-native event, either because of a namespace, arguments or a non DOM element
              // iterate over all listeners and manually 'fire'
              handlers = registry.get(element, type, null, false)
              args = [false].concat(args)
              for (j = 0, l = handlers.length; j < l; j++) {
                if (handlers[j].inNamespaces(names)) {
                  handlers[j].handler.apply(element, args)
                }
              }
            }
          }
          return element
        }
  
        /**
          * clone(dstElement, srcElement[, eventType ])
          *
          * TODO: perhaps for consistency we should allow the same flexibility in type specifiers?
          */
      , clone = function (element, from, type) {
          var handlers = registry.get(from, type, null, false)
            , l = handlers.length
            , i = 0
            , args, beanDel
  
          for (; i < l; i++) {
            if (handlers[i].original) {
              args = [ element, handlers[i].type ]
              if (beanDel = handlers[i].handler.__beanDel) args.push(beanDel.selector)
              args.push(handlers[i].original)
              on.apply(null, args)
            }
          }
          return element
        }
  
      , bean = {
            on                : on
          , add               : add
          , one               : one
          , off               : off
          , remove            : off
          , clone             : clone
          , fire              : fire
          , setSelectorEngine : setSelectorEngine
          , noConflict        : function () {
              context[name] = old
              return this
            }
        }
  
    // for IE, clean up on unload to avoid leaks
    if (win.attachEvent) {
      var cleanup = function () {
        var i, entries = registry.entries()
        for (i in entries) {
          if (entries[i].type && entries[i].type !== 'unload') off(entries[i].element, entries[i].type)
        }
        win.detachEvent('onunload', cleanup)
        win.CollectGarbage && win.CollectGarbage()
      }
      win.attachEvent('onunload', cleanup)
    }
  
    // initialize selector engine to internal default (qSA or throw Error)
    setSelectorEngine()
  
    return bean
  });

  provide("bean", module.exports);

  !function ($) {
    var b = require('bean')
  
      , integrate = function (method, type, method2) {
          var _args = type ? [type] : []
          return function () {
            for (var i = 0, l = this.length; i < l; i++) {
              if (!arguments.length && method == 'on' && type) method = 'fire'
              b[method].apply(this, [this[i]].concat(_args, Array.prototype.slice.call(arguments, 0)))
            }
            return this
          }
        }
  
      , add   = integrate('add')
      , on    = integrate('on')
      , one   = integrate('one')
      , off   = integrate('off')
      , fire  = integrate('fire')
      , clone = integrate('clone')
  
      , hover = function (enter, leave, i) { // i for internal
          for (i = this.length; i--;) {
            b.on.call(this, this[i], 'mouseenter', enter)
            b.on.call(this, this[i], 'mouseleave', leave)
          }
          return this
        }
  
      , methods = {
            on             : on
          , addListener    : on
          , bind           : on
          , listen         : on
          , delegate       : add // jQuery compat, same arg order as add()
  
          , one            : one
  
          , off            : off
          , unbind         : off
          , unlisten       : off
          , removeListener : off
          , undelegate     : off
  
          , emit           : fire
          , trigger        : fire
  
          , cloneEvents    : clone
  
          , hover          : hover
        }
  
      , shortcuts =
           ('blur change click dblclick error focus focusin focusout keydown keypress '
          + 'keyup load mousedown mouseenter mouseleave mouseout mouseover mouseup '
          + 'mousemove resize scroll select submit unload').split(' ')
  
    for (var i = shortcuts.length; i--;) {
      methods[shortcuts[i]] = integrate('on', shortcuts[i])
    }
  
    b.setSelectorEngine($)
  
    $.ender(methods, true)
  }(ender);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /***************************************************************
    * Traversty: A DOM collection management and traversal utility
    * (c) Rod Vagg (@rvagg) 2012
    * https://github.com/rvagg/traversty
    * License: MIT
    */
  
  (function (name, context, definition) {
    if (typeof module != 'undefined' && module.exports)
      module.exports = definition()
    else if (typeof define == 'function' && define.amd)
      define(definition)
    else
      context[name] = definition()
  })('traversty', this, function () {
  
    var context = this
      , old = context.traversty
      , doc = window.document
      , html = doc.documentElement
      , toString = Object.prototype.toString
      , Ap = Array.prototype
      , slice = Ap.slice
        // feature test to find native matchesSelector()
      , matchesSelector = (function (el, pfx, name, i, ms) {
          while (i < pfx.length)
            if (el[ms = pfx[i++] + name])
              return ms
        }(html, [ 'msM', 'webkitM', 'mozM', 'oM', 'm' ], 'atchesSelector', 0))
  
      , Kfalse = function () { return false }
  
      , isNumber = function (o) {
          return toString.call(o) === '[object Number]'
        }
  
      , isString = function (o) {
          return toString.call(o) === '[object String]'
        }
  
      , isFunction = function (o) {
          return toString.call(o) === '[object Function]'
        }
  
      , isUndefined = function (o) {
          return o === void 0
        }
  
      , isElement = function (o) {
          return o && o.nodeType === 1
        }
  
        // figure out which argument, if any, is our 'index'
      , getIndex = function (selector, index) {
          return isUndefined(selector) && !isNumber(index) ? 0 :
            isNumber(selector) ? selector : isNumber(index) ? index : null
        }
  
        // figure out which argument, if any, is our 'selector'
      , getSelector = function (selector) {
          return isString(selector) ? selector : '*'
        }
  
      , nativeSelectorFind = function (selector, el) {
          return slice.call(el.querySelectorAll(selector), 0)
        }
  
      , nativeSelectorMatches = function (selector, el) {
          return selector === '*' || el[matchesSelector](selector)
        }
  
      , selectorFind = nativeSelectorFind
  
      , selectorMatches = nativeSelectorMatches
  
        // used in the case where our selector engine does out-of-order element returns for
        // grouped selectors, e.g. '.class, tag', we need our elements in document-order
        // so we do it ourselves if need be
      , createUnorderedEngineSelectorFind = function(engineSelect, selectorMatches) {
          return function (selector, el) {
            if (/,/.test(selector)) {
              var ret = [], i = -1, els = el.getElementsByTagName('*')
              while (++i < els.length)
                if (isElement(els[i]) && selectorMatches(selector, els[i]))
                  ret.push(els[i])
              return ret
            }
            return engineSelect(selector, el)
          }
        }
  
        // is 'element' underneath 'container' somewhere
      , isAncestor = 'compareDocumentPosition' in html
          ? function (element, container) {
              return (container.compareDocumentPosition(element) & 16) == 16
            }
          : 'contains' in html
            ? function (element, container) {
                container = container.nodeType === 9 || container == window ? html : container
                return container !== element && container.contains(element)
              }
            : function (element, container) { // old smelly browser
                while (element = element.parentNode)
                  if (element === container)
                    return 1
                return 0
              }
  
        // return an array containing only unique elements
      , unique = function (ar) {
          var a = [], i = -1, j, has
          while (++i < ar.length) {
            j = -1
            has = false
            while (++j < a.length) {
              if (a[j] === ar[i]) {
                has = true
                break
              }
            }
            if (!has)
              a.push(ar[i])
          }
          return a
        }
  
        // for each element of 'els' execute 'fn' to get an array of elements to collect
      , collect = function (els, fn) {
          var ret = [], res, i = 0, j, l = els.length, l2
          while (i < l) {
            j = 0
            l2 = (res = fn(els[i], i++)).length
            while (j < l2)
              ret.push(res[j++])
          }
          return ret
        }
  
       // generic DOM navigator to move multiple elements around the DOM
     , move = function (els, method, selector, index, filterFn) {
          index = getIndex(selector, index)
          selector = getSelector(selector)
          return collect(els
            , function (el, elind) {
                var i = index || 0, ret = []
                if (!filterFn)
                  el = el[method]
                while (el && (index === null || i >= 0)) {
                  // ignore non-elements, only consider selector-matching elements
                  // handle both the index and no-index (selector-only) cases
                  if (isElement(el)
                      && (!filterFn || filterFn === true || filterFn(el, elind))
                      && selectorMatches(selector, el)
                      && (index === null || i-- === 0)) {
                    // this concat vs push is to make sure we add elements to the result array
                    // in reverse order when doing a previous(selector) and up(selector)
                    index === null
                        && method != 'nextSibling'
                        && method != 'parentNode'
                      ? ret.unshift(el)
                      : ret.push(el)
                  }
                  el = el[method]
                }
                return ret
              }
          )
        }
  
        // given an index & length, return a 'fixed' index, fixes non-numbers & neative indexes
      , eqIndex = function (length, index, def) {
          if (index < 0)
            index = length + index
          if (index < 0 || index >= length)
            return null
          return !index && index !== 0 ? def : index
        }
  
        // collect elements of an array that match a filter function
      , filter = function (els, fn) {
          var arr = [], i = 0, l = els.length
          for (; i < l; i++)
            if (fn(els[i], i))
              arr.push(els[i])
          return arr
        }
  
        // create a filter function, for use by filter(), is() & not()
        // allows the argument to be an element, a function or a selector
      , filterFn = function (slfn) {
          var to
          return isElement(slfn)
            ? function (el) { return el === slfn }
            : (to = typeof slfn) == 'function'
              ? function (el, i) { return slfn.call(el, i) }
              : to == 'string' && slfn.length
                ? function (el) { return selectorMatches(slfn, el) }
                : Kfalse
        }
  
        // fn = !fn
      , inv = function (fn) {
          return function () {
            return !fn.apply(this, arguments)
          }
        }
  
      , traversty = (function () {
          function T(els) {
            this.length = 0
            if (els) {
              els = unique(!els.nodeType && !isUndefined(els.length) ? els : [ els ])
              var i = this.length = els.length
              while (i--)
                this[i] = els[i]
            }
          }
  
          T.prototype = {
              down: function (selector, index) {
                index = getIndex(selector, index)
                selector = getSelector(selector)
                return traversty(collect(this
                  , function (el) {
                      var f = selectorFind(selector, el)
                      return index === null ? f : ([ f[index] ] || [])
                    }
                  ))
              }
  
            , up: function (selector, index) {
                return traversty(move(this, 'parentNode', selector, index))
              }
  
            , parents: function () {
                return T.prototype.up.apply(this, arguments.length ? arguments : [ '*' ])
              }
  
            , closest: function (selector, index) {
                if (isNumber(selector)) {
                  index = selector
                  selector = '*'
                } else if (!isString(selector)) {
                  return traversty([])
                } else if (!isNumber(index)) {
                  index = 0
                }
                return traversty(move(this, 'parentNode', selector, index, true))
              }
  
            , previous: function (selector, index) {
                return traversty(move(this, 'previousSibling', selector, index))
              }
  
            , next: function (selector, index) {
                return traversty(move(this, 'nextSibling', selector, index))
              }
  
            , siblings: function (selector, index) {
                var self = this
                  , arr = slice.call(this, 0)
                  , i = 0, l = arr.length
  
                for (; i < l; i++) {
                  arr[i] = arr[i].parentNode.firstChild
                  while (!isElement(arr[i]))
                    arr[i] = arr[i].nextSibling
                }
  
                if (isUndefined(selector))
                  selector = '*'
  
                return traversty(move(arr, 'nextSibling', selector || '*', index
                      , function (el, i) { return el !== self[i] } // filter
                    ))
              }
  
            , children: function (selector, index) {
                return traversty(move(T.prototype.down.call(this), 'nextSibling', selector || '*', index, true))
              }
  
            , first: function () {
                return T.prototype.eq.call(this, 0)
              }
  
            , last: function () {
                return T.prototype.eq.call(this, -1)
              }
  
            , eq: function (index) {
                return traversty(this.get(index))
              }
  
            , get: function (index) {
                return this[eqIndex(this.length, index, 0)]
              }
  
              // a crazy man wrote this, don't try to understand it, see the tests
            , slice: function (start, end) {
                var e = end, l = this.length, arr = []
                start = eqIndex(l, Math.max(-this.length, start), 0)
                e = eqIndex(end < 0 ? l : l + 1, end, l)
                end = e === null || e > l ? end < 0 ? 0 : l : e
                while (start !== null && start < end)
                  arr.push(this[start++])
                return traversty(arr)
              }
  
            , filter: function (slfn) {
                return traversty(filter(this, filterFn(slfn)))
              }
  
            , not: function (slfn) {
                return traversty(filter(this, inv(filterFn(slfn))))
              }
  
              // similar to filter() but cares about descendent elements
            , has: function (slel) {
                return traversty(filter(
                    this
                  , isElement(slel)
                      ? function (el) { return isAncestor(slel, el) }
                      : typeof slel == 'string' && slel.length
                        ? function (el) { return selectorFind(slel, el).length } //TODO: performance
                        : Kfalse
                ))
              }
  
              // same as filter() but return a boolean so quick-return after first successful find
            , is: function (slfn) {
                var i = 0, l = this.length
                  , fn = filterFn(slfn)
                for (; i < l; i++)
                  if (fn(this[i], i))
                    return true
                return false
              }
  
            , toArray: function () { return Ap.slice.call(this) }
  
            , size: function () { return this.length }
  
            , each: function (fn, ctx) {
                var i = 0, l = this.length
                for (; i < l; i++)
                  fn.call(ctx || this[i], this[i], i, this)
                return this
              }
  
              // quack like a duck (Array)
            , push: Ap.push
            , sort: Ap.sort
            , splice: Ap.splice
          }
  
          T.prototype.prev = T.prototype.previous
  
          function t(els) {
            return new T(isString(els) ? selectorFind(els, doc) : els)
          }
  
          // extend traversty functionality with custom methods
          t.aug = function (methods) {
            var key, method
            for (key in methods) {
              method = methods[key]
              if (typeof method == 'function')
                T.prototype[key] = method
            }
          }
  
  
          t.setSelectorEngine = function (s) {
            // feature testing the selector engine like a boss
            var ss, r, a, _selectorMatches, _selectorFind
              , e = doc.createElement('p')
              , select = s.select || s.sel || s
  
            e.innerHTML = '<a/><i/><b/>'
            a = e.firstChild
            try {
              // YO! I HEARD YOU LIKED NESTED TERNARY OPERATORS SO I COOKED SOME UP FOR YOU!
              // (one day I might loop this...)
  
              // check to see how we do a matchesSelector
              _selectorMatches = isFunction(s.matching)
                ? function (selector, el) { return s.matching([el], selector).length > 0 }
                : isFunction(s.is)
                  ? function (selector, el) { return s.is(el, selector) }
                  : isFunction(s.matchesSelector)
                    ? function (selector, el) { return s.matchesSelector(el, selector) }
                    : isFunction(s.match)
                      ? function (selector, el) { return s.match(el, selector) }
                      : isFunction(s.matches)
                        ? function (selector, el) { return s.matches(el, selector) }
                        : null
  
              if (!_selectorMatches) {
                // perhaps it's an selector(x).is(y) type selector?
                ss = s('a', e)
                _selectorMatches = isFunction(ss._is)
                  ? function (selector, el) { return s(el)._is(selector) } // original .is(), replaced by Ender bridge
                  : isFunction(ss.matching)
                    ? function (selector, el) { return s(el).matching(selector).length > 0 }
                    : isFunction(ss.is) && !ss.is.__ignore
                      ? function (selector, el) { return s(el).is(selector) }
                        : isFunction(ss.matchesSelector)
                          ? function (selector, el) { return s(el).matchesSelector(selector) }
                          : isFunction(ss.match)
                            ? function (selector, el) { return s(el).match(selector) }
                            : isFunction(ss.matches)
                              ? function (selector, el) { return s(el).matches(selector) }
                              : null
              }
  
              if (!_selectorMatches)
                  throw new Error('Traversty: couldn\'t find selector engine\'s `matchesSelector`')
  
              // verify that we have a working `matchesSelector`
              if (_selectorMatches('x,y', e) || !_selectorMatches('a,p', e))
                  throw new Error('Traversty: couldn\'t make selector engine\'s `matchesSelector` work')
  
              // basic select
              if ((r = select('b,a', e)).length !== 2)
                throw new Error('Traversty: don\'t know how to use this selector engine')
  
              // check to see if the selector engine has given us the results in document-order
              // and if not, work around it
              _selectorFind = r[0] === a ? select : createUnorderedEngineSelectorFind(select, _selectorMatches)
  
              // have we done enough to get a working `selectorFind`?
              if ((r = _selectorFind('b,a', e)).length !== 2 || r[0] !== a)
                throw new Error('Traversty: couldn\'t make selector engine work')
  
              selectorMatches = _selectorMatches
              selectorFind = _selectorFind
            } catch (ex) {
              throw isString(ex)
                ? ex
                : new Error('Traversty: error while figuring out how the selector engine works: ' + (ex.message || ex))
            } finally {
              e = null
            }
  
            return t
          }
  
          t.noConflict = function () {
            context.traversty = old
            return this
          }
  
          return t
        }())
   
    return traversty
  });

  provide("traversty", module.exports);

  /*global ender:true*/
  
  (function ($) {
    var t = require('traversty')
      , integrated = false
      , integrate = function (meth) {
          // this crazyness is for lazy initialisation because we can't be guaranteed
          // that a selector engine has been installed *before* traversty in an ender build
          var fn = function (self, selector, index) {
              if (!integrated) {
                try {
                  t.setSelectorEngine($)
                } catch (ex) { } // ignore exception, we may have an ender build with no selector engine
                integrated = true
              }
              fn = meth == 'is'
                ? function (self, slfn) {
                    return t(self)[meth](slfn) // boolean
                  }
                : function (self, selector, index) {
                    return $(t(self)[meth](selector, index)) // collection
                  }
              return fn(self, selector, index)
            }
          return function (selector, index) { return fn(this, selector, index) }
        }
      , methods = 'up down next previous prev parents closest siblings children first last eq slice filter not is has'.split(' ')
      , b = {}, i = methods.length
  
    // does this build have an .is()? if so, shift it to _is() for traversty to use and
    // allow us to integrate a new is(), wrapped around it
    if ($.fn.is) $.fn._is = $.fn.is
    while (--i >= 0) b[methods[i]] = integrate(methods[i])
    $.ender(b, true)
    $.fn.is.__ignore = true
  }(ender))

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  /*!
   * Copyright (c) 2010 Chris O'Hara <cohara87@gmail.com>
   *
   * Permission is hereby granted, free of charge, to any person obtaining
   * a copy of this software and associated documentation files (the
   * "Software"), to deal in the Software without restriction, including
   * without limitation the rights to use, copy, modify, merge, publish,
   * distribute, sublicense, and/or sell copies of the Software, and to
   * permit persons to whom the Software is furnished to do so, subject to
   * the following conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
   * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
   * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
   * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
   * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
   */
  
  (function(exports) {
  
      var entities = {
          '&nbsp;': '\u00a0',
          '&iexcl;': '\u00a1',
          '&cent;': '\u00a2',
          '&pound;': '\u00a3',
          '&curren;': '\u20ac',
          '&yen;': '\u00a5',
          '&brvbar;': '\u0160',
          '&sect;': '\u00a7',
          '&uml;': '\u0161',
          '&copy;': '\u00a9',
          '&ordf;': '\u00aa',
          '&laquo;': '\u00ab',
          '&not;': '\u00ac',
          '&shy;': '\u00ad',
          '&reg;': '\u00ae',
          '&macr;': '\u00af',
          '&deg;': '\u00b0',
          '&plusmn;': '\u00b1',
          '&sup2;': '\u00b2',
          '&sup3;': '\u00b3',
          '&acute;': '\u017d',
          '&micro;': '\u00b5',
          '&para;': '\u00b6',
          '&middot;': '\u00b7',
          '&cedil;': '\u017e',
          '&sup1;': '\u00b9',
          '&ordm;': '\u00ba',
          '&raquo;': '\u00bb',
          '&frac14;': '\u0152',
          '&frac12;': '\u0153',
          '&frac34;': '\u0178',
          '&iquest;': '\u00bf',
          '&Agrave;': '\u00c0',
          '&Aacute;': '\u00c1',
          '&Acirc;': '\u00c2',
          '&Atilde;': '\u00c3',
          '&Auml;': '\u00c4',
          '&Aring;': '\u00c5',
          '&AElig;': '\u00c6',
          '&Ccedil;': '\u00c7',
          '&Egrave;': '\u00c8',
          '&Eacute;': '\u00c9',
          '&Ecirc;': '\u00ca',
          '&Euml;': '\u00cb',
          '&Igrave;': '\u00cc',
          '&Iacute;': '\u00cd',
          '&Icirc;': '\u00ce',
          '&Iuml;': '\u00cf',
          '&ETH;': '\u00d0',
          '&Ntilde;': '\u00d1',
          '&Ograve;': '\u00d2',
          '&Oacute;': '\u00d3',
          '&Ocirc;': '\u00d4',
          '&Otilde;': '\u00d5',
          '&Ouml;': '\u00d6',
          '&times;': '\u00d7',
          '&Oslash;': '\u00d8',
          '&Ugrave;': '\u00d9',
          '&Uacute;': '\u00da',
          '&Ucirc;': '\u00db',
          '&Uuml;': '\u00dc',
          '&Yacute;': '\u00dd',
          '&THORN;': '\u00de',
          '&szlig;': '\u00df',
          '&agrave;': '\u00e0',
          '&aacute;': '\u00e1',
          '&acirc;': '\u00e2',
          '&atilde;': '\u00e3',
          '&auml;': '\u00e4',
          '&aring;': '\u00e5',
          '&aelig;': '\u00e6',
          '&ccedil;': '\u00e7',
          '&egrave;': '\u00e8',
          '&eacute;': '\u00e9',
          '&ecirc;': '\u00ea',
          '&euml;': '\u00eb',
          '&igrave;': '\u00ec',
          '&iacute;': '\u00ed',
          '&icirc;': '\u00ee',
          '&iuml;': '\u00ef',
          '&eth;': '\u00f0',
          '&ntilde;': '\u00f1',
          '&ograve;': '\u00f2',
          '&oacute;': '\u00f3',
          '&ocirc;': '\u00f4',
          '&otilde;': '\u00f5',
          '&ouml;': '\u00f6',
          '&divide;': '\u00f7',
          '&oslash;': '\u00f8',
          '&ugrave;': '\u00f9',
          '&uacute;': '\u00fa',
          '&ucirc;': '\u00fb',
          '&uuml;': '\u00fc',
          '&yacute;': '\u00fd',
          '&thorn;': '\u00fe',
          '&yuml;': '\u00ff',
          '&quot;': '\u0022',
          '&lt;': '\u003c',
          '&gt;': '\u003e',
          '&apos;': '\u0027',
          '&minus;': '\u2212',
          '&circ;': '\u02c6',
          '&tilde;': '\u02dc',
          '&Scaron;': '\u0160',
          '&lsaquo;': '\u2039',
          '&OElig;': '\u0152',
          '&lsquo;': '\u2018',
          '&rsquo;': '\u2019',
          '&ldquo;': '\u201c',
          '&rdquo;': '\u201d',
          '&bull;': '\u2022',
          '&ndash;': '\u2013',
          '&mdash;': '\u2014',
          '&trade;': '\u2122',
          '&scaron;': '\u0161',
          '&rsaquo;': '\u203a',
          '&oelig;': '\u0153',
          '&Yuml;': '\u0178',
          '&fnof;': '\u0192',
          '&Alpha;': '\u0391',
          '&Beta;': '\u0392',
          '&Gamma;': '\u0393',
          '&Delta;': '\u0394',
          '&Epsilon;': '\u0395',
          '&Zeta;': '\u0396',
          '&Eta;': '\u0397',
          '&Theta;': '\u0398',
          '&Iota;': '\u0399',
          '&Kappa;': '\u039a',
          '&Lambda;': '\u039b',
          '&Mu;': '\u039c',
          '&Nu;': '\u039d',
          '&Xi;': '\u039e',
          '&Omicron;': '\u039f',
          '&Pi;': '\u03a0',
          '&Rho;': '\u03a1',
          '&Sigma;': '\u03a3',
          '&Tau;': '\u03a4',
          '&Upsilon;': '\u03a5',
          '&Phi;': '\u03a6',
          '&Chi;': '\u03a7',
          '&Psi;': '\u03a8',
          '&Omega;': '\u03a9',
          '&alpha;': '\u03b1',
          '&beta;': '\u03b2',
          '&gamma;': '\u03b3',
          '&delta;': '\u03b4',
          '&epsilon;': '\u03b5',
          '&zeta;': '\u03b6',
          '&eta;': '\u03b7',
          '&theta;': '\u03b8',
          '&iota;': '\u03b9',
          '&kappa;': '\u03ba',
          '&lambda;': '\u03bb',
          '&mu;': '\u03bc',
          '&nu;': '\u03bd',
          '&xi;': '\u03be',
          '&omicron;': '\u03bf',
          '&pi;': '\u03c0',
          '&rho;': '\u03c1',
          '&sigmaf;': '\u03c2',
          '&sigma;': '\u03c3',
          '&tau;': '\u03c4',
          '&upsilon;': '\u03c5',
          '&phi;': '\u03c6',
          '&chi;': '\u03c7',
          '&psi;': '\u03c8',
          '&omega;': '\u03c9',
          '&thetasym;': '\u03d1',
          '&upsih;': '\u03d2',
          '&piv;': '\u03d6',
          '&ensp;': '\u2002',
          '&emsp;': '\u2003',
          '&thinsp;': '\u2009',
          '&zwnj;': '\u200c',
          '&zwj;': '\u200d',
          '&lrm;': '\u200e',
          '&rlm;': '\u200f',
          '&sbquo;': '\u201a',
          '&bdquo;': '\u201e',
          '&dagger;': '\u2020',
          '&Dagger;': '\u2021',
          '&hellip;': '\u2026',
          '&permil;': '\u2030',
          '&prime;': '\u2032',
          '&Prime;': '\u2033',
          '&oline;': '\u203e',
          '&frasl;': '\u2044',
          '&euro;': '\u20ac',
          '&image;': '\u2111',
          '&weierp;': '\u2118',
          '&real;': '\u211c',
          '&alefsym;': '\u2135',
          '&larr;': '\u2190',
          '&uarr;': '\u2191',
          '&rarr;': '\u2192',
          '&darr;': '\u2193',
          '&harr;': '\u2194',
          '&crarr;': '\u21b5',
          '&lArr;': '\u21d0',
          '&uArr;': '\u21d1',
          '&rArr;': '\u21d2',
          '&dArr;': '\u21d3',
          '&hArr;': '\u21d4',
          '&forall;': '\u2200',
          '&part;': '\u2202',
          '&exist;': '\u2203',
          '&empty;': '\u2205',
          '&nabla;': '\u2207',
          '&isin;': '\u2208',
          '&notin;': '\u2209',
          '&ni;': '\u220b',
          '&prod;': '\u220f',
          '&sum;': '\u2211',
          '&lowast;': '\u2217',
          '&radic;': '\u221a',
          '&prop;': '\u221d',
          '&infin;': '\u221e',
          '&ang;': '\u2220',
          '&and;': '\u2227',
          '&or;': '\u2228',
          '&cap;': '\u2229',
          '&cup;': '\u222a',
          '&int;': '\u222b',
          '&there4;': '\u2234',
          '&sim;': '\u223c',
          '&cong;': '\u2245',
          '&asymp;': '\u2248',
          '&ne;': '\u2260',
          '&equiv;': '\u2261',
          '&le;': '\u2264',
          '&ge;': '\u2265',
          '&sub;': '\u2282',
          '&sup;': '\u2283',
          '&nsub;': '\u2284',
          '&sube;': '\u2286',
          '&supe;': '\u2287',
          '&oplus;': '\u2295',
          '&otimes;': '\u2297',
          '&perp;': '\u22a5',
          '&sdot;': '\u22c5',
          '&lceil;': '\u2308',
          '&rceil;': '\u2309',
          '&lfloor;': '\u230a',
          '&rfloor;': '\u230b',
          '&lang;': '\u2329',
          '&rang;': '\u232a',
          '&loz;': '\u25ca',
          '&spades;': '\u2660',
          '&clubs;': '\u2663',
          '&hearts;': '\u2665',
          '&diams;': '\u2666'
      };
  
      var decode = function (str) {
          if (!~str.indexOf('&')) return str;
  
          //Decode literal entities
          for (var i in entities) {
              str = str.replace(new RegExp(i, 'g'), entities[i]);
          }
  
          //Decode hex entities
          str = str.replace(/&#x(0*[0-9a-f]{2,5});?/gi, function (m, code) {
              return String.fromCharCode(parseInt(+code, 16));
          });
  
          //Decode numeric entities
          str = str.replace(/&#([0-9]{2,4});?/gi, function (m, code) {
              return String.fromCharCode(+code);
          });
  
          str = str.replace(/&amp;/g, '&');
  
          return str;
      }
  
      var encode = function (str) {
          str = str.replace(/&/g, '&amp;');
  
          //IE doesn't accept &apos;
          str = str.replace(/'/g, '&#39;');
  
          //Encode literal entities
          for (var i in entities) {
              str = str.replace(new RegExp(entities[i], 'g'), i);
          }
  
          return str;
      }
  
      exports.entities = {
          encode: encode,
          decode: decode
      }
  
      //This module is adapted from the CodeIgniter framework
      //The license is available at http://codeigniter.com/
  
      var never_allowed_str = {
          'document.cookie':              '[removed]',
          'document.write':               '[removed]',
          '.parentNode':                  '[removed]',
          '.innerHTML':                   '[removed]',
          'window.location':              '[removed]',
          '-moz-binding':                 '[removed]',
          '<!--':                         '&lt;!--',
          '-->':                          '--&gt;',
          '<![CDATA[':                    '&lt;![CDATA['
      };
  
      var never_allowed_regex = {
          'javascript\\s*:':              '[removed]',
          'expression\\s*(\\(|&\\#40;)':  '[removed]',
          'vbscript\\s*:':                '[removed]',
          'Redirect\\s+302':              '[removed]'
      };
  
      var non_displayables = [
          /%0[0-8bcef]/g,           // url encoded 00-08, 11, 12, 14, 15
          /%1[0-9a-f]/g,            // url encoded 16-31
          /[\x00-\x08]/g,           // 00-08
          /\x0b/g, /\x0c/g,         // 11,12
          /[\x0e-\x1f]/g            // 14-31
      ];
  
      var compact_words = [
          'javascript', 'expression', 'vbscript',
          'script', 'applet', 'alert', 'document',
          'write', 'cookie', 'window'
      ];
  
      exports.xssClean = function(str, is_image) {
  
          //Recursively clean objects and arrays
          if (typeof str === 'object') {
              for (var i in str) {
                  str[i] = exports.xssClean(str[i]);
              }
              return str;
          }
  
          //Remove invisible characters
          str = remove_invisible_characters(str);
  
          //Protect query string variables in URLs => 901119URL5918AMP18930PROTECT8198
          str = str.replace(/\&([a-z\_0-9]+)\=([a-z\_0-9]+)/i, xss_hash() + '$1=$2');
  
          //Validate standard character entities - add a semicolon if missing.  We do this to enable
          //the conversion of entities to ASCII later.
          str = str.replace(/(&\#?[0-9a-z]{2,})([\x00-\x20])*;?/i, '$1;$2');
  
          //Validate UTF16 two byte encoding (x00) - just as above, adds a semicolon if missing.
          str = str.replace(/(&\#x?)([0-9A-F]+);?/i, '$1;$2');
  
          //Un-protect query string variables
          str = str.replace(xss_hash(), '&');
  
          //Decode just in case stuff like this is submitted:
          //<a href="http://%77%77%77%2E%67%6F%6F%67%6C%65%2E%63%6F%6D">Google</a>
          try {
            str = decodeURIComponent(str);
          } catch (e) {
            // str was not actually URI-encoded
          }
  
          //Convert character entities to ASCII - this permits our tests below to work reliably.
          //We only convert entities that are within tags since these are the ones that will pose security problems.
          str = str.replace(/[a-z]+=([\'\"]).*?\1/gi, function(m, match) {
              return m.replace(match, convert_attribute(match));
          });
  
          //Remove invisible characters again
          str = remove_invisible_characters(str);
  
          //Convert tabs to spaces
          str = str.replace('\t', ' ');
  
          //Captured the converted string for later comparison
          var converted_string = str;
  
          //Remove strings that are never allowed
          for (var i in never_allowed_str) {
              str = str.replace(i, never_allowed_str[i]);
          }
  
          //Remove regex patterns that are never allowed
          for (var i in never_allowed_regex) {
              str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);
          }
  
          //Compact any exploded words like:  j a v a s c r i p t
          // We only want to do this when it is followed by a non-word character
          for (var i in compact_words) {
              var spacified = compact_words[i].split('').join('\\s*')+'\\s*';
  
              str = str.replace(new RegExp('('+spacified+')(\\W)', 'ig'), function(m, compat, after) {
                  return compat.replace(/\s+/g, '') + after;
              });
          }
  
          //Remove disallowed Javascript in links or img tags
          do {
              var original = str;
  
              if (str.match(/<a/i)) {
                  str = str.replace(/<a\s+([^>]*?)(>|$)/gi, function(m, attributes, end_tag) {
                      attributes = filter_attributes(attributes.replace('<','').replace('>',''));
                      return m.replace(attributes, attributes.replace(/href=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)/gi, ''));
                  });
              }
  
              if (str.match(/<img/i)) {
                  str = str.replace(/<img\s+([^>]*?)(\s?\/?>|$)/gi, function(m, attributes, end_tag) {
                      attributes = filter_attributes(attributes.replace('<','').replace('>',''));
                      return m.replace(attributes, attributes.replace(/src=.*?(alert\(|alert&\#40;|javascript\:|charset\=|window\.|document\.|\.cookie|<script|<xss|base64\s*,)/gi, ''));
                  });
              }
  
              if (str.match(/script/i) || str.match(/xss/i)) {
                  str = str.replace(/<(\/*)(script|xss)(.*?)\>/gi, '[removed]');
              }
  
          } while(original != str);
  
          //Remove JavaScript Event Handlers - Note: This code is a little blunt.  It removes the event
          //handler and anything up to the closing >, but it's unlikely to be a problem.
          event_handlers = ['[^a-z_\-]on\\w*'];
  
          //Adobe Photoshop puts XML metadata into JFIF images, including namespacing,
          //so we have to allow this for images
          if (!is_image) {
              event_handlers.push('xmlns');
          }
  
          str = str.replace(new RegExp("<([^><]+?)("+event_handlers.join('|')+")(\\s*=\\s*[^><]*)([><]*)", 'i'), '<$1$4');
  
          //Sanitize naughty HTML elements
          //If a tag containing any of the words in the list
          //below is found, the tag gets converted to entities.
          //So this: <blink>
          //Becomes: &lt;blink&gt;
          naughty = 'alert|applet|audio|basefont|base|behavior|bgsound|blink|body|embed|expression|form|frameset|frame|head|html|ilayer|iframe|input|isindex|layer|link|meta|object|plaintext|style|script|textarea|title|video|xml|xss';
          str = str.replace(new RegExp('<(/*\\s*)('+naughty+')([^><]*)([><]*)', 'gi'), function(m, a, b, c, d) {
              return '&lt;' + a + b + c + d.replace('>','&gt;').replace('<','&lt;');
          });
  
          //Sanitize naughty scripting elements Similar to above, only instead of looking for
          //tags it looks for PHP and JavaScript commands that are disallowed.  Rather than removing the
          //code, it simply converts the parenthesis to entities rendering the code un-executable.
          //For example:    eval('some code')
          //Becomes:        eval&#40;'some code'&#41;
          str = str.replace(/(alert|cmd|passthru|eval|exec|expression|system|fopen|fsockopen|file|file_get_contents|readfile|unlink)(\s*)\((.*?)\)/gi, '$1$2&#40;$3&#41;');
  
          //This adds a bit of extra precaution in case something got through the above filters
          for (var i in never_allowed_str) {
              str = str.replace(i, never_allowed_str[i]);
          }
          for (var i in never_allowed_regex) {
              str = str.replace(new RegExp(i, 'i'), never_allowed_regex[i]);
          }
  
          //Images are handled in a special way
          if (is_image && str !== converted_string) {
              throw new Error('Image may contain XSS');
          }
  
          return str;
      }
  
      function remove_invisible_characters(str) {
          for (var i in non_displayables) {
              str = str.replace(non_displayables[i], '');
          }
          return str;
      }
  
      function xss_hash() {
          //TODO: Create a random hash
          return '!*$^#(@*#&';
      }
  
      function convert_attribute(str) {
          return str.replace('>','&gt;').replace('<','&lt;').replace('\\','\\\\');
      }
  
      //Filter Attributes - filters tag attributes for consistency and safety
      function filter_attributes(str) {
          out = '';
  
          str.replace(/\s*[a-z\-]+\s*=\s*(?:\042|\047)(?:[^\1]*?)\1/gi, function(m) {
              out += m.replace(/\/\*.*?\*\//g, '');
          });
  
          return out;
      }
  
      var Validator = exports.Validator = function() {}
  
      Validator.prototype.check = function(str, fail_msg) {
          this.str = str == null || (isNaN(str) && str.length == undefined) ? '' : str+'';
          this.msg = fail_msg;
          this._errors = [];
          return this;
      }
  
      //Create some aliases - may help code readability
      Validator.prototype.validate = Validator.prototype.check;
      Validator.prototype.assert = Validator.prototype.check;
  
      Validator.prototype.error = function(msg) {
          throw new Error(msg);
      }
  
      Validator.prototype.isEmail = function() {
          if (!this.str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/)) {
              return this.error(this.msg || 'Invalid email');
          }
          return this;
      }
  
  	//Will work against Visa, MasterCard, American Express, Discover, Diners Club, and JCB card numbering formats
  	Validator.prototype.isCreditCard = function() {
  		this.str = this.str.replace(/[^0-9]+/g, ''); //remove all dashes, spaces, etc.
          if (!this.str.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
              return this.error(this.msg || 'Invalid credit card');
          }
          return this;
      }
  
      Validator.prototype.isUrl = function() {
          if (!this.str.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) || this.str.length > 2083) {
              return this.error(this.msg || 'Invalid URL');
          }
          return this;
      }
  
      Validator.prototype.isIP = function() {
          if (!this.str.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
              return this.error(this.msg || 'Invalid IP');
          }
          return this;
      }
  
      Validator.prototype.isAlpha = function() {
          if (!this.str.match(/^[a-zA-Z]+$/)) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.isAlphanumeric = function() {
          if (!this.str.match(/^[a-zA-Z0-9]+$/)) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.isNumeric = function() {
          if (!this.str.match(/^-?[0-9]+$/)) {
              return this.error(this.msg || 'Invalid number');
          }
          return this;
      }
  
      Validator.prototype.isLowercase = function() {
          if (!this.str.match(/^[a-z0-9]+$/)) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.isUppercase = function() {
          if (!this.str.match(/^[A-Z0-9]+$/)) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.isInt = function() {
          if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))$/)) {
              return this.error(this.msg || 'Invalid integer');
          }
          return this;
      }
  
      Validator.prototype.isDecimal = function() {
          if (!this.str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/)) {
              return this.error(this.msg || 'Invalid decimal');
          }
          return this;
      }
  
      Validator.prototype.isFloat = function() {
          return this.isDecimal();
      }
  
      Validator.prototype.notNull = function() {
          if (this.str === '') {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.isNull = function() {
          if (this.str !== '') {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.notEmpty = function() {
          if (this.str.match(/^[\s\t\r\n]*$/)) {
              return this.error(this.msg || 'String is whitespace');
          }
          return this;
      }
  
      Validator.prototype.equals = function(equals) {
          if (this.str != equals) {
              return this.error(this.msg || 'Not equal');
          }
          return this;
      }
  
      Validator.prototype.contains = function(str) {
          if (this.str.indexOf(str) === -1) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.notContains = function(str) {
          if (this.str.indexOf(str) >= 0) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.regex = Validator.prototype.is = function(pattern, modifiers) {
          if (typeof pattern !== 'function') {
              pattern = new RegExp(pattern, modifiers);
          }
          if (! this.str.match(pattern)) {
              return this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.notRegex = Validator.prototype.not = function(pattern, modifiers) {
          if (typeof pattern !== 'function') {
              pattern = new RegExp(pattern, modifiers);
          }
          if (this.str.match(pattern)) {
              this.error(this.msg || 'Invalid characters');
          }
          return this;
      }
  
      Validator.prototype.len = function(min, max) {
          if (this.str.length < min) {
              this.error(this.msg || 'String is too small');
          }
          if (typeof max !== undefined && this.str.length > max) {
              return this.error(this.msg || 'String is too large');
          }
          return this;
      }
  
      //Thanks to github.com/sreuter for the idea.
      Validator.prototype.isUUID = function(version) {
          if (version == 3 || version == 'v3') {
              pattern = /[0-9A-F]{8}-[0-9A-F]{4}-3[0-9A-F]{3}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
          } else if (version == 4 || version == 'v4') {
              pattern = /[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
          } else {
              pattern = /[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;
          }
          if (!this.str.match(pattern)) {
              return this.error(this.msg || 'Not a UUID');
          }
          return this;
      }
  
      Validator.prototype.isDate = function() {
          var intDate = Date.parse(this.str);
          if (isNaN(intDate)) { 
              return this.error(this.msg || 'Not a date'); 
          }
          return this;
      }
  
      Validator.prototype.isIn = function(options) {
          if (options && typeof options.indexOf === 'function') {
              if (!~options.indexOf(this.str)) {
                  return this.error(this.msg || 'Unexpected value');
              }
              return this;
          } else {
              return this.error(this.msg || 'Invalid in() argument');
          }
      }
  
      Validator.prototype.notIn = function(options) {
          if (options && typeof options.indexOf === 'function') {
              if (options.indexOf(this.str) !== -1) {
                  return this.error(this.msg || 'Unexpected value');
              }
              return this;
          } else {
              return this.error(this.msg || 'Invalid notIn() argument');
          }
      }
  
      Validator.prototype.min = function(val) {
          var number = parseFloat(this.str);
  
          if (!isNaN(number) && number < val) {
              return this.error(this.msg || 'Invalid number');
          }
  
          return this;
      }
  
      Validator.prototype.max = function(val) {
          var number = parseFloat(this.str);
          if (!isNaN(number) && number > val) {
              return this.error(this.msg || 'Invalid number');
          }
          return this;
      }
  
      Validator.prototype.isArray = function() {
          if (!Array.isArray(this.str)) {
              return this.error(this.msg || 'Not an array');
          }
          return this;
      }
  
      var Filter = exports.Filter = function() {}
  
      var whitespace = '\\r\\n\\t\\s';
  
      Filter.prototype.modify = function(str) {
          this.str = str;
      }
  
      //Create some aliases - may help code readability
      Filter.prototype.convert = Filter.prototype.sanitize = function(str) {
          this.str = str;
          return this;
      }
  
      Filter.prototype.xss = function(is_image) {
          this.modify(exports.xssClean(this.str, is_image));
          return this.str;
      }
  
      Filter.prototype.entityDecode = function() {
          this.modify(decode(this.str));
          return this.str;
      }
  
      Filter.prototype.entityEncode = function() {
          this.modify(encode(this.str));
          return this.str;
      }
  
      Filter.prototype.ltrim = function(chars) {
          chars = chars || whitespace;
          this.modify(this.str.replace(new RegExp('^['+chars+']+', 'g'), ''));
          return this.str;
      }
  
      Filter.prototype.rtrim = function(chars) {
          chars = chars || whitespace;
          this.modify(this.str.replace(new RegExp('['+chars+']+$', 'g'), ''));
          return this.str;
      }
  
      Filter.prototype.trim = function(chars) {
          chars = chars || whitespace;
          this.modify(this.str.replace(new RegExp('^['+chars+']+|['+chars+']+$', 'g'), ''));
          return this.str;
      }
  
      Filter.prototype.ifNull = function(replace) {
          if (!this.str || this.str === '') {
              this.modify(replace);
          }
          return this.str;
      }
  
      Filter.prototype.toFloat = function() {
          this.modify(parseFloat(this.str));
          return this.str;
      }
  
      Filter.prototype.toInt = function(radix) {
          radix = radix || 10;
          this.modify(parseInt(this.str), radix);
          return this.str;
      }
  
      //Any strings with length > 0 (except for '0' and 'false') are considered true,
      //all other strings are false
      Filter.prototype.toBoolean = function() {
          if (!this.str || this.str == '0' || this.str == 'false' || this.str == '') {
              this.modify(false);
          } else {
              this.modify(true);
          }
          return this.str;
      }
  
      //String must be equal to '1' or 'true' to be considered true, all other strings
      //are false
      Filter.prototype.toBooleanStrict = function() {
          if (this.str == '1' || this.str == 'true') {
              this.modify(true);
          } else {
              this.modify(false);
          }
          return this.str;
      }
  
      //Quick access methods
      exports.sanitize = exports.convert = function(str) {
          var filter = new exports.Filter();
          return filter.sanitize(str);
      }
  
      exports.check = exports.validate = exports.assert = function(str, fail_msg) {
          var validator = new exports.Validator();
          return validator.check(str, fail_msg);
      }
  
  })(typeof(exports) === 'undefined' ? window : exports);
  
  

  provide("ender-validator", module.exports);

  $.ender(module.exports);

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  // moment.js
  // version : 2.0.0
  // author : Tim Wood
  // license : MIT
  // momentjs.com
  
  (function (undefined) {
  
      /************************************
          Constants
      ************************************/
  
      var moment,
          VERSION = "2.0.0",
          round = Math.round, i,
          // internal storage for language config files
          languages = {},
  
          // check for nodeJS
          hasModule = (typeof module !== 'undefined' && module.exports),
  
          // ASP.NET json date format regex
          aspNetJsonRegex = /^\/?Date\((\-?\d+)/i,
  
          // format tokens
          formattingTokens = /(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|ddd?d?|do?|w[o|w]?|W[o|W]?|YYYYY|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|X|zz?|ZZ?|.)/g,
          localFormattingTokens = /(\[[^\[]*\])|(\\)?(LT|LL?L?L?|l{1,4})/g,
  
          // parsing tokens
          parseMultipleFormatChunker = /([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,
  
          // parsing token regexes
          parseTokenOneOrTwoDigits = /\d\d?/, // 0 - 99
          parseTokenOneToThreeDigits = /\d{1,3}/, // 0 - 999
          parseTokenThreeDigits = /\d{3}/, // 000 - 999
          parseTokenFourDigits = /\d{1,4}/, // 0 - 9999
          parseTokenSixDigits = /[+\-]?\d{1,6}/, // -999,999 - 999,999
          parseTokenWord = /[0-9]*[a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF]+\s*?[\u0600-\u06FF]+/i, // any word (or two) characters or numbers including two word month in arabic.
          parseTokenTimezone = /Z|[\+\-]\d\d:?\d\d/i, // +00:00 -00:00 +0000 -0000 or Z
          parseTokenT = /T/i, // T (ISO seperator)
          parseTokenTimestampMs = /[\+\-]?\d+(\.\d{1,3})?/, // 123456789 123456789.123
  
          // preliminary iso regex
          // 0000-00-00 + T + 00 or 00:00 or 00:00:00 or 00:00:00.000 + +00:00 or +0000
          isoRegex = /^\s*\d{4}-\d\d-\d\d((T| )(\d\d(:\d\d(:\d\d(\.\d\d?\d?)?)?)?)?([\+\-]\d\d:?\d\d)?)?/,
          isoFormat = 'YYYY-MM-DDTHH:mm:ssZ',
  
          // iso time formats and regexes
          isoTimes = [
              ['HH:mm:ss.S', /(T| )\d\d:\d\d:\d\d\.\d{1,3}/],
              ['HH:mm:ss', /(T| )\d\d:\d\d:\d\d/],
              ['HH:mm', /(T| )\d\d:\d\d/],
              ['HH', /(T| )\d\d/]
          ],
  
          // timezone chunker "+10:00" > ["10", "00"] or "-1530" > ["-15", "30"]
          parseTimezoneChunker = /([\+\-]|\d\d)/gi,
  
          // getter and setter names
          proxyGettersAndSetters = 'Month|Date|Hours|Minutes|Seconds|Milliseconds'.split('|'),
          unitMillisecondFactors = {
              'Milliseconds' : 1,
              'Seconds' : 1e3,
              'Minutes' : 6e4,
              'Hours' : 36e5,
              'Days' : 864e5,
              'Months' : 2592e6,
              'Years' : 31536e6
          },
  
          // format function strings
          formatFunctions = {},
  
          // tokens to ordinalize and pad
          ordinalizeTokens = 'DDD w W M D d'.split(' '),
          paddedTokens = 'M D H h m s w W'.split(' '),
  
          formatTokenFunctions = {
              M    : function () {
                  return this.month() + 1;
              },
              MMM  : function (format) {
                  return this.lang().monthsShort(this, format);
              },
              MMMM : function (format) {
                  return this.lang().months(this, format);
              },
              D    : function () {
                  return this.date();
              },
              DDD  : function () {
                  return this.dayOfYear();
              },
              d    : function () {
                  return this.day();
              },
              dd   : function (format) {
                  return this.lang().weekdaysMin(this, format);
              },
              ddd  : function (format) {
                  return this.lang().weekdaysShort(this, format);
              },
              dddd : function (format) {
                  return this.lang().weekdays(this, format);
              },
              w    : function () {
                  return this.week();
              },
              W    : function () {
                  return this.isoWeek();
              },
              YY   : function () {
                  return leftZeroFill(this.year() % 100, 2);
              },
              YYYY : function () {
                  return leftZeroFill(this.year(), 4);
              },
              YYYYY : function () {
                  return leftZeroFill(this.year(), 5);
              },
              a    : function () {
                  return this.lang().meridiem(this.hours(), this.minutes(), true);
              },
              A    : function () {
                  return this.lang().meridiem(this.hours(), this.minutes(), false);
              },
              H    : function () {
                  return this.hours();
              },
              h    : function () {
                  return this.hours() % 12 || 12;
              },
              m    : function () {
                  return this.minutes();
              },
              s    : function () {
                  return this.seconds();
              },
              S    : function () {
                  return ~~(this.milliseconds() / 100);
              },
              SS   : function () {
                  return leftZeroFill(~~(this.milliseconds() / 10), 2);
              },
              SSS  : function () {
                  return leftZeroFill(this.milliseconds(), 3);
              },
              Z    : function () {
                  var a = -this.zone(),
                      b = "+";
                  if (a < 0) {
                      a = -a;
                      b = "-";
                  }
                  return b + leftZeroFill(~~(a / 60), 2) + ":" + leftZeroFill(~~a % 60, 2);
              },
              ZZ   : function () {
                  var a = -this.zone(),
                      b = "+";
                  if (a < 0) {
                      a = -a;
                      b = "-";
                  }
                  return b + leftZeroFill(~~(10 * a / 6), 4);
              },
              X    : function () {
                  return this.unix();
              }
          };
  
      function padToken(func, count) {
          return function (a) {
              return leftZeroFill(func.call(this, a), count);
          };
      }
      function ordinalizeToken(func) {
          return function (a) {
              return this.lang().ordinal(func.call(this, a));
          };
      }
  
      while (ordinalizeTokens.length) {
          i = ordinalizeTokens.pop();
          formatTokenFunctions[i + 'o'] = ordinalizeToken(formatTokenFunctions[i]);
      }
      while (paddedTokens.length) {
          i = paddedTokens.pop();
          formatTokenFunctions[i + i] = padToken(formatTokenFunctions[i], 2);
      }
      formatTokenFunctions.DDDD = padToken(formatTokenFunctions.DDD, 3);
  
  
      /************************************
          Constructors
      ************************************/
  
      function Language() {
  
      }
  
      // Moment prototype object
      function Moment(config) {
          extend(this, config);
      }
  
      // Duration Constructor
      function Duration(duration) {
          var data = this._data = {},
              years = duration.years || duration.year || duration.y || 0,
              months = duration.months || duration.month || duration.M || 0,
              weeks = duration.weeks || duration.week || duration.w || 0,
              days = duration.days || duration.day || duration.d || 0,
              hours = duration.hours || duration.hour || duration.h || 0,
              minutes = duration.minutes || duration.minute || duration.m || 0,
              seconds = duration.seconds || duration.second || duration.s || 0,
              milliseconds = duration.milliseconds || duration.millisecond || duration.ms || 0;
  
          // representation for dateAddRemove
          this._milliseconds = milliseconds +
              seconds * 1e3 + // 1000
              minutes * 6e4 + // 1000 * 60
              hours * 36e5; // 1000 * 60 * 60
          // Because of dateAddRemove treats 24 hours as different from a
          // day when working around DST, we need to store them separately
          this._days = days +
              weeks * 7;
          // It is impossible translate months into days without knowing
          // which months you are are talking about, so we have to store
          // it separately.
          this._months = months +
              years * 12;
  
          // The following code bubbles up values, see the tests for
          // examples of what that means.
          data.milliseconds = milliseconds % 1000;
          seconds += absRound(milliseconds / 1000);
  
          data.seconds = seconds % 60;
          minutes += absRound(seconds / 60);
  
          data.minutes = minutes % 60;
          hours += absRound(minutes / 60);
  
          data.hours = hours % 24;
          days += absRound(hours / 24);
  
          days += weeks * 7;
          data.days = days % 30;
  
          months += absRound(days / 30);
  
          data.months = months % 12;
          years += absRound(months / 12);
  
          data.years = years;
      }
  
  
      /************************************
          Helpers
      ************************************/
  
  
      function extend(a, b) {
          for (var i in b) {
              if (b.hasOwnProperty(i)) {
                  a[i] = b[i];
              }
          }
          return a;
      }
  
      function absRound(number) {
          if (number < 0) {
              return Math.ceil(number);
          } else {
              return Math.floor(number);
          }
      }
  
      // left zero fill a number
      // see http://jsperf.com/left-zero-filling for performance comparison
      function leftZeroFill(number, targetLength) {
          var output = number + '';
          while (output.length < targetLength) {
              output = '0' + output;
          }
          return output;
      }
  
      // helper function for _.addTime and _.subtractTime
      function addOrSubtractDurationFromMoment(mom, duration, isAdding) {
          var ms = duration._milliseconds,
              d = duration._days,
              M = duration._months,
              currentDate;
  
          if (ms) {
              mom._d.setTime(+mom + ms * isAdding);
          }
          if (d) {
              mom.date(mom.date() + d * isAdding);
          }
          if (M) {
              currentDate = mom.date();
              mom.date(1)
                  .month(mom.month() + M * isAdding)
                  .date(Math.min(currentDate, mom.daysInMonth()));
          }
      }
  
      // check if is an array
      function isArray(input) {
          return Object.prototype.toString.call(input) === '[object Array]';
      }
  
      // compare two arrays, return the number of differences
      function compareArrays(array1, array2) {
          var len = Math.min(array1.length, array2.length),
              lengthDiff = Math.abs(array1.length - array2.length),
              diffs = 0,
              i;
          for (i = 0; i < len; i++) {
              if (~~array1[i] !== ~~array2[i]) {
                  diffs++;
              }
          }
          return diffs + lengthDiff;
      }
  
  
      /************************************
          Languages
      ************************************/
  
  
      Language.prototype = {
          set : function (config) {
              var prop, i;
              for (i in config) {
                  prop = config[i];
                  if (typeof prop === 'function') {
                      this[i] = prop;
                  } else {
                      this['_' + i] = prop;
                  }
              }
          },
  
          _months : "January_February_March_April_May_June_July_August_September_October_November_December".split("_"),
          months : function (m) {
              return this._months[m.month()];
          },
  
          _monthsShort : "Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),
          monthsShort : function (m) {
              return this._monthsShort[m.month()];
          },
  
          monthsParse : function (monthName) {
              var i, mom, regex, output;
  
              if (!this._monthsParse) {
                  this._monthsParse = [];
              }
  
              for (i = 0; i < 12; i++) {
                  // make the regex if we don't have it already
                  if (!this._monthsParse[i]) {
                      mom = moment([2000, i]);
                      regex = '^' + this.months(mom, '') + '|^' + this.monthsShort(mom, '');
                      this._monthsParse[i] = new RegExp(regex.replace('.', ''), 'i');
                  }
                  // test the regex
                  if (this._monthsParse[i].test(monthName)) {
                      return i;
                  }
              }
          },
  
          _weekdays : "Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),
          weekdays : function (m) {
              return this._weekdays[m.day()];
          },
  
          _weekdaysShort : "Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),
          weekdaysShort : function (m) {
              return this._weekdaysShort[m.day()];
          },
  
          _weekdaysMin : "Su_Mo_Tu_We_Th_Fr_Sa".split("_"),
          weekdaysMin : function (m) {
              return this._weekdaysMin[m.day()];
          },
  
          _longDateFormat : {
              LT : "h:mm A",
              L : "MM/DD/YYYY",
              LL : "MMMM D YYYY",
              LLL : "MMMM D YYYY LT",
              LLLL : "dddd, MMMM D YYYY LT"
          },
          longDateFormat : function (key) {
              var output = this._longDateFormat[key];
              if (!output && this._longDateFormat[key.toUpperCase()]) {
                  output = this._longDateFormat[key.toUpperCase()].replace(/MMMM|MM|DD|dddd/g, function (val) {
                      return val.slice(1);
                  });
                  this._longDateFormat[key] = output;
              }
              return output;
          },
  
          meridiem : function (hours, minutes, isLower) {
              if (hours > 11) {
                  return isLower ? 'pm' : 'PM';
              } else {
                  return isLower ? 'am' : 'AM';
              }
          },
  
          _calendar : {
              sameDay : '[Today at] LT',
              nextDay : '[Tomorrow at] LT',
              nextWeek : 'dddd [at] LT',
              lastDay : '[Yesterday at] LT',
              lastWeek : '[last] dddd [at] LT',
              sameElse : 'L'
          },
          calendar : function (key, mom) {
              var output = this._calendar[key];
              return typeof output === 'function' ? output.apply(mom) : output;
          },
  
          _relativeTime : {
              future : "in %s",
              past : "%s ago",
              s : "a few seconds",
              m : "a minute",
              mm : "%d minutes",
              h : "an hour",
              hh : "%d hours",
              d : "a day",
              dd : "%d days",
              M : "a month",
              MM : "%d months",
              y : "a year",
              yy : "%d years"
          },
          relativeTime : function (number, withoutSuffix, string, isFuture) {
              var output = this._relativeTime[string];
              return (typeof output === 'function') ?
                  output(number, withoutSuffix, string, isFuture) :
                  output.replace(/%d/i, number);
          },
          pastFuture : function (diff, output) {
              var format = this._relativeTime[diff > 0 ? 'future' : 'past'];
              return typeof format === 'function' ? format(output) : format.replace(/%s/i, output);
          },
  
          ordinal : function (number) {
              return this._ordinal.replace("%d", number);
          },
          _ordinal : "%d",
  
          preparse : function (string) {
              return string;
          },
  
          postformat : function (string) {
              return string;
          },
  
          week : function (mom) {
              return weekOfYear(mom, this._week.dow, this._week.doy);
          },
          _week : {
              dow : 0, // Sunday is the first day of the week.
              doy : 6  // The week that contains Jan 1st is the first week of the year.
          }
      };
  
      // Loads a language definition into the `languages` cache.  The function
      // takes a key and optionally values.  If not in the browser and no values
      // are provided, it will load the language file module.  As a convenience,
      // this function also returns the language values.
      function loadLang(key, values) {
          values.abbr = key;
          if (!languages[key]) {
              languages[key] = new Language();
          }
          languages[key].set(values);
          return languages[key];
      }
  
      // Determines which language definition to use and returns it.
      //
      // With no parameters, it will return the global language.  If you
      // pass in a language key, such as 'en', it will return the
      // definition for 'en', so long as 'en' has already been loaded using
      // moment.lang.
      function getLangDefinition(key) {
          if (!key) {
              return moment.fn._lang;
          }
          if (!languages[key] && hasModule) {
              require('./lang/' + key);
          }
          return languages[key];
      }
  
  
      /************************************
          Formatting
      ************************************/
  
  
      function removeFormattingTokens(input) {
          if (input.match(/\[.*\]/)) {
              return input.replace(/^\[|\]$/g, "");
          }
          return input.replace(/\\/g, "");
      }
  
      function makeFormatFunction(format) {
          var array = format.match(formattingTokens), i, length;
  
          for (i = 0, length = array.length; i < length; i++) {
              if (formatTokenFunctions[array[i]]) {
                  array[i] = formatTokenFunctions[array[i]];
              } else {
                  array[i] = removeFormattingTokens(array[i]);
              }
          }
  
          return function (mom) {
              var output = "";
              for (i = 0; i < length; i++) {
                  output += typeof array[i].call === 'function' ? array[i].call(mom, format) : array[i];
              }
              return output;
          };
      }
  
      // format date using native date object
      function formatMoment(m, format) {
          var i = 5;
  
          function replaceLongDateFormatTokens(input) {
              return m.lang().longDateFormat(input) || input;
          }
  
          while (i-- && localFormattingTokens.test(format)) {
              format = format.replace(localFormattingTokens, replaceLongDateFormatTokens);
          }
  
          if (!formatFunctions[format]) {
              formatFunctions[format] = makeFormatFunction(format);
          }
  
          return formatFunctions[format](m);
      }
  
  
      /************************************
          Parsing
      ************************************/
  
  
      // get the regex to find the next token
      function getParseRegexForToken(token) {
          switch (token) {
          case 'DDDD':
              return parseTokenThreeDigits;
          case 'YYYY':
              return parseTokenFourDigits;
          case 'YYYYY':
              return parseTokenSixDigits;
          case 'S':
          case 'SS':
          case 'SSS':
          case 'DDD':
              return parseTokenOneToThreeDigits;
          case 'MMM':
          case 'MMMM':
          case 'dd':
          case 'ddd':
          case 'dddd':
          case 'a':
          case 'A':
              return parseTokenWord;
          case 'X':
              return parseTokenTimestampMs;
          case 'Z':
          case 'ZZ':
              return parseTokenTimezone;
          case 'T':
              return parseTokenT;
          case 'MM':
          case 'DD':
          case 'YY':
          case 'HH':
          case 'hh':
          case 'mm':
          case 'ss':
          case 'M':
          case 'D':
          case 'd':
          case 'H':
          case 'h':
          case 'm':
          case 's':
              return parseTokenOneOrTwoDigits;
          default :
              return new RegExp(token.replace('\\', ''));
          }
      }
  
      // function to convert string input to date
      function addTimeToArrayFromToken(token, input, config) {
          var a, b,
              datePartArray = config._a;
  
          switch (token) {
          // MONTH
          case 'M' : // fall through to MM
          case 'MM' :
              datePartArray[1] = (input == null) ? 0 : ~~input - 1;
              break;
          case 'MMM' : // fall through to MMMM
          case 'MMMM' :
              a = getLangDefinition(config._l).monthsParse(input);
              // if we didn't find a month name, mark the date as invalid.
              if (a != null) {
                  datePartArray[1] = a;
              } else {
                  config._isValid = false;
              }
              break;
          // DAY OF MONTH
          case 'D' : // fall through to DDDD
          case 'DD' : // fall through to DDDD
          case 'DDD' : // fall through to DDDD
          case 'DDDD' :
              if (input != null) {
                  datePartArray[2] = ~~input;
              }
              break;
          // YEAR
          case 'YY' :
              datePartArray[0] = ~~input + (~~input > 68 ? 1900 : 2000);
              break;
          case 'YYYY' :
          case 'YYYYY' :
              datePartArray[0] = ~~input;
              break;
          // AM / PM
          case 'a' : // fall through to A
          case 'A' :
              config._isPm = ((input + '').toLowerCase() === 'pm');
              break;
          // 24 HOUR
          case 'H' : // fall through to hh
          case 'HH' : // fall through to hh
          case 'h' : // fall through to hh
          case 'hh' :
              datePartArray[3] = ~~input;
              break;
          // MINUTE
          case 'm' : // fall through to mm
          case 'mm' :
              datePartArray[4] = ~~input;
              break;
          // SECOND
          case 's' : // fall through to ss
          case 'ss' :
              datePartArray[5] = ~~input;
              break;
          // MILLISECOND
          case 'S' :
          case 'SS' :
          case 'SSS' :
              datePartArray[6] = ~~ (('0.' + input) * 1000);
              break;
          // UNIX TIMESTAMP WITH MS
          case 'X':
              config._d = new Date(parseFloat(input) * 1000);
              break;
          // TIMEZONE
          case 'Z' : // fall through to ZZ
          case 'ZZ' :
              config._useUTC = true;
              a = (input + '').match(parseTimezoneChunker);
              if (a && a[1]) {
                  config._tzh = ~~a[1];
              }
              if (a && a[2]) {
                  config._tzm = ~~a[2];
              }
              // reverse offsets
              if (a && a[0] === '+') {
                  config._tzh = -config._tzh;
                  config._tzm = -config._tzm;
              }
              break;
          }
  
          // if the input is null, the date is not valid
          if (input == null) {
              config._isValid = false;
          }
      }
  
      // convert an array to a date.
      // the array should mirror the parameters below
      // note: all values past the year are optional and will default to the lowest possible value.
      // [year, month, day , hour, minute, second, millisecond]
      function dateFromArray(config) {
          var i, date, input = [];
  
          if (config._d) {
              return;
          }
  
          for (i = 0; i < 7; i++) {
              config._a[i] = input[i] = (config._a[i] == null) ? (i === 2 ? 1 : 0) : config._a[i];
          }
  
          // add the offsets to the time to be parsed so that we can have a clean array for checking isValid
          input[3] += config._tzh || 0;
          input[4] += config._tzm || 0;
  
          date = new Date(0);
  
          if (config._useUTC) {
              date.setUTCFullYear(input[0], input[1], input[2]);
              date.setUTCHours(input[3], input[4], input[5], input[6]);
          } else {
              date.setFullYear(input[0], input[1], input[2]);
              date.setHours(input[3], input[4], input[5], input[6]);
          }
  
          config._d = date;
      }
  
      // date from string and format string
      function makeDateFromStringAndFormat(config) {
          // This array is used to make a Date, either with `new Date` or `Date.UTC`
          var tokens = config._f.match(formattingTokens),
              string = config._i,
              i, parsedInput;
  
          config._a = [];
  
          for (i = 0; i < tokens.length; i++) {
              parsedInput = (getParseRegexForToken(tokens[i]).exec(string) || [])[0];
              if (parsedInput) {
                  string = string.slice(string.indexOf(parsedInput) + parsedInput.length);
              }
              // don't parse if its not a known token
              if (formatTokenFunctions[tokens[i]]) {
                  addTimeToArrayFromToken(tokens[i], parsedInput, config);
              }
          }
          // handle am pm
          if (config._isPm && config._a[3] < 12) {
              config._a[3] += 12;
          }
          // if is 12 am, change hours to 0
          if (config._isPm === false && config._a[3] === 12) {
              config._a[3] = 0;
          }
          // return
          dateFromArray(config);
      }
  
      // date from string and array of format strings
      function makeDateFromStringAndArray(config) {
          var tempConfig,
              tempMoment,
              bestMoment,
  
              scoreToBeat = 99,
              i,
              currentDate,
              currentScore;
  
          while (config._f.length) {
              tempConfig = extend({}, config);
              tempConfig._f = config._f.pop();
              makeDateFromStringAndFormat(tempConfig);
              tempMoment = new Moment(tempConfig);
  
              if (tempMoment.isValid()) {
                  bestMoment = tempMoment;
                  break;
              }
  
              currentScore = compareArrays(tempConfig._a, tempMoment.toArray());
  
              if (currentScore < scoreToBeat) {
                  scoreToBeat = currentScore;
                  bestMoment = tempMoment;
              }
          }
  
          extend(config, bestMoment);
      }
  
      // date from iso format
      function makeDateFromString(config) {
          var i,
              string = config._i;
          if (isoRegex.exec(string)) {
              config._f = 'YYYY-MM-DDT';
              for (i = 0; i < 4; i++) {
                  if (isoTimes[i][1].exec(string)) {
                      config._f += isoTimes[i][0];
                      break;
                  }
              }
              if (parseTokenTimezone.exec(string)) {
                  config._f += " Z";
              }
              makeDateFromStringAndFormat(config);
          } else {
              config._d = new Date(string);
          }
      }
  
      function makeDateFromInput(config) {
          var input = config._i,
              matched = aspNetJsonRegex.exec(input);
  
          if (input === undefined) {
              config._d = new Date();
          } else if (matched) {
              config._d = new Date(+matched[1]);
          } else if (typeof input === 'string') {
              makeDateFromString(config);
          } else if (isArray(input)) {
              config._a = input.slice(0);
              dateFromArray(config);
          } else {
              config._d = input instanceof Date ? new Date(+input) : new Date(input);
          }
      }
  
  
      /************************************
          Relative Time
      ************************************/
  
  
      // helper function for moment.fn.from, moment.fn.fromNow, and moment.duration.fn.humanize
      function substituteTimeAgo(string, number, withoutSuffix, isFuture, lang) {
          return lang.relativeTime(number || 1, !!withoutSuffix, string, isFuture);
      }
  
      function relativeTime(milliseconds, withoutSuffix, lang) {
          var seconds = round(Math.abs(milliseconds) / 1000),
              minutes = round(seconds / 60),
              hours = round(minutes / 60),
              days = round(hours / 24),
              years = round(days / 365),
              args = seconds < 45 && ['s', seconds] ||
                  minutes === 1 && ['m'] ||
                  minutes < 45 && ['mm', minutes] ||
                  hours === 1 && ['h'] ||
                  hours < 22 && ['hh', hours] ||
                  days === 1 && ['d'] ||
                  days <= 25 && ['dd', days] ||
                  days <= 45 && ['M'] ||
                  days < 345 && ['MM', round(days / 30)] ||
                  years === 1 && ['y'] || ['yy', years];
          args[2] = withoutSuffix;
          args[3] = milliseconds > 0;
          args[4] = lang;
          return substituteTimeAgo.apply({}, args);
      }
  
  
      /************************************
          Week of Year
      ************************************/
  
  
      // firstDayOfWeek       0 = sun, 6 = sat
      //                      the day of the week that starts the week
      //                      (usually sunday or monday)
      // firstDayOfWeekOfYear 0 = sun, 6 = sat
      //                      the first week is the week that contains the first
      //                      of this day of the week
      //                      (eg. ISO weeks use thursday (4))
      function weekOfYear(mom, firstDayOfWeek, firstDayOfWeekOfYear) {
          var end = firstDayOfWeekOfYear - firstDayOfWeek,
              daysToDayOfWeek = firstDayOfWeekOfYear - mom.day();
  
  
          if (daysToDayOfWeek > end) {
              daysToDayOfWeek -= 7;
          }
  
          if (daysToDayOfWeek < end - 7) {
              daysToDayOfWeek += 7;
          }
  
          return Math.ceil(moment(mom).add('d', daysToDayOfWeek).dayOfYear() / 7);
      }
  
  
      /************************************
          Top Level Functions
      ************************************/
  
      function makeMoment(config) {
          var input = config._i,
              format = config._f;
  
          if (input === null || input === '') {
              return null;
          }
  
          if (typeof input === 'string') {
              config._i = input = getLangDefinition().preparse(input);
          }
  
          if (moment.isMoment(input)) {
              config = extend({}, input);
              config._d = new Date(+input._d);
          } else if (format) {
              if (isArray(format)) {
                  makeDateFromStringAndArray(config);
              } else {
                  makeDateFromStringAndFormat(config);
              }
          } else {
              makeDateFromInput(config);
          }
  
          return new Moment(config);
      }
  
      moment = function (input, format, lang) {
          return makeMoment({
              _i : input,
              _f : format,
              _l : lang,
              _isUTC : false
          });
      };
  
      // creating with utc
      moment.utc = function (input, format, lang) {
          return makeMoment({
              _useUTC : true,
              _isUTC : true,
              _l : lang,
              _i : input,
              _f : format
          });
      };
  
      // creating with unix timestamp (in seconds)
      moment.unix = function (input) {
          return moment(input * 1000);
      };
  
      // duration
      moment.duration = function (input, key) {
          var isDuration = moment.isDuration(input),
              isNumber = (typeof input === 'number'),
              duration = (isDuration ? input._data : (isNumber ? {} : input)),
              ret;
  
          if (isNumber) {
              if (key) {
                  duration[key] = input;
              } else {
                  duration.milliseconds = input;
              }
          }
  
          ret = new Duration(duration);
  
          if (isDuration && input.hasOwnProperty('_lang')) {
              ret._lang = input._lang;
          }
  
          return ret;
      };
  
      // version number
      moment.version = VERSION;
  
      // default format
      moment.defaultFormat = isoFormat;
  
      // This function will load languages and then set the global language.  If
      // no arguments are passed in, it will simply return the current global
      // language key.
      moment.lang = function (key, values) {
          var i;
  
          if (!key) {
              return moment.fn._lang._abbr;
          }
          if (values) {
              loadLang(key, values);
          } else if (!languages[key]) {
              getLangDefinition(key);
          }
          moment.duration.fn._lang = moment.fn._lang = getLangDefinition(key);
      };
  
      // returns language data
      moment.langData = function (key) {
          if (key && key._lang && key._lang._abbr) {
              key = key._lang._abbr;
          }
          return getLangDefinition(key);
      };
  
      // compare moment object
      moment.isMoment = function (obj) {
          return obj instanceof Moment;
      };
  
      // for typechecking Duration objects
      moment.isDuration = function (obj) {
          return obj instanceof Duration;
      };
  
  
      /************************************
          Moment Prototype
      ************************************/
  
  
      moment.fn = Moment.prototype = {
  
          clone : function () {
              return moment(this);
          },
  
          valueOf : function () {
              return +this._d;
          },
  
          unix : function () {
              return Math.floor(+this._d / 1000);
          },
  
          toString : function () {
              return this.format("ddd MMM DD YYYY HH:mm:ss [GMT]ZZ");
          },
  
          toDate : function () {
              return this._d;
          },
  
          toJSON : function () {
              return moment.utc(this).format('YYYY-MM-DD[T]HH:mm:ss.SSS[Z]');
          },
  
          toArray : function () {
              var m = this;
              return [
                  m.year(),
                  m.month(),
                  m.date(),
                  m.hours(),
                  m.minutes(),
                  m.seconds(),
                  m.milliseconds()
              ];
          },
  
          isValid : function () {
              if (this._isValid == null) {
                  if (this._a) {
                      this._isValid = !compareArrays(this._a, (this._isUTC ? moment.utc(this._a) : moment(this._a)).toArray());
                  } else {
                      this._isValid = !isNaN(this._d.getTime());
                  }
              }
              return !!this._isValid;
          },
  
          utc : function () {
              this._isUTC = true;
              return this;
          },
  
          local : function () {
              this._isUTC = false;
              return this;
          },
  
          format : function (inputString) {
              var output = formatMoment(this, inputString || moment.defaultFormat);
              return this.lang().postformat(output);
          },
  
          add : function (input, val) {
              var dur;
              // switch args to support add('s', 1) and add(1, 's')
              if (typeof input === 'string') {
                  dur = moment.duration(+val, input);
              } else {
                  dur = moment.duration(input, val);
              }
              addOrSubtractDurationFromMoment(this, dur, 1);
              return this;
          },
  
          subtract : function (input, val) {
              var dur;
              // switch args to support subtract('s', 1) and subtract(1, 's')
              if (typeof input === 'string') {
                  dur = moment.duration(+val, input);
              } else {
                  dur = moment.duration(input, val);
              }
              addOrSubtractDurationFromMoment(this, dur, -1);
              return this;
          },
  
          diff : function (input, units, asFloat) {
              var that = this._isUTC ? moment(input).utc() : moment(input).local(),
                  zoneDiff = (this.zone() - that.zone()) * 6e4,
                  diff, output;
  
              if (units) {
                  // standardize on singular form
                  units = units.replace(/s$/, '');
              }
  
              if (units === 'year' || units === 'month') {
                  diff = (this.daysInMonth() + that.daysInMonth()) * 432e5; // 24 * 60 * 60 * 1000 / 2
                  output = ((this.year() - that.year()) * 12) + (this.month() - that.month());
                  output += ((this - moment(this).startOf('month')) - (that - moment(that).startOf('month'))) / diff;
                  if (units === 'year') {
                      output = output / 12;
                  }
              } else {
                  diff = (this - that) - zoneDiff;
                  output = units === 'second' ? diff / 1e3 : // 1000
                      units === 'minute' ? diff / 6e4 : // 1000 * 60
                      units === 'hour' ? diff / 36e5 : // 1000 * 60 * 60
                      units === 'day' ? diff / 864e5 : // 1000 * 60 * 60 * 24
                      units === 'week' ? diff / 6048e5 : // 1000 * 60 * 60 * 24 * 7
                      diff;
              }
              return asFloat ? output : absRound(output);
          },
  
          from : function (time, withoutSuffix) {
              return moment.duration(this.diff(time)).lang(this.lang()._abbr).humanize(!withoutSuffix);
          },
  
          fromNow : function (withoutSuffix) {
              return this.from(moment(), withoutSuffix);
          },
  
          calendar : function () {
              var diff = this.diff(moment().startOf('day'), 'days', true),
                  format = diff < -6 ? 'sameElse' :
                  diff < -1 ? 'lastWeek' :
                  diff < 0 ? 'lastDay' :
                  diff < 1 ? 'sameDay' :
                  diff < 2 ? 'nextDay' :
                  diff < 7 ? 'nextWeek' : 'sameElse';
              return this.format(this.lang().calendar(format, this));
          },
  
          isLeapYear : function () {
              var year = this.year();
              return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
          },
  
          isDST : function () {
              return (this.zone() < moment([this.year()]).zone() ||
                  this.zone() < moment([this.year(), 5]).zone());
          },
  
          day : function (input) {
              var day = this._isUTC ? this._d.getUTCDay() : this._d.getDay();
              return input == null ? day :
                  this.add({ d : input - day });
          },
  
          startOf: function (units) {
              units = units.replace(/s$/, '');
              // the following switch intentionally omits break keywords
              // to utilize falling through the cases.
              switch (units) {
              case 'year':
                  this.month(0);
                  /* falls through */
              case 'month':
                  this.date(1);
                  /* falls through */
              case 'week':
              case 'day':
                  this.hours(0);
                  /* falls through */
              case 'hour':
                  this.minutes(0);
                  /* falls through */
              case 'minute':
                  this.seconds(0);
                  /* falls through */
              case 'second':
                  this.milliseconds(0);
                  /* falls through */
              }
  
              // weeks are a special case
              if (units === 'week') {
                  this.day(0);
              }
  
              return this;
          },
  
          endOf: function (units) {
              return this.startOf(units).add(units.replace(/s?$/, 's'), 1).subtract('ms', 1);
          },
  
          isAfter: function (input, units) {
              units = typeof units !== 'undefined' ? units : 'millisecond';
              return +this.clone().startOf(units) > +moment(input).startOf(units);
          },
  
          isBefore: function (input, units) {
              units = typeof units !== 'undefined' ? units : 'millisecond';
              return +this.clone().startOf(units) < +moment(input).startOf(units);
          },
  
          isSame: function (input, units) {
              units = typeof units !== 'undefined' ? units : 'millisecond';
              return +this.clone().startOf(units) === +moment(input).startOf(units);
          },
  
          zone : function () {
              return this._isUTC ? 0 : this._d.getTimezoneOffset();
          },
  
          daysInMonth : function () {
              return moment.utc([this.year(), this.month() + 1, 0]).date();
          },
  
          dayOfYear : function (input) {
              var dayOfYear = round((moment(this).startOf('day') - moment(this).startOf('year')) / 864e5) + 1;
              return input == null ? dayOfYear : this.add("d", (input - dayOfYear));
          },
  
          isoWeek : function (input) {
              var week = weekOfYear(this, 1, 4);
              return input == null ? week : this.add("d", (input - week) * 7);
          },
  
          week : function (input) {
              var week = this.lang().week(this);
              return input == null ? week : this.add("d", (input - week) * 7);
          },
  
          // If passed a language key, it will set the language for this
          // instance.  Otherwise, it will return the language configuration
          // variables for this instance.
          lang : function (key) {
              if (key === undefined) {
                  return this._lang;
              } else {
                  this._lang = getLangDefinition(key);
                  return this;
              }
          }
      };
  
      // helper for adding shortcuts
      function makeGetterAndSetter(name, key) {
          moment.fn[name] = moment.fn[name + 's'] = function (input) {
              var utc = this._isUTC ? 'UTC' : '';
              if (input != null) {
                  this._d['set' + utc + key](input);
                  return this;
              } else {
                  return this._d['get' + utc + key]();
              }
          };
      }
  
      // loop through and add shortcuts (Month, Date, Hours, Minutes, Seconds, Milliseconds)
      for (i = 0; i < proxyGettersAndSetters.length; i ++) {
          makeGetterAndSetter(proxyGettersAndSetters[i].toLowerCase().replace(/s$/, ''), proxyGettersAndSetters[i]);
      }
  
      // add shortcut for year (uses different syntax than the getter/setter 'year' == 'FullYear')
      makeGetterAndSetter('year', 'FullYear');
  
      // add plural methods
      moment.fn.days = moment.fn.day;
      moment.fn.weeks = moment.fn.week;
      moment.fn.isoWeeks = moment.fn.isoWeek;
  
      /************************************
          Duration Prototype
      ************************************/
  
  
      moment.duration.fn = Duration.prototype = {
          weeks : function () {
              return absRound(this.days() / 7);
          },
  
          valueOf : function () {
              return this._milliseconds +
                this._days * 864e5 +
                this._months * 2592e6;
          },
  
          humanize : function (withSuffix) {
              var difference = +this,
                  output = relativeTime(difference, !withSuffix, this.lang());
  
              if (withSuffix) {
                  output = this.lang().pastFuture(difference, output);
              }
  
              return this.lang().postformat(output);
          },
  
          lang : moment.fn.lang
      };
  
      function makeDurationGetter(name) {
          moment.duration.fn[name] = function () {
              return this._data[name];
          };
      }
  
      function makeDurationAsGetter(name, factor) {
          moment.duration.fn['as' + name] = function () {
              return +this / factor;
          };
      }
  
      for (i in unitMillisecondFactors) {
          if (unitMillisecondFactors.hasOwnProperty(i)) {
              makeDurationAsGetter(i, unitMillisecondFactors[i]);
              makeDurationGetter(i.toLowerCase());
          }
      }
  
      makeDurationAsGetter('Weeks', 6048e5);
  
  
      /************************************
          Default Lang
      ************************************/
  
  
      // Set default language, other languages will inherit from English.
      moment.lang('en', {
          ordinal : function (number) {
              var b = number % 10,
                  output = (~~ (number % 100 / 10) === 1) ? 'th' :
                  (b === 1) ? 'st' :
                  (b === 2) ? 'nd' :
                  (b === 3) ? 'rd' : 'th';
              return number + output;
          }
      });
  
  
      /************************************
          Exposing Moment
      ************************************/
  
  
      // CommonJS module is defined
      if (hasModule) {
          module.exports = moment;
      }
      /*global ender:false */
      if (typeof ender === 'undefined') {
          // here, `this` means `window` in the browser, or `global` on the server
          // add `moment` as a global object via a string identifier,
          // for Closure Compiler "advanced" mode
          this['moment'] = moment;
      }
      /*global define:false */
      if (typeof define === "function" && define.amd) {
          define("moment", [], function () {
              return moment;
          });
      }
  }).call(this);
  

  provide("moment", module.exports);

  $.ender({ moment: require('moment') })
  

}());

(function () {

  var module = { exports: {} }, exports = module.exports;

  (function(context) {
  	var slice = Array.prototype.slice;
  	
  	function Deferred(general_error_handler) {
  		this.success_callbacks = [];
  		this.fail_callbacks = [];
  		this.fired = false;
  		this.results = null;
  		this.firing = false;
  		this.cancelled = false;
  		
  		this.resolve = this.resolve.bind(this);
  		this.reject = this.reject.bind(this);
  	}
  	Deferred.prototype = {
  		resolve: function() {
  			return this._return(this.success_callbacks, 'success', slice.call(arguments, 0));
  		},
  		reject: function() {
  			return this._return(this.fail_callbacks, 'fail', slice.call(arguments, 0));
  		},
  		_return: function(callbacks, state, args) {
  			if(!this.cancelled && !this.fired) {
  				try {
  					while(callbacks.length > 0) {
  						callbacks.shift().apply(this, args);
  					}
  				} finally {
  					this.fired = state;
  					this.results = args;
  				}
  			}
  			return this;
  		},
  		done: function() {
  			return this._addcallback('success_callbacks', 'success', slice.call(arguments, 0));
  		},
  		fail: function() {
  			return this._addcallback('fail_callbacks', 'fail', slice.call(arguments, 0));
  		},
  		then: function(s, f) {
  			if(!this.cancelled) {
  				this.done(s);
  				this.fail(f);
  			}
  			return this;
  		},
  		_addcallback: function(callbacks, state, args) {
  			if(!this.cancelled) {
  				this[callbacks] = this[callbacks].concat(args); // Add all args to the callbacks array
  				
  				if(this.fired == state) { // If it has already fired this state
  					this.fired = false; // Reset
  					this._return(this[callbacks], state, this.results); // And simulate firing again
  				}
  			}
  			return this;
  		},
  		isResolved: function() {
  			return this.fired == 'success';
  		},
  		isRejected: function() {
  			return this.fired == 'fail';
  		},
  		cancel: function() {
  			this.cancelled = true;
  			this.success_callbacks = [];
  			this.fail_callbacks = [];
  			return this;
  		}
  	}
  	function when(f) {
  		var args = slice.call(arguments, 0);
  		
  		if(args.length < 2 && f.resolve) { // Just one deferred, don't bother making another, just return it
  			return f;
  		}
  		
  		var dfd = new Deferred();
  		if(args.length < 2) { // Just one static item
  			if(Array.isArray(f)) { // If it's an array
  				args = f; // We assume it's an array of promises
  			} else {
  				dfd.resolve(f); // resolve the deferred and send it the static item
  			}
  		}
  		if(args.length > 1 || Array.isArray(f)) { // Multiple items
  			var remain = args.length;
  			for(var i = 0; i < args.length; i++) {
  				var item = args[i];
  				if(item != null && item.resolve) { // If item is a deferred
  					item.then(oneresolved(i), dfd.reject); // Give it a handler
  				} else { // If item is a static result
  					remain--; // Just decrement the remaining items counter
  				}
  			}
  		}
  		
  		function oneresolved(i) {
  			return function(v) {
  				args[i] = arguments.length > 1 ? slice.call(arguments, 0) : v; // Change the completed deferreds into their returned values
  				if((--remain) == 0) { // If it's the last item
  					dfd.resolve.apply(dfd, args); // Then tell the `when` Deferred
  				}
  			}
  		}
  		
  		return dfd;
  	}
  	
  	Deferred.when = when;
  	context.Deferred = function() {
  		return new Deferred();
  	}
  	context.when = when;
  })(this);

  provide("ender-deferred", module.exports);

  $.ender(module.exports);

}());