import{o as m,g as h,x as v,d as x,A as C,q as B,s as D,i as E,c as V,a,w as l,z as p,B as U,j as y,y as _,b as s,n as k,h as A,p as g,T as S,C as T,e as w,u as d,E as N}from"./app-DxCWqXKB.js";import{_ as z}from"./_plugin-vue_export-helper-DlAUqK2U.js";import{_ as M,a as O,b as P}from"./TextInput.vue_vue_type_script_setup_true_lang-Dud97MN5.js";const W={},j={class:"inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-500 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition ease-in-out duration-150"};function F(r,n){return m(),h("button",j,[v(r.$slots,"default")])}const b=z(W,[["render",F]]),I={class:"fixed inset-0 overflow-y-auto px-4 py-6 sm:px-0 z-50","scroll-region":""},K=s("div",{class:"absolute inset-0 bg-gray-500 opacity-75"},null,-1),L=[K],q=x({__name:"Modal",props:{show:{type:Boolean,default:!1},maxWidth:{default:"2xl"},closeable:{type:Boolean,default:!0}},emits:["close"],setup(r,{emit:n}){const t=r,o=n;C(()=>t.show,()=>{t.show?document.body.style.overflow="hidden":document.body.style.overflow="visible"});const u=()=>{t.closeable&&o("close")},c=e=>{e.key==="Escape"&&t.show&&u()};B(()=>document.addEventListener("keydown",c)),D(()=>{document.removeEventListener("keydown",c),document.body.style.overflow="visible"});const i=E(()=>({sm:"sm:max-w-sm",md:"sm:max-w-md",lg:"sm:max-w-lg",xl:"sm:max-w-xl","2xl":"sm:max-w-2xl"})[t.maxWidth]);return(e,f)=>(m(),V(U,{to:"body"},[a(p,{"leave-active-class":"duration-200"},{default:l(()=>[y(s("div",I,[a(p,{"enter-active-class":"ease-out duration-300","enter-from-class":"opacity-0","enter-to-class":"opacity-100","leave-active-class":"ease-in duration-200","leave-from-class":"opacity-100","leave-to-class":"opacity-0"},{default:l(()=>[y(s("div",{class:"fixed inset-0 transform transition-all",onClick:u},L,512),[[_,e.show]])]),_:1}),a(p,{"enter-active-class":"ease-out duration-300","enter-from-class":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95","enter-to-class":"opacity-100 translate-y-0 sm:scale-100","leave-active-class":"ease-in duration-200","leave-from-class":"opacity-100 translate-y-0 sm:scale-100","leave-to-class":"opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"},{default:l(()=>[y(s("div",{class:k(["mb-6 bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:w-full sm:mx-auto",i.value])},[e.show?v(e.$slots,"default",{key:0}):A("",!0)],2),[[_,e.show]])]),_:3})],512),[[_,e.show]])]),_:3})]))}}),G=["type"],H=x({__name:"SecondaryButton",props:{type:{default:"button"}},setup(r){return(n,t)=>(m(),h("button",{type:n.type,class:"inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150"},[v(n.$slots,"default")],8,G))}}),J={class:"space-y-6"},Q=s("header",null,[s("h2",{class:"text-lg font-medium text-gray-900"},"Delete Account"),s("p",{class:"mt-1 text-sm text-gray-600"}," Once your account is deleted, all of its resources and data will be permanently deleted. Before deleting your account, please download any data or information that you wish to retain. ")],-1),R={class:"p-6"},X=s("h2",{class:"text-lg font-medium text-gray-900"}," Are you sure you want to delete your account? ",-1),Y=s("p",{class:"mt-1 text-sm text-gray-600"}," Once your account is deleted, all of its resources and data will be permanently deleted. Please enter your password to confirm you would like to permanently delete your account. ",-1),Z={class:"mt-6"},ee={class:"mt-6 flex justify-end"},ae=x({__name:"DeleteUserForm",setup(r){const n=g(!1),t=g(null),o=S({password:""}),u=()=>{n.value=!0,T(()=>{var e;return(e=t.value)==null?void 0:e.focus()})},c=()=>{o.delete(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>i(),onError:()=>{var e;return(e=t.value)==null?void 0:e.focus()},onFinish:()=>{o.reset()}})},i=()=>{n.value=!1,o.reset()};return(e,f)=>(m(),h("section",J,[Q,a(b,{onClick:u},{default:l(()=>[w("Delete Account")]),_:1}),a(q,{show:n.value,onClose:i},{default:l(()=>[s("div",R,[X,Y,s("div",Z,[a(M,{for:"password",value:"Password",class:"sr-only"}),a(O,{id:"password",ref_key:"passwordInput",ref:t,modelValue:d(o).password,"onUpdate:modelValue":f[0]||(f[0]=$=>d(o).password=$),type:"password",class:"mt-1 block w-3/4",placeholder:"Password",onKeyup:N(c,["enter"])},null,8,["modelValue"]),a(P,{message:d(o).errors.password,class:"mt-2"},null,8,["message"])]),s("div",ee,[a(H,{onClick:i},{default:l(()=>[w(" Cancel ")]),_:1}),a(b,{class:k(["ms-3",{"opacity-25":d(o).processing}]),disabled:d(o).processing,onClick:c},{default:l(()=>[w(" Delete Account ")]),_:1},8,["class","disabled"])])])]),_:1},8,["show"])]))}});export{ae as _};
