with open('/Users/nicolassantos/Desktop/Proyectos/tableros/ficha_hogan.html', 'r') as f:
    lines = f.readlines()

start_idx = -1
end_idx = -1
for i, line in enumerate(lines):
    if 'function loadFicha(p){' in line:
        start_idx = i
    if '</script>' in line and start_idx != -1 and i > start_idx:
        end_idx = i
        break

new_js = """function loadFicha(p){
  document.getElementById('iNombre').textContent=p.nombre;

  // Header: fetch information from DATA.informacion
  const info=window.DATA.informacion[p.exp] || {};
  document.getElementById('iCargo').textContent=info.cargo?info.cargo:'—';
  document.getElementById('iDirComite').textContent=info.direccion_comite?info.direccion_comite:'—';
  document.getElementById('iGerencia').textContent=info.gerencia?info.gerencia:'—';
  document.getElementById('iJefe').textContent=info.jefe?info.jefe:'—';
  
  if(info.fecha_nacimiento){
    const fnac=new Date(info.fecha_nacimiento);
    const hoy=new Date();
    let edad=hoy.getFullYear()-fnac.getFullYear();
    const m=hoy.getMonth()-fnac.getMonth();
    if(m<0||(m===0&&hoy.getDate()<fnac.getDate()))edad--;
    document.getElementById('iEdad').textContent=edad+' años';
  } else {
    document.getElementById('iEdad').textContent='—';
  }
  if(info.fecha_ingreso){
    const fing=new Date(info.fecha_ingreso);
    const hoy=new Date();
    let ant=hoy.getFullYear()-fing.getFullYear();
    const m=hoy.getMonth()-fing.getMonth();
    if(m<0||(m===0&&hoy.getDate()<fing.getDate()))ant--;
    document.getElementById('iAntiguedad').textContent=ant+' años';
  } else {
    document.getElementById('iAntiguedad').textContent='—';
  }

  // Handle Photo
  const ihPhoto=document.getElementById('ihPhoto');
  const exts=['.jpeg','.jpg','.png'];
  const tryPhoto=function(idx){
    if(idx>=exts.length){
      const initials = p.nombre ? p.nombre.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : '';
      ihPhoto.innerHTML = '<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:var(--primary); color:#fff; font-size:40px; font-weight:bold;">' + initials + '</div>';
      return;
    }
    fetch('../data/FOTOS/'+p.exp+exts[idx], {method:'HEAD'}).then(function(r){
      if(r.ok){
        ihPhoto.innerHTML='';
        var img=new Image();
        img.alt=p.nombre;
        img.src='../data/FOTOS/'+p.exp+exts[idx];
        ihPhoto.appendChild(img);
      }else{
        tryPhoto(idx+1);
      }
    }).catch(function(){tryPhoto(idx+1);});
  };
  tryPhoto(0);

  // Fortalezas y Oportunidades
  const h = window.DATA.hogan[p.exp] || {};
  const extra = (window.HOGAN_EXTRAS && window.HOGAN_EXTRAS[p.exp]) || {};
  
  const fort = extra.fortalezas || h.fortalezas || '';
  const oport = extra.oportunidades || h.descarriladores || h.oportunidades || '';

  const formatBullets = (txt) => {
    if(!txt || txt === 'nan') return 'Sin datos';
    return String(txt).replace(/•/g, '<br><span style="color:var(--primary);font-weight:bold;">•</span>');
  };
  
  document.getElementById('fortText').innerHTML = fort ? formatBullets(fort) : 'Sin datos';
  document.getElementById('oportText').innerHTML = oport ? formatBullets(oport) : 'Sin datos';

  // Ninebox
  for(let i=1; i<=9; i++) {
     const box = document.getElementById('nb'+i);
     if(box) {
       box.style.border = 'none';
       box.style.opacity = '0.3';
       box.innerHTML = '';
     }
  }
  const cNum = getCajaNum(info.caja || p.caja);
  if(cNum && document.getElementById('nb'+cNum)) {
     const actBox = document.getElementById('nb'+cNum);
     actBox.style.border = '3px solid #111827';
     actBox.style.opacity = '1';
     actBox.innerHTML = '<span style="color:#111827;">' + cNum + '</span>';
     document.getElementById('nbText').textContent = 'Caja ' + cNum;
  } else {
     document.getElementById('nbText').textContent = 'Sin evaluación Ninebox';
  }

  // Competencias Hogan
  let comps = [];
  if (extra && extra.competencias) comps = extra.competencias;
  else if (h && h.competencias) comps = h.competencias;

  if (comps.length > 0) {
    const sorted = [...comps].sort((a,b)=>a.nombre.localeCompare(b.nombre,'es'));
    let chartHtml = '<div style="border:1px solid #ddd; border-radius:6px; overflow:hidden; background:#fff;">';
    chartHtml += '<div style="background:#333; color:#fff; padding:8px 16px; font-size:13px; font-weight:700; font-family:\\"Space Grotesk\\",sans-serif; display:flex; justify-content:space-between; align-items:center;">';
    chartHtml += '<span>PERFIL DE COMPETENCIAS (HOGAN) — ESCALA 0 A 100</span><span style="font-size:10px;font-weight:500;opacity:0.8;">(Puntaje)</span></div>';
    chartHtml += '<div style="padding:16px 20px 24px 16px;"><div style="display:flex; flex-direction:column; gap:10px;">';
    
    sorted.forEach(c=>{
      chartHtml+='<div style="display:flex; align-items:center; gap:12px;">';
      chartHtml+='<div style="width:180px; text-align:right; font-size:11.5px; font-weight:500; color:#333; flex-shrink:0;">'+c.nombre+'</div>';
      chartHtml+='<div style="flex:1; position:relative; height:20px; border-left:1px solid #ddd; border-right:1px solid #ddd;">';
      for(let g=0;g<=100;g+=10){
        let leftAdjust = g === 100 ? 'right:-10px;' : (g === 0 ? 'left:-5px;' : 'left:calc('+g+'% - 8px);');
        let transform = g === 100 ? '' : (g === 0 ? '' : 'transform:translateX(-50%);');
        chartHtml+='<div style="position:absolute; left:'+g+'%; top:-5px; bottom:-5px; width:1px; background:#f0f0f0; z-index:1;"></div>';
      }
      chartHtml+='<div style="position:absolute; left:0; top:2px; bottom:2px; width:'+Math.min(100, c.puntaje)+'%; background:#c0392b; z-index:2;"></div>';
      chartHtml+='</div>';
      chartHtml+='</div>';
    });

    chartHtml += '<div style="display:flex; align-items:center; gap:12px; margin-top:5px;">';
    chartHtml += '<div style="width:180px; flex-shrink:0;"></div>';
    chartHtml += '<div style="flex:1; position:relative; height:15px;">';
    for(let g=0;g<=100;g+=10){
      let leftAdjust = g === 100 ? 'right:-10px;' : (g === 0 ? 'left:-5px;' : 'left:calc('+g+'% - 8px);');
      let transform = g === 100 ? '' : (g === 0 ? '' : 'transform:translateX(-50%);');
      chartHtml += '<div style="position:absolute; '+leftAdjust+' top:0; font-size:10px; color:#666; '+transform+'">'+g+'</div>';
    }
    chartHtml += '</div></div>';
    chartHtml += '</div></div></div>';
    
    document.getElementById('hoganChartContainer').innerHTML = chartHtml;
  } else {
    document.getElementById('hoganChartContainer').innerHTML = '<div style="padding:20px; text-align:center; color:#666;">Sin datos de competencias Hogan</div>';
  }
  
  document.title = p.nombre + " - Hogan";
  const headerTitle = document.querySelector('.app-header h1');
  if (headerTitle) headerTitle.innerText = "Ficha Preliminar Hogan";
}

function getCajaNum(c){
  if(!c) return 0;
  const s = String(c).trim();
  if(s==='1'||s==='1. En riesgo') return 1;
  if(s==='2'||s==='2. En revisión') return 2;
  if(s==='3'||s==='3. Sólido') return 3;
  if(s==='4'||s==='4. Oportunidad en Rol') return 4;
  if(s==='5'||s==='5. Profesional Experimentado') return 5;
  if(s==='6'||s==='6. Alto Impacto') return 6;
  if(s==='7'||s==='7. Alto Potencial') return 7;
  if(s==='8'||s==='8. Estrella Ascendente') return 8;
  if(s==='9'||s==='9. Futuro Líder') return 9;
  return 0;
}
\n"""

if start_idx != -1 and end_idx != -1:
    res = "".join(lines[:start_idx]) + new_js + "".join(lines[end_idx:])
    with open('/Users/nicolassantos/Desktop/Proyectos/tableros/ficha_hogan.html', 'w') as f:
        f.write(res)
    print("JS patched!")
else:
    print(f"Could not find boundaries {start_idx} {end_idx}")
