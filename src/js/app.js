var UI = require('ui');
var Vector2 = require('vector2');
// TODO chalk compatibility
// var Feature = require('platform/feature');
var Settings = require('settings');
var time = new Date();

// Defining the two arrays containing our history of counts
var historyDate = [];
var historyCounts = [];

// Getting variables back from memory or creating them
if(Settings.data('historyDate'))
  var historyDate = Settings.data('historyDate');
else
  var historyDate = [];

if(Settings.data('historyCounts'))
  var historyCounts = Settings.data('historyCounts');
else
  var historyCounts = [];

if(Settings.data('count'))
  var count = Settings.data('count');
else
  var count = 0;

if(Settings.data('limit'))
  var limit = Settings.data('limit');
else
  var limit = 0;

var hundred = 0, tens = 0, decs = 0, selected = 1;

// Creating and showing the main window of the watchapp
var main = new UI.Window({backgroundColor: 'black'});

// Textfields
var historyText = new UI.Text({position: new Vector2(-25, 0), size: new Vector2(140, 40), font: 'gothic-24-bold', text: 'History', textAlign: 'right'});
var startText = new UI.Text({position: new Vector2(-25, 60), size: new Vector2(140, 40), font: 'gothic-24-bold', text: 'Start counting', textAlign: 'right'});
var limitText = new UI.Text({position: new Vector2(-25, 120), size: new Vector2(140, 40), font: 'gothic-24-bold', text: 'Set a limit', textAlign: 'right'});

// Icons
var historyBttn = new UI.Image({position: new Vector2(120, 9), size: new Vector2(18, 18), image: 'images/buttonMenu.png'});
var nextBttn = new UI.Image({position: new Vector2(120, 69), size: new Vector2(18, 18), image: 'images/buttonNext.png'});
var limitBttn = new UI.Image({position: new Vector2(120, 129), size: new Vector2(18, 18), image: 'images/buttonLimit.png'});

main.add(historyText);
main.add(startText);
main.add(limitText);
main.add(historyBttn);
main.add(nextBttn);
main.add(limitBttn);
main.show();

// Function called when we want to add or substract to the count 
function actionCount(action, wind, textfield, radial, textfieldPos, radialPos)
{
  // Substract to the count when told to. Forbidding to go under 0. If not substracting, then adding.
  if(action == "substract" && count > 0)
    count--;
  else if (action == "add" && (count < limit && limit > 0))
    count++;
  else if(action == "add" && limit == 0)
    count++;

  // If there's no limit (limit = 0) or if there is a limit, show the count without or with the limit
  if(limit == 0)
  {
    console.log('test');
    textfield.text(count);
  }
  else if(limit > 0)
  {
    //show count and limit
    textfield.text(count + "\n/" + limit);
    //update radial
    var angle = (count/limit) * 360;
    radial.angle2(angle);
  }
  // Save Count to the memory of the watch (resetted when watch is turned off)
  Settings.data('count', count);
}

// Function called when we want to fill the form for the limit of counts. We only want 0-9 in each number input so we're exluding -1 and 10
function actionForm(action, number, ui)
{
  // For the hundreds
  if(number == "hundred")
  {
    if(action == "add")
      hundred++;
    else if(action == "substract")
      hundred--;

    if(hundred == 10)
      hundred = 0;

    if(hundred == -1)
      hundred = 9;  
    
    ui.text(hundred);
  }
  
  // For the tens
  if(number == "tens")
  {
    if(action == "add")
      tens++;
    else if(action == "substract")
      tens--;
    
    if(tens == 10)
      tens = 0;
    
    if(tens == -1)
      tens = 9;    

    ui.text(tens);
  }
  
  // For the decs
  if(number == "decs")
  {
    if(action == "add")
      decs++;
    else if(action == "substract")
      decs--;
    
    if(decs == 10)
      decs = 0;
    
    if(decs == -1)
      decs = 9;
    
    ui.text(decs);
  }
}

