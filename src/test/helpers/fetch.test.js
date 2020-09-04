import { fetchSinToken, fetchConToken } from '../../helpers/fetch';

let token;

describe('Pruebas en el helper Fetch', () => {
    
    test('fetchSinToken debe de funcionar', async () => {
        
        const resp = await fetchSinToken('auth', { email: 'gianfranco.donofrio@testing.cl', password: '1234567'}, 'POST');

        expect( resp instanceof Response ).toBe( true );

        const body = await resp.json();
        expect( body.ok ).toBe( true );

        token = body.token;
    });

    test('fetchConToken debe de funcionar', async () => {
              
        const resp1 = await fetchConToken('events/5f494604b30eec0017d44adq', {}, 'delete');

        expect( resp1 instanceof Response ).toBe( true );

        const body1 = await resp1.json();
        expect( body1.msg ).toBe('No hay token en la petición');


        localStorage.setItem('token', token );

        const resp2 = await fetchConToken('events/5f494604b30eec0017d44adq', {}, 'delete');

        const body2 = await resp2.json();
        expect( body2.msg ).toBe('Hable con el administrador');
    }); 
});
