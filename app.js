
//=====BUDGET CONRPLLER
var budgetController = (function () {

    //function constructor for the expence 
    var Expence = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentege = -1;
    };

    //Prototype to calculate the Percentage for the Expence Function Constructor
    Expence.prototype.calculatePercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentege = Math.round((this.value / totalIncome) * 100);

        } else {
            this.percentege = -1;
        }

    };


    Expence.prototype.getPercentage = function () {
        return this.percentege;
    }


    //function constructor for the income
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var calculateTotal = function (type) {
        sum = 0;
        //this funtion loops through the data
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });

        data.totals[type] = sum;
    }
    // OBJECT TO STORE ALL INCOME AND EXPENCE DATA
    var data = {
        allItems: {
            exp: [],
            inc: []
        },

        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentege: 0
    }

    //Function to allow other modules to add new items to our data structure
    return {
        addItem: function (type, des, val) {
            var newItem, ID;
            //create new id
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
                //[data.allItems[type].length - 1] This will select the last item
            } else {
                ID = 0;
            }
            //create new item based on 'inc' or 'exp' type
            if (type === 'exp') {
                newItem = new Expence(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            //push it into our data strucure
            data.allItems[type].push(newItem); /// this will push the new item into the specific

            //return the new element
            return newItem;
        },

        deleteItem: function (type, id) {
            var ids, index;

            ids = data.allItems[type].map(function (current) {
                return current.id;
            });

            index = ids.indexOf(id);

            if (index !== -1) {
                data.allItems[type].splice(index, 1)
            }
        },

        calculateBudget: function () {
            //call totol income and expenses
            calculateTotal('exp');
            calculateTotal('inc');

            //calculte budget: income - budget
            data.budget = data.totals.inc - data.totals.exp;

            //calculate percentege income that we spent
            if (data.totals.inc > 0) {
                data.percentege = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentege = -1;
            }

        },

        calculatePercentages: function () {

            data.allItems.exp.forEach(function (cur) {
                cur.calculatePercentage(data.totals.inc);
            });
        },

        getPercentages: function () {
            var allPerc = data.allItems.exp.map(function (cur) {
                return cur.getPercentage();
            });

            return allPerc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentege: data.percentege
            };
        },

        testing: function () {
            console.log(data);

        }

    }


})();




//===========UI CONTROLER========== this gets input from the user
var UIConntroller = (function () {
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        dateLabel: '.budget__title--month'

    };

    var formatNumber = function (num, type) {
  
var numSplit,int,dec;
        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];

        if (int.length > 3) {

            int = int.substr(0, int.length -3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        ;

        return (type === 'exp' ? '-': '+') + ' ' + int + '.' + dec;



    };

    var nodeListForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);

        }
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMstrings.inputType).value, //will be eithe inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };
        },

        addListItem: function (obj, type) {
            var html, element, newHtml;

            //crete some HTML with placeholdertext

            if (type === 'inc') {
                element = DOMstrings.incomeContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            } else if (type === 'exp') {
                element = DOMstrings.expensesContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }


            //Replace thetext holder with actua Text
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%',formatNumber(obj.value, type) );

            //Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        deleteListItem: function (selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },



        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displauBudget: function (obj) {
            var type;
            obj.budget > 0? type = 'inc': type = 'exp';

            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget,type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
            document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp,'exp');

            if (obj.percentege > 0) {
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentege + '%';
            } else {
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }

        },

        displayPercentages: function (percentages) {
            var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

           

            nodeListForEach(fields, function (current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = percentages[index] + '---';
                }

            });
        },

        displayMonth: function () {
            var now,year,months;
             now = new Date();

             year = now.getFullYear();

             months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
             month = now.getMonth();
             document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
  
        },

        changedType: function () {
            var fields = document.querySelectorAll(
                DOMstrings.inputType + ',' +
                DOMstrings.inputDescription + ',' +
                DOMstrings.inputValue);
            //This will return a node list


            nodeListForEach(fields, function (cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
        },


        getDOMstrings: function () {
            return DOMstrings;
        }
    };
});


//=========GLOBAL APP CONTROLLER========================================
var controller = (function (budgetCtrl, UICtrl) {
    var setupEventLinstners = function () {

        //get the strings
        var DOM = UICtrl().getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        //key press event listiner
        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            } else {

            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl().changedType)

    }
    var updateBudget = function () {
        //1. Calculate The Budget
        budgetCtrl.calculateBudget();
        //2 Retrun the BUDGET
        var budget = budgetCtrl.getBudget();

        //3. Return Tje Budget To The UI
        // console.log(budget);
        UICtrl().displauBudget(budget);



    };
    var updatePercentages = function () {
        //1. Update Percentages
        budgetCtrl.calculatePercentages();
        //2. REad Percentages from the UI
        var percentages = budgetCtrl.getPercentages();
        //3. Update the UI with the new UI
        UICtrl().displayPercentages(percentages);
    }

    var ctrlAddItem = function () {
        var input, newItem;

        // 1.Get te input field data
        input = UICtrl().getInput();

        // console.log(input);
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            //2. Add the item to the budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            //3. Add The Items to the UI
            UICtrl().addListItem(newItem, input.type);

            //4. Clear the Fields
            UICtrl().clearFields();

            //5. Calculate and Update the budget
            updateBudget();

            //6. Calculate and Update Percentages
            updatePercentages();
        }


    }

    var ctrlDeleteItem = function (event) {
        var itemID, splitID, type;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            //1. Delete the item from the data structure
            budgetCtrl.deleteItem(type, ID);
            console.log(ID);

            //2. Delete The item from the UI
            UICtrl().deleteListItem(itemID);

            //3. Update and show the new Total
            updateBudget();
        }


    }

    //PUBLIC initialization functio

    return {
        init: function () {
            console.log('the application has started');
            UICtrl().displauBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentege: 0
            });
            setupEventLinstners();
            UICtrl().displayMonth();

        }
    }


})(budgetController, UIConntroller);

controller.init();