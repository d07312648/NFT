// ファイル保存はブラウザに任せ、アンケートは別タブで開く。結果の自動送信は行わない。
(function(){
  function showStatus(message,url){
    document.querySelectorAll('[data-survey-status]').forEach(el=>{
      el.textContent=message;
      if(url){
        const link=document.createElement('a');
        link.href=url;link.target='_blank';link.rel='noopener noreferrer';
        link.textContent='アンケートを開く';
        el.append(document.createTextNode(' '),link);
      }
    });
  }
  document.querySelectorAll('[data-save-survey]').forEach(button=>{
    button.addEventListener('click',()=>{
      if(progress()!==100)return;
      downloadResult();
      let url;
      try{
        url=new URL(window.SURVEY_URL);
        if(url.protocol!=='https:'||!['docs.google.com','forms.gle'].includes(url.hostname))throw new Error('Invalid survey URL');
      }catch{
        showStatus('JSONの保存を開始しました。アンケートのURLはまだ設定されていません。');
        return;
      }
      window.open(url.href,'_blank','noopener,noreferrer');
      showStatus('JSONの保存を開始しました。保存したファイルをアンケートと一緒に提出してください。フォームが開かない場合は、こちらから進めます。',url.href);
    });
  });
})();
