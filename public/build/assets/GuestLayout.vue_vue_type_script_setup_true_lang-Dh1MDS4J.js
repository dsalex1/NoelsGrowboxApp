import{u as h,q as R,C as M,p as L,I as $,A as H,J as q,K as X,L as Z,M as Q,d as U,o as W,g as z,a as _,b as S,w as C,x as Y,F as ee,N as te,r as ne,Z as re,k as F,e as oe,t as se,h as ie}from"./app-DxCWqXKB.js";function ae(e){return X()?(Z(e),!0):!1}function j(e){return typeof e=="function"?e():h(e)}const le=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const ce=Object.prototype.toString,ue=e=>ce.call(e)==="[object Object]",fe=()=>{};function de(e,n){function t(...o){return new Promise((s,l)=>{Promise.resolve(e(()=>n.apply(this,o),{fn:n,thisArg:this,args:o})).then(s).catch(l)})}return t}const P=e=>e();function pe(e=P){const n=L(!0);function t(){n.value=!1}function o(){n.value=!0}const s=(...l)=>{n.value&&e(...l)};return{isActive:$(n),pause:t,resume:o,eventFilter:s}}function ge(e){return q()}function he(e,n,t={}){const{eventFilter:o=P,...s}=t;return H(e,de(o,n),s)}function me(e,n,t={}){const{eventFilter:o,...s}=t,{eventFilter:l,pause:m,resume:w,isActive:v}=pe(o);return{stop:he(e,n,{...s,eventFilter:l}),pause:m,resume:w,isActive:v}}function ye(e,n=!0,t){ge()?R(e,t):n?e():M(e)}function we(e){var n;const t=j(e);return(n=t==null?void 0:t.$el)!=null?n:t}const E=le?window:void 0;function T(...e){let n,t,o,s;if(typeof e[0]=="string"||Array.isArray(e[0])?([t,o,s]=e,n=E):[n,t,o,s]=e,!n)return fe;Array.isArray(t)||(t=[t]),Array.isArray(o)||(o=[o]);const l=[],m=()=>{l.forEach(c=>c()),l.length=0},w=(c,a,y,u)=>(c.addEventListener(a,y,u),()=>c.removeEventListener(a,y,u)),v=H(()=>[we(n),j(s)],([c,a])=>{if(m(),!c)return;const y=ue(a)?{...a}:a;l.push(...t.flatMap(u=>o.map(x=>w(c,u,x,y))))},{immediate:!0,flush:"post"}),d=()=>{v(),m()};return ae(d),d}const N=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},O="__vueuse_ssr_handlers__",ve=be();function be(){return O in N||(N[O]=N[O]||{}),N[O]}function _e(e,n){return ve[e]||n}function Se(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const xe={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},J="vueuse-storage";function Ae(e,n,t,o={}){var s;const{flush:l="pre",deep:m=!0,listenToStorageChanges:w=!0,writeDefaults:v=!0,mergeDefaults:d=!1,shallow:c,window:a=E,eventFilter:y,onError:u=r=>{console.error(r)},initOnMounted:x}=o,p=(c?Q:L)(typeof n=="function"?n():n);if(!t)try{t=_e("getDefaultStorage",()=>{var r;return(r=E)==null?void 0:r.localStorage})()}catch(r){u(r)}if(!t)return p;const g=j(n),V=Se(g),b=(s=o.serializer)!=null?s:xe[V],{pause:B,resume:k}=me(p,()=>G(p.value),{flush:l,deep:m,eventFilter:y});a&&w&&ye(()=>{T(a,"storage",A),T(a,J,K),x&&A()}),x||A();function D(r,i){a&&a.dispatchEvent(new CustomEvent(J,{detail:{key:e,oldValue:r,newValue:i,storageArea:t}}))}function G(r){try{const i=t.getItem(e);if(r==null)D(i,null),t.removeItem(e);else{const f=b.write(r);i!==f&&(t.setItem(e,f),D(i,f))}}catch(i){u(i)}}function I(r){const i=r?r.newValue:t.getItem(e);if(i==null)return v&&g!=null&&t.setItem(e,b.write(g)),g;if(!r&&d){const f=b.read(i);return typeof d=="function"?d(f,g):V==="object"&&!Array.isArray(f)?{...g,...f}:f}else return typeof i!="string"?i:b.read(i)}function A(r){if(!(r&&r.storageArea!==t)){if(r&&r.key==null){p.value=g;return}if(!(r&&r.key!==e)){B();try{(r==null?void 0:r.newValue)!==b.write(p.value)&&(p.value=I(r))}catch(i){u(i)}finally{r?M(k):k()}}}}function K(r){A(r.detail)}return p}const Ne={style:{height:"100vh"}},Oe={style:{"background-image":"url('/images/header-bg.png')","object-fit":"contain",height:"160px","font-size":"1.3em"},class:"d-flex justify-between align-center px-lg-12 px-4"},Ce={class:"d-flex align-center ga-6"},Fe=S("img",{style:{width:"70px"},src:"/images/logo.png",alt:""},null,-1),Ee={key:0},je={style:{"min-height":"calc(100vh - 160px)"},class:"pa-lg-6"},Ve=te('<footer style="background-image:url(&#39;/images/footer-bg.png&#39;);height:200px;position:relative;"><div class="d-flex justify-center align-center" style="position:absolute;bottom:5px;left:50%;transform:translateX(-50%);"><div class="d-sm-flex ga-6 text-h6" style="color:white;"><div><a href="/impressum" class="text-white text-decoration-none" target="_blank">Impressum</a></div><div><a href="/datenschutz" class="text-white text-decoration-none" target="_blank">Datenschutz</a></div></div></div></footer>',1),De=U({__name:"GuestLayout",props:{title:{}},setup(e){const n=Ae("Holsteiner-Huepfburgen-Verleih_Shopping-Cart",[]);return(t,o)=>{const s=ne("v-icon");return W(),z(ee,null,[_(h(re),{title:t.title},null,8,["title"]),S("div",Ne,[S("nav",Oe,[S("span",Ce,[_(h(F),{href:"/"},{default:C(()=>[Fe]),_:1}),_(h(F),{href:"/products",class:"text-decoration-none",style:{color:"inherit"}},{default:C(()=>[oe("Produkte")]),_:1})]),_(h(F),{class:"text-decoration-none",href:"/checkout",style:{color:"rgb(54, 87, 162)"}},{default:C(()=>[_(s,{icon:"mdi-cart-outline"}),h(n).length!=0?(W(),z("span",Ee,"("+se(h(n).length)+")",1)):ie("",!0)]),_:1})]),S("div",je,[Y(t.$slots,"default")]),Ve])],64)}}});export{De as _,Ae as u};
