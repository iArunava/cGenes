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

let evolution;
let pause = 1;

$(document).ready(() => {
    set_genetic_bars();
    pslider = document.getElementById('id--slider-population');
    psize = pslider.value;
    get_population_ready();
    set_target_gene();
    //let fittness_dict = precompute_fitness_scores(target_gene, GSIZE);
    set_fittest_gene();
});

$('#btn--start-evolution').on('click', () => {
    pause = 0;
    evolution = setInterval(step, 300);
});

$('#btn--estep').on('click', () => {
    step();
});

$('#btn--epause').on('click', () => {
    pause = 1;
});

let step = () => {
    let fscores = get_fitness_scores();
    let psize2 = psize / 2;

    let sorted_genes = fscores.sort(function (a, b) {return b[0] - a[0]});

    let selected_genes = [];
    for (let i = 0; i < psize2; ++i) {
        selected_genes.push(population[sorted_genes[i][1]]);
    }

    // Selecting 2 genes at random
    let random_gene_1 = population[get_random_num(psize, psize2 + 1)];
    let random_gene_2 = population[get_random_num(psize, psize2 + 1)];

    // Pushing the random genes to the selected genes
    selected_genes.push[random_gene_1];
    selected_genes.push[random_gene_2];

    //population of next generation
    next_pops = crossover(selected_genes);

    //mutate the population of the new generation
    next_pops = mutate(next_pops);

    //set these children as the population - Next Generation
    get_population_ready(next_pops);

    //update fittest gene
    set_fittest_gene();

    // check if needs to pause
    if (pause === 1)
        clearInterval(evolution);
}

let set_fittest_gene = () => {
    let fgene = document.getElementById('id--best-gene');
    fgene.innerHTML = "";
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
    population = [];
    for (let i = 1; i <= psize; ++i) {
        if (curr_population !== null)
            population.push(get_one_gene(pops, 'ogene', curr_population[i]));
        else
            population.push(get_one_gene(pops, 'ogene'));
        pops.innerHTML += `<br/>`;
    }
}

let get_fitness_scores = () => {
    let fscores = [];
    for (let i = 0; i < psize; ++i) {
        fscores.push([fitness_score(population[i], target_gene), i]);
    }
    return fscores;
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

let get_one_gene = (div, span_class='ogene', dgene=undefined) => {
    let gene = [];
    let template = `<div class='pogene'>`;
    let color;
    for (let i = 0; i < GSIZE; ++i) {
        if (dgene === undefined)
            color = random_color();
        else
            color = dgene[i];
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

let get_random_num = (max, min=1) => {
    return Math.random() * (max - min) + min;
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
