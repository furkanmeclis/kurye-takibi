import{r as v,u as H,j as t,c as R,B as d,y as O,R as w,Y as G,a as x}from"./app-D4s2FTN-.js";import{P as D,M as E}from"./PageContainer-CIQCmC8-.js";import{T as F}from"./toast.esm-D0GuonQ0.js";import{g as V,d as $,a as K,m as Y,b as I}from"./businesses-B8cWdWWF.js";import{C as q,D as J,a as Q,T as U}from"./checkbox.esm-BkTJi-xg.js";import{M as N}from"./message.esm-CUZKLiBo.js";import{O as W}from"./overlaypanel.esm-fg1LEqZQ.js";import{T as X}from"./tristatecheckbox.esm-uCukbniN.js";import"./PersonalInformation-CKlvOJdz.js";import"./inputmask.esm-cgKRC5yP.js";import"./PersonalInformation-BWsiU9mj.js";import"./styleclass.esm-C-A02k-V.js";const de=({auth:P,csrfToken:f,flash:u})=>{const[b,r]=v.useState(!0),[m,y]=v.useState([]),[p,g]=v.useState([]),[c,C]=H(["name","email","phone","created_at","actions"],"adminBusinessesApprovedColumns"),[j,k]=v.useState(null),S=()=>{r(!0),V("all",f).then(e=>{e.status?(y(e.businesses.map(i=>({...i,activated:i.activated===1}))),r(!1),k(null)):(k(e.message),r(!1))}).catch(e=>{k(e.message),r(!1)}).finally(()=>r(!1))};v.useEffect(()=>{var e;S(),u!=null&&u.message&&((e=s.current)==null||e.show({severity:(u==null?void 0:u.type)??"info",summary:u.title,detail:u.message??""}))},[]);const A=(e,i)=>{x({target:e.currentTarget,message:"İşletmeyi silmek istediğinize emin misiniz?",acceptLabel:"Sil",acceptClassName:"p-button-danger",rejectLabel:"Vazgeç",accept(){r(!0),$(i,f).then(({status:l,message:a})=>{var n,o;l?(y(m.filter(h=>h.id!==i)),g([]),(n=s.current)==null||n.show({severity:"success",summary:"Başarılı",detail:a})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:a})}).catch(l=>{var a;(a=s.current)==null||a.show({severity:"error",summary:"Hata",detail:l.message})}).finally(()=>r(!1))}})},L=(e,i)=>{x({target:e.currentTarget,message:"Seçilen İşletmeler silinecektir. Silmek istediğinize emin misiniz?",acceptLabel:`Sil (${i.length} İşletme)`,acceptClassName:"p-button-danger",rejectLabel:"Vazgeç",accept(){r(!0),Y(i,f).then(({status:l,message:a})=>{var n,o;l?(y(m.filter(h=>!i.includes(h.id))),g([]),(n=s.current)==null||n.show({severity:"success",summary:"Başarılı",detail:a})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:a})}).catch(l=>{var a;(a=s.current)==null||a.show({severity:"error",summary:"Hata",detail:l.message})}).finally(()=>r(!1))}})},B=(e,i)=>{x({target:e.currentTarget,message:"İşletme Hesabı Aktifleştirilecektir. Aktifleştirmek istediğinize emin misiniz?",acceptLabel:"Aktifleştir",acceptClassName:"p-button-success",rejectLabel:"Vazgeç",accept(){r(!0),K(i,f).then(({status:l,message:a})=>{var n,o;l?(y(m.filter(h=>h.id!==i)),g([]),(n=s.current)==null||n.show({severity:"success",summary:"Başarılı",detail:a})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:a})}).catch(l=>{var a;(a=s.current)==null||a.show({severity:"error",summary:"Hata",detail:l.message})}).finally(()=>r(!1))}})},M=(e,i)=>{x({target:e.currentTarget,message:"Seçilen işletmelerin hesapları aktifleştirilecektir. Aktifleştirmek istediğinize emin misiniz?",acceptLabel:`Aktifleştir (${i.length} İşletme)`,acceptClassName:"p-button-success",rejectLabel:"Vazgeç",accept(){r(!0),I(i,f).then(({status:l,message:a})=>{var n,o;l?(y(m.filter(h=>!i.includes(h.id))),g([]),(n=s.current)==null||n.show({severity:"success",summary:"Başarılı",detail:a})):(o=s.current)==null||o.show({severity:"error",summary:"Hata",detail:a})}).catch(l=>{var a;(a=s.current)==null||a.show({severity:"error",summary:"Hata",detail:l.message})}).finally(()=>r(!1))}})};let z=[{selectionMode:"multiple",headerStyle:{width:"3rem"},header:""},{field:"name",header:"Adı Soyadı(İşletme Sahibi)",hidden:!c.includes("name"),sortable:!0,filter:!0,filterPlaceholder:"Ad'a Göre"},{field:"email",header:"Email Adresi",hidden:!c.includes("email"),sortable:!0,filter:!0,filterPlaceholder:"Email'e Göre"},{field:"phone",header:"Telefon Numarası",hidden:!c.includes("phone"),sortable:!0,filter:!0,filterPlaceholder:"Telefon Numarası'na Göre"},{field:"activated",header:"Aktiflik Durumu",hidden:!c.includes("activated"),sortable:!0,filter:!0,dataType:"boolean",filterElement:e=>t.jsx(X,{value:e.value,onChange:i=>e.filterApplyCallback(i.value)}),body:e=>t.jsx("i",{className:R("pi",{"pi-check-circle text-green-400":e.activated,"pi-times-circle text-red-400":!e.activated})})},{field:"activated_at",header:"Aktifleştirme Tarihi",hidden:!c.includes("activated_at"),sortable:!0,filter:!0,filterPlaceholder:"Aktifleştirme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:e.activated_at===null?t.jsx("i",{className:"pi pi-times-circle text-red-400"}):new Date(e.activated_at).toLocaleString()})},{field:"created_at",header:"Kayıt Tarihi",hidden:!c.includes("created_at"),sortable:!0,filter:!0,filterPlaceholder:"Kayıt Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.created_at).toLocaleString()})},{field:"updated_at",header:"Güncelleme Tarihi",hidden:!c.includes("updated_at"),sortable:!0,filter:!0,filterPlaceholder:"Güncellenme Tarihine Göre",filterType:"date",body:e=>t.jsx("span",{children:new Date(e.updated_at).toLocaleString()})},{field:"actions",header:"İşlemler",hidden:!c.includes("actions"),body:e=>t.jsxs("div",{className:"flex gap-2",children:[t.jsx(d,{visible:!e.activated,size:"small",icon:"pi pi-check-circle",severity:"success",tooltip:"Aktifleştir",tooltipOptions:{position:"top"},onClick:i=>{B(i,e.id)}}),t.jsx(d,{size:"small",icon:"pi pi-pencil",severity:"warning",tooltip:"Düzenle",tooltipOptions:{position:"top"},onClick:()=>{O.visit(route("admin.businesses.edit",{id:e.id}))}}),t.jsx(d,{size:"small",icon:"pi pi-trash",severity:"danger",tooltip:"Sil",tooltipOptions:{position:"top"},onClick:i=>{A(i,e.id)}})]})}];const T=w.useRef(null),_=()=>t.jsx(t.Fragment,{children:t.jsx(U,{start:p.length>0&&t.jsxs(t.Fragment,{children:[t.jsx(d,{size:"small",icon:"pi pi-check-circle",className:"mr-2",tooltip:"Toplu Aktifleştirme Yapmanızı Sağlar",tooltipOptions:{position:"top"},visible:p.map(e=>e.activated?null:e.id).filter(e=>e!==null).length>0,label:"Aktifleştir ("+p.map(e=>e.activated?null:e.id).filter(e=>e!==null).length+")",severity:"success",onClick:e=>{M(e,p.map(i=>i.activated?null:i.id).filter(i=>i!==null))}}),t.jsx(d,{size:"small",icon:"pi pi-trash",className:"mr-2",tooltip:"Seçilen İşletmeleri Silmenizi Sağlar",tooltipOptions:{position:"top"},label:"Sil ("+p.length+")",severity:"danger",onClick:e=>{L(e,p.map(i=>i.id))}}),t.jsx(d,{size:"small",icon:"pi pi-filter-slash",label:"Seçimi Temizle",severity:"warning",onClick:()=>g([])})]}),end:t.jsxs(t.Fragment,{children:[t.jsx(d,{size:"small",icon:"pi pi-sync",severity:"help",className:"mr-2",tooltip:"Verileri Yenile",tooltipOptions:{position:"top"},onClick:()=>{S()}}),t.jsx(d,{size:"small",icon:"pi pi-bars",onClick:e=>{var i;(i=T.current)==null||i.toggle(e)}})]})})}),s=w.useRef(null);return t.jsx(D,{auth:P,csrfToken:f,children:t.jsxs(E,{children:[t.jsx(G,{title:"Tüm İşletmeler"}),t.jsx(F,{ref:s}),t.jsxs(W,{ref:T,showCloseIcon:!0,style:{width:"300px"},children:[t.jsx("div",{className:"flex align-items-center justify-content-start mb-3",children:t.jsxs("span",{className:"text-900 text-lg font-bold",children:["Sütunlar (",c.length,")"]})}),t.jsx("div",{className:"flex flex-column justify-content-center gap-2",children:z.map((e,i)=>{if(e.selectionMode==="multiple")return null;let l=e.header,a=e.field;return t.jsxs("div",{className:"flex align-items-center",children:[t.jsx(q,{inputId:`column${i}`,checked:c.includes(a),onChange:n=>{n.checked?C([...c,a]):C(c.filter(o=>o!==a))}}),t.jsx("label",{htmlFor:`column${i}`,className:"ml-2",children:l})]},i)})})]}),t.jsxs("div",{className:"card",children:[t.jsx("span",{className:"text-900 text-xl font-bold mb-4 block",children:"Tüm İşletmeler"}),j!==null&&t.jsx(N,{className:"w-full",severity:"error",text:j}),!b&&m.length===0&&t.jsx(N,{className:"w-full",severity:"info",text:"İşletme bulunamadı."}),t.jsx(J,{hidden:!b&&m.length===0||j!==null,loading:b,value:m,removableSort:!0,paginator:!0,filterDisplay:"row",paginatorTemplate:"RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink",rowsPerPageOptions:[5,10,25,50],rows:10,dataKey:"id",header:_,filters:{name:{value:null,matchMode:"contains"},email:{value:null,matchMode:"contains"},phone:{value:null,matchMode:"contains"},created_at:{value:null,matchMode:"contains"},updated_at:{value:null,matchMode:"contains"},activated:{value:null,matchMode:"equals"}},emptyMessage:"İşletme bulunamadı.",currentPageReportTemplate:"{first}. ile {last}. arası toplam {totalRecords} kayıttan",selectionMode:"checkbox",selection:p,onSelectionChange:e=>g(e.value),children:z.map((e,i)=>t.jsx(Q,{...e},i))})]})]})})};export{de as default};