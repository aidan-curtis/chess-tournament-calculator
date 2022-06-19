
schedule = [
    [["Duda", "Rapport", 0.5],
    ["Ding", "Nepo", 0],
    ["Caruana", "Nakamura", 1],
    ["Radjabov", "Firouzja", 0.5]],

    [["Rapport", "Firouzja", 0.5],
    ["Nakamura", "Radjabov", 1],
    ["Nepo", "Caruana", 0.5],
    ["Duda", "Ding", 0.5]], 

    [["Ding", "Rapport", 0.5],
    ["Caruana", "Duda", 0.5],
    ["Radjabov", "Nepo", 0.5],
    ["Firouzja", "Nakamura", 0.5]],

    [["Rapport", "Nakamura", -1],
    ["Nepo", "Firouzja", -1],
    ["Duda", "Radjabov", -1],
    ["Ding", "Caruana", -1]],

    [["Caruana", "Rapport", -1],
    ["Radjabov", "Ding", -1],
    ["Firouzja", "Duda", -1],
    ["Nakamura", "Nepo", -1]],

    [["Radjabov", "Rapport", -1],
     ["Firouzja", "Caruana", -1],
     ["Nakamura", "Ding", -1],
     ["Nepo", "Duda", -1]],

    [["Rapport", "Nepo", -1],
     ["Duda", "Nakamura", -1],
     ["Ding", "Firouzja", -1],
     ["Caruana", "Radjabov", -1]],

    [["Rapport", "Duda", -1],
     ["Nepo", "Ding", -1],
     ["Nakamura", "Caruana", -1],
     ["Firouzja", "Radjabov", -1]],

    [["Firouzja", "Rapport", -1],
     ["Radjabov", "Nakamura", -1],
     ["Caruana", "Nepo", -1],
     ["Ding", "Duda", -1]],

    [["Rapport", "Ding", -1],
     ["Duda", "Caruana", -1],
     ["Nepo", "Radjabov", -1],
     ["Nakamura", "Firouzja", -1]],

    [["Nakamura", "Rapport", -1],
     ["Firouzja", "Nepo", -1],
     ["Radjabov", "Duda", -1],
     ["Caruana", "Ding", -1]],

    [["Rapport", "Caruana", -1],
     ["Ding", "Radjabov", -1],
     ["Duda", "Firouzja", -1],
     ["Nepo", "Nakamura", -1]],

    [["Nepo", "Rapport", -1],
     ["Nakamura", "Duda", -1],
     ["Firouzja", "Ding", -1],
     ["Radjabov", "Caruana", -1]],

    [["Rapport", "Radjabov", -1],
     ["Caruana", "Firouzja", -1],
     ["Ding", "Nakamura", -1],
     ["Duda", "Nepo", -1]]
     
]


candidates = {
    "Ding": 2806.0, 
    "Caruana":2783.0, 
    "Nakamura":2760.0, 
    "Radjabov":2738.2, 
    "Duda":2750.0, 
    "Rapport":2764.0, 
    "Nepo":2766.0, 
    "Firouzja":2793.4
}


probs = [
    ["Rapport", 0],
    ["Ding", 0],
    ["Caruana", 0],
    ["Nakamura", 0],
    ["Duda", 0],
    ["Radjabov", 0],
    ["Firouzja", 0],
    ["Nepo", 0],
]

seed=1

function random(input_seed) {
    var x = Math.sin(input_seed) * 10000; 
    seed = input_seed+1
    return x - Math.floor(x);
}

function update_probs(){
    seed=1
    fixed_results = get_fixed_results(schedule)
    probs = run_simulations(candidates, schedule, fixed_results)
}

function update_schedule(data, val){
    console.log(data)
    for (var day = 0; day<schedule.length; day+=1){
        for (var game = 0; game<schedule[day].length; game+=1){
            if(data[0] === schedule[day][game][0] && data[1] === schedule[day][game][1]){
                console.log("update!")
                schedule[day][game][2] = val
            }
        }   
    }
    update_probs()
    update();
}
function draw_click(data){
    update_schedule(data, 0.5)
}

function white_click(data){
    update_schedule(data, 1)
}

function black_click(data){
    update_schedule(data, 0)
}

function unknown_click(data){
    update_schedule(data, -1)
}


function transpose(matrix) {
    return matrix[0].map((col, i) => matrix.map(row => row[i]));
}
tschedule = transpose(schedule)

var table = d3.select('body').append('table')
var thead = table.append('thead')
var	tbody = table.append('tbody')
var match_array = Array.from({length: schedule.length}, (_, i) => (i + 1))

thead.append('tr')
	  .selectAll('th')
	  .data(match_array).enter()
	  .append('th')
      .attr("class", "center")
	    .text(function (column) { return "Game "+ column; });

var rows = tbody.selectAll('tr')
    .data(tschedule)
    .enter()
    .append('tr');

