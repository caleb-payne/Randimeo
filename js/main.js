//***** Randimeo javascripteo

//I'M READY I'M READY I'M READY
$(function(){
    
    
    //***************************************
    //*************  GLOBAL VARIABLES
    
    var shuffleButton = $('#shuffle-button');
    var vimeoFrame = $('#vimeo-frame');
    var clearLockButton = $('#clear-lock-button');
    var backButton = $('#back-button');
    
    var currentVideoNumber = ''; //string
    var previousVideoNumber = ''; //string
    
    
    //use these in place of local storage while building
    //format is 'url, faveSlot, faveColor'
    var testFave0 = null;
    var testFave1 = null;
    var testFave2 = null;
    
    
    
    //***************************************
    //*************  PAGE SETUP
    
    //create array of digit objects
    var digitArray = new Array(); 
    
    for (var i=0; i<9; i++) {
        
        digitArray[i] = new Digit('-', $('.digit').eq(i), false);
    }
    
    //create array of fave objects
    var faveArray = new Array();
    
    faveArray[0] = testFave0;
    faveArray[1] = testFave1;
    faveArray[2] = testFave2;
    

    
    //***************************************
    //*************  FUNCTIONS
    
    function Digit(digitValue, displaySlot, locked) {
        
        this.digitValue = digitValue;
        this.displaySlot = displaySlot;
        this.locked = locked;
    }
    
    function Fave(faveData) {
        
        this.faveURL = faveData[0];
        this.faveSlot = faveData[1];
        this.faveColor = faveData[2];
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
            
            console.log('digit value ' + j + ' equals ' + digitObj.digitValue);
            
            //add digit value to the new url
            newUrl = newUrl + digitObj.digitValue;
            
        } //end of for loop
        
                
        return newUrl;
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
        
        //create new url
        var newSrc = 'https://player.vimeo.com/video/' + urlDigits + '?autoplay=1&color=fdfdfd&title=0&byline=0&portrait=0';
         
        //update attribute
        vimeoFrame.attr('src', newSrc);
        
        //debug
        console.log('updated frame with ' + urlDigits);
    }
    
    
    
    //***************************************
    //*************  EVENTS
    
    
    shuffleButton.click(function(){
        
        previousVideoNumber = currentVideoNumber;
        currentVideoNumber = shuffleNumbers();
        
        //update vimeo frame with new digits in url
        updateVimeoFrame(currentVideoNumber);
        
        //update the actual text display with function 
        updateTextDisplay(currentVideoNumber);
        
    });
    
    
    
    $('.digit').click(function(event){
        
        var thisDigitDOM = $(event.target);
            
        thisDigitObj = digitArray[thisDigitDOM.index()];
        
        if (thisDigitObj.locked == true){
            
            thisDigitDOM.removeClass('digit-locked');
            thisDigitObj.locked = false;
                        
        } else {
            
            thisDigitDOM.addClass('digit-locked');
            thisDigitObj.locked = true;
            
            //clearLockButton.addClass('clear-lock-visible');
        }
        
    });
    
    
    backButton.click(function(){
       
        updateTextDisplay(previousVideoNumber);
        updateVimeoFrame(previousVideoNumber);
    });
    
    
    
    
    
    
    //****** end of document ready block
    //**** GET OUTTA HERE
});