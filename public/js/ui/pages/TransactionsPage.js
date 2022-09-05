//const { application } = require("express");

/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
 class TransactionsPage  {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
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
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
      this.render(this.lastOptions);
  }

  /**     !!!++
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    try {
      this.element.querySelector('.remove-account').onclick  = e =>           //удаляем счёт
      this.removeAccount();

      document.querySelectorAll('.content').forEach(element => {              //удаляем транзакцию
          element.addEventListener('click', () => {
            if(event.target.closest('.transaction__remove')) {
                let idDellTransaction = event.target.closest('.transaction__remove').dataset.id;
                event.preventDefault();
                this.removeTransaction(idDellTransaction);
            } 
          })
      })
    }
    catch {
      alert(errorGetElement);
    }
    
  }

  /**  !!++
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    const idForDell = document.querySelectorAll('.account'); 
    idForDell.forEach(elem => {
      if(elem.className.includes('activ')) {
        if(confirm('Вы хотите удалить счёт?')) {
          
              Account.remove({id: elem.dataset.id},(err,resp) => {
                if(resp && resp.success) {
                    App.updateWidgets();
                    App.updateForms();
                    this.clear();
                 }
              })
          };
      }
    })
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction( id ) {
    if(confirm('Вы хотите удалить транзакцию?')) {
        Transaction.remove({id: id},(err,resp) => {
            if(resp && resp.success) {
                App.update();
            }
         })
      };
  }

  /**       !!++
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
  render(options){
    if(options) {
        this.lastOptions = options;
  
        Account.get(options.account_id, (err, resp) => {        //получаем название счета и отображаем
            if(resp) {
              this.renderTitle(resp.data.name); 
            }       
        }) 

        Transaction.list(options,(err, resp) => {               // получаем список транзакций и на отрисовку
            if(resp) {
                this.renderTransactions(resp.data);
            }
        })
    }
  }

  /**       !!++
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
      this.renderTransactions([]);
      document.querySelector('.content-title').textContent = 'Название счёта';
  }

  /**   !!+
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    document.querySelector('.content-title').textContent = name;
  }

  /**     !!++
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
      const monthString = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря']
      let dateN = new Date(date);
    
      let stringDateTransaction;
      return stringDateTransaction = `${dateN.getDate()} ${monthString[dateN.getMonth()]}  ${dateN.getFullYear()} г. в ${dateN.toISOString().slice(11,16)}`
  }

  /**  !!++
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
      if(item) {
          let codTransaction;
          let s =  document.querySelector(item.type);
   
          if(item.type == 'income') {
              codTransaction = 'transaction_income';
          }
    
          if(item.type == 'expense') {
              codTransaction = 'transaction_expense';
          }

      return `<div class="transaction ${codTransaction} row" style="display: flex;justify-content: space-between">
                <div class="col-md-7 transaction__details">
                    <div class="transaction__icon">
                        <span class="fa fa-money fa-2x"></span>
                    </div>
                
                    <div class="transaction__info">
                        <h4 class="transaction__title">${item.name}</h4>
                        <!-- дата -->
                        <div class="transaction__date">${this.formatDate(item.created_at)}</div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="transaction__summ">
                    <!--  сумма -->
                    ${item.sum} <strike>P</strike>    
                    </div>
                </div>
                <div class="col-md-2 transaction__controls">
                    <!-- в data-id нужно поместить id -->
                    <button class="btn btn-danger transaction__remove" data-id=${item.id}>
                      <i class="fa fa-trash"></i>  
                    </button>
                </div>
            </div>`     //<span class="currency">&#x20bd</span>
    }
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
      if(data) {
          const addListTransactions = document.querySelector('.content');
          
          document.querySelectorAll('.transaction').forEach(elem => elem.remove());
          data.forEach((elem) => {
              addListTransactions.insertAdjacentHTML('beforeend', this.getTransactionHTML(elem));
          })
      }
  }
}