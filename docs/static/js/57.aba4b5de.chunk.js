"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[57],{85307:function(e,t,n){n.r(t),n.d(t,{MenuMethodCtx:function(){return we},MenuStateCtx:function(){return je},NewNoteButton:function(){return Ne},default:function(){return Se}});var r=n(15861),a=n(29439),s=n(87757),u=n.n(s),c=n(72791),i=n(75783),o=n(92198),l=n(30501),p=n(1413),f=n(70140),d=n(87309),x=n(50419),h=n(56075),m=n(20662),v=n(96038),g=n(69228),k=n(99660),Z=n(29529),b=n(92414),y=n(99372),j=n(66776),w=n(14057),S=n(12056),N=n(61753),C=n(56200),T=n(82305),I=n(69951),A=n(24595),E=n(51570),D=n(16871),L=n(44379),M=n(67415),O=n(61842),U=n.n(O),F=n(80184),P=(0,c.createContext)({setActive:function(){}});function R(){return(0,F.jsxs)("div",{className:"right-tools",children:[(0,F.jsx)(W,{}),(0,F.jsx)(z,{})]})}var _=function(){var e=(0,c.useContext)(P).setActive;return(0,F.jsx)("div",{className:"other-menu",children:(0,F.jsx)(f.Z,{onClick:function(t){var n=t.key;return e(n)},items:[{key:"PDF",icon:(0,F.jsx)(k.Z,{}),label:"Import PDF"},{key:"PROFILE",icon:(0,F.jsx)(Z.Z,{}),label:"My profile"},{key:"SETTINGS",icon:(0,F.jsx)(b.Z,{}),label:"Settings"}]})})},B=function(e){var t=e.children,n=e.title,r=(0,c.useContext)(P).setActive;return(0,F.jsxs)("div",{className:"secondary",children:[(0,F.jsxs)("nav",{children:[(0,F.jsx)(d.Z,{type:"text",shape:"circle",onClick:function(){return r("MENU")},icon:(0,F.jsx)(y.Z,{})}),(0,F.jsx)("h3",{children:n})]}),t]})};function G(){var e=(0,c.useState)(!1),t=(0,a.Z)(e,2),s=t[0],o=t[1],l=(0,c.useContext)(je).tagUid,p=(0,c.useContext)(we),f=p.setAllTags,d=p.setAllNotes,m=(0,c.useState)(0),v=(0,a.Z)(m,2),g=v[0],k=v[1];function Z(){return(Z=(0,r.Z)(u().mark((function e(t){var r,a,s,c,p,h;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===t.type){e.next=2;break}return e.abrupt("return");case 2:return o(!0),e.next=5,Promise.all([n.e(643),n.e(701)]).then(n.bind(n,21176));case 5:return r=e.sent,a=r.LoadPDF,e.next=9,a(t,k);case 9:return(s=e.sent).tagID=l,e.next=13,(0,i.au)(s);case 13:return c=e.sent,p=c.tags,h=c.allNotes,f(p),d(h),o(!1),x.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,F.jsx)(B,{title:"Import PDF",children:(0,F.jsxs)(L.Z,{disabled:s,multiple:!1,action:"#",accept:"application/pdf",beforeUpload:function(e){return Z.apply(this,arguments)},children:[(0,F.jsx)("p",{className:"ant-upload-drag-icon",children:s?(0,F.jsx)(h.Z,{width:48,type:"circle",percent:g}):(0,F.jsx)(j.Z,{})}),(0,F.jsx)("p",{className:"ant-upload-hint",children:"Click or drag a pdf file here."})]})})}var V=function(){var e=(0,I.vW)(),t=(0,c.useState)(e),n=(0,a.Z)(t,2),r=n[0],s=n[1],u=(0,c.useContext)(P).setActive;return(0,F.jsx)(B,{title:"My profile",children:(0,F.jsxs)("div",{className:"profile-page",children:[(0,F.jsx)(m.Z,{value:r,onChange:function(e){return s(e.target.value)},prefix:(0,F.jsx)(Z.Z,{}),allowClear:!0}),(0,F.jsx)(d.Z,{disabled:e===r||!r,onClick:function(){r&&((0,I.lu)(r),u("MENU"))},type:"primary",block:!0,children:"OK"})]})})},H=function(){var e=(0,c.useContext)(we).menuInit,t=function(){var t=(0,r.Z)(u().mark((function t(){return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,U().clear();case 2:e();case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,F.jsx)(B,{title:"Settings",children:(0,F.jsxs)("div",{className:"setting-menu",children:[(0,F.jsx)(d.Z,{icon:(0,F.jsx)(w.Z,{}),onClick:(0,r.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,T.E();case 2:window.location.reload();case 3:case"end":return e.stop()}}),e)}))),block:!0,children:"Update"}),(0,F.jsx)(v.Z,{title:"Everything will be deleted.",onConfirm:t,icon:(0,F.jsx)(S.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,F.jsx)(d.Z,{icon:(0,F.jsx)(S.Z,{}),danger:!0,block:!0,children:"Clear all"})})]})})},Y=function(){var e=(0,c.useState)(0),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,c.useState)(""),u=(0,a.Z)(s,2),i=u[0],o=u[1],l={timeout:300,onEnter:function(e){r(e.clientHeight)},unmountOnExit:!0},f=(0,p.Z)((0,p.Z)({},l),{},{classNames:"secondary"});return(0,c.useEffect)((function(){return o("MENU")}),[]),(0,F.jsx)(P.Provider,{value:{setActive:o},children:(0,F.jsxs)("section",{className:"others-menu",style:{height:n},children:[(0,F.jsx)(A.Z,(0,p.Z)((0,p.Z)({classNames:"primary",in:"MENU"===i},l),{},{children:(0,F.jsx)(_,{})})),(0,F.jsx)(A.Z,(0,p.Z)((0,p.Z)({in:"PDF"===i},f),{},{children:(0,F.jsx)(G,{})})),(0,F.jsx)(A.Z,(0,p.Z)((0,p.Z)({in:"PROFILE"===i},f),{},{children:(0,F.jsx)(V,{})})),(0,F.jsx)(A.Z,(0,p.Z)((0,p.Z)({in:"SETTINGS"===i},f),{},{children:(0,F.jsx)(H,{})}))]})})},z=function(){var e={shape:"circle",icon:(0,F.jsx)(N.Z,{})};return(0,F.jsxs)(g.Z,{placement:"bottomRight",trigger:"click",content:(0,F.jsx)(Y,{}),zIndex:900,children:[(0,F.jsx)(d.Z,(0,p.Z)({className:"large"},e)),(0,F.jsx)(d.Z,(0,p.Z)({className:"small",type:"text"},e))]})};function W(){var e=(0,c.useState)(""),t=(0,a.Z)(e,2),n=t[0],s=t[1],i=(0,c.useState)(!1),o=(0,a.Z)(i,2),l=o[0],p=o[1],f=(0,D.s0)();function x(){return(x=(0,r.Z)(u().mark((function e(t){var n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,E.fI)(t);case 2:if(!(n=e.sent)){e.next=5;break}return e.abrupt("return",f("/team/".concat(n)));case 5:s(""),p(!0);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,F.jsxs)(g.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,onVisibleChange:function(){return p(!1)},content:(0,F.jsx)(M.GD,{plain:!0,length:4,error:l,value:n,onChange:function(e){p(!1),s(e)},onFill:function(e){return x.apply(this,arguments)}}),children:[(0,F.jsx)(d.Z,{className:"team-btn large",shape:"round",icon:(0,F.jsx)(C.Z,{}),children:"Team"}),(0,F.jsx)(d.Z,{className:"team-btn small",type:"text",shape:"circle",icon:(0,F.jsx)(C.Z,{})})]})}var K=n(88894),J=n(96324),X=n(88405);function q(){var e=(0,c.useState)(!1),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,c.useContext)(je).editing,u=(0,c.useContext)(we).setEditing;var i=(0,F.jsx)(d.Z,{className:"edit-btn large",onClick:function(){u((function(e){return!e}))},type:s?"primary":"text",children:s?"Done":"Edit"}),o=(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(d.Z,{className:"aside-btn",type:"text",icon:(0,F.jsx)(J.Z,{}),onClick:function(){return r((function(e){return!e}))}}),(0,F.jsx)(K.Z,{className:"aside-drawer",width:300,placement:"left",closable:!1,visible:n,onClose:function(){return r(!1)},contentWrapperStyle:{boxShadow:"none"},bodyStyle:{padding:0,overflow:"hidden"},destroyOnClose:!0,children:(0,F.jsx)(X.Z,{onSelect:function(){return s||r(!1)}})})]});return(0,F.jsxs)("div",{className:"left-tools",children:[o,i]})}var Q=n(81694),$=n.n(Q),ee=n(4942),te=n(93433),ne=n(37762),re=n(68692),ae=n(13876),se=n(20054),ue=n(9486),ce=n(82622),ie=n(1194),oe=n(11730),le=n(42553),pe=n(37382),fe=n(47528),de=n(53132),xe=n(16911),he=n(24124),me=n(97892),ve=n.n(me),ge=n(6593),ke=n.n(ge);function Ze(e){var t=e.noteList,n=(0,c.useState)(""),s=(0,a.Z)(n,2),o=s[0],l=s[1],p=(0,c.useContext)(je).editing,f=(0,c.useContext)(we),d=f.setAllTags,x=f.setAllNotes,h=(0,c.useState)("LAST"),m=(0,a.Z)(h,2),v=m[0],g=m[1],k=(0,c.useState)(""),Z=(0,a.Z)(k,2),b=Z[0],y=Z[1],j=(0,c.useState)((0,he.l4)()),w=(0,a.Z)(j,2),S=w[0],N=w[1],C=function(){var e=(0,r.Z)(u().mark((function e(t){var n,r,a,s,c,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,ne.Z)(t),e.prev=1,a.s();case 3:if((s=a.n()).done){e.next=12;break}return c=s.value,e.next=7,(0,i.f_)(c);case 7:o=e.sent,n=o.tags,r=o.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&d(n),r&&x(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),T=function(){var e=(0,r.Z)(u().mark((function e(t,n){var r,a,s,c,o,l;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=(0,ne.Z)(t),e.prev=1,s.s();case 3:if((c=s.n()).done){e.next=12;break}return o=c.value,e.next=7,(0,i.tw)(o,n);case 7:l=e.sent,r=l.tags,a=l.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),s.e(e.t0);case 17:return e.prev=17,s.f(),e.finish(17);case 20:r&&d(r),a&&x(a);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t,n){return e.apply(this,arguments)}}(),I=(0,c.useMemo)((function(){var e=function(e,t){return t-e};switch(v){case"CREATE":return t.sortBy((function(e){return e.createTime}),e);case"LAST":return t.sortBy((function(e){return e.lastTime}),e);case"NAME":return t.sortBy((function(e){return e.name.toUpperCase()}));default:return t}}),[t,v]),A=(0,c.useMemo)((function(){return I.filter((function(e){return e.name.toUpperCase().includes(b.trim().toUpperCase())}))}),[b,I]);return(0,c.useEffect)((function(){y(""),N((0,he.l4)())}),[t,p]),(0,F.jsxs)("section",{className:"note-list",children:[(0,F.jsx)(be,{sortType:v,setSortType:g,searchText:b,setSearchText:y,onDelete:function(){return C(S.toArray())},onMove:function(e){return T(S.toArray(),e)},disabled:0===S.size}),A.map((function(e){var t=e.uid;return(0,F.jsx)(de.Z,{onDelete:function(){return C([t])},nowSwiped:o,setNowSwiped:l,disable:p,uid:t,children:(0,F.jsx)(ye,{noteInfo:e,selected:S.has(t),setSelectNotes:N})},t)}))]})}ve().extend(ke());var be=function(e){var t=e.sortType,n=e.setSortType,r=e.searchText,a=e.setSearchText,s=e.onDelete,u=e.onMove,i=e.disabled,o=void 0===i||i,l=(0,c.useContext)(je),p=l.editing,x=l.allTags,h=(0,F.jsx)(f.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],className:"sort-drop",items:[{type:"group",label:"Sort by",children:[{icon:(0,F.jsx)(re.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,F.jsx)(ae.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,F.jsx)(se.Z,{}),key:"NAME",label:"Name"}]}]}),g=(0,F.jsx)(pe.Z,{overlay:h,trigger:["click"],placement:"bottom",children:(0,F.jsx)(d.Z,{className:"sort-btn",type:"text",shape:"circle",icon:(0,F.jsx)(ue.Z,{rotate:90})})}),k=(0,F.jsx)(v.Z,{title:"Notes will be deleted.",onConfirm:s,icon:(0,F.jsx)(ce.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:o,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,F.jsx)(d.Z,{className:"del-btn",shape:"round",type:"text",disabled:o,danger:!o,icon:(0,F.jsx)(ce.Z,{}),children:"Delete"})}),Z=function(e){var t=e.color,n=e.name;return(0,F.jsxs)("div",{className:"tag-select",children:[(0,F.jsx)(X.Y,{color:t}),(0,F.jsx)("span",{className:"name",children:n})]})},b=(0,F.jsx)(f.Z,{onClick:function(e){var t=e.key;return u(t)},items:[{key:"DEFAULT",label:(0,F.jsx)(Z,{color:"#eee",name:"No tag"})}].concat((0,te.Z)(Object.values(x).map((function(e){return{key:e.uid,label:(0,F.jsx)(Z,{color:e.color,name:e.name})}}))))}),y=(0,F.jsx)(pe.Z,{disabled:o,overlay:b,trigger:["click"],placement:"bottom",children:(0,F.jsx)(d.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,F.jsx)(ie.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,F.jsx)("div",{className:$()("head-tools",{editing:p}),children:p?(0,F.jsxs)(F.Fragment,{children:[y,k]}):(0,F.jsxs)(F.Fragment,{children:[(0,F.jsx)(m.Z,{value:r,onChange:function(e){return a(e.target.value)},className:"search-input",prefix:(0,F.jsx)(oe.Z,{}),bordered:!1,allowClear:!0}),g]})})},ye=function(e){var t=e.noteInfo,n=e.selected,r=e.setSelectNotes,s=t.team,u=t.uid,o=t.name,l=t.thumbnail,f=t.lastTime,d=(0,c.useMemo)((function(){return ve()(f).calendar()}),[f]),x="".concat(s?"team":"reader","/").concat(u),h=(0,c.useContext)(je).editing,v=(0,c.useContext)(we).setAllNotes,g=(0,c.useState)(o),k=(0,a.Z)(g,2),Z=k[0],b=k[1],y=(0,c.useState)(!1),j=(0,a.Z)(y,2),w=j[0],S=j[1],N=(0,D.s0)();return(0,F.jsxs)("div",{className:$()("note-item",{selected:n,loaded:w}),onClick:function(){if(!h)return N(x);r((function(e){return e.has(u)?e.delete(u):e.add(u)}))},onAnimationEnd:function(){return S(!0)},children:[(0,F.jsxs)("div",{className:"timg-wrapper",children:[(0,F.jsx)("img",{src:l||xe,alt:o,className:"timg"}),s&&(0,F.jsx)(fe.Z,{color:"blue",className:"cloud-icon",children:(0,F.jsx)(le.Z,{})})]}),(0,F.jsxs)("div",{className:"content",children:[h||(0,F.jsx)("p",{className:"name",children:o}),h&&(0,F.jsx)(m.Z,{className:"name-input",value:Z,onChange:function(e){return b(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=Z.trim();if(!e||e===o)return b(o);(0,i.SP)(u,{name:e}),v((function(t){return(0,p.Z)((0,p.Z)({},t),{},(0,ee.Z)({},u,(0,p.Z)((0,p.Z)({},t[u]),{},{name:e})))}))}}),(0,F.jsx)("p",{className:"date",children:d})]})]})},je=(0,c.createContext)({tagUid:"DEFAULT",editing:!1,allNotes:{},allTags:{}}),we=(0,c.createContext)({setAllNotes:function(){},setAllTags:function(){},setTagUid:function(){},setEditing:function(){},menuInit:function(){}});function Se(){var e=(0,c.useState)({}),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,c.useState)({}),u=(0,a.Z)(s,2),o=u[0],l=u[1],p=(0,c.useState)("DEFAULT"),f=(0,a.Z)(p,2),d=f[0],x=f[1],h=(0,c.useState)(!1),m=(0,a.Z)(h,2),v=m[0],g=m[1],k=(0,c.useMemo)((function(){return"DEFAULT"===d?{uid:"",name:"All Notes",color:"#000000",notes:Object.keys(n)}:o[d]}),[n,o,d]),Z=(0,c.useMemo)((function(){return(0,he.aV)(k.notes.filter((function(e){return e in n})).map((function(e){return n[e]})))}),[k,n]),b=function(){(0,i.hY)().then(r),(0,i.Ys)().then(l),document.title="Multibility"};(0,c.useEffect)(b,[]);var y="DEFAULT"===d;return(0,F.jsx)(je.Provider,{value:{tagUid:d,editing:v,allNotes:n,allTags:o},children:(0,F.jsx)(we.Provider,{value:{setAllNotes:r,setAllTags:l,setEditing:g,setTagUid:x,menuInit:b},children:(0,F.jsxs)("div",{className:"main-menu container",children:[(0,F.jsxs)("header",{children:[(0,F.jsx)(q,{}),(0,F.jsx)("h2",{className:$()({logo:y}),children:y?"Multibility":k.name}),(0,F.jsx)(R,{})]}),(0,F.jsxs)("main",{children:[(0,F.jsx)(X.Z,{}),(0,F.jsx)(Ze,{noteList:Z}),(0,F.jsx)(Ne,{})]})]})})})}var Ne=function(){var e=(0,c.useContext)(je).tagUid,t=(0,c.useContext)(we),n=t.setAllTags,a=t.setAllNotes;function s(){return(s=(0,r.Z)(u().mark((function t(){var r,s,c,l;return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(r=(0,o.Xn)()).tagID=e,t.next=4,(0,i.au)(r);case 4:s=t.sent,c=s.tags,l=s.allNotes,n(c),a(l);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return(0,F.jsx)(d.Z,{className:"new-note",size:"large",type:"primary",shape:"circle",onClick:function(){return s.apply(this,arguments)},icon:(0,F.jsx)(l.Z,{})})}},88405:function(e,t,n){n.d(t,{Y:function(){return S},Z:function(){return I}});var r=n(1413),a=n(15861),s=n(29439),u=n(87757),c=n.n(u),i=n(47323),o=n(20662),l=n(87309),p=n(96038),f=n(89267),d=n(72791),x=n(75783),h=n(74115),m=n(85307),v=n(92414),g=n(82622),k=n(57768),Z=n(51147),b=n(53132),y=n(81694),j=n.n(y),w=n(80184),S=function(e){var t={backgroundColor:e.color};return(0,w.jsx)("div",{className:"tag-circle",style:t})},N=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,w.jsx)(i.Z,{value:r,onSelect:a,listHeight:150,children:h.O9.map((function(e){return(0,w.jsx)(i.Z.Option,{value:e,children:(0,w.jsx)(S,{color:e})},e)}))});return(0,w.jsx)(o.Z,{placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},C=function(e){var t=e.noteTag,n=e.removeTag,u=e.onClick,i=t.uid,o=t.color,f=t.name,h=t.notes,k=(0,d.useContext)(m.MenuStateCtx),Z=k.editing,b=k.tagUid,y=(0,d.useContext)(m.MenuMethodCtx).setAllTags,C=(0,d.useState)(f),T=(0,s.Z)(C,2),I=T[0],A=T[1],E=(0,d.useState)(o),D=(0,s.Z)(E,2),L=D[0],M=D[1],O=(0,d.useState)(!1),U=(0,s.Z)(O,2),F=U[0],P=U[1];(0,d.useEffect)((function(){return P(!1)}),[Z]);var R=function(){var e=(0,a.Z)(c().mark((function e(){var n,a;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,r.Z)((0,r.Z)({},t),{},{name:I,color:L}),e.next=3,(0,x.tk)(n);case 3:a=e.sent,y(a),P(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,w.jsxs)("div",{className:j()("tag-item",{curr:b===i,editing:F}),onClick:u,children:[F||(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(S,{color:L}),(0,w.jsx)("span",{className:"tag-name",children:I})]}),Z||(0,w.jsx)("span",{className:"tag-num",children:h.length}),Z&&!F&&(0,w.jsx)(l.Z,{size:"small",type:"text",onClick:function(){return P(!0)},icon:(0,w.jsx)(v.Z,{})}),F&&(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(N,{tagName:I,setTagName:A,tagColor:L,setTagColor:M}),(0,w.jsxs)("div",{className:"buttons",children:[(0,w.jsx)(p.Z,{title:"This tag will be deleted.",onConfirm:n,placement:"left",cancelText:"Cancel",icon:(0,w.jsx)(g.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,w.jsx)(l.Z,{danger:!0,children:"Delete"})}),(0,w.jsx)(l.Z,{onClick:function(){A(f),M(o),P(!1)},children:"Cancel"}),(0,w.jsx)(l.Z,{type:"primary",disabled:!I,onClick:R,children:"OK"})]})]})]})},T=function(){var e=(0,d.useContext)(m.MenuMethodCtx).setAllTags,t=(0,d.useState)(!1),n=(0,s.Z)(t,2),r=n[0],a=n[1],u=(0,d.useState)(""),c=(0,s.Z)(u,2),i=c[0],o=c[1],p=(0,d.useState)((0,h.mr)()),v=(0,s.Z)(p,2),g=v[0],Z=v[1];return(0,d.useEffect)((function(){o(""),Z((0,h.mr)())}),[r]),(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(l.Z,{shape:"round",icon:(0,w.jsx)(k.Z,{}),onClick:function(){return a(!0)},children:"Add"}),(0,w.jsx)(f.Z,{visible:r,onCancel:function(){return a(!1)},title:"Add a new tag",width:400,onOk:function(){var t=i.trim();t&&((0,x.HO)(t,g).then(e),a(!1))},destroyOnClose:!0,children:(0,w.jsx)(N,{tagName:i,setTagName:o,tagColor:g,setTagColor:Z})})]})};function I(e){var t=e.onSelect,n=(0,d.useContext)(m.MenuStateCtx),r=n.allTags,u=n.editing,i=n.tagUid,o=n.allNotes,p=(0,d.useContext)(m.MenuMethodCtx),f=p.setTagUid,h=p.setAllTags,v=(0,d.useContext)(m.MenuMethodCtx).setEditing,g=(0,d.useState)(""),k=(0,s.Z)(g,2),y=k[0],S=k[1];function N(){return(N=(0,a.Z)(c().mark((function e(t){var n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,x.Pn)(t);case 2:n=e.sent,f("DEFAULT"),h(n);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var I=function(e){f(e),t&&t()},A=(0,w.jsx)("div",{className:"tag-wrapper",children:(0,w.jsxs)("div",{className:j()("tag-item",{curr:"DEFAULT"===i}),onClick:function(){return I("DEFAULT")},children:[(0,w.jsx)(Z.Z,{className:"all-note-icon"}),(0,w.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,w.jsx)("span",{className:"tag-num",children:Object.keys(o).length})]})}),E=(0,w.jsx)(l.Z,{className:"edit-btn small",shape:"round",type:u?"primary":"default",onClick:function(){return v((function(e){return!e}))},children:u?"Done":"Edit"});return(0,w.jsxs)("aside",{className:"side-menu",children:[(0,w.jsxs)("div",{className:"tag-list",children:[A,Object.values(r).map((function(e){var t=e.uid,n=function(){return function(e){return N.apply(this,arguments)}(t)};return(0,w.jsx)("div",{className:"tag-wrapper",children:(0,w.jsx)(b.Z,{uid:t,onDelete:n,nowSwiped:y,setNowSwiped:S,disable:u,children:(0,w.jsx)(C,{noteTag:e,removeTag:n,onClick:function(){return I(t)}})})},t)}))]}),(0,w.jsxs)("footer",{children:[(0,w.jsx)(T,{}),E]})]})}},53132:function(e,t,n){n.d(t,{Z:function(){return l}});var r=n(1413),a=n(29439),s=n(72791),u=n(11956),c=n(81694),i=n.n(c),o=n(80184),l=function(e){var t=e.children,n=e.nowSwiped,c=e.setNowSwiped,l=e.uid,p=e.onDelete,f=e.disable,d=void 0!==f&&f,x=e.className,h=(0,s.useState)(!1),m=(0,a.Z)(h,2),v=m[0],g=m[1],k=(0,s.useState)(!1),Z=(0,a.Z)(k,2),b=Z[0],y=Z[1],j=(0,s.useState)(),w=(0,a.Z)(j,2),S=w[0],N=w[1],C=(0,s.useRef)(null),T=b&&(void 0===n||n===l),I=(0,u.useSwipeable)({onSwipedLeft:function(){var e;y(!0),c&&c(l),N(null===(e=C.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){y(!1),c&&c(""),N(void 0)},preventDefaultTouchmoveEvent:!0,trackTouch:!d});return(0,s.useEffect)((function(){d&&(N(void 0),c&&c(""),y(!1))}),[d,c]),(0,o.jsxs)("div",(0,r.Z)((0,r.Z)({className:i()("swipe-wrapper",x,{deleted:v,deleting:T})},I),{},{style:{height:S},onTransitionEnd:function(e){"height"===e.propertyName&&v&&p()},children:[(0,o.jsx)("div",{className:"content",ref:C,children:t}),(0,o.jsx)("div",{className:"button-wrapper",children:(0,o.jsx)("div",{className:"button",onClick:function(){return g(!0)},style:{height:S},children:"Delete"})})]}))}},74115:function(e,t,n){n.d(t,{O9:function(){return r},bM:function(){return s},mr:function(){return a}});var r=["#000000","#9ca3af","#64748b","#78716c","#f97316","#eab308","#84cc16","#22c55e","#10b981","#14b8a6","#06b6d4","#0ea5e9","#3b82f6","#6366f1","#8b5cf6","#a855f7","#d946ef","#ec4899","#f43f5e","#ef4444"],a=function(){var e=Math.floor(Math.random()*r.length);return r[e]},s=function(e){var t=function(e){var t=0;if(0===e.length)return t;for(var n=0;n<e.length;n++)t=(t<<5)-t+e.charCodeAt(n),t|=0;return Math.abs(t)}(e)%r.length;return r[t]}},82670:function(e,t,n){n.d(t,{Dw:function(){return h},F:function(){return x},mF:function(){return p}});var r=n(1413),a=n(29439),s=n(15671),u=n(43144),c=n(24124),i=n(24610),o=n(25641),l=n.n(o),p=2e3,f={strokes:(0,c.zN)(),undoStack:(0,c.aV)(),historyStack:(0,c.aV)()},d=(0,c.WV)(f),x=function(){return{strokes:{}}},h=function(){function e(t,n,r,a){(0,s.Z)(this,e),this.immutable=t,this.width=n,this.height=r,this.lastOp=a}return(0,u.Z)(e,[{key:"getImmutable",value:function(){return this.immutable}},{key:"getUndoStack",value:function(){return this.getImmutable().get("undoStack")}},{key:"getHistoryStack",value:function(){return this.getImmutable().get("historyStack")}},{key:"getStrokeMap",value:function(){return this.getImmutable().get("strokes")}},{key:"getStrokeList",value:function(){return this.getStrokeMap().toArray().map((function(e){var t=(0,a.Z)(e,2);t[0];return t[1]}))}},{key:"getLastStroke",value:function(){return this.getStrokeMap().last()}},{key:"isEmpty",value:function(){return 0===this.getStrokeMap().size}},{key:"hasStroke",value:function(e){return this.getStrokeMap().has(e)}}],[{key:"createEmpty",value:function(t,n){return new e(d(),t,n)}},{key:"undo",value:function(t){var n=t.getHistoryStack().last();if(!n)return t;var r=t.getUndoStack().unshift(t.getImmutable());return new e(n.set("undoStack",r),t.width,t.height,{type:"undo"})}},{key:"redo",value:function(t){var n=t.getUndoStack().first();return n?new e(n,t.width,t.height,{type:"redo"}):t}},{key:"addStroke",value:function(t,n){var r={pathData:n,uid:(0,i.v4)(),timestamp:Date.now()};return e.pushStroke(t,r)}},{key:"pushStroke",value:function(t,n){var r=n.uid,a=t.getImmutable(),s=a.update("strokes",(function(e){return e.set(r,n)})).update("historyStack",(function(e){return e.push(a)})).delete("undoStack"),u={type:"add",stroke:n};return new e(s,t.width,t.height,u)}},{key:"eraseStrokes",value:function(t,n){if(0===n.length)return t;var r=t.getImmutable(),a=r.update("strokes",(function(e){return e.deleteAll(n)})).update("historyStack",(function(e){return e.push(r)})).delete("undoStack"),s={type:"erase",erased:n};return new e(a,t.width,t.height,s)}},{key:"mutateStrokes",value:function(t,n){if(0===n.length)return t;var s=t.getImmutable(),u=t.getStrokeMap();n.forEach((function(e){var t=(0,a.Z)(e,2),n=t[0],s=t[1];return u=u.update(n,{uid:n,pathData:s,timestamp:Date.now()},(function(e){return(0,r.Z)((0,r.Z)({},e),{},{pathData:s})}))}));var c={type:"mutate",mutations:n};return new e(s.set("strokes",u).update("historyStack",(function(e){return e.push(s)})).delete("undoStack"),t.width,t.height,c)}},{key:"syncStrokeTime",value:function(e,t){var n=t.uid,r=t.timestamp,a=e.getStrokeMap().get(n);a&&(a.timestamp=r)}},{key:"pushOperation",value:function(t,n){switch(n.type){case"add":return e.pushStroke(t,n.stroke);case"erase":return e.eraseStrokes(t,n.erased);case"mutate":return e.mutateStrokes(t,n.mutations);case"undo":return e.undo(t);case"redo":return e.redo(t)}}},{key:"flaten",value:function(e){return{strokes:e.getImmutable().get("strokes").toObject()}}},{key:"loadFromFlat",value:function(t,n,r){var a=t.strokes,s=t.operations,u=new e(d().set("strokes",(0,c.zN)(a)),n,r);return null===s||void 0===s||s.forEach((function(t){return u=e.pushOperation(u,t)})),u}},{key:"mergeStates",value:function(){for(var e=arguments.length,t=new Array(e),n=0;n<e;n++)t[n]=arguments[n];var r=t.map((function(e){return e.getStrokeMap().values()})),s=[],u=new(l())((function(e,t){var n=(0,a.Z)(e,1)[0],r=(0,a.Z)(t,1)[0];return n.timestamp-r.timestamp}));for(r.forEach((function(e,t){var n=e.next(),r=n.value;n.done||u.push([r,t])}));u.size()>0;){var c=u.pop();if(!c)break;var i=(0,a.Z)(c,2),o=i[0],p=i[1];s.push(o);var f=r[p].next(),d=f.value,x=f.done;x||u.push([d,p])}return s}}]),e}()},51570:function(e,t,n){n.d(t,{CD:function(){return w},_n:function(){return d},dn:function(){return g},f1:function(){return y},fI:function(){return x},r8:function(){return Z}});var r=n(45987),a=n(15861),s=n(87757),u=n.n(s),c=n(74569),i=n.n(c),o=n(92198),l=n(75783),p=n(69951),f=["statusCode"],d="https://api.slotdumpling.top/paint";function x(e){return h.apply(this,arguments)}function h(){return(h=(0,a.Z)(u().mark((function e(t){var n,r;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i().get("code/".concat(t));case 3:if(n=e.sent,r=n.data,console.log({data:r}),200===r.statusCode){e.next=8;break}return e.abrupt("return",null);case 8:return e.abrupt("return",r.noteID);case 11:return e.prev=11,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",null);case 15:case"end":return e.stop()}}),e,null,[[0,11]])})))).apply(this,arguments)}function m(e){return v.apply(this,arguments)}function v(){return(v=(0,a.Z)(u().mark((function e(t){var n,a,s,c,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i().get("info/".concat(t));case 3:if(n=e.sent,a=n.data,c=(s=a).statusCode,o=(0,r.Z)(s,f),200===c){e.next=8;break}return e.abrupt("return",null);case 8:return e.abrupt("return",o);case 11:return e.prev=11,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",null);case 15:case"end":return e.stop()}}),e,null,[[0,11]])})))).apply(this,arguments)}function g(e){return k.apply(this,arguments)}function k(){return(k=(0,a.Z)(u().mark((function e(t){var n,r,a,s,c,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,m(t);case 3:if(n=e.sent){e.next=6;break}return e.abrupt("return",null);case 6:return r=n.noteInfo,a=n.pageInfos,e.next=9,(0,l.Rb)(t,r,a);case 9:if(!e.sent){e.next=11;break}return e.abrupt("return",n);case 11:if(s=void 0,!r.withImg){e.next=18;break}return e.next=15,i()({method:"GET",url:t,responseType:"blob"});case 15:c=e.sent,o=c.data,s=new Blob([o],{type:"application/pdf"});case 18:return e.next=20,(0,l.Vk)(t,r,a,s);case 20:return e.abrupt("return",n);case 23:return e.prev=23,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",null);case 27:case"end":return e.stop()}}),e,null,[[0,23]])})))).apply(this,arguments)}function Z(e){return b.apply(this,arguments)}function b(){return(b=(0,a.Z)(u().mark((function e(t){var n,r,a,s,c,f,d,x,h,m,v,g;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.U9)(t);case 2:if(n=e.sent){e.next=5;break}return e.abrupt("return",!1);case 5:return r=n.uid,a=n.name,s=n.withImg,c=n.pdf,f=n.pageOrder,d=n.pageRec,(0,o.Yl)(d),e.prev=7,e.next=10,i().put("create/".concat(t),{userID:(0,p.VN)(),pageRec:d,noteInfo:{uid:r,name:a,withImg:s,pageOrder:f}});case 10:if(x=e.sent,h=x.data,!c){e.next=21;break}return m=new FormData,e.next=16,c.arrayBuffer();case 16:return v=e.sent,g=new Blob([v]),m.append("file",g,t),e.next=21,i()({method:"POST",url:"upload",data:m,headers:{"Content-Type":"multipart/form-data"}});case 21:if(201===h.statusCode){e.next=23;break}return e.abrupt("return",!1);case 23:return e.abrupt("return",!0);case 26:return e.prev=26,e.t0=e.catch(7),console.error(e.t0),e.abrupt("return",!1);case 30:case"end":return e.stop()}}),e,null,[[7,26]])})))).apply(this,arguments)}function y(e){return j.apply(this,arguments)}function j(){return(j=(0,a.Z)(u().mark((function e(t){var n,r,a,s,c,f,d;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,l.U9)(t);case 2:if(n=e.sent){e.next=5;break}return e.abrupt("return",null);case 5:return r=n.uid,a=n.name,s=n.withImg,c=n.pageOrder,f=n.pageRec,(0,o.Yl)(f),e.prev=7,e.next=10,i().put("update/".concat(t),{userID:(0,p.VN)(),pageRec:f,noteInfo:{uid:r,name:a,withImg:s,pageOrder:c}});case 10:if(d=e.sent,201!==d.data.statusCode){e.next=16;break}return e.abrupt("return",!0);case 16:return e.abrupt("return",!1);case 17:e.next=23;break;case 19:return e.prev=19,e.t0=e.catch(7),console.error(e.t0),e.abrupt("return",!1);case 23:case"end":return e.stop()}}),e,null,[[7,19]])})))).apply(this,arguments)}function w(e){return S.apply(this,arguments)}function S(){return(S=(0,a.Z)(u().mark((function e(t){var n,r,a;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.prev=0,e.next=3,i().get("state/".concat(t),{params:{userID:(0,p.VN)()}});case 3:if(n=e.sent,200===(r=n.data).statusCode){e.next=7;break}return e.abrupt("return",null);case 7:return a=r.teamPages,e.abrupt("return",a);case 11:return e.prev=11,e.t0=e.catch(0),console.error(e.t0),e.abrupt("return",null);case 15:case"end":return e.stop()}}),e,null,[[0,11]])})))).apply(this,arguments)}i().defaults.baseURL=d,i().interceptors.request.use((function(e){return console.log(e.method,e.url),e}))},75783:function(e,t,n){n.d(t,{HO:function(){return j},Pn:function(){return S},Rb:function(){return V},SP:function(){return E},U9:function(){return I},Vk:function(){return B},Ys:function(){return b},au:function(){return O},f_:function(){return F},hY:function(){return k},tk:function(){return C},tw:function(){return R}});var r=n(29439),a=n(45987),s=n(49142),u=n(4942),c=n(1413),i=n(15861),o=n(87757),l=n.n(o),p=n(82670),f=n(61842),d=n.n(f),x=n(24610),h=n(56993),m=["pageRec","pageOrder"],v=["pdf"],g=["pageRec","pageOrder"];function k(){return Z.apply(this,arguments)}function Z(){return(Z=(0,i.Z)(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d().getItem("ALL_NOTES");case 2:if(!(t=e.sent)){e.next=7;break}return e.abrupt("return",t);case 7:return d().setItem("ALL_NOTES",{}),e.abrupt("return",{});case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function b(){return y.apply(this,arguments)}function y(){return(y=(0,i.Z)(l().mark((function e(){var t;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d().getItem("ALL_TAGS");case 2:if(!(t=e.sent)){e.next=7;break}return e.abrupt("return",t);case 7:return d().setItem("ALL_TAGS",{}),e.abrupt("return",{});case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function j(e,t){return w.apply(this,arguments)}function w(){return(w=(0,i.Z)(l().mark((function e(t,n){var r,a,s,i;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=(0,x.v4)(),a={uid:r,name:t,color:n,notes:[]},e.next=4,b();case 4:return s=e.sent,i=(0,c.Z)((0,c.Z)({},s),{},(0,u.Z)({},r,a)),e.next=8,d().setItem("ALL_TAGS",i);case 8:return e.abrupt("return",i);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function S(e){return N.apply(this,arguments)}function N(){return(N=(0,i.Z)(l().mark((function e(t){var n,r;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b();case 2:return n=e.sent,n[t],r=(0,a.Z)(n,[t].map(s.Z)),e.next=6,d().setItem("ALL_TAGS",r);case 6:return e.abrupt("return",r);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function C(e){return T.apply(this,arguments)}function T(){return(T=(0,i.Z)(l().mark((function e(t){var n,r;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,b();case 2:return n=e.sent,r=(0,c.Z)((0,c.Z)({},n),{},(0,u.Z)({},t.uid,t)),e.next=6,d().setItem("ALL_TAGS",r);case 6:return e.abrupt("return",r);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function I(e){return A.apply(this,arguments)}function A(){return(A=(0,i.Z)(l().mark((function e(t){var n,r;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,d().getItem(t);case 2:if(n=e.sent){e.next=5;break}return e.abrupt("return");case 5:return e.next=7,d().getItem("PDF_".concat(t));case 7:return r=e.sent,e.abrupt("return",(0,c.Z)((0,c.Z)({},n),{},{pdf:r}));case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function E(e,t){return D.apply(this,arguments)}function D(){return(D=(0,i.Z)(l().mark((function e(t,n){var r,s,u,i;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return"pageRec"in(n=(0,h.Z)(n,(function(e){return void 0!==e})))&&(n.lastTime=Date.now()),console.dir(n),e.next=5,k();case 5:return r=e.sent,(s=n).pageRec,s.pageOrder,u=(0,a.Z)(s,m),r[t]=(0,c.Z)((0,c.Z)({},r[t]),u),e.next=10,d().setItem("ALL_NOTES",r);case 10:return e.next=12,I(t);case 12:if(i=e.sent){e.next=15;break}return e.abrupt("return");case 15:return e.next=17,d().setItem(t,(0,c.Z)((0,c.Z)({},i),n));case 17:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function L(e){return M.apply(this,arguments)}function M(){return(M=(0,i.Z)(l().mark((function e(t){var n,r,a,s;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.uid,r=t.tagID,e.next=3,k();case 3:return(a=e.sent)[n]=t,e.next=7,d().setItem("ALL_NOTES",a);case 7:return e.next=9,b();case 9:if(s=e.sent,!(r in s)){e.next=14;break}return s[r].notes.push(t.uid),e.next=14,d().setItem("ALL_TAGS",s);case 14:return e.abrupt("return",{tags:s,allNotes:a});case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function O(e){return U.apply(this,arguments)}function U(){return(U=(0,i.Z)(l().mark((function e(t){var n,r,s;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=t.pdf,r=(0,a.Z)(t,v),e.next=3,d().setItem(r.uid,r);case 3:if(!n){e.next=6;break}return e.next=6,d().setItem("PDF_".concat(r.uid),n);case 6:return r.pageRec,r.pageOrder,s=(0,a.Z)(r,g),e.next=9,L(s);case 9:return e.abrupt("return",e.sent);case 10:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function F(e){return P.apply(this,arguments)}function P(){return(P=(0,i.Z)(l().mark((function e(t){var n,r,a,s,u;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I(t);case 2:return n=e.sent,e.next=5,k();case 5:return r=e.sent,e.next=8,b();case 8:if(a=e.sent,n){e.next=11;break}return e.abrupt("return",{tags:a,allNotes:r});case 11:return e.next=13,d().removeItem(t);case 13:return e.next=15,d().removeItem("PDF_".concat(t));case 15:return delete r[t],e.next=18,d().setItem("ALL_NOTES",r);case 18:if(!((s=n.tagID)in a)){e.next=24;break}return(u=a[s]).notes=u.notes.filter((function(e){return e!==t})),e.next=24,d().setItem("ALL_TAGS",a);case 24:return e.abrupt("return",{tags:a,allNotes:r});case 25:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function R(e,t){return _.apply(this,arguments)}function _(){return(_=(0,i.Z)(l().mark((function e(t,n){var r,a,s,u,c,i;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I(t);case 2:return a=e.sent,e.next=5,k();case 5:return s=e.sent,e.next=8,b();case 8:if(u=e.sent,a){e.next=11;break}return e.abrupt("return",{tags:u,allNotes:s});case 11:return c=a.tagID,a.tagID=n,e.next=15,d().setItem(t,a);case 15:return s[t].tagID=n,e.next=18,d().setItem("ALL_NOTES",s);case 18:return c in u&&((i=u[c]).notes=i.notes.filter((function(e){return e!==t}))),null===(r=u[n])||void 0===r||r.notes.push(t),e.next=22,d().setItem("ALL_TAGS",u);case 22:return e.abrupt("return",{tags:u,allNotes:s});case 23:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function B(e,t,n,r){return G.apply(this,arguments)}function G(){return(G=(0,i.Z)(l().mark((function e(t,a,s,u){var i,o,f,d,x,h,m;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I(t);case 2:if(!(i=e.sent)){e.next=5;break}return e.abrupt("return");case 5:if(o=Date.now(),f={},i=(0,c.Z)((0,c.Z)({},a),{},{tagID:"DEFAULT",team:!0,pageRec:f,pdf:u,createTime:o,lastTime:o}),Object.entries(s).forEach((function(e){var t=(0,r.Z)(e,2),n=t[0],a=t[1];f[n]=(0,c.Z)((0,c.Z)({},a),{},{state:(0,p.F)()})})),!u){e.next=20;break}return e.next=12,Promise.all([n.e(643),n.e(701)]).then(n.bind(n,21176));case 12:return d=e.sent,x=d.getPDFImages,e.next=16,x(u);case 16:h=e.sent,m=h.images,Object.values(f).forEach((function(e){var t=e.pdfIndex;t&&(e.image=m[t-1])})),i.thumbnail=m[0];case 20:return e.next=22,O(i);case 22:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function V(e,t,n){return H.apply(this,arguments)}function H(){return(H=(0,i.Z)(l().mark((function e(t,a,s){var u,i,o,f,d,x,h,m,v,g,k,Z,b;return l().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,I(t);case 2:if(u=e.sent){e.next=5;break}return e.abrupt("return",!1);case 5:if(!((i=a.pageOrder).length<u.pageOrder.length)){e.next=8;break}return e.abrupt("return",!0);case 8:return o=u.pageRec,f=u.pdf,e.next=11,Promise.all([n.e(643),n.e(701)]).then(n.bind(n,21176));case 11:d=e.sent,x=d.getOneImage,h=0,m=Object.entries(s);case 14:if(!(h<m.length)){e.next=29;break}if(v=(0,r.Z)(m[h],2),g=v[0],k=v[1],!(g in o)){e.next=18;break}return e.abrupt("continue",26);case 18:if(Z=k.pdfIndex,b=(0,p.F)(),o[g]=(0,c.Z)((0,c.Z)({},k),{},{state:b}),f&&Z){e.next=23;break}return e.abrupt("continue",26);case 23:return e.next=25,x(f,Z,.5);case 25:o[g].image=e.sent;case 26:h++,e.next=14;break;case 29:return e.next=31,E(t,{pageOrder:i,pageRec:o});case 31:return e.abrupt("return",!0);case 32:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},92198:function(e,t,n){n.d(t,{BJ:function(){return i},D4:function(){return l},Xn:function(){return o},Yl:function(){return p}});var r=n(4942),a=n(82670),s=n(24610),u=n(97892),c=n.n(u),i={ratio:1.5,state:{strokes:{}}};function o(){var e=(0,s.v4)(),t=Date.now();return{uid:(0,s.v4)(),name:"Note ".concat(c()(t).format("HH:mm, ddd MMM D")),tagID:"DEFAULT",team:!1,withImg:!1,createTime:t,lastTime:t,pageRec:(0,r.Z)({},e,{ratio:1.5,state:(0,a.F)()}),pageOrder:[e]}}function l(e){return[(0,s.v4)(),null!==e&&void 0!==e?e:{ratio:1.5,state:(0,a.F)()}]}function p(e){Object.values(e).forEach((function(e){delete e.image,delete e.marked}))}},69951:function(e,t,n){n.d(t,{VN:function(){return a},lu:function(){return u},vW:function(){return s}});var r=n(24610),a=function(){var e;return function(){if(e)return e;var t=localStorage.getItem("USER_ID");return t||(t=(0,r.v4)(),localStorage.setItem("USER_ID",t)),e=t,t}}(),s=function(){var e=localStorage.getItem("USER_NAME");return e||(e=(0,r.v4)().slice(0,8),localStorage.setItem("USER_NAME",e)),e},u=function(e){return!!(e=e.trim())&&(localStorage.setItem("USER_NAME",e),!0)}},16911:function(e,t,n){e.exports=n.p+"static/media/default.dd5512731ffc4dfd92ad.png"}}]);
//# sourceMappingURL=57.aba4b5de.chunk.js.map