// On clicking the up button from main screen
main.on('click', 'up', function(e) {
  var menu = new UI.Menu({sections: [{}]});
  var itemIndex = 0;
  
  if(historyCounts && historyDate)
  {
    // Adding an entry for the menu for each entry in historyCounts array
    historyCounts.forEach(function(e) {
      menu.item(0, itemIndex, {title: historyDate[itemIndex], subtitle: 'Counted: ' + e});
      itemIndex++;
    });
  }

  menu.on('longSelect', function(e) {
    console.log('test');
    // Remove entry from arrays and from watch storage 
    historyDate.splice(e.itemIndex, 1);
    historyCounts.splice(e.itemIndex, 1);
    Settings.data('historyDate', historyDate);
    Settings.data('historyCounts', historyCounts);

    // Show a confirmation window for item deletion
    var windConfirm = new UI.Window({backgroundColor: 'black'});
    var textConfirm = new UI.Text({size: new Vector2(140, 40), font: 'bitham-30-black', text: 'Deleted', textAlign: 'center'});
    var windSize = menu.size(), textConfirmPos = textConfirm.position().addSelf(windSize).subSelf(textConfirm.size()).multiplyScalar(0.5);
    textConfirm.position(textConfirmPos);
    windConfirm.add(textConfirm);
    windConfirm.show();
    menu.hide();
    
    // Resetting the whole section of items in the menu
    var section = {items: [{}]};
    menu.section(0, section);

    // Recreating every item, so that their item index matches their index in the array
    var itemIndex = 0;
    if(historyCounts && historyDate)
    {
      // Adding an entry for the menu for each entry in historyCounts array
      historyCounts.forEach(function(el) {
        menu.item(0, itemIndex, {title: historyDate[itemIndex], subtitle: 'Counted: ' + el});
        itemIndex++;
      });
    }

    // Go back to menu after a second
    setTimeout(function(){
      windConfirm.hide();
      menu.show();
    }, 1000);
    
  });
  menu.show();
});

// On clicking the select button from main screen
main.on('click', 'select', function(e) {
  var wind = new UI.Window({backgroundColor: 'black'});
  var textfield = new UI.Text();
  var radial = new UI.Radial();
    
  // if there's no limit create bigger textfield and full gray circle
  if(limit == 0)
  {
    textfield = new UI.Text({size: new Vector2(140, 40), font: 'bitham-30-black', text: count, textAlign: 'center'});
    radial = new UI.Radial({size: new Vector2(140, 140), angle: 0, angle2: 360, radius: 20, backgroundColor: 'light-gray',});
  }
  // if there is a limit, create a smaller textfield and show radial with correct angle
  else if(limit > 0)
  {
    textfield = new UI.Text({size: new Vector2(140, 60), font: 'gothic-24-bold', text: count + "\n/" + limit, textAlign: 'center'});
    
    var angle = 1;
    
    // if we already started counting, show the correct radial
    if(count > 0)
      angle = count/limit * 360;
    radial = new UI.Radial({size: new Vector2(140, 140), angle: 0, angle2: angle, radius: 20, backgroundColor: 'cyan', borderColor: 'celeste', borderWidth: 1});
}
  
  var windSize = wind.size();
  
  // Center the radial in the window (default code)
  var radialPos = radial.position().addSelf(windSize).subSelf(radial.size()).multiplyScalar(0.5);
  radial.position(radialPos);
  
  // Center the textfield in the window (default code)
  var textfieldPos = textfield.position().addSelf(windSize).subSelf(textfield.size()).multiplyScalar(0.5);
  textfield.position(textfieldPos);
  
  wind.add(radial);
  wind.add(textfield);
  wind.show();
  
  // add to count using actionCount function
  wind.on('click', 'up', function(e) {
    actionCount("add", wind, textfield, radial, textfieldPos, radialPos);
  });
  
  // substract to count using actionCount function
  wind.on('click', 'down', function(e) {
    actionCount("substract", wind, textfield, radial, textfieldPos, radialPos);
  });

  // add to count using actionCount function
  wind.on('longClick', 'up', function(e) {
    actionCount("add", wind, textfield, radial, textfieldPos, radialPos);
  });
  
  // set back to zero with a long push on the down button
  wind.on('longClick', 'down', function(e) {
    count = 0;
    if(limit == 0)
      textfield.text(count);
    else if(limit > 0)
    {
      textfield.text(count + "\n/" + limit);
      radial.angle2(1);
    }
  });
  
  // add to history with long push on select button
  wind.on('longClick', 'select', function(e) {
    var Hour = time.getHours(); if(Hour <10) Hour = "0" + Hour;
    var Minute = time.getMinutes(); if(Minute <10) Minute = "0" + Minute;
    var HourMinute = Hour + ':' + Minute;
    var Month = time.getMonth() + 1;
    if(Month < 10)
      Month = "0" + Month;
    var Date = time.getDate() + '/' + Month + '/' + time.getFullYear().toString().substr(-2);
    
    // add Hour and Date to position 0 in historyDate array
    historyDate.splice(0, 0, HourMinute + ' ' + Date);
    
    // adding count to poistion 0 in historyCounts with or without limit
    if(limit == 0)
      historyCounts.splice(0, 0, count);
    else if(limit > 0)
      historyCounts.splice(0, 0, count + '/' + limit);
    
    // add to watch memory
    Settings.data('historyDate', historyDate);
    Settings.data('historyCounts', historyCounts);
    
    // show confirmation text that disapears after a second
    var beforeText = textfield.text();
    textfield.text('Saved!');
    setTimeout(function(){
      textfield.text(beforeText);
    }, 1000);
    
  });
  
});

