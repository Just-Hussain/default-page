class Card {
    constructor(name) {
        this.name = name;
        this.links = [];
        this.notCreated = true;
    }
}

let model = {
    cards: [],
    addLinkCaller: null
};

let controller = {
    init: function() {
        model.cards = JSON.parse(localStorage.getItem('cards'));
        if (model.cards === null) {
            model.cards = [];
        }
        else {
            model.cards.map(function(card) {
                card.notCreated = true;
            });
        }

        headerView.init();
        contentView.init();
        addCardView.init();
        addLinkView.init();
        shortcuts.init();
    },

    getCards: function() {
        return model.cards
    },

    setAddLinkCaller: function(obj) {
        model.addLinkCaller = obj;
    },

    getAddLinkCaller: function() {
        return model.addLinkCaller;
    },

    getContentElem: function() {
        return contentView.content_elem;
    },

    clearContentElem: function() {
        contentView.content_elem.innerHTML = '';
    },

    getAddLinkModalElem: function() {
        return addLinkView.addLinkModal_elem;
    },
};

let headerView = {
    init: function() {
        this.time_elem = document.querySelector('.time');
        this.date_elem = document.querySelector('.date');
        
        this.render();
    },

    render: function() {
        this.time_elem.textContent = new Date().toLocaleTimeString();
        this.date_elem.textContent = new Date().toLocaleDateString();
        setInterval((function(time_elem, date_elem) {
            return function() {
                time_elem.textContent = new Date().toLocaleTimeString();date_elem.textContent = new Date().toLocaleDateString();
            }
        })(this.time_elem, this.date_elem), 1000);
    }
};

let cardView = {
    init: function(obj) {
        if (obj.notCreated) {
            obj.notCreated = false;

            let cardOuter_elem = document.createElement('div');
            cardOuter_elem.className = 'card-outer';
            obj.cardOuter_elem = cardOuter_elem;
    
            let cardHeader_elem = document.createElement('div');
            cardHeader_elem.className = 'card-header';
            obj.cardHeader_elem = cardHeader_elem;
    
            let cardName_elem = document.createElement('p');
            cardName_elem.className = 'card-name'
            cardName_elem.textContent = obj.name;
            obj.cardName_elem = cardName_elem;
    
            let addLink_elem = document.createElement('button');
            addLink_elem.className = 'add-link-btn fas fa-plus';
            addLink_elem.addEventListener('click', function() {
                controller.getAddLinkModalElem().classList.toggle('show');
                controller.setAddLinkCaller(obj);
                if (addCardView.addCardModal_elem.classList.contains('show')) {
                    addCardView.addCardModal_elem.classList.toggle('show');
                }
            });
            obj.addLink_elem = addLink_elem;
    
            let cardInner_elem = document.createElement('div');
            cardInner_elem.className = 'card-inner';
            obj.cardInner_elem = cardInner_elem;
        }
    },

    render: function(obj) {
        obj.cardHeader_elem.appendChild(obj.cardName_elem);
        obj.cardHeader_elem.appendChild(obj.addLink_elem);

        obj.cardInner_elem.innerHTML = '';
        for (let i = 0; i < obj.links.length; i++) {
            obj.cardInner_elem.appendChild(this.createLink(obj.links[i]));
        }
        obj.cardOuter_elem.appendChild(obj.cardHeader_elem);
        obj.cardOuter_elem.appendChild(obj.cardInner_elem);

        controller.getContentElem().appendChild(obj.cardOuter_elem);
    },

    createLink: function(link) {
        let link_elem = document.createElement('a');
        link_elem.textContent = link.name;
        link_elem.href = link.url;
        return link_elem;
    },

    addLink: function(name, url, obj) {
        obj.links.push({name: name, url: url});
    }
};

let contentView = {
    init: function() {
        this.content_elem = document.querySelector('.content');

        this.render();
    },

    render: function() {
    
        for (let i = 0; i < controller.getCards().length; i++) {
            cardView.init(controller.getCards()[i])
            cardView.render(controller.getCards()[i])
        }
    }
};

let addCardView = {
    init: function() {
        this.addCardModal_elem = document.querySelector('.add-card-modal');
        this.addCard_elem = document.querySelector('.add-card-btn');
        this.nameIn_elem = document.querySelector('.card-name-in');
        this.save_elem = document.querySelector('.card-save-btn');

        this.render();
    },

    render: function() {
        this.addCardModal_elem.classList.toggle('show');

        this.addCard_elem.addEventListener('click', (function(modal) {
            return function() {
                modal.classList.toggle('show');

                if (addLinkView.addLinkModal_elem.classList.contains('show')) {
                    addLinkView.addLinkModal_elem.classList.toggle('show')
                }
            }
        })(this.addCardModal_elem));

        this.save_elem.addEventListener('click', (function(nameIn_elem, modal) {
            return function() {
                if (nameIn_elem.value !== '') {
                    controller.getCards().push(new Card(nameIn_elem.value));
                    nameIn_elem.value = '';
                    contentView.render();
                    modal.classList.toggle('show');

                    localStorage.setItem('cards', JSON.stringify(controller.getCards()));
                }
            }
        })(this.nameIn_elem, this.addCardModal_elem));
    }
};

let addLinkView = {
    init: function() {
        this.addLinkModal_elem = document.querySelector('.add-link-modal');
        this.nameIn_elem = document.querySelector('.link-name-in');
        this.urlIn_elem = document.querySelector('.link-url-in');
        this.save_elem = document.querySelector('.link-save-btn');

        this.render();
    },

    render: function() {
        this.addLinkModal_elem.classList.toggle('show');

        this.save_elem.addEventListener('click', (function(nameIn_elem, urlIn_elem, modal) {
            return function() {
                if ((nameIn_elem.value && urlIn_elem) !== '') {
                    cardView.addLink(nameIn_elem.value, urlIn_elem.value, controller.getAddLinkCaller());
                    nameIn_elem.value = '';
                    urlIn_elem.value = '';
                    contentView.render();
                    modal.classList.toggle('show');

                    localStorage.setItem('cards', JSON.stringify(controller.getCards()));
                }
            }
        })(this.nameIn_elem, this.urlIn_elem, this.addLinkModal_elem));
    }
}

let shortcuts = {
    init: function() {
        document.onkeyup = function(event) {
            if (event.key === 'Escape') {
                addCardView.addCardModal_elem.classList.toggle('show', false);
                addLinkView.addLinkModal_elem.classList.toggle('show', false);
            }
        }
    }
};

controller.init();