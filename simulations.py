import sched
import numpy as np
import random
import math
import copy
from collections import defaultdict

NO_RESULT = -1

candidates = {
    "Ding": 2806.0, 
    "Caruana":2783.0, 
    "Nakamura":2760.0, 
    "Radjabov":2738.2, 
    "Duda":2750.0, 
    "Rapport":2764.0, 
    "Nepomniachtchi":2766.0, 
    "Firouzja":2793.4
}

schedule = [
    [("Duda", "Rapport"),
    ("Ding", "Nepomniachtchi"),
    ("Caruana", "Nakamura"),
    ("Radjabov", "Firouzja")],  # Day 1

    [("Rapport", "Firouzja"),
    ("Nakamura", "Radjabov"),
    ("Nepomniachtchi", "Caruana"),
    ("Duda", "Ding")], # Day 2

    [("Ding", "Rapport"),
    ("Caruana", "Duda"),
    ("Radjabov", "Nepomniachtchi"),
    ("Firouzja", "Nakamura")], # Day 3

    [("Rapport", "Nakamura"),
    ("Nepomniachtchi", "Firouzja"),
    ("Duda", "Radjabov"),
    ("Ding", "Caruana")], # Day 4

    [("Caruana", "Rapport"),
    ("Radjabov", "Ding"),
    ("Firouzja", "Duda"),
    ("Nakamura", "Nepomniachtchi")], # Day 5

    [("Radjabov", "Rapport"),
     ("Firouzja", "Caruana"),
     ("Nakamura", "Ding"),
     ("Nepomniachtchi", "Duda")], # Day 6

    [("Rapport", "Nepomniachtchi"),
     ("Duda", "Nakamura"),
     ("Ding", "Firouzja"),
     ("Caruana", "Radjabov")], # Day 7

    [("Rapport", "Duda"),
     ("Nepomniachtchi", "Ding"),
     ("Nakamura", "Caruana"),
     ("Firouzja", "Radjabov")], # Day 8

    [("Firouzja", "Rapport"),
     ("Radjabov", "Nakamura"),
     ("Caruana", "Nepomniachtchi"),
     ("Ding", "Duda")], # Day 9

    [("Rapport", "Ding"),
     ("Duda", "Caruana"),
     ("Nepomniachtchi", "Radjabov"),
     ("Nakamura", "Firouzja")], # Day 10

    [("Nakamura", "Rapport"),
     ("Firouzja", "Nepomniachtchi"),
     ("Radjabov", "Duda"),
     ("Caruana", "Ding")], # Day 11

    [("Rapport", "Caruana"),
     ("Ding", "Radjabov"),
     ("Duda", "Firouzja"),
     ("Nepomniachtchi", "Nakamura")], # Day 12

    [("Nepomniachtchi", "Rapport"),
     ("Nakamura", "Duda"),
     ("Firouzja", "Ding"),
     ("Radjabov", "Caruana")], # Day 13

    [("Rapport", "Radjabov"),
     ("Caruana", "Firouzja"),
     ("Ding", "Nakamura"),
     ("Duda", "Nepomniachtchi")], # Day 14
     
]

def get_empty_results(schedule):
    return np.ones((len(candidates)//2, len(schedule))) * NO_RESULT

def elo_exp(eloDiff):
    return 1/(1+10**(-eloDiff/400.0))

def elo_per_pawn(elo):
    return math.exp(elo/1020) * 26.59

def build_matchup_probs(schedule, candidates):
    matchup_probs = {}
    for day in schedule:
        for matchup in day:

            if(candidates[matchup[0]]<=candidates[matchup[1]]):
                reverse_matchup = False
                small_elo = candidates[matchup[0]]
                big_elo = candidates[matchup[1]]
            else:
                reverse_matchup = True
                small_elo = candidates[matchup[1]]
                big_elo = candidates[matchup[0]]

            average_elo = (small_elo+big_elo)/2.0
            diff_elo = small_elo-big_elo
            expected_score = elo_exp(diff_elo)

            # White advantage
            per_pawn_shift = elo_per_pawn(average_elo)
            elo_shift = per_pawn_shift * 0.6
            
            small_elo_win_probability = elo_exp(diff_elo - elo_shift)
            draw_probability = (expected_score - small_elo_win_probability)*2
            big_elo_win_probability = 1-draw_probability-small_elo_win_probability
            
            probs = [small_elo_win_probability, draw_probability, big_elo_win_probability]
            ordered_probs = probs if not reverse_matchup else list(reversed(probs))
            matchup_probs[matchup] = ordered_probs
    return matchup_probs

def calculate_expected(schedule, results_grids):
    final_result_grid = np.mean([np.expand_dims(rg, axis=0) for rg in results_grids], axis=0)[0]
    player_results = defaultdict(lambda:0)
    for day in range(len(schedule)):
        for midx, matchup in enumerate(schedule[day]):
            player_results[matchup[0]]+=final_result_grid[midx, day]
            player_results[matchup[1]]+=1-final_result_grid[midx, day]
    return dict(player_results)


def calculate_winner(schedule, results_grid):
    player_results = defaultdict(lambda:0)
    for day in range(len(schedule)):
        for midx, matchup in enumerate(schedule[day]):
            player_results[matchup[0]]+=results_grid[midx, day]
            player_results[matchup[1]]+=1-results_grid[midx, day]

    max_value = max(player_results.values())
    keys = [key for key, value in player_results.items() if value == max_value]
    return random.choice(keys)

def calculate_winner(schedule, results_grid, candidates):
    player_results = {}
    for c in candidates.keys():
        player_results[c] = 0
    for day in range(len(schedule)):
        midx = 0
        for matchup in schedule[day]:          
            player_results[matchup[0]]+=results_grid[midx, day]
            player_results[matchup[1]]+=1-results_grid[midx, day]
            midx+=1

    max_value = max(player_results.values())
    keys = []
    for key, value in player_results.items():
        if value == max_value:
            keys.append(key)
    return random.choice(keys)

def calculate_percents(schedule, results_grids):
    player_results = defaultdict(lambda:0)
    for i in range(results_grids.shape[0]):
        player_results[calculate_winner(schedule, results_grids[i, :, :])] += 1.0/len(results_grids)
    return dict(player_results)

def run_simulations(candidates, schedule, fixed_results, N=10000):
    result_grids = np.zeros((N, fixed_results.shape[0], fixed_results.shape[1]))
    matchup_probs = build_matchup_probs(schedule, candidates)
    for day in range(len(schedule)):
        midx=0
        for matchup in schedule[day]:
            if(fixed_results[midx, day] == NO_RESULT):
                results = np.random.choice([1, 0.5, 0], size=N, p=matchup_probs[matchup])
                result_grids[:, midx, day] = results
            else:
                result_grids[:, midx, day] = fixed_results[midx, day]
            midx+=1
    return calculate_percents(schedule, result_grids)

if (__name__ == "__main__"):
    fixed_results = get_empty_results(schedule)
    results = run_simulations(candidates, schedule, fixed_results)
    print(results)