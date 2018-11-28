//***** Randimeo javascripteo

//I'M READY I'M READY I'M READY
$(function(){
    
    
    //***************************************
    //*************  GLOBAL VARIABLES
    
    var shuffleButton = $('#shuffle-button');
    var vimeoFrame = $('#vimeo-frame');
    var clearLockButton = $('#clear-lock-button');
    var backButton = $('#back-button');
    var addButton = $('#add-button');
    var deleteButton = $('.delete-button');
    var bookmarkList = $('#bookmark-list');
    
    var storedBookmarks = localStorage.getItem('faves');
    
    var currentVideoNumber = ''; //string
    var pareviousVideoNumber = ''; //string
    var faveCount = 0;
    
    
    
    //***************************************
    //*************  PAGE SETUP
    
    console.log('string is ' + storedBookmarks);
    
    //create array of digit objects
    var digitArray = new Array(); 
    
    for (var i=0; i<9; i++) {
        
        digitArray[i] = new Digit('-', $('.digit').eq(i), false);
    }
    
    if (storedBookmarks != null) {
        
        var storedArray = storedBookmarks.split('%');
        
        for (var w = 0; w < storedArray.length; w++) {
            
            if (storedArray[w] != null) {
                
                addNewBookmark(storedArray[w]);
            } 
        }
    }
    
    
    //***************************************
    //*************  UTILITY FUNCTIONS
        
    function rgbToHex(rgb) { 
        
        var hex = Number(rgb).toString(16);
        if (hex.length < 2) {hex = "0" + hex;}
        return hex;
    };
    
    
    //random integer function
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }
     
        
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
            
            //console.log('digit value ' + j + ' equals ' + digitObj.digitValue);
            
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
        
        //skews blue, needs some work
        
        urlNum = urlNum.replace(/-/g, '');
        console.log(urlNum);
        
        var ch = Math.floor(urlNum.length/3);
        
        var red = parseInt(urlNum.substr(0,ch));
        var green = parseInt(urlNum.substr(ch,ch));
        var blue = parseInt(urlNum.substr(ch*2));
        
        var range = Math.pow(10,ch);
            
        red = Math.floor(linear(red,0,range,0,255,true));
        green = Math.floor(linear(green,0,range,0,255,true));
        blue = Math.floor(linear(blue,0,range,0,255,true));
        
        console.log(red + ' ' + green + ' ' + blue);
        
        var newFaveColor = '#' + rgbToHex(red) + rgbToHex(green) + rgbToHex(blue);
        
        return newFaveColor;
    }
     
    
    function addNewBookmark(bookmarkNum) {
        
        if (faveCount < 3) {
            
            if (bookmarkNum == '') {
            
                alert('no video number yet!');
                return;
            }
        
            //add new DOM elements
            var newPlunger = "<a class=\"fave-plunger\" href=\"" + bookmarkNum + "\">LOAD</a>"
            var newLabel = $("<p class=\"url-label\"></p>").text(bookmarkNum);
            var newDelete = "<div class=\"delete-button\" data-fave-url=\"" + bookmarkNum + "\"><i class=\"fas fa-trash\"></i></div>"

            var newListItem = $("<li class=\"bookmark-item\" data-fave-url=\"" + bookmarkNum + "\"></li>").prependTo(bookmarkList).append(newPlunger, newLabel, newDelete);

            newListItem.css('backgroundColor', getFaveColor(bookmarkNum));

            faveCount ++;
            console.log('faveCount is now ' + faveCount);
            
            if (faveCount >= 3) {
            
                addButton.addClass('add-button-hidden');
                console.log('supposed to hide now');
            }
            
        }    
    }
    
    
    function removeBookmark(trash) {
        
        trash.parent().remove();
        faveCount --;
        console.log('faveCount is now ' + faveCount);
        
        addButton.removeClass('add-button-hidden');
    }
    
    
    function addToLocalStorage(urlToAdd) {
        
        var storedString = localStorage.getItem('faves');
        
        if (storedString == null || storedString == 'null' || storedString == '') {
            
            storedString = '';
        
        } else {storedString += '%'}
            
        var stringToSave = storedString + urlToAdd;
        
        //add url onto end of stored string
        localStorage.setItem('faves', stringToSave);
        
        console.log('item added. storage is now ' + localStorage.getItem('faves'));
    }
    
    
    function removeFromLocalStorage(urlToRemove) {
        
        //pull apart stored string
        var pullApart = localStorage.getItem('faves').split('%');
        
        console.log('trying to remove ' + urlToRemove);
        
        //remove matching url string        
        var pulledAgain  = pullApart.filter(function(elem){
            return elem != urlToRemove; 
        });
        
        //put it back together
        var stringToSave = pulledAgain.join('%');
        
        //set new string
        localStorage.setItem('faves', stringToSave);
        
        console.log('item should have been removed. storage is now ' + localStorage.getItem('faves'));
    }
    
    
    function unlockAllDigits() {
        
        for (var f = 0; f < digitArray.length; f++ ) {
            
            digitArray[f].locked = false;
            digitArray[f].displaySlot.removeClass('digit-locked');
        }
    }
    
    /*
    function rewriteLocalStorage() {
        
        //iterate through bookmark list
        //create array of url strings
        var newStoreArray = new Array();
        
        $('.bookmark-list').children().each(function(){
            
            console.log('bookmark item iteration');
            
            var anotherString = $(this).attr('date-fave-url');
            newStoreArray.push(anotherString);
        });
        
        localStorage.setItem('faves', newStoreArray.join('%'));
        
        console.log('storage is now ' + localStorage.getItem('faves'));
    }
    */
    
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
    
    
    addButton.click(function(){
        
        addNewBookmark(currentVideoNumber);
        //rewriteLocalStorage();
        addToLocalStorage(currentVideoNumber);
    });
    
    
    bookmarkList.on('click','.bookmark-item .delete-button', function(){
        
        removeBookmark($(this));
        //rewriteLocalStorage();
        
        console.log('delete icon is returning ' + $(this).attr('data-fave-url'));
        
        removeFromLocalStorage($(this).attr('data-fave-url'));
        
    });
    
    
    bookmarkList.on('click', '.bookmark-item .fave-plunger', function(){
       
        event.preventDefault();
        
        var numFromFave = $(this).attr('href');
            
        previousVideoNumber = currentVideoNumber;
        currentVideoNumber = numFromFave;
        
        //unlock all digits
        unlockAllDigits();
        
        //update the actual text display with function 
        updateTextDisplay(currentVideoNumber);
        
        //update vimeo frame with new digits in url
        updateVimeoFrame(currentVideoNumber);
    });
    
    
    $('#clear-storage-button').click(function(){
        
        localStorage.clear();
        console.log('storage is now ' + localStorage.getItem('faves'));
    });
    
    /*
    $(document).on('load', '.bookmark-item', function(){
        
        
    });
    */
    
    //****** end of document ready block
    //**** GET OUTTA HERE
});