import{r as l,L as E,j as e,Y as O,B as g}from"./app-DkDrHmnA.js";import{P as W}from"./chart.esm-B7D5FtcB.js";import{M as A,D}from"./message.esm-JjxY_FWb.js";import{P as L,M}from"./PageContainer-DJWpDb5I.js";import"./index.esm-J_mJuZRe.js";import"./inputtext.esm-BfTgRR7K.js";import"./toast.esm-P3S5sA5A.js";import"./PersonalInformation-ug67P98l.js";import"./inputmask.esm-BKDd5nSr.js";import"./car-BnQ5UupV.js";import"./PersonalInformation-QXa9O11a.js";import"./globalHelper-DnAnK7iK.js";import"./styleclass.esm-BjGkao4e.js";import"./sidebar.esm-D8u1Sg6a.js";import"./ActiveOrder-YaV5mru3.js";import"./inputswitch.esm-jBUhhPbc.js";const R=async p=>{let d=route("admin.getStatics"),c=new Headers;return c.append("X-CSRF-TOKEN",p),c.append("Content-Type","application/json"),await(await fetch(d,{method:"POST",headers:c})).json()};let i;function _({auth:p,csrfToken:d,errors:c,courierIsTransporting:x=!1}){const{layoutConfig:f}=l.useContext(E);l.useState([]);const[v,j]=l.useState(null);l.useState(null);const[N,u]=l.useState(null),[V,y]=l.useState(!1),[n,w]=l.useState({users:{businesses:0,customers:0,couriers:0},orders:{count:0,graph:{thisWeek:[],lastWeek:[]}}}),b=()=>{y(!0),R(d).then(t=>{t.status&&(w(t.statics),i.datasets[0].data=t.statics.orders.graph.thisWeek,i={...i})})};l.useEffect(()=>{b()},[]);const h=[{name:"Bu Hafta",code:"0"},{name:"Geçen Hafta",code:"1"}],S=()=>{u(h[0])},k=t=>{u(t.value),t.value.code==="1"?i.datasets[0].data=n.orders.graph.lastWeek:i.datasets[0].data=n.orders.graph.thisWeek,i={...i}},C=()=>{const t=getComputedStyle(document.documentElement),s=t.getPropertyValue("--primary-color"),a=t.getPropertyValue("--primary-600");return{labels:["Pazartesi","Salı","Çarşamba","Perşembe","Cuma","Cumartesi","Pazar"],datasets:[{label:"Sipariş Adedi",data:[],backgroundColor:[s],hoverBackgroundColor:[a],fill:!0,borderRadius:"3",borderSkipped:"top bottom",barPercentage:.5}]}},m=t=>`/demo/images/dashboard/${t}.svg`;return l.useEffect(()=>{S()},[]),l.useEffect(()=>{const t=getComputedStyle(document.documentElement),s=t.getPropertyValue("--text-color-secondary"),a=t.getPropertyValue("--surface-border");i=C(),j({plugins:{legend:{position:"bottom",align:"end",labels:{color:s}}},responsive:!0,maintainAspectRatio:!1,hover:{mode:"index"},scales:{y:{min:0,ticks:{stepSize:0,color:s},grid:{color:a}},x:{grid:{tickBorderDash:[2,2],display:!0,color:a},ticks:{color:s}}}})},[f]),e.jsx(L,{auth:p,csrfToken:d,errors:c,courierIsTransporting:x,children:e.jsxs(M,{children:[e.jsx(O,{title:"Admin Anasayfa"}),e.jsxs("div",{className:"grid",children:[e.jsx("div",{className:"col-12",children:e.jsx(A,{severity:"info",text:"Admin Anasayfasına Hoşgeldiniz! Veriler Son 14 Güne Ait Verilerdir.",className:"w-full tw-justify-start"})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-shop text-6xl text-blue-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-blue-500 block white-space-nowrap",children:"İşletme Sayısı"}),e.jsxs("span",{className:"text-blue-500 block text-4xl font-bold",children:[n.users.businesses," İşletme"]})]})]}),e.jsx("img",{src:m("users"),className:"w-full",alt:"users"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-car text-6xl text-green-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-green-500 block white-space-nowrap",children:"Kurye Sayısı"}),e.jsxs("span",{className:"text-green-500 block text-4xl font-bold",children:[n.users.couriers," Kurye"]})]})]}),e.jsx("img",{src:m("rate"),className:"w-full",alt:"conversion"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-users text-6xl text-orange-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-orange-500 block white-space-nowrap",children:"Müşteri Sayısı"}),e.jsxs("span",{className:"text-orange-500 block text-4xl font-bold",children:[n.users.customers," Müşteri"]})]})]}),e.jsx("img",{src:m("locations"),className:"w-full",alt:"locations"})]})}),e.jsx("div",{className:"col-12 lg:col-6 xl:col-3",children:e.jsxs("div",{className:"card h-full p-0 overflow-hidden flex flex-column",children:[e.jsxs("div",{className:"flex align-items-center p-3",children:[e.jsx("i",{className:"pi pi-box text-6xl text-purple-500"}),e.jsxs("div",{className:"ml-3",children:[e.jsx("span",{className:"text-purple-500 block white-space-nowrap",children:"Teslim Edilen Sipariş Adedi"}),e.jsx("span",{className:"text-purple-500 block text-4xl font-bold",children:n.orders.count})]})]}),e.jsx("img",{src:m("interactions"),className:"w-full mt-auto",alt:"interactions"})]})}),e.jsx("div",{className:"col-12",children:e.jsxs("div",{className:"card h-full",children:[e.jsxs("div",{className:"flex justify-content-between align-items-center mb-3",children:[e.jsx("h5",{children:"Günlük Sipariş Grafiği"}),e.jsxs("div",{children:[e.jsx(D,{options:h,value:N,onChange:k,optionLabel:"name"}),e.jsx(g,{icon:"pi pi-cloud-download",tooltip:"PNG olarak kaydet",tooltipOptions:{position:"top"},className:"ml-2",severity:"secondary",outlined:!0,onClick:()=>{const t=document.querySelector(".graph canvas"),s=document.createElement("canvas");s.width=t.width,s.height=t.height;const a=s.getContext("2d");if(a){a.fillStyle="white",a.drawImage(t,0,0);const r=document.createElement("a");r.href=s.toDataURL("image/png");let o=Math.random().toString(36).substring(7);r.download=`siparis-grafigi-${o}.png`,r.click()}}}),e.jsx(g,{icon:"pi pi-print",tooltip:"Yazdır",tooltipOptions:{position:"top"},className:"ml-2",severity:"secondary",outlined:!0,onClick:async()=>{const t=document.querySelector(".graph canvas"),s=document.createElement("canvas");s.width=t.width,s.height=t.height,s.style.backgroundColor="#000";const a=s.getContext("2d");if(a){a.drawImage(t,0,0);const r=new Image;r.src=s.toDataURL("image/png",1),await new Promise(P=>{r.onload=P});const o=window.open("");o==null||o.document.write(r.outerHTML),await(o==null?void 0:o.print()),o==null||o.close()}}})]})]}),e.jsx("div",{className:"graph",children:e.jsx(W,{type:"bar",height:"400px",data:i,options:v})})]})})]})]})})}export{_ as default};