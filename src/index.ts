import {
  Employee,
  IEmployeeOrgApp,
  StackInterface,
} from "./utils/interface/IEmployeeOrgApp";

enum isEmployeePresent {
  NO_EMPLOYEE = 0,
  EMPLOYEE_PRESENT_PARENT = 1,
  EMPLOYEE_PRESENT = 2,
}

// Static Data
const ceo: Employee = {
  uniqueId: 1634632854560,
  name: "Mark Zuckerberg",
  subordinates: [
    {
      uniqueId: 1634632963747,
      name: "Sarah Donald",
      subordinates: [
        {
          uniqueId: 1634632972400,
          name: "Cassandra Reynolds",
          subordinates: [
            {
              uniqueId: 1634632983668,
              name: "Mary Blue",
              subordinates: [],
            },
            {
              uniqueId: 1634632993604,
              name: "Bob Saget",
              subordinates: [
                {
                  uniqueId: 1634633002411,
                  name: "Tina Teff",
                  subordinates: [
                    {
                      uniqueId: 1634633010699,
                      name: "Will Turner",
                      subordinates: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
    {
      uniqueId: 1634633019191,
      name: "Tyler Simpson:",
      subordinates: [
        {
          uniqueId: 1634633027743,
          name: "Harry Tobs",
          subordinates: [
            {
              uniqueId: 1634633035601,
              name: "Thomas Brown",
              subordinates: [],
            },
          ],
        },
        {
          uniqueId: 1634633043118,
          name: "George Carrey",
          subordinates: [],
        },
        {
          uniqueId: 1634633052157,
          name: "Gary Styles",
          subordinates: [],
        },
      ],
    },
    {
      uniqueId: 1634633061108,
      name: "Bruce Willis",
      subordinates: [],
    },
    {
      uniqueId: 1634633456307,
      name: "Georgina Flangy",
      subordinates: [
        {
          uniqueId: 1634633457037,
          name: "Sophie Turner",
          subordinates: [],
        },
      ],
    },
  ],
};

class EmployeeOrgApp implements IEmployeeOrgApp {
  ceo: Employee;
  stack: Array<StackInterface> = [];
  pointer: number = -1;

  constructor(ceoObj: Employee) {
    this.ceo = ceoObj;
  }

  /**
   *
   * @param empId
   * @param tree
   * @returns
   */
  getEmpDetails = (
    empId: number | undefined,
    tree: Employee | undefined = ceo
  ): any => {
    let node = tree;

    if (tree.uniqueId === empId) {
      return { present: isEmployeePresent.EMPLOYEE_PRESENT, node };
    } else if (node.subordinates.length > 0) {
      for (let index = 0; index < node.subordinates.length; index++) {
        let subtree = node.subordinates[index];
        let details = this.getEmpDetails(empId, subtree);

        if (details.present === 2) {
          return {
            present: isEmployeePresent.EMPLOYEE_PRESENT_PARENT,
            node: details.node,
            parent: node,
          };
        } else if (details.present === 1) {
          return {
            present: isEmployeePresent.EMPLOYEE_PRESENT_PARENT,
            node: details.node,
            parent: details.parent,
          };
        }
      }
      return { present: isEmployeePresent.NO_EMPLOYEE };
    } else {
      return { present: isEmployeePresent.NO_EMPLOYEE };
    }
  };

  getChildren = (node: Employee): number[] => {
    const children: number[] = [];
    node.subordinates.forEach((element) => {
      children.push(element.uniqueId);
    });
    return children;
  };

  moveEmp(empId: number, supId: number | undefined) {
    let empObj = this.getEmpDetails(empId);
    let supObj = this.getEmpDetails(supId);

    const prevSubordinates = this.getChildren(empObj.node);

    empObj.parent.subordinates.push(...empObj.node.subordinates);

    const index = empObj.parent.subordinates.indexOf(empObj.node);
    if (index > -1) {
      empObj.parent.subordinates.splice(index, 1);
    }

    empObj.node.subordinates = [];
    supObj.node.subordinates.push(empObj.node);

    return { empObj, supObj, prevSubordinates };
  }

  move(empId: number, supId: number): void {
    const { prevSubordinates, empObj } = this.moveEmp(empId, supId);
    this.pointer += 1;
    this.stack[this.pointer] = {
      empId,
      prevSupId: empObj.parent.uniqueId,
      prevSubordinates,
    };
  }

  undo(): void {
    if (this.pointer < 0) {
      // console.log("Cannot undo. The object is at initial state.");
      return;
    }
    const { empId, prevSupId, prevSubordinates } = this.stack[this.pointer];
    const empDetails = this.getEmpDetails(empId);
    let { empObj, supObj } = this.moveEmp(empId, prevSupId);
    empObj = empObj.node;
    supObj = supObj.node;

    this.stack[this.pointer] = { empId, supId: empDetails.parent.uniqueId };
    this.pointer -= 1;

    for (let index = 0; index < supObj.subordinates.length; index++) {
      const id = supObj.subordinates[index].uniqueId;
      if (prevSubordinates?.indexOf(id) !== -1) {
        const subEmp = supObj.subordinates.splice(index, 1);
        empObj.subordinates.push(...subEmp);
      }
    }
  }

  redo(): void {
    if (this.pointer >= this.stack.length) {
      // console.log("cannot redo, at most recent state");
      return;
    }
    this.pointer += 1;
    const { empId, supId } = this.stack[this.pointer];
    const { prevSubordinates, empObj } = this.moveEmp(empId, supId);
    this.stack[this.pointer] = {
      empId,
      prevSupId: empObj.parent.uniqueId,
      prevSubordinates,
    };
  }
}

const obj = new EmployeeOrgApp(ceo);
obj.move(1634633010699, 1634633043118);
obj.undo();
obj.redo();
