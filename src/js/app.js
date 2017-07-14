var UI = require('ui');
var Vector2 = require('vector2');

var limit = 0;
// Vector2(width, height)
var main = new UI.Window({
    backgroundColor: 'white'
});
var historyText = new UI.Text({
    position: new Vector2(-25, 0), 
    size: new Vector2(140, 40),  
    font: 'gothic-24-bold',
    text: 'History',
    textAlign: 'right'
  });
var startText = new UI.Text({
    position: new Vector2(-25, 60), 
    size: new Vector2(140, 40),  
    font: 'gothic-24-bold',
    text: 'Start counting',
    textAlign: 'right'
  });
var limitText = new UI.Text({
    position: new Vector2(-25, 120), 
    size: new Vector2(140, 40),  
    font: 'gothic-24-bold',
    text: 'Set a limit',
    textAlign: 'right'
  });

var historyBttn = new UI.Image({
  position: new Vector2(120, 0),
  size: new Vector2(144, 168),
  image: 'images/buttonMenu.png'
});
var nextBttn = new UI.Image({
  position: new Vector2(120, 60),
  size: new Vector2(144, 168),
  image: 'images/buttonNext.png'
});
var limitBttn = new UI.Image({
  position: new Vector2(120, 120),
  size: new Vector2(144, 168),
  image: 'images/buttonLimit.png'
});

main.add(historyText);
main.add(startText);
main.add(limitText);
main.add(historyBttn);
main.add(nextBttn);
main.add(limitBttn);
main.show();

main.on('click', 'up', function(e) {
  var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Pebble.js',
        icon: 'images/menu_icon.png',
        subtitle: 'Can do Menus'
      }, {
        title: 'Second Item',
        subtitle: 'Subtitle Text'
      }, {
        title: 'Third Item',
      }, {
        title: 'Fourth Item',
      }]
    }]
  });
  menu.on('select', function(e) {
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
  });
  menu.show();
});

main.on('click', 'select', function(e) {
  var wind = new UI.Window({
    backgroundColor: 'black'
  });
  var radial = new UI.Radial({
    size: new Vector2(140, 140),
    angle: 0,
    angle2: 300,
    radius: 20,
    backgroundColor: 'cyan',
    borderColor: 'celeste',
    borderWidth: 1,
  });
  var textfield = new UI.Text({
    size: new Vector2(140, 60),
    font: 'gothic-24-bold',
    text: 'Dynamic\nWindow',
    textAlign: 'center'
  });
  var windSize = wind.size();
  // Center the radial in the window
  var radialPos = radial.position()
      .addSelf(windSize)
      .subSelf(radial.size())
      .multiplyScalar(0.5);
  radial.position(radialPos);
  // Center the textfield in the window
  var textfieldPos = textfield.position()
      .addSelf(windSize)
      .subSelf(textfield.size())
      .multiplyScalar(0.5);
  textfield.position(textfieldPos);
  wind.add(radial);
  wind.add(textfield);
  wind.show();
});

main.on('click', 'down', function(e) {
  var card = new UI.Card();
  card.title('A Card');
  card.subtitle('Is a Window');
  card.body('The simplest window type in Pebble.js.');
  card.show();
});
