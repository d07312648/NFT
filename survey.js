// 保存完了はブラウザから通知されないため、利用者の確認後にアンケートを開く。
(function(){
  let downloadRequested=false;
  const buttons=()=>document.querySelectorAll('[data-save-survey]');
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
  buttons().forEach(button=>{
    button.textContent='① 結果のJSONをダウンロード';
    button.addEventListener('click',()=>{
      if(progress()!==100)return;
      if(!downloadRequested){
        try{downloadResult()}catch{
          showStatus('JSONの保存を開始できませんでした。もう一度ダウンロードしてください。');
          return;
        }
        downloadRequested=true;
        buttons().forEach(el=>{el.textContent='② 保存しました・アンケートに進む'});
        showStatus('ブラウザの保存確認で「ダウンロード」を押し、保存を確認してください。その後、上の「保存しました・アンケートに進む」を押してください。保存できなかった場合は、下の「結果をJSONで保存」から再試行できます。');
        return;
      }
      let url;
      try{
        url=new URL(window.SURVEY_URL);
        if(url.protocol!=='https:'||!['docs.google.com','forms.gle'].includes(url.hostname))throw new Error('Invalid survey URL');
      }catch{
        showStatus('アンケートのURLはまだ設定されていません。保存したJSONはそのまま保管してください。');
        return;
      }
      window.open(url.href,'_blank','noopener,noreferrer');
      showStatus('保存したJSONをアンケートと一緒に提出してください。フォームが開かない場合は、こちらから進めます。',url.href);
    });
  });
})();
