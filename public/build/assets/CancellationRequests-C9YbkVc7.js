import{r as u,u as A,R as j,j as t,c as E,B as h,Y as K,a as C}from"./app-Cz1wM2Ku.js";import{P as z,M as q}from"./PageContainer-DJG3v_18.js";import{T as B}from"./toast.esm-BGKCNESB.js";import{D as F,C as H}from"./column.esm-CeKb-KL5.js";import{D as Y,M as N}from"./message.esm-DSJryyI1.js";import{C as V,T as I}from"./checkbox.esm-DDWvEIGg.js";import{O as M}from"./ActiveOrder-BrJTkzYz.js";import{T as $}from"./tristatecheckbox.esm-B47Hw_sm.js";import{a as w,b as J,r as Q}from"./orders-BrC4TbtR.js";import"./PersonalInformation-ruxl53Cc.js";import"./inputtext.esm-BW5A2pUy.js";import"./inputmask.esm-BYwzNqTj.js";import"./car-BnQ5UupV.js";import"./PersonalInformation-nMHLJyes.js";import"./globalHelper-CVidrI5v.js";import"./styleclass.esm-BmQ94-od.js";import"./sidebar.esm-Clh2rVGC.js";import"./index.esm-DJdW5Zr2.js";import"./inputswitch.esm-DCJ4T6jS.js";import"./index.esm-eqJNNugQ.js";const fe=({auth:k,csrfToken:p,flash:c})=>{const[f,i]=u.useState(!0),[y,S]=u.useState([]);u.useState([]);const[l,g]=A(["name","email","phone","created_at","actions"],"adminOrdersCancellationColumns"),[x,b]=u.useState(null),_=j.useRef(null),[O,v]=u.useState(""),m=()=>{i(!0),w(p).then(e=>{e.status?(S(e.orders.map(a=>({...a,cancellation_accepted:a.cancellation_accepted===1,cancellation_rejected:a.cancellation_rejected===1}))),i(!1),b(null)):(b(e.message),i(!1))}).catch(e=>{b(e.message),i(!1)}).finally(()=>i(!1))};u.useEffect(()=>{var e;m(),c!=null&&c.message&&((e=s.current)==null||e.show({severity:(c==null?void 0:c.type)??"info",summary:c.title,detail:c.message??""}))},[]);const R=(e,a)=>{C({target:e.currentTarget,message:"Sipariş İptalini Onaylamak İstediğinize Emin Misiniz?",acceptLabel:"Onayla",acceptClassName:"p-button-success",rejectLabel:"Vazgeç",accept(){i(!0),J(a,p).then(({status:n,message:r})=>{var d,o;n?(m(),(d=s.current)==null||d.show({severity:"success",summary:"Başarılı",detail:r})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:r})}).catch(n=>{var r;(r=s.current)==null||r.show({severity:"error",summary:"Hata",detail:n.message})}).finally(()=>i(!1))}})},L=(e,a)=>{C({target:e.currentTarget,message:"Sipariş İptalini Reddetmek İstediğinize Emin Misiniz?",acceptLabel:"Reddet",acceptClassName:"p-button-danger",rejectLabel:"Vazgeç",accept(){i(!0),Q(a,p).then(({status:n,message:r})=>{var d,o;n?(m(),(d=s.current)==null||d.show({severity:"success",summary:"Başarılı",detail:r})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:r})}).catch(n=>{var r;(r=s.current)==null||r.show({severity:"error",summary:"Hata",detail:n.message})}).finally(()=>i(!1))}})};let T=[{field:"business.name",header:"Ad(İşletme)",hidden:!l.includes("business.name"),sortable:!0,filter:!0,filterPlaceholder:"Ad(İşletme)'a Göre"},{field:"business.phone",header:"İşletme Telefon Numarası",hidden:!l.includes("business.phone"),sortable:!0,filter:!0,filterPlaceholder:"İşletme Telefon Numarası'na Göre"},{field:"customer.name",header:"Ad(Müşteri)",hidden:!l.includes("customer.name"),sortable:!0,filter:!0,filterPlaceholder:"Ad(Müşteri)'a Göre"},{field:"customer.phone",header:"Müşteri Telefon Numarası",hidden:!l.includes("customer.phone"),sortable:!0,filter:!0,filterPlaceholder:"Müşteri Telefon Numarası'na Göre"},{field:"courier.name",header:"Ad(Kurye)",hidden:!l.includes("courier.name"),sortable:!0,filter:!0,filterPlaceholder:"Ad(Kurye)'a Göre",body:e=>t.jsx("span",{children:e.courier?e.courier.name:t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-exclamation-circle text-red-400"})," Kurye Atanmamış"]})})},{field:"courier.phone",header:"Kurye Telefon Numarası",hidden:!l.includes("courier.phone"),sortable:!0,filter:!0,filterPlaceholder:"Kurye Telefon Numarası'na Göre",body:e=>t.jsx("span",{children:e.courier?e.courier.phone:t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-exclamation-circle text-red-400"})," Kurye Atanmamış"]})})},{field:"price",header:"Paket Ücreti",hidden:!l.includes("price"),sortable:!0,filter:!0,filterPlaceholder:"Fiyata'a Göre",body:e=>t.jsxs("span",{children:[e.price," ₺"]})},{field:"cancellation_accepted",header:"İptal Durumu",hidden:!l.includes("cancellation_accepted"),sortable:!0,filter:!0,dataType:"boolean",filterElement:e=>t.jsx($,{value:e.value,onChange:a=>e.filterApplyCallback(a.value)}),body:e=>t.jsxs("span",{children:[t.jsx("i",{className:E("pi",{"pi-check-circle text-green-400":e.cancellation_accepted&&e.status==="canceled","pi-times-circle text-red-400":!e.cancellation_accepted&&e.status==="canceled"&&e.cancellation_rejected,"pi-hourglass text-yellow-400":e.status==="canceled"&&!e.cancellation_rejected&&!e.cancellation_accepted})})," ",e.cancellation_accepted?"Onaylandı":e.cancellation_rejected?"Reddedildi":"Onay Bekliyor"]})},{field:"cancellation_accepted_by.name",header:"İptali İşleyen Yetkili",hidden:!l.includes("cancellation_accepted_by.name"),sortable:!0,filter:!0,filterPlaceholder:"İptali İşleyen Yetkili'ye Göre",body:e=>t.jsx("span",{children:e.cancellation_accepted_by?e.cancellation_accepted_by.name:t.jsx("span",{children:e.cancellation_accepted?"Onaylandı":e.cancellation_rejected?"Reddedildi":"Onay Bekliyor"})})},{field:"cancellation_reason",header:"İptal Nedeni",hidden:!l.includes("cancellation_reason"),sortable:!0,filter:!0,filterPlaceholder:"İptal Nedeni'ne Göre",body:e=>t.jsxs("span",{className:"cursor-pointer",onMouseEnter:a=>{var n;v(e.cancellation_reason),(n=_.current)==null||n.toggle(a)},onMouseLeave:()=>{var a;v(""),(a=_.current)==null||a.hide()},children:[String(e.cancellation_reason).substring(0,20),String(e.cancellation_reason).length>20&&"..."]})},{field:"cancellation_requested_by",header:"İptal Talep Eden",hidden:!l.includes("cancellation_requested_by"),sortable:!0,filter:!0,filterElement:e=>t.jsx(Y,{value:e.value,options:[{label:"Kurye",value:"courier"},{label:"İşletme",value:"business"}],onChange:a=>e.filterApplyCallback(a.value),placeholder:"İptal Talep Eden"}),body:e=>t.jsx("span",{children:e.cancellation_requested_by==="courier"?"Kurye":"İşletme"})},{field:"created_at",header:"Kayıt Tarihi",hidden:!l.includes("created_at"),sortable:!0,filter:!0,filterPlaceholder:"Kayıt Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.created_at).toLocaleString()})},{field:"updated_at",header:"Güncelleme Tarihi",hidden:!l.includes("updated_at"),sortable:!0,filter:!0,filterPlaceholder:"Güncellenme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.updated_at).toLocaleString()})},{field:"courier_accepted_at",header:"Kurye Teslim Alma Tarihi",hidden:!l.includes("courier_accepted_at"),sortable:!0,filter:!0,filterPlaceholder:"Kurye Teslim Alma Tarihine Göre",filterType:"date",body:e=>e.courier_accepted_at?t.jsx("span",{children:new Date(e.courier_accepted_at).toLocaleString()}):t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Alınmadı"]})},{field:"delivered_at",header:"Teslim Tarihi",hidden:!l.includes("delivered_at"),sortable:!0,filter:!0,filterPlaceholder:"Teslim Tarihine Göre",filterType:"date",body:e=>e.delivered_at?t.jsx("span",{children:new Date(e.delivered_at).toLocaleString()}):t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Edilmedi"]})},{field:"canceled_at",header:"İptal Tarihi",hidden:!l.includes("canceled_at"),sortable:!0,filter:!0,filterPlaceholder:"Aktifleştirme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:e.canceled_at===null?t.jsx("i",{className:"pi pi-times-circle text-red-400"}):new Date(e.canceled_at).toLocaleString()})},{field:"actions",header:"İşlemler",hidden:!l.includes("actions"),body:e=>t.jsxs("div",{className:"flex gap-2",children:[t.jsx(h,{visible:!e.cancellation_accepted&&!e.cancellation_rejected,size:"small",icon:"pi pi-check-circle",severity:"success",tooltip:"İptali Onayla",tooltipOptions:{position:"top"},onClick:a=>{R(a,e.id)}}),t.jsx(h,{visible:!e.cancellation_accepted&&!e.cancellation_rejected,size:"small",icon:"pi pi-times-circle",severity:"danger",tooltip:"Reddet",tooltipOptions:{position:"top"},onClick:a=>{L(a,e.id)}})]})}];const P=j.useRef(null),G=()=>t.jsx(t.Fragment,{children:t.jsx(I,{end:t.jsxs(t.Fragment,{children:[t.jsx(h,{size:"small",icon:"pi pi-sync",severity:"help",className:"mr-2",tooltip:"Verileri Yenile",tooltipOptions:{position:"top"},onClick:()=>{m()}}),t.jsx(h,{size:"small",icon:"pi pi-bars",onClick:e=>{var a;(a=P.current)==null||a.toggle(e)}})]})})}),s=j.useRef(null);return t.jsx(z,{auth:k,csrfToken:p,children:t.jsxs(q,{children:[t.jsx(K,{title:"İptal Edilen Siparişler"}),t.jsx(B,{ref:s}),t.jsxs(M,{ref:P,showCloseIcon:!0,style:{width:"300px"},children:[t.jsx("div",{className:"flex align-items-center justify-content-start mb-3",children:t.jsxs("span",{className:"text-900 text-lg font-bold",children:["Sütunlar (",l.length,")"]})}),t.jsx("div",{className:"flex flex-column justify-content-center gap-2",children:T.map((e,a)=>{if(e.selectionMode==="multiple")return null;let n=e.header,r=e.field;return t.jsxs("div",{className:"flex align-items-center",children:[t.jsx(V,{inputId:`column${a}`,checked:l.includes(r),onChange:d=>{d.checked?g([...l,r]):g(l.filter(o=>o!==r))}}),t.jsx("label",{htmlFor:`column${a}`,className:"ml-2",children:n})]},a)})})]}),t.jsx(M,{ref:_,style:{width:"300px"},children:t.jsx("p",{children:O})}),t.jsxs("div",{className:"card",children:[t.jsx("span",{className:"text-900 text-xl font-bold mb-4 block",children:"İptal Edilen Siparişler"}),x!==null&&t.jsx(N,{className:"w-full",severity:"error",text:x}),!f&&y.length===0&&t.jsx(N,{className:"w-full",severity:"info",text:"Sipariş bulunamadı."}),t.jsx(F,{hidden:!f&&y.length===0||x!==null,loading:f,value:y,removableSort:!0,paginator:!0,filterDisplay:"row",paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],rows:10,dataKey:"id",header:G,filters:{"customer.name":{value:null,matchMode:"contains"},"customer.phone":{value:null,matchMode:"contains"},"business.name":{value:null,matchMode:"contains"},"business.phone":{value:null,matchMode:"contains"},"courier.name":{value:null,matchMode:"contains"},"courier.phone":{value:null,matchMode:"contains"},cancellation_accepted:{value:null,matchMode:"equals"},cancellation_reason:{value:null,matchMode:"contains"},cancellation_requested_by:{value:null,matchMode:"equals"},created_at:{value:null,matchMode:"contains"},updated_at:{value:null,matchMode:"contains"},courier_accepted_at:{value:null,matchMode:"contains"},delivered_at:{value:null,matchMode:"contains"},canceled_at:{value:null,matchMode:"contains"},price:{value:null,matchMode:"contains"}},emptyMessage:"Sipariş bulunamadı.",currentPageReportTemplate:"{first}. ile {last}. arası toplam {totalRecords} kayıttan",children:T.map((e,a)=>t.jsx(H,{...e},a))})]})]})})};export{fe as default};