import{u as P,z as G,x as D,l as T,a7 as H,q as z,a3 as R,a8 as q,a9 as I,a1 as K}from"./app-DytueWss.js";function $(e){return q()?(I(e),!0):!1}function F(e){return typeof e=="function"?e():P(e)}const B=typeof window<"u"&&typeof document<"u";typeof WorkerGlobalScope<"u"&&globalThis instanceof WorkerGlobalScope;const Q=Object.prototype.toString,U=e=>Q.call(e)==="[object Object]",X=()=>{};function Y(e,r){function t(...i){return new Promise((a,u)=>{Promise.resolve(e(()=>r.apply(this,i),{fn:r,thisArg:this,args:i})).then(a).catch(u)})}return t}const J=e=>e();function Z(e=J){const r=T(!0);function t(){r.value=!1}function i(){r.value=!0}const a=(...u)=>{r.value&&e(...u)};return{isActive:H(r),pause:t,resume:i,eventFilter:a}}function k(e){return R()}function ee(e,r,t={}){const{eventFilter:i=J,...a}=t;return z(e,Y(i,r),a)}function te(e,r,t={}){const{eventFilter:i,...a}=t,{eventFilter:u,pause:g,resume:m,isActive:h}=Z(i);return{stop:ee(e,r,{...a,eventFilter:u}),pause:g,resume:m,isActive:h}}function ne(e,r=!0,t){k()?G(e,t):r?e():D(e)}function re(e){var r;const t=F(e);return(r=t==null?void 0:t.$el)!=null?r:t}const E=B?window:void 0;function j(...e){let r,t,i,a;if(typeof e[0]=="string"||Array.isArray(e[0])?([t,i,a]=e,r=E):[r,t,i,a]=e,!r)return X;Array.isArray(t)||(t=[t]),Array.isArray(i)||(i=[i]);const u=[],g=()=>{u.forEach(l=>l()),u.length=0},m=(l,s,w,c)=>(l.addEventListener(s,w,c),()=>l.removeEventListener(s,w,c)),h=z(()=>[re(r),F(a)],([l,s])=>{if(g(),!l)return;const w=U(s)?{...s}:s;u.push(...t.flatMap(c=>i.map(b=>m(l,c,b,w))))},{immediate:!0,flush:"post"}),p=()=>{h(),g()};return $(p),p}const A=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{},O="__vueuse_ssr_handlers__",ie=oe();function oe(){return O in A||(A[O]=A[O]||{}),A[O]}function ae(e,r){return ie[e]||r}function se(e){return e==null?"any":e instanceof Set?"set":e instanceof Map?"map":e instanceof Date?"date":typeof e=="boolean"?"boolean":typeof e=="string"?"string":typeof e=="object"?"object":Number.isNaN(e)?"any":"number"}const ue={boolean:{read:e=>e==="true",write:e=>String(e)},object:{read:e=>JSON.parse(e),write:e=>JSON.stringify(e)},number:{read:e=>Number.parseFloat(e),write:e=>String(e)},any:{read:e=>e,write:e=>String(e)},string:{read:e=>e,write:e=>String(e)},map:{read:e=>new Map(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e.entries()))},set:{read:e=>new Set(JSON.parse(e)),write:e=>JSON.stringify(Array.from(e))},date:{read:e=>new Date(e),write:e=>e.toISOString()}},C="vueuse-storage";function ce(e,r,t,i={}){var a;const{flush:u="pre",deep:g=!0,listenToStorageChanges:m=!0,writeDefaults:h=!0,mergeDefaults:p=!1,shallow:l,window:s=E,eventFilter:w,onError:c=n=>{console.error(n)},initOnMounted:b}=i,d=(l?K:T)(r);if(!t)try{t=ae("getDefaultStorage",()=>{var n;return(n=E)==null?void 0:n.localStorage})()}catch(n){c(n)}if(!t)return d;const y=F(r),N=se(y),S=(a=i.serializer)!=null?a:ue[N],{pause:M,resume:_}=te(d,()=>V(d.value),{flush:u,deep:g,eventFilter:w});s&&m&&ne(()=>{j(s,"storage",v),j(s,C,x),b&&v()}),b||v();function W(n,o){s&&s.dispatchEvent(new CustomEvent(C,{detail:{key:e,oldValue:n,newValue:o,storageArea:t}}))}function V(n){try{const o=t.getItem(e);if(n==null)W(o,null),t.removeItem(e);else{const f=S.write(n);o!==f&&(t.setItem(e,f),W(o,f))}}catch(o){c(o)}}function L(n){const o=n?n.newValue:t.getItem(e);if(o==null)return h&&y!=null&&t.setItem(e,S.write(y)),y;if(!n&&p){const f=S.read(o);return typeof p=="function"?p(f,y):N==="object"&&!Array.isArray(f)?{...y,...f}:f}else return typeof o!="string"?o:S.read(o)}function v(n){if(!(n&&n.storageArea!==t)){if(n&&n.key==null){d.value=y;return}if(!(n&&n.key!==e)){M();try{(n==null?void 0:n.newValue)!==S.write(d.value)&&(d.value=L(n))}catch(o){c(o)}finally{n?D(_):_()}}}}function x(n){v(n.detail)}return d}export{ce as u};