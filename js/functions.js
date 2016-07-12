(function ($) {


var ua  = navigator.userAgent.toUpperCase();
var $sp = (ua.indexOf( 'IPHONE' ) != -1) || (ua.indexOf( 'ANDROID' ) != -1) || (ua.indexOf( 'IPOD' ) != -1);
var $dir;
var self = $.functions = {
	
	
	
	init: function () {
		self.modalThumb();
	},
	
	
	
	// モーダル展開後
	modalOpen: function ( id, dir ) {
		var id = id.split( "thumb" )[1];
		
		$dir = dir;
		
		self.resetModal();
		self.loadPhoto( id );
		
		// 初期状態
		$( 'div.modal_thumb_frame' ).jScrollPane();
		
		// 高さ
		var h = 402 * ($( "div.content" ).width() / 536);
		$( "div.content" ).height( h );
	},
	
	
	
	// 画像読み込み
	loadPhoto: function ( id ) {
		var ar  = ar_ = new Array;
		var obj;
		
		// 初期状態
		$('div.loading div.bar span').css('width', '0');
		$( "div.modal_gallery" ).css({ "overflow" : "hidden" });
		$( "div.modal_gallery p.note" ).hide();
		
		if ( $dir == "focus" ) {
			$( "div.modal_gallery div.btn" ).hide();
			$( "div.content" ).css({ "opacity" : 0 });
			self.focus();
		}
		else {
			$( "div.modal_gallery div.slider" ).hide();
			$( "div.out" ).css({ "opacity" : 0 });
		}
		
		if ( $dir == "rapid" ) {
			ar  = ["img/" + $dir + "/photo" + id + ".jpg", "img/" + $dir + "/slider" + id + ".jpg"];
			obj = $( "div.modal_main div.out div.img p" );
			
			$( "div.rapid_contents" ).attr( "id", "rapid" + id );
		}
		else if ( $dir == "focus" ) {
			var num = (id == "03" || id == "04") ? 3 : 2;
			
			for ( var i = 0; i < num; i++ ) {
				ar.push("img/" + $dir + "/photo" + id + "_" + ( i + 1 ) +  ".jpg");
			};
			
			obj = $( "div.modal_main div.content" );
		}
		var ar_ = ar.concat();
		
		self.activeThumb( id );
		
		Array.prototype.remove = function(element) {
			for (var i = 0; i < this.length; i++)
				if (this[i] == element) this.splice(i,1); 
		};
		
		function preload(images, progress) {
			var total = images.length;
				$(images).each(function(){
				var src = this;
				
				$('<img/>').attr('src', src).load(function() {
					images.remove(src);
					progress(total, total - images.length);
				});
			});
		}
		
		var now_percent = 0;
		var displaying_percent= 0;
		
		preload( ar, function(total, loaded) {
			now_percent = Math.ceil(100 * loaded / total);
		});
		
		
		var timer = window.setInterval( function() {
			if ( displaying_percent >= 100 ) {
				window.clearInterval(timer);
				
				$( "div.modal_gallery p.note" ).fadeIn(600);
				if ( $dir == "rapid" ) {
					self.rapid( ar_[1], id );
					$( "div.modal_gallery div.slider" ).fadeIn(600);
					TweenMax.to( $( "div.out" ), 1.0, { autoAlpha: 1 });
				}
				else {
					if ( id == "03" || id == "04" ) {
						$( "div.focus_contents div.btn" ).attr('id', "line3");
						$( "div.focus_contents a.btn_3" ).show();
					}
					else {
						$( "div.focus_contents div.btn" ).attr('id', "line2");
						$( "div.focus_contents a.btn_3" ).hide();
					}
					
					$( "div.modal_gallery div.btn" ).fadeIn(600);
					TweenMax.to( $( "div.content" ), 1.0, { autoAlpha: 1 });
				}
				
				$('div.loading').fadeOut('fast', function() {
					
					for ( var i = 0; i < ar_.length; i++ ) {
						var tag = i == 0 ? '<img class="active" />' : '<img />';
						var img = $( tag ).attr('src', ar_[i]).appendTo(obj);
					};
					
					$( "div.modal_main" ).fadeIn( 600, function () {
						$( "div.modal_gallery" ).css({ "overflow" : "visible" });
					});
				});
			} else {
				if (displaying_percent < now_percent) {
					displaying_percent++;
					$('div.loading div.bar span').css('width', displaying_percent + '%');
				}
			}
		}, 10 );
	},
	
	
	
	// スライド：設定
	rapid: function ( src, id ) {
		var rapid_h = $sp ? 232.5 : 402;
		var step    = ( ($sp ? 7208 : 12462) / rapid_h ) - 1;
		var def     = step / 2;
		
		$( ".slider" ).slider({
				range: "min",
				min:   0,
				max:   step,
				value: def,
				step:  1,
				slide: function( event, ui ) {
					move( ui.value );
				}
		});
		
		move(def)
		$( 'div.rapid_contents div.content' ).scrollTop( 0, 0 );
		
		var gauge = $( '.ui-slider-handle' );
		gauge.css({ 'background-image' : 'url(' + src + ')' });
		
		function move ( value ) {
			var img_h = -rapid_h * value;
			
			$( 'div.rapid_contents div.img' ).css({ "margin-top": img_h });
			
			var gauge   = $( '.ui-slider-handle' );
			var gauge_h = 70;
			var gauge_y = value * gauge_h;
			var pos     = id == "05" ? ('-21px ' + (-gauge_y) + 'px') : ('0 ' + (-gauge_y) + 'px');
			
			$( '.ui-slider-handle' ).css({ 'background-position' : pos });
		}
	},
	
	
	
	// フォーカス：設定
	focus: function () {
		
		$( "div.focus_contents div.btn a" ).click( function(){
			var pos  = $( this ).attr( "class" ).split( "_" )[ 1 ];
			var imgs = $( "div.focus_contents div.content img" );
			var img  = imgs.eq( pos - 1 );
			
			imgs.removeClass();
			img.addClass( "active" );
			$( "div.focus_contents div.btn > div" ).removeClass( "active" );
			$( this ).parent().parent().addClass( "active" );
		});
		
		// ボタンの初期状態
		for ( var i = 0; i < $( "div.focus_contents a" ).length; i++ ) {
			var btn = $( "div.focus_contents div.btn > div" ).eq( i );
			
			if ( i == 0 ) {
				btn.addClass( "active" );
			}
			else if ( btn.hasClass( "active" ) ) {
				btn.removeClass( "active" );
			}
		};
	},
	
	
	
	// モーダルのサムネイル：設定
	modalThumb: function () {
		
		$( "div.modal_thumb a" ).click( function(){
			var id = $( this ).attr( "class" );
					id = id.split( "thumb" )[1];
			var active = $( this ).parent().parent().hasClass( "active" );
			
			$( "div.modal_gallery" ).css({ "overflow" : "hidden" });
			
			if ( !active ) {
				$( "div.loading" ).fadeIn( 300 );
				self.resetModal();
				self.loadPhoto( id );
			}
		});
	},
	
	
	
	// モーダルのサムネイル：アクティブ
	activeThumb: function ( id ) {
		var num   = Number(id);
		var li    = $( "div.modal_thumb_frame ul li" );
		var thumb = li.eq( num - 1 );
		
		li.removeClass();
		thumb.addClass( "active" );
	},
	
	
	
	// モーダル内初期化
	resetModal: function () {
		var obj = $dir == "rapid" ? $( "div.rapid_contents div.out p" ) : $( "div.focus_contents div.content" );
		$('div.loading').show();
		obj.empty();
		$( "div.mfp-wrap" ).addClass( "of" );
	}
	
	
	
}

$(function () { self.init(); });
})(jQuery);
