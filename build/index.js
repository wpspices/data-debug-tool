(()=>{"use strict";var e,a={957:(e,a,t)=>{const n=window.wp.element,s=window.wp.i18n,o=window.wp.apiFetch;var l=t.n(o);const r=window.wp.components,c=window.ReactJSXRuntime,d=({onFilter:e,totalPages:a=0})=>{const[t,o]=(0,n.useState)(""),[l,d]=(0,n.useState)({}),[i,u]=(0,n.useState)(!1),[p,m]=(0,n.useState)(!0),[b,g]=(0,n.useState)([]),[h,j]=(0,n.useState)([]),[f,v]=(0,n.useState)(!1),[x,_]=(0,n.useState)(1),[w,y]=(0,n.useState)(0);(0,n.useEffect)((()=>{y(a)}),[a]),(0,n.useEffect)((()=>{_(1),y(0)}),[t,l.table,l.column,l.search]);const k=e=>{_(e),S(e)},C=()=>{switch(console.log(" params ",l),t){case"option":return!!l.search;case"post":case"postmeta":case"user":case"usermeta":case"term":return!!l.id;case"plugins":case"themes":case"system-info":return!0;default:return!1}},S=(a=1)=>{t&&C()&&e({endpoint:t,params:{...l,is_decode:i?1:0,debug_nonce:window.dataDebugTool.nonce,page:a,search_type:p?"exact":"like"}})},N=Object.entries(window.dataDebugTool.filters).map((([e,a])=>({value:e,label:a})));return(0,c.jsxs)("div",{className:"filters-container",children:[(0,c.jsx)(r.SelectControl,{label:(0,s.__)("Debug Action","data-debug-tool"),value:t,options:[{value:"",label:(0,s.__)("Select an action...","data-debug-tool")},...N],onChange:e=>{o(e),d({})}}),(()=>{switch(t){case"option":return(0,c.jsx)(r.TextControl,{label:(0,s.__)("Option Name","data-debug-tool")+"*",value:l.search||"",onChange:e=>d({...l,search:e}),required:!0});case"post":case"postmeta":case"user":case"usermeta":case"term":return(0,c.jsxs)(c.Fragment,{children:[(0,c.jsx)(r.TextControl,{label:(0,s.__)("ID","data-debug-tool")+"*",type:"number",min:1,value:l.id||"",onChange:e=>d({...l,id:parseInt(e)}),required:!0}),["postmeta","usermeta"].includes(t)&&(0,c.jsx)(r.TextControl,{label:(0,s.__)("Key","data-debug-tool"),value:l.key||"",onChange:e=>d({...l,key:e})})]});default:return null}})(),(0,c.jsx)(r.ToggleControl,{label:(0,s.__)("Decode Data","data-debug-tool"),checked:i,onChange:u,help:(0,s.__)("Automatically decode and format JSON data, unserialize PHP serialized data, and parse Gutenberg blocks for better readability","data-debug-tool")}),w<=1?null:(0,c.jsxs)("div",{className:"pagination-wrapper",children:[(0,c.jsx)(r.Button,{variant:"secondary",onClick:()=>k(1),disabled:1===x,children:"<<"}),(0,c.jsx)(r.Button,{variant:"secondary",onClick:()=>k(x-1),disabled:1===x,children:"<"}),(0,c.jsxs)("span",{className:"page-info",children:[(0,s.__)("Page","data-debug-tool")," ",x," ",(0,s.__)("of","data-debug-tool")," ",w]}),(0,c.jsx)(r.Button,{variant:"secondary",onClick:()=>k(x+1),disabled:x===w,children:">"}),(0,c.jsx)(r.Button,{variant:"secondary",onClick:()=>k(w),disabled:x===w,children:">>"})]}),(0,c.jsx)(r.Button,{icon:"search",variant:"secondary",onClick:()=>S(1),disabled:!t||!C(),children:(0,s.__)("Search","data-debug-tool")})]})},i=({data:e})=>{if(!e)return null;const[a,t]=(0,n.useState)((0,s.__)("Copy","data-debug-tool")),o=e=>e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");return(0,c.jsxs)("div",{className:"json-viewer-container",children:[(0,c.jsx)("div",{className:"json-viewer-header",children:(0,c.jsx)(r.Button,{icon:"admin-page",onClick:()=>{const a=JSON.stringify(e,null,2);navigator.clipboard.writeText(a),t((0,s.__)("Copied!","data-debug-tool")),setTimeout((()=>{t((0,s.__)("Copy","data-debug-tool"))}),2e3)},className:"json-copy-button",label:(0,s.__)("Copy to clipboard","data-debug-tool"),children:a})}),(0,c.jsx)("div",{className:"json-viewer",dangerouslySetInnerHTML:{__html:(e=>{if(!e)return"";const a=(e,t="")=>{if(null===e)return'<span class="json-null">null</span>';if("boolean"==typeof e)return`<span class="json-boolean">${e}</span>`;if("number"==typeof e)return`<span class="json-number">${e}</span>`;if("string"==typeof e)return`<span class="json-string">"<span class="json-string-value">${o(e)}</span>"</span>`;if(Array.isArray(e))return 0===e.length?'<span class="json-bracket">[]</span>':`<span class="json-bracket">[</span>\n${e.map((e=>`${t}  ${a(e,t+"  ")}`)).join('<span class="json-comma">,</span>\n')}\n${t}<span class="json-bracket">]</span>`;if("object"==typeof e){const n=Object.entries(e);return 0===n.length?'<span class="json-bracket">{}</span>':`<span class="json-bracket">{</span>\n${n.map((([e,n])=>`${t}  <span class="json-key">"${o(e)}"</span>: ${a(n,t+"  ")}`)).join('<span class="json-comma">,</span>\n')}\n${t}<span class="json-bracket">}</span>`}return String(e)};return a(e)})(e)}})]})},u=()=>{const[e,a]=(0,n.useState)(!1),[t,o]=(0,n.useState)(null),[u,p]=(0,n.useState)(0),[m,b]=(0,n.useState)(!1),[g,h]=(0,n.useState)(!1);return(0,n.useEffect)((()=>{const e=()=>{document.fullscreenElement||document.webkitFullscreenElement||(b(!1),document.body.classList.remove("fullscreen-mode"))};return document.addEventListener("fullscreenchange",e),document.addEventListener("webkitfullscreenchange",e),()=>{document.removeEventListener("fullscreenchange",e),document.removeEventListener("webkitfullscreenchange",e)}}),[]),(0,c.jsxs)("div",{className:"debug-tool-wrapper "+(e?"dark-mode":""),children:[(0,c.jsxs)("header",{className:"debug-tool-header",children:[(0,c.jsxs)("div",{className:"header-title",children:[(0,c.jsx)(r.Icon,{icon:"admin-tools",size:30}),(0,c.jsx)("h1",{children:window.dataDebugTool.title})]}),(0,c.jsxs)("div",{className:"header-controls",children:[(0,c.jsx)(r.Button,{icon:"star-half",className:"icon-button",onClick:()=>a(!e),label:(0,s.__)("Toggle Dark Mode","data-debug-tool"),isPressed:e}),(0,c.jsx)(r.Button,{icon:m?"fullscreen-exit-alt":"fullscreen-alt",className:"icon-button",onClick:()=>{const e=document.documentElement;document.fullscreenElement||document.webkitFullscreenElement?(document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen&&document.webkitExitFullscreen(),b(!1),document.body.classList.remove("fullscreen-mode")):(e.requestFullscreen?e.requestFullscreen():e.webkitRequestFullscreen&&e.webkitRequestFullscreen(),b(!0),document.body.classList.add("fullscreen-mode"))},label:(0,s.__)("Toggle Fullscreen","data-debug-tool"),isPressed:m})]})]}),(0,c.jsxs)("div",{className:"debug-tool-content",children:[(0,c.jsx)("aside",{className:"filters-panel",children:(0,c.jsx)(d,{onFilter:e=>{(async({endpoint:e,params:a})=>{h(!0);try{const t=await l()({path:`/data-debug-tool/v1/${e}`,method:"POST",data:a});void 0!==t&&void 0!==t.data||null!==t.data?(o(t.data),t.data.pages&&p(t.data.pages)):(console.error("API Error:",t.message||"Unknown error occurred"),o(null),p(0))}catch(e){console.error("Error fetching data:",e),o(null),p(0)}h(!1)})(e)},totalPages:u})}),(0,c.jsx)("main",{className:"output-panel",children:g?(0,c.jsx)("div",{className:"loading-spinner"}):(0,c.jsx)(i,{data:t})})]})]})};(0,n.createRoot)(document.getElementById("data-debug-tool-root")).render((0,c.jsx)(u,{}))}},t={};function n(e){var s=t[e];if(void 0!==s)return s.exports;var o=t[e]={exports:{}};return a[e](o,o.exports,n),o.exports}n.m=a,e=[],n.O=(a,t,s,o)=>{if(!t){var l=1/0;for(i=0;i<e.length;i++){t=e[i][0],s=e[i][1],o=e[i][2];for(var r=!0,c=0;c<t.length;c++)(!1&o||l>=o)&&Object.keys(n.O).every((e=>n.O[e](t[c])))?t.splice(c--,1):(r=!1,o<l&&(l=o));if(r){e.splice(i--,1);var d=s();void 0!==d&&(a=d)}}return a}o=o||0;for(var i=e.length;i>0&&e[i-1][2]>o;i--)e[i]=e[i-1];e[i]=[t,s,o]},n.n=e=>{var a=e&&e.__esModule?()=>e.default:()=>e;return n.d(a,{a}),a},n.d=(e,a)=>{for(var t in a)n.o(a,t)&&!n.o(e,t)&&Object.defineProperty(e,t,{enumerable:!0,get:a[t]})},n.o=(e,a)=>Object.prototype.hasOwnProperty.call(e,a),(()=>{var e={57:0,350:0};n.O.j=a=>0===e[a];var a=(a,t)=>{var s,o,l=t[0],r=t[1],c=t[2],d=0;if(l.some((a=>0!==e[a]))){for(s in r)n.o(r,s)&&(n.m[s]=r[s]);if(c)var i=c(n)}for(a&&a(t);d<l.length;d++)o=l[d],n.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return n.O(i)},t=self.webpackChunkdata_debug_tool=self.webpackChunkdata_debug_tool||[];t.forEach(a.bind(null,0)),t.push=a.bind(null,t.push.bind(t))})();var s=n.O(void 0,[350],(()=>n(957)));s=n.O(s)})();