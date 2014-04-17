enchant();

window.onload = function(){
	
	//ゲームオブジェクトの生成
	core = new Core(320, 320);
	
	//ゲームの初期化処理
	
	//fpsを設定する
	core.fps = 16;
	
	//ゲームで使用する画像ファイルを指定する
	core.preload('betty.png');
	
	//ファイルのプリロードが完了した時に実行する関数
	core.onload = function(){
		
		//ゲームのメイン処理
		var player = new Sprite(48, 48);
		player.image = core.assets['betty.png'];
		
		player.frame = 3;
		player.x = 120;
		player.y = 50;
		
		core.rootScene.addChild(player);
		
	};
	
	//ゲームスタート
	core.start();
};