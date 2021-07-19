import {LightningElement, track} from 'lwc';
import {createMachine, useMachine, state, transition} from './robot';


const {current, send} = useMachine(createMachine({
    inactive: state(
        transition('click', 'active')
    ),
    active: state(
        transition('click', 'inactive')
    )
}));


export default class Toggle extends LightningElement {
    @track state = current;

    get isActive() {
        return this.state.matches('active');
    }

    get buttonText() {
      return `Click to toggle ${this.isActive ? 'Off' : 'On'}`;
    }

    get buttonClasses() {
      return `slds-button slds-button_${this.isActive ? 'neutral' : 'brand'}`
    }

    handleClick = e => send(e);

    constructor() {
        super();
        current.subscribe(currentState => this.state = currentState);
    }
}
