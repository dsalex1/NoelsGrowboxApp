import{d as l,j as d,B as c,g as t,b as m,t as i,o as a,r as _,G as f,l as v,x as g,H as h}from"./app-ITWXJLxF.js";const b={class:"text-sm text-red-600"},B=l({__name:"InputError",props:{message:{}},setup(u){return(e,n)=>d((a(),t("div",null,[m("p",b,i(e.message),1)],512)),[[c,e.message]])}}),x={class:"block font-medium text-sm text-gray-700"},k={key:0},y={key:1},M=l({__name:"InputLabel",props:{value:{}},setup(u){return(e,n)=>(a(),t("label",x,[e.value?(a(),t("span",k,i(e.value),1)):(a(),t("span",y,[_(e.$slots,"default")]))]))}}),$=l({__name:"TextInput",props:{modelValue:{required:!0},modelModifiers:{}},emits:["update:modelValue"],setup(u,{expose:e}){const n=f(u,"modelValue"),r=v(null);return g(()=>{var s,o;(s=r.value)!=null&&s.hasAttribute("autofocus")&&((o=r.value)==null||o.focus())}),e({focus:()=>{var s;return(s=r.value)==null?void 0:s.focus()}}),(s,o)=>d((a(),t("input",{class:"border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm","onUpdate:modelValue":o[0]||(o[0]=p=>n.value=p),ref_key:"input",ref:r},null,512)),[[h,n.value]])}});export{M as _,$ as a,B as b};
