const fs=require('fs'),{chromium}=require('playwright');
const dir=__dirname+'/';
const print=fs.readFileSync(dir+'print.svg','utf8');
function shirt(id,base,shade,ink){
  const p=print.replace('<svg ','<svg x="190" y="150" width="220" height="220" ').replace('color="#111"',`color="${ink}"`);
  const body="M222 58 C250 92 350 92 378 58 L470 92 Q510 110 565 190 L497 262 L462 228 L466 590 Q466 606 448 606 L152 606 Q134 606 134 590 L138 228 L103 262 L35 190 Q90 110 130 92 Z";
  return `<svg viewBox="0 30 600 600" width="620" height="620" xmlns="http://www.w3.org/2000/svg">
  <defs>
   <linearGradient id="g${id}" x1="0" x2="1"><stop offset="0" stop-color="${shade}"/><stop offset=".22" stop-color="${base}"/><stop offset=".78" stop-color="${base}"/><stop offset="1" stop-color="${shade}"/></linearGradient>
   <filter id="b${id}"><feGaussianBlur stdDeviation="9"/></filter>
   <filter id="s${id}" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="0" dy="14" stdDeviation="16" flood-opacity=".18"/></filter>
   <clipPath id="c${id}"><path d="${body}"/></clipPath>
  </defs>
  <path d="${body}" fill="url(#g${id})" filter="url(#s${id})"/>
  <g clip-path="url(#c${id})" opacity=".5">
   <path d="M155 240 Q170 420 160 606" stroke="${shade}" stroke-width="14" fill="none" filter="url(#b${id})"/>
   <path d="M445 240 Q430 420 440 606" stroke="${shade}" stroke-width="14" fill="none" filter="url(#b${id})"/>
  </g>
  <path d="M222 58 C250 92 350 92 378 58" stroke="${shade}" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M234 62 C258 96 342 96 366 62" stroke="${shade}" stroke-width="1.5" fill="none" stroke-dasharray="3 3" opacity=".7"/>
  <path d="M138 228 L130 96 M462 228 L470 96" stroke="${shade}" stroke-width="1.5" fill="none" opacity=".6"/>
  ${p}
  </svg>`;
}
(async()=>{
  let html=fs.readFileSync(dir+'mockup.html','utf8')
    .replace('SHIRT_WHITE',shirt('w','#FAFAF8','#DCDAD5','#111'))
    .replace('SHIRT_BLACK',shirt('k','#1C1C1E','#0B0B0C','#F2F0EB'));
  // on black tee, the ink becomes light
  
  const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1420,height:900},deviceScaleFactor:2});
  await pg.setContent(html);await pg.screenshot({path:dir+'mockup.png',fullPage:true});
  await pg.setContent(`<body style="margin:0">${print.replace('width="400" height="400"','width="2000" height="2000"')}</body>`);
  await pg.setViewportSize({width:2000,height:2000});
  await pg.locator('svg').screenshot({path:dir+'print-transparent.png',omitBackground:true});
  await b.close();
})();
