import{r as n,L as D,R as T,j as e,Y as L,c as s,B as V}from"./app-DfiApva1.js";import{P as M,M as G}from"./PageContainer-CItWAE-M.js";import{c as H,a as U,b as o,d as Z,u as K,I as h}from"./inputtext.esm-BJSyEN0I.js";import{T as Y}from"./toast.esm-BUIr6eRr.js";import{I as J}from"./inputmask.esm-D7RyYABS.js";import{I as Q}from"./inputswitch.esm-CCJ0ABRV.js";import{B as W}from"./ActiveOrder-BV8Zpnbj.js";import{u as X}from"./globalHelper-B-s3UrsJ.js";import{P as ee}from"./PersonalInformation-C0LAfeiM.js";import ie from"./PersonalInformation-D6nBh7q9.js";import"./styleclass.esm-BYWQmj5w.js";import"./index.esm-CF5HdvGh.js";import"./sidebar.esm-DYHP3OPq.js";import"./message.esm-DXuI6qyr.js";const je=({auth:t,csrfToken:u,courierId:ae=0})=>{var _,k;const{setBreadcrumbs:C,setAuth:I}=n.useContext(D);n.useEffect(()=>{C(l=>[...l,{labels:["Profil"],to:window.location.href}])},[]);const[w,j]=n.useState(!0),[P,te]=n.useState({id:t.user.id,name:t.user.name,email:t.user.email,phone:t.user.phone,password_change:!1,password:"",password_confirmation:"",account_verification:t.user.activated===1,activated_at:""}),x=T.useRef(null),[c,b]=n.useState(!1),[v,S]=n.useState(!1),E=H().shape({id:U().required("ID bilgisi bulunamadı"),email:o().email("Geçerli bir email adresi giriniz").required("Email adresinizi giriniz"),name:o().required("Ad soyad giriniz").min(3,"Ad Soyad en az 3 karakter olmalıdır"),phone:o().required("Telefon numarası giriniz").matches(/^\(\d{3}\)-\d{3}-\d{4}$/,"Geçerli bir telefon numarası giriniz"),password:o().when("password_change",{is:!0,then:()=>o().required("Şifrenizi giriniz").min(6,"Şifreniz en az 6 karakter olmalıdır").matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{6,}$/,"Şifreniz en az bir büyük harf, bir küçük harf ve bir rakam içermelidir"),otherwise:()=>o().notRequired()}),password_confirmation:o().when("password_change",{is:!0,then:()=>o().required("Şifreyi tekrar giriniz").oneOf([Z("password"),""],"Şifreler uyuşmuyor"),otherwise:()=>o().notRequired()})}),[g,se]=n.useState(!1),N=K({initialValues:P,validationSchema:E,validateOnChange:v,validateOnBlur:v,enableReinitialize:!0,onSubmit:l=>{b(!0);let f={name:l.name,email:l.email,phone:l.phone,password:l.password,password_confirmation:l.password_confirmation};l.password_change===!0&&(f={...f,password_change:1}),X(f,u).then(a=>{var y,z;if(a.status){(y=x.current)==null||y.show({severity:"success",summary:"Başarılı",detail:a.message});let d={id:a.user.id,name:a.user.name,email:a.user.email,phone:a.user.phone,password_change:!1,password:"",password_confirmation:"",account_verification:a.user.activated===1,activated_at:a.user.activated_at===null?!1:new Date(a.user.activated_at).toLocaleString()};a.updatePersonalInformation&&(j(!1),setTimeout(()=>{j(!0)},1)),I(R=>({...R,user:a.user})),F({values:d})}else{let d={};a!=null&&a.emailExists&&(a==null?void 0:a.emailExists)===!0&&(d={...d,email:"Bu email adresi zaten kullanılmakta"}),a!=null&&a.phoneExists&&(a==null?void 0:a.phoneExists)===!0&&(d={...d,phone:"Bu telefon numarası zaten kullanılmakta"}),O(d),(z=x.current)==null||z.show({severity:"error",summary:"Hata",detail:a.message})}}).catch(()=>{var a;(a=x.current)==null||a.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu lütfen tekrar deneyiniz."})}).finally(()=>{b(!1)})}});let{values:m,setFieldValue:B,resetForm:F,submitCount:r,setErrors:O,handleChange:p,handleSubmit:A,isValid:q,dirty:$}=N,i=N.errors;return n.useEffect(()=>{r>0&&S(!0)},[r]),e.jsx(M,{auth:t,csrfToken:u,profilePage:!0,children:e.jsxs(G,{children:[e.jsx(L,{title:"Profil"}),e.jsx(Y,{ref:x}),e.jsx("div",{className:"card",children:e.jsxs("div",{className:"grid",children:[e.jsxs("div",{className:"col-12 lg:col-2",children:[e.jsx("div",{className:"text-900 font-medium text-xl mb-3",children:"Bilgileriniz"}),e.jsxs("p",{className:"m-0 p-0 text-600 line-height-3 mr-3",children:["Düzenlemek istediğiniz bilgilerinizi aşağıdaki formu kullanarak güncelleyebilirsiniz.",i&&Object.keys(i).length>0&&e.jsx(e.Fragment,{children:e.jsx("ul",{className:"mt-3",children:Object.keys(i).map((l,f)=>e.jsx("li",{className:"text-red-500 text-sm",children:i[l]},f))})})]})]}),e.jsx("div",{className:"col-12 lg:col-10",children:e.jsx(W,{blocked:g,template:e.jsx("i",{className:"pi pi-exclamation-circle text-red-400",style:{fontSize:"3rem"}}),containerClassName:s("",{"p-3":g,"p-0":!g}),children:e.jsxs("form",{onSubmit:A,className:"grid formgrid p-fluid",children:[e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"name",className:s("font-medium text-900",{"text-red-500":!!i.name,"text-green-500":!i.name&&r>0}),children:[e.jsx("i",{className:s("pi",{"pi-times-circle text-red-500 text-sm":!!i.name,"pi-check-circle text-green-500 text-sm":!i.name&&r>0})})," Ad Soyad"]}),e.jsx(h,{id:"name",type:"text",autoComplete:"off",name:"name",tooltip:i.name,tooltipOptions:{position:"top"},disabled:c,onChange:p,value:m.name,className:s("w-full",{"p-invalid":!!i.name})})]}),e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"email",className:s("font-medium text-900",{"text-red-500":!!i.email,"text-green-500":!i.email&&r>0}),children:[e.jsx("i",{className:s("pi",{"pi-times-circle text-red-500 text-sm":!!i.email,"pi-check-circle text-green-500 text-sm":!i.email&&r>0})})," Email Adresi"]}),e.jsx(h,{id:"email",type:"email",autoComplete:"off",name:"email",tooltip:i==null?void 0:i.email,tooltipOptions:{position:"top"},disabled:c,onChange:p,value:m.email,className:s("w-full",{"p-invalid":!!i.email})})]}),e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"phone",className:s("font-medium text-900",{"text-red-500":!!i.phone,"text-green-500":!i.phone&&r>0}),children:[e.jsx("i",{className:s("pi",{"pi-times-circle text-red-500 text-sm":!!i.phone,"pi-check-circle text-green-500 text-sm":!i.phone&&r>0})})," Telefon Numarası"]}),e.jsx(J,{autoComplete:"off",name:"phone",tooltip:i==null?void 0:i.phone,tooltipOptions:{position:"top",event:"focus",className:"text-red-500"},disabled:c,onChange:p,value:m.phone,mask:"(999)-999-9999",className:s("w-full",{"p-invalid":!!i.phone})})]}),e.jsxs("div",{className:"field mb-4 col-12 p-input-icon-right",children:[e.jsx("label",{htmlFor:"password_change",className:s("font-medium text-900 cursor-pointer select-none"),children:"Şifre Değişikliği"}),e.jsx("br",{}),e.jsx(Q,{inputId:"password_change",checked:m.password_change,onChange:l=>B("password_change",l.value??!1)})]}),m.password_change&&e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"password",className:s("font-medium text-900",{"text-red-500":!!i.password,"text-green-500":!i.password&&r>0}),children:[e.jsx("i",{className:s("pi",{"pi-times-circle text-red-500 text-sm":!!i.password,"pi-check-circle text-green-500 text-sm":!i.password&&r>0})})," Şifre"]}),e.jsx(h,{id:"password",type:"password",autoComplete:"off",name:"password",tooltip:i==null?void 0:i.password,tooltipOptions:{position:"top"},disabled:c,onChange:p,value:m.password,className:s("w-full",{"p-invalid":!!i.password})})]}),e.jsxs("div",{className:"field mb-4 col-12 md:col-6 p-input-icon-right",children:[e.jsxs("label",{htmlFor:"password_confirmation",className:s("font-medium text-900",{"text-red-500":!!i.password_confirmation,"text-green-500":!i.password_confirmation&&r>0}),children:[e.jsx("i",{className:s("pi",{"pi-times-circle text-red-500 text-sm":!!i.password_confirmation,"pi-check-circle text-green-500 text-sm":!i.password_confirmation&&r>0})})," Şifre Tekrarı"]}),e.jsx(h,{id:"password_confirmation",type:"password",autoComplete:"off",name:"password_confirmation",tooltip:i==null?void 0:i.password_confirmation,tooltipOptions:{position:"top"},disabled:c,onChange:p,value:m.password_confirmation,className:s("w-full",{"p-invalid":!!i.password_confirmation})})]})]}),e.jsx("div",{className:"col-12",children:e.jsx(V,{label:"Kaydet",disabled:!q||!$,loading:c,size:"small",type:"submit",className:"w-auto mt-3"})})]})})})]})}),((_=t==null?void 0:t.user)==null?void 0:_.role)==="courier"&&w&&e.jsx(ee,{profilePage:!0,page:!1,profileCompleted:t==null?void 0:t.profile_completed,csrfToken:u,profileApproved:t==null?void 0:t.profile_approved}),((k=t==null?void 0:t.user)==null?void 0:k.role)==="business"&&w&&e.jsx(ie,{profilePage:!0,page:!1,profileCompleted:t==null?void 0:t.profile_completed,csrfToken:u,profileApproved:t==null?void 0:t.profile_approved})]})})};export{je as default};