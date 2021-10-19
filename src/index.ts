interface Employee {
  uniqueId: number;
  name: string;
  subordinates: Employee[];
}

const ceo: Employee = {
  uniqueId: 1634632854560,
  name: 'Mark Zuckerberg',
  subordinates: [{
    uniqueId: 1634632963747,
    name: 'Sarah Donald',
    subordinates: [{
      uniqueId: 1634632972400,
      name: 'Cassandra Reynolds',
      subordinates: [{
        uniqueId: 1634632983668,
        name: 'Mary Blue',
        subordinates: []
      }, {
        uniqueId: 1634632993604,
        name: 'Bob Saget',
        subordinates: [{
          uniqueId: 1634633002411,
          name: 'Tina Teff',
          subordinates: [{
            uniqueId: 1634633010699,
            name: 'Will Turner',
            subordinates: []
          }]
        }]
      }]
    }]
  }, {
    uniqueId: 1634633019191,
    name: 'Tyler Simpson:',
    subordinates: [{
      uniqueId: 1634633027743,
      name: 'Harry Tobs',
      subordinates: [{
        uniqueId: 1634633035601,
        name: 'Thomas Brown',
        subordinates: []
      }]
    }, {
      uniqueId: 1634633043118,
      name: 'George Carrey',
      subordinates: []
    }, {
      uniqueId: 1634633052157,
      name: 'Gary Styles',
      subordinates: []
    }]
  }, {
    uniqueId: 1634633061108,
    name: 'Bruce Willis',
    subordinates: []
  }, {
    uniqueId: 1634633456307,
    name: 'Georgina Flangy',
    subordinates: [{
      uniqueId: 1634633457037,
      name: 'Sophie Turner',
      subordinates: []
    }]
  }]
}

interface IEmployeeOrgApp {
  ceo: Employee;
  /**
  * Moves the employee with employeeID (uniqueId) under a supervisor
  (another employee) that has supervisorID (uniqueId).
  * E.g. move Bob (employeeID) to be subordinate of Georgina
  (supervisorID). * @param employeeID
  * @param supervisorID
  */
  move(employeeID: number, supervisorID: number): void;
  /** Undo last move action */
  undo(): void;
  /** Redo last undone action */
  redo(): void;
}

interface Operation {
  undo: [string] | [], 
  redo: [string] | []
}

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  operation: Operation = {
    undo: [],
    redo: []
  }

  constructor(ceoObj: Employee) {
    this.ceo = ceoObj;
  }

  move(employeeID: number, supervisorID: number): void {
    throw new Error("Method not implemented.");
    // After move functionality, push the operation in undo i.e operation.undo.push('1634632993604 -> 1634633043118') 
  }
  undo(): void {
    throw new Error("Method not implemented.");
    // After undo push the operation in redo
  }
  redo(): void {
    // After redo push this operation in undo
    throw new Error("Method not implemented.");
  } 
}

// const obj = new EmployeeOrgApp(ceo);
// obj.move(1634632993604, 1634633043118);