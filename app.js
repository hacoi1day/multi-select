$(document).ready(function () {
    let tagify = new Tagify(document.querySelector('input[name=tags1]'), {
        delimiters : null,
        templates : {
            tag : function(v, tagData){
                console.log(tagData)
                try{
                    return `<tag title='${v}' contenteditable='false' spellcheck="false" class='tagify__tag ${tagData.class ? tagData.class : ""}' ${this.getAttributes(tagData)}>
                            <x title='remove tag' class='tagify__tag__removeBtn'></x>
                            <div>
                                <span class='tagify__tag-text'>${v}</span>
                            </div>
                        </tag>`;
                }
                catch(err){}
            },

            dropdownItem : function(tagData){
                try{
                    return `<div class='tagify__dropdown__item ${tagData.class ? tagData.class : ""}'>
                        <span>${tagData.value}</span>
                    </div>`
                }
                catch(err){}
            }
        },
        enforceWhitelist : true,
        whitelist : [
            {value: 'Test 1'},
            {value: 'Test 2'},
            {value: 'Test 3'},
        ],
        dropdown : {
            enabled: 0, // suggest tags after a single character input
            classname : 'extra-properties' // custom class for the suggestions dropdown
        } // map tags' values to this property name, so this property will be the actual value and not the printed value on the screen
    });

    tagify.on('click', function(e){
        console.log(e.detail);
    });

    tagify.on('remove', function(e){
        console.log(e.detail);
    });

    tagify.on('add', function(e){
        console.log( "original Input:", tagify.DOM.originalInput);
        console.log( "original Input's value:", tagify.DOM.originalInput.value);
        console.log( "event detail:", e.detail);
    });

    let input = document.querySelector('input[name=tags2]');

    let tagify2 = new Tagify(input, {
        delimiters : null,
        enforceWhitelist : true,
        dropdown: {
            enabled: 1,
            maxItems: 10,
        },
        whitelist: [],
    });
    tagify2.on('input', onInput);
    function onInput(e) {
        let value = e.detail.value;
        tagify2.settings.whitelist.length = 0;
        fetch('http://5d39b0e2fa091c00144704e2.mockapi.io/api/v1/keywords')
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(keyword => {
                let values = [];
                for (let i = 0; i < keyword.length; i++) {
                    values.push(keyword[i]['value']);
                }
                tagify2.settings.whitelist = values;
                tagify2.dropdown.show.call(tagify2, value);
            })
    }

});