import {LightningElement, track} from 'lwc';
import {createMachine, useMachine, state, transition, action, reduce, guard} from './robot';

const initialContext = () => ({
    fields: {},
    errors: {}
})


const storeValue = (context, {target}) => {
    return { 
        ...context, 
        fields: {
            ...context.fields,
            [target.name]: target.value
        } 
     }
}


const validateForm = (context) => {
    context.errors = {};
    if(!context.fields.LastName || !context.fields.LastName.trim()) {
        context.errors.LastName = 'Last Name is required.';
    }
    return Object.keys(context.errors).length === 0;
}


const submit = (context, {target}) => {
    target.submit(context.fields);
}


const resetForm = (context, {target}) => {
    target.reset();
    context.fields = {};
    context.errors = {};
}


const formMachine = {
    rendering: state(
        transition('rendered', 'idle')
    ),
    idle: state(
        transition('change', 'dirty', reduce(storeValue))
    ),
    dirty: state(
        transition('change', 'dirty', reduce(storeValue)),
        transition('submit', 'submitting', guard(validateForm), action(submit))
    ),
    submitting: state(
        transition('success', 'idle', action(resetForm)),
        transition('error', 'dirty')
    )
}


const {current, send} = useMachine(createMachine(formMachine, initialContext));


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

    get errors() {
        return this.state.context.errors || {};
    }

    get fields() {
        return this.state.context.fields || {};
    }

    get currentContext() {
        return JSON.stringify(this.state.context);
    }

    get lastNameInputClasses() {
        return `slds-form-element ${this.errors.LastName ? "slds-has-error" : ""}`;
    }

    handleEvent(e) {
        e.preventDefault();
        e.stopPropagation();
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