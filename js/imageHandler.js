self.addEventListener("message", function(e){
    
    var $this = self;
    var file = e.data;
    //check whether file type is an image
    //if not, close worker and return
    var check = new RegExp("^image");
    if(file.type.search(check) !== 0){
        $this.postMessage({'success': false, 'msg': 'write', 'error': 'not an image'});
        
    };

    $this.webkitRequestFileSystem($this.TEMPORARY, 5*1024*1024, function(fs) {
        fs.root.getFile(file.name, {create: true, exclusive: false}, function(fileEntry) {
            
            fileEntry.file(function(f){
            
                if(f.size !== 0){
                
                    var date = new Date();
                    var newName = date.getMilliseconds() + '_' + file.name;
                    fileEntry.copyTo(fs.root, newName, function(entry){
                        entry.file(function(newFile){
                            $this.postMessage({'success': true, 'msg': 'File Written', 'file': newFile});
                            
                        });
                    });
                    
                } else {
                    
                    fileEntry.createWriter(function(fileWriter) {
            
            			fileWriter.write(file);
            			$this.postMessage({'success': true, 'msg': 'File Written', 'file': file});
            			
            
            		}, function(error){
            		    $this.postMessage({'success': false, 'msg': 'write', 'error': error});
            		    
            		});
                    
                }
                
                
            });
             

    	}, function(error){
    	   $this.postMessage({'success': false, 'msg': 'get', 'error': error, 'file': file});
    	   
    	});
    
    }, function(error){
        $this.postMessage({'success': false, 'msg': 'filesystem', 'error': error});
        
    });
}, false);



