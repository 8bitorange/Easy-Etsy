(function( $ ){

	var methods = {
		init : function( options ) {
			
			var options = $.extend(options,{
				onStart: $.noop()
			});
			
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('itemDrop');
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('itemDrop', {
						target : $this
					});
				
				}
				
				$this
				    .bind('dragstart', function(e){
				    
				        e.stopPropagation();
				        e.preventDefault();
				        
				        if($("#itemList").is(":visible")){
				            $("#itemList").fadeOut();
				        }
				        
				        var drag = e.originalEvent.dataTransfer;
				    
				    });
				    
				$(".itemDrop")
    				.bind('dragenter dragover', function(e){
    				
    					e.stopPropagation();
    					e.preventDefault();
    				
    				}).bind('dragleave', function(e){
    				
    					e.stopPropagation();
    					e.preventDefault();
    					
    				}).bind('drop', function(e){
    				
    					e.stopPropagation();
    					e.preventDefault();
    				
    				});
				
			});
			
			
		},
		destroy : function( ) {
		
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('itemDrop');
				
				// Namespacing FTW
				data.itemDrop.remove();
				$this.removeData('itemDrop');
			
			});
		
		}
	};
		
	$.fn.itemDrop = function( method ) {
	
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.itemDrop' );
		}    

	};

})( jQuery );
