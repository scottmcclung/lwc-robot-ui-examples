import {LightningElement, track} from 'lwc';
import {createMachine, createCurrent, interpret, state, transition} from './robot';


const toggleMachine = {
    inactive: state(
        transition('click', 'active')
    ),
    active: state(
        transition('click', 'inactive')
    )
};
const machine1 = createMachine(toggleMachine);
const machine2 = createMachine(toggleMachine);


export default class MultipleToggles extends LightningElement {
    @track toggle1 = {}
    @track toggle2 = {}


    get isToggle1Active() {
        return this.toggle1.matches('active');
    }

    get isToggle2Active() {
        return this.toggle2.matches('active');
    }

    handleClick = e => {
      const name = e.target.name;
      if(name === 'button1') this.toggle1.send(e);
      if(name === 'button2') this.toggle2.send(e);
    }

    constructor() {
        super();
        this.toggle1Service = interpret(machine1, service => {
            this.toggle1 = createCurrent(service);
        });
        this.toggle2Service = interpret(machine2, service => {
            this.toggle2 = createCurrent(service);
        });
        this.toggle1 = createCurrent(this.toggle1Service);
        this.toggle2 = createCurrent(this.toggle2Service);
    }
}
