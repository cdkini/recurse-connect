package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/cdkini/recurse-connect/server/database"
	"github.com/cdkini/recurse-connect/server/models"

	"github.com/gorilla/mux"
)

// GET /api/v1/users/{userId}/tags
func GetTags(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var tags []*models.Tag
		err = db.ReadTags(userId, tags)
		if err != nil {
			logger.Printf("Ran into error while reading tags: %v\n", err)
			http.Error(w, "Unable to extract tag data from database", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(tags)
	})
}

// POST /api/v1/users/{userId}/tags
func PostTag(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var tag *models.Tag
		if err = db.ParseTag(r.Body, tag); err != nil {
			logger.Printf("Could not scan row into struct: %v\n", err)
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		tagId, err := db.PostTag(userId, tag)
		if err != nil {
			logger.Printf("Ran into error while posting tag to database: %v\n", err)
			http.Error(w, "Unable to post data to database", http.StatusInternalServerError)
			return
		}

		resp := map[string]interface{}{
			"id":      tagId,
			"message": "Tag created successfully.",
		}

		json.NewEncoder(w).Encode(resp)
	})
}

// DELETE /api/v1/users/{userId}/tags/{tagId}
func DeleteTag(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			logger.Printf("Could not parse userId: %v\n", err)
			http.Error(w, "Improper userId passed to endpoint", http.StatusBadRequest)
			return
		}
		tagId, err := strconv.Atoi(params["tagId"])
		if err != nil {
			logger.Printf("Could not parse tagId: %v\n", err)
			http.Error(w, "Improper tagId passed to endpoint", http.StatusBadRequest)
			return
		}

		err = db.DeleteTag(userId, tagId)
		if err != nil {
			logger.Printf("Ran into issue while deleting tag: %v\n", err)
			http.Error(w, "There was an issue with the database query", http.StatusInternalServerError)
			return
		}

		resp := map[string]interface{}{
			"id":      tagId,
			"message": "Tag deleted successfully.",
		}

		json.NewEncoder(w).Encode(resp)
	})
}
