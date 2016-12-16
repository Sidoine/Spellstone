var fs = require('fs'),
    xml2js = require('xml2js');
 
var parser = new xml2js.Parser({  explicitArray: false, mergeAttrs: true });
fs.readFile(__dirname + '/../SIMSpellStone/cards/cards.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        fs.writeFile('cards.json', JSON.stringify(result, null, 4), err => {
            console.log('Done');
        });
    });
}); 