"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[605,750],{52475:function(e,n,t){t.r(n),t.d(n,{default:function(){return Mn}});var r=t(1413),a=t(74165),i=t(45987),s=t(15861),o=t(29439),u=t(72791),c=t(92198),l=t(70587),d=t(81832),f=t(15671),p=t(43144),v=t(91715),x=t(24124),m=t(74689),g={states:(0,x.Map)(),editStack:(0,x.List)(),undoStack:(0,x.List)()},h=(0,x.Record)(g),Z=function(){function e(n,t){(0,f.Z)(this,e),this.immutable=n,this.lastOp=t}return(0,p.Z)(e,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getStates",value:function(){return this.getImmutable().get("states")}},{key:"getOneState",value:function(e){return this.getStates().get(e)}},{key:"getEditStack",value:function(){return this.getImmutable().get("editStack")}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"setState",value:function(n,t){var a=this.getOneState(n);if(!a||a===t)return this;var i=this.getImmutable().update("states",(function(e){return e.set(n,t)})).update("editStack",(function(e){return e.push(n)})).delete("undoStack"),s=t.lastOp;return new e(i,s&&(0,r.Z)((0,r.Z)({},s),{},{pageID:n}))}},{key:"syncStrokeTime",value:function(e,n,t){var r=this.getOneState(e);return r&&v.DrawState.syncStrokeTime(r,n,t),this}},{key:"addState",value:function(n,t){var r=t.state,a=t.ratio,i=v.DrawState.loadFromFlat(r,a,m.m);return new e(this.getImmutable().update("states",(function(e){return e.set(n,i)})))}},{key:"deleteState",value:function(n){return new e(this.getImmutable().update("states",(function(e){return e.delete(n)})))}},{key:"isUndoable",value:function(){return this.getEditStack().size>0}},{key:"isRedoable",value:function(){return this.getUndoStack().size>0}},{key:"undo",value:function(){if(!this.isUndoable())return this;var n=this.getEditStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=v.DrawState.undo(t),i=a.lastOp,s=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("editStack",(function(e){return e.pop()})).update("undoStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),s)}},{key:"redo",value:function(){if(!this.isRedoable())return this;var n=this.getUndoStack().last(),t=n&&this.getOneState(n);if(!t)return this;var a=v.DrawState.redo(t),i=a.lastOp,s=i&&(0,r.Z)({pageID:n},i);return new e(this.getImmutable().update("undoStack",(function(e){return e.pop()})).update("editStack",(function(e){return e.push(n)})).update("states",(function(e){return e.set(n,a)})),s)}}],[{key:"createFromPages",value:function(n){return new e(h().set("states",(0,x.Map)(n).map((function(e){var n=e.state,t=e.ratio;return v.DrawState.loadFromFlat(n,t,m.m)}))))}}]),e}(),j=t(75783),k=t(49742),b=t(57689),S=t(27199),w=t(37762),y=t(93433),I=t(61842),C=t.n(I),D=t(763),N=t(52365),P=C().createInstance({name:"scroll"}),E=(0,D.debounce)((function(e,n){P.setItem(e,n)}),2e3);var O=function(e,n){var t,r="",a=0,i=(0,w.Z)(n);try{for(i.s();!(t=i.n()).done;){var s=t.value,o=e.get(s);if(o){if(1===o)return s;o>a&&(r=s,a=o)}}}catch(u){i.e(u)}finally{i.f()}return r};function R(e,n,t){var r=e.indexOf(n),a=e.slice();return-1===r||a.splice(r+1,0,t),a}var z=t(79286),T=t(23414),L=t(82622),M=t(10711),F=t(52234),X=t(98757),V=t(2649),A=t(36090),U=t(69228),B=t(96851),H=t(26987),K=t(87309),W=t(70776),_=t(25581),G=t(74115),Y=t(80184),q=function(e){var n=e.userInfo,t=e.size,r=void 0===t?"default":t,a=e.onClick,i=void 0===a?function(){}:a,s=e.chosen,o=void 0!==s&&s,c=e.className,l=(0,u.useMemo)((function(){return(0,G.bM)(n.userID)}),[n]);if(!n)return null;var d=n.userName;return(0,Y.jsx)(V.C,{className:c,"data-chosen":o,size:r,style:{backgroundColor:l},children:(0,Y.jsx)("div",{className:"avatar-wrapper",onClick:i,children:null===d||void 0===d?void 0:d.slice(0,3)})})},J=t(22568),Q=t(81694),$=t.n(Q),ee=t(60559),ne=t(13892),te=t(79856),re=function(e){var n=e.addFinalPage;return(0,Y.jsx)(K.Z,{type:"dashed",icon:(0,Y.jsx)(z.Z,{}),block:!0,onClick:n,children:"New page"})},ae=t(56983),ie=t(24805),se=["left"],oe=["ref"],ue=["cardDragged"],ce=["uid","pageIndex","refRec","cardDragged"],le=["uid","index","chosen","setChosen","page","userIDs"],de=function(e){var n=(0,u.useState)(!1),t=(0,o.Z)(n,2),a=t[0],i=t[1],s=(0,N.LH)(),c=(0,o.Z)(s,1)[0],l=(0,Y.jsx)(X._l,{draggableId:"OPPOSITE",index:a?1:0,isDragDisabled:!0,children:function(e){var n=e.innerRef;return(0,Y.jsx)("div",{className:"opposite",ref:n})}});return(0,Y.jsx)(ae.Z,{in:c,timeout:300,unmountOnExit:!0,children:(0,Y.jsx)(N.s2,{initKey:"ALL",children:(0,Y.jsx)(X.Z5,{onDragEnd:function(e){var n=e.destination;0===(null===n||void 0===n?void 0:n.index)&&i(!0),1===(null===n||void 0===n?void 0:n.index)&&i(!1)},children:(0,Y.jsx)(X.bK,{droppableId:"preview-drop",direction:"horizontal",children:function(n,t){var i=n.droppableProps,s=n.innerRef,o=n.placeholder,u=t.isDraggingOver;return(0,Y.jsxs)("aside",(0,r.Z)((0,r.Z)({className:"preview-drop","data-left":a,ref:s,"data-dragged":u},i),{},{children:[l,(0,Y.jsx)(fe,(0,r.Z)({left:a},e)),o]}))}})})})})},fe=function(e){var n=e.left,t=(0,i.Z)(e,se),a=(0,N.zI)(),s=(0,o.Z)(a,1)[0],u=(0,N.LH)(),c=(0,o.Z)(u,2)[1],l={ALL:"All Pages",MARKED:"Bookmarks",WRITTEN:"Notes"}[s],d=(0,ne.QS)({onSwipedLeft:function(){n&&c(!1)},onSwipedRight:function(){n||c(!1)},swipeDuration:200}),f=d.ref,p=(0,i.Z)(d,oe);return(0,Y.jsx)(X._l,{draggableId:"CARD",index:n?0:1,children:function(e,n){var a=e.innerRef,i=e.draggableProps,s=e.dragHandleProps,o=n.isDragging,u=n.isDropAnimating;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({className:"preview-card",ref:function(e){a(e),f(e)},"data-animating":u},i),p),{},{children:[(0,Y.jsx)("div",(0,r.Z)({className:"drag-handle"},s)),(0,Y.jsx)("h3",{children:l}),(0,Y.jsx)(he,{}),(0,Y.jsx)(pe,(0,r.Z)({cardDragged:o},t)),(0,Y.jsx)(Ze,(0,r.Z)({},t))]}))}})},pe=u.memo((function(e){var n=e.cardDragged,t=(0,i.Z)(e,ue),a=(0,u.useRef)({}),s=(0,N.zI)(),c=(0,o.Z)(s,1)[0],l=(0,N.LH)(),d=(0,o.Z)(l,1)[0],f=t.pageOrder,p=t.currPageID,v=t.saveReorder,x=t.addFinalPage,m=(0,N.zX)((function(){var e;null===(e=a.current[p])||void 0===e||e.scrollIntoView()}));return(0,u.useLayoutEffect)((function(){d&&m()}),[d,c,m]),(0,Y.jsx)(X.Z5,{onDragEnd:function(e){var n=e.source,t=e.destination;if(t&&f){var r=n.index,a=t.index,i=f[r];if(r!==a&&i){var s=function(e,n,t){var r=e.slice(),a=r.splice(n,1),i=(0,o.Z)(a,1)[0];return i?(r.splice(t,0,i),r):e}(f,r,a);v(s,!0)}}},children:(0,Y.jsx)(X.bK,{droppableId:"preview-list",isDropDisabled:n,children:function(e){var i=e.droppableProps,s=e.innerRef,o=e.placeholder;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)({className:"page-list",ref:s},i),{},{children:[f.map((function(e,i){return(0,Y.jsx)(ve,(0,r.Z)({uid:e,pageIndex:i,refRec:a.current,cardDragged:n},t),e)})),o,"ALL"===c&&(0,Y.jsx)(re,{addFinalPage:x})]}))}})})}));pe.displayName="PageList";var ve=function(e){var n=e.uid,t=e.pageIndex,a=e.refRec,s=e.cardDragged,c=(0,i.Z)(e,ce),l=c.stateSet,d=c.pageRec,f=c.currPageID,p=c.scrollPage,v=(0,u.useContext)(ee.TeamCtx),x=v.teamState,m=v.ignores,g=(0,N.zI)(),h=(0,o.Z)(g,1)[0],Z=(0,u.useState)(""),j=(0,o.Z)(Z,2),k=j[0],b=j[1],w=d.get(n),y=l.getOneState(n),I=null===x||void 0===x?void 0:x.getOnePageStateMap(n),C=(0,u.useRef)(!1);C.current="MARKED"===h&&((null===w||void 0===w?void 0:w.marked)||C.current);var D=(0,u.useMemo)((function(){return te.f.getValidUsers(I,m)}),[I,m]);if(!w||!y)return null;if("WRITTEN"===h&&y.isEmpty()&&te.f.isEmpty(I))return null;if("MARKED"===h&&!C.current)return null;var P=f===n;return(0,Y.jsx)(X._l,{draggableId:n,index:t,isDragDisabled:"ALL"!==h||s,children:function(e,i){var o=e.innerRef,u=e.draggableProps,l=e.dragHandleProps,d=i.isDragging,f=i.isDropAnimating;return(0,Y.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({ref:function(e){o(e),e&&(a[n]=e)},className:"page","data-curr":P,"data-dragged":d,"data-animating":f,onClick:function(){return p(n)}},u),l),{},{children:[(0,Y.jsx)(S.default,{drawState:(null===I||void 0===I?void 0:I.get(k))||y,teamStateMap:k?void 0:I,thumbnail:w.image,ignores:m,preview:!0,skipInView:d||s}),(0,Y.jsx)(xe,(0,r.Z)({uid:n,index:t,chosen:k,setChosen:b,page:w,userIDs:D},c))]}))}})},xe=u.memo((function(e){var n=e.uid,t=e.index,a=e.chosen,s=e.setChosen,o=e.page,u=e.userIDs,c=(0,i.Z)(e,le),l=c.switchPageMarked;return(0,Y.jsxs)("div",{className:"tools",onClick:function(e){return e.stopPropagation()},children:[(0,Y.jsx)("div",{className:"bookmark","data-marked":o.marked,onClick:function(){return l(n)}}),(0,Y.jsx)("div",{className:"index",children:t+1}),(0,Y.jsx)(ge,(0,r.Z)({uid:n},c)),(0,Y.jsx)(me,{userIDs:u,chosen:a,setChosen:s})]})}));xe.displayName="PreviewTools";var me=function(e){var n=e.userIDs,t=e.chosen,r=e.setChosen,a=(0,u.useContext)(ee.TeamCtx).userRec;return(0,Y.jsx)(V.C.Group,{maxCount:2,size:"default",className:$()("team-group",{chosen:t}),maxPopoverPlacement:"bottom",children:n.map((function(e){var n=a[e];return n?(0,Y.jsx)(q,{size:"default",userInfo:n,className:"preview-avatar",chosen:t===e,onClick:function(){return r((function(n){return n===e?"":e}))}},e):null}))})},ge=function(e){var n=e.uid,t=e.addPage,r=e.deletePage,a=(0,Y.jsx)(A.Z,{items:[{key:"ADD",icon:(0,Y.jsx)(z.Z,{}),label:"Add page",onClick:function(){return t(n)}},{key:"COPY",icon:(0,Y.jsx)(T.Z,{}),label:"Duplicate",onClick:function(){return t(n,!0)}},{key:"DELETE",icon:(0,Y.jsx)(L.Z,{}),label:"Delete",danger:!0,onClick:function(){return r(n)}}]});return(0,Y.jsx)(U.Z,{content:a,trigger:"click",placement:"left",destroyTooltipOnHide:!0,getPopupContainer:function(e){var n,t;return null===(n=e.parentElement)||void 0===n||null===(t=n.parentElement)||void 0===t?void 0:t.parentElement},children:(0,Y.jsx)("div",{className:"option",children:(0,Y.jsx)(M.Z,{})})})},he=u.memo((function(){var e=(0,N.zI)(),n=(0,o.Z)(e,2),t=n[0],r=n[1];return(0,Y.jsx)(B.Z,{className:"tabs",activeKey:t,onChange:r,tabBarGutter:0,size:"small",centered:!0,items:[{key:"ALL",label:(0,Y.jsx)(J.Z,{type:"icon-uf_paper"})},{key:"MARKED",label:(0,Y.jsx)(J.Z,{type:"icon-bookmark2"})},{key:"WRITTEN",label:(0,Y.jsx)(J.Z,{type:"icon-write"})}]})}));he.displayName="PreviewTabs";var Ze=function(e){var n=e.currPageID,t=e.pageOrder,r=e.scrollPage,a=e.size,i=e.setSize,s=(0,u.useMemo)((function(){var e;return(null!==(e=t.indexOf(n))&&void 0!==e?e:0)+1}),[n,t]),o=t&&(0,Y.jsx)(H.Z,{pageSize:1,total:t.length,simple:!0,current:s,onChange:function(e){var n=t[e-1];n&&r(n)}});return(0,Y.jsxs)("footer",{children:[(0,Y.jsx)(U.Z,{content:o,trigger:"click",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsxs)(K.Z,{type:"text",size:"small",children:[s," / ",t.length]})}),(0,Y.jsx)(je,{}),(0,Y.jsx)(W.Z,{className:"size-select",popupClassName:"size-drop",size:"small",bordered:!1,showArrow:!1,dropdownMatchSelectWidth:80,options:[40,60,80,100].map((function(e){return{value:e,label:e+"%"}})),value:a,onChange:i,placement:"topRight",getPopupContainer:function(e){return e.parentElement}})]})},je=function(){var e=(0,l.gX)().finger,n=(0,l.F7)(),t=(0,d.iX)(),r=(0,o.Z)(t,2),a=r[0],i=r[1],s=(0,ie.useMediaQuery)({query:"(prefers-color-scheme: light)"}),u=(0,Y.jsxs)(Y.Fragment,{children:[(0,Y.jsxs)("div",{className:"footer-option",children:[(0,Y.jsx)("span",{children:"Pencil only"}),(0,Y.jsx)(_.Z,{size:"small",checked:!e,onChange:function(e){return n({finger:!e})}})]}),(0,Y.jsxs)("div",{className:"footer-option",children:[(0,Y.jsx)("span",{children:"Light mode"}),(0,Y.jsx)(_.Z,{size:"small",checked:a||s,disabled:s,onChange:i})]})]});return(0,Y.jsx)(U.Z,{getPopupContainer:function(e){return e.parentElement},trigger:"click",content:u,placement:"topRight",children:(0,Y.jsx)(K.Z,{className:"option-btn",size:"small",type:"text",shape:"circle",icon:(0,Y.jsx)(F.Z,{style:{opacity:.5}})})})},ke=t(52242),be=t(65323),Se=function(e){var n=e.saved,t=e.instantSave,r=(0,b.s0)();return(0,Y.jsxs)("div",{className:"left",children:[(0,Y.jsx)(K.Z,{type:"text",onClick:(0,s.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:r("/");case 3:case"end":return e.stop()}}),e)}))),icon:(0,Y.jsx)(ke.Z,{style:{opacity:.8}})}),(0,Y.jsx)(K.Z,{type:"text",className:"save",onClick:t,disabled:n,icon:(0,Y.jsx)(be.Z,{})})]})},we=t(53163),ye=t(92560),Ie=t(78030),Ce=t(50446),De=t(76849),Ne=t(62),Pe=t(14965),Ee=t(64239),Oe=t(1431),Re=t(78823),ze=t(31549),Te=t(2721),Le={type:"text"},Me=function(e){var n=e.handleUndo,t=e.handleRedo,a=e.undoable,i=e.redoable;return(0,Y.jsxs)("div",{className:"middle",children:[(0,Y.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Le),{},{icon:(0,Y.jsx)(Ie.Z,{}),onClick:n,disabled:!a})),(0,Y.jsx)(K.Z,(0,r.Z)((0,r.Z)({className:"redo-btn"},Le),{},{icon:(0,Y.jsx)(Ce.Z,{}),onClick:t,disabled:!i})),(0,Y.jsx)(Fe,{}),(0,Y.jsx)(Xe,{}),(0,Y.jsx)(Ve,{}),(0,Y.jsx)(Ae,{})]})},Fe=function(){var e=(0,l.gX)(),n=e.mode,t=e.color,a=(0,l.F7)();return"draw"===n?(0,Y.jsx)(U.Z,{content:(0,Y.jsx)(Te.Uk,{updateDrawCtrl:a,drawCtrl:e}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(K.Z,{type:"link",icon:(0,Y.jsx)(De.Z,{twoToneColor:t,className:"pen-icon"}),"data-active":"draw"===n})}):(0,Y.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Le),{},{onClick:function(){return a({mode:"draw"})},icon:(0,Y.jsx)(Ne.Z,{})}))},Xe=function(){var e=(0,l.gX)(),n=e.mode,t=e.pixelEraser,a=(0,l.F7)(),i=(0,Y.jsx)(we.Z,{block:!0,size:"small",className:"pixel-seg",options:["Pixel","Object"],value:t?"Pixel":"Object",onChange:function(e){a("Pixel"===e?{pixelEraser:!0}:{pixelEraser:!1})}});return"erase"===n?(0,Y.jsx)(U.Z,{content:(0,Y.jsxs)("div",{className:"erase-panel",children:[i,(0,Y.jsx)(Te.Db,{drawCtrl:e,updateDrawCtrl:a,field:"eraserWidth"})]}),trigger:"click",placement:"bottom",getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(K.Z,{type:"link",icon:(0,Y.jsx)(J.Z,{type:"icon-eraser"}),"data-active":"erase"===n})}):(0,Y.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Le),{},{onClick:function(){return a({mode:"erase"})},icon:(0,Y.jsx)(J.Z,{type:"icon-eraser"})}))},Ve=function(){var e=(0,l.gX)(),n=e.lasso,t=e.mode,a=(0,l.F7)(),i=n?(0,Y.jsx)(J.Z,{type:"icon-lasso1"}):(0,Y.jsx)(Pe.Z,{});return"select"===t?(0,Y.jsx)(K.Z,{type:"link",icon:i,onClick:function(){return a({lasso:!n})},"data-active":"select"===t}):(0,Y.jsx)(K.Z,(0,r.Z)((0,r.Z)({},Le),{},{icon:i,onClick:function(){return a({mode:"select"})}}))},Ae=function(){var e,n=(0,l.gX)(),t=(0,l.F7)(),r=n.mode,a=n.imageSrc,i=function(e,n){return(0,Y.jsx)(K.Z,{type:r===e?"link":"text",onClick:function(){return t({mode:e})},icon:n,"data-active":r===e},e)},s={text:i("text",(0,Y.jsx)(J.Z,{type:"icon-text1"})),picture:i("picture",(0,Y.jsx)(Ee.Z,{})),rect:i("rect",(0,Y.jsx)(Oe.Z,{}))},c=(0,u.useState)(!1),d=(0,o.Z)(c,2),f=d[0],p=d[1],v={text:(0,Y.jsx)("div",{className:"text-option",children:"Tap anywhere to insert text."}),picture:(0,Y.jsxs)("div",{className:"picture-option",children:[(0,Y.jsx)(ye.Z,{value:a,onChange:function(e){return t({imageSrc:e.target.value})},prefix:(0,Y.jsx)(Re.Z,{}),placeholder:"Image URL",allowClear:!0}),(0,Y.jsx)("img",{src:a,alt:"inserted","data-show":f,onLoad:function(){return p(!0)},onError:function(){return p(!1)}})]}),rect:(0,Y.jsx)(Te.Uk,{drawCtrl:n,updateDrawCtrl:t})},x=(0,Y.jsxs)("div",{className:"add-pop",children:[(0,Y.jsx)("div",{className:"button-row",children:Object.values(s)}),/^(text|picture|rect)$/.test(r)&&(0,Y.jsx)("div",{className:"option-panel","data-mode":r,children:v[r]})]});return(0,Y.jsx)(U.Z,{content:x,trigger:"click",placement:"bottomRight",getPopupContainer:function(e){return e.parentElement},children:null!==(e=s[r])&&void 0!==e?e:(0,Y.jsx)(K.Z,{type:"text",icon:(0,Y.jsx)(ze.Z,{})})})},Ue=t(49142),Be=t(91333),He=t(35945),Ke=t(33441),We=t(75594),_e=t(50419),Ge=t(50759),Ye=t(95055),qe=t(86383),Je=t(69951),Qe=t(67575),$e=t(30501),en=t(98272),nn=t(24215),tn=t(37557),rn=t(19951),an=t(55035),sn=t(28624),on=t(17973),un=t(56200),cn=t(23605),ln=t(89771),dn=t(29529),fn=t(18301),pn=t(51570),vn=t(1829),xn=t.n(vn),mn=function(e){var n=e.instantSave,t=(0,u.useContext)(ee.TeamCtx).teamOn;return(0,Y.jsxs)("div",{className:"right",children:[t?(0,Y.jsx)(Sn,{}):(0,Y.jsx)(wn,{instantSave:n}),(0,Y.jsx)(gn,{})]})},gn=function(){var e=(0,N.LH)(),n=(0,o.Z)(e,2),t=n[0],r=n[1];return(0,Y.jsx)(K.Z,{type:t?"link":"text",icon:(0,Y.jsx)(J.Z,{type:"icon-cards"}),onClick:function(){return r((function(e){return!e}))}})},hn=function(e){var n=e.userInfo,t=(0,u.useState)(!1),r=(0,o.Z)(t,2),a=r[0],i=r[1],s=(0,u.useContext)(ee.TeamCtx),c=s.ignores,l=s.setIgnores,d=s.resetIO;if((0,u.useEffect)((function(){return i(!1)}),[n]),!n)return null;var f=n.userName,p=n.online,v=n.userID,x=v===(0,Je.VN)(),m=c.has(v)&&!x;return(0,Y.jsxs)("div",{className:"user-item","data-online":p,children:[(0,Y.jsx)(q,{userInfo:n,size:"small",className:"room-avatar"}),a||(0,Y.jsx)("span",{className:"user-name",children:f}),a&&(0,Y.jsx)(Ye.Z,{autoFocus:!0,className:"rename-input",defaultValue:f,onSearch:function(e){var n=e.trim();if(!n||n===f)return i(!1);(0,Je.lu)(n),d()},enterButton:(0,Y.jsx)(K.Z,{icon:(0,Y.jsx)(Qe.Z,{})})}),x?a||(0,Y.jsx)(K.Z,{type:"text",icon:(0,Y.jsx)($e.Z,{}),onClick:function(){return i(!0)}}):(0,Y.jsx)(K.Z,{type:"text",icon:m?(0,Y.jsx)(en.Z,{}):(0,Y.jsx)(nn.Z,{}),onClick:function(){l((function(e){return e.has(v)?e.delete(v):e.add(v)}))}})]})},Zn=function(){var e=(0,u.useState)(!1),n=(0,o.Z)(e,2),t=n[0],r=n[1],i=window.location.href,c=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,xn()("".concat(document.title,"\n").concat(i));case 3:r(!0),e.next=9;break;case 6:e.prev=6,e.t0=e.catch(0),console.log(e.t0);case 9:case"end":return e.stop()}}),e,null,[[0,6]])})));return function(){return e.apply(this,arguments)}}();return(0,Y.jsx)(K.Z,{icon:t?(0,Y.jsx)(tn.Z,{}):(0,Y.jsx)(Re.Z,{}),type:t?"primary":"default",className:"share-btn",onClick:c,block:!0,children:t?"Copied":"Copy link"})},jn=function(e){var n=e.children,t=e.title,r=e.icon;return(0,Y.jsxs)("div",{className:"team-info-menu",children:[(0,Y.jsxs)("div",{className:"team-info-title",children:[r,(0,Y.jsx)("span",{children:t})]}),n,(0,Y.jsx)(Be.Z,{})]})},kn=function(){var e=(0,u.useContext)(ee.TeamCtx).code;return(0,Y.jsxs)(jn,{icon:(0,Y.jsx)(rn.Z,{}),title:"Share",children:[(0,Y.jsx)(qe.GD,{className:"code-display",value:String(e),length:4,plain:!0}),(0,Y.jsx)(Zn,{})]})},bn=function(){var e=(0,l.gX)().globalEraser,n=(0,l.F7)();return(0,Y.jsx)(jn,{icon:(0,Y.jsx)(an.Z,{}),title:"Collaborate",children:(0,Y.jsxs)("div",{className:"global-switch",children:[(0,Y.jsxs)("span",{children:["Global",(0,Y.jsx)(He.Z,{className:"hint",title:"Turn on to edit others' strokes.",children:(0,Y.jsx)(sn.Z,{})})]}),(0,Y.jsx)(_.Z,{size:"small",checked:e,onChange:function(e){return n({globalEraser:e})}})]})})},Sn=function(){var e=(0,u.useContext)(ee.TeamCtx),n=e.userRec,t=e.connected,r=e.loadInfo,c=e.loadState,l=e.resetIO,d=(0,u.useMemo)((function(){var e=(0,Je.VN)(),t=n[e],r=(0,i.Z)(n,[e].map(Ue.Z));if(!t)return[];var a=Object.values(r);return[t].concat((0,y.Z)((0,D.sortBy)(a,"online").reverse()))}),[n]),f=(0,u.useMemo)((function(){return d.filter((function(e){return e.online})).length}),[d]),p=(0,Y.jsxs)("div",{className:"team-popover",children:[t||(0,Y.jsx)(Ke.Z,{className:"disconn-alert",message:"Network failed.",icon:(0,Y.jsx)(on.Z,{}),type:"error",showIcon:!0,banner:!0}),(0,Y.jsx)(kn,{}),(0,Y.jsx)(bn,{}),(0,Y.jsx)(jn,{icon:(0,Y.jsx)(un.Z,{}),title:"Members",children:(0,Y.jsx)("div",{className:"user-list",children:d.map((function(e){return(0,Y.jsx)(hn,{userInfo:e},e.userID)}))})})]}),v=(0,u.useState)(!1),x=(0,o.Z)(v,2),m=x[0],g=x[1],h=(0,Y.jsxs)("div",{className:"team-title",children:[(0,Y.jsx)("span",{children:"Team info"}),(0,Y.jsx)(K.Z,{shape:"circle",type:"text",size:"small",loading:m,icon:(0,Y.jsx)(cn.Z,{}),onClick:(0,s.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return g(!0),e.next=3,r();case 3:return e.next=5,c();case 5:g(!1),l();case 7:case"end":return e.stop()}}),e)})))})]});return(0,Y.jsx)(U.Z,{content:p,trigger:"click",placement:"bottomRight",title:h,getPopupContainer:function(e){return e.parentElement},destroyTooltipOnHide:!0,children:(0,Y.jsx)(K.Z,{type:"text",icon:(0,Y.jsx)(We.Z,{status:t?"success":"error",count:t?f:"!",size:"small",children:(0,Y.jsx)(un.Z,{})})})})},wn=function(e){var n,t=e.instantSave,r=null!==(n=(0,b.UO)().noteID)&&void 0!==n?n:"",i=(0,b.s0)(),o=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t();case 2:return e.next=4,(0,pn.r8)(r);case 4:if(e.sent){e.next=7;break}return e.abrupt("return",_e.ZP.error("Can't create room."));case 7:return e.next=9,(0,j.SP)(r,{team:!0});case 9:i("/team/"+r);case 10:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),u=(0,Y.jsxs)("div",{className:"share-modal-content",children:[(0,Y.jsx)(Ke.Z,{className:"share-alert",type:"warning",message:"This will make your note public."}),(0,Y.jsxs)("p",{className:"share-list-item",children:[(0,Y.jsxs)("span",{className:"user-info",children:[(0,Y.jsx)(ln.Z,{}),"Anyone with the link"]}),(0,Y.jsx)(W.Z,{defaultValue:"EDIT",options:[{value:"EDIT",label:"Edit"}]})]}),(0,Y.jsxs)("p",{className:"share-list-item",children:[(0,Y.jsxs)("span",{className:"user-info",children:[(0,Y.jsx)(dn.Z,{}),(0,Je.vW)()," (You)"]}),(0,Y.jsx)("span",{children:"Owner"})]})]});return(0,Y.jsx)(K.Z,{type:"text",icon:(0,Y.jsx)(fn.Z,{}),onClick:function(){Ge.Z.confirm({title:"Enable team editing",content:u,icon:(0,Y.jsx)(un.Z,{style:{color:"#555"}}),onOk:o})}})},yn=["saved","instantSave"],In=function(e){var n=e.saved,t=e.instantSave,a=(0,i.Z)(e,yn);return(0,Y.jsxs)("header",{children:[(0,Y.jsx)(Se,{saved:n,instantSave:t}),(0,Y.jsx)(Me,(0,r.Z)({},a)),(0,Y.jsx)(mn,{instantSave:t})]})},Cn=t(97892),Dn=t.n(Cn),Nn=t(6593),Pn=t.n(Nn);Dn().extend(Pn());var En=function(e){var n=e.noteInfo,t=e.renameNote,r=(0,u.useState)(!1),a=(0,o.Z)(r,2),i=a[0],s=a[1],c=(0,u.useState)(n.name),l=(0,o.Z)(c,2),d=l[0],f=l[1],p=(0,u.useState)(!1),v=(0,o.Z)(p,2),x=v[0],m=v[1],g=n.lastTime,h=n.createTime,Z=(0,u.useMemo)((function(){return Dn()(g).calendar()}),[g]),j=(0,u.useMemo)((function(){return Dn()(h).calendar()}),[h]);return(0,Y.jsx)("nav",{children:(0,Y.jsxs)("div",{className:"info",children:[i?(0,Y.jsx)(ye.Z,{className:"title",size:"large",bordered:!1,value:d,onChange:function(e){return f(e.target.value)},autoFocus:!0,onBlur:function(){t(d),s(!1)}}):(0,Y.jsx)("p",{className:"title",onClick:function(){return s(!0)},children:d}),(0,Y.jsxs)("span",{className:"time",onClick:function(){return m((function(e){return!e}))},children:[x?j:Z,(0,Y.jsx)("span",{className:"label",children:x?"Created":"Last Edited"})]})]})})},On=t(16886),Rn=/Mac/i.test(navigator.userAgent);var zn=["pageRec","pdf","pageOrder"],Tn=["image","marked"],Ln=["pageRec","pdf","pageOrder"];function Mn(){return(0,Y.jsx)(N.kV,{children:(0,Y.jsx)(d.Wk,{children:(0,Y.jsx)(l.w3,{children:(0,Y.jsx)(Fn,{})})})})}var Fn=function(){var e,n=null!==(e=(0,b.UO)().noteID)&&void 0!==e?e:"",t=(0,b.s0)(),d=(0,u.useState)(),f=(0,o.Z)(d,2),p=f[0],m=f[1],g=(0,u.useState)(),h=(0,o.Z)(g,2),S=h[0],w=h[1],I=(0,u.useState)(),C=(0,o.Z)(I,2),z=C[0],T=C[1],L=(0,u.useState)(),M=(0,o.Z)(L,2),F=M[0],X=M[1],V=(0,u.useState)(!0),A=(0,o.Z)(V,2),U=A[0],B=A[1],H=(0,u.useContext)(ee.TeamCtx),K=H.io,W=H.addTeamStatePage,_=H.checkOpID;(0,u.useEffect)((function(){(0,s.Z)((0,a.Z)().mark((function e(){var r,s,o,u;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,j.U9)(n);case 2:if(r=e.sent){e.next=6;break}return _e.ZP.error("Note not found"),e.abrupt("return",t("/"));case 6:s=r.pageRec,r.pdf,o=r.pageOrder,u=(0,i.Z)(r,zn),m((0,x.Map)(s)),X(o),w(u),T(Z.createFromPages(s));case 11:case"end":return e.stop()}}),e)})))()}),[t,n]),(0,u.useEffect)((function(){S&&(document.title=S.name+" - Multibility")}),[S]),(0,u.useEffect)((function(){return document.body.classList.add("reader"),function(){return document.body.classList.remove("reader")}}),[]);var G=(0,N.zX)((0,s.Z)((0,a.Z)().mark((function e(){var t,i,s,o,u=arguments;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return i=u.length>0&&void 0!==u[0]&&u[0],s=p,i&&(null===z||void 0===z||z.getStates().forEach((function(e,n){var t;s=null===(t=s)||void 0===t?void 0:t.update(n,c.BJ,(function(n){return(0,r.Z)((0,r.Z)({},n),{},{state:v.DrawState.flaten(e)})}))})),m(s)),o=null===(t=s)||void 0===t?void 0:t.toObject(),e.next=6,(0,j.SP)(n,{pageRec:o});case 6:B(!0);case 7:case"end":return e.stop()}}),e)})))),q=(0,u.useCallback)((0,D.debounce)(G,5e3),[G]),J=q.flush,Q=function(e,n){m((function(t){return null===t||void 0===t?void 0:t.update(e,c.BJ,n)})),B(!1),q()},$=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(t){var r,i=arguments;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=i.length>1&&void 0!==i[1]&&i[1],X(t),e.next=4,(0,j.SP)(n,{pageOrder:t});case 4:return e.next=6,J();case 6:r&&ne(t);case 7:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),ne=function(e){return null===K||void 0===K?void 0:K.emit("reorder",{pageOrder:e})},te=(0,N.zX)((function(e){var n=e.deleted,t=e.pageOrder,r=e.prevOrder;$(t),n&&(0,k.Ow)((function(){return $(r,!0)}))})),ae=(0,N.zX)((function(e){var n=e.pageOrder,t=e.pageID,r=e.newPage;$(n),Q(t,(function(){return r})),T((function(e){return null===e||void 0===e?void 0:e.addState(t,r)}))}));(0,u.useEffect)((function(){return null===K||void 0===K||K.on("reorder",te),null===K||void 0===K||K.on("newPage",ae),function(){null===K||void 0===K||K.removeAllListeners()}}),[K,te,ae]);var ie=function(e){null===K||void 0===K||K.emit("push",{operation:e},(function(n){var t=n.timestamp,r=n.prevID,a=n.currID;!function(n){if("add"===e.type){var t=e.pageID,r=e.stroke.uid;T((function(e){return null===e||void 0===e?void 0:e.syncStrokeTime(t,r,n)}))}}(t),_(r,a)}))},se=function(e,n,t){t.image,t.marked;var r=(0,i.Z)(t,Tn);null===K||void 0===K||K.emit("newPage",{pageOrder:e,pageID:n,newPage:r}),W(n,t)},oe=function(e){if(z){var n=e(z);if(n!==z){T(n),B(!1),q(!0);var t=n.lastOp;t&&ie(t)}}},ue=function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1];if(F){var t=n?null===p||void 0===p?void 0:p.get(e):void 0,r=(0,c.D4)(t),a=(0,o.Z)(r,2),i=a[0],s=a[1],u=R(F,e,i);se(u,i,s),$(u),Q(i,(function(){return s})),T((function(e){return null===e||void 0===e?void 0:e.addState(i,s)}))}},ce=function(){var e=(0,D.last)(F);e&&ue(e)},le=(0,u.useState)(100),fe=(0,o.Z)(le,2),pe=fe[0],ve=fe[1],xe=100===pe,me=(100-pe)/2+"%",ge={paddingLeft:me,paddingRight:me},he=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],t=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],r=(0,u.useState)((0,x.Map)()),i=(0,o.Z)(r,2),c=i[0],l=i[1],d=(0,u.useRef)(!1),f=(0,u.useState)(""),p=(0,o.Z)(f,2),v=p[0],m=p[1];(0,u.useEffect)((function(){(0,s.Z)((0,a.Z)().mark((function n(){var t;return(0,a.Z)().wrap((function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,P.getItem(e);case 2:if(t=n.sent){n.next=5;break}return n.abrupt("return",d.current=!0);case 5:m(t);case 6:case"end":return n.stop()}}),n)})))()}),[e]),(0,u.useLayoutEffect)((function(){var e=c.get(v);!d.current&&e&&(e.scrollIntoView(),d.current=!0)}),[v,c]);var g=(0,u.useState)((0,x.Map)()),h=(0,o.Z)(g,2),Z=h[0],j=h[1],k=(0,u.useDeferredValue)(Z),b=(0,u.useDeferredValue)(n),S=(0,u.useMemo)((function(){return O(k,b)}),[k,b]);(0,u.useEffect)((function(){d.current&&E(e,S)}),[e,S]);var w=(0,N.zX)((function(){var e,n,t=c.get(S),r=null===t||void 0===t||null===(e=t.parentElement)||void 0===e||null===(n=e.parentElement)||void 0===n?void 0:n.firstElementChild;return r?-t.getBoundingClientRect().top+r.getBoundingClientRect().height:0})),I=(0,u.useMemo)(w,[n,w].concat((0,y.Z)(t))),C=(0,N.zX)((function(){var e=c.get(S);e&&(e.scrollIntoView(),window.scrollBy(0,I))}));(0,u.useLayoutEffect)(C,[n,C].concat((0,y.Z)(t)));var D=(0,N.zX)((function(e){return function(n){n&&l((function(t){return t.set(e,n)}))}})),R=(0,u.useRef)(0),z=(0,u.useState)(!1),T=(0,o.Z)(z,2),L=T[0],M=T[1],F=function(e){var n=c.get(e);n&&(document.addEventListener("scroll",(function e(){window.clearTimeout(R.current),R.current=window.setTimeout((function(){M(!1),document.removeEventListener("scroll",e)}),50)})),n.scrollIntoView({behavior:"smooth"}),M(!0))};return(0,u.useDebugValue)(S),{scrollPage:F,setInviewRatios:j,sectionRef:D,currPageID:S,scrolling:L}}(n,F,[pe]),Ze=he.setInviewRatios,je=he.scrollPage,ke=he.sectionRef,be=he.currPageID,Se=he.scrolling,we=(0,l.gX)().finger;(0,u.useEffect)((function(){if(window.BroadcastChannel){var e=new BroadcastChannel("open note");return e.postMessage(n),e.onmessage=function(e){e.data===n&&(q.cancel(),(0,k.sk)((function(){return t("/")})))},function(){return e.close()}}}),[t,n,q]),(0,u.useEffect)((function(){var e=function(e){if(!U)return e.preventDefault(),e.returnValue=""};return window.addEventListener("beforeunload",e),function(){return window.removeEventListener("beforeunload",e)}}),[U]);var ye=function(){var e=(0,s.Z)((0,a.Z)().mark((function e(t){var r,s;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t!==(null===S||void 0===S?void 0:S.name)){e.next=2;break}return e.abrupt("return");case 2:return e.next=4,(0,j.SP)(n,{name:t});case 4:return e.next=6,(0,j.U9)(n);case 6:if(r=e.sent){e.next=9;break}return e.abrupt("return");case 9:r.pageRec,r.pdf,r.pageOrder,s=(0,i.Z)(r,Ln),w(s);case 11:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),Ie=function(){return oe((function(e){return e.undo()}))},Ce=function(){return oe((function(e){return e.redo()}))};if(function(e,n){var t=Rn?"meta+z":"ctrl+z",r=Rn?"meta+shift+z":"ctrl+shift+z";(0,On.y1)(t,(function(n){n.preventDefault(),e()})),(0,On.y1)(r,(function(e){e.preventDefault(),n()}))}(Ie,Ce),!z||!F||!p||!S)return null;var De={noteID:n,pageRec:p,pageOrder:F,stateSet:z,currPageID:be,size:pe},Ne={scrollPage:je,switchPageMarked:function(e){return Q(e,(function(e){return(0,r.Z)((0,r.Z)({},e),{},{marked:!e.marked})}))},addFinalPage:ce,addPage:ue,deletePage:function(e){var n=null===F||void 0===F?void 0:F.filter((function(n){return n!==e}));(null===n||void 0===n?void 0:n.length)&&$(n,!0)},saveReorder:$,setSize:ve};return(0,Y.jsxs)("div",{className:"reader container",children:[(0,Y.jsx)(In,{saved:U,instantSave:J,handleUndo:Ie,handleRedo:Ce,undoable:z.isUndoable(),redoable:z.isRedoable()}),(0,Y.jsx)(En,{noteInfo:S,renameNote:ye}),(0,Y.jsxs)("main",{"data-finger":we,"data-full":xe,style:ge,children:[F.map((function(e){return(0,Y.jsx)("section",{className:"note-page",ref:ke(e),children:(0,Y.jsx)(Xn,(0,r.Z)({uid:e,updateStateSet:oe,setInviewRatios:Ze,scrolling:Se},De))},e)})),(0,Y.jsx)("footer",{children:(0,Y.jsx)(re,{addFinalPage:ce})})]}),(0,Y.jsx)(de,(0,r.Z)((0,r.Z)({},De),Ne))]})},Xn=function(e){var n=e.uid,t=e.updateStateSet,r=e.setInviewRatios,a=e.scrolling,i=e.pageRec,s=e.stateSet,o=e.currPageID,c=e.pageOrder,l=e.noteID,d=(0,u.useContext)(ee.TeamCtx),f=d.teamState,p=d.ignores,v=i.get(n),x=s.getOneState(n),m=null===f||void 0===f?void 0:f.getOnePageStateMap(n),g=(0,N.zX)((function(e){t((function(t){return t.setState(n,e)}))})),h=(0,N.zX)((function(e){if(!e)return r((function(e){return e.delete(n)}));r((function(t){return t.set(n,e)}))})),Z=(0,u.useMemo)((function(){if(!c)return!1;var e=c.indexOf(o),t=c.indexOf(n);return Math.abs(t-e)<=1}),[o,n,c]);return v&&x?(0,Y.jsx)(S.default,{drawState:x,teamStateMap:m,updateState:g,pdfIndex:v.pdfIndex,noteID:l,ignores:p,onViewChange:h,preload:Z,skipInView:a}):null}},60559:function(e,n,t){t.r(n),t.d(n,{TeamCtx:function(){return b},default:function(){return S}});var r=t(29439),a=t(74165),i=t(15861),s=t(72791),o=t(51570),u=t(24123),c=t(69951),l=t(57689),d=t(49742),f=t(79856),p=t(52365),v=t(99361),x=t(50419),m=t(24124),g=t(52475),h=t(763),Z=t(1438),j=t.n(Z),k=t(80184),b=s.createContext({io:void 0,code:0,teamOn:!1,connected:!1,ignores:(0,m.Set)(),userRec:{},teamState:void 0,resetIO:function(){},loadInfo:function(){var e=(0,i.Z)((0,a.Z)().mark((function e(){return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",!1);case 1:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),loadState:function(){},setIgnores:function(){},addTeamStatePage:function(e,n){},checkOpID:function(e,n){}});function S(){var e,n=null!==(e=(0,l.UO)().noteID)&&void 0!==e?e:"",t=(0,s.useState)(),Z=(0,r.Z)(t,2),S=Z[0],w=Z[1],y=(0,s.useState)(-2),I=(0,r.Z)(y,2),C=I[0],D=I[1],N=(0,s.useState)({}),P=(0,r.Z)(N,2),E=P[0],O=P[1],R=(0,s.useState)((0,m.Set)()),z=(0,r.Z)(R,2),T=z[0],L=z[1],M=(0,s.useState)(),F=(0,r.Z)(M,2),X=F[0],V=F[1],A=(0,s.useState)(!1),U=(0,r.Z)(A,2),B=U[0],H=U[1],K=(0,s.useState)(!1),W=(0,r.Z)(K,2),_=W[0],G=W[1],Y=(0,l.s0)(),q=(0,s.useState)(""),J=(0,r.Z)(q,2),Q=J[0],$=J[1],ee=(0,p.zX)((0,i.Z)((0,a.Z)().mark((function e(){var t;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading note info..."),e.next=3,(0,o.dn)(n,(function(e){$("Downloading PDF: "+j()(e))}));case 3:if(t=e.sent){e.next=7;break}return x.ZP.error("Failed loading the team note info"),e.abrupt("return",!1);case 7:return D(t.code),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})))),ne=(0,s.useCallback)((0,h.throttle)(function(){var e=(0,i.Z)((0,a.Z)().mark((function e(t){var r;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return $("Loading team note..."),e.next=3,(0,o.CD)(n,(function(e){e<1024||($("Loading team note: "+j()(e)),null===t||void 0===t||t(e))}));case 3:if(r=e.sent){e.next=7;break}return x.ZP.error("Failed loading the team note state"),e.abrupt("return",!1);case 7:return w(f.f.createFromTeamPages(r)),e.abrupt("return",!0);case 9:case"end":return e.stop()}}),e)})));return function(n){return e.apply(this,arguments)}}(),1e4),[n]),te=function(){var e,n="SYNC",t=x.ZP.loading({content:"Syncing...",key:n});null===(e=ne((function(e){var t="Syncing: "+j()(e);x.ZP.loading({content:t,key:n,duration:0})})))||void 0===e||e.then(t)},re=(0,p.zX)((function(){return V(function(e){return(0,u.io)(o._n,{query:{userID:(0,c.VN)(),userName:(0,c.vW)(),noteID:e}})}(n))})),ae=(0,p.zX)((function(){(0,o.f1)(n)})),ie=(0,s.useRef)(""),se=(0,p.zX)((function(e,n){var t=e&&ie.current&&e!==ie.current;ie.current=n,t&&te()})),oe=(0,p.zX)((function(e){var n=ie.current&&ie.current!==e;ie.current=e,n&&te()}));(0,s.useEffect)((function(){var e=function(){var e=(0,i.Z)((0,a.Z)().mark((function e(){var n,t;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ee();case 2:return n=e.sent,e.next=5,ne();case 5:if(t=e.sent,n&&t){e.next=8;break}return e.abrupt("return",Y("/"));case 8:H(!0),re(),ae();case 11:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return e(),ae}),[ee,ne,Y,re,ae]),(0,s.useEffect)((function(){if(X)return X.on("push",(function(e){var n=e.operation,t=e.userID,r=e.prevID,a=e.currID;w((function(e){return null===e||void 0===e?void 0:e.pushOperation(n,t)})),se(r,a)})),X.on("join",(function(e){var n=e.joined,t=e.members,r=n.userID,a=n.userName;O(t),r!==(0,c.VN)()&&(0,d.gd)(r,a)})),X.on("leave",(function(e){var n=e.leaved,t=e.members,r=n.userID,a=n.userName;if(O(t),r===(0,c.VN)())return X.emit("join");(0,d.mz)(r,a)})),X.on("newPage",(function(e){var n=e.pageID,t=e.newPage;w((function(e){return null===e||void 0===e?void 0:e.addPage(n,t)}))})),X.on("reset",(function(e){var n=e.userID,t=e.pageRec;n!==(0,c.VN)()&&w((function(e){return null===e||void 0===e?void 0:e.resetUser(n,t)}))})),X.on("connect_error",console.error),X.on("disconnect",(function(){return G(!1)})),X.on("connect",(function(){return G(!0)})),X.on("connected",(function(e){var n=e.currID;return oe(n)})),function(){X.removeAllListeners(),X.close()}}),[X,se,oe]);return(0,k.jsx)(v.g,{loading:!B,text:Q,children:(0,k.jsx)(b.Provider,{value:{io:X,code:C,teamOn:!0,ignores:T,userRec:E,connected:_,teamState:S,resetIO:re,loadInfo:ee,loadState:ne,setIgnores:L,addTeamStatePage:function(e,n){w((function(t){return null===t||void 0===t?void 0:t.addPage(e,n)}))},checkOpID:se},children:(0,k.jsx)(g.default,{})})})}},49742:function(e,n,t){t.d(n,{Ow:function(){return l},gd:function(){return d},mz:function(){return f},sk:function(){return p}});var r=t(50419),a=t(87309),i=t(50759),s=t(56058),o=t(87962),u=t(52242),c=t(80184),l=function(e){r.ZP.warning({content:(0,c.jsxs)(c.Fragment,{children:["One page was deleted.",(0,c.jsx)(a.Z,{size:"small",type:"link",onClick:function(){r.ZP.destroy("DELETE"),e()},children:"Undo"})]}),key:"DELETE",duration:10})},d=function(e,n){r.ZP.success({content:"".concat(n," joined the room"),icon:(0,c.jsx)(s.Z,{}),key:e})},f=function(e,n){r.ZP.warning({content:"".concat(n," left the room"),icon:(0,c.jsx)(o.Z,{}),key:e})},p=function(e){i.Z.error({title:"This note is opened in another tab.",okText:"Back",okButtonProps:{icon:(0,c.jsx)(u.Z,{})},onOk:e})}}}]);
//# sourceMappingURL=605.d697ecfb.chunk.js.map