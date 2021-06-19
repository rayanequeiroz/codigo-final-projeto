const Modal = {
    open () {
        //Abrir Modal
        //Adicionar a class active ao modal
        document
          .querySelector('.modal-overlay')
          .classList
          .add('active')
    },
    close(){
        //fechar o Modal
        //remover a class active do modal
        document
          .querySelector('.modal-overlay')
          .classList
          .remove('active')
    }

}


const Storage = {
    get() {
        return JSON.parse(localStorage.getItem
            ("cryptofinances:investments")) || []
    },

    set(investments) {
        localStorage.setItem("crypto.finances:investments", JSON.stringify(investments))
    }
}

const Investment = {
    all: Storage.get(),

    add(investment){
        Investment.all.push(investment)

        App.reload()

    },

    remove(index) {
        Investment.all.splice(index, 1)

        App.reload()
    },

    incomes () {
        // pegar todas as transacoes/investimentos
        // para cada investimento,
        // se ela for maior que zero
        // somar a uma variavel e retornar a variavel

        let income = 0;
        
        Investment.all.forEach(investment => {
            if (investment.amount > 0) {
                income += investment.amount;
               
            }

        })
        return income
    },

    expenses() {

        let expense = 0;
        
        Investment.all.forEach(investment => {
            if (investment.amount < 0) {
                expense += investment.amount;
               
            }
        })
        return expense
    },

    total () {
        return Investment.incomes () + Investment.expenses()
    }
}

const DOM = {

    investmentsContainer: document.querySelector('#data-table tbody'),

    addInvestment (investment, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLInvestment(investment, index)
        tr.dataset.index = index

        DOM.investmentsContainer.appendChild(tr)

    },

    innerHTMLInvestment(investment, index) {

        const CSSclass = investment.amount > 0 ? "income" : "expense"

       const amount = Utils.formatCurrency(investment.amount)

        const html = `
            <td class="description">${investment.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date"> ${investment.date}</td>
            <td>
                <img onclick="Investment.remove(${index})" src="./assets/minus.svg" alt="Remover investimento">
            </td>
        `
        return html

    },

    updateWallet() {
        document
            .getElementById('incomeDisplay')
            .innerHTML = Utils.formatCurrency(Investment.incomes())
        document
            .getElementById('expenseDisplay')
            .innerHTML = Utils.formatCurrency(Investment.expenses())
        document
            .getElementById('totalDisplay')
            .innerHTML = Utils.formatCurrency(Investment.total())

    },

    clearInvestments() {
        DOM.investmentsContainer.innerHTML = ""
    }
} 

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100

        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency (value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    }
}

const Form = {

    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value
        }
    },

    // verificar se todas as infos foram preenchidas
    validateFields() {
        const {description, amount, date} = Form.getValues()
        
        if( description.trim() === "" ||
            amount.trim() === "" ||
            date.trim() === "") {
                throw new Error("Por favor, preencha todos os campos")
            }

            
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
        // verificar se os campos são válidos
         Form.validateFields()
        // formatar os dados para salvar
           const investment = Form.formatValues()
            // salvar
            Investment.add(investment)
            //apagar os dados do formulario
            Form.clearFields()
            // modal feche
            Modal.close()
        } catch (error) {
            alert(error.message)
        }

        
    }
}

const App = {
    init () {
        Investment.all.forEach(DOM.addInvestment)
        
        DOM.updateWallet()

        Storage.set(Investment.all)

    },
    reload() {
        DOM.clearInvestments()
        App.init()
    },
}


App.init()

