import{C as F,c as C,r as o,P as U,O as h,e as H,m as d,D as P,v as ee,h as te,n as ne,T as re}from"./app-Cod1tdKg.js";import{C as oe}from"./toast.esm-DuSPMk8X.js";var O=F.extend({defaultProps:{__TYPE:"Toolbar",id:null,style:null,className:null,left:null,right:null,start:null,center:null,end:null,children:void 0},css:{classes:{root:function(t){var r=t.props;return C("p-toolbar p-component",r.className)},start:"p-toolbar-group-start p-toolbar-group-left",center:"p-toolbar-group-center",end:"p-toolbar-group-end p-toolbar-group-right"},styles:`
        @layer primereact {
            .p-toolbar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-wrap: wrap;
            }
            
            .p-toolbar-group-start,
            .p-toolbar-group-center,
            .p-toolbar-group-end {
                display: flex;
                align-items: center;
            }
            
            .p-toolbar-group-left,
            .p-toolbar-group-right {
                display: flex;
                align-items: center;
            }
        }
        `}}),ae=o.memo(o.forwardRef(function(n,t){var r=o.useContext(U),e=O.getProps(n,r),c=o.useRef(null),b=h.getJSXElement(e.left||e.start,e),p=h.getJSXElement(e.center,e),m=h.getJSXElement(e.right||e.end,e),s=O.setMetaData({props:e}),l=s.ptm,f=s.cx,E=s.isUnstyled;H(O.css.styles,E,{name:"toolbar"}),o.useImperativeHandle(t,function(){return{props:e,getElement:function(){return c.current}}});var v=d({className:f("start")},l("start")),u=d({className:f("center")},l("center")),k=d({className:f("end")},l("end")),w=d({id:e.id,ref:c,style:e.style,className:f("root"),role:"toolbar"},O.getOtherProps(e),l("root"));return o.createElement("div",w,o.createElement("div",v,b),o.createElement("div",u,p),o.createElement("div",k,m))}));ae.displayName="Toolbar";function g(){return g=Object.assign?Object.assign.bind():function(n){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var e in r)Object.prototype.hasOwnProperty.call(r,e)&&(n[e]=r[e])}return n},g.apply(this,arguments)}function x(n){"@babel/helpers - typeof";return x=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},x(n)}function le(n,t){if(x(n)!=="object"||n===null)return n;var r=n[Symbol.toPrimitive];if(r!==void 0){var e=r.call(n,t||"default");if(x(e)!=="object")return e;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(n)}function ce(n){var t=le(n,"string");return x(t)==="symbol"?t:String(t)}function se(n,t,r){return t=ce(t),t in n?Object.defineProperty(n,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):n[t]=r,n}function ue(n){if(Array.isArray(n))return n}function ie(n,t){var r=n==null?null:typeof Symbol<"u"&&n[Symbol.iterator]||n["@@iterator"];if(r!=null){var e,c,b,p,m=[],s=!0,l=!1;try{if(b=(r=r.call(n)).next,t!==0)for(;!(s=(e=b.call(r)).done)&&(m.push(e.value),m.length!==t);s=!0);}catch(f){l=!0,c=f}finally{try{if(!s&&r.return!=null&&(p=r.return(),Object(p)!==p))return}finally{if(l)throw c}}return m}}function M(n,t){(t==null||t>n.length)&&(t=n.length);for(var r=0,e=new Array(t);r<t;r++)e[r]=n[r];return e}function pe(n,t){if(n){if(typeof n=="string")return M(n,t);var r=Object.prototype.toString.call(n).slice(8,-1);if(r==="Object"&&n.constructor&&(r=n.constructor.name),r==="Map"||r==="Set")return Array.from(n);if(r==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r))return M(n,t)}}function fe(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}function de(n,t){return ue(n)||ie(n,t)||pe(n,t)||fe()}var me={icon:"p-checkbox-icon p-c",input:function(t){var r=t.props,e=t.checked,c=t.focusedState;return C("p-checkbox-box",{"p-highlight":e,"p-disabled":r.disabled,"p-focus":c})},root:function(t){var r=t.props,e=t.checked,c=t.focusedState;return C("p-checkbox p-component",{"p-checkbox-checked":e,"p-checkbox-disabled":r.disabled,"p-checkbox-focused":c})}},be=`
.p-checkbox {
    display: inline-flex;
    cursor: pointer;
    user-select: none;
    vertical-align: bottom;
    position: relative;
}

.p-checkbox.p-checkbox-disabled {
    cursor: auto;
}

.p-checkbox-box {
    display: flex;
    justify-content: center;
    align-items: center;
}        
`,S=F.extend({defaultProps:{__TYPE:"Checkbox",autoFocus:!1,checked:!1,className:null,disabled:!1,falseValue:!1,icon:null,id:null,inputId:null,inputRef:null,name:null,onChange:null,onClick:null,onContextMenu:null,onMouseDown:null,readOnly:!1,required:!1,style:null,tabIndex:null,tooltip:null,tooltipOptions:null,trueValue:!0,value:null,children:void 0},css:{classes:me,styles:be}});function A(n,t){var r=Object.keys(n);if(Object.getOwnPropertySymbols){var e=Object.getOwnPropertySymbols(n);t&&(e=e.filter(function(c){return Object.getOwnPropertyDescriptor(n,c).enumerable})),r.push.apply(r,e)}return r}function B(n){for(var t=1;t<arguments.length;t++){var r=arguments[t]!=null?arguments[t]:{};t%2?A(Object(r),!0).forEach(function(e){se(n,e,r[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(n,Object.getOwnPropertyDescriptors(r)):A(Object(r)).forEach(function(e){Object.defineProperty(n,e,Object.getOwnPropertyDescriptor(r,e))})}return n}var ye=o.memo(o.forwardRef(function(n,t){var r=o.useContext(U),e=S.getProps(n,r),c=o.useState(!1),b=de(c,2),p=b[0],m=b[1],s=S.setMetaData({props:e,state:{focused:p},context:{checked:e.checked===e.trueValue,disabled:e.disabled}}),l=s.ptm,f=s.cx,E=s.isUnstyled;H(S.css.styles,E,{name:"checkbox",styled:!0});var v=o.useRef(null),u=o.useRef(e.inputRef),k=function(a){if(!(e.disabled||e.readOnly)&&(e.onChange||e.onClick)){var R=j(),z=a.target instanceof HTMLDivElement||a.target instanceof HTMLSpanElement||a.target instanceof Object,G=a.target===u.current,Q=z&&a.target.checked!==R;if(G||Q){var T=R?e.falseValue:e.trueValue,N={originalEvent:a,value:e.value,checked:T,stopPropagation:function(){a.stopPropagation()},preventDefault:function(){a.preventDefault()},target:{type:"checkbox",name:e.name,id:e.id,value:e.value,checked:T}};if(e.onClick&&e.onClick(N),a.defaultPrevented)return;e.onChange&&e.onChange(N)}P.focus(u.current),a.preventDefault()}},w=function(){m(!0)},I=function(){m(!1)},K=function(a){(a.code==="Space"||a.key===" ")&&k(a)},j=function(){return e.checked===e.trueValue};o.useImperativeHandle(t,function(){return{props:e,focus:function(){return P.focus(u.current)},getElement:function(){return v.current},getInput:function(){return u.current}}}),o.useEffect(function(){h.combinedRefs(u,e.inputRef)},[u,e.inputRef]),ee(function(){u.current.checked=j()},[e.checked,e.trueValue]),te(function(){e.autoFocus&&P.focus(u.current,e.autoFocus)});var y=j(),V=h.isNotEmpty(e.tooltip),D=S.getOtherProps(e),$=h.reduceKeys(D,P.ARIA_PROPS),_=d({className:f("icon")},l("icon")),J=y?e.icon||o.createElement(oe,_):null,X=ne.getJSXIcon(J,B({},_),{props:e,checked:y}),q=d({id:e.id,className:C(e.className,f("root",{checked:y,focusedState:p})),style:e.style,onClick:function(a){return k(a)},onContextMenu:e.onContextMenu,onMouseDown:e.onMouseDown},D,l("root")),L=d({className:"p-hidden-accessible"},l("hiddenInputWrapper")),W=d(B({id:e.inputId,type:"checkbox",name:e.name,tabIndex:e.tabIndex,defaultChecked:y,onFocus:function(a){return w()},onBlur:function(a){return I()},onKeyDown:function(a){return K(a)},disabled:e.disabled,readOnly:e.readOnly,required:e.required},$),l("hiddenInput")),Y=d({className:f("input",{checked:y,focusedState:p}),"data-p-highlight":y,"data-p-disabled":e.disabled,"data-p-focus":p},l("input"));return o.createElement(o.Fragment,null,o.createElement("div",g({ref:v},q),o.createElement("div",L,o.createElement("input",g({ref:u},W))),o.createElement("div",Y,X)),V&&o.createElement(re,g({target:v,content:e.tooltip},e.tooltipOptions,{pt:l("tooltip")})))}));ye.displayName="Checkbox";export{ye as C,ae as T};
