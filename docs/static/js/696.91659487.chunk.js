"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[696],{74115:function(t,e,r){r.d(e,{O9:function(){return n},bM:function(){return a},mr:function(){return u}});var n=["#000000","#9ca3af","#64748b","#78716c","#f97316","#eab308","#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e","#ef4444"],u=function(){var t=Math.floor(Math.random()*n.length);return n[t]},a=function(t){var e=function(t){var e=0;if(0===t.length)return e;for(var r=0;r<t.length;r++)e=(e<<5)-e+t.charCodeAt(r),e|=0;return Math.abs(e)}(t)%n.length;return n[e]}},82670:function(t,e,r){r.d(e,{Dw:function(){return m},F:function(){return d},mF:function(){return f}});var n=r(1413),u=r(29439),a=r(15671),s=r(43144),c=r(24124),o=r(24610),i=r(25641),p=r.n(i),f=2e3,l={strokes:(0,c.zN)(),undoStack:(0,c.aV)(),historyStack:(0,c.aV)()},h=(0,c.WV)(l),d=function(){return{strokes:{}}},m=function(){function t(e,r,n,u){(0,a.Z)(this,t),this.immutable=e,this.width=r,this.height=n,this.lastOp=u}return(0,s.Z)(t,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"getHistoryStack",value:function(){return this.getImmutable().get("historyStack")}},{key:"getStrokeMap",value:function(){return this.getImmutable().get("strokes")}},{key:"getStrokeList",value:function(){return this.getStrokeMap().toArray().map((function(t){var e=(0,u.Z)(t,2);e[0];return e[1]}))}},{key:"getLastStroke",value:function(){return this.getStrokeMap().last()}},{key:"isEmpty",value:function(){return 0===this.getStrokeMap().size}},{key:"hasStroke",value:function(t){return this.getStrokeMap().has(t)}}],[{key:"createEmpty",value:function(e,r){return new t(h(),e,r)}},{key:"undo",value:function(e){var r=e.getHistoryStack().last();if(!r)return e;var n=e.getUndoStack().unshift(e.getImmutable());return new t(r.set("undoStack",n),e.width,e.height,{type:"undo"})}},{key:"redo",value:function(e){var r=e.getUndoStack().first();return r?new t(r,e.width,e.height,{type:"redo"}):e}},{key:"addStroke",value:function(e,r){var n={pathData:r,uid:(0,o.v4)(),timestamp:Date.now()};return t.pushStroke(e,n)}},{key:"pushStroke",value:function(e,r){var n=r.uid,u=e.getImmutable(),a=u.update("strokes",(function(t){return t.set(n,r)})).update("historyStack",(function(t){return t.push(u)})).delete("undoStack"),s={type:"add",stroke:r};return new t(a,e.width,e.height,s)}},{key:"eraseStrokes",value:function(e,r){if(0===r.length)return e;var n=e.getImmutable(),u=n.update("strokes",(function(t){return t.deleteAll(r)})).update("historyStack",(function(t){return t.push(n)})).delete("undoStack"),a={type:"erase",erased:r};return new t(u,e.width,e.height,a)}},{key:"mutateStrokes",value:function(e,r){if(0===r.length)return e;var a=e.getImmutable(),s=e.getStrokeMap();r.forEach((function(t){var e=(0,u.Z)(t,2),r=e[0],a=e[1];return s=s.update(r,{uid:r,pathData:a,timestamp:Date.now()},(function(t){return(0,n.Z)((0,n.Z)({},t),{},{pathData:a})}))}));var c={type:"mutate",mutations:r};return new t(a.set("strokes",s).update("historyStack",(function(t){return t.push(a)})).delete("undoStack"),e.width,e.height,c)}},{key:"syncStrokeTime",value:function(t,e){var r=e.uid,n=e.timestamp,u=t.getStrokeMap().get(r);u&&(u.timestamp=n)}},{key:"pushOperation",value:function(e,r){switch(r.type){case"add":return t.pushStroke(e,r.stroke);case"erase":return t.eraseStrokes(e,r.erased);case"mutate":return t.mutateStrokes(e,r.mutations);case"undo":return t.undo(e);case"redo":return t.redo(e)}}},{key:"flaten",value:function(t){return{strokes:t.getImmutable().get("strokes").toObject()}}},{key:"loadFromFlat",value:function(e,r,n){var u=e.strokes,a=e.operations,s=new t(h().set("strokes",(0,c.zN)(u)),r,n);return null===a||void 0===a||a.forEach((function(e){return s=t.pushOperation(s,e)})),s}},{key:"mergeStates",value:function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];var n=e.map((function(t){return t.getStrokeMap().values()})),a=[],s=new(p())((function(t,e){var r=(0,u.Z)(t,1)[0],n=(0,u.Z)(e,1)[0];return r.timestamp-n.timestamp}));for(n.forEach((function(t,e){var r=t.next(),n=r.value;r.done||s.push([n,e])}));s.size()>0;){var c=s.pop();if(!c)break;var o=(0,u.Z)(c,2),i=o[0],f=o[1];a.push(i);var l=n[f].next(),h=l.value,d=l.done;d||s.push([h,f])}return a}}]),t}()},51570:function(t,e,r){r.d(e,{CD:function(){return S},_n:function(){return h},dn:function(){return g},f1:function(){return w},fI:function(){return d},r8:function(){return x}});var n=r(45987),u=r(15861),a=r(87757),s=r.n(a),c=r(74569),o=r.n(c),i=r(92198),p=r(75783),f=r(69951),l=["statusCode"],h="https://api.slotdumpling.top/paint";function d(t){return m.apply(this,arguments)}function m(){return(m=(0,u.Z)(s().mark((function t(e){var r,n;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o().get("code/".concat(e));case 3:if(r=t.sent,n=r.data,console.log({data:n}),200===n.statusCode){t.next=8;break}return t.abrupt("return",null);case 8:return t.abrupt("return",n.noteID);case 11:return t.prev=11,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",null);case 15:case"end":return t.stop()}}),t,null,[[0,11]])})))).apply(this,arguments)}function k(t){return v.apply(this,arguments)}function v(){return(v=(0,u.Z)(s().mark((function t(e){var r,u,a,c,i;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o().get("info/".concat(e));case 3:if(r=t.sent,u=r.data,c=(a=u).statusCode,i=(0,n.Z)(a,l),200===c){t.next=8;break}return t.abrupt("return",null);case 8:return t.abrupt("return",i);case 11:return t.prev=11,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",null);case 15:case"end":return t.stop()}}),t,null,[[0,11]])})))).apply(this,arguments)}function g(t){return b.apply(this,arguments)}function b(){return(b=(0,u.Z)(s().mark((function t(e){var r,n,u,a,c,i;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,k(e);case 3:if(r=t.sent){t.next=6;break}return t.abrupt("return",null);case 6:return n=r.noteInfo,u=r.pageInfos,t.next=9,(0,p.Rb)(e,n,u);case 9:if(!t.sent){t.next=11;break}return t.abrupt("return",r);case 11:if(a=void 0,!n.withImg){t.next=18;break}return t.next=15,o()({method:"GET",url:e,responseType:"blob"});case 15:c=t.sent,i=c.data,a=new Blob([i],{type:"application/pdf"});case 18:return t.next=20,(0,p.Vk)(e,n,u,a);case 20:return t.abrupt("return",r);case 23:return t.prev=23,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",null);case 27:case"end":return t.stop()}}),t,null,[[0,23]])})))).apply(this,arguments)}function x(t){return y.apply(this,arguments)}function y(){return(y=(0,u.Z)(s().mark((function t(e){var r,n,u,a,c,l,h,d,m,k,v,g;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,p.U9)(e);case 2:if(r=t.sent){t.next=5;break}return t.abrupt("return",!1);case 5:return n=r.uid,u=r.name,a=r.withImg,c=r.pdf,l=r.pageOrder,h=r.pageRec,(0,i.Yl)(h),t.prev=7,t.next=10,o().put("create/".concat(e),{userID:(0,f.VN)(),pageRec:h,noteInfo:{uid:n,name:u,withImg:a,pageOrder:l}});case 10:if(d=t.sent,m=d.data,!c){t.next=21;break}return k=new FormData,t.next=16,c.arrayBuffer();case 16:return v=t.sent,g=new Blob([v]),k.append("file",g,e),t.next=21,o()({method:"POST",url:"upload",data:k,headers:{"Content-Type":"multipart/form-data"}});case 21:if(201===m.statusCode){t.next=23;break}return t.abrupt("return",!1);case 23:return t.abrupt("return",!0);case 26:return t.prev=26,t.t0=t.catch(7),console.error(t.t0),t.abrupt("return",!1);case 30:case"end":return t.stop()}}),t,null,[[7,26]])})))).apply(this,arguments)}function w(t){return I.apply(this,arguments)}function I(){return(I=(0,u.Z)(s().mark((function t(e){var r,n,u,a,c,l,h;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,p.U9)(e);case 2:if(r=t.sent){t.next=5;break}return t.abrupt("return",null);case 5:return n=r.uid,u=r.name,a=r.withImg,c=r.pageOrder,l=r.pageRec,(0,i.Yl)(l),t.prev=7,t.next=10,o().put("update/".concat(e),{userID:(0,f.VN)(),pageRec:l,noteInfo:{uid:n,name:u,withImg:a,pageOrder:c}});case 10:if(h=t.sent,201!==h.data.statusCode){t.next=16;break}return t.abrupt("return",!0);case 16:return t.abrupt("return",!1);case 17:t.next=23;break;case 19:return t.prev=19,t.t0=t.catch(7),console.error(t.t0),t.abrupt("return",!1);case 23:case"end":return t.stop()}}),t,null,[[7,19]])})))).apply(this,arguments)}function S(t){return Z.apply(this,arguments)}function Z(){return(Z=(0,u.Z)(s().mark((function t(e){var r,n,u;return s().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,o().get("state/".concat(e),{params:{userID:(0,f.VN)()}});case 3:if(r=t.sent,200===(n=r.data).statusCode){t.next=7;break}return t.abrupt("return",null);case 7:return u=n.teamPages,t.abrupt("return",u);case 11:return t.prev=11,t.t0=t.catch(0),console.error(t.t0),t.abrupt("return",null);case 15:case"end":return t.stop()}}),t,null,[[0,11]])})))).apply(this,arguments)}o().defaults.baseURL=h,o().interceptors.request.use((function(t){return console.log(t.method,t.url),t}))},75783:function(t,e,r){r.d(e,{HO:function(){return Z},Pn:function(){return A},Rb:function(){return B},SP:function(){return N},U9:function(){return E},Vk:function(){return Y},Ys:function(){return I},au:function(){return U},f_:function(){return P},hY:function(){return y},tk:function(){return D},tw:function(){return V}});var n=r(29439),u=r(45987),a=r(49142),s=r(4942),c=r(1413),o=r(15861),i=r(87757),p=r.n(i),f=r(82670),l=r(61842),h=r.n(l),d=r(24610),m=r(56993),k=r(72426),v=r.n(k),g=["pageRec","pageOrder"],b=["pdf"],x=["pageRec","pageOrder"];function y(){return w.apply(this,arguments)}function w(){return(w=(0,o.Z)(p().mark((function t(){var e;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h().getItem("ALL_NOTES");case 2:if(!(e=t.sent)){t.next=7;break}return t.abrupt("return",e);case 7:return h().setItem("ALL_NOTES",{}),t.abrupt("return",{});case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function I(){return S.apply(this,arguments)}function S(){return(S=(0,o.Z)(p().mark((function t(){var e;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h().getItem("ALL_TAGS");case 2:if(!(e=t.sent)){t.next=7;break}return t.abrupt("return",e);case 7:return h().setItem("ALL_TAGS",{}),t.abrupt("return",{});case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Z(t,e){return L.apply(this,arguments)}function L(){return(L=(0,o.Z)(p().mark((function t(e,r){var n,u,a,o;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=(0,d.v4)(),u={uid:n,name:e,color:r,notes:[]},t.next=4,I();case 4:return a=t.sent,o=(0,c.Z)((0,c.Z)({},a),{},(0,s.Z)({},n,u)),t.next=8,h().setItem("ALL_TAGS",o);case 8:return t.abrupt("return",o);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function A(t){return O.apply(this,arguments)}function O(){return(O=(0,o.Z)(p().mark((function t(e){var r,n;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,I();case 2:return r=t.sent,r[e],n=(0,u.Z)(r,[e].map(a.Z)),t.next=6,h().setItem("ALL_TAGS",n);case 6:return t.abrupt("return",n);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function D(t){return T.apply(this,arguments)}function T(){return(T=(0,o.Z)(p().mark((function t(e){var r,n;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,I();case 2:return r=t.sent,n=(0,c.Z)((0,c.Z)({},r),{},(0,s.Z)({},e.uid,e)),t.next=6,h().setItem("ALL_TAGS",n);case 6:return t.abrupt("return",n);case 7:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function E(t){return _.apply(this,arguments)}function _(){return(_=(0,o.Z)(p().mark((function t(e){var r,n;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,h().getItem(e);case 2:if(r=t.sent){t.next=5;break}return t.abrupt("return");case 5:return t.next=7,h().getItem("PDF_".concat(e));case 7:return n=t.sent,t.abrupt("return",(0,c.Z)((0,c.Z)({},r),{},{pdf:n}));case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function N(t,e){return R.apply(this,arguments)}function R(){return(R=(0,o.Z)(p().mark((function t(e,r){var n,a,s,o;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return"pageRec"in(r=(0,m.Z)(r,(function(t){return void 0!==t})))&&(r.lastTime=v().now()),console.dir(r),t.next=5,y();case 5:return n=t.sent,(a=r).pageRec,a.pageOrder,s=(0,u.Z)(a,g),n[e]=(0,c.Z)((0,c.Z)({},n[e]),s),t.next=10,h().setItem("ALL_NOTES",n);case 10:return t.next=12,E(e);case 12:if(o=t.sent){t.next=15;break}return t.abrupt("return");case 15:return t.next=17,h().setItem(e,(0,c.Z)((0,c.Z)({},o),r));case 17:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function M(t){return F.apply(this,arguments)}function F(){return(F=(0,o.Z)(p().mark((function t(e){var r,n,u,a;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.uid,n=e.tagID,t.next=3,y();case 3:return(u=t.sent)[r]=e,t.next=7,h().setItem("ALL_NOTES",u);case 7:return t.next=9,I();case 9:if(a=t.sent,!(n in a)){t.next=14;break}return a[n].notes.push(e.uid),t.next=14,h().setItem("ALL_TAGS",a);case 14:return t.abrupt("return",{tags:a,allNotes:u});case 15:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function U(t){return C.apply(this,arguments)}function C(){return(C=(0,o.Z)(p().mark((function t(e){var r,n,a;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=e.pdf,n=(0,u.Z)(e,b),t.next=3,h().setItem(n.uid,n);case 3:if(!r){t.next=6;break}return t.next=6,h().setItem("PDF_".concat(n.uid),r);case 6:return n.pageRec,n.pageOrder,a=(0,u.Z)(n,x),t.next=9,M(a);case 9:return t.abrupt("return",t.sent);case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function P(t){return G.apply(this,arguments)}function G(){return(G=(0,o.Z)(p().mark((function t(e){var r,n,u,a,s;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E(e);case 2:return r=t.sent,t.next=5,y();case 5:return n=t.sent,t.next=8,I();case 8:if(u=t.sent,r){t.next=11;break}return t.abrupt("return",{tags:u,allNotes:n});case 11:return t.next=13,h().removeItem(e);case 13:return t.next=15,h().removeItem("PDF_".concat(e));case 15:return delete n[e],t.next=18,h().setItem("ALL_NOTES",n);case 18:if(!((a=r.tagID)in u)){t.next=24;break}return(s=u[a]).notes=s.notes.filter((function(t){return t!==e})),t.next=24,h().setItem("ALL_TAGS",u);case 24:return t.abrupt("return",{tags:u,allNotes:n});case 25:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function V(t,e){return j.apply(this,arguments)}function j(){return(j=(0,o.Z)(p().mark((function t(e,r){var n,u,a,s,c,o;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E(e);case 2:return u=t.sent,t.next=5,y();case 5:return a=t.sent,t.next=8,I();case 8:if(s=t.sent,u){t.next=11;break}return t.abrupt("return",{tags:s,allNotes:a});case 11:return c=u.tagID,u.tagID=r,t.next=15,h().setItem(e,u);case 15:return a[e].tagID=r,t.next=18,h().setItem("ALL_NOTES",a);case 18:return c in s&&((o=s[c]).notes=o.notes.filter((function(t){return t!==e}))),null===(n=s[r])||void 0===n||n.notes.push(e),t.next=22,h().setItem("ALL_TAGS",s);case 22:return t.abrupt("return",{tags:s,allNotes:a});case 23:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function Y(t,e,r,n){return z.apply(this,arguments)}function z(){return(z=(0,o.Z)(p().mark((function t(e,u,a,s){var o,i,l,h,d,m,k;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E(e);case 2:if(!(o=t.sent)){t.next=5;break}return t.abrupt("return");case 5:if(i=v().now(),l={},o=(0,c.Z)((0,c.Z)({},u),{},{tagID:"DEFAULT",team:!0,pageRec:l,pdf:s,createTime:i,lastTime:i}),Object.entries(a).forEach((function(t){var e=(0,n.Z)(t,2),r=e[0],u=e[1];l[r]=(0,c.Z)((0,c.Z)({},u),{},{state:(0,f.F)()})})),!s){t.next=20;break}return t.next=12,Promise.all([r.e(643),r.e(701)]).then(r.bind(r,21176));case 12:return h=t.sent,d=h.getPDFImages,t.next=16,d(s);case 16:m=t.sent,k=m.images,Object.values(l).forEach((function(t){var e=t.pdfIndex;e&&(t.image=k[e-1])})),o.thumbnail=k[0];case 20:return t.next=22,U(o);case 22:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function B(t,e,r){return H.apply(this,arguments)}function H(){return(H=(0,o.Z)(p().mark((function t(e,u,a){var s,o,i,l,h,d,m,k,v,g,b,x,y;return p().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,E(e);case 2:if(s=t.sent){t.next=5;break}return t.abrupt("return",!1);case 5:if(!((o=u.pageOrder).length<s.pageOrder.length)){t.next=8;break}return t.abrupt("return",!0);case 8:return i=s.pageRec,l=s.pdf,t.next=11,Promise.all([r.e(643),r.e(701)]).then(r.bind(r,21176));case 11:h=t.sent,d=h.getOneImage,m=0,k=Object.entries(a);case 14:if(!(m<k.length)){t.next=29;break}if(v=(0,n.Z)(k[m],2),g=v[0],b=v[1],!(g in i)){t.next=18;break}return t.abrupt("continue",26);case 18:if(x=b.pdfIndex,y=(0,f.F)(),i[g]=(0,c.Z)((0,c.Z)({},b),{},{state:y}),l&&x){t.next=23;break}return t.abrupt("continue",26);case 23:return t.next=25,d(l,x,.5);case 25:i[g].image=t.sent;case 26:m++,t.next=14;break;case 29:return t.next=31,N(e,{pageOrder:o,pageRec:i});case 31:return t.abrupt("return",!0);case 32:case"end":return t.stop()}}),t)})))).apply(this,arguments)}},92198:function(t,e,r){r.d(e,{BJ:function(){return o},D4:function(){return p},Xn:function(){return i},Yl:function(){return f}});var n=r(4942),u=r(82670),a=r(24610),s=r(72426),c=r.n(s),o={ratio:1.5,state:{strokes:{}}};function i(){var t=(0,a.v4)(),e=c().now();return{uid:(0,a.v4)(),name:"Note ".concat(c()(e).format("LT, ddd MMM D")),tagID:"DEFAULT",team:!1,withImg:!1,createTime:e,lastTime:e,pageRec:(0,n.Z)({},t,{ratio:1.5,state:(0,u.F)()}),pageOrder:[t]}}function p(t){return[(0,a.v4)(),null!==t&&void 0!==t?t:{ratio:1.5,state:(0,u.F)()}]}function f(t){Object.values(t).forEach((function(t){delete t.image,delete t.marked}))}},69951:function(t,e,r){r.d(e,{VN:function(){return u},lu:function(){return s},vW:function(){return a}});var n=r(24610),u=function(){var t;return function(){if(t)return t;var e=localStorage.getItem("USER_ID");return e||(e=(0,n.v4)(),localStorage.setItem("USER_ID",e)),t=e,e}}(),a=function(){var t=localStorage.getItem("USER_NAME");return t||(t=(0,n.v4)().slice(0,8),localStorage.setItem("USER_NAME",t)),t},s=function(t){return!!(t=t.trim())&&(localStorage.setItem("USER_NAME",t),!0)}}}]);
//# sourceMappingURL=696.91659487.chunk.js.map