require(['knockout', 'ojs/ojbootstrap', 'ojs/ojarraydataprovider', 'ojs/ojcontext', 'ojs/ojknockout', 'ojs/ojinputtext',
'ojs/ojinputnumber', 'ojs/ojtable', 'ojs/ojlabel', 'ojs/ojvalidationgroup'],
function (ko, Bootstrap, ArrayDataProvider, Context) {
function ViewModel() {
  var deptArray = [{ DepartmentId: 10, DepartmentName: 'Administration', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 20, DepartmentName: 'Marketing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 30, DepartmentName: 'Purchasing', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 40, DepartmentName: 'Human Resources', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 50, DepartmentName: 'Accounting', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 60, DepartmentName: 'Operations', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 70, DepartmentName: 'Engineering', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 80, DepartmentName: 'Production', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 90, DepartmentName: 'Sales', LocationId: 200, ManagerId: 300 },
      { DepartmentId: 100, DepartmentName: 'Customer Service', LocationId: 200, ManagerId: 300 }];
  this.deptObservableArray = ko.observableArray(deptArray);
  this.dataprovider = new ArrayDataProvider(this.deptObservableArray, { keyAttributes: '@index' });
  this.groupValid = ko.observable();
  this.isEmptyTable = ko.computed(function () {
    return this.deptObservableArray().length === 0;
  }, this);
  // add to the observableArray
  this.addRow = function () {
    if (this.groupValid() === 'invalidShown') {
      return;
    }
    var dept = {
      DepartmentId: this.inputDepartmentId(),
      DepartmentName: this.inputDepartmentName(),
      LocationId: this.inputLocationId(),
      ManagerId: this.inputManagerId()
    };
    this.deptObservableArray.push(dept);
  }.bind(this);

  // used to update the fields based on the selected row
  this.updateRow = function () {
    if (this.groupValid() === 'invalidShown') {
      return;
    }
    var element = document.getElementById('table');
    var currentRow = element.currentRow;

    if (currentRow != null) {
      this.deptObservableArray.splice(currentRow.rowIndex, 1, {
        DepartmentId: this.inputDepartmentId(),
        DepartmentName: this.inputDepartmentName(),
        LocationId: this.inputLocationId(),
        ManagerId: this.inputManagerId()
      });
    }
  }.bind(this);

  // used to remove the selected row
  this.removeRow = function () {
    var element = document.getElementById('table');
    var currentRow = element.currentRow;

    if (currentRow != null) {
      this.deptObservableArray.splice(currentRow.rowIndex, 1);
    }
  }.bind(this);

  this.removeAllRows = function () {
    this.deptObservableArray.removeAll();
  }.bind(this);

  // intialize the observable values in the forms
  this.inputDepartmentId = ko.observable();
  this.inputDepartmentName = ko.observable();
  this.inputLocationId = ko.observable();
  this.inputManagerId = ko.observable();
  this.currentRowListener = function (event) {
    var data = event.detail;
    if (event.type === 'currentRowChanged' && data.value != null) {
      var rowIndex = data.value.rowIndex;
      var dept = this.deptObservableArray()[rowIndex];
      if (dept != null) {
        this.inputDepartmentId(dept.DepartmentId);
        this.inputDepartmentName(dept.DepartmentName);
        this.inputLocationId(dept.LocationId);
        this.inputManagerId(dept.ManagerId);
      }
    }
  }.bind(this);

  this.hideTable = function (hide) {
    var table = document.getElementById('table');
    var tableContainer = document.getElementById('tableContainer');
    var noDataDiv = document.getElementById('noDataDiv');
    if (hide === true) {
      table.style.display = 'none';
      noDataDiv.style.display = 'block';
      tableContainer.classList.add('oj-sm-align-self-center');
    } else {
      table.style.display = '';
      noDataDiv.style.display = 'none';
      tableContainer.classList.remove('oj-sm-align-self-center');
    }
  };
}
var vm = new ViewModel();

Bootstrap.whenDocumentReady().then(
  function () {
    ko.applyBindings(vm, document.getElementById('tableDemo'));
    var table = document.getElementById('table');
    table.addEventListener('currentRowChanged', vm.currentRowListener);
    var busyContext = Context.getContext(table).getBusyContext();
    busyContext.whenReady().then(function () {
      vm.hideTable(vm.isEmptyTable());
      vm.isEmptyTable.subscribe(function (newValue) {
        vm.hideTable(newValue);
      });
    });
  }
);
});