import{R as H,r as n,j as e,Y as L,B as g,c as a}from"./app-DfiApva1.js";import{P as I,M as V}from"./PageContainer-CItWAE-M.js";import{c as Y,a as y,b as R,u as T,I as q}from"./inputtext.esm-BJSyEN0I.js";import{T as Z}from"./toast.esm-BUIr6eRr.js";import{g as G,b as U}from"./customer-CjbiwGLN.js";import{D as S,I as k}from"./message.esm-DXuI6qyr.js";import J from"./Create-D2rknrfW.js";import{D as Q}from"./ActiveOrder-BV8Zpnbj.js";import{a as W}from"./orders-BQDg4cK4.js";import"./PersonalInformation-C0LAfeiM.js";import"./inputmask.esm-D7RyYABS.js";import"./PersonalInformation-D6nBh7q9.js";import"./globalHelper-B-s3UrsJ.js";import"./styleclass.esm-BYWQmj5w.js";import"./index.esm-CF5HdvGh.js";import"./sidebar.esm-DYHP3OPq.js";const ge=({auth:j,csrfToken:u})=>{const c=H.useRef(null),[x,m]=n.useState(!1),[A,z]=n.useState([]),[w,h]=n.useState(!1),[f,v]=n.useState([]),[b,M]=n.useState(!1),O=Y().shape({customer_id:y().required("Müşteri Seçimi Zorunludur"),address_id:y().required("Adres Seçimi Zorunludur"),customer_note:R().nullable().min(3,"Müşteri Notu En Az 3 Karakter Olmalıdır").max(255,"Müşteri Notu En Fazla 255 Karakter Olmalıdır"),price:y().required().min(1,"Paket Ücreti En Az 1 TL Olmalıdır")}),_=()=>{m(!0),G(u).then(t=>{t.status&&z(t.customers.map(i=>({...i,namePhone:`${i.name} - ${i.phone}`})))}).catch(t=>{var i;console.error(t),(i=c.current)==null||i.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu lütfen tekrar deneyiniz."})}).finally(()=>m(!1))},B=t=>{m(!0),U(t,u).then(i=>{i.status&&v(i.addresses.map(d=>({...d,titleCityDistrict:`${d.title} - ${d.city} - ${d.district}`})))}).catch(i=>{var d;console.error(i),(d=c.current)==null||d.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu lütfen tekrar deneyiniz."})}).finally(()=>m(!1))},{values:l,setFieldValue:r,resetForm:N,submitCount:o,setErrors:X,handleChange:E,handleSubmit:F,errors:s,isValid:$,dirty:ee}=T({initialValues:{customer_note:"",selectedCustomer:null,customer_id:null,selectedAddress:null,address_id:null,location:null,price:0},validationSchema:O,validateOnBlur:b,validateOnChange:b,onSubmit:t=>{m(!0),W({customer_id:t.customer_id,address_id:t.address_id,customer_note:t.customer_note,location:t.location!==null?t.location:null,price:t.price},u).then(i=>{var d,C;i.status?((d=c.current)==null||d.show({severity:"success",summary:"Başarılı",detail:i.message}),N()):(C=c.current)==null||C.show({severity:"error",summary:"Hata",detail:i.message})}).catch(()=>{var i;(i=c.current)==null||i.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu lütfen tekrar deneyiniz."})}).finally(()=>{m(!1)})}}),[P,p]=n.useState(!1),K=()=>{var t;p(!0),navigator.geolocation?navigator.geolocation.getCurrentPosition(i=>{console.log(i),p(!1),N({values:{...l,location:{latitude:i.coords.latitude,longitude:i.coords.longitude}}})},i=>{console.error(i),p(!1)},{enableHighAccuracy:!0,timeout:1e4,maximumAge:0}):(p(!1),(t=c.current)==null||t.show({severity:"error",summary:"Hata",detail:"Tarayıcınız konum servislerini desteklemiyor."}))};n.useEffect(()=>{_()},[]),n.useEffect(()=>{o>0&&M(!0)},[o]);const D=t=>`${t.city} - ${t.district} - ${t.phone} - ${t.address}`;return e.jsx(I,{auth:j,csrfToken:u,children:e.jsxs(V,{children:[e.jsx(L,{title:"Yeni Sipariş Ekle"}),e.jsx(Z,{ref:c}),e.jsxs("div",{className:"card",children:[e.jsx("span",{className:"text-900 text-xl font-bold mb-4 block",children:"Yeni Sipariş Ekle"}),e.jsxs("div",{className:"grid",children:[e.jsxs("div",{className:"col-12 lg:col-2",children:[e.jsx("div",{className:"text-900 font-medium text-xl mb-3",children:"Sipariş Bilgileri"}),e.jsxs("p",{className:"m-0 p-0 text-600 line-height-3 mr-3",children:["Konumunuza en yakın kuryeyi bulmak için lütfen sipariş bilgilerini eksiksiz doldurunuz.",e.jsxs("div",{className:"flex gap-2",children:[e.jsx(g,{icon:"pi pi-map-marker",size:"small",severity:l.location!==null?"success":"info",tooltipOptions:{position:"top"},onClick:K,loading:P,disabled:l.location!==null,tooltip:l.location!==null?"Konum Kullanılıyor":"Konumumu Kullan",className:"mt-3"}),e.jsx(g,{icon:"pi pi-user-plus",size:"small",onClick:()=>h(!0),tooltipOptions:{position:"top"},tooltip:"Yeni Müşteri Ekle",className:"mt-3"})]}),s&&Object.keys(s).length>0&&e.jsx(e.Fragment,{children:e.jsx("ul",{className:"mt-3",children:Object.keys(s).map((t,i)=>e.jsx("li",{className:"text-red-500 text-sm",children:s[t]},i))})})]})]}),e.jsx("div",{className:"col-12 lg:col-10",children:e.jsxs("form",{onSubmit:F,className:"grid formgrid p-fluid",children:[e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"customer_id",className:a("font-medium text-900",{"text-red-500":!!s.customer_id,"text-green-500":!s.customer_id&&o>0}),children:[e.jsx("i",{className:a("pi",{"pi-times-circle text-red-500 text-sm":!!s.customer_id,"pi-check-circle text-green-500 text-sm":!s.customer_id&&o>0})})," Müşteri Seçimi"]}),e.jsx(S,{value:l.selectedCustomer,onChange:t=>{t.value===void 0?(r("selectedCustomer",null),r("customer_id",null),r("selectedAddress",null),r("address_id",null),v([])):(r("selectedCustomer",t.value),r("customer_id",t.value.id),r("selectedAddress",null),r("address_id",null),B(t.value.id))},options:A,optionLabel:"namePhone",inputId:"customer_id",placeholder:"Müşteri Seçiniz",className:a("w-full",{"p-invalid":!!s.customer_id}),filter:!0,virtualScrollerOptions:{itemSize:38},emptyMessage:"Müşteri Bulunamadı",emptyFilterMessage:"Müşteri Bulunamadı",filterBy:"namePhone"})]}),e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"address_id",className:a("font-medium text-900",{"text-red-500":!!s.address_id,"text-green-500":!s.address_id&&o>0}),children:[e.jsx("i",{className:a("pi",{"pi-times-circle text-red-500 text-sm":!!s.address_id,"pi-check-circle text-green-500 text-sm":!s.address_id&&o>0})})," Adres Seçimi ",l.selectedCustomer!==null&&f.length===0&&e.jsx("span",{className:"text-red-400",children:"(Müşteriye ait adres bulunamadı)"})]}),e.jsx(S,{value:l.selectedAddress,onChange:t=>{t.value===void 0?(r("selectedAddress",null),r("address_id",null)):(r("selectedAddress",t.value),r("address_id",t.value.id))},disabled:l.selectedCustomer===null||f.length===0,options:f,optionLabel:"titleCityDistrict",inputId:"address_id",placeholder:"Adres Seçiniz",className:a("w-full",{"p-invalid":!!s.address_id}),filter:!0,virtualScrollerOptions:{itemSize:38},emptyMessage:"Adres Bulunamadı",emptyFilterMessage:"Adres Bulunamadı",filterBy:"titleCityDistrict"})]}),l.selectedAddress!==null&&e.jsxs("div",{className:"field mb-4 col-12 p-input-icon-right",children:[e.jsx("label",{htmlFor:"address",className:a("font-medium text-900"),children:"Seçilen Adres"}),e.jsx(k,{disabled:!0,readOnly:!0,value:l.address_id!==null?D(l.selectedAddress):""})]}),e.jsxs("div",{className:"field mb-4 col-12 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"price",className:a("font-medium text-900",{"text-red-500":!!s.price,"text-green-500":!s.price&&o>0}),children:[e.jsx("i",{className:a("pi",{"pi-times-circle text-red-500 text-sm":!!s.price,"pi-check-circle text-green-500 text-sm":!s.price&&o>0})})," Paket Ücreti(Kuryeye Ödenecek Miktar)"]}),e.jsx(q,{autoComplete:"off",type:"number",name:"price",id:"price",min:0,tooltip:s==null?void 0:s.price,tooltipOptions:{position:"top"},disabled:x,onChange:t=>{r("price",Number(t.target.value))},value:String(l.price),className:a("w-full",{"p-invalid":!!s.price})})]}),e.jsxs("div",{className:"field mb-4 col-12 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"customer_note",className:a("font-medium text-900",{"text-red-500":!!s.customer_note,"text-green-500":!s.customer_note&&o>0}),children:[e.jsx("i",{className:a("pi",{"pi-times-circle text-red-500 text-sm":!!s.customer_note,"pi-check-circle text-green-500 text-sm":!s.customer_note&&o>0})})," Sipariş Notu"]}),e.jsx(k,{autoComplete:"off",name:"customer_note",id:"customer_note",tooltip:s==null?void 0:s.customer_note,tooltipOptions:{position:"top"},disabled:x,onChange:E,value:l.customer_note,className:a("w-full",{"p-invalid":!!s.customer_note})})]}),e.jsx("div",{className:"col-12",children:e.jsx(g,{label:"Sipariş Oluştur",disabled:!$,loading:x,type:"submit",size:"small",className:"w-auto mt-3"})})]})})]})]}),e.jsx(Q,{onHide:()=>h(!1),visible:w,header:"Yeni Müşteri Ekle",style:{width:"60vw"},draggable:!1,resizable:!1,className:"mx-3 sm:mx-0 sm:w-full md:w-8 lg:w-8 p-fluid",modal:!0,children:e.jsx(J,{auth:j,csrfToken:u,page:!1,onComplete:()=>{h(!1),_()}})})]})})};export{ge as default};