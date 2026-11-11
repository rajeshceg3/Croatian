import {resetMap,getMap} from './map-module.js';
const browse=document.getElementById('browse-map');
const theme=document.getElementById('world-theme');
function syncBrowse(){const open=document.body.classList.contains('browse-open');browse.setAttribute('aria-expanded',String(open));browse.textContent=open?'Close collection':'Explore 73 places'; setTimeout(()=>getMap()?.invalidateSize(),0);}
browse.addEventListener('click',()=>{document.body.classList.toggle('browse-open');syncBrowse();});
document.getElementById('reset-map').addEventListener('click',()=>{resetMap();document.getElementById('site-detail-panel').classList.add('hidden');document.body.classList.remove('browse-open');syncBrowse();});
function syncTheme(){theme.textContent=document.documentElement.dataset.theme==='dark'?'Light UI':'Dark UI';}
theme.addEventListener('click',()=>{document.getElementById('theme-toggle').click();syncTheme();});
new MutationObserver(syncTheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
new MutationObserver(syncBrowse).observe(document.body,{attributes:true,attributeFilter:['class']});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){document.body.classList.remove('browse-open');document.getElementById('site-detail-panel').classList.add('hidden');document.querySelectorAll('.modal-overlay').forEach(x=>x.classList.add('hidden'));window.speechSynthesis?.cancel();syncBrowse();} if(e.key==='Home'&&!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)){e.preventDefault();document.getElementById('reset-map').click();}});
// Inherited photos sometimes fail or are not photos. Do not fabricate replacements.
document.addEventListener('error',e=>{if(e.target instanceof HTMLImageElement){e.target.hidden=true;}},true);
// Explicit, inspectable ready marker for the real-browser verifier.
window.croatiaMap={getMap,resetMap};
syncTheme();syncBrowse();
