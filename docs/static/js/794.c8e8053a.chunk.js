"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[794,44],{87850:function(e,n,t){t.r(n),t.d(n,{default:function(){return dn}});var r=t(93433),a=t(1413),i=t(45987),o=t(15861),s=t(29439),u=t(87757),c=t.n(u),l=t(72791),d=t(92198),f=t(11886),p=t(81832),v=t(76807),x=t(95099),g=t(15671),m=t(43144),Z=t(82670),h=t(24124),j={states:(0,h.D5)(),editStack:(0,h.aV)(),undoStack:(0,h.aV)()},k=(0,h.WV)(j),b=function(){function e(n,t){(0,g.Z)(this,e),this.immutable=n,this.lastOp=t}return(0,m.Z)(e,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getStates",value:function(){return this.getImmutable().get("states")}},{key:"getOneState",value:function(e){return this.getStates().get(e)}},{key:"getEditStack",value:function(){return this.getImmutable().get("editStack")}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"setState",value:function(n,t){var r=this.getOneState(n);if(!r||r===t)return this;var i=this.getImmutable().update("states",(function(e){return e.set(n,t)})).update("editStack",(function(e){return e.push(n)})).delete("undoStack"),o=t.lastOp;return new e(i,o&&(0,a.Z)((0,a.Z)({},o),{},{pageID:n}))}},{key:"syncStrokeTime",value:function(e,n){var t=this.getOneState(e);return t&&Z.Dw.syncStrokeTime(t,n),this}},{key:"addState",value:function(n,t){var r=t.state,a=t.ratio,i=Z.Dw.loadFromFlat(r,a);return new e(this.getImmutable().update("states",(function(e){return e.set(n,i)})))}},{key:"deleteState",value:function(n){return new e(this.getImmutable().update("states",(function(e){return e.delete(n)})))}},{key:"isUndoable",value:function(){return this.getEditStack().size>0}},{key:"isRedoable",value:function(){return this.getUndoStack().size>0}},{key:"undo",value:function(){if(!this.isUndoable())return this;var n=this.getEditStack().last(),t=n&&this.getOneState(n);if(!t)return this;var r=Z.Dw.undo(t),i=r.lastOp,o=i&&(0,a.Z)({pageID:n},i);return new e(this.getImmutable().update("editStack",(function(e){return e.pop()})).update("undoStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,r)})),o)}},{key:"redo",value:function(){if(!this.isRedoable())return this;var n=this.getUndoStack().last(),t=n&&this.getOneState(n);if(!t)return this;var r=Z.Dw.redo(t),i=r.lastOp,o=i&&(0,a.Z)({pageID:n},i);return new e(this.getImmutable().update("undoStack",(function(e){return e.pop()})).update("editStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,r)})),o)}},{key:"getLastDS",value:function(){var e,n=null===(e=this.lastOp)||void 0===e?void 0:e.pageID,t=n&&this.getOneState(n);if(t)return[n,t]}}],[{key:"createFromPages",value:function(n){return new e(k().set("states",(0,h.D5)(n).map((function(e){var n=e.state,t=e.ratio;return Z.Dw.loadFromFlat(n,t)}))))}}]),e}(),w=t(75783),S=t(49742),y=t(16871),I=t(67008),D=t(37762),P=t(61842),C=t.n(P),N=t(763),O=C().createInstance({name:"scroll"}),R=(0,N.debounce)((function(e,n){O.setItem(e,n)}),5e3);var E=function(e,n){var t,r="",a=0,i=(0,D.Z)(n);try{for(i.s();!(t=i.n()).done;){var o=t.value,s=e.get(o);if(s){if(1===s)return o;s>a&&(r=o,a=s)}}}catch(u){i.e(u)}finally{i.f()}return r},T=t(79930),F=t(82898);function L(e,n,t){var r=e.indexOf(n),a=e.slice();return-1===r||a.splice(r+1,0,t),a}var A=t(79286),z=t(23414),M=t(82622),V=t(10711),U=t(18780),H=t(2491),K=t(70140),W=t(69228),_=t(87661),q=t(52365),G=t(74115),X=t(80184),B=function(e){var n=e.userInfo,t=e.size,r=void 0===t?"default":t,a=e.onClick,i=void 0===a?function(){}:a,o=e.chosen,s=void 0!==o&&o,u=e.className,c=(0,l.useMemo)((function(){return(0,G.bM)(n.userID)}),[n]);if(!n)return null;var d=n.userName;return(0,X.jsx)(H.C,{className:u,"data-chosen":s,size:r,style:{backgroundColor:c},children:(0,X.jsx)("div",{className:"avatar-wrapper",onClick:i,children:null===d||void 0===d?void 0:d.slice(0,3)})})},J=t(22568),Q=t(81694),Y=t.n(Q),$=t(60559),ee=t(13892),ne=t(79856),te=t(87309),re=function(e){var n=e.addFinalPage;return(0,X.jsx)("div",{className:"add-btn-wrapper",children:(0,X.jsx)(te.Z,{type:"dashed",icon:(0,X.jsx)(A.Z,{}),block:!0,onClick:n,children:"New page"})})},ae=["left"],ie=["ref"],oe=["cardDragged"],se=["uid","pageIndex","refRec","cardDragged"],ue=["uid","index","chosen","setChosen","page","userIDs"],ce=function(e){var n=(0,l.useState)(!1),t=(0,s.Z)(n,2),r=t[0],i=t[1],o=(0,q.LH)(),u=(0,s.Z)(o,1)[0],c=(0,X.jsx)(U._l,{draggableId:"opposite",index:r?1:0,children:function(e){var n=e.innerRef,t=e.draggableProps,r=e.dragHandleProps;return(0,X.jsx)("div",(0,a.Z)((0,a.Z)({className:"opposite",ref:n},t),r))}});return(0,X.jsx)(q.s2,{initKey:"ALL",children:(0,X.jsx)(U.Z5,{onDragEnd:function(e){var n=e.draggableId,t=e.destination;"CARD"===n&&(0===(null===t||void 0===t?void 0:t.index)&&i(!0),1===(null===t||void 0===t?void 0:t.index)&&i(!1))},children:(0,X.jsx)(U.bK,{droppableId:"preview-drop",direction:"horizontal",children:function(n,t){var i=n.droppableProps,o=n.innerRef,s=n.placeholder,l=t.isDraggingOver;return(0,X.jsxs)("aside",(0,a.Z)((0,a.Z)({className:"preview-drop","data-left":r,"data-open":u,"data-dragged":l,ref:o},i),{},{children:[c,(0,X.jsx)(le,(0,a.Z)({left:r},e)),s]}))}})})})},le=function(e){var n=e.left,t=(0,i.Z)(e,ae),r=(0,q.zI)(),o=(0,s.Z)(r,1)[0],u=(0,q.LH)(),c=(0,s.Z)(u,2),l=c[0],d=c[1],f={ALL:"All Pages",MARKED:"Bookmarks",WRITTEN:"Notes"}[o],p=(0,ee.QS)({onSwipedLeft:function(){n&&d(!1)},onSwipedRight:function(){n||d(!1)},swipeDuration:200}),v=p.ref,x=(0,i.Z)(p,ie);return(0,X.jsx)(U._l,{draggableId:"CARD",index:n?0:1,children:function(e,n){var r=e.innerRef,i=e.draggableProps,o=e.dragHandleProps,s=n.isDragging,u=n.isDropAnimating;return(0,X.jsxs)("div",(0,a.Z)((0,a.Z)((0,a.Z)({className:"preview-card",ref:function(e){r(e),v(e)},"data-open":l,"data-dragged":s,"data-animating":u},i),x),{},{children:[(0,X.jsx)("div",(0,a.Z)({className:"drag-handle"},o)),(0,X.jsx)("h3",{children:f}),(0,X.jsx)(ge,{}),(0,X.jsx)(de,(0,a.Z)({cardDragged:s},t))]}))}})},de=l.memo((function(e){var n=e.cardDragged,t=(0,i.Z)(e,oe),r=(0,l.useRef)({}),o=(0,q.zI)(),u=(0,s.Z)(o,1)[0],c=(0,q.LH)(),d=(0,s.Z)(c,1)[0],f=t.pageOrder,p=t.currPageID,v=t.saveReorder,g=t.scrollPage,m=t.addFinalPage,Z=(0,x.Z)((function(){var e;null===(e=r.current[p])||void 0===e||e.scrollIntoView()}));return(0,l.useLayoutEffect)((function(){d&&Z()}),[d,u,Z]),(0,X.jsx)(U.Z5,{onDragEnd:function(e){var n=e.source,t=e.destination;if(t&&f){var r=n.index,a=t.index,i=f[r];if(r!==a&&i){var o=function(e,n,t){var r=e.slice(),a=r.splice(n,1),i=(0,s.Z)(a,1)[0];return i?(r.splice(t,0,i),r):e}(f,r,a);v(o,!0),requestAnimationFrame((function(){return g(i)}))}}},children:(0,X.jsx)(U.bK,{droppableId:"preview-list",children:function(e){var i=e.droppableProps,o=e.innerRef,s=e.placeholder;return(0,X.jsxs)("div",(0,a.Z)((0,a.Z)({className:"page-list",ref:o},i),{},{children:[null===f||void 0===f?void 0:f.map((function(e,i){return(0,X.jsx)(fe,(0,a.Z)({uid:e,pageIndex:i,refRec:r.current,cardDragged:n},t),e)})),s,"ALL"===u&&(0,X.jsx)(re,{addFinalPage:m})]}))}})})}));de.displayName="PageList";var fe=function(e){var n=e.uid,t=e.pageIndex,r=e.refRec,o=e.cardDragged,u=(0,i.Z)(e,se),c=u.stateSet,d=u.pageRec,f=u.currPageID,p=u.scrollPage,v=(0,l.useContext)($.TeamCtx),x=v.teamState,g=v.ignores,m=(0,q.zI)(),Z=(0,s.Z)(m,1)[0],h=(0,l.useState)(""),j=(0,s.Z)(h,2),k=j[0],b=j[1],w=null===d||void 0===d?void 0:d.get(n),S=null===c||void 0===c?void 0:c.getOneState(n),y=null===x||void 0===x?void 0:x.getOnePageStateMap(n),D=(0,l.useRef)(!1);D.current="MARKED"===Z&&((null===w||void 0===w?void 0:w.marked)||D.current);var P=(0,l.useMemo)((function(){return ne.f.getValidUsers(y,g)}),[y,g]);if(!w||!S)return null;if("WRITTEN"===Z&&S.isEmpty()&&ne.f.isEmpty(y))return null;if("MARKED"===Z&&!D.current)return null;var C=f===n;return(0,X.jsx)(U._l,{draggableId:n,index:t,isDragDisabled:"ALL"!==Z,children:function(e,i){var s=e.innerRef,c=e.draggableProps,l=e.dragHandleProps,d=i.isDragging,f=i.isDropAnimating;return(0,X.jsxs)("div",(0,a.Z)((0,a.Z)((0,a.Z)({ref:function(e){s(e),e&&(r[n]=e)},className:"page","data-curr":C,"data-dragged":d,"data-animating":f,onClick:function(){return p(n)}},c),l),{},{children:[(0,X.jsx)(I.default,{drawState:(null===y||void 0===y?void 0:y.get(k))||S,teamStateMap:k?void 0:y,thumbnail:w.image,ignores:g,preview:!0,skipInView:d||o}),(0,X.jsx)(pe,(0,a.Z)({uid:n,index:t,chosen:k,setChosen:b,page:w,userIDs:P},u))]}))}})},pe=l.memo((function(e){var n=e.uid,t=e.index,r=e.chosen,o=e.setChosen,s=e.page,u=e.userIDs,c=(0,i.Z)(e,ue),l=c.switchPageMarked;return(0,X.jsxs)("div",{className:"tools",onClick:function(e){return e.stopPropagation()},children:[(0,X.jsx)("div",{className:"bookmark","data-marked":s.marked,onClick:function(){return l(n)}}),(0,X.jsx)("div",{className:"index",children:t+1}),(0,X.jsx)(xe,(0,a.Z)({uid:n},c)),(0,X.jsx)(ve,{userIDs:u,chosen:r,setChosen:o})]})}));pe.displayName="PreviewTools";var ve=function(e){var n=e.userIDs,t=e.chosen,r=e.setChosen,a=(0,l.useContext)($.TeamCtx).userRec;return(0,X.jsx)(H.C.Group,{maxCount:2,size:"default",className:Y()("team-group",{chosen:t}),maxPopoverPlacement:"bottom",children:n.map((function(e){var n=a[e];return n?(0,X.jsx)(B,{size:"default",userInfo:n,className:"preview-avatar",chosen:t===e,onClick:function(){return r((function(n){return n===e?"":e}))}},e):null}))})},xe=function(e){var n=e.uid,t=e.addPage,r=e.deletePage,a=(0,X.jsx)(K.Z,{items:[{key:"ADD",icon:(0,X.jsx)(A.Z,{}),label:"Add page",onClick:function(){return t(n)}},{key:"COPY",icon:(0,X.jsx)(z.Z,{}),label:"Duplicate",onClick:function(){return t(n,!0)}},{key:"DELETE",icon:(0,X.jsx)(M.Z,{}),label:"Delete",danger:!0,onClick:function(){return r(n)}}]});return(0,X.jsx)(W.Z,{content:a,trigger:"click",placement:"left",destroyTooltipOnHide:!0,getPopupContainer:function(e){var n,t;return null===(n=e.parentElement)||void 0===n||null===(t=n.parentElement)||void 0===t?void 0:t.parentElement},children:(0,X.jsx)("div",{className:"option",children:(0,X.jsx)(V.Z,{})})})},ge=l.memo((function(){var e=(0,q.zI)(),n=(0,s.Z)(e,2),t=n[0],r=n[1],a=_.Z.TabPane;return(0,X.jsxs)(_.Z,{className:"tabs",activeKey:t,onChange:r,tabBarGutter:0,size:"small",centered:!0,children:[(0,X.jsx)(a,{tab:(0,X.jsx)(J.Z,{type:"icon-uf_paper"})},"ALL"),(0,X.jsx)(a,{tab:(0,X.jsx)(J.Z,{type:"icon-bookmark2"})},"MARKED"),(0,X.jsx)(a,{tab:(0,X.jsx)(J.Z,{type:"icon-write"})},"WRITTEN")]})}));ge.displayName="PreviewTabs";var me=t(52242),Ze=t(65323),he=function(e){var n=e.saved,t=e.instantSave,r=(0,y.s0)();return(0,X.jsxs)("div",{className:"left",children:[(0,X.jsx)(te.Z,{type:"text",onClick:(0,o.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:r("/");case 3:case"end":return e.stop()}}),e)}))),icon:(0,X.jsx)(me.Z,{style:{opacity:.8}})}),(0,X.jsx)(te.Z,{type:"text",className:"save",onClick:t,disabled:n,icon:(0,X.jsx)(Ze.Z,{})})]})},je=t(50419),ke=t(78985),be=t(78030),we=t(50446),Se=t(74006),ye=t(52542),Ie=t(76849),De=t(62),Pe=t(14965),Ce=t(48),Ne=function(e){var n=e.handleUndo,t=e.handleRedo,r=e.undoable,a=e.redoable,i=(0,f.gX)(),o=i.mode,u=i.finger,c=(0,f.F7)(),l=(0,p.iX)(),d=(0,s.Z)(l,2),v=d[0],x=d[1];return(0,X.jsxs)("div",{className:"middle","data-force-light":v,children:[(0,X.jsx)(te.Z,{type:"text",icon:(0,X.jsx)(be.Z,{}),onClick:n,disabled:!r}),(0,X.jsx)(te.Z,{type:"text",icon:(0,X.jsx)(we.Z,{}),onClick:t,disabled:!a}),(0,X.jsx)(te.Z,{type:u?"link":"text",onClick:function(){c({finger:!u}),je.ZP.destroy("FINGER"),je.ZP.open({content:u?"Pencil only":"Draw with finger",key:"FINGER"})},icon:(0,X.jsx)(J.Z,{type:"icon-finger"})}),(0,X.jsx)(te.Z,{className:"force-light-btn",type:"text",icon:v?(0,X.jsx)(Se.Z,{}):(0,X.jsx)(ye.Z,{}),onClick:function(){return x((function(e){return!e}))}}),(0,X.jsx)(Oe,{}),(0,X.jsx)(Re,{}),(0,X.jsx)(te.Z,{type:"text"===o?"link":"text",onClick:function(){return c({mode:"text"})},icon:(0,X.jsx)(J.Z,{type:"icon-text1"})}),(0,X.jsx)(Ee,{})]})},Oe=function(){var e=(0,f.gX)(),n=e.mode,t=e.color,r=(0,f.F7)();return"draw"===n?(0,X.jsx)(W.Z,{content:(0,X.jsx)(Ce.Uk,{updateDrawCtrl:r,drawCtrl:e}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,X.jsx)(te.Z,{type:"link",icon:(0,X.jsx)(Ie.Z,{twoToneColor:t,className:"pen-icon"})})}):(0,X.jsx)(te.Z,{type:"text",onClick:function(){return r({mode:"draw"})},icon:(0,X.jsx)(De.Z,{})})},Re=function(){var e=(0,f.gX)(),n=e.mode,t=e.pixelEraser,r=(0,f.F7)(),i={shape:"circle",icon:(0,X.jsx)(J.Z,{type:"icon-eraser"})};return"erase"===n?(0,X.jsx)(W.Z,{content:(0,X.jsxs)("div",{className:"width-seg-wrapper",children:[(0,X.jsx)(ke.Z,{block:!0,size:"small",className:"pixel-seg",options:["Pixel","Object"],value:t?"Pixel":"Object",onChange:function(e){r("Pixel"===e?{pixelEraser:!0}:{pixelEraser:!1})}}),(0,X.jsx)(Ce.Db,{drawCtrl:e,updateDrawCtrl:r,field:"eraserWidth"})]}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,X.jsx)(te.Z,(0,a.Z)({type:"link"},i))}):(0,X.jsx)(te.Z,(0,a.Z)({type:"text",onClick:function(){return r({mode:"erase"})}},i))},Ee=function(){var e=(0,f.gX)(),n=e.lasso,t=e.mode,r=(0,f.F7)(),a=n?(0,X.jsx)(J.Z,{type:"icon-lasso1"}):(0,X.jsx)(Pe.Z,{});return"select"===t?(0,X.jsx)(te.Z,{type:"link",icon:a,onClick:function(){return r({lasso:!n})}}):(0,X.jsx)(te.Z,{type:"text",icon:a,onClick:function(){return r({mode:"select"})}})},Te=t(49142),Fe=t(90785),Le=t(91333),Ae=t(75594),ze=t(461),Me=t(95055),Ve=t(67415),Ue=t(69951),He=t(96324),Ke=t(67575),We=t(30501),_e=t(98272),qe=t(24215),Ge=t(17973),Xe=t(19951),Be=t(23605),Je=t(56200),Qe=t(18301),Ye=t(51570),$e=t(1829),en=t.n($e),nn=function(e){var n=e.instantSave,t=(0,l.useContext)($.TeamCtx).teamOn;return(0,X.jsxs)("div",{className:"right",children:[t?(0,X.jsx)(an,{}):(0,X.jsx)(on,{instantSave:n}),(0,X.jsx)(tn,{})]})},tn=function(){var e=(0,q.LH)(),n=(0,s.Z)(e,2),t=n[0],r=n[1];return(0,X.jsx)(te.Z,{type:t?"link":"text",icon:(0,X.jsx)(He.Z,{}),onClick:function(){return r((function(e){return!e}))}})},rn=function(e){var n=e.userID,t=(0,l.useState)(!1),r=(0,s.Z)(t,2),a=r[0],i=r[1],o=(0,l.useContext)($.TeamCtx),u=o.ignores,c=o.setIgnores,d=o.resetIO,f=o.userRec[n];if((0,l.useEffect)((function(){return i(!1)}),[f]),!f)return null;var p=f.userName,v=f.online,x=n===(0,Ue.VN)(),g=u.has(n)&&!x;return(0,X.jsxs)("div",{className:"user-item","data-online":v,children:[(0,X.jsx)(B,{userInfo:f,size:"small",className:"room-avatar"}),a||(0,X.jsx)("span",{className:"user-name",children:p}),a&&(0,X.jsx)(Me.Z,{autoFocus:!0,className:"rename-input",defaultValue:p,onSearch:function(e){var n=e.trim();if(!n||n===p)return i(!1);(0,Ue.lu)(n),d()},enterButton:(0,X.jsx)(te.Z,{icon:(0,X.jsx)(Ke.Z,{})})}),x?a||(0,X.jsx)(te.Z,{type:"text",icon:(0,X.jsx)(We.Z,{}),onClick:function(){return i(!0)}}):(0,X.jsx)(te.Z,{type:"text",icon:g?(0,X.jsx)(_e.Z,{}):(0,X.jsx)(qe.Z,{}),onClick:function(){c((function(e){return e.has(n)?e.delete(n):e.add(n)}))}})]})},an=function(){var e=(0,l.useContext)($.TeamCtx),n=e.code,t=e.userRec,a=e.connected,u=e.loadInfo,d=e.loadState,f=e.resetIO,p=window.location.href,v=function(){var e=(0,o.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,en()("".concat(document.title,"\n").concat(p));case 3:je.ZP.destroy("copy"),je.ZP.success({content:"Link copied!",icon:(0,X.jsx)(z.Z,{}),key:"copy"}),e.next=10;break;case 7:e.prev=7,e.t0=e.catch(0),console.log(e.t0);case 10:case"end":return e.stop()}}),e,null,[[0,7]])})));return function(){return e.apply(this,arguments)}}(),x=(0,l.useMemo)((function(){var e=(0,Ue.VN)(),n=t[e],a=(0,i.Z)(t,[e].map(Te.Z)),o=n?[n]:[],s=Object.values(a);return o.push.apply(o,(0,r.Z)(s.filter((function(e){return e.online}))).concat((0,r.Z)(s.filter((function(e){return!e.online}))))),o}),[t]),g=(0,l.useMemo)((function(){return x.filter((function(e){return e.online})).length}),[x]),m=(0,X.jsxs)("div",{className:"team-popover",children:[a||(0,X.jsx)(Fe.Z,{className:"disconn-alert",message:"Network failed.",icon:(0,X.jsx)(Ge.Z,{}),type:"error",showIcon:!0,banner:!0}),(0,X.jsx)(Ve.GD,{className:"code-display",value:String(n),length:4,plain:!0}),(0,X.jsx)(te.Z,{icon:(0,X.jsx)(Xe.Z,{}),className:"share-btn",onClick:v,block:!0,children:"Share"}),(0,X.jsx)(Le.Z,{}),(0,X.jsx)("div",{className:"user-list",children:x.map((function(e){return(0,X.jsx)(rn,{userID:e.userID},e.userID)}))})]}),Z=(0,l.useState)(!1),h=(0,s.Z)(Z,2),j=h[0],k=h[1],b=(0,X.jsxs)("div",{className:"team-title",children:[(0,X.jsx)("span",{children:"Team info"}),(0,X.jsx)(te.Z,{shape:"circle",type:"text",size:"small",loading:j,icon:(0,X.jsx)(Be.Z,{}),onClick:(0,o.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return k(!0),e.next=3,u();case 3:return e.next=5,d();case 5:k(!1),f();case 7:case"end":return e.stop()}}),e)})))})]});return(0,X.jsx)(W.Z,{content:m,trigger:"click",placement:"bottomRight",title:b,getPopupContainer:function(e){return e.parentElement},children:(0,X.jsx)(te.Z,{type:"text",icon:(0,X.jsx)(Ae.Z,{status:a?"success":"error",count:a?g:"!",size:"small",children:(0,X.jsx)(Je.Z,{})})})})},on=function(e){var n,t=e.instantSave,r=null!==(n=(0,y.UO)().noteID)&&void 0!==n?n:"",a=(0,y.s0)(),i=function(){var e=(0,o.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return e.next=4,(0,Ye.r8)(r);case 4:if(e.sent){e.next=7;break}return e.abrupt("return",je.ZP.error("Can't create room."));case 7:return e.next=9,(0,w.SP)(r,{team:!0});case 9:a("/team/"+r);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,X.jsx)(te.Z,{type:"text",icon:(0,X.jsx)(Qe.Z,{}),onClick:function(){ze.Z.confirm({title:"Enable team editing",content:"This will make your note public to anyone with the link.",icon:(0,X.jsx)(Je.Z,{style:{color:"#555"}}),onOk:i})}})},sn=["saved","instantSave"],un=function(e){var n=e.saved,t=e.instantSave,r=(0,i.Z)(e,sn);return(0,X.jsxs)("header",{children:[(0,X.jsx)(he,{saved:n,instantSave:t}),(0,X.jsx)(Ne,(0,a.Z)({},r)),(0,X.jsx)(nn,{instantSave:t})]})},cn=["pageRec","pdf","pageOrder"],ln=["image","marked"];function dn(){var e,n,t,u=null!==(e=(0,y.UO)().noteID)&&void 0!==e?e:"",g=(0,y.s0)(),m=(0,l.useState)(),j=(0,s.Z)(m,2),k=j[0],I=j[1],D=(0,l.useState)(),P=(0,s.Z)(D,2),C=P[0],N=P[1],A=(0,l.useState)(),z=(0,s.Z)(A,2),M=z[0],V=z[1],U=(0,l.useState)(),H=(0,s.Z)(U,2),K=H[0],W=H[1],_=(0,v.Z)(!0),G=(0,s.Z)(_,2),B=G[0],J=G[1],Q=(0,l.useContext)($.TeamCtx),Y=Q.io,ee=Q.teamOn,ne=Q.addTeamStatePage,te=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],t=(0,l.useState)((0,h.D5)()),r=(0,s.Z)(t,2),a=r[0],i=r[1],u=(0,l.useRef)(!1),d=(0,l.useState)(""),f=(0,s.Z)(d,2),p=f[0],v=f[1],x=(0,l.useState)((0,h.D5)()),g=(0,s.Z)(x,2),m=g[0],Z=g[1],j=(0,l.useMemo)((function(){return E(m,n)}),[m,n]);(0,l.useDebugValue)(j),(0,l.useEffect)((function(){(0,o.Z)(c().mark((function n(){var t;return c().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,O.getItem(e);case 2:if(t=n.sent){n.next=5;break}return n.abrupt("return",u.current=!0);case 5:v(t);case 6:case"end":return n.stop()}}),n)})))()}),[e]),(0,l.useEffect)((function(){!u.current&&a.has(p)&&requestAnimationFrame((function(){var e;null===(e=a.get(p))||void 0===e||e.scrollIntoView(),u.current=!0}))}),[p,a]),(0,l.useEffect)((function(){u.current&&R(e,j)}),[e,j]);var k=function(e){return function(n){n&&i((function(t){return t.set(e,n)}))}},b=(0,l.useRef)(0),w=(0,l.useState)(!1),S=(0,s.Z)(w,2),y=S[0],I=S[1];return{scrollPage:function(e){var n;I(!0),document.addEventListener("scroll",(function e(){cancelAnimationFrame(b.current),requestAnimationFrame((function(){b.current=requestAnimationFrame((function(){I(!1),document.removeEventListener("scroll",e)}))}))})),null===(n=a.get(e))||void 0===n||n.scrollIntoView({behavior:"smooth"})},setInviewRatios:Z,sectionRef:k,currPageID:j,scrolling:y}}(u,K),ae=te.setInviewRatios,ie=te.scrollPage,oe=te.sectionRef,se=te.currPageID,ue=te.scrolling;(0,l.useEffect)((function(){(0,o.Z)(c().mark((function e(){var n,t,r,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,w.U9)(u);case 2:if(n=e.sent){e.next=6;break}return je.ZP.error("Note not found"),e.abrupt("return",g("/"));case 6:t=n.pageRec,n.pdf,r=n.pageOrder,a=(0,i.Z)(n,cn),I((0,h.D5)(t)),W(r),N(a),V(b.createFromPages(t));case 11:case"end":return e.stop()}}),e)})))()}),[g,u,ee]),(0,l.useEffect)((function(){C&&(document.title=C.name+" - Multibility")}),[C]);var le=(0,x.Z)((0,o.Z)(c().mark((function e(){var n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=null===k||void 0===k?void 0:k.toObject(),e.next=3,(0,w.SP)(u,{pageRec:n});case 3:J(!0);case 4:case"end":return e.stop()}}),e)})))),de=(0,l.useCallback)((0,T.Z)(le,2e3),[le]),fe=de.flush,pe=function(e,n){I((function(t){return null===t||void 0===t?void 0:t.update(e,d.BJ,n)})),J(!1),de()},ve=function(){var e=(0,o.Z)(c().mark((function e(n){var t,r=arguments;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return t=r.length>1&&void 0!==r[1]&&r[1],W(n),e.next=4,(0,w.SP)(u,{pageOrder:n});case 4:return e.next=6,fe();case 6:t&&xe(n);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),xe=function(e){return null===Y||void 0===Y?void 0:Y.emit("reorder",{pageOrder:e})},ge=(0,x.Z)((function(e){var n=e.deleted,t=e.pageOrder,r=e.prevOrder;ve(t),n&&(0,S.Ow)((function(){return ve(r,!0)}))})),me=(0,x.Z)((function(e){var n=e.pageOrder,t=e.pageID,r=e.newPage;ve(n),pe(t,(function(){return r})),V((function(e){return null===e||void 0===e?void 0:e.addState(t,r)}))}));(0,l.useEffect)((function(){return null===Y||void 0===Y||Y.on("reorder",ge),null===Y||void 0===Y||Y.on("newPage",me),function(){null===Y||void 0===Y||Y.removeAllListeners()}}),[Y,ge,me]);var Ze=function(e,n,t){t.image,t.marked;var r=(0,i.Z)(t,ln);null===Y||void 0===Y||Y.emit("newPage",{pageOrder:e,pageID:n,newPage:r}),ne(n,t)},he=function(e,n){var t=Z.Dw.flaten(n);pe(e,(function(e){return(0,a.Z)((0,a.Z)({},e),{},{state:t})}))},ke=function(e){if(M){var n=e(M);if(n!==M){V(n);var t,a=n.getLastDS(),i=n.lastOp;if(a&&i)he.apply(void 0,(0,r.Z)(a)),t=i,null===Y||void 0===Y||Y.emit("push",{operation:t},(function(e){var n=e.pageID,t=e.stroke;return V((function(e){return null===e||void 0===e?void 0:e.syncStrokeTime(n,t)}))}))}}},be=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(K){var t=n?null===k||void 0===k?void 0:k.get(e):void 0,r=(0,d.D4)(t),a=(0,s.Z)(r,2),i=a[0],o=a[1],u=L(K,e,i);Ze(u,i,o),ve(u),pe(i,(function(){return o})),V((function(e){return null===e||void 0===e?void 0:e.addState(i,o)}))}},we=function(){var e=(0,F.Z)(K);e&&be(e)},Se={noteID:u,pageRec:k,pageOrder:K,stateSet:M,currPageID:se},ye=(0,X.jsxs)("div",{className:"reader container",children:[(0,X.jsx)(un,{saved:B,instantSave:fe,handleUndo:function(){return ke((function(e){return e.undo()}))},handleRedo:function(){return ke((function(e){return e.redo()}))},undoable:null!==(n=null===M||void 0===M?void 0:M.isUndoable())&&void 0!==n&&n,redoable:null!==(t=null===M||void 0===M?void 0:M.isRedoable())&&void 0!==t&&t}),(0,X.jsxs)("main",{children:[null===K||void 0===K?void 0:K.map((function(e){return(0,X.jsx)("section",{className:"note-page",ref:oe(e),children:(0,X.jsx)(fn,(0,a.Z)({uid:e,updateStateSet:ke,setInviewRatios:ae,scrolling:ue},Se))},e)})),(0,X.jsx)(re,{addFinalPage:we})]}),(0,X.jsx)(ce,(0,a.Z)({addPage:be,addFinalPage:we,scrollPage:ie,deletePage:function(e){var n=null===K||void 0===K?void 0:K.filter((function(n){return n!==e}));(null===n||void 0===n?void 0:n.length)&&ve(n,!0)},saveReorder:ve,switchPageMarked:function(e){return pe(e,(function(e){return(0,a.Z)((0,a.Z)({},e),{},{marked:!e.marked})}))}},Se))]});return(0,X.jsx)(q.kV,{children:(0,X.jsx)(p.Wk,{children:(0,X.jsx)(f.w3,{children:ye})})})}var fn=function(e){var n=e.uid,t=e.updateStateSet,r=e.setInviewRatios,a=e.scrolling,i=e.pageRec,o=e.stateSet,s=e.currPageID,u=e.pageOrder,c=e.noteID,d=(0,l.useContext)($.TeamCtx),f=d.teamState,p=d.ignores,v=null===i||void 0===i?void 0:i.get(n),g=null===o||void 0===o?void 0:o.getOneState(n),m=null===f||void 0===f?void 0:f.getOnePageStateMap(n),Z=(0,x.Z)((function(e){t((function(t){return t.setState(n,e)}))})),h=(0,x.Z)((function(e){if(!e)return r((function(e){return e.delete(n)}));r((function(t){return t.set(n,e)}))})),j=(0,l.useMemo)((function(){if(!u)return!1;var e=u.indexOf(s),t=u.indexOf(n);return Math.abs(t-e)<=1}),[s,n,u]);return v&&g?(0,X.jsx)(I.default,{drawState:g,teamStateMap:m,updateState:Z,pdfIndex:v.pdfIndex,noteID:c,ignores:p,onViewChange:h,preload:j,skipInView:a}):null}},60559:function(e,n,t){t.r(n),t.d(n,{TeamCtx:function(){return j},default:function(){return k}});var r=t(29439),a=t(15861),i=t(87757),o=t.n(i),s=t(72791),u=t(51570),c=t(78577),l=t(69951),d=function(e){return function(){return(0,c.io)(u._n,{query:{userID:(0,l.VN)(),userName:(0,l.vW)(),noteID:e}})}},f=t(16871),p=t(49742),v=t(79856),x=t(91835),g=t(50419),m=t(24124),Z=t(87850),h=t(80184),j=s.createContext({io:void 0,code:0,teamOn:!1,connected:!1,ignores:(0,m.l4)(),userRec:{},teamState:void 0,resetIO:function(){},loadInfo:function(){var e=(0,a.Z)(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),loadState:function(){var e=(0,a.Z)(o().mark((function e(){return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),setIgnores:function(){},addTeamStatePage:function(e,n){}});function k(){var e,n=null!==(e=(0,f.UO)().noteID)&&void 0!==e?e:"",t=(0,s.useState)(),i=(0,r.Z)(t,2),c=i[0],k=i[1],b=(0,s.useState)(-2),w=(0,r.Z)(b,2),S=w[0],y=w[1],I=(0,s.useState)({}),D=(0,r.Z)(I,2),P=D[0],C=D[1],N=(0,s.useState)((0,m.l4)()),O=(0,r.Z)(N,2),R=O[0],E=O[1],T=(0,s.useState)(d(n)),F=(0,r.Z)(T,2),L=F[0],A=F[1],z=(0,s.useState)(!1),M=(0,r.Z)(z,2),V=M[0],U=M[1],H=(0,s.useState)(!1),K=(0,r.Z)(H,2),W=K[0],_=K[1],q=(0,f.s0)(),G=(0,s.useCallback)((0,a.Z)(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.dn)(n);case 2:if(t=e.sent){e.next=6;break}return g.ZP.error("Failed loading the team note info"),e.abrupt("return",!1);case 6:return y(t.code),e.abrupt("return",!0);case 8:case"end":return e.stop()}}),e)}))),[n]),X=(0,s.useCallback)((0,a.Z)(o().mark((function e(){var t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,u.CD)(n);case 2:if(t=e.sent){e.next=6;break}return g.ZP.error("Failed loading the team note state"),e.abrupt("return",!1);case 6:return k(v.f.createFromTeamPages(t)),e.abrupt("return",!0);case 8:case"end":return e.stop()}}),e)}))),[n]),B=(0,s.useCallback)((function(){(0,u.f1)(n)}),[n]);(0,s.useEffect)((function(){var e=function(){var e=(0,a.Z)(o().mark((function e(){var n,t;return o().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,G();case 2:return n=e.sent,e.next=5,X();case 5:if(t=e.sent,n&&t){e.next=8;break}return e.abrupt("return",q("/"));case 8:U(!0),B();case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return e(),B}),[G,X,q,B]),(0,s.useEffect)((function(){return L.on("push",(function(e){var n=e.operation,t=e.userID;k((function(e){return null===e||void 0===e?void 0:e.pushOperation(n,t)}))})),L.on("join",(function(e){var n=e.joined,t=e.members,r=n.userID,a=n.userName;C(t),r!==(0,l.VN)()&&(0,p.gd)(r,a)})),L.on("leave",(function(e){var n=e.leaved,t=e.members,r=n.userID,a=n.userName;if(C(t),r===(0,l.VN)())return L.emit("join");(0,p.mz)(r,a)})),L.on("newPage",(function(e){var n=e.pageID,t=e.newPage;k((function(e){return null===e||void 0===e?void 0:e.addPage(n,t)}))})),L.on("reset",(function(e){var n=e.userID,t=e.pageRec;n!==(0,l.VN)()&&k((function(e){return null===e||void 0===e?void 0:e.resetUser(n,t)}))})),L.on("connect_error",console.error),L.on("connect",(function(){return _(!0)})),L.on("disconnect",(function(){return _(!1)})),function(){L.removeAllListeners(),L.close()}}),[L]);return(0,h.jsx)(x.g,{loading:!V,children:(0,h.jsx)(j.Provider,{value:{io:L,code:S,teamOn:!0,ignores:R,userRec:P,connected:W,teamState:c,resetIO:function(){return A(d(n))},loadInfo:G,loadState:X,setIgnores:E,addTeamStatePage:function(e,n){k((function(t){return null===t||void 0===t?void 0:t.addPage(e,n)}))}},children:(0,h.jsx)(Z.default,{})})})}},49742:function(e,n,t){t.d(n,{Ow:function(){return u},gd:function(){return c},mz:function(){return l}});var r=t(50419),a=t(87309),i=t(56058),o=t(87962),s=t(80184),u=function(e){r.ZP.warning({content:(0,s.jsxs)(s.Fragment,{children:["One page was deleted.",(0,s.jsx)(a.Z,{size:"small",type:"link",onClick:function(){r.ZP.destroy("DELETE"),e()},children:"Undo"})]}),key:"DELETE",duration:10})},c=function(e,n){r.ZP.destroy(e),r.ZP.success({content:"".concat(n," joined the room"),icon:(0,s.jsx)(i.Z,{}),key:e})},l=function(e,n){r.ZP.destroy(e),r.ZP.warning({content:"".concat(n," leaved the room"),icon:(0,s.jsx)(o.Z,{}),key:e})}}}]);
//# sourceMappingURL=794.c8e8053a.chunk.js.map