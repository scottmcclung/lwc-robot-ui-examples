import {LightningElement, track} from 'lwc';
import {createMachine, useMachine, state, transition} from './robot';


const toggleMachine = {
    inactive: state(
        transition('click', 'active')
    ),
    active: state(
        transition('click', 'inactive')
    )
};
const toggle1 = useMachine(createMachine(toggleMachine));
const toggle2 = useMachine(createMachine(toggleMachine));


export default class MultipleToggles extends LightningElement {
    @track state = {
        toggle1: toggle1.current,
        toggle2: toggle2.current
    }

    get isToggle1Active() {
        return this.state.toggle1.matches('active');
    }

    get isToggle2Active() {
        return this.state.toggle2.matches('active');
    }

    handleClick = e => {
      const name = e.target.name;
      if(name === 'button1') toggle1.send(e);
      if(name === 'button2') toggle2.send(e);
    }

    handleStateChange = machine => {
        return currentState => this.state[machine] = currentState;
    }

    constructor() {
        super();
        toggle1.current.subscribe(this.handleStateChange('toggle1'));
        toggle2.current.subscribe(this.handleStateChange('toggle2'));
    }
}
