import{r as o,y as z,j as e,Y as F,c as t,b as f,B as C}from"./app-BF3BFKmb.js";import{c as E,b as g,u as I,I as b}from"./inputtext.esm-vpht0prC.js";import{F as k}from"./FullPageLayout-UrnFO_Gp.js";import{T as O}from"./toast.esm-D3AjItRA.js";import{I as R}from"./inputswitch.esm-CJiPS6o4.js";import"./index.esm-DSqsHcGN.js";const L=({csrfToken:y="",auth:T={}})=>{const[m,d]=o.useState(!1),l=o.useRef(null),[p,j]=o.useState(!1),w=E().shape({email:g().email("Geçerli bir email adresi giriniz").required("Email adresinizi giriniz"),password:g().required("Şifrenizi giriniz")}),{values:n,submitCount:s,setFieldValue:N,handleChange:u,handleSubmit:v,errors:a,isValid:S}=I({initialValues:{email:localStorage.getItem("loginEmailForRememberMe")||"",password:"",remember:!!localStorage.getItem("loginEmailForRememberMe")},validationSchema:w,validateOnChange:p,validateOnBlur:p,onSubmit:r=>{let c=new Headers;d(!0),c.append("Content-Type","application/json"),c.append("X-CSRF-TOKEN",y),fetch(route("login"),{method:"POST",headers:c,body:JSON.stringify(r)}).then(i=>i.json()).then(i=>{var x,h;i.status?(r.remember?localStorage.setItem("loginEmailForRememberMe",r.email):localStorage.removeItem("loginEmailForRememberMe"),(x=l.current)==null||x.show({severity:"success",summary:"Başarılı",detail:i.message}),z.visit(route((i==null?void 0:i.redirect)||"login"))):(h=l.current)==null||h.show({severity:"error",summary:"Hata",detail:i.message})}).catch(()=>{var i;(i=l.current)==null||i.show({severity:"error",summary:"Hata",detail:"Bir hata oluştu lütfen tekrar deneyiniz."})}).finally(()=>{d(!1)})}});return o.useEffect(()=>{s>0&&j(!0)},[s]),e.jsxs(k,{children:[e.jsx(F,{title:"Giriş Yap"}),e.jsx(O,{ref:l}),e.jsx("div",{className:t("surface-ground h-screen w-screen flex align-items-center justify-content-center"),children:e.jsxs("form",{onSubmit:v,className:"surface-card py-7 px-5 sm:px-7 shadow-2 flex flex-column w-11 sm:w-30rem",style:{borderRadius:"14px"},children:[e.jsx("h1",{className:"font-bold text-2xl mt-0 mb-2",children:"Giriş Formu"}),e.jsx("p",{className:"text-color-secondary",children:"Giriş yapmak için lütfen email adresinizi ve şifrenizi giriniz."}),e.jsxs("span",{className:"p-input-icon-left p-input-icon-right mb-3 mt-4",children:[e.jsx("i",{className:t("pi pi-at",{"text-red-500":!!a.email,"text-green-500":a&&!a.email&&s>0})}),e.jsx(b,{type:"email",autoComplete:"off",name:"email",tooltip:a==null?void 0:a.email,tooltipOptions:{position:"top",event:"focus",className:"text-red-500"},disabled:m,onChange:u,value:n.email,placeholder:"Email Adresiniz",className:t("w-full",{"p-invalid":!!a.email})}),e.jsx("i",{className:t("pi",{"pi-times-circle text-red-500":!!a.email,"pi-check-circle text-green-500":!a.email&&s>0})})]}),e.jsxs("span",{className:"p-input-icon-left p-input-icon-right mb-3",children:[e.jsx("i",{className:t("pi pi-key",{"text-red-500":!!a.password,"text-green-500":a&&!a.password&&s>0})}),e.jsx(b,{type:"password",autoComplete:"off",name:"password",tooltip:a==null?void 0:a.password,tooltipOptions:{position:"top",event:"focus",className:"text-red-500"},disabled:m,className:t("w-full",{"p-invalid":!!a.password}),onChange:u,value:n.password,placeholder:"Şifreniz"}),e.jsx("i",{className:t("pi",{"pi-times-circle text-red-500":!!a.password,"pi-check-circle text-green-500":!a.password&&s>0})})]}),e.jsxs("div",{className:"field-checkbox mb-3",children:[e.jsx(R,{checked:n.remember,inputId:"remember",onChange:r=>N("remember",r.value??!1)}),e.jsx("label",{htmlFor:"remember",className:"ml-2",children:"Beni Hatırla"})]}),e.jsxs("span",{className:"text-color-secondary flex justify-content-between mb-4",children:[e.jsx(f,{href:route("password.request"),className:"text-color-secondary hover:text-color",children:"Şifremi Unuttum"}),e.jsx(f,{href:route("register"),className:"text-color-secondary hover:text-color",children:"Kayıt Ol"})]}),e.jsx(C,{label:"Giriş Yap",className:"mb-4",disabled:!S,loading:m,type:"submit"})]})})]})};export{L as default};