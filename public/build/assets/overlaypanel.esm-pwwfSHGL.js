import{C as ae,r as l,P as le,d as ie,v as ce,e as se,s as ue,D as g,t as R,Z as D,A as pe,c as fe,l as k,U as ve,m as C,h as ye,T as de,f as me,p as be,o as ge,O as Ee}from"./app-wUprH5bk.js";function L(){return L=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},L.apply(this,arguments)}function T(n){"@babel/helpers - typeof";return T=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(e){return typeof e}:function(e){return e&&typeof Symbol=="function"&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},T(n)}function he(n,e){if(T(n)!=="object"||n===null)return n;var t=n[Symbol.toPrimitive];if(t!==void 0){var r=t.call(n,e||"default");if(T(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(e==="string"?String:Number)(n)}function Oe(n){var e=he(n,"string");return T(e)==="symbol"?e:String(e)}function Pe(n,e,t){return e=Oe(e),e in n?Object.defineProperty(n,e,{value:t,enumerable:!0,configurable:!0,writable:!0}):n[e]=t,n}function we(n){if(Array.isArray(n))return n}function xe(n,e){var t=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(t!=null){var r,d,v,s,m=[],f=!0,p=!1;try{if(v=(t=t.call(n)).next,e!==0)for(;!(f=(r=v.call(t)).done)&&(m.push(r.value),m.length!==e);f=!0);}catch(i){p=!0,d=i}finally{try{if(!f&&t.return!=null&&(s=t.return(),Object(s)!==s))return}finally{if(p)throw d}}return m}}function $(n,e){(e==null||e>n.length)&&(e=n.length);for(var t=0,r=new Array(e);t<e;t++)r[t]=n[t];return r}function Se(n,e){if(n){if(typeof n=="string")return $(n,e);var t=Object.prototype.toString.call(n).slice(8,-1);if(t==="Object"&&n.constructor&&(t=n.constructor.name),t==="Map"||t==="Set")return Array.from(n);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return $(n,e)}}function Ce(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function U(n,e){return we(n)||xe(n,e)||Se(n,e)||Ce()}var Ie=function(e){var t=l.useRef(void 0);return l.useEffect(function(){t.current=e}),t.current},ke=function(e){return l.useEffect(function(){return e},[])},Te=function(e){var t=e.target,r=t===void 0?"document":t,d=e.type,v=e.listener,s=e.options,m=e.when,f=m===void 0?!0:m,p=l.useRef(null),i=l.useRef(null),w=Ie(s),P=function(){var E=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};Ee.isNotEmpty(E.target)&&(a(),(E.when||f)&&(p.current=g.getTargetElement(E.target))),!i.current&&p.current&&(i.current=function(O){return v&&v(O)},p.current.addEventListener(d,i.current,s))},a=function(){i.current&&(p.current.removeEventListener(d,i.current,s),i.current=null)};return l.useEffect(function(){f?p.current=g.getTargetElement(r):(a(),p.current=null)},[r,f]),l.useEffect(function(){i.current&&(i.current!==v||w!==s)&&(a(),f&&P())},[v,s]),ke(function(){a()}),[P,a]},je=function(e,t,r){var d=function(i){(i.key==="Esc"||i.key==="Escape")&&(i.stopImmediatePropagation(),r(i))},v=Te({type:"keydown",listener:d}),s=U(v,2),m=s[0],f=s[1];return l.useEffect(function(){if(t&&e.current)return m(),function(){f()}}),[e,r]},Re={root:function(e){var t=e.props,r=e.context;return fe("p-overlaypanel p-component",t.className,{"p-input-filled":r&&r.inputStyle==="filled"||k.inputStyle==="filled","p-ripple-disabled":r&&r.ripple===!1||k.ripple===!1})},closeIcon:"p-overlaypanel-close-icon",closeButton:"p-overlaypanel-close p-link",content:"p-overlaypanel-content",transition:"p-overlaypanel"},Le=`
@layer primereact {
    .p-overlaypanel {
        position: absolute;
        margin-top: 10px;
        /* Github #3122: Prevent animation flickering  */
        top: -9999px;
        left: -9999px;
    }
    
    .p-overlaypanel-flipped {
        margin-top: 0;
        margin-bottom: 10px;
    }
    
    .p-overlaypanel-close {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        position: relative;
    }
    
    /* Animation */
    .p-overlaypanel-enter {
        opacity: 0;
        transform: scaleY(0.8);
    }
    
    .p-overlaypanel-enter-active {
        opacity: 1;
        transform: scaleY(1);
        transition: transform .12s cubic-bezier(0, 0, 0.2, 1), opacity .12s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .p-overlaypanel-enter-done {
        transform: none;
    }
    
    .p-overlaypanel-exit {
        opacity: 1;
    }
    
    .p-overlaypanel-exit-active {
        opacity: 0;
        transition: opacity .1s linear;
    }
    
    .p-overlaypanel:after, .p-overlaypanel:before {
        bottom: 100%;
        left: calc(var(--overlayArrowLeft, 0) + 1.25rem);
        content: " ";
        height: 0;
        width: 0;
        position: absolute;
        pointer-events: none;
    }
    
    .p-overlaypanel:after {
        border-width: 8px;
        margin-left: -8px;
    }
    
    .p-overlaypanel:before {
        border-width: 10px;
        margin-left: -10px;
    }
    
    .p-overlaypanel-flipped:after, .p-overlaypanel-flipped:before {
        bottom: auto;
        top: 100%;
    }
    
    .p-overlaypanel.p-overlaypanel-flipped:after {
        border-bottom-color: transparent;
    }
    
    .p-overlaypanel.p-overlaypanel-flipped:before {
        border-bottom-color: transparent
    }
}
`,I=ae.extend({defaultProps:{__TYPE:"OverlayPanel",id:null,dismissable:!0,showCloseIcon:!1,closeIcon:null,style:null,className:null,appendTo:null,breakpoints:null,ariaCloseLabel:null,transitionOptions:null,onShow:null,onHide:null,children:void 0,closeOnEscape:!0},css:{classes:Re,styles:Le}});function K(n,e){var t=Object.keys(n);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(n);e&&(r=r.filter(function(d){return Object.getOwnPropertyDescriptor(n,d).enumerable})),t.push.apply(t,r)}return t}function Ae(n){for(var e=1;e<arguments.length;e++){var t=arguments[e]!=null?arguments[e]:{};e%2?K(Object(t),!0).forEach(function(r){Pe(n,r,t[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(t)):K(Object(t)).forEach(function(r){Object.defineProperty(n,r,Object.getOwnPropertyDescriptor(t,r))})}return n}var _e=l.forwardRef(function(n,e){var t=l.useContext(le),r=I.getProps(n,t),d=l.useState(!1),v=U(d,2),s=v[0],m=v[1],f=I.setMetaData({props:r,state:{visible:s}}),p=f.ptm,i=f.cx;f.sx;var w=f.isUnstyled;ie(I.css.styles,w,{name:"overlaypanel"});var P=l.useRef(""),a=l.useRef(null),y=l.useRef(null),E=l.useRef(!1),O=l.useRef(null),h=l.useRef(null),z=ce({target:y,overlay:a,listener:function(o,c){var b=c.type,S=c.valid;if(S)switch(b){case"outside":r.dismissable&&!E.current&&x();break;case"resize":case"scroll":case"orientationchange":j();break}E.current=!1},when:s}),B=U(z,2),M=B[0],Z=B[1];je(h,r.closeOnEscape,function(){x()});var Y=function(o){return a&&a.current&&!(a.current.isSameNode(o)||a.current.contains(o))},q=function(o,c){return y.current!=null&&y.current!==(c||o.currentTarget||o.target)},G=function(o){x(),o.preventDefault()},J=function(o){E.current=!0,R.emit("overlay-click",{originalEvent:o,target:y.current})},H=function(){E.current=!0},V=function(o,c){s?(x(),q(o,c)&&(y.current=c||o.currentTarget||o.target,setTimeout(function(){A(o,y.current)},200))):A(o,c)},A=function(o,c){y.current=c||o.currentTarget||o.target,s?j():(m(!0),h.current=function(b){!Y(b.target)&&(E.current=!0)},R.on("overlay-click",h.current))},x=function(){m(!1),R.off("overlay-click",h.current),h.current=null},W=function(){a.current.setAttribute(P.current,""),D.set("overlay",a.current,t&&t.autoZIndex||k.autoZIndex,t&&t.zIndex.overlay||k.zIndex.overlay),g.addStyles(a.current,{position:"absolute",top:"0",left:"0"}),j()},X=function(){M(),r.onShow&&r.onShow()},F=function(){Z()},Q=function(){D.clear(a.current),r.onHide&&r.onHide()},j=function(){if(y.current&&a.current){g.absolutePosition(a.current,y.current);var o=g.getOffset(a.current),c=g.getOffset(y.current),b=0;o.left<c.left&&(b=c.left-o.left),a.current.style.setProperty("--overlayArrowLeft","".concat(b,"px")),o.top<c.top?(a.current.setAttribute("data-p-overlaypanel-flipped","true"),w&&g.addClass(a.current,"p-overlaypanel-flipped")):(a.current.setAttribute("data-p-overlaypanel-flipped","false"),w&&g.removeClass(a.current,"p-overlaypanel-flipped"))}},ee=function(){if(!O.current){O.current=g.createInlineStyle(t&&t.nonce||k.nonce);var o="";for(var c in r.breakpoints)o+=`
                    @media screen and (max-width: `.concat(c,`) {
                        .p-overlaypanel[`).concat(P.current,`] {
                            width: `).concat(r.breakpoints[c],`;
                        }
                    }
                `);O.current.innerHTML=o}};se(function(){P.current=ve(),r.breakpoints&&ee()}),ue(function(){O.current=g.removeInlineStyle(O.current),h.current&&(R.off("overlay-click",h.current),h.current=null),D.clear(a.current)}),l.useImperativeHandle(e,function(){return{props:r,toggle:V,show:A,hide:x,align:j,getElement:function(){return a.current}}});var ne=function(){var o=C({className:i("closeIcon"),"aria-hidden":!0},p("closeIcon")),c=r.closeIcon||l.createElement(de,o),b=me.getJSXIcon(c,Ae({},o),{props:r}),S=r.ariaCloseLabel||be("close"),_=C({type:"button",className:i("closeButton"),onClick:function(oe){return G(oe)},"aria-label":S},p("closeButton"));return r.showCloseIcon?l.createElement("button",_,b,l.createElement(ge,null)):null},te=function(){var o=ne(),c=C({id:r.id,className:i("root",{context:t}),style:r.style,onClick:function(N){return J(N)}},I.getOtherProps(r),p("root")),b=C({className:i("content"),onClick:function(N){return H()},onMouseDown:H},I.getOtherProps(r),p("content")),S=C({classNames:i("transition"),in:s,timeout:{enter:120,exit:100},options:r.transitionOptions,unmountOnExit:!0,onEnter:W,onEntered:X,onExit:F,onExited:Q},p("transition"));return l.createElement(ye,L({nodeRef:a},S),l.createElement("div",L({ref:a},c),l.createElement("div",b,r.children),o))},re=te();return l.createElement(pe,{element:re,appendTo:r.appendTo})});_e.displayName="OverlayPanel";export{_e as O};