var forms = rows.selectAll('td')
    .data(function (row) {
        return row
    })
    .enter()
    .append('td')
    .append('form')
    .attr('class', 'btn-group btn-group-toggle full_width')
    .attr('data-toggle', 'buttons');

var label = forms.append('label')
    .attr('class', function(d){
        if(d[2] == 1){
            return "btn btn-sm btn-secondary active"
        }
        else{
            return "btn btn-sm btn-secondary"
        }
    })
    .on("click", function(d){white_click(d)});

label.append('input')
    .attr('type', 'radio')
    .attr('name', 'controlHeatmapType')
    .attr('value', function(d){return d[0]})
    
label.append('p').text(function(d){
    return d[0]
})

var label = forms.append('label')
    .attr('class', function(d){
        if(d[2] == 0){
            return "btn btn-sm btn-secondary active"
        }
        else{
            return "btn btn-sm btn-secondary"
        }
    })
    .on("click", function(d){black_click(d)});

label.append('input')
    .attr('type', 'radio')
    .attr('name', 'controlHeatmapType')
    .attr('value', function(d){return d[1]})
    
label.append('p').text(function(d){
    return d[1]
});

var label = forms.append('label')
    .attr('class', function(d){
        if(d[2] == 0.5){
            return "btn btn-sm btn-secondary active"
        }
        else{
            return "btn btn-sm btn-secondary"
        }
    })
    .on("click", function(d){draw_click(d)});
    
label.append('input')
    .attr('type', 'radio')
    .attr('name', 'controlHeatmapType')
    .attr('value', "draw")
    .attr('checked', '')
    
label.append('p').text("1/2");

var label = forms.append('label')
    .attr('class', function(d){
        if(d[2] == -1){
            return "btn btn-sm btn-secondary active"
        }
        else{
            return "btn btn-sm btn-secondary"
        }
    })
    .on("click", function(d){unknown_click(d)});
    
label.append('input')
    .attr('type', 'radio')
    .attr('name', 'controlHeatmapType')
    .attr('value', "unk")
    .attr('checked', '')
    
label.append('p').text("?");

// The calculate button
// var calculate_label = d3.select('body').append('label')
// .attr('class', "btn btn-secondary").on("click", draw_click);
// calculate_label.append('p').text("Calculate!");

// var reset_label = d3.select('body').append('label')
// .attr('class', "btn btn-secondary").on("click", reset_click);
// reset_label.append('p').text("Reset");


////////////////////////RESULTS TABLE/////////////////////////
  var columns = ["Player", "Win Probability"];

  var rtable = d3.select("body").append("table").attr("class", "table");
  var rthead = rtable.append("thead");
  var rtbody = rtable.append("tbody");

  rthead.append("tr")
    .selectAll("th")
    .data(columns)
    .enter()
    .append("th")
    .text(function(column) { return column; });

    rtbody.selectAll("tr")
    .data(probs, function (d) {return d[0];})
    .enter()
    .append("tr")
    .selectAll("td")
    .data(function (d) {return d;})
    .enter()
    .append("td")
    .text(function(d) { return d; });

  function update() {
    probs = probs.sort(function(a, b){return b[1]-a[1]});

    var rows = rtable.selectAll("tbody tr")
    .data(probs, function (d) {return d[0]}).order();
    
    rows.enter()
    .append('tr')
    .selectAll("td")
    .data(function (d) {return d;})
    .enter()
    .append("td")
    .order()
    .text(function(d) { return d; });
    
    rows.exit().remove();
    
    var cells = rows.selectAll('td')
    .data(function (d) {return d;})
    .order()
    .text(function (d) {return d;});
    
    cells.enter()
    .append("td")
    .order()
    .text(function(d) { 
        return d; 
    });
    
    cells.exit().remove();

  };

//////////////////////////////////////////simulation code
// Load the data


function n_samples(values, weights, N){

    const samples = [];

    for (let i = 0; i < values.length; i++) {
        samples.push({value: values[i], weight: weights[i]})
    }
    // requested method
    function randomSample (samples) {
    // [0..1) * sum of weight
    let sample =
        random(seed) *
        samples.reduce((sum, { weight }) => sum + weight, 0);

    // first sample n where sum of weight for [0..n] > sample
    const { value } = samples.find(
        ({ weight }) => (sample -= weight) < 0
    );

    return value;
    }


    q = Array.from({ length: N }, () => randomSample(samples))
    return q

}


