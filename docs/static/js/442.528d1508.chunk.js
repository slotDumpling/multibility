"use strict";(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[442],{72058:function(e,t,n){n.d(t,{eG:function(){return f},mp:function(){return u},pW:function(){return d}});var r=n(37762),a=n(93433),s=n(15861),c=n(87757),i=n.n(c),l=n(61842),o=n.n(l)().createInstance({name:"imageForage"}),u=function(){var e=(0,s.Z)(i().mark((function e(t,n){var r,s,c;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=r=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==r;case 6:if(!e.t0){e.next=10;break}e.t2=r,e.next=11;break;case 10:e.t2=[];case 11:if(s=e.t2,c="".concat(t,"_").concat(n),s.includes(c)){e.next=15;break}return e.abrupt("return");case 15:return s=[c].concat((0,a.Z)(s.filter((function(e){return e!==c})))),e.next=18,o.setItem("LIST",s);case 18:return e.next=20,o.getItem(c);case 20:return e.abrupt("return",e.sent);case 21:case"end":return e.stop()}}),e)})));return function(t,n){return e.apply(this,arguments)}}(),d=function(){var e=(0,s.Z)(i().mark((function e(t,n,r){var s,c,l;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=s=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==s;case 6:if(!e.t0){e.next=10;break}e.t2=s,e.next=11;break;case 10:e.t2=[];case 11:return c=e.t2,l="".concat(t,"_").concat(n),(c=[l].concat((0,a.Z)(c.filter((function(e){return e!==l}))))).length>10&&(c=c.slice(0,10)),e.next=17,o.setItem("LIST",c);case 17:return e.next=19,o.setItem(l,r);case 19:x();case 20:case"end":return e.stop()}}),e)})));return function(t,n,r){return e.apply(this,arguments)}}(),x=function(){var e=(0,s.Z)(i().mark((function e(){var t,n,a,s,c,l,u;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.getItem("LIST");case 2:if(e.t1=t=e.sent,e.t0=null!==e.t1,!e.t0){e.next=6;break}e.t0=void 0!==t;case 6:if(!e.t0){e.next=10;break}e.t2=t,e.next=11;break;case 10:e.t2=[];case 11:return n=e.t2,a=new Set(n),e.next=15,o.keys();case 15:s=e.sent,c=(0,r.Z)(s),e.prev=17,c.s();case 19:if((l=c.n()).done){e.next=28;break}if("LIST"!==(u=l.value)){e.next=23;break}return e.abrupt("continue",26);case 23:if(a.has(u)){e.next=26;break}return e.next=26,o.removeItem(u);case 26:e.next=19;break;case 28:e.next=33;break;case 30:e.prev=30,e.t3=e.catch(17),c.e(e.t3);case 33:return e.prev=33,c.f(),e.finish(33);case 36:case"end":return e.stop()}}),e,null,[[17,30,33,36]])})));return function(){return e.apply(this,arguments)}}(),f=function(){return o.clear()}},40256:function(e,t,n){n.r(t),n.d(t,{default:function(){return Ve}});var r=n(29439),a=n(72791),s=n(75783),c=n(52365),i=n(1413),l=n(15861),o=n(87757),u=n.n(o),d=n(92414),x=n(82622),f=n(93309),p=n(96324),m=n(79286),h=n(86330),j=n(20662),v=n(87309),g=n(96038),Z=n(74115),k=n(13892),N=n(81694),b=n.n(N),y=n(24610),T=n(80184),C=(0,a.createContext)(["",function(){}]),w=function(e){var t=e.children,n=(0,a.useState)("");return(0,T.jsx)(C.Provider,{value:n,children:t})},S=function(e){var t=e.children,n=e.onDelete,s=e.disable,o=void 0!==s&&s,d=e.className,x=(0,a.useState)(y.v4),f=(0,r.Z)(x,1)[0],p=(0,a.useContext)(C),m=(0,r.Z)(p,2),h=m[0],j=m[1],v=(0,a.useState)(!1),g=(0,r.Z)(v,2),Z=g[0],N=g[1],w=Z&&(!h||h===f),S=(0,a.useState)(!1),I=(0,r.Z)(S,2),D=I[0],A=I[1],E=(0,a.useState)(),L=(0,r.Z)(E,2),F=L[0],M=L[1],P=(0,a.useRef)(null);(0,a.useEffect)((function(){h!==f&&N(!1)}),[h,f]);var U=(0,k.QS)({onSwipedLeft:function(){var e;N(!0),j(f),M(null===(e=P.current)||void 0===e?void 0:e.clientHeight)},onSwipedRight:function(){N(!1),j(""),M(void 0)},trackTouch:!o});(0,a.useEffect)((function(){o&&(M(void 0),j(""),N(!1))}),[o,j]);var O=(0,c.mf)({propertyName:"height",active:D}),R=(0,r.Z)(O,2),z=R[0],B=R[1],H=function(){var e=(0,l.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return A(!0),e.next=3,z;case 3:n(),j("");case 5:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}();return(0,T.jsxs)("div",(0,i.Z)((0,i.Z)({className:b()("swipe-wrapper",d),"data-deleted":D,"data-deleting":w},U),{},{style:{height:F},onTransitionEnd:B,children:[(0,T.jsx)("div",{className:"content",ref:P,children:t}),(0,T.jsx)("div",{className:"button",onClick:H,style:{height:F},children:"Delete"})]}))},I=n(35873),D=function(e){var t=e.tagName,n=e.setTagName,r=e.tagColor,a=e.setTagColor,s=(0,T.jsx)(h.Z,{value:r,onSelect:a,listHeight:150,virtual:!1,children:Z.O9.map((function(e){return(0,T.jsx)(h.Z.Option,{value:e,children:(0,T.jsx)(I.W,{className:"tag-circle",color:e})},e)}))});return(0,T.jsx)(j.Z,{placeholder:"Tag name...",className:"tag-name-input",addonBefore:s,value:t,onChange:function(e){return n(e.target.value)}})},A=function(e){var t=e.noteTag,n=t.uid,c=t.color,o=t.name,f=t.notes,p=(0,a.useContext)(Ge),m=p.currTagID,h=p.setAllTags,j=p.setCurrTagID,k=(0,a.useState)(o),N=(0,r.Z)(k,2),b=N[0],y=N[1],C=(0,a.useState)(c),w=(0,r.Z)(C,2),A=w[0],E=w[1],L=(0,a.useState)(!1),F=(0,r.Z)(L,2),M=F[0],P=F[1],U=m===n;function O(){return R.apply(this,arguments)}function R(){return(R=(0,l.Z)(u().mark((function e(){var t;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,s.Pn)(n);case 2:t=e.sent,j("DEFAULT"),h(t);case 5:case"end":return e.stop()}}),e)})))).apply(this,arguments)}(0,a.useEffect)((function(){return P(!1)}),[U]);var z=function(){var e=(0,l.Z)(u().mark((function e(){var n,r;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return n=(0,i.Z)((0,i.Z)({},t),{},{name:b,color:A}),e.next=3,(0,s.tk)(n);case 3:r=e.sent,h(r),P(!1);case 6:case"end":return e.stop()}}),e)})));return function(){return e.apply(this,arguments)}}(),B=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(I.W,{className:"tag-circle",color:A}),(0,T.jsx)("span",{className:"tag-name",children:b}),U?(0,T.jsx)(v.Z,{size:"small",type:"text",onClick:function(){return P(!0)},icon:(0,T.jsx)(d.Z,{})}):(0,T.jsx)("span",{className:"tag-num",children:f.length})]}),H=(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(D,{tagName:b,setTagName:y,tagColor:A,setTagColor:E}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(g.Z,{title:"This tag will be deleted.",onConfirm:O,placement:"left",cancelText:"Cancel",icon:(0,T.jsx)(x.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(v.Z,{danger:!0,children:"Delete"})}),(0,T.jsx)(v.Z,{onClick:function(){y(o),E(c),P(!1)},children:"Cancel"}),(0,T.jsx)(v.Z,{type:"primary",disabled:!b,onClick:z,children:"OK"})]})]});return(0,T.jsx)(S,{className:"tag-wrapper",onDelete:O,disable:M,children:(0,T.jsx)("div",{className:"tag-item","data-curr":U,"data-editing":M,onClick:function(){return j(n)},style:(0,Z.MW)(c),children:M?H:B})})},E=function(e){var t=e.setAdding,n=(0,a.useState)(""),c=(0,r.Z)(n,2),i=c[0],l=c[1],o=(0,a.useState)((0,Z.mr)()),u=(0,r.Z)(o,2),d=u[0],x=u[1],f=(0,a.useContext)(Ge).setAllTags;return(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-curr":!0,"data-editing":!0,children:[(0,T.jsx)(D,{tagName:i,setTagName:l,tagColor:d,setTagColor:x}),(0,T.jsxs)("div",{className:"buttons",children:[(0,T.jsx)(v.Z,{onClick:function(){return t(!1)},children:"Cancel"}),(0,T.jsx)(v.Z,{type:"primary",disabled:!i,onClick:function(){var e=i.trim();e&&((0,s.HO)(e,d).then(f),t(!1))},children:"OK"})]})]})})},L=function(){var e=(0,a.useContext)(Ge),t=e.allTags,n=e.currTagID,s=e.allNotes,i=e.setCurrTagID,l=(0,a.useState)(!1),o=(0,r.Z)(l,2),u=o[0],d=o[1],x=(0,c.LH)(),h=(0,r.Z)(x,2),j=h[0],g=h[1],Z=(0,T.jsx)("div",{className:"tag-wrapper",children:(0,T.jsxs)("div",{className:"tag-item","data-curr":"DEFAULT"===n,onClick:function(){return i("DEFAULT")},children:[(0,T.jsx)(f.Z,{className:"all-note-icon"}),(0,T.jsx)("span",{className:"tag-name",children:"All Notes"}),(0,T.jsx)("span",{className:"tag-num",children:Object.keys(s).length})]})}),k=(0,T.jsxs)("header",{children:[(0,T.jsx)(v.Z,{className:"aside-btn",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return g(!1)}}),(0,T.jsx)("h2",{className:"logo",children:"Multibility"}),(0,T.jsx)(v.Z,{className:"new-tag-btn",type:"text",icon:(0,T.jsx)(m.Z,{}),onClick:function(){return d(!0)},disabled:u})]});return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsxs)("aside",{className:"side-menu","data-open":j,children:[k,(0,T.jsxs)("div",{className:"tag-list",children:[Z,(0,T.jsx)(w,{children:Object.values(t).map((function(e){return(0,T.jsx)(A,{noteTag:e},e.uid)}))}),u&&(0,T.jsx)(E,{setAdding:d})]})]}),(0,T.jsx)("div",{className:"aside-mask",onClick:function(){return g(!1)},"data-open":j})]})},F=n(4942),M=n(37762),P=n(75660),U=n(89295),O=n(96989),R=n(37557),z=n(82670),B=n(16871),H=n(6593),W=n.n(H),K=n(69228),G=n(30501),V=n(56200),_=n(92198),Y=n(51570),J=n(67415),Q=n(45987),X=n(50419),q=n(28817),$=n(70140),ee=n(99372),te=n(66776),ne=n(29529),re=n(14057),ae=n(12056),se=n(99660),ce=n(61753),ie=n(82305),le=n(69951),oe=n(72058),ue=n(61842),de=n.n(ue),xe=["children","title","keyName"],fe=function(e){var t=e.children,n=e.title,a=e.keyName,s=(0,Q.Z)(e,xe),l=(0,c.zI)(),o=(0,r.Z)(l,2),u=o[0],d=o[1];return(0,T.jsx)(U.Z,(0,i.Z)((0,i.Z)({in:u===a},s),{},{children:(0,T.jsxs)("div",{className:"secondary",children:[(0,T.jsxs)("nav",{children:[(0,T.jsx)(v.Z,{type:"text",shape:"circle",onClick:function(){return d("MENU")},icon:(0,T.jsx)(ee.Z,{})}),(0,T.jsx)("h3",{children:n})]}),t]})}))},pe=function(){var e=(0,a.useState)(!1),t=(0,r.Z)(e,2),c=t[0],i=t[1],o=(0,a.useContext)(Ge),d=o.currTagID,x=o.setAllTags,f=o.setAllNotes,p=(0,a.useState)(0),m=(0,r.Z)(p,2),h=m[0],j=m[1];function v(){return(v=(0,l.Z)(u().mark((function e(t){var r,a,c,l,o,p;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if("application/pdf"===t.type){e.next=2;break}return e.abrupt("return");case 2:return i(!0),e.next=5,Promise.all([n.e(643),n.e(61)]).then(n.bind(n,21176));case 5:return r=e.sent,a=r.LoadPDF,e.next=9,a(t,j);case 9:return(c=e.sent).tagID=d,e.next=13,(0,s.au)(c);case 13:return l=e.sent,o=l.tags,p=l.allNotes,x(o),f(p),i(!1),X.ZP.success("PDF Loaded"),e.abrupt("return",!1);case 21:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)("label",{children:[(0,T.jsxs)("div",{className:"pdf-upload",children:[(0,T.jsx)("div",{className:"icon-wrapper",children:c?(0,T.jsx)(q.Z,{width:48,type:"circle",percent:h}):(0,T.jsx)(te.Z,{className:"inbox-icon"})}),(0,T.jsx)("p",{className:"hint",children:"Click to upload a pdf file."})]}),(0,T.jsx)("input",{type:"file",multiple:!1,accept:".pdf",onChange:function(e){var t=e.target.files,n=t&&t[0];n&&function(e){v.apply(this,arguments)}(n)}})]})},me=function(){var e=(0,c.zI)(),t=(0,r.Z)(e,2)[1],n=(0,le.vW)(),s=(0,a.useState)(n),i=(0,r.Z)(s,2),l=i[0],o=i[1];return(0,T.jsxs)("div",{className:"profile-page",children:[(0,T.jsx)(j.Z,{value:l,onChange:function(e){return o(e.target.value)},prefix:(0,T.jsx)(ne.Z,{}),allowClear:!0}),(0,T.jsx)(v.Z,{disabled:n===l||!l,onClick:function(){l&&((0,le.lu)(l),t("MENU"))},type:"primary",block:!0,children:"OK"})]})},he=function(){var e=(0,a.useContext)(Ge).menuInit,t=function(){var t=(0,l.Z)(u().mark((function t(){return u().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,de().clear();case 2:return t.next=4,(0,oe.eG)();case 4:e();case 5:case"end":return t.stop()}}),t)})));return function(){return t.apply(this,arguments)}}();return(0,T.jsxs)("div",{className:"setting-menu",children:[(0,T.jsx)(v.Z,{icon:(0,T.jsx)(re.Z,{}),onClick:(0,l.Z)(u().mark((function e(){return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,ie.E();case 2:window.location.reload();case 3:case"end":return e.stop()}}),e)}))),block:!0,children:"Update"}),(0,T.jsx)(g.Z,{title:"Everything will be deleted.",onConfirm:t,icon:(0,T.jsx)(ae.Z,{}),okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},cancelText:"Cancel",placement:"bottom",children:(0,T.jsx)(v.Z,{icon:(0,T.jsx)(ae.Z,{}),danger:!0,block:!0,children:"Clear all"})})]})},je=[{key:"PDF",label:"Import PDF",component:(0,T.jsx)(pe,{}),icon:(0,T.jsx)(se.Z,{})},{key:"PROFILE",label:"My profile",component:(0,T.jsx)(me,{}),icon:(0,T.jsx)(ne.Z,{})},{key:"SETTINGS",label:"Settings",component:(0,T.jsx)(he,{}),icon:(0,T.jsx)(d.Z,{})}],ve=function(){var e=(0,c.zI)(),t=(0,r.Z)(e,2)[1];return(0,T.jsx)("div",{className:"primary-menu",children:(0,T.jsx)($.Z,{onClick:function(e){var n=e.key;return t(n)},items:je})})},ge=function(){var e=(0,a.useState)(0),t=(0,r.Z)(e,2),n=t[0],s=t[1],l=(0,c.zI)(),o=(0,r.Z)(l,2),u=o[0],d=o[1],x={timeout:300,onEnter:function(e){s(e.clientHeight)},unmountOnExit:!0};return(0,a.useEffect)((function(){return d("MENU")}),[d]),(0,T.jsxs)("section",{className:"others-menu",style:{height:n},children:[(0,T.jsx)(U.Z,(0,i.Z)((0,i.Z)({in:"MENU"===u},x),{},{children:(0,T.jsx)(ve,{})})),je.map((function(e){var t=e.key,n=e.label,r=e.component;return(0,T.jsx)(fe,(0,i.Z)((0,i.Z)({keyName:t,title:n},x),{},{children:r}),t)}))]})};function Ze(){return(0,T.jsxs)(K.Z,{placement:"bottomRight",trigger:"click",content:(0,T.jsx)(c.s2,{initKey:"",children:(0,T.jsx)(ge,{})}),zIndex:900,children:[(0,T.jsx)(v.Z,{className:"small",type:"text",icon:(0,T.jsx)(ce.Z,{})}),(0,T.jsx)(v.Z,{className:"large",shape:"circle",icon:(0,T.jsx)(ce.Z,{})})]})}var ke=function(){return(0,T.jsxs)("nav",{children:[(0,T.jsx)(Ne,{}),(0,T.jsx)(be,{})]})},Ne=function(){var e,t,n=(0,a.useContext)(Ge),s=n.allTags,i=n.currTagID,l=(0,c.LH)(),o=(0,r.Z)(l,2)[1],u=null!==(e=null===(t=s[i])||void 0===t?void 0:t.name)&&void 0!==e?e:"All notes";return(0,T.jsxs)("div",{className:"nav-left",children:[(0,T.jsx)(v.Z,{className:"aside-btn small",type:"text",icon:(0,T.jsx)(p.Z,{}),onClick:function(){return o(!0)}}),(0,T.jsx)("h2",{children:(0,T.jsx)("b",{children:u})})]})},be=function(){return(0,T.jsxs)("div",{className:"nav-right",children:[(0,T.jsx)(ye,{}),(0,T.jsx)(Te,{}),(0,T.jsx)(Ze,{})]})},ye=function(){var e=(0,a.useContext)(Ge),t=e.currTagID,n=e.setAllTags,r=e.setAllNotes;function c(){return i.apply(this,arguments)}function i(){return(i=(0,l.Z)(u().mark((function e(){var a,c,i,l;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return(a=(0,_.Xn)()).tagID=t,e.next=4,(0,s.au)(a);case 4:c=e.sent,i=c.tags,l=c.allNotes,n(i),r(l);case 9:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(v.Z,{className:"new-note large",type:"primary",shape:"round",onClick:c,icon:(0,T.jsx)(G.Z,{}),children:"New"}),(0,T.jsx)(v.Z,{className:"new-note small",type:"link",onClick:c,icon:(0,T.jsx)(G.Z,{})})]})},Te=function(){var e=(0,a.useState)(""),t=(0,r.Z)(e,2),n=t[0],s=t[1],c=(0,a.useState)(!1),i=(0,r.Z)(c,2),o=i[0],d=i[1],x=(0,B.s0)();function f(){return(f=(0,l.Z)(u().mark((function e(t){var n;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,Y.fI)(t);case 2:if(!(n=e.sent)){e.next=5;break}return e.abrupt("return",x("/team/".concat(n)));case 5:s(""),d(!0);case 7:case"end":return e.stop()}}),e)})))).apply(this,arguments)}return(0,T.jsxs)(K.Z,{placement:"bottomRight",trigger:"click",title:"Join a team note",destroyTooltipOnHide:!0,onVisibleChange:function(){return d(!1)},content:(0,T.jsx)(J.GD,{plain:!0,length:4,error:o,value:n,onChange:function(e){d(!1),s(e)},onFill:function(e){return f.apply(this,arguments)}}),children:[(0,T.jsx)(v.Z,{className:"team-btn large",shape:"round",icon:(0,T.jsx)(V.Z,{}),children:"Team"}),(0,T.jsx)(v.Z,{className:"team-btn small",type:"text",icon:(0,T.jsx)(V.Z,{})})]})},Ce=function(e){var t=e.children;return(0,T.jsxs)("header",{children:[(0,T.jsx)(ke,{}),t]})},we=n(24124),Se=n(97892),Ie=n.n(Se),De=n(79856),Ae=n(93433),Ee=n(37382),Le=n(68692),Fe=n(13876),Me=n(20054),Pe=n(9486),Ue=n(1194),Oe=n(74270),Re=n(11730),ze=function(e){var t=e.sortType,n=e.setSortType,r=e.searchText,s=e.setSearchText,c=e.onDelete,l=e.onMove,o=e.disabled,u=void 0===o||o,d=(0,a.useContext)(Ge),f=d.editing,p=d.allTags,m=d.setEditing,h=(0,T.jsx)($.Z,{onClick:function(e){var t=e.key;return n(t)},selectedKeys:[t],items:[{type:"group",label:"Sort by",className:"sort-drop",children:[{icon:(0,T.jsx)(Le.Z,{}),key:"CREATE",label:"Date created"},{icon:(0,T.jsx)(Fe.Z,{}),key:"LAST",label:"Date modified"},{icon:(0,T.jsx)(Me.Z,{}),key:"NAME",label:"Name"}]}]}),Z={type:"text",shape:"circle"},k=(0,T.jsx)(Ee.Z,{overlay:h,trigger:["click"],placement:"bottomRight",children:(0,T.jsx)(v.Z,(0,i.Z)({className:"sort-btn",icon:(0,T.jsx)(Pe.Z,{rotate:90})},Z))}),N=(0,T.jsx)(g.Z,{title:"Notes will be deleted.",onConfirm:c,icon:(0,T.jsx)(x.Z,{}),placement:"bottom",cancelText:"Cancel",disabled:u,okText:"Delete",okType:"danger",okButtonProps:{type:"primary"},children:(0,T.jsx)(v.Z,{className:"del-btn",shape:"round",type:"text",disabled:u,danger:!u,icon:(0,T.jsx)(x.Z,{}),children:"Delete"})}),b=function(e){var t=e.color,n=e.name;return(0,T.jsxs)("div",{className:"tag-select",children:[(0,T.jsx)(I.W,{color:t,className:"tag-circle"}),(0,T.jsx)("span",{className:"name",children:n})]})},y=(0,T.jsx)($.Z,{onClick:function(e){var t=e.key;return l(t)},items:[{key:"DEFAULT",label:(0,T.jsx)(b,{color:"#eee",name:"No tag"})}].concat((0,Ae.Z)(Object.values(p).map((function(e){return{key:e.uid,label:(0,T.jsx)(b,{color:e.color,name:e.name})}}))))}),C=(0,T.jsx)(Ee.Z,{overlayClassName:"tag-drop",disabled:u,overlay:y,trigger:["click"],placement:"bottom",children:(0,T.jsx)(v.Z,{shape:"round",type:"text",className:"tag-btn",icon:(0,T.jsx)(Ue.Z,{}),style:{transition:"none"},children:"Tag"})});return(0,T.jsx)("div",{className:"list-tools","data-editing":f,children:f?(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(v.Z,(0,i.Z)({onClick:function(){return m(!1)},icon:(0,T.jsx)(ee.Z,{})},Z)),C,N]}):(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(v.Z,(0,i.Z)({onClick:function(){return m(!0)},icon:(0,T.jsx)(Oe.Z,{})},Z)),(0,T.jsx)(j.Z,{value:r,onChange:function(e){return s(e.target.value)},className:"search-input",prefix:(0,T.jsx)(Re.Z,{}),bordered:!1,allowClear:!0}),k]})})};Ie().extend(W());var Be=function(e){var t=e.noteList,n=(0,a.useContext)(Ge),c=n.editing,i=n.setAllTags,o=n.setAllNotes,d=(0,a.useState)("LAST"),x=(0,r.Z)(d,2),f=x[0],p=x[1],m=(0,a.useState)(""),h=(0,r.Z)(m,2),j=h[0],v=h[1],g=(0,a.useState)((0,we.l4)()),Z=(0,r.Z)(g,2),k=Z[0],N=Z[1],y=function(){var e=(0,l.Z)(u().mark((function e(t){var n,r,a,c,l,d;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:a=(0,M.Z)(t),e.prev=1,a.s();case 3:if((c=a.n()).done){e.next=12;break}return l=c.value,e.next=7,(0,s.f_)(l);case 7:d=e.sent,n=d.tags,r=d.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),a.e(e.t0);case 17:return e.prev=17,a.f(),e.finish(17);case 20:n&&i(n),r&&o(r);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t){return e.apply(this,arguments)}}(),C=function(){var e=(0,l.Z)(u().mark((function e(t,n){var r,a,c,l,d,x;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:c=(0,M.Z)(t),e.prev=1,c.s();case 3:if((l=c.n()).done){e.next=12;break}return d=l.value,e.next=7,(0,s.tw)(d,n);case 7:x=e.sent,r=x.tags,a=x.allNotes;case 10:e.next=3;break;case 12:e.next=17;break;case 14:e.prev=14,e.t0=e.catch(1),c.e(e.t0);case 17:return e.prev=17,c.f(),e.finish(17);case 20:r&&i(r),a&&o(a);case 22:case"end":return e.stop()}}),e,null,[[1,14,17,20]])})));return function(t,n){return e.apply(this,arguments)}}(),I=(0,a.useMemo)((function(){var e=function(e,t){return t-e};switch(f){case"CREATE":return t.sortBy((function(e){return e.createTime}),e);case"LAST":return t.sortBy((function(e){return e.lastTime}),e);case"NAME":return t.sortBy((function(e){return e.name.toUpperCase()}));default:return t}}),[t,f]),D=(0,a.useMemo)((function(){return I.filter((function(e){return e.name.toUpperCase().includes(j.trim().toUpperCase())}))}),[j,I]);return(0,a.useEffect)((function(){v(""),N((0,we.l4)())}),[t,c]),(0,T.jsx)(w,{children:(0,T.jsxs)(P.Z,{className:"note-list",children:[(0,T.jsx)(Ce,{children:(0,T.jsx)(ze,{sortType:f,setSortType:p,searchText:j,setSearchText:v,onDelete:function(){return y(k.toArray())},onMove:function(e){return C(k.toArray(),e)},disabled:0===k.size})}),D.map((function(e,t){var n,r=e.uid,a=k.has(r),s=null===(n=D.get(t+1))||void 0===n?void 0:n.uid,i=(s&&k.has(s))!==a;return(0,T.jsx)(U.Z,{timeout:300,children:(0,T.jsx)(S,{className:b()("note-wrapper",{selected:a,last:i}),onDelete:function(){return y([r])},disable:c,children:(0,T.jsx)(He,{noteInfo:e,selected:a,setSelectNotes:N})})},r)}))]})})},He=function(e){var t=e.noteInfo,n=e.selected,c=e.setSelectNotes,l=t.team,o=t.uid,u=t.name,d=t.lastTime,x=t.tagID,f=(0,a.useMemo)((function(){return Ie()(d).calendar()}),[d]),p="".concat(l?"team":"reader","/").concat(o),m=(0,a.useContext)(Ge),h=m.editing,v=m.setAllNotes,g=(0,a.useState)(u),k=(0,r.Z)(g,2),N=k[0],b=k[1],y=(0,B.s0)(),C=(0,a.useContext)(Ge),w=C.allTags,S=C.currTagID,I=w[x];return(0,T.jsxs)("div",{className:"note-item","data-selected":n,onClick:function(){if(!h)return y(p);c((function(e){return e.has(o)?e.delete(o):e.add(o)}))},children:[(0,T.jsx)(Ke,{uid:o,team:l}),(0,T.jsxs)("div",{className:"content",children:[h||(0,T.jsx)("p",{className:"name",children:u}),h&&(0,T.jsx)(j.Z,{className:"name-input",value:N,onChange:function(e){return b(e.target.value)},onClick:function(e){return e.stopPropagation()},onBlur:function(){var e=N.trim();if(!e||e===u)return b(u);(0,s.SP)(o,{name:e}),v((function(n){return(0,i.Z)((0,i.Z)({},n),{},(0,F.Z)({},o,(0,i.Z)((0,i.Z)({},t),{},{name:e})))}))}}),(0,T.jsxs)("p",{className:"info",children:[(0,T.jsx)("span",{className:"date",children:f}),I&&"DEFAULT"===S&&(0,T.jsx)("span",{className:"tag",style:(0,Z.MW)(I.color),children:I.name})]})]})]})},We=a.lazy((function(){return Promise.all([n.e(101),n.e(857),n.e(479)]).then(n.bind(n,96801))})),Ke=function(e){var t,n=e.uid,c=e.team,i=(0,a.useState)(),o=(0,r.Z)(i,2),d=o[0],x=o[1],f=(0,a.useMemo)((function(){if(d){var e=d.state,t=d.ratio;return z.Dw.loadFromFlat(e,t)}}),[d]),p=(0,a.useState)(),m=(0,r.Z)(p,2),h=m[0],j=m[1];return(0,a.useEffect)((function(){(0,l.Z)(u().mark((function e(){var t,r,a,c,i;return u().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,(0,s.U9)(n);case 2:if(t=e.sent){e.next=5;break}return e.abrupt("return");case 5:if(r=t.pageRec,a=t.pageOrder,c=a[0]){e.next=9;break}return e.abrupt("return");case 9:return x(r[c]),e.next=12,(0,Y.yf)(n);case 12:if(i=e.sent){e.next=15;break}return e.abrupt("return");case 15:j(De.f.createFromTeamPages(i).getOnePageStateMap(c));case 16:case"end":return e.stop()}}),e)})))()}),[n]),(0,T.jsxs)("div",{className:"timg-wrapper","data-landscape":(null!==(t=null===d||void 0===d?void 0:d.ratio)&&void 0!==t?t:1.5)<1,children:[d&&f&&(0,T.jsx)(a.Suspense,{fallback:null,children:(0,T.jsx)(We,{drawState:f,teamStateMap:h,thumbnail:d.image,preview:!0})}),c&&(0,T.jsx)(O.Z,{className:"cloud-icon"}),(0,T.jsx)(R.Z,{className:"checked-icon"})]})},Ge=a.createContext({currTagID:"DEFAULT",editing:!1,allNotes:{},allTags:{},setAllNotes:function(){},setAllTags:function(){},setCurrTagID:function(){},setEditing:function(){},menuInit:function(){}});function Ve(){var e=(0,a.useState)({}),t=(0,r.Z)(e,2),n=t[0],i=t[1],l=(0,a.useState)({}),o=(0,r.Z)(l,2),u=o[0],d=o[1],x=(0,a.useState)("DEFAULT"),f=(0,r.Z)(x,2),p=f[0],m=f[1],h=(0,a.useState)(!1),j=(0,r.Z)(h,2),v=j[0],g=j[1],Z=(0,a.useMemo)((function(){var e;return null!==(e=u[p])&&void 0!==e?e:{uid:"",name:"All Notes",color:"#000000",notes:Object.keys(n)}}),[n,u,p]),k=(0,a.useMemo)((function(){return(0,we.aV)(Z.notes.map((function(e){return n[e]})).filter((function(e){return void 0!==e})))}),[Z,n]),N=function(){(0,s.hY)().then(i),(0,s.Ys)().then(d),document.title="Multibility"};return(0,a.useEffect)(N,[]),(0,T.jsx)(Ge.Provider,{value:{currTagID:p,editing:v,allNotes:n,allTags:u,setAllNotes:i,setAllTags:d,setEditing:g,setCurrTagID:m,menuInit:N},children:(0,T.jsx)("div",{className:"main-menu container",children:(0,T.jsxs)(c.kV,{children:[(0,T.jsx)(L,{}),(0,T.jsx)(Be,{noteList:k})]})})})}}}]);
//# sourceMappingURL=442.528d1508.chunk.js.map