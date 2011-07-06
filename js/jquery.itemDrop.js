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
				
				$this.attr("draggable", "true");
				
				$this
				    .bind('dragstart', function(e){
				    
				        e.stopPropagation();
				        e.preventDefault();
				        
				        if($("#itemList").is(":visible")){
				            $("#itemList").fadeOut();
				        }
				        
				        var drag = e.originalEvent.dataTransfer;
				        console.log(drag);
				        drag.effectAllowed = 'copy';
				        drag.setData("Text", Math.random());
				        
				        $(".itemDrop").css("backgroundColor","black");
				        
				    });
				    
				$(".itemDrop")
    				.bind('dragover', function(e){
    				
    					if (e.preventDefault) e.preventDefault(); // allows us to drop
    				
    				    e.originalEvent.dataTransfer.dropEffect = "drop";
    				    $(".itemDrop").css("backgroundColor","blue");
    				    
    				}).bind('dragleave', function(e){
    				
    					
    					
    				}).bind('drop', function(e){
    				
    					if (e.stopPropagation) e.stopPropagation(); // stops the browser from redirecting...why???
    					
    					console.log(e.originalEvent.dataTransfer.getData("Text"));
    				
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
