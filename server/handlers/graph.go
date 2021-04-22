package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"net/url"
	"time"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/cdkini/recurse-connect/server/models"
	"github.com/pkg/errors"
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

		graph := models.NewGraph()

		err = db.ReadGraph(start, end, graph)
		if err != nil {
			logger.Printf("Something went wrong when interacting with the database: %v\n", err)
			http.Error(w, "There was an error serializing database data", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(graph)
		logger.Println("Successfully returned JSON response for GET request to /graph endpoint")
		logger.Printf("Payload contains %v nodes and %v edges\n", len(graph.Recursers)+len(graph.Batches), len(graph.Edges))
	})
}

func getDateRange(urlParams url.Values, getAll bool) (time.Time, time.Time, error) {
	var start, end time.Time

	// I believe the RC API uses EST as opposed to UTC when listing out batch dates.
	// TODO: Shouldn't impact results since everything will follow the same TZ but look into this!
	loc, err := time.LoadLocation("EST")
	if err != nil {
		return start, end, errors.Wrap(err, "Could not create a timezone")
	}

	// If 'startDate' and 'endDate' args are not passed to endpoint
	if !getAll {
		start, err = time.ParseInLocation("2006-01-02", urlParams.Get("startDate"), loc)
		if err != nil {
			return start, end, errors.Wrap(err, "Date parsing error")
		}
		end, err = time.ParseInLocation("2006-01-02", urlParams.Get("endDate"), loc)
		if err != nil {
			return start, end, errors.Wrap(err, "Date parsing error")
		}
	} else {
		// RC is founded in 2011 so setting that as left bound
		start = time.Date(2011, time.January, 0, 0, 0, 0, 0, loc)
		// We want all Recursers that have started (disallowing ones that are awaiting batch starts)
		end = time.Now().In(loc)
	}

	return start, end, nil
}
