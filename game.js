enchant();

//プレイヤークラスの作成
var Player = enchant.Class.create(enchant.Sprite, {
	initialize: function(x, y, map){
		enchant.Sprite.call(this, 48, 48);
		this.image = core.assets['betty.png'];
		this.frame = 3;
		this.x = x;
		this.y = y;
		//フレーム数をカウントするプロパティの追加
		this.tick = 0;
		//プレイヤーのHPを追加
		this.hp = 100;
		//プレーヤーのライフ
		this.life = 3;
		//プレイヤーのポジション変更
		this.setPos = function(x, y){
			this.x = x;
			this.y = y;
		};
		//「enterframe」のイベントリスナーの追加
		//当たり判定は、点ではなく範囲で行うべき、具体的には左右の場合は左端と右端の両方、上下なら上端と下端
		this.addEventListener('enterframe', function(e){
			if(core.input.left){
				this.x -= 4;
				if(map.hitTest(this.x + 16 , this.y + 40)) this.x += 4;
				//スプライトのフレーム番号を切り替えて、アニメーションを表示する
				this.frame = this.tick % 4 *4 + 1;
				//フレーム数をインクリメント
				this.tick++;
			}
			if(core.input.right){
				this.x += 4;
				if(map.hitTest(this.x + 24, this.y + 40)) this.x -= 4;
				this.frame = this.tick % 4 *4 + 3;
				this.tick++;
			} 
			if(core.input.up){
				this.y -= 4;
				if(map.hitTest(this.x + 24, this.y + 40)) this.y += 4;
				this.frame = this.tick % 4 *4 + 2;
				this.tick++;	
			}
			if(core.input.down){
				this.y += 4;
				if(map.hitTest(this.x + 24, this.y + 40)) this.y -= 4;
				this.frame = this.tick % 4 *4 + 0;
				this.tick++;
			}
		});
		//「touchmove」のイベントリスナーの追加
		this.addEventListener('touchmove', function(e){
			this.x = e.x - this.width/2;
			this.y = e.y - this.height/2;
		});
	}
});

var Coin = enchant.Class.create(enchant.Sprite,{
	initialize: function(x,y){
		enchant.Sprite.call(this, 32, 32);
		this.x = x;
		this.y = y;
		this.image = core.assets['piece.png'];
		this.tick = 0;
		//アニメーションパターン
		this.anime = [8,9,10,11];
		//アニメーション表示する処理
		this.addEventListener('enterframe', function(){
			if(this.tick <= 8){
				this.frame = this.tick;
			} else{
				this.frame = this.anime[this.tick % 4];
			}
			this.tick++;
		});
	}
});

var Trap = enchant.Class.create(enchant.Sprite,{
	initialize: function(x, y){
		enchant.Sprite.call(this, 16, 16);
		this.x = x;
		this.y = y;
		this.image = core.assets['map1.png'];
		this.frame = 43;
		
	}
});


