(function( $ ){

	var methods = {
		init : function( options ) {
			
			var opts = $.extend(options,{
				onComplete: $.noop()
			});
			
			return this.each(function(i){
			
				var $this = $(this),
				data = $this.data('imageEditor'),editor,canvas,tmpImg,pass;
				
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
					
					$(this).data('imageEditor', {
						target : $this
					});
				
				}
				
				if($("#canvasEditor").length <= 0){
					editor = $("<canvas class='canvasEditor' id='editor' />");
					editor.appendTo($this);
				}				
				resetSlider($(".slider"));
				createImage(opts.image,{});
								
				$(".slider").slider({
					create: function(e,ui){
						resetSlider($(this));
					},
					change: function(e){
						var values = updateValues();
						if(e.which === 1 && $("#tmp_img").length){
							updateCaman(canvas,values);
						}
					}
				});
				
				if($.isFunction(opts.onComplete)){
				    opts.onComplete($this,canvas);
				}
						
			});
			
			
		},
		
		destroy : function( ) {
		
			return this.each(function(){
			
				var $this = $(this),
				data = $this.data('imageEditor');
				
				// Namespacing FTW
				data.imageEditor.remove();
				$this.removeData('imageEditor');
			
			});
		
		}
	};
		
	$.fn.imageEditor = function( method ) {
	
		if ( methods[method] ) {
			return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
		} else if ( typeof method === 'object' || ! method ) {
			return methods.init.apply( this, arguments );
		} else {
			$.error( 'Method ' +  method + ' does not exist on jQuery.tooltip' );
		}    

	};
	
	function updateValues(){
							
		var options = {};
		
		$(".slider").each(function(){
			var name = $(this).attr('name');
			var val = $(this).slider('option', 'value');
			
			if(typeof val === 'number'){
				options[name] = val;
			}
		});	
		
		return options;
	}
	
	function updateCaman(values){
	    
		Caman($("#tmp_img").attr('src'),"#canvasEditor",function(){
		    this.brightness(values.brightness);
		    this.saturation(values.saturation);
		    this.hue(values.hue);
		    this.contrast(values.contrast);
			this.render();
		});
					
	}
	
	function resetSlider(slider){
		slider.each(function(){
			$(this).slider("option","min",$(this).data("min"));
			$(this).slider("option","max",$(this).data("max"));
			$(this).slider("option","value",0);
		});
	}
					
	$(".slider").slider({
		create: function(e,ui){
			resetSlider($(this));
		},
		change: function(e){
			var values = updateValues();
			if(e.which === 1 && $("#tmp_img").length){
				updateCaman(values);
			}
		}
	});
	
	function saveImage(canvas){
		var img = canvas.toDataURL("image/jpeg");
		$("#images > div.on").fadeOut('slow', function(){
			$(this).find('img').attr('src',img);
			img.onload = function(){
				$(this).fadeIn();
			}
		});
		
		canvas.width = canvas.width;
		return false;
		
	}
    
    $("#saveImage").click(function(){
    	
    	$("#tmp_img").remove();
    	saveImage();
    	return false;
    
    });

    function createImage(img,options){
        if($("#tmp_img").length){
		    $("#tmp_img").remove();
        }
		$('<img id="tmp_img" />')
		   .attr('src', img.attr('src'))
		   .css({
		   		marginLeft: '-9999px',
		   		position: 'absolute'
		   })
		   .appendTo('body')
		   .load(function(){
		       if(typeof options.w === 'undefined'){
			       options.w = this.width;
			       options.h = this.height;
               }
		       options.image = document.getElementById("tmp_img");
		       
				$(canvas)
				   .attr('width', options.w)
				   .attr('height', options.h)
				   .css({
				   	   display: 'block',
				   	   margin: 'auto'
				   });
				
				inspectorInit(options);
				var values = updateValues();
				updateCaman(values);

		   });
    }
    
    function updateSize(imgSrc,options,callback) {
    
        var image = new Image();
        image.src = imgSrc;
        image.width = options.w;
        image.height = options.h;
        
        image.onload = function(){
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
	        var result = $("<img />").attr("src",img);
	        $("#tmp_canv").remove();
	        if(options.create){
		        createImage(result,options);
            }
            
            if(typeof callback === 'function'){
                callback(img);
            }
        }			    
    }

	function inspectorInit(options){
		
		var insp = $("#inspector");
		var w_insp = $("#width");
		var h_insp = $("#height");
		var change,new_w,new_h;
		
		w_insp.val(options.w);
		h_insp.val(options.h);
		
		$(".dimension").keyup(function(){
		   if($(this).attr('name') === 'width'){
		       new_w = $(this).val();
		       change = new_w/options.w;
		       new_h = parseInt(options.h * change);
		       h_insp.val(new_h);
		   } else {
		       new_h = $(this).val();
		       change = new_h/options.h;
		       new_w = parseInt(options.w * change);
		       w_insp.val(new_w);
		   }
		   
		});
		
		$("#resize").click(function(){
		   var opts = {
		       w: $("#width").val(),
		       h: $("#height").val(),
		       create: true
		   };
		   updateSize($("#tmp_img"),opts);
		
		});
							
	}
	

})( jQuery );
