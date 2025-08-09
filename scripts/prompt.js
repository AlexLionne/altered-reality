export const prompt = "à partir dess thématiques les plus représentées par des postes sur X dans le monde génère le résultat suivant :\n" +
    "\n" +
    "Les thématiques sont les suivantes : \n" +
    "    \"SCIENCES\": {\n" +
    "        \"hex\": \"#3D5AFE\",\n" +
    "    },\n" +
    "    \"ENVIRONMENT\": {\n" +
    "        \"hex\": \"#00E676\",\n" +
    "    },\n" +
    "    \"EXPLORATION\": {\n" +
    "        \"hex\": \"#FFEA00\",\n" +
    "    },\n" +
    "    \"SPORT\": {\n" +
    "        \"hex\": \"#FF6D00\",\n" +
    "    },\n" +
    "    \"TECHNOLOGY\": {\n" +
    "        \"hex\": \"#7C4DFF\",\n" +
    "    },\n" +
    "    \"DEMOGRAPHICS\": {\n" +
    "        \"hex\": \"#D84315\",\n" +
    "    },\n" +
    "    \"ECONOMIC\": {\n" +
    "        \"hex\": \"#FFFF00\",\n" +
    "    },\n" +
    "    \"RELIGIOUS\": {\n" +
    "        \"hex\": \"#E040FB\",\n" +
    "    },\n" +
    "    \"MEDIA\": {\n" +
    "        \"hex\": \"#FF1744\",\n" +
    "    },\n" +
    "    \"LAWS\": {\n" +
    "        \"hex\": \"#BDBDBD\",\n" +
    "    },\n" +
    "    \"MILITARY\": {\n" +
    "        \"hex\": \"#00C853\",\n" +
    "    },\n" +
    "    \"KEY_POINT\": {\n" +
    "        \"hex\": \"#212121\",\n" +
    "    },\n" +
    "    \"GEOPOLITICS\": {\n" +
    "        \"hex\": \"#D50000\",\n" +
    "    },\n" +
    "    \"POLITICAL\": {\n" +
    "        \"hex\": \"#2979FF\",\n" +
    "    },\n" +
    "    \"SOCIAL\": {\n" +
    "        \"hex\": \"#FF80AB\",\n" +
    "    }\n" +
    "\n" +
    "\n" +
    "\n" +
    "Je vais te donner une date, pour cette date donne moi le poids (<intensity>) de chaque catégorie entre 1 et 2 des postes les plus représentés dans le monde.\n" +
    "Ordonne les thématiques par valeur en DESC.\n" +
    "La date en <timestamp> devra etre fournie.\n" +
    "Chaque sujet vaut 1000 points, la valeur de <seed> vaut [sum(1000 * <intensity>, ..., 1000 * <intensity>)]\n" +
    "\n" +
    "Utilise le plus de sources possibles pour valider les poids. Si il y a des notes de communautés ou des diversion dans les avis indique cet <impact> entre 0 et 1,\n" +
    "Répond avec un objet JSON sous ce format (5 premier uniquement) :\n" +
    "\n" +
    "{\n" +
    "date:<timestamp>,\n" +
    "seed: <seed>,\n" +
    "values:\n" +
    "[\n" +
    "    {id: 1, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 2, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 3, value: <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 4, value:  <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "    {id: 5, value:  <hex>, intensity: <intensity>, impact: <impact>},\n" +
    "]\n" +
    "}\n" +
    "\n"