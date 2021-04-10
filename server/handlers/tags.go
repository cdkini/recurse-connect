package handlers

import (
	"encoding/json"
	"fmt"
	"github.com/cdkini/recurse-connect/server/config"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type Tag struct {
	Id        int    `json:"id"`
	Author    string `json:"author"`
	Name      string `json:"name"`
	ProfileId int    `json:"profileId"`
	NoteId    int    `json:"noteId"`
}

type Tags []*Tag

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

		var tags Tags

		for rows.Next() {
			var tag *Tag

			err = rows.Scan(&tag.Id, &tag.Author, &tag.Name, &tag.ProfileId, &tag.NoteId)
			if err != nil {
				log.Fatalf("Unable to scan the row. %v", err)
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

		var tag Tag
		err = json.NewDecoder(r.Body).Decode(&tag)
		if err != nil {
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		var tagId int
		query := `INSERT INTO tags (author, name, profile_id, note_id) VALUES ($1, $2, $3, $4) RETURNING id`
		err = env.DB.QueryRow(query, userId, tag.Name, tag.ProfileId, tag.NoteId).Scan(&tagId)
		if err != nil {
			log.Fatalf("Unable to execute the query: %v", err)
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
