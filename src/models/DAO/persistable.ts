// Note:- We don't need to explicitly implement any logic to persist to a storage layer and
//        have abstracted it out to the implementations (ORM/Drivers...) but this helps in
//        modelling the interaction of objects with the storage layer in a consistent fashion
export default interface Persistable {}
