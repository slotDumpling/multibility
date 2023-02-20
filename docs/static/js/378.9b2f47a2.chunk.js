"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[378,560],{10814:function(e,n,t){t.r(n),t.d(n,{default:function(){return bn}});var r=t(1413),a=t(74165),i=t(45987),o=t(15861),s=t(29439),u=t(72791),c=t(92198),l=t(70587),d=t(81832),f=t(98211),p=t(15671),v=t(43144),g=t(82670),m=t(24124),x={states:(0,m.D5)(),editStack:(0,m.aV)(),undoStack:(0,m.aV)()},Z=(0,m.WV)(x),h=function(){function e(n,t){(0,p.Z)(this,e),this.immutable=n,this.lastOp=t}return(0,v.Z)(e,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getStates",value:function(){return this.getImmutable().get("states")}},{key:"getOneState",value:function(e){return this.getStates().get(e)}},{key:"getEditStack",value:function(){return this.getImmutable().get("editStack")}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"setState",value:function(n,t){var a=this.getOneState(n);if(!a||a===t)return this;var i=this.getImmutable().update("states",(function(e){return e.set(n,t)})).update("editStack",(function(e){return e.push(n)})).delete("undoStack"),o=t.lastOp;return new e(i,o&&(0,r.Z)((0,r.Z)({},o),{},{pageID:n}))}},{key:"syncStrokeTime",value:function(e,n,t){var r=this.getOneState(e);return r&&g.Dw.syncStrokeTime(r,n,t),this}},{key:"addState",value:function(n,t){var r=t.state,a=t.ratio,i=g.Dw.loadFromFlat(r,a);return new e(this.getImmutable().update("states",(function(e){return e.set(n,i)})))}},{key:"deleteState",value:function(n){return new e(this.getImmutable().update("states",(function(e){return e.delete(n)})))}},{key:"isUndoable",value:function(){return this.getEditStack().size>0}},{key:"isRedoable",value:function(){return this.getUndoStack().size>0}},{key:"undo",value:function(){if(!this.isUndoable())return this;var n=this.getEditStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=g.Dw.undo(t),i=a.lastOp,o=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("editStack",(function(e){return e.pop()})).update("undoStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),o)}},{key:"redo",value:function(){if(!this.isRedoable())return this;var n=this.getUndoStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=g.Dw.redo(t),i=a.lastOp,o=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("undoStack",(function(e){return e.pop()})).update("editStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),o)}}],[{key:"createFromPages",value:function(n){return new e(Z().set("states",(0,m.D5)(n).map((function(e){var n=e.state,t=e.ratio;return g.Dw.loadFromFlat(n,t)}))))}}]),e}(),j=t(75783),k=t(49742),b=t(57689),S=t(241),w=t(37762),y=t(93433),I=t(61842),D=t.n(I),C=t(763),P=D().createInstance({name:"scroll"}),N=(0,C.debounce)((function(e,n){P.setItem(e,n)}),2e3);var O=function(e,n){var t,r="",a=0,i=(0,w.Z)(n);try{for(i.s();!(t=i.n()).done;){var o=t.value,s=e.get(o);if(s){if(1===s)return o;s>a&&(r=o,a=s)}}}catch(u){i.e(u)}finally{i.f()}return r};function E(e,n,t){var r=e.indexOf(n),a=e.slice();return-1===r||a.splice(r+1,0,t),a}var R=t(79286),T=t(23414),L=t(82622),z=t(10711),M=t(52234),F=t(98757),V=t(2649),A=t(36090),U=t(69228),B=t(96851),H=t(26987),K=t(87309),W=t(70776),X=t(25581),_=t(52365),G=t(74115),q=t(80184),J=function(e){var n=e.userInfo,t=e.size,r=void 0===t?"default":t,a=e.onClick,i=void 0===a?function(){}:a,o=e.chosen,s=void 0!==o&&o,c=e.className,l=(0,u.useMemo)((function(){return(0,G.bM)(n.userID)}),[n]);if(!n)return null;var d=n.userName;return(0,q.jsx)(V.C,{className:c,"data-chosen":s,size:r,style:{backgroundColor:l},children:(0,q.jsx)("div",{className:"avatar-wrapper",onClick:i,children:null===d||void 0===d?void 0:d.slice(0,3)})})},Q=t(22568),Y=t(81694),$=t.n(Y),ee=t(60559),ne=t(13892),te=t(79856),re=function(e){var n=e.addFinalPage;return(0,q.jsx)(K.Z,{type:"dashed",icon:(0,q.jsx)(R.Z,{}),block:!0,onClick:n,children:"New page"})},ae=t(56983),ie=t(24805),oe=["left"],se=["ref"],ue=["cardDragged"],ce=["uid","pageIndex","refRec","cardDragged"],le=["uid","index","chosen","setChosen","page","userIDs"],de=function(e){var n=(0,u.useState)(!1),t=(0,s.Z)(n,2),a=t[0],i=t[1],o=(0,_.LH)(),c=(0,s.Z)(o,1)[0],l=(0,q.jsx)(F._l,{draggableId:"OPPOSITE",index:a?1:0,isDragDisabled:!0,children:function(e){var n=e.innerRef;return(0,q.jsx)("div",{className:"opposite",ref:n})}});return(0,q.jsx)(ae.Z,{in:c,timeout:300,unmountOnExit:!0,children:(0,q.jsx)(_.s2,{initKey:"ALL",children:(0,q.jsx)(F.Z5,{onDragEnd:function(e){var n=e.destination;0===(null===n||void 0===n?void 0:n.index)&&i(!0),1===(null===n||void 0===n?void 0:n.index)&&i(!1)},children:(0,q.jsx)(F.bK,{droppableId:"preview-drop",direction:"horizontal",children:function(n,t){var i=n.droppableProps,o=n.innerRef,s=n.placeholder,u=t.isDraggingOver;return(0,q.jsxs)("aside",(0,r.Z)((0,r.Z)({className:"preview-drop","data-left":a,ref:o,"data-dragged":u},i),{},{children:[l,(0,q.jsx)(fe,(0,r.Z)({left:a},e)),s]}))}})})})})},fe=function(e){var n=e.left,t=(0,i.Z)(e,oe),a=(0,_.zI)(),o=(0,s.Z)(a,1)[0],u=(0,_.LH)(),c=(0,s.Z)(u,2)[1],l={ALL:"All Pages",MARKED:"Bookmarks",WRITTEN:"Notes"}[o],d=(0,ne.QS)({onSwipedLeft:function(){n&&c(!1)},onSwipedRight:function(){n||c(!1)},swipeDuration:200}),f=d.ref,p=(0,i.Z)(d,se);return(0,q.jsx)(F._l,{draggableId:"CARD",index:n?0:1,children:function(e,n){var a=e.innerRef,i=e.draggableProps,o=e.dragHandleProps,s=n.isDragging,u=n.isDropAnimating;return(0,q.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({className:"preview-card",ref:function(e){a(e),f(e)},"data-animating":u},i),p),{},{children:[(0,q.jsx)("div",(0,r.Z)({className:"drag-handle"},o)),(0,q.jsx)("h3",{children:l}),(0,q.jsx)(Ze,{}),(0,q.jsx)(pe,(0,r.Z)({cardDragged:s},t)),(0,q.jsx)(he,(0,r.Z)({},t))]}))}})},pe=u.memo((function(e){var n=e.cardDragged,t=(0,i.Z)(e,ue),a=(0,u.useRef)({}),o=(0,_.zI)(),c=(0,s.Z)(o,1)[0],l=(0,_.LH)(),d=(0,s.Z)(l,1)[0],p=t.pageOrder,v=t.currPageID,g=t.saveReorder,m=t.addFinalPage,x=(0,f.Z)((function(){var e;null===(e=a.current[v])||void 0===e||e.scrollIntoView()}));return(0,u.useLayoutEffect)((function(){d&&x()}),[d,c,x]),(0,q.jsx)(F.Z5,{onDragEnd:function(e){var n=e.source,t=e.destination;if(t&&p){var r=n.index,a=t.index,i=p[r];if(r!==a&&i){var o=function(e,n,t){var r=e.slice(),a=r.splice(n,1),i=(0,s.Z)(a,1)[0];return i?(r.splice(t,0,i),r):e}(p,r,a);g(o,!0)}}},children:(0,q.jsx)(F.bK,{droppableId:"preview-list",isDropDisabled:n,children:function(e){var i=e.droppableProps,o=e.innerRef,s=e.placeholder;return(0,q.jsxs)("div",(0,r.Z)((0,r.Z)({className:"page-list",ref:o},i),{},{children:[p.map((function(e,i){return(0,q.jsx)(ve,(0,r.Z)({uid:e,pageIndex:i,refRec:a.current,cardDragged:n},t),e)})),s,"ALL"===c&&(0,q.jsx)(re,{addFinalPage:m})]}))}})})}));pe.displayName="PageList";var ve=function(e){var n=e.uid,t=e.pageIndex,a=e.refRec,o=e.cardDragged,c=(0,i.Z)(e,ce),l=c.stateSet,d=c.pageRec,f=c.currPageID,p=c.scrollPage,v=(0,u.useContext)(ee.TeamCtx),g=v.teamState,m=v.ignores,x=(0,_.zI)(),Z=(0,s.Z)(x,1)[0],h=(0,u.useState)(""),j=(0,s.Z)(h,2),k=j[0],b=j[1],w=d.get(n),y=l.getOneState(n),I=null===g||void 0===g?void 0:g.getOnePageStateMap(n),D=(0,u.useRef)(!1);D.current="MARKED"===Z&&((null===w||void 0===w?void 0:w.marked)||D.current);var C=(0,u.useMemo)((function(){return te.f.getValidUsers(I,m)}),[I,m]);if(!w||!y)return null;if("WRITTEN"===Z&&y.isEmpty()&&te.f.isEmpty(I))return null;if("MARKED"===Z&&!D.current)return null;var P=f===n;return(0,q.jsx)(F._l,{draggableId:n,index:t,isDragDisabled:"ALL"!==Z||o,children:function(e,i){var s=e.innerRef,u=e.draggableProps,l=e.dragHandleProps,d=i.isDragging,f=i.isDropAnimating;return(0,q.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({ref:function(e){s(e),e&&(a[n]=e)},className:"page","data-curr":P,"data-dragged":d,"data-animating":f,onClick:function(){return p(n)}},u),l),{},{children:[(0,q.jsx)(S.default,{drawState:(null===I||void 0===I?void 0:I.get(k))||y,teamStateMap:k?void 0:I,thumbnail:w.image,ignores:m,preview:!0,skipInView:d||o}),(0,q.jsx)(ge,(0,r.Z)({uid:n,index:t,chosen:k,setChosen:b,page:w,userIDs:C},c))]}))}})},ge=u.memo((function(e){var n=e.uid,t=e.index,a=e.chosen,o=e.setChosen,s=e.page,u=e.userIDs,c=(0,i.Z)(e,le),l=c.switchPageMarked;return(0,q.jsxs)("div",{className:"tools",onClick:function(e){return e.stopPropagation()},children:[(0,q.jsx)("div",{className:"bookmark","data-marked":s.marked,onClick:function(){return l(n)}}),(0,q.jsx)("div",{className:"index",children:t+1}),(0,q.jsx)(xe,(0,r.Z)({uid:n},c)),(0,q.jsx)(me,{userIDs:u,chosen:a,setChosen:o})]})}));ge.displayName="PreviewTools";var me=function(e){var n=e.userIDs,t=e.chosen,r=e.setChosen,a=(0,u.useContext)(ee.TeamCtx).userRec;return(0,q.jsx)(V.C.Group,{maxCount:2,size:"default",className:$()("team-group",{chosen:t}),maxPopoverPlacement:"bottom",children:n.map((function(e){var n=a[e];return n?(0,q.jsx)(J,{size:"default",userInfo:n,className:"preview-avatar",chosen:t===e,onClick:function(){return r((function(n){return n===e?"":e}))}},e):null}))})},xe=function(e){var n=e.uid,t=e.addPage,r=e.deletePage,a=(0,q.jsx)(A.Z,{items:[{key:"ADD",icon:(0,q.jsx)(R.Z,{}),label:"Add page",onClick:function(){return t(n)}},{key:"COPY",icon:(0,q.jsx)(T.Z,{}),label:"Duplicate",onClick:function(){return t(n,!0)}},{key:"DELETE",icon:(0,q.jsx)(L.Z,{}),label:"Delete",danger:!0,onClick:function(){return r(n)}}]});return(0,q.jsx)(U.Z,{content:a,trigger:"click",placement:"left",destroyTooltipOnHide:!0,getPopupContainer:function(e){var n,t;return null===(n=e.parentElement)||void 0===n||null===(t=n.parentElement)||void 0===t?void 0:t.parentElement},children:(0,q.jsx)("div",{className:"option",children:(0,q.jsx)(z.Z,{})})})},Ze=u.memo((function(){var e=(0,_.zI)(),n=(0,s.Z)(e,2),t=n[0],r=n[1];return(0,q.jsx)(B.Z,{className:"tabs",activeKey:t,onChange:r,tabBarGutter:0,size:"small",centered:!0,items:[{key:"ALL",label:(0,q.jsx)(Q.Z,{type:"icon-uf_paper"})},{key:"MARKED",label:(0,q.jsx)(Q.Z,{type:"icon-bookmark2"})},{key:"WRITTEN",label:(0,q.jsx)(Q.Z,{type:"icon-write"})}]})}));Ze.displayName="PreviewTabs";var he=function(e){var n=e.currPageID,t=e.pageOrder,r=e.scrollPage,a=e.size,i=e.setSize,o=(0,u.useMemo)((function(){var e;return(null!==(e=t.indexOf(n))&&void 0!==e?e:0)+1}),[n,t]),s=t&&(0,q.jsx)(H.Z,{pageSize:1,total:t.length,simple:!0,current:o,onChange:function(e){var n=t[e-1];n&&r(n)}});return(0,q.jsxs)("footer",{children:[(0,q.jsx)(U.Z,{content:s,trigger:"click",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,q.jsxs)(K.Z,{type:"text",size:"small",children:[o," / ",t.length]})}),(0,q.jsx)(je,{}),(0,q.jsx)(W.Z,{className:"size-select",popupClassName:"size-drop",size:"small",bordered:!1,showArrow:!1,dropdownMatchSelectWidth:80,options:[40,60,80,100].map((function(e){return{value:e,label:e+"%"}})),value:a,onChange:i,placement:"topRight",getPopupContainer:function(e){return e.parentElement}})]})},je=function(){var e=(0,l.gX)().finger,n=(0,l.F7)(),t=(0,d.iX)(),r=(0,s.Z)(t,2),a=r[0],i=r[1],o=(0,ie.useMediaQuery)({query:"(prefers-color-scheme: light)"}),u=(0,q.jsxs)(q.Fragment,{children:[(0,q.jsxs)("div",{className:"footer-option",children:[(0,q.jsx)("span",{children:"Pencil only"}),(0,q.jsx)(X.Z,{size:"small",checked:!e,onChange:function(e){return n({finger:!e})}})]}),(0,q.jsxs)("div",{className:"footer-option",children:[(0,q.jsx)("span",{children:"Light mode"}),(0,q.jsx)(X.Z,{size:"small",checked:a||o,disabled:o,onChange:i})]})]});return(0,q.jsx)(U.Z,{getPopupContainer:function(e){return e.parentElement},trigger:"click",content:u,placement:"topRight",children:(0,q.jsx)(K.Z,{className:"option-btn",size:"small",type:"text",shape:"circle",icon:(0,q.jsx)(M.Z,{style:{opacity:.5}})})})},ke=t(52242),be=t(65323),Se=function(e){var n=e.saved,t=e.instantSave,r=(0,b.s0)();return(0,q.jsxs)("div",{className:"left",children:[(0,q.jsx)(K.Z,{type:"text",onClick:(0,o.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:r("/");case 3:case"end":return e.stop()}}),e)}))),icon:(0,q.jsx)(ke.Z,{style:{opacity:.8}})}),(0,q.jsx)(K.Z,{type:"text",className:"save",onClick:t,disabled:n,icon:(0,q.jsx)(be.Z,{})})]})},we=t(53163),ye=t(78030),Ie=t(50446),De=t(76849),Ce=t(62),Pe=t(14965),Ne=t(2721),Oe={type:"text",shape:"circle"},Ee=function(e){var n=e.handleUndo,t=e.handleRedo,a=e.undoable,i=e.redoable,o=(0,l.gX)().mode,s=(0,l.F7)();return(0,q.jsxs)("div",{className:"middle",children:[(0,q.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Oe),{},{icon:(0,q.jsx)(ye.Z,{}),onClick:n,disabled:!a})),(0,q.jsx)(K.Z,(0,r.Z)((0,r.Z)({className:"redo-btn"},Oe),{},{icon:(0,q.jsx)(Ie.Z,{}),onClick:t,disabled:!i})),(0,q.jsx)(Re,{}),(0,q.jsx)(Te,{}),(0,q.jsx)(K.Z,{shape:"circle",type:"text"===o?"link":"text",onClick:function(){return s({mode:"text"})},icon:(0,q.jsx)(Q.Z,{type:"icon-text1"})}),(0,q.jsx)(Le,{})]})},Re=function(){var e=(0,l.gX)(),n=e.mode,t=e.color,a=(0,l.F7)();return"draw"===n?(0,q.jsx)(U.Z,{content:(0,q.jsx)(Ne.Uk,{updateDrawCtrl:a,drawCtrl:e}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,q.jsx)(K.Z,{type:"link",icon:(0,q.jsx)(De.Z,{twoToneColor:t,className:"pen-icon"})})}):(0,q.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Oe),{},{onClick:function(){return a({mode:"draw"})},icon:(0,q.jsx)(Ce.Z,{})}))},Te=function(){var e=(0,l.gX)(),n=e.mode,t=e.pixelEraser,a=e.globalEraser,i=(0,l.F7)();return"erase"===n?(0,q.jsx)(U.Z,{content:(0,q.jsxs)("div",{className:"width-seg-wrapper",children:[(0,q.jsx)(we.Z,{block:!0,size:"small",className:"pixel-seg",options:["Pixel","Object"],value:t?"Pixel":"Object",onChange:function(e){i("Pixel"===e?{pixelEraser:!0}:{pixelEraser:!1})}}),(0,q.jsx)(Ne.Db,{drawCtrl:e,updateDrawCtrl:i,field:"eraserWidth"}),t||(0,q.jsxs)("div",{className:"global-switch",children:[(0,q.jsx)("span",{children:"Global"}),(0,q.jsx)(X.Z,{size:"small",checked:a,onChange:function(e){return i({globalEraser:e})}})]})]}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,q.jsx)(K.Z,{type:"link",icon:(0,q.jsx)(Q.Z,{type:"icon-eraser"})})}):(0,q.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Oe),{},{onClick:function(){return i({mode:"erase"})},icon:(0,q.jsx)(Q.Z,{type:"icon-eraser"})}))},Le=function(){var e=(0,l.gX)(),n=e.lasso,t=e.mode,a=(0,l.F7)(),i=n?(0,q.jsx)(Q.Z,{type:"icon-lasso1"}):(0,q.jsx)(Pe.Z,{});return"select"===t?(0,q.jsx)(K.Z,{type:"link",icon:i,onClick:function(){return a({lasso:!n})}}):(0,q.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Oe),{},{icon:i,onClick:function(){return a({mode:"select"})}}))},ze=t(49142),Me=t(33441),Fe=t(91333),Ve=t(75594),Ae=t(50419),Ue=t(50759),Be=t(95055),He=t(78502),Ke=t(69951),We=t(67575),Xe=t(30501),_e=t(98272),Ge=t(24215),qe=t(37557),Je=t(78823),Qe=t(17973),Ye=t(23605),$e=t(56200),en=t(18301),nn=t(51570),tn=t(1829),rn=t.n(tn),an=function(e){var n=e.instantSave,t=(0,u.useContext)(ee.TeamCtx).teamOn;return(0,q.jsxs)("div",{className:"right",children:[t?(0,q.jsx)(cn,{}):(0,q.jsx)(ln,{instantSave:n}),(0,q.jsx)(on,{})]})},on=function(){var e=(0,_.LH)(),n=(0,s.Z)(e,2),t=n[0],r=n[1];return(0,q.jsx)(K.Z,{type:t?"link":"text",icon:(0,q.jsx)(Q.Z,{type:"icon-cards"}),onClick:function(){return r((function(e){return!e}))}})},sn=function(e){var n=e.userInfo,t=(0,u.useState)(!1),r=(0,s.Z)(t,2),a=r[0],i=r[1],o=(0,u.useContext)(ee.TeamCtx),c=o.ignores,l=o.setIgnores,d=o.resetIO;if((0,u.useEffect)((function(){return i(!1)}),[n]),!n)return null;var f=n.userName,p=n.online,v=n.userID,g=v===(0,Ke.VN)(),m=c.has(v)&&!g;return(0,q.jsxs)("div",{className:"user-item","data-online":p,children:[(0,q.jsx)(J,{userInfo:n,size:"small",className:"room-avatar"}),a||(0,q.jsx)("span",{className:"user-name",children:f}),a&&(0,q.jsx)(Be.Z,{autoFocus:!0,className:"rename-input",defaultValue:f,onSearch:function(e){var n=e.trim();if(!n||n===f)return i(!1);(0,Ke.lu)(n),d()},enterButton:(0,q.jsx)(K.Z,{icon:(0,q.jsx)(We.Z,{})})}),g?a||(0,q.jsx)(K.Z,{type:"text",icon:(0,q.jsx)(Xe.Z,{}),onClick:function(){return i(!0)}}):(0,q.jsx)(K.Z,{type:"text",icon:m?(0,q.jsx)(_e.Z,{}):(0,q.jsx)(Ge.Z,{}),onClick:function(){l((function(e){return e.has(v)?e.delete(v):e.add(v)}))}})]})},un=function(){var e=(0,u.useState)(!1),n=(0,s.Z)(e,2),t=n[0],r=n[1],i=window.location.href,c=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,rn()("".concat(document.title,"\n").concat(i));case 3:r(!0),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log(e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(){return e.apply(this,arguments)}}();return(0,q.jsx)(K.Z,{icon:t?(0,q.jsx)(qe.Z,{}):(0,q.jsx)(Je.Z,{}),type:t?"primary":"default",className:"share-btn",onClick:c,block:!0,children:t?"Copied":"Copy link"})},cn=function(){var e=(0,u.useContext)(ee.TeamCtx),n=e.code,t=e.userRec,r=e.connected,c=e.loadInfo,l=e.loadState,d=e.resetIO,f=(0,u.useMemo)((function(){var e=(0,Ke.VN)(),n=t[e],r=(0,i.Z)(t,[e].map(ze.Z));if(!n)return[];var a=Object.values(r);return[n].concat((0,y.Z)((0,C.sortBy)(a,"online").reverse()))}),[t]),p=(0,u.useMemo)((function(){return f.filter((function(e){return e.online})).length}),[f]),v=(0,q.jsxs)("div",{className:"team-popover",children:[r||(0,q.jsx)(Me.Z,{className:"disconn-alert",message:"Network failed.",icon:(0,q.jsx)(Qe.Z,{}),type:"error",showIcon:!0,banner:!0}),(0,q.jsx)(He.GD,{className:"code-display",value:String(n),length:4,plain:!0}),(0,q.jsx)(un,{}),(0,q.jsx)(Fe.Z,{}),(0,q.jsx)("div",{className:"user-list",children:f.map((function(e){return(0,q.jsx)(sn,{userInfo:e},e.userID)}))})]}),g=(0,u.useState)(!1),m=(0,s.Z)(g,2),x=m[0],Z=m[1],h=(0,q.jsxs)("div",{className:"team-title",children:[(0,q.jsx)("span",{children:"Team info"}),(0,q.jsx)(K.Z,{shape:"circle",type:"text",size:"small",loading:x,icon:(0,q.jsx)(Ye.Z,{}),onClick:(0,o.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return Z(!0),e.next=3,c();case 3:return e.next=5,l();case 5:Z(!1),d();case 7:case"end":return e.stop()}}),e)})))})]});return(0,q.jsx)(U.Z,{content:v,trigger:"click",placement:"bottomRight",title:h,getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,q.jsx)(K.Z,{type:"text",icon:(0,q.jsx)(Ve.Z,{status:r?"success":"error",count:r?p:"!",size:"small",children:(0,q.jsx)($e.Z,{})})})})},ln=function(e){var n,t=e.instantSave,r=null!==(n=(0,b.UO)().noteID)&&void 0!==n?n:"",i=(0,b.s0)(),s=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return e.next=4,(0,nn.r8)(r);case 4:if(e.sent){e.next=7;break}return e.abrupt("return",Ae.ZP.error("Can't create room."));case 7:return e.next=9,(0,j.SP)(r,{team:!0});case 9:i("/team/"+r);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,q.jsx)(K.Z,{type:"text",icon:(0,q.jsx)(en.Z,{}),onClick:function(){Ue.Z.confirm({title:"Enable team editing",content:"This will make your note public to anyone with the link.",icon:(0,q.jsx)($e.Z,{style:{color:"#555"}}),onOk:s})}})},dn=["saved","instantSave"],fn=function(e){var n=e.saved,t=e.instantSave,a=(0,i.Z)(e,dn);return(0,q.jsxs)("header",{children:[(0,q.jsx)(Se,{saved:n,instantSave:t}),(0,q.jsx)(Ee,(0,r.Z)({},a)),(0,q.jsx)(an,{instantSave:t})]})},pn=t(92560),vn=t(97892),gn=t.n(vn),mn=t(6593),xn=t.n(mn);gn().extend(xn());var Zn=function(e){var n=e.noteInfo,t=e.renameNote,r=(0,u.useState)(!1),a=(0,s.Z)(r,2),i=a[0],o=a[1],c=(0,u.useState)(n.name),l=(0,s.Z)(c,2),d=l[0],f=l[1],p=(0,u.useState)(!1),v=(0,s.Z)(p,2),g=v[0],m=v[1],x=n.lastTime,Z=n.createTime,h=(0,u.useMemo)((function(){return gn()(x).calendar()}),[x]),j=(0,u.useMemo)((function(){return gn()(Z).calendar()}),[Z]);return(0,q.jsx)("nav",{children:(0,q.jsxs)("div",{className:"info",children:[i?(0,q.jsx)(pn.Z,{className:"title",size:"large",bordered:!1,value:d,onChange:function(e){return f(e.target.value)},autoFocus:!0,onBlur:function(){t(d),o(!1)}}):(0,q.jsx)("p",{className:"title",onClick:function(){return o(!0)},children:d}),(0,q.jsxs)("span",{className:"time",onClick:function(){return m((function(e){return!e}))},children:[g?j:h,(0,q.jsx)("span",{className:"label",children:g?"Created":"Last Edited"})]})]})})},hn=["pageRec","pdf","pageOrder"],jn=["image","marked"],kn=["pageRec","pdf","pageOrder"];function bn(){return(0,q.jsx)(_.kV,{children:(0,q.jsx)(d.Wk,{children:(0,q.jsx)(l.w3,{children:(0,q.jsx)(Sn,{})})})})}var Sn=function(){var e,n=null!==(e=(0,b.UO)().noteID)&&void 0!==e?e:"",t=(0,b.s0)(),d=(0,u.useState)(),p=(0,s.Z)(d,2),v=p[0],x=p[1],Z=(0,u.useState)(),S=(0,s.Z)(Z,2),w=S[0],I=S[1],D=(0,u.useState)(),R=(0,s.Z)(D,2),T=R[0],L=R[1],z=(0,u.useState)(),M=(0,s.Z)(z,2),F=M[0],V=M[1],A=(0,u.useState)(!0),U=(0,s.Z)(A,2),B=U[0],H=U[1],K=(0,u.useContext)(ee.TeamCtx),W=K.io,X=K.addTeamStatePage,_=K.checkOpID;(0,u.useEffect)((function(){(0,o.Z)((0,a.Z)().mark((function e(){var r,o,s,u;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,j.U9)(n);case 2:if(r=e.sent){e.next=6;break}return Ae.ZP.error("Note not found"),e.abrupt("return",t("/"));case 6:o=r.pageRec,r.pdf,s=r.pageOrder,u=(0,i.Z)(r,hn),x((0,m.D5)(o)),V(s),I(u),L(h.createFromPages(o));case 11:case"end":return e.stop()}}),e)})))()}),[t,n]),(0,u.useEffect)((function(){w&&(document.title=w.name+" - Multibility")}),[w]),(0,u.useEffect)((function(){return document.body.classList.add("reader"),function(){return document.body.classList.remove("reader")}}),[]);var G=(0,f.Z)((0,o.Z)((0,a.Z)().mark((function e(){var t,i,o,s,u=arguments;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=u.length>0&&void 0!==u[0]&&u[0],o=v,i&&(null===T||void 0===T||T.getStates().forEach((function(e,n){var t;o=null===(t=o)||void 0===t?void 0:t.update(n,c.BJ,(function(n){return(0,r.Z)((0,r.Z)({},n),{},{state:g.Dw.flaten(e)})}))})),x(o)),s=null===(t=o)||void 0===t?void 0:t.toObject(),e.next=6,(0,j.SP)(n,{pageRec:s});case 6:H(!0);case 7:case"end":return e.stop()}}),e)})))),J=(0,u.useCallback)((0,C.debounce)(G,5e3),[G]),Q=J.flush,Y=function(e,n){x((function(t){return null===t||void 0===t?void 0:t.update(e,c.BJ,n)})),H(!1),J()},$=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(t){var r,i=arguments;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=i.length>1&&void 0!==i[1]&&i[1],V(t),e.next=4,(0,j.SP)(n,{pageOrder:t});case 4:return e.next=6,Q();case 6:r&&ne(t);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),ne=function(e){return null===W||void 0===W?void 0:W.emit("reorder",{pageOrder:e})},te=(0,f.Z)((function(e){var n=e.deleted,t=e.pageOrder,r=e.prevOrder;$(t),n&&(0,k.Ow)((function(){return $(r,!0)}))})),ae=(0,f.Z)((function(e){var n=e.pageOrder,t=e.pageID,r=e.newPage;$(n),Y(t,(function(){return r})),L((function(e){return null===e||void 0===e?void 0:e.addState(t,r)}))}));(0,u.useEffect)((function(){return null===W||void 0===W||W.on("reorder",te),null===W||void 0===W||W.on("newPage",ae),function(){null===W||void 0===W||W.removeAllListeners()}}),[W,te,ae]);var ie=function(e){null===W||void 0===W||W.emit("push",{operation:e},(function(n){var t=n.timestamp,r=n.prevID,a=n.currID;!function(n){if("add"===e.type){var t=e.pageID,r=e.stroke.uid;L((function(e){return null===e||void 0===e?void 0:e.syncStrokeTime(t,r,n)}))}}(t),_(r,a)}))},oe=function(e,n,t){t.image,t.marked;var r=(0,i.Z)(t,jn);null===W||void 0===W||W.emit("newPage",{pageOrder:e,pageID:n,newPage:r}),X(n,t)},se=function(e){if(T){var n=e(T);if(n!==T){L(n),H(!1),J(!0);var t=n.lastOp;t&&ie(t)}}},ue=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(F){var t=n?null===v||void 0===v?void 0:v.get(e):void 0,r=(0,c.D4)(t),a=(0,s.Z)(r,2),i=a[0],o=a[1],u=E(F,e,i);oe(u,i,o),$(u),Y(i,(function(){return o})),L((function(e){return null===e||void 0===e?void 0:e.addState(i,o)}))}},ce=function(){var e=(0,C.last)(F);e&&ue(e)},le=(0,u.useState)(100),fe=(0,s.Z)(le,2),pe=fe[0],ve=fe[1],ge=100===pe,me=(100-pe)/2+"%",xe={paddingLeft:me,paddingRight:me},Ze=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=(0,u.useState)((0,m.D5)()),i=(0,s.Z)(r,2),c=i[0],l=i[1],d=(0,u.useRef)(!1),p=(0,u.useState)(""),v=(0,s.Z)(p,2),g=v[0],x=v[1];(0,u.useEffect)((function(){(0,o.Z)((0,a.Z)().mark((function n(){var t;return(0,a.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,P.getItem(e);case 2:if(t=n.sent){n.next=5;break}return n.abrupt("return",d.current=!0);case 5:x(t);case 6:case"end":return n.stop()}}),n)})))()}),[e]),(0,u.useLayoutEffect)((function(){var e=c.get(g);!d.current&&e&&(e.scrollIntoView(),d.current=!0)}),[g,c]);var Z=(0,u.useState)((0,m.D5)()),h=(0,s.Z)(Z,2),j=h[0],k=h[1],b=(0,u.useDeferredValue)(j),S=(0,u.useDeferredValue)(n),w=(0,u.useMemo)((function(){return O(b,S)}),[b,S]);(0,u.useEffect)((function(){d.current&&N(e,w)}),[e,w]);var I=(0,f.Z)((function(){var e,n,t=c.get(w),r=null===t||void 0===t||null===(e=t.parentElement)||void 0===e||null===(n=e.parentElement)||void 0===n?void 0:n.firstElementChild;return r?-t.getBoundingClientRect().top+r.getBoundingClientRect().height:0})),D=(0,u.useMemo)(I,[n,I].concat((0,y.Z)(t))),C=(0,f.Z)((function(){var e=c.get(w);e&&(e.scrollIntoView(),window.scrollBy(0,D))}));(0,u.useLayoutEffect)(C,[n,C].concat((0,y.Z)(t)));var E=(0,f.Z)((function(e){return function(n){n&&l((function(t){return t.set(e,n)}))}})),R=(0,u.useRef)(0),T=(0,u.useState)(!1),L=(0,s.Z)(T,2),z=L[0],M=L[1],F=function(e){var n=c.get(e);n&&(document.addEventListener("scroll",(function e(){window.clearTimeout(R.current),R.current=window.setTimeout((function(){M(!1),document.removeEventListener("scroll",e)}),50)})),n.scrollIntoView({behavior:"smooth"}),M(!0))};return(0,u.useDebugValue)(w),{scrollPage:F,setInviewRatios:k,sectionRef:E,currPageID:w,scrolling:z}}(n,F,[pe]),he=Ze.setInviewRatios,je=Ze.scrollPage,ke=Ze.sectionRef,be=Ze.currPageID,Se=Ze.scrolling,we=(0,l.gX)().finger;(0,u.useEffect)((function(){if(window.BroadcastChannel){var e=new BroadcastChannel("open note");return e.postMessage(n),e.onmessage=function(e){e.data===n&&(J.cancel(),(0,k.sk)((function(){return t("/")})))},function(){return e.close()}}}),[t,n,J]);var ye=function(){var e=(0,o.Z)((0,a.Z)().mark((function e(t){var r,o;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==(null===w||void 0===w?void 0:w.name)){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,j.SP)(n,{name:t});case 4:return e.next=6,(0,j.U9)(n);case 6:if(r=e.sent){e.next=9;break}return e.abrupt("return");case 9:r.pageRec,r.pdf,r.pageOrder,o=(0,i.Z)(r,kn),I(o);case 11:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}();if(!T||!F||!v||!w)return null;var Ie={noteID:n,pageRec:v,pageOrder:F,stateSet:T,currPageID:be,size:pe},De={scrollPage:je,switchPageMarked:function(e){return Y(e,(function(e){return(0,r.Z)((0,r.Z)({},e),{},{marked:!e.marked})}))},addFinalPage:ce,addPage:ue,deletePage:function(e){var n=null===F||void 0===F?void 0:F.filter((function(n){return n!==e}));(null===n||void 0===n?void 0:n.length)&&$(n,!0)},saveReorder:$,setSize:ve};return(0,q.jsxs)("div",{className:"reader container",children:[(0,q.jsx)(fn,{saved:B,instantSave:Q,handleUndo:function(){return se((function(e){return e.undo()}))},handleRedo:function(){return se((function(e){return e.redo()}))},undoable:T.isUndoable(),redoable:T.isRedoable()}),(0,q.jsx)(Zn,{noteInfo:w,renameNote:ye}),(0,q.jsx)("main",{"data-finger":we,"data-full":ge,style:xe,children:F.map((function(e){return(0,q.jsx)("section",{className:"note-page",ref:ke(e),children:(0,q.jsx)(wn,(0,r.Z)({uid:e,updateStateSet:se,setInviewRatios:he,scrolling:Se},Ie))},e)}))}),(0,q.jsx)("footer",{children:(0,q.jsx)(re,{addFinalPage:ce})}),(0,q.jsx)(de,(0,r.Z)((0,r.Z)({},Ie),De))]})},wn=function(e){var n=e.uid,t=e.updateStateSet,r=e.setInviewRatios,a=e.scrolling,i=e.pageRec,o=e.stateSet,s=e.currPageID,c=e.pageOrder,l=e.noteID,d=(0,u.useContext)(ee.TeamCtx),p=d.teamState,v=d.ignores,g=i.get(n),m=o.getOneState(n),x=null===p||void 0===p?void 0:p.getOnePageStateMap(n),Z=(0,f.Z)((function(e){t((function(t){return t.setState(n,e)}))})),h=(0,f.Z)((function(e){if(!e)return r((function(e){return e.delete(n)}));r((function(t){return t.set(n,e)}))})),j=(0,u.useMemo)((function(){if(!c)return!1;var e=c.indexOf(s),t=c.indexOf(n);return Math.abs(t-e)<=1}),[s,n,c]);return g&&m?(0,q.jsx)(S.default,{drawState:m,teamStateMap:x,updateState:Z,pdfIndex:g.pdfIndex,noteID:l,ignores:v,onViewChange:h,preload:j,skipInView:a}):null}},60559:function(e,n,t){t.r(n),t.d(n,{TeamCtx:function(){return b},default:function(){return S}});var r=t(29439),a=t(74165),i=t(15861),o=t(72791),s=t(98211),u=t(51570),c=t(44428),l=t(69951),d=t(57689),f=t(49742),p=t(79856),v=t(99361),g=t(50419),m=t(24124),x=t(10814),Z=t(763),h=t(1438),j=t.n(h),k=t(80184),b=o.createContext({io:void 0,code:0,teamOn:!1,connected:!1,ignores:(0,m.l4)(),userRec:{},teamState:void 0,resetIO:function(){},loadInfo:function(){var e=(0,i.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),loadState:function(){},setIgnores:function(){},addTeamStatePage:function(e,n){},checkOpID:function(e,n){}});function S(){var e,n=null!==(e=(0,d.UO)().noteID)&&void 0!==e?e:"",t=(0,o.useState)(),h=(0,r.Z)(t,2),S=h[0],w=h[1],y=(0,o.useState)(-2),I=(0,r.Z)(y,2),D=I[0],C=I[1],P=(0,o.useState)({}),N=(0,r.Z)(P,2),O=N[0],E=N[1],R=(0,o.useState)((0,m.l4)()),T=(0,r.Z)(R,2),L=T[0],z=T[1],M=(0,o.useState)(),F=(0,r.Z)(M,2),V=F[0],A=F[1],U=(0,o.useState)(!1),B=(0,r.Z)(U,2),H=B[0],K=B[1],W=(0,o.useState)(!1),X=(0,r.Z)(W,2),_=X[0],G=X[1],q=(0,d.s0)(),J=(0,o.useState)(""),Q=(0,r.Z)(J,2),Y=Q[0],$=Q[1],ee=(0,s.Z)((0,i.Z)((0,a.Z)().mark((function e(){var t;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading note info..."),e.next=3,(0,u.dn)(n,(function(e){$("Downloading PDF: "+j()(e))}));case 3:if(t=e.sent){e.next=7;break}return g.ZP.error("Failed loading the team note info"),e.abrupt("return",!1);case 7:return C(t.code),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})))),ne=(0,o.useCallback)((0,Z.throttle)(function(){var e=(0,i.Z)((0,a.Z)().mark((function e(t){var r;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading team note..."),e.next=3,(0,u.CD)(n,(function(e){e<1024||($("Loading team note: "+j()(e)),null===t||void 0===t||t(e))}));case 3:if(r=e.sent){e.next=7;break}return g.ZP.error("Failed loading the team note state"),e.abrupt("return",!1);case 7:return w(p.f.createFromTeamPages(r)),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),1e4),[n]),te=function(){var e,n="SYNC",t=g.ZP.loading({content:"Syncing...",key:n});null===(e=ne((function(e){var t="Syncing: "+j()(e);g.ZP.loading({content:t,key:n,duration:0})})))||void 0===e||e.then(t)},re=(0,s.Z)((function(){return A(function(e){return(0,c.io)(u._n,{query:{userID:(0,l.VN)(),userName:(0,l.vW)(),noteID:e}})}(n))})),ae=(0,s.Z)((function(){(0,u.f1)(n)})),ie=(0,o.useRef)(""),oe=(0,s.Z)((function(e,n){var t=e&&ie.current&&e!==ie.current;ie.current=n,t&&te()})),se=(0,s.Z)((function(e){var n=ie.current&&ie.current!==e;ie.current=e,n&&te()}));(0,o.useEffect)((function(){var e=function(){var e=(0,i.Z)((0,a.Z)().mark((function e(){var n,t;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ee();case 2:return n=e.sent,e.next=5,ne();case 5:if(t=e.sent,n&&t){e.next=8;break}return e.abrupt("return",q("/"));case 8:K(!0),re(),ae();case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return e(),ae}),[ee,ne,q,re,ae]),(0,o.useEffect)((function(){if(V)return V.on("push",(function(e){var n=e.operation,t=e.userID,r=e.prevID,a=e.currID;w((function(e){return null===e||void 0===e?void 0:e.pushOperation(n,t)})),oe(r,a)})),V.on("join",(function(e){var n=e.joined,t=e.members,r=n.userID,a=n.userName;E(t),r!==(0,l.VN)()&&(0,f.gd)(r,a)})),V.on("leave",(function(e){var n=e.leaved,t=e.members,r=n.userID,a=n.userName;if(E(t),r===(0,l.VN)())return V.emit("join");(0,f.mz)(r,a)})),V.on("newPage",(function(e){var n=e.pageID,t=e.newPage;w((function(e){return null===e||void 0===e?void 0:e.addPage(n,t)}))})),V.on("reset",(function(e){var n=e.userID,t=e.pageRec;n!==(0,l.VN)()&&w((function(e){return null===e||void 0===e?void 0:e.resetUser(n,t)}))})),V.on("connect_error",console.error),V.on("disconnect",(function(){return G(!1)})),V.on("connect",(function(){return G(!0)})),V.on("connected",(function(e){var n=e.currID;return se(n)})),function(){V.removeAllListeners(),V.close()}}),[V,oe,se]);return(0,k.jsx)(v.g,{loading:!H,text:Y,children:(0,k.jsx)(b.Provider,{value:{io:V,code:D,teamOn:!0,ignores:L,userRec:O,connected:_,teamState:S,resetIO:re,loadInfo:ee,loadState:ne,setIgnores:z,addTeamStatePage:function(e,n){w((function(t){return null===t||void 0===t?void 0:t.addPage(e,n)}))},checkOpID:oe},children:(0,k.jsx)(x.default,{})})})}},49742:function(e,n,t){t.d(n,{Ow:function(){return l},gd:function(){return d},mz:function(){return f},sk:function(){return p}});var r=t(50419),a=t(87309),i=t(50759),o=t(56058),s=t(87962),u=t(52242),c=t(80184),l=function(e){r.ZP.warning({content:(0,c.jsxs)(c.Fragment,{children:["One page was deleted.",(0,c.jsx)(a.Z,{size:"small",type:"link",onClick:function(){r.ZP.destroy("DELETE"),e()},children:"Undo"})]}),key:"DELETE",duration:10})},d=function(e,n){r.ZP.success({content:"".concat(n," joined the room"),icon:(0,c.jsx)(o.Z,{}),key:e})},f=function(e,n){r.ZP.warning({content:"".concat(n," left the room"),icon:(0,c.jsx)(s.Z,{}),key:e})},p=function(e){i.Z.error({title:"This note is opened in another tab.",okText:"Back",okButtonProps:{icon:(0,c.jsx)(u.Z,{})},onOk:e})}}}]);
//# sourceMappingURL=378.9b2f47a2.chunk.js.map