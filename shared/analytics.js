// Brainy Break GA4 game analytics
(function(){
  var MEASUREMENT_ID='G-RYFQ8EX3P5';
  window.dataLayer=window.dataLayer||[];
  window.gtag=window.gtag||function(){dataLayer.push(arguments);};
  if(!document.querySelector('script[src*="googletagmanager.com/gtag/js"]')){
    var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+MEASUREMENT_ID;document.head.appendChild(s);
    window.gtag('js',new Date());window.gtag('config',MEASUREMENT_ID);
  }
  function send(name,params){
    window.gtag('event',name,Object.assign({game_name:(document.querySelector('h1')||{}).textContent||document.title},params||{}));
  }
  window.trackGameEvent=send;
  window.addEventListener('load',function(){send('game_start');});
  window.addEventListener('pagehide',function(){send('game_exit',{exit_type:'pagehide'});});
  document.addEventListener('click',function(e){
    var b=e.target.closest('button');
    if(!b)return;
    if(b.matches('#restart,.restart-btn'))send('game_restart');
    else if(b.matches('.memory-card,.difference-tile,.odd-item,.sequence-buttons button,#answers button,#math-answers button,#sci-answers button,#oly-answers button,.submit-btn'))send('game_answer');
  });
})();