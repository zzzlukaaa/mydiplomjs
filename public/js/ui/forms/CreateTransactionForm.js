/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
 class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
    let nameModal;
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {   
    let addList; 
  
    this.element[1].value = null;     //зачистила поля формы
    this.element[2].value = null;

    Account.list(this.data, (err, resp) => {
      switch (this.element.id) {
        case 'new-income-form':
          addList = document.querySelector('#income-accounts-list'); 
          while (addList.firstChild) {
            addList.removeChild(addList.firstChild);
          }
          
          if (resp && resp.success ) {
            resp.data.forEach(a =>  {
            let strAdd = ` <option value="${a.id}">${a.name}</option>`
            addList.insertAdjacentHTML('beforeend', strAdd)
            });
           this.nameModal = 'newIncome';
          }
          break;
        case 'new-expense-form':
          addList = document.querySelector('#expense-accounts-list');   //#expense-accounts-list
          while (addList.firstChild) {
            addList.removeChild(addList.firstChild);
          }

          if (resp && resp.success ) {
            resp.data.forEach(a =>  {
            let strAdd = ` <option value="${a.id}">${a.name}</option>`
            addList.insertAdjacentHTML('beforeend', strAdd)
            });
            this.nameModal = 'newExpense';
          }
          break;
      }
    })
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, resp) => {
      if (resp && resp.success) {
          App.getModal(this.nameModal).close();  
          App.update()
      } else {
        alert(err.error);
        App.getModal('createAccount').close(); 
      }
  })
  }
}