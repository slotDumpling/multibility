"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[259,226],{25827:function(e,t,n){n.r(t),n.d(t,{MenuCtx:function(){return Ge},NewNoteButton:function(){return Ve},default:function(){return _e}});var r=n(15861),a=n(29439),s=n(87757),c=n.n(s),i=n(72791),o=n(75783),l=n(92198),u=n(30501),d=n(1413),x=n(92414),f=n(82622),p=n(93309),m=n(57768),h=n(52365),j=n(11956),v=n(81694),g=n.n(v),Z=n(24610),k=n(80184),b=(0,i.createContext)(["",function(){}]),N=function(e){var t=e.children,n=(0,i.useState)("");return(0,k.jsx)(b.Provider,{value:n,children:t})},y=function(e){var t=e.children,n=e.onDelete,s=e.disable,o=void 0!==s&&s,l=e.className,u=(0,i.useState)(Z.v4),x=(0,a.Z)(u,1)[0],f=(0,i.useContext)(b),p=(0,a.Z)(f,2),m=p[0],v=p[1],N=(0,i.useState)(!1),y=(0,a.Z)(N,2),T=y[0],C=y[1],w=T&&(!m||m===x),S=(0,i.useState)(!1),E=(0,a.Z)(S,2),A=E[0],D=E[1],I=(0,i.useState)(),U=(0,a.Z)(I,2),F=U[0],L=U[1],M=(0,i.useRef)(null);(0,i.useEffect)((function(){m!==x&&C(!1)}),[m,x]);var P=(0,j.useSwipeable)({onSwipedLeft:function(){var e;C(!0),v(x),L(null===(e=M.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){C(!1),v(""),L(void 0)},preventDefaultTouchmoveEvent:!0,trackTouch:!o});(0,i.useEffect)((function(){o&&(L(void 0),v(""),C(!1))}),[o,v]);var O=(0,h.mf)({propertyName:"height",active:A}),B=(0,a.Z)(O,2),z=B[0],R=B[1],W=function(){var e=(0,r.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return D(!0),e.next=3,z;case 3:n(),v("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,k.jsxs)("div",(0,d.Z)((0,d.Z)({className:g()("swipe-wrapper",l),"data-deleted":A,"data-deleting":w},P),{},{style:{height:F},onTransitionEnd:R,children:[(0,k.jsx)("div",{className:"content",ref:M,children:t}),(0,k.jsx)("div",{className:"button",onClick:W,style:{height:F},children:"Delete"})]}))},T=n(86330),C=n(20662),w=n(87309),S=n(96038),E=n(74115),A=n(80202),D=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,k.jsx)(T.Z,{value:r,onSelect:a,listHeight:150,children:E.O9.map((function(e){return(0,k.jsx)(T.Z.Option,{value:e,children:(0,k.jsx)(A.W,{className:"tag-circle",color:e})},e)}))});return(0,k.jsx)(C.Z,{autoFocus:!0,placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},I=function(e){var t=e.noteTag,n=t.uid,s=t.color,l=t.name,u=t.notes,p=(0,i.useContext)(Ge),m=p.editing,h=p.tagUid,j=p.setAllTags,v=p.setTagUid,g=(0,i.useState)(l),Z=(0,a.Z)(g,2),b=Z[0],N=Z[1],T=(0,i.useState)(s),C=(0,a.Z)(T,2),I=C[0],U=C[1],F=(0,i.useState)(!1),L=(0,a.Z)(F,2),M=L[0],P=L[1];function O(){return B.apply(this,arguments)}function B(){return(B=(0,r.Z)(c().mark((function e(){var t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,o.Pn)(n);case 2:t=e.sent,v("DEFAULT"),j(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,i.useEffect)((function(){return P(!1)}),[m]);var z=function(){var e=(0,r.Z)(c().mark((function e(){var n,r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,d.Z)((0,d.Z)({},t),{},{name:b,color:I}),e.next=3,(0,o.tk)(n);case 3:r=e.sent,j(r),P(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),R=(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(A.W,{className:"tag-circle",color:I}),(0,k.jsx)("span",{className:"tag-name",children:b}),m||(0,k.jsx)("span",{className:"tag-num",children:u.length}),m&&(0,k.jsx)(w.Z,{size:"small",type:"text",onClick:function(){return P(!0)},icon:(0,k.jsx)(x.Z,{})})]}),W=(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(D,{tagName:b,setTagName:N,tagColor:I,setTagColor:U}),(0,k.jsxs)("div",{className:"buttons",children:[(0,k.jsx)(S.Z,{title:"This tag will be deleted.",onConfirm:O,placement:"left",cancelText:"Cancel",icon:(0,k.jsx)(f.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,k.jsx)(w.Z,{danger:!0,children:"Delete"})}),(0,k.jsx)(w.Z,{onClick:function(){N(l),U(s),P(!1)},children:"Cancel"}),(0,k.jsx)(w.Z,{type:"primary",disabled:!b,onClick:z,children:"OK"})]})]}),H=(0,E.MW)(s),K=H.light,G=H.dark;return(0,k.jsx)(y,{className:"tag-wrapper",onDelete:O,disable:m,children:(0,k.jsx)("div",{className:"tag-item","data-curr":h===n,"data-editing":M,onClick:function(){return v(n)},style:{"--light-color":K,"--dark-color":G},children:M?W:R})})},U=function(e){var t=e.setAdding,n=(0,i.useState)(""),r=(0,a.Z)(n,2),s=r[0],c=r[1],l=(0,i.useState)((0,E.mr)()),u=(0,a.Z)(l,2),d=u[0],x=u[1],f=(0,i.useContext)(Ge).setAllTags;return(0,k.jsx)("div",{className:"tag-wrapper",children:(0,k.jsxs)("div",{className:"tag-item","data-curr":!0,"data-editing":!0,children:[(0,k.jsx)(D,{tagName:s,setTagName:c,tagColor:d,setTagColor:x}),(0,k.jsxs)("div",{className:"buttons",children:[(0,k.jsx)(w.Z,{onClick:function(){return t(!1)},children:"Cancel"}),(0,k.jsx)(w.Z,{type:"primary",disabled:!s,onClick:function(){var e=s.trim();e&&((0,o.HO)(e,d).then(f),t(!1))},children:"OK"})]})]})})};function F(){var e=(0,i.useContext)(Ge),t=e.allTags,n=e.editing,r=e.tagUid,s=e.allNotes,c=e.setTagUid,o=e.setEditing,l=(0,i.useState)(!1),u=(0,a.Z)(l,2),d=u[0],x=u[1],f=(0,k.jsx)("div",{className:"tag-wrapper",children:(0,k.jsxs)("div",{className:"tag-item","data-curr":"DEFAULT"===r,onClick:function(){return c("DEFAULT")},children:[(0,k.jsx)(p.Z,{className:"all-note-icon"}),(0,k.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,k.jsx)("span",{className:"tag-num",children:Object.keys(s).length})]})}),h=(0,k.jsx)(w.Z,{className:"edit-btn small",shape:"round",type:n?"primary":"default",onClick:function(){return o((function(e){return!e}))},children:n?"Done":"Edit"});return(0,k.jsxs)("aside",{className:"side-menu",children:[(0,k.jsxs)("div",{className:"tag-list",children:[f,(0,k.jsx)(N,{children:Object.values(t).map((function(e){return(0,k.jsx)(I,{noteTag:e},e.uid)}))}),d&&(0,k.jsx)(U,{setAdding:x})]}),(0,k.jsxs)("footer",{children:[(0,k.jsx)(w.Z,{shape:"round",icon:(0,k.jsx)(m.Z,{}),onClick:function(){return x(!0)},disabled:d,children:"Add"}),h]})]})}var L=n(4942),M=n(37762),P=n(75660),O=n(89295),B=n(96989),z=n(37557),R=n(82670),W=n(52972),H=n(16871),K=n(6593),G=n.n(K),_=n(93433),V=n(70140),Y=n(37382),J=n(68692),X=n(13876),q=n(20054),Q=n(9486),$=n(1194),ee=n(53834),te=n(11730),ne=n(7974),re=function(e){var t=e.sortType,n=e.setSortType,r=e.searchText,a=e.setSearchText,s=e.onDelete,c=e.onMove,o=e.disabled,l=void 0===o||o,u=(0,i.useContext)(Ge),x=u.editing,p=u.allTags,m=u.setEditing,h=(0,k.jsx)(V.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],className:"sort-drop",items:[{type:"group",label:"Sort by",children:[{icon:(0,k.jsx)(J.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,k.jsx)(X.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,k.jsx)(q.Z,{}),key:"NAME",label:"Name"}]}]}),j={type:"text",shape:"circle"},v=(0,k.jsx)(Y.Z,{overlay:h,trigger:["click"],placement:"bottom",children:(0,k.jsx)(w.Z,(0,d.Z)({className:"sort-btn",icon:(0,k.jsx)(Q.Z,{rotate:90})},j))}),g=(0,k.jsx)(S.Z,{title:"Notes will be deleted.",onConfirm:s,icon:(0,k.jsx)(f.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:l,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,k.jsx)(w.Z,{className:"del-btn",shape:"round",type:"text",disabled:l,danger:!l,icon:(0,k.jsx)(f.Z,{}),children:"Delete"})}),Z=function(e){var t=e.color,n=e.name;return(0,k.jsxs)("div",{className:"tag-select",children:[(0,k.jsx)(A.W,{color:t,className:"tag-circle"}),(0,k.jsx)("span",{className:"name",children:n})]})},b=(0,k.jsx)(V.Z,{onClick:function(e){var t=e.key;return c(t)},items:[{key:"DEFAULT",label:(0,k.jsx)(Z,{color:"#eee",name:"No tag"})}].concat((0,_.Z)(Object.values(p).map((function(e){return{key:e.uid,label:(0,k.jsx)(Z,{color:e.color,name:e.name})}}))))}),N=(0,k.jsx)(Y.Z,{disabled:l,overlay:b,trigger:["click"],placement:"bottom",children:(0,k.jsx)(w.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,k.jsx)($.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,k.jsx)("div",{className:"head-tools","data-editing":x,children:x?(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(w.Z,(0,d.Z)({className:"small",onClick:function(){return m(!1)},icon:(0,k.jsx)(ee.Z,{})},j)),N,g]}):(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(C.Z,{value:r,onChange:function(e){return a(e.target.value)},className:"search-input",prefix:(0,k.jsx)(te.Z,{}),bordered:!1,allowClear:!0}),v,(0,k.jsx)(w.Z,(0,d.Z)({className:"small",onClick:function(){return m(!0)},icon:(0,k.jsx)(ne.Z,{})},j))]})})},ae=n(24124),se=n(97892),ce=n.n(se),ie=n(51570),oe=n(79856);function le(e){var t=e.noteList,n=(0,i.useContext)(Ge),s=n.editing,l=n.setAllTags,u=n.setAllNotes,d=(0,i.useState)("LAST"),x=(0,a.Z)(d,2),f=x[0],p=x[1],m=(0,i.useState)(""),h=(0,a.Z)(m,2),j=h[0],v=h[1],g=(0,i.useState)((0,ae.l4)()),Z=(0,a.Z)(g,2),b=Z[0],T=Z[1],C=function(){var e=(0,r.Z)(c().mark((function e(t){var n,r,a,s,i,d;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,M.Z)(t),e.prev=1,a.s();case 3:if((s=a.n()).done){e.next=12;break}return i=s.value,e.next=7,(0,o.f_)(i);case 7:d=e.sent,n=d.tags,r=d.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&l(n),r&&u(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),w=function(){var e=(0,r.Z)(c().mark((function e(t,n){var r,a,s,i,d,x;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=(0,M.Z)(t),e.prev=1,s.s();case 3:if((i=s.n()).done){e.next=12;break}return d=i.value,e.next=7,(0,o.tw)(d,n);case 7:x=e.sent,r=x.tags,a=x.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),s.e(e.t0);case 17:return e.prev=17,s.f(),e.finish(17);case 20:r&&l(r),a&&u(a);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t,n){return e.apply(this,arguments)}}(),S=(0,i.useMemo)((function(){var e=function(e,t){return t-e};switch(f){case"CREATE":return t.sortBy((function(e){return e.createTime}),e);case"LAST":return t.sortBy((function(e){return e.lastTime}),e);case"NAME":return t.sortBy((function(e){return e.name.toUpperCase()}));default:return t}}),[t,f]),E=(0,i.useMemo)((function(){return S.filter((function(e){return e.name.toUpperCase().includes(j.trim().toUpperCase())}))}),[j,S]);return(0,i.useEffect)((function(){v(""),T((0,ae.l4)())}),[t,s]),(0,k.jsx)(N,{children:(0,k.jsxs)(P.Z,{className:"note-list",children:[(0,k.jsx)(re,{sortType:f,setSortType:p,searchText:j,setSearchText:v,onDelete:function(){return C(b.toArray())},onMove:function(e){return w(b.toArray(),e)},disabled:0===b.size}),E.map((function(e){var t=e.uid;return(0,k.jsx)(O.Z,{timeout:300,children:(0,k.jsx)(y,{className:"note-wrapper",onDelete:function(){return C([t])},disable:s,children:(0,k.jsx)(ue,{noteInfo:e,selected:b.has(t),setSelectNotes:T})})},t)}))]})})}ce().extend(G());var ue=function(e){var t,n=e.noteInfo,s=e.selected,l=e.setSelectNotes,u=n.team,x=n.uid,f=n.name,p=n.lastTime,m=(0,i.useMemo)((function(){return ce()(p).calendar()}),[p]),h="".concat(u?"team":"reader","/").concat(x),j=(0,i.useContext)(Ge),v=j.editing,g=j.setAllNotes,Z=(0,i.useState)(f),b=(0,a.Z)(Z,2),N=b[0],y=b[1],T=(0,H.s0)(),w=(0,i.useState)(),S=(0,a.Z)(w,2),E=S[0],A=S[1],D=(0,i.useMemo)((function(){if(E){var e=E.state,t=E.ratio;return R.Dw.loadFromFlat(e,t)}}),[E]),I=(0,i.useState)(),U=(0,a.Z)(I,2),F=U[0],M=U[1];(0,i.useEffect)((function(){(0,r.Z)(c().mark((function e(){var t,n,r,a,s;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,o.U9)(x);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:if(n=t.pageRec,r=t.pageOrder,a=r[0]){e.next=9;break}return e.abrupt("return");case 9:return A(n[a]),e.next=12,(0,ie.yf)(x);case 12:if(s=e.sent){e.next=15;break}return e.abrupt("return");case 15:M(oe.f.createFromTeamPages(s).getOnePageStateMap(a));case 16:case"end":return e.stop()}}),e)})))()}),[x]);var P=(0,k.jsxs)("div",{className:"timg-wrapper","data-landscape":(null!==(t=null===E||void 0===E?void 0:E.ratio)&&void 0!==t?t:1.5)<1,children:[E&&D&&(0,k.jsx)(W.PageWrapper,{drawState:D,teamStateMap:F,thumbnail:E.image,preview:!0}),u&&(0,k.jsx)(B.Z,{className:"cloud-icon"}),(0,k.jsx)(z.Z,{className:"checked-icon"})]});return(0,k.jsxs)("div",{className:"note-item","data-selected":s,onClick:function(){if(!v)return T(h);l((function(e){return e.has(x)?e.delete(x):e.add(x)}))},children:[P,(0,k.jsxs)("div",{className:"content",children:[v||(0,k.jsx)("p",{className:"name",children:f}),v&&(0,k.jsx)(C.Z,{className:"name-input",value:N,onChange:function(e){return y(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=N.trim();if(!e||e===f)return y(f);(0,o.SP)(x,{name:e}),g((function(t){return(0,d.Z)((0,d.Z)({},t),{},(0,L.Z)({},x,(0,d.Z)((0,d.Z)({},t[x]),{},{name:e})))}))}}),(0,k.jsx)("span",{className:"date",children:m})]})]})},de=n(88894),xe=n(96324);function fe(){var e=(0,i.useState)(!1),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,i.useContext)(Ge),c=s.editing,o=s.tagUid,l=s.setEditing;(0,i.useEffect)((function(){c||r(!1)}),[o]);var u=(0,k.jsx)(w.Z,{className:"edit-btn large",onClick:function(){return l((function(e){return!e}))},type:c?"primary":"text",children:c?"Done":"Edit"}),d=(0,k.jsxs)(k.Fragment,{children:[(0,k.jsx)(w.Z,{className:"aside-btn",type:"text",icon:(0,k.jsx)(xe.Z,{}),onClick:function(){return r((function(e){return!e}))}}),(0,k.jsx)(de.Z,{className:"aside-drawer",width:300,placement:"left",closable:!1,visible:n,onClose:function(){return r(!1)},contentWrapperStyle:{boxShadow:"none"},bodyStyle:{padding:0,overflow:"hidden"},destroyOnClose:!0,children:(0,k.jsx)(F,{})})]});return(0,k.jsxs)("div",{className:"left-tools",children:[d,u]})}var pe=n(45987),me=n(50419),he=n(56075),je=n(69228),ve=n(99372),ge=n(66776),Ze=n(29529),ke=n(14057),be=n(12056),Ne=n(99660),ye=n(61753),Te=n(56200),Ce=n(82305),we=n(69951),Se=n(72058),Ee=n(44379),Ae=n(67415),De=n(61842),Ie=n.n(De),Ue=["children","title","keyName"];function Fe(){return(0,k.jsxs)("div",{className:"right-tools",children:[(0,k.jsx)(He,{}),(0,k.jsx)(We,{})]})}var Le=function(e){var t=e.children,n=e.title,r=e.keyName,s=(0,pe.Z)(e,Ue),c=(0,h.zI)(),i=(0,a.Z)(c,2),o=i[0],l=i[1];return(0,k.jsx)(O.Z,(0,d.Z)((0,d.Z)({in:o===r},s),{},{children:(0,k.jsxs)("div",{className:"secondary",children:[(0,k.jsxs)("nav",{children:[(0,k.jsx)(w.Z,{type:"text",shape:"circle",onClick:function(){return l("MENU")},icon:(0,k.jsx)(ve.Z,{})}),(0,k.jsx)("h3",{children:n})]}),t]})}))},Me=function(){var e=(0,i.useState)(!1),t=(0,a.Z)(e,2),s=t[0],l=t[1],u=(0,i.useContext)(Ge),d=u.tagUid,x=u.setAllTags,f=u.setAllNotes,p=(0,i.useState)(0),m=(0,a.Z)(p,2),h=m[0],j=m[1];function v(){return(v=(0,r.Z)(c().mark((function e(t){var r,a,s,i,u,p;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===t.type){e.next=2;break}return e.abrupt("return");case 2:return l(!0),e.next=5,Promise.all([n.e(643),n.e(701)]).then(n.bind(n,21176));case 5:return r=e.sent,a=r.LoadPDF,e.next=9,a(t,j);case 9:return(s=e.sent).tagID=d,e.next=13,(0,o.au)(s);case 13:return i=e.sent,u=i.tags,p=i.allNotes,x(u),f(p),l(!1),me.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,k.jsxs)(Ee.Z,{className:"pdf-upload",disabled:s,multiple:!1,action:"#",accept:"application/pdf",beforeUpload:function(e){return v.apply(this,arguments)},children:[(0,k.jsxs)("p",{className:"ant-upload-drag-icon",children:[s&&(0,k.jsx)(he.Z,{width:48,type:"circle",percent:h}),s||(0,k.jsx)(ge.Z,{})]}),(0,k.jsx)("p",{className:"ant-upload-hint",children:"Click or drag a pdf file here."})]})},Pe=function(){var e=(0,h.zI)(),t=(0,a.Z)(e,2)[1],n=(0,we.vW)(),r=(0,i.useState)(n),s=(0,a.Z)(r,2),c=s[0],o=s[1];return(0,k.jsxs)("div",{className:"profile-page",children:[(0,k.jsx)(C.Z,{value:c,onChange:function(e){return o(e.target.value)},prefix:(0,k.jsx)(Ze.Z,{}),allowClear:!0}),(0,k.jsx)(w.Z,{disabled:n===c||!c,onClick:function(){c&&((0,we.lu)(c),t("MENU"))},type:"primary",block:!0,children:"OK"})]})},Oe=function(){var e=(0,i.useContext)(Ge).menuInit,t=function(){var t=(0,r.Z)(c().mark((function t(){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Ie().clear();case 2:return t.next=4,(0,Se.eG)();case 4:e();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,k.jsxs)("div",{className:"setting-menu",children:[(0,k.jsx)(w.Z,{icon:(0,k.jsx)(ke.Z,{}),onClick:(0,r.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Ce.E();case 2:window.location.reload();case 3:case"end":return e.stop()}}),e)}))),block:!0,children:"Update"}),(0,k.jsx)(S.Z,{title:"Everything will be deleted.",onConfirm:t,icon:(0,k.jsx)(be.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,k.jsx)(w.Z,{icon:(0,k.jsx)(be.Z,{}),danger:!0,block:!0,children:"Clear all"})})]})},Be=[{key:"PDF",label:"Import PDF",component:(0,k.jsx)(Me,{}),icon:(0,k.jsx)(Ne.Z,{})},{key:"PROFILE",label:"My profile",component:(0,k.jsx)(Pe,{}),icon:(0,k.jsx)(Ze.Z,{})},{key:"SETTINGS",label:"Settings",component:(0,k.jsx)(Oe,{}),icon:(0,k.jsx)(x.Z,{})}],ze=function(){var e=(0,h.zI)(),t=(0,a.Z)(e,2)[1];return(0,k.jsx)("div",{className:"primary-menu",children:(0,k.jsx)(V.Z,{onClick:function(e){var n=e.key;return t(n)},items:Be})})},Re=function(){var e=(0,i.useState)(0),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,h.zI)(),c=(0,a.Z)(s,2),o=c[0],l=c[1],u={timeout:300,onEnter:function(e){r(e.clientHeight)},unmountOnExit:!0};return(0,i.useEffect)((function(){return l("MENU")}),[l]),(0,k.jsxs)("section",{className:"others-menu",style:{height:n},children:[(0,k.jsx)(O.Z,(0,d.Z)((0,d.Z)({in:"MENU"===o},u),{},{children:(0,k.jsx)(ze,{})})),Be.map((function(e){var t=e.key,n=e.label,r=e.component;return(0,k.jsx)(Le,(0,d.Z)((0,d.Z)({keyName:t,title:n},u),{},{children:r}),t)}))]})},We=function(){return(0,k.jsxs)(je.Z,{placement:"bottomRight",trigger:"click",content:(0,k.jsx)(h.s2,{initKey:"",children:(0,k.jsx)(Re,{})}),zIndex:900,children:[(0,k.jsx)(w.Z,{className:"large",shape:"circle",icon:(0,k.jsx)(ye.Z,{})}),(0,k.jsx)(w.Z,{className:"small",type:"text",icon:(0,k.jsx)(ye.Z,{})})]})},He=function(){var e=(0,i.useState)(""),t=(0,a.Z)(e,2),n=t[0],s=t[1],o=(0,i.useState)(!1),l=(0,a.Z)(o,2),u=l[0],d=l[1],x=(0,H.s0)();function f(){return(f=(0,r.Z)(c().mark((function e(t){var n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,ie.fI)(t);case 2:if(!(n=e.sent)){e.next=5;break}return e.abrupt("return",x("/team/".concat(n)));case 5:s(""),d(!0);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,k.jsxs)(je.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,onVisibleChange:function(){return d(!1)},content:(0,k.jsx)(Ae.GD,{plain:!0,length:4,error:u,value:n,onChange:function(e){d(!1),s(e)},onFill:function(e){return f.apply(this,arguments)}}),children:[(0,k.jsx)(w.Z,{className:"team-btn large",shape:"round",icon:(0,k.jsx)(Te.Z,{}),children:"Team"}),(0,k.jsx)(w.Z,{className:"team-btn small",type:"text",icon:(0,k.jsx)(Te.Z,{})})]})};function Ke(){var e,t=(0,i.useContext)(Ge),n=t.tagUid,r=t.allTags,a="DEFAULT"===n;return(0,k.jsxs)("header",{children:[(0,k.jsx)(fe,{}),(0,k.jsx)("h2",{"data-logo":a,children:a?"Multibility":null===(e=r[n])||void 0===e?void 0:e.name}),(0,k.jsx)(Fe,{})]})}var Ge=i.createContext({tagUid:"DEFAULT",editing:!1,allNotes:{},allTags:{},setAllNotes:function(){},setAllTags:function(){},setTagUid:function(){},setEditing:function(){},menuInit:function(){}});function _e(){var e=(0,i.useState)({}),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,i.useState)({}),c=(0,a.Z)(s,2),l=c[0],u=c[1],d=(0,i.useState)("DEFAULT"),x=(0,a.Z)(d,2),f=x[0],p=x[1],m=(0,i.useState)(!1),h=(0,a.Z)(m,2),j=h[0],v=h[1],g=(0,i.useMemo)((function(){var e;return null!==(e=l[f])&&void 0!==e?e:{uid:"",name:"All Notes",color:"#000000",notes:Object.keys(n)}}),[n,l,f]),Z=(0,i.useMemo)((function(){return(0,ae.aV)(g.notes.filter((function(e){return e in n})).map((function(e){return n[e]})))}),[g,n]),b=function(){(0,o.hY)().then(r),(0,o.Ys)().then(u),document.title="Multibility"};return(0,i.useEffect)(b,[]),(0,k.jsx)(Ge.Provider,{value:{tagUid:f,editing:j,allNotes:n,allTags:l,setAllNotes:r,setAllTags:u,setEditing:v,setTagUid:p,menuInit:b},children:(0,k.jsxs)("div",{className:"main-menu container",children:[(0,k.jsx)(Ke,{}),(0,k.jsxs)("main",{children:[(0,k.jsx)(F,{}),(0,k.jsx)(le,{noteList:Z}),(0,k.jsx)(Ve,{})]})]})})}var Ve=function(){var e=(0,i.useContext)(Ge),t=e.tagUid,n=e.setAllTags,a=e.setAllNotes;function s(){return(s=(0,r.Z)(c().mark((function e(){var r,s,i,u;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=(0,l.Xn)()).tagID=t,e.next=4,(0,o.au)(r);case 4:s=e.sent,i=s.tags,u=s.allNotes,n(i),a(u);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,k.jsx)(w.Z,{className:"new-note",size:"large",type:"primary",shape:"circle",onClick:function(){return s.apply(this,arguments)},icon:(0,k.jsx)(u.Z,{})})}},72058:function(e,t,n){n.d(t,{eG:function(){return f},mp:function(){return u},pW:function(){return d}});var r=n(37762),a=n(93433),s=n(15861),c=n(87757),i=n.n(c),o=n(61842),l=n.n(o)().createInstance({name:"imageForage"}),u=function(){var e=(0,s.Z)(i().mark((function e(t,n){var r,s,c;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=r=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==r;case 6:if(!e.t0){e.next=10;break}e.t2=r,e.next=11;break;case 10:e.t2=[];case 11:if(s=e.t2,c="".concat(t,"_").concat(n),s.includes(c)){e.next=15;break}return e.abrupt("return");case 15:return s=[c].concat((0,a.Z)(s.filter((function(e){return e!==c})))),e.next=18,l.setItem("LIST",s);case 18:return e.next=20,l.getItem(c);case 20:return e.abrupt("return",e.sent);case 21:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),d=function(){var e=(0,s.Z)(i().mark((function e(t,n,r){var s,c,o;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=s=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==s;case 6:if(!e.t0){e.next=10;break}e.t2=s,e.next=11;break;case 10:e.t2=[];case 11:return c=e.t2,o="".concat(t,"_").concat(n),(c=[o].concat((0,a.Z)(c.filter((function(e){return e!==o}))))).length>10&&(c=c.slice(0,10)),e.next=17,l.setItem("LIST",c);case 17:return e.next=19,l.setItem(o,r);case 19:x();case 20:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),x=function(){var e=(0,s.Z)(i().mark((function e(){var t,n,a,s,c,o,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=t=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==t;case 6:if(!e.t0){e.next=10;break}e.t2=t,e.next=11;break;case 10:e.t2=[];case 11:return n=e.t2,a=new Set(n),e.next=15,l.keys();case 15:s=e.sent,c=(0,r.Z)(s),e.prev=17,c.s();case 19:if((o=c.n()).done){e.next=28;break}if("LIST"!==(u=o.value)){e.next=23;break}return e.abrupt("continue",26);case 23:if(a.has(u)){e.next=26;break}return e.next=26,l.removeItem(u);case 26:e.next=19;break;case 28:e.next=33;break;case 30:e.prev=30,e.t3=e.catch(17),c.e(e.t3);case 33:return e.prev=33,c.f(),e.finish(33);case 36:case"end":return e.stop()}}),e,null,[[17,30,33,36]])})));return function(){return e.apply(this,arguments)}}(),f=function(){return l.clear()}}}]);
//# sourceMappingURL=259.99b2a16e.chunk.js.map