"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[137],{72058:function(e,t,n){n.d(t,{eG:function(){return x},mp:function(){return o},pW:function(){return u}});var r=n(37762),a=n(74165),s=n(93433),c=n(15861),i=n(61842),l=n.n(i)().createInstance({name:"imageForage"}),o=function(){var e=(0,c.Z)((0,a.Z)().mark((function e(t,n){var r,c,i;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=r=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==r;case 6:if(!e.t0){e.next=10;break}e.t2=r,e.next=11;break;case 10:e.t2=[];case 11:if(c=e.t2,i="".concat(t,"_").concat(n),c.includes(i)){e.next=15;break}return e.abrupt("return");case 15:return c=[i].concat((0,s.Z)(c.filter((function(e){return e!==i})))),e.next=18,l.setItem("LIST",c);case 18:return e.next=20,l.getItem(i);case 20:return e.abrupt("return",e.sent);case 21:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),u=function(){var e=(0,c.Z)((0,a.Z)().mark((function e(t,n,r){var c,i,o;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=c=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==c;case 6:if(!e.t0){e.next=10;break}e.t2=c,e.next=11;break;case 10:e.t2=[];case 11:return i=e.t2,o="".concat(t,"_").concat(n),(i=[o].concat((0,s.Z)(i.filter((function(e){return e!==o}))))).length>10&&(i=i.slice(0,10)),e.next=17,l.setItem("LIST",i);case 17:return e.next=19,l.setItem(o,r);case 19:d();case 20:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),d=function(){var e=(0,c.Z)((0,a.Z)().mark((function e(){var t,n,s,c,i,o,u;return(0,a.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.getItem("LIST");case 2:if(e.t1=t=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==t;case 6:if(!e.t0){e.next=10;break}e.t2=t,e.next=11;break;case 10:e.t2=[];case 11:return n=e.t2,s=new Set(n),e.next=15,l.keys();case 15:c=e.sent,i=(0,r.Z)(c),e.prev=17,i.s();case 19:if((o=i.n()).done){e.next=28;break}if("LIST"!==(u=o.value)){e.next=23;break}return e.abrupt("continue",26);case 23:if(s.has(u)){e.next=26;break}return e.next=26,l.removeItem(u);case 26:e.next=19;break;case 28:e.next=33;break;case 30:e.prev=30,e.t3=e.catch(17),i.e(e.t3);case 33:return e.prev=33,i.f(),e.finish(33);case 36:case"end":return e.stop()}}),e,null,[[17,30,33,36]])})));return function(){return e.apply(this,arguments)}}(),x=function(){return l.clear()}},41710:function(e,t,n){n.r(t),n.d(t,{default:function(){return Ke}});var r=n(1413),a=n(29439),s=n(72791),c=n(75783),i=n(52365),l=n(74165),o=n(15861),u=n(92414),d=n(82622),x=n(93309),p=n(96324),f=n(79286),m=n(70776),h=n(92560),Z=n(87309),j=n(34571),g=n(74115),v=n(45987),N=n(13892),k=n(81694),b=n.n(k),y=n(49030),T=n(80184),S=["children","onDelete","disable","className"],C=(0,s.createContext)(["",function(){}]),w=function(e){var t=e.children,n=(0,s.useState)("");return(0,T.jsx)(C.Provider,{value:n,children:t})},I=function(e){var t=e.children,n=e.onDelete,c=e.disable,u=void 0!==c&&c,d=e.className,x=(0,v.Z)(e,S),p=(0,s.useState)(y.Z),f=(0,a.Z)(p,1)[0],m=(0,s.useContext)(C),h=(0,a.Z)(m,2),Z=h[0],j=h[1],g=(0,s.useState)(!1),k=(0,a.Z)(g,2),w=k[0],I=k[1],D=w&&(!Z||Z===f),E=(0,s.useState)(!1),A=(0,a.Z)(E,2),F=A[0],L=A[1],O=(0,s.useState)(),M=(0,a.Z)(O,2),P=M[0],R=M[1],U=(0,s.useRef)(null);(0,s.useEffect)((function(){Z!==f&&I(!1)}),[Z,f]);var z=(0,N.QS)({onSwipedLeft:function(){var e;I(!0),j(f),R(null===(e=U.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){I(!1),j(""),R(void 0)},preventScrollOnSwipe:!0,trackTouch:!u});(0,s.useEffect)((function(){u&&(R(void 0),j(""),I(!1))}),[u,j]);var H=(0,i.mf)({propertyName:"height",active:F}),B=(0,a.Z)(H,2),W=B[0],G=B[1],K=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(){return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return L(!0),e.next=3,W;case 3:n(),j("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,T.jsxs)("div",(0,r.Z)((0,r.Z)((0,r.Z)({className:b()("swipe-wrapper",d),"data-deleted":F,"data-deleting":D},z),{},{style:{height:P},onTransitionEnd:G},x),{},{children:[(0,T.jsx)("div",{className:"content",ref:U,children:t}),(0,T.jsx)("div",{className:"button",onClick:K,style:{height:P},children:"Delete"})]}))},D=n(35873),E=n(5993),A=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,T.jsx)(m.Z,{value:r,onSelect:a,listHeight:150,virtual:!1,dropdownClassName:"tag-color-drop",children:g.O9.map((function(e){return(0,T.jsx)(m.Z.Option,{value:e,children:(0,T.jsx)(D.W,{className:"tag-circle",color:e})},e)}))});return(0,T.jsx)(h.Z,{placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},F=function(e){var t=e.noteTag,n=e.currTagID,i=e.setAllTags,x=e.setCurrTagID,p=t.uid,f=t.color,m=t.name,h=t.notes,v=(0,s.useState)(m),N=(0,a.Z)(v,2),k=N[0],b=N[1],y=(0,s.useState)(f),S=(0,a.Z)(y,2),C=S[0],w=S[1],E=(0,s.useState)(!1),F=(0,a.Z)(E,2),L=F[0],O=F[1],M=n===p;function P(){return R.apply(this,arguments)}function R(){return(R=(0,o.Z)((0,l.Z)().mark((function e(){var t;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.Pn)(p);case 2:t=e.sent,x("DEFAULT"),i(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,s.useEffect)((function(){return O(!1)}),[M]);var U=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(){var n,a;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,r.Z)((0,r.Z)({},t),{},{name:k,color:C}),e.next=3,(0,c.tk)(n);case 3:a=e.sent,i(a),O(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),z=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(D.W,{className:"tag-circle",color:C}),(0,T.jsx)("span",{className:"tag-name",children:k}),M?(0,T.jsx)(Z.Z,{size:"small",type:"text",onClick:function(){return O(!0)},icon:(0,T.jsx)(u.Z,{})}):(0,T.jsx)("span",{className:"tag-num",children:h.length})]}),H=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(A,{tagName:k,setTagName:b,tagColor:C,setTagColor:w}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(j.Z,{title:"This tag will be deleted.",onConfirm:P,placement:"left",cancelText:"Cancel",icon:(0,T.jsx)(d.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(Z.Z,{danger:!0,children:"Delete"})}),(0,T.jsx)(Z.Z,{onClick:function(){b(m),w(f),O(!1)},children:"Cancel"}),(0,T.jsx)(Z.Z,{type:"primary",disabled:!k,onClick:U,children:"OK"})]})]});return(0,T.jsx)(I,{className:"tag-wrapper",onDelete:P,disable:L,children:(0,T.jsx)("div",{className:"tag-item","data-curr":M,"data-editing":L,onClick:function(){return x(p)},style:(0,g.MW)(f),children:L?H:z})})},L=function(e){var t=e.setAdding,n=e.setAllTags,r=(0,s.useState)(""),i=(0,a.Z)(r,2),l=i[0],o=i[1],u=(0,s.useState)((0,g.mr)()),d=(0,a.Z)(u,2),x=d[0],p=d[1];return(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-editing":!0,children:[(0,T.jsx)(A,{tagName:l,setTagName:o,tagColor:x,setTagColor:p}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(Z.Z,{onClick:function(){return t(!1)},children:"Cancel"}),(0,T.jsx)(Z.Z,{type:"primary",disabled:!l,onClick:function(){var e=l.trim();e&&((0,c.HO)(e,x).then(n),t(!1))},children:"OK"})]})]})})},O=function(e){var t=e.allTags,n=e.currTagID,c=e.allNotes,l=e.setCurrTagID,o=(0,s.useState)(!1),u=(0,a.Z)(o,2),d=u[0],m=u[1],h=(0,i.LH)(),j=(0,a.Z)(h,2),g=j[0],v=j[1],N=(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-curr":"DEFAULT"===n,onClick:function(){return l("DEFAULT")},children:[(0,T.jsx)(x.Z,{className:"all-note-icon"}),(0,T.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,T.jsx)("span",{className:"tag-num",children:Object.keys(c).length})]})}),k=(0,T.jsxs)("header",{children:[(0,T.jsx)(Z.Z,{className:"aside-btn",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return v(!1)}}),(0,T.jsx)("h2",{className:"logo",children:"Multibility"}),(0,T.jsx)(Z.Z,{className:"new-tag-btn",type:"text",icon:(0,T.jsx)(f.Z,{}),onClick:function(){return m(!0)},disabled:d})]}),b=(0,T.jsxs)("footer",{children:[(0,T.jsx)(E.Z,{href:"https://github.com/slotDumpling/multibility","data-color-scheme":"no-preference: light; light: light; dark: dark;","data-size":"large","aria-label":"Star slotDumpling/multibility on GitHub",children:"Star"}),(0,T.jsx)(E.Z,{href:"https://github.com/slotDumpling/multibility/issues/3","data-color-scheme":"no-preference: light; light: light; dark: dark;","data-icon":"octicon-issue-opened","data-size":"large","aria-label":"Issue slotDumpling/multibility on GitHub",children:"\u60f3\u8981\u65e0\u8fb9\u754c\u753b\u677f"})]});return(0,T.jsx)("aside",{"data-open":g,onClick:function(){return v(!1)},children:(0,T.jsxs)("div",{className:"side-menu",onClick:function(e){return e.stopPropagation()},children:[k,(0,T.jsxs)("div",{className:"tag-list",children:[N,(0,T.jsx)(w,{children:Object.values(t).map((function(t){return(0,T.jsx)(F,(0,r.Z)({noteTag:t},e),t.uid)}))}),d&&(0,T.jsx)(L,(0,r.Z)({setAdding:m},e))]}),b]})})},M=n(4942),P=n(75660),R=n(56983),U=n(96989),z=n(37557),H=n(77106),B=n(82670),W=n(57689),G=n(24124),K=n(51570),_=n(79856),J=n(69228),V=n(30501),X=n(56200),Y=n(92198),Q=n(78502),$=n(50419),q=n(28817),ee=n(36090),te=n(99372),ne=n(66776),re=n(29529),ae=n(12056),se=n(99660),ce=n(61753),ie=n(69951),le=n(72058),oe=n(61842),ue=n.n(oe),de=["children","title","keyName"],xe=function(e){var t=e.children,n=e.title,s=e.keyName,c=(0,v.Z)(e,de),l=(0,i.zI)(),o=(0,a.Z)(l,2),u=o[0],d=o[1];return(0,T.jsx)(R.Z,(0,r.Z)((0,r.Z)({in:u===s},c),{},{children:(0,T.jsx)("div",{className:"secondary",children:(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("nav",{children:[(0,T.jsx)(Z.Z,{type:"text",shape:"circle",onClick:function(){return d("MENU")},icon:(0,T.jsx)(te.Z,{})}),(0,T.jsx)("h3",{children:n})]}),t]})})}))},pe=function(e){var t=e.currTagID,r=e.setAllTags,i=e.setAllNotes,u=(0,s.useState)(!1),d=(0,a.Z)(u,2),x=d[0],p=d[1],f=(0,s.useState)(0),m=(0,a.Z)(f,2),h=m[0],Z=m[1];function j(){return(j=(0,o.Z)((0,l.Z)().mark((function e(a){var s,o,u,d,x,f;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===a.type){e.next=2;break}return e.abrupt("return");case 2:return p(!0),e.next=5,Promise.all([n.e(574),n.e(120),n.e(61)]).then(n.bind(n,21176));case 5:return s=e.sent,o=s.LoadPDF,e.next=9,o(a,Z);case 9:return(u=e.sent).tagID=t,e.next=13,(0,c.au)(u);case 13:return d=e.sent,x=d.tags,f=d.allNotes,r(x),i(f),p(!1),$.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)("label",{children:[(0,T.jsxs)("div",{className:"pdf-upload",children:[(0,T.jsx)("div",{className:"icon-wrapper",children:x?(0,T.jsx)(q.Z,{width:48,type:"circle",percent:h}):(0,T.jsx)(ne.Z,{className:"inbox-icon"})}),(0,T.jsx)("p",{className:"hint",children:"Click to import a pdf file."})]}),(0,T.jsx)("input",{type:"file",multiple:!1,accept:".pdf",onChange:function(e){var t=e.target.files,n=t&&t[0];n&&function(e){j.apply(this,arguments)}(n)}})]})},fe=function(){var e=(0,i.zI)(),t=(0,a.Z)(e,2)[1],n=(0,ie.vW)(),r=(0,s.useState)(n),c=(0,a.Z)(r,2),l=c[0],o=c[1];return(0,T.jsxs)("div",{className:"profile-page",children:[(0,T.jsx)(h.Z,{value:l,onChange:function(e){return o(e.target.value)},prefix:(0,T.jsx)(re.Z,{}),allowClear:!0}),(0,T.jsx)(Z.Z,{disabled:n===l||!l,onClick:function(){l&&((0,ie.lu)(l),t("MENU"))},type:"primary",block:!0,children:"OK"})]})},me=function(){var e=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(){return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ue().clear();case 2:return e.next=4,(0,le.eG)();case 4:localStorage.clear(),window.location.reload();case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,T.jsx)("div",{className:"setting-menu",children:(0,T.jsx)(j.Z,{title:"Everything will be deleted.",onConfirm:e,icon:(0,T.jsx)(ae.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,T.jsx)(Z.Z,{icon:(0,T.jsx)(ae.Z,{}),danger:!0,block:!0,children:"Clear all"})})})},he=[{key:"PDF",label:"Import PDF",icon:(0,T.jsx)(se.Z,{})},{key:"PROFILE",label:"My profile",icon:(0,T.jsx)(re.Z,{})},{key:"SETTINGS",label:"Settings",icon:(0,T.jsx)(u.Z,{})}],Ze=function(){var e=(0,i.zI)(),t=(0,a.Z)(e,2)[1];return(0,T.jsx)("div",{className:"primary-menu",children:(0,T.jsx)(ee.Z,{onClick:function(e){var n=e.key;return t(n)},items:he})})},je=function(e){var t=(0,s.useState)(0),n=(0,a.Z)(t,2),c=n[0],l=n[1],o=(0,i.zI)(),u=(0,a.Z)(o,2),d=u[0],x=u[1],p={timeout:300,onEnter:function(e){l(e.clientHeight)},unmountOnExit:!0};(0,s.useEffect)((function(){return x("MENU")}),[x]);var f={PDF:(0,T.jsx)(pe,(0,r.Z)({},e)),PROFILE:(0,T.jsx)(fe,{}),SETTINGS:(0,T.jsx)(me,{})};return(0,T.jsxs)("section",{className:"others-menu",style:{height:c},children:[(0,T.jsx)(R.Z,(0,r.Z)((0,r.Z)({in:"MENU"===d},p),{},{children:(0,T.jsx)(Ze,{})})),he.map((function(e){var t=e.key,n=e.label;return(0,T.jsx)(xe,(0,r.Z)((0,r.Z)({keyName:t,title:n},p),{},{children:f[t]}),t)}))]})},ge=function(e){return(0,T.jsxs)(J.Z,{placement:"bottomRight",trigger:"click",content:(0,T.jsx)(i.s2,{initKey:"",children:(0,T.jsx)(je,(0,r.Z)({},e))}),zIndex:900,children:[(0,T.jsx)(Z.Z,{className:"small",type:"text",icon:(0,T.jsx)(ce.Z,{})}),(0,T.jsx)(Z.Z,{className:"large",shape:"circle",icon:(0,T.jsx)(ce.Z,{})})]})},ve=function(e){return(0,T.jsxs)("nav",{children:[(0,T.jsx)(Ne,(0,r.Z)({},e)),(0,T.jsx)(ke,(0,r.Z)({},e))]})},Ne=function(e){var t,n,r=e.allTags,s=e.currTagID,c=(0,i.LH)(),l=(0,a.Z)(c,2)[1],o=null!==(t=null===(n=r[s])||void 0===n?void 0:n.name)&&void 0!==t?t:"All notes";return(0,T.jsxs)("div",{className:"nav-left",children:[(0,T.jsx)(Z.Z,{className:"aside-btn small",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return l(!0)}}),(0,T.jsx)("h2",{children:(0,T.jsx)("b",{children:o})})]})},ke=function(e){return(0,T.jsxs)("div",{className:"nav-right",children:[(0,T.jsx)(be,(0,r.Z)({},e)),(0,T.jsx)(ye,{}),(0,T.jsx)(ge,(0,r.Z)({},e))]})},be=function(e){var t=e.currTagID,n=e.setAllTags,r=e.setAllNotes;function a(){return s.apply(this,arguments)}function s(){return(s=(0,o.Z)((0,l.Z)().mark((function e(){var a,s,i,o;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(a=(0,Y.Xn)()).tagID=t,e.next=4,(0,c.au)(a);case 4:s=e.sent,i=s.tags,o=s.allNotes,n(i),r(o);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,{className:"new-note large",type:"primary",shape:"round",onClick:a,icon:(0,T.jsx)(V.Z,{}),children:"New"}),(0,T.jsx)(Z.Z,{className:"new-note small",type:"link",onClick:a,icon:(0,T.jsx)(V.Z,{})})]})},ye=function(){var e=(0,s.useState)(""),t=(0,a.Z)(e,2),n=t[0],r=t[1],c=(0,s.useState)(!1),i=(0,a.Z)(c,2),u=i[0],d=i[1],x=(0,s.useState)(!1),p=(0,a.Z)(x,2),f=p[0],m=p[1],h=(0,W.s0)();function j(){return(j=(0,o.Z)((0,l.Z)().mark((function e(t){var n;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return d(!0),e.next=3,(0,K.fI)(t);case 3:if(n=e.sent,d(!1),!n){e.next=7;break}return e.abrupt("return",h("/team/".concat(n)));case 7:r(""),m(!0);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}var g=(0,T.jsxs)("div",{className:"join-team-title",children:[(0,T.jsx)("span",{children:"Join a team note"}),(0,T.jsx)("span",{children:u&&(0,T.jsx)(H.Z,{})})]});return(0,T.jsxs)(J.Z,{placement:"bottomRight",trigger:"click",title:g,destroyTooltipOnHide:!0,onOpenChange:function(){return m(!1)},content:(0,T.jsx)(Q.GD,{plain:!0,length:4,error:f,value:n,onChange:function(e){m(!1),r(e)},onFill:function(e){return j.apply(this,arguments)}}),children:[(0,T.jsx)(Z.Z,{className:"team-btn large",shape:"round",icon:(0,T.jsx)(X.Z,{}),children:"Team"}),(0,T.jsx)(Z.Z,{className:"team-btn small",type:"text",icon:(0,T.jsx)(X.Z,{})})]})},Te=n(93433),Se=n(37762),Ce=n(60481),we=n(68692),Ie=n(13876),De=n(20054),Ee=n(9486),Ae=n(1194),Fe=n(74270),Le=n(11730),Oe=function(e){var t=e.sortType,n=e.setSortType,a=e.editing,s=e.setEditing,i=e.searchText,u=e.setSearchText,x=e.selectedNotes,p=e.setAllNotes,f=e.setAllTags,m=e.allTags,g={items:[{type:"group",children:[{icon:(0,T.jsx)(we.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,T.jsx)(Ie.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,T.jsx)(De.Z,{}),key:"NAME",label:"Name"}],label:"Sort by",className:"sort-drop"}],onClick:function(e){var t=e.key;n(t)},selectedKeys:[t]},v={type:"text",shape:"circle"},N=(0,T.jsx)(Ce.Z,{menu:g,trigger:["click"],placement:"bottomRight",children:(0,T.jsx)(Z.Z,(0,r.Z)({className:"sort-btn",icon:(0,T.jsx)(Ee.Z,{rotate:90})},v))}),k=0===x.size,b=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(){var t,n,r,a,s,i;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=(0,Se.Z)(x.toArray()),e.prev=1,r.s();case 3:if((a=r.n()).done){e.next=12;break}return s=a.value,e.next=7,(0,c.f_)(s);case 7:i=e.sent,t=i.tags,n=i.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),r.e(e.t0);case 17:return e.prev=17,r.f(),e.finish(17);case 20:t&&f(t),n&&p(n);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(){return e.apply(this,arguments)}}(),y=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(t){var n,r,a,s,i,o;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,Se.Z)(x.toArray()),e.prev=1,a.s();case 3:if((s=a.n()).done){e.next=12;break}return i=s.value,e.next=7,(0,c.tw)(i,t);case 7:o=e.sent,n=o.tags,r=o.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&f(n),r&&p(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),S=(0,T.jsx)(j.Z,{title:"Notes will be deleted.",onConfirm:b,icon:(0,T.jsx)(d.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:k,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(Z.Z,{className:"del-btn",shape:"round",type:"text",disabled:k,danger:!k,icon:(0,T.jsx)(d.Z,{}),children:"Delete"})}),C=function(e){var t=e.color,n=e.name;return(0,T.jsxs)("div",{className:"tag-select",children:[(0,T.jsx)(D.W,{color:t,className:"tag-circle"}),(0,T.jsx)("span",{className:"name",children:n})]})},w=(0,T.jsx)(ee.Z,{onClick:function(e){var t=e.key;return y(t)},items:[{key:"DEFAULT",label:(0,T.jsx)(C,{color:"#eee",name:"No tag"})}].concat((0,Te.Z)(Object.values(m).map((function(e){return{key:e.uid,label:(0,T.jsx)(C,{color:e.color,name:e.name})}}))))}),I=(0,T.jsx)(Ce.Z,{overlayClassName:"tag-drop",disabled:k,overlay:w,trigger:["click"],placement:"bottom",children:(0,T.jsx)(Z.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,T.jsx)(Ae.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,T.jsx)("div",{className:"list-tools","data-editing":a,children:a?(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,(0,r.Z)({onClick:function(){return s(!1)},icon:(0,T.jsx)(te.Z,{})},v)),I,S]}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,(0,r.Z)({onClick:function(){return s(!0)},icon:(0,T.jsx)(Fe.Z,{})},v)),(0,T.jsx)(h.Z,{value:i,onChange:function(e){return u(e.target.value)},className:"search-input",prefix:(0,T.jsx)(Le.Z,{}),bordered:!1,allowClear:!0}),N]})})},Me=n(97892),Pe=n.n(Me),Re=n(6593),Ue=n.n(Re);Pe().extend(Ue());var ze=function(e){var t=(0,s.useState)(!1),n=(0,a.Z)(t,2),i=n[0],u=n[1],d=(0,s.useState)("LAST"),x=(0,a.Z)(d,2),p=x[0],f=x[1],m=(0,s.useState)(""),h=(0,a.Z)(m,2),Z=h[0],j=h[1],g=(0,s.useState)((0,G.l4)()),v=(0,a.Z)(g,2),N=v[0],k=v[1],b=e.setAllTags,y=e.setAllNotes,S=function(){var e=(0,o.Z)((0,l.Z)().mark((function e(t){var n,r,a;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.f_)(t);case 2:n=e.sent,r=n.tags,a=n.allNotes,y(a),b(r);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),C=e.currTagID,D=e.allNotes,E=e.allTags,A=(0,s.useMemo)((function(){var e,t;return(0,G.aV)((null!==(e=null===(t=E[C])||void 0===t?void 0:t.notes)&&void 0!==e?e:Object.keys(D)).map((function(e){return D[e]})).filter((function(e){return void 0!==e})))}),[D,E,C]),F=(0,s.useMemo)((function(){var e=function(e,t){return t-e};switch(p){case"CREATE":return A.sortBy((function(e){return e.createTime}),e);case"LAST":return A.sortBy((function(e){return e.lastTime}),e);case"NAME":return A.sortBy((function(e){return e.name.toUpperCase()}));default:return A}}),[A,p]),L=(0,s.useMemo)((function(){return F.filter((function(e){return e.name.toUpperCase().includes(Z.trim().toUpperCase())}))}),[Z,F]);return(0,s.useEffect)((function(){j(""),k((0,G.l4)())}),[A,i]),(0,T.jsxs)("div",{className:"note-list",children:[(0,T.jsxs)("header",{children:[(0,T.jsx)(ve,(0,r.Z)({},e)),(0,T.jsx)(Oe,(0,r.Z)({sortType:p,setSortType:f,editing:i,setEditing:u,searchText:Z,setSearchText:j,selectedNotes:N},e))]}),(0,T.jsx)(w,{children:(0,T.jsx)(P.Z,{component:null,children:L.map((function(t,n){var a,s=t.uid,c=N.has(s),l=null===(a=L.get(n+1))||void 0===a?void 0:a.uid,o=(l&&N.has(l))!==c;return(0,T.jsx)(R.Z,{timeout:300,children:function(n){return(0,T.jsx)(I,{className:"note-wrapper",onDelete:function(){return S(s)},disable:i,"data-last":o,"data-selected":c,children:(0,T.jsx)(He,(0,r.Z)({timgShow:/^(entered|exiting)$/.test(n),noteInfo:t,selected:c,editing:i,setSelectNotes:k},e))})}},s)}))})})]})},He=function(e){var t=e.noteInfo,n=e.selected,i=e.editing,l=e.setSelectNotes,o=e.setAllNotes,u=e.allTags,d=e.currTagID,x=e.timgShow,p=t.team,f=t.uid,m=t.name,Z=t.lastTime,j=t.tagID,v=(0,s.useMemo)((function(){return Pe()(Z).calendar()}),[Z]),N="".concat(p?"team":"reader","/").concat(f),k=(0,s.useState)(m),b=(0,a.Z)(k,2),y=b[0],S=b[1],C=(0,W.s0)(),w=u[j];return(0,T.jsxs)("div",{className:"note-item","data-selected":n,onClick:function(){if(!i)return C(N);l((function(e){return e.has(f)?e.delete(f):e.add(f)}))},children:[(0,T.jsxs)("div",{className:"left",children:[x&&(0,T.jsx)(We,{uid:f}),p&&(0,T.jsx)(U.Z,{className:"cloud-icon"}),(0,T.jsx)(z.Z,{className:"checked-icon"})]}),(0,T.jsxs)("div",{className:"content",children:[i&&!n?(0,T.jsx)(h.Z,{className:"name-input",value:y,onChange:function(e){return S(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=y.trim();if(!e||e===m)return S(m);(0,c.SP)(f,{name:e}),o((function(n){return(0,r.Z)((0,r.Z)({},n),{},(0,M.Z)({},f,(0,r.Z)((0,r.Z)({},t),{},{name:e})))}))}}):(0,T.jsx)("p",{className:"name",children:m}),(0,T.jsxs)("p",{className:"info",children:[(0,T.jsx)("span",{className:"date",children:v}),w&&"DEFAULT"===d&&(0,T.jsx)("span",{className:"tag",style:(0,g.MW)(w.color),children:w.name})]})]})]})},Be=s.lazy((function(){return Promise.all([n.e(854),n.e(734),n.e(560)]).then(n.bind(n,97934))})),We=function(e){var t,n=e.uid,r=(0,s.useState)(),i=(0,a.Z)(r,2),l=i[0],o=i[1],u=(0,s.useState)(),d=(0,a.Z)(u,2),x=d[0],p=d[1];(0,s.useEffect)((function(){(0,c.U9)(n).then(o),(0,K.ox)(n).then(p)}),[n]);var f=null!==(t=null===l||void 0===l?void 0:l.pageOrder[0])&&void 0!==t?t:"",m=null===l||void 0===l?void 0:l.pageRec[f],h=(0,s.useMemo)((function(){if(m){var e=m.state,t=m.ratio;return B.Dw.loadFromFlat(e,t)}}),[m]),Z=(0,s.useMemo)((function(){if(x&&f)return _.f.createFromTeamPages(x).getOnePageStateMap(f)}),[x,f]);if(!m||!h)return null;var j=m.ratio,g=m.image;return(0,T.jsx)("div",{className:"timg-wrapper","data-landscape":j<1,children:(0,T.jsx)(s.Suspense,{fallback:(0,T.jsx)(H.Z,{style:{opacity:.5}}),children:(0,T.jsx)(Be,{drawState:h,teamStateMap:Z,thumbnail:g,preview:!0})})})};function Ge(){return(Ge=(0,o.Z)((0,l.Z)().mark((function e(){var t,r,a,s,i;return(0,l.Z)().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(t="INTRO_CREATED",!localStorage.getItem(t)){e.next=3;break}return e.abrupt("return");case 3:if((r=(0,Y.Xn)()).name="Welcome to Multibility!",a=Object.values(r.pageRec)[0]){e.next=8;break}return e.abrupt("return");case 8:return e.next=10,n.e(925).then(n.t.bind(n,43925,17));case 10:return s=e.sent,i=s.default,a.state=JSON.parse(i),localStorage.setItem(t,"CREATED"),e.next=16,(0,c.au)(r);case 16:return e.abrupt("return",e.sent);case 17:case"end":return e.stop()}}),e)})))).apply(this,arguments)}function Ke(){var e=(0,s.useState)({}),t=(0,a.Z)(e,2),n=t[0],l=t[1],o=(0,s.useState)({}),u=(0,a.Z)(o,2),d=u[0],x=u[1],p=(0,s.useState)("DEFAULT"),f=(0,a.Z)(p,2),m=f[0],h=f[1];(0,s.useEffect)((function(){(0,c.hY)().then(l),(0,c.Ys)().then(x),document.title="Multibility"}),[]),(0,s.useEffect)((function(){(function(){return Ge.apply(this,arguments)})().then((function(e){if(e){var t=e.tags,n=e.allNotes;x(t),l(n)}}))}),[]);var Z={allNotes:n,allTags:d,setAllNotes:l,setAllTags:x,currTagID:m,setCurrTagID:h};return(0,T.jsx)("div",{className:"main-menu container",children:(0,T.jsxs)(i.kV,{children:[(0,T.jsx)(O,(0,r.Z)({},Z)),(0,T.jsx)(ze,(0,r.Z)({},Z))]})})}}}]);
//# sourceMappingURL=137.ac2eb1ba.chunk.js.map