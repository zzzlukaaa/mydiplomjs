/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */

 class TransactionsWidget {
  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * */
  constructor( element ) {
    this.element = element;
    
    if(element === undefined) {
       const errorGetElement = new Error('Елемент не существует');
       throw errorGetElement;
    }
    this.registerEvents();
  }
  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна
   * */
  registerEvents() {
    const transactionsPanel = document.querySelectorAll('.transactions-panel');
    transactionsPanel.forEach(element => {
      element.addEventListener('click', () => {
        if(event.target.className.includes('btn-success')) {
            App.getModal('newIncome').open();
            App.updateForms();
        }
        if(event.target.className.includes('btn-danger')) {
            App.getModal('newExpense').open();
            App.updateForms();  
        }
      })
    })
  }
}