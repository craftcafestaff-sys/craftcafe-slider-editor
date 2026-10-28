クラフトカフェ Yahoo!トップスライダー エディター
2026-10-28

このフォルダは、クラフトカフェ Yahoo!ショッピング店のトップスライダーを更新するための編集ツールです。

【エディターを開く】

GitHub Pages 公開URL：

https://craftcafestaff-sys.github.io/craftcafe-slider-editor/top-slider-editor.html

このページをChromeのブックマークに登録して使用します。


【主なファイル】

top-slider-editor.html
スライダー編集画面です。

editor.js
編集画面の動作に使用します。

top-slider-preview.html
編集内容を確認するためのプレビュー画面です。

slides-data.js
スライダーに表示する画像URL・リンクURLなどの登録データです。

top-slider.css
スライダー表示用CSSです。

top-slider.js
スライダー表示・自動再生・スワイプ・ドラッグ・リンク動作に使用します。

top-slider.html
Yahoo!ショッピング本番トップページで読み込むスライダー表示用HTMLです。


【更新方法】

1. Chromeのブックマークから
   top-slider-editor.html を開きます。

2. スライダー画像・リンク先・表示順などを編集します。

3. 編集完了後、slides-data.js を書き出します。

4. 書き出した slides-data.js をYahoo!サーバーの

   /top-slider/slides-data.js

   に上書きアップロードします。

5. Yahoo!トップページを確認し、スライダーが正常に表示・リンクすることを確認します。


【Yahoo!本番スライダー】

表示ページ：

https://shopping.geocities.jp/craftcafe/top-slider/top-slider.html

Yahoo!トップページでは、このページをiframeで読み込んでいます。


【スライダー仕様】

・正方形画像
・PCではドラッグ操作対応
・スマートフォンではスワイプ操作対応
・自動再生あり
・左右矢印あり
・ドットナビゲーションあり
・リンクはiframe内ではなくYahoo!ページ全体で開く仕様


【注意】

GitHub上のファイルを変更しても、Yahoo!本番スライダーは自動では更新されません。

実際の商品・特集内容を変更した場合は、エディターから書き出した slides-data.js をYahoo!サーバーへアップロードしてください。

Yahoo!本番で使用するファイルと、GitHub上の編集用ファイルを混同しないようにしてください。


【GitHubリポジトリ】

craftcafe-slider-editor

GitHub Pagesは、mainブランチ / root から公開しています。
