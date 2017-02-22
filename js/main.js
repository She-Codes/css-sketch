(function() {
  var addButton = document.getElementById('add');
  var staging = document.getElementById('staging');
  var canvas = document.getElementById('canvas');
  var canvasBox = canvas.getBoundingClientRect();
  var inputs = document.querySelectorAll('input');

  var util = {
    convertToCamelCase: function(str) {
      var hyphenArr, letter, word, partialWord, capitalizedWord;
      if ( str.indexOf('-') >= 0 ) {
        hyphenArr = str.split('-');
        for (var i = 1; i < hyphenArr.length; i++) {
          word = hyphenArr[i];
          partialWord = hyphenArr[i].slice(1);
          letter = word[0].toUpperCase();
          capitalizedWord = letter + partialWord;
          hyphenArr[i] = capitalizedWord;
        }
        return hyphenArr.join('');
      } else {
        return str;
      }
    },
    isRgb: function(str) {
      return str.indexOf('rgb(') > -1
    },
    isHex: function(str) {
      return (str.length === 4 || str.length === 7) && str[0] === '#' ? true : false
    },
    convertRgbToHex: function(rgbStr) {
      // 'rgb(98, 105, 67)'
      var numberStr = rgbStr.slice(4, -1);
      var rgbArr = numberStr.split(',');
      var r = Number(rgbArr[0].trim());
      var g = Number(rgbArr[1].trim());
      var b = Number(rgbArr[2].trim());
      // http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
      return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    },
    areBorderRadiusEllipseValues: function(styleVal) {
      return !!styleVal.match(/% \d/);
    },
    extractValueForInput: function(styleVal) {
      var strippedVal;
      var arr = [];
      // borderBottomLeftRadius
      // "36% 60%"
      // backgroundColor
      // "rgb(54, 255, 119)"
      // borderTopLeftRadius
      // "35%"
      // height
      // ""
      // borderRightWidth
      // "8px"
      // transform
      // "rotate(33deg)"

      // if style contains the word radius and has a space with a number behind it
      if ( this.areBorderRadiusEllipseValues(styleVal) ) {
        styleVal = styleVal.replace(/%/g, '');
        return styleVal.split(' ');

        // if value contains rgb
      } else if ( this.isRgb(styleVal ) ) {
        strippedVal = this.convertRgbToHex(styleVal);
        arr[0] = strippedVal;
        return arr;
        // if value is transparent
      } else if ( styleVal === 'rgba(0, 0, 0, 0)' ) {
        arr[0] = 'transparent';
        return arr;
        // otherwise just remove anything besides digits
      } else {
        strippedVal = styleVal.replace(/\D/g, '');
        arr[0] = strippedVal;
        return arr;
      } 
    }
  }

  function init() {
    bindEvents();
  }

  function updateStyle(input, shape) {
    var value = appendUnitToValueIfNeeded(input);
    var property = input.dataset.property;

    // border radius
    if ( property.indexOf('Radius') > 0 ) {
      value = getBorderRadiusValue(input, value, property);
    // transparent checkbox value is always transparent, if it was unchecked
    } else if ( value === 'transparent' && !input.checked) {
      // get value from color picker input to update shape with
      input = document.querySelector('input[data-property="' + property +'"][type="color"]');
      value = appendUnitToValueIfNeeded(input);
    }
   
    // if a color was selected uncheck transparent checkbox
    if ( property.indexOf('Color') > -1 && value !== 'transparent' ) {
      document.querySelector('input[data-property="' + property +'"][type="checkbox"]')
        .checked = false;
    }

    
    console.log('prop: '+property+' and '+value)
    shape.style[property] = value;
  }
  
  function appendUnitToValueIfNeeded(input, val) {
    var value = val || input.value;
    var unit;
    
    if ( 'unit' in input.dataset ) {
      unit = input.dataset.unit;

      if ( unit === 'deg') {
        value = 'rotate(' + value + unit + ')';
      } else {
        value += unit;
      }
    }
    
    return value;
  }

  function dragAndDrop(e) {
    var shape = e.target;
    var originalMouseX = e.clientX;
    var originalMouseY = e.clientY;
    var shapeBox = shape.getBoundingClientRect();
    var shapeLeft = shapeBox.left;
    var shapeTop = shapeBox.top;
    var draggable = shape;
    // get coordinates of dropzone


    function dragMe(e) {
      var draggableBox = draggable.getBoundingClientRect();

      draggable.style.left = shapeLeft + e.clientX - originalMouseX + 'px';
      draggable.style.top = shapeTop + e.clientY - originalMouseY + 'px';
      // when over drop zone add class to dropzone

      // if already over dropzone if drag outside add delete class for styles

      
    }

    function dropMe(e) {
      var draggableBox = draggable.getBoundingClientRect();

      document.removeEventListener('mousemove', dragMe);
      document.removeEventListener('mouseup', dropMe);
      draggable = null;
      // after drop remove class from dropzone
      // if not over dropzone reset left and top styles
      // if delete class added then delete shape

      // drop in main area
      if ( isOverMainDropzone(draggableBox) ) {
        console.log('over');
        if ( !shape.classList.contains('dropped') ) {
          shape.classList.add('dropped');
          canvas.appendChild(shape);
        }
      } 

      // move back to starting position, but also removes other styles(bug)
      if ( !isOverMainDropzone(draggableBox) && !shape.classList.contains('dropped') ) {
        // remove style
        shape.style.top = "";
        shape.style.left = "";
      }

      // remove element if dragged outside of main area and dropped
      if ( !isOverMainDropzone(draggableBox) && shape.classList.contains('dropped') ) {
        // remove element
        shape.parentNode.removeChild(shape);
      }
    }

    function isOverEntireDropzone(draggableBox) {
      var outterLeftBoundary = canvasBox.left - draggableBox.width;
      
      var outterRightBoundary = canvasBox.right + draggableBox.width;
      
      var outterTopBoundary = canvasBox.top - draggableBox.height;
      
      var outterBottomBoundary = canvasBox.bottom + draggableBox.height;
      

      // var overlappingLeft = draggableBox.right > canvasBox.left && draggableBox.left < canvasBox.left;
      // var overlappingRight = draggableBox.left < canvasBox.right && draggableBox.right > canvasBox.right;
      // var overlappingTop = draggableBox.bottom > canvasBox.top && draggableBox.top < canvasBox.top;
      // var overlappingBottom = draggableBox.top < canvasBox.bottom && draggableBox.bottom > canvasBox.bottom;

      var withinOutterLeft = draggableBox.left > outterLeftBoundary;
      var withinOutterRight = draggableBox.right < outterRightBoundary;
      var belowOutterTop = draggableBox.top > outterTopBoundary;
      var aboveOutterBottom = draggableBox.bottom < outterBottomBoundary;

      return withinOutter = withinOutterLeft && withinOutterRight && belowOutterTop && aboveOutterBottom;
    }


    function isOverMainDropzone(draggableBox) {
      var innerLeftBoundary = canvasBox.left;
      var innerRightBoundary = canvasBox.right;
      var innerTopBoundary = canvasBox.top;
      var innerBottomBoundary = canvasBox.bottom;

      var withinInnerLeft = draggableBox.left > innerLeftBoundary;
      var withinInnerRight = draggableBox.right < innerRightBoundary;
      var belowInnerTop = draggableBox.top > innerTopBoundary;
      var aboveInnerBottom = draggableBox.bottom < innerBottomBoundary;

      return withinInner = withinInnerLeft && withinInnerRight && belowInnerTop && aboveInnerBottom;
    }

    function isOverlapping(draggableBox) {
      return isOverEntireDropzone(draggableBox) && !isOverMainDropzone(draggableBox);
    }

    document.addEventListener('mousemove', dragMe);
    document.addEventListener('mouseup', dropMe);
  }


  function updateControlPanelWithShapeStyles(shape) {
    // get inputs
    // loop through inputs
    var styleObj = window.getComputedStyle(shape, null);
    // window.getComputedStyle returns weird value for transform
    var transformVal = shape.style.transform,
        styleVal, styleProp, strippedValArr;

    Array.prototype.forEach.call(inputs, function(input) {
      var property = input.dataset.property;

      styleVal = property === "transform" ? transformVal : styleObj[property];
      strippedValArr = util.extractValueForInput(styleVal);

      // if it's 1 value don't update ellipse values
      if ( strippedValArr.length === 1 && input.dataset.ellipse ) {
        input.value = 0;
        // if 2 values don't update non-ellipse
      } else if ( strippedValArr.length === 2 && !input.dataset.ellipse ) {
        input.value = 0;
        // if 2 values and vertical ellipse update with 2nd value
      } else if ( strippedValArr.length === 2 && input.dataset.ellipse === 'vertical' ) {
        input.value = strippedValArr[1];
        // if value is transparent and input is not check update with color black
      } else if ( strippedValArr[0] === 'transparent' && input.getAttribute('type') !== 'checkbox' ) {
        input.value = "#000000";
        // if value is transparent and input is check then check box
      } else if ( strippedValArr[0] === 'transparent' && input.getAttribute('type') === 'checkbox' ) {
        input.value = strippedValArr[0];
        input.checked = true;
        // if input is for border-color but not a checkbox, uncheck the box
      } else if ( property.indexOf('Color') > -1 && input.getAttribute('type') === 'checkbox' && strippedValArr[0] !== 'transparent') {
        input.checked = false;
        // in all other cases, including 2 values and horizontal ellipse, update with 1st value
      } else {
        input.value = strippedValArr[0];
      }

      // ranges
      if ( input.getAttribute('type') === 'range' ) { // need to make this a util
        displayPropertyValue(input);
      }
    });
  }
  
  function giveFocus(element) {
    var elementsWithFocus = document.getElementsByClassName('focus');
    
    Array.prototype.forEach.call(elementsWithFocus, function(element) {
      element.classList.remove('focus');
    });
    
    element.classList.add('focus');
    updateControlPanelWithShapeStyles(element);
  }
  
  function addShape() {
    var div;
    //if staging has no children
    if ( staging.querySelector('div') === null ) {
      div = document.createElement('div');
      div.classList.add('shape');
      staging.appendChild(div);  
      giveFocus(div);
    }
  }
  
  function getBorderRadiusValue(input, value, property) {
    var otherEllipseValue, otherEllipseInputValue, type;
    // using ellipse and value will be different
    if ( 'ellipse' in input.dataset ) {
      type = input.getAttribute('type');
      if ( input.dataset.ellipse === "horizontal" ) {
        otherEllipseValue = 'vertical'; 
        otherEllipseInputValue = document.querySelector('[data-property="' + property + '"][data-ellipse="' + otherEllipseValue + '"][type="' + type + '"]');
        value = value + ' ' + appendUnitToValueIfNeeded(otherEllipseInputValue);
      } else if ( input.dataset.ellipse === "vertical" ) {
        otherEllipseValue = 'horizontal'; 
        otherEllipseInputValue = document.querySelector('[data-property="' + property + '"][data-ellipse="' + otherEllipseValue + '"][type="' + type + '"]');
        value = appendUnitToValueIfNeeded(otherEllipseInputValue) + ' ' + value;
      }
    } 

    return value;
  }

  function displayPropertyValue(input) {
    var value = appendUnitToValueIfNeeded(input);
    var inputClass = input.getAttribute('class');
    var output = document.querySelector('.output.' + inputClass);
    
    output.innerHTML = value;
    // console.log(value);
  }
  
  function processRangeInput(e) {
    var input = e.target;
    var shape = document.querySelector('.focus');
    
    if ( shape ) {
      updateStyle(input, shape);
      displayPropertyValue(input);
    }
  }
  
  function processInputs(e) {
    var input = e.target;
    var shape = document.querySelector('.focus');
    
    if ( shape ) {
      updateStyle(input, shape);
    }
  }

  function processMouseDown(e) {
    var element = e.target;

    if ( element.classList.contains('shape') ) {
      giveFocus(element);
      dragAndDrop(e);
    }
  }
  
  function cloneShape() {
    var shape = document.querySelector('.focus');
    var newShape = shape.cloneNode(false);
    canvas.appendChild(newShape);
    giveFocus(newShape);
  }
  
  function bindEvents() {    
    var duplicateButton = document.getElementById('duplicate');
    addButton.addEventListener('click', addShape);
    
    // give focus
    document.addEventListener('mousedown', processMouseDown);
    // duplicate shape
    duplicateButton.addEventListener('click', cloneShape);

    // add listeners to inputs
    Array.prototype.forEach.call(inputs, function(input) {
      var inputType = input.getAttribute('type');
      if ( inputType === 'range' ) {
        input.addEventListener('input', processRangeInput);
      } else if ( inputType === 'checkbox' ) {
        input.addEventListener('change', processInputs);
      } else {
        input.addEventListener('input', processInputs);
      }
    });
  }
  
  init();
})();

// when shape gets focus or is added it's current style should be reflected in the inputs
// also change for loops in bind to forEach with call to be consistent