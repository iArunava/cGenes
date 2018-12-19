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
