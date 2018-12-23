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
        'slider_val': 0.3,
        'type': FLOAT
    },

    'mutation': {
        'max': 100,
        'min': 1,
        'slider_val': 0.1,
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

let generation;
let curr_fittest_score;
let fittest_score_ever;

$(document).ready(() => {
    generation = parseInt(document.getElementById('id--generation').innerHTML);
    curr_fittest_score = parseInt(document.getElementById('id--fitness-score').innerHTML);
    fittest_score_ever = parseInt(document.getElementById('id--shortest-fscore').innerHTML);

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
    evolution = setInterval(step, 100);
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

    console.log('y', selected_genes.length);
    // Get the crossover probability
    let coprob = parseInt(document.getElementById('id--crossover-val').innerHTML);

    //population of next generation
    next_pops = crossover(selected_genes, psize, coprob, GSIZE);

    //mutate the population of the new generation
    next_pops = mutate(next_pops);

    //set these children as the population - Next Generation
    get_population_ready(next_pops);

    //update fittest gene
    set_fittest_gene(population[fscores[0][0]], true);

    // update info
    generation += 1;
    curr_fittest_score = fscores[0][0];

    document.getElementById('id--generation').innerHTML = generation;
    document.getElementById('id--fitness-score').innerHTML = curr_fittest_score;

    if (fittest_score_ever > curr_fittest_score) {
        fittest_score_ever = curr_fittest_score;
        document.getElementById('id--shortest-fscore').innerHTML = fittest_score_ever;
        // update best gene
        set_fittest_gene(population[fscores[0][0]]);
    }

    // check if needs to pause
    if (pause === 1) clearInterval(evolution);
}

let set_fittest_gene = (best_gene=undefined, curr_gene=false) => {
    let fgene;
    let fgene2;
    let fittest_gene;

    fgene = document.getElementById('id--curr-best-gene');
    fgene2 = document.getElementById('id--best-gene');

    if (best_gene === undefined) {
        fittest_gene = get_fittest_gene();
    } else {
        fgene = fgene2;
        fittest_gene = best_gene;
    }

    fgene.innerHTML = "";
    if (best_gene === undefined && (!curr_gene))
        fgene2.innerHTML = "";

    for (let i = 0; i < GSIZE; ++i) {
        fgene.innerHTML += gene_template(fittest_gene[i], 'tgene');
        if (best_gene === undefined && (!curr_gene))
            fgene2.innerHTML += gene_template(fittest_gene[i], 'tgene');
    }
}

let get_fittest_gene = () => {
    let fittest_gene;
    let min_score = 1000;
    let score = 0;
    for (let i = 0; i < psize; ++i) {
        score = fitness_score(population[i], target_gene);
        //console.log(score);
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
