async function s(n,t=!1,a){const e=await fetch(n,{headers:{},credentials:t?"include":"same-origin"});return e.ok?await e.json():null}export{s as g};
