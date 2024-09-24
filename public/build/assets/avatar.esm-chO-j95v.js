import{C as T,r as n,P as $,d as z,D as U,m as v,c as A,O,f as k}from"./app-CR-42WEE.js";function u(e){"@babel/helpers - typeof";return u=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},u(e)}function H(e,t){if(u(e)!=="object"||e===null)return e;var a=e[Symbol.toPrimitive];if(a!==void 0){var r=a.call(e,t||"default");if(u(r)!=="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function B(e){var t=H(e,"string");return u(t)==="symbol"?t:String(t)}function M(e,t,a){return t=B(t),t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function S(){return S=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var a=arguments[t];for(var r in a)Object.prototype.hasOwnProperty.call(a,r)&&(e[r]=a[r])}return e},S.apply(this,arguments)}function q(e){if(Array.isArray(e))return e}function J(e,t){var a=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(a!=null){var r,o,p,i,l=[],s=!0,m=!1;try{if(p=(a=a.call(e)).next,t!==0)for(;!(s=(r=p.call(a)).done)&&(l.push(r.value),l.length!==t);s=!0);}catch(f){m=!0,o=f}finally{try{if(!s&&a.return!=null&&(i=a.return(),Object(i)!==i))return}finally{if(m)throw o}}return l}}function E(e,t){(t==null||t>e.length)&&(t=e.length);for(var a=0,r=new Array(t);a<t;a++)r[a]=e[a];return r}function K(e,t){if(e){if(typeof e=="string")return E(e,t);var a=Object.prototype.toString.call(e).slice(8,-1);if(a==="Object"&&e.constructor&&(a=e.constructor.name),a==="Map"||a==="Set")return Array.from(e);if(a==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a))return E(e,t)}}function X(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function P(e,t){return q(e)||J(e,t)||K(e,t)||X()}var L={root:function(t){var a=t.props,r=t.state;return A("p-avatar p-component",{"p-avatar-image":O.isNotEmpty(a.image)&&!r.imageFailed,"p-avatar-circle":a.shape==="circle","p-avatar-lg":a.size==="large","p-avatar-xl":a.size==="xlarge","p-avatar-clickable":!!a.onClick})},label:"p-avatar-text",icon:"p-avatar-icon"},W=`
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
`,b=T.extend({defaultProps:{__TYPE:"Avatar",className:null,icon:null,image:null,imageAlt:"avatar",imageFallback:"default",label:null,onImageError:null,shape:"square",size:"normal",style:null,template:null,children:void 0},css:{classes:L,styles:W}});function j(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(o){return Object.getOwnPropertyDescriptor(e,o).enumerable})),a.push.apply(a,r)}return a}function Y(e){for(var t=1;t<arguments.length;t++){var a=arguments[t]!=null?arguments[t]:{};t%2?j(Object(a),!0).forEach(function(r){M(e,r,a[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):j(Object(a)).forEach(function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(a,r))})}return e}var G=n.forwardRef(function(e,t){var a=n.useContext($),r=b.getProps(e,a),o=n.useRef(null),p=n.useState(!1),i=P(p,2),l=i[0],s=i[1],m=n.useState(!1),f=P(m,2),w=f[0],_=f[1],d=b.setMetaData({props:r,state:{imageFailed:l,nested:w}}),y=d.ptm,h=d.cx,I=d.isUnstyled;z(b.css.styles,I,{name:"avatar"});var x=function(){if(O.isNotEmpty(r.image)&&!l){var c=v({src:r.image,onError:N},y("image"));return n.createElement("img",S({alt:r.imageAlt},c))}else if(r.label){var D=v({className:h("label")},y("label"));return n.createElement("span",D,r.label)}else if(r.icon){var F=v({className:h("icon")},y("icon"));return k.getJSXIcon(r.icon,Y({},F),{props:r})}return null},N=function(c){r.imageFallback==="default"?r.onImageError||(s(!0),c.target.src=null):c.target.src=r.imageFallback,r.onImageError&&r.onImageError(c)};n.useEffect(function(){var g=U.isAttributeEquals(o.current.parentElement,"data-pc-name","avatargroup");_(g)},[]),n.useImperativeHandle(t,function(){return{props:r,getElement:function(){return o.current}}});var R=v({ref:o,style:r.style,className:A(r.className,h("root",{imageFailed:l}))},b.getOtherProps(r),y("root")),C=r.template?O.getJSXElement(r.template,r):x();return n.createElement("div",R,C,r.children)});G.displayName="Avatar";export{G as A};
