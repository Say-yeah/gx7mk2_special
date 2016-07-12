(function ($) {


var ua = navigator.userAgent.toUpperCase();
var tempWindowWidth = 0;
var $sp      = (ua.indexOf( 'IPHONE' ) != -1) || (ua.indexOf( 'ANDROID' ) != -1) || (ua.indexOf( 'IPOD' ) != -1);
var $ipad    = (ua.indexOf( 'IPAD' ) != -1);
var $android = (ua.indexOf( 'ANDROID' ) != -1);
var $f_bgm   = true;
var $wide    = false;
var $max_w   = 667;
var $f_onair = false;
var $scrollsize = "";
var $f_movie;
var $player;



var self = $.lumix = {



	init: function () {

		// 初期読み込み後
		$(document).ready(function() {
			if ( $sp ) {
				$( 'body' ).attr( 'id', 'sp' );
			}
			else {
				$( 'body' ).attr( 'id', 'pc' );
			}

			if ( $android ) {
				$( 'body' ).attr( 'class', 'ua_android' );
			}

			if ( $ipad ) {
				$( 'body' ).attr( 'class', 'ua_ipad' );
			}
		});

		$( window ).load( function () {
			if ( $sp ) {

			}
			else {
				if ( $( "#bgm" )[0] ) {
					$bgm = document.getElementById("bgm");
					//$bgm.play();
					$bgm.volume = 0.3;
					self.bgm();
				}
			}
			TweenMax.to( $( "div#contents" ), 0.5, { opacity : 1 });

			$(window).on('resize', function(){
				self.modalResize();
			});

			$( "a.focus, a.rapid, a.focus_sp, a.rapid_sp" ).click( function(){
				var movie_sp = $f_movie.indexOf( "focus" ) >= 0 ? $( "div.movie_special.focus" ) : $( "div.movie_special.rapid" );
				$( "div#movie_yb" ).show();
				$( "div#movie_yb" ).css({ "opacity": 1, "visibility": "visible" });
				movie_sp.hide();
				self.playMovie( $( this ).attr( "class" ) );
				$('div.modal_wrap div.btn_close').hide();
			});

			$('.modal_wrap, .modal_wrap .btn_close a').off().click(function(){
				$('div#modal_movie').fadeOut('slow');
				self.setBtnClose(false);
				$('.modal-overlay').fadeOut('slow',function(){
					$player.stopVideo();
					$('html, body').removeClass('lock');
					$('.modal-overlay').remove();
					$('.modal_wrap').hide();
					$f_onair = false;
			 });
			});
		});

		// iPhone6横設定
		if ( $sp ) {
			self.resize();

			$( window ).on('load resize', function(){
				self.resize();
			});
		}

		// 映像のボタン
		if ( $( "article.movie" )[0] ) {
			self.btn_movie();
		}

		// トップのNEW
		if ( $( "div.bnr div.profile" )[0] ) {
			self.icon_new();
		}

		self.ticker();
		self.modal();
		self.setMovie();
	},



	// スマホ回転時
	resize: function() {
		var windowWidth = $( window ).width();

		if ( tempWindowWidth != windowWidth ) {
			tempWindowWidth = $( window ).width();

			// 横 → 縦
			if ( $( window ).width() < $max_w ) {
				$( 'body' ).attr( 'id', 'sp' );
				$wide = false;

			}
			// 縦 → 横
			else {
				$( 'body' ).attr( 'id', 'pc' );
				$wide = true;
			}
		}

		if ( $( "div.content" )[0] ) {
			var h = 402 * ($( "div.content" ).width() / 536);
			$( "div.content" ).height( h );
		}
	},



	// BGM
	bgm: function () {

		$( "div.bgm_control a" ).click( function() {
			var mode    = $( this ).attr( "class" ).indexOf( "on" ) >= 0 ? true : false;

			if ( $f_bgm && mode == false ) {
				self.control( false );
			}
			else if ( $f_bgm == false && mode == true ) {
				self.control( true );
			}
		});
	},



	// BGM / コントローラー
	control: function ( mode ) {
		var obj_on  = $( "div.bgm_control a.on" );
		var obj_off = $( "div.bgm_control a.off" );

		if ( mode ) {
			$f_bgm = true;
			obj_on.removeClass( "active" );
			obj_off.addClass( "active" );
			$bgm.play();
		}
		else {
			$f_bgm = false;

			obj_off.removeClass( "active" );
			obj_on.addClass( "active" );
			$bgm.pause();
		}
	},



	// モーダル
	modal: function () {

		// 未使用／YouTube 直
		$('.yb').magnificPopup({
			type:         'iframe',
			mainClass:    'mfp-fade_v1',
			removalDelay: 200,
			preloader:    false,
			callbacks: {
				open: function() {
					self.control( false );
				},
				close: function() {}
			}
		});

		$( "div.profile a, div.gallery_page div#thumb a, a.gallery_about" ).magnificPopup({
			type:         'inline',
			mainClass:    'mfp-fade_v2',
			removalDelay: 200,
			preloader:    false,
			callbacks: {
				open: function( item ) {
					var id = $(this.currItem.el[0]).attr( "class" );

					$('.mfp-bg').css('height','3000px');

					if ( $( "div.gallery_page" )[0] ) {}
					else {
						$sp ? null : self.control( false );
					}

					if ( id.indexOf( "rapid" ) >= 0 ) {
						$.functions.modalOpen(id, "rapid");
					}
					if ( id.indexOf( "focus" ) >= 0 ) {
						$.functions.modalOpen(id, "focus");
					}

				},
				close: function() {

				}
			}
		});

		$(document).on('click', 'div.btn_close a', function (e) {
			e.preventDefault();
			$.magnificPopup.close();
			$( "div.mfp-wrap" ).removeClass( "of" );
		});

		$(document).on('click', '.trigger_movie', function(event) {
			event.preventDefault();
			var id = $(this).parent().attr('id') == 'v1' ? 'focus' : 'rapid';
			self.modalMovie(id);
		});
	},



	// ティッカー／PC
	tickerPC: function () {
		var lin = $( 'div#ticker ul li' ).length;
		var tid = 0;

		if ( lin == 1 ) {
			$( "div#ticker ul li" ).css({ "opacity" : 1, "display" : "block", "left" : 0 });
			return;
		}

		function loop_ticker(){

			$( 'div#ticker ul li' ).css({ left : "0", opacity : 0 }).eq( tid ).delay( 1000 ).fadeTo( 1000,1,function(){
				$( this ).delay( 4000 ).animate({ opacity : 0 }, 1000, 'linear', function() {
					tid++;

					if ( tid >= lin ) { tid = 0; }
					loop_ticker();
				});
			});
		}

		loop_ticker();
	},



	// ティッカー
	ticker: function () {
		var lin  = $( 'div#ticker ul li' ).length;
		var tid  = 0;
		var span = $sp ? 0 : (1200-976)/2;
		var sec  = $sp ? 18000 : 10000;
		var hold = $sp ? 2000 : 8000;

		if ( lin == 1 ) {
			$( "div.trigger" ).hide();
		}

		function loop_ticker(){
			$( 'div#ticker ul li' ).css({ left : "0", opacity : 0 }).eq( tid ).delay( 1000 ).fadeTo( 1000,1,function(){
				var w = $(this).width();

				$( this ).delay( hold ).animate({ left : -w-span }, sec, 'linear', function() {
					tid++;

					if ( tid >= lin ) { tid = 0; }
					loop_ticker();
				});
			});
		}

		loop_ticker();
	},



	// メインビジュアルの映像ボタン
	btn_movie: function () {
		var btn = $( "article.movie a" );

		btn.hover(
			function () {
				$( this ).siblings( "div.bg" ).addClass( "on" );
				$( this ).siblings( "div.btn_play" ).find( "img.on" ).addClass( "active" );
				$( this ).siblings( "div.btn_play" ).find( "img.off" ).removeClass( "active" );

			},
			function () {
				$( this ).siblings( "div.bg" ).removeClass( "on" );
				$( this ).siblings( "div.btn_play" ).find( "img.on" ).removeClass( "active" );
				$( this ).siblings( "div.btn_play" ).find( "img.off" ).addClass( "active" );
			}
		);
	},



	// トップのNEWアイコン
	icon_new: function () {
		var obj_movie_1 = $( "article#v1 div.date p" );
		var obj_movie_2 = $( "article#v2 div.date p" );
		//var obj_profile = $( "article#menu div.gallery p" );

		motion();

		if ( navigator.userAgent.indexOf('Mac') != -1 ){
			if ( navigator.userAgent.indexOf('Chrome') != -1 ) {
				obj_movie_1.css({ "margin-top" : "-1px" });
				obj_movie_2.css({ "margin-top" : "-1px" });
				//obj_profile.css({ "margin-top" : "-1px" });
			}
		}

		function motion () {
			var t_1 = new TimelineMax();
			t_1.to( obj_movie_1, 0.8, { width: 65, ease: Expo.easeInOut, delay: 0.2 })
		     .to( obj_movie_1, 0, { opacity: 0,  delay: 6, delay: 2 });

			var t_2 = new TimelineMax();
	 			t_2.to( obj_movie_2, 0.8, { width: 65, ease: Expo.easeInOut, delay: 0.2 })
	 		     .to( obj_movie_2, 0, { opacity: 0,  delay: 6, delay: 2, onComplete: fin });

			/*var t_2 = new TimelineMax();
			t_2.to( obj_profile, 0.8, { width: 45, ease: Expo.easeInOut, delay: 0.2 })
		     .to( obj_profile, 0, { opacity: 0,  delay: 6, onComplete: fin, delay: 2 });*/
		}

		function fin () {
			obj_movie_1.css({ "width": 0, "opacity": 1 });
			obj_movie_2.css({ "width": 0, "opacity": 1 });
			//obj_profile.css({ "width": 0, "opacity": 1 });
			motion();
		}
	},



	// ムービー：設定
	setMovie: function () {
		var tag  = document.createElement( 'script' );
				tag.src = "https://www.youtube.com/iframe_api";
		var firstScriptTag = document.getElementsByTagName( 'script' )[ 0 ];
				firstScriptTag.parentNode.insertBefore( tag, firstScriptTag );

		window.onYouTubeIframeAPIReady=function() {
			loadPlayer();
		}

		var vid = ['GlTkbuQIQw4', 'G1qcFV0vcOM'];
		var ytplayers    = {};
		function loadPlayer() {

			for (var i = 0; i < 3; i++) {
				if (i == 0) {
					$player = new YT.Player(
						'player', {
							width:  '976',
							height: '549',
							videoId: "",
							playerVars: { html5: 1 },
							events: {
								"onReady":       onPlayerReady,
								"onStateChange": onPlayerStateChange,
							},
							playerVars: {
								"rel": 0,
								"showinfo": 0,
								"fs": 0,
								"wmode" : "transparent"
							}
						}
					);
				}
				else {
					var player = new YT.Player( 'yt_vid_' + i, {
						width:   '137',
						height:  '77',
						videoId: vid[i-1],
						playerVars : {
							modestbranding: 1,
							wmode :   'transparent',
							autoplay: 0,
							controls: 0,
							showinfo: 0,
							rel:      0,
							loop:     1,
							playlist: vid[i-1],
							html5:    1,
							autohide: 0,
							enablejsapi: 0,
							iv_load_policy: 0
						},
						events: {
							"onReady": function( event ) {
								event.target.mute();
								event.target.playVideo();
							},
							"onStateChange": function( event ) {

								if ( YT.PlayerState.ENDED === event.data ) {
									event.target.playVideo();
								}
							},'onError':function(){}
						}
					});
				}
			}
		}

		// TouYube 監視
		var yb = $( "div#movie_yb" );

		function onPlayerReady(event) {}
		function onPlayerStateChange(event) {

			if (event.data == 1) {
				if ( $f_onair == false ) {
					TweenMax.to( $( "div#movie_yb" ), 0.5, { autoAlpha: 1 });
					$f_onair = true;

					if ($sp) {
						$( "div#movie_yb iframe" ).css('opacity', '1');
					}
				}
			}
			if (event.data == 0) {
				$player.pauseVideo();
				self.setBtnClose(false);
				TweenMax.to( yb, 1, { autoAlpha: 0, onComplete: fin});
				$f_onair = false;
			}
		}

		// 再生終了
		function fin () {
			var movie_sp = $f_movie.indexOf( "focus" ) >= 0 ? $( "div.movie_special.focus" ) : $( "div.movie_special.rapid" );
			var btn_sp   = $( "div.btn_special" );

			btn_sp.hover(
				function () {
					//$( this ).siblings( "div.bg" ).addClass( "on" );
					$( this ).next( "div.arrow" ).find( "img.on" ).addClass( "active" );
					$( this ).next( "div.arrow" ).find( "img.off" ).removeClass( "active" );
				},
				function () {
					//$( this ).siblings( "div.bg" ).removeClass( "on" );
					$( this ).next( "div.arrow" ).find( "img.on" ).removeClass( "active" );
					$( this ).next( "div.arrow" ).find( "img.off" ).addClass( "active" );
				}
			);

			yb.hide();
			movie_sp.fadeIn(1000);
			self.setBtnClose(true);

			if ($sp) {
				$('div#modal_movie').css('top', '20px');
			}
			else {
				self.modalResize();
			}

			$('div.btn_close').addClass('down');
		}
	},



	// ムービー：モーダル生成
	modalMovie: function ( id ) {
		$('html').append('<div class="scrollbar" style="overflow:scroll;"></div>');
		$scrollsize = window.innerWidth - $('.scrollbar').prop('clientWidth');
		$('.scrollbar').hide();

		$('html, body').addClass('lock');
		$('body').append('<div class="modal-overlay"></div>');
		$('.modal-overlay').fadeIn('slow');

		var modal = $('div#modal_movie');
		$('.modal_wrap').show();

		$(modal).fadeIn('slow');
		$(modal).click(function(e){
			e.stopPropagation();
		});

		self.playMovie(id);
		self.setBtnClose(true);
		$sp ? null : self.control( false );
	},



	// モーダルリサイズ
	modalResize: function () {
		var modal = $('div#modal_movie');
		var w  = $(window).width();
		var h  = $(window).height();
		var mw = $(modal).outerWidth(true);
		var mh = $(modal).outerHeight(true);

		if ((mh > h) && (mw > w)) {
			$(modal).css({'top': 0 + 'px'});
		}
		else if ((mh > h) && (mw < w)) {
			var x = (w - $scrollsize - mw) / 2;
			$(modal).css({'top': 0 + 'px'});
		}
		else if ((mh < h) && (mw > w)) {
			var y = (h - $scrollsize - mh) / 2;
			$(modal).css({'top': y + 'px'});
		}
		else {
			var x = (w - mw) / 2;
			var y = (h - mh) / 2;
			$(modal).css({'top': y + 'px'});
		}
	},



	// ムービー：再生
	playMovie: function ( id ) {
		var src;

		switch ( id ) {
			case "focus"    : src = "GlTkbuQIQw4"; break;
			case "rapid"    : src = "G1qcFV0vcOM"; break;
			case "focus_sp" : src = "aHLo89GY5tw"; break;
			case "rapid_sp" : src = "aDPjCne58uk"; break;
		}

		var yb = $( "div#movie_yb" );
		yb.show();
		yb.css({ "opacity": 0, "visibility": "visible" });

		$f_movie = id;
		$( "div.movie_special" ).hide();
		self.modalResize();

		function fin () {
			$('div.btn_close').removeClass('down');
			$player.loadVideoById( src );
			self.setBtnClose(true);

			if ($sp) {
				$player.stopVideo();
				TweenMax.to( $( "div#movie_yb" ), 0.5, { autoAlpha: 1 });
			}
		}

		var t = setTimeout( fin, 500 );
		if ($sp) {
			yb.removeClass();
			yb.addClass(id);
			$("iframe", yb).css('opacity', '0');
		}
	},



	// 閉じるボタン
	setBtnClose: function (mode) {
		var obj = $('div.modal_wrap div.btn_close');
		mode ? obj.fadeIn(500) : obj.fadeOut(500);
	}



}

$(function () { self.init(); });
})(jQuery);






/*var vid    = '';
var player = null;
var ua = navigator.userAgent.toUpperCase();
var sp = (ua.indexOf( 'IPHONE' ) != -1) || (ua.indexOf( 'ANDROID' ) != -1) || (ua.indexOf( 'IPOD' ) != -1);

function onYouTubeIframeAPIReady(){
	if ( !player && !sp ) {
		player = new YT.Player( 'yt_vid', {
			width:   '137',
			height:  '83',
			videoId: vid,
			playerVars : {
				wmode :   'transparent',
				autoplay: 0,
				controls: 0,
				showinfo: 0,
				rel:      0,
				loop:     1,
				playlist: vid,
				html5:    1
			},
			events: {
				"onReady": function( event ) {
					event.target.mute();
					event.target.playVideo();
				},
				"onStateChange": function( event ) {

					if ( YT.PlayerState.ENDED === event.data ) {
						event.target.playVideo();
					}
				},'onError':function(){}
			}
		});
	}
}*/
