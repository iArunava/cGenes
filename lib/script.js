const INT = 'int';
const FLOAT = 'float';
const bars = {
    'step interval' : {
        'max': 1000,
        'min': 10,
        'slider_val': 150,
        'type': INT
    },

    'population' : {
        'max': 200,
        'min': 25,
        'slider_val': 25,
        'type': INT
    },

    'crossover' : {
        'max': 100,
        'min': 1,
        'slider_val': 3,
        'type': FLOAT
    },

    'mutation': {
        'max': 100,
        'min': 1,
        'slider_val': 1,
        'type': FLOAT
    }
};

$(document).ready(() => {
    set_genetic_bars();
    get_population_ready();
});

let get_population_ready = () => {

}

let set_genetic_bars = () => {
    let bar_div = $('#id--sliders');
    let the_slider;

    for (let key in bars) {
        bar_div.append(dynamic_bar_template(key,
                bars[key]['min'],
                bars[key]['max'],
                bars[key]['slider_val']));
        the_slider = document.getElementById('id--slider-' + key);
        the_sval = document.getElementById('id--' + key + '-val');
        set_oninput(the_slider, the_sval, key);
    }
}

let set_oninput = (the_slider, the_sval, key) => {
    the_slider.oninput = function() {
        if (bars[key]['type'] == INT) {
            the_sval.innerHTML = this.value;
        } else {
            the_sval.innerHTML = this.value / 100;
        }
    }
}

let dynamic_bar_template = (slider_for, min, max, slider_val) => {
    let template = `
        <div>
            <div class='columns'>
                <div class='column is-12 slider-container'>
                    <input id='id--slider-${slider_for}' type='range' min='${min}' max='${max}' value='${slider_val}' class='slider slider--${slider_for}'>
                </div>
                <p class='text--center'> ${slider_for.toUpperCase()} value: <span id='id--${slider_for}-val'> ${slider_val} </span>
            </div>
        </div>
    `;
    return template;
}