// On clicking the down button from main screen
main.on('click', 'down', function(e) {
  var windForm = new UI.Window({backgroundColor: 'dark-gray'});
 
  // whenever we arrive on this window, the selected input should be the first
  selected = 1;
  
  // textfields
  var title = new UI.Text({position: new Vector2(0, 10), size: new Vector2(144, 80), font: 'gothic-24-bold', text: 'Set a limit', textAlign: 'center'});
  var bottomTextfield = new UI.Text({position: new Vector2(0, 120), size: new Vector2(144, 70), font: 'gothic-18-bold', text: 'Set it to 0 to\ndelete limit.', textAlign: 'center'});
  
  // create a text area for each of the number input, selected one in light-gray
  var nbrHdrd = new UI.Text({backgroundColor: 'light-gray', position: new Vector2(10, 60), size: new Vector2(38, 40), font: 'bitham-30-black', text: hundred, textAlign: "center"});
  var nbrTens = new UI.Text({backgroundColor: 'black', position: new Vector2(52, 60), size: new Vector2(38, 40), font: 'bitham-30-black', text: tens, textAlign: "center"});
  var nbrDecs = new UI.Text({backgroundColor: 'black', position: new Vector2(94, 60), size: new Vector2(38, 40), font: 'bitham-30-black', text: decs, textAlign: "center"});

  windForm.add(title);
  windForm.add(bottomTextfield);

  windForm.add(nbrHdrd);
  windForm.add(nbrTens);
  windForm.add(nbrDecs);
  
  windForm.show();
  
  // change selected number on clicking select, selected == 2 -> tens, selected == 3 -> decs, selected == 4 -> set limit and exit
  windForm.on('click', 'select', function(e){
    selected++;
    if(selected == 2)
    {
      nbrHdrd.backgroundColor('black');
      nbrTens.backgroundColor('light-gray');
    }
    else if(selected == 3)
    {
      nbrTens.backgroundColor('black');
      nbrDecs.backgroundColor('light-gray');
    }
    else if(selected == 4)
    {
      // adding each of the inputs to make up the limit
      limit = hundred * 100 + tens * 10 + decs;
      selected = 1;
      // add limit to watch memory 
      Settings.data('limit', limit);
      // exit
      windForm.hide();
      main.show();
    }
  });
  
  // add to each number input with actionForm function
  windForm.on('click', 'up', function(e){
    if(selected == 1)
      actionForm("add", "hundred", nbrHdrd);
    else if(selected == 2)
      actionForm("add", "tens", nbrTens);
    else if(selected == 3)
      actionForm("add", "decs", nbrDecs);
  });
  
  // substract to each number input with actionForm function
  windForm.on('click', 'down', function(e){
    if(selected == 1)
      actionForm("substract", "hundred", nbrHdrd);
    else if(selected == 2)
      actionForm("substract", "tens", nbrTens);
    else if(selected == 3)
      actionForm("substract", "decs", nbrDecs);
  });
  
});
