
function calc(exp) {
    if (typeof +exp == "number" && +exp == +exp) return +exp;
    let res = 0;
    for (let i = 0; i < exp.length; i++) {
        if (exp[i] == "-" && i == 0) continue;
        if (exp[i] == "-" || exp[i] == "+" || exp[i] == "*" || exp[i] == "/") {
            let operator = exp[i];
            let operatorPos = i;
            let firstOperand = parseFloat(exp.substring(0, operatorPos));
            let secondOperand = parseFloat(exp.substring(operatorPos + 1));
            if (operator == "/" && secondOperand == 0) {
                throw new Error("TypeError: Devision by zero.");
            }
            switch (operator) {
                case "/":
                    res = firstOperand / secondOperand;
                    break;
                case "*":
                    res = firstOperand * secondOperand;
                    break;
                case "-":
                    res = firstOperand - secondOperand;
                    break;
                case "+":
                    res = firstOperand + secondOperand;
                    break;
            }
            return res;
        }
    }
}
function checkBrackets(str, settings){
    let arrSequence = [];
    let objBreck = {};
//   создание объекта с ключом откр скобка значение закр скобка на основе
// settings
    settings.forEach(function (item) {
        objBreck[item[0]] = item[1];
    })
//   -------------------------------------------------------------------------
    let arrOpenBreck = Object.keys(objBreck);
    let arrCloseBreck = Object.values(objBreck);
//   анализ строки
    for (var i = 0; i < str.length; i++) {
        let sym = str[i];
        // отсекаем перебор символов которые не скобочки
        if (arrOpenBreck.indexOf(sym) == -1 && arrCloseBreck.indexOf(sym) == -1) continue;
        //___________________________________________________________________
        // проверяем что данный символ не стоит на первом месте в
        // последовательности, а
        // также  наша форовская i это открытая скобка - добавляем
        //  ее !!!!!!!!!!!!!негатив!!!!!!!!!!!!!! в
        // начало последовательности
        if (arrSequence[0] !== sym && arrOpenBreck.indexOf(sym) !== -1) {
            arrSequence.unshift(objBreck[sym]);
            continue;
        }
        // ранее мы добавили негатив открывающейся скобочки, а тут если
        // форовская ишка равна закрывающейся скобочки(негативу), то нужно
        // ее из последовательности убрать!
        if (arrSequence[0] == sym) {
            arrSequence.shift();
            continue;
        }
        //добавь символ в последовательность
        arrSequence.unshift(sym)
    }
    if (arrSequence.length > 0)throw new Error("ExpressionError: Brackets must be paired");
    return true;
}
function buildRPN(str) {
    let precedence = {
        "-": 0,
        "+": 0,
        "/": 1,
        "*": 1
    };
    let toks = lex(str);
    let outputQueue = [];
    let operatorStack = [];
    for (let i = 0; i < toks.length; i++) {
        if (toks[i][0] == "number") {
            outputQueue.push(toks[i][1]);
        }

        if (toks[i][0] == "operator") {
            while (
            precedence[operatorStack[operatorStack.length - 1]] >=
            precedence[toks[i][1]] &&
            operatorStack[operatorStack.length - 1] !== "("
                ) {
                outputQueue.push(operatorStack.pop());
            }
            operatorStack.push(toks[i][1]);
        }

        if (toks[i][1] == "(") {
            operatorStack.push(toks[i][1]);
        }
        if (toks[i][1] == ")") {
            while (operatorStack[operatorStack.length - 1] !== "(") {
                outputQueue.push(operatorStack.pop());
            }
            if (operatorStack[operatorStack.length - 1] == "(") {
                operatorStack.pop();
            }
        }
    }
    if (operatorStack.length !== 0) {
        outputQueue = outputQueue.concat(operatorStack.reverse());
    }
    return outputQueue;
}
function lex(str) {
    const OPS = ["(", ")", "+", "-", "*", "/"];
    const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    let strLength = str.length;
    let tokens = [];

    let bufferDigits = [];

    for (let iSymbol = 0; iSymbol < strLength; iSymbol++) {








        if (OPS.indexOf(str[iSymbol]) !== -1) {


            if (bufferDigits.length !== 0) {
                tokens.push(["number", bufferDigits.join("")]);
                bufferDigits = [];
            }
            if(str[iSymbol] == ")" || str[iSymbol] == "("){
                tokens.push(["brackets", str[iSymbol]]);
                continue;
            }
            tokens.push(["operator", str[iSymbol]]);



            continue;
        }
        if (DIGITS.indexOf(str[iSymbol]) !== -1) {
            bufferDigits.push(str[iSymbol]);
        }








    }

    if (bufferDigits.length !== 0) {
        tokens.push(["number", bufferDigits.join("")]);
    }

    return tokens;
}
function executor(arrSym){
    const OPS = [ "+", "-", "*", "/"];
    for(var i = 0; i < arrSym.length; i++){
        if(OPS.indexOf(arrSym[i]) !== -1){
            let indexOperator  = i;
            let operandFirst = arrSym[i-2];
            let operandSecond = arrSym[i-1];

            let partRes = calc("" + operandFirst + arrSym[i] + operandSecond);

            arrSym.splice(indexOperator-2,3, partRes);
            i = 0
        }
    }
    return arrSym

}
function calcExp(exp){
    checkBrackets(exp, [['(', ')']]);
    exp =buildRPN(exp);
    exp = executor(exp);
    return +exp.join("")
}
module.exports = {
    expressionCalculator:calcExp
}



