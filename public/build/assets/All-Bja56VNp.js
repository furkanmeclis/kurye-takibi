import{r as d,u as H,j as t,c as I,B as u,y as F,R as K,Y as V,a as Y}from"./app-Q7AXU0aI.js";import{P as $,M as q,k as J,l as Q,n as O,o as U}from"./PageContainer-BIYmXk4n.js";import{T as X}from"./toast.esm-CfmbWQEZ.js";import{t as k,T as M,O as E,a as Z}from"./ActiveOrder-CRyMwc2f.js";import{D,C as ee}from"./column.esm-ChOjKaFr.js";import{D as te,M as w}from"./message.esm-BdhDmTuC.js";import{C as re,T as ae}from"./checkbox.esm-C5GvCFvh.js";import{l as le,b as j}from"./globalHelper-DmSEk4ia.js";import{I as ie}from"./inputtext.esm-DYxVi6bR.js";import{T as se}from"./tristatecheckbox.esm-fHoAbalR.js";import"./PersonalInformation-BeSBW7zC.js";import"./inputmask.esm-DFOdfNHf.js";import"./car-BnQ5UupV.js";import"./PersonalInformation-CbdU5Zyv.js";import"./styleclass.esm-D-qKL6b3.js";import"./sidebar.esm-DXtzmneN.js";import"./index.esm-De60uoIs.js";import"./inputswitch.esm-BN_GMhiZ.js";import"./index.esm-Cdomumk4.js";const Ce=({auth:y,csrfToken:m,flash:o})=>{const[f,s]=d.useState(!0),[v,L]=d.useState([]);d.useState([]);const[i,_]=H(["name","phone","created_at","actions"],"BusinessesOrdersAllTableColumns"),[S,g]=d.useState(null),b=d.useRef(null),[R,z]=d.useState([]),[x,T]=d.useState({orderId:0,reason:""}),p=()=>{s(!0),J(m).then(e=>{e.status?(L(e.orders.map(r=>({...r,cancellation_accepted:r.cancellation_accepted===1,cancellation_rejected:r.cancellation_rejected===1}))),s(!1),g(null)):(g(e.message),s(!1))}).catch(e=>{g(e.message),s(!1)}).finally(()=>s(!1))};d.useEffect(()=>{var e,r;if(p(),o!=null&&o.message&&((e=n.current)==null||e.show({severity:(o==null?void 0:o.type)??"info",summary:o.title,detail:o.message??""})),(r=y==null?void 0:y.user)!=null&&r.id){let a=le(l=>{l.reload&&p()});return()=>{a()}}},[]);const G=(e,r)=>{Y({target:e.currentTarget,message:"Siparişi silmek istediğinize emin misiniz?",acceptLabel:"Sil",acceptClassName:"p-button-danger",rejectLabel:"Vazgeç",accept(){s(!0),Q(r,m).then(({status:a,message:l})=>{var c,h;a?(p(),(c=n.current)==null||c.show({severity:"success",summary:"Başarılı",detail:l})):(h=n.current)==null||h.show({severity:"error",summary:"Hata",detail:l})}).catch(a=>{var l;(l=n.current)==null||l.show({severity:"error",summary:"Hata",detail:a.message})}).finally(()=>s(!1))}})},W=e=>{s(!0),O(e,"opened",m).then(({status:r,message:a})=>{var l,c;r?(p(),(l=n.current)==null||l.show({severity:"success",summary:"Başarılı",detail:a})):(c=n.current)==null||c.show({severity:"error",summary:"Hata",detail:a})}).catch(r=>{var a;(a=n.current)==null||a.show({severity:"error",summary:"Hata",detail:r.message})}).finally(()=>s(!1))},B=(e,r)=>{s(!0),O(e,"canceled",m,r).then(({status:a,message:l})=>{var c,h,P;a?(p(),(c=n.current)==null||c.show({severity:"success",summary:"Başarılı",detail:l}),(h=b.current)==null||h.hide()):(P=n.current)==null||P.show({severity:"error",summary:"Hata",detail:l})}).catch(a=>{var l;(l=n.current)==null||l.show({severity:"error",summary:"Hata",detail:a.message})}).finally(()=>s(!1))};let N=[{expander:!0,style:{width:"3rem"}},{field:"order_number",header:"Sipariş Numarası",hidden:!i.includes("order_number"),style:{minWidth:"12rem"},filter:!0,filterPlaceholder:"Sipariş Numarası'na Göre"},{field:"customer.name",header:"Müşteri Adı Soyadı",hidden:!i.includes("customer.name"),sortable:!0,filter:!0,filterPlaceholder:"Ad'a Göre",style:{minWidth:"12rem"}},{field:"customer.phone",header:"Müşteri Telefon Numarası",hidden:!i.includes("customer.phone"),sortable:!0,filter:!0,filterPlaceholder:"Müşteri Telefon Numarası'na Göre",style:{minWidth:"12rem"}},{field:"customer_note",header:"Sipariş Notu",hidden:!i.includes("customer_note"),sortable:!0,filter:!0,filterPlaceholder:"Sipariş Notu'na Göre",style:{minWidth:"12rem"},body:e=>e.customer_note?t.jsx("span",{children:e.customer_note}):t.jsx("span",{children:t.jsx("i",{className:"pi pi-ban text-red-400"})})},{field:"price",header:"Paket Ücreti",hidden:!i.includes("price"),sortable:!0,filter:!0,style:{minWidth:"12rem"},filterPlaceholder:"Fiyata'a Göre",body:e=>t.jsxs("span",{children:[e.price," ₺"]})},{field:"marketplace",header:"Sipariş Kaynağı",style:{width:"6rem"},hidden:!i.includes("marketplace"),sortable:!0,body:e=>t.jsx("span",{children:e.marketplace==="trendyol"?t.jsx("img",{src:k,alt:"Trendyol"}):t.jsx("i",{className:"pi pi-home"})})},{field:"status",header:"Sipariş Durumu",style:{minWidth:"9rem"},hidden:!i.includes("status"),sortable:!0,filter:!0,filterElement:e=>t.jsx(te,{options:j("draft",!0),value:e.value,filter:!0,filterBy:"label,value",onChange:r=>e.filterApplyCallback(r.value),itemTemplate:r=>t.jsx(M,{value:r.label,severity:r.severity}),placeholder:"Sipariş Durumu",className:"p-column-filter w-full",showClear:!0}),body:e=>t.jsx(M,{value:String(j(e.status,!1,e.cancellation_accepted,e.cancellation_rejected).label),severity:String(j(e.status,!1,e.cancellation_accepted,e.cancellation_rejected).severity)})},{field:"courier_accepted_at",header:"Kurye Teslim Alma Tarihi",hidden:!i.includes("courier_accepted_at"),sortable:!0,filter:!0,filterPlaceholder:"Kurye Teslim Alma Tarihine Göre",filterType:"date",style:{minWidth:"12rem"},body:e=>e.courier_accepted_at?t.jsx("span",{children:new Date(e.courier_accepted_at).toLocaleString()}):t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Alınmadı"]})},{field:"delivered_at",header:"Teslim Tarihi",hidden:!i.includes("delivered_at"),sortable:!0,filter:!0,filterPlaceholder:"Teslim Tarihine Göre",filterType:"date",style:{minWidth:"12rem"},body:e=>e.delivered_at?t.jsx("span",{children:new Date(e.delivered_at).toLocaleString()}):t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-ban text-red-400"})," Teslim Edilmedi"]})},{field:"cancellation_accepted",header:"İptal Onayı",hidden:!i.includes("cancellation_accepted"),sortable:!0,filter:!0,dataType:"boolean",style:{minWidth:"6rem"},filterElement:e=>t.jsx(se,{value:e.value,onChange:r=>e.filterApplyCallback(r.value)}),body:e=>t.jsx("i",{className:I("pi",{"pi-times-circle text-red-400":e.cancellation_accepted&&e.status==="canceled","pi-check-circle text-green-400":!e.cancellation_accepted&&e.status==="canceled"&&e.cancellation_rejected,"pi-hourglass text-yellow-400":e.status==="canceled"&&!e.cancellation_rejected&&!e.cancellation_accepted,"pi-ban text-indigo-400":e.status!=="canceled"})})},{field:"canceled_at",header:"İptal Tarihi",hidden:!i.includes("canceled_at"),sortable:!0,filter:!0,style:{minWidth:"12rem"},filterPlaceholder:"İptal Tarihine Göre",filterType:"date",body:e=>e.canceled_at?t.jsx("span",{children:new Date(e.canceled_at).toLocaleString()}):t.jsxs("span",{children:[t.jsx("i",{className:"pi pi-ban text-red-400"})," İptal Edilmedi"]})},{field:"created_at",header:"Eklenme Tarihi",hidden:!i.includes("created_at"),sortable:!0,filter:!0,style:{minWidth:"12rem"},filterPlaceholder:"Eklenme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.created_at).toLocaleString()})},{field:"updated_at",header:"Güncelleme Tarihi",hidden:!i.includes("updated_at"),sortable:!0,filter:!0,style:{minWidth:"12rem"},filterPlaceholder:"Güncellenme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.updated_at).toLocaleString()})},{field:"actions",header:"İşlemler",style:{minWidth:"15rem"},hidden:!i.includes("actions"),body:e=>t.jsxs("div",{className:"flex gap-2",children:[e.status==="preparing"&&t.jsx(u,{size:"small",icon:"pi pi-box",severity:"warning",tooltip:"Hazırlığı Bitir",loading:f,tooltipOptions:{position:"top"},disabled:e.status!=="preparing",onClick:()=>{W(e.id)}}),t.jsx(u,{size:"small",icon:"pi pi-eye",severity:"info",tooltip:"Görüntüle",loading:f,tooltipOptions:{position:"top"},onClick:()=>{F.visit(route("business.orders.show",e.id))}}),e.status==="draft"&&t.jsx(u,{size:"small",icon:"pi pi-trash",severity:"danger",tooltip:"Sil",tooltipOptions:{position:"top"},loading:f,onClick:r=>{G(r,e.id)}}),e.status!=="draft"&&e.status!=="deleted"&&e.status!=="canceled"&&e.status!=="delivered"&&t.jsx(u,{size:"small",icon:"pi pi-ban",severity:"danger",tooltip:"Siparişi İptal Et",tooltipOptions:{position:"top"},loading:f,onClick:r=>{var a;T({orderId:e.id,reason:""}),(a=b.current)==null||a.toggle(r)}})]})}];const C=d.useRef(null),A=()=>t.jsx(t.Fragment,{children:t.jsx(ae,{start:t.jsx(t.Fragment,{children:t.jsx(u,{label:"Siparişleri Güncelle",onClick:()=>{s(!0),U(m).then(e=>{var r;(r=n.current)==null||r.show({severity:e.status?"success":"error",summary:e.status?"Başarılı":"Hata",detail:e.message}),e.status&&p()}).catch(()=>{var e;(e=n.current)==null||e.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu"})}).finally(()=>s(!1))},size:"small",children:t.jsx("img",{src:k,className:"h-1rem ml-1",alt:"trendyol"})})}),end:t.jsxs(t.Fragment,{children:[t.jsx(u,{size:"small",icon:"pi pi-sync",severity:"help",className:"mr-2",tooltip:"Verileri Yenile",tooltipOptions:{position:"top"},onClick:()=>{p()}}),t.jsx(u,{size:"small",icon:"pi pi-bars",onClick:e=>{var r;(r=C.current)==null||r.toggle(e)}})]})})}),n=K.useRef(null);return t.jsx($,{auth:y,csrfToken:m,children:t.jsxs(q,{children:[t.jsx(V,{title:"Siparişler"}),t.jsx(X,{ref:n}),t.jsxs(E,{ref:C,showCloseIcon:!0,style:{width:"300px"},children:[t.jsx("div",{className:"flex align-items-center justify-content-start mb-3",children:t.jsxs("span",{className:"text-900 text-lg font-bold",children:["Sütunlar (",i.length,")"]})}),t.jsx("div",{className:"flex flex-column justify-content-center gap-2",children:N.map((e,r)=>{if(e.selectionMode==="multiple"||(e==null?void 0:e.expander)!==void 0)return null;let a=e.header,l=e.field;return t.jsxs("div",{className:"flex align-items-center",children:[t.jsx(re,{inputId:`column${r}`,checked:i.includes(l),onChange:c=>{c.checked?_([...i,l]):_(i.filter(h=>h!==l))}}),t.jsx("label",{htmlFor:`column${r}`,className:"ml-2",children:a})]},r)})})]}),t.jsxs(E,{ref:b,showCloseIcon:!0,style:{width:"300px"},children:[t.jsx("h6",{children:"İptal Sebebinizi Belirterek Siparişi İptal Edebilirsiniz"}),t.jsx(ie,{value:x.reason,onChange:e=>{T({...x,reason:e.target.value})},placeholder:"İptal Sebebi",className:"w-full mb-2"}),t.jsx(u,{label:"İptal Et",size:"small",className:"mt-2",severity:"danger",icon:"pi pi-ban",onClick:()=>{B(x.orderId,x.reason)}})]}),t.jsxs("div",{className:"card",children:[t.jsx("span",{className:"text-900 text-xl font-bold mb-4 block",children:"Siparişler"}),S!==null&&t.jsx(w,{className:"w-full",severity:"error",text:S}),!f&&v.length===0&&t.jsx(w,{className:"w-full mb-3",severity:"info",text:"Sipariş bulunamadı."}),t.jsx(D,{loading:f,value:v,removableSort:!0,paginator:!0,filterDisplay:"row",paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],rows:10,dataKey:"id",header:A,expandedRows:R,onRowToggle:e=>z(e==null?void 0:e.data),rowExpansionTemplate:e=>t.jsx(Z,{orderId:e.id,csrfToken:m,auth:y}),filters:{order_number:{value:null,matchMode:"contains"},"customer.name":{value:null,matchMode:"contains"},"customer.phone":{value:null,matchMode:"contains"},created_at:{value:null,matchMode:"contains"},updated_at:{value:null,matchMode:"contains"},status:{value:null,matchMode:"contains"},courier_accepted_at:{value:null,matchMode:"contains"},delivered_at:{value:null,matchMode:"contains"},canceled_at:{value:null,matchMode:"contains"},cancellation_reason:{value:null,matchMode:"contains"},price:{value:null,matchMode:"contains"},customer_note:{value:null,matchMode:"contains"},cancellation_accepted:{value:null,matchMode:"equals"}},emptyMessage:"Sipariş bulunamadı.",currentPageReportTemplate:"{first}. ile {last}. arası toplam {totalRecords} kayıttan",children:N.map((e,r)=>t.jsx(ee,{...e},r))})]})]})})};export{Ce as default};