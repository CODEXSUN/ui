/** Run in head before styles/body paint. Validates display preferences only. */
export function createThemeInitScript(storageKey: string) {
  const key = JSON.stringify(storageKey).replaceAll('<', '\\u003c');
  return `(function(){try{var p=JSON.parse(localStorage.getItem(${key})||'null')||{};var m=['light','dark','system'].includes(p.mode)?p.mode:'light';var d=m==='dark'||(m==='system'&&matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.dataset.theme=d?'dark':'light';r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light';r.dataset.designSystem='default';r.dataset.designVariant=['default','compact','clear','shadcn','neutral','orange','green','blue','purple','graphite'].includes(p.palette)?p.palette:'default';r.dataset.accent=['green','blue','violet'].includes(p.accent)?p.accent:'green';}catch(e){}})();`;
}
