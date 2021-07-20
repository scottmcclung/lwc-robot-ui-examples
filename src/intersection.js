import {LightningElement, track} from 'lwc';
import {createMachine, useMachine, state, transition, action, invoke} from './robot';


const {current, send} = useMachine(createMachine({
    green: state(
        transition('next', 'yellow', action(() => {
            console.log('transition to red')
            setInterval(() => send('next'), 5000)
        }))
    ),
    yellow: state(
        transition('next', 'red', action(() => {
            console.log('transition to red')
            setInterval(() => send('next'), 1000)
        }))
    ),
    red: state(
        transition('next', 'green', action(() => {
            console.log('transition to green')
            setInterval(() => send('next'), 6000)
        }))
    )
}));


export default class Intersection extends LightningElement {
    @track state = current;

    get isActive() {
        return this.state.matches('active');
    }

    get crosswalkState() {
        return "walk";
    }


    get stoplightState() {
        return this.state.name;
    }

    handleNext = e => send(e);

    constructor() {
        super();
        current.subscribe(currentState => this.state = currentState);
        send('next');
    }
}