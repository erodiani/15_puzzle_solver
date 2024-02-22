
//import './PriorityQueue';

//INFO POSIZIONE HTML per cella | cella => info
var celle = new Map();

//PERMUTAZIONE lineare tasselli
var gen = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];


//contiene

/*frontiera può essere una mappa ordinata secondo la f dello stato*/
//var frontiera = [];

//stato => info sullo stato
//var frontiera = new Map();

var frontiera = new PriorityQueue((a, b) => a.f < b.f);
//var frontiera = [];



//la EXL è un SET poichè contiene univocamente lo stato per cui è già stata fatta l'espansione
var EXL = new Set();



/*----------------------------------------------------------------------
GENERAZIONE CELLE
-----------------------------------------------------------------------*/
function generaCelleDinamiche(){
    //preleva dimensioni di una cella statica vuota
    //usale per generare quelle nuove

    for(var i = 1; i < 16; i++){
        //creazione del div
        var newDiv = document.createElement("div");
        var num = document.createTextNode(i);
        newDiv.setAttribute("class", "cella_dinamica");
        newDiv.setAttribute("id", i);
        newDiv.appendChild(num);

        var cella_statica = document.getElementById("stat" + i);

        var info_CeSt = cella_statica.getBoundingClientRect();

        //inserisce le info della posizione della cella i
        celle.set(i, info_CeSt);

        newDiv.style.width = info_CeSt.width;
        newDiv.style.height = info_CeSt.height;
        newDiv.style.right = info_CeSt.right;
        newDiv.style.left = info_CeSt.left;
        newDiv.style.top = info_CeSt.top;
        newDiv.style.bottom = info_CeSt.bottom;

        //inserimento nel body
        document.body.appendChild(newDiv);
    }


    var cella_statica = document.getElementById("stat16");
    var info_CeSt = cella_statica.getBoundingClientRect();

    //inserisce le info della posizione della cella i
    celle.set(16, info_CeSt);
}

/*
function sleep(milliseconds){
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
*/

/*----------------------------------------------------------------------
TOOLS PER SPOSTAMENTO E DISTANZE
-----------------------------------------------------------------------*/

//MUOVE il tassello id:A in posizione BLANK
function moveTasselloA_toBlank(A){
    var cella = document.getElementById(A);

    var info = celle.get(findTassello(16) + 1);

    var lx = info.left;
    var rx = info.right;
    var tp = info.top;
    var bot = info.bottom;
    var wid = info.width;
    var hei = info.height;

    cella.style.left = lx;
    cella.style.right = rx;
    cella.style.top = tp;
    cella.style.bottom = bot;
    cella.style.width = wid;
    cella.style.height = hei;

    swap(A, 16);
}

//MUOVE il tassello id:X in cella Y
function moveTasselloX_toPosY(x, y){
    
    //tassello da spostare
    var cella = document.getElementById(x);
    var x_info = cella.getBoundingClientRect();

    //ottenimento info della posizione HTML
    var y_info = celle.get(y);
    var y_lx = y_info.left;
    var y_rx = y_info.right;
    var y_tp = y_info.top;
    var y_bot = y_info.bottom;
    var y_wid = y_info.width;
    var y_hei = y_info.height;

    //assegnazione nuova posizione al tassello da muovere
    cella.style.left = y_lx;
    cella.style.right = y_rx;
    cella.style.top = y_tp;
    cella.style.bottom = y_bot;
    cella.style.width = y_wid;
    cella.style.height = y_hei;
}

//MUOVE il tassello con coordinate X, Y in posizione Z, W
function coord_moveTasselloXY_toPosZW(x, y, z, w){

    var linear_a = coordinatesTolinear(x, y);
    var linear_b = coordinatesTolinear(z ,w);

    //tassello da spostare
    var cella = document.getElementById(linear_a);
    var x_info = cella.getBoundingClientRect();

    //ottenimento info della posizione HTML
    var y_info = celle.get(linear_b);
    var y_lx = y_info.left;
    var y_rx = y_info.right;
    var y_tp = y_info.top;
    var y_bot = y_info.bottom;
    var y_wid = y_info.width;
    var y_hei = y_info.height;

    //assegnazione nuova posizione al tassello da muovere
    cella.style.left = y_lx;
    cella.style.right = y_rx;
    cella.style.top = y_tp;
    cella.style.bottom = y_bot;
    cella.style.width = y_wid;
    cella.style.height = y_hei;
}

//SCAMBIA tassello id:A con tassello id:B
function swap(A, B){
    var posA = findTassello(A);
    var posB = findTassello(B);
    var app = gen[posA];
    gen[posA] = gen[posB];
    gen[posB] = app;
}

//SCAMBIA tassello id:A con tassello id:B nel vettore X
function swapInX(A, B, X){
    var posA = findTasselloInStateY(A, X);
    var posB = findTasselloInStateY(B, X);
    var app = X[posA];
    X[posA] = X[posB];
    X[posB] = app;
}

