(function( $ ){

	var methods = {
		init : function( options ) {
			
			var options = $.extend(options,{
				onComplete: $.noop()
			});
			
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('scrollbar'),
				width,compWidth,wrapper;
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('scrollbar', {
						target : $this
					});
				
				}
				
				width = $this.width();
				$this.children().each(function(){
					compWidth = $(this).outerWidth(true) + parseInt(compWidth);
				});
				
				wrapper = $("<div />").css({
					width: compWidth,
					height: $this.height()
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
