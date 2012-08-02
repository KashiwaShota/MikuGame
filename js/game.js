enchant();
var WIDTH = 214;//幅
var HEIGHT = 240;//高さ
window.onload = function(){
	var game = new Game(320, 320);
	game.fps = 60;
	game.time = 60;
	game.x = 0;
	game.y = 0;
	game.score = 0;
	game.flag = true;
	var label;
	var miku;
	var negi;
	var rate = 0.0;
	game.preload('img/miku1.gif', 'img/negi2.gif');
	
	//
	game.onload = function(){
		//背景
		var bg = new Sprite(320, 320);
		bg.backgroundColor = "rgb(0,200,255)";
		game.rootScene.addChild(bg);
		
		//ラベル
		label = new Label("");
		label.x = 120;
		label.y = 5;
		game.rootScene.addChild(label);
		
		//ミク生成
		miku = new Sprite(WIDTH, HEIGHT);
		miku.image = game.assets['img/miku1.gif'];
		miku.x = 30;
		miku.y = 50;
		miku.frame = 0;
		game.rootScene.addChild(miku);
		
		//ネギ
		negi = new Sprite(35, 80);
		negi.image = game.assets['img/negi2.gif'];
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
		
		//制限時間
		var scene = game.rootScene;
		var sprite = new Sprite(320, 320);
		var surface = new Surface(320, 320);
		var game_width = game.width;
		var game_height = game.height;
		var gauge_hmargin = 5;
		var gauge_vmargin = 5;
		var gauge_width = 20;
		var gauge_height = 20;
		var cutoff_width = 100;
		//
		var segment_length_arr = [
			(game_width - cutoff_width - gauge_hmargin*2)/2,
			(game_height - gauge_height - gauge_vmargin*2),
			(game_width - gauge_width - gauge_hmargin*2),
			(game_height - gauge_height - gauge_vmargin*2),
			((game_width - gauge_hmargin *2 - cutoff_width)/2 - gauge_width)
		];
		//
		var segment_start_arr = [];
		var segment_start_rate_arr = [0];
		//
		var segment_length_total = 0;
		for(var i = 0; i < segment_length_arr.length; i++){
			segment_length_total += segment_length_arr[i];
			segment_start_arr.push(segment_length_total);
		}
		//
		var segment_rate_total = 0;
		for(var i = 0; i < segment_length_arr.length; i++){
			var segment_start_rate = segment_start_arr[i] / segment_length_total;
			segment_start_rate_arr.push(segment_start_rate);
		}
		//
		var indicator_length = segment_length_total * rate;
		//
		var gauge_draw_arr = [
			function(rate){
				var segment_rate =　rate / segment_start_rate_arr[1];
				segment_rate = (segment_rate < 0) ? 0 : ((1 < segment_rate) ? 1 : segment_rate);
				var w = (game_width - gauge_hmargin * 2 - cutoff_width) / 2;
				surface.context.fillRect(gauge_hmargin + w * (1 - segment_rate), gauge_vmargin, w * segment_rate, gauge_height);
			},
			function(rate){
				var segment_rate =　(rate - segment_start_rate_arr[1]) / (segment_start_rate_arr[2] - segment_start_rate_arr[1]);
                segment_rate = (segment_rate < 0) ? 0 : ((1 < segment_rate) ? 1 : segment_rate);
				var h = game_height - gauge_vmargin * 2 - gauge_height;
				surface.context.fillRect(gauge_hmargin, gauge_height + gauge_vmargin, gauge_width, h * segment_rate);		
			},
			function(rate){
				var segment_rate =　(rate - segment_start_rate_arr[2]) / (segment_start_rate_arr[3] - segment_start_rate_arr[2]);
                segment_rate = (segment_rate < 0) ? 0 : ((1 < segment_rate) ? 1 : segment_rate);
				var w = game_width - gauge_hmargin * 2 - gauge_width;
				surface.context.fillRect(gauge_width + gauge_hmargin, game_height - gauge_vmargin - gauge_height, w * segment_rate, gauge_height);
			},
			function(rate){
				var segment_rate =　(rate - segment_start_rate_arr[3]) / (segment_start_rate_arr[4] - segment_start_rate_arr[3]);
                segment_rate = (segment_rate < 0) ? 0 : ((1 < segment_rate) ? 1 : segment_rate);
				var h = game_height - gauge_vmargin * 2 - gauge_height;
				surface.context.fillRect(game_width - gauge_hmargin - gauge_width, gauge_vmargin + h * (1 - segment_rate), gauge_width, h * segment_rate);
			},
			function(rate){
				var segment_rate =　(rate - segment_start_rate_arr[4]) / (segment_start_rate_arr[5] - segment_start_rate_arr[4]);
                segment_rate = (segment_rate < 0) ? 0 : ((1 < segment_rate) ? 1 : segment_rate);
				var w = (game_width - gauge_hmargin * 2 - cutoff_width) / 2 - gauge_width;
				surface.context.fillRect(game_width - gauge_hmargin - gauge_width - w * segment_rate, gauge_vmargin, w * segment_rate, gauge_height);
			}
		];
		//		
		sprite.image = surface;
		scene.addChild(sprite);
		sprite.addEventListener(Event.ENTER_FRAME, function(){
			if(rate <= 1.0){
				surface.context.fillStyle = 'rgb(0, 255, 150)';
				for(var i = 0; i < segment_start_arr.length; i++){
					if(segment_start_rate_arr[i] <= rate){
						gauge_draw_arr[i](rate);
					}
				}
			}
			if(rate < 1.0){
				rate += 1 / 3600;
			}else{
				rate = 1.0;
			}
		});
	}
	//シーンの定期処理
	game.tick = game.fps * game.time;
	game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
		game.tick--;
		//プレイ中
		if(game.tick > 0){
			if(game.flag == true){
				game.x = rand(6) * 40 + 20;
				game.y = rand(6) * 40 + 20;
				game.rootScene.addChild(negi);
				game.flag = false;
			}
			label.text = "制限時間:" + Math.floor(game.tick / game.time) + "</br> スコア：" + game.score + "</br> ネギを振れ!!";
		//ゲームオーバー	
		}else if(game.tick === 0){
			game.end(game.score, "あなたはネギを" + game.score + "回振りました!!")
		}
	});
	game.start();
};
function rand(num){return Math.floor(Math.random() * num);}
