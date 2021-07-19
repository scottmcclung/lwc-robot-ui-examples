import {LightningElement, track} from 'lwc';
import {createMachine, useMachine, state, transition, action} from './robot';


const submit = (context, {target}) => {
  console.log('submit event:', target);
  // target.submit();  // calling the sumbit method on the lightning-form component
  target.dispatchEvent(new CustomEvent('success'));  // normally this would be fired by the lightning-form component
}


const resetForm = (context, {target}) => target.reset();


const formMachine = {
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
}


const {current, send} = useMachine(createMachine(formMachine));


export default class SimpleForm extends LightningElement {
    @track state = current;

    get hasRendered() {
        return !this.state.matches('rendering');
    }

    get isBusy() {
        return ['rendering', 'submitting'].some(this.state.matches);
    }

    get isNotDirty() {
        return !this.state.matches('dirty');
    }

    handleEvent(e) {
        e.preventDefault();
        send(e);
    }

    connectedCallback() {
        current.subscribe(currentState => this.state = currentState);
    }

    renderedCallback() {
        if (this.hasRendered) return;
        send(new CustomEvent('rendered'));
    }
}