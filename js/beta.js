enchant();
var WIDTH = 214;//幅
var HEIGHT = 240;//高さ
window.onload = function(){
	//ゲームオブジェクトの生成
	var game = new Game(320, 320);
	game.fps = 60;
	game.score = 0;
	game.flag = true;
	game.x = 0;
	game.y = 0;
	game.message = "テスト";
	var label;
	var miku;
	var negi;
	
	//画像の読み込み
	game.preload('miku1.gif', 'negi.gif');
	game.onload = function(){
		//背景
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0,200,255)";
		game.rootScene.addChild(bg);
		//ラベル生成
		label = new Label("");
		game.rootScene.addChild(label);
		//ミク生成
		miku = new Sprite(WIDTH, HEIGHT);
		miku.image = game.assets['miku1.gif'];
		miku.x = 53;
		miku.y = 80;
		miku.frame = 0;
		game.rootScene.addChild(miku);
		//ネギ
		negi = new Sprite(35, 80);
		negi.image = game.assets['negi.gif'];
		negi.x = 0;
		negi.y = 0;
		//ネギ定期処理
		negi.addEventListener(Event.ENTER_FRAME, function(){
			negi.x = game.x;
			negi.y = game.y;
		});
		negi.addEventListener(Event.TOUCH_START, function(){
			miku.frame = 1;
		});
		negi.addEventListener(Event.TOUCH_END, function(){
			miku.frame = 0;
			game.score = game.score + 1;
			game.flag = true;
			game.rootScene.removeChild(negi);
		});
	};
	game.tick = 60 * 60;
	game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
		game.tick--;
		if(game.tick > 0){
			if(game.flag == true){
				game.x = rand(8) * 35;
				game.y = rand(3) * 80 + 80;
				game.rootScene.addChild(negi);
				game.flag = false;
			}
			if(game.tick < 600){
				label.text = " 残り時間：" + Math.floor(game.tick / 60) + "</br> スコア：" + game.score + "</br> 残り10秒切ったぁぁぁぁぁ!!" ;
			}else if(600 < game.tick && game.tick < 1800){
				label.text = " 残り時間：" + Math.floor(game.tick / 60) + "</br> スコア：" + game.score + "</br> もう折り返し地点通過!!" ;
			}else if(game.tick > 1800){
				label.text = " 残り時間：" + Math.floor(game.tick / 60) + "</br> スコア：" + game.score + "</br> ネギをとにかく振りまくれ!! ";
			}
		}else if(game.tick === 0){
			//ゲームオーバー画面の表示
			game.end(game.score, "あなたはネギを" + game.score + "回振りました!!");
		}
	});
	//ゲームの開始
	game.start();
};
function rand(num){return Math.floor(Math.random() * num);}
