export interface ISerializable {
    toJSON(): any;
}

export class Serializable implements ISerializable{
    // Note: This is required for proper serialization so that we do not expose internal field names
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