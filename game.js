enchant();

window.onload = function(){
	
	//ゲームオブジェクトの生成
	core = new Core(320, 320);
	
	//ゲームの初期化処理
	
	//fpsを設定する
	core.fps = 16;
	
	//ゲームで使用する画像ファイルを指定する
	core.preload('betty.png', 'flowers.png');
	
	//ファイルのプリロードが完了した時に実行する関数
	core.onload = function(){
		
		//ゲームのメイン処理
		
		//ここからサーフェイス（花）について
		var image = new Surface(320, 320);
		//「flowers.png」の(0,96)の位置から幅(126)ピクセル、高さ(64)ピクセルの領域を
		//サーフェイスの(64,64)の位置に幅(126)ピクセル、高さ(64)ピクセルで描画する
		image.draw(core.assets['flowers.png'],0, 96, 126, 64,  64, 64, 126, 64);
		var bg = new Sprite(320, 320);
		bg.image = image;
		//ここまでサーフェイス（花）について
		
		//ここからプレイヤーについて
		var player = new Sprite(48, 48);
		player.image = core.assets['betty.png'];
		
		player.frame = 3;
		player.x = 120;
		player.y = 50;
		//フレーム数をカウントするプロパティを追加
		player.tick = 0;
				
		//[enterframe]イベントが発生した時に実行するリスナを登録する
		player.addEventListener('enterframe', function(e){
			if(core.input.left){
				this.x -= 4;
				//スプライトのフレーム番号を切り替えて、アニメーションを表示する
				this.frame = this.tick % 4 *4 + 1;
				//フレーム数をインクリメント
				this.tick++;
			}
			if(core.input.right){
				this.x += 4;
				this.frame = this.tick % 4 *4 + 3;
				this.tick++;
			} 
			if(core.input.up){
				this.y -= 4;
				this.frame = this.tick % 4 *4 + 2;
				this.tick++;	
			}
			if(core.input.down){
				this.y += 4;
				this.frame = this.tick % 4 *4 + 0;
				this.tick++;
			}
			//console.log(this.x,this.y);
		});
		//ここまでプレイヤーについて
		
		//ここからテキストについて
		//[touchmove]イベントが発生した時に実行するリスナを登録する
		player.addEventListener('touchmove', function(e){
			this.x = e.x - this.width / 2;
			this.y = e.y - this.height / 2; 
		});
		
		//ラベルの表示
		var infoLabel = new Label('enchant.js サンプル');
		infoLabel.x = 16;
		infoLabel.y = 0;
		infoLabel.color = '#0000FF';
		infoLabel.font = '14px sens-serif';
		//ここまでテキストについて
		
		
		
		
		//ルートシーンに追加する
		core.rootScene.addChild(bg);
		core.rootScene.addChild(player);
		core.rootScene.addChild(infoLabel);

	};
	
	//ゲームスタート
	core.start();
};