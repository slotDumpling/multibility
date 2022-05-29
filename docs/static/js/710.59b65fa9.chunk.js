"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[710],{16710:function(e,t,n){n.r(t),n.d(t,{MenuMethodCtx:function(){return Ue},MenuStateCtx:function(){return De},NewNoteButton:function(){return Le},default:function(){return Me}});var r=n(15861),s=n(29439),a=n(87757),i=n.n(a),c=n(72791),o=n(75783),l=n(92198),u=n(30501),d=n(1413),x=n(70140),f=n(87309),p=n(50419),m=n(56075),h=n(20662),j=n(96038),v=n(69228),Z=n(99660),g=n(29529),N=n(92414),y=n(99372),k=n(66776),C=n(12056),b=n(61753),T=n(56200),S=n(69951),w=n(24595),E=n(51570),A=n(16871),D=n(35507),U=n(44379),M=n(80184);function L(e){var t=e.value,n=void 0===t?0:t,r=e.digitNum,a=void 0===r?4:r,i=e.onChange,o=void 0===i?function(){}:i,l=e.onSubmit;function u(e){return 0===e?new Array(a).fill(""):String(e).slice(0,a).padEnd(a,"x").split("").map((function(e){return"x"===e?"":e}))}var d=(0,c.useState)(0),x=(0,s.Z)(d,2),f=x[0],p=x[1],m=(0,c.useState)(u(n)),h=(0,s.Z)(m,2),j=h[0],v=h[1];function Z(){-1===f?g.current.forEach((function(e){return e.blur()})):g.current[f].focus()}(0,c.useEffect)((function(){var e=u(n);v(e)}),[n]),(0,c.useEffect)((function(){var e=j.findIndex((function(e){return""===e}));p(e);var t=Number(j.join(""));t!==n&&(o(t),-1===e&&l(t))}),[j]),(0,c.useEffect)((function(){Z()}),[f]);var g=(0,c.useRef)([]);function N(e){if("Backspace"===e.key){var t=Math.max(0,f-1);p(t),v((function(e){var n=e.slice();return n[t]="",n}))}}return(0,c.useEffect)((function(){g.current=g.current.slice(0,a)}),[a]),(0,M.jsxs)("div",{className:"digit-input",children:[j.map((function(e,t){return(0,M.jsx)("input",{ref:function(e){e&&(g.current[t]=e)},value:e,pattern:"\\d*",onChange:function(e){return function(e,t){/^[0-9]$/.test(e)&&v((function(n){var r=n.slice();return r[t]=e,r}))}(e.target.value,t)},onKeyUp:N},t)})),(0,M.jsx)("div",{className:"click-area",onClick:Z})]})}var F=n(61842),P=n.n(F),I=(n(22144),(0,c.createContext)({setActive:function(){}}));function O(){return(0,M.jsxs)("div",{className:"right-tools",children:[(0,M.jsx)(V,{}),(0,M.jsx)(G,{})]})}var B=function(){var e=(0,c.useContext)(I).setActive;return(0,M.jsx)("div",{className:"other-menu",children:(0,M.jsx)(x.Z,{onClick:function(t){var n=t.key;return e(n)},items:[{key:"PDF",icon:(0,M.jsx)(Z.Z,{}),label:"Import PDF"},{key:"PROFILE",icon:(0,M.jsx)(g.Z,{}),label:"My profile"},{key:"SETTINGS",icon:(0,M.jsx)(N.Z,{}),label:"Settings"}]})})},R=function(e){var t=e.children,n=e.title,r=(0,c.useContext)(I).setActive;return(0,M.jsxs)("div",{className:"secondary",children:[(0,M.jsxs)("nav",{children:[(0,M.jsx)(f.Z,{type:"text",shape:"circle",onClick:function(){return r("MENU")},icon:(0,M.jsx)(y.Z,{})}),(0,M.jsx)(D.Z,{level:5,children:n})]}),t]})};function H(){var e=(0,c.useState)(!1),t=(0,s.Z)(e,2),a=t[0],l=t[1],u=(0,c.useContext)(De).tagUid,d=(0,c.useContext)(Ue),x=d.setAllTags,f=d.setAllNotes,h=(0,c.useState)(0),j=(0,s.Z)(h,2),v=j[0],Z=j[1];function g(){return(g=(0,r.Z)(i().mark((function e(t){var r,s,a,c,d,m;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===t.type){e.next=2;break}return e.abrupt("return");case 2:return l(!0),e.next=5,Promise.all([n.e(643),n.e(701)]).then(n.bind(n,21176));case 5:return r=e.sent,s=r.LoadPDF,e.next=9,s(t,Z);case 9:return(a=e.sent).tagID=u,e.next=13,(0,o.au)(a);case 13:return c=e.sent,d=c.tags,m=c.allNotes,x(d),f(m),l(!1),p.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,M.jsx)(R,{title:"Import PDF",children:(0,M.jsxs)(U.Z,{disabled:a,multiple:!1,action:"#",accept:"application/pdf",beforeUpload:function(e){return g.apply(this,arguments)},children:[(0,M.jsx)("p",{className:"ant-upload-drag-icon",children:a?(0,M.jsx)(m.Z,{width:48,type:"circle",percent:v}):(0,M.jsx)(k.Z,{})}),(0,M.jsx)("p",{className:"ant-upload-hint",children:"Click or drag a pdf file here."})]})})}var _=function(){var e=(0,S.vW)(),t=(0,c.useState)(e),n=(0,s.Z)(t,2),r=n[0],a=n[1],i=(0,c.useContext)(I).setActive;return(0,M.jsx)(R,{title:"My profile",children:(0,M.jsxs)("div",{className:"profile-page",children:[(0,M.jsx)(h.Z,{value:r,onChange:function(e){return a(e.target.value)},prefix:(0,M.jsx)(g.Z,{}),allowClear:!0}),(0,M.jsx)(f.Z,{disabled:e===r||!r,onClick:function(){r&&((0,S.lu)(r),i("MENU"))},type:"primary",block:!0,children:"OK"})]})})},z=function(){var e=(0,c.useContext)(Ue).menuInit,t=function(){var t=(0,r.Z)(i().mark((function t(){return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,P().clear();case 2:e();case 3:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,M.jsx)(R,{title:"Settings",children:(0,M.jsx)(j.Z,{title:"Everything will be deleted.",onConfirm:t,icon:(0,M.jsx)(C.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,M.jsx)(f.Z,{icon:(0,M.jsx)(C.Z,{}),danger:!0,block:!0,children:"Clear all"})})})},K=function(){var e=(0,c.useState)(0),t=(0,s.Z)(e,2),n=t[0],r=t[1],a=(0,c.useState)(""),i=(0,s.Z)(a,2),o=i[0],l=i[1],u={timeout:300,onEnter:function(e){r(e.clientHeight)},unmountOnExit:!0},x=(0,d.Z)((0,d.Z)({},u),{},{classNames:"secondary"});return(0,c.useEffect)((function(){return l("MENU")}),[]),(0,M.jsx)(I.Provider,{value:{setActive:l},children:(0,M.jsxs)("section",{className:"others-menu",style:{height:n},children:[(0,M.jsx)(w.Z,(0,d.Z)((0,d.Z)({classNames:"primary",in:"MENU"===o},u),{},{children:(0,M.jsx)(B,{})})),(0,M.jsx)(w.Z,(0,d.Z)((0,d.Z)({in:"PDF"===o},x),{},{children:(0,M.jsx)(H,{})})),(0,M.jsx)(w.Z,(0,d.Z)((0,d.Z)({in:"PROFILE"===o},x),{},{children:(0,M.jsx)(_,{})})),(0,M.jsx)(w.Z,(0,d.Z)((0,d.Z)({in:"SETTINGS"===o},x),{},{children:(0,M.jsx)(z,{})}))]})})},G=function(){var e={shape:"circle",icon:(0,M.jsx)(b.Z,{})};return(0,M.jsxs)(v.Z,{placement:"bottomRight",trigger:"click",content:(0,M.jsx)(K,{}),zIndex:900,children:[(0,M.jsx)(f.Z,(0,d.Z)({className:"large"},e)),(0,M.jsx)(f.Z,(0,d.Z)({className:"small",type:"text"},e))]})};function V(){var e=(0,c.useState)(0),t=(0,s.Z)(e,2),n=t[0],a=t[1],o=(0,c.useState)(!1),l=(0,s.Z)(o,2),u=l[0],d=l[1],x=(0,A.s0)();function p(){return(p=(0,r.Z)(i().mark((function e(t){var n;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,E.fI)(t);case 2:if(n=e.sent){e.next=8;break}return a(0),d(!0),setTimeout((function(){return d(!1)}),1e3),e.abrupt("return");case 8:x("/team/".concat(n));case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,M.jsxs)(v.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,content:(0,M.jsx)("div",{className:u?"animate__animated animate__shakeX":void 0,children:(0,M.jsx)(L,{value:n,onChange:a,onSubmit:function(e){return p.apply(this,arguments)}})}),children:[(0,M.jsx)(f.Z,{className:"team-btn large",shape:"round",icon:(0,M.jsx)(T.Z,{}),children:"Team"}),(0,M.jsx)(f.Z,{className:"team-btn small",type:"text",shape:"circle",icon:(0,M.jsx)(T.Z,{})})]})}var W=n(88894),X=n(96324),Y=n(47323),J=n(74115),$=n(82622),q=n(79286),Q=n(57768),ee=n(51147),te=n(95055),ne=n(11956),re=n(81694),se=n.n(re),ae=function(e){var t=e.children,n=e.nowSwiped,r=e.setNowSwiped,a=e.uid,i=e.onDelete,o=e.disable,l=void 0!==o&&o,u=e.icon,x=void 0!==u&&u,f=e.className,p=(0,c.useState)(!1),m=(0,s.Z)(p,2),h=m[0],j=m[1],v=(0,c.useState)(!1),Z=(0,s.Z)(v,2),g=Z[0],N=Z[1],y=(0,c.useState)(),k=(0,s.Z)(y,2),C=k[0],b=k[1],T=(0,c.useRef)(null),S=g&&(void 0===n||n===a),w=(0,ne.useSwipeable)({onSwipedLeft:function(){var e;N(!0),r&&r(a),b(null===(e=T.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){N(!1),r&&r(""),b(void 0)},preventDefaultTouchmoveEvent:!0,trackTouch:!l});return(0,c.useEffect)((function(){l&&(b(void 0),r&&r(""),N(!1))}),[l,r]),(0,M.jsxs)("div",(0,d.Z)((0,d.Z)({className:se()("swipe-wrapper",f,{deleted:h,deleting:S,icon:x})},w),{},{style:{height:C},children:[(0,M.jsx)("div",{className:"content",children:t}),(0,M.jsx)("div",{className:"button",onClickCapture:function(e){j(!0),setTimeout(i,300),e.stopPropagation()},ref:T,children:x?(0,M.jsx)($.Z,{}):(0,M.jsx)("span",{children:"Delete"})})]}))},ie=function(e){var t={backgroundColor:e.color};return(0,M.jsx)("div",{className:"tag-circle",style:t})},ce=function(e){var t=e.noteTag,n=e.removeTag,a=e.onClick,l=t.uid,u=t.color,x=t.name,p=t.notes,m=(0,c.useContext)(De),v=m.editing,Z=m.tagUid,g=(0,c.useContext)(Ue).setAllTags,y=(0,c.useState)(!1),k=(0,s.Z)(y,2),C=k[0],b=k[1],T=(0,c.useState)(x),S=(0,s.Z)(T,2),w=S[0],E=S[1],A=(0,c.useState)(u),D=(0,s.Z)(A,2),U=D[0],L=D[1],F=function(){var e=(0,r.Z)(i().mark((function e(){var n,r;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,d.Z)((0,d.Z)({},t),{},{name:w,color:U}),e.next=3,(0,o.tk)(n);case 3:r=e.sent,g(r),b(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),P=(0,M.jsx)(Y.Z,{value:U,onSelect:L,children:J.O9.map((function(e){return(0,M.jsx)(Y.Z.Option,{value:e,children:(0,M.jsx)(ie,{color:e})},e)}))}),I=(0,M.jsx)(h.Z,{className:"tag-name-input",addonBefore:P,value:w,onChange:function(e){return E(e.target.value)}});return(0,c.useEffect)((function(){b(!1)}),[v]),(0,M.jsxs)("div",{className:se()("tag-item",{curr:Z===l,editing:v&&C}),onClick:a,children:[v&&C||(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(ie,{color:U}),(0,M.jsx)("span",{className:"tag-name",children:w})]}),v||(0,M.jsx)("span",{className:"tag-num",children:p.length}),v&&!C&&(0,M.jsx)(f.Z,{size:"small",type:"text",onClick:function(){return b(!0)},icon:(0,M.jsx)(N.Z,{})}),v&&C&&(0,M.jsxs)(M.Fragment,{children:[I,(0,M.jsxs)("div",{className:"buttons",children:[(0,M.jsx)(j.Z,{title:"This tag will be deleted.",onConfirm:n,placement:"left",cancelText:"Cancel",icon:(0,M.jsx)($.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,M.jsx)(f.Z,{danger:!0,children:"Delete"})}),(0,M.jsx)(f.Z,{onClick:function(){E(x),L(u),b(!1)},children:"Cancel"}),(0,M.jsx)(f.Z,{disabled:""===w,type:"primary",onClick:F,children:"OK"})]})]})]})},oe=function(){var e=(0,c.useContext)(Ue).setAllTags,t=(0,c.useState)(!1),n=(0,s.Z)(t,2),a=n[0],l=n[1];function u(e){return d.apply(this,arguments)}function d(){return(d=(0,r.Z)(i().mark((function t(n){var r,s;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(r=n.trim()){t.next=5;break}return t.abrupt("return");case 5:return t.next=7,(0,o.HO)(r);case 7:s=t.sent,e(s),l(!1);case 10:case"end":return t.stop()}}),t)})))).apply(this,arguments)}var x=function(){return(0,M.jsx)(te.Z,{placeholder:"Tag name...",onSearch:u,allowClear:!0,enterButton:(0,M.jsx)(f.Z,{icon:(0,M.jsx)(q.Z,{})})})};return(0,M.jsx)("div",{className:"add-tag",children:(0,M.jsx)(v.Z,{visible:a,onVisibleChange:l,content:(0,M.jsx)(x,{}),trigger:"click",placement:"topLeft",destroyTooltipOnHide:!0,children:(0,M.jsx)(f.Z,{shape:"round",icon:(0,M.jsx)(Q.Z,{}),onClick:function(){return l(!0)},children:"Add"})})})};function le(e){var t=e.onSelect,n=(0,c.useContext)(De),a=n.allTags,l=n.editing,u=n.tagUid,d=n.allNotes,x=(0,c.useContext)(Ue),p=x.setTagUid,m=x.setAllTags,h=(0,c.useContext)(Ue).setEditing,j=(0,c.useState)(""),v=(0,s.Z)(j,2),Z=v[0],g=v[1];function N(){return(N=(0,r.Z)(i().mark((function e(t){var n;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,o.Pn)(t);case 2:n=e.sent,p("DEFAULT"),m(n);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var y=function(e){p(e),t&&t()},k=(0,M.jsxs)("div",{className:se()("tag-item",{curr:"DEFAULT"===u}),onClick:function(){return y("DEFAULT")},children:[(0,M.jsx)(ee.Z,{className:"all-note-icon"}),(0,M.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,M.jsx)("span",{className:"tag-num",children:Object.keys(d).length})]}),C=(0,M.jsx)(f.Z,{className:"edit-btn small",shape:"round",type:l?"primary":"default",onClick:function(){h((function(e){return!e}))},children:l?"Done":"Edit"});return(0,M.jsxs)("aside",{className:"side-menu",children:[(0,M.jsxs)("div",{className:"tag-list",children:[k,Object.values(a).map((function(e){var t=e.uid,n=function(){return function(e){return N.apply(this,arguments)}(t)};return(0,M.jsx)(ae,{uid:t,className:"tag-swipe",onDelete:n,nowSwiped:Z,setNowSwiped:g,disable:l,icon:!0,children:(0,M.jsx)(ce,{noteTag:e,removeTag:n,onClick:function(){return y(t)}})},t)}))]}),(0,M.jsxs)("footer",{children:[(0,M.jsx)(oe,{}),C]})]})}function ue(){var e=(0,c.useState)(!1),t=(0,s.Z)(e,2),n=t[0],r=t[1],a=(0,c.useContext)(De).editing,i=(0,c.useContext)(Ue).setEditing;var o=(0,M.jsx)(f.Z,{className:"edit-btn large",onClick:function(){i((function(e){return!e}))},type:a?"primary":"text",children:a?"Done":"Edit"}),l=(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(f.Z,{className:"aside-btn",type:"text",icon:(0,M.jsx)(X.Z,{}),onClick:function(){return r((function(e){return!e}))}}),(0,M.jsx)(W.Z,{className:"aside-drawer",width:300,placement:"left",closable:!1,visible:n,onClose:function(){return r(!1)},contentWrapperStyle:{boxShadow:"none"},bodyStyle:{padding:0,overflow:"hidden"},destroyOnClose:!0,children:(0,M.jsx)(le,{onSelect:function(){return a||r(!1)}})})]});return(0,M.jsxs)("div",{className:"left-tools",children:[l,o]})}var de=n(4942),xe=n(93433),fe=n(37762),pe=n(40050),me=n(31752),he=n(20054),je=n(9486),ve=n(60732),Ze=n(1194),ge=n(11730),Ne=n(42553),ye=n(37382),ke=n(47528),Ce=n(16911),be=n(24124),Te=n(72426),Se=n.n(Te);function we(e){var t=e.noteList,n=(0,c.useState)(""),a=(0,s.Z)(n,2),l=a[0],u=a[1],d=(0,c.useContext)(De).editing,x=(0,c.useContext)(Ue),f=x.setAllTags,p=x.setAllNotes,m=(0,c.useState)("LAST"),h=(0,s.Z)(m,2),j=h[0],v=h[1],Z=(0,c.useState)(""),g=(0,s.Z)(Z,2),N=g[0],y=g[1],k=(0,c.useState)((0,be.l4)()),C=(0,s.Z)(k,2),b=C[0],T=C[1],S=(0,A.s0)(),w=function(){var e=(0,r.Z)(i().mark((function e(t){var n,r,s,a,c,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s=(0,fe.Z)(t),e.prev=1,s.s();case 3:if((a=s.n()).done){e.next=12;break}return c=a.value,e.next=7,(0,o.f_)(c);case 7:l=e.sent,n=l.tags,r=l.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),s.e(e.t0);case 17:return e.prev=17,s.f(),e.finish(17);case 20:n&&f(n),r&&p(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),E=function(){var e=(0,r.Z)(i().mark((function e(t,n){var r,s,a,c,l,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,fe.Z)(t),e.prev=1,a.s();case 3:if((c=a.n()).done){e.next=12;break}return l=c.value,e.next=7,(0,o.tw)(l,n);case 7:u=e.sent,r=u.tags,s=u.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:r&&f(r),s&&p(s);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t,n){return e.apply(this,arguments)}}(),D=(0,c.useMemo)((function(){switch(j){case"CREATE":return t.sortBy((function(e){return-e.createTime}));case"LAST":return t.sortBy((function(e){return-e.lastTime}));case"NAME":return t.sortBy((function(e){return e.name.toUpperCase()}));default:return t}}),[t,j]),U=(0,c.useMemo)((function(){return D.filter((function(e){return e.name.toLowerCase().includes(N.trim().toLowerCase())}))}),[N,D]);return(0,c.useEffect)((function(){y(""),T((0,be.l4)())}),[t,d]),(0,M.jsxs)("div",{className:"note-list",children:[(0,M.jsx)(Ee,{sortType:j,setSortType:v,searchText:N,setSearchText:y,onDelete:function(){return w(b.toArray())},onMove:function(e){return E(b.toArray(),e)},disabled:0===b.size}),U.map((function(e){var t=e.uid,n=e.team,r="".concat(n?"team":"reader","/").concat(t);return(0,M.jsx)(ae,{onDelete:function(){return w([t])},nowSwiped:l,setNowSwiped:u,disable:d,uid:t,children:(0,M.jsx)(Ae,{noteInfo:e,onClick:function(e){if(!(e.target instanceof HTMLInputElement))return d?void T((function(e){return e.has(t)?e.delete(t):e.add(t)})):S(r)},selected:b.has(t)})},t)}))]})}var Ee=function(e){var t=e.sortType,n=e.setSortType,r=e.searchText,s=e.setSearchText,a=e.onDelete,i=e.onMove,o=e.disabled,l=void 0===o||o,u=(0,c.useContext)(De),d=u.editing,p=u.allTags,m=(0,M.jsx)(x.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],items:[{icon:(0,M.jsx)(pe.Z,{}),key:"CREATE",label:"Created Time"},{icon:(0,M.jsx)(me.Z,{}),key:"LAST",label:"Modified Time"},{icon:(0,M.jsx)(he.Z,{}),key:"NAME",label:"Name"}]}),v=(0,M.jsx)(ye.Z,{overlay:m,trigger:["click"],placement:"bottom",children:(0,M.jsx)(f.Z,{className:"sort-btn",type:"text",shape:"circle",icon:(0,M.jsx)(je.Z,{rotate:90})})}),Z=(0,M.jsx)(j.Z,{title:"Notes will be deleted.",onConfirm:a,icon:(0,M.jsx)($.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:l,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,M.jsx)(f.Z,{className:"del-btn",shape:"round",type:"text",disabled:l,danger:!l,icon:(0,M.jsx)($.Z,{}),children:"Delete"})}),g=(0,M.jsx)(x.Z,{onClick:function(e){var t=e.key;return i(t)},items:[{key:"DEFAULT",label:(0,M.jsxs)("div",{className:"tag-select",children:[(0,M.jsx)(ve.Z,{className:"none-tag-icon"}),(0,M.jsx)("span",{children:"No Tag"})]})}].concat((0,xe.Z)(Object.values(p).map((function(e){return{key:e.uid,label:(0,M.jsxs)("div",{className:"tag-select",children:[(0,M.jsx)(ie,{color:e.color}),(0,M.jsx)("span",{children:e.name})]})}}))))}),N=(0,M.jsx)(ye.Z,{disabled:l,overlay:g,trigger:["click"],placement:"bottom",children:(0,M.jsx)(f.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,M.jsx)(Ze.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,M.jsx)("div",{className:se()("head-tools",{editing:d}),children:d?(0,M.jsxs)(M.Fragment,{children:[N,Z]}):(0,M.jsxs)(M.Fragment,{children:[(0,M.jsx)(h.Z,{value:r,onChange:function(e){return s(e.target.value)},className:"search-input",prefix:(0,M.jsx)(ge.Z,{}),bordered:!1,allowClear:!0}),v]})})},Ae=function(e){var t=e.noteInfo,n=e.onClick,r=e.selected,a=t.team,i=t.uid,l=t.name,u=t.thumbnail,x=t.lastTime,f=(0,c.useContext)(De).editing,p=(0,c.useContext)(Ue).setAllNotes,m=(0,c.useState)(l),j=(0,s.Z)(m,2),v=j[0],Z=j[1],g=(0,c.useMemo)((function(){return Se()(x).calendar()}),[x]);return(0,M.jsxs)("div",{className:se()("note-item",{selected:r}),onClick:n,children:[(0,M.jsxs)("div",{className:"timg-wrapper",children:[(0,M.jsx)("img",{src:u||Ce,alt:l,className:"timg"}),a&&(0,M.jsx)(ke.Z,{color:"blue",className:"cloud-icon",children:(0,M.jsx)(Ne.Z,{})})]}),(0,M.jsxs)("div",{className:"content",children:[f||(0,M.jsx)("p",{className:"name",children:l}),f&&(0,M.jsx)(h.Z,{className:"name-input",value:v,onChange:function(e){return Z(e.target.value)},onBlur:function(){var e=v.trim();if(!e||e===l)return Z(l);(0,o.SP)(i,{name:e}),p((function(t){return(0,d.Z)((0,d.Z)({},t),{},(0,de.Z)({},i,(0,d.Z)((0,d.Z)({},t[i]),{},{name:e})))}))}}),(0,M.jsx)("p",{className:"date",children:g})]})]})},De=(0,c.createContext)({tagUid:"DEFAULT",editing:!1,allNotes:{},allTags:{}}),Ue=(0,c.createContext)({setAllNotes:function(){},setAllTags:function(){},setTagUid:function(){},setEditing:function(){},menuInit:function(){}});function Me(){var e=(0,c.useState)({}),t=(0,s.Z)(e,2),n=t[0],r=t[1],a=(0,c.useState)({}),i=(0,s.Z)(a,2),l=i[0],u=i[1],d=(0,c.useState)("DEFAULT"),x=(0,s.Z)(d,2),f=x[0],p=x[1],m=(0,c.useState)(!1),h=(0,s.Z)(m,2),j=h[0],v=h[1],Z=(0,c.useMemo)((function(){return"DEFAULT"===f?{uid:"",name:"All Notes",color:"#000000",notes:Object.keys(n)}:l[f]}),[n,l,f]),g=(0,c.useMemo)((function(){return(0,be.aV)(Z.notes.filter((function(e){return e in n})).map((function(e){return n[e]})))}),[Z,n]),N=function(){(0,o.hY)().then(r),(0,o.Ys)().then(u),document.title="Multibility"};return(0,c.useEffect)(N,[]),(0,M.jsx)(De.Provider,{value:{tagUid:f,editing:j,allNotes:n,allTags:l},children:(0,M.jsx)(Ue.Provider,{value:{setAllNotes:r,setAllTags:u,setEditing:v,setTagUid:p,menuInit:N},children:(0,M.jsxs)("div",{className:"main-menu container",children:[(0,M.jsxs)("header",{children:[(0,M.jsx)(ue,{}),(0,M.jsx)("h2",{children:Z.name}),(0,M.jsx)(O,{})]}),(0,M.jsxs)("main",{children:[(0,M.jsx)(le,{}),(0,M.jsx)(we,{noteList:g}),(0,M.jsx)(Le,{})]})]})})})}var Le=function(){var e=(0,c.useContext)(De).tagUid,t=(0,c.useContext)(Ue),n=t.setAllTags,s=t.setAllNotes;function a(){return(a=(0,r.Z)(i().mark((function t(){var r,a,c,u;return i().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return(r=(0,l.Xn)()).tagID=e,t.next=4,(0,o.au)(r);case 4:a=t.sent,c=a.tags,u=a.allNotes,n(c),s(u);case 9:case"end":return t.stop()}}),t)})))).apply(this,arguments)}return(0,M.jsx)(f.Z,{className:"new-note",size:"large",type:"primary",shape:"circle",onClick:function(){return a.apply(this,arguments)},icon:(0,M.jsx)(u.Z,{})})}},16911:function(e,t,n){e.exports=n.p+"static/media/default.dd5512731ffc4dfd92ad.png"}}]);
//# sourceMappingURL=710.59b65fa9.chunk.js.map