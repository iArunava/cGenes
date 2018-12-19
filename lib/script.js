const INT = 'int';
const FLOAT = 'float';
const GSIZE = 10;
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

let pslider;
let psize;

let target_gene = [];
let population = [];
let fittness_dict = {};

$(document).ready(() => {
    set_genetic_bars();
    pslider = document.getElementById('id--slider-population');
    psize = pslider.value;
    get_population_ready();
    set_target_gene();
    //let fittness_dict = precompute_fitness_scores(target_gene, GSIZE);
    set_fittest_gene();
});

$('#btn--estep').on('click', () => {
    step();
});

let step = () => {
    let fscores = get_fitness_scores();
    let psize2 = psize / 2;
    //let selected_genes
}

let set_fittest_gene = () => {
    let fgene = document.getElementById('id--fittest-gene');
    let fittest_gene = get_fittest_gene();
    console.log(fittest_gene);
    for (let i = 0; i < GSIZE; ++i) {
        fgene.innerHTML += gene_template(fittest_gene[i], 'tgene');
    }
}

let get_fittest_gene = () => {
    let fittest_gene;
    let min_score = 1000;
    let score = 0;
    for (let i = 0; i < psize; ++i) {
        score = fitness_score(population[i], target_gene);
        console.log(score);
        if (score < min_score) {
            min_score = score;
            fittest_gene = population[i];
        }
    }
    return fittest_gene;
}

let set_target_gene = () => {
    let tgene = document.getElementById('id--target-gene');
    target_gene = get_one_gene(tgene, 'tgene');
}

let get_population_ready = (curr_population=null) => {
    let pops = document.getElementById('id--population');
    pops.innerHTML = "";
    for (let i = 1; i <= psize; ++i) {
        population.push(get_one_gene(pops, 'ogene'));
        pops.innerHTML += `<br/>`;
    }
}

let get_fitness_scores = () => {
    let fscores = [];
    for (let i = 0; i < psize; ++i) {
        fscores.push(fitness_score(population[i], target_gene));
    }
    return fscores;
}

let fitness_score = (gene, cgene) => {
    let score = 0;
    for (let i = 0; i < GSIZE; ++i) {
        score += Math.abs(parseInt(gene[i]) - parseInt(cgene[i]));
    }
    return score;
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

let random_color = () => {
    let r = Math.floor((Math.random() * 255) + 1);
    let g = Math.floor((Math.random() * 255) + 1);
    let b = Math.floor((Math.random() * 255) + 1);
    return [r, g, b]
}

let get_one_gene = (div, span_class='ogene') => {
    let gene = [];
    let template = `<div class='pogene'>`;
    for (let i = 0; i < GSIZE; ++i) {
        let color = random_color();
        template += gene_template(color, span_class);
        gene.push(color);
    }
    template += `</div>`;
    div.innerHTML += template;
    return gene;
}

let gene_template = (color, span_class='ogene') => {
    let template = `
        <span class='${span_class}' style="background-color: rgb(${color[0]}, ${color[1]}, ${color[2]})"></span>
    `;
    return template
}

let dynamic_bar_template = (slider_for, min, max, slider_val) => {
    let template = `
        <div>
            <div class='columns'>
                <div class='column is-12 slider-container'>
                    <input id='id--slider-${slider_for}' type='range' min='${min}' max='${max}' value='${slider_val}' class='slider slider--${slider_for}'>
                    <p class=''> ${slider_for.toUpperCase()} value: <span id='id--${slider_for}-val'> ${slider_val} </span>
                </div>
            </div>
        </div>
    `;
    return template;
}
