import {LightningElement, track} from 'lwc';
import { 
    state, 
    action,
    interpret, 
    transition, 
    createMachine
} from 'robot3';
import {createCurrent} from './robot';


const submit = (context, {target}) => {
  console.log('submit event:', target);
  // target.submit();  // calling the sumbit method on the lightning-form component
  target.dispatchEvent(new CustomEvent('success'));  // normally this would be fired by the lightning-form component
}


const resetForm = (context, {target}) => target.reset();


const machine = createMachine({
    rendering: state(
        transition('rendered', 'idle')
    ),
    idle: state(
        transition('change', 'dirty')
    ),
    dirty: state(
        transition('submit', 'submitting', action(submit))
    ),
    submitting: state(
        transition('success', 'idle', action(resetForm)),
        transition('error', 'dirty')
    )
});


export default class SimpleForm extends LightningElement {
    @track _currentState = {};

    get state() {
      return this._currentState.name || "";
    }
    set state(value = {}) {
      this._currentState = value;
      ({
        constext: this.context,
        matches: this.matches,
        send: this.send
      } = this._currentState);
    }
    
    
    get hasRendered() {
        return !this.matches('rendering');
    }

    get isBusy() {
        return ['rendering', 'submitting'].some(this.matches);
    }

    get isNotDirty() {
        return !this.matches('dirty');
    }

    handleEvent(e) {
        e.preventDefault();
        this.send(e);
    }

    constructor() {
        super();
        this.service = interpret(machine, service => {
            this.state = createCurrent(service);
        });
        this.state = createCurrent(this.service);
    }

    renderedCallback() {
        if (this.hasRendered) return;
        this.send(new CustomEvent('rendered'));
    }
}