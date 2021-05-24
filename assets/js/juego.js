const miModulo = (() => {
    'use strict';


    // Declaraciones:

    let deck         = [];
    const tipos      = ['C', 'D', 'H', 'S'],
          especiales = ['A', 'J', 'Q', 'K'];

    /* let puntosJugador = 0,
        puntosCompu = 0; */
    let puntosJugadores = [];

    // Referencias del HTML:

    const btnPedir = document.querySelector('#btnPedir'),
          btnPlantar = document.querySelector('#btnPlantar'),
          btnNuevo = document.querySelector('#btnNuevo');


    const puntosHTML = document.querySelectorAll('small'),
          divCartasJugadores = document.querySelectorAll('.divCartas');
   
    // Esta función inicializa el juego

    const inicializarJuego = ( numJugadores = 2 ) => {

        deck = crearDeck();
        puntosJugadores = [];

        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }

        puntosHTML.forEach( elem => elem.innerText = 0 );
        divCartasJugadores.forEach( elem => elem.innerHTML = '' );

        btnPedir.disabled = false;
        btnPlantar.disabled = false;

    }

    // Esta funcion crea un nuevo deck:

    const crearDeck = () => {

        deck = [];
        for ( let i = 2; i <= 10; i++ ) {
            for ( let tipo of tipos ) {
                deck.push(i + tipo);
            }
        }
        for ( let tipo of tipos ) {
            for ( let esp of especiales ) {
                deck.push( esp + tipo );
            }
        }
        return _.shuffle( deck ); /* creado con la librería de UNDERSCORE */
         
    }


    // Esta función me permite pedir una carta:

    const pedirCarta = () => {
        if (deck.length === 0) {
            throw 'Ya no hay cartas en el deck';
        }
        return deck.pop();
    }

    // Esta función me permite conocer el valor de la carta:

    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length - 1);

        return (isNaN(valor)) ?
            (valor === 'A') ? 11 : 10
            : valor * 1;

    }

    // Turno: 0 = primer jugador, y el último es computadora

    const acumularPuntos = ( carta, turno ) => {
        puntosJugadores[ turno ] = puntosJugadores[ turno ] + valorCarta( carta );
        puntosHTML[ turno ].innerText = puntosJugadores[ turno ];
        return puntosJugadores[ turno ];
    }

    const crearCarta = ( carta, turno ) => {

        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.classList.add('carta');
        divCartasJugadores[turno].append(imgCarta);
    }

    const determinarGanador = () => {

        const [ puntosMinimos, puntosCompu ] = puntosJugadores;

        setTimeout(() => {
            if (puntosCompu === puntosMinimos) {
                alert('Nadie Gana :(');
            } else if (puntosMinimos > 21) {
                alert('Computadora Gana');
            } else if (puntosCompu > 21) {
                alert('Ganaste!!');
            } else {
                alert('Computadora Gana')
            }
        }, 100);

    }

    // Turno de la compu:

    const turnoCompu = (puntosMinimos) => {

        let puntosCompu = 0;

        do {
            const carta = pedirCarta();
            puntosCompu = acumularPuntos(carta, puntosJugadores.length - 1);            
            crearCarta(carta, puntosJugadores.length - 1);

            /* if (puntosMinimos > 21) {
                break;
            } */

        } while ((puntosCompu < puntosMinimos) && (puntosMinimos <= 21));

        determinarGanador();

    }

    //Eventos: 

    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);
    
        crearCarta(carta, 0);


        if (puntosJugador > 21) {
            btnPedir.disabled = true;
            btnPlantar.disabled = true;
            turnoCompu(puntosJugador);

        } else if (puntosJugador === 21) {
            btnPedir.disabled = true;
            btnPlantar.disabled = true;
            turnoCompu(puntosJugador);
        }
    });

    btnPlantar.addEventListener('click', () => {
        btnPlantar.disabled = true;
        btnPedir.disabled = true;
        turnoCompu( puntosJugadores[0] );
    });

    btnNuevo.addEventListener('click', () => {

        inicializarJuego();

    });

    // Todo lo que se retorne, va a ser público, y lo que no, es privado. 

    return {
        nuevoJuego: inicializarJuego
    }
})();


