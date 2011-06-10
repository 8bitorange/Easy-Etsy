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
	
		window.webkitRequestFileSystem(window.PERSISTENT, 5*1024*1024, function(fs) {
		
			$.each(files, function(i,e){
						
	            //init variables
	            var w,h,name;
				
	    
	            //check whether file type is an image
	            //if not, close worker and return
	            var check = new RegExp("^image");
				if(e.type.search(check) !== 0) return;
				(function(f) {
					fs.root.getFile(f.name, {create: true, exclusive: false}, function(fileEntry) {
						fileEntry.createWriter(function(fileWriter) {
							fileWriter.write(f); // Note: write() can take a File or Blob object.
							name = f.name;
						}, errorHandler);
					}, errorHandler);
				})(e);
				
				//spawn new image object and create url
				var img = new Image();
				fs.root.getFile(e.name, {}, function(fileEntry){
					
					fileEntry.file(function(f){
						img.src = window.webkitURL.createObjectURL(f);
					});
					
				});
				
				
				//get height and width of loaded image
				img.onload = function(e){
				    
	                //revoke URL for good standing
				    window.webkitURL.revokeObjectURL(e);
	
				    w = img.width;
				    h = img.height;
				    
				    data = {
				        "id": i,
				        "height": h,
				        "width": w,
				        "URI": img.src,
				        "name": name
				    }
				    
				    $(img).data(data);
				    
				    
				    
				}

			});
		
		},errorHandler);
			
		function errorHandler(e) {
		  var msg = '';
		
		  switch (e.code) {
		    case FileError.QUOTA_EXCEEDED_ERR:
		      msg = 'QUOTA_EXCEEDED_ERR';
		      break;
		    case FileError.NOT_FOUND_ERR:
		      msg = 'NOT_FOUND_ERR';
		      break;
		    case FileError.SECURITY_ERR:
		      msg = 'SECURITY_ERR';
		      break;
		    case FileError.INVALID_MODIFICATION_ERR:
		      msg = 'INVALID_MODIFICATION_ERR';
		      break;
		    case FileError.INVALID_STATE_ERR:
		      msg = 'INVALID_STATE_ERR';
		      break;
		    default:
		      msg = 'Unknown Error';
		      break;
		  };
		
		  console.log('Error: ' + msg);
		}

	      	
	
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
