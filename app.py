from flask import Flask, render_template, request, jsonify
import random

app = Flask(__name__)
telugu_movies = [
    {
    "title": "Jathi Ratnalu",
    "genre": "comedy",
    "language": "telugu",
    "year": 2021,
    "rating": 7.3,
    "description": "Three carefree friends move to the city and unexpectedly get caught up in a hilarious criminal case.",
    "poster": "/static/images/jathirathnalu.jpg",
    "trailer": "https://www.youtube.com/watch?v=Hgc07_BX4_8",
    "watch": "https://www.justwatch.com/in/search?q=Jathi%20Ratnalu"
},
{
    "title": "DJ Tillu",
    "genre": "comedy",
    "language": "telugu",
    "year": 2022,
    "rating": 7.2,
    "description": "A carefree DJ finds himself trapped in a series of chaotic and hilarious situations after falling for a mysterious woman.",
    "poster": "/static/images/djtillu.jpg",
    "trailer": "https://www.youtube.com/watch?v=CRFnqrv9pEg",
    "watch": "https://www.justwatch.com/in/search?q=DJ%20Tillu"
},
{
    "title": "MAD",
    "genre": "comedy",
    "language": "telugu",
    "year": 2023,
    "rating": 7.4,
    "description": "Three engineering students experience friendship, romance and plenty of hilarious adventures during their college life.",
    "poster": "/static/images/mad.jpg",
     "trailer": "https://www.youtube.com/results?search_query=MAD+Telugu+Movie+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=MAD%20Telugu"
},
{
    "title": "Brochevarevarura",
    "genre": "comedy",
    "language": "telugu",
    "year": 2019,
    "rating": 8.0,
    "description": "Three struggling students attempt to help their friend escape her problems, but their plan takes several unexpected turns.",
    "poster": "/static/images/brochevarevarura.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Brochevarevarura+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Brochevarevarura"
},
   {
    "title": "Baahubali: The Beginning",
    "genre": "action",
     "language": "telugu",
    "year": 2015,
    "rating": 8.0,
    "description": "A young man discovers his royal heritage and becomes involved in a battle for the kingdom of Mahishmati.",
    "poster": "/static/images/baahubali.webp",
   "trailer": "https://www.youtube.com/results?search_query=Baahubali+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Baahubali"
},
{
    "title": "RRR",
    "genre": "action",
    "language": "telugu",
     "year": 2022,
    "rating": 8.0,
    "description": "Two revolutionaries fight against British rule and form an unexpected friendship.",
    "poster": "/static/images/rrr.jpg",
    "trailer": "https://youtu.be/GY4BgdUSpbE",
"watch": "https://www.justwatch.com/in/search?q=RRR"
}, 
{
    "title": "Pushpa: The Rise",
    "genre": "action",
   "language": "telugu",
     "year": 2021,
    "rating": 7.6,
    "description": "A determined labourer rises through the ranks of a red sandalwood smuggling syndicate.",
    "poster": "/static/images/pushpa.jpg",
    "trailer": "https://youtu.be/Q1NKMPhP8PY",
"watch": "https://www.justwatch.com/in/search?q=Pushpa"
},
{
    "title": "Salaar: Part 1 – Ceasefire",
    "genre": "action",
     "language": "telugu",
    "year": 2023,
    "rating": 6.6,
    "description": "A powerful man is drawn into a violent conflict when he helps his childhood friend fight for control of a kingdom.",
    "poster": "/static/images/salaar.webp",
    "trailer": "https://youtu.be/4GPvYMKtrtI",
"watch": "https://www.justwatch.com/in/search?q=Salaar"
},
   {
    "title": "Sita Ramam",
    "genre": "romance",
    "language": "telugu",
    "year": 2022,
    "rating": 8.5,
    "description": "An orphaned soldier receives anonymous love letters and sets out to discover the woman behind them.",
    "poster": "/static/images/sitaramam.avif",
    "trailer": "https://www.youtube.com/results?search_query=Sita+Ramam+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Sita%20Ramam"
},
{
    "title": "Geetha Govindam",
    "genre": "romance",
    "language": "telugu",
    "year": 2018,
    "rating": 7.7,
    "description": "A well-mannered young lecturer falls in love with a woman who initially develops a bad impression of him.",
    "poster": "/static/images/geethagovindam.avif",
    "trailer": "https://www.youtube.com/results?search_query=Geetha+Govindam+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Geetha%20Govindam"
},
{
    "title": "Tholi Prema",
    "genre": "romance",
    "language": "telugu",
    "year": 2018,
    "rating": 7.2,
    "description": "Two young people fall deeply in love, but their different personalities and priorities put their relationship to the test.",
    "poster": "/static/images/tholiprema.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Tholi+Prema+2018+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Tholi%20Prema"
},
{
    "title": "Hi Nanna",
    "genre": "romance",
    "language": "telugu",
    "year": 2023,
    "rating": 8.2,
    "description": "A devoted single father and his daughter meet a mysterious woman whose arrival reveals an emotional story of love and family.",
    "poster": "/static/images/hinanna.avif",
    "trailer": "https://www.youtube.com/results?search_query=Hi+Nanna+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Hi%20Nanna"
},
    {
    "title": "HIT: The First Case",
    "genre": "thriller",
    "language": "telugu",
    "year": 2020,
    "rating": 7.6,
    "description": "A troubled police officer investigates the mysterious disappearance of a young woman while battling his own traumatic past.",
    "poster": "/static/images/hit.jpg",
    "trailer": "https://www.youtube.com/results?search_query=HIT+The+First+Case+Telugu+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=HIT%20The%20First%20Case"
},
{
    "title": "Goodachari",
    "genre": "thriller",
    "language": "telugu",
    "year": 2018,
    "rating": 7.8,
    "description": "A young intelligence agent is framed for a crime and must uncover the conspiracy while proving his innocence.",
    "poster": "/static/images/goodachari.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Goodachari+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Goodachari"
},
{
    "title": "Evaru",
    "genre": "thriller",
    "language": "telugu",
    "year": 2019,
    "rating": 8.1,
    "description": "A corrupt police officer investigates a complicated murder case in which every new revelation changes the truth.",
    "poster": "/static/images/evaru.webp",
    "trailer": "https://www.youtube.com/results?search_query=Evaru+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Evaru"
},
{
    "title": "Kshanam",
    "genre": "thriller",
    "language": "telugu",
    "year": 2016,
    "rating": 8.2,
    "description": "A man returns to India to help his former girlfriend search for her missing daughter, uncovering a disturbing mystery.",
    "poster": "/static/images/kshanam.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Kshanam+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Kshanam"
},
   {
    "title": "Masooda",
    "genre": "horror",
    "language": "telugu",
    "year": 2022,
    "rating": 7.2,
    "description": "A mother seeks help when her daughter begins behaving strangely, leading them into a terrifying supernatural mystery.",
    "poster": "/static/images/masooda.avif",
    "trailer": "https://www.youtube.com/results?search_query=Masooda+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Masooda"
},
{
    "title": "Virupaksha",
    "genre": "horror",
    "language": "telugu",
    "year": 2023,
    "rating": 7.2,
    "description": "A man investigates a series of mysterious deaths in a village where fear, superstition and dark forces surround the truth.",
    "poster": "/static/images/virupaksha.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Virupaksha+Official+Trailer+Telugu",
    "watch": "https://www.justwatch.com/in/search?q=Virupaksha"
},
{
    "title": "Arundhati",
    "genre": "horror",
    "language": "telugu",
    "year": 2009,
    "rating": 7.3,
    "description": "A young woman discovers a terrifying connection to her family's past and must confront a powerful supernatural enemy.",
    "poster": "/static/images/arundathi.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Arundhati+Telugu+Movie+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Arundhati"
},
{
    "title": "Kanchana",
    "genre": "horror",
    "language": "telugu",
    "year": 2011,
    "rating": 6.6,
    "description": "A man terrified of ghosts becomes possessed by a spirit seeking justice, leading to a mix of horror and comedy.",
    "poster": "/static/images/kanchana.avif",
    "trailer": "https://www.youtube.com/results?search_query=Kanchana+Telugu+Movie+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Kanchana"
},
   {
    "title": "Jersey",
    "genre": "drama",
    "language": "telugu",
    "year": 2019,
    "rating": 8.5,
    "description": "A former cricketer in his thirties returns to the game to fulfill his son's dream and rediscover his own purpose.",
    "poster": "/static/images/jersey.avif",
    "trailer": "https://www.youtube.com/results?search_query=Jersey+Telugu+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Jersey"
},
{
    "title": "Mahanati",
    "genre": "drama",
    "language": "telugu",
    "year": 2018,
    "rating": 8.4,
    "description": "The inspiring life story of legendary actress Savitri, tracing her rise to stardom and personal struggles.",
    "poster": "/static/images/mahanati.jpg",
    "trailer": "https://www.youtube.com/results?search_query=Mahanati+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Mahanati"
},
{
    "title": "C/o Kancharapalem",
    "genre": "drama",
    "language": "telugu",
    "year": 2018,
    "rating": 8.8,
    "description": "An anthology of four heartfelt love stories set in the town of Kancharapalem, celebrating ordinary lives and relationships.",
    "poster": "/static/images/cokancherapalem.jpg",
    "trailer": "https://www.youtube.com/results?search_query=C%2FO+Kancharapalem+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=C%2FO+Kancharapalem"
},
{
    "title": "Rangasthalam",
    "genre": "drama",
    "language": "telugu",
    "year": 2018,
    "rating": 8.2,
    "description": "A partially deaf villager stands against corruption and oppression in his village, leading to a powerful emotional journey.",
    "poster": "/static/images/rangasthalam.webp",
    "trailer": "https://www.youtube.com/results?search_query=Rangasthalam+Official+Trailer",
    "watch": "https://www.justwatch.com/in/search?q=Rangasthalam"
},
]


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/recommend", methods=["POST"])
def recommend():

    data = request.get_json()
    message = data.get("message", "").lower()

    genres = [
        "comedy",
        "action",
        "romance",
        "thriller",
        "horror",
        "drama"
    ]

    languages = [
        "telugu",
        "hindi",
        "english",
        "tamil",
        "malayalam"
    ]

    selected_genre = None
    selected_language = None

    # Find which language the user asked for
    for language in languages:
        if language in message:
            selected_language = language
            break

    # Find which genre the user asked for
    for genre in genres:
        if genre in message:
            selected_genre = genre
            break

    # If no genre was found
    if selected_genre is None:
        return jsonify({
            "found": False,
            "reply": "Please tell me what genre you want: comedy, action, romance, thriller, horror, or drama."
        })

    # Search our movie collection
    matching_movies = []

    for movie in telugu_movies:
        if movie["genre"] == selected_genre:
            if selected_language is None or movie["language"] == selected_language:
                matching_movies.append(movie)

    # If movies are found
    if matching_movies:

        movies = random.sample(
            matching_movies,
            min(4, len(matching_movies))
        )

        return jsonify({
            "found": True,
            "movies": movies
        })

    else:

        return jsonify({
            "found": False,
            "reply": "Sorry! I don't have movies for that language and genre yet."
        })

@app.route("/movies", methods=["GET"])
def get_movies():
    return jsonify({
        "movies": telugu_movies
    })

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0")