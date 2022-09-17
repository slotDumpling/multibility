"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[378,560],{10814:function(e,n,t){t.r(n),t.d(n,{default:function(){return wn}});var r=t(1413),a=t(45987),i=t(15861),o=t(29439),s=t(87757),u=t.n(s),c=t(72791),l=t(92198),d=t(70587),f=t(81832),p=t(95099),v=t(15671),g=t(43144),x=t(82670),m=t(24124),Z={states:(0,m.D5)(),editStack:(0,m.aV)(),undoStack:(0,m.aV)()},h=(0,m.WV)(Z),j=function(){function e(n,t){(0,v.Z)(this,e),this.immutable=n,this.lastOp=t}return(0,g.Z)(e,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getStates",value:function(){return this.getImmutable().get("states")}},{key:"getOneState",value:function(e){return this.getStates().get(e)}},{key:"getEditStack",value:function(){return this.getImmutable().get("editStack")}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"setState",value:function(n,t){var a=this.getOneState(n);if(!a||a===t)return this;var i=this.getImmutable().update("states",(function(e){return e.set(n,t)})).update("editStack",(function(e){return e.push(n)})).delete("undoStack"),o=t.lastOp;return new e(i,o&&(0,r.Z)((0,r.Z)({},o),{},{pageID:n}))}},{key:"syncStrokeTime",value:function(e,n,t){var r=this.getOneState(e);return r&&x.Dw.syncStrokeTime(r,n,t),this}},{key:"addState",value:function(n,t){var r=t.state,a=t.ratio,i=x.Dw.loadFromFlat(r,a);return new e(this.getImmutable().update("states",(function(e){return e.set(n,i)})))}},{key:"deleteState",value:function(n){return new e(this.getImmutable().update("states",(function(e){return e.delete(n)})))}},{key:"isUndoable",value:function(){return this.getEditStack().size>0}},{key:"isRedoable",value:function(){return this.getUndoStack().size>0}},{key:"undo",value:function(){if(!this.isUndoable())return this;var n=this.getEditStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=x.Dw.undo(t),i=a.lastOp,o=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("editStack",(function(e){return e.pop()})).update("undoStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),o)}},{key:"redo",value:function(){if(!this.isRedoable())return this;var n=this.getUndoStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=x.Dw.redo(t),i=a.lastOp,o=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("undoStack",(function(e){return e.pop()})).update("editStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),o)}}],[{key:"createFromPages",value:function(n){return new e(h().set("states",(0,m.D5)(n).map((function(e){var n=e.state,t=e.ratio;return x.Dw.loadFromFlat(n,t)}))))}}]),e}(),k=t(75783),b=t(49742),S=t(16871),w=t(50060),y=t(37762),I=t(93433),D=t(61842),C=t.n(D),P=t(763),N=C().createInstance({name:"scroll"}),O=(0,P.debounce)((function(e,n){N.setItem(e,n)}),2e3);var E=function(e,n){var t,r="",a=0,i=(0,y.Z)(n);try{for(i.s();!(t=i.n()).done;){var o=t.value,s=e.get(o);if(s){if(1===s)return o;s>a&&(r=o,a=s)}}}catch(u){i.e(u)}finally{i.f()}return r};function R(e,n,t){var r=e.indexOf(n),a=e.slice();return-1===r||a.splice(r+1,0,t),a}var T=t(79286),L=t(23414),z=t(82622),M=t(10711),F=t(36146),V=t(21830),A=t(18780),U=t(2649),B=t(36090),H=t(69228),K=t(87661),W=t(26987),X=t(87309),_=t(37382),G=t(52365),J=t(74115),Y=t(80184),q=function(e){var n=e.userInfo,t=e.size,r=void 0===t?"default":t,a=e.onClick,i=void 0===a?function(){}:a,o=e.chosen,s=void 0!==o&&o,u=e.className,l=(0,c.useMemo)((function(){return(0,J.bM)(n.userID)}),[n]);if(!n)return null;var d=n.userName;return(0,Y.jsx)(U.C,{className:u,"data-chosen":s,size:r,style:{backgroundColor:l},children:(0,Y.jsx)("div",{className:"avatar-wrapper",onClick:i,children:null===d||void 0===d?void 0:d.slice(0,3)})})},Q=t(22568),$=t(81694),ee=t.n($),ne=t(60559),te=t(13892),re=t(79856),ae=function(e){var n=e.addFinalPage;return(0,Y.jsx)(X.Z,{type:"dashed",icon:(0,Y.jsx)(T.Z,{}),block:!0,onClick:n,children:"New page"})},ie=t(89295),oe=["left"],se=["ref"],ue=["cardDragged"],ce=["uid","pageIndex","refRec","cardDragged"],le=["uid","index","chosen","setChosen","page","userIDs"],de=function(e){var n=(0,c.useState)(!1),t=(0,o.Z)(n,2),a=t[0],i=t[1],s=(0,G.LH)(),u=(0,o.Z)(s,1)[0],l=(0,Y.jsx)(A._l,{draggableId:"OPPOSITE",index:a?1:0,isDragDisabled:!0,children:function(e){var n=e.innerRef;return(0,Y.jsx)("div",{className:"opposite",ref:n})}});return(0,Y.jsx)(ie.Z,{in:u,timeout:300,unmountOnExit:!0,children:(0,Y.jsx)(G.s2,{initKey:"ALL",children:(0,Y.jsx)(A.Z5,{onDragEnd:function(e){var n=e.destination;0===(null===n||void 0===n?void 0:n.index)&&i(!0),1===(null===n||void 0===n?void 0:n.index)&&i(!1)},children:(0,Y.jsx)(A.bK,{droppableId:"preview-drop",direction:"horizontal",children:function(n,t){var i=n.droppableProps,o=n.innerRef,s=n.placeholder,u=t.isDraggingOver;return(0,Y.jsxs)("aside",(0,r.Z)((0,r.Z)({className:"preview-drop","data-left":a,ref:o,"data-dragged":u},i),{},{children:[l,(0,Y.jsx)(fe,(0,r.Z)({left:a},e)),s]}))}})})})})},fe=function(e){var n=e.left,t=(0,a.Z)(e,oe),i=(0,G.zI)(),s=(0,o.Z)(i,1)[0],u=(0,G.LH)(),c=(0,o.Z)(u,2)[1],l={ALL:"All Pages",MARKED:"Bookmarks",WRITTEN:"Notes"}[s],d=(0,te.QS)({onSwipedLeft:function(){n&&c(!1)},onSwipedRight:function(){n||c(!1)},swipeDuration:200}),f=d.ref,p=(0,a.Z)(d,se);return(0,Y.jsx)(A._l,{draggableId:"CARD",index:n?0:1,children:function(e,n){var a=e.innerRef,i=e.draggableProps,o=e.dragHandleProps,s=n.isDragging,u=n.isDropAnimating;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({className:"preview-card",ref:function(e){a(e),f(e)},"data-animating":u},i),p),{},{children:[(0,Y.jsx)("div",(0,r.Z)({className:"drag-handle"},o)),(0,Y.jsx)("h3",{children:l}),(0,Y.jsx)(Ze,{}),(0,Y.jsx)(pe,(0,r.Z)({cardDragged:s},t)),(0,Y.jsx)(he,(0,r.Z)({},t))]}))}})},pe=c.memo((function(e){var n=e.cardDragged,t=(0,a.Z)(e,ue),i=(0,c.useRef)({}),s=(0,G.zI)(),u=(0,o.Z)(s,1)[0],l=(0,G.LH)(),d=(0,o.Z)(l,1)[0],f=t.pageOrder,v=t.currPageID,g=t.saveReorder,x=t.addFinalPage,m=(0,p.Z)((function(){var e;null===(e=i.current[v])||void 0===e||e.scrollIntoView()}));return(0,c.useLayoutEffect)((function(){d&&m()}),[d,u,m]),(0,Y.jsx)(A.Z5,{onDragEnd:function(e){var n=e.source,t=e.destination;if(t&&f){var r=n.index,a=t.index,i=f[r];if(r!==a&&i){var s=function(e,n,t){var r=e.slice(),a=r.splice(n,1),i=(0,o.Z)(a,1)[0];return i?(r.splice(t,0,i),r):e}(f,r,a);g(s,!0)}}},children:(0,Y.jsx)(A.bK,{droppableId:"preview-list",isDropDisabled:n,children:function(e){var a=e.droppableProps,o=e.innerRef,s=e.placeholder;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)({className:"page-list",ref:o},a),{},{children:[f.map((function(e,a){return(0,Y.jsx)(ve,(0,r.Z)({uid:e,pageIndex:a,refRec:i.current,cardDragged:n},t),e)})),s,"ALL"===u&&(0,Y.jsx)(ae,{addFinalPage:x})]}))}})})}));pe.displayName="PageList";var ve=function(e){var n=e.uid,t=e.pageIndex,i=e.refRec,s=e.cardDragged,u=(0,a.Z)(e,ce),l=u.stateSet,d=u.pageRec,f=u.currPageID,p=u.scrollPage,v=(0,c.useContext)(ne.TeamCtx),g=v.teamState,x=v.ignores,m=(0,G.zI)(),Z=(0,o.Z)(m,1)[0],h=(0,c.useState)(""),j=(0,o.Z)(h,2),k=j[0],b=j[1],S=d.get(n),y=l.getOneState(n),I=null===g||void 0===g?void 0:g.getOnePageStateMap(n),D=(0,c.useRef)(!1);D.current="MARKED"===Z&&((null===S||void 0===S?void 0:S.marked)||D.current);var C=(0,c.useMemo)((function(){return re.f.getValidUsers(I,x)}),[I,x]);if(!S||!y)return null;if("WRITTEN"===Z&&y.isEmpty()&&re.f.isEmpty(I))return null;if("MARKED"===Z&&!D.current)return null;var P=f===n;return(0,Y.jsx)(A._l,{draggableId:n,index:t,isDragDisabled:"ALL"!==Z||s,children:function(e,a){var o=e.innerRef,c=e.draggableProps,l=e.dragHandleProps,d=a.isDragging,f=a.isDropAnimating;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({ref:function(e){o(e),e&&(i[n]=e)},className:"page","data-curr":P,"data-dragged":d,"data-animating":f,onClick:function(){return p(n)}},c),l),{},{children:[(0,Y.jsx)(w.default,{drawState:(null===I||void 0===I?void 0:I.get(k))||y,teamStateMap:k?void 0:I,thumbnail:S.image,ignores:x,preview:!0,skipInView:d||s}),(0,Y.jsx)(ge,(0,r.Z)({uid:n,index:t,chosen:k,setChosen:b,page:S,userIDs:C},u))]}))}})},ge=c.memo((function(e){var n=e.uid,t=e.index,i=e.chosen,o=e.setChosen,s=e.page,u=e.userIDs,c=(0,a.Z)(e,le),l=c.switchPageMarked;return(0,Y.jsxs)("div",{className:"tools",onClick:function(e){return e.stopPropagation()},children:[(0,Y.jsx)("div",{className:"bookmark","data-marked":s.marked,onClick:function(){return l(n)}}),(0,Y.jsx)("div",{className:"index",children:t+1}),(0,Y.jsx)(me,(0,r.Z)({uid:n},c)),(0,Y.jsx)(xe,{userIDs:u,chosen:i,setChosen:o})]})}));ge.displayName="PreviewTools";var xe=function(e){var n=e.userIDs,t=e.chosen,r=e.setChosen,a=(0,c.useContext)(ne.TeamCtx).userRec;return(0,Y.jsx)(U.C.Group,{maxCount:2,size:"default",className:ee()("team-group",{chosen:t}),maxPopoverPlacement:"bottom",children:n.map((function(e){var n=a[e];return n?(0,Y.jsx)(q,{size:"default",userInfo:n,className:"preview-avatar",chosen:t===e,onClick:function(){return r((function(n){return n===e?"":e}))}},e):null}))})},me=function(e){var n=e.uid,t=e.addPage,r=e.deletePage,a=(0,Y.jsx)(B.Z,{items:[{key:"ADD",icon:(0,Y.jsx)(T.Z,{}),label:"Add page",onClick:function(){return t(n)}},{key:"COPY",icon:(0,Y.jsx)(L.Z,{}),label:"Duplicate",onClick:function(){return t(n,!0)}},{key:"DELETE",icon:(0,Y.jsx)(z.Z,{}),label:"Delete",danger:!0,onClick:function(){return r(n)}}]});return(0,Y.jsx)(H.Z,{content:a,trigger:"click",placement:"left",destroyTooltipOnHide:!0,getPopupContainer:function(e){var n,t;return null===(n=e.parentElement)||void 0===n||null===(t=n.parentElement)||void 0===t?void 0:t.parentElement},children:(0,Y.jsx)("div",{className:"option",children:(0,Y.jsx)(M.Z,{})})})},Ze=c.memo((function(){var e=(0,G.zI)(),n=(0,o.Z)(e,2),t=n[0],r=n[1],a=K.Z.TabPane;return(0,Y.jsxs)(K.Z,{className:"tabs",activeKey:t,onChange:r,tabBarGutter:0,size:"small",centered:!0,children:[(0,Y.jsx)(a,{tab:(0,Y.jsx)(Q.Z,{type:"icon-uf_paper"})},"ALL"),(0,Y.jsx)(a,{tab:(0,Y.jsx)(Q.Z,{type:"icon-bookmark2"})},"MARKED"),(0,Y.jsx)(a,{tab:(0,Y.jsx)(Q.Z,{type:"icon-write"})},"WRITTEN")]})}));Ze.displayName="PreviewTabs";var he=function(e){var n=e.currPageID,t=e.pageOrder,r=e.scrollPage,a=e.size,i=e.setSize,o=(0,c.useMemo)((function(){var e;return(null!==(e=t.indexOf(n))&&void 0!==e?e:0)+1}),[n,t]),s=t&&(0,Y.jsx)(W.Z,{pageSize:1,total:t.length,simple:!0,current:o,onChange:function(e){var n=t[e-1];n&&r(n)}}),u=(0,Y.jsx)(B.Z,{items:(0,P.range)(40,120,20).map((function(e){return{key:e,label:e+"%",className:"size-li",onClick:function(){return i(e)}}}))});return(0,Y.jsxs)("footer",{children:[(0,Y.jsx)(H.Z,{content:s,trigger:"click",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsxs)(X.Z,{type:"text",size:"small",icon:(0,Y.jsx)(F.Z,{}),children:[o," / ",t.length]})}),(0,Y.jsx)(_.Z,{overlay:u,placement:"topRight",trigger:["click"],getPopupContainer:function(e){return e.parentElement},children:(0,Y.jsxs)(X.Z,{type:"text",size:"small",icon:(0,Y.jsx)(V.Z,{}),className:"size-btn",children:[a,"%"]})})]})},je=t(52242),ke=t(65323),be=function(e){var n=e.saved,t=e.instantSave,r=(0,S.s0)();return(0,Y.jsxs)("div",{className:"left",children:[(0,Y.jsx)(X.Z,{type:"text",onClick:(0,i.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:r("/");case 3:case"end":return e.stop()}}),e)}))),icon:(0,Y.jsx)(je.Z,{style:{opacity:.8}})}),(0,Y.jsx)(X.Z,{type:"text",className:"save",onClick:t,disabled:n,icon:(0,Y.jsx)(ke.Z,{})})]})},Se=t(50419),we=t(53163),ye=t(78030),Ie=t(50446),De=t(74006),Ce=t(52542),Pe=t(76849),Ne=t(62),Oe=t(14965),Ee=t(2721),Re={type:"text",shape:"circle"},Te=function(e){var n=e.handleUndo,t=e.handleRedo,a=e.undoable,i=e.redoable,s=(0,d.gX)(),u=s.mode,c=s.finger,l=(0,d.F7)(),p=(0,f.iX)(),v=(0,o.Z)(p,2),g=v[0],x=v[1];return(0,Y.jsxs)("div",{className:"middle","data-force-light":g,children:[(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({},Re),{},{icon:(0,Y.jsx)(ye.Z,{}),onClick:n,disabled:!a})),(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({},Re),{},{icon:(0,Y.jsx)(Ie.Z,{}),onClick:t,disabled:!i})),(0,Y.jsx)(X.Z,{shape:"circle",type:c?"link":"text",onClick:function(){l({finger:!c}),Se.ZP.open({content:c?"Pencil only":"Draw with finger",key:"FINGER"})},icon:(0,Y.jsx)(Q.Z,{type:"icon-finger"})}),(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({className:"force-light-btn"},Re),{},{icon:g?(0,Y.jsx)(De.Z,{}):(0,Y.jsx)(Ce.Z,{}),onClick:function(){return x((function(e){return!e}))}})),(0,Y.jsx)(Le,{}),(0,Y.jsx)(ze,{}),(0,Y.jsx)(X.Z,{shape:"circle",type:"text"===u?"link":"text",onClick:function(){return l({mode:"text"})},icon:(0,Y.jsx)(Q.Z,{type:"icon-text1"})}),(0,Y.jsx)(Me,{})]})},Le=function(){var e=(0,d.gX)(),n=e.mode,t=e.color,a=(0,d.F7)();return"draw"===n?(0,Y.jsx)(H.Z,{content:(0,Y.jsx)(Ee.Uk,{updateDrawCtrl:a,drawCtrl:e}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(X.Z,{type:"link",icon:(0,Y.jsx)(Pe.Z,{twoToneColor:t,className:"pen-icon"})})}):(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({},Re),{},{onClick:function(){return a({mode:"draw"})},icon:(0,Y.jsx)(Ne.Z,{})}))},ze=function(){var e=(0,d.gX)(),n=e.mode,t=e.pixelEraser,a=(0,d.F7)();return"erase"===n?(0,Y.jsx)(H.Z,{content:(0,Y.jsxs)("div",{className:"width-seg-wrapper",children:[(0,Y.jsx)(we.Z,{block:!0,size:"small",className:"pixel-seg",options:["Pixel","Object"],value:t?"Pixel":"Object",onChange:function(e){a("Pixel"===e?{pixelEraser:!0}:{pixelEraser:!1})}}),(0,Y.jsx)(Ee.Db,{drawCtrl:e,updateDrawCtrl:a,field:"eraserWidth"})]}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(X.Z,{type:"link",icon:(0,Y.jsx)(Q.Z,{type:"icon-eraser"})})}):(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({},Re),{},{onClick:function(){return a({mode:"erase"})},icon:(0,Y.jsx)(Q.Z,{type:"icon-eraser"})}))},Me=function(){var e=(0,d.gX)(),n=e.lasso,t=e.mode,a=(0,d.F7)(),i=n?(0,Y.jsx)(Q.Z,{type:"icon-lasso1"}):(0,Y.jsx)(Oe.Z,{});return"select"===t?(0,Y.jsx)(X.Z,{type:"link",icon:i,onClick:function(){return a({lasso:!n})}}):(0,Y.jsx)(X.Z,(0,r.Z)((0,r.Z)({},Re),{},{icon:i,onClick:function(){return a({mode:"select"})}}))},Fe=t(49142),Ve=t(33441),Ae=t(91333),Ue=t(75594),Be=t(27190),He=t(95055),Ke=t(56118),We=t(69951),Xe=t(96324),_e=t(67575),Ge=t(30501),Je=t(98272),Ye=t(24215),qe=t(37557),Qe=t(78823),$e=t(17973),en=t(23605),nn=t(56200),tn=t(18301),rn=t(51570),an=t(1829),on=t.n(an),sn=function(e){var n=e.instantSave,t=(0,c.useContext)(ne.TeamCtx).teamOn;return(0,Y.jsxs)("div",{className:"right",children:[t?(0,Y.jsx)(dn,{}):(0,Y.jsx)(fn,{instantSave:n}),(0,Y.jsx)(un,{})]})},un=function(){var e=(0,G.LH)(),n=(0,o.Z)(e,2),t=n[0],r=n[1];return(0,Y.jsx)(X.Z,{type:t?"link":"text",icon:(0,Y.jsx)(Xe.Z,{}),onClick:function(){return r((function(e){return!e}))}})},cn=function(e){var n=e.userInfo,t=(0,c.useState)(!1),r=(0,o.Z)(t,2),a=r[0],i=r[1],s=(0,c.useContext)(ne.TeamCtx),u=s.ignores,l=s.setIgnores,d=s.resetIO;if((0,c.useEffect)((function(){return i(!1)}),[n]),!n)return null;var f=n.userName,p=n.online,v=n.userID,g=v===(0,We.VN)(),x=u.has(v)&&!g;return(0,Y.jsxs)("div",{className:"user-item","data-online":p,children:[(0,Y.jsx)(q,{userInfo:n,size:"small",className:"room-avatar"}),a||(0,Y.jsx)("span",{className:"user-name",children:f}),a&&(0,Y.jsx)(He.Z,{autoFocus:!0,className:"rename-input",defaultValue:f,onSearch:function(e){var n=e.trim();if(!n||n===f)return i(!1);(0,We.lu)(n),d()},enterButton:(0,Y.jsx)(X.Z,{icon:(0,Y.jsx)(_e.Z,{})})}),g?a||(0,Y.jsx)(X.Z,{type:"text",icon:(0,Y.jsx)(Ge.Z,{}),onClick:function(){return i(!0)}}):(0,Y.jsx)(X.Z,{type:"text",icon:x?(0,Y.jsx)(Je.Z,{}):(0,Y.jsx)(Ye.Z,{}),onClick:function(){l((function(e){return e.has(v)?e.delete(v):e.add(v)}))}})]})},ln=function(){var e=(0,c.useState)(!1),n=(0,o.Z)(e,2),t=n[0],r=n[1],a=window.location.href,s=function(){var e=(0,i.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,on()("".concat(document.title,"\n").concat(a));case 3:r(!0),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log(e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(){return e.apply(this,arguments)}}();return(0,Y.jsx)(X.Z,{icon:t?(0,Y.jsx)(qe.Z,{}):(0,Y.jsx)(Qe.Z,{}),type:t?"primary":"default",className:"share-btn",onClick:s,block:!0,children:t?"Copied":"Copy link"})},dn=function(){var e=(0,c.useContext)(ne.TeamCtx),n=e.code,t=e.userRec,r=e.connected,s=e.loadInfo,l=e.loadState,d=e.resetIO,f=(0,c.useMemo)((function(){var e=(0,We.VN)(),n=t[e],r=(0,a.Z)(t,[e].map(Fe.Z));if(!n)return[];var i=Object.values(r);return[n].concat((0,I.Z)((0,P.sortBy)(i,"online").reverse()))}),[t]),p=(0,c.useMemo)((function(){return f.filter((function(e){return e.online})).length}),[f]),v=(0,Y.jsxs)("div",{className:"team-popover",children:[r||(0,Y.jsx)(Ve.Z,{className:"disconn-alert",message:"Network failed.",icon:(0,Y.jsx)($e.Z,{}),type:"error",showIcon:!0,banner:!0}),(0,Y.jsx)(Ke.GD,{className:"code-display",value:String(n),length:4,plain:!0}),(0,Y.jsx)(ln,{}),(0,Y.jsx)(Ae.Z,{}),(0,Y.jsx)("div",{className:"user-list",children:f.map((function(e){return(0,Y.jsx)(cn,{userInfo:e},e.userID)}))})]}),g=(0,c.useState)(!1),x=(0,o.Z)(g,2),m=x[0],Z=x[1],h=(0,Y.jsxs)("div",{className:"team-title",children:[(0,Y.jsx)("span",{children:"Team info"}),(0,Y.jsx)(X.Z,{shape:"circle",type:"text",size:"small",loading:m,icon:(0,Y.jsx)(en.Z,{}),onClick:(0,i.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Z(!0),e.next=3,s();case 3:return e.next=5,l();case 5:Z(!1),d();case 7:case"end":return e.stop()}}),e)})))})]});return(0,Y.jsx)(H.Z,{content:v,trigger:"click",placement:"bottomRight",title:h,getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(X.Z,{type:"text",icon:(0,Y.jsx)(Ue.Z,{status:r?"success":"error",count:r?p:"!",size:"small",children:(0,Y.jsx)(nn.Z,{})})})})},fn=function(e){var n,t=e.instantSave,r=null!==(n=(0,S.UO)().noteID)&&void 0!==n?n:"",a=(0,S.s0)(),o=function(){var e=(0,i.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return e.next=4,(0,rn.r8)(r);case 4:if(e.sent){e.next=7;break}return e.abrupt("return",Se.ZP.error("Can't create room."));case 7:return e.next=9,(0,k.SP)(r,{team:!0});case 9:a("/team/"+r);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,Y.jsx)(X.Z,{type:"text",icon:(0,Y.jsx)(tn.Z,{}),onClick:function(){Be.Z.confirm({title:"Enable team editing",content:"This will make your note public to anyone with the link.",icon:(0,Y.jsx)(nn.Z,{style:{color:"#555"}}),onOk:o})}})},pn=["saved","instantSave"],vn=function(e){var n=e.saved,t=e.instantSave,i=(0,a.Z)(e,pn);return(0,Y.jsxs)("header",{children:[(0,Y.jsx)(be,{saved:n,instantSave:t}),(0,Y.jsx)(Te,(0,r.Z)({},i)),(0,Y.jsx)(sn,{instantSave:t})]})},gn=t(88900),xn=t(97892),mn=t.n(xn),Zn=t(6593),hn=t.n(Zn);mn().extend(hn());var jn=function(e){var n=e.noteInfo,t=e.renameNote,r=(0,c.useState)(!1),a=(0,o.Z)(r,2),i=a[0],s=a[1],u=(0,c.useState)(n.name),l=(0,o.Z)(u,2),d=l[0],f=l[1],p=(0,c.useState)(!1),v=(0,o.Z)(p,2),g=v[0],x=v[1],m=n.lastTime,Z=n.createTime,h=(0,c.useMemo)((function(){return mn()(m).calendar()}),[m]),j=(0,c.useMemo)((function(){return mn()(Z).calendar()}),[Z]);return(0,Y.jsx)("nav",{children:(0,Y.jsxs)("div",{className:"info",children:[i?(0,Y.jsx)(gn.Z,{className:"title",size:"large",bordered:!1,value:d,onChange:function(e){return f(e.target.value)},autoFocus:!0,onBlur:function(){t(d),s(!1)}}):(0,Y.jsx)("p",{className:"title",onClick:function(){return s(!0)},children:d}),(0,Y.jsxs)("p",{className:"time",onClick:function(){return x((function(e){return!e}))},children:[g?j:h,(0,Y.jsx)("span",{className:"label",children:g?" Created":" Last Edited"})]})]})})},kn=["pageRec","pdf","pageOrder"],bn=["image","marked"],Sn=["pageRec","pdf","pageOrder"];function wn(){return(0,Y.jsx)(G.kV,{children:(0,Y.jsx)(f.Wk,{children:(0,Y.jsx)(d.w3,{children:(0,Y.jsx)(yn,{})})})})}var yn=function(){var e,n=null!==(e=(0,S.UO)().noteID)&&void 0!==e?e:"",t=(0,S.s0)(),s=(0,c.useState)(),f=(0,o.Z)(s,2),v=f[0],g=f[1],Z=(0,c.useState)(),h=(0,o.Z)(Z,2),w=h[0],y=h[1],D=(0,c.useState)(),C=(0,o.Z)(D,2),T=C[0],L=C[1],z=(0,c.useState)(),M=(0,o.Z)(z,2),F=M[0],V=M[1],A=(0,c.useState)(!0),U=(0,o.Z)(A,2),B=U[0],H=U[1],K=(0,c.useContext)(ne.TeamCtx),W=K.io,X=K.addTeamStatePage,_=K.checkOpID;(0,c.useEffect)((function(){(0,i.Z)(u().mark((function e(){var r,i,o,s;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,k.U9)(n);case 2:if(r=e.sent){e.next=6;break}return Se.ZP.error("Note not found"),e.abrupt("return",t("/"));case 6:i=r.pageRec,r.pdf,o=r.pageOrder,s=(0,a.Z)(r,kn),g((0,m.D5)(i)),V(o),y(s),L(j.createFromPages(i));case 11:case"end":return e.stop()}}),e)})))()}),[t,n]),(0,c.useEffect)((function(){w&&(document.title=w.name+" - Multibility")}),[w]),(0,c.useEffect)((function(){return document.body.classList.add("reader"),function(){return document.body.classList.remove("reader")}}),[]);var G=(0,p.Z)((0,i.Z)(u().mark((function e(){var t,a,i,o,s=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return a=s.length>0&&void 0!==s[0]&&s[0],i=v,a&&(null===T||void 0===T||T.getStates().forEach((function(e,n){var t;i=null===(t=i)||void 0===t?void 0:t.update(n,l.BJ,(function(n){return(0,r.Z)((0,r.Z)({},n),{},{state:x.Dw.flaten(e)})}))})),g(i)),o=null===(t=i)||void 0===t?void 0:t.toObject(),e.next=6,(0,k.SP)(n,{pageRec:o});case 6:H(!0);case 7:case"end":return e.stop()}}),e)})))),J=(0,c.useCallback)((0,P.debounce)(G,5e3),[G]),q=J.flush,Q=function(e,n){g((function(t){return null===t||void 0===t?void 0:t.update(e,l.BJ,n)})),H(!1),J()},$=function(){var e=(0,i.Z)(u().mark((function e(t){var r,a=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=a.length>1&&void 0!==a[1]&&a[1],V(t),e.next=4,(0,k.SP)(n,{pageOrder:t});case 4:return e.next=6,q();case 6:r&&ee(t);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),ee=function(e){return null===W||void 0===W?void 0:W.emit("reorder",{pageOrder:e})},te=(0,p.Z)((function(e){var n=e.deleted,t=e.pageOrder,r=e.prevOrder;$(t),n&&(0,b.Ow)((function(){return $(r,!0)}))})),re=(0,p.Z)((function(e){var n=e.pageOrder,t=e.pageID,r=e.newPage;$(n),Q(t,(function(){return r})),L((function(e){return null===e||void 0===e?void 0:e.addState(t,r)}))}));(0,c.useEffect)((function(){return null===W||void 0===W||W.on("reorder",te),null===W||void 0===W||W.on("newPage",re),function(){null===W||void 0===W||W.removeAllListeners()}}),[W,te,re]);var ie=function(e){null===W||void 0===W||W.emit("push",{operation:e},(function(n){var t=n.timestamp,r=n.prevID,a=n.currID;!function(n){if("add"===e.type){var t=e.pageID,r=e.stroke.uid;L((function(e){return null===e||void 0===e?void 0:e.syncStrokeTime(t,r,n)}))}}(t),_(r,a)}))},oe=function(e,n,t){t.image,t.marked;var r=(0,a.Z)(t,bn);null===W||void 0===W||W.emit("newPage",{pageOrder:e,pageID:n,newPage:r}),X(n,t)},se=function(e){if(T){var n=e(T);if(n!==T){L(n),H(!1),J(!0);var t=n.lastOp;t&&ie(t)}}},ue=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(F){var t=n?null===v||void 0===v?void 0:v.get(e):void 0,r=(0,l.D4)(t),a=(0,o.Z)(r,2),i=a[0],s=a[1],u=R(F,e,i);oe(u,i,s),$(u),Q(i,(function(){return s})),L((function(e){return null===e||void 0===e?void 0:e.addState(i,s)}))}},ce=function(){var e=(0,P.last)(F);e&&ue(e)},le=(0,c.useState)(100),fe=(0,o.Z)(le,2),pe=fe[0],ve=fe[1],ge=100===pe,xe=(100-pe)/2+"%",me={paddingLeft:xe,paddingRight:xe},Ze=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=(0,c.useState)((0,m.D5)()),a=(0,o.Z)(r,2),s=a[0],l=a[1],d=(0,c.useRef)(!1),f=(0,c.useState)(""),v=(0,o.Z)(f,2),g=v[0],x=v[1];(0,c.useEffect)((function(){(0,i.Z)(u().mark((function n(){var t;return u().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,N.getItem(e);case 2:if(t=n.sent){n.next=5;break}return n.abrupt("return",d.current=!0);case 5:x(t);case 6:case"end":return n.stop()}}),n)})))()}),[e]),(0,c.useLayoutEffect)((function(){var e=s.get(g);!d.current&&e&&(e.scrollIntoView(),d.current=!0)}),[g,s]);var Z=(0,c.useState)((0,m.D5)()),h=(0,o.Z)(Z,2),j=h[0],k=h[1],b=(0,c.useDeferredValue)(j),S=(0,c.useDeferredValue)(n),w=(0,c.useMemo)((function(){return E(b,S)}),[b,S]);(0,c.useEffect)((function(){d.current&&O(e,w)}),[e,w]);var y=(0,p.Z)((function(){var e,n=s.get(w),t=null===n||void 0===n||null===(e=n.parentElement)||void 0===e?void 0:e.previousElementSibling;return t?-n.getBoundingClientRect().top+t.getBoundingClientRect().height:0})),D=(0,c.useMemo)(y,[n,y].concat((0,I.Z)(t))),C=(0,p.Z)((function(){var e=s.get(w);e&&(e.scrollIntoView(),window.scrollBy(0,D))}));(0,c.useLayoutEffect)(C,[n,C].concat((0,I.Z)(t)));var P=(0,p.Z)((function(e){return function(n){n&&l((function(t){return t.set(e,n)}))}})),R=(0,c.useRef)(0),T=(0,c.useState)(!1),L=(0,o.Z)(T,2),z=L[0],M=L[1],F=function(e){var n=s.get(e);n&&(document.addEventListener("scroll",(function e(){window.clearTimeout(R.current),R.current=window.setTimeout((function(){M(!1),document.removeEventListener("scroll",e)}),50)})),n.scrollIntoView({behavior:"smooth"}),M(!0))};return(0,c.useDebugValue)(w),{scrollPage:F,setInviewRatios:k,sectionRef:P,currPageID:w,scrolling:z}}(n,F,[pe]),he=Ze.setInviewRatios,je=Ze.scrollPage,ke=Ze.sectionRef,be=Ze.currPageID,we=Ze.scrolling,ye=(0,d.gX)().finger;(0,c.useEffect)((function(){var e=new BroadcastChannel("open note");return e.postMessage(n),e.onmessage=function(e){e.data===n&&(J.cancel(),(0,b.sk)((function(){return t("/")})))},function(){return e.close()}}),[t,n,J]);var Ie=function(){var e=(0,i.Z)(u().mark((function e(t){var r,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==(null===w||void 0===w?void 0:w.name)){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,k.SP)(n,{name:t});case 4:return e.next=6,(0,k.U9)(n);case 6:if(r=e.sent){e.next=9;break}return e.abrupt("return");case 9:r.pageRec,r.pdf,r.pageOrder,i=(0,a.Z)(r,Sn),y(i);case 11:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();if(!T||!F||!v||!w)return null;var De={noteID:n,pageRec:v,pageOrder:F,stateSet:T,currPageID:be,size:pe},Ce={scrollPage:je,switchPageMarked:function(e){return Q(e,(function(e){return(0,r.Z)((0,r.Z)({},e),{},{marked:!e.marked})}))},addFinalPage:ce,addPage:ue,deletePage:function(e){var n=null===F||void 0===F?void 0:F.filter((function(n){return n!==e}));(null===n||void 0===n?void 0:n.length)&&$(n,!0)},saveReorder:$,setSize:ve};return(0,Y.jsxs)("div",{className:"reader container",children:[(0,Y.jsx)(vn,{saved:B,instantSave:q,handleUndo:function(){return se((function(e){return e.undo()}))},handleRedo:function(){return se((function(e){return e.redo()}))},undoable:T.isUndoable(),redoable:T.isRedoable()}),(0,Y.jsx)(jn,{noteInfo:w,renameNote:Ie}),(0,Y.jsx)("main",{"data-finger":ye,"data-full":ge,style:me,children:F.map((function(e){return(0,Y.jsx)("section",{className:"note-page",ref:ke(e),children:(0,Y.jsx)(In,(0,r.Z)({uid:e,updateStateSet:se,setInviewRatios:he,scrolling:we},De))},e)}))}),(0,Y.jsx)("footer",{children:(0,Y.jsx)(ae,{addFinalPage:ce})}),(0,Y.jsx)(de,(0,r.Z)((0,r.Z)({},De),Ce))]})},In=function(e){var n=e.uid,t=e.updateStateSet,r=e.setInviewRatios,a=e.scrolling,i=e.pageRec,o=e.stateSet,s=e.currPageID,u=e.pageOrder,l=e.noteID,d=(0,c.useContext)(ne.TeamCtx),f=d.teamState,v=d.ignores,g=i.get(n),x=o.getOneState(n),m=null===f||void 0===f?void 0:f.getOnePageStateMap(n),Z=(0,p.Z)((function(e){t((function(t){return t.setState(n,e)}))})),h=(0,p.Z)((function(e){if(!e)return r((function(e){return e.delete(n)}));r((function(t){return t.set(n,e)}))})),j=(0,c.useMemo)((function(){if(!u)return!1;var e=u.indexOf(s),t=u.indexOf(n);return Math.abs(t-e)<=1}),[s,n,u]);return g&&x?(0,Y.jsx)(w.default,{drawState:x,teamStateMap:m,updateState:Z,pdfIndex:g.pdfIndex,noteID:l,ignores:v,onViewChange:h,preload:j,skipInView:a}):null}},60559:function(e,n,t){t.r(n),t.d(n,{TeamCtx:function(){return S},default:function(){return w}});var r=t(29439),a=t(15861),i=t(87757),o=t.n(i),s=t(72791),u=t(95099),c=t(51570),l=t(78577),d=t(69951),f=t(16871),p=t(49742),v=t(79856),g=t(99361),x=t(50419),m=t(24124),Z=t(10814),h=t(763),j=t(1438),k=t.n(j),b=t(80184),S=s.createContext({io:void 0,code:0,teamOn:!1,connected:!1,ignores:(0,m.l4)(),userRec:{},teamState:void 0,resetIO:function(){},loadInfo:function(){var e=(0,a.Z)(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),loadState:function(){},setIgnores:function(){},addTeamStatePage:function(e,n){},checkOpID:function(e,n){}});function w(){var e,n=null!==(e=(0,f.UO)().noteID)&&void 0!==e?e:"",t=(0,s.useState)(),i=(0,r.Z)(t,2),j=i[0],w=i[1],y=(0,s.useState)(-2),I=(0,r.Z)(y,2),D=I[0],C=I[1],P=(0,s.useState)({}),N=(0,r.Z)(P,2),O=N[0],E=N[1],R=(0,s.useState)((0,m.l4)()),T=(0,r.Z)(R,2),L=T[0],z=T[1],M=(0,s.useState)(),F=(0,r.Z)(M,2),V=F[0],A=F[1],U=(0,s.useState)(!1),B=(0,r.Z)(U,2),H=B[0],K=B[1],W=(0,s.useState)(!1),X=(0,r.Z)(W,2),_=X[0],G=X[1],J=(0,f.s0)(),Y=(0,s.useState)(""),q=(0,r.Z)(Y,2),Q=q[0],$=q[1],ee=(0,u.Z)((0,a.Z)(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading note info..."),e.next=3,(0,c.dn)(n,(function(e){$("Downloading PDF: "+k()(e))}));case 3:if(t=e.sent){e.next=7;break}return x.ZP.error("Failed loading the team note info"),e.abrupt("return",!1);case 7:return C(t.code),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})))),ne=(0,s.useCallback)((0,h.throttle)(function(){var e=(0,a.Z)(o().mark((function e(t){var r;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading team note..."),e.next=3,(0,c.CD)(n,(function(e){e<1024||($("Loading team note: "+k()(e)),null===t||void 0===t||t(e))}));case 3:if(r=e.sent){e.next=7;break}return x.ZP.error("Failed loading the team note state"),e.abrupt("return",!1);case 7:return w(v.f.createFromTeamPages(r)),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),1e4),[n]),te=function(){var e,n="SYNC",t=x.ZP.loading({content:"Syncing...",key:n});null===(e=ne((function(e){x.ZP.loading({content:"Syncing: "+k()(e),key:n})})))||void 0===e||e.then(t)},re=(0,u.Z)((function(){return A(function(e){return(0,l.io)(c._n,{query:{userID:(0,d.VN)(),userName:(0,d.vW)(),noteID:e}})}(n))})),ae=(0,u.Z)((function(){(0,c.f1)(n)})),ie=(0,s.useRef)(""),oe=(0,u.Z)((function(e,n){var t=e&&ie.current&&e!==ie.current;ie.current=n,t&&te()})),se=(0,u.Z)((function(e){var n=ie.current&&ie.current!==e;ie.current=e,n&&te()}));(0,s.useEffect)((function(){var e=function(){var e=(0,a.Z)(o().mark((function e(){var n,t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ee();case 2:return n=e.sent,e.next=5,ne();case 5:if(t=e.sent,n&&t){e.next=8;break}return e.abrupt("return",J("/"));case 8:K(!0),re(),ae();case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return e(),ae}),[ee,ne,J,re,ae]),(0,s.useEffect)((function(){if(V)return V.on("push",(function(e){var n=e.operation,t=e.userID,r=e.prevID,a=e.currID;w((function(e){return null===e||void 0===e?void 0:e.pushOperation(n,t)})),oe(r,a)})),V.on("join",(function(e){var n=e.joined,t=e.members,r=n.userID,a=n.userName;E(t),r!==(0,d.VN)()&&(0,p.gd)(r,a)})),V.on("leave",(function(e){var n=e.leaved,t=e.members,r=n.userID,a=n.userName;if(E(t),r===(0,d.VN)())return V.emit("join");(0,p.mz)(r,a)})),V.on("newPage",(function(e){var n=e.pageID,t=e.newPage;w((function(e){return null===e||void 0===e?void 0:e.addPage(n,t)}))})),V.on("reset",(function(e){var n=e.userID,t=e.pageRec;n!==(0,d.VN)()&&w((function(e){return null===e||void 0===e?void 0:e.resetUser(n,t)}))})),V.on("connect_error",console.error),V.on("disconnect",(function(){return G(!1)})),V.on("connect",(function(){return G(!0)})),V.on("connected",(function(e){var n=e.currID;return se(n)})),function(){V.removeAllListeners(),V.close()}}),[V,oe,se]);return(0,b.jsx)(g.g,{loading:!H,text:Q,children:(0,b.jsx)(S.Provider,{value:{io:V,code:D,teamOn:!0,ignores:L,userRec:O,connected:_,teamState:j,resetIO:re,loadInfo:ee,loadState:ne,setIgnores:z,addTeamStatePage:function(e,n){w((function(t){return null===t||void 0===t?void 0:t.addPage(e,n)}))},checkOpID:oe},children:(0,b.jsx)(Z.default,{})})})}},49742:function(e,n,t){t.d(n,{Ow:function(){return l},gd:function(){return d},mz:function(){return f},sk:function(){return p}});var r=t(50419),a=t(87309),i=t(27190),o=t(56058),s=t(87962),u=t(52242),c=t(80184),l=function(e){r.ZP.warning({content:(0,c.jsxs)(c.Fragment,{children:["One page was deleted.",(0,c.jsx)(a.Z,{size:"small",type:"link",onClick:function(){r.ZP.destroy("DELETE"),e()},children:"Undo"})]}),key:"DELETE",duration:10})},d=function(e,n){r.ZP.success({content:"".concat(n," joined the room"),icon:(0,c.jsx)(o.Z,{}),key:e})},f=function(e,n){r.ZP.warning({content:"".concat(n," leaved the room"),icon:(0,c.jsx)(s.Z,{}),key:e})},p=function(e){i.Z.error({title:"This note is opened in another tab.",okText:"Back",okButtonProps:{icon:(0,c.jsx)(u.Z,{})},onOk:e})}}}]);
//# sourceMappingURL=378.51f65fa4.chunk.js.map