const fs = require('fs');
const arg = process.argv;

let englishAlph = [];
let alph = fs.readFileSync('alph.txt', 'utf-8').split('\n');
for (let i = 0; i < 26; ++i)
    englishAlph[i] = alph[i].split(' ')[0];

englishAlph = englishAlph.join('');


fs.readFile(arg[2], (err, data1) => {
    if (err) {
        console.error(err)
        return;
    }
    fs.readFile(arg[3], (err, data2) => {
        if (err) {
            console.error(err)
            return;
        }

        let input = data1.toString();
        let key = parseInt(data2.toString());
        let codeText = code(input, key);
        let decodeText = decode(codeText, key);

        fs.writeFile('codeText.txt', codeText, (err) => {
            if (err) {
                console.error(err)
                return;
            }
        });
        fs.writeFile('decodeText.txt', decodeText, (err) => {
            if (err) {
                console.error(err)
                return;
            }
        });


        let factfreq = new Array();
        for (let i in englishAlph)
            factfreq[englishAlph.indexOf(englishAlph[i])] = 0;

        for (let i = 0; i < codeText.length; ++i)
            if (englishAlph.indexOf(codeText[i]) != -1)
                factfreq[englishAlph.indexOf(codeText[i])]++;



        for (let i in factfreq)
            factfreq[i] /= codeText.length;


        let cf = canonfreq();
        let minNum = Number.POSITIVE_INFINITY;
        let shift = 0;
        for (let i = 0; i < 26; ++i) {
            let sum = 0;
            for (let j in factfreq) {
                sum += Math.abs(cf[j] - factfreq[(j + i) % 26]);
            }
            if (sum < minNum) {
                minNum = sum;
                shift = i;
            }
        }
        let output = decode(codeText, shift);

        fs.writeFile('output.txt', output, (err) => {
            if (err) {
                console.error(err)
                return;
            }
        });


    });
});



function canonfreq() {
    let alphfreq = [];
    let alph = fs.readFileSync('alph.txt', 'utf-8').split('\n');
    for (let i = 0; i < 26; ++i)
        alphfreq[englishAlph.indexOf(alph[i].substring(0, 1))] = parseFloat((alph[i].substring(3)));
    return alphfreq;
}

function code(string, key) {
    let codetext = '';
    let index;
    for (let i = 0; i < string.length; ++i) {
        if (string[i] in otherSymbols){
            codetext += string[i];
            continue;
        }
        if (string[i] == string[i].toLowerCase()) {
            index = (englishAlph.indexOf(string[i]) + key) % 26;
            codetext += (index < 0) ? (englishAlph[26 + index]) : (englishAlph[index]);
        } else if (string[i] == string[i].toUpperCase()) {
            index = (englishAlph.toUpperCase().indexOf(string[i]) + key) % 26;
            codetext += (index < 0) ? (englishAlph.toUpperCase()[26 + index]) : (englishAlph.toUpperCase()[index]);
        }
    }
    return codetext;
}

function decode(string, key) {
    let text = '';
    let index;
    for (let i = 0; i < string.length; ++i) {
        if (string[i] in otherSymbols) {
            text += string[i];
            continue;
        }
        if (string[i] == string[i].toLowerCase()) {
            index = (englishAlph.indexOf(string[i]) - key) % 26;
            text += (index < 0) ? (englishAlph[26 + index]) : (englishAlph[index]);
        } else if (string[i] == string[i].toUpperCase()) {
            index = (englishAlph.toUpperCase().indexOf(string[i]) - key) % 26;
            text += (index < 0) ? (englishAlph.toUpperCase()[26 + index]) : (englishAlph.toUpperCase()[index]);
        }
    }
    return text;
}

let otherSymbols = {
    ' ': 0,
    ',': 0,
    ';': 0,
    '!': 0,
    '\n': 0,
    '\r': 0,
    '?': 0,
    '.': 0,
    '>': 0,
    '<': 0,
    '«': 0,
    '»': 0,
    ':': 0,
    '-': 0,
    '…': 0,
    '—': 0,
    "'": 0,
    '"': 0,
    '1': 0,
    '2': 0,
    '3': 0,
    '4': 0,
    '5': 0,
    '6': 0,
    '7': 0,
    '8': 0,
    '9': 0,
}