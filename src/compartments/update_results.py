import json

# Load the JSON data
data = [
    {
        "id": 1,
        "home": "GKS Katowice",
        "away": "GKS Tychy",
        "score": "",
        "bet": ""
    },
    {
        "id": 2,
        "home": "Ruch Chorzów",
        "away": "Radomiak Radom",
        "score": "",
        "bet": ""
    },
    {
        "id": 3,
        "home": "Leverkusen",
        "away": "Union Berlin",
        "score": "",
        "bet": ""
    },
    {
        "id": 4,
        "home": "FC Barcelona",
        "away": "Alaves",
        "score": "",
        "bet": ""
    },
    {
        "id": 5,
        "home": "Legia Warszawa",
        "away": "Lech Poznan",
        "score": "",
        "bet": ""
    }
]

# Add results to each match
for match in data:
    result = input(f"Enter result for {match['home']} vs {match['away']}: ")
    match['result'] = result

# Save the updated data
with open('updated_matches.json', 'w') as json_file:
    json.dump(data, json_file, indent=4)

print("Results added and saved to updated_matches.json.")
