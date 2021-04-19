package handlers

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/cdkini/recurse-connect/server/database"

	"github.com/gorilla/mux"
)

// Endpoint: /api/v1/users/:userId/tags
func GetTags(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var tags []*database.Tag
		err = db.ReadTags(userId, tags)
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Unable to extract tag data from database", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(tags)
	})
}

// Endpoint: /api/v1/users/:userId/tags
func PostTag(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "POST")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		var tag *database.Tag
		if err = db.ParseTag(r.Body, tag); err != nil {
			// TODO: Add logging
			http.Error(w, "Unable to parse JSON", http.StatusBadRequest)
			return
		}

		tagId, err := db.PostTag(userId, tag)
		if err != nil {
			// TODO: Add logging
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

// Endpoint: /api/v1/users/:userId/tags/:tagId
func DeleteTag(db database.DB, logger *log.Logger) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Methods", "DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		params := mux.Vars(r)
		userId, err := strconv.Atoi(params["userId"])
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}
		tagId, err := strconv.Atoi(params["tagId"])
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		err = db.DeleteTag(userId, tagId)
		if err != nil {
			// TODO: Add logging
			http.Error(w, "Improper id passed to endpoint", http.StatusBadRequest)
			return
		}

		resp := map[string]interface{}{
			"id":      tagId,
			"message": "Tag deleted successfully.",
		}

		json.NewEncoder(w).Encode(resp)
	})
}
