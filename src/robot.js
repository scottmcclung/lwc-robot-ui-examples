import { createMachine, interpret, state, transition, invoke, action, guard, reduce } from 'robot3';
const { create, freeze } = Object;


const valueEnumerable = value => {
  return { enumerable: true, value };
}


const createMatcher = value => {
  return (stateValue) => value === stateValue;
}



const subscribe = service => {
    return (callback) => {
        if(!service.hasOwnProperty('subscriptions')) {
            service.subscriptions = new Set();
        }
        service.subscriptions.add(callback);
    }
}


const unsubscribe = service => {
    return (callback) => {
        if(!service.hasOwnProperty('subscriptions')) return;
        service.subscriptions.delete(callback);
    }
}


const unsubscribeAll = service => {
    return (callback) => {
        if(!service.hasOwnProperty('subscriptions')) return;
        service.subscriptions.clear();
    }
}


const createCurrent = service => {
    return freeze(create(service.machine.state, {
        context: valueEnumerable(service.context),
        service: valueEnumerable(service),
        matches: valueEnumerable(createMatcher(service.machine.state.name)),
        subscribe: valueEnumerable(subscribe(service))
    }));
}


const useMachine = (machine, initialContext) => {
    const service = interpret(machine, service => {
        const current = createCurrent(service.child || service);
        if(service.subscriptions) {
            service.subscriptions.forEach(callback => callback.call(null,current));
        }
    }, initialContext);
    
    const current = createCurrent(service);
    
    return {
        current, 
        send: service.send, 
        service
    };
}


export {createMachine, state, transition, invoke, action, guard, reduce, useMachine}