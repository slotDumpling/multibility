"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[442],{72058:function(e,t,n){n.d(t,{eG:function(){return f},mp:function(){return u},pW:function(){return d}});var r=n(37762),a=n(93433),s=n(15861),c=n(87757),i=n.n(c),l=n(61842),o=n.n(l)().createInstance({name:"imageForage"}),u=function(){var e=(0,s.Z)(i().mark((function e(t,n){var r,s,c;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=r=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==r;case 6:if(!e.t0){e.next=10;break}e.t2=r,e.next=11;break;case 10:e.t2=[];case 11:if(s=e.t2,c="".concat(t,"_").concat(n),s.includes(c)){e.next=15;break}return e.abrupt("return");case 15:return s=[c].concat((0,a.Z)(s.filter((function(e){return e!==c})))),e.next=18,o.setItem("LIST",s);case 18:return e.next=20,o.getItem(c);case 20:return e.abrupt("return",e.sent);case 21:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),d=function(){var e=(0,s.Z)(i().mark((function e(t,n,r){var s,c,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=s=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==s;case 6:if(!e.t0){e.next=10;break}e.t2=s,e.next=11;break;case 10:e.t2=[];case 11:return c=e.t2,l="".concat(t,"_").concat(n),(c=[l].concat((0,a.Z)(c.filter((function(e){return e!==l}))))).length>10&&(c=c.slice(0,10)),e.next=17,o.setItem("LIST",c);case 17:return e.next=19,o.setItem(l,r);case 19:x();case 20:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),x=function(){var e=(0,s.Z)(i().mark((function e(){var t,n,a,s,c,l,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=t=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==t;case 6:if(!e.t0){e.next=10;break}e.t2=t,e.next=11;break;case 10:e.t2=[];case 11:return n=e.t2,a=new Set(n),e.next=15,o.keys();case 15:s=e.sent,c=(0,r.Z)(s),e.prev=17,c.s();case 19:if((l=c.n()).done){e.next=28;break}if("LIST"!==(u=l.value)){e.next=23;break}return e.abrupt("continue",26);case 23:if(a.has(u)){e.next=26;break}return e.next=26,o.removeItem(u);case 26:e.next=19;break;case 28:e.next=33;break;case 30:e.prev=30,e.t3=e.catch(17),c.e(e.t3);case 33:return e.prev=33,c.f(),e.finish(33);case 36:case"end":return e.stop()}}),e,null,[[17,30,33,36]])})));return function(){return e.apply(this,arguments)}}(),f=function(){return o.clear()}},40256:function(e,t,n){n.r(t),n.d(t,{default:function(){return Ke}});var r=n(1413),a=n(29439),s=n(72791),c=n(75783),i=n(52365),l=n(15861),o=n(87757),u=n.n(o),d=n(92414),x=n(82622),f=n(93309),p=n(96324),m=n(79286),h=n(86330),j=n(20662),Z=n(87309),v=n(96038),g=n(74115),k=n(13892),N=n(81694),y=n.n(N),b=n(49030),T=n(80184),w=(0,s.createContext)(["",function(){}]),C=function(e){var t=e.children,n=(0,s.useState)("");return(0,T.jsx)(w.Provider,{value:n,children:t})},S=function(e){var t=e.children,n=e.onDelete,c=e.disable,o=void 0!==c&&c,d=e.className,x=(0,s.useState)(b.Z),f=(0,a.Z)(x,1)[0],p=(0,s.useContext)(w),m=(0,a.Z)(p,2),h=m[0],j=m[1],Z=(0,s.useState)(!1),v=(0,a.Z)(Z,2),g=v[0],N=v[1],C=g&&(!h||h===f),S=(0,s.useState)(!1),I=(0,a.Z)(S,2),D=I[0],E=I[1],A=(0,s.useState)(),F=(0,a.Z)(A,2),L=F[0],P=F[1],M=(0,s.useRef)(null);(0,s.useEffect)((function(){h!==f&&N(!1)}),[h,f]);var O=(0,k.QS)({onSwipedLeft:function(){var e;N(!0),j(f),P(null===(e=M.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){N(!1),j(""),P(void 0)},trackTouch:!o});(0,s.useEffect)((function(){o&&(P(void 0),j(""),N(!1))}),[o,j]);var U=(0,i.mf)({propertyName:"height",active:D}),R=(0,a.Z)(U,2),z=R[0],B=R[1],H=function(){var e=(0,l.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return E(!0),e.next=3,z;case 3:n(),j("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,T.jsxs)("div",(0,r.Z)((0,r.Z)({className:y()("swipe-wrapper",d),"data-deleted":D,"data-deleting":C},O),{},{style:{height:L},onTransitionEnd:B,children:[(0,T.jsx)("div",{className:"content",ref:M,children:t}),(0,T.jsx)("div",{className:"button",onClick:H,style:{height:L},children:"Delete"})]}))},I=n(35873),D=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,T.jsx)(h.Z,{value:r,onSelect:a,listHeight:150,virtual:!1,children:g.O9.map((function(e){return(0,T.jsx)(h.Z.Option,{value:e,children:(0,T.jsx)(I.W,{className:"tag-circle",color:e})},e)}))});return(0,T.jsx)(j.Z,{placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},E=function(e){var t=e.noteTag,n=e.currTagID,i=e.setAllTags,o=e.setCurrTagID,f=t.uid,p=t.color,m=t.name,h=t.notes,j=(0,s.useState)(m),k=(0,a.Z)(j,2),N=k[0],y=k[1],b=(0,s.useState)(p),w=(0,a.Z)(b,2),C=w[0],E=w[1],A=(0,s.useState)(!1),F=(0,a.Z)(A,2),L=F[0],P=F[1],M=n===f;function O(){return U.apply(this,arguments)}function U(){return(U=(0,l.Z)(u().mark((function e(){var t;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.Pn)(f);case 2:t=e.sent,o("DEFAULT"),i(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,s.useEffect)((function(){return P(!1)}),[M]);var R=function(){var e=(0,l.Z)(u().mark((function e(){var n,a;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,r.Z)((0,r.Z)({},t),{},{name:N,color:C}),e.next=3,(0,c.tk)(n);case 3:a=e.sent,i(a),P(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),z=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(I.W,{className:"tag-circle",color:C}),(0,T.jsx)("span",{className:"tag-name",children:N}),M?(0,T.jsx)(Z.Z,{size:"small",type:"text",onClick:function(){return P(!0)},icon:(0,T.jsx)(d.Z,{})}):(0,T.jsx)("span",{className:"tag-num",children:h.length})]}),B=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(D,{tagName:N,setTagName:y,tagColor:C,setTagColor:E}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(v.Z,{title:"This tag will be deleted.",onConfirm:O,placement:"left",cancelText:"Cancel",icon:(0,T.jsx)(x.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(Z.Z,{danger:!0,children:"Delete"})}),(0,T.jsx)(Z.Z,{onClick:function(){y(m),E(p),P(!1)},children:"Cancel"}),(0,T.jsx)(Z.Z,{type:"primary",disabled:!N,onClick:R,children:"OK"})]})]});return(0,T.jsx)(S,{className:"tag-wrapper",onDelete:O,disable:L,children:(0,T.jsx)("div",{className:"tag-item","data-curr":M,"data-editing":L,onClick:function(){return o(f)},style:(0,g.MW)(p),children:L?B:z})})},A=function(e){var t=e.setAdding,n=e.setAllTags,r=(0,s.useState)(""),i=(0,a.Z)(r,2),l=i[0],o=i[1],u=(0,s.useState)((0,g.mr)()),d=(0,a.Z)(u,2),x=d[0],f=d[1];return(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-curr":!0,"data-editing":!0,children:[(0,T.jsx)(D,{tagName:l,setTagName:o,tagColor:x,setTagColor:f}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(Z.Z,{onClick:function(){return t(!1)},children:"Cancel"}),(0,T.jsx)(Z.Z,{type:"primary",disabled:!l,onClick:function(){var e=l.trim();e&&((0,c.HO)(e,x).then(n),t(!1))},children:"OK"})]})]})})},F=function(e){var t=e.allTags,n=e.currTagID,c=e.allNotes,l=e.setCurrTagID,o=(0,s.useState)(!1),u=(0,a.Z)(o,2),d=u[0],x=u[1],h=(0,i.LH)(),j=(0,a.Z)(h,2),v=j[0],g=j[1],k=(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-curr":"DEFAULT"===n,onClick:function(){return l("DEFAULT")},children:[(0,T.jsx)(f.Z,{className:"all-note-icon"}),(0,T.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,T.jsx)("span",{className:"tag-num",children:Object.keys(c).length})]})}),N=(0,T.jsxs)("header",{children:[(0,T.jsx)(Z.Z,{className:"aside-btn",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return g(!1)}}),(0,T.jsx)("h2",{className:"logo",children:"Multibility"}),(0,T.jsx)(Z.Z,{className:"new-tag-btn",type:"text",icon:(0,T.jsx)(m.Z,{}),onClick:function(){return x(!0)},disabled:d})]});return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("aside",{className:"side-menu","data-open":v,children:[N,(0,T.jsxs)("div",{className:"tag-list",children:[k,(0,T.jsx)(C,{children:Object.values(t).map((function(t){return(0,T.jsx)(E,(0,r.Z)({noteTag:t},e),t.uid)}))}),d&&(0,T.jsx)(A,(0,r.Z)({setAdding:x},e))]})]}),(0,T.jsx)("div",{className:"aside-mask",onClick:function(){return g(!1)},"data-open":v})]})},L=n(4942),P=n(45987),M=n(75660),O=n(89295),U=n(96989),R=n(37557),z=n(82670),B=n(16871),H=n(24124),W=n(51570),G=n(79856),K=n(69228),_=n(30501),V=n(56200),Y=n(92198),J=n(67415),Q=n(50419),X=n(28817),q=n(70140),$=n(99372),ee=n(66776),te=n(29529),ne=n(14057),re=n(12056),ae=n(99660),se=n(61753),ce=n(82305),ie=n(69951),le=n(72058),oe=n(61842),ue=n.n(oe),de=["children","title","keyName"],xe=function(e){var t=e.children,n=e.title,s=e.keyName,c=(0,P.Z)(e,de),l=(0,i.zI)(),o=(0,a.Z)(l,2),u=o[0],d=o[1];return(0,T.jsx)(O.Z,(0,r.Z)((0,r.Z)({in:u===s},c),{},{children:(0,T.jsxs)("div",{className:"secondary",children:[(0,T.jsxs)("nav",{children:[(0,T.jsx)(Z.Z,{type:"text",shape:"circle",onClick:function(){return d("MENU")},icon:(0,T.jsx)($.Z,{})}),(0,T.jsx)("h3",{children:n})]}),t]})}))},fe=function(e){var t=e.currTagID,r=e.setAllTags,i=e.setAllNotes,o=(0,s.useState)(!1),d=(0,a.Z)(o,2),x=d[0],f=d[1],p=(0,s.useState)(0),m=(0,a.Z)(p,2),h=m[0],j=m[1];function Z(){return(Z=(0,l.Z)(u().mark((function e(a){var s,l,o,d,x,p;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===a.type){e.next=2;break}return e.abrupt("return");case 2:return f(!0),e.next=5,Promise.all([n.e(643),n.e(61)]).then(n.bind(n,21176));case 5:return s=e.sent,l=s.LoadPDF,e.next=9,l(a,j);case 9:return(o=e.sent).tagID=t,e.next=13,(0,c.au)(o);case 13:return d=e.sent,x=d.tags,p=d.allNotes,r(x),i(p),f(!1),Q.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)("label",{children:[(0,T.jsxs)("div",{className:"pdf-upload",children:[(0,T.jsx)("div",{className:"icon-wrapper",children:x?(0,T.jsx)(X.Z,{width:48,type:"circle",percent:h}):(0,T.jsx)(ee.Z,{className:"inbox-icon"})}),(0,T.jsx)("p",{className:"hint",children:"Click to upload a pdf file."})]}),(0,T.jsx)("input",{type:"file",multiple:!1,accept:".pdf",onChange:function(e){var t=e.target.files,n=t&&t[0];n&&function(e){Z.apply(this,arguments)}(n)}})]})},pe=function(){var e=(0,i.zI)(),t=(0,a.Z)(e,2)[1],n=(0,ie.vW)(),r=(0,s.useState)(n),c=(0,a.Z)(r,2),l=c[0],o=c[1];return(0,T.jsxs)("div",{className:"profile-page",children:[(0,T.jsx)(j.Z,{value:l,onChange:function(e){return o(e.target.value)},prefix:(0,T.jsx)(te.Z,{}),allowClear:!0}),(0,T.jsx)(Z.Z,{disabled:n===l||!l,onClick:function(){l&&((0,ie.lu)(l),t("MENU"))},type:"primary",block:!0,children:"OK"})]})},me=function(){var e=function(){var e=(0,l.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ue().clear();case 2:return e.next=4,(0,le.eG)();case 4:window.location.reload();case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),t=function(){var e=(0,l.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ce.E();case 2:window.location.reload();case 3:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,T.jsxs)("div",{className:"setting-menu",children:[(0,T.jsx)(Z.Z,{icon:(0,T.jsx)(ne.Z,{}),onClick:t,block:!0,children:"Update"}),(0,T.jsx)(v.Z,{title:"Everything will be deleted.",onConfirm:e,icon:(0,T.jsx)(re.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,T.jsx)(Z.Z,{icon:(0,T.jsx)(re.Z,{}),danger:!0,block:!0,children:"Clear all"})})]})},he=[{key:"PDF",label:"Import PDF",icon:(0,T.jsx)(ae.Z,{})},{key:"PROFILE",label:"My profile",icon:(0,T.jsx)(te.Z,{})},{key:"SETTINGS",label:"Settings",icon:(0,T.jsx)(d.Z,{})}],je=function(){var e=(0,i.zI)(),t=(0,a.Z)(e,2)[1];return(0,T.jsx)("div",{className:"primary-menu",children:(0,T.jsx)(q.Z,{onClick:function(e){var n=e.key;return t(n)},items:he})})},Ze=function(e){var t=(0,s.useState)(0),n=(0,a.Z)(t,2),c=n[0],l=n[1],o=(0,i.zI)(),u=(0,a.Z)(o,2),d=u[0],x=u[1],f={timeout:300,onEnter:function(e){l(e.clientHeight)},unmountOnExit:!0};(0,s.useEffect)((function(){return x("MENU")}),[x]);var p={PDF:(0,T.jsx)(fe,(0,r.Z)({},e)),PROFILE:(0,T.jsx)(pe,{}),SETTINGS:(0,T.jsx)(me,{})};return(0,T.jsxs)("section",{className:"others-menu",style:{height:c},children:[(0,T.jsx)(O.Z,(0,r.Z)((0,r.Z)({in:"MENU"===d},f),{},{children:(0,T.jsx)(je,{})})),he.map((function(e){var t=e.key,n=e.label;return(0,T.jsx)(xe,(0,r.Z)((0,r.Z)({keyName:t,title:n},f),{},{children:p[t]}),t)}))]})},ve=function(e){return(0,T.jsxs)(K.Z,{placement:"bottomRight",trigger:"click",content:(0,T.jsx)(i.s2,{initKey:"",children:(0,T.jsx)(Ze,(0,r.Z)({},e))}),zIndex:900,children:[(0,T.jsx)(Z.Z,{className:"small",type:"text",icon:(0,T.jsx)(se.Z,{})}),(0,T.jsx)(Z.Z,{className:"large",shape:"circle",icon:(0,T.jsx)(se.Z,{})})]})},ge=function(e){return(0,T.jsxs)("nav",{children:[(0,T.jsx)(ke,(0,r.Z)({},e)),(0,T.jsx)(Ne,(0,r.Z)({},e))]})},ke=function(e){var t,n,r=e.allTags,s=e.currTagID,c=(0,i.LH)(),l=(0,a.Z)(c,2)[1],o=null!==(t=null===(n=r[s])||void 0===n?void 0:n.name)&&void 0!==t?t:"All notes";return(0,T.jsxs)("div",{className:"nav-left",children:[(0,T.jsx)(Z.Z,{className:"aside-btn small",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return l(!0)}}),(0,T.jsx)("h2",{children:(0,T.jsx)("b",{children:o})})]})},Ne=function(e){return(0,T.jsxs)("div",{className:"nav-right",children:[(0,T.jsx)(ye,(0,r.Z)({},e)),(0,T.jsx)(be,{}),(0,T.jsx)(ve,(0,r.Z)({},e))]})},ye=function(e){var t=e.currTagID,n=e.setAllTags,r=e.setAllNotes;function a(){return s.apply(this,arguments)}function s(){return(s=(0,l.Z)(u().mark((function e(){var a,s,i,l;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(a=(0,Y.Xn)()).tagID=t,e.next=4,(0,c.au)(a);case 4:s=e.sent,i=s.tags,l=s.allNotes,n(i),r(l);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,{className:"new-note large",type:"primary",shape:"round",onClick:a,icon:(0,T.jsx)(_.Z,{}),children:"New"}),(0,T.jsx)(Z.Z,{className:"new-note small",type:"link",onClick:a,icon:(0,T.jsx)(_.Z,{})})]})},be=function(){var e=(0,s.useState)(""),t=(0,a.Z)(e,2),n=t[0],r=t[1],c=(0,s.useState)(!1),i=(0,a.Z)(c,2),o=i[0],d=i[1],x=(0,B.s0)();function f(){return(f=(0,l.Z)(u().mark((function e(t){var n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,W.fI)(t);case 2:if(!(n=e.sent)){e.next=5;break}return e.abrupt("return",x("/team/".concat(n)));case 5:r(""),d(!0);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)(K.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,onVisibleChange:function(){return d(!1)},content:(0,T.jsx)(J.GD,{plain:!0,length:4,error:o,value:n,onChange:function(e){d(!1),r(e)},onFill:function(e){return f.apply(this,arguments)}}),children:[(0,T.jsx)(Z.Z,{className:"team-btn large",shape:"round",icon:(0,T.jsx)(V.Z,{}),children:"Team"}),(0,T.jsx)(Z.Z,{className:"team-btn small",type:"text",icon:(0,T.jsx)(V.Z,{})})]})},Te=n(93433),we=n(37762),Ce=n(37382),Se=n(68692),Ie=n(13876),De=n(20054),Ee=n(9486),Ae=n(1194),Fe=n(74270),Le=n(11730),Pe=function(e){var t=e.sortType,n=e.setSortType,a=e.editing,s=e.setEditing,i=e.searchText,o=e.setSearchText,d=e.selectedNotes,f=e.setAllNotes,p=e.setAllTags,m=e.allTags,h=(0,T.jsx)(q.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],items:[{type:"group",label:"Sort by",className:"sort-drop",children:[{icon:(0,T.jsx)(Se.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,T.jsx)(Ie.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,T.jsx)(De.Z,{}),key:"NAME",label:"Name"}]}]}),g={type:"text",shape:"circle"},k=(0,T.jsx)(Ce.Z,{overlay:h,trigger:["click"],placement:"bottomRight",children:(0,T.jsx)(Z.Z,(0,r.Z)({className:"sort-btn",icon:(0,T.jsx)(Ee.Z,{rotate:90})},g))}),N=0===d.size,y=function(){var e=(0,l.Z)(u().mark((function e(){var t,n,r,a,s,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:r=(0,we.Z)(d.toArray()),e.prev=1,r.s();case 3:if((a=r.n()).done){e.next=12;break}return s=a.value,e.next=7,(0,c.f_)(s);case 7:i=e.sent,t=i.tags,n=i.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),r.e(e.t0);case 17:return e.prev=17,r.f(),e.finish(17);case 20:t&&p(t),n&&f(n);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(){return e.apply(this,arguments)}}(),b=function(){var e=(0,l.Z)(u().mark((function e(t){var n,r,a,s,i,l;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,we.Z)(d.toArray()),e.prev=1,a.s();case 3:if((s=a.n()).done){e.next=12;break}return i=s.value,e.next=7,(0,c.tw)(i,t);case 7:l=e.sent,n=l.tags,r=l.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&p(n),r&&f(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),w=(0,T.jsx)(v.Z,{title:"Notes will be deleted.",onConfirm:y,icon:(0,T.jsx)(x.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:N,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(Z.Z,{className:"del-btn",shape:"round",type:"text",disabled:N,danger:!N,icon:(0,T.jsx)(x.Z,{}),children:"Delete"})}),C=function(e){var t=e.color,n=e.name;return(0,T.jsxs)("div",{className:"tag-select",children:[(0,T.jsx)(I.W,{color:t,className:"tag-circle"}),(0,T.jsx)("span",{className:"name",children:n})]})},S=(0,T.jsx)(q.Z,{onClick:function(e){var t=e.key;return b(t)},items:[{key:"DEFAULT",label:(0,T.jsx)(C,{color:"#eee",name:"No tag"})}].concat((0,Te.Z)(Object.values(m).map((function(e){return{key:e.uid,label:(0,T.jsx)(C,{color:e.color,name:e.name})}}))))}),D=(0,T.jsx)(Ce.Z,{overlayClassName:"tag-drop",disabled:N,overlay:S,trigger:["click"],placement:"bottom",children:(0,T.jsx)(Z.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,T.jsx)(Ae.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,T.jsx)("div",{className:"list-tools","data-editing":a,children:a?(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,(0,r.Z)({onClick:function(){return s(!1)},icon:(0,T.jsx)($.Z,{})},g)),D,w]}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(Z.Z,(0,r.Z)({onClick:function(){return s(!0)},icon:(0,T.jsx)(Fe.Z,{})},g)),(0,T.jsx)(j.Z,{value:i,onChange:function(e){return o(e.target.value)},className:"search-input",prefix:(0,T.jsx)(Le.Z,{}),bordered:!1,allowClear:!0}),k]})})},Me=n(97892),Oe=n.n(Me),Ue=n(6593),Re=n.n(Ue),ze=["noteInfo","selected","editing","setSelectNotes"];Oe().extend(Re());var Be=function(e){var t=(0,s.useState)(!1),n=(0,a.Z)(t,2),i=n[0],o=n[1],d=(0,s.useState)("LAST"),x=(0,a.Z)(d,2),f=x[0],p=x[1],m=(0,s.useState)(""),h=(0,a.Z)(m,2),j=h[0],Z=h[1],v=(0,s.useState)((0,H.l4)()),g=(0,a.Z)(v,2),k=g[0],N=g[1],b=e.setAllTags,w=e.setAllNotes,I=function(){var e=(0,l.Z)(u().mark((function e(t){var n,r,a;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.f_)(t);case 2:n=e.sent,r=n.tags,a=n.allNotes,w(a),b(r);case 7:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),D=e.currTagID,E=e.allNotes,A=e.allTags,F=(0,s.useMemo)((function(){var e,t;return(0,H.aV)((null!==(e=null===(t=A[D])||void 0===t?void 0:t.notes)&&void 0!==e?e:Object.keys(E)).map((function(e){return E[e]})).filter((function(e){return void 0!==e})))}),[E,A,D]),L=(0,s.useMemo)((function(){var e=function(e,t){return t-e};switch(f){case"CREATE":return F.sortBy((function(e){return e.createTime}),e);case"LAST":return F.sortBy((function(e){return e.lastTime}),e);case"NAME":return F.sortBy((function(e){return e.name.toUpperCase()}));default:return F}}),[F,f]),P=(0,s.useMemo)((function(){return L.filter((function(e){return e.name.toUpperCase().includes(j.trim().toUpperCase())}))}),[j,L]);return(0,s.useEffect)((function(){Z(""),N((0,H.l4)())}),[F,i]),(0,T.jsx)(C,{children:(0,T.jsxs)("div",{className:"note-list",children:[(0,T.jsxs)("header",{children:[(0,T.jsx)(ge,(0,r.Z)({},e)),(0,T.jsx)(Pe,(0,r.Z)({sortType:f,setSortType:p,editing:i,setEditing:o,searchText:j,setSearchText:Z,selectedNotes:k},e))]}),(0,T.jsx)(M.Z,{component:null,children:P.map((function(t,n){var a,s=t.uid,c=k.has(s),l=null===(a=P.get(n+1))||void 0===a?void 0:a.uid,o=(l&&k.has(l))!==c;return(0,T.jsx)(O.Z,{timeout:300,children:(0,T.jsx)(S,{className:y()("note-wrapper",{selected:c,last:o}),onDelete:function(){return I(s)},disable:i,children:(0,T.jsx)(He,(0,r.Z)({noteInfo:t,selected:c,editing:i,setSelectNotes:N},e))})},s)}))})]})})},He=function(e){var t=e.noteInfo,n=e.selected,i=e.editing,l=e.setSelectNotes,o=(0,P.Z)(e,ze),u=t.team,d=t.uid,x=t.name,f=t.lastTime,p=t.tagID,m=(0,s.useMemo)((function(){return Oe()(f).calendar()}),[f]),h="".concat(u?"team":"reader","/").concat(d),Z=o.setAllNotes,v=(0,s.useState)(x),k=(0,a.Z)(v,2),N=k[0],y=k[1],b=(0,B.s0)(),w=o.allTags,C=o.currTagID,S=w[p];return(0,T.jsxs)("div",{className:"note-item","data-selected":n,onClick:function(){if(!i)return b(h);l((function(e){return e.has(d)?e.delete(d):e.add(d)}))},children:[(0,T.jsx)(Ge,{uid:d,team:u}),(0,T.jsxs)("div",{className:"content",children:[i&&!n?(0,T.jsx)(j.Z,{className:"name-input",value:N,onChange:function(e){return y(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=N.trim();if(!e||e===x)return y(x);(0,c.SP)(d,{name:e}),Z((function(n){return(0,r.Z)((0,r.Z)({},n),{},(0,L.Z)({},d,(0,r.Z)((0,r.Z)({},t),{},{name:e})))}))}}):(0,T.jsx)("p",{className:"name",children:x}),(0,T.jsxs)("p",{className:"info",children:[(0,T.jsx)("span",{className:"date",children:m}),S&&"DEFAULT"===C&&(0,T.jsx)("span",{className:"tag",style:(0,g.MW)(S.color),children:S.name})]})]})]})},We=s.lazy((function(){return Promise.all([n.e(101),n.e(857),n.e(479)]).then(n.bind(n,96801))})),Ge=function(e){var t,n=e.uid,r=e.team,i=(0,s.useState)(),o=(0,a.Z)(i,2),d=o[0],x=o[1],f=(0,s.useMemo)((function(){if(d){var e=d.state,t=d.ratio;return z.Dw.loadFromFlat(e,t)}}),[d]),p=(0,s.useState)(),m=(0,a.Z)(p,2),h=m[0],j=m[1];return(0,s.useEffect)((function(){(0,l.Z)(u().mark((function e(){var t,r,a,s,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,c.U9)(n);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:if(r=t.pageRec,a=t.pageOrder,s=a[0]){e.next=9;break}return e.abrupt("return");case 9:return x(r[s]),e.next=12,(0,W.yf)(n);case 12:if(i=e.sent){e.next=15;break}return e.abrupt("return");case 15:j(G.f.createFromTeamPages(i).getOnePageStateMap(s));case 16:case"end":return e.stop()}}),e)})))()}),[n]),(0,T.jsxs)("div",{className:"timg-wrapper","data-landscape":(null!==(t=null===d||void 0===d?void 0:d.ratio)&&void 0!==t?t:1.5)<1,children:[d&&f&&(0,T.jsx)(s.Suspense,{fallback:null,children:(0,T.jsx)(We,{drawState:f,teamStateMap:h,thumbnail:d.image,preview:!0})}),r&&(0,T.jsx)(U.Z,{className:"cloud-icon"}),(0,T.jsx)(R.Z,{className:"checked-icon"})]})};function Ke(){var e=(0,s.useState)({}),t=(0,a.Z)(e,2),n=t[0],l=t[1],o=(0,s.useState)({}),u=(0,a.Z)(o,2),d=u[0],x=u[1],f=(0,s.useState)("DEFAULT"),p=(0,a.Z)(f,2),m=p[0],h=p[1];(0,s.useEffect)((function(){(0,c.hY)().then(l),(0,c.Ys)().then(x),document.title="Multibility"}),[]);var j={allNotes:n,allTags:d,setAllNotes:l,setAllTags:x,currTagID:m,setCurrTagID:h};return(0,T.jsx)("div",{className:"main-menu container",children:(0,T.jsxs)(i.kV,{children:[(0,T.jsx)(F,(0,r.Z)({},j)),(0,T.jsx)(Be,(0,r.Z)({},j))]})})}}}]);
//# sourceMappingURL=442.f9ee70f9.chunk.js.map