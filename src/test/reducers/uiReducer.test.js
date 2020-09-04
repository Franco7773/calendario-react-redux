import { uiReducer } from '../../reducers/uiReducer';
import { uiOpenModal, uiCloseModal } from '../../actions/ui';

const initState = {
    modalOpen: false
}

describe('Pruebas en uiReducer', () => {
    
    test('Debe de retornar el estado por defecto', () => {
        
        const state = uiReducer( initState, { });

        expect( state ).toEqual( initState );
    });
    
    test('Debe de abrir y cerrar el modal', () => {
        
        const modalOpen = uiOpenModal();
        let state = uiReducer( initState, modalOpen );

        expect( state ).toEqual({ modalOpen: true });
        
        const modalClose = uiCloseModal();
        state = uiReducer( initState, modalClose );

        expect( state ).toEqual({ modalOpen: false });
    });
    
});
