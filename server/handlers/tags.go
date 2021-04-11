package handlers

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/cdkini/recurse-connect/server/config"
	"github.com/cdkini/recurse-connect/server/types"

	"github.com/gorilla/mux"
)

// Endpoint: /api/v1/users/:userId/tags
func GetTags(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		query := `SELECT * FROM tags WHERE author=$1`
		rows, err := env.DB.Query(query, userId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}
		defer rows.Close()

		var tags types.Tags

		for rows.Next() {
			var tag *types.Tag

			if err = rows.Scan(&tag.Id, &tag.Author, &tag.Name, &tag.ProfileId, &tag.NoteId); err != nil {
				log.Fatalf("Unable to scan the row. %v", err)
			}

			if err = tag.Validate(); err != nil {
				env.Logger.Printf("Validation error; provided fields do not meet specification: %v", err)
				http.Error(w, "Validation error due to improper field data", http.StatusBadRequest)
				return
			}

			tags = append(tags, tag)
		}

		json.NewEncoder(w).Encode(tags)
	})
}

// Endpoint: /api/v1/users/:userId/tags
func PostTag(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var tag types.Tag
		if err = tag.FromJSON(r.Body); err != nil {
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		var tagId int
		query := `INSERT INTO tags (author, name, profile_id, note_id) VALUES ($1, $2, $3, $4) RETURNING id`
		if err = env.DB.QueryRow(query, userId, tag.Name, tag.ProfileId, tag.NoteId).Scan(&tagId); err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
			return
		}

		fmt.Printf("Inserted a single record %v", tagId)

		resp := map[string]interface{}{
			"id":      tagId,
			"message": "Tag created successfully",
		}

		json.NewEncoder(w).Encode(resp)
	})
}

// Endpoint: /api/v1/users/:userId/tags/:tagId
func DeleteTag(env *config.Env) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Context-Type", "application/x-www-form-urlencoded")
		// TODO: Limit CORS access
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}
		tagId, err := strconv.Atoi(params["tagId"])
		if err != nil {
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		query := `DELETE FROM tags WHERE id=$1 AND author=$2`
		res, err := env.DB.Exec(query, tagId, userId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
		}

		rowsAffected, err := res.RowsAffected()
		if err != nil {
			log.Fatalf("Error while checking the affected rows. %v", err)
		}

		fmt.Printf("Total rows/record affected %v", rowsAffected)

		resp := map[string]interface{}{
			"id":      tagId,
			"message": fmt.Sprintf("Tag updated successfully. Total rows/record affected %v", rowsAffected),
		}

		json.NewEncoder(w).Encode(resp)
	})
}
