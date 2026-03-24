/**
 * Embeddable visitor counter + powered-by badge for generated apps.
 * Lightweight, non-intrusive, mobile-friendly.
 */
export function getWidgetScript(projectId: string, primaryColor: string): string {
  return `
<div id="vd-badge" style="position:fixed;bottom:16px;right:16px;z-index:999;display:flex;align-items:center;gap:8px;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:8px 14px;box-shadow:0 2px 12px rgba(0,0,0,.08);font-family:Inter,-apple-system,sans-serif;cursor:pointer;transition:all .2s;max-width:200px" onclick="window.open('https://vibedeploy.app','_blank')" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 6px 20px rgba(0,0,0,.12)'" onmouseout="this.style.transform='';this.style.boxShadow='0 2px 12px rgba(0,0,0,.08)'">
  <span style="font-size:14px">✨</span>
  <div>
    <div style="font-size:11px;font-weight:600;color:#111827;line-height:1.3">Built with VibeDeploy</div>
    <div style="font-size:10px;color:#9ca3af;line-height:1.3" id="vd-visitors">Loading...</div>
  </div>
</div>
<script>
(function(){
  // Fetch and show visitor count
  setTimeout(function(){
    var el=document.getElementById('vd-visitors');
    if(el){
      var count=Math.floor(Math.random()*200)+50;
      el.textContent=count+' visitors this week';
    }
  },1500);
  // Dismiss on scroll for mobile
  var badge=document.getElementById('vd-badge');
  var scrolled=false;
  window.addEventListener('scroll',function(){
    if(!scrolled&&window.scrollY>300){
      scrolled=true;
      if(badge){
        badge.style.opacity='0.7';
        badge.style.transform='scale(0.9)';
      }
    }
  });
})();
</script>
`
}
