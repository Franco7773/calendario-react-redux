import React from 'react';
import '@testing-library/jest-dom'
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';

import moment from 'moment';  
import Swal from 'sweetalert2';

import { CalendarModal } from '../../../components/calendar/CalendarModal';
import { eventStartUpdate, eventClearActiveEvent, eventStartAddNew } from '../../../actions/events';

jest.mock('../../../actions/events', () => ({
    eventStartUpdate: jest.fn(),
    eventClearActiveEvent: jest.fn(),
    eventStartAddNew: jest.fn()
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

const now = moment().minutes(0).seconds(0).add(1,'hours'); // 3:00:00
const nowPlus1 = now.clone().add(1, 'hours');

const middlewares = [ thunk ];
const mockStore = configureStore( middlewares );
const initState = {
    calendar: {
        events: [],
        activeEvent: {
            title: 'Hello Galaxy',
            notes: 'sometimes notes',
            start: now.toDate(),
            end: nowPlus1.toDate()
        }
    },
    auth: {
        uid: '123',
        name: 'Gianfranco'
    },
    ui: {
        modalOpen: true
    }
};
const store = mockStore( initState );

store.dispatch = jest.fn();
   
const wrapper = mount(
    <Provider store={ store }>
        <CalendarModal />
    </Provider> 
);

describe('Pruebas en <CalendarModal />', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    test('Debe de mostrar el modal', () => {
        
        expect( wrapper.find('Modal').prop('isOpen')).toBe( true );
    });

    test('Debe de llamar la acción de actualizar y cerrar modal', () => {
        
        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect( eventStartUpdate ).toHaveBeenCalledWith( initState.calendar.activeEvent );
        expect( eventClearActiveEvent ).toHaveBeenCalled();
    });

    test('Debe de marcar un error si falta el título', () => {
                
        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect( wrapper.find('input[name="title"]').hasClass('is-invalid')).toBe( true );
    });

    test('Debe de crear un nuevo evento ', () => {
        
        const initState = {
            calendar: {
                events: [],
                activeEvent: null
            },
            auth: {
                uid: '123',
                name: 'Gianfranco'
            },
            ui: {
                modalOpen: true
            }
        };
        const store = mockStore( initState );
        
        store.dispatch = jest.fn();
           
        const wrapper = mount(
            <Provider store={ store }>
                <CalendarModal />
            </Provider> 
        );

        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Testing'
            }
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect( eventClearActiveEvent ).toHaveBeenCalled();
        expect( eventStartAddNew ).toHaveBeenCalledWith({
            end: expect.anything(),
            start: expect.anything(),
            title: 'Testing',
            notes: ''
        });
    });

    test('Debe de validar las fechas', () => {
        
        wrapper.find('input[name="title"]').simulate('change', {
            target: {
                name: 'title',
                value: 'Testing'
            }
        });

        const today = new Date();

        act(() => {

            wrapper.find('DateTimePicker').at( 1 ).prop('onChange')( today );
        });

        wrapper.find('form').simulate('submit', {
            preventDefault() { }
        });

        expect( Swal.fire ).toHaveBeenCalledWith('Error', 'La fecha fin debe de ser mayor a la fecha de inicio', 'error');
    });
});
