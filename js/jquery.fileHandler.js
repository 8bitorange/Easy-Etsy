(function( $ ){

	var methods = {
		init : function( options ) {
			
			var options = $.extend(options,{
				onComplete: $.noop()
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
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    

	};
	
	var cleanUp = function(options){
	
		if($.isFunction(options.onComplete)){
			
			options.onComplete();
			
		}
	
	}
	
	var fileHandler = function(files,options){
	
		$.each(files, function(i,e){
		
			/*
var wwworker = new Worker("/js/imageHandler.js");
			
			wwworker.addEventListener("message", function(event){
			 console.log(event);
			});  
*/
            //init variables
            var w,h,blob,canvas,data;
			
    
            //check whether file type is an image
            //if not, close worker and return
            var check = new RegExp("^image");
			if(e.type.search(check) !== 0) return;
			
			//spawn new image object and create url
			var img = new Image();
			img.src = window.webkitURL.createObjectURL(e);
			
			//get height and width of loaded image
			img.onload = function(e){
			    
                //revoke URL for good standing
			    window.webkitURL.revokeObjectURL(e);

			    w = img.width;
			    h = img.height;
			    
			    //create canvas and draw image
			    canvas = document.createElement('canvas');
			    canvas.width = w;
			    canvas.height = h;
			    
			    var context = canvas.getContext('2d');
			    context.drawImage(img,0,0);
			    
			    //get blob
			    blob = canvas.toDataURL("image/jpg");
			    
			    data = {
			        "id": i,
			        "height": h,
			        "width": w,
			        "image": blob
			    }
			    
			}
			
			/*

			$(img).load(function () {
	        	window.webkitURL.revokeObjectURL(e.src);
	      		$('<div class="image" style="display:none" />')
	      			.appendTo("#uploader")
	      			.append(img)
	      			.fadeIn('fast', function(){
	      			
		      			var image = $(this).find('img');
		      			
		      			if(image.width() > 1000 || image.height() > 1000){

		      			     var newWidth,newHeight;
		      			     $(img).unbind('load');

		      			     if(image.width() > image.height()){
	                            newWidth = 1000;
	                            newHeight = (newWidth/image.width() * image.height());
	                        } else {
	                            newHeight = 1000;
	                            newWidth = (newHeight/image.height() * image.width());
	                        }
	                        
	                        var src = updateSize(image.attr('src'),{
	                            h: parseInt(newHeight),
	                            w: parseInt(newWidth)
	                        },function(img){
	                        	createThumb({src: img, image: image})
	                        });
	
		      			} else {
		      			  createThumb({image: image});
		      			}

	      			});

	      	});

	      	
	      	
	       */
		
		});	
		
		cleanUp(options);

	      	
	
	};
	
	var updateSize = function(imgSrc,options,callback){
			    
        var image = new Image();
        image.src = imgSrc;
        image.width = options.w;
        image.height = options.h;
        
        $(image).load(function(){
	        $('<canvas id="tmp_canv" />')
	            .attr("width", options.w)
	            .attr("height", options.h)
	            .css({
	                position: 'absolute',
	                marginLeft: '-9999px'
	            }).appendTo('body');
	            
	        var canvas = document.getElementById("tmp_canv");
	        var context = canvas.getContext('2d');
	        context.drawImage(image,0,0,options.w,options.h);
	        var img = canvas.toDataURL('image/jpeg');
	        $("#tmp_canv").remove();
	        
            if($.isFunction(callback)){
                callback(img);
            }
        });
	};
	
	var createThumb = function(opts){
	
        if(typeof opts.src !== 'undefined'){
        	opts.image.attr('src',opts.src);
        }
        
        if(opts.image.width() < opts.image.height()){
  			opts.image.animate({
  				width: "100px"
  			}, 0, function(){
  				var h = $(this).height();
  				$(this).animate({
  					marginTop: (h - 100)/2 * -1
  				}, 0, function(){
  					$(this).animate({
  						opacity: 1.0
  					}, 500);
  				});
  			});
		} else {
			opts.image.animate({
  				height: "100px"
  			}, 0, function(){
  				var h = $(this).width();
  				$(this).animate({
  					marginLeft: (h - 100)/2 * -1
  				},0, function(){
  					$(this).animate({
  						opacity: 1.0
  					}, 500);
  				});
  			});
  		}
    };

})( jQuery );
