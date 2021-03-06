import {LightningElement, track} from 'lwc';
import { 
    state, 
    state as final,
    interpret, 
    transition, 
    createMachine
} from 'robot3';
import {createCurrent, nested} from './robot';


const DATA = () => ({
    one: "the first value",
    two: "the second value"
})


const crosswalkMachine = createMachine({
    walk: state(
        transition('click', 'dontWalk')
    ),
    dontWalk: final()
});


const stoplightMachine = createMachine({
    green: state(
        transition('click', 'yellow')
    ),
    yellow: state(
        transition('click', 'red')
    ),
    red: nested('green', {
        walk: state(
            transition('click', 'dontWalk')
        ),
        dontWalk: final()
    })
}, DATA);


export default class Intersection extends LightningElement {
    @track currentState = {};


    get stoplight() {
        return this.service && this.service.machine.current;
    }


    get crosswalk() {
        return (this.service && this.service.child && this.service.child.machine.current) || "dont walk";
    }


    get name() {
        return this.currentState.name;
    }


    handleClick = e => this.currentState.send(e)


    constructor() {
        super();
        this.service = interpret(stoplightMachine, service => {
            this.currentState = createCurrent(service);
        });
        this.currentState = createCurrent(this.service);
    }
}