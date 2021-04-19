package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/cdkini/recurse-connect/server/database"
)

// GET /api/v1/users/graph
func GetGraph(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		urlParams := r.URL.Query()

		// Check whether or not date range was passed to endpoint
		_, ok1 := urlParams["startDate"]
		_, ok2 := urlParams["endDate"]

		// If only start or end was passed, return error to user
		if (ok1 && !ok2) || (ok2 && !ok1) {
			logger.Println("Invalid date parameters passed to URL")
			http.Error(w, "Error regarding optional args 'startDate' and 'endDate'", http.StatusBadRequest)
			return
		}

		// Find date range necessary for database query
		getAll := !(ok1 && ok2)
		start, end, err := getDateRange(urlParams, getAll)
		if err != nil {
			logger.Printf("Invalid date parameters passed to URL: %v\n", err)
			http.Error(w, "Error regarding optional args 'startDate' and 'endDate'", http.StatusBadRequest)
			return
		}

        var graph *database.Graph
        err = db.ReadGraph(start, end, graph)
		if err != nil {
			// TODO: Handle!
		}

		json.NewEncoder(w).Encode(graph)
		logger.Println("Successfully returned JSON response for GET request to /graph endpoint")
	})
}

func getDateRange(urlParams url.Values, getAll bool) (time.Time, time.Time, error) {
	var start, end time.Time
	var err error

	// If 'startDate' and 'endDate' args are not passed to endpoint
	if !getAll {
		start, err = time.Parse("01-02-2006", urlParams.Get("startDate"))
		if err != nil {
			return start, end, err
		}
		end, err = time.Parse("01-02-2006", urlParams.Get("endDate"))
		if err != nil {
			return start, end, err
		}
	} else {
		// I believe the RC API uses EST as opposed to UTC when listing out batch dates.
		loc, err := time.LoadLocation("EST")
		if err != nil {
			return start, end, err
		}

		// RC is founded in 2011 so setting that as left bound
		start = time.Date(2011, time.January, 0, 0, 0, 0, 0, loc)
		// We want all Recursers that have started (disallowing ones that are awaiting batch starts)
		end = time.Now().In(loc)
	}

	return start, end, err
}
