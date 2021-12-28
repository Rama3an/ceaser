const fs = require('fs');
const arg = process.argv;

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


        let factfreq = [];
        for (let i in letterArr())
            factfreq[letterArr().indexOf(letterArr()[i])] = 0;

        for (let i = 0; i < codeText.length; ++i)
            if (letterArr().indexOf(codeText[i]) != -1)
                factfreq[letterArr().indexOf(codeText[i])]++;

        for (let i in factfreq)
            factfreq[i] = factfreq[i] / codeText.length;

        let minNum = Number.POSITIVE_INFINITY;
        let shift = 0;
        for (let i = 0; i < letterArr().length; ++i) {
            let sum = 0;
            for (let j in factfreq) {
                sum += Math.abs(canonfreq()[j] - factfreq[(j + i) % letterArr().length])
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
    let alph = fs.readFileSync('alph.txt', 'utf8').split('\n');
    for (let i = 0; i < alph.length; ++i) {
        let letter = alph[i].split(' ')[0];
        let freq = alph[i].split(' ')[1];
        alphfreq[i] = parseFloat(freq);
    }
    return alphfreq;
}



function letterArr() {
    let alph = fs.readFileSync('alph.txt', 'utf8').split('\n');
    let letterArr = [];
    for (let i = 0; i < alph.length; ++i) {
        let letter = alph[i].split(' ')[0];
        letterArr.push(letter);
    }
    letterArr.join('');
    return letterArr;
}

function code(string, key) {
    let codetext = '';
    let index;
    for (let i = 0; i < string.length; ++i) {
        if (letterArr().indexOf(string[i]) != -1) {
            index = (letterArr().indexOf(string[i]) + key) % letterArr().length;
            codetext += (index < 0) ? (letterArr()[letterArr().length + index]) : (letterArr()[index]);
        } else
            codetext += string[i];
    }
    return codetext;
}

function decode(string, key) {
    let text = '';
    let index;
    for (let i = 0; i < string.length; ++i) {
        if ((letterArr().indexOf(string[i]) != -1)) {
            index = (letterArr().indexOf(string[i]) - key) % letterArr().length;
            text += (index < 0) ? (letterArr()[letterArr().length + index]) : (letterArr()[index]);
        } else
            text += string[i];
    }
    return text;
}

