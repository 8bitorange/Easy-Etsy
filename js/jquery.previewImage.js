(function( $ ){

	var methods = {
		init : function( options ) {
			
			var opts = $.extend(options,{
				onComplete: $.noop(),
				bg: $("<div id='previewImageBg' />"),
				close: $("<div id='previewImageCloseBtn' />")
			});
			
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('previewImage');
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('previewImage', {
						target : $this
					});
				
				}
				
				opts.bg.css({
					background: 'rgba(0,0,0,.8)',
					opacity: 0,
					width: '100%',
					height: '100%',
					position: 'fixed',
					top: 0,
					left: 0,
					zIndex: 10000000
				}).appendTo('body')
				.animate({opacity: 1},500,function(){
					loadPicture($this,opts);
				})
				.bind('click',function(){
					closePreview();
				});
				
				
								
			});
			
			
		},
		destroy : function( ) {
		
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('previewImage');
				
				// Namespacing FTW
				data.previewImage.remove();
				$this.removeData('previewImage');
			
			});
		
		}
	};
		
	$.fn.previewImage = function( method ) {
	
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    

	};
	
	var loadPicture = function(obj,opts){
	
		var clicked,image,winHeight,winWidth,iHeight,iWidth,marginLeft;
		clicked = obj.find('img');
		
		image = new Image();
		image.src = clicked.attr('src');
		
		winHeight = $(window).height();
		winWidth = $(window).width();
		
		
		image.onload = function(){
			$this = $(image);
			$this.css({
				opacity: 0,
				marginLeft: "-99999px",
				zIndex: 100000000
			}).appendTo("#previewImageBg");
		
			iHeight = $this.outerHeight();
			iWidth = $this.outerWidth();
			
			console.log(iWidth);
			console.log(winWidth);
			if(iHeight > winHeight){
				$this.css({
					height: winHeight - 100
				});
			} else if (iWidth > winWidth){
				$this.css({
					width: winWidth -100
				});
			}
			
			marginLeft = (winWidth - iWidth)/2;
			marginTop = (winHeight - iHeight)/2;
			$this.css({
				marginTop: marginTop,
				marginLeft: marginLeft,
				border: "20px #fff solid",
				boxShadow: "0 0 10px rgba(0, 0, 0, .7)"
			}).animate({opacity: 1},500);
			
			$(opts.close)
				.css({
					position: 'absolute'
				})
				.text('X Close')
				.prependTo("#previewImageBg")
				.css({
					top: marginTop - opts.close.outerHeight(),
					left: marginLeft + iWidth - (opts.close.outerWidth()/2)
				});
			
		};
	
	};
	
	var closePreview = function(){
	
		$("#previewImageBg").fadeOut('fast', function(){
			$(this).remove();
		});
	};

})( jQuery );
