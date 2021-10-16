const accelon21_configuration={
  preload :"openlit,gycd",    //預先載入的資料庫
  username:"yap",             //書籤筆記
  color   :"#7F0f77",         //代表色



  notes:"",
  
}

const advance={

  //進階設置
  keepLog : false,            //正確啟動後保留日誌 (除錯用)
}
accelon21_configuration.advance=advance;
window.accelon21_configuration=accelon21_configuration;