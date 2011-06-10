
/*
 Setup onmessage function in eventListener
*/
self.addEventListener("message", function(event){
    
    try {
        indexedDB.open("test","test database");
    } catch (err) {
        self.postMessage(err);
    }
    
    self.postMessage(event.data);
    
    return;

});