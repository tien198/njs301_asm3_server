async function o(t,r=!1,a){const e=await fetch(t,{headers:{},credentials:r?"include":"same-origin"});if(!e.ok)throw new Error("Failed to fetch products");return await e.json()}export{o as g};
