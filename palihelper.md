# 巴利逐詞架構

## 經文取詞 (Word from Context)
   逐詞信息，click toggle 顯示 WordInfo ，
   按鈕：加入熟悉詞。
   從
       詞信息畫面( WordInfo)
       點"edit entry" 進入「詞搜尋頁面」


## 詞搜尋介面 (WordSearch)
       輸入條件：(WordCriteria)
             開頭、部份、結尾 
             詞根、詞性、意義
       WordCard (CandidateWordList選定的詞)

       挑選候選詞  (CandidateWordlist) 更新DetailWordInfo
           小於10個詞，顯示檢索這批詞       

### 詞信息 (WordInfo) embed 在內文
    詞義 性數格    "完整版按鈕" 

### 詞卡   (WordCard) 開新區段(如詞典)
      按鈕： 檢索此詞：右邊顯示 全文檢索 含此詞的經文 可在右邊設過濾條件
      義項：[ 根 (點一下展開列出同根詞), 性數格 , 義(點一下找出所有同義詞) ] 
      
      複合詞有構件：每個構件顯示WordInfo (點一下巢狀顯示 WordCard)
          點構件搜尋所有含有此構件之復合詞 (先做任意部份，未來可選前後中)。

      孳乳數：點數字展開 derivedWords (含有此詞的所有復合詞的 WordInfo)，小於5自動展開？
      所有同base的字，例出每字的WordInfo，對齊屬性？


先設計一組 API，再想辦法從 ptk/預載資料結構 產生。

## 熟悉詞清單 familiar word list
   familiar word 清單中的詞，不再顯示詞義。
   可進行管理。

## 生詞自動顯示 (Unfamiliar Word helper)
	   active line 可以打開 "生詞自動顯示"
	   不在familiar word list 熟知的詞，會自動顯示。
