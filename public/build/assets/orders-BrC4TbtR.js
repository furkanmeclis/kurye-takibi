const n=async e=>{if(e){let r=route("admin.orders.listCancellationRequests"),t=new Headers;return t.append("X-CSRF-TOKEN",e),await(await fetch(r,{method:"POST",headers:t})).json()}else return!1},l=async(e,r)=>{if(r){let t=route("admin.orders.approveCancellation",e),a=new Headers;return a.append("X-CSRF-TOKEN",r),await(await fetch(t,{method:"POST",headers:a,body:JSON.stringify({_method:"PUT"})})).json()}else return!1},o=async(e,r)=>{if(r){let t=route("admin.orders.rejectCancellation",e),a=new Headers;return a.append("X-CSRF-TOKEN",r),await(await fetch(t,{method:"POST",headers:a})).json()}else return!1},d=async e=>{if(e){let r=route("admin.orders.listOrders"),t=new Headers;return t.append("X-CSRF-TOKEN",e),await(await fetch(r,{method:"POST",headers:t})).json()}else return!1};export{n as a,l as b,d as g,o as r};