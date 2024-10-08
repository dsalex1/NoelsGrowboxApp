import{A as M}from"./ApplicationLogo-DfeHetEq.js";import{d as m,z as N,A as E,i as y,l as L,g as u,b as t,r as h,j as k,E as $,a,w as o,B as S,o as d,n as f,c as B,u as j,k as D,h as b,t as _,m as z,e as n}from"./app-DytueWss.js";const O={class:"relative"},A=m({__name:"Dropdown",props:{align:{default:"right"},width:{default:"48"},contentClasses:{default:"py-1 bg-white"}},setup(c){const s=c,e=l=>{r.value&&l.key==="Escape"&&(r.value=!1)};N(()=>document.addEventListener("keydown",e)),E(()=>document.removeEventListener("keydown",e));const i=y(()=>({48:"w-48"})[s.width.toString()]),g=y(()=>s.align==="left"?"ltr:origin-top-left rtl:origin-top-right start-0":s.align==="right"?"ltr:origin-top-right rtl:origin-top-left end-0":"origin-top"),r=L(!1);return(l,p)=>(d(),u("div",O,[t("div",{onClick:p[0]||(p[0]=w=>r.value=!r.value)},[h(l.$slots,"trigger")]),k(t("div",{class:"fixed inset-0 z-40",onClick:p[1]||(p[1]=w=>r.value=!1)},null,512),[[$,r.value]]),a(S,{"enter-active-class":"transition ease-out duration-200","enter-from-class":"opacity-0 scale-95","enter-to-class":"opacity-100 scale-100","leave-active-class":"transition ease-in duration-75","leave-from-class":"opacity-100 scale-100","leave-to-class":"opacity-0 scale-95"},{default:o(()=>[k(t("div",{class:f(["absolute z-50 mt-2 rounded-md shadow-lg",[i.value,g.value]]),style:{display:"none"},onClick:p[2]||(p[2]=w=>r.value=!1)},[t("div",{class:f(["rounded-md ring-1 ring-black ring-opacity-5",l.contentClasses])},[h(l.$slots,"content")],2)],2),[[$,r.value]])]),_:3})]))}}),C=m({__name:"DropdownLink",props:{href:{}},setup(c){return(s,e)=>(d(),B(j(D),{href:s.href,class:"block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"},{default:o(()=>[h(s.$slots,"default")]),_:3},8,["href"]))}}),V=["href"],x=m({__name:"NavLink",props:{href:{},active:{type:Boolean}},setup(c){const s=c,e=y(()=>s.active?"inline-flex items-center px-1 pt-1 border-b-2 border-indigo-400 text-sm font-medium leading-5 text-gray-900 focus:outline-none focus:border-indigo-700 transition duration-150 ease-in-out":"inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium leading-5 text-gray-500 hover:text-gray-700 hover:border-gray-300 focus:outline-none focus:text-gray-700 focus:border-gray-300 transition duration-150 ease-in-out");return(i,g)=>(d(),u("a",{href:i.href,class:f(e.value)},[h(i.$slots,"default")],10,V))}}),P=["href"],v=m({__name:"ResponsiveNavLink",props:{href:{},active:{type:Boolean}},setup(c){const s=c,e=y(()=>s.active?"block w-full ps-3 pe-4 py-2 border-l-4 border-indigo-400 text-start text-base font-medium text-indigo-700 bg-indigo-50 focus:outline-none focus:text-indigo-800 focus:bg-indigo-100 focus:border-indigo-700 transition duration-150 ease-in-out":"block w-full ps-3 pe-4 py-2 border-l-4 border-transparent text-start text-base font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:text-gray-800 focus:bg-gray-50 focus:border-gray-300 transition duration-150 ease-in-out");return(i,g)=>(d(),u("a",{href:i.href,class:f(e.value)},[h(i.$slots,"default")],10,P))}}),T={class:"min-h-screen bg-gray-100"},R={class:"bg-white border-b border-gray-100"},U={class:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"},q={class:"flex justify-between h-16"},F={class:"flex"},G={class:"shrink-0 flex items-center"},H={class:"hidden space-x-8 sm:-my-px sm:ms-10 sm:flex"},I={key:0,class:"hidden sm:flex sm:items-center sm:ms-6"},J={class:"ms-3 relative"},K={class:"inline-flex rounded-md"},Q={type:"button",class:"inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 bg-white hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"},W=t("svg",{class:"ms-2 -me-0.5 h-4 w-4",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor"},[t("path",{"fill-rule":"evenodd",d:"M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z","clip-rule":"evenodd"})],-1),X={class:"-me-2 flex items-center sm:hidden"},Y={class:"h-6 w-6",stroke:"currentColor",fill:"none",viewBox:"0 0 24 24"},Z={class:"pt-2 pb-3 space-y-1"},ee={key:0,class:"pt-4 pb-1 border-t border-gray-200"},te={class:"px-4"},se={class:"font-medium text-base text-gray-800"},oe={class:"font-medium text-sm text-gray-500"},re={class:"mt-3 space-y-1"},ae={key:0,class:"bg-white shadow"},ne={class:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8"},ie={class:"font-semibold text-xl text-gray-800 leading-tight"},le={class:"py-5"},de={class:"max-w-7xl mx-auto sm:px-6 lg:px-8"},fe=m({__name:"AuthenticatedLayout",setup(c){const s=L(!1);return(e,i)=>{const g=z("v-alert");return d(),u("div",null,[t("div",T,[t("nav",R,[t("div",U,[t("div",q,[t("div",F,[t("div",G,[a(j(D),{href:e.route("dashboard")},{default:o(()=>[a(M,{class:"block h-9 w-auto fill-current text-gray-800"})]),_:1},8,["href"])]),t("div",H,[a(x,{href:e.route("dashboard"),active:e.route().current("dashboard")},{default:o(()=>[n("Dashboard")]),_:1},8,["href","active"]),a(x,{href:e.route("logs"),active:e.route().current("logs")},{default:o(()=>[n("Logs")]),_:1},8,["href","active"]),a(x,{href:e.route("settings"),active:e.route().current("settings")},{default:o(()=>[n("Settings")]),_:1},8,["href","active"])])]),e.$page.props.auth.user?(d(),u("div",I,[t("div",J,[a(A,{align:"right",width:"48"},{trigger:o(()=>{var r,l;return[t("span",K,[t("button",Q,[n(_((l=(r=e.$page.props.auth)==null?void 0:r.user)==null?void 0:l.name)+" ",1),W])])]}),content:o(()=>[a(C,{href:e.route("profile.edit")},{default:o(()=>[n("Profile")]),_:1},8,["href"]),a(C,{href:e.route("logout"),method:"post",as:"button"},{default:o(()=>[n("Log Out")]),_:1},8,["href"])]),_:1})])])):b("",!0),t("div",X,[t("button",{onClick:i[0]||(i[0]=r=>s.value=!s.value),class:"inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"},[(d(),u("svg",Y,[t("path",{class:f({hidden:s.value,"inline-flex":!s.value}),"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M4 6h16M4 12h16M4 18h16"},null,2),t("path",{class:f({hidden:!s.value,"inline-flex":s.value}),"stroke-linecap":"round","stroke-linejoin":"round","stroke-width":"2",d:"M6 18L18 6M6 6l12 12"},null,2)]))])])])]),t("div",{class:f([{block:s.value,hidden:!s.value},"sm:hidden"])},[t("div",Z,[a(v,{href:e.route("dashboard"),active:e.route().current("dashboard")},{default:o(()=>[n("Dashboard")]),_:1},8,["href","active"]),a(v,{href:e.route("logs"),active:e.route().current("logs")},{default:o(()=>[n("Logs")]),_:1},8,["href","active"]),a(v,{href:e.route("settings"),active:e.route().current("settings")},{default:o(()=>[n("Settings")]),_:1},8,["href","active"])]),e.$page.props.auth.user?(d(),u("div",ee,[t("div",te,[t("div",se,_(e.$page.props.auth.user.name),1),t("div",oe,_(e.$page.props.auth.user.email),1)]),t("div",re,[a(v,{href:e.route("profile.edit")},{default:o(()=>[n("Profile")]),_:1},8,["href"]),a(v,{href:e.route("logout"),method:"post",as:"button"},{default:o(()=>[n("Log Out")]),_:1},8,["href"])])])):b("",!0)],2)]),e.$slots.header?(d(),u("header",ae,[t("div",ne,[t("h2",ie,[h(e.$slots,"header")])])])):b("",!0),t("main",null,[t("div",le,[t("div",de,[Object.keys(e.$page.props.errors).length>0?(d(),B(g,{key:0,type:"error",variant:"tonal",class:"mb-2",dismissible:""},{default:o(()=>[n(_(Object.entries(e.$page.props.errors).map(([r,l])=>r+": "+l).join(" ")),1)]),_:1})):b("",!0),h(e.$slots,"default")])])])])])}}});export{fe as _};