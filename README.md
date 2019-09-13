> あなたが住んでいる地域の現在時刻をVRChat上でアナログ時計に表示します。

## [UnityPackageはここからダウンロードできます](https://github.com/Guilty-VRChat/realtime-clock/releases)

現在時刻の取得に使うあなたの地域のIPアドレスは、GETリクエスト以外には使用しないためご安心ください。<br>
時計本体と時計の針の色はマテリアルから変更できます。<br>
時計の数字のフォントを変更したい場合は、AIファイルを利用することで新たにテクスチャを作成できます。<br>

## 現在時刻の取得方法について

現在時刻は http://vrcclock.mydns.jp:8080/time-in-image から取得します。

IPアドレスをもとに http://ip-api.com/json から緯度と経度を取得し、現在時刻を取得します。<br>
そして、24:60:60形式の現在時刻(HH時MM分SS秒)を256:256:256形式に変換し、以下のように16進カラーとして8x8のJPG画像を生成します。

<table>
	<tr><td>#HHMMSS</td><td>#SSHHMM</td></tr>
	<tr><td>#MMSSHH</td><td>#000000</td></tr>
</table>

現在時刻は、各部分の各HHと各MMと各SSの平均値をガンマ補正して求めることで正確に算出されます。

## サーバーのセットアップ方法
git, node, npm, forever等は先にインストールしてください。

以下のコマンドを実行することで、サーバーをセットアップできます。<br>
(RaspberryPiの場合は必要に応じてコマンドの先頭にsudoをつける。)

```sh
git clone https://github.com/Guilty-VRChat/realtime-clock
cd ./realtime-clock/server
npm install
node app.js
```

実行を永続化したい場合、起動時に以下のコマンドを実行する。<br>
(例えば、RaspberryPiの場合/etc/rc.localに記述する。)

```sh
"nodeのパス" "forever のパス" start -a -d "app.jsのパス"

# 例(RaspberryPiの場合)
sudo -u pi "nodeのパス" "forever のパス" start -a -d "app.jsのパス"
```

