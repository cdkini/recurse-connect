package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"net/url"
	"time"

	"github.com/cdkini/recurse-connect/server/environment"
	"github.com/cdkini/recurse-connect/server/types"
)

// GET /api/v1/users/graph
func GetGraphData(env *environment.Env) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		urlParams := r.URL.Query()

		// Check whether or not date range was passed to endpoint
		_, ok1 := urlParams["startDate"]
		_, ok2 := urlParams["endDate"]

		// If only start or end was passed, return error to user
		if (ok1 && !ok2) || (ok2 && !ok1) {
			env.Logger.Println("Invalid date parameters passed to URL")
			http.Error(w, "Error regarding optional args 'startDate' and 'endDate'", http.StatusBadRequest)
			return
		}

		// Find date range necessary for database query
		getAll := !(ok1 && ok2)
		start, end, err := getDateRange(urlParams, getAll)

		if err != nil {
			env.Logger.Printf("Invalid date parameters passed to URL: %v\n", err)
			http.Error(w, "Error regarding optional args 'startDate' and 'endDate'", http.StatusBadRequest)
			return
		}

		rows, err := queryDatabase(env, start, end)
		if err != nil {
			env.Logger.Printf("Could not execute database query: %v\n", err)
			http.Error(w, "There was an issue with the database query; check your args!", http.StatusNoContent)
			return
		}
		defer rows.Close()

		var recurserNodes []*types.RecurserNode
		seen := make(map[int]types.RecurserNode, 0) // Keep track of the Recursers we've evaluated to prevent duplicate nodes

		for rows.Next() {
			var recurser types.RecurserNode

			err = rows.Scan(
				&recurser.Id, &recurser.Name, &recurser.ProfilePath, &recurser.ImagePath, &recurser.Location,
				&recurser.Company, &recurser.Bio, &recurser.Interests, &recurser.BeforeRc, &recurser.DuringRc,
				&recurser.Email, &recurser.GitHub, &recurser.Twitter, &recurser.BatchName, &recurser.BatchShortName,
				&recurser.StartDate, &recurser.EndDate,
			)

			if err != nil {
				env.Logger.Printf("Could not serialize database row into struct: %v\n", err)
				http.Error(w, "There was an issue serializing your data to JSON", http.StatusInternalServerError)
				return
			}

			// If we've seen before, update start and end dates of struct
			if p, ok := seen[recurser.Id]; ok {
				updateRecurserNodeDates(recurser, p)
			} else {
				// Else, mark as seen and add to JSON payload
				seen[recurser.Id] = recurser
				recurserNodes = append(recurserNodes, &recurser)
			}
		}

		// Take Recurser node data and use it to add batch nodes and create weighted connections between them all
		batchNodes := getBatchNodes(env, recurserNodes)
		edges := getEdges(recurserNodes, batchNodes)

		resp := map[string]interface{}{
			"recurserNodes": recurserNodes,
			"batchNodes":    batchNodes,
			"edges":         edges,
		}

		json.NewEncoder(w).Encode(resp)
		env.Logger.Println("Successfully returned JSON response for GET request to /graph endpoint")
		env.Logger.Printf("Response contained %v nodes and %v edges\n", len(recurserNodes)+len(batchNodes), len(edges))
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
		// TODO: I believe the RC API uses UTC but does this even matter? We're worried about dates not times so this should be negligible
		loc, err := time.LoadLocation("UTC")
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

func queryDatabase(env *environment.Env, start time.Time, end time.Time) (*sql.Rows, error) {
	query := `
        SELECT profiles.id, profiles.name, profiles.profile_path, profiles.image_path, locations.name, companies.name,
        profiles.bio, profiles.interests, profiles.before_rc, profiles.during_rc, profiles.email, profiles.github, 
        profiles.twitter, batches.name, batches.short_name, stints.start_date, stints.end_date
        FROM profiles
            LEFT JOIN locations ON profiles.location_id = locations.id
            LEFT JOIN companies ON profiles.company_id = companies.id
            LEFT JOIN stints ON profiles.id = stints.profile_id
            LEFT JOIN batches ON stints.batch_id = batches.id
        WHERE stints.end_date >= $1 AND stints.start_date <= $2
    `

	return env.DB.Query(query, start, end)
}

// If we have a node clash, we determine the start and end dates based on mins/maxes
func updateRecurserNodeDates(a types.RecurserNode, b types.RecurserNode) {
	if a.StartDate.Before(*b.StartDate) {
		b.StartDate = a.StartDate
	}
	if a.EndDate.After(*b.EndDate) {
		b.EndDate = a.EndDate
	}
}

func getBatchNodes(env *environment.Env, nodes []*types.RecurserNode) []*types.BatchNode {
	// Keep track of batches as well as their bounds
	batches := make(map[string]bool, 0)
	startDates := make(map[string]*time.Time, 0)
	endDates := make(map[string]*time.Time, 0)

	for _, node := range nodes {
		name := *node.BatchShortName
		if _, ok := batches[name]; !ok {
			batches[name] = true
			startDates[name] = node.StartDate
			endDates[name] = node.EndDate
		} else {
			if startDates[name].Before(*node.StartDate) {
				startDates[name] = node.StartDate
			}
			if endDates[name].After(*node.EndDate) {
				endDates[name] = node.EndDate
			}
		}
	}

	var batchNodes []*types.BatchNode
	counter := -1 // We're using negative integers to represent batches to make the difference between node types easy to compute

	for batch := range batches {
		node := &types.BatchNode{
			Id:        counter,
			Name:      batch,
			StartDate: startDates[batch],
			EndDate:   endDates[batch],
		}
		counter--
		batchNodes = append(batchNodes, node)
	}

	return batchNodes
}

func getEdges(recurserNodes []*types.RecurserNode, batchNodes []*types.BatchNode) []*types.Edge {
	var edges []*types.Edge

	// Determine connections between batches and batches
	for i := 0; i < len(batchNodes); i++ {
		for j := i + 1; j < len(batchNodes); j++ {
			a := batchNodes[i]
			b := batchNodes[j]
			overlap := determineOverlap(a.StartDate, a.EndDate, b.StartDate, b.EndDate)
			// If overlapping, create two edges A->B and B->A
			if overlap > 0 {
				edges = append(edges,
					types.NewEdge(a.Id, b.Id, overlap),
					types.NewEdge(b.Id, a.Id, overlap),
				)
			}
		}
	}

	// Determine connections between Recursers and batches
	for _, batch := range batchNodes {
		for _, recurser := range recurserNodes {
			overlap := determineOverlap(batch.StartDate, batch.EndDate, recurser.StartDate, recurser.EndDate)
			if overlap > 0 {
				edges = append(edges,
					types.NewEdge(batch.Id, recurser.Id, overlap),
					types.NewEdge(recurser.Id, batch.Id, overlap),
				)
			}
		}
	}

	return edges
}

func determineOverlap(startA, endA, startB, endB *time.Time) int {
	diff1 := int(endA.Sub(*startB).Hours()/24) + 1
	diff2 := int(endB.Sub(*startA).Hours()/24) + 1
	if diff1 < diff2 {
		return diff1
	}
	return diff2
}
