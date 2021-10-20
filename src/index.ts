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

  getEmpDetails(empId: number, tree?: Employee): any;

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
  stack:any[] = [];
  pointer:number = -1;

  constructor(ceoObj: Employee) {
    this.ceo = ceoObj;
  }

  getEmpDetails (empId: number, tree:Employee=ceo): any {
    let node = tree;

    if (tree.uniqueId === empId) {
      return {present: 2, node}
    } 
    else if (node.subordinates.length > 0) {
      for (let index=0; index<node.subordinates.length; index++) {
        let subtree = node.subordinates[index];
        let details = this.getEmpDetails(empId, subtree);

        if (details.present === 2) {
          return {present: 1, node: details.node, parent: node}
        } else if (details.present === 1){
          return {present: 1, node: details.node, parent: details.parent }
        }
      }
      return {present: 0};
    } 
    else {
      return {present: 0};
    }
  }

  getChildren(node: Employee) {
    const children: number[] = [];
    node.subordinates.forEach(element => {
      children.push(element.uniqueId);
    });
    return children;
  }

  moveEmp(empId: number, supId: number) {
    let empObj = this.getEmpDetails(empId);
    let supObj = this.getEmpDetails(supId);
  
    const marked = this.getChildren(empObj.node);
  
    empObj.parent.subordinates.push(...empObj.node.subordinates);
  
    const index = empObj.parent.subordinates.indexOf(empObj.node);
    if (index > -1) {
      empObj.parent.subordinates.splice(index, 1);
    }
    empObj.node.subordinates = [];
    supObj.node.subordinates.push(empObj.node);
    return {empObj, supObj, marked}
  }

  move(empId: number, supId: number): void {
    const { marked, empObj } = this.moveEmp(empId, supId);
    this.pointer += 1;
    this.stack[this.pointer] = {empId, prevSupId: empObj.parent.uniqueId , marked};
  }

  undo(): void {
    if (this.pointer < 0) {
      console.log('cannot undo, at oldest state');
      return
    }
    const { empId, prevSupId, marked } = this.stack[this.pointer];
    const prevSubordinates = marked;
    const empDetails = this.getEmpDetails(empId);
    this.stack[this.pointer] = {empId, supId: empDetails.parent.uniqueId};
    this.pointer -= 1;
  
    let { empObj, supObj } = this.moveEmp(empId, prevSupId);
    empObj = empObj.node;
    supObj = supObj.node;
    for (let index=0; index<supObj.subordinates.length; index++) {
      const id = supObj.subordinates[index].uniqueId;
      if (prevSubordinates.includes(id)) {
        const subEmp = supObj.subordinates.splice(index, 1);
        empObj.subordinates.push(subEmp);
      }
    }
  }

  redo(): void {
    if (this.pointer >= this.stack.length) {
      console.log('cannot redo, at most recent state');
      return
    }
    this.pointer += 1;
    const { empId, supId } = this.stack[this.pointer];
    const { marked, empObj } = this.moveEmp(empId, supId);
    this.stack[this.pointer] = {empId, prevSupId: empObj.parent.uniqueId , marked};
  } 
}

const map = {
  mark: 1634632854560,
  sarah: 1634632963747,
  casandra: 1634632972400,
  mary: 1634632983668,
  bob: 1634632993604,
  tina: 1634633002411,
  will: 1634633010699,
  tyler: 1634633019191,
  harry: 1634633027743,
  thomas: 1634633035601,
  george: 1634633043118,
  gary: 1634633052157,
  bruce: 1634633061108,
  georgina: 1634633456307,
  sophie: 1634633457037,
}

const obj = new EmployeeOrgApp(ceo);
obj.move(map.will, map.georgina)
obj.undo()
obj.redo()