//MISURA la distanza di manhattan da posizione lineare A a posizione lineare B
function manhattanFromAtoB(a, b){
    var coordA = linearToCoordinates(a);
    var coordB = linearToCoordinates(b);

    return Math.abs(coordA[0] - coordB[0]) + Math.abs(coordA[1] - coordB[1]);
}

//TROVA tassello id:X nel vettore posizionale
function findTassello(X){
    for(var i = 0; i < gen.length; i++){
        if(gen[i] == X){
            return i;
        }
    }
    return -1;
}

//TROVA IL tassello con ID:X nello stato Y definito da un vettore tipo gen
function findTasselloInStateY(X, stateY){
    for(var i = 0; i < gen.length; i++){
        if(stateY[i] == X){
            return i;
        }
    }
    return -1;
}

//CONVERTE lineare a coordinate
function linearToCoordinates(i){
    return [Math.floor((i-1)/4), (i-1)%4];
}


//CONVERTE coordinate a lineare
function coordinatesTolinear(x, y){
    return (x*4 + y)+1;
}


/*----------------------------------------------------------------------
ALGORITMO DI SHUFFLE DELLE CELLE
-----------------------------------------------------------------------*/

function shuffle(){
    var i;
    //genera numero di scambi da fare (garanzia di parità)
    do{
        i = Math.floor(Math.random() * 10 + 10);
    }while(i%2 != 0);


    i = parseInt(document.getElementById("shuffleN").value);

    for(var j = 0; j < i; j++){
        var x = Math.floor(Math.random() * 15);
        var y;
        do{
            y = Math.floor(Math.random() * 15);
        }while(y == x);
        
        var app = gen[x];
        gen[x] = gen[y];
        gen[y] = app;

    }

    for(var i = 0; i < gen.length; i++){
        if(gen[i] != 16){
            moveTasselloX_toPosY(gen[i], i+1);
        }
    }

    if(frontiera.size() != 0){
        //frontiera = new Set();
        frontiera = [];
    }

    var euristica = h(gen);
    frontiera.push({"stato" : gen, "c" : 0, "h" : euristica, "f" : euristica, "father" : undefined});
    //frontiera.add({"stato" : gen, "c" : 0, "h" : euristica, "f" : euristica});
    //frontiera.set(gen, {"c" : 0, "h" : euristica, "f" : euristica, "father" : undefined});
}

/*
async function forTestPurpose(){
    moveTasselloA_toBlank(12);
    await sleep(200);
    moveTasselloA_toBlank(11);
    await sleep(200);
    moveTasselloA_toBlank(15);
    await sleep(200);
    var euristica = h(gen);
    frontiera.push({"stato" : gen, "c" : 0, "h" : euristica, "f" : f, "father" : undefined});
    //frontiera.add({"stato" : gen, "c" : 0, "h" : euristica, "f" : euristica});
    //frontiera.set(gen, {"c" : 0, "h" : euristica, "f" : euristica, "father" : undefined});

}
*/

/*-------------------------------------------------------------------
ALGORITMO DI SEARCH
--------------------------------------------------------------------*/

/*  
    euristica usata per questo algoritmo considera il minor numero di passi per spostare A 
    nella sua posizione reale senza altri tasselli nel mezzo
    verrà quindi mossa la cella più vicina alla sua posizione che può essere spostata

-   euristica di 15 Puzzle per lo stato X
    stato X su cui dover calcolare l'euristica */
function h(X){
    //somma delle distanze di manhattan di tutti i tasselli
    var sommaEuristica = 0;
    for(var i = 0; i < 16; i++){
        sommaEuristica += manhattanFromAtoB(i+1, X[i]);
    }
    return 1*sommaEuristica;
}

/*  funzione di espansione dello stato X

-   restituisce in OUTPUT il vettore di nuovi stati dopo le possibili espansioni dello stato X 

*/ 
function expandState(X){
    var newStates = [];

    var coordBlank = linearToCoordinates(findTasselloInStateY(16, X)+1);

    var index = 0;

    if(coordBlank[0]+1 < 4){
        //DOWN
        var tassello = X[coordinatesTolinear(coordBlank[0]+1, coordBlank[1])-1];
        newStates[index] = X.slice();
        swapInX(tassello, 16, newStates[index++]);
    }
    if(coordBlank[0]-1 >= 0){
        //UP
        var tassello = X[coordinatesTolinear(coordBlank[0]-1, coordBlank[1])-1];
        newStates[index] = X.slice();
        swapInX(tassello, 16, newStates[index++]);
    }
    if(coordBlank[1]-1 >= 0 ){
        //SX
        var tassello = X[coordinatesTolinear(coordBlank[0], coordBlank[1]-1)-1];
        newStates[index] = X.slice();
        swapInX(tassello, 16, newStates[index++]);
    }
    if(coordBlank[1]+1 < 4){
        //RX
        var tassello = X[coordinatesTolinear(coordBlank[0], coordBlank[1]+1)-1];
        newStates[index] = X.slice();
        swapInX(tassello, 16, newStates[index++]);
    }
    return newStates;
}

/*
RITORNA TRUE se lo stato X è uno stato di GOAL
*/
const goalCheckArr = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
function goalCheck(X){
    return JSON.stringify(X) === JSON.stringify(goalCheckArr);
}

