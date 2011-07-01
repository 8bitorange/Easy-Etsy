(function( $ ){

	var methods = {
		init : function( options ) {
			
			var options = $.extend(options,{
				onStart: $.noop()
			});
			
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('fileHandler');
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('fileHandler', {
						target : $this
					});
				
				}
				
				if(typeof options.listen !== 'undefined'){
					
					$(options.listen).live('change', function(e){
					
						e.preventDefault();
						e.stopPropagation();
							
						var files = e.originalEvent.srcElement.files;
        				
        				if($.isFunction(options.onStart)){
        				    options.onStart();
        				}

						fileHandler(files,options);
					
					});
					
				}
				
				$(window).bind('dragenter dragover', function(e){
				
					$('body').addClass('hover');
					e.stopPropagation();
					e.preventDefault();
				
				}).bind('dragleave', function(e){
				
					$('body').removeClass('hover');
					e.stopPropagation();
					e.preventDefault();
					
				}).bind('drop', function(e){
				
					e.stopPropagation();
					e.preventDefault();
					$('body').removeClass('hover');
					
					var files = e.originalEvent.dataTransfer.files;
					
				
    				if($.isFunction(options.onStart)){
    				    options.onStart();
    				}
    				
					fileHandler(files,options);
				
				});
				
			});
			
			
		},
		destroy : function( ) {
		
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('fileHandler');
				
				// Namespacing FTW
				$(window).unbind('dragenter dragover dragleave drop');
				data.fileHandler.remove();
				$this.removeData('fileHandler');
			
			});
		
		}
	};
		
	$.fn.fileHandler = function( method ) {
	
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.fileHandler' );
		}    

	};
	
	var fileHandler = function(files,options){
		
		var total = files.length - 1;
		
		$.each(files, function(i,e){
		
            //init variables
            var w,h,name,result;
            
            var check = new RegExp("^image");
            if(e.type.search(check) !== 0) return;

			var imageDiv = $("<div class='image' />");
            imageDiv
                .css({
                    opacity: 0
                })
                .appendTo("#uploader")
                .animate({opacity: 1},200);
            
			//spawn new image object and create url
			var img = new Image();
			
			//get height and width of loaded image
	        img.onload = function(){
	        
			    w = img.width;
			    h = img.height;
			    
			    data = {
			        "id": i,
			        "height": h,
			        "width": w,
			        "URI": img.src,
			        "name": e.name
			    }
			    
			    $(img).data(data);
			    
			    if(w > 1000 || h > 1000){
                    
                    img = resizeImage(img);
			             
			    }
			    
			    setTimeout(function(){
    			    createThumb($(img), function(obj){
    				    obj
    				        .css({opacity: 0})
    				        .appendTo(imageDiv)
    				        .animate({opacity: 1},200);
    			    
    			    });	  
                },200);
			}
			img.src = window.webkitURL.createObjectURL(e);
    				
		});	
	
	};

    var createThumb = function(img, callback){
        var change;
        
        if(img.data('width') < img.data('height')){
            change = 100 / img.data('width') * img.data('height');
    		img.css({
    		   width: "100px",
    		   marginTop: parseInt((100 - change)/2)
    	    });
    			
    			
    	} else {
        change = 100 / img.data('height') * img.data('width');
    		img.css({
    		   height: "100px",
    		   marginLeft: parseInt((100 - change)/2)
    	    });
    	    
    	}
    	
    	if($.isFunction(callback)){
    	   callback(img);
    	}
    		
    };	
    
    var resizeImage = function(img){
    
        var canvas,ctx,w,h,change,newW,newH;
        var result = {};
        
        w = $(img).data('width');
        h = $(img).data('height');
        
        if(w >= h){
            change = 1000/w;
            newH = parseInt(change * h);
            newW = 1000;
        } else {
            change = 1000/h;
            newW = parseInt(change * w);
            newH = 1000;
        }
        
        canvas = document.createElement("canvas");
        canvas.width = newW;
        canvas.height = newH;
        ctx = canvas.getContext('2d');
        
        ctx.drawImage(img,0,0,newW,newH);
        img.src = canvas.toDataURL("image/jpeg");
        
        $(img).data({
            'width': newW,
            'height': newH
        });
        
        return img;
        
    };


})( jQuery );
