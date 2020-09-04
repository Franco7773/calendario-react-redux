import { types } from '../../types/types';
import { authReducer } from '../../reducers/authReducer';

let initState = {
    checking: true
}

describe('Pruebas en el authReducer', () => {
    
    test('Debe de retornar el estado por defecto', () => {
   
        const action = { };
        const state = authReducer( initState, action );

        expect( state ).toEqual( initState );
    });

    test('Debe de autenticar al usuario', () => {

        const action = {
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'Gianfranco'
            }
        };

        const state = authReducer( initState, action );

        expect( state ).toEqual({ checking: false, uid: '123', name: 'Gianfranco' });

        initState = state;
    });

    test('Debe de verificar la finalización de la autenticación', () => {

        const action = { type: types.authCheckingFinish };
        const state = authReducer( initState, action );
        
        expect( state ).toEqual({ checking: false, uid: '123', name: 'Gianfranco' });
    });

    test('Debe de cerrar sesión', () => {
        
        const action = { type: types.authLogout };
        const state = authReducer( initState, action );

        expect( state ).toEqual({ checking: false });
    })
});
