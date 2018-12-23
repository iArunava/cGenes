let precompute_fitness_scores = (target_gene, gsize) => {
    let key;
    let value;
    let dict = {};
    for (let i = 0; i <= 255; ++i) {
        for (let j = 0; j <= 255; ++j) {
            for (let k = 0; k <= 255; ++k) {
                key = i.toString() + j.toString() + k.toString();
                for (let l = 0; l < gsize; ++l) {
                    value = Math.abs(i - target_gene[l][0]) +
                            Math.abs(j - target_gene[l][1]) +
                            Math.abs(k - target_gene[l][2]);
                    dict[key + '_' + l.toString()] = value;
                }
            }
        }
    }
    return dict;
}

let crossover = (pops, psize, coprob, gsize) => {
    let new_pops = [];
    let prob, sprob, nsprob;
    let rnum1, rnum2;
    let max, min;
    let rgene1, rgene2, cogene;
    let rgene = [];

    for (let i = 0; i < psize; ++i) {
        // Get a random probability with which crossover will happen
        prob = Math.random();
        console.log(prob);
        if (prob < coprob) {
            console.log('No crossover');
            // Get a random gene
            rgene1 = pops[get_random_num(pops.length, 0)];
            // Set the crossover-ed gene equal to the random gene
            cogene = rgene1;
        } else {
            console.log('crossover');
            // Get random gene
            rgene = [];
            rgene1 = pops[get_random_num(pops.length, 0)];
            rgene2 = pops[get_random_num(pops.length, 0)];
            rgene.push(rgene1);
            rgene.push(rgene2);

            // Select a gene at random
            sprob = Math.round(Math.random());
            nsprob = sprob === 1 ? 0 : 1;

            // Get a random subsection of the population
            rnum1 = get_random_num(pops.length, 0);
            rnum2 = get_random_num(pops.length, 0);
            if (rnum1 < rnum2) {
                min = rnum1;
                max = rnum2;
            } else {
                min = rnum2;
                max = rnum1;
            }

            // Create the cogene
            cogene = [];
            for (let i = 0; i < gsize; ++i) {
                if (min <= i && max >= i) cogene.push(rgene[sprob][i]);
                else cogene.push(rgene[nsprob][i]);
            }
        }
        console.log('sd', cogene.length);
        // Push the cogene to the new population
        new_pops.push(cogene);
    }

    return new_pops;
}

let get_random_num = (max, min=1) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

let mutate = (pops) => {
    // TODO: Implement mutate
    return pops;
}

let fitness_score = (gene, cgene) => {
    let score = 0;
    for (let i = 0; i < GSIZE; ++i) {
        score += Math.abs(parseInt(gene[i]) - parseInt(cgene[i]));
    }
    return score;
}
