$(function(){
    
    
    
    //***************************************
    //*************  GLOBAL VARIABLES
    
    var shuffleButton = $('#shuffle-button');
    var vimeoFrame = $('#vimeo-frame');
    
    
    //***************************************
    //*************  PAGE SETUP
    
    var digitArray = new Array();
    
    for (var i=0; i<9; i++) {
        
        digitArray[i] = new Digit('', $('.digit').eq(i), false);
    }
    
    //***************************************
    //*************  FUNCTIONS
    
    function Digit(digitValue, displaySlot, locked) {
        
        this.digitValue = digitValue;
        this.displaySlot = displaySlot;
        this.locked = locked;
    }
    
    
    //random integer function
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
    
    
    function shuffleNumbers() {
        
        var newUrl = '';
        
        //for each digit OBJECT...
        for (var j=0; j<9; j++) {
            
            var digitObj = digitArray[j];
            
            //if unlocked, pick a new random number 1-10
            if(digitObj.locked == false) {
                
                digitObj.digitValue = getRandomInt(0,10)+'';
                
                //if 10, make it a dash ('-');
                if (digitObj.digitValue == '10') {
                
                    digitObj.digitValue = '-';
                }
                
            } else {
                
                //else, same number or do nothing
            }  
            
            console.log('digit value ' + i + ' equals ' + digitObj.digitValue);
            
            //add digit value to the new url
            newUrl = newUrl + digitObj.digitValue;
            
        } //end of for loop
        
                
        //update vimeo frame with new digits in url
        updateVimeoFrame(newUrl);
        
        //update the actual text display with function 
        updateTextDisplay(newUrl);
        
    }
    
        
    function updateTextDisplay(disDigits) {
          
        //with animation eventually
        //set the display text to the new digits 
        for (var k=0; k<9; k++) {
            
            var digitObj = digitArray[k];
            digitObj.displaySlot.text(disDigits[k]);
        }
    }
    
    
    function updateVimeoFrame(urlDigits) {
        
        //replace any dashes in url with empty string
        urlDigits = urlDigits.replace(/-/g, '');
        
        console.log('urlDigits is ' + urlDigits);
        
        //create new url
        var newSrc = 'https://player.vimeo.com/video/' + urlDigits + '?autoplay=1&color=fdfdfd&title=0&byline=0&portrait=0';
         
        //update attribute
        vimeoFrame.attr('src', newSrc);
         
    }
    
    
    
    
    //***************************************
    //*************  EVENTS
    
    
    shuffleButton.click(function(){
        
        shuffleNumbers();
    });
    
    
    
    //****** end of document ready block
    //**** GET OUTTA HERE
});