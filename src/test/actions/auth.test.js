import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import '@testing-library/jest-dom';
import Swal from 'sweetalert2';

import { types } from '../../types/types';
import { startLogin, startRegister, startChecking } from '../../actions/auth';
import * as fetchModule from '../../helpers/fetch';

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );

const initialState = { };
let store;

Storage.prototype.setItem = jest.fn();

describe('Pruebas en las acciones del Auth', () => {

    beforeEach(() => {
        store = mockStore( initialState );
        jest.clearAllMocks();
    });

    test('startLogin correcto', async () => {

        await store.dispatch( startLogin('gianfranco.donofrio@testing.cl', '1234567'));

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: expect.any( String ),
                name: expect.any( String )
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', expect.any( String ));
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any( Number ));

        // const token = localStorage.setItem.mock.calls[0][1];
    });

    test('startLogin incorrecto', async () => {

        await store.dispatch( startLogin('gianfranco.donofrio@testing.cl', '01234567'));

        let actions = store.getActions();

        expect( actions ).toEqual([]);
        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'Password incorrecto', 'error');


        await store.dispatch( startLogin('gianfranco_donofrio@testing.cl', '1234567'));

        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'El usuario no existe con ese email', 'error');
    });

    test('startRegister correcto', async () => {

        fetchModule.fetchSinToken = jest.fn(() => ({
            json: () => ({
                ok: true,
                uid: '123',
                name: 'gian',
                token: 'ABCDEF'
            })
        }));

        await store.dispatch( startRegister('jest@testing.cl', '1234567', 'test'));

        let actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'gian'
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABCDEF');
        expect( localStorage.setItem ).toHaveBeenCalledWith('token-init-date', expect.any( Number ));
    });

    test('startChecking correcto', async () => {

        fetchModule.fetchConToken = jest.fn(() => ({
            json: () => ({
                ok: true,
                uid: '123',
                name: 'gian',
                token: 'ABCDEF'
            })
        }));
        
        await store.dispatch( startChecking());

        const actions = store.getActions();

        expect( actions[0] ).toEqual({
            type: types.authLogin,
            payload: {
                uid: '123',
                name: 'gian'
            }
        });

        expect( localStorage.setItem ).toHaveBeenCalledWith('token', 'ABCDEF');
    })
    
});
