import{r as i,u as J,j as e,B as d,c as Q,y as U,R as W,Y as X}from"./app-BF3BFKmb.js";import{P as Z,M as B}from"./PageContainer-DXXM5KLR.js";import{T as L}from"./toast.esm-D3AjItRA.js";import{b as x}from"./globalHelper-B-s3UrsJ.js";import{T as E,O as j,e as ee}from"./ActiveOrder-CujiX_dR.js";import{D as le,M as F}from"./message.esm-BTEKxR-Q.js";import{C as te,D as ae,a as se,T as re}from"./checkbox.esm-Dnt_Q046.js";import{T as ie}from"./tristatecheckbox.esm-CrUDZ1ES.js";import ne from"./Show-RTawMAea.js";import"./PersonalInformation-Bd4Ssrru.js";import"./inputtext.esm-vpht0prC.js";import"./inputmask.esm-Cs3fvM_c.js";import"./PersonalInformation-Ckf9VKu8.js";import"./styleclass.esm-DLAvfRoN.js";import"./index.esm-DSqsHcGN.js";import"./sidebar.esm-B9-iOQgx.js";import"./index.esm-Bbn1rtPI.js";const Se=({auth:b,csrfToken:u,courierIsTransporting:z=!1})=>{var M,P,w,k,C,O,R,A,G;const[c,o]=i.useState(!0),[m,D]=i.useState([]),[r,g]=J(["customer.name","business.name","price","delivered_at","actions"],"CourierOrdersAllTableColumns"),[p,h]=i.useState(null),[I,$]=i.useState([]),y=()=>{o(!0),ee(u).then(l=>{l.status?(D(l.orders.map(t=>({...t,cancellation_accepted:t.cancellation_accepted===1}))),o(!1),h(null)):(h(l.message),o(!1))}).catch(l=>{h(l.message),o(!1)}).finally(()=>o(!1))};i.useEffect(()=>{y()},[]);const v=i.useRef(null),_=i.useRef(null),[a,K]=i.useState(null),[s,q]=i.useState(null);let N=[{expander:!0,style:{width:"3rem"}},{field:"customer.name",header:"Müşteri",hidden:!r.includes("customer.name"),sortable:!0,filter:!0,filterPlaceholder:"Ad'a Göre",body:l=>e.jsx(d,{label:l.customer.name,link:!0,size:"small",severity:"info",onClick:t=>{var n;q(l),(n=_.current)==null||n.toggle(t)}})},{field:"business.name",header:"İşletme",hidden:!r.includes("business.name"),sortable:!0,filter:!0,filterPlaceholder:"İşletmeye'a Göre",body:l=>e.jsx(d,{label:l.business.name,link:!0,size:"small",severity:"help",onClick:t=>{var n;K(l.business),(n=v.current)==null||n.toggle(t)}})},{field:"customer_note",header:"Sipariş Notu",hidden:!r.includes("customer_note"),sortable:!0,filter:!0,filterPlaceholder:"Sipariş Notu'na Göre",body:l=>l.customer_note?e.jsx("span",{children:l.customer_note}):e.jsx("span",{children:e.jsx("i",{className:"pi pi-ban text-red-400"})})},{field:"price",header:"Paket Ücreti",hidden:!r.includes("price"),sortable:!0,filter:!0,filterPlaceholder:"Fiyata'a Göre",body:l=>e.jsxs("span",{children:[l.price," ₺"]})},{field:"status",header:"Sipariş Durumu",hidden:!r.includes("status"),sortable:!0,filter:!0,filterElement:l=>e.jsx(le,{options:x("draft",!0),value:l.value,filter:!0,filterBy:"label,value",onChange:t=>l.filterApplyCallback(t.value),itemTemplate:t=>e.jsx(E,{value:t.label,severity:t.severity}),placeholder:"Sipariş Durumu",className:"p-column-filter w-full",showClear:!0}),body:l=>e.jsx(E,{value:String(x(l.status).label),severity:String(x(l.status).severity)})},{field:"courier_accepted_at",header:"Kurye Teslim Alma Tarihi",hidden:!r.includes("courier_accepted_at"),sortable:!0,filter:!0,filterPlaceholder:"Kurye Teslim Alma Tarihine Göre",filterType:"date",body:l=>l.courier_accepted_at?e.jsx("span",{children:new Date(l.courier_accepted_at).toLocaleString()}):e.jsxs("span",{children:[e.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Alınmadı"]})},{field:"delivered_at",header:"Teslim Tarihi",hidden:!r.includes("delivered_at"),sortable:!0,filter:!0,filterPlaceholder:"Teslim Tarihine Göre",filterType:"date",body:l=>l.delivered_at?e.jsx("span",{children:new Date(l.delivered_at).toLocaleString()}):e.jsxs("span",{children:[e.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Edilmedi"]})},{field:"cancellation_accepted",header:"İptal Onayı",hidden:!r.includes("cancellation_accepted"),sortable:!0,filter:!0,dataType:"boolean",filterElement:l=>e.jsx(ie,{value:l.value,onChange:t=>l.filterApplyCallback(t.value)}),body:l=>e.jsx("i",{className:Q("pi",{"pi-check-circle text-green-400":l.cancellation_accepted,"pi-times-circle text-red-400":!l.cancellation_accepted})})},{field:"canceled_at",header:"İptal Tarihi",hidden:!r.includes("canceled_at"),sortable:!0,filter:!0,filterPlaceholder:"İptal Tarihine Göre",filterType:"date",body:l=>l.canceled_at?e.jsx("span",{children:new Date(l.canceled_at).toLocaleString()}):e.jsxs("span",{children:[e.jsx("i",{className:"pi pi-ban text-red-400"})," İptal Edilmedi"]})},{field:"created_at",header:"Eklenme Tarihi",hidden:!r.includes("created_at"),sortable:!0,filter:!0,filterPlaceholder:"Eklenme Tarihine Göre",filterType:"date",body:l=>e.jsx("span",{children:new Date(l.created_at).toLocaleString()})},{field:"updated_at",header:"Güncelleme Tarihi",hidden:!r.includes("updated_at"),sortable:!0,filter:!0,filterPlaceholder:"Güncellenme Tarihine Göre",filterType:"date",body:l=>e.jsx("span",{children:new Date(l.updated_at).toLocaleString()})},{field:"actions",header:"İşlemler",hidden:!r.includes("actions"),body:l=>e.jsx("div",{className:"flex gap-2",children:e.jsx(d,{size:"small",icon:"pi pi-eye",severity:"info",tooltip:"Görüntüle",loading:c,tooltipOptions:{position:"top"},onClick:()=>{U.visit(route("courier.orders.show",l.id))}})})}];const T=i.useRef(null),Y=()=>e.jsx(e.Fragment,{children:e.jsx(re,{end:e.jsxs(e.Fragment,{children:[e.jsx(d,{size:"small",icon:"pi pi-sync",severity:"help",className:"mr-2",tooltip:"Verileri Yenile",tooltipOptions:{position:"top"},onClick:()=>{y()}}),e.jsx(d,{size:"small",icon:"pi pi-bars",onClick:l=>{var t;(t=T.current)==null||t.toggle(l)}})]})})}),S=W.useRef(null);return e.jsxs(Z,{auth:b,csrfToken:u,courierIsTransporting:z,children:[e.jsx(L,{ref:S}),e.jsxs(B,{children:[e.jsx(X,{title:"Siparişler"}),e.jsx(L,{ref:S}),e.jsxs(j,{ref:T,showCloseIcon:!0,style:{width:"300px"},children:[e.jsx("div",{className:"flex align-items-center justify-content-start mb-3",children:e.jsxs("span",{className:"text-900 text-lg font-bold",children:["Sütunlar (",r.length,")"]})}),e.jsx("div",{className:"flex flex-column justify-content-center gap-2",children:N.map((l,t)=>{if(l.selectionMode==="multiple"||(l==null?void 0:l.expander)!==void 0)return null;let n=l.header,f=l.field;return e.jsxs("div",{className:"flex align-items-center",children:[e.jsx(te,{inputId:`column${t}`,checked:r.includes(f),onChange:H=>{H.checked?g([...r,f]):g(r.filter(V=>V!==f))}}),e.jsx("label",{htmlFor:`column${t}`,className:"ml-2",children:n})]},t)})})]}),e.jsx(j,{ref:v,showCloseIcon:!0,style:{width:300},children:a!==null&&e.jsxs(e.Fragment,{children:[e.jsxs("ul",{className:"m-0 px-3 list-none",children:[e.jsxs("li",{children:["İşletme Adı: ",e.jsx("span",{className:"font-semibold",children:a==null?void 0:a.name})]}),e.jsxs("li",{children:["İşletme Telefon No: ",e.jsx("span",{className:"font-semibold",children:a==null?void 0:a.phone})]}),e.jsxs("li",{children:["İşletme İl: ",e.jsx("span",{className:"font-semibold",children:(M=a==null?void 0:a.details)==null?void 0:M.city})]}),e.jsxs("li",{children:["İşletme İlçe: ",e.jsx("span",{className:"font-semibold",children:(P=a==null?void 0:a.details)==null?void 0:P.state})]}),e.jsxs("li",{children:["İşletme Adres: ",e.jsx("span",{className:"font-semibold",children:(w=a==null?void 0:a.details)==null?void 0:w.address})]})]}),e.jsx(d,{label:"Google Maps'te Aç",size:"small",icon:"pi pi-external-link",severity:"help",className:"w-full mt-2",onClick:()=>{var l,t;window.open(`https://www.google.com/maps/search/?api=1&query=${(l=a==null?void 0:a.details)==null?void 0:l.latitude},${(t=a==null?void 0:a.details)==null?void 0:t.longitude}`,"_blank")}})]})}),e.jsx(j,{ref:_,showCloseIcon:!0,style:{width:300},children:s!==null&&e.jsx(e.Fragment,{children:e.jsxs("ul",{className:"m-0 px-3 list-none",children:[e.jsxs("li",{children:["Müşteri Adı: ",e.jsx("span",{className:"font-semibold",children:(k=s==null?void 0:s.customer)==null?void 0:k.name})]}),e.jsxs("li",{children:["Müşteri Telefon No: ",e.jsx("span",{className:"font-semibold",children:(C=s==null?void 0:s.address)==null?void 0:C.phone})]}),e.jsxs("li",{children:["Müşteri İl: ",e.jsx("span",{className:"font-semibold",children:(O=s==null?void 0:s.address)==null?void 0:O.city})]}),e.jsxs("li",{children:["Müşteri İlçe: ",e.jsx("span",{className:"font-semibold",children:(R=s==null?void 0:s.address)==null?void 0:R.district})]}),e.jsxs("li",{children:["Müşteri Adres: ",e.jsx("span",{className:"font-semibold",children:(A=s==null?void 0:s.address)==null?void 0:A.address})]}),e.jsxs("li",{children:["Müşteri Adres Notu: ",e.jsx("span",{className:"font-semibold",children:(G=s==null?void 0:s.address)==null?void 0:G.notes})]})]})})}),e.jsxs("div",{className:"card",children:[e.jsx("span",{className:"text-900 text-xl font-bold mb-4 block",children:"Siparişler"}),p!==null&&e.jsx(F,{className:"w-full",severity:"error",text:p}),!c&&m.length===0&&e.jsx(F,{className:"w-full",severity:"info",text:"Sipariş bulunamadı."}),e.jsx(ae,{hidden:!c&&m.length===0||p!==null,loading:c,value:m,removableSort:!0,paginator:!0,filterDisplay:"row",paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],rows:10,dataKey:"id",header:Y,expandedRows:I,onRowToggle:l=>$(l==null?void 0:l.data),rowExpansionTemplate:l=>e.jsx(ne,{page:!1,orderId:l.id,csrfToken:u,auth:b}),filters:{"customer.name":{value:null,matchMode:"contains"},"customer.phone":{value:null,matchMode:"contains"},created_at:{value:null,matchMode:"contains"},updated_at:{value:null,matchMode:"contains"},"business.name":{value:null,matchMode:"contains"},status:{value:null,matchMode:"contains"},courier_accepted_at:{value:null,matchMode:"contains"},delivered_at:{value:null,matchMode:"contains"},canceled_at:{value:null,matchMode:"contains"},cancellation_reason:{value:null,matchMode:"contains"},price:{value:null,matchMode:"contains"},customer_note:{value:null,matchMode:"contains"},cancellation_accepted:{value:null,matchMode:"equals"}},emptyMessage:"Sipariş bulunamadı.",currentPageReportTemplate:"{first}. ile {last}. arası toplam {totalRecords} kayıttan",children:N.map((l,t)=>e.jsx(se,{...l},t))})]})]})]})};export{Se as default};