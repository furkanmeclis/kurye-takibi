import{C as B,c as A,r as n,P as F,b as L,p as M,m as v,_ as z,D as H,O as x,I as k}from"./app-DnzU3dgP.js";var O=B.extend({defaultProps:{__TYPE:"Chart",id:null,type:null,data:null,options:null,plugins:null,width:null,height:null,style:null,className:null,children:void 0},css:{classes:{root:function(r){var a=r.props;return A("p-chart",a.className)}},inlineStyles:{root:function(r){var a=r.props;return Object.assign({width:a.width,height:a.height},a.style)}},styles:`
        @layer primereact {
            .p-chart {
                position: relative
            }
        }
        `}}),R=function(){try{return Chart}catch{return null}}(),J=n.memo(n.forwardRef(function(e,r){var a=n.useContext(F),t=O.getProps(e,a),s=O.setMetaData({props:t}),p=s.ptm,c=s.cx,l=s.sx,f=s.isUnstyled;L(O.css.styles,f,{name:"chart"});var m=n.useRef(null),o=n.useRef(null),u=n.useRef(null),S=function(){d();var b={type:t.type,data:t.data,options:t.options,plugins:t.plugins};R?o.current=new R(u.current,b):z(()=>import("./auto-Cl2ltNcc.js"),[]).then(function(h){d(),u.current&&h&&(h.default?o.current=new h.default(u.current,b):o.current=new h(u.current,b))})},d=function(){o.current&&(o.current.destroy(),o.current=null)};n.useImperativeHandle(r,function(){return{props:t,getCanvas:function(){return u.current},getChart:function(){return o.current},getBase64Image:function(){return o.current.toBase64Image()},getElement:function(){return m.current},generateLegend:function(){return o.current&&o.current.generateLegend()},refresh:function(){return o.current&&o.current.update()}}}),n.useEffect(function(){S()}),M(function(){d()});var g=t.options&&t.options.plugins&&t.options.plugins.title&&t.options.plugins.title.text,y=t.ariaLabel||g,_=v({id:t.id,ref:m,style:l("root"),className:c("root")},O.getOtherProps(t),p("root")),w=v({ref:u,width:t.width,height:t.height,role:"img","aria-label":y},p("canvas"));return n.createElement("div",_,n.createElement("canvas",w))}),function(e,r){return e.data===r.data&&e.options===r.options&&e.type===r.type});J.displayName="Chart";function C(e){"@babel/helpers - typeof";return C=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(r){return typeof r}:function(r){return r&&typeof Symbol=="function"&&r.constructor===Symbol&&r!==Symbol.prototype?"symbol":typeof r},C(e)}function W(e,r){if(C(e)!=="object"||e===null)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var t=a.call(e,r||"default");if(C(t)!=="object")return t;throw new TypeError("@@toPrimitive must return a primitive value.")}return(r==="string"?String:Number)(e)}function q(e){var r=W(e,"string");return C(r)==="symbol"?r:String(r)}function K(e,r,a){return r=q(r),r in e?Object.defineProperty(e,r,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[r]=a,e}function I(){return I=Object.assign?Object.assign.bind():function(e){for(var r=1;r<arguments.length;r++){var a=arguments[r];for(var t in a)Object.prototype.hasOwnProperty.call(a,t)&&(e[t]=a[t])}return e},I.apply(this,arguments)}function X(e){if(Array.isArray(e))return e}function Y(e,r){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var t,s,p,c,l=[],f=!0,m=!1;try{if(p=(a=a.call(e)).next,r!==0)for(;!(f=(t=p.call(a)).done)&&(l.push(t.value),l.length!==r);f=!0);}catch(o){m=!0,s=o}finally{try{if(!f&&a.return!=null&&(c=a.return(),Object(c)!==c))return}finally{if(m)throw s}}return l}}function N(e,r){(r==null||r>e.length)&&(r=e.length);for(var a=0,t=new Array(r);a<r;a++)t[a]=e[a];return t}function V(e,r){if(e){if(typeof e=="string")return N(e,r);var a=Object.prototype.toString.call(e).slice(8,-1);if(a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set")return Array.from(e);if(a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return N(e,r)}}function G(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function D(e,r){return X(e)||Y(e,r)||V(e,r)||G()}var Q={root:function(r){var a=r.props,t=r.state;return A("p-avatar p-component",{"p-avatar-image":x.isNotEmpty(a.image)&&!t.imageFailed,"p-avatar-circle":a.shape==="circle","p-avatar-lg":a.size==="large","p-avatar-xl":a.size==="xlarge","p-avatar-clickable":!!a.onClick})},label:"p-avatar-text",icon:"p-avatar-icon"},Z=`
@layer primereact {
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        font-size: 1rem;
    }
    
    .p-avatar.p-avatar-image {
        background-color: transparent;
    }
    
    .p-avatar.p-avatar-circle {
        border-radius: 50%;
    }
    
    .p-avatar.p-avatar-circle img {
        border-radius: 50%;
    }
    
    .p-avatar .p-avatar-icon {
        font-size: 1rem;
    }
    
    .p-avatar img {
        width: 100%;
        height: 100%;
    }
    
    .p-avatar-clickable {
        cursor: pointer;
    }
}
`,j=B.extend({defaultProps:{__TYPE:"Avatar",className:null,icon:null,image:null,imageAlt:"avatar",imageFallback:"default",label:null,onImageError:null,shape:"square",size:"normal",style:null,template:null,children:void 0},css:{classes:Q,styles:Z}});function T(e,r){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var t=Object.getOwnPropertySymbols(e);r&&(t=t.filter(function(s){return Object.getOwnPropertyDescriptor(e,s).enumerable})),a.push.apply(a,t)}return a}function ee(e){for(var r=1;r<arguments.length;r++){var a=arguments[r]!=null?arguments[r]:{};r%2?T(Object(a),!0).forEach(function(t){K(e,t,a[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):T(Object(a)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))})}return e}var te=n.forwardRef(function(e,r){var a=n.useContext(F),t=j.getProps(e,a),s=n.useRef(null),p=n.useState(!1),c=D(p,2),l=c[0],f=c[1],m=n.useState(!1),o=D(m,2),u=o[0],S=o[1],d=j.setMetaData({props:t,state:{imageFailed:l,nested:u}}),g=d.ptm,y=d.cx,_=d.isUnstyled;L(j.css.styles,_,{name:"avatar"});var w=function(){if(x.isNotEmpty(t.image)&&!l){var P=v({src:t.image,onError:i},g("image"));return n.createElement("img",I({alt:t.imageAlt},P))}else if(t.label){var U=v({className:y("label")},g("label"));return n.createElement("span",U,t.label)}else if(t.icon){var $=v({className:y("icon")},g("icon"));return k.getJSXIcon(t.icon,ee({},$),{props:t})}return null},i=function(P){t.imageFallback==="default"?t.onImageError||(f(!0),P.target.src=null):P.target.src=t.imageFallback,t.onImageError&&t.onImageError(P)};n.useEffect(function(){var E=H.isAttributeEquals(s.current.parentElement,"data-pc-name","avatargroup");S(E)},[]),n.useImperativeHandle(r,function(){return{props:t,getElement:function(){return s.current}}});var b=v({ref:s,style:t.style,className:A(t.className,y("root",{imageFailed:l}))},j.getOtherProps(t),g("root")),h=t.template?x.getJSXElement(t.template,t):w();return n.createElement("div",b,h,t.children)});te.displayName="Avatar";const ae={getProductsSmall(){return fetch("/demo/data/products-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)},getProducts(){return fetch("/demo/data/products.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)},getProductsMixed(){return fetch("/demo/data/products-mixed.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)},getProductsWithOrdersSmall(){return fetch("/demo/data/products-orders-small.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)},getProductsWithOrdersLarge(){return fetch("/demo/data/products-orders.json",{headers:{"Cache-Control":"no-cache"}}).then(e=>e.json()).then(e=>e.data)}};export{te as A,ae as P,J as a};
