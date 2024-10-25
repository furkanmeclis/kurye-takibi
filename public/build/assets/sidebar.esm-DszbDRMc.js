import{C as pe,r as i,P as ue,d as de,v as be,g as fe,w as M,Z as E,i as w,h as me,c as B,D as k,o as ve,m as g,n as ye,O as U,k as ge,l as he,t as xe}from"./app-B-maR26A.js";import{T as Se}from"./index.esm-nUOFFTeC.js";function R(){return R=Object.assign?Object.assign.bind():function(r){for(var n=1;n<arguments.length;n++){var t=arguments[n];for(var e in t)Object.prototype.hasOwnProperty.call(t,e)&&(r[e]=t[e])}return r},R.apply(this,arguments)}function O(r){"@babel/helpers - typeof";return O=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(n){return typeof n}:function(n){return n&&typeof Symbol=="function"&&n.constructor===Symbol&&n!==Symbol.prototype?"symbol":typeof n},O(r)}function Ee(r,n){if(O(r)!=="object"||r===null)return r;var t=r[Symbol.toPrimitive];if(t!==void 0){var e=t.call(r,n||"default");if(O(e)!=="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(n==="string"?String:Number)(r)}function we(r){var n=Ee(r,"string");return O(n)==="symbol"?n:String(n)}function ke(r,n,t){return n=we(n),n in r?Object.defineProperty(r,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):r[n]=t,r}function Oe(r){if(Array.isArray(r))return r}function Ie(r,n){var t=r==null?null:typeof Symbol<"u"&&r[Symbol.iterator]||r["@@iterator"];if(t!=null){var e,u,c,a,b=[],f=!0,d=!1;try{if(c=(t=t.call(r)).next,n!==0)for(;!(f=(e=c.call(t)).done)&&(b.push(e.value),b.length!==n);f=!0);}catch(s){d=!0,u=s}finally{try{if(!f&&t.return!=null&&(a=t.return(),Object(a)!==a))return}finally{if(d)throw u}}return b}}function z(r,n){(n==null||n>r.length)&&(n=r.length);for(var t=0,e=new Array(n);t<n;t++)e[t]=r[t];return e}function Pe(r,n){if(r){if(typeof r=="string")return z(r,n);var t=Object.prototype.toString.call(r).slice(8,-1);if(t==="Object"&&r.constructor&&(t=r.constructor.name),t==="Map"||t==="Set")return Array.from(r);if(t==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t))return z(r,n)}}function Ce(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function j(r,n){return Oe(r)||Ie(r,n)||Pe(r,n)||Ce()}var je=function(n){var t=i.useRef(void 0);return i.useEffect(function(){t.current=n}),t.current},Re=function(n){return i.useEffect(function(){return n},[])},De=function(n){var t=n.target,e=t===void 0?"document":t,u=n.type,c=n.listener,a=n.options,b=n.when,f=b===void 0?!0:b,d=i.useRef(null),s=i.useRef(null),I=je(a),h=function(){var S=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};U.isNotEmpty(S.target)&&(p(),(S.when||f)&&(d.current=k.getTargetElement(S.target))),!s.current&&d.current&&(s.current=function(D){return c&&c(D)},d.current.addEventListener(u,s.current,a))},p=function(){s.current&&(d.current.removeEventListener(u,s.current,a),s.current=null)};return i.useEffect(function(){f?d.current=k.getTargetElement(e):(p(),d.current=null)},[e,f]),i.useEffect(function(){s.current&&(s.current!==c||I!==a)&&(p(),f&&h())},[c,a]),Re(function(){p()}),[h,p]},_e=function(n,t,e){var u=function(s){(s.key==="Esc"||s.key==="Escape")&&(s.stopImmediatePropagation(),e(s))},c=De({type:"keydown",listener:u}),a=j(c,2),b=a[0],f=a[1];return i.useEffect(function(){if(t&&n.current)return b(),function(){f()}}),[n,e]},Le={closeButton:"p-sidebar-close p-sidebar-icon p-link",closeIcon:"p-sidebar-close-icon",mask:function(n){var t=n.props,e=n.maskVisibleState,u=["left","right","top","bottom"],c=u.find(function(a){return a===t.position});return B("p-sidebar-mask",c&&!t.fullScreen?"p-sidebar-".concat(c):"",{"p-component-overlay p-component-overlay-enter":t.modal,"p-sidebar-mask-scrollblocker":t.blockScroll,"p-sidebar-visible":e,"p-sidebar-full":t.fullScreen},t.maskClassName)},header:function(n){var t=n.props;return B("p-sidebar-header",{"p-sidebar-custom-header":t.header})},content:"p-sidebar-content",icons:"p-sidebar-icons",root:function(n){var t=n.props,e=n.context;return B("p-sidebar p-component",t.className,{"p-input-filled":e&&e.inputStyle==="filled"||w.inputStyle==="filled","p-ripple-disabled":e&&e.ripple===!1||w.ripple===!1})},transition:"p-sidebar"},Te=`
@layer primereact {
    .p-sidebar-mask {
        display: none;
        justify-content: center;
        align-items: center;
        pointer-events: none;
        background-color: transparent;
        transition-property: background-color;
    }
    
    .p-sidebar-visible {
        display: flex;
    }
    
    .p-sidebar-mask.p-component-overlay {
        pointer-events: auto;
    }
    
    .p-sidebar {
        display: flex;
        flex-direction: column;
        pointer-events: auto;
        transform: translate3d(0px, 0px, 0px);
        position: relative;
    }
    
    .p-sidebar-content {
        overflow-y: auto;
        flex-grow: 1;
    }
    
    .p-sidebar-header {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    
    .p-sidebar-custom-header {
        justify-content: space-between;
    }
    
    .p-sidebar-icons {
        display: flex;
        align-items: center;
        flex-shrink: 0;
    }
    
    .p-sidebar-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
    }
    
    .p-sidebar-full .p-sidebar {
        transition: none;
        transform: none;
        width: 100vw;
        height: 100vh;
        max-height: 100%;
        top: 0px;
        left: 0px;
    }
    
    /* Animation */
    /* Top, Bottom, Left and Right */
    .p-sidebar-top .p-sidebar-enter,
    .p-sidebar-top .p-sidebar-exit-active {
        transform: translate3d(0px, -100%, 0px);
    }
    
    .p-sidebar-bottom .p-sidebar-enter,
    .p-sidebar-bottom .p-sidebar-exit-active {
        transform: translate3d(0px, 100%, 0px);
    }
    
    .p-sidebar-left .p-sidebar-enter,
    .p-sidebar-left .p-sidebar-exit-active {
        transform: translate3d(-100%, 0px, 0px);
    }
    
    .p-sidebar-right .p-sidebar-enter,
    .p-sidebar-right .p-sidebar-exit-active {
        transform: translate3d(100%, 0px, 0px);
    }
    
    .p-sidebar-top .p-sidebar-enter-active,
    .p-sidebar-bottom .p-sidebar-enter-active,
    .p-sidebar-left .p-sidebar-enter-active,
    .p-sidebar-right .p-sidebar-enter-active {
        transform: translate3d(0px, 0px, 0px);
        transition: all 0.3s;
    }
    
    .p-sidebar-top .p-sidebar-enter-done,
    .p-sidebar-bottom .p-sidebar-enter-done,
    .p-sidebar-left .p-sidebar-enter-done,
    .p-sidebar-right .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-top .p-sidebar-exit-active,
    .p-sidebar-bottom .p-sidebar-exit-active,
    .p-sidebar-left .p-sidebar-exit-active,
    .p-sidebar-right .p-sidebar-exit-active {
        transition: all 0.3s;
    }
    
    /* Full */
    .p-sidebar-full .p-sidebar-enter {
        opacity: 0;
        transform: scale(0.5);
    }
    
    .p-sidebar-full .p-sidebar-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: all 0.15s cubic-bezier(0, 0, 0.2, 1);
    }
    
    .p-sidebar-full .p-sidebar-enter-done {
        transform: none;
    }
    
    .p-sidebar-full .p-sidebar-exit-active {
        opacity: 0;
        transform: scale(0.5);
        transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    /* Size */
    .p-sidebar-left .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-right .p-sidebar {
        width: 20rem;
        height: 100%;
    }
    
    .p-sidebar-top .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-bottom .p-sidebar {
        height: 10rem;
        width: 100%;
    }
    
    .p-sidebar-left .p-sidebar-sm,
    .p-sidebar-right .p-sidebar-sm {
        width: 20rem;
    }
    
    .p-sidebar-left .p-sidebar-md,
    .p-sidebar-right .p-sidebar-md {
        width: 40rem;
    }
    
    .p-sidebar-left .p-sidebar-lg,
    .p-sidebar-right .p-sidebar-lg {
        width: 60rem;
    }
    
    .p-sidebar-top .p-sidebar-sm,
    .p-sidebar-bottom .p-sidebar-sm {
        height: 10rem;
    }
    
    .p-sidebar-top .p-sidebar-md,
    .p-sidebar-bottom .p-sidebar-md {
        height: 20rem;
    }
    
    .p-sidebar-top .p-sidebar-lg,
    .p-sidebar-bottom .p-sidebar-lg {
        height: 30rem;
    }
    
    .p-sidebar-left .p-sidebar-view,
    .p-sidebar-right .p-sidebar-view,
    .p-sidebar-top .p-sidebar-view,
    .p-sidebar-bottom .p-sidebar-view {
        width: 100%;
        height: 100%;
    }
    
    .p-sidebar-left .p-sidebar-content,
    .p-sidebar-right .p-sidebar-content,
    .p-sidebar-top .p-sidebar-content,
    .p-sidebar-bottom .p-sidebar-content {
        width: 100%;
        height: 100%;
    }
    
    @media screen and (max-width: 64em) {
        .p-sidebar-left .p-sidebar-lg,
        .p-sidebar-left .p-sidebar-md,
        .p-sidebar-right .p-sidebar-lg,
        .p-sidebar-right .p-sidebar-md {
            width: 20rem;
        }
    }        
}
`,Ne={mask:function(n){var t=n.props;return{position:"fixed",height:"100%",width:"100%",left:0,top:0,display:"flex",justifyContent:t.position==="left"?"flex-start":t.position==="right"?"flex-end":"center",alignItems:t.position==="top"?"flex-start":t.position==="bottom"?"flex-end":"center"}}},C=pe.extend({defaultProps:{__TYPE:"Sidebar",id:null,style:null,className:null,maskStyle:null,maskClassName:null,visible:!1,position:"left",fullScreen:!1,blockScroll:!1,baseZIndex:0,dismissable:!0,showCloseIcon:!0,closeIcon:null,ariaCloseLabel:null,closeOnEscape:!0,icons:null,modal:!0,appendTo:null,transitionOptions:null,onShow:null,onHide:null,children:void 0},css:{classes:Le,styles:Te,inlineStyles:Ne}});function J(r,n){var t=Object.keys(r);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(r);n&&(e=e.filter(function(u){return Object.getOwnPropertyDescriptor(r,u).enumerable})),t.push.apply(t,e)}return t}function Ae(r){for(var n=1;n<arguments.length;n++){var t=arguments[n]!=null?arguments[n]:{};n%2?J(Object(t),!0).forEach(function(e){ke(r,e,t[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(r,Object.getOwnPropertyDescriptors(t)):J(Object(t)).forEach(function(e){Object.defineProperty(r,e,Object.getOwnPropertyDescriptor(t,e))})}return r}var Me=i.forwardRef(function(r,n){var t=i.useContext(ue),e=C.getProps(r,t),u=i.useState(!1),c=j(u,2),a=c[0],b=c[1],f=i.useState(!1),d=j(f,2),s=d[0],I=d[1],h=C.setMetaData({props:e,state:{containerVisible:a}}),p=h.ptm,m=h.cx,S=h.sx,D=h.isUnstyled;de(C.css.styles,D,{name:"sidebar"});var y=i.useRef(null),v=i.useRef(null),_=i.useRef(null);_e(v,e.closeOnEscape,function(o){E.get(v.current)===E.getCurrent("modal",t&&t.autoZIndex||w.autoZIndex)&&P(o)});var X=be({type:"click",listener:function(l){l.button===0&&F(l)&&P(l)}}),$=j(X,2),H=$[0],Z=$[1],F=function(l){return y&&y.current&&!y.current.contains(l.target)},W=function(){var l=document.activeElement,x=l&&y&&y.current.contains(l);!x&&e.showCloseIcon&&_.current.focus()},Y=function(l){e.dismissable&&e.modal&&v.current===l.target&&P(l)},P=function(l){e.onHide(),l.preventDefault()},q=function(){e.onShow&&e.onShow(),W(),ee()},G=function(){e.modal&&k.addClass(v.current,"p-component-overlay-leave")},Q=function(){E.clear(v.current),b(!1),V()},ee=function(){e.dismissable&&!e.modal&&H(),e.blockScroll&&k.blockBodyScroll()},V=function(){Z(),e.blockScroll&&k.unblockBodyScroll()};i.useImperativeHandle(n,function(){return{props:e,getElement:function(){return y.current},gteMask:function(){return v.current},getCloseIcon:function(){return _.current}}}),fe(function(){e.visible&&b(!0)}),M(function(){e.visible&&!a&&b(!0),e.visible!==s&&a&&I(e.visible)}),M(function(){a&&(E.set("modal",v.current,t&&t.autoZIndex||w.autoZIndex,e.baseZIndex||t&&t.zIndex.modal||w.zIndex.modal),I(!0))},[a]),M(function(){s&&(Z(),e.dismissable&&!e.modal&&H())},[e.dismissable,e.modal,s]),me(function(){V(),v.current&&E.clear(v.current)});var ne=function(){var l=g({type:"button",ref:_,className:m("closeButton"),onClick:function(A){return P(A)},"aria-label":N},p("closeButton")),x=g({className:m("closeIcon")},p("closeIcon")),L=e.closeIcon||i.createElement(Se,x),T=ge.getJSXIcon(L,Ae({},x),{props:e}),N=e.ariaCloseLabel||he("close");return e.showCloseIcon?i.createElement("button",l,T,i.createElement(xe,null)):null},te=function(){return e.header?U.getJSXElement(e.header,e):null},re=function(){return e.icons?U.getJSXElement(e.icons,e):null},ie=function(){var l=ne(),x=re(),L=te(),T={enter:e.fullScreen?150:300,exit:e.fullScreen?150:300},N=g({ref:v,style:S("mask"),className:m("mask",{maskVisibleState:a}),onMouseDown:function(ce){return Y(ce)}},p("mask")),K=g({id:e.id,className:m("root",{context:t}),style:e.style,role:"complementary"},C.getOtherProps(e),p("root")),A=g({className:m("header")},p("header")),se=g({className:m("content")},p("content")),oe=g({className:m("icons")},p("icons")),le=g({classNames:m("transition"),in:s,timeout:T,options:e.transitionOptions,unmountOnExit:!0,onEntered:q,onExiting:G,onExited:Q},p("transition"));return i.createElement("div",N,i.createElement(ye,R({nodeRef:y},le),i.createElement("div",R({ref:y},K),i.createElement("div",A,L,i.createElement("div",oe,x,l)),i.createElement("div",se,e.children))))},ae=function(){var l=ie();return i.createElement(ve,{element:l,appendTo:e.appendTo,visible:!0})};return a&&ae()});Me.displayName="Sidebar";export{Me as S};
