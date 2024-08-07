import{d as p,T as c,o as w,c as _,w as n,a,u as s,Z as g,b as l,e as d,k as V,n as v,f as b}from"./app-DxCWqXKB.js";import{_ as y}from"./GuestLayout.vue_vue_type_script_setup_true_lang-Dh1MDS4J.js";import{_ as t,a as m,b as i}from"./TextInput.vue_vue_type_script_setup_true_lang-Dud97MN5.js";import{P as x}from"./PrimaryButton-DJ6tPuC3.js";import"./_plugin-vue_export-helper-DlAUqK2U.js";const k={class:"mt-4"},q={class:"mt-4"},B={class:"mt-4"},C={class:"flex items-center justify-end mt-4"},T=p({__name:"Register",setup(N){const e=c({name:"",email:"",password:"",password_confirmation:""}),u=()=>{e.post(route("register"),{onFinish:()=>{e.reset("password","password_confirmation")}})};return(f,o)=>(w(),_(y,null,{default:n(()=>[a(s(g),{title:"Register"}),l("form",{onSubmit:b(u,["prevent"])},[l("div",null,[a(t,{for:"name",value:"Name"}),a(m,{id:"name",type:"text",class:"mt-1 block w-full",modelValue:s(e).name,"onUpdate:modelValue":o[0]||(o[0]=r=>s(e).name=r),required:"",autofocus:"",autocomplete:"name"},null,8,["modelValue"]),a(i,{class:"mt-2",message:s(e).errors.name},null,8,["message"])]),l("div",k,[a(t,{for:"email",value:"Email"}),a(m,{id:"email",type:"email",class:"mt-1 block w-full",modelValue:s(e).email,"onUpdate:modelValue":o[1]||(o[1]=r=>s(e).email=r),required:"",autocomplete:"username"},null,8,["modelValue"]),a(i,{class:"mt-2",message:s(e).errors.email},null,8,["message"])]),l("div",q,[a(t,{for:"password",value:"Password"}),a(m,{id:"password",type:"password",class:"mt-1 block w-full",modelValue:s(e).password,"onUpdate:modelValue":o[2]||(o[2]=r=>s(e).password=r),required:"",autocomplete:"new-password"},null,8,["modelValue"]),a(i,{class:"mt-2",message:s(e).errors.password},null,8,["message"])]),l("div",B,[a(t,{for:"password_confirmation",value:"Confirm Password"}),a(m,{id:"password_confirmation",type:"password",class:"mt-1 block w-full",modelValue:s(e).password_confirmation,"onUpdate:modelValue":o[3]||(o[3]=r=>s(e).password_confirmation=r),required:"",autocomplete:"new-password"},null,8,["modelValue"]),a(i,{class:"mt-2",message:s(e).errors.password_confirmation},null,8,["message"])]),l("div",C,[a(s(V),{href:f.route("login"),class:"underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"},{default:n(()=>[d(" Already registered? ")]),_:1},8,["href"]),a(x,{class:v(["ms-4",{"opacity-25":s(e).processing}]),disabled:s(e).processing},{default:n(()=>[d(" Register ")]),_:1},8,["class","disabled"])])],32)]),_:1}))}});export{T as default};
