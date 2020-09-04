import React from 'react';
import '@testing-library/jest-dom'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';

import { DeleteEventFab } from '../../../components/ui/DeleteEventFab';
import { eventStartDelete } from '../../../actions/events';
jest.mock('../../../actions/events', () => ({
    eventStartDelete: jest.fn()
}));

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = { };
const store = mockStore( initState );

store.dispatch = jest.fn();
   
const wrapper = mount(
    <Provider store={ store }>
        <DeleteEventFab />
    </Provider> 
);

describe('Pruebas en <DeleteEventFab />', () => {
    
    test('Debe de mostrarse correctamente', () => {

        expect( wrapper ).toMatchSnapshot();
    });

    test('Debe de llamar al eventStartDelete  cuando se hace click', () => {
       
        wrapper.find('button').prop('onClick')();

        expect( eventStartDelete ).toHaveBeenCalled();
    });
});
