import { 
    invoke, 
    transition, 
    createMachine
} from 'robot3';


const { create, freeze } = Object;


const valueEnumerable = value => {
  return { enumerable: true, value };
}


const activeService = service => {
    if(service.child) return activeService(service.child);
    return service;
}


const createMatcher = value => {
  return (stateValue) => value === stateValue;
}


const createCurrent = service => {
    const active = activeService(service);
    return freeze(create(active.machine.state, {
        context: valueEnumerable(active.context),
        matches: valueEnumerable(createMatcher(active.machine.state.name)),
        send: valueEnumerable(active.send)
    }));
}

// A helper function for more easily building nested state machines.
const nested = (to, states, ctx) => {
    return invoke(createMachine(states, ctx), transition('done', to));
}


export {
    nested,
    createCurrent
}