(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[591,138],{70096:function(e,t,n){"use strict";n.r(t),n.d(t,{MenuCtx:function(){return He},NewNoteButton:function(){return Ke},default:function(){return ze}});var r=n(15861),a=n(29439),s=n(87757),c=n.n(s),i=n(72791),o=n(75783),u=n(92198),l=n(30501),d=n(1413),f=n(45987),p=n(87309),x=n(50419),m=n(56075),h=n(20662),v=n(96038),g=n(70140),j=n(69228),Z=n(99372),k=n(66776),b=n(29529),y=n(14057),N=n(12056),w=n(99660),C=n(92414),T=n(61753),S=n(56200),E=n(82305),A=n(69951),D=n(89295),I=n(51570),U=n(16871),L=n(44379),P=n(67415),F=n(61842),M=n.n(F),O=n(21176),B=n(80184),R=["children","title","keyName"],W=(0,i.createContext)({active:"MENU",setActive:function(){}});function H(){return(0,B.jsxs)("div",{className:"right-tools",children:[(0,B.jsx)(q,{}),(0,B.jsx)(J,{})]})}var z=function(e){var t=e.children,n=e.title,r=e.keyName,a=(0,f.Z)(e,R),s=(0,i.useContext)(W),c=s.active,o=s.setActive;return(0,B.jsx)(D.Z,(0,d.Z)((0,d.Z)({in:c===r},a),{},{children:(0,B.jsxs)("div",{className:"secondary",children:[(0,B.jsxs)("nav",{children:[(0,B.jsx)(p.Z,{type:"text",shape:"circle",onClick:function(){return o("MENU")},icon:(0,B.jsx)(Z.Z,{})}),(0,B.jsx)("h3",{children:n})]}),t]})}))},K=function(){var e=(0,i.useState)(!1),t=(0,a.Z)(e,2),s=t[0],u=t[1],l=(0,i.useContext)(He),d=l.tagUid,f=l.setAllTags,p=l.setAllNotes,h=(0,i.useState)(0),v=(0,a.Z)(h,2),g=v[0],j=v[1];function Z(){return(Z=(0,r.Z)(c().mark((function e(t){var r,a,s,i,l,m;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===t.type){e.next=2;break}return e.abrupt("return");case 2:return u(!0),e.next=5,Promise.resolve().then(n.bind(n,21176));case 5:return r=e.sent,a=r.LoadPDF,e.next=9,a(t,j);case 9:return(s=e.sent).tagID=d,e.next=13,(0,o.au)(s);case 13:return i=e.sent,l=i.tags,m=i.allNotes,f(l),p(m),u(!1),x.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,B.jsxs)(L.Z,{className:"pdf-upload",disabled:s,multiple:!1,action:"#",accept:"application/pdf",beforeUpload:function(e){return Z.apply(this,arguments)},children:[(0,B.jsxs)("p",{className:"ant-upload-drag-icon",children:[s&&(0,B.jsx)(m.Z,{width:48,type:"circle",percent:g}),s||(0,B.jsx)(k.Z,{})]}),(0,B.jsx)("p",{className:"ant-upload-hint",children:"Click or drag a pdf file here."})]})},_=function(){var e=(0,i.useContext)(W).setActive,t=(0,A.vW)(),n=(0,i.useState)(t),r=(0,a.Z)(n,2),s=r[0],c=r[1];return(0,B.jsxs)("div",{className:"profile-page",children:[(0,B.jsx)(h.Z,{value:s,onChange:function(e){return c(e.target.value)},prefix:(0,B.jsx)(b.Z,{}),allowClear:!0}),(0,B.jsx)(p.Z,{disabled:t===s||!s,onClick:function(){s&&((0,A.lu)(s),e("MENU"))},type:"primary",block:!0,children:"OK"})]})},G=function(){var e=(0,i.useContext)(He).menuInit,t=function(){var t=(0,r.Z)(c().mark((function t(){return c().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,M().clear();case 2:return t.next=4,(0,O.clearImageCache)();case 4:e();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,B.jsxs)("div",{className:"setting-menu",children:[(0,B.jsx)(p.Z,{icon:(0,B.jsx)(y.Z,{}),onClick:(0,r.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,E.E();case 2:window.location.reload();case 3:case"end":return e.stop()}}),e)}))),block:!0,children:"Update"}),(0,B.jsx)(v.Z,{title:"Everything will be deleted.",onConfirm:t,icon:(0,B.jsx)(N.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,B.jsx)(p.Z,{icon:(0,B.jsx)(N.Z,{}),danger:!0,block:!0,children:"Clear all"})})]})},V=[{key:"PDF",label:"Import PDF",component:(0,B.jsx)(K,{}),icon:(0,B.jsx)(w.Z,{})},{key:"PROFILE",label:"My profile",component:(0,B.jsx)(_,{}),icon:(0,B.jsx)(b.Z,{})},{key:"SETTINGS",label:"Settings",component:(0,B.jsx)(G,{}),icon:(0,B.jsx)(C.Z,{})}],X=function(){var e=(0,i.useContext)(W).setActive;return(0,B.jsx)("div",{className:"primary-menu",children:(0,B.jsx)(g.Z,{onClick:function(t){var n=t.key;return e(n)},items:V})})},Y=function(){var e=(0,i.useState)(0),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,i.useState)(""),c=(0,a.Z)(s,2),o=c[0],u=c[1],l={timeout:300,onEnter:function(e){r(e.clientHeight)},unmountOnExit:!0};return(0,i.useEffect)((function(){return u("MENU")}),[]),(0,B.jsx)(W.Provider,{value:{active:o,setActive:u},children:(0,B.jsxs)("section",{className:"others-menu",style:{height:n},children:[(0,B.jsx)(D.Z,(0,d.Z)((0,d.Z)({in:"MENU"===o},l),{},{children:(0,B.jsx)(X,{})})),V.map((function(e){var t=e.key,n=e.label,r=e.component;return(0,B.jsx)(z,(0,d.Z)((0,d.Z)({keyName:t,title:n},l),{},{children:r}),t)}))]})})},J=function(){return(0,B.jsxs)(j.Z,{placement:"bottomRight",trigger:"click",content:(0,B.jsx)(Y,{}),zIndex:900,children:[(0,B.jsx)(p.Z,{className:"large",shape:"circle",icon:(0,B.jsx)(T.Z,{})}),(0,B.jsx)(p.Z,{className:"small",type:"text",icon:(0,B.jsx)(T.Z,{})})]})},q=function(){var e=(0,i.useState)(""),t=(0,a.Z)(e,2),n=t[0],s=t[1],o=(0,i.useState)(!1),u=(0,a.Z)(o,2),l=u[0],d=u[1],f=(0,U.s0)();function x(){return(x=(0,r.Z)(c().mark((function e(t){var n;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,I.fI)(t);case 2:if(!(n=e.sent)){e.next=5;break}return e.abrupt("return",f("/team/".concat(n)));case 5:s(""),d(!0);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,B.jsxs)(j.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,onVisibleChange:function(){return d(!1)},content:(0,B.jsx)(P.GD,{plain:!0,length:4,error:l,value:n,onChange:function(e){d(!1),s(e)},onFill:function(e){return x.apply(this,arguments)}}),children:[(0,B.jsx)(p.Z,{className:"team-btn large",shape:"round",icon:(0,B.jsx)(S.Z,{}),children:"Team"}),(0,B.jsx)(p.Z,{className:"team-btn small",type:"text",icon:(0,B.jsx)(S.Z,{})})]})},Q=n(88894),$=n(96324),ee=n(82622),te=n(93309),ne=n(57768),re=n(11956),ae=n(81694),se=n.n(ae),ce=n(24610);var ie=(0,i.createContext)({nowSwiped:"",setNowSwiped:function(){}}),oe=function(e){var t=e.children,n=(0,i.useState)(""),r=(0,a.Z)(n,2),s=r[0],c=r[1];return(0,B.jsx)(ie.Provider,{value:{nowSwiped:s,setNowSwiped:c},children:t})},ue=function(e){var t=e.children,n=e.onDelete,s=e.disable,o=void 0!==s&&s,u=e.className,l=(0,i.useState)(ce.v4),f=(0,a.Z)(l,1)[0],p=(0,i.useContext)(ie),x=p.nowSwiped,m=p.setNowSwiped,h=(0,i.useState)(!1),v=(0,a.Z)(h,2),g=v[0],j=v[1],Z=g&&(!x||x===f),k=(0,i.useState)(!1),b=(0,a.Z)(k,2),y=b[0],N=b[1],w=(0,i.useState)(),C=(0,a.Z)(w,2),T=C[0],S=C[1],E=(0,i.useRef)(null);(0,i.useEffect)((function(){x!==f&&j(!1)}),[x,f]);var A=(0,re.useSwipeable)({onSwipedLeft:function(){var e;j(!0),m(f),S(null===(e=E.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){j(!1),m(""),S(void 0)},preventDefaultTouchmoveEvent:!0,trackTouch:!o});(0,i.useEffect)((function(){o&&(S(void 0),m(""),j(!1))}),[o,m]);var D=function(){var e=(0,i.useRef)((function(){})),t=(0,i.useState)((function(){return new Promise((function(t){return e.current=t}))}));return[(0,a.Z)(t,1)[0],function(){return e.current()}]}(),I=(0,a.Z)(D,2),U=I[0],L=I[1],P=function(){var e=(0,r.Z)(c().mark((function e(){return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return N(!0),e.next=3,U;case 3:n(),m("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,B.jsxs)("div",(0,d.Z)((0,d.Z)({className:se()("swipe-wrapper",u),"data-deleted":y,"data-deleting":Z},A),{},{style:{height:T},onTransitionEnd:function(e){"height"===e.propertyName&&y&&L()},children:[(0,B.jsx)("div",{className:"content",ref:E,children:t}),(0,B.jsx)("div",{className:"button",onClick:P,style:{height:T},children:"Delete"})]}))},le=n(47323),de=n(74115),fe=n(80202),pe=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,B.jsx)(le.Z,{value:r,onSelect:a,listHeight:150,children:de.O9.map((function(e){return(0,B.jsx)(le.Z.Option,{value:e,children:(0,B.jsx)(fe.W,{className:"tag-circle",color:e})},e)}))});return(0,B.jsx)(h.Z,{autoFocus:!0,placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},xe=function(e){var t=e.noteTag,n=t.uid,s=t.color,u=t.name,l=t.notes,f=(0,i.useContext)(He),x=f.editing,m=f.tagUid,h=f.setAllTags,g=f.setTagUid,j=(0,i.useState)(u),Z=(0,a.Z)(j,2),k=Z[0],b=Z[1],y=(0,i.useState)(s),N=(0,a.Z)(y,2),w=N[0],T=N[1],S=(0,i.useState)(!1),E=(0,a.Z)(S,2),A=E[0],D=E[1];function I(){return U.apply(this,arguments)}function U(){return(U=(0,r.Z)(c().mark((function e(){var t;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,o.Pn)(n);case 2:t=e.sent,g("DEFAULT"),h(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,i.useEffect)((function(){return D(!1)}),[x]);var L=function(){var e=(0,r.Z)(c().mark((function e(){var n,r;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,d.Z)((0,d.Z)({},t),{},{name:k,color:w}),e.next=3,(0,o.tk)(n);case 3:r=e.sent,h(r),D(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),P=(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(fe.W,{className:"tag-circle",color:w}),(0,B.jsx)("span",{className:"tag-name",children:k}),x||(0,B.jsx)("span",{className:"tag-num",children:l.length}),x&&(0,B.jsx)(p.Z,{size:"small",type:"text",onClick:function(){return D(!0)},icon:(0,B.jsx)(C.Z,{})})]}),F=(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(pe,{tagName:k,setTagName:b,tagColor:w,setTagColor:T}),(0,B.jsxs)("div",{className:"buttons",children:[(0,B.jsx)(v.Z,{title:"This tag will be deleted.",onConfirm:I,placement:"left",cancelText:"Cancel",icon:(0,B.jsx)(ee.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,B.jsx)(p.Z,{danger:!0,children:"Delete"})}),(0,B.jsx)(p.Z,{onClick:function(){b(u),T(s),D(!1)},children:"Cancel"}),(0,B.jsx)(p.Z,{type:"primary",disabled:!k,onClick:L,children:"OK"})]})]});return(0,B.jsx)(ue,{className:"tag-wrapper",onDelete:I,disable:x,children:(0,B.jsx)("div",{className:"tag-item","data-curr":m===n,"data-editing":A,onClick:function(){return g(n)},children:A?F:P})})},me=function(e){var t=e.setAdding,n=(0,i.useState)(""),r=(0,a.Z)(n,2),s=r[0],c=r[1],u=(0,i.useState)((0,de.mr)()),l=(0,a.Z)(u,2),d=l[0],f=l[1],x=(0,i.useContext)(He).setAllTags;return(0,B.jsx)("div",{className:"tag-wrapper",children:(0,B.jsxs)("div",{className:"tag-item","data-curr":!0,"data-editing":!0,children:[(0,B.jsx)(pe,{tagName:s,setTagName:c,tagColor:d,setTagColor:f}),(0,B.jsxs)("div",{className:"buttons",children:[(0,B.jsx)(p.Z,{onClick:function(){return t(!1)},children:"Cancel"}),(0,B.jsx)(p.Z,{type:"primary",disabled:!s,onClick:function(){var e=s.trim();e&&((0,o.HO)(e,d).then(x),t(!1))},children:"OK"})]})]})})};function he(){var e=(0,i.useContext)(He),t=e.allTags,n=e.editing,r=e.tagUid,s=e.allNotes,c=e.setTagUid,o=e.setEditing,u=(0,i.useState)(!1),l=(0,a.Z)(u,2),d=l[0],f=l[1],x=(0,B.jsx)("div",{className:"tag-wrapper",children:(0,B.jsxs)("div",{className:"tag-item","data-curr":"DEFAULT"===r,onClick:function(){return c("DEFAULT")},children:[(0,B.jsx)(te.Z,{className:"all-note-icon"}),(0,B.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,B.jsx)("span",{className:"tag-num",children:Object.keys(s).length})]})}),m=(0,B.jsx)(p.Z,{className:"edit-btn small",shape:"round",type:n?"primary":"default",onClick:function(){return o((function(e){return!e}))},children:n?"Done":"Edit"});return(0,B.jsxs)("aside",{className:"side-menu",children:[(0,B.jsxs)("div",{className:"tag-list",children:[x,(0,B.jsx)(oe,{children:Object.values(t).map((function(e){return(0,B.jsx)(xe,{noteTag:e},e.uid)}))}),d&&(0,B.jsx)(me,{setAdding:f})]}),(0,B.jsxs)("footer",{children:[(0,B.jsx)(p.Z,{shape:"round",icon:(0,B.jsx)(ne.Z,{}),onClick:function(){return f(!0)},disabled:d,children:"Add"}),m]})]})}function ve(){var e=(0,i.useState)(!1),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,i.useContext)(He),c=s.editing,o=s.tagUid,u=s.setEditing;(0,i.useEffect)((function(){c||r(!1)}),[o]);var l=(0,B.jsx)(p.Z,{className:"edit-btn large",onClick:function(){return u((function(e){return!e}))},type:c?"primary":"text",children:c?"Done":"Edit"}),d=(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(p.Z,{className:"aside-btn",type:"text",icon:(0,B.jsx)($.Z,{}),onClick:function(){return r((function(e){return!e}))}}),(0,B.jsx)(Q.Z,{className:"aside-drawer",width:300,placement:"left",closable:!1,visible:n,onClose:function(){return r(!1)},contentWrapperStyle:{boxShadow:"none"},bodyStyle:{padding:0,overflow:"hidden"},destroyOnClose:!0,children:(0,B.jsx)(he,{})})]});return(0,B.jsxs)("div",{className:"left-tools",children:[d,l]})}var ge=n(4942),je=n(37762),Ze=n(75660),ke=n(96989),be=n(37557),ye=n(6593),Ne=n.n(ye),we=n(16911),Ce=n(93433),Te=n(37382),Se=n(68692),Ee=n(13876),Ae=n(20054),De=n(9486),Ie=n(1194),Ue=n(53834),Le=n(11730),Pe=n(7974),Fe=function(e){var t=e.sortType,n=e.setSortType,r=e.searchText,a=e.setSearchText,s=e.onDelete,c=e.onMove,o=e.disabled,u=void 0===o||o,l=(0,i.useContext)(He),f=l.editing,x=l.allTags,m=l.setEditing,j=(0,B.jsx)(g.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],className:"sort-drop",items:[{type:"group",label:"Sort by",children:[{icon:(0,B.jsx)(Se.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,B.jsx)(Ee.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,B.jsx)(Ae.Z,{}),key:"NAME",label:"Name"}]}]}),Z={type:"text",shape:"circle"},k=(0,B.jsx)(Te.Z,{overlay:j,trigger:["click"],placement:"bottom",children:(0,B.jsx)(p.Z,(0,d.Z)({className:"sort-btn",icon:(0,B.jsx)(De.Z,{rotate:90})},Z))}),b=(0,B.jsx)(v.Z,{title:"Notes will be deleted.",onConfirm:s,icon:(0,B.jsx)(ee.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:u,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,B.jsx)(p.Z,{className:"del-btn",shape:"round",type:"text",disabled:u,danger:!u,icon:(0,B.jsx)(ee.Z,{}),children:"Delete"})}),y=function(e){var t=e.color,n=e.name;return(0,B.jsxs)("div",{className:"tag-select",children:[(0,B.jsx)(fe.W,{color:t,className:"tag-circle"}),(0,B.jsx)("span",{className:"name",children:n})]})},N=(0,B.jsx)(g.Z,{onClick:function(e){var t=e.key;return c(t)},items:[{key:"DEFAULT",label:(0,B.jsx)(y,{color:"#eee",name:"No tag"})}].concat((0,Ce.Z)(Object.values(x).map((function(e){return{key:e.uid,label:(0,B.jsx)(y,{color:e.color,name:e.name})}}))))}),w=(0,B.jsx)(Te.Z,{disabled:u,overlay:N,trigger:["click"],placement:"bottom",children:(0,B.jsx)(p.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,B.jsx)(Ie.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,B.jsx)("div",{className:"head-tools","data-editing":f,children:f?(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(p.Z,(0,d.Z)({className:"small",onClick:function(){return m(!1)},icon:(0,B.jsx)(Ue.Z,{})},Z)),w,b]}):(0,B.jsxs)(B.Fragment,{children:[(0,B.jsx)(h.Z,{value:r,onChange:function(e){return a(e.target.value)},className:"search-input",prefix:(0,B.jsx)(Le.Z,{}),bordered:!1,allowClear:!0}),k,(0,B.jsx)(p.Z,(0,d.Z)({className:"small",onClick:function(){return m(!0)},icon:(0,B.jsx)(Pe.Z,{})},Z))]})})},Me=n(24124),Oe=n(97892),Be=n.n(Oe);function Re(e){var t=e.noteList,n=(0,i.useContext)(He),s=n.editing,u=n.setAllTags,l=n.setAllNotes,d=(0,i.useState)("LAST"),f=(0,a.Z)(d,2),p=f[0],x=f[1],m=(0,i.useState)(""),h=(0,a.Z)(m,2),v=h[0],g=h[1],j=(0,i.useState)((0,Me.l4)()),Z=(0,a.Z)(j,2),k=Z[0],b=Z[1],y=function(){var e=(0,r.Z)(c().mark((function e(t){var n,r,a,s,i,d;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,je.Z)(t),e.prev=1,a.s();case 3:if((s=a.n()).done){e.next=12;break}return i=s.value,e.next=7,(0,o.f_)(i);case 7:d=e.sent,n=d.tags,r=d.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&u(n),r&&l(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),N=function(){var e=(0,r.Z)(c().mark((function e(t,n){var r,a,s,i,d,f;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=(0,je.Z)(t),e.prev=1,s.s();case 3:if((i=s.n()).done){e.next=12;break}return d=i.value,e.next=7,(0,o.tw)(d,n);case 7:f=e.sent,r=f.tags,a=f.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),s.e(e.t0);case 17:return e.prev=17,s.f(),e.finish(17);case 20:r&&u(r),a&&l(a);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t,n){return e.apply(this,arguments)}}(),w=(0,i.useMemo)((function(){var e=function(e,t){return t-e};switch(p){case"CREATE":return t.sortBy((function(e){return e.createTime}),e);case"LAST":return t.sortBy((function(e){return e.lastTime}),e);case"NAME":return t.sortBy((function(e){return e.name.toUpperCase()}));default:return t}}),[t,p]),C=(0,i.useMemo)((function(){return w.filter((function(e){return e.name.toUpperCase().includes(v.trim().toUpperCase())}))}),[v,w]);return(0,i.useEffect)((function(){g(""),b((0,Me.l4)())}),[t,s]),(0,B.jsx)(oe,{children:(0,B.jsxs)(Ze.Z,{className:"note-list",children:[(0,B.jsx)(Fe,{sortType:p,setSortType:x,searchText:v,setSearchText:g,onDelete:function(){return y(k.toArray())},onMove:function(e){return N(k.toArray(),e)},disabled:0===k.size}),C.map((function(e){var t=e.uid;return(0,B.jsx)(D.Z,{timeout:500,children:(0,B.jsx)(ue,{className:"note-wrapper",onDelete:function(){return y([t])},disable:s,children:(0,B.jsx)(We,{noteInfo:e,selected:k.has(t),setSelectNotes:b})})},t)}))]})})}Be().extend(Ne());var We=function(e){var t=e.noteInfo,n=e.selected,r=e.setSelectNotes,s=t.team,c=t.uid,u=t.name,l=t.thumbnail,f=t.lastTime,p=(0,i.useMemo)((function(){return Be()(f).calendar()}),[f]),x="".concat(s?"team":"reader","/").concat(c),m=(0,i.useContext)(He),v=m.editing,g=m.setAllNotes,j=(0,i.useState)(u),Z=(0,a.Z)(j,2),k=Z[0],b=Z[1],y=(0,U.s0)();return(0,B.jsxs)("div",{className:"note-item","data-selected":n,onClick:function(){if(!v)return y(x);r((function(e){return e.has(c)?e.delete(c):e.add(c)}))},children:[(0,B.jsxs)("div",{className:"timg-wrapper",children:[(0,B.jsx)("img",{src:l||we,alt:u,className:"timg"}),s&&(0,B.jsx)(ke.Z,{className:"cloud-icon"}),(0,B.jsx)(be.Z,{className:"checked-icon"})]}),(0,B.jsxs)("div",{className:"content",children:[v||(0,B.jsx)("p",{className:"name",children:u}),v&&(0,B.jsx)(h.Z,{className:"name-input",value:k,onChange:function(e){return b(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=k.trim();if(!e||e===u)return b(u);(0,o.SP)(c,{name:e}),g((function(t){return(0,d.Z)((0,d.Z)({},t),{},(0,ge.Z)({},c,(0,d.Z)((0,d.Z)({},t[c]),{},{name:e})))}))}}),(0,B.jsx)("span",{className:"date",children:p})]})]})},He=(0,i.createContext)({tagUid:"DEFAULT",editing:!1,allNotes:{},allTags:{},setAllNotes:function(){},setAllTags:function(){},setTagUid:function(){},setEditing:function(){},menuInit:function(){}});function ze(){var e=(0,i.useState)({}),t=(0,a.Z)(e,2),n=t[0],r=t[1],s=(0,i.useState)({}),c=(0,a.Z)(s,2),u=c[0],l=c[1],d=(0,i.useState)("DEFAULT"),f=(0,a.Z)(d,2),p=f[0],x=f[1],m=(0,i.useState)(!1),h=(0,a.Z)(m,2),v=h[0],g=h[1],j=(0,i.useMemo)((function(){var e;return null!==(e=u[p])&&void 0!==e?e:{uid:"",name:"All Notes",color:"#000000",notes:Object.keys(n)}}),[n,u,p]),Z=(0,i.useMemo)((function(){return(0,Me.aV)(j.notes.filter((function(e){return e in n})).map((function(e){return n[e]})))}),[j,n]),k=function(){(0,o.hY)().then(r),(0,o.Ys)().then(l),document.title="Multibility"};(0,i.useEffect)(k,[]);var b="DEFAULT"===p;return(0,B.jsx)(He.Provider,{value:{tagUid:p,editing:v,allNotes:n,allTags:u,setAllNotes:r,setAllTags:l,setEditing:g,setTagUid:x,menuInit:k},children:(0,B.jsxs)("div",{className:"main-menu container",children:[(0,B.jsxs)("header",{children:[(0,B.jsx)(ve,{}),(0,B.jsx)("h2",{"data-logo":b,children:b?"Multibility":j.name}),(0,B.jsx)(H,{})]}),(0,B.jsxs)("main",{children:[(0,B.jsx)(he,{}),(0,B.jsx)(Re,{noteList:Z}),(0,B.jsx)(Ke,{})]})]})})}var Ke=function(){var e=(0,i.useContext)(He),t=e.tagUid,n=e.setAllTags,a=e.setAllNotes;function s(){return(s=(0,r.Z)(c().mark((function e(){var r,s,i,l;return c().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(r=(0,u.Xn)()).tagID=t,e.next=4,(0,o.au)(r);case 4:s=e.sent,i=s.tags,l=s.allNotes,n(i),a(l);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,B.jsx)(p.Z,{className:"new-note",size:"large",type:"primary",shape:"circle",onClick:function(){return s.apply(this,arguments)},icon:(0,B.jsx)(l.Z,{})})}},21176:function(e,t,n){"use strict";n.r(t),n.d(t,{LoadPDF:function(){return D},clearImageCache:function(){return S},getOneImage:function(){return b},getOnePageImage:function(){return E},getPDFImages:function(){return Z}});var r=n(1413),a=n(29439),s=n(37762),c=n(93433),i=n(15861),o=n(87757),u=n.n(o),l=n(96153),d=n(92198),f=n(61842),p=n.n(f),x=n(24610),m=n(62560),h=n(20434),v=n.n(h);m.GlobalWorkerOptions.workerSrc=v();var g=function(){var e=(0,i.Z)(u().mark((function e(t){var n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.t0=Uint8Array,e.next=3,t.arrayBuffer();case 3:return e.t1=e.sent,n=new e.t0(e.t1),e.abrupt("return",m.getDocument(n).promise);case 6:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),j=function(){var e=(0,i.Z)(u().mark((function e(t,n,r){var a,s,c,i,o,d,f,p,x;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.getPage(n);case 2:return a=e.sent,s=a.getViewport({scale:r}),c=s.height,i=s.width,o=c/i,d=(0,l.v)(Math.floor(i*r),Math.floor(c*r)),f=d.canvas,p=d.context,e.next=9,a.render({canvasContext:p,viewport:s,transform:[r,0,0,r,0,0]}).promise;case 9:return x=f.toDataURL(),(0,l.j)(f),e.abrupt("return",[x,o]);case 12:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}();function Z(e){return k.apply(this,arguments)}function k(){return k=(0,i.Z)(u().mark((function e(t){var n,r,s,c,i,o,l,d,f,p,x,m=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=m.length>1&&void 0!==m[1]?m[1]:2,r=m.length>2?m[2]:void 0,e.next=4,g(t);case 4:s=e.sent,c=s.numPages,i=[],o=[],l=1;case 9:if(!(l<=c)){e.next=22;break}return e.next=12,j(s,l,n);case 12:d=e.sent,f=(0,a.Z)(d,2),p=f[0],x=f[1],i.push(p),o.push(x),r&&r(Math.floor(l/c*100));case 19:l+=1,e.next=9;break;case 22:return e.abrupt("return",{images:i,ratios:o});case 23:case"end":return e.stop()}}),e)}))),k.apply(this,arguments)}function b(e,t){return y.apply(this,arguments)}function y(){return y=(0,i.Z)(u().mark((function e(t,n){var r,s,c,i,o,l,d=arguments;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return r=d.length>2&&void 0!==d[2]?d[2]:2,e.next=3,g(t);case 3:if(s=e.sent,c=s.numPages,!(n>c)){e.next=7;break}throw new Error("index out of range");case 7:return e.next=9,j(s,n,r);case 9:return i=e.sent,o=(0,a.Z)(i,1),l=o[0],e.abrupt("return",l);case 13:case"end":return e.stop()}}),e)}))),y.apply(this,arguments)}var N=p().createInstance({name:"imageForage"}),w=function(){var e=(0,i.Z)(u().mark((function e(t,n){var r,a,s;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.getItem("LIST");case 2:if(e.t1=r=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==r;case 6:if(!e.t0){e.next=10;break}e.t2=r,e.next=11;break;case 10:e.t2=[];case 11:if(a=e.t2,s="".concat(t,"_").concat(n),a.includes(s)){e.next=15;break}return e.abrupt("return");case 15:return a=[s].concat((0,c.Z)(a.filter((function(e){return e!==s})))),e.next=18,N.setItem("LIST",a);case 18:return e.next=20,N.getItem(s);case 20:return e.abrupt("return",e.sent);case 21:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),C=function(){var e=(0,i.Z)(u().mark((function e(t,n,r){var a,s,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.getItem("LIST");case 2:if(e.t1=a=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==a;case 6:if(!e.t0){e.next=10;break}e.t2=a,e.next=11;break;case 10:e.t2=[];case 11:return s=e.t2,i="".concat(t,"_").concat(n),(s=[i].concat((0,c.Z)(s.filter((function(e){return e!==i}))))).length>10&&(s=s.slice(0,10)),e.next=17,N.setItem("LIST",s);case 17:return e.next=19,N.setItem(i,r);case 19:T();case 20:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),T=function(){var e=(0,i.Z)(u().mark((function e(){var t,n,r,a,c,i,o;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,N.getItem("LIST");case 2:if(e.t1=t=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==t;case 6:if(!e.t0){e.next=10;break}e.t2=t,e.next=11;break;case 10:e.t2=[];case 11:return n=e.t2,r=new Set(n),e.next=15,N.keys();case 15:a=e.sent,c=(0,s.Z)(a),e.prev=17,c.s();case 19:if((i=c.n()).done){e.next=28;break}if("LIST"!==(o=i.value)){e.next=23;break}return e.abrupt("continue",26);case 23:if(r.has(o)){e.next=26;break}return e.next=26,N.removeItem(o);case 26:e.next=19;break;case 28:e.next=33;break;case 30:e.prev=30,e.t3=e.catch(17),c.e(e.t3);case 33:return e.prev=33,c.f(),e.finish(33);case 36:case"end":return e.stop()}}),e,null,[[17,30,33,36]])})));return function(){return e.apply(this,arguments)}}(),S=function(){return N.clear()};function E(e,t){return A.apply(this,arguments)}function A(){return(A=(0,i.Z)(u().mark((function e(t,n){var r,a,s;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,w(t,n);case 2:if(!(r=e.sent)){e.next=5;break}return e.abrupt("return",r);case 5:return e.next=7,p().getItem("PDF_".concat(t));case 7:if(a=e.sent){e.next=10;break}return e.abrupt("return");case 10:return e.next=12,b(a,n,2);case 12:return s=e.sent,C(t,n,s),e.abrupt("return",s);case 15:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function D(e,t){return I.apply(this,arguments)}function I(){return(I=(0,i.Z)(u().mark((function e(t,n){var a,s,c,i,o,l,f,p;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,Z(t,.5,n);case 2:return a=e.sent,s=a.images,c=a.ratios,i={},o=[],s.forEach((function(e,t){var n=(0,x.v4)();i[n]={image:e,ratio:c[t],state:{strokes:{}},pdfIndex:t+1},o.push(n)})),l=t.name.replace(".pdf",""),e.next=11,t.arrayBuffer();case 11:return f=e.sent,p=new Blob([f],{type:"application/pdf"}),e.abrupt("return",(0,r.Z)((0,r.Z)({},(0,d.Xn)()),{},{name:l,withImg:!0,pdf:p,thumbnail:s[0],pageRec:i,pageOrder:o}));case 14:case"end":return e.stop()}}),e)})))).apply(this,arguments)}},16911:function(e,t,n){"use strict";e.exports=n.p+"static/media/default.dd5512731ffc4dfd92ad.png"},14601:function(){},32767:function(){},28251:function(){},57677:function(){},1543:function(){},87324:function(){}}]);
//# sourceMappingURL=591.9284cc95.chunk.js.map