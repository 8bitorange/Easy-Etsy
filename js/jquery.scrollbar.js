(function( $ ){

	var methods = {
		init : function( options ) {
			
			var options = $.extend(options,{
				onComplete: $.noop()
			});
			
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('scrollbar'),
				width,compWidth,compHeight,wrapper,scrollbar,defaultHeight,defaultWidth,orient;
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('scrollbar', {
						target : $this
					});
				
				}
				
				compWidth = 0;
				compHeight = 0;
				
				$this.children(options.selector).each(function(){
				    defaultHeight = $(this).outerHeight();
				    defaultWidth = $(this).outerWidth();
					compWidth = $(this).outerWidth(true) + parseInt(compWidth);
					compHeight = $(this).outerHeight(true) + parseInt(compHeight);
				});
				
				$this.css({
				    width: $(window).width() - 20
				});
				
				wrapper = $("<div class='scrollbarWrapper' />").css({
					width: compWidth,
					height: $this.height(),
					overflow: 'visible',
					position: 'relative',
					float: 'left'
				});
				
				scrollbar = $("<div class='scrollbarDiv'/>");
				scrollbar.css({
				    position: 'relative',
				    width: $(window).width() - 40
				});
				
				$this.wrapInner(wrapper).prepend(scrollbar);
				
				scrollbar.slider({
				    animate: true,
				    slide: function(e, ui){
			            var value = parseInt(ui.value/100 * ($this.width() - $('.scrollbarWrapper').width())) + 'px';
				        $('.scrollbarWrapper').css({
				            marginLeft: value
				        });
				    }
				});
				
			});
			
			
		},
		destroy : function( ) {
		
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('scrollbar');
				
				// Namespacing FTW
				data.scrollbar.remove();
				$this.removeData('scrollbar');
			
			});
		
		}
	};
		
	$.fn.scrollbar = function( method ) {
	
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    

	};
	

})( jQuery );
