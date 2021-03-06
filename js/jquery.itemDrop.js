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
				        
				        if($("#itemList").is(":visible")){
				            $("#itemList").fadeOut();
				        }
				        
				        var drag = e.originalEvent.dataTransfer;
				        
				        drag.effectAllowed = 'none';
				        drag.setData("text/html", this.outerHTML);
				        var img = document.createElement('img');
				        drag.setDragImage(img, 0, 0);
				        
				        $(this).addClass("on");
				        
				        $("div.image.on")
				        	.clone()
							.css({
								position: "fixed",
								float: "none",
								zIndex: 1000000000
							})
							.appendTo($(this).parent());    
					        
				        
				        $(".itemDrop").css("opacity",.5);
				        
				    })
				    .bind('drag', function(e){
				    	
				    	if(e.preventDefault){
							e.preventDefault();
						}
						$("div.image.on").css({
				        	top: e.pageY - 25,
				        	left: e.pageX - 25
				        		
				        });
				

				    })
				    .bind('dragend', function(e){
				    	$(".itemDrop").css({
				    		opacity: 1
				    	});
				    });
				    
				$('.itemDrop')
					.bind('dragover', function(e){
						
						if(e.preventDefault){
							e.preventDefault();
						}
												
						$(this).css({
							opacity: .75
						});
						
						return false;
											
					})
					.bind('dragenter', function(e){
						$(this).css({
							opacity: .75
						});
					})
					.bind('dragleave', function(e){
						$(this).css({
							opacity: .5
						});
					})
					.bind('drop', function(e){
						if(e.preventDefault){
							e.preventDefault();
						}
						if (e.stopPropagation) {
					    	e.stopPropagation(); // stops the browser from redirecting.
						}
						
						var drag = e.originalEvent.dataTransfer;
				        drag.effectAllowed = 'none';
						var obj = drag.getData("text/html");
						
						$(this).append(obj);
						return false;
						
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