window.onload = function(){
	
	//ゲームオブジェクトの生成
	core = new Core(320, 320);
	
	//ゲームの初期化処理
	
	//fpsを設定する
	core.fps = 16;
	//scoreを保持するPropertiesの作成
	core.score = 0;
	core.life = 3;
	//timeの保持するPropertiesの追加
	core.time = 0;

	//セーブの設定（nineleapを利用しないならtrue）とゲームID(nineleapの場合はページの末尾の数字)
	core.nineleap.memory.LocalStrage.DEBUG_MODE = true;
	enchant.nineleap.memory.LocalStrage.GAME_ID = 'sample001';
	
	core.memory.player.preload();
	
	
	//ゲームで使用する画像ファイルを指定する
	core.preload('betty.png', 'flowers.png');
	core.preload('map1.png');
	core.preload('piece.png');
	core.preload('pad.png');
	//ゲームで使用するmp3サウンドファイルを指定する
	core.preload('one_0.mp3');
	
	//BGM用のサウンドファイルを読み込む
	core.bgm = Sound.load('one_0.mp3');
	//SE用のサウンドファイルを読み込む
	core.se = Sound.load('Ready.wav');
	
	//ファイルのプリロードが完了した時に実行する関数
	core.onload = function(){
		
		//ゲームのメイン処理
		//メモリの初期化
		if(core.memory.player.data.score == null){
			core.memory.player.data.score = core.score;
		}
		if(core.memory.player.data.life == null){
			core.memory.player.data.life = core.life;
		}
		//ここからサウンドについて
		core.bgm.volume = 0.5;
		//BGMの再生
		//core.bgm.play();
		//SEの再生
		core.se.play();
		//ここまでサウンドについて
		
		//マップ生成
var backgroundMap = new Map(16, 16);
backgroundMap.image = core.assets['map1.png'];
backgroundMap.loadData([
    [20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,83,84,84,84,84,84,84,84,84,84,84,84,84,84,84],
    [20,20,20,20,20,99,100,116,116,116,116,116,116,116,116,116,116,116,116,116],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,16,17,17,17,17,18,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,32,33,33,33,33,34,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,32,33,33,33,33,34,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,32,33,33,33,33,34,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,48,49,49,49,49,50,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,99,101,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,99,101,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,99,101,20,20,20,20,20],
    [20,20,20,20,20,99,100,84,84,84,84,84,84,100,100,84,84,84,84,84],
    [20,20,20,20,20,99,100,116,116,116,116,116,116,116,116,116,116,116,116,116],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20],
    [20,20,20,20,20,99,101,20,20,20,20,20,20,20,20,20,20,20,20,20]
],[
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,28],
    [-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,28,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,59,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,75,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    [-1,-1,28,-1,-1,-1,-1,-1,-1,7,28,28,28,28,7,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,7,28,28,28,28,7,-1,-1,-1,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,23,23,23,23,23,23,-1,-1,28,-1,-1],
    [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
]);
backgroundMap.collisionData = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];
		core.rootScene.addChild(backgroundMap);
		
		/*
		//ここからサーフェイス（花）について
		var image = new Surface(320, 320);
		//「flowers.png」の(0,96)の位置から幅(126)ピクセル、高さ(64)ピクセルの領域を
		//サーフェイスの(64,64)の位置に幅(126)ピクセル、高さ(64)ピクセルで描画する
		image.draw(core.assets['flowers.png'],0, 96, 126, 64,  64, 64, 126, 64);
		image.draw(core.assets['flowers.png'],0, 0, 64, 64,  32, 32, 64, 64);
		var bg = new Sprite(320, 320);
		bg.image = image;
		core.rootScene.addChild(bg);
		//ここまでサーフェイス（花）について
		*/
		
		//プレイヤーについて
		var player = new Player(120, 50, backgroundMap);
		core.rootScene.addChild(player);
		
		//ここからテキストについて
		//ラベルの表示
		var infoLabel = new Label('enchant.js サンプル');
		infoLabel.x = 16;
		infoLabel.y = 0;
		infoLabel.color = '#0000FF';
		infoLabel.font = '14px sens-serif';
		core.rootScene.addChild(infoLabel);
		//ここまでテキストについて
		
		var lifeLabel = new LifeLabel(180, 0, player.life);
		core.rootScene.addChild(lifeLabel);
		
		var trap = new Trap(200, 200);
		core.rootScene.addChild(trap);
		
		//バーチャルパッドの作成
		//
		//
		
		
		//ルートシーンの「イベントフレーム」イベントが発生した時に実行するリスナ
		core.rootScene.addEventListener('enterframe', function(e){
			if(player.x > 300){
				core.pushScene(core.field(player.x, player.y, player.life));
				player.x = 280;
			}
			//trapとの当たり判定
			if(player.within(trap, 25)){
				lifeLabel.life = --player.life;
				if(core.input.up)   	player.y += 30;
				if(core.input.down) 	player.y -= 30;
				if(core.input.left) 	player.x += 30;
				if(core.input.right)	player.x -= 30;
				//プレイヤーの点滅表示
				player.tl.fadeOut(2).fadeIn(4).fadeOut(2).fadeIn(4);
				if(player.life==0){
					player.tl.rotateBy(360, 30)
							 .and().fadeOut(30)
							 .and().scaleTo(0.2, 30, enchant.Easing.BOUNCE_EASEOUT)
							 .cue({10: function(){
							 	core.end();
							 }});
					
				}
				//デバック用
				//if(!player.life) player.life = 3;
				//console.log(player.life);
				
			}
		});
	

	};
	
	core.field = function(px, py, pl){
		//マップの生成
		var scene = new Scene();
		var backgroundMap = new Map(16, 16);
		backgroundMap.image = core.assets['map1.png'];
		backgroundMap.loadData([
    		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,99,101,36,36,36,36],
    		[84,84,84,84,84,84,84,84,84,84,84,84,84,84,100,101,36,36,36,36],
    		[116,116,116,116,116,116,116,116,116,116,116,116,116,116,100,101,36,36,36,36],
    		[20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,36,36,36,36],
    		[20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,36,36,36,36],
    		[20,20,20,20,20,20,20,20,20,20,20,20,20,20,115,117,36,36,36,36],
    		[20,16,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17,17],
    		[20,32,33,33,33,33,33,33,33,49,49,49,49,49,49,49,49,49,49,49],
    		[20,32,33,33,33,33,33,33,34,20,20,20,20,20,83,85,36,36,36,36],
    		[20,32,33,33,33,33,33,33,34,20,20,20,20,20,99,101,36,36,36,36],
    		[20,48,49,49,49,49,49,49,50,20,20,20,20,20,99,101,36,36,36,36],
    		[20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,36,36,36,36],
    		[20,20,20,20,20,20,20,20,20,20,20,20,20,20,99,101,36,36,36,36],
    		[84,84,84,84,84,84,84,84,84,84,84,84,84,84,100,101,36,36,36,36],
    		[116,116,116,116,116,116,116,116,116,116,116,116,116,116,116,117,36,36,36,36],
    		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
    		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
   	 		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
    		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36],
    		[36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36,36]
		],[
    		[-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1],
    		[-1,-1,-1,-1,28,-1,-1,-1,28,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,28,-1],
   	 		[-1,45,45,45,45,45,45,45,45,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,7,7,7,7,7,7,7,7,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,23,23,23,23,23,23,23,23,28,-1,-1,-1,-1,-1,-1,28,-1,-1,28],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
   	 		[-1,-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,28,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,28,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,28,-1],
   	 		[-1,-1,-1,28,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
    		[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]
		]);
		backgroundMap.collisionData = [
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    		[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    		[0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    		[0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    		[0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
   	 		[0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    		[0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    		[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
		];
		
		scene.addChild(backgroundMap);
		
		//コインを追加
		var coins =[];
		for(var i = 0; i<10; i++){
			var coin = new Coin(128, 80+ 16*i);
			scene.addChild(coin);
			coins[i] = coin;
		}
		
		var player = new Player(0, py, backgroundMap);
		player.life = pl;
		scene.addChild(player);
		
		
		//スコアをフォントで表示するラベルを作成する
		//引数はラベルの表示位置のX,Y座標
		var scoreLabel = new ScoreLabel(16, 0);
		scoreLabel.score = core.score;
		scene.addChild(scoreLabel);
		
		//timeLabelの作成
		var timeLabel = new TimeLabel(16, 304);
		timeLabel.time = core.time;
		scene.addChild(timeLabel);
		
		var trap = new Trap(200, 200);
		scene.addChild(trap);
		
		var lifeLabel = new LifeLabel(180, 0, player.life);
		scene.addChild(lifeLabel);
		
		
		//バーチャルパッドの作成
		//
		//
		
		//「enterframe」のイベントリスナ
		scene.addEventListener('enterframe', function(e){
			if(player.x < -20) core.popScene();
			//プレイヤーとコインの当たり判定
			for(var i in coins){
				if(player.within(coins[i],16)){
					core.score = scoreLabel.score += 100;
					scene.removeChild(coins[i]);
					delete coins[i];
				}
			}
			core.time = timeLabel.time;
			//trapとの当たり判定
			if(player.within(trap, 25)){
				lifeLabel.life = --player.life;
				if(core.input.up)   	player.y += 30;
				if(core.input.down) 	player.y -= 30;
				if(core.input.left) 	player.x += 30;
				if(core.input.right)	player.x -= 30;
				//プレイヤーの点滅表示
				player.tl.fadeOut(2).fadeIn(4).fadeOut(2).fadeIn(4);
				if(player.life==0){
					player.tl.rotateBy(360, 30)
							 .and().fadeOut(30)
							 .and().scaleTo(0.2, 30, enchant.Easing.BOUNCE_EASEOUT);
					
				}
				//デバック用
				//if(!player.life) player.life = 3;
				//console.log(player.life);
				
			}
		});
		
		
		return scene;
	};
	
	//ゲームスタート
	core.start();
};