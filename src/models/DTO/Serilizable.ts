export interface ISerializable {
    toJSON(): any;
}

// Note :- We have defined a base Serializable class that needs to be implemented by every DTO
//         that needs to be serialised to wire. This helps enforce standardisation and is also needed
//         to get around limitations in Typescript around Accessors(Getters/Setters) which are not
//         supported properly by default serialization in JS
export class Serializable implements ISerializable{
    toJSON(): any {

        //Shallow clone
        let clone: any = Object.assign({}, this);

        //Find the getter method descriptors
        //Get methods are on the prototype, not the instance
        const descriptors = Object.getOwnPropertyDescriptors(Object.getPrototypeOf(this))

        //Check to see if each descriptior is a get method
        Object.keys(descriptors).forEach(key => {
            if (descriptors[key] && descriptors[key].get) {

                //Copy the result of each getter method onto the clone as a field
                delete clone[key];
                // @ts-ignore
                clone[key] = this[key]; //Call the getter
            }
        });

        //Remove any leftover private fields starting with '_'
        Object.keys(clone).forEach(key => {
            if (key.indexOf('_') == 0) {
                delete clone[key];
            }
        });

        //toJSON requires that we return an object
        return clone;
    }
}