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
    
    
    
    //***************************************
    //*************  PAGE SETUP
    
    //create array of digit objects
    var digitArray = new Array(); 
    
    for (var i=0; i<9; i++) {
        
        digitArray[i] = new Digit('-', $('.digit').eq(i), false);
    }
    
    
    
    //***************************************
    //*************  UTILITY FUNCTIONS
        
    function rgbToHex(rgb) { 
        
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {hex = "0" + hex;}
        return hex;
    };
    
        
    function linear(incoming,bottom,top,min,max,cap) {
 
        var oldRange = top-bottom;
        var newRange = max-min;
        
        //var remapped = (newRange * incoming - newRange * bottom)/oldRange + min;

        remapped = (newRange*incoming)/oldRange;
        
        if (cap) {
            
            if (remapped>max) {remapped=max}
            else if (remapped<min) {remapped=min}
        }
        
        return remapped;
    }

    
    
    //***************************************
    //*************  RANDIMEO FUNCTIONS
    
    function Digit(digitValue, displaySlot, locked) {
        
        this.digitValue = digitValue;
        this.displaySlot = displaySlot;
        this.locked = locked;
    }
    
    function Fave(faveData) {
        
        this.faveURL = faveData[0];
        this.faveSlot = $(faveData[1]);
        this.faveColor = faveData[2];
        this.lleno = faveData[3]=='0' ? false : true;
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
    
    
    
    function getFaveColor(urlNum) {
        
        var ch = Math.floor(urlNum.length()/3);
        
        var red = parseInt(urlNum.substr(0,ch));
        var green = parseInt(urlNum.substr(ch,ch));
        var blue = parseInt(urlNum.substr(ch*2));
        
        var range = Math.pow(10,ch);
            
        red = linear(red,0,range,0,255,true);
        green = linear(green,0,range,0,255,true);
        blue = linear(blue,0,range,0,255,true);
        
        return '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
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
        }
        
    });
    
    
    backButton.click(function(){
       
        updateTextDisplay(previousVideoNumber);
        updateVimeoFrame(previousVideoNumber);
        
        var temp = currentVideoNumber;
        currentVideoNumber = previousVideoNumber;
        previousVideoNumber = temp;
    });
    
    
    
    
    //****** end of document ready block
    //**** GET OUTTA HERE
});