/*
    struttura FRONTIERA: nella quale salvare i nodi da esplorare con il relativo costo + euristica
    viene considerato come costo per ogni slide 1 + quello euristico che corrisponde al numero di slide minimo se non ci fossero altri tasselli
    nel mezzo per raggiungere la posizione desiderata
*/


var timeTracker = [];

//async functon risolvi()
function risolvi(){
    //await sleep(0.01);
    //const start = Date.now();
    //var notifica = document.getElementById("notifica").innerHTML = "Risolvendo...";
    //await sleep(0.01);
    var count = 0;
    var stato = frontiera.pop();
    var numStati = 1;
    var countTest = 0;
    EXL.add((stato.stato).toString());

    while(!goalCheck(stato.stato)){
        count++;
        /*if(count%50000 == 0){
            await(sleep(0.01));
            document.getElementById("metriche").innerHTML = "funzione -> " + stato.f + "<br>euristica -> " + stato.h + "<br>stati in frontiera -> " + frontiera.size() + "<br>stati in EXL -> " + EXL.size + "<br>iterazione -> " + count;
        }*/

        var costo = stato.c;
        costo += 1;
        var newStates = expandState(stato.stato);
        
        for(var i = 0; i < newStates.length; i++){
            var heuristic = h(newStates[i]);
            var f = heuristic + costo;
            var father = stato;

            //SE la frontiera contiene già questo stato allora cambialo solo se la f di quello nuovo è migliore

            //ORA invece inserisce a prescindere tutto senza badare a niente

            //si aggiunge solo se lo stato non è nella EXL
            if(!EXL.has((newStates[i]).toString())){
                numStati += 1;  
                var father = stato;
                frontiera.push({"stato" : newStates[i], "c" : costo, "h" : heuristic, "f" : f, "father" : father});
            }  
           

        }

        var test = 0;
        
        do{
            test++;
            stato = frontiera.pop();
        }while(EXL.has((stato.stato).toString()));
        if(test > 1){
            countTest += test;
        }
        EXL.add((stato.stato).toString());
        

    }
    //var notifica = document.getElementById("notifica").innerHTML = "Risolto";
    //await sleep(0.01);
    //await costruisciAnimazione(stato);


    const end = Date.now();
    alert("FINITO! con costo -> " + stato.c + "\nnumero di iterazioni -> " + count + "\nnumero di stati -> " + numStati + "Numero di volte in cui sono stati trovati stati già nella EXL -> " + countTest);
}



//funzione per la generazione dell'animazione recuperando il percorso
async function costruisciAnimazione(X){

    statiSuccessione = [];
    statiSuccessione.push(X.stato);
    while(X.father != undefined){
        X = X.father;
        statiSuccessione.push(X.stato);
    }

    for(var i = statiSuccessione.length - 1; i >= 0; i--){
        gen = statiSuccessione[i];
        await draw();
    }

    //alert(statiSuccessione);
}

//funzione per disegnare lo stato ed effettuare la transizione nel caso
/*
async function draw(){
    //preleva dimensioni di una cella statica vuota
    //usale per generare quelle nuove

    for(var i = 1; i < 16; i++){

        //seleziona il tassello per id
        var tassello = document.getElementById(i);

        //prende le info della posizione relativa
        var info_CeSt = celle.get(findTassello(i)+1);

        tassello.style.width = info_CeSt.width;
        tassello.style.height = info_CeSt.height;
        tassello.style.right = info_CeSt.right;
        tassello.style.left = info_CeSt.left;
        tassello.style.top = info_CeSt.top;
        tassello.style.bottom = info_CeSt.bottom;
    }
    await sleep(200);
}
*/

///DON'T LOOK///
function moveAnimationFromStateToState(X, Y){
    var tassello;
    for(var i = 0; i < 16; i++){
        //cerca il tassello in X
        var pos = findTasselloInStateY(i+1, X);
        var altroTas = Y[pos];
        if(altroTas != i+1){
            //se sono diversi allora vanno switchati
            if(altroTas == 16){
                moveTasselloA_toBlank(i+1);
            } else if(i+1 == 16){
                moveTasselloA_toBlank(altroTas);
            } else {
                moveTasselloX_toPosY(altroTas, i+1);
                moveTasselloX_toPosY(i+1, altroTas);
            }
        }

    }
}



function CambiaSeq(){
    sequenza = document.getElementById("sequence").value;
    var permutazione = [];
    var numeri = sequenza.split(",");
    for(var i = 0; i < numeri.length; i++){
        permutazione.push(parseInt(numeri[i]));
    }

    for(var i = 0; i < permutazione.length; i++){
        if(permutazione[i] != 16){
            moveTasselloX_toPosY(permutazione[i], i+1);
        }
    }

    frontiera = new PriorityQueue((a, b) => a.f < b.f);
    var euristica = h(permutazione);
    frontiera.push({"stato" : permutazione, "c" : 0, "h" : euristica, "f" : euristica, "father" : undefined});
}


