const accelon21_configuration={
  username:"yap",             //書籤筆記
  color   :"#7F0f77",         //代表色
  init_a:'/cb-y/1/2',///  /lit/6/:1
  init_b:'/cb-t/1509/1',
  countdown:-1, //0 for default countdown=9,  -1 for immediate enter
}

const advance={

  //進階設置
  keepLog : true,            //正確啟動後保留日誌 (除錯用)
}
accelon21_configuration.advance=advance;
window.accelon21_configuration=accelon21_configuration;