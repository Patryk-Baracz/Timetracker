![Coders-Lab-1920px-no-background](https://user-images.githubusercontent.com/152855/73064373-5ed69780-3ea1-11ea-8a71-3d370a5e7dd8.png)

# Kilka ważnych informacji

Przed przystąpieniem do rozwiązywania zadań przeczytaj poniższe wskazówki

## Jak zacząć?

1. Stwórz [*fork*](https://guides.github.com/activities/forking/) repozytorium z zadaniami.
2. Sklonuj repozytorium na swój komputer. Użyj do tego komendy `git clone adres_repozytorium`
Adres repozytorium możesz znaleźć na stronie repozytorium po naciśnięciu w guzik "Clone or download".
3. Rozwiąż zadania i skomituj zmiany do swojego repozytorium. Użyj do tego komend `git add nazwa_pliku`.
Jeżeli chcesz dodać wszystkie zmienione pliki użyj `git add .` 
Pamiętaj że kropka na końcu jest ważna!
Następnie skommituj zmiany komendą `git commit -m "nazwa_commita"`
4. Wypchnij zmiany do swojego repozytorium na GitHubie.  Użyj do tego komendy `git push origin master`
5. Stwórz [*pull request*](https://help.github.com/articles/creating-a-pull-request) do oryginalnego repozytorium, gdy skończysz wszystkie zadania.

Poszczególne zadania rozwiązuj w odpowiednich plikach.

### Poszczególne zadania rozwiązuj w odpowiednich plikach.

**Repozytorium z ćwiczeniami zostanie usunięte 2 tygodnie po zakończeniu kursu. Spowoduje to też usunięcie wszystkich forków, które są zrobione z tego repozytorium.**


## TODO App

Napiszecie teraz aplikację Todo wraz z TimeTrackerem.
Dane będziecie zapisywać z wykorzystanie fetch-a i REST API.


> Wszystkie typy / modele stworzyć poprzez zapis klasowy !!!



Oto funkcjonalności, jakie ma mieć nasza aplikacja:
- dodawanie zadań
- dodawanie operacji do zadań
- rejestracja czasu operacji (wpisywana ręcznie bądź z wykorzystaniem stopera — dla chętnych).


Macie w kodzie html przygotowane snippety kodu dla poszczególnych elementów aplikacji - wykorzystajcie je jako wzorzec do tworzenia elementów za pomocą JavaScript.

Aplikacja składa się z:
- formularza do dodawania nowego zadania
- listy zadań - każde zadanie to osobna sekcja z klasą `task`
- do zadania można dodać operację poprzez przycisk `Add operation`
- pod pierwszym zadaniem macie pokazane różne etapy "życia" operacji
    - pierwszy element to formularz do dodawania nowej operacji (ma się pojawiać po kliknięciu `Add operation`)
    - drugi element - to wygląd operacji po dodaniu - ma ona dwie opcje dodawania czasu spędzonego nad tą operacją
        - `Add time manually` - wpisanie ręcznie czasu w minutach (widok czwartego elementu na liście)
        - `Start timer` - dla chętnych - uruchamia timer, który na bieżąco pokazuje ile czasu upłynęło (aktualizowany co sekundę) - trzeci element na liście to szablon dla tego stanu
    - ostatni element to wygląd już po zarejestrowaniu czasu dla operacji
- zadanie ma też opcję `Finish` - powoduje to, że znikają wszystkie przyciski z tego zadania i jego operacji


Przygotujcie odpowiednie metody do tworzenia pojedynczych elementów DOM w pliku DomElements.js - metody te mają być w prototypie typu DomElements (pamiętamy, że wszystkie metody definiowane w zapisie klasowym zawsze trafiają do prototypu :) )

W pliku app.js będziemy przechowywać wszystkie zadania w zmiennej tasks, która będzie tablicą, która będzie przechowywać obiekty typu Task.

W oparciu o tą tablicę ma być budowany cały wygląd listy operacji - docelowo jedyny stały element w pliku index.html to formularz do dodawania zadań, reszta ma być budowana dynamicznie.

Omówmy teraz potrzebne typy Task i Operation, które macie utworzyć w odpowiednich plikach.

# Task
**atrybuty**:
- title
- description
- status - domyślnie `open`, po zakończeniu ma być `closed`
- operations - tablica przechowująca powiązane operacje

# Operation
**atrybuty**
- description
- timeSpent - startowo 0 - czyli nie zarejestrowano jeszcze czasu i wtedy mogą być widoczne przyciski - czas przechowujemy w sekundach, natomiast dopiero na wyświetlaniu (czyli w którejś z metod DomElements) formatujemy to na zapis 1h 23m 15s


W pliku db.json macie przygotowane strukturę jaką będziecie otrzymywać z REST API - dane zadań i operacji.

API dostępne jest pod adresem: 

https://todo-api.coderslab.pl

Aby móc korzystać z API musicie pobrać indywidualny klucz poprzez wejście na stronę:

https://todo-api.coderslab.pl/apikey/create

Otrzymany klucz musicie przesyłać w nagłówku `Authorization`.

Dostępne adresy w REST API:

|      Adres     |      Metoda     |      Opis      | Struktura danych wysyłanych |
|----------------|-----------------|----------------|----------------------------|
| `/api/tasks`   |    GET          | Pobieranie zadań  |  |
| `/api/tasks`   |    POST         | Dodawanie zadania do wykonania |  {title: "", description: "", status: ""} |
| `/api/tasks/:id`   |    PUT         | Aktualizowanie zadania do wykonania |  {title: "", description: "", status: ""} |
| `/api/tasks/:id`   |    DELETE         | Usuwanie zadania |   |
| `/api/tasks/:id/operations`   |    GET          | Pobieranie zadania wraz z operacjami |  |
| `/api/tasks/:id/operations`   |    POST          | Dodawanie operacji do zadania |  {description: "", timeSpent: 0}  |
| `/api/operations/:id`   |    GET          | Pobieranie pojedynczej operacji |  |
| `/api/operations/:id`   |    PUT          | Aktualizowanie pojedynczej operacji |  {description: "", timeSpent: 0} |
| `/api/operations/:id`   |    DELETE          | Usuwanie operacji |  |




**Hint**
> Na starcie wyświetlacie tylko zadania, 
> dopiero po kliknięciu zadanie ładujecie operacje z nim związane i wyświetlacie poniżej tego zadania.
