// Brainy Break GA4 game analytics
(function(){
  function send(name,params){
    if(typeof window.gtag!=='function') return;
    window.gtag('event',name,Object.assign({game_name:(document.querySelector('h1')||{}).textContent||document.title},params||{}));
  }
  window.trackGameEvent=send;
  window.addEventListener('pagehide',function(){send('game_exit',{exit_type:'pagehide'});});
  document.addEventListener('click',function(e){
    const b=e.target.closest('button');
    if(!b) return;
    if(b.matches('#restart,.restart-btn')) send('game_restart');
    else if(b.matches('.memory-card,.difference-tile,.odd-item,.sequence-buttons button,#answers button,#math-answers button,#sci-answers button,#oly-answers button')) send('game_answer');
    else if(b.matches('#submit-btn,.submit-btn,#check-btn')) send('game_answer');
  });
})();
