import React from 'react';
import '@testing-library/jest-dom'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { MemoryRouter } from 'react-router-dom';
import { LoginScreen } from '../../../components/auth/LoginScreen';
import { startLogin, startRegister } from '../../../actions/auth';
import Swal from 'sweetalert2';

jest.mock('../../../actions/auth', () => ({
    startLogin: jest.fn(),
    startRegister: jest.fn()
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = { };
const store = mockStore( initState );

store.dispatch = jest.fn();
   
const wrapper = mount(
    <Provider store={ store }>
        <MemoryRouter>
            <LoginScreen />
        </MemoryRouter>
    </Provider> 
);

describe('Pruebas en el <LoginScreen />', () => {
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Debe de mostrarse correctamente', () => {

        expect( wrapper ).toMatchSnapshot();
    });

    test('Debe de llamar el dispatch del login', () => {
        
        wrapper.find('input[name="lEmail"]').simulate('change', {
            target: {
                name: 'lEmail',
                value: 'gianfranco.donofrio@testing.cl'
            }
        });
        wrapper.find('input[name="lPassword"]').simulate('change', {
            target: {
                name: 'lPassword',
                value: '1234567'
            }
        });
        wrapper.find('form').at(0).prop('onSubmit')({
            preventDefault() {}
        });

        expect( startLogin ).toHaveBeenCalledWith('gianfranco.donofrio@testing.cl', '1234567');
    });
    
    test('No debe haber regstro si las contraseñas son diferentes', () => {
       
        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '1234567'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '01234567'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() {}
        });

        expect( startRegister ).not.toHaveBeenCalled();
        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'Las contraseñas deben de ser iguales', 'error');
    });
 
    test('Debe de dispararse el registro correctamente', () => {

        wrapper.find('input[name="rPassword1"]').simulate('change', {
            target: {
                name: 'rPassword1',
                value: '1234567'
            }
        });
        wrapper.find('input[name="rPassword2"]').simulate('change', {
            target: {
                name: 'rPassword2',
                value: '1234567'
            }
        });
        wrapper.find('form').at(1).prop('onSubmit')({
            preventDefault() {}
        });

        expect( Swal.fire ).not.toHaveBeenCalled();
        expect( startRegister ).toHaveBeenCalledWith('calendario@testing.cl', '1234567', 'calendario');
    });
});
