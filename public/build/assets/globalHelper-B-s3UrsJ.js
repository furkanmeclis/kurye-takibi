const n=a=>({name:"Ad Soyad",phone:"Telefon",email:"Email",address:"Adres",city:"İl",state:"İlçe",zip:"Posta Kodu",country:"Ülke",billing:"Faturalandırma Türü",tax_name:"Vergi Mükellefi Adı",tax_number:"Vergi Numarası",tax_address:"Vergi Adresi",tax_office:"Vergi Aairesi",vehicle_type:"Teslimat Türü",created_at:"Oluşturulma Tarihi",updated_at:"Güncellenme Tarihi",identity:"Kimlik Numarası",birth_date:"Doğum Tarihi",latitude:"Enlem",longitude:"Boylam"})[a],s=(a,e=!1)=>{let t={draft:{label:"Taslak",severity:"secondary"},opened:{label:"Açık",severity:"warning"},transporting:{label:"Taşımada",severity:"info"},delivered:{label:"Teslim Edildi",severity:"success"},canceled:{label:"İptal Edildi",severity:"danger"},deleted:{label:"Silindi",severity:"danger"}};return e?Object.entries(t).map(([r,i])=>({value:r,label:i.label,severity:i.severity})):t[a]},l=(a,e)=>a==="billing"?e==="company"?"Şirket":"Bireysel":a==="vehicle_type"?e==="motorcycle"?"Motosiklet":e==="bicycle"?"Bisiklet":e==="car"?"Araba":e:a==="created_at"||a==="updated_at"?new Date(e).toLocaleString():a==="country"&&e==="turkey"?"Türkiye":e,o=async(a,e)=>{if(e){let t=route("profile.update"),r=new Headers;return r.append("X-CSRF-TOKEN",e),r.append("Content-Type","application/json"),await(await fetch(t,{method:"POST",headers:r,body:JSON.stringify({...a,_method:"PUT"})})).json()}else return!1},d=a=>new Promise((e,t)=>{navigator.geolocation?navigator.geolocation.getCurrentPosition(r=>{e({latitude:r.coords.latitude,longitude:r.coords.longitude})},r=>{console.log(r),a.show({severity:"error",summary:"Hata",detail:"Konum Bilginiz Alınamadı.Lütfen Tarayıcı Ayarlarınızı Kontrol Ediniz."}),t("Konum Bilgisi Alınamadı")}):(a.show({severity:"error",summary:"Hata",detail:"Konum Bilginiz Alınamadı.Lütfen Tarayıcı Ayarlarınızı Kontrol Ediniz."}),t("Konum Bilgisi Alınamadı"))}),u=(a,e=!1)=>{let t={wrongAddress:"Yanlış Adres",notInAddress:"Adreste Yok",addressMismatch:"Adres Uyuşmaması",accident:"Kaza",heavyTraffic:"Yoğun Trafik",productDamaged:"Ürün Hasar Aldı",tireBust:"Lastik Patladı"};return e?t:t[a]};export{l as a,s as b,d as c,u as d,n as g,o as u};