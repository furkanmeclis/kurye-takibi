import{C as T,r as i,P as V,d as G,m as K,c as B,L as W,R as Y,j as e,B as k,y as E,Y as U}from"./app-DfiApva1.js";import{P as I,a as X}from"./ProductService-C1fykpYS.js";import{M as z,D as $}from"./message.esm-DXuI6qyr.js";import{T as q,g as J,A as v}from"./ActiveOrder-BV8Zpnbj.js";import{P as Q,M as Z}from"./PageContainer-CItWAE-M.js";import{T as ee}from"./toast.esm-BUIr6eRr.js";import{c as te}from"./globalHelper-B-s3UrsJ.js";import{g as se}from"./PersonalInformation-C0LAfeiM.js";import"./index.esm-CF5HdvGh.js";import"./inputtext.esm-BJSyEN0I.js";import"./sidebar.esm-DYHP3OPq.js";import"./PersonalInformation-D6nBh7q9.js";import"./inputmask.esm-D7RyYABS.js";import"./styleclass.esm-BYWQmj5w.js";function w(s){"@babel/helpers - typeof";return w=typeof Symbol=="function"&&typeof Symbol.iterator=="symbol"?function(t){return typeof t}:function(t){return t&&typeof Symbol=="function"&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},w(s)}function ae(s,t){if(w(s)!=="object"||s===null)return s;var l=s[Symbol.toPrimitive];if(l!==void 0){var a=l.call(s,t||"default");if(w(a)!=="object")return a;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(s)}function re(s){var t=ae(s,"string");return w(t)==="symbol"?t:String(t)}function le(s,t,l){return t=re(t),t in s?Object.defineProperty(s,t,{value:l,enumerable:!0,configurable:!0,writable:!0}):s[t]=l,s}var ne={root:function(t){var l=t.props;return B("p-skeleton p-component",{"p-skeleton-circle":l.shape==="circle","p-skeleton-none":l.animation==="none"})}},ie=`
@layer primereact {
    .p-skeleton {
        position: relative;
        overflow: hidden;
    }
    
    .p-skeleton::after {
        content: "";
        animation: p-skeleton-animation 1.2s infinite;
        height: 100%;
        left: 0;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(-100%);
        z-index: 1;
    }
    
    .p-skeleton-circle {
        border-radius: 50%;
    }
    
    .p-skeleton-none::after {
        animation: none;
    }
}

@keyframes p-skeleton-animation {
    from {
        transform: translateX(-100%);
    }
    to {
        transform: translateX(100%);
    }
}
`,oe={root:{position:"relative"}},O=T.extend({defaultProps:{__TYPE:"Skeleton",shape:"rectangle",size:null,width:"100%",height:"1rem",borderRadius:null,animation:"wave",style:null,className:null},css:{classes:ne,inlineStyles:oe,styles:ie}});function A(s,t){var l=Object.keys(s);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(s);t&&(a=a.filter(function(d){return Object.getOwnPropertyDescriptor(s,d).enumerable})),l.push.apply(l,a)}return l}function R(s){for(var t=1;t<arguments.length;t++){var l=arguments[t]!=null?arguments[t]:{};t%2?A(Object(l),!0).forEach(function(a){le(s,a,l[a])}):Object.getOwnPropertyDescriptors?Object.defineProperties(s,Object.getOwnPropertyDescriptors(l)):A(Object(l)).forEach(function(a){Object.defineProperty(s,a,Object.getOwnPropertyDescriptor(l,a))})}return s}var M=i.memo(i.forwardRef(function(s,t){var l=i.useContext(V),a=O.getProps(s,l),d=O.setMetaData({props:a}),y=d.ptm,S=d.cx,p=d.sx,f=d.isUnstyled;G(O.css.styles,f,{name:"skeleton"});var h=i.useRef(null);i.useImperativeHandle(t,function(){return{props:a,getElement:function(){return h.current}}});var j=a.size?{width:a.size,height:a.size,borderRadius:a.borderRadius}:{width:a.width,height:a.height,borderRadius:a.borderRadius},N=K({ref:h,className:B(a.className,S("root")),style:R(R({},j),p("root")),"aria-hidden":!0},O.getOtherProps(a),y("root"));return i.createElement("div",N)}));M.displayName="Skeleton";const ce=({csrfToken:s})=>{const t=i.useRef(null),[l,a]=i.useState(null),d=10;i.useContext(W);const[y,S]=i.useState(!1),[p,f]=i.useState(!0),[h,j]=i.useState(["","","",""]);i.useState({});const N=()=>{t!=null&&t.current&&(f(!0),te(t==null?void 0:t.current).then(n=>{J(n.latitude,n.longitude,s,d).then(m=>{var b;m.status?(j(m.orders),a(null)):(a(m.message),(b=t==null?void 0:t.current)==null||b.show({severity:"error",summary:"Hata",detail:m.message}))}).catch(m=>{var b;(b=t==null?void 0:t.current)==null||b.show({severity:"error",summary:"Hata",detail:"Siparişler Listelenirken Bir Hata Oluştu"})}).finally(()=>f(!1))}).catch(n=>{f(!1)}))},P=n=>{E.visit(route("courier.orders.reviewOrder",n))};return Y.useEffect(()=>{N()},[t]),e.jsxs(e.Fragment,{children:[e.jsx(ee,{ref:t}),e.jsxs("div",{className:"card h-full",children:[e.jsxs("h6",{className:"flex justify-content-between align-items-center",children:[e.jsxs("span",{children:["Yakın Siparişler(Konuma Göre) ",e.jsx(q,{value:"New",severity:"warning"})]}),e.jsx("div",{className:"flex gap-1",children:e.jsx(k,{icon:"pi pi-refresh",loading:p,tooltip:"Verileri Yenile",tooltipOptions:{position:"top"},onClick:N,raised:!0,size:"small"})})]}),l!==null&&e.jsx(z,{text:l,className:"w-full mb-3",severity:"error"}),y&&e.jsx(z,{text:"Konum Bilgisi Alınamadı",className:"w-full",severity:"error"}),!y&&e.jsxs("ul",{className:"list-none p-0 m-0 relative",children:[p&&Array.from({length:d}).map((n,m)=>e.jsx("li",{className:"mb-2 flex align-items-center",children:e.jsx("div",{className:"w-full",children:e.jsx(M,{width:"100%",height:"2rem"})})},m)),!p&&h.length>0&&e.jsxs("li",{className:"w-full px-2 mb-2 flex align-items-center justify-content-between font-semibold text-sm",children:[e.jsx("span",{className:"flex-1 text-left",children:"İşletme Adı"}),e.jsx("span",{className:"flex-1 text-center",children:"Paket Ücreti"}),e.jsx("span",{className:"flex-1 text-right",children:"İşletmeye Uzaklık"})]}),!p&&h.map((n,m)=>e.jsx("li",{onClick:()=>P(n.id),className:"mb-2 flex hover:text-primary-900 align-items-center hover:bg-primary-300 border-1 border-gray-400 cursor-pointer hover:border-primary transition-all transition-duration-400 h-2rem w-full px-2 py-4 border-round",children:e.jsxs("div",{className:"flex align-items-center justify-content-between w-full",children:[e.jsx("div",{className:"flex-1 font-semibold",children:n.business.name}),e.jsxs("div",{className:"text-center flex-1",children:[n.price," ₺"]}),e.jsxs("div",{className:"text-right flex-1 ",children:[n.distance,e.jsx("span",{className:"font-semibold",children:"km"})]})]})},m)),!p&&h.length===0&&e.jsx("li",{className:"mb-2 flex hover:text-primary-900 align-items-center bg-primary-300 hover:bg-red-400 hover:text-white border-1 hover:border-gray-400 border-primary transition-all transition-duration-400 h-2rem w-full px-2 py-4 border-round",children:e.jsx("div",{className:"flex align-items-center justify-content-center w-full",children:e.jsx("span",{children:"Yakınınızda Sipariş Bulunamadı"})})}),!p&&h.length!==d&&Array.from({length:d-h.length-1}).map((n,m)=>e.jsx("li",{className:"mb-2 flex align-items-center",children:e.jsx("div",{className:"ml-3 w-full h-2rem"})},m))]}),e.jsx(k,{type:"button",loading:p,className:"w-full mt-3",label:"Hepsini Görüntüle",onClick:()=>E.visit(route("courier.orders.newOrders")),icon:"pi pi-arrow-right",iconPos:"right"})]})]})};let c;function we({auth:s,csrfToken:t,errors:l,courierIsTransporting:a=!1}){const{layoutConfig:d}=i.useContext(W),[y,S]=i.useState([]),[p,f]=i.useState(null);i.useState(null);const[h,j]=i.useState(null),[N,P]=i.useState(!1),[n,m]=i.useState({price:0,speed:0,time:0,count:0,graph:{thisWeek:{prices:[],counts:[],times:[]},lastWeek:{prices:[],counts:[],times:[]}}}),b=()=>{P(!0),se(t).then(r=>{r.status&&(m(r.statics),c.datasets[0].data=r.statics.graph.thisWeek.counts,c.datasets[1].data=r.statics.graph.thisWeek.prices,c.datasets[2].data=r.statics.graph.thisWeek.times,c={...c})})};i.useEffect(()=>{b()},[]);const D=[{name:"Bu Hafta",code:"0"},{name:"Geçen Hafta",code:"1"}],L=()=>{j(D[0])},F=r=>{j(r.value),r.value.code==="1"?(c.datasets[0].data=n.graph.lastWeek.counts,c.datasets[1].data=n.graph.lastWeek.prices,c.datasets[2].data=n.graph.lastWeek.times):(c.datasets[0].data=n.graph.thisWeek.counts,c.datasets[1].data=n.graph.thisWeek.prices,c.datasets[2].data=n.graph.thisWeek.times),c={...c}},H=()=>{const r=getComputedStyle(document.documentElement),o=r.getPropertyValue("--primary-color"),u=r.getPropertyValue("--primary-600");return{labels:["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],datasets:[{label:"Sipariş Adedi",data:[],backgroundColor:[o],hoverBackgroundColor:[u],fill:!0,borderRadius:"3",borderSkipped:"top bottom",barPercentage:.5},{label:"Sipariş Ücreti (TL)",data:[],backgroundColor:[r.getPropertyValue("--cyan-300")],hoverBackgroundColor:[r.getPropertyValue("--cyan-600")],fill:!0,borderRadius:"3",borderSkipped:"top bottom",barPercentage:.5},{label:"Sipariş Teslimat Süresi (dk)",data:[],backgroundColor:[r.getPropertyValue("--pink-300")],hoverBackgroundColor:[r.getPropertyValue("--pink-600")],fill:!0,borderRadius:"1",borderSkipped:"top bottom",barPercentage:.5}]}},C=r=>`/demo/images/dashboard/${r}.svg`;return i.useEffect(()=>{L()},[]),i.useEffect(()=>{I.getProductsSmall().then(g=>S(g));const r=getComputedStyle(document.documentElement),o=r.getPropertyValue("--text-color-secondary"),u=r.getPropertyValue("--surface-border");c=H(),f({plugins:{legend:{position:"bottom",align:"end",labels:{color:o}}},responsive:!0,maintainAspectRatio:!1,hover:{mode:"index"},scales:{y:{min:0,ticks:{stepSize:0,color:o},grid:{color:u}},x:{grid:{tickBorderDash:[2,2],display:!0,color:u},ticks:{color:o}}}})},[d]),e.jsx(Q,{auth:s,csrfToken:t,errors:l,courierIsTransporting:a,children:e.jsxs(Z,{children:[e.jsx(U,{title:"Kurye Anasayfa"}),e.jsxs("div",{className:"grid",children:[e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-clock text-6xl text-blue-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-blue-500 block white-space-nowrap",children:"Ortalama Teslimat Süresi"}),e.jsxs("span",{className:"text-blue-500 block text-4xl font-bold",children:[n.time,"dk"]})]})]}),e.jsx("img",{src:C("users"),className:"w-full",alt:"users"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-turkish-lira text-6xl text-orange-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-orange-500 block white-space-nowrap",children:"Elde Edilen Kazanç"}),e.jsxs("span",{className:"text-orange-500 block text-4xl font-bold",children:[n.price," ₺"]})]})]}),e.jsx("img",{src:C("locations"),className:"w-full",alt:"locations"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card h-full p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-box text-6xl text-purple-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-purple-500 block white-space-nowrap",children:"Teslim Edilen Sipariş Adedi"}),e.jsx("span",{className:"text-purple-500 block text-4xl font-bold",children:n.count})]})]}),e.jsx("img",{src:C("interactions"),className:"w-full mt-auto",alt:"interactions"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-bolt text-6xl text-green-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-green-500 block white-space-nowrap",children:"Siparişlerdeki Ortalama Hız"}),e.jsxs("span",{className:"text-green-500 block text-4xl font-bold",children:[n.speed,"km/h "]})]})]}),e.jsx("img",{src:C("rate"),className:"w-full",alt:"conversion"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsx(ce,{csrfToken:t})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card h-full",children:[e.jsx("h5",{children:"Son Siparişler"}),e.jsxs("ul",{className:"list-none p-0 m-0",children:[e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"BÇ",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(101, 214, 173, 0.1)",color:"#27AB83",border:"1px solid #65D6AD"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Behzat Ç"})})]}),e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"AA",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(250, 219, 95, 0.1)",color:"#DE911D",border:"1px solid #FADB5F"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Adile Aydın"})})]}),e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"ECD",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(94, 208, 250, 0.1)",color:"#1992D4",border:"1px solid #5ED0FA"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Emir Can Değril"})})]}),e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"MÇ",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(250, 219, 95, 0.1)",color:"#DE911D",border:"1px solid #FADB5F"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Mehmet Ç"})})]}),e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"FM",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(94, 208, 250, 0.1)",color:"#1992D4",border:"1px solid #5ED0FA"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Furkan Mesal"})})]}),e.jsxs("li",{className:"mb-4 flex align-items-center",children:[e.jsx(v,{label:"MD",size:"large",shape:"circle",className:"text-base font-bold",style:{backgroundColor:"rgba(250, 219, 95, 0.1)",color:"#DE911D",border:"1px solid #FADB5F"}}),e.jsx("div",{className:"ml-3",children:e.jsx("span",{className:"block",children:"Mehmet Duran"})})]})]}),e.jsx(k,{type:"button",className:"w-full mt-3",label:"Hepsini Görüntüle",icon:"pi pi-arrow-right",iconPos:"right"})]})}),e.jsx("div",{className:"col-12 xl:col-6",children:e.jsxs("div",{className:"card h-full",children:[e.jsxs("div",{className:"flex justify-content-between align-items-center mb-3",children:[e.jsx("h5",{children:"Günlük Sipariş Grafiği"}),e.jsxs("div",{children:[e.jsx($,{options:D,value:h,onChange:F,optionLabel:"name"}),e.jsx(k,{icon:"pi pi-cloud-download",tooltip:"PNG olarak kaydet",tooltipOptions:{position:"top"},className:"ml-2",severity:"secondary",outlined:!0,onClick:()=>{const r=document.querySelector(".graph canvas"),o=document.createElement("canvas");o.width=r.width,o.height=r.height;const u=o.getContext("2d");if(u){u.fillStyle="white",u.drawImage(r,0,0);const g=document.createElement("a");g.href=o.toDataURL("image/png");let x=Math.random().toString(36).substring(7);g.download=`siparis-grafigi-${x}.png`,g.click()}}}),e.jsx(k,{icon:"pi pi-print",tooltip:"Yazdır",tooltipOptions:{position:"top"},className:"ml-2",severity:"secondary",outlined:!0,onClick:async()=>{const r=document.querySelector(".graph canvas"),o=document.createElement("canvas");o.width=r.width,o.height=r.height,o.style.backgroundColor="#000";const u=o.getContext("2d");if(u){u.drawImage(r,0,0);const g=new Image;g.src=o.toDataURL("image/png",1),await new Promise(_=>{g.onload=_});const x=window.open("");x==null||x.document.write(g.outerHTML),await(x==null?void 0:x.print()),x==null||x.close()}}})]})]}),e.jsx("div",{className:"graph",children:e.jsx(X,{type:"bar",height:"400px",data:c,options:p})})]})})]})]})})}export{we as default};