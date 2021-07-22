import {LightningElement, track} from 'lwc';
import {createMachine, createCurrent, interpret, state, transition} from './robot';


const machine = createMachine({
    inactive: state(
        transition('click', 'active')
    ),
    active: state(
        transition('click', 'inactive')
    )
});


export default class Toggle extends LightningElement {
    @track currentState = {};

    get isActive() {
        return this.currentState.matches('active');
    }

    get buttonText() {
      return `Click to toggle ${this.isActive ? 'Off' : 'On'}`;
    }

    get buttonClasses() {
      return `slds-button slds-button_${this.isActive ? 'neutral' : 'brand'}`
    }

    handleClick = e => this.currentState.send(e);

    constructor() {
        super();
        this.service = interpret(machine, service => {
            this.currentState = createCurrent(service);
        });
        this.currentState = createCurrent(this.service);
    }
}
