(self.webpackChunkmultibility=self.webpackChunkmultibility||[]).push([[867],{72058:function(t,e,n){"use strict";n.d(e,{eG:function(){return x},mp:function(){return o},pW:function(){return f}});var r=n(37762),a=n(74165),u=n(93433),c=n(15861),s=n(61842),i=n.n(s)().createInstance({name:"imageForage"}),o=function(){var t=(0,c.Z)((0,a.Z)().mark((function t(e,n){var r,c,s;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.getItem("LIST");case 2:if(t.t1=r=t.sent,t.t0=null!==t.t1,!t.t0){t.next=6;break}t.t0=void 0!==r;case 6:if(!t.t0){t.next=10;break}t.t2=r,t.next=11;break;case 10:t.t2=[];case 11:if(c=t.t2,s="".concat(e,"_").concat(n),c.includes(s)){t.next=15;break}return t.abrupt("return");case 15:return c=[s].concat((0,u.Z)(c.filter((function(t){return t!==s})))),t.next=18,i.setItem("LIST",c);case 18:return t.next=20,i.getItem(s);case 20:return t.abrupt("return",t.sent);case 21:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),f=function(){var t=(0,c.Z)((0,a.Z)().mark((function t(e,n,r){var c,s,o;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.getItem("LIST");case 2:if(t.t1=c=t.sent,t.t0=null!==t.t1,!t.t0){t.next=6;break}t.t0=void 0!==c;case 6:if(!t.t0){t.next=10;break}t.t2=c,t.next=11;break;case 10:t.t2=[];case 11:return s=t.t2,o="".concat(e,"_").concat(n),(s=[o].concat((0,u.Z)(s.filter((function(t){return t!==o}))))).length>10&&(s=s.slice(0,10)),t.next=17,i.setItem("LIST",s);case 17:return t.next=19,i.setItem(o,r);case 19:p();case 20:case"end":return t.stop()}}),t)})));return function(e,n,r){return t.apply(this,arguments)}}(),p=function(){var t=(0,c.Z)((0,a.Z)().mark((function t(){var e,n,u,c,s,o,f;return(0,a.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,i.getItem("LIST");case 2:if(t.t1=e=t.sent,t.t0=null!==t.t1,!t.t0){t.next=6;break}t.t0=void 0!==e;case 6:if(!t.t0){t.next=10;break}t.t2=e,t.next=11;break;case 10:t.t2=[];case 11:return n=t.t2,u=new Set(n),t.next=15,i.keys();case 15:c=t.sent,s=(0,r.Z)(c),t.prev=17,s.s();case 19:if((o=s.n()).done){t.next=28;break}if("LIST"!==(f=o.value)){t.next=23;break}return t.abrupt("continue",26);case 23:if(u.has(f)){t.next=26;break}return t.next=26,i.removeItem(f);case 26:t.next=19;break;case 28:t.next=33;break;case 30:t.prev=30,t.t3=t.catch(17),s.e(t.t3);case 33:return t.prev=33,s.f(),t.finish(33);case 36:case"end":return t.stop()}}),t,null,[[17,30,33,36]])})));return function(){return t.apply(this,arguments)}}(),x=function(){return i.clear()}},98338:function(t,e,n){"use strict";n.r(e),n.d(e,{LoadPDF:function(){return L},getNotePageImage:function(){return I},getOneImage:function(){return Z},getPDFImages:function(){return k}});var r=n(1413),a=n(29439),u=n(74165),c=n(15861);function s(t,e){var n=document.createElement("canvas"),r=n.getContext("2d");if(!r)throw new Error("can't get virtual canvas context");return n.width=t,n.height=e,{canvas:n,context:r}}function i(t){if(t){t.width=1,t.height=1;var e=t.getContext("2d");null===e||void 0===e||e.clearRect(0,0,1,1)}}var o=n(92198),f=n(61842),p=n.n(f),x=n(92810),h=n(62560),l=n(20434),v=n.n(l),m=n(72058);h.GlobalWorkerOptions.workerSrc=v();var b=function(){var t=(0,c.Z)((0,u.Z)().mark((function t(e){var n;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.t0=Uint8Array,t.next=3,e.arrayBuffer();case 3:return t.t1=t.sent,n=new t.t0(t.t1),t.abrupt("return",h.getDocument(n).promise);case 6:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}(),g=function(){var t=(0,c.Z)((0,u.Z)().mark((function t(e,n,r){var a,c,o,f,p,x,h,l,v;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.getPage(n);case 2:return a=t.sent,c=a.getViewport({scale:r}),o=c.height,f=c.width,p=o/f,x=s(Math.floor(f*r),Math.floor(o*r)),h=x.canvas,l=x.context,t.next=9,a.render({canvasContext:l,viewport:c,transform:[r,0,0,r,0,0]}).promise;case 9:return v=h.toDataURL(),i(h),t.abrupt("return",[v,p]);case 12:case"end":return t.stop()}}),t)})));return function(e,n,r){return t.apply(this,arguments)}}();function k(t){return d.apply(this,arguments)}function d(){return d=(0,c.Z)((0,u.Z)().mark((function t(e){var n,r,c,s,i,o,f,p,x,h,l,v=arguments;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=v.length>1&&void 0!==v[1]?v[1]:2,r=v.length>2?v[2]:void 0,t.next=4,b(e);case 4:c=t.sent,s=c.numPages,i=[],o=[],f=1;case 9:if(!(f<=s)){t.next=22;break}return t.next=12,g(c,f,n);case 12:p=t.sent,x=(0,a.Z)(p,2),h=x[0],l=x[1],i.push(h),o.push(l),r&&r(Math.floor(f/s*100));case 19:f+=1,t.next=9;break;case 22:return t.abrupt("return",{images:i,ratios:o});case 23:case"end":return t.stop()}}),t)}))),d.apply(this,arguments)}function Z(t,e){return w.apply(this,arguments)}function w(){return w=(0,c.Z)((0,u.Z)().mark((function t(e,n){var r,c,s,i,o,f,p=arguments;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return r=p.length>2&&void 0!==p[2]?p[2]:2,t.next=3,b(e);case 3:if(c=t.sent,s=c.numPages,!(n>s)){t.next=7;break}throw new Error("index out of range");case 7:return t.next=9,g(c,n,r);case 9:return i=t.sent,o=(0,a.Z)(i,1),f=o[0],t.abrupt("return",f);case 13:case"end":return t.stop()}}),t)}))),w.apply(this,arguments)}function I(t,e){return y.apply(this,arguments)}function y(){return(y=(0,c.Z)((0,u.Z)().mark((function t(e,n){var r,a,c;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,(0,m.mp)(e,n);case 2:if(!(r=t.sent)){t.next=5;break}return t.abrupt("return",r);case 5:return t.next=7,p().getItem("PDF_".concat(e));case 7:if(a=t.sent){t.next=10;break}return t.abrupt("return");case 10:return t.next=12,Z(a,n,2);case 12:return c=t.sent,(0,m.pW)(e,n,c),t.abrupt("return",c);case 15:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function L(t,e){return S.apply(this,arguments)}function S(){return S=(0,c.Z)((0,u.Z)().mark((function t(e,n){var a,c,s,i,f,p,h,l;return(0,u.Z)().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,k(e,.5,n);case 2:return a=t.sent,c=a.images,s=a.ratios,i={},f=[],c.forEach((function(t,e){var n=(0,x.Z)(),r=s[e];r&&(i[n]={image:t,ratio:r,state:{strokes:{}},pdfIndex:e+1},f.push(n))})),p=e.name.replace(".pdf",""),t.next=11,e.arrayBuffer();case 11:return h=t.sent,l=new Blob([h],{type:"application/pdf"}),t.abrupt("return",(0,r.Z)((0,r.Z)({},(0,o.Xn)()),{},{name:p,withImg:!0,pdf:l,pageRec:i,pageOrder:f}));case 14:case"end":return t.stop()}}),t)}))),S.apply(this,arguments)}},14601:function(){},32767:function(){},28251:function(){},57677:function(){},1543:function(){},87324:function(){}}]);
//# sourceMappingURL=867.228b4207.chunk.js.map