function calculate_percents(schedule, results_grids){
    player_results = {}

    for (var c = 0; c<Object.keys(candidates).length; c+=1) {
        player_results[Object.keys(candidates)[c]] = 0;
    }
    for (var i = 0; i<results_grids.length; i+=1){
        player_results[calculate_winner(schedule, results_grids[i], candidates)] += 1.0/results_grids.length
    }
    player_probs = []
    for (var c = 0; c<Object.keys(player_results).length; c+=1) {
        player_probs.push([Object.keys(player_results)[c], (Object.values(player_results)[c]*100).toFixed(2)])
    }
    return player_probs
}


  
function elo_exp(eloDiff) {
    return 1 / (1 + Math.pow(10, -eloDiff / 400.0));
}

function elo_per_pawn(elo) {
    return Math.exp(elo / 1020) * 26.59;
}


function build_matchup_probs(schedule, candidates) {
    matchup_probs = {};

    for (var day, _pj_c = 0, _pj_a = schedule, _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
        day = _pj_a[_pj_c];

        for (var matchup, _pj_f = 0, _pj_d = day, _pj_e = _pj_d.length; _pj_f < _pj_e; _pj_f += 1) {
        matchup = _pj_d[_pj_f];

        if (candidates[matchup[0]] <= candidates[matchup[1]]) {
            var reverse_matchup = false;
            var small_elo = candidates[matchup[0]];
            var big_elo = candidates[matchup[1]];
        } else {
            var reverse_matchup = true;
            var small_elo = candidates[matchup[1]];
            var big_elo = candidates[matchup[0]];
        }

        var average_elo = (small_elo + big_elo) / 2.0;
        var diff_elo = small_elo - big_elo;
        var expected_score = elo_exp(diff_elo);
        var per_pawn_shift = elo_per_pawn(average_elo);
        var elo_shift = per_pawn_shift * 0.6;
        var small_elo_win_probability = elo_exp(diff_elo - elo_shift);
        var draw_probability = (expected_score - small_elo_win_probability) * 2;
        var big_elo_win_probability = 1 - draw_probability - small_elo_win_probability;
        var probs = [small_elo_win_probability, draw_probability, big_elo_win_probability];
        var ordered_probs = !reverse_matchup ? probs : probs.slice().reverse();;
        matchup_probs[matchup] = ordered_probs;
        }
    }

    return matchup_probs;
}
  

function run_simulations(candidates, schedule, fixed_results, N = 10000, NO_RESULT = -1) {
    var matchup_probs, midx, result_grids;

    result_grids = []
    for (var k=0; k<N; k+=1){
        er = []
        for (var i =0; i < schedule.length; i+=1){
            eri = []
            for (var j =0; j<Object.keys(candidates).length / 2; j+=1){
                eri.push(NO_RESULT)
            }
            er.push(eri)
        }
        result_grids.push(er)
    }
  
    matchup_probs = build_matchup_probs(schedule, candidates);
    for (var k=0; k<N; k+=1){
        for (var day = 0, _pj_a = schedule.length; day < _pj_a; day += 1) {
            midx = 0;
            for (var matchup, _pj_d = 0, _pj_b = schedule[day], _pj_c = _pj_b.length; _pj_d < _pj_c; _pj_d += 1) {
                matchup = _pj_b[_pj_d];
                if (fixed_results[midx][day] === NO_RESULT) {
                result_grids[k][midx][day] = n_samples([1, 0.5, 0], matchup_probs[matchup], 1)[0]
                } else {
                result_grids[k][midx][day] = fixed_results[midx][day]
                }
        
                midx += 1;
            }
        }
    }
    return calculate_percents(schedule, result_grids);
}


function calculate_winner(schedule, results_grid, candidates) {
    var max_value, midx, player_results;
    player_results = {};
  
    for (var c, _pj_c = 0, _pj_a = Object.keys(candidates), _pj_b = _pj_a.length; _pj_c < _pj_b; _pj_c += 1) {
      c = _pj_a[_pj_c];
      player_results[c] = 0;
    }
  
    for (var day = 0, _pj_a = schedule.length; day < _pj_a; day += 1) {
      midx = 0;
  
      for (var matchup, _pj_d = 0, _pj_b = schedule[day], _pj_c = _pj_b.length; _pj_d < _pj_c; _pj_d += 1) {
        matchup = _pj_b[_pj_d];
        player_results[matchup[0]] += results_grid[midx][day];
        player_results[matchup[1]] += 1 - results_grid[midx][day];
        midx += 1;
      }
    }
  
    max_value = Math.max(...Object.values(player_results));
    var keys = [];
  
    for (const [key, value] of Object.entries(player_results)) {
        if (value === max_value) {
            keys.push(key);
        }
    }
    function getRandomInt(max) {
        return Math.floor(random(seed) * max);
    }
      
    return keys[getRandomInt(keys.length)];
  }



function get_fixed_results(schedule) {
    er = []
    for (var i =0; i<Object.keys(candidates).length / 2; i+=1){
        eri = []
        for (var j =0; j<schedule.length; j+=1){
            eri.push(schedule[j][i][2])
        }
        er.push(eri)
    }
    return er
}




update_probs()
update()