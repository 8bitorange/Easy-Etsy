function fileHandler(files){
				
	$.each(files, function(i,e){
		
		var img = document.createElement("img");
		img.src = window.webkitURL.createObjectURL(e);
		$(img).css({opacity:0});
		img.onload = function () {
        	window.webkitURL.revokeObjectURL(e.src);
     		 	
      		$('<div class="image" style="display:none" />')
      			.appendTo("#uploader")
      			.append(img)
      			.fadeIn('fast', function(){
      			
	      			var image = $(this).find('img');
	      			
	      			if(image.width() > 1000 || image.height() > 1000){
	      			     var newWidth,newHeight;
	      			     
	      			     if(image.width() > image.height()){
                            newWidth = 1000;
                            newHeight = (newWidth/image.width() * image.height());
                        } else {
                            newHeight = 1000;
                            newWidth = (newHeight/image.height() * image.width());
                        }
                        
                        var src = updateSize(image.attr('src'),{
                            h: parseInt(newHeight),
                            w: parseInt(newWidth),
                            create: false
                        },createThumb(src));

	      			} else {
	      			  createThumb();
	      			}
	      			
	      			function createThumb(src){
                        if(typeof src !== 'undefined'){
                            image.attr("src",src);
                        }
                        if(image.width() < image.height()){
			      			image.animate({
			      				width: "100px"
			      			}, 0, function(){
			      				var h = $(this).height();
			      				$(this).animate({
			      					marginTop: (h - 100)/2 * -1
			      				}, 0, function(){
			      					$(this).animate({
			      						opacity: 1.0
			      					}, 500)
			      				});
			      			});
						} else {
							image.animate({
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
                    }
	      								      					      		
      		});
      	}
      	

	
	});
}

$(window).bind('dragenter dragover', function(e){
	e.stopPropagation();
	e.preventDefault();
}).bind('drop', function(e){

	e.stopPropagation();
	e.preventDefault();
	
	var files = e.originalEvent.dataTransfer.files;
	
	fileHandler(files);

});
