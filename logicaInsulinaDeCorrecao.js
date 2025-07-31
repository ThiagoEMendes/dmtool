
function calculaInsulinaDeCorrecao(){
    let doseMaxima = 5
    let glicemiaAlvo = 130
    let fatorCorrecao = 30
    let intervalo = fatorCorrecao

    let glicemiaAtual = 500 // Exemplo de glicemia atual
    let insulinaDeCorrecao = 0 // Inicializa a insulina de correção

    if (glicemiaAtual > (glicemiaAlvo + (fatorCorrecao * doseMaxima))) {
        // Se a glicemia atual for maior que o limite máximo, retorna a dose máxima
        return doseMaxima;
    }

    if (glicemiaAtual <= glicemiaAlvo) {
        return insulinaDeCorrecao
    } else {
        // Se a glicemia atual for maior que a glicemia alvo, calcula a insulina de correção
        for (let insulinaDeCorrecao = 1; insulinaDeCorrecao <= doseMaxima; insulinaDeCorrecao++) {
            if (glicemiaAtual <= (glicemiaAlvo + intervalo)) {
                return insulinaDeCorrecao;
            }
            intervalo += fatorCorrecao;
        }
    }
}

console.log(calculaInsulinaDeCorrecao()); // Exibe a insulina de correção calculada

