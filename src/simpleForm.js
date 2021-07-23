import {LightningElement, track} from 'lwc';

import { 
    state, 
    action,
    interpret, 
    transition, 
    createMachine
} from 'robot3';
import {createCurrent} from './robot';

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


const machine = createMachine({
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
)}

  

export default class SimpleForm extends LightningElement {
    @track _currentState = {};

    get state() {
      return this._currentState.name || "";
    }
    set state(value = {}) {
      this._currentState = value;
      ({
        context: this.context,
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

    get errors() {
        return this.context.errors || {};
    }

    get fields() {
        return this.context.fields || {};
    }

    get currentContext() {
        return JSON.stringify(this.context);
    }

    get lastNameInputClasses() {
        return `slds-form-element ${this.errors.LastName ? "slds-has-error" : ""}`;
    }

    handleEvent(e) {
        e.preventDefault();
        e.stopPropagation();
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