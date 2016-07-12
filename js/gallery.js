(function ($) {



var $lock = false;
var self = $.gallery = {



	init: function () {
		$( "a.btn" ).hover(
			function () {
				var dir = $( this ).attr( "class" ).indexOf( "focus" ) >= 0 ? "focus" : "rapid";
				if ( $lock == false ) {
					$( "div#main_pc" ).addClass( dir );
				}
			},
			function () {
				if ( $lock == false ) {
					$( "div#main_pc" ).removeClass();
				}
			}
		);

		$( "a.btn" ).click( function(){
			var dir     = $( this ).attr( "class" ).indexOf( "focus" ) >= 0 ? "focus" : "rapid";
			var str_out = dir == "focus" ? "rapid" : "focus";
			var obj_out = $( "div#area_" + str_out );
			var obj_in  = $( "div#area_" + dir );
			var overlay = obj_out.find( "div.overlay" );
			var tx_out  = obj_out.find( "div.title" );
			var tx_in   = obj_in.find( "div.title" );

			TweenMax.to( tx_out, 0.3, { autoAlpha: 0 });
			TweenMax.to( tx_in, 0.3, { autoAlpha: 0 });
			TweenMax.to( overlay, 0.3, { "opacity": 1 });
			TweenMax.to( $( "h1" ), 0.4, { autoAlpha: 0, onComplete: slideout, onCompleteParams: [dir] });

			$lock = true;
		});

		function slideout ( dir ) {
			$( "div#area_" + dir ).find( "div.overlay" ).addClass( "slideout" );
			var t = setTimeout( function() {
				$( "div.overlay_move" ).show();
				TweenMax.to( $( "div.overlay_move" ), 1, { autoAlpha: 1, onComplete: fin, onCompleteParams: [dir]  });
			}, 500 );
		}

		function fin ( dir ) {
			dir = dir == "rapid" ? "4k_burst" : dir;
			location.href = dir + ".html";
		}
	}



}

$(function () { self.init(); });
})(jQuery);
