/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
 class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    this.element.update;
    Account.create(data, (err, resp) => {
        if (resp && resp.success) {
            this.element[0].value = null;
            App.getModal('createAccount').close();  
            App.update()
        } else {
          alert(err.error);
          App.getModal('createAccount').close();    //?
        }
    })
  }
}