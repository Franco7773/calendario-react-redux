import moment from 'moment';

export const prepareEvents = ( events = [] ) => events.map( e => ({
    ...e,
    end: moment( e.end ).toDate(),
    start: moment( e.end ).toDate()